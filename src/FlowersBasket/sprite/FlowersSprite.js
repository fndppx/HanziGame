
_moveBlk:null;
var FlowersSprite = cc.LayerColor.extend({
    _rect:null,
    _beganPoint:null,
    _listener:null,
    _moveBlk:null,

    _type:-1,
    ctor:function(title){
        // this._super(cc.color.GRAY);
        this._super();

        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);
        var label = new ccui.Text(title, "Marker Felt", 20);
        label.setAnchorPoint(0,0);
        // label.setColor(cc.color(1,1,1))
        label.x = 0;
        label.y = 0;

        label.color = cc.color.BLACK;
        this.addChild(label,3);

        this.width = label.getContentSize().width;
        this.height = label.getContentSize().height;

        var bg = new ccui.Button();
        bg.loadTextures(res.button_bg, "", "");
        bg.setTouchEnabled(false);
        bg.setAnchorPoint(0,0);
        bg.setScale9Enabled(true);
        this.addChild(bg,2);
        bg.x = 0;
        bg.y = 0;

        bg.setContentSize(this.width,this.height);

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
        // var layer = new cc.LayerColor(cc.color.GRAY);
        // layer.x = 0;
        // layer.y = 0;
        // layer.setAnchorPoint(0,0);
        // layer.setContentSize(this.getContentSize().width,this.getContentSize().height);
        // this.addChild(layer,1);

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

