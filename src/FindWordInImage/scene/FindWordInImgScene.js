var FindWordImgLayer = cc.LayerColor.extend({

    _drawNode:null,
    _bgImageView:null,
    _pointsArray:[[230,178],[230,109]],

    ctor:function(){
        this._super(cc.color.GRAY);

        this._pointsArray=[[230,178],[230,109]];

        this._bgImageView = new cc.Sprite(res.findImgBg);
        this._bgImageView.x = GC.w_2;
        this._bgImageView.y = GC.h_2;
        this._bgImageView.setAnchorPoint(0.5,0.5);
        this.addChild(this._bgImageView);

        this._drawNode = new cc.DrawNode();
        this.addChild(this._drawNode,5);

        var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setTitleFontSize(20);
        button.setPressedActionEnabled(true);
        button.setTitleText("Back");
        button.x = 50;
        button.y = GC.h-20;
        var self = this;
        button.addTouchEventListener(function(){
            // cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));
            // if (cc.director.isPaused()) {
            // }
            // cc.director.popScene(new cc.TransitionFade(0.3, new MainMenuScene()));

            cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));

        },this);
        this.addChild(button,10);

        var self = this;

        //第一种 有时候获取this不对
        //  this._listener =  cc.eventManager.addListener({
        //             event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //             swallowTouches: true,
        //             onTouchBegan: this.onTouchBegan,
        //             onTouchMoved: this.onTouchMoved,
        //             onTouchEnded: this.onTouchEnded,
        //             onTouchCancelled : this.onTouchCancelled
        //         }, this);

        //第二种
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {

                if (self._pointsArray.length == 0)return;

                //计算半径
                function  getRadius(obj1,obj2){
                    return Math.sqrt((obj1.x-obj2.x)*(obj1.x-obj2.x)+(obj1.y-obj2.y)*(obj1.y-obj2.y));
                }

                var target = event.getCurrentTarget();
                var pos = touch.getLocation();

                var rect = cc.rect(target.x,target.y,target.width,target.height);
                // cc.log('坐标',pos.x,pos.y,self._bgImageView.x,self._bgImageView.y);
                // self._drawNode.drawCircle(cc.p(pos.x,pos.y),20, 0, 50, false, 2, cc.color.RED);

                // var p1 = cc.p(self.getRealPosition(230,109));
                //37 70 83 160 230 109
                // self._pointsArray

                //触摸转换点
                var p2 = cc.p(self.getBgRect(pos.x,pos.y).x,self.getBgRect(pos.x,pos.y).y);

                for (var i = 0;i < self._pointsArray.length; i++){
                    var point = self._pointsArray[i];
                    var p1 = cc.p(point[0],point[1]);

                    // cc.log('坐标',pos.x,pos.y,p1.x,p1.y,p2.x,p2.y);

                    if (getRadius(p1,p2)<=20){
                        //在里边
                        self._drawNode.drawCircle(self.getRealPosition(p1.x,p1.y),20, 0, 50, false, 2, cc.color.RED);

                        self._pointsArray.remove(point);

                        cc.log('在里边',self._pointsArray);
                    } else {
                        cc.log('不在里边');

                    }

                }

                if (self._pointsArray.length == 0){
                    cc.log('找到答案');
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

                cc.log('onTouchBegan====');
                return true;
            },

            onTouchMoved: function (touch,event) {

                cc.log('onTouchMove====');

                return true;

            },

        });

        cc.eventManager.addListener(this.touchListener.clone(),this._bgImageView);

    },



    onEnter:function(){
     this._super();
        // 109+this._bgImageView.y-this.getContentSize().height/2)
        // this._drawNode.drawCircle(this.getRealPosition(230,109),20, 0, 50, false, 2, cc.color.RED);
    },

    onExit:function () {
        this._super();
        cc.log("A-onExit");
        // cc.director.popScene();

    },

    //ui坐标系坐标
    getRealPosition:function(x,y){
        return cc.p(x+this._bgImageView.x-this._bgImageView.getContentSize().width/2,this._bgImageView.y-this._bgImageView.getContentSize().height/2+this._bgImageView.getContentSize().height-y);
    },


    getBgRect:function(x,y){
        // this._bgImageView.getBoundingBox()

        // cc.log('>>>>>>', x-this._bgImageView.getBoundingBox().x,this._bgImageView.getContentSize().height-y-this._bgImageView.getBoundingBox().y);
       return cc.p( x-this._bgImageView.getBoundingBox().x,this._bgImageView.getContentSize().height-(y-this._bgImageView.getBoundingBox().y));
    },
    //230,109

    onTouchBegan : function (touch, event) {
        var target = event.getCurrentTarget();
        var pos = touch.getLocation();


        // if (!target.isTouchInRect(touch)){
        //     return false
        // }
        // this._beganPoint = cc.p(target.x,target.y);
        // if (this._bgImageView == undefined){
        //     // cc.log('坐标',pos.x,pos.y,this._bgImageView.x,this._bgImageView.y);
        //     cc.log(this);
        //
        // }

        return true;
    },

    onTouchMoved : function (touch, event) {
        var target = event.getCurrentTarget();

        var pos = touch.getLocation();

        var delta = touch.getDelta();



    },
    onTouchEnded : function (touch, event) {
        var target = event.getCurrentTarget();

        cc.log('onTouchEnded');


    },
    onTouchCancelled : function (touch, event) {
        var target = event.getCurrentTarget();
        cc.log('onTouchCancelled');

    },
});

var FindWordImgScene = cc.Scene.extend({

    onEnter:function () {

        this._super();
        var layer = new FindWordImgLayer();
        this.addChild(layer);
    }
});