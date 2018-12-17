var FlowersBasketSprite = cc.Sprite.extend({
    _type:-1,
   ctor:function(img,title){
       this._super(img);

       var label = new cc.LabelTTF(title, 14);
       label.x = this.width/2;
       label.y = this.height/2;
       label.color = cc.color.BLACK;
       this.addChild(label,1);

   }
});

