
var TurnCardLayer = cc.Layer.extend({

    cardBackList:null,
    cardShowList:null,
    bgSprite:null,
    selectedIndex:0,
    wordList:null,
    selectedItem:null,
    openNumber:0,
    showActon:null,
    backAction:null,
    backTarget:null,
    showTarget:null,
    backTarget2:null,
    showTarget2:null,
    isAnimationFinish:true,
    ctor:function(){
        this._super();
        var size = cc.winSize;
        this.cardBackList = [];
        this.cardShowList = [];
        this.wordList = ["我","你","他","我","你","他"];
        this.wordList = this.shuffleArray(this.wordList);
        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            rotation:270,
        });
        this.addChild(this.bgSprite,0);

//         返回按钮
        var backButton = new cc.LabelTTF("back","Arial",18);
        backButton.x = 20;
        backButton.y = size.height/2;
        this.addChild(backButton,5);
        this.addCardTouchEventListener(backButton,GameConstant.BACK_CODE);

        for (var i = 0; i < 6; i++) {
            var backCard = new cc.Sprite(res.Card_back);
            var showCard = new BackColorLabelText(this.wordList[i],"Arial",28);
            backCard.attr({
                x:size.width/5*((i>=3?i-3:i)+1),
                y:size.height*0.7-140*(i/3>=1?1:0),
                scale:0.5,
            });
            showCard.attr({
                x:size.width/5*((i>=3?i-3:i)+1),
                y:size.height*0.7-140*(i/3>=1?1:0),
                scale:0.5,
                rotationY:270,
                // width:backCard.width,
                // height:backCard.height,
            });

            this.addChild(showCard,1);
            this.addChild(backCard,1);
            this.cardBackList.push(backCard);
            this.cardShowList.push(showCard);
            this.addCardTouchEventListener(backCard,GameConstant.OTHER_CODE);
        }
    },
    shuffleArray:function(arr){
        var length = arr.length,
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    },
    addCardTouchEventListener:function(sender,type){
        var that = this;
        var touchListener = cc.EventListener.create({
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
                            that.openCard(target);
                            break;
                    }
                    return true;
                }
                return false;
            }});
        cc.eventManager.addListener(touchListener,sender);
    },
    openCard:function(sender){
        if (!this.isAnimationFinish){
            return
        }
        this.openNumber++;
        this.isAnimationFinish = false;
        if (this.openNumber%2 === 0) {
            this.backTarget2 = sender;
            this.backTarget2.retain();
        }else {
            this.backTarget = sender;
            this.backTarget.retain();
        }

        this.selectedIndex = this.cardBackList.indexOf(sender);
        this.backAction = cc.rotateBy(0.3,0,90).repeat(1);
        this.backAction.retain();
        var actionFinish = cc.callFunc(this.animationFinishCallBack,this);
        var seq = cc.sequence(this.backAction,actionFinish);
        sender.runAction(seq);
    },
    close:function(){
        var action1 = this.showActon;
        var action2 = this.backAction;
        action2.retain();
        var that = this;

        var backSeq1 = cc.sequence(cc.callFunc(function callback(){
            that.isAnimationFinish = true;
            cc.log("-------------------backSeq1 = ")
        }),action2);
        backSeq1.retain();
        var showSeq1 = cc.sequence(cc.callFunc(function callback(){
            that.backTarget.runAction(backSeq1.reverse());
        }),action1);
        var showSeq2 = cc.sequence(cc.callFunc(function callback(){
            that.backTarget2.runAction(backSeq1.reverse());
        }),action1);
        this.showTarget.runAction(showSeq1.reverse());
        this.showTarget2.runAction(showSeq2.reverse());

    },
    removeThem: function () {
        this.isAnimationFinish = true;
        this.showTarget.stopAllActions();
        this.showTarget2.stopAllActions();
        this.backTarget2.stopAllActions();
        this.backTarget.stopAllActions();

        this.showTarget.removeFromParent();
        this.showTarget2.removeFromParent();
        this.backTarget2.removeFromParent();
        this.backTarget.removeFromParent();
    },
    animationFinishCallBack:function(){
        var showTarget = this.cardShowList[this.selectedIndex];
        if (this.openNumber === 2) {
            this.showTarget2 = showTarget;
        }else {
            this.showTarget = showTarget;
        }
       this.showActon = cc.rotateBy(0.3,0,90).repeat(1);
        this.showActon.retain();
        var that = this;
        var actionFinish = cc.callFunc(function callback(){
            var thisString = that.wordList[that.selectedIndex];
            if ( that.openNumber%2 === 0){
                that.openNumber = 0;
                if (that.selectedItem === thisString) {
                    that.removeThem();
                }else {
                    that.close();
                }
            }else {
                that.isAnimationFinish = true;
                that.selectedItem = thisString;
            }
        },showTarget,"my animate");
        var seq = cc.sequence(this.showActon,actionFinish);
        showTarget.runAction(seq);
    }
});

var TurnCardGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TurnCardLayer();
        this.addChild(layer);
    }
});