
var DrawBgLayer = cc.Layer.extend({

    ctor : function(){

        this._super();

        this.initBackground();

        this.playMusic();

    },

    initBackground : function(){
        this._sptBg = new cc.Sprite(res.Drw_png);
        this._sptBg.attr({
            x: GC.w_2,
            y: GC.h_2
        });
        this.addChild(this._sptBg);
    },

    playMusic:function(){
        // cc.audioEngine.playMusic(res.Res_BgMusic_Mp3, true);
    },
});
