/**
 * Created by xujw on 2018/1/23.
 */
var CycleScroll;
(function () {
    var MIN_SCROLL_SPEED = 1;
    var MAX_SCROLL_SPEED = 50;
    CycleScroll = cc.LayerColor.extend({
        curIndex: 0,
        _disSize: null,
        _spaceDistance: 0,
        _nodes: null,
        _clipNode: null,

        //减速使用
        _dragging: false,
        _autoScrolling: false,
        _scrollDistance: 0,
        _startPos: null,

        /**
         *
         * @param disSize cc.Size   宽高
         * @param nodes  []         节点
         * @param distance  Number  间隔
         * @param minScale  Number  最小缩放
         */
        ctor: function (disSize, nodes, distance, minScale) {


            if (!minScale) {
                minScale = 1;
            }
            if (!distance) {
                distance = 150;
            }
            this._super(cc.color.RED, disSize.width, disSize.height);

            this._nodes = nodes;
            this._disSize = disSize;
            this._spaceDistance = distance;
            this._minScale = minScale;

            this.initView();
            this.scheduleUpdate();

            },

        initView: function () {
            this.setContentSize(this._disSize);
            var clipSize = this._disSize;
            var stencil = new cc.LayerColor(cc.color(255,0,0,255), clipSize.width, clipSize.height);
            this._clipNode = new cc.ClippingNode(stencil);
            this.addChild(this._clipNode);
            var len = this._nodes.length;
            for (var i=0; i<len; i++) {
                if (this._nodes[i] != null){
                    this._nodes[i].setPosition(cc.p(
                        this._disSize.width/2,this._nodes[i].getContentSize().height/2+ i*this._spaceDistance));
                    // this._nodes[i].setPosition(cc.p(this._nodes[i].getContentSize().width/2 + i*this._spaceDistance,
                    //                                                                         this._disSize.height/2));
                    this._clipNode.addChild(this._nodes[i]);
                }
            }

            this.initListener();
            this.scrollTo(0, 0);
        },

        initListener: function () {
            var self = this;
            var listener = cc.EventListener.create({
                swallowTouches: true,
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: self.onTouchBegan.bind(self),
                onTouchMoved: self.onTouchMoved.bind(self),
                onTouchEnded: self.onTouchEnded.bind(self)
            });
            cc.eventManager.addListener(listener,this);
        },

        setDisplaySize: function (disSize) {
            this._disSize = disSize;
            this.setContentSize(this._disSize);
            this._clipNode.getStencil().setContentSize(this._disSize);
        },

        getDisplaySize: function () {
            return this._disSize;
        },

        onTouchBegan: function (touch, event) {
            this._dragging = true;
            this._scrollDistance = 0;
            this._startPos = touch.getLocation();
            return true;
        },

        onTouchMoved: function (touch, event) {
            var disY = touch.getDelta().y;
            this.updateNodePosY(disY);
            this._startPos = touch.getPreviousLocation();
        },

        onTouchEnded: function (touch, event) {
            this._dragging = false;
            var endPos = touch.getLocation();
            this._scrollDistance = Math.sqrt(Math.pow(2, endPos.y-this._startPos.y) + Math.pow(2,endPos.y-this._startPos.y));
            this._scrollDistance = this._scrollDistance <= MAX_SCROLL_SPEED?this._scrollDistance : MAX_SCROLL_SPEED;
            if (this._scrollDistance > MIN_SCROLL_SPEED) {
                this._autoScrolling = true;
            }
            var direction = endPos.y > this._startPos.y?1:-1;
            this._scrollDistance *= direction;
        },
        
        updateNodePosY: function (delta) {
            var length = this._nodes.length;
            for (var i=0; i<length; i++){
                var node = this._nodes[i];
                // if (i == 0){
                    cc.log('坐标X', this.convertToWorldSpace(cc.p(node.x,node.y)).y );
                //
                //     5/50
                //     100/35 = 50/
                //     100/50 = 35/30
                    // 100 = 35
                    //
                    // 50 = 30;


                   // var a = (Math.abs (Math.abs(this.convertToNodeSpace(cc.p(node.x,node.y)).y) + 75) * 5/50);
                   // node.setFontSize(30+a);

                // }


                node.setPositionY(node.getPositionY() + delta);

            }


        },

        scrollTo: function (index, time) {
            if(index < 0 || index >= this._nodes.length) {
                cc.log("index invalid!");
                return;
            }
            this.curIndex = index;
            var distance = this._disSize.width/2 - this._nodes[index].getPositionX();
            for (var i=0; i< this._nodes.length; i++){
                var node = this._nodes[i];
                node.stopAllActions();
                node.runAction(cc.moveBy(time, cc.p(0, distance)).easing(cc.easeSineOut()));
            }

        },

        deaccelerateScrolling: function (dt) {
            if (this._dragging)
            {
                this._autoScrolling = false;
                return;
            }
            cc.log("scrollDistance:" + this._scrollDistance);
            this._scrollDistance *= 0.95;
            if (Math.abs(this._scrollDistance) < MIN_SCROLL_SPEED){
                this._autoScrolling = false;
                this._startTime = 0;
            }
            this.updateNodePosY(this._scrollDistance);
        },
        
        update: function (dt) {
            var length = this._nodes.length;
            var newPosY = 0;
            var s = 0.5;
            var mid = this._disSize.width/2;

            for (var i=0; i<length; i++){
                var node = this._nodes[i];
                var curPosY = node.getPositionY();

                if (curPosY < -node.getContentSize().height/2){
                    var beforeIndex = i-1;
                    beforeIndex = beforeIndex>=0?beforeIndex:length-1;
                    newPosY = this._nodes[beforeIndex].getPositionY() + this._spaceDistance;
                    if (curPosY != newPosY){
                        node.setPositionY(newPosY);
                        curPosY = newPosY;
                    }
                }else if (curPosY > this._disSize.height + node.getContentSize().height/2){
                    var afterIndex = i+1;
                    afterIndex = afterIndex<=length-1?afterIndex:0;
                    newPosY = this._nodes[afterIndex].getPositionY() - this._spaceDistance;
                    if (curPosY != newPosY){
                        node.setPositionY(newPosY);
                        curPosY = newPosY;
                    }
                }

                if (curPosY <= mid){
                    s = curPosY / mid;
                } else{
                    s = (this._disSize.width-curPosY) / mid;
                }
                s *= 1.2;
                s = s<=1?s:1;
                s = s>=this._minScale?s:this._minScale;
                node.setScale(s);
            }

            if (this._autoScrolling) {
                this.deaccelerateScrolling(dt);
            }
        }
    });

})();