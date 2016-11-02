var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    var Shape = annie.Shape;
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    var ScrollPage = (function (_super) {
        __extends(ScrollPage, _super);
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {number}vW 可视区域宽
         * @param {number}vH 可视区域高
         * @param {number}maxDistance 最大滚动的长度
         * @param {boolean}isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
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
            this.paramXY = "y";
            this.stopTimes = -1;
            this.isMouseDown = false;
            /**
             * 是否是通过scrollTo方法在滑动中
             * @property autoScroll
             * @since 1.0.2
             * @type {boolean}
             * @private
             * @default false;
             */
            this.autoScroll = false;
            var s = this;
            s.isVertical = isVertical;
            s.view = new Sprite();
            s.maskObj = new Shape();
            s.view.mask = s.maskObj;
            s.setMask(vW, vH);
            s.maskObj.alpha = 0;
            s.addChild(s.maskObj);
            s.addChild(s.view);
            s.maxDistance = maxDistance;
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_OUT, s.onMouseEvent.bind(s));
            s.addEventListener(annie.Event.ENTER_FRAME, function () {
                var view = s.view;
                if (s.autoScroll)
                    return;
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
         * @param {boolean}isVertical 是纵向还是横向,不传值则默认为纵向
         * @since 1.0.0
         * @public
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
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setMask
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.0.0
         */
        ScrollPage.prototype.setMask = function (w, h) {
            var s = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, w, h);
            s.viewWidth = w;
            s.viewHeight = h;
            s.maskObj.endFill();
            if (s.isVertical) {
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
            if (s.autoScroll)
                return;
            var view = s.view;
            if (s.distance < s.maxDistance) {
                if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                    if (!s.isStop) {
                        s.isStop = true;
                    }
                    if (s.isVertical) {
                        s.lastValue = e.localY;
                    }
                    else {
                        s.lastValue = e.localX;
                    }
                    s.speed = 0;
                    s.isMouseDown = true;
                }
                else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                    if (!s.isMouseDown)
                        return;
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
                    }
                    s.lastValue = currentValue;
                    s.stopTimes = 0;
                }
                else {
                    s.isMouseDown = false;
                    s.isStop = false;
                    s.stopTimes = -1;
                }
            }
        };
        /**
         * 滚到指定的坐标位置
         * @method
         * @param dis 坐标位置
         * @param time 滚动需要的时间
         * @since 1.0.2
         * @public
         */
        ScrollPage.prototype.scrollTo = function (dis, time) {
            if (time === void 0) { time = 0; }
            var s = this;
            s.autoScroll = true;
            s.isStop = true;
            s.isMouseDown = false;
            var obj = {};
            obj.onComplete = function () {
                s.autoScroll = false;
            };
            obj[s.paramXY] = dis;
            annie.Tween.to(s.view, time, obj);
        };
        return ScrollPage;
    }(Sprite));
    annieUI.ScrollPage = ScrollPage;
})(annieUI || (annieUI = {}));
/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    /**
     * 有时我们需要从外部获取一张个人头像，将它变成方形或者圆形展示出来。
     * 又希望他能按照我们的尺寸展示，这个时候你就需要用到FacePhoto类啦。
     * @class annieUI.FacePhoto
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
    */
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
                    s.maskObj.drawCircle(s.radio, s.radio, s.radio);
                }
                else {
                    var w = s.photo.width > s.photo.height ? s.photo.width : s.photo.height;
                    s.bitmap.scaleX = s.bitmap.scaleY = s.radio / w;
                    s.maskObj.drawRect(0, 0, s.radio, s.radio);
                }
                s.maskObj.endFill();
            };
            s.addChild(s.bitmap);
            s.bitmap.mask = s.maskObj;
        }
        /**
         * 被始化头像
         * @method init
         * @param src 头像的地址
         * @param radio 指定头像的长宽
         * @param maskType 遮罩类型，是圆形遮罩还是方形遮罩
         */
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
/**
 * Created by saron on 16/10/19.
 */
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    /**
     * 滑动页面类
     * @class annieUI.SlidePage
     * @public
     * @extends annie.Sprite
     * @since 1.0.2
     */
    var SlidePage = (function (_super) {
        __extends(SlidePage, _super);
        /**
         * 构造函数
         * @method SlidePage
         * @public
         * @since 1.0.2
         * @param option      配置对象{pageList:pageList,callback:Fun,isVertical:true}
         * @param{array}pageList     页面数组
         * @param{method}callback    回调函数
         * @param{boolean}isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @param{number}slideSpeed  页面滑动速度
         * @example
         *      var slideBox = new annieUI.SlidePage({
         *      pageList: [new Page1(), new Page2(), new Page3(), new Page4()],//页面数组集
         *      isVertical: true,//默认值为true,ture为纵向,falas为横向
         *      slideSpeed: .32,//默认值为.4，滑动速度
         *      callback:callback//滑动完成回调函数
         *       });
         */
        function SlidePage(option) {
            _super.call(this);
            /**
             * 页面个数
             * @property listLen
             * @type {number}
             * @private
             * @default 0
             * @since 1.0.2
             */
            this.listLen = 0;
            /**
             * 容器活动速度
             * @property slideSpeed
             * @type {number}
             * @private
             * @default 0
             */
            this.slideSpeed = 0;
            /**
             * 触摸点开始点X
             * @property touchStartX
             * @type {number}
             * @private
             */
            this.touchStartX = 0;
            /**
             * 触摸点开始点Y
             * @property touchStartY
             * @type {number}
             * @private
             */
            this.touchStartY = 0;
            /**
             * 触摸点结束点X
             * @property touchEndX
             * @type {number}
             * @private
             */
            this.touchEndX = 0;
            /**
             * 触摸点结束点Y
             * @property touchEndY
             * @type {number}
             * @private
             */
            this.touchEndY = 0;
            /**
             * 当前页面索引ID
             * @property currentPageIndex
             * @type {number}
             * @public
             */
            this.currentPageIndex = 0;
            /**
             * 页面是否移动
             * @property currentPageIndex
             * @type {boolean}
             * @public
             */
            this.isMoving = false;
            /**
             * 舞台宽
             * @property stageW
             * @type {number}
             * @private
             */
            this.stageW = 0;
            /**
             * 舞台高
             * @property stageH
             * @type {number}
             * @private
             */
            this.stageH = 0;
            /**
             * 两点距离
             * @property distance
             * @type {number}
             * @private
             */
            this.distance = 0;
            /**
             *
             * @property fSpeed
             * @type {number}
             * @private
             */
            this.fSpeed = 10;
            /**
             * 是否点击了鼠标
             * @property fSpeed
             * @type {boolean}
             * @private
             */
            this.isMouseDown = false;
            /**
             * 是否可以下一页
             * @type {boolean}
             * @type {boolean}
             * @public
             */
            this.canSlideNext = true;
            /**
             * 是否可以上一页
             * @type {boolean}
             * @type {boolean}
             * @public
             */
            this.canSlidePrev = true;
            this.slideDirection = 'next';
            /**
             * 是否为数组
             * @param obj
             * @returns {boolean}
             * @private
             */
            this.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };
            var s = this;
            if (!s.isArray(option['pageList'])) {
                throw 'pageList参数数据格式不对！pageList应为页面对象列表数组';
            }
            if (!s.isFunction(option['callback'])) {
                throw 'callback参数数据格式不对！callback应为函数';
            }
            s.pageList = option['pageList'];
            s.callback = option['callback'];
            s.isVertical = option['isVertical'] ? option['isVertical'] : true;
            s.canSlidePrev = option['canSlidePrev'] ? option['canSlidePrev'] : true;
            s.canSlideNext = option['canSlideNext'] ? option['canSlideNext'] : true;
            s.slideSpeed = option['slideSpeed'] ? option['slideSpeed'] : .4;
            s.addEventListener(annie.Event.ADD_TO_STAGE, s.onAddToStage.bind(s));
            // console.log(s);
        }
        /**
         * 是否为函数
         * @param fn
         * @returns {boolean}
         * @private
         */
        SlidePage.prototype.isFunction = function (fn) {
            return typeof fn === 'function';
        };
        /**
         * 添加到舞台
         * @param e
         */
        SlidePage.prototype.onAddToStage = function (e) {
            var s = this;
            s.stageW = s.stage.width;
            s.stageH = s.stage.height;
            s.listLen = s.pageList.length; //页面个数
            s.slideCon = new annie.Sprite();
            for (var i = 0; i < s.listLen; i++) {
                s.pageList[i].pageId = i;
                s.pageList[i].visible = true;
                s.pageList[i].canSlidePrev = true;
                s.pageList[i].canSlideNext = true;
                if (s.isVertical) {
                    s.pageList[i].y = i * s.stageH;
                }
                else {
                    s.pageList[i].x = i * s.stageW;
                }
                s.pageList[0].visible = true;
                s.slideCon.addChild(s.pageList[i]);
            }
            if (s.isMoving) {
                s.slideCon.mouseEnable = false;
                s.slideCon.mouseChildren = false;
            }
            s.slideCon.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEventHandler.bind(s));
            s.slideCon.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEventHandler.bind(s));
            s.slideCon.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEventHandler.bind(s));
            s.addChild(s.slideCon);
        };
        /**
         * 触摸事件
         * @param e
         */
        SlidePage.prototype.onMouseEventHandler = function (e) {
            var s = this;
            if (s.isMoving) {
                return;
            }
            if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                s.touchStartX = e.stageX;
                s.touchStartY = e.stageY;
                s.isMouseDown = true;
            }
            else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (!s.isMouseDown) {
                    return;
                }
                s.touchEndX = e.stageX;
                s.touchEndY = e.stageY;
                // s.distance = s.getDistance(s.touchStartX, s.touchStartY, s.touchEndX, s.touchEndY);
                if (s.isVertical) {
                    if (s.currentPageIndex == 0) {
                        if (s.touchStartY < s.touchEndY) {
                            s.slideCon.y += Math.abs(s.touchStartY - s.touchEndY) / s.stageH * s.fSpeed * 0.6;
                        }
                    }
                    if (s.currentPageIndex == s.listLen - 1) {
                        if (s.touchStartY > s.touchEndY) {
                            s.slideCon.y -= Math.abs(s.touchStartY - s.touchEndY) / s.stageH * s.fSpeed * 0.6;
                        }
                    }
                }
                else {
                    if (s.currentPageIndex == 0) {
                        if (s.touchStartX < s.touchEndX) {
                            s.slideCon.x += Math.abs(s.touchStartX - s.touchEndX) / s.stageW * s.fSpeed * 0.6;
                        }
                    }
                    if (s.currentPageIndex == s.listLen - 1) {
                        if (s.touchStartX > s.touchEndX) {
                            s.slideCon.x -= Math.abs(s.touchStartX - s.touchEndX) / s.stageW * s.fSpeed * 0.6;
                        }
                    }
                }
            }
            else if (e.type == annie.MouseEvent.MOUSE_UP) {
                if (s.isMoving) {
                    return;
                }
                s.isMouseDown = false;
                s.touchEndX = e.stageX;
                s.touchEndY = e.stageY;
                s.distance = s.getDistance(s.touchStartX, s.touchStartY, s.touchEndX, s.touchEndY);
                if (s.distance > 24) {
                    if (s.isVertical) {
                        s.slideDirection = s.touchStartY > s.touchEndY ? 'next' : 'prev';
                    }
                    else {
                        s.slideDirection = s.touchStartX > s.touchEndX ? 'next' : 'prev';
                    }
                    if (s.slideDirection == 'next') {
                        globalDispatcher.dispatchEvent(new annie.Event('onSlideNextEvent'));
                        if (s.currentPageIndex < s.listLen - 1) {
                            if (!s.canSlideNext || !s.pageList[s.currentPageIndex].canSlideNext) {
                                return;
                            }
                            // s.pageList[s.currentPageIndex + 1].visible = true;
                            s.currentPageIndex++;
                            s.slideToIndex(s.currentPageIndex);
                        }
                        else {
                            s.isVertical == true ? annie.Tween.to(s.slideCon, .2, {
                                y: -s.stageH * (s.listLen - 1),
                                ease: annie.Tween.backOut
                            }) : annie.Tween.to(s.slideCon, .2, {
                                x: -s.stageW * (s.listLen - 1),
                                ease: annie.Tween.backOut
                            });
                        }
                    }
                    else {
                        globalDispatcher.dispatchEvent(new annie.Event('onSlidePrevEvent'));
                        if (s.currentPageIndex > 0) {
                            if (!s.canSlidePrev || !s.pageList[s.currentPageIndex].canSlidePrev) {
                                return;
                            }
                            // s.pageList[s.currentPageIndex - 1].visible = true;
                            s.currentPageIndex--;
                            s.slideToIndex(s.currentPageIndex);
                        }
                        else {
                            s.isVertical == true ? annie.Tween.to(s.slideCon, .2, {
                                y: 0,
                                ease: annie.Tween.backOut
                            }) : annie.Tween.to(s.slideCon, .2, { x: 0, ease: annie.Tween.backOut });
                        }
                    }
                }
            }
        };
        /**
         * 滑动到指定页
         * @method slideToIndex
         * @param index 页面索引
         * @public
         * @since 1.0.2
         */
        SlidePage.prototype.slideToIndex = function (index) {
            var s = this;
            if (s.isMoving) {
                return;
            }
            if (s.isVertical) {
                annie.Tween.to(s.slideCon, s.slideSpeed, {
                    y: -index * s.stage.height, onComplete: function () {
                        s.isFunction(s.callback) && s.callback(index);
                        // setTimeout(function () {
                        //     for (var i = 0; i < s.listLen; i++) {
                        //         if (s.currentPageIndex != s.pageList[i].pageId)
                        //             s.pageList[i].visible = false;
                        //     }
                        // }, 200);
                        s.slideCon.mouseEnable = true;
                        s.slideCon.mouseChildren = true;
                        s.isMoving = false;
                    }
                });
                s.isMoving = true;
            }
            else {
                annie.Tween.to(s.slideCon, s.slideSpeed, {
                    x: -index * s.stage.width, onComplete: function () {
                        s.isFunction(s.callback) && s.callback(index);
                        // setTimeout(function () {
                        //     for (var i = 0; i < s.listLen; i++) {
                        //         if (s.currentPageIndex != s.pageList[i].pageId)
                        //             s.pageList[i].visible = false;
                        //     }
                        // }, 200);
                        s.slideCon.mouseEnable = true;
                        s.slideCon.mouseChildren = true;
                        s.isMoving = false;
                    }
                });
                s.isMoving = true;
            }
            s.currentPageIndex = index;
        };
        /**
         * 用于插入分页
         * @method addPageList
         * @public
         * @since 1.0.2
         * @param list 页面数组对象
         */
        SlidePage.prototype.addPageList = function (list) {
            var s = this;
            if (!s.isArray(list)) {
                throw 'list应为页面对象列表数组';
            }
            var addListLen = list.length;
            // console.log('addLisLen:'+addListLen);
            for (var i = 0; i < addListLen; i++) {
                list[i].pageId = s.listLen;
                list[i].visible = true;
                list[i].canSlidePrev = true;
                list[i].canSlideNext = true;
                if (s.isVertical) {
                    list[i].y = s.listLen * s.stageH;
                }
                else {
                    list[i].x = s.listLen * s.stageW;
                }
                s.pageList.push(list[i]);
                s.listLen = s.pageList.length;
                // console.log('加长度后：'+s.listLen);
                s.slideCon.addChildAt(list[i], s.listLen);
            }
        };
        /**
         * 平面中两点距离公式
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         * @returns {number}
         */
        SlidePage.prototype.getDistance = function (x1, y1, x2, y2) {
            var x1 = x1;
            var y1 = y1;
            var x2 = x2;
            var y2 = y2;
            var xdiff = x2 - x1;
            var ydiff = y2 - y1;
            var dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            return dis;
        };
        return SlidePage;
    }(Sprite));
    annieUI.SlidePage = SlidePage;
})(annieUI || (annieUI = {}));
