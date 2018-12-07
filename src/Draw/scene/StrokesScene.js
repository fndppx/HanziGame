var StrokesLayer = cc.Layer.extend({

    ctor:function(){
        this._super();
        seen
    }

});


var StrokesScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StrokesLayer();
        this.addChild(layer);

    }
});