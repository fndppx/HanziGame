var StrokeMoveSprite = cc.Sprite.extend({
    _drawNode:null,
    callback:null,
    ctor:function (aTexture) {

        this._super(aTexture);
        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);
        this.scheduleUpdate();
    },

    //回调
    callbackBlk:function(callback){
        this.callback = callback;

    },

    update:function (dt) {

        var myRect = this.getRect();

        myRect.x += this.x;
        myRect.y += this.y;
        if (this.callback){
            this.callback(myRect);

        }

    },

    moveCallback:function(){
        this.update();
    },

    getRect:function () {
        return cc.rect(-this._rect.width / 2, -this._rect.height / 2, this._rect.width, this._rect.height);
    },
});