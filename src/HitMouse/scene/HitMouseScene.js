var  HitMouseLayer = cc.Layer.extend({

    ctor:function(){
        this._super();

        var bgLayer =  new  HitMouseBgLayer();
        this.addChild(bgLayer);

        // Res_mouse


    }
});


var HitMouseScene  = cc.Scene.extend({
    onEnter:function () {

        this._super();
        var layer = new HitMouseLayer();
        this.addChild(layer);
    }
});