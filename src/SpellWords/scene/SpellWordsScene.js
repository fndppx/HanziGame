var SpellWordsLayer = cc.Layer.extend({

    _listView:null,
    _labelArray:null,
    _lastLabel:null,
    _lastCount:-1,

    ctor:function() {
        this._super();

        this._labelArray = [];

        var layer = new cc.LayerColor(cc.color(123,204,204,255));
        layer.x = 0;
        layer.y = 0;
        layer.setAnchorPoint(0,0);
        this.addChild(layer);

        var size = cc.winSize;

        var items = ['人','朱','前','后','做','哟'];

        var listView = new PickerView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setBounceEnabled(false);
        listView.setTouchEnabled(true);
        // listView.setInertiaScrollEnabled(false);
        // listView
        // listView.setSize(cc.size(512, 200));
        listView.setContentSize(100,10+(40+10)*3);
        listView.x = GC.w_2;
        listView.y = GC.h_2;
        listView.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(listView);
        listView.setInnerContainerSize(cc.size(100, 10+(40+10)*items.length));
        this._listView = listView;
        var self = this;
        listView.addEventListener(function(sender,type){
            switch (type){
                case ccui.ScrollView.EVENT_SCROLLING:
                {
                    // var scrollView = sender;
                    // var offset = scrollView.getInnerContainerPosition();
                    // cc.log('offset',offset.y);
                }

                    break;

                case ccui.ScrollView.EVENT_CONTAINER_MOVED:
                {
                    var scrollView = sender;
                    var offset = scrollView.getInnerContainerPosition();
                    // (10+(40+10)*items.length)-(10+(40+10)*i)

                    var offset_y = scrollView.getInnerContainerSize().height-scrollView.getContentSize().height + offset.y;
                    var count = Math.floor(offset_y /(40+10));


                    // if  (count%1 == 0){
                    //     cc.log('size=====offset=====count',count+1);
                    //
                    //     var label = self._labelArray[count+1];
                    //
                    //     var actionTo = cc.scaleTo(0., 1.5);
                    //
                    //     var actionTo1 = cc.scaleTo(0., 1);
                    //     if (self._lastLabel){
                    //         self._lastLabel.runAction(actionTo1);
                    //
                    //     }
                    //
                    //     label.runAction(actionTo);
                    //
                    //     if (self._lastCount != count){
                    //         self._lastCount = count;
                    //         self._lastLabel = label;
                    //     }
                    // }


                        var  countOffset = offset_y;

                        var offsetRait = 1;
                        if (countOffset != 0){
                            offsetRait = 1-countOffset/(40+10);
                        }


                        var showingLab = null;
                        if (count >= 0 && count < self._labelArray.length-1){
                            showingLab = self._labelArray[count];
                        }

                        var maxHeight = 50;
                        var minHeight = 40;


                        if (showingLab){
                            showingLab.setRect(showingLab.x,(maxHeight-minHeight)*(1-offsetRait),showingLab.width,minHeight+
                                (maxHeight-minHeight)*offsetRait);
                        }

                        if (count < items.length-1){
                            var nextLab = self._labelArray[count+1];
                            if (nextLab){
                                nextLab.setRect(nextLab.x,(maxHeight-minHeight)*(1-offsetRait),nextLab.width,minHeight+
                                    (maxHeight-minHeight)*offsetRait);
                            }
                        }
                        if (count > 0){

                            var lastLab = self._labelArray[count - 1];

                            lastLab.setRect(lastLab.x,(maxHeight-minHeight)*(1-offsetRait),lastLab.width,minHeight+
                                (maxHeight-minHeight)*offsetRait);
                        }

                        if (count<self._labelArray.length-2){
                            var next2Lab = self._labelArray[count + 2];
                            next2Lab.setRect(next2Lab.x,(maxHeight-minHeight)*(1-offsetRait),next2Lab.width,minHeight+
                                (maxHeight-minHeight)*offsetRait);
                        }

                        for (var i = 0;i<self._labelArray.length;i++) {
                            if (i!=count && i!=count+1&& i!=count-1 &&i!=count+2) {
                                var lab = self._labelArray[i];
                                // lab.setRect()
                            }
                        }
                    // for (int i=0;i<self.SlideLabArr.count;i++) {
                    // if(i!=count &&
                    //     i!=count+1&&
                    //     i!=count-1&&
                    //     i!=count+2){
                    //     UILabel *lab = self.SlideLabArr[i];
                    //     lab.frame = CGRectMake(kViewX(lab),
                    //         (self.maxHeight-self.minHeight),
                    //         kViewWidth(lab),
                    //         self.minHeight);
                    //     lab.font = [UIFont systemFontOfSize:kViewHeight(lab)];
                    //     lab.alpha = self.ThirdLevelAlpha;
                    // }
                // }

                }

                    break;
                default:
                    break;
            }

        });


        for(var i =0; i < items.length; i++){

            var label = new cc.LabelTTF(items[i],'Arial', 30);
            label.setAnchorPoint(0.5,0.5);
            label.setContentSize(100,40);
            label.x = 50;
            label.y =(10+(40+10)*items.length)-(10+20+(40+10)*i);
            // (10+(40+10)*items.length)-

            label.color = cc.color.BLACK;
            listView.addChild(label,2);
            this._labelArray.push(label);
        }

        // cc.log('scrollview>>>>',listView._contentOffset.x);
        // this.scheduleUpdate();

    },

    update:function(dt){
        // cc.log(this._listView._contentOffset.y);
    },
});

var SpellWordsScene = cc.Scene.extend({

    onEnter:function () {

        this._super();
        var layer = new SpellWordsLayer();
        this.addChild(layer);
    }
});