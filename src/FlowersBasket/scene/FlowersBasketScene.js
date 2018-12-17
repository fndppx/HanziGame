var FlowersBasketLayer = cc.Layer.extend({

    _flowersBasketArray:null,
    _wordsArray:null,

    ctor:function() {
        this._super();
        var layer = new cc.LayerColor(cc.color.WHITE);
        layer.x = 0;
        layer.y = 0;
        layer.setAnchorPoint(0,0);
        this.addChild(layer);

        this._flowersBasketArray = ['篮子1','篮子2','篮子3'];

        var width = 80;
        var height = 26;
        var gapWidth = 50;
        // 80  26?
        for (var i = 0; i <this._flowersBasketArray.length ; i++){
            var word = this._flowersBasketArray[i];
            var basket = new FlowersBasketSprite(res.flower_basket,word);
            basket.setAnchorPoint(0,0);
            basket.x = gapWidth+(70+gapWidth)*i;
            basket.y = GC.h_2;
            this.addChild(basket,10);
        }

        this._wordsArray = ['语文课','数学课','历史课','我','今天'];
        var wordsGapWidth = 5;

        for (var i = 0; i <this._wordsArray.length ; i++){
            var word = this._wordsArray[i];
            var flowers = new FlowersSprite(res.train_carriage,word);
            flowers.setAnchorPoint(0,0);
            flowers.x = 50+wordsGapWidth+(70+wordsGapWidth)*i;
            flowers.y = 100;
            // flowers.setContentSize(50,28);
            this.addChild(flowers,20);
        }

    }
});

var FlowersBasketScene = cc.Scene.extend({

    onEnter:function () {

        this._super();
        var layer = new FlowersBasketLayer();
        this.addChild(layer);
    }
});