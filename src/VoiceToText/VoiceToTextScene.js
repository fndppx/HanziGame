
var mLayer = null;
var VoiceToTextLayer = cc.Layer.extend({

    bgSprite:null,
    txt_info:null,
    txt_guide:null,
    ctor:function(){
      this._super();

      var size = GC.winSize;
        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            rotation:90,
        });

        this.addChild(this.bgSprite);

        this.txt_info = new cc.LabelTTF("Hello World", "Arial", 18);
        // position the label on the center of the screen
        this.txt_info.x = size.width / 2;
        // this.txt_info.y = size.height / 2 + 10;
        this.txt_info.y = 100;

        this.txt_info.setDimensions(cc.size(size.width,size.height));
        this.txt_info.setString(GameConstant.POEM);
        // add the label as a child to this layer
        this.addChild(this.txt_info, 5);
        //返回按钮
        var backButton = new cc.LabelTTF("back","Arial",18);
        backButton.x = 20;
        backButton.y = size.height/2;
        this.addChild(backButton,5);
        this.addTouchEventListenser(backButton,GameConstant.BACK_CODE);

        //“测试传参”按钮
        var btnRecord = new cc.Sprite(res.Record_icon);
        btnRecord.x = size.width / 2;
        btnRecord.y = size.height / 8 ;
        this.addChild(btnRecord, 5);
        this.addTouchEventListenser(btnRecord,GameConstant.OTHER_CODE);
        this.txt_guide = new cc.LabelTTF("小朋友，点这里开始朗读啦", "Arial",20);
        this.txt_guide.x = size.width / 2-this.txt_guide._getWidth()/2;
        this.txt_guide.y = size.height / 8 +this.txt_guide._getHeight()/2+this.txt_guide._getHeight()/2;
        this.addChild(this.txt_guide, 6);
    },
    voiceToText:function (){
        var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getScore","()Ljava/lang/String;");
        cc.log("---------------result = "+result);
        this.txt_info.setString(result);
        },
    button_clicked:function (sender,type){
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                //cc.log("btn_hello Touch Began");

                break;
            case ccui.Widget.TOUCH_MOVED:
                //cc.log("btn_hello Touch Moved");
                break;
            case ccui.Widget.TOUCH_ENDED:
                //cc.log("btn_hello Touch Ended");
                cc.log("TODO call java");
                this.txt_guide.setVisible(false);
                if (cc.sys.OS_IOS) {
                    var ret = jsb.reflection.callStaticMethod("JSBManager",
                        "voiceToText:",GameConstant.POEM);


                }  else  if(cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","startRecord","(Ljava/lang/String;)V",GameConstant.POEM);
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                //cc.log("btn_hello Touch Canceled");
                break;
            default:
                break;
        }

        },

    addTouchEventListenser:function(sender,type){
        var that = this;
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {

                    switch (type) {
                        case GameConstant.BACK_CODE:
                            cc.director.popScene();
                            break;
                        case GameConstant.OTHER_CODE:
                            that.txt_guide.setVisible(false);
                            // cc.view.enableRetina(sys.os === sys.OS_IOS ? true : false);

                            if (cc.sys.OS_IOS) {
                                var ret = jsb.reflection.callStaticMethod("JSBManager",
                                    "voiceToText:",GameConstant.POEM);
                            }  else  if(cc.sys.OS_ANDROID){
                                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","startRecord","(Ljava/lang/String;)V",GameConstant.POEM);

                            }
                            break;
                        default:
                            break;
                    }
                    cc.log("TODO call java");

                    return true;
                }
                return false;
            }});
            cc.eventManager.addListener(this.touchListener,sender);
    }
});


var VoiceToTextScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new VoiceToTextLayer();
        VoiceToTextScene.mlayer = layer;//保存到全局变量
        this.addChild(layer);
    }
});