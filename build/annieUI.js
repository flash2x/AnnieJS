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
         * @example
         *      s.sPage=new annieUI.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
         */
        function ScrollPage(vW, vH, maxDistance, isVertical) {
            if (isVertical === void 0) { isVertical = true; }
            var _this = _super.call(this) || this;
            /**
             * 横向还是纵向 默认为纵向
             * @property isVertical
             * @type {boolean}
             * @private
             * @since 1.0.0
             * @default true
             */
            _this.isVertical = true;
            /**
             * 可见区域的宽
             * @property viewWidth
             * @type {number}
             * @private
             * @since 1.0.0
             * @default 0
             */
            _this.viewWidth = 0;
            /**
             * 可见区域的高
             * @property viewHeight
             * @type {number}
             * @private
             * @since 1.0.0
             * @default 0
             */
            _this.viewHeight = 0;
            /**
             * 整个滚动的最大距离值
             * @property maxDistance
             * @type {number}
             * @public
             * @since 1.0.0
             * @default 1040
             */
            _this.maxDistance = 1040;
            /**
             * @property 滚动距离
             * @type {number}
             * @private
             * @default 0
             * @since 1.0.0
             */
            _this.distance = 0;
            /**
             * 最小鼠标滑动距离
             * @type {number}
             */
            _this.minDis = 2;
            /**
             * 遮罩对象
             * @property maskObj
             * @since 1.0.0
             * @private
             * @type {annie.Shape}
             */
            _this.maskObj = null;
            /**
             * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
             * @property view
             * @public
             * @since 1.0.0
             * @type {annie.Sprite}
             */
            _this.view = null;
            /**
             * 最后鼠标经过的坐标值
             * @property lastValue
             * @private
             * @since 1.0.0
             * @type {number}
             */
            _this.lastValue = 0;
            /**
             * 速度
             * @property speed
             * @private
             * @since 1.0.0
             * @type {number}
             */
            _this.speed = 0;
            /**
             * 加速度
             * @property addSpeed
             * @private
             * @since 1.0.0
             * @type {number}
             */
            _this.addSpeed = 0;
            /**
             * 是否是停止滚动状态
             * @property isStop
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default true
             */
            _this.isStop = true;
            /**
             * 滚动的最大速度，直接影响一次滑动之后最长可以滚多远
             * @property maxSpeed
             * @public
             * @since 1.0.0
             * @default 100
             * @type {number}
             */
            _this.maxSpeed = 100;
            /**
             * 摩擦力,值越大，减速越快
             * @property fSpeed
             * @public
             * @since 1.0.0
             * @default 20
             * @type {number}
             */
            _this.fSpeed = 20;
            _this.paramXY = "y";
            _this.stopTimes = -1;
            _this.isMouseDown = false;
            /**
             * 是否是通过scrollTo方法在滑动中
             * @property autoScroll
             * @since 1.0.2
             * @type {boolean}
             * @private
             * @default false;
             */
            _this.autoScroll = false;
            var s = _this;
            s._instanceType = "annieUI.ScrollPage";
            s.isVertical = isVertical;
            s.view = new Sprite();
            s.maskObj = new Shape();
            s.maskObj.alpha = 0;
            s.addChild(s.maskObj);
            s.addChild(s.view);
            s.view.mask = s.maskObj;
            s.setMask(vW, vH);
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
            return _this;
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
                    var currentValue = void 0;
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
        /**
         * 构造函数
         * @method  FacePhoto
         * @since 1.0.0
         * @public
         * @example
         *      var circleface = new annieUI.FacePhoto(),
         *          rectFace=new annieUI.FacePhoto();
         *          //圆形头像
         *          circleface.init('http://test.annie2x.com/biglong/logo.jpg', 100, 0);
         *          circleface.x = 260;
         *          circleface.y = 100;
         *          s.addChild(circleface);
         *          //方形头像
         *          rectFace.init('http://test.annie2x.com/biglong/logo.jpg', 200, 1);
         *          rectFace.x = 260;
         *          rectFace.y = 400;
         *          s.addChild(rectFace);
         */
        function FacePhoto() {
            var _this = _super.call(this) || this;
            _this.maskType = 0;
            var s = _this;
            s._instanceType = "annieUI.FacePhoto";
            s.photo = new Image();
            s.bitmap = new annie.Bitmap();
            s.maskObj = new annie.Shape();
            s.photo.onload = function (e) {
                s.bitmap.bitmapData = s.photo;
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                var scale = s.radio / (s.photo.width < s.photo.height ? s.photo.width : s.photo.height);
                s.bitmap.scaleX = s.bitmap.scaleY = scale;
                s.bitmap.x = (s.radio - s.photo.width * scale) >> 1;
                s.bitmap.y = (s.radio - s.photo.height * scale) >> 1;
                if (s.maskType == 0) {
                    s.maskObj.drawCircle(s.radio >> 1, s.radio >> 1, s.radio >> 1);
                }
                else {
                    s.maskObj.drawRect(0, 0, s.radio, s.radio);
                }
                s.maskObj.endFill();
            };
            s.addChild(s.bitmap);
            s.bitmap.mask = s.maskObj;
            return _this;
        }
        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param src 头像的地址
         * @param radio 指定头像的长宽或者直径
         * @param maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形 1方形
         */
        FacePhoto.prototype.init = function (src, radio, maskType) {
            if (radio === void 0) { radio = 0; }
            if (maskType === void 0) { maskType = 0; }
            var s = this;
            s.radio = radio;
            if (s.photo.src != src)
                s.photo.src = src;
            if (s.maskType != maskType)
                s.maskType = maskType;
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
     * @since 1.0.0
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
         *       slideBox.slideToIndex(2);//滑动到第2屏
         *       slideBox.addPageList(new Page5());//添加一屏内容
         * <p><a href="https://github.com/flash2x/demo5" target="_blank">测试链接</a></p>
         */
        function SlidePage(option) {
            var _this = _super.call(this) || this;
            /**
             * 页面个数
             * @property listLen
             * @type {number}
             * @private
             * @default 0
             */
            _this.listLen = 0;
            /**
             * 容器活动速度
             * @property slideSpeed
             * @type {number}
             * @private
             * @default 0
             */
            _this.slideSpeed = 0;
            /**
             * 触摸点开始点X
             * @property touchStartX
             * @type {number}
             * @private
             */
            _this.touchStartX = 0;
            /**
             * 触摸点开始点Y
             * @property touchStartY
             * @type {number}
             * @private
             */
            _this.touchStartY = 0;
            /**
             * 触摸点结束点X
             * @property touchEndX
             * @type {number}
             * @private
             */
            _this.touchEndX = 0;
            _this.movingX = 0;
            _this.movingY = 0;
            /**
             * 触摸点结束点Y
             * @property touchEndY
             * @type {number}
             * @private
             * @since
             * @public
             * @default 0
             */
            _this.touchEndY = 0;
            /**
             * 当前页面索引ID
             * @property currentPageIndex
             * @type {number}
             * @public
             * @since 1.0.3
             * @default 0
             */
            _this.currentPageIndex = 0;
            /**
             * 页面是否移动
             * @property currentPageIndex
             * @type {boolean}
             * @public
             * @default false
             * @public
             */
            _this.isMoving = false;
            /**
             * 舞台宽
             * @property stageW
             * @type {number}
             * @private
             */
            _this.stageW = 0;
            /**
             * 舞台高
             * @property stageH
             * @type {number}
             * @private
             */
            _this.stageH = 0;
            /**
             * 两点距离
             * @property distance
             * @type {number}
             * @private
             */
            _this.distance = 0;
            /**
             *
             * @property fSpeed
             * @type {number}
             * @private
             */
            _this.fSpeed = 10;
            /**
             * 是否点击了鼠标
             * @property fSpeed
             * @type {boolean}
             * @private
             */
            _this.isMouseDown = false;
            /**
             * 是否可以下一页
             * @property canSlideNext
             * @since 1.0.3
             * @default true
             * @type {boolean}
             * @public
             */
            _this.canSlideNext = true;
            /**
             * 是否可以上一页
             * @property canSlidePrev
             * @type {boolean}
             * @public
             * @default true
             */
            _this.canSlidePrev = true;
            /**
             * @property slideDirection
             * @type {string}
             * @since 1.0.3
             * @public
             * @default "next"
             */
            _this.slideDirection = 'next';
            /**
             * 是否为数组
             * @param obj
             * @returns {boolean}
             * @private
             */
            _this.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };
            var s = _this;
            if (!s.isArray(option['pageList'])) {
                throw 'pageList参数数据格式不对！pageList应为页面对象列表数组';
            }
            if (!s.isFunction(option['callback'])) {
                throw 'callback参数数据格式不对！callback应为函数';
            }
            s.pageList = option['pageList'];
            s.onMoveStart = option['onMoveStart'];
            s.callback = option['callback'];
            s.isVertical = option['isVertical'] ? option['isVertical'] : true;
            s.canSlidePrev = option['canSlidePrev'] ? option['canSlidePrev'] : true;
            s.canSlideNext = option['canSlideNext'] ? option['canSlideNext'] : true;
            s.slideSpeed = option['slideSpeed'] ? option['slideSpeed'] : .4;
            s.addEventListener(annie.Event.ADD_TO_STAGE, s.onAddToStage.bind(s));
            return _this;
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
            s.stageW = s.stage.desWidth;
            s.stageH = s.stage.desHeight;
            s.listLen = s.pageList.length; //页面个数
            s.view = new annie.Sprite();
            for (var i = 0; i < s.listLen; i++) {
                s.pageList[i].pageId = i;
                s.pageList[i].canSlidePrev = true;
                s.pageList[i].canSlideNext = true;
                if (s.isVertical) {
                    s.pageList[i].y = i * s.stageH;
                }
                else {
                    s.pageList[i].x = i * s.stageW;
                }
                s.view.addChild(s.pageList[i]);
            }
            if (s.isMoving) {
                s.view.mouseEnable = false;
                s.view.mouseChildren = false;
            }
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEventHandler.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEventHandler.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEventHandler.bind(s));
            s.addChild(s.view);
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
                s.touchStartX = s.touchEndX = e.localX;
                s.touchStartY = s.touchEndY = e.localY;
                s.movingX = s.movingY = 0;
                s.isMouseDown = true;
            }
            else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (!s.isMouseDown) {
                    return;
                }
                var movingX = e.localX - s.touchEndX;
                var movingY = e.localY - s.touchEndY;
                if (s.movingX != 0 && s.movingY != 0) {
                    if ((s.movingX > 0 && movingX < 0) || (s.movingX < 0 && movingX > 0) || (s.movingY > 0 && movingY < 0) || (s.movingY < 0 && movingY > 0)) {
                        s.isMouseDown = false;
                    }
                }
                s.touchEndX = e.localX;
                s.touchEndY = e.localY;
                s.movingX = movingX;
                s.movingY = movingY;
                // s.distance = s.getDistance(s.touchStartX, s.touchStartY, s.touchEndX, s.touchEndY);
                if (s.isVertical) {
                    if (s.currentPageIndex == 0) {
                        if (s.touchStartY < s.touchEndY) {
                            s.view.y += Math.abs(s.touchStartY - s.touchEndY) / s.stageH * s.fSpeed * 0.6;
                        }
                    }
                    if (s.currentPageIndex == s.listLen - 1) {
                        if (s.touchStartY > s.touchEndY) {
                            s.view.y -= Math.abs(s.touchStartY - s.touchEndY) / s.stageH * s.fSpeed * 0.6;
                        }
                    }
                }
                else {
                    if (s.currentPageIndex == 0) {
                        if (s.touchStartX < s.touchEndX) {
                            s.view.x += Math.abs(s.touchStartX - s.touchEndX) / s.stageW * s.fSpeed * 0.6;
                        }
                    }
                    if (s.currentPageIndex == s.listLen - 1) {
                        if (s.touchStartX > s.touchEndX) {
                            s.view.x -= Math.abs(s.touchStartX - s.touchEndX) / s.stageW * s.fSpeed * 0.6;
                        }
                    }
                }
            }
            else if (e.type == annie.MouseEvent.MOUSE_UP) {
                if (s.isMoving || !s.isMouseDown) {
                    return;
                }
                s.isMouseDown = false;
                s.distance = s.getDistance(s.touchStartX, s.touchStartY, s.touchEndX, s.touchEndY);
                if (s.distance > 50) {
                    if (s.isVertical) {
                        s.slideDirection = s.touchStartY > s.touchEndY ? 'next' : 'prev';
                    }
                    else {
                        s.slideDirection = s.touchStartX > s.touchEndX ? 'next' : 'prev';
                    }
                    if (s.slideDirection == 'next') {
                        s.dispatchEvent(new annie.Event('onSlideNextEvent'));
                        if (s.currentPageIndex < s.listLen - 1) {
                            if (!s.canSlideNext || !s.pageList[s.currentPageIndex].canSlideNext) {
                                return;
                            }
                            s.currentPageIndex++;
                            s.slideToIndex(s.currentPageIndex);
                        }
                        else {
                            s.isVertical == true ? annie.Tween.to(s.view, .2, {
                                y: -s.stageH * (s.listLen - 1),
                                ease: annie.Tween.backOut
                            }) : annie.Tween.to(s.view, .2, {
                                x: -s.stageW * (s.listLen - 1),
                                ease: annie.Tween.backOut
                            });
                        }
                    }
                    else {
                        s.dispatchEvent(new annie.Event('onSlidePrevEvent'));
                        if (s.currentPageIndex > 0) {
                            if (!s.canSlidePrev || !s.pageList[s.currentPageIndex].canSlidePrev) {
                                return;
                            }
                            s.currentPageIndex--;
                            s.slideToIndex(s.currentPageIndex);
                        }
                        else {
                            s.isVertical == true ? annie.Tween.to(s.view, .2, {
                                y: 0,
                                ease: annie.Tween.backOut
                            }) : annie.Tween.to(s.view, .2, { x: 0, ease: annie.Tween.backOut });
                        }
                    }
                }
            }
        };
        /**
         * 滑动到指定页
         * @method slideToIndex
         * @public
         * @since 1.0.3
         * @param index 页面索引
         */
        SlidePage.prototype.slideToIndex = function (index) {
            var s = this;
            if (s.isMoving) {
                return;
            }
            if (s.isVertical) {
                annie.Tween.to(s.view, s.slideSpeed, {
                    y: -index * s.stageH, onComplete: function () {
                        s.isFunction(s.callback) && s.callback(index);
                        // setTimeout(function () {
                        //     for (var i = 0; i < s.listLen; i++) {
                        //         if (s.currentPageIndex != s.pageList[i].pageId)
                        //             s.pageList[i].visible = false;
                        //     }
                        // }, 200);
                        s.view.mouseEnable = true;
                        s.view.mouseChildren = true;
                        s.isMoving = false;
                    }
                });
                s.isMoving = true;
            }
            else {
                annie.Tween.to(s.view, s.slideSpeed, {
                    x: -index * s.stageW, onComplete: function () {
                        s.isFunction(s.callback) && s.callback(index);
                        // setTimeout(function () {
                        //     for (var i = 0; i < s.listLen; i++) {
                        //         if (s.currentPageIndex != s.pageList[i].pageId)
                        //             s.pageList[i].visible = false;
                        //     }
                        // }, 200);
                        s.view.mouseEnable = true;
                        s.view.mouseChildren = true;
                        s.isMoving = false;
                    }
                });
                s.isMoving = true;
            }
            s.currentPageIndex = index;
            s.isFunction(s.onMoveStart) && s.onMoveStart(index); //开始滑动动画
        };
        /**
         * 用于插入分页
         * @method addPageList
         * @param list 页面数组对象
         * @since 1.0.3
         * @public
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
                s.view.addChildAt(list[i], s.listLen);
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
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    var Shape = annie.Shape;
    var Event = annie.Event;
    var MouseEvent = annie.MouseEvent;
    var Point = annie.Point;
    /**
     * 电子杂志组件类
     * @class annieUI.FlipBook
     * @public
     * @extends annie.Sprite
     * @since 1.0.3
     */
    var FlipBook = (function (_super) {
        __extends(FlipBook, _super);
        function FlipBook() {
            var _this = _super.call(this) || this;
            //可设置或可调用接口,页数以单页数计算~
            /**
             * 总页数
             * @property totalPage
             * @type {number}
             */
            _this.totalPage = 0;
            /**
             * 当前页数
             * @property
             * @type {number}
             * @since 1.0.3
             */
            _this.currPage = 0;
            _this.state = "stop";
            _this.timerArg0 = 0;
            _this.timerArg1 = 0;
            _this.px = 0;
            _this.py = 0;
            _this.rPage0 = new Sprite();
            _this.rPage1 = new Sprite();
            _this.pageMC = new Sprite();
            _this.leftPage = null;
            _this.rightPage = null;
            _this.rMask0 = new Shape();
            _this.rMask1 = new Shape();
            _this.shadow0 = new Shape();
            _this.shadow1 = new Shape();
            _this.sMask0 = new Shape();
            _this.sMask1 = new Shape();
            _this.pages = [];
            _this.stageMP = new Point();
            /**
             * 指定是否能够翻页动作
             * @property canFlip
             * @since 1.0.3
             * @type {boolean}
             */
            _this.canFlip = true;
            _this._instanceType = "annieUI.FlipBook";
            return _this;
        }
        /**
         * 初始化电子杂志
         * @method init
         * @param width 单页宽
         * @param height 单页高
         * @param pageCount 总页数，一般为偶数
         * @param getPageCallBack，通过此回调获取指定页的内容的显示对象
         * @since 1.0.3
         */
        FlipBook.prototype.init = function (width, height, pageCount, getPageCallBack) {
            var s = this;
            s.getPageCallback = getPageCallBack;
            s.bW = width;
            s.bH = height;
            s.totalPage = pageCount;
            s.currPage = s.toPage = 0;
            s.crossGap = Math.sqrt(s.bW * s.bW + s.bH * s.bH);
            s.p1 = new Point(0, 0);
            s.p2 = new Point(0, s.bH);
            s.p3 = new Point(s.bW + s.bW, 0);
            s.p4 = new Point(s.bW + s.bW, s.bH);
            s.limitP1 = new Point(s.bW, 0);
            s.limitP2 = new Point(s.bW, s.bH);
            s.toPosArr = [s.p3, s.p4, s.p1, s.p2];
            s.myPosArr = [s.p1, s.p2, s.p3, s.p4];
            s.addChild(s.pageMC);
            s.addChild(s.rPage0);
            s.addChild(s.shadow0);
            s.addChild(s.rPage1);
            s.addChild(s.shadow1);
            s.setShadowMask(s.shadow0, s.sMask0, s.bW * 1.5, s.bH * 3);
            s.setShadowMask(s.shadow1, s.sMask1, s.bW * 1.5, s.bH * 3);
            s.shadow0.visible = false;
            s.shadow1.visible = false;
            s.rPage1.mask = s.rMask1;
            s.rPage0.mask = s.rMask0;
            s.setPage(s.currPage);
            s.stage.addEventListener(MouseEvent.MOUSE_DOWN, s.onMouseDown.bind(s));
            s.stage.addEventListener(MouseEvent.MOUSE_UP, s.onMouseUp.bind(s));
            s.stage.addEventListener(MouseEvent.MOUSE_MOVE, s.onMouseMove.bind(s));
            s.addEventListener(Event.ENTER_FRAME, s.onEnterFrame.bind(s));
        };
        FlipBook.prototype.drawPage = function (num, movePoint) {
            var s = this;
            var actionPoint;
            var bArr;
            if (num == 1) {
                movePoint = s.checkLimit(movePoint, s.limitP1, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP2, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p1, s.p2);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p1, s.p2, s.limitP1, s.limitP2);
                s.getShadow(s.shadow0, s.sMask0, s.p1, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p1, movePoint, s.layer1Arr, 0.45);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) + 90;
                s.rPage1.x = bArr[3].x;
                s.rPage1.y = bArr[3].y;
                s.rPage0.x = s.p1.x;
                s.rPage0.y = s.p1.y;
            }
            else if (num == 2) {
                movePoint = s.checkLimit(movePoint, s.limitP2, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP1, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p2, s.p1);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p2, s.p1, s.limitP2, s.limitP1);
                s.getShadow(s.shadow0, s.sMask0, s.p2, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p2, movePoint, s.layer1Arr, 0.45);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) - 90;
                s.rPage1.x = bArr[2].x;
                s.rPage1.y = bArr[2].y;
                s.rPage0.x = s.p1.x;
                s.rPage0.y = s.p1.y;
            }
            else if (num == 3) {
                movePoint = s.checkLimit(movePoint, s.limitP1, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP2, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p3, s.p4);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p3, s.p4, s.limitP1, s.limitP2);
                s.getShadow(s.shadow0, s.sMask0, s.p3, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p3, movePoint, s.layer1Arr, 0.4);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) + 90;
                s.rPage1.x = movePoint.x;
                s.rPage1.y = movePoint.y;
                s.rPage0.x = s.limitP1.x;
                s.rPage0.y = s.limitP1.y;
            }
            else {
                movePoint = s.checkLimit(movePoint, s.limitP2, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP1, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p4, s.p3);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p4, s.p3, s.limitP2, s.limitP1);
                s.getShadow(s.shadow0, s.sMask0, s.p4, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p4, movePoint, s.layer1Arr, 0.4);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) - 90;
                s.rPage1.x = actionPoint.x;
                s.rPage1.y = actionPoint.y;
                s.rPage0.x = s.limitP1.x;
                s.rPage0.y = s.limitP1.y;
            }
            s.getShape(s.rMask1, s.layer1Arr);
            s.getShape(s.rMask0, s.layer0Arr);
        };
        FlipBook.prototype.checkLimit = function (point, limitPoint, limitGap) {
            var s = this;
            var gap = Math.abs(s.pos(limitPoint, point));
            var angle = s.angle(limitPoint, point);
            if (gap > limitGap) {
                var tmp1 = limitGap * Math.sin((angle / 180) * Math.PI);
                var tmp2 = limitGap * Math.cos((angle / 180) * Math.PI);
                point = new Point(limitPoint.x - tmp2, limitPoint.y - tmp1);
            }
            return point;
        };
        FlipBook.prototype.getPage = function (index) {
            var s = this;
            if (!s.pages[index - 1]) {
                s.pages[index - 1] = s.getPageCallback(index);
            }
            return s.pages[index - 1];
        };
        FlipBook.prototype.getBookArr = function (point, actionPoint1, actionPoint2) {
            var s = this;
            var bArr = [];
            var gap1 = Math.abs(s.pos(actionPoint1, point) * 0.5);
            var angle1 = s.angle(actionPoint1, point);
            var tmp1_2 = gap1 / Math.cos((angle1 / 180) * Math.PI);
            var tmpPoint1 = new Point(actionPoint1.x - tmp1_2, actionPoint1.y);
            var angle2 = s.angle(point, tmpPoint1) - s.angle(point, actionPoint2);
            var gap2 = s.pos(point, actionPoint2);
            var tmp2_1 = gap2 * Math.sin((angle2 / 180) * Math.PI);
            var tmp2_2 = gap2 * Math.cos((angle2 / 180) * Math.PI);
            var tmpPoint2 = new Point(actionPoint1.x + tmp2_2, actionPoint1.y + tmp2_1);
            var angle3 = s.angle(tmpPoint1, point);
            var tmp3_1 = s.bW * Math.sin((angle3 / 180) * Math.PI);
            var tmp3_2 = s.bW * Math.cos((angle3 / 180) * Math.PI);
            var tmpPoint3 = new Point(tmpPoint2.x + tmp3_2, tmpPoint2.y + tmp3_1);
            var tmpPoint4 = new Point(point.x + tmp3_2, point.y + tmp3_1);
            bArr.push(point);
            bArr.push(tmpPoint2);
            bArr.push(tmpPoint3);
            bArr.push(tmpPoint4);
            return bArr;
        };
        FlipBook.prototype.getLayerArr = function (point1, point2, actionPoint1, actionPoint2, limitPoint1, limitPoint2) {
            var s = this;
            var arrLayer1 = [];
            var arrLayer2 = [];
            var gap1 = Math.abs(s.pos(actionPoint1, point1) * 0.5);
            var angle1 = s.angle(actionPoint1, point1);
            var tmp1_1 = gap1 / Math.sin((angle1 / 180) * Math.PI);
            var tmp1_2 = gap1 / Math.cos((angle1 / 180) * Math.PI);
            var tmpPoint1 = new Point(actionPoint1.x - tmp1_2, actionPoint1.y);
            var tmpPoint2 = new Point(actionPoint1.x, actionPoint1.y - tmp1_1);
            var tmpPoint3 = point2;
            var gap2 = Math.abs(s.pos(point1, actionPoint2));
            if (gap2 > s.bH) {
                arrLayer1.push(tmpPoint3);
                var pos = Math.abs(s.pos(tmpPoint3, actionPoint2) * 0.5);
                var tmp3 = pos / Math.cos((angle1 / 180) * Math.PI);
                tmpPoint2 = new Point(actionPoint2.x - tmp3, actionPoint2.y);
            }
            else {
                arrLayer2.push(actionPoint2);
            }
            arrLayer1.push(tmpPoint2);
            arrLayer1.push(tmpPoint1);
            arrLayer1.push(point1);
            s.layer1Arr = arrLayer1;
            arrLayer2.push(limitPoint2);
            arrLayer2.push(limitPoint1);
            arrLayer2.push(tmpPoint1);
            arrLayer2.push(tmpPoint2);
            s.layer0Arr = arrLayer2;
        };
        FlipBook.prototype.getShape = function (shape, pointArr) {
            var num = pointArr.length;
            shape.clear();
            shape.beginFill("#000");
            shape.moveTo(pointArr[0].x, pointArr[0].y);
            for (var i = 1; i < num; i++) {
                shape.lineTo(pointArr[i].x, pointArr[i].y);
            }
            shape.endFill();
        };
        FlipBook.prototype.setShadowMask = function (shape, maskShape, g_width, g_height) {
            shape.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"], [0, 1], [-g_width * 0.5, 4, g_width * 0.5, 4]);
            shape.drawRect(-g_width * 0.5, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
            shape.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"], [1, 0], [-g_width * 0.5, 4, g_width * 0.5, 4]);
            shape.drawRect(0, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
            shape.mask = maskShape;
        };
        FlipBook.prototype.getShadow = function (shape, maskShape, point1, point2, maskArray, arg) {
            var myScale;
            var myAlpha;
            var s = this;
            shape.visible = true;
            shape.x = point2.x + (point1.x - point2.x) * arg;
            shape.y = point2.y + (point1.y - point2.y) * arg;
            shape.rotation = s.angle(point1, point2);
            myScale = Math.abs(point1.x - point2.x) * 0.5 / s.bW;
            myAlpha = 1 - myScale * myScale;
            shape.scaleX = myScale + 0.1;
            shape.alpha = myAlpha + 0.1;
            s.getShape(maskShape, maskArray);
        };
        FlipBook.prototype.setPage = function (pageNum) {
            var s = this;
            if (pageNum > 0 && pageNum <= s.totalPage) {
                s.leftPage = s.getPage(pageNum);
                s.leftPage.x = s.leftPage.y = 0;
                s.pageMC.addChild(s.leftPage);
            }
            if ((pageNum + 1) > 0 && (pageNum + 1) < s.totalPage) {
                s.rightPage = s.getPage(pageNum + 1);
                s.rightPage.x = s.bW;
                s.rightPage.y = 0;
                s.pageMC.addChild(s.rightPage);
            }
        };
        FlipBook.prototype.onMouseDown = function (e) {
            var s = this;
            if (!s.canFlip || s.state != "stop") {
                return;
            }
            s.stageMP.x = e.clientX;
            s.stageMP.y = e.clientY;
            var p = s.globalToLocal(s.stageMP);
            s.stageMP = p;
            s.timerArg0 = s.checkArea(p);
            s.timerArg0 = s.timerArg0 < 0 ? -s.timerArg0 : s.timerArg0;
            if (s.timerArg0 > 0) {
                if ((s.timerArg0 < 3 && s.currPage > 0) || (s.timerArg0 > 2 && s.currPage <= s.totalPage - 2)) {
                    s.state = "start";
                    s.flushPage();
                    s.dispatchEvent("onFlipStart");
                }
            }
        };
        FlipBook.prototype.onMouseUp = function (e) {
            var s = this;
            if (s.state == "start") {
                s.stageMP.x = e.clientX;
                s.stageMP.y = e.clientY;
                var p = s.globalToLocal(s.stageMP);
                s.timerArg1 = s.checkArea(p);
                s.state = "auto";
                s.stageMP = p;
            }
        };
        FlipBook.prototype.onMouseMove = function (e) {
            var s = this;
            if (s.state == "start") {
                s.stageMP.x = e.clientX;
                s.stageMP.y = e.clientY;
                var p = s.globalToLocal(s.stageMP);
                s.stageMP = p;
            }
        };
        FlipBook.prototype.checkArea = function (point) {
            var s = this;
            var tmpN;
            var minX = 0;
            var maxX = s.bW + s.bW;
            var minY = 0;
            var maxY = s.bH;
            var areaNum = 50;
            if (point.x > minX && point.x <= maxX * 0.5) {
                tmpN = (point.y > minY && point.y <= (maxY * 0.5)) ? 1 : (point.y > (maxY * 0.5) && point.y < maxY) ? 2 : 0;
                if (point.x <= (minX + areaNum)) {
                    tmpN = (point.y > minY && point.y <= (minY + areaNum)) ? -1 : (point.y > (maxY - areaNum) && point.y < maxY) ? -2 : tmpN;
                }
                return tmpN;
            }
            else if (point.x > (maxX * 0.5) && point.x < maxX) {
                tmpN = (point.y > minY && point.y <= (maxY * 0.5)) ? 3 : (point.y > (maxY * 0.5) && point.y < maxY) ? 4 : 0;
                if (point.x >= (maxX - areaNum)) {
                    tmpN = (point.y > minY && point.y <= (minY + areaNum)) ? -3 : (point.y > (maxY - areaNum) && point.y < maxY) ? -4 : tmpN;
                }
                return tmpN;
            }
            return 0;
        };
        /**
         * 跳到指定的页数
         * @method flipTo
         * @param index
         * @since 1.0.3
         */
        FlipBook.prototype.flipTo = function (index) {
            var n;
            var s = this;
            index = index % 2 == 1 ? index - 1 : index;
            n = index - s.currPage;
            if (s.state == "stop" && index >= 0 && index < s.totalPage && n != 0) {
                s.timerArg0 = n < 0 ? 1 : 3;
                s.timerArg1 = -1;
                s.toPage = index > s.totalPage ? s.totalPage : index;
                s.state = "auto";
                s.flushPage();
            }
        };
        FlipBook.prototype.flushPage = function () {
            var s = this;
            var page0;
            var page1;
            var myPos = s.myPosArr[s.timerArg0 - 1];
            var p = null;
            if (s.timerArg0 == 1 || s.timerArg0 == 2) {
                s.toPage = s.toPage == s.currPage ? s.currPage - 2 : s.toPage;
                page0 = s.currPage;
                page1 = s.toPage + 1;
                this.pageMC.removeChild(this.leftPage);
                if (s.currPage - 2 > 0) {
                    p = s.getPage(s.currPage - 2);
                    p.x = 0;
                    this.leftPage = p;
                    this.pageMC.addChild(p);
                }
            }
            else if (s.timerArg0 == 3 || s.timerArg0 == 4) {
                s.toPage = s.toPage == s.currPage ? s.currPage + 2 : s.toPage;
                page0 = s.currPage + 1;
                page1 = s.toPage;
                this.pageMC.removeChild(this.rightPage);
                if (s.currPage + 3 < this.totalPage) {
                    p = s.getPage(s.currPage + 3);
                    p.x = this.bW;
                    this.rightPage = p;
                    this.pageMC.addChild(p);
                }
            }
            s.px = myPos.x;
            s.py = myPos.y;
            if (page0 > 0 && page0 <= s.totalPage) {
                p = s.getPage(page0);
                p.x = 0;
                p.y = 0;
                s.rPage0.addChild(p);
            }
            if (page1 > 0 && page1 <= s.totalPage) {
                p = s.getPage(page1);
                p.x = 0;
                p.y = 0;
                s.rPage1.addChild(p);
            }
        };
        FlipBook.prototype.onEnterFrame = function (e) {
            var s = this;
            var toPos = s.toPosArr[s.timerArg0 - 1];
            var myPos = s.myPosArr[s.timerArg0 - 1];
            var tox;
            var toy;
            var toFlag;
            var tmpX;
            var tmpY;
            var u;
            if (s.state == "start") {
                u = 0.4;
                var p = s.stageMP;
                s.px += (p.x - s.px) * u >> 0;
                s.py += (p.y - s.py) * u >> 0;
                var np = new Point(s.px, s.py);
                s.drawPage(s.timerArg0, np);
            }
            else if (s.state == "auto") {
                if (Math.abs(toPos.x - s.px) > s.bW * 1.5 && s.timerArg1 > 0) {
                    //不处于点翻区域并且翻页不过中线时
                    tox = myPos.x;
                    toy = myPos.y;
                    toFlag = 0;
                }
                else {
                    tox = toPos.x;
                    toy = toPos.y;
                    toFlag = 1;
                }
                tmpX = (tox - s.px) >> 0;
                tmpY = (toy - s.py) >> 0;
                if (s.timerArg1 < 0) {
                    u = 0.3;
                    s.py = s.arc(s.bW, tmpX, toPos.y);
                }
                else {
                    u = 0.4;
                    s.py = tmpY * u + s.py;
                }
                s.px = tmpX * u + s.px;
                s.drawPage(s.timerArg0, new Point(s.px, s.py));
                if (tmpX == 0 && tmpY == 0) {
                    s.rPage0.removeAllChildren();
                    s.rPage1.removeAllChildren();
                    s.shadow0.visible = false;
                    s.shadow1.visible = false;
                    s.toPage = toFlag == 0 ? s.currPage : s.toPage;
                    s.currPage = s.toPage;
                    s.pageMC.removeAllChildren();
                    s.setPage(s.currPage);
                    s.state = "stop";
                    s.dispatchEvent("onFlipStop");
                }
            }
        };
        FlipBook.prototype.arc = function (argR, argN1, argN2) {
            var arg = argR * 2;
            var r = argR * argR + arg * arg;
            var a = Math.abs(argN1) - argR;
            return argN2 - (Math.sqrt(r - a * a) - arg);
        };
        FlipBook.prototype.angle = function (target1, target2) {
            var tmpX = target1.x - target2.x;
            var tmpY = target1.y - target2.y;
            var tmp_angle = Math.atan2(tmpY, tmpX) * 180 / Math.PI;
            return tmp_angle < 0 ? tmp_angle + 360 : tmp_angle;
        };
        FlipBook.prototype.pos = function (target1, target2) {
            var tmpX = target1.x - target2.x;
            var tmpY = target1.y - target2.y;
            var tmpS = Math.sqrt(tmpX * tmpX + tmpY * tmpY);
            return target1.x > target2.x ? tmpS : -tmpS;
        };
        return FlipBook;
    }(Sprite));
    annieUI.FlipBook = FlipBook;
})(annieUI || (annieUI = {}));
/**
 * Created by Saron on 2017/2/21.
 */
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    /**
     * 大转盘抽奖类
     * @class annieUI.BigTurnTable
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    var BigTurnTable = (function (_super) {
        __extends(BigTurnTable, _super);
        function BigTurnTable(option) {
            var _this = _super.call(this) || this;
            /**
             * 是否在转动中
             * @property isTurnning
             * @public
             * @since 1.0.0
             * @default false
             * @type {boolean}
             */
            _this.isTurnning = false;
            return _this;
        }
        /**
         * 是否为函数
         * @param fn
         * @returns {boolean}
         * @private
         */
        BigTurnTable.prototype.isFunction = function (fn) {
            return typeof fn === 'function';
        };
        /**
         * 转动方法
         * @param turnObj  转动对象
         * @param targetRotation 目标角度
         * @param callback 转动结束回调函数
         * @example
         *      var lotteryController=new annieUI.BigTurnTable();
         *      lotteryController.turnTo(turnObj,120,function(){
         *      trace('turnFinish!');
         *      })
         */
        BigTurnTable.prototype.turnTo = function (turnObj, targetRotation, callback) {
            var s = this, turnObjInitRotation = 0;
            if (!turnObj) {
                throw new Error('turnObj转动对象不能为空');
            }
            if (!s.isFunction(callback)) {
                throw new Error('callback参数数据格式不对！callback应为函数');
            }
            if (s.isTurnning) {
                return;
            }
            turnObjInitRotation = turnObj.rotation; //转动对象rotation初始值
            s.isTurnning = true;
            /*抽奖转盘*/
            annie.Tween.to(turnObj, 2, {
                rotation: (180 + turnObjInitRotation), ease: annie.Tween.quarticIn, onComplete: function () {
                    annie.Tween.to(turnObj, 3, {
                        rotation: (10 * 360), onComplete: function () {
                            annie.Tween.to(turnObj, 4, {
                                rotation: (12 * 360) + targetRotation + turnObjInitRotation,
                                ease: annie.Tween.quarticOut,
                                onComplete: function () {
                                    turnObj.rotation = targetRotation + turnObjInitRotation;
                                    s.isTurnning = false;
                                    s.isFunction(callback) && callback(); //执行结束回调函数
                                }
                            });
                        }
                    });
                }
            });
        };
        return BigTurnTable;
    }(Sprite));
    annieUI.BigTurnTable = BigTurnTable;
})(annieUI || (annieUI = {}));
