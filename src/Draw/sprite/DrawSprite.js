var DrawSprite = cc.DrawNode.extend({

    disappearAction:null,//消失动画

    onEnter:function () {
        cc.log("onEnter");
        this._super();


        this.addTouchEventListener();


    },

    onExit:function () {
        cc.log("onExit");
        this._super();
    },


    addTouchEventListener:function(){
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
                    cc.log("touched")
                    
                    return true;
                }

                return false;
            },

            onTouchMoved:function(touch,event){
                cc.log("move")
                var pos = touch.getLocation();

                // this.drawp
                var  drawNode = new cc.DrawNode();
                cc.addChild(drawNode,10);
                // drawNode.st.width(1);
                // drawNode.color(r=255,g=255,b=255);
                // drawNode.drawSegment(cc.p(pos.x,pos.y), cc.p(-60,pos.y),2);
                var red = cc.Color(255, 255, 255, 1);
                // drawNode.drawLine(pos.x,pos.y,red);
// drawNode.drawLine();
                drawNode.drawDot(cc.p(pos.x, pos.y), 40, cc.color(255, 255, 255, 128));

            },


        });

        cc.eventManager.addListener(listener1,this);


    },


});



