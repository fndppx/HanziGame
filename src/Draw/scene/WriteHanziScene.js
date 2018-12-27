
var _outlineDictionary = [];
var currentDrawDode = null;
var currentDrawDodeArr = [];
var graphics_dictionary = [];
var hanziArr = ["天","蒙","辫","棚","靠","固","烂","界","易","精","愿","鑫","邋"];
var _lastPoint = null;


var _Offset_y = -100;
var _Offset_x = 0;

var WriteHanziLayer = cc.Layer.extend({
    _bgGroundLayer:null,
    moveSprites:null,
    _lineWidth:10,
    _currentIndex:0,
    _totalstrokes:0,
    _dataArray:null,
    _medians:null,
    _selectIndex:0,
    m_drawNode:null,
    ctor:function(){
        this._super();

        var aREx = "res/graphics.txt";
        this._dataArray = [];
        var that = this;

        this.moveSprites = [];

        // add bg
        this._bgGroundLayer = new DrawBgLayer();
        this.addChild(this._bgGroundLayer);

        var drawNode =new cc.DrawNode();

        this.drawNode = drawNode;

        cc.log(cc.winSize.height);

        this.addChild( drawNode);

        // this.addTouchEventListener();

        var ss = this.getStrokeRatio();
        cc.log(ss);

        var graphics_dictionary = [];
        this.m_drawNode = new cc.DrawNode();
        this.addChild(this.m_drawNode);

        cc.loader.loadTxt(aREx, function(err, data){
            if(err) return console.log("load failed");
            //success

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
                cc.log("keyword>>>>>",   graphics_dictionary["大"]);

                var index = graphics_dictionary[hanziArr[0]];

                var data = that._dataArray[index];
                _outlineDictionary = JSON.parse(data);

                that.setup();


            }
        });


        var item1 = new cc.MenuItemFont("下一字", function(){
            console.log("menu is clicked");

            for (var i = 0;i<this.moveSprites.length;i++){
                let a = this.moveSprites[i];
                a.removeFromParent();

            }
            this.moveSprites.splice(0,this.moveSprites.length);

            for (var i = 0;i<currentDrawDodeArr.length;i++){
                var b  = currentDrawDodeArr[i];
                b.removeFromParent();
            }
            currentDrawDodeArr = [];

            that.m_drawNode.clear();
            that._currentIndex = 0;

            that._selectIndex++;
            if (that._selectIndex >hanziArr.length-1){
                that._selectIndex = 0;
            }

            var index = graphics_dictionary[hanziArr[that._selectIndex]];

            var data = that._dataArray[index];
            _outlineDictionary = JSON.parse(data);

            // that.setup();

            that._medians = _outlineDictionary["medians"]

            that._totalstrokes = that._medians.length;
            for (var i = 0;i<that._totalstrokes;i++){
                this.makePath(i);

                // this.makeMedian(i);

            }
            that._currentIndex = 0;
            that.makeMedian(that._currentIndex);
        }, this);

        var  mn = new cc.Menu(item1);
        mn.x = GC.w-80;
        mn.y = GC.h-80;
        this.addChild(mn,1);


        var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setTitleFontSize(20);
        button.setPressedActionEnabled(true);
        button.setTitleText("Back");
        button.x = 50;
        button.y = GC.h-80;
        button.addTouchEventListener(function(){
            // cc.Director.popScene();
            cc.director.runScene(new cc.TransitionFade(0.3, new MainMenuScene()));

        },this);
        this.addChild(button);


        return true;
    },



    setup:function(){

        this._medians = _outlineDictionary["medians"]

        this._totalstrokes = this._medians.length;
        for (var i = 0;i<this._totalstrokes;i++){
            this.makePath(i);

            // this.makeMedian(i);

        }
        this._currentIndex = 0;
        this.makeMedian(this._currentIndex);

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
        for (var i = 0;i<finalPathArray.length;i++){
            var token = finalPathArray[i];
            var x = token.x*ratio+_Offset_x;
            var y =cc.winSize.height - token.y*ratio;

            if (i == 0){
                // this.drawNode.drawDot(cc.p(x,offset -y),lineWidth,cc.color.BLUE);
                lastPos = cc.p(x,offset -y);

            } else {

                // this.drawNode.drawSegment(lastPos,cc.p(x,offset-y),lineWidth,cc.color.WHITE);
                lastPos = cc.p(x,offset -y);
            }

            // this.drawNode.drawDot(cc.p(x,offset -y),5,cc.color.RED);

            var that = this;
            var sushi = null;
            if (i==0){
                 sushi = new MoveSprite(res.HelloWorld_png);

            } else {
                 sushi = new MoveSprite(res.Res_Luobu);

            }

            sushi.callbackBlk(function(currentP,startP){
                // var drawNode = new  cc.DrawNode();
                //
                // that.addChild(drawNode,20);

                var sprite1 = that.moveSprites[1];
                var sprite = that.moveSprites[0];

                var center = null;

                let  lineWidth = 8;

                var point1 =  sprite1.getPosition();
                var point2 = sprite.getPosition();
                cc.log("point1 point2>>>>>>",point1,point2);

                //计算半径
                function  s(obj1,obj2){
                    return Math.sqrt((obj1.x-obj2.x)*(obj1.x-obj2.x)+(obj1.y-obj2.y)*(obj1.y-obj2.y));
                }

                cc.log("半径",point2,that.middleP,s(point2,that.middleP));

                var w = that.radiusW;
                // if (w<50) {
                    w = that.radiusW+20;
                // }
                if (s(point2,that.middleP)<=w){
                    cc.log("在里边");

                    if (_lastPoint == null) {
                        currentDrawDode.drawDot(cc.p(point2.x,point2.y),lineWidth,cc.color.WHITE);

                    }else {

                        currentDrawDode.drawSegment(_lastPoint,cc.p(point2.x,point2.y),lineWidth,cc.color.WHITE);
                    }

                    _lastPoint = cc.p(point2.x,point2.y);



                }else {
                    _lastPoint = null;
                    cc.log("不在",that._startPoint);

                    if (that.radiusW == 0){
                        return;
                    }

                    sprite.setPosition((that._startPoint));
                    sprite.setEnableMoved(false);

                    sprite.setEnableMoved(true);

                    currentDrawDode.clear();
                }

                if (that.moveSprites.length==0){
                    return;
                }

                if (sprite1==null||sprite1==null){return}

                if (cc.rectContainsPoint(cc.rect(sprite.x-(sprite.getBoundingBox().width-30)/2,sprite.y-(sprite.getBoundingBox().width-30)/2,30,30),sprite1.getPosition())){
                    // Res_Eat_Mp3
                    cc.audioEngine.playEffect(res.Res_Eat_Mp3);

                    cc.log("碰撞了");
                    cc.log("123321",sprite1.getPosition());
                    // sprite.setPosition(sprite1.getPosition());

                    sprite1.removeFromParent();

                    if (that.moveSprites.length==2){
                        _lastPoint = null;
                        currentDrawDode.drawSegment(cc.p(point2.x,point2.y),cc.p(point1.x,point1.y),lineWidth,cc.color.WHITE);

                        for (var i = 0;i<that.moveSprites.length;i++){
                            let a = that.moveSprites[i];
                            // a.removeFromParent();

                        }
                        sprite.removeFromParent();
                        that.moveSprites.splice(0,that.moveSprites.length);
                        that._currentIndex++;
                        if (that._currentIndex>=that._totalstrokes){

                            return;
                        }
                        // that.setBihuaIndex(bihuaIndex);
                        that.makeMedian(that._currentIndex);

                    }else {
                        that.moveSprites.splice(1,1);
                        that.resetStatus();
                    }
                }

            });

            if (i==0){
                sushi.setEnableMoved(true);
            } else {
                // sushi.setEnableMoved(false);
            }

            sushi.attr({
                x:x,
                y:(offset -y),
                anchorX:0.5,
                anchorY:0.5,
            });

            this.addChild(sushi,11);
            this.moveSprites.push(sushi);

        }

        this.resetStatus();
    },

    resetStatus:function(){

        var nextSprite = this.moveSprites[1];
        var topSprite = this.moveSprites[0];

        var center = null;

        let lineWidth = 20;
        // this.removeChild(currentDrawDode);
        var lastDrawNode = new cc.DrawNode();
        currentDrawDodeArr.push(lastDrawNode);
        this.addChild(lastDrawNode);
        currentDrawDode = lastDrawNode;

        // var point1 =  this.convertToNodeSpace(nextSprite.getPosition());
        // var point2 = this.convertToNodeSpace(topSprite.getPosition());
        var point1 =  nextSprite.getPosition();
        var point2 = topSprite.getPosition();
        var pos = cc.p((point2.x-point1.x)*0.5+point1.x,(point2.y-point1.y)*0.5+point1.y);

        // currentDrawDode.drawDot(pos,10,cc.color.WHITE);
        //
        // currentDrawDode.drawDot(point2,10,cc.color.WHITE);

        //计算半径
        function  s(obj1,obj2){
            return Math.sqrt((obj1.x-obj2.x)*(obj1.x-obj2.x)+(obj1.y-obj2.y)*(obj1.y-obj2.y));
        }

        this.radiusW = s(pos,point1);


        this.middleP = cc.p((point2.x-point1.x)*0.5+point1.x,(point2.y-point1.y)*0.5+point1.y);

        cc.log("a==b111",this.radiusW,this.middleP);
        this._startPoint = point2;

        cc.log("开始===",point2);

    },

    makePath:function(index){
        // var pathArray = outlineDictionary["strokes"];
        var medians = this._medians;
        // var medians = [[[210,458],[268,453],[514,503],[719,534],[770,529],[810,517]],[[416,810],[444,799],[482,759],[469,518],[448,394],[426,320],[386,231],[361,196],[307,140],[202,67],[138,41]],[[486,430],[500,393],[576,284],[660,182],[722,118],[774,77],[953,42]]];
        // var pathArray = ["M 494 476 Q 542 485 795 501 Q 817 502 822 512 Q 826 525 808 540 Q 750 580 707 569 Q 631 550 500 522 L 436 509 Q 331 490 213 469 Q 189 465 208 447 Q 241 420 294 432 Q 357 453 431 465 L 494 476 Z","M 487 437 Q 491 456 494 476 L 500 522 Q 510 711 528 763 Q 534 776 523 786 Q 501 805 459 822 Q 434 832 414 825 Q 390 816 410 796 Q 444 762 444 726 Q 445 602 436 509 L 431 465 Q 398 275 310 179 Q 303 173 297 166 Q 251 118 148 55 Q 133 48 130 43 Q 124 36 144 34 Q 195 34 300 104 Q 385 173 414 218 Q 444 266 480 396 L 487 437 Z","M 480 396 Q 501 357 575 245 Q 657 124 718 56 Q 746 22 774 22 Q 856 28 928 32 Q 959 33 959 41 Q 960 50 927 66 Q 753 144 719 174 Q 614 267 500 419 Q 493 429 487 437 L 480 396 Z"];
        // var pathArray = ["M 403 684 Q 449 724 513 791 Q 514 794 517 795 L 534 809 Q 540 813 540 821 Q 541 831 531 844 Q 507 877 477 878 Q 468 877 468 866 Q 468 785 309 661 Q 252 619 139 554 Q 130 551 140 547 Q 198 541 333 628 Q 360 649 386 669 L 403 684 Z","M 517 795 Q 742 594 789 588 Q 859 588 930 610 Q 946 614 947 618 Q 948 625 935 628 Q 884 643 826 656 Q 697 689 536 807 Q 535 808 534 809 L 517 795 Z","M 505 665 Q 536 672 570 678 Q 595 684 599 687 Q 606 693 602 699 Q 598 708 575 714 Q 565 717 471 694 Q 440 688 403 684 L 386 669 Q 387 669 390 667 Q 420 649 463 658 L 505 665 Z","M 518 579 Q 552 586 589 590 Q 628 597 634 603 Q 641 609 638 615 Q 634 624 611 631 Q 584 637 520 615 L 470 604 Q 416 595 355 591 Q 327 588 347 575 Q 371 557 457 569 Q 463 570 471 571 L 518 579 Z","M 512 468 Q 515 529 518 579 L 520 615 Q 520 651 509 662 Q 506 663 505 665 L 463 658 Q 466 649 470 604 L 471 571 Q 471 531 473 462 L 512 468 Z","M 335 524 Q 386 470 403 469 Q 415 468 420 484 Q 421 496 412 513 Q 403 526 383 533 Q 352 546 339 548 Q 330 549 330 539 Q 329 532 335 524 Z","M 594 554 Q 581 533 556 502 Q 552 496 555 492 Q 561 491 566 493 Q 620 526 646 537 Q 659 541 656 548 Q 652 560 638 573 Q 625 586 609 589 Q 599 588 599 575 Q 600 565 594 554 Z","M 638 450 Q 671 454 703 457 Q 712 456 720 466 Q 721 476 703 485 Q 676 504 603 486 Q 527 474 512 468 L 473 462 Q 430 458 285 444 Q 260 443 278 427 Q 293 414 306 407 L 335 408 Q 545 447 606 447 L 638 450 Z","M 306 407 Q 305 406 304 399 Q 288 317 96 166 Q 80 154 101 157 Q 149 160 227 232 Q 230 235 234 238 L 247 249 Q 269 271 342 352 L 352 363 Q 356 370 361 373 Q 370 382 368 389 Q 365 399 344 406 Q 340 407 335 408 L 306 407 Z","M 342 352 Q 341 352 342 351 Q 346 344 364 333 Q 395 314 429 288 Q 439 281 449 283 Q 456 284 458 292 Q 459 302 452 320 Q 446 338 417 349 Q 389 358 357 363 Q 354 364 352 363 L 342 352 Z","M 234 238 Q 255 217 304 221 L 341 230 Q 372 239 405 245 Q 424 251 428 253 Q 435 260 431 267 Q 424 276 401 281 Q 377 285 310 261 Q 283 255 250 250 Q 247 250 247 249 L 234 238 Z","M 308 170 Q 302 170 298 168 Q 261 159 217 154 Q 192 150 210 138 Q 231 126 294 136 Q 301 137 309 138 L 352 148 Q 371 154 396 158 Q 423 165 427 168 Q 434 174 430 180 Q 426 187 405 193 Q 381 197 354 184 L 308 170 Z","M 304 221 Q 307 212 308 170 L 309 138 Q 309 101 310 35 L 347 42 Q 348 100 352 148 L 354 184 Q 358 214 353 220 Q 346 227 341 230 L 304 221 Z","M 198 90 Q 240 44 257 41 Q 267 41 272 55 Q 273 65 265 81 Q 258 93 240 98 Q 213 110 202 111 Q 195 112 194 104 Q 193 97 198 90 Z","M 403 123 Q 393 105 371 76 Q 368 72 371 68 Q 375 67 380 70 Q 423 101 446 112 Q 456 116 454 122 Q 450 131 439 141 Q 427 151 414 152 Q 407 152 407 141 Q 408 132 403 123 Z","M 310 35 Q 184 17 166 19 Q 154 19 152 11 Q 149 -1 156 -8 Q 175 -24 201 -44 Q 210 -48 221 -41 Q 257 -20 295 -8 Q 355 8 413 28 Q 435 35 453 45 Q 465 51 466 58 Q 462 64 451 63 Q 400 53 347 42 L 310 35 Z","M 659 402 Q 668 417 669 419 Q 666 438 638 450 L 606 447 L 607 445 Q 611 397 538 311 Q 535 311 535 308 Q 513 283 457 237 Q 451 233 459 231 Q 495 231 579 306 Q 580 309 583 310 Q 608 337 648 388 L 659 402 Z","M 648 388 Q 649 385 655 381 Q 731 305 812 237 Q 848 204 982 240 Q 998 243 999 248 Q 1000 254 987 257 Q 813 302 756 337 Q 732 350 710 366 Q 676 391 659 402 L 648 388 Z","M 643 244 Q 722 266 724 267 Q 731 273 727 279 Q 721 288 699 292 Q 677 296 654 286 Q 632 277 607 271 Q 580 264 549 260 Q 521 254 542 243 Q 570 230 610 236 L 643 244 Z","M 665 156 Q 759 175 763 179 Q 769 185 766 191 Q 762 200 739 206 Q 717 210 667 194 L 620 182 Q 619 182 616 181 Q 571 172 518 168 Q 491 164 510 151 Q 540 135 595 144 Q 607 147 620 147 L 665 156 Z","M 659 31 Q 662 101 665 156 L 667 194 Q 668 198 668 203 Q 674 218 666 226 Q 654 238 643 244 L 610 236 Q 616 215 620 182 L 620 147 Q 620 104 622 25 L 659 31 Z","M 505 94 Q 541 43 561 39 Q 571 38 577 51 Q 578 61 573 77 Q 560 101 510 115 Q 503 116 501 107 Q 500 101 505 94 Z","M 730 116 Q 720 97 699 65 Q 695 61 699 56 Q 703 55 709 58 Q 757 92 780 104 Q 792 108 788 115 Q 784 125 770 137 Q 757 149 742 149 Q 732 148 733 136 Q 736 126 730 116 Z","M 622 25 Q 552 18 470 6 Q 454 5 466 -10 Q 476 -20 492 -25 Q 508 -29 522 -26 Q 630 1 839 1 Q 842 1 846 0 Q 862 1 866 7 Q 870 17 857 28 Q 814 64 749 47 Q 710 41 659 31 L 622 25 Z"];
        // var pathArray = ["M 494 476 Q 542 485 795 501 Q 817 502 822 512 Q 826 525 808 540 Q 750 580 707 569 Q 631 550 500 522 L 436 509 Q 331 490 213 469 Q 189 465 208 447 Q 241 420 294 432 Q 357 453 431 465 L 494 476 Z"];
        var pathArray = _outlineDictionary["strokes"];
        var pathContent = pathArray[index];
        var finalPathArray = pathContent.split(" ");

        var ratio = this.getStrokeRatio();

        var  counter = 0;
        var offset = GC.h-_Offset_y*ratio;
        // cc.log("offset",offset);
        var lastPos = cc.p;

        let lineWidth = 1;

        // this.addChild(m_drawNode);
        // cc.log(finalPathArray.length);
        while (counter < finalPathArray.length){
            var token = finalPathArray[counter];
            if (token == "M"){
                var x = finalPathArray[counter+1]*ratio+_Offset_x;
                var y = cc.winSize.height-finalPathArray[counter+2]*ratio;

                // cc.log("y>>>>>>",x,y,finalPathArray[counter+2]*ratio);
                this.m_drawNode.drawDot(cc.p(x,offset -y),0.5,cc.color.RED);
                lastPos = cc.p(x,offset-y);
                counter += 3;

            }
            if (token == "Q"){
                var x1 = finalPathArray[counter+1]*ratio+_Offset_x;
                var y1 = cc.winSize.height- finalPathArray[counter+2]*ratio;
                var x2 = finalPathArray[counter+3]*ratio+_Offset_x;
                var y2 = cc.winSize.height - finalPathArray[counter+4]*ratio;

                this.m_drawNode.drawQuadBezier(lastPos, cc.p(x1,offset-y1), cc.p(x2,offset-y2), 50, lineWidth, cc.color.RED);
                lastPos = cc.p(x2,offset-y2);
                counter += 5;
            }
            if (token == "L"){
                var x = finalPathArray[counter+1]*ratio+_Offset_x;
                var y =cc.winSize.height- finalPathArray[counter+2]*ratio;

                this.m_drawNode.drawSegment(lastPos,cc.p(x,offset-y),0.5,cc.color.RED);
                lastPos = cc.p(x,offset-y);

                counter += 3;
            }
            if (token == "Z"){
                break;
            }
        }

    },

    getStrokeRatio:function(){
        var size = GC.winSize;
        var max_size = Math.min(size.width,size.height);
        return 300/1024;
    },

    addTouchEventListener:function(){
        var  that = this;
        var lastPoint = null;
        // cc.log(this);
        var lineWidth = 1;

        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                // console.log("touch>>>>>>>",pos);
                // pos.y+=300;
                // that.drawNode.drawDot(cc.p(pos.x,pos.y),lineWidth,cc.color.BLUE);
                lastPoint = pos;

                if (that.pointsInPolygon(that.getDots(),[pos.x,pos.y]) == 1){
                    cc.log("在内部");
                } else {
                    cc.log("不在内部");

                }
                // console.log("在里边",that.pointsInPolygon(that.getDots(),[pos.x,pos.y]));

                return true;
            },

            onTouchMoved: function (touch,event) {


                var pos = touch.getLocation();
                // pos.y+=300;

                // console.log("move>>>>>>>",pos);

                var lastPos = touch.getPreviousLocation();

                // that.drawNode.drawSegment(cc.p(lastPos.x,lastPos.y),cc.p(pos.x,pos.y),lineWidth,cc.color.BLUE);

                if (that.pointsInPolygon(that.getDots(),[pos.x,pos.y]) == 1){
                    cc.log("在内部");
                } else {
                    cc.log("不在内部");

                }
                return true;

            },

        });
        cc.eventManager.addListener(this.touchListener,this);

    },

    //判断点是否在区域内
    judgeDotIsInner:function(x1,y1,x2,y2,x,y){
        var minX = 0,maxX = 0,minY = 0,maxY = 0;
        minX = x1;
        maxX = x2;
        minY = y1;
        maxY = y2;

        if (minX > maxX){
            minX = x2;
            maxX = x1;
        }

        if (minY > maxY) {
            minY = y2;
            maxY = y1;
        }
        // 射线
        if (y < minY || y > maxY || x < minX) {
            return 0;
        }
        // 对比线垂直的情况， 这段可以快速判断出对比线段垂直的情况, (不过感觉没必要判断,不要这段代码也行.)
        if (minX == maxX) {
            // y值只有两种(1 在线段y值中，2 和线段y值外(必不相交, 前面已经排除了), 这里排除掉在末端点y2上的情况)
            if(y == y2)
                return 0;
            // 剩下的y在minY和maxY之间
            // 1 如果x == minx也相等， 表示在对比线上，返回-1;
            // 2 如果x < minX 则肯定不相交, 返回 0;
            // 3 那么 x> minX时， 肯定相交， 返回1.
            if (x == minX)
                return -1;
            else if (x < minX)
                return 0;
            else
                return 1;
        }
        // 对比线平行的情况
        if (minY == maxY) {
            // 在前面排除掉 y < minY 和 y > maxY 的情况后只剩下，y和两个y值相等的情况, 即触摸点与这个对比线在一条线上
            // 前面判断过x < minX的情况， 如果x<maxX 则表示在线上(排除与末端点x2相等的情况)
            if(x <= maxX && x != x2)
                return -1;
            else
                return 0;
        }
        // 剩下的情况, 计算射线与边所在的直线的交点的横坐标
        var x0 = x1 + ((x2 - x1) / (y2 - y1)) * (y - y1);
        // 交点在射线右侧，不相交
        if (x0 > x)
            return 0;
        else if (x0 == x) {
            return -1;
        }
        // 穿过下端点不计
        if (x0 == x2) {
            return 0;
        }
        return 1;

    },

    pointsInPolygon:function(pArray,pos){
        var count = pArray.length;
        // 在多边形内的数量
        var nCount = 0;
        // 返回值
        var nFlag = 0;
        for (var i = 0; i < count; ++i) {
            var next = i + 1;
            if (next == length)
                break;
            // var pos1 = pArray.getControlPointAt(i);
            var pos1 = cc.getControlPointAt(pArray,i);

            var pos2 = cc.getControlPointAt(pArray,next);

            // nFlag = this.judgeDotIsInner(pos1.x,pos1.y,pos2.x,pos2.y, pos.x, pos.y);
            nFlag = this.judgeDotIsInner(pos1[0],pos1[1],pos2[0],pos2[1], pos[0], pos[1]);


            if (-1 == nFlag) {
                // 在线上
                return 2;
            }
            if (1 == nFlag)
                nCount += 1;
        }
        if (1 == nCount % 2) {
            // 在里面
            return 1;
        } else {
            // 不在里面
            return 0;
        }

    },

//计算两点的实际距离
    distanceTo: function(pointA,pointB) {
        var distance = 0.0;
        if ((pointA.x != null) && (pointA.y != null) &&
            (pointB != null) && (pointB.x != null) && (pointB.y != null)) {
            var dx2 = Math.pow(pointA.x - pointB.x, 2);
            var dy2 = Math.pow(pointA.y - pointB.y, 2);
            distance = Math.sqrt(dx2 + dy2);
        }
        return distance;
    },



})

var WriteHanziScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new WriteHanziLayer();
        this.addChild(layer);

    }
});