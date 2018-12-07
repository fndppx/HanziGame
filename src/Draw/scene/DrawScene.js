
var DrawLayer = cc.Layer.extend({
    _bgGroundLayer:null,
    _hanziSprite:null,

    ctor:function(){
        this._super();

        var size = cc.winSize;
        this.bgColor = cc.color.WHITE;

        // add bg
        this._bgGroundLayer = new DrawBgLayer();
        this.addChild(this._bgGroundLayer);

        this._hanziSprite = new wordSprite(res.Font_png);
        this._hanziSprite.attr({
            x :0,
            y: 0,
            anchorX:0,
            anchorY:0,
        });

        // var  size_hanzi = this._hanziSprite.getContentSize();
        // let  scaleX = 320/size_hanzi.height;
        // let  scaleY = 320/size_hanzi.height;

        // this._hanziSprite.setScale(scaleX,scaleY);

        this._hanziSprite.setColor(cc.color.WHITE);
        this.addChild(this._hanziSprite, 10);


        //文字

        // cc.loader.loadTxt("res.Font_png",function(err,data){
        //     if(err){
        //         return console.log("load failed");
        //     }
        //     else {
        //         cc.log("load success");
        //
        //     }
        // });
        // jsb.fileUtils.fullPathFromRelativeFile(res.Res_Trace);

        var startItem = new cc.MenuItemImage(
            res.Start_N_png,
            res.Start_S_png,
            function(){
                console.log("menu is clicked");

                this._hanziSprite.reset();


            },this);

        startItem.attr({
            x:size.width/2+100,
            y:size.height/2,
            scale:0.2,
            anchorX:0.5,
            anchorY:0.5
        });

        var  menu = new cc.Menu(startItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu,1);

        return true;
    },

})

var DrawScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new DrawLayer();
        this.addChild(layer);

    }
});