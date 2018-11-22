var playLayer = cc.Layer.extend({
    bgSprite:null,
    SushiSprites:null,
    ctor:function(){
        this._super();

        var size = cc.winSize;

        this.SushiSprites = [];

        cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);


        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            //scale: 0.5,
            rotation: 180
        });
        this.addChild(this.bgSprite, 0);
        // this.addSushi();
        this.schedule(this.update,1,16*1024,1);
        return true;
    },

    addSushi : function() {

        // var sushi = new cc.Sprite(res.Sushi_png);

        var sushi = new SushiSprite("#sushi_1n.png");

        // sushi.addTouchEventListener();
        var size = cc.winSize;

        var x = sushi.width/2+size.width/2*cc.random0To1();
        sushi.attr({
            x: x,
            y:size.height - 30
        });


        this.SushiSprites.push(sushi);

        this.addChild(sushi,5);

        var dorpAction = cc.MoveTo.create(4, cc.p(sushi.x,50));
        sushi.runAction(dorpAction);
    },

    removeSushi : function() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.SushiSprites.length; i++) {
            cc.log("removeSushi.........",this.SushiSprites[i].y);
            if( 60 > this.SushiSprites[i].y) {
                cc.log("==============remove:"+i);
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i,1);
                i= i-1;
            }
        }
    },

    update : function() {
        this.addSushi();
        this.removeSushi();

    },
})



var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new playLayer();
        this.addChild(layer);
    }
});

