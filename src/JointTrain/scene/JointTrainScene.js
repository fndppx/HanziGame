var JointTrainLayer = cc.Layer.extend({

    _wordsArray:[],

    _wordIndex:0,
   ctor:function(){
       this._super();

       this._wordIndex = 0;
       this._wordsArray = ['仿佛','貌似','正好','好像'];

       var layer = new cc.LayerColor(cc.color.WHITE);
       layer.x = 0;
       layer.y = 0;
       layer.setAnchorPoint(0,0);
       this.addChild(layer);

       var trainHeader = new TrainCarriageSprite(res.train_header,'词语归类');
       trainHeader.setAnchorPoint(0,0);
       trainHeader.x = 0;
       trainHeader.y = 50
       this.addChild(trainHeader);

       var gapWidth = 10;

       var validArea = new BaseLayer(cc.color.WHITE);
       validArea.setContentSize(GC.w-trainHeader.getContentSize().width,trainHeader.getContentSize().height);
       validArea.x = trainHeader.getContentSize().width;
       validArea.y = trainHeader.y;
       this.addChild(validArea);

       var self = this;

       // 70  38?
       for (var i = 0; i <this._wordsArray.length ; i++){
           var word = this._wordsArray[i];
           var train = new TrainCarriageSprite(res.train_carriage,word);
           train.setAnchorPoint(0,0);
           train.x = gapWidth+(70+gapWidth)*i;
           train.y = GC.h-38-64;

           train.setMoveBlk(function(p){

               var rect = cc.rect(p.x,p.y,train.width,train.height);

               var rect1 = cc.rect(validArea.x,validArea.y,validArea.width,validArea.height);

               cc.log(rect,rect1);
               if (cc.rectIntersectsRect(rect,rect1))
               {
                   cc.log('重叠>>>>>>',);

                   p.x = trainHeader.x+trainHeader.getContentSize().width+10+(70+10)*self._wordIndex;
                   p.y = trainHeader.y+20;
                   p.removeListener();
                   self._wordIndex++;
                   if (self._wordIndex>=4){
                       var alert =  new HitMouseAlert();
                       alert.createSuccessAlert();
                       alert.attr({
                           x: (GC.w-200)/2,
                           y: (GC.h-100)/2,
                       });
                       alert.setContentSize(200,100);

                       self.addChild(alert,13);
                       setTimeout(function(){
                           alert.removeFromParent();
                       }, 1000);
                   }
               }

           });

           this.addChild(train,10);
       }



       // var gapWidth = 10;
       //
       // // 70  38?
       // for (var i = 0; i <this._wordsArray.length ; i++){
       //     var word = this._wordsArray[i];
       //     var train = new TrainCarriageSprite(res.train_carriage,word);
       //     train.setAnchorPoint(0,0);
       //     train.x = trainHeader.x+trainHeader.getContentSize().width+gapWidth+(70+gapWidth)*i;
       //     train.y = trainHeader.y;
       //
       //     this.addChild(train);
       // }



   }
});


var JointTrainScene = cc.Scene.extend({

    onEnter:function () {

        this._super();
        var layer = new JointTrainLayer();
        this.addChild(layer);
    }
});