var MoveSprite = cc.Sprite.extend({
    _rect : null,
    _enableMoved:true,
    _callback:null,
    _posCallback:null,
    that:null,
    _startPoint:null,
    _drawNode:null,
    _lastPoint:null,
    _isntersection:false,
    _listener:null,
    _enableTouch:false,
    ctor : function(aTexture){
        this._super(aTexture);
        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);

        var drawNode =new cc.DrawNode();
        this._drawNode = drawNode;
        this.addChild(drawNode,10);
        that = this;

    },
    //回调
    callbackBlk:function(callback){
        this._callback = callback;

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
        this. _enableTouch = true;

        var target = event.getCurrentTarget();
        if (!target.isTouchInRect(touch)){
            return false
        }

        var pos = touch.getLocation();

        //记录点
        _startPoint = pos;

        that._callback(touch.getLocation(),_startPoint);

        return true;
    },

    onTouchMoved : function (touch, event) {

        var target = event.getCurrentTarget();

        var pos = touch.getLocation();

        var lastPos = touch.getPreviousLocation();
        cc.log(that._drawNode);

        var target = event.getCurrentTarget();
        var delta = touch.getDelta();

        var target = event.getCurrentTarget();
        cc.log("touch.getLocation()",touch.getLocation());

        target.setPosition(cc.p(target.x+delta.x,target.y+delta.y));

        that._callback(pos,_startPoint);
        },

    drawNodeClear:function(){
        that._drawNode.clear();
        //that.setPosition(_startPoint);
    },

    onTouchEnded : function (touch, event) {
        var target = event.getCurrentTarget();
        _startPoint = null;
    },

    onTouchCancelled : function (touch, event) {
        var target = event.getCurrentTarget();
        _startPoint = null;

    },

    isTouchInRect:function (touch) {
        var getPoint = touch.getLocation();

        var myRect = this.getRect();

        myRect.x += this.x;
        myRect.y += this.y;

        return cc.rectContainsPoint(myRect, getPoint);
    },

    getRect:function () {
        return cc.rect(-this._rect.width / 2, -this._rect.height / 2, this._rect.width, this._rect.height);
    },
})
