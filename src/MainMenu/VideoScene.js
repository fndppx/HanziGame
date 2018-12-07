

var VideoLayer = cc.Layer.extend({
    ctor : function(){

        this._super();
        // "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
        // add bg
        var bgLayer = new DrawBgLayer();
        this.addChild(bgLayer);

        var player = new ccui.VideoPlayer()

        player.setContentSize(GC.winSize.width, GC.winSize.height);
        player.setPosition(GC.w_2, GC.h_2)
        player.setAnchorPoint(0.5,0.5);
        this.addChild(player)

        player.setURL("http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4")

        player.play();
        player.setColor(cc.color.RED)


     },

 });




var VideoScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new VideoLayer();
        this.addChild(layer);

    }
});



