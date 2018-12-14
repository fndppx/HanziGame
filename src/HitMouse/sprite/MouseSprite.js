var  MouseSprite = cc.Sprite.extend({

    _title:null,
    _seq:null,
    _initPoint:0,
    ctor:function(img,title){
        this._super(img);
        var label = new cc.LabelTTF(title, "STKaiti", 20);
        label.x = this.width/2;
        label.y = this.height;
        label.color = cc.color.RED;
        this.addChild(label);
        this._title = title;


    },

    currentTitle:function(){
        return this._title;
    },

    setInitPoistion:function(){
        this.stopAction(this._seq);

        cc.log('坐标',this.x,this.y);
        this.setPosition(cc.p( this._initPoint.x,  this._initPoint.y+this.getContentSize().height-10));
    },

    onEnter:function(){
      this._super();
      this._initPoint = cc.p(this.x,this.y);

    },

    create:function(){
        var self = this;
        var moveUp = cc.moveBy(1, cc.p(0, self.getContentSize().height-10));

        var easeMoveUp =  moveUp.easing(cc.easeInOut(3))

        var easeMoveDown = easeMoveUp.reverse();
        // var laugh = self.createAnimation('mole_laugh', [1,2,3]);

        //向上移动的回调
        var moveUpCallback = cc.callFunc(function () {
            // mouse.setTag(1); //刚刚冒出来的时候可以敲地鼠
            // self.removeFromParent()
        }, this);

        var  moveDownCallback = cc.callFunc(function () {
            // mouse.setTag(0); //笑完了之后开始下落了不能敲
            self.removeFromParent()

        }, this);

        this._seq = cc.sequence(easeMoveUp,moveUpCallback,easeMoveDown,moveDownCallback);

        self.runAction(this._seq);
    },

});


