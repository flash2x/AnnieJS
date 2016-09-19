var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by anlun on 16/8/14.
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    var Shape = annie.Shape;
    var ScrollPage = (function (_super) {
        __extends(ScrollPage, _super);
        /**
         * 构造函数
         * @method  ScrollPage
         * @param vW 可视区域宽
         * @param vH 可视区域高
         * @param maxDistance 最大滚动的长度
         * @param isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         */
        function ScrollPage(vW, vH, maxDistance, isVertical) {
            if (isVertical === void 0) { isVertical = true; }
            _super.call(this);
            /**
             * 横向还是纵向 默认为纵向
             * @property isVertical
             * @type {boolean}
             * @private
             * @since 1.0.0
             * @default true
             */
            this.isVertical = true;
            /**
             * 可见区域的宽
             * @property viewWidth
             * @type {number}
             * @private
             * @since 1.0.0
             * @default 0
             */
            this.viewWidth = 0;
            /**
             * 可见区域的高
             * @property viewHeight
             * @type {number}
             * @private
             * @since 1.0.0
             * @default 0
             */
            this.viewHeight = 0;
            /**
             * 整个滚动的最大距离值
             * @property maxDistance
             * @type {number}
             * @public
             * @since 1.0.0
             * @default 1040
             */
            this.maxDistance = 1040;
            /**
             * @property 滚动距离
             * @type {number}
             * @private
             * @default 0
             * @since 1.0.0
             */
            this.distance = 0;
            /**
             * 最小鼠标滑动距离
             * @type {number}
             */
            this.minDis = 2;
            /**
             * 遮罩对象
             * @property maskObj
             * @since 1.0.0
             * @private
             * @type {annie.Shape}
             */
            this.maskObj = null;
            /**
             * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
             * @property view
             * @public
             * @since 1.0.0
             * @type {annie.Sprite}
             */
            this.view = null;
            /**
             * 最后鼠标经过的坐标值
             * @property lastValue
             * @private
             * @since 1.0.0
             * @type {number}
             */
            this.lastValue = 0;
            /**
             * 速度
             * @property speed
             * @private
             * @since 1.0.0
             * @type {number}
             */
            this.speed = 0;
            /**
             * 加速度
             * @property addSpeed
             * @private
             * @since 1.0.0
             * @type {number}
             */
            this.addSpeed = 0;
            /**
             * 是否是停止滚动状态
             * @property isStop
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default true
             */
            this.isStop = true;
            /**
             * 滚动的最大速度，直接影响一次滑动之后最长可以滚多远
             * @property maxSpeed
             * @public
             * @since 1.0.0
             * @default 100
             * @type {number}
             */
            this.maxSpeed = 100;
            /**
             * 摩擦力,值越大，减速越快
             * @property fSpeed
             * @public
             * @since 1.0.0
             * @default 20
             * @type {number}
             */
            this.fSpeed = 20;
            this.isMaoPao = true;
            this.paramXY = "y";
            this.stopTimes = -1;
            var s = this;
            s.view = new Sprite();
            s.maskObj = new Shape();
            s.addChild(s.view);
            s.maskObj.beginFill("#000000");
            s.maskObj.rect(0, 0, vW, vH);
            s.viewWidth = vW;
            s.viewHeight = vH;
            s.maskObj.endFill();
            s.view.mask = s.maskObj;
            s.maxDistance = maxDistance;
            s.isVertical = isVertical;
            if (s.isVertical) {
                s.distance = s.viewHeight;
                s.paramXY = "y";
            }
            else {
                s.distance = s.viewWidth;
                s.paramXY = "x";
            }
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEvent.bind(s));
            s.addEventListener(annie.Event.ENTER_FRAME, function () {
                var view = s.view;
                if (!s.isStop) {
                    if (Math.abs(s.speed) > 0) {
                        view[s.paramXY] += s.speed;
                        //是否超过了边界,如果超过了,则加快加速度,让其停止
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            s.speed += s.addSpeed * s.fSpeed;
                        }
                        else {
                            s.speed += s.addSpeed;
                        }
                        //说明超过了界线,准备回弹
                        if (s.speed * s.addSpeed > 0) {
                            s.speed = 0;
                        }
                    }
                    else {
                        //检测是否超出了边界,如果超出了边界则回弹
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            if (s.addSpeed < 0) {
                                view[s.paramXY] += 0.4 * (0 - view[s.paramXY]);
                                if (Math.abs(view[s.paramXY]) < 0.2) {
                                    s.isStop = true;
                                }
                            }
                            else {
                                view[s.paramXY] += 0.4 * (s.distance - s.maxDistance - view[s.paramXY]);
                                if (Math.abs(s.distance - s.maxDistance - view[s.paramXY]) < 0.2) {
                                    s.isStop = true;
                                }
                            }
                        }
                        else {
                            s.isStop = true;
                        }
                    }
                }
                else {
                    if (s.stopTimes >= 0) {
                        s.stopTimes++;
                        if (s.stopTimes >= 15) {
                            s.speed = 0;
                            if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                                s.isStop = false;
                                s.stopTimes = -1;
                            }
                        }
                    }
                }
            });
        }
        /**
         * 改可滚动的方向，比如之前是纵向滚动的,你可以横向的。或者反过来
         * @method changeDirection
         * @param isVertical 是纵向还是横向,不传值则默认为纵向
         */
        ScrollPage.prototype.changeDirection = function (isVertical) {
            if (isVertical === void 0) { isVertical = true; }
            var s = this;
            s.isVertical = isVertical;
            if (isVertical) {
                s.distance = s.viewHeight;
                s.paramXY = "y";
            }
            else {
                s.distance = s.viewWidth;
                s.paramXY = "x";
            }
        };
        ScrollPage.prototype.onMouseEvent = function (e) {
            var s = this;
            var view = s.view;
            if (s.distance < s.maxDistance) {
                if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                    if (!s.isStop) {
                        s.isStop = true;
                        //并且需要告诉对应的鼠标弹起事件时不要向下冒泡
                        s.isMaoPao = false;
                    }
                    else {
                        s.isMaoPao = true;
                    }
                    if (s.isVertical) {
                        s.lastValue = e.localY;
                    }
                    else {
                        s.lastValue = e.localX;
                    }
                    s.speed = 0;
                }
                else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                    var currentValue;
                    if (s.isVertical) {
                        currentValue = e.localY;
                    }
                    else {
                        currentValue = e.localX;
                    }
                    s.speed = currentValue - s.lastValue;
                    if (s.speed > s.minDis) {
                        s.addSpeed = -2;
                        if (s.speed > s.maxSpeed) {
                            s.speed = s.maxSpeed;
                        }
                    }
                    else if (s.speed < -s.minDis) {
                        if (s.speed < -s.maxSpeed) {
                            s.speed = -s.maxSpeed;
                        }
                        s.addSpeed = 2;
                    }
                    else {
                        s.speed = 0;
                    }
                    if (s.speed != 0) {
                        var speedPer = 1;
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            speedPer = 0.2;
                        }
                        view[s.paramXY] += (currentValue - s.lastValue) * speedPer;
                        s.isMaoPao = false;
                    }
                    s.lastValue = currentValue;
                    s.stopTimes = 0;
                }
                else {
                    s.isStop = false;
                    s.stopTimes = -1;
                }
            }
            if (!s.isMaoPao) {
                e.preventDefault();
            }
        };
        return ScrollPage;
    }(Sprite));
    annieUI.ScrollPage = ScrollPage;
})(annieUI || (annieUI = {}));
/**
 * Created by anlun on 16/8/14.
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    var FacePhoto = (function (_super) {
        __extends(FacePhoto, _super);
        function FacePhoto() {
            _super.call(this);
            this.maskType = 0;
            var s = this;
            s.photo = new Image();
            s.bitmap = new annie.Bitmap();
            s.maskObj = new annie.Shape();
            s.photo.onload = function (e) {
                s.bitmap.bitmapData = s.photo;
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                if (s.maskType == 0) {
                    s.bitmap.scaleX = s.bitmap.scaleY = s.radio * 2 / s.photo.width;
                    s.maskObj.circle(s.radio, s.radio, s.radio);
                }
                else {
                    s.bitmap.scaleX = s.bitmap.scaleY = s.radio / s.photo.width;
                    s.maskObj.rect(0, 0, s.radio, s.radio);
                }
                s.maskObj.endFill();
            };
            s.addChild(s.bitmap);
            s.bitmap.mask = s.maskObj;
        }
        FacePhoto.prototype.init = function (src, radio, maskType) {
            if (radio === void 0) { radio = 0; }
            if (maskType === void 0) { maskType = 0; }
            this.radio = radio;
            this.photo.src = src;
            this.maskType = maskType;
        };
        return FacePhoto;
    }(Sprite));
    annieUI.FacePhoto = FacePhoto;
})(annieUI || (annieUI = {}));
