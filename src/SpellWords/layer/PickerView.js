var  PickerView = ccui.ScrollView.extend({

    ctor:function(){
        this._super();

    },
    onEnter:function(){
        this._super();
        var layer = new cc.LayerColor(cc.color.RED);
        layer.x = 0;
        layer.y = 0;
        layer.setAnchorPoint(0,0);
        layer.setContentSize(cc.size(100, 128*6));

        this.addChild(layer);
    },
});