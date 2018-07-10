var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annie
 */
var annie;
(function (annie) {
    var Sprite = annie.Sprite;
    var Shape = annie.Shape;
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annie.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    var ScrollPage = (function (_super) {
        __extends(ScrollPage, _super);
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {number} vW 可视区域宽
         * @param {number} vH 可视区域高
         * @param {number} maxDistance 最大滚动的长度
         * @param {boolean} isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @example
         *      s.sPage=new annie.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
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
            this._tweenId = 0;
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
             * @protected
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
            this.maskObj = new Shape();
            /**
             * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
             * @property view
             * @public
             * @since 1.0.0
             * @type {annie.Sprite}
             */
            this.view = new Sprite();
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
             * @protected
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
            this.isMouseDownState = 0;
            /**
             * 是否是通过scrollTo方法在滑动中
             * @property autoScroll
             * @since 1.0.2
             * @type {boolean}
             * @private
             * @default false
             */
            this.autoScroll = false;
            var s = this;
            s._instanceType = "annie.ScrollPage";
            s.addChild(s.maskObj);
            s.addChild(s.view);
            s.view.mask = s.maskObj;
            s.maskObj["_isUseToMask"] = 0;
            s.maskObj.alpha = 0;
            s.maxDistance = maxDistance;
            s.setViewRect(vW, vH, isVertical);
            // s.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEvent.bind(s));
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
                            s.dispatchEvent("onScrollStop");
                            s.speed = 0;
                        }
                    }
                    else {
                        //检测是否超出了边界,如果超出了边界则回弹
                        if (s.addSpeed != 0) {
                            if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                                var tarP = 0;
                                if (s.addSpeed > 0) {
                                    if (s.distance < s.maxDistance) {
                                        tarP = s.distance - s.maxDistance;
                                    }
                                }
                                view[s.paramXY] += 0.4 * (tarP - view[s.paramXY]);
                                if (Math.abs(tarP - view[s.paramXY]) < 0.1) {
                                    s.isStop = true;
                                    if (s.addSpeed > 0) {
                                        s.dispatchEvent("onScrollToEnd");
                                    }
                                    else {
                                        s.dispatchEvent("onScrollToHead");
                                    }
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
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @param {boolean} isVertical 方向
         * @public
         * @since 1.1.1
         */
        ScrollPage.prototype.setViewRect = function (w, h, isVertical) {
            var s = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, w, h);
            s.viewWidth = w;
            s.viewHeight = h;
            s.maskObj.endFill();
            s.isVertical = isVertical;
            if (isVertical) {
                s.distance = s.viewHeight;
                s.paramXY = "y";
            }
            else {
                s.distance = s.viewWidth;
                s.paramXY = "x";
            }
            s.isVertical = isVertical;
        };
        ScrollPage.prototype.onMouseEvent = function (e) {
            var s = this;
            var view = s.view;
            // if (s.distance < s.maxDistance) {
            if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (s.isMouseDownState < 1) {
                    if (!s.isStop) {
                        s.isStop = true;
                    }
                    if (s.autoScroll) {
                        s.autoScroll = false;
                        annie.Tween.kill(s._tweenId);
                    }
                    if (s.isVertical) {
                        s.lastValue = e.localY;
                    }
                    else {
                        s.lastValue = e.localX;
                    }
                    s.speed = 0;
                    s.isMouseDownState = 1;
                    return;
                }
                ;
                if (s.isMouseDownState == 1) {
                    s.dispatchEvent("onScrollStart");
                }
                s.isMouseDownState = 2;
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
                s.isStop = false;
                s.stopTimes = -1;
                if (s.speed == 0 && s.isMouseDownState == 2) {
                    s.dispatchEvent("onScrollStop");
                }
                s.isMouseDownState = 0;
            }
            // }
        };
        /**
         * 滚到指定的坐标位置
         * @method scrollTo
         * @param {number} dis 需要去到的位置
         * @param {number} time 滚动需要的时间 默认为0 即没有动画效果直接跳到指定页
         * @since 1.1.1
         * @public
         */
        ScrollPage.prototype.scrollTo = function (dis, time) {
            if (time === void 0) { time = 0; }
            var s = this;
            var newDis = s.paramXY == "x" ? s.viewWidth : s.viewHeight;
            if (dis < 0) {
                dis = 0;
            }
            else if (dis > s.maxDistance - newDis) {
                dis = s.maxDistance - newDis;
            }
            if (Math.abs(s.view[s.paramXY] + dis) > 2) {
                s.autoScroll = true;
                s.isStop = true;
                s.isMouseDownState = 0;
                var obj = {};
                obj.onComplete = function () {
                    s.autoScroll = false;
                };
                obj[s.paramXY] = -dis;
                s._tweenId = annie.Tween.to(s.view, time, obj);
                if (s.speed == 0) {
                    s.dispatchEvent("onScrollStart");
                }
            }
        };
        ScrollPage.prototype.destroy = function () {
            var s = this;
            s.maskObj = null;
            s.view = null;
            _super.prototype.destroy.call(this);
        };
        return ScrollPage;
    }(Sprite));
    annie.ScrollPage = ScrollPage;
})(annie || (annie = {}));
/**
 * Created by saron on 16/10/19.
 */
