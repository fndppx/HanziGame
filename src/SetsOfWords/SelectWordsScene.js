const alignWidth = 20;
var WordsScene = cc.Scene.extend({
    words:null,
    totalWidth:0,
    lineNum:1,
    timeout:30,
    timeoutLabel:null,
    selectedLabels:null,
    targetLabels:null,
    targetLabels2:null,
    onEnter:function () {
        this._super();
        var layer = new cc.Layer();
        this.addChild(layer);
        var size = cc.winSize;
        this.words=["飞扬跋扈","嚣张","趾高气昂","雷","蕾","擂","皆大欢喜","普天同庆","喜笑颜开","啊"];
        this.targetLabels=["飞扬跋扈","嚣张","趾高气昂"];
        this.targetLabels2=["雷","蕾","擂"];
        this.selectedLabels = [];
        this.lineNum = 1;
        this.totalWidth = 20;
        var bgSprite = new cc.Sprite(res.BackGround_png);
        bgSprite.attr({
            x:size.width/2,
            y:size.height/2,
            rotation:90,
        });
        layer.addChild(bgSprite,0);

//         返回按钮
        // Create the button
        var backButton = new ccui.Button();
        backButton.setNormalizedPosition(0.08, 0.95);
        backButton.setTitleText("BACK");
        cc.log("content size should be greater than 0:  width = %f, height = %f", backButton.width, backButton.height);
        backButton.setZoomScale(0.3);
        backButton.setScale(2.0,2.0);
        backButton.setContentSize(cc.size(40,20));
        backButton.setPressedActionEnabled(true);
        backButton.addClickEventListener(function () {
            cc.director.popScene();
        });
        layer.addChild(backButton,1);
        // Create the button
        var button = new ccui.Button(res.backtotopnormal,res.backtotoppressed);
        button.setNormalizedPosition(0.9, 0.1);

        button.setTitleText("提交");
        cc.log("content size should be greater than 0:  width = %f, height = %f", button.width, button.height);
        button.setZoomScale(0.3);
        button.setPressedActionEnabled(true);
        var that = this;
        button.addClickEventListener(function () {
            that.checkResult();
        });
        layer.addChild(button,2);
        //倒计时
        cc.director.getScheduler().schedule(this.timer,this,1,this.timeout,1,false,"timer");
        // timeout 60
        this.timeoutLabel = cc.LabelTTF.create("" + this.timeout+" 秒", "Arial", 30);
        this.timeoutLabel.x = size.width-60;
        this.timeoutLabel.y = size.height - 20;
        layer.addChild(this.timeoutLabel,0);

        for (var i=0;i<this.words.length;i++){
            var checkBox = new CustomCheckBox(this.words[i],"Arial",16);
            checkBox.setTouchEnabled(true);
            checkBox.loadTextures(res.backtotopnormal,res.backtotopnormal,res.backtotoppressed,res.backtotoppressed,res.backtotoppressed);

            checkBox.addEventListener(this.selectedStateEvent, this);

            if ((this.totalWidth+checkBox.width) >= GC.w) {
                this.totalWidth = 20;
                this.lineNum++;
            }
            checkBox.attr({
                x:this.totalWidth+checkBox.width/2,
                y:size.height-this.lineNum*alignWidth*3
            });
            layer.addChild(checkBox,1);
            this.totalWidth = this.totalWidth+checkBox.width+alignWidth;
        }
    },
    timer : function() {

        if (this.timeout == 0) {
            //cc.log('游戏结束');
            var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("Game Over", "Arial", 38);
            titleLabel.attr({
                x:size.width / 2 ,
                y:size.height / 2
            });
            gameOver.addChild(titleLabel, 5);
            var TryAgainItem = new cc.MenuItemFont(
                "Try Again",
                function () {
                    cc.log("----Try Again Menu is clicked!----");
                    var transition=new cc.TransitionFade(1, new WordsScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
            TryAgainItem.attr({
                x: size.width/2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cc.Menu(TryAgainItem);
            menu.x = 0;
            menu.y = 0;
            gameOver.addChild(menu, 1);
            this.addChild(gameOver);

            this.unschedule(this.update);
            this.unschedule(this.timer);
            return;
        }
        this.timeout -=1;
        this.timeoutLabel.setString("" + this.timeout+" 秒");
    },
    selectedStateEvent: function (sender, type) {
        var targetString = sender.getTextString();
        switch (type) {
            case  ccui.CheckBox.EVENT_UNSELECTED:
                this.removeByValue(this.selectedLabels,targetString);
                break;
            case ccui.CheckBox.EVENT_SELECTED:
                this.selectedLabels.push(targetString);
                break;
            default:
                break;
        }
    },
    checkResult:function(){
        if (this.selectedLabels.length<=0){
            return;
        }

        if (this.selectedLabels.sort().toString()==this.targetLabels.sort().toString()||this.targetLabels2.sort().toString()==this.selectedLabels.sort().toString()) {
            //cc.log('游戏胜利');
            var gameSuccess = new cc.LayerColor(cc.color(225,225,225,100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("宝贝好棒哦！", "Arial", 38);
            titleLabel.attr({
                x:size.width / 2 ,
                y:size.height / 2
            });
            gameSuccess.addChild(titleLabel, 5);
            var NextItem = new cc.MenuItemFont(
                "Next one",
                function () {
                    cc.log("----Try Again Menu is clicked!----");
                    // var transition=new cc.TransitionFade(1, new WordsScene(),cc.color(255,255,255,255));
                    // cc.director.pushScene( transition);
                    cc.director.popScene();
                }, this);
            NextItem.attr({
                x: size.width/2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cc.Menu(NextItem);
            menu.x = 0;
            menu.y = 0;
            gameSuccess.addChild(menu, 1);
            this.addChild(gameSuccess);

            this.unschedule(this.update);
            this.unschedule(this.timer);
        }
    },
     removeByValue:function(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
    }
});