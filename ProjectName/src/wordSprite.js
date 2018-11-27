var bihuaIndex = 0;
var jinglingIndex = 0;
var currentDrawDode = null;
var wordSprite = cc.Sprite.extend({
    moveSprites:null,
    middleP :0,
    radiusW :0,
    _startPoint:0,
    _initStatus:false,

    onEnter:function () {
        cc.log("onEnter");
        this._super();

        this.moveSprites = [];

        // this.addTouchEventListener();

        this.schedule(this.update,0.1,cc.REPEAT_FOREVER,1);
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        var drawNode =new cc.DrawNode();

        this.drawNode = drawNode;
        this.addChild(drawNode,0);
        this.setBihuaIndex(bihuaIndex);

        this.schedule(this.update,1,16*1024,1);

        cc.log("onEnterTransitionDidFinish",this.getContentSize());

    },

    getRatio:function(){

        var size = cc.visibleRect;
        var max_size = Math.min(size.width,size.height);
        return max_size/800;
    },

    reset:function(){
        // bihuaIndex = 0;
        // this.setBihuaIndex(bihuaIndex);
        // currentDrawDode.removeFromParent();
        // this.moveSprites = [];
        // this.removeAllChildrenWithCleanup();
        // bihuaIndex = 0;
        // this.setBihuaIndex(bihuaIndex);

        for (var i = 0;i<this.moveSprites.lenght;i++){
            let a = this.moveSprites[i];
            a.removeFromParent();

        }
        // sprite.removeFromParent();
        this.moveSprites.splice(0,this.moveSprites.length);
        // bihuaIndex++;
        // if (bihuaIndex>1){
        this.removeAllChildrenWithCleanup(true);
            bihuaIndex = 0;
        this.setBihuaIndex(bihuaIndex);

        // }
    },

    setBihuaIndex:function(index){
        var traceArray = [["321,399;271,487;208,564;127,619"],["347,253;436,348;501,462;579,565;709,605"]];

        // for (var i = )
        // for (var i = 0;i<traceArray.length;i++){
        var finalPathArray = traceArray[index];

        var that = this;

        var dotArray = finalPathArray[0].split(";");

                for (var j = 0 ;j<dotArray.length;j++) {

                    var finalDotArray = dotArray[j].split(",");
                    var x = finalDotArray[0]*0.5;
                    var y = this.height - finalDotArray[1]*0.5;

                    var sushi = new MoveSprite(res.HelloWorld_png);

                    sushi.callbackBlk(function(currentP,startP){
                        var drawNode = new  cc.DrawNode();

                        that.addChild(drawNode,20);
                        // if (that.moveSprites.length==0){
                        //     return;
                        // }

                        var sprite1 = that.moveSprites[1];
                        var sprite = that.moveSprites[0];

                        var center = null;

                        let  lineWidth = 10;

                        // cc.log(sprite.getPosition(),sprite1.getPosition());
                        // var point1 =  that.convertToNodeSpace(sprite1.getPosition());
                        // var point2 = that.convertToNodeSpace(sprite.getPosition());
                        var point1 =  sprite1.getPosition();
                        var point2 = sprite.getPosition();
                        cc.log("point1 point2>>>>>>",point1,point2);

                        //计算半径
                        function  s(obj1,obj2){
                            return Math.sqrt((obj1.x-obj2.x)*(obj1.x-obj2.x)+(obj1.y-obj2.y)*(obj1.y-obj2.y));
                        }

                        cc.log("半径",point2,that.middleP,s(point2,that.middleP));
                        if (s(point2,that.middleP)<=that.radiusW){
                            cc.log("在里边");


                            currentDrawDode.drawDot(cc.p(point2.x,point2.y),lineWidth,cc.color.WHITE);

                        }else {
                            cc.log("不在",that._startPoint);

                             if (that.radiusW == 0){
                                  return;
                             }

                            sprite.setPosition((that._startPoint));
                             // if (that.moveSprites.length>1){
                             //     cc.eventManager.removeAllListeners();
                            sprite.setEnableMoved(false);

                            sprite.setEnableMoved(true);

                             // }



                            currentDrawDode.clear();
                        }

                        if (that.moveSprites.length==0){
                            return;
                        }

                        if (sprite1==null||sprite1==null){return}
                        if (cc.rectContainsPoint(sprite.getBoundingBox(),sprite1.getPosition())){


                            cc.log("碰撞了");
                            cc.log("123321",sprite1.getPosition());
                            // sprite.setPosition(sprite1.getPosition());
                            sprite1.removeFromParent();

                            if (that.moveSprites.length==2){

                                for (var i = 0;i<that.moveSprites.lenght;i++){
                                    let a = that.moveSprites[i];
                                    a.removeFromParent();

                                }
                                sprite.removeFromParent();
                                that.moveSprites.splice(0,that.moveSprites.length);
                                bihuaIndex++;
                                if (bihuaIndex>1){
                                    // that.removeAllChildrenWithCleanup();
                                    // bihuaIndex = 0;
                                    // that.setBihuaIndex(bihuaIndex);

                                    return;
                                }
                                    that.setBihuaIndex(bihuaIndex);
                            }else {
                                that.moveSprites.splice(1,1);
                                that.resetStatus();
                            }

                        }

                    });

                    if (j==0){
                        sushi.setEnableMoved(true);
                        // this.moveSprites.push(sushi);
                    } else {
                        sushi.setEnableMoved(false);
                        // this.moveSprites.push(sushi);
                    }

                    sushi.attr({
                        x:parseFloat(x),
                        y:parseFloat(y),
                        anchorX:0.5,
                        anchorY:0.5,
                    });

                    // sushi.setTextureRect(cc.rect(0,0,40,40));

                    this.addChild(sushi,11);
                    this.moveSprites.push(sushi);


                    cc.log("111111",sushi.getPosition(),sushi.getBoundingBox());
                }

                that.resetStatus();
    },

    resetStatus:function(){

        var nextSprite = this.moveSprites[1];
        var topSprite = this.moveSprites[0];


        var center = null;

        let lineWidth = 20;
        // this.removeChild(currentDrawDode);
        var lastDrawNode = new cc.DrawNode();
        this.addChild(lastDrawNode);
        currentDrawDode = lastDrawNode;

        // var point1 =  this.convertToNodeSpace(nextSprite.getPosition());
        // var point2 = this.convertToNodeSpace(topSprite.getPosition());
        var point1 =  nextSprite.getPosition();
        var point2 = topSprite.getPosition();
        var pos = cc.p((point2.x-point1.x)*0.5+point1.x,(point2.y-point1.y)*0.5+point1.y);

        // currentDrawDode.drawDot(pos,10,cc.color.WHITE);
        //
        // currentDrawDode.drawDot(point2,10,cc.color.WHITE);

        //计算半径
        function  s(obj1,obj2){
            return Math.sqrt((obj1.x-obj2.x)*(obj1.x-obj2.x)+(obj1.y-obj2.y)*(obj1.y-obj2.y));
        }

            this.radiusW = s(pos,point1);


            this.middleP = cc.p((point2.x-point1.x)*0.5+point1.x,(point2.y-point1.y)*0.5+point1.y);

            cc.log("a==b111",this.radiusW,this.middleP);
            this._startPoint = point2;

            cc.log("开始===",point2);

    },
    onExit:function () {
        cc.log("onExit");

        this._super();
    },

    update:function(){
        //cc.log("update");
        return;
        // this.moveSprites.push(sushi);
        if (this.moveSprites.length==0){
            return;
        }
       var sprite = this.moveSprites[0];

       var sprite1 = this.moveSprites[1];

       if (sprite1==null||sprite==null){return}
        if (cc.rectIntersectsRect(sprite.getBoundingBox(),sprite1.getBoundingBox())){

            cc.log("碰撞了");

            sprite1.setEnableMoved(true);
            sprite.removeFromParent();
            this.moveSprites.shift();
            // jinglingIndex++;

        }

    },

    addTouchEventListener:function(){
        var  that = this;
        var lastPoint = null;
        // cc.log(this);
        var lineWidth = 10;

        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();


                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                //console.log("touch>>>>>>>",pos);
                // pos.y+=300;

                cc.log("wordSprite>>Touch>>>>target",cc.p(pos.x-that.y,pos.x-that.y));
                //that.drawNode.drawDot(cc.p(pos.x,pos.y),lineWidth,cc.color.WHITE);
                //lastPoint = pos;
                // console.log("touch+++++++",that.pointsInPolygon(that.getDots(),[pos.x,pos.y]));

                return true;
            },

            onTouchMoved: function (touch,event) {

                var pos = touch.getLocation();
                // pos.y+=300;

                //console.log("move>>>>>>>",pos);

                var lastPos = touch.getPreviousLocation();

                // cc.log("wordSprite>>moved",pos);

                cc.log("wordSprite>>moved>>>>target",cc.p(pos.x-that.y,pos.x-that.y));


                // console.log(this.drawNode.getPreviousLocation());
                //that.drawNode.drawSegment(cc.p(lastPos.x,lastPos.y),cc.p(pos.x,pos.y),lineWidth,cc.color.WHITE);
                // that.drawNode.contains
                // cc.log(pos);

                // console.log("move+++++++",that.pointsInPolygon(that.getDots(),[pos.x,pos.y]));


                return true;

            },

        });
        cc.eventManager.addListener(this.touchListener,this);

    },
    getRect:function () {
        return cc.rect(-this._rect.width / 2, -this._rect.height / 2, this._rect.width, this._rect.height);
    },


})