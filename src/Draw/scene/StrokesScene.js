var StrokesLayer = cc.Layer.extend({

});


var StrokesScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StrokesLayer();
        this.addChild(layer);

    }
});