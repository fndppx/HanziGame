
var hanziArr = ["天","蒙","辫","棚","靠","固","烂","界","易","精","愿","鑫","邋"];
var _pathDrawColor = cc.color.WHITE;
var _Offset_y = -100;
var _Offset_x = 100;


var  _current_stroke_phase = 0;
var  _current_stroke_width = 0;
var  _current_stroke_length = 0;
var  _current_stroke = 0;



var StrokesLayer = cc.Layer.extend({
    _dataArray:null,
    //存放文字的字典
    _outlineDictionary:null,
    //中点
    _medians:null,
    //当前笔画索引
    _currentIndex:0,
    //轮廓的drawNode
    _pathDrawNode:null,
    //笔顺的drawNode
    _strokeDrawNode:null,

    _pathClippingDrawNode:null,


    _timer_status:0,

    _currentButton:null,
    _buttonIsSelected:false,
    _moveSprite:null,
    _selectIndex:0,

    _clipping:null,

    ctor:function(){
        this._super();


        var moveSprite =  new StrokeMoveSprite(res.HelloWorld_png);

        this.addChild(moveSprite,10);

        this._moveSprite = moveSprite;

        var bgLayer = new DrawBgLayer();
        this.addChild(bgLayer);


        // cc.director.setClearColor(cc.color.WHITE);

        // ClippingNode *clipping = ClippingNode::create();
        // clipping->setStencil( shape );  //遮罩的形状
        // clipping->setInverted( true );  //为真 遮罩下什么都不显示, 为假 只有在遮罩下才显示东西.
        // clipping->addChild(sprite, 1);  //只有在clipping节点下的东西才有遮罩效果
        //





        //轮廓绘图node
        this._pathDrawNode = new cc.DrawNode();

        this.addChild(this._pathDrawNode);

        // this._pathClippingDrawNode = new cc.DrawNode();

        this._strokeDrawNode = new cc.DrawNode();
        this.addChild(this._strokeDrawNode,9);

        // this._clipping = new cc.ClippingNode();
        // this._clipping.stencil = this._pathClippingDrawNode;
        // this._clipping.setInverted(false);
        // // this._clipping.setInterval(0);
        // this.addChild(this._clipping,20);
        //
        // this._clipping.addChild(this._strokeDrawNode);


        //graphics
        var graphicsDictionary = [];

        this._dataArray = [];
        var that = this;

        var aREx = "res/graphics.txt";

        cc.loader.loadTxt(aREx, function(err, data){
            if(err) return console.log("load failed");

            that._dataArray = data.split("\n");

            if (that._dataArray){

                for (var i=0; i<that._dataArray.length-1; i++) {

                    var token = that._dataArray[i];

                    var startStr = "{\"character\":\"";
                    var EndStr = "\",\"strokes\":";
                    var secondInstance = token.indexOf(EndStr);
                    var startLocation  = secondInstance-1;
                    var keyword = token.substr(startLocation,1);

                    graphics_dictionary[keyword] = i;
                }
                // 天，蒙，瓣，棚，靠，固，烂，界，易，精，愿，鑫，邋
                cc.log("keyword>>>>>",  graphics_dictionary["大"]);

                var index = graphics_dictionary[hanziArr[0]];

                var data = that._dataArray[index];
                //解析json
                that._outlineDictionary = JSON.parse(data);

                that.layoutHanzi();


                that.makeMedian(0);

            }

        });


        this._currentButton = new ccui.Button();
        this._currentButton.setTouchEnabled(true);
        this._currentButton.setTitleFontSize(20);
        this._currentButton.setPressedActionEnabled(true);
        this._currentButton.setTitleText("下一字");
        this._currentButton.x = GC.w-100;
        this._currentButton.y = GC.h-80;
        this._currentButton.addTouchEventListener(function(sender,state){

            // if (that._buttonIsSelected){
            //
            // } else {
            //
            // }

            switch (state)
            {
                case ccui.Widget.TOUCH_BEGAN:
                    sender.setBright(false);
                    break;

                case ccui.Widget.TOUCH_MOVED:
                    sender.setBright(false);
                    break;

                case ccui.Widget.TOUCH_ENDED:
                    sender.setBright(true);


                    cc.removeSelf();

                    this._strokeDrawNode.clear();

                    this._pathDrawNode.clear();

                    this._moveSprite.removeFromParent(true);
                    this._moveSprite = null;
                    this._selectIndex++;
                    if (this._selectIndex >hanziArr.length-1){
                        this._selectIndex = 0;
                    }

                    var index = graphics_dictionary[hanziArr[this._selectIndex]];

                    var data = this._dataArray[index];
                    //解析json
                    this._outlineDictionary = JSON.parse(data);


                    this._medians = this._outlineDictionary["medians"]

                    this._totalstrokes = this._medians.length;
                    for (var i = 0;i<this._totalstrokes;i++){
                        this.makePath(i);
                    }

                    this.layoutHanzi();
                    this.makeMedian(_current_stroke);

                    break;

                // case ccui.Widget.TOUCH_CANCELLED:
                //     sender.setBright(true);
                //     break;
                default:
                    break;

            }


            // // cc.Director.popScene();
            // that._buttonIsSelected = !that._buttonIsSelected;






        },this);
        this.addChild(this._currentButton);


        var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setTitleFontSize(20);
        button.setPressedActionEnabled(true);
        button.setTitleText("Back");
        button.x = 50;
        button.y = GC.h-80;
        button.addTouchEventListener(function(){
            cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));

        },this);
        this.addChild(button);
        // this.startTimer();

        // var aa =  new StrokeMoveSprite(res.HelloWorld_png);
        // aa.x = 100;
        // aa.y = 100;
        // this.addChild(aa,10);
        //
        // var moveto = cc.moveTo(2,cc.p(200,100));
        // aa.runAction(moveto);
        // var move = cc.moveBy(2, cc.p(winSize.width - 80, 0));
        // var move_back = move.reverse();

    },

    //获取比例
    getStrokeRatio:function(){
        var size = GC.winSize;
        var max_size = Math.min(size.width,size.height);
        return 300/1024;
    },

    //汉字
    layoutHanzi:function(){
        _current_stroke = 0;
        _current_stroke_phase = 2047.0;
        _current_stroke_width = 0.0;
        _current_stroke_length = this.getStrokeLength(_current_stroke);


        this._medians = this._outlineDictionary["medians"]

        var mediansCount = this._medians.length;
        for (var i = 0;i<mediansCount;i++){
            this.makePath(i);

        }
        this._currentIndex = 0;
        // this.makeMedian(this._currentIndex);

            // this._clipping.setInverted(true);
        //     this._clipping.addChild(this._strokeDrawNode);
        // this.addChild(this._clipping);
     // }


        this.startTimer();


    },

    //绘制文字轮廓
    makePath:function(index){
        var medians = this._medians;
        var pathArray = this._outlineDictionary["strokes"];
        var pathContent = pathArray[index];
        var finalPathArray = pathContent.split(" ");

        var ratio = this.getStrokeRatio();

        var  counter = 0;
        var offset = GC.h-_Offset_y*ratio;
        // cc.log("offset",offset);
        var lastPos = cc.p;

        let lineWidth = 2;

        while (counter < finalPathArray.length){
            var token = finalPathArray[counter];
            if (token == "M"){
                var x = finalPathArray[counter+1]*ratio+_Offset_x;
                var y = cc.winSize.height-finalPathArray[counter+2]*ratio;

                this._pathDrawNode.drawDot(cc.p(x,offset -y),lineWidth,_pathDrawColor);
                // this._pathClippingDrawNode.drawDot(cc.p(x,offset -y),lineWidth,_pathDrawColor);
                lastPos = cc.p(x,offset-y);
                counter += 3;

            }
            if (token == "Q"){
                var x1 = finalPathArray[counter+1]*ratio+_Offset_x;
                var y1 = cc.winSize.height- finalPathArray[counter+2]*ratio;
                var x2 = finalPathArray[counter+3]*ratio+_Offset_x;
                var y2 = cc.winSize.height - finalPathArray[counter+4]*ratio;

                this._pathDrawNode.drawQuadBezier(lastPos, cc.p(x1,offset-y1), cc.p(x2,offset-y2), 50, lineWidth, _pathDrawColor);
                // this._pathClippingDrawNode.drawQuadBezier(lastPos, cc.p(x1,offset-y1), cc.p(x2,offset-y2), 50, lineWidth, _pathDrawColor);

                lastPos = cc.p(x2,offset-y2);
                counter += 5;
            }
            if (token == "L"){
                var x = finalPathArray[counter+1]*ratio+_Offset_x;
                var y =cc.winSize.height- finalPathArray[counter+2]*ratio;

                this._pathDrawNode.drawSegment(lastPos,cc.p(x,offset-y),lineWidth,_pathDrawColor);
                // this._pathClippingDrawNode.drawSegment(lastPos,cc.p(x,offset-y),lineWidth,_pathDrawColor);

                counter += 3;
            }
            if (token == "Z"){
                break;
            }
        }

    },

    makeMedian:function(index){
        let lineWidth = 2;

        var pathArray = this._medians;

        var finalPathArray = pathArray[index];

        var m_medians = [];
        var ratio = this.getStrokeRatio();

        for (var i = 0;i<finalPathArray.length;i++){
            var token = finalPathArray[i];

            var x = token[0];
            var y = token[1];

            m_medians.push(cc.p(x,y));
        }
        var a = new GameTools(m_medians,4);


        finalPathArray =  a.getSpacingPoints();
        // finalPathArray = m_medians;

        var offset = GC.h-_Offset_y*ratio;

        var lastPos = cc.p;

        // let  lineWidth = 10;
        var ratio = this.getStrokeRatio();

        if (this._moveSprite==null){
            var moveSprite =  new StrokeMoveSprite(res.HelloWorld_png);
            moveSprite.setVisible(false);
            // moveSprite.setAlpha(0);
            this._moveSprite = moveSprite;
            this.addChild(moveSprite,10);
        }
        this._moveSprite.setVisible(false);

        var animationArray = [];
        // lineWidth = _current_stroke_width * ratio;
        for (var i = 0;i<finalPathArray.length;i++){
            var token = finalPathArray[i];
            var x = token.x*ratio+_Offset_x;
            var y =cc.winSize.height - token.y*ratio;

            if (i == 0){

                lastPos = cc.p(x,offset -y);

                this._moveSprite.setPosition(lastPos);

            } else {

                // this._pathDrawNode.drawSegment(lastPos,cc.p(x,offset-y),lineWidth,cc.color.WHITE);
                lastPos = cc.p(x,offset -y);

                var moveS = cc.moveTo(1,lastPos);

                animationArray.push(moveS);
            }

        }



        // var drawN = new cc.DrawNode();
        // this.addChild(drawN,20);

        var callback = function(){

            if (_current_stroke < this.getStrokeCount()-1) {
                _current_stroke++;
                this.makeMedian(_current_stroke);
            }

        };

        var that = this;
        this._moveSprite.callbackBlk(function(dt){

            that._strokeDrawNode.drawDot(cc.p(dt.x+32,dt.y+32),10,cc.color.BLUE);

        });
        animationArray.push(cc.callFunc(callback,this,1));

        var seq = cc.sequence(animationArray);
        this._moveSprite.runAction(seq);

    },


    getStrokeCount:function(){
        var pathArray = this._outlineDictionary["medians"];
        return pathArray.length;
    },

    getStrokeLength:function(index){
        var pathArray = this._outlineDictionary["medians"];
        if (index>pathArray.length-1) {
            return 0;
        }
        var finalPathArray = pathArray[index];

        var distance = 0.0;
        var save_x = 0.0;
        var save_y = 0.0;
        for (var i=0; i<finalPathArray.length; i++) {
            var token = finalPathArray[i];

            var x = token[0];
            var y = token[1];
            if (i > 0) {
                distance += Math.sqrt((x - save_x) * (x - save_x) + (y - save_y) * (y - save_y));
            }
            save_x = x;
            save_y = y;
        }

        return distance;

    },


    drawRect:function(){
        if (_current_stroke < this.getStrokeCount()) {
            this.makeMedian(_current_stroke);
        }
    },

    strokeMoved:function(){
        var distance = this.getStrokeRatio() * 10.0;

        var ratio = this.getStrokeRatio();
        if (_current_stroke_width < 150.0) {
            _current_stroke_width += 2.0 * distance / ratio;
        } else {
            if (!this.touchesMoveCompleted()) {
                _current_stroke_phase -= distance / ratio;


            }else{
                this.containsEndView();
            }
        }
        this.drawRect();

        console.log("move+++");

    },

    containsEndView:function(){
        _current_stroke++;

        if (_current_stroke >= this.getStrokeCount()) {
            //        _current_stroke = 0;
            _current_stroke = this.getStrokeCount();
        }
        _current_stroke_phase = 2047.0;
        _current_stroke_width = 0.0;

    },


    strokeBegan:function(){
        // _current_stroke_length = [self getStrokeLength:_current_stroke];
       _current_stroke_length = this.getStrokeLength(_current_stroke);

       // this.drawRect();
    },

    strokeEnded:function(){
        _current_stroke++;
        if (_current_stroke >= this.getStrokeCount()) {
            _current_stroke = this.getStrokeCount();
        }
        _current_stroke_phase = 2047.0;
        _current_stroke_width = 0.0;
        this.drawRect();
    },

    //计时器
    updateData:function(){
        switch (this._timer_status) {
            case 0:
                // ...

                this.strokeBegan();

                this._timer_status++;

                break;
            case 1:

                this.strokeMoved();

                var isCompleted = this.touchesMoveCompleted();
                if (isCompleted){
                    this._timer_status++;

                }

                // ...
                break;
            case 2:
                var isLast = this.isLastStroke();
                if (isLast){
                    //
                    this.strokeEnded();


                }else {
                    this.strokeEnded();

                }


                // ...
                break;


            default:
            // ...
        }
    },


    isLastStroke:function(){
        return _current_stroke == this.getStrokeCount() - 1;
    },

    touchesMoveCompleted:function(){


        cc.log("touchesMoveCompleted>>>>>>",_current_stroke_phase,_current_stroke_length);

        return 2047 - _current_stroke_phase >= _current_stroke_length - 10.0;

    },

    startTimer:function(){
        // this.schedule(this.updateData,(1/60.0));
    },

    stopTimer:function(){
        // this.unschedule(this.updateData);
    },


});


var StrokesScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StrokesLayer();
        this.addChild(layer);

    }
});