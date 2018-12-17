
_moveBlk:null;
var FlowersSprite = cc.Layer.extend({
    _rect:null,
    _beganPoint:null,
    _listener:null,
    _moveBlk:null,

    _type:-1,
    ctor:function(title){
        this._super();

        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);

        var label = new cc.LabelTTF(title,'Arial', 14);
        label.x = 25;
        label.y = 14;

        label.color = cc.color.BLACK;
        this.addChild(label,2);

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

    },

    removeListener:function(){

        cc.eventManager.removeListener(this._listener);

    },

    onEnter:function(){

        this._super();
        var layer = new cc.LayerColor(cc.color.GRAY);
        layer.x = 0;
        layer.y = 0;
        layer.setAnchorPoint(0,0);
        layer.setContentSize(this.getContentSize().width,this.getContentSize().height);
        this.addChild(layer,1);

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
        // cc.log('坐标',target.x,target.y);

        return true;
    },

    onTouchMoved : function (touch, event) {
        var target = event.getCurrentTarget();

        var pos = touch.getLocation();

        var delta = touch.getDelta();

        target.setPosition(cc.p(target.x+delta.x,target.y+delta.y));
        cc.log(pos);

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

