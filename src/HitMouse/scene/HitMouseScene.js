var  HitMouseLayer = cc.Layer.extend({

    ctor:function(){
        this._super();

        var bgLayer =  new  HitMouseBgLayer();
        this.addChild(bgLayer);

        // Res_mouse

        var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setTitleFontSize(20);
        button.setPressedActionEnabled(true);
        button.setTitleText("Back");
        button.x = 50;
        button.y = GC.h-80;
        var self = this;
        button.addTouchEventListener(function(){
            cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));


        },this);
        this.addChild(button);
    }
});


var HitMouseScene  = cc.Scene.extend({
    onEnter:function () {

        this._super();
        var layer = new HitMouseLayer();
        this.addChild(layer);
    }
});