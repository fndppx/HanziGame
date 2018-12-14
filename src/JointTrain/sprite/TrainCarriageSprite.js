_moveBlk:null;


var  TrainCarriageSprite = cc.Sprite.extend({
    _rect : null,
    _title:null,
    _beganPoint:null,
    _listener:null,
    ctor:function(img,title){
        this._super(img);

        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);

        var label = new cc.LabelTTF(title, 14);
        label.x = this.width/2;
        label.y = this.height/2;
        label.color = cc.color.BLACK;
        this.addChild(label);
        this._title = title;

      this._listener =  cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled : this.onTouchCancelled
        }, this);
    },

    setMoveBlk:function(callback){
      _moveBlk = callback;
      cc.log(_moveBlk);

    },

    removeListener:function(){

        cc.eventManager.removeListener(this._listener);

    },


    currentTitle:function(){
        return this._title;
    },

    onEnter:function(){
        this._super();

    },

    isTouchInRect:function (touch) {
        var getPoint = touch.getLocation();
        var myRect = this.getRect();

        myRect.x += this.x;
        myRect.y += this.y;
        return cc.rectContainsPoint(myRect, getPoint);
    },

    getRect:function () {
        return cc.rect(0,0, this._rect.width, this._rect.height);
    },

    onTouchBegan : function (touch, event) {
        var target = event.getCurrentTarget();

        if (!target.isTouchInRect(touch)){
            return false
        }
        this._beganPoint = cc.p(target.x,target.y);
        cc.log('坐标',target.x,target.y);

        return true;
    },

    onTouchMoved : function (touch, event) {
        var target = event.getCurrentTarget();

        var pos = touch.getLocation();

        var delta = touch.getDelta();

        target.setPosition(cc.p(target.x+delta.x,target.y+delta.y));
        // cc.log(pos);

        if (_moveBlk){
            cc.log(target.x,target.y);

            _moveBlk(target);
        }

    },
    onTouchEnded : function (touch, event) {
        var target = event.getCurrentTarget();

        cc.log('onTouchEnded');

        target.setPosition(this._beganPoint);


    },
    onTouchCancelled : function (touch, event) {
        var target = event.getCurrentTarget();
        cc.log('onTouchCancelled');

    },

});

