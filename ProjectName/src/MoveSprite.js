var MoveSprite = cc.Sprite.extend({
    _rect : null,
    _enableMoved:true,
    callback:null,
    posCallback:null,
    that:null,
    _startPoint:null,
    drawNode:null,
    _lastPoint:null,
    lineWidth:10,
    _isntersection:false,
    _listener:null,
    _enableTouch:false,
    ctor : function(aTexture){
        this._super(aTexture);

        var drawNode =new cc.DrawNode();
        this.drawNode = drawNode;
        this.addChild(drawNode,10);
        that = this;

    },
//回调
    callbackBlk:function(callback){
        this.callback = callback;

    },

    callbackSetPositionBlk:function(posCallback){
        this.posCallback = posCallback;

    },

    setEnableMoved:function(b){
      if (b == true){
         this. _enableTouch = true;
         if (!this._listener) {
             // 事件穿透
             this._listener =  cc.eventManager.addListener({
                 event: cc.EventListener.TOUCH_ONE_BY_ONE,
                 swallowTouches: true,
                 onTouchBegan: this.onTouchBegan,
                 onTouchMoved: this.onTouchMoved,
                 onTouchEnded: this.onTouchEnded,
                 onTouchCancelled : this.onTouchCancelled
             }, this);
         }



      }   else {
          this._enableTouch = false;

          cc.eventManager.removeListener(this._listener);
          this._listener = null;

      }
    },

    onTouchBegan : function (touch, event) {
        // return;
        this. _enableTouch = true;

        var target = event.getCurrentTarget();
        cc.log("touch.getLocation()",touch.getLocation());
        if (!target.isTouchInRect(touch)){
            return false
        }

        var pos = touch.getLocation();

        //记录点
        _startPoint = pos;

        cc.log("122222222",_startPoint,that.convertToNodeSpace(_startPoint));
        // that.callback(that.convertToNodeSpace(touch.getLocation()),that.convertToNodeSpace(_startPoint));
        that.callback(touch.getLocation(),_startPoint);

        // that.drawNode.drawDot(_startPoint,that.lineWidth,cc.color.WHITE);

        return true;
    },

    onTouchMoved : function (touch, event) {
        if (!this._enableTouch){
            // return;
        }
        // return;
        var target = event.getCurrentTarget();

        // that.callback(touch.getLocation(),_startPoint);

        var pos = touch.getLocation();
        // pos = that.convertToNodeSpace(pos);


        var lastPos = touch.getPreviousLocation();
        // lastPos = that.convertToNodeSpace(lastPos);
        cc.log(that.drawNode);
        // target.setPosition(pos);
        // that.posCallback(that.convertToNodeSpace(pos));

        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        // 移动当前按钮精灵的坐标位置
        // target.x += delta.x;
        // target.y += delta.y;

        var target = event.getCurrentTarget();
        cc.log("touch.getLocation()",touch.getLocation());

        target.setPosition(cc.p(target.x+delta.x,target.y+delta.y));

        that.callback(pos,_startPoint);

        // that.drawNode.drawSegment(cc.p(lastPos.x,lastPos.y),cc.p(pos.x,pos.y),that.lineWidth,cc.color.WHITE);
    },

    drawNodeClear:function(){
        that.drawNode.clear();
        cc.log("aaaaasadasdasda",this.drawNode);
        //that.setPosition(_startPoint);
    },

    onTouchEnded : function (touch, event) {
        var target = event.getCurrentTarget();
        _startPoint = null;
        // that.callback(touch.getLocation(),_startPoint);
    },

    onTouchCancelled : function (touch, event) {
        var target = event.getCurrentTarget();
        _startPoint = null;
        // that.callback(touch.getLocation(),_startPoint);

    },

    isTouchInRect:function (touch) {
        var getPoint = touch.getLocation();
        // cc.log("this_x",this.convertToWorldSpace(cc.log(this.x,this.y)));
        var myRect = (cc.p(this.x*320/400,this.y*320/400));

        // cc.log("isTouchInRect>>>>>point==rect",gpetPoint,myRect,this.x);

        // var point_t = cc.p(this.x,this.y);

        // cc.log(">>>>>>>===============",getPoint,myRect);
        // myRect.x += this.x;
        // myRect.y += this.y;
        // myRect.x += this.x -10 ;
        // myRect.y += this.y -10;
        myRect = cc.rect(myRect.x-10,myRect.y-10,this.getContentSize().width,this.getContentSize().height);
        // myRect = cc.Recty
        cc.log("有没有", cc.rectContainsPoint(myRect, getPoint),myRect,getPoint);


        return cc.rectContainsPoint(myRect, getPoint);
    },

    // getRect:function () {
    //     return cc.rect(this._rect.width / 2, this._rect.height / 2, this._rect.width, this._rect.height);
    // },
})