/**
 * @module annie
 */
var annie;
(function (annie) {
    var Sprite = annie.Sprite;
    /**
     * 滑动页面类
     * @class annie.SlidePage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    var SlidePage = (function (_super) {
        __extends(SlidePage, _super);
        /**
         * 构造函数
         * @method SlidePage
         * @param {number} vW 宽
         * @param {number} vH 高
         * @param {boolean} isVertical 是横向还是纵向 默认纵向
         * @param {Function} ease annie.Tween的缓存函数，也可以是自定义的缓动函数，自定义的话,请尊守annie.Tween缓动函数接口
         */
        function SlidePage(vW, vH, isVertical, ease) {
            if (isVertical === void 0) { isVertical = true; }
            if (ease === void 0) { ease = null; }
            _super.call(this);
            /**
             * 页面个数
             * @property listLen
             * @type {number}
             * @private
             * @default 0
             */
            this.listLen = 0;
            /**
             * 页面滑动容器
             * @property view
             * @type {annie.Sprite}
             * @since 1.1.0
             * @public
             */
            this.view = new annie.Sprite();
            this.maskObj = new annie.Shape();
            /**
             * 容器活动速度
             * @property slideSpeed
             * @type {number}
             * @public
             * @default 0.2
             */
            this.slideSpeed = 0.2;
            /**
             * 是否滑动中断
             * @property _isBreak
             * @private
             * @type {boolean}
             */
            this._isBreak = false;
            /**
             * 滚动距离
             * @property distance
             * @type {number}
             * @protected
             * @default 0
             * @since 1.0.0
             */
            this.distance = 0;
            /**
             * 触摸点结束点X
             * @property touchEndX
             * @type {number}
             * @private
             */
            this.touchEndX = 0;
            this.movingX = 0;
            this.movingY = 0;
            this._moveDis = 0;
            /**
             * 触摸点结束点Y
             * @property touchEndY
             * @type {number}
             * @private
             * @since
             * @public
             * @default 0
             */
            this.touchEndY = 0;
            /**
             * 当前页面索引ID 默认从0开始
             * @property currentPageIndex
             * @type {number}
             * @public
             * @since 1.0.3
             * @default 0
             */
            this.currentPageIndex = 0;
            //上下的回弹率
            this.reBound = 0.3;
            //页面是否滑动跟随
            this.isPageFollowToMove = false;
            //页面的跟率
            this.follow = 0.7;
            /**
             * 页面是否移动
             * @property isMoving
             * @type {boolean}
             * @public
             * @default false
             * @public
             */
            this.isMoving = false;
            /**
             * 页面宽
             * @property viewWidth
             * @type {number}
             * @private
             */
            this.viewWidth = 0;
            /**
             * 页面高
             * @property viewHeight
             * @type {number}
             * @private
             */
            this.viewHeight = 0;
            /**
             * 页面列表
             * @property pageList
             * @type {Array}
             * @private
             */
            this.pageList = [];
            this.pageClassList = [];
            this.lastX = 0;
            this.lastY = 0;
            /**
             * 是否点击了鼠标
             * @property isMouseDown
             * @type {boolean}
             * @private
             */
            this.isMouseDown = false;
            /**
             * 是否可以下一页
             * @property canSlideNext
             * @since 1.0.3
             * @default true
             * @type {boolean}
             * @public
             */
            this.canSlideNext = true;
            /**
             * 是否可以上一页
             * @property canSlidePrev
             * @type {boolean}
             * @public
             * @default true
             */
            this.canSlidePrev = true;
            this.paramXY = "y";
            var s = this;
            s.isVertical = isVertical;
            s._ease = ease;
            if (isVertical) {
                s.paramXY = "y";
                s.distance = vH;
            }
            else {
                s.paramXY = "x";
                s.distance = vW;
            }
            s.addChild(s.maskObj);
            s.addChild(s.view);
            s.view.mask = s.maskObj;
            s.maskObj["_isUseToMask"] = 0;
            s.maskObj.alpha = 0;
            s.setMask(vW, vH);
            var me = s.onMouseEvent.bind(s);
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, me);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, me);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, me);
        }
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setMask
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.0.0
         */
        SlidePage.prototype.setMask = function (w, h) {
            var s = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, w, h);
            s.viewWidth = w;
            s.viewHeight = h;
            s.maskObj.endFill();
        };
        /**
         * 触摸事件
         * @param e
         */
        SlidePage.prototype.onMouseEvent = function (e) {
            var s = this;
            if (s.isMoving)
                return;
            if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                s.touchEndX = e.localX;
                s.touchEndY = e.localY;
                s.movingX = s.movingY = 0;
                s.isMouseDown = true;
                s._isBreak = false;
                s.lastX = e.localX;
                s.lastY = e.localY;
                s._moveDis = 0;
            }
            else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (!s.isMouseDown)
                    return;
                var mx = e.localX - s.touchEndX;
                var my = e.localY - s.touchEndY;
                var ts = my;
                var fts = mx;
                var lts = s.movingY;
                s._moveDis = s.lastY - e.localY;
                s.movingX = mx;
                s.movingY = my;
                if (!s.isVertical) {
                    ts = mx;
                    fts = my;
                    lts = s.movingX;
                    s._moveDis = s.lastX - e.localX;
                }
                if (Math.abs(ts) > Math.abs(fts)) {
                    if (!s.isPageFollowToMove) {
                        if (Math.abs(ts) - Math.abs(lts) < -1) {
                            s._isBreak = true;
                        }
                    }
                    if (ts > 0) {
                        if (s.currentPageIndex == 0) {
                            s.view[s.paramXY] -= s._moveDis * s.reBound;
                        }
                        else {
                            if (s.isPageFollowToMove) {
                                s.view[s.paramXY] -= s._moveDis * s.follow;
                                var nextId = s.currentPageIndex - 1;
                                if (!s.pageList[nextId]) {
                                    s.pageList[nextId] = new s.pageClassList[nextId]();
                                }
                                if (s.pageList[nextId].parent != s.view) {
                                    s.view.addChild(s.pageList[nextId]);
                                    s.pageList[nextId][s.paramXY] = nextId * s.distance;
                                }
                            }
                        }
                    }
                    else if (ts < 0) {
                        if (s.currentPageIndex == s.listLen - 1) {
                            s.view[s.paramXY] -= s._moveDis * s.reBound;
                        }
                        else {
                            if (s.isPageFollowToMove) {
                                s.view[s.paramXY] -= s._moveDis * s.follow;
                                var nextId = s.currentPageIndex + 1;
                                if (!s.pageList[nextId]) {
                                    s.pageList[nextId] = new s.pageClassList[nextId]();
                                }
                                if (s.pageList[nextId].parent != s.view) {
                                    s.view.addChild(s.pageList[nextId]);
                                    s.pageList[nextId][s.paramXY] = nextId * s.distance;
                                }
                            }
                        }
                    }
                }
                else {
                    s.movingX = s.movingY = 0;
                }
                s.lastX = e.localX;
                s.lastY = e.localY;
            }
            else if (e.type == annie.MouseEvent.MOUSE_UP) {
                if (!s.isMouseDown)
                    return;
                var ts = s.movingY;
                var fts = s.movingX;
                s.isMouseDown = false;
                if (!s.isVertical) {
                    ts = s.movingX;
                    fts = s.movingY;
                }
                if ((s.currentPageIndex == 0 && s.view[s.paramXY] > 0) || (s.currentPageIndex == (s.listLen - 1) && s.view[s.paramXY] < -s.currentPageIndex * s.distance)) {
                    var tweenData = {};
                    tweenData[s.paramXY] = -s.currentPageIndex * s.distance;
                    if (s._ease) {
                        tweenData.ease = s._ease;
                    }
                    annie.Tween.to(s.view, s.slideSpeed * s.reBound, tweenData);
                }
                else {
                    var id = s.currentPageIndex;
                    if (!s.isPageFollowToMove) {
                        if (Math.abs(ts) > 100 && !s._isBreak) {
                            s.slideTo(ts < 0 ? id + 1 : id - 1);
                        }
                    }
                    else {
                        if (Math.abs(s._moveDis) > 5 || Math.abs(ts * s.follow << 1) >= s.distance) {
                            s.slideTo(ts < 0 ? id + 1 : id - 1);
                        }
                        else {
                            var where = -s.currentPageIndex * s.distance;
                            if (where == s.view[s.paramXY])
                                return;
                            s.view.mouseEnable = false;
                            s.isMoving = true;
                            var tweenData = {};
                            tweenData[s.paramXY] = where;
                            if (s._ease) {
                                tweenData.ease = s._ease;
                            }
                            tweenData.onComplete = function () {
                                s.view.mouseEnable = true;
                                s.isMoving = false;
                                if (s.currentPageIndex > 0 && s.pageList[s.currentPageIndex - 1] && s.pageList[s.currentPageIndex - 1].parent == s.view) {
                                    s.view.removeChild(s.pageList[s.currentPageIndex - 1]);
                                }
                                if (s.currentPageIndex < (s.listLen - 1) && s.pageList[s.currentPageIndex + 1] && s.pageList[s.currentPageIndex + 1].parent == s.view) {
                                    s.view.removeChild(s.pageList[s.currentPageIndex + 1]);
                                }
                            };
                            annie.Tween.to(s.view, s.slideSpeed * 0.5, tweenData);
                        }
                    }
                }
            }
        };
        /**
         * 滑动到指定页
         * @method slideTo
         * @public
         * @since 1.1.1
         * @param {number} index 是向上还是向下
         */
        SlidePage.prototype.slideTo = function (index, noTween) {
            if (noTween === void 0) { noTween = false; }
            var s = this;
            if (s.isMoving || s.currentPageIndex == index) {
                return;
            }
            var lastId = s.currentPageIndex;
            var isNext = s.currentPageIndex < index ? true : false;
            if (isNext) {
                if (index < s.listLen && s.canSlideNext) {
                    s.currentPageIndex = index;
                }
                else {
                    return;
                }
            }
            else {
                if (index >= 0 && s.canSlidePrev) {
                    s.currentPageIndex = index;
                }
                else {
                    return;
                }
            }
            if (!s.pageList[s.currentPageIndex]) {
                s.pageList[s.currentPageIndex] = new s.pageClassList[s.currentPageIndex]();
            }
            s.pageList[s.currentPageIndex][s.paramXY] = s.currentPageIndex * s.distance;
            if (isNext) {
                s.pageList[lastId][s.paramXY] = (s.currentPageIndex - 1) * s.distance;
            }
            else {
                s.pageList[lastId][s.paramXY] = (s.currentPageIndex + 1) * s.distance;
            }
            if (!s.isPageFollowToMove) {
                s.view[s.paramXY] = -s.pageList[lastId][s.paramXY];
            }
            if (s.pageList[s.currentPageIndex] != s.view) {
                s.view.addChild(s.pageList[s.currentPageIndex]);
            }
            if (noTween) {
                s.dispatchEvent("onSlideStart", { currentPage: s.currentPageIndex, lastPage: lastId });
                s.view[s.paramXY] = -s.currentPageIndex * s.distance;
                s.view.removeChild(s.pageList[lastId]);
                s.dispatchEvent("onSlideEnd");
            }
            else {
                s.view.mouseEnable = false;
                s.isMoving = true;
                var tweenData = {};
                tweenData[s.paramXY] = -s.currentPageIndex * s.distance;
                if (s._ease) {
                    tweenData.ease = s._ease;
                }
                tweenData.onComplete = function () {
                    s.view.mouseEnable = true;
                    s.isMoving = false;
                    s.view.removeChild(s.pageList[lastId]);
                    s.dispatchEvent("onSlideEnd");
                };
                annie.Tween.to(s.view, s.slideSpeed, tweenData);
                s.dispatchEvent("onSlideStart", { currentPage: s.currentPageIndex, lastPage: lastId });
            }
        };
        /**
         * 用于插入分页
         * @method addPageList
         * @param {Array} classList  每个页面的类，注意是类，不是对象
         * @since 1.0.3
         * @public
         */
        SlidePage.prototype.addPageList = function (classList) {
            var s = this;
            s.pageClassList = s.pageClassList.concat(classList);
            if (s.listLen == 0 && s.pageClassList.length > 0) {
                var pageFirst = new s.pageClassList[0]();
                s.pageList.push(pageFirst);
                s.view.addChild(pageFirst);
            }
            s.listLen = s.pageClassList.length;
        };
        SlidePage.prototype.destroy = function () {
            var s = this;
            s.pageList = null;
            s.pageClassList = null;
            _super.prototype.destroy.call(this);
        };
        return SlidePage;
    }(Sprite));
    annie.SlidePage = SlidePage;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    var Sprite = annie.Sprite;
    var Shape = annie.Shape;
    var Event = annie.Event;
    var MouseEvent = annie.MouseEvent;
    var Point = annie.Point;
    /**
     * 电子杂志组件类
     * @class annie.FlipBook
     * @public
     * @extends annie.Sprite
     * @since 1.0.3
     */
    var FlipBook = (function (_super) {
        __extends(FlipBook, _super);
        /**
         * 初始化电子杂志
         * @method FlipBook
         * @param {number} width 单页宽
         * @param {number} height 单页高
         * @param {number} pageCount 总页数，一般为偶数
         * @param {Function} getPageCallBack，通过此回调获取指定页的内容的显示对象
         * @since 1.0.3
         */
        function FlipBook(width, height, pageCount, getPageCallBack) {
            _super.call(this);
            //可设置或可调用接口,页数以单页数计算~
            /**
             * 总页数
             * @property totalPage
             * @type {number}
             */
            this.totalPage = 0;
            /**
             * 当前页数
             * @property
             * @type {number}
             * @since 1.0.3
             */
            this.currPage = 0;
            /**
             * 翻页速度，0-1之间，值越小，速度越快
             * @property
             * @since 1.1.3
             * @type {number}
             */
            this.speed = 0.4;
            this.state = "stop";
            this.timerArg0 = 0;
            this.timerArg1 = 0;
            this.px = 0;
            this.py = 0;
            this.rPage0 = new Sprite();
            this.rPage1 = new Sprite();
            this.pageMC = new Sprite();
            this.leftPage = null;
            this.rightPage = null;
            this.rMask0 = new Shape();
            this.rMask1 = new Shape();
            this.shadow0 = new Shape();
            this.shadow1 = new Shape();
            this.sMask0 = new Shape();
            this.sMask1 = new Shape();
            this.pages = [];
            this.stageMP = new Point();
            /**
             * 指定是否能够翻页动作
             * @property canFlip
             * @since 1.0.3
             * @type {boolean}
             */
            this.canFlip = true;
            var s = this;
            s._instanceType = "annie.FlipBook";
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
            s.rPage0.mouseEnable = false;
            s.rPage1.mouseEnable = false;
            s.shadow0.mouseEnable = false;
            s.shadow1.mouseEnable = false;
            s.setShadowMask(s.shadow0, s.sMask0, s.bW * 1.5, s.bH * 3);
            s.setShadowMask(s.shadow1, s.sMask1, s.bW * 1.5, s.bH * 3);
            s.shadow0.visible = false;
            s.shadow1.visible = false;
            s.rPage1.mask = s.rMask1;
            s.rPage0.mask = s.rMask0;
            s.setPage(s.currPage);
            var md = s.onMouseDown.bind(s);
            var mu = s.onMouseUp.bind(s);
            var mm = s.onMouseMove.bind(s);
            var em = s.onEnterFrame.bind(s);
            s.addEventListener(annie.Event.ADD_TO_STAGE, function (e) {
                s.stage.addEventListener(MouseEvent.MOUSE_DOWN, md);
                s.stage.addEventListener(MouseEvent.MOUSE_UP, mu);
                s.stage.addEventListener(MouseEvent.MOUSE_MOVE, mm);
                s.addEventListener(Event.ENTER_FRAME, em);
            });
            s.addEventListener(annie.Event.REMOVE_TO_STAGE, function (e) {
                s.stage.removeEventListener(MouseEvent.MOUSE_DOWN, md);
                s.stage.removeEventListener(MouseEvent.MOUSE_UP, mu);
                s.stage.removeEventListener(MouseEvent.MOUSE_MOVE, mm);
                s.removeEventListener(Event.ENTER_FRAME, em);
            });
        }
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
            shape.beginLinearGradientFill([-g_width * 0.5, 4, g_width * 0.5, 4], [{ o: 0, c: "#000000", a: 0 }, { o: 1, c: "#000000", a: 0.6 }]);
            shape.drawRect(-g_width * 0.5, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
            shape.beginLinearGradientFill([-g_width * 0.5, 4, g_width * 0.5, 4], [{ o: 1, c: "#000000", a: 0 }, { o: 0, c: "#000000", a: 0.6 }]);
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
                    e.updateAfterEvent();
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
         * @param {number} index 跳到指定的页数
         * @since 1.0.3
         */
        FlipBook.prototype.flipTo = function (index) {
            var n;
            var s = this;
            index = index % 2 == 1 ? index - 1 : index;
            n = index - s.currPage;
            if (s.state == "stop" && index >= 0 && index <= s.totalPage && n != 0) {
                s.timerArg0 = n < 0 ? 1 : 3;
                s.timerArg1 = -1;
                s.toPage = index > s.totalPage ? s.totalPage : index;
                s.state = "auto";
                s.flushPage();
            }
        };
        /**
         * @method nextPage
         * @public
         * @since 1.1.1
         */
        FlipBook.prototype.nextPage = function () {
            this.flipTo(this.currPage + 2);
        };
        /**
         * @method prevPage
         * @public
         * @since 1.1.1
         */
        FlipBook.prototype.prevPage = function () {
            this.flipTo(this.currPage - 1);
        };
        /**
         * @method startPage
         * @public
         * @since 1.1.1
         */
        FlipBook.prototype.startPage = function () {
            this.flipTo(0);
        };
        /**
         * @method endPage
         * @public
         * @since 1.1.1
         */
        FlipBook.prototype.endPage = function () {
            this.flipTo(this.totalPage);
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
                this.pageMC.removeChild(s.leftPage);
                if (s.toPage > 0) {
                    p = s.getPage(s.currPage - 2);
                    p.x = 0;
                    s.leftPage = p;
                    s.pageMC.addChild(p);
                }
            }
            else if (s.timerArg0 == 3 || s.timerArg0 == 4) {
                s.toPage = s.toPage == s.currPage ? s.currPage + 2 : s.toPage;
                page0 = s.currPage + 1;
                page1 = s.toPage;
                s.pageMC.removeChild(s.rightPage);
                if (s.toPage + 1 < s.totalPage) {
                    p = s.getPage(s.currPage + 3);
                    p.x = s.bW;
                    s.rightPage = p;
                    s.pageMC.addChild(p);
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
                u = s.speed;
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
                    u = s.speed * 0.7;
                    s.py = s.arc(s.bW, tmpX, toPos.y);
                }
                else {
                    u = s.speed;
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
        FlipBook.prototype.destroy = function () {
            var s = this;
            s.layer0Arr = null;
            s.layer1Arr = null;
            s.toPosArr = null;
            s.myPosArr = null;
            s.rPage0 = null;
            s.rMask0 = null;
            s.rMask1 = null;
            s.sMask0 = null;
            s.sMask1 = null;
            s.leftPage = null;
            s.rightPage = null;
            s.pageMC = null;
            s.rightPage = null;
            s.shadow0 = null;
            s.shadow1 = null;
            s.p1 = null;
            s.p2 = null;
            s.p3 = null;
            s.p4 = null;
            s.limitP1 = null;
            s.limitP2 = null;
            s.pages = null;
            s.stageMP = null;
            s.getPageCallback = null;
            _super.prototype.destroy.call(this);
        };
        return FlipBook;
    }(Sprite));
    annie.FlipBook = FlipBook;
})(annie || (annie = {}));
/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 有些时候需要大量的有规则的滚动内容。这个时候就应该用到这个类了
     * @class annie.ScrollList
     * @public
     * @extends annie.ScrollPage
     * @since 1.0.9
     */
    var ScrollList = (function (_super) {
        __extends(ScrollList, _super);
        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemWidth item宽
         * @param {number} itemHeight item高
         * @param {number} vW 列表的宽
         * @param {number} vH 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @param {number} cols 分几列，默认是1列
         * @since 1.0.9
         */
        function ScrollList(itemClassName, itemWidth, itemHeight, vW, vH, isVertical, cols) {
            if (isVertical === void 0) { isVertical = true; }
            if (cols === void 0) { cols = 1; }
            _super.call(this, vW, vH, 0, isVertical);
            this._items = null;
            this.data = [];
            this.downL = null;
            this._lastFirstId = -1;
            var s = this;
            s._isInit = false;
            s._instanceType = "annie.ScrollList";
            s._itemW = itemWidth;
            s._itemH = itemHeight;
            s._items = [];
            s._itemClass = itemClassName;
            s._itemCount = 0;
            s._cols = cols;
            s._updateViewRect();
            s.addEventListener(annie.Event.ENTER_FRAME, s.flushData.bind(s));
        }
        Object.defineProperty(ScrollList.prototype, "loadingView", {
            /**
             * 获取下拉滚动的loadingView对象
             * @property loadingView
             * @since 1.0.9
             * @returns {DisplayObject}
             */
            get: function () {
                return this.downL;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新列表数据
         * @method updateData
         * @param {Array} data
         * @param {boolean} isReset 是否重围数据列表。
         * @since 1.0.9
         */
        ScrollList.prototype.updateData = function (data, isReset) {
            if (isReset === void 0) { isReset = false; }
            var s = this;
            if (!s._isInit || isReset) {
                s.data = data;
                s._isInit = true;
            }
            else {
                s.data = s.data.concat(data);
            }
            s._lastFirstId = -1;
            s.maxDistance = Math.ceil(s.data.length / s._cols) * s._itemRow;
            if (s.downL) {
                s.downL[s.paramXY] = Math.max(s.distance, s.maxDistance);
                var wh = s.downL.getWH();
                s.maxDistance += (s.paramXY == "x" ? wh.width : wh.height);
            }
        };
        ScrollList.prototype.flushData = function () {
            var s = this;
            if (s._isInit) {
                if (s.view._UI.UM) {
                    var id = (Math.abs(Math.floor(s.view[s.paramXY] / s._itemRow)) - 1) * s._cols;
                    id = id < 0 ? 0 : id;
                    if (id != s._lastFirstId) {
                        s._lastFirstId = id;
                        if (id != s._items[0].id) {
                            for (var r = 0; r < s._cols; r++) {
                                if (s.speed > 0) {
                                    s._items.unshift(s._items.pop());
                                }
                                else {
                                    s._items.push(s._items.shift());
                                }
                            }
                        }
                    }
                    for (var i = 0; i < s._itemCount; i++) {
                        var item = s._items[i];
                        if (item._a2x_sl_id != id) {
                            item.initData(s.data[id] ? id : -1, s.data[id]);
                            item.visible = s.data[id] ? true : false;
                            item[s.paramXY] = Math.floor(id / s._cols) * s._itemRow;
                            item[s._disParam] = (id % s._cols) * s._itemCol;
                            item._a2x_sl_id = id;
                        }
                        id++;
                    }
                }
            }
        };
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @param {boolean} isVertical 方向
         * @public
         * @since 1.1.1
         */
        ScrollList.prototype.setViewRect = function (w, h, isVertical) {
            _super.prototype.setViewRect.call(this, w, h, isVertical);
            var s = this;
            if (s._itemRow && s._itemCol) {
                s._updateViewRect();
            }
        };
        ScrollList.prototype._updateViewRect = function () {
            var s = this;
            if (s.isVertical) {
                s._disParam = "x";
                s._itemRow = s._itemH;
                s._itemCol = s._itemW;
            }
            else {
                s._disParam = "y";
                s._itemRow = s._itemW;
                s._itemCol = s._itemH;
            }
            var newCount = (Math.ceil(s.distance / s._itemRow) + 1) * s._cols;
            if (newCount != s._itemCount) {
                if (newCount > s._itemCount) {
                    for (var i = s._itemCount; i < newCount; i++) {
                        var item = new s._itemClass();
                        item.id = -1;
                        item.data = null;
                        s._items.push(item);
                        s.view.addChild(item);
                    }
                }
                else {
                    for (var i = 0; i < s._itemCount - newCount; i++) {
                        s.view.removeChild(s._items.pop());
                    }
                }
                s._itemCount = newCount;
                s._lastFirstId = -1;
            }
        };
        /**
         * 设置加载数据时显示的loading对象
         * @since 1.0.9
         * @method setLoading
         * @param {annie.DisplayObject} downLoading
         */
        ScrollList.prototype.setLoading = function (downLoading) {
            var s = this;
            if (s.downL) {
                s.view.removeChild(s.downL);
                var wh = s.downL.getWH();
                s.maxDistance -= (s.paramXY == "x" ? wh.width : wh.height);
                s.downL = null;
            }
            if (downLoading) {
                s.downL = downLoading;
                s.view.addChild(downLoading);
                s.downL[s.paramXY] = Math.max(s.distance, s.maxDistance);
                var wh = s.downL.getWH();
                s.maxDistance += (s.paramXY == "x" ? wh.width : wh.height);
            }
            else {
                s.isStop = false;
            }
        };
        ScrollList.prototype.destroy = function () {
            var s = this;
            s._items = null;
            s._itemClass = null;
            s.data = null;
            s.downL = null;
            _super.prototype.destroy.call(this);
        };
        return ScrollList;
    }(annie.ScrollPage));
    annie.ScrollList = ScrollList;
})(annie || (annie = {}));

module.exports = annie;