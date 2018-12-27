var FlowersBasketLayer = cc.Layer.extend({

    _flowersBasketArray:null,
    _wordsArray:null,
    _flowersBasketSpriteArray:null,
    _totalCount:0,


    _layout:null,
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

        this.layout = this.createLayout();

        var layoutRect = this.layout.getContentSize();
        this.layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.layout.setBackGroundColor(cc.color.RED);

        // var backgroundRect = background.getContentSize();
        this.layout.x = 100;
        this.layout.y = 100;
        this.addChild(this.layout);


        var text = new ccui.Text("ajkdaf", "Marker Felt", 20);
        // text.attr({
        //         //     string: "adkfha",
        //         //     font: "30px AmericanTypewriter",
        //         //     // x: this._widget.width / 2,
        //         //     // y: this._widget.height / 2 + text.height / 4
        //         // });
        text.setString("text11231");
        // text.setFontSize(30);
        this.layout.addChild(text);

        var text1 = new ccui.LabelTTF("ajkdaf", "Marker Felt", 20);
        text1.setString("text2");

        this.layout.addChild(text1);

        var lp1 = new ccui.LinearLayoutParameter();
        text.setLayoutParameter(lp1);
        lp1.setGravity(ccui.LinearLayoutParameter.LEFT);
        lp1.setMargin(new ccui.Margin(0, 10, 10, 10));


        var lp2 = new ccui.LinearLayoutParameter();
        text1.setLayoutParameter(lp2);
        lp2.setGravity(ccui.LinearLayoutParameter.LEFT);
        lp2.setMargin(new ccui.Margin(10, 10, 0, 10));





        return;
        // this._flowersBasketArray = ['科目','时间','人称'];

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
        for (var i = 0; i <this._wordsArray.length ; i++) {
            var wordDic = this._wordsArray[i];
            var word = wordDic['name'];
            var flowers = new FlowersSprite( word);
            flowers._type = wordDic['type'];
            flowers.setAnchorPoint(0, 0);
            flowers.x = 50 + wordsGapWidth + (70 + wordsGapWidth) * i;
            flowers.y = 100;
            flowers.setContentSize(50, 28);
            this.addChild(flowers, 20);

            // var s
            flowers.setMoveBlk(function (p) {
                cc.log('ppp',p);

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
        layout.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
        layout.setClippingEnabled(true);
        layout.setContentSize(cc.size(100, 150));
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

