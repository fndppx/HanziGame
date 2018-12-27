var FlowersBasketLayer = cc.Layer.extend({

    _flowersBasketArray:null,
    _wordsArray:null,
    _flowersBasketSpriteArray:null,
    _totalCount:0,

    _layout:null,

    _contentArray:['语文课','历史','叽叽叽叽','测试时尚','测','吃的二二二二二二'],
    ctor:function() {
        this._super();
        var layer = new cc.LayerColor(cc.color(123,204,204,255));
        layer.x = 0;
        layer.y = 0;
        layer.setAnchorPoint(0,0);
        this.addChild(layer);

        var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setTitleFontSize(20);
        button.setPressedActionEnabled(true);
        button.setTitleText("Back");
        button.x = 50;
        button.y = GC.h-20;
        var self = this;
        button.addTouchEventListener(function(){
            cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));

        },this);
        this.addChild(button);

        // return;

        this._flowersBasketArray = [{'type':'0','name':'科目'},{'type':'1','name':'时间'},{'type':'2','name':'人称'}];

        this._flowersBasketSpriteArray = [];

        var width = 80;
        var height = 26;
        var gapWidth = 50;
        // 80  26?
        for (var i = 0; i <this._flowersBasketArray.length ; i++){
            var wordDic = this._flowersBasketArray[i];
            var word = wordDic['name'];
            var basket = new FlowersBasketSprite(res.flower_basket,word);
            basket._type = wordDic['type'];
            basket.setAnchorPoint(0,0);
            basket.x = gapWidth+(70+gapWidth)*i;
            basket.y = GC.h_2;
            this.addChild(basket,10);
            this._flowersBasketSpriteArray.push(basket);
        }

        // this._wordsArray = ['语文课','数学课','历史课','我','今天'];
        this._wordsArray = [{'type':'0','name':'语文课'},
            {'type':'0','name':'数学课'},
            {'type':'0','name':'历史课'},{'type':'2','name':'我'},
            {'type':'1','name':'今天'}];

        var wordsGapWidth = 5;
        this._totalCount = this._wordsArray.length;
        var self = this;

        this.layout = this.createLayout();
        var layoutRect = this.layout.getContentSize();
        this.layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.layout.setBackGroundColor(cc.color.RED);
        this.layout.x = GC.w_2-150;
        this.layout.y = 10;
        // this.addChild(this.layout);

        var rectX = 0;
        var rectY = this.layout.getContentSize().height-20;

        var gapX = 10;

        for (var i = 0; i <this._wordsArray.length ; i++) {
            var wordDic = this._wordsArray[i];
            var word = wordDic['name'];

            var flowers = new FlowersSprite( word);
            flowers._type = wordDic['type'];
            flowers.setAnchorPoint(0, 0);

            var height = flowers.getContentSize().height;

            flowers.x = rectX+gapX;
            flowers.y = rectY;

            if (rectX+gapX+flowers.getContentSize().width > this.layout.getContentSize().width){
                rectY -= height;
                flowers.x = gapX;
                flowers.y = rectY;
            }

            rectX += flowers.getContentSize().width+gapX;
            this.addChild(flowers,10);

            // var s
            flowers.setMoveBlk(function (p) {
                cc.log('ppp',p.x);
                // self.convertToWorldSpace(p);

               // var postion = p.getParent().convertToWorldSpace(p.getPosition());

                var rect = cc.rect(p.x,p.y,p.width,p.height);

                for (var j = 0;j<self._flowersBasketSpriteArray.length;j++){

                    var fSprite = self._flowersBasketSpriteArray[j];

                    var rect1 = cc.rect(fSprite.x,fSprite.y,fSprite.width,fSprite.height);

                    cc.log(rect,rect1);
                    var wordType = p._type;
                    var pType = fSprite._type;

                    var isEqual = wordType == pType;

                    cc.log('eauql>>>',wordType,pType);
                    if (cc.rectIntersectsRect(rect,rect1)&&isEqual == 1)
                    {
                        cc.log('重叠>>>>>>');

                        p.x = fSprite.x + (fSprite.width-p.width)/2;
                        p.y = fSprite.y+20;
                        p.removeListener();

                        self._totalCount --;


                        if (self._totalCount<=0){
                            var alert =  new HitMouseAlert();
                            alert.createSuccessAlert();
                            alert.attr({
                                x: (GC.w-200)/2,
                                y: (GC.h-100)/2,
                            });
                            alert.setContentSize(200,100);

                            self.addChild(alert,13);
                            setTimeout(function(){
                                alert.removeFromParent();
                            }, 1000);
                        }
                    }
                }
            });
        }
    },

    createLayout: function () {
        var layout = new ccui.Layout();
        layout.setContentSize(cc.size(300, 150));
        return layout;
    },
});

var FlowersBasketScene = cc.Scene.extend({

    onEnter:function () {

        this._super();
        var layer = new FlowersBasketLayer();
        this.addChild(layer);
    }
});

