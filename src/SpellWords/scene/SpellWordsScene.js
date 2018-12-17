var SpellWordsLayer = cc.Layer.extend({

    ctor:function() {
        this._super();

        var layer = new cc.LayerColor(cc.color(123,204,204,255));
        layer.x = 0;
        layer.y = 0;
        layer.setAnchorPoint(0,0);
        this.addChild(layer);

        var size = cc.winSize;

        var items = ['人','朱','前','后','做','哟'];

        var listView = new PickerView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setBounceEnabled(true);
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
        var slistView = listView;
        listView.addEventListener(function(sender,type){
            switch (type){
                case ccui.ScrollView.EVENT_SCROLLING:
                    var scrollView = sender;
                    var offset = scrollView.position;
                    cc.log('offset',offset.y);
                    break;
                default:
                    break;
            }
            
        });


        // listView.addEventListener(function(){
        //
        // });

        for(var i =0; i < items.length; i++){

            var label = new cc.LabelTTF(items[i],'Arial', 30);
            label.setAnchorPoint(0.5,1);
            label.setContentSize(100,40);
            label.x = 50;
            label.y =(10+(40+10)*items.length)-(10+(40+10)*i);


            label.color = cc.color.BLACK;
            listView.addChild(label,2);

        }

    },

    scrollViewDidScroll: function (view) {

    cc.log(view.offset.y);
    },
    scrollViewDidZoom: function (view) {
    }
});

var SpellWordsScene = cc.Scene.extend({

    onEnter:function () {

        this._super();
        var layer = new SpellWordsLayer();
        this.addChild(layer);
    }
});

