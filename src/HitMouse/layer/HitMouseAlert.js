
var HitMouseAlert = cc.LayerColor.extend({

    ctor : function(isSuccess){

        this._super(cc.color.WHITE);

    },

    createSuccessAlert:function(){
        var label = new cc.LabelTTF('做的真棒!', 30);
        label.x = 100;
        label.y = 50;
        label.color = cc.color.RED;
        this.addChild(label);

    },

    createFaliedAlert:function(){
        var label = new cc.LabelTTF('打错了!', 30);
        label.x = 100;
        label.y = 50;
        label.color = cc.color.RED;
        this.addChild(label);

    },

    createGameOver:function(){
        var label = new cc.LabelTTF('游戏结束!', 30);
        label.x = 100;
        label.y = 50;
        label.color = cc.color.RED;
        this.addChild(label);

    },



});
