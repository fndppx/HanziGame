var bihuaIndex = 0;
var jinglingIndex = 0;
var currentDrawDode = null;
var wordSprite = cc.Sprite.extend({
    moveSprites:null,
    middleP :0,
    radiusW :0,
    _startPoint:0,
    _initStatus:false,
    ctor : function(aTexture){
        this._super(aTexture);
        this.moveSprites = [];

        var drawNode =new cc.DrawNode();

        this.drawNode = drawNode;
        this.addChild(drawNode,0);
        this.setBihuaIndex(bihuaIndex);

    },

    onEnter:function () {
        this._super();
    },

    onEnterTransitionDidFinish:function(){
        this._super();

    },

    getRatio:function(){

        var size = cc.visibleRect;
        var max_size = Math.min(size.width,size.height);
        return max_size/800;
    },

    reset:function(){

        for (var i = 0;i<this.moveSprites.lenght;i++){
            let a = this.moveSprites[i];
            a.removeFromParent();

        }
        this.moveSprites.splice(0,this.moveSprites.length);

        this.removeAllChildrenWithCleanup(true);
        bihuaIndex = 0;
        this.setBihuaIndex(bihuaIndex);

    },

    setBihuaIndex:function(index){
        var traceArray = [["321,399;271,487;208,564;127,619"],["347,253;436,348;501,462;579,565;709,605"]];

        var finalPathArray = traceArray[index];

        var that = this;

        var dotArray = finalPathArray[0].split(";");

                for (var j = 0 ;j<dotArray.length;j++) {

                    var finalDotArray = dotArray[j].split(",");
                    var x = finalDotArray[0]*that.getRatio();
                    var y = this.height - finalDotArray[1]*that.getRatio();

                    var sushi = new MoveSprite(res.HelloWorld_png);

                    sushi.callbackBlk(function(currentP,startP){
                        var drawNode = new  cc.DrawNode();

                        that.addChild(drawNode,20);

                        var sprite1 = that.moveSprites[1];
                        var sprite = that.moveSprites[0];

                        var center = null;

                        let  lineWidth = 10;

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


})