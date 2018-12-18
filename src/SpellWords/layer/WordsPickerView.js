// var  WordsPickerView = cc.Layer.extend({
//
//     _scrollView:null,
//
//     _labelWidth:33,
//     _labelMid:20,
//     _maxHeight:25,
//     _minHeight:15,
//     _secLevelAlpha:0.6,
//     _thirdLevelAlpha:0.2,
//     _labelColor:cc.color.BLACK,
//
//     _slideLabArr:[],
//     _showArr:[],
//
//     _allCount:0,
//     _lastCount:0,
//
//     ctor:function(){
//         this._super();
//
//         this._scrollView = new ccui.ScrollView();
//         this._scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
//         this._scrollView.setBounceEnabled(true);
//         this._scrollView.setTouchEnabled(true);
//         this._scrollView.setContentSize(100,10+(40+10)*3);
//         this._scrollView.x = GC.w_2;
//         this._scrollView.y = GC.h_2;
//         this._scrollView.setAnchorPoint(cc.p(0.5,0.5));
//         this.addChild(this._scrollView,1);
//
//     },
//
//     show:function(){
//
//         if (this._slideLabArr.length > 0){
//
//             for (var label in this._slideLabArr){
//                 label.removeFromParent(true);
//             }
//             this._slideLabArr = [];
//         }
//
//         this._scrollView.rect = cc.rect((this.width - this._labelWidth - 2*this._labelMid)/2,(this.height - this._maxHeight)/2,this._labelWidth+this._labelMid,this._maxHeight);
//
//
//         if(this._allCount.length > 0){
//
//             for (var i = 0; i<this._allCount.length; i++) {
//
//                 var text = i+1;
//                 if (this._showArr.length > 0){
//                     text = this._showArr[i];
//                 } else {
//
//                 }
//                 var label = new cc.LabelTTF(text,'Arial', 30);
//                 label.setAnchorPoint(0.5,1);
//                 label.setContentSize(100,40);
//                 // label.x = 50;
//                 // label.y =(10+(40+10)*items.length)-(10+(40+10)*i);
//
//                 label.rect =
//
//                 label.color = cc.color.BLACK;
//                 this._scrollView.addChild(label,2);
//
//                 UILabel *lab = [[UILabel alloc]initWithFrame:CGRectZero];
//                     if(i==0){
//                         lab.frame = CGRectMake(self.lableMid,
//                             0,
//                             self.lableWidth,
//                             self.maxHeight);
//                         lab.font = [UIFont systemFontOfSize:self.maxHeight];
//                     }else{
//                         UILabel *lastLab = self.SlideLabArr[i-1];
//                         lab.frame = CGRectMake(kViewMaxX(lastLab)+self.lableMid,
//                             self.maxHeight-self.minHeight,
//                             self.lableWidth,
//                             self.minHeight);
//                         lab.font = [UIFont systemFontOfSize:self.minHeight];
//                     }
//                     if(i==0){
//                         lab.alpha = 1;
//                     }else if(i==1){
//                         lab.alpha = self.SecLevelAlpha;
//                     }else{
//                         lab.alpha = self.ThirdLevelAlpha;
//                     }
//
//                     lab.adjustsFontSizeToFitWidth = YES;
//                     if(self.showArr.count>0){
//                         lab.text          = (NSString *)self.showArr[i];
//                     }else{
//                         lab.text          = [NSString stringWithFormat:@"%d",i+1];
//                     }
//
//                     lab.textAlignment = NSTextAlignmentCenter;
//                     lab.textColor     = self.LabColor;
//
//                     [self.SCRV addSubview:lab];
//                     [self.SlideLabArr addObject:lab];
//                 }
//
//                 UILabel *lastLab = self.SlideLabArr[self.SlideLabArr.count-1];
//                 self.SCRV.contentSize = CGSizeMake(kViewMaxX(lastLab)+self.lableMid,
//                     0);
//                 self.SCRV.pagingEnabled = YES;
//                 self.SCRV.clipsToBounds = NO;
//             }
//
//     },
//
//     onEnter:function(){
//         this._super();
//         // var layer = new cc.LayerColor(cc.color.RED);
//         // layer.x = 0;
//         // layer.y = 0;
//         // layer.setAnchorPoint(0,0);
//         // layer.setContentSize(cc.size(100, 128*6));
//         //
//         // this.addChild(layer);
//     },
// });