var CustomCheckBox = ccui.CheckBox.extend({

    label:null,
    ctor:function (text,fontName,fontSize,color) {
        this._super();
        this.label = new cc.LabelTTF(text,fontName,fontSize);

    },
    onEnter:function () {
        this._super();
        this.setContentSize(cc.size(100,30));
        this.label.attr({
            x:this.width/2,
            y:this.height/2,
        });
        this.addChild(this.label,1);
    },
    getTextString:function () {
        return this.label.getString();
    }
});