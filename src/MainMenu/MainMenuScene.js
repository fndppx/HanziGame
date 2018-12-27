
var MainMenuLayer = cc.Layer.extend({

    _backgroundLayer : null,
    _touchLayer      : null,
    listView :null,
    _spawnCount:8,
    _array:[],
    _totalCount: 8,
    _dataSource:[],
    ctor : function(){

        this._super();

        // add bg
        var bgLayer = new DrawBgLayer();
        this.addChild(bgLayer);


        var size = GC.winSize;

        var item1 = new cc.MenuItemFont("写字", this.menuItem1Callback, this);

        var item2 = new cc.MenuItemFont("语音评测", this.menuItem2Callback, this);

        var item3 = new cc.MenuItemFont("笔顺", this.menuItem3Callback, this);

        var item4 = new cc.MenuItemFont("打地鼠", this.menuItem4Callback, this);

        var item5 = new cc.MenuItemFont("火车运货", function(){

            cc.director.runScene(new cc.TransitionFade(0.3, new JointTrainScene()));

        }, this);

        var item6 = new cc.MenuItemFont("花篮游戏", function(){

            cc.director.runScene(new cc.TransitionFade(0.3, new FlowersBasketScene()));

        }, this);

        var item7 = new cc.MenuItemFont("拼字", function(){

            cc.director.runScene(new cc.TransitionFade(0.3, new SpellWordsScene()));

        }, this);

        var item8 = new cc.MenuItemFont("图片与勾勒", function(){

            cc.director.runScene(new cc.TransitionFade(0.3, new FindWordImgScene()));

        }, this);

        var  mn = new cc.Menu(item1, item2,item3,item4,item5,item6,item7,item8);
        mn.alignItemsVerticallyWithPadding(10);
        // this.addChild(mn);


        var dataSource = [
            {
                title:"写字",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionProgressInOut(0.3, new WriteHanziScene()));

                }
            },
            {
                title:"语音评测",
                testScene:function () {
                    // cc.director.runScene(new cc.TransitionFade(0.3, new WriteHanziScene()));
                    var ret = jsb.reflection.callStaticMethod("JSBManager",
                        "gotoXunFeiISE");
                }
            },
            {
                title:"笔顺",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionProgressRadialCW(0.3, new StrokesScene()));
                }
            },
            {
                title:"打地鼠",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionProgressHorizontal(0.3, new HitMouseScene()));
                }
            },
            {
                title:"火车运输",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionProgressVertical(0.3, new JointTrainScene()));
                }
            },
            {
                title:"花篮游戏",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionFade(0.3, new FlowersBasketScene()));
                }
            },
            {
                title:"拼字",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionFade(0.3, new SpellWordsScene()));
                }
            },
            {
                title:"图片与勾勒",
                testScene:function () {
                    cc.director.runScene(new cc.TransitionFade(0.3, new FindWordImgScene()));

                }
            },

        ];
        this._dataSource = dataSource;


        // Create the list view
        this.listView = new ccui.ListView();
        // set list view ex direction
        this.listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.listView.setTouchEnabled(true);
        this.listView.setBounceEnabled(true);
        // this.listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
        // this.listView.setBackGroundImageSca le9Enabled(true);
        this.listView.setContentSize(cc.size(200, 300));
        this.listView.x = GC.w_2;
        this.listView.y = GC.h_2;
        this.listView.setAnchorPoint(0.5,0.5)
        this.listView.addEventListener(this.selectedItemEvent, this);
        // this._mainNode.addChild(this.listView);

        this.addChild(this.listView);

        this._array = [];
        for (var i = 0; i < this._totalCount; ++i) {
            // this._array.push("item_" + i);
        }

        // create model
        var default_button = new ccui.Button();
        default_button.setTitleFontSize(20);
        default_button.setName("TextButton");
        // default_button._layer._color = cc.color.RED;
        default_button.setTouchEnabled(true);
        default_button.loadTextures(res.button_bg, "", "");

        var default_item = new ccui.Layout();
        default_item.setTouchEnabled(true);
        default_item.setContentSize(default_button.getContentSize());
        default_item.width = this.listView.width;
        default_item.height = 40;
        default_button.x = default_item.width / 2;
        default_button.y = default_item.height / 2;
        default_item.addChild(default_button);

        // set model
        this.listView.setItemModel(default_item);
        // set all items layout gravity
        this.listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

        for(i = 0; i < this._totalCount; ++i) {
            if (i < this._spawnCount) {
                var item = default_item.clone();
                item.setTag(i);
                var btn = item.getChildByName('TextButton');
                btn.setScale9Enabled(true);
                btn.setContentSize(200, 40);

                btn.setTitleText(dataSource[i].title);
                this.listView.pushBackCustomItem(item);
            }
        }

        var spacing = 4;
        this.listView.setItemsMargin(spacing);

    },
    selectedItemEvent: function (sender, type) {
        switch (type) {
            case ccui.ListView.ON_SELECTED_ITEM_END:
                var listViewEx = sender;
                var item = listViewEx.getItem(listViewEx.getCurSelectedIndex());
                cc.log("select child index = " + item.getTag(),listViewEx.getCurSelectedIndex());

                this._dataSource[listViewEx.getCurSelectedIndex()].testScene();

                break;

            default:
                break;
        }
    },

    //
    // menuItem1Callback:function (sender) {
    //     cc.log("Touch Start Menu Item " + sender);
    //
    //     cc.director.runScene(new cc.TransitionFade(0.3, new WriteHanziScene()));
    //
    // },
    //
    // menuItem2Callback:function (sender) {
    //     cc.log("Touch Help Menu Item " + sender);
    //     var ret = jsb.reflection.callStaticMethod("JSBManager",
    //         "gotoXunFeiISE");
    // },
    //
    // menuItem3Callback:function (sender) {
    //     cc.log("Touch Help Menu Item " + sender);
    //     cc.director.runScene(new cc.TransitionFade(0.3, new StrokesScene()));
    //
    // },
    //
    // menuItem4Callback:function (sender) {
    //     cc.log("Touch Help Menu Item " + sender);
    //     cc.director.runScene(new cc.TransitionFade(0.3, new HitMouseScene()));
    //
    // },

});


var MainMenuScene  = cc.Scene.extend({
    onEnter:function () {

        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});