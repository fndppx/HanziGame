var BackColorLabelText = cc.LabelTTF.extend({

    // var p1 = cc.p(-160, -220);
ctor:function (text, fontName, fontSize) {
    this._super(text, fontName, fontSize);
    // this.setContentSize(180,240);
    // var p2 = cc.p(200, 260);
        // var Rect = new cc.DrawNode();
        // Rect.drawRect(p1, p2, cc.color.BLUE, 1, cc.color.BLACK);
        // this.addChild(Rect,-1);
        // this.setString(text);
        // this.setColor(cc.color.WHITE);
        // var label = new cc.LabelTTF(text,fontName,fontSize);
        // label.attr({
        //     x:this.width/2,
        //     y:this.height/2,
        // });
        // this.addChild(label,1);
        var imgSprite = new cc.Sprite(res.Card_show);

        imgSprite.attr({
            // width:180,
            // height:240,
            scale:1.0,
        });

        this.addChild(imgSprite,-1)
        },
});