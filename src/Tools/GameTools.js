    var GameTools = cc.Class.extend({

        _spacing: 0,
        _distanceSum: 0,
        _surplusDistance: 0,
        _pointArr:null,
        _spacingPoints:null,
        _distanceArr:null,

        ctor: function (points,spacing) {
            this._spacingPoints = [];
            this._spacing = spacing;
            this._pointArr = points;
            this._distanceArr = this.calculateDistanceSum(this._pointArr);
            this.doCalculate(0);

            if (this._distanceSum >=0 &&this._distanceSum <150){
                this._spacing = 1;
            }else  if(this._distanceSum >=150&&this._distanceSum <300){
                this._spacing = 2;
            }
            else if(this._distanceSum >=300&&this._distanceSum <450){
                this._spacing = 3;
            }
            else  if (this._distanceSum >=450 &&this._distanceSum <600){
                this._spacing = 4;
            }else if (this._distanceSum >=600 && this._distanceSum <750){
                this._spacing = 5;
            }else if (this._distanceSum >=750 && this._distanceSum <900){
                this._spacing = 6;
            }else if (this._distanceSum >=900 && this._distanceSum <1050){
                this._spacing = 7;
            }else if (this._distanceSum >=1050 && this._distanceSum <1200){
                this._spacing = 8;
            }else if (this._distanceSum >=1200 && this._distanceSum <1350){
                this._spacing = 9;
            }else if (this._distanceSum >=1350 && this._distanceSum <1500){
                this._spacing = 10;
            }

            this._spacingPoints = [];
            this._spacing = this._distanceSum/this._spacing;
            this._pointArr = points;
            this._distanceArr = this.calculateDistanceSum(this._pointArr);
            this.doCalculate(0);

            cc.log("线段平分点",this._pointArr,"距离",this._distanceSum,this._distanceArr,"平分坐标",this._spacingPoints)

        },

        getSpacingPoints:function(){

            if (this._spacingPoints[0] != this._pointArr[0]){
                this._spacingPoints.splice(0,0,this._pointArr[0]);
            }

            return this._spacingPoints;

        },

        calculateDistanceSum: function (points) {

            var pointDistance = [];
            for (var i = 0;i < points.length - 1;i++)
            {
                var point1 = points[i];
                var point2 = points[i + 1];

                this._distanceSum += this.calculateDistance(point1,point2);

                pointDistance.push(this.calculateDistance(point1,point2))


            }
            return pointDistance;
        },


        calculateDistance: function (point1, point2) {
            var x = Math.pow(point1.x - point2.x, 2);
            var y = Math.pow(point1.y - point2.y, 2);

            var result = Math.sqrt(x + y);

            return result;
        },

        calculateLambda: function (s, n) {

            var lambda = n / (s - n);
            return lambda;
        },

        calculateX: function (lambda, x1, x2) {
            var x = (x1 + lambda * x2) / (1 + lambda);
            return x;
        },

        calculateY: function (lambda, y1, y2) {
            var y = (y1 + lambda * y2) / (1 + lambda);
            return y;
        },

        doCalculate:function(i){
            var startPoint = cc.p();
            var endPoint = cc.p();

            if (i < this._pointArr.length - 1) {
                startPoint = this._pointArr[i];
                endPoint   = this._pointArr[i+1];

                // 存在的点个数
                var pointNum = Math.floor((this._distanceArr[i] + this._surplusDistance) / this._spacing);

                if (pointNum > 0) {

                    for (var j = 0; j < pointNum; j++) {

                        var n = 0;
                        var s = 0;

                        if (j == 0) {

                            n = this._spacing - this._surplusDistance;
                            s = this._distanceArr[i];
                        } else {

                            n = (j + 1) * this._spacing - this._surplusDistance;
                            s = this._distanceArr[i];
                        }

                        if (n != s) {

                            var lambda = this.calculateLambda(s,n);

                            var x = this.calculateX(lambda,startPoint.x,endPoint.x);
                            var y = this.calculateY(lambda,startPoint.y,endPoint.y);

                            var newPoint = cc.p(x, y);

                            this._spacingPoints.push(newPoint);
                        } else {

                            this._spacingPoints.push(endPoint);

                        }
                    }

                    // 更新剩余距离

                    this._surplusDistance += this._distanceArr[i] - pointNum * this._spacing;
                } else {

                    // 更新剩余距离
                    // _surplusDistance += [self.distanceArr[i] doubleValue] - pointNum * self.spacing;

                    this._surplusDistance += this._distanceArr[i] - pointNum * this._spacing;

                }

                this.doCalculate(i+1);
            }

        },


    });
