
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
    _timer_status:0,

    _currentButton:null,
    _buttonIsSelected:false,

    ctor:function(){
        this._super();

        var bgLayer = new DrawBgLayer();
        this.addChild(bgLayer);
        // cc.director.setClearColor(cc.color.WHITE);

        //轮廓绘图node
        this._pathDrawNode = new cc.DrawNode();
        this.addChild(this._pathDrawNode);
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

            }

        });

        // this.schedule(this.update,1,16*1024,1);


        // this._currentButton = new ccui.Button();
        // this._currentButton.setTouchEnabled(true);
        // this._currentButton.setTitleFontSize(20);
        // this._currentButton.setPressedActionEnabled(true);
        // this._currentButton.setTitleText("演示笔顺");
        // this._currentButton.x = GC.w-100;
        // this._currentButton.y = GC.h-80;
        // this._currentButton.addTouchEventListener(function(){
        //
        //     if (that._buttonIsSelected){
        //         that.stopTimer();
        //
        //     } else {
        //         that.startTimer();
        //
        //     }
        //
        //
        //     // cc.Director.popScene();
        //     that._buttonIsSelected = !that._buttonIsSelected;
        //
        // },this);
        // this.addChild(this._currentButton);
        //
        //
        // var button = new ccui.Button();
        // button.setTouchEnabled(true);
        // button.setTitleFontSize(20);
        // button.setPressedActionEnabled(true);
        // button.setTitleText("Back");
        // button.x = 50;
        // button.y = GC.h-80;
        // button.addTouchEventListener(function(){
        //     cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));
        //
        // },this);
        // this.addChild(button);
        // this.startTimer();


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
                lastPos = cc.p(x,offset-y);
                counter += 3;

            }
            if (token == "Q"){
                var x1 = finalPathArray[counter+1]*ratio+_Offset_x;
                var y1 = cc.winSize.height- finalPathArray[counter+2]*ratio;
                var x2 = finalPathArray[counter+3]*ratio+_Offset_x;
                var y2 = cc.winSize.height - finalPathArray[counter+4]*ratio;

                this._pathDrawNode.drawQuadBezier(lastPos, cc.p(x1,offset-y1), cc.p(x2,offset-y2), 50, lineWidth, _pathDrawColor);
                lastPos = cc.p(x2,offset-y2);
                counter += 5;
            }
            if (token == "L"){
                var x = finalPathArray[counter+1]*ratio+_Offset_x;
                var y =cc.winSize.height- finalPathArray[counter+2]*ratio;

                this._pathDrawNode.drawSegment(lastPos,cc.p(x,offset-y),1,_pathDrawColor);
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


        // lineWidth = _current_stroke_width * ratio;
        for (var i = 0;i<finalPathArray.length;i++){
            var token = finalPathArray[i];
            var x = token.x*ratio+_Offset_x;
            var y =cc.winSize.height - token.y*ratio;

            if (i == 0){
                this._pathDrawNode.drawDot(cc.p(x,offset -y),lineWidth,cc.color.BLUE);
                lastPos = cc.p(x,offset -y);

            } else {

                this._pathDrawNode.drawSegment(lastPos,cc.p(x,offset-y),lineWidth,cc.color.WHITE);
                lastPos = cc.p(x,offset -y);
            }

        }

        // this._pathDrawNode.
        // CGContextSetLineWidth(context, _current_stroke_width * ratio);
        // CGContextSetLineCap(context, kCGLineCapRound);
        // // Fill the path with dash line, change phase from length to zero is wonderful.
        // CGFloat dashLengths[] = {2048.0f * ratio, 2048.0f * ratio};
        // CGContextSetLineDash(context, _current_stroke_phase * ratio, dashLengths, 2);
        // CGContextStrokePath(context);

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
            // Make a path
            // this.makePath(_current_stroke);
            // Make a median
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
        this.schedule(this.updateData,(1/60.0));
    },

    stopTimer:function(){
        this.unschedule(this.updateData);
    },


});


var StrokesScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StrokesLayer();
        this.addChild(layer);

    }
});