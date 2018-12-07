
var MainMenuLayer = cc.Layer.extend({


    _backgroundLayer : null,
    _touchLayer      : null,
    ctor : function(){

        this._super();

        // add bg
        var bgLayer = new DrawBgLayer();
        this.addChild(bgLayer);


        var size = GC.winSize;

        var item1 = new cc.MenuItemFont("写字", this.menuItem1Callback, this);

        var item2 = new cc.MenuItemFont("语音评测", this.menuItem2Callback, this);

        var item3 = new cc.MenuItemFont("笔顺", this.menuItem2Callback, this);

        var  mn = new cc.Menu(item1, item2,item3);
        mn.alignItemsVerticallyWithPadding(10);
        this.addChild(mn);


    },


    menuItem1Callback:function (sender) {
        cc.log("Touch Start Menu Item " + sender);

        cc.director.runScene(new cc.TransitionFade(0.3, new WriteHanziScene()));

    },

    menuItem2Callback:function (sender) {
        cc.log("Touch Help Menu Item " + sender);
        var ret = jsb.reflection.callStaticMethod("JSBManager",
            "gotoXunFeiISE");
    },
});


var MainMenuScene  = cc.Scene.extend({
    onEnter:function () {

        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});