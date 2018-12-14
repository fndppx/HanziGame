var __count = 30;
var HitMouseBgLayer = cc.Layer.extend({

    _holeArray:[],
    _textArray:['春天','夏天','秋天','冬天','今天','明天','后天'],
    _textRightArray:['春天','夏天'],
    _hasHitedIndexArray:[],
    _hasHitedTextArray:[],
    _timerLabel:null,
    ctor : function(){

        this._super();

        this.initBackground();

        var draw =  new cc.DrawNode();
        this.addChild(draw,11);
        let witdh = 50;
        let gapWidth = 50;
        for (var i = 0; i < 9; i ++){
            var j = Math.floor(i/3);
            var k = i%3;
            // var mouse = new  MouseSprite(res.Res_mouse);
            // mouse.setAnchorPoint(0,0);

            var x = 100 + k * (witdh+gapWidth);
            var y = 20 + j * (witdh+gapWidth);
            // mouse.x = x;
            // mouse.y = y;

            // this.addChild(mouse);
            this._holeArray.push(cc.p(x,y));
            draw.drawRect(cc.p(x,y),cc.p(x+50,y+50),cc.color.RED);
        }
        cc.log(this._holeArray);

        var label = new cc.LabelTTF(__count, "STKaiti", 20);
        label.setAnchorPoint(1,1);
        label.x = this.width-50;
        label.y = this.height-50;
        label.color = cc.color.RED;
        this.addChild(label);
        this._timerLabel = label;

        var self = this;

        this.schedule(function(){

            self.createMouse();
        },2);

        this.schedule(function(){
            __count --;
            if (__count <=0 ){
                self.unscheduleAllCallbacks();
                var alert =  new HitMouseAlert();
                alert.createGameOver();
                alert.attr({
                    x: (GC.w-200)/2,
                    y: (GC.h-100)/2,
                });
                alert.setContentSize(200,100);

                self.addChild(alert,13);
                setTimeout(function(){
                    alert.removeFromParent();
                }, 5000);

            }
            label.setString(__count);
        },1);


    },

    createMouse:function(){
        var textIndex = Math.floor(Math.random()*this._textArray.length);

        var text = this._textArray[textIndex];

        var mouse = new  MouseSprite(res.Res_mouse,text);

        var index = Math.floor(Math.random()*9);
        mouse.setTag(index);

        var ishas = this._hasHitedIndexArray.indexOf(index);

        if (ishas!=-1){
            mouse.removeFromParent();
            this.createMouse();
            return;
        }

        this.setMouseInHole(mouse,index)

        this.addChild(mouse,10);

        mouse.create();

        this.addHitMouseListener(mouse);

    },

    setMouseInHole:function(mouseSprite,holeIndex){
        mouseSprite.setAnchorPoint(0,0);
        if (holeIndex > 8 || holeIndex < 0){
            return;
        }
        mouseSprite.setPosition(this._holeArray[holeIndex]);
        // switch (holeIndex){
        //
        //     case 1:
        //
        //         mouseSprite.setPosition(cc.p(1,1));
        //         break;
        //     case 2:
        //         mouseSprite.setPosition(cc.p(1,1));
        //         break;
        //     case 3:
        //         mouseSprite.setPosition(cc.p(1,1));
        //
        //         break;
        //     case 4:
        //         mouseSprite.setPosition(cc.p(1,1));
        //
        //         break;
        //     case 5:
        //         mouseSprite.setPosition(cc.p(1,1));
        //
        //         break;
        //     case 6:
        //         mouseSprite.setPosition(cc.p(1,1));
        //
        //         break;
        //     case 7:
        //         mouseSprite.setPosition(cc.p(1,1));
        //
        //         break;
        //     case 8:
        //         mouseSprite.setPosition(cc.p(1,1));
        //
        //         break;
        // }

    },

    initBackground : function(){
        this._sptBg = new cc.Sprite(res.Drw_png);
        this._sptBg.attr({
            x: GC.w_2,
            y: GC.h_2
        });
        this.addChild(this._sptBg);
    },

    addHitMouseListener:function(mouse){

        var self = this;
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {

                var target = event.getCurrentTarget();

                var rect = cc.rect(target.x,target.y,target.width,target.height);

                if (cc.rectContainsPoint(rect,touch.getLocation())){

                    var includes = self._textRightArray.indexOf(mouse.currentTitle());

                    // if (includes != -1){
                    //     mouse.removeFromParent();
                    //     this.createMouse();
                    //     return;
                    // }

                    if (includes != -1){
                        cc.log('打中了');
                        self._hasHitedIndexArray.push(mouse.getTag());
                        cc.log('mouse.currentTitle()',mouse.currentTitle(),this._textArray);

                        self._textArray.remove(mouse.currentTitle());

                        mouse.setInitPoistion();
                        // cc.log('tag=====',self._textArray[mouse.getTag()]);

                        var hasValue = false;
                        for (var i = 0;i<self._textArray.length;i++){
                            var a = self._textArray[i];
                            if (self._textRightArray.includes(a)){
                                hasValue = true;
                            }
                        }

                        if (!hasValue){
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

                            self.unscheduleAllCallbacks();
                        }


                    }else {
                        cc.log('打错了');
                        var alert =  new HitMouseAlert();
                        alert.createFaliedAlert();
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
                cc.log('onTouchBegan====');
                return true;
            },

            onTouchMoved: function (touch,event) {

                cc.log('onTouchMove====');

                return true;

            },

        });

        cc.eventManager.addListener(this.touchListener.clone(),mouse);

    },

    onEnd:function(){
        this._super();
        this.unscheduleAllCallbacks();


    }

});
