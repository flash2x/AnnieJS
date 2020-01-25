var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.Scroller
     * @public
     * @extends annie.AObject
     * @since 3.1.0
     */
    var Scroller = /** @class */ (function (_super) {
        __extends(Scroller, _super);
        /**
         * 初始化
         * @method Scroller
         * @param {annie.DisplayObject} container
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        function Scroller(container, viewWidth, viewHeight, scrollWidth, scrollHeight) {
            var _this = _super.call(this) || this;
            /**
             * 是否纵向滚动
             * @property isScrollY
             * @type {boolean}
             * @public
             * @since 3.1.5
             * @default true;
             */
            _this.isScrollY = true;
            /**
             * 是否横向滚动
             * @property isScrollX
             * @type {boolean}
             * @since 3.1.5
             * @public
             * @default true;
             */
            _this.isScrollX = true;
            /**
             * 是否松开鼠标后让其自由缓冲滑动
             * @property isMomentum
             * @type {boolean}
             * @since 3.1.5
             * @public
             * @default true;
             */
            _this.isMomentum = true;
            /**
             * 是否滑到边界后有回弹效果
             * @property isBounce
             * @type {boolean}
             * @since 3.1.5
             * @public
             * @default true;
             */
            _this.isBounce = true;
            /**
             * 回弹的动效时长,单位:ms
             * @property bounceTime
             * @type {number}
             * @public
             * @since 3.1.5
             * @default 300
             */
            _this.bounceTime = 300;
            /**
             * 是否需要横向纵向保护，有些时候你想纵向滑动，但鼠标也轻微的左右飘了，如果不lock刚好左右滑动也被允许的话，则左右也会滑动，横向滑动则相反。
             * 如果想鼠标不那么灵敏的话，可以加上一把锁，这样左右滑的时候上下不会滑，上下滑的时候左右不会滑
             * @property isLocked
             * @type {boolean}
             * @public
             * @since 3.1.5
             * @default 300
             */
            _this.isLocked = true;
            /**
             * 锁的像素范围
             * @property lockDis
             * @type {number}
             * @since 3.1.5
             * @public
             * @default 5
             */
            _this.lockDis = 5;
            _this._curX = 0;
            _this._curY = 0;
            _this._viewWidth = 0;
            _this._viewHeight = 0;
            _this._scrollWidth = 0;
            _this._scrollHeight = 0;
            _this.startX = 0;
            _this.startY = 0;
            _this.maxScrollX = 0;
            _this.maxScrollY = 0;
            _this.endTime = 0;
            _this.mouseStatus = 0;
            _this.distX = 0;
            _this.distY = 0;
            _this.startTime = 0;
            _this.absStartX = 0;
            _this.absStartY = 0;
            _this.pointX = 0;
            _this.pointY = 0;
            _this.deceleration = 0.0006;
            _this.destTime = 0;
            _this.destX = 0;
            _this.destY = 0;
            _this.duration = 0;
            _this._mouseEvent = null;
            _this._enterFrame = null;
            var s = _this;
            s._instanceType = "annieUI.Scroller";
            s._mouseEvent = s.onMouseEvent.bind(s);
            s._enterFrame = s.onEnterFrame.bind(s);
            s.init(container, viewWidth, viewHeight, scrollWidth, scrollHeight);
            return _this;
        }
        Object.defineProperty(Scroller.prototype, "curX", {
            /**
             * 当前滑动的x坐标 更改此参数则需要调用resetPosition()方法生效
             * @property curX
             * @type {number}
             * @since 3.1.5
             * @default 0
             */
            get: function () {
                return this._curX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "curY", {
            /**
             * 当前滑动的y坐标 更改此参数则需要调用resetPosition()方法生效
             * @property curY
             * @type {number}
             * @since 3.1.5
             * @default 0
             */
            get: function () {
                return this._curY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "viewWidth", {
            /**
             * 当前显示范围的宽
             * @property viewWidth
             * @type {number}
             * @since 3.1.5
             * @default 0
             * @readonly
             */
            get: function () {
                return this._viewWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "viewHeight", {
            /**
             * 当前显示范围的高
             * @property viewHeight
             * @type {number}
             * @since 3.1.5
             * @default 0
             * @readonly
             */
            get: function () {
                return this._viewHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "scrollWidth", {
            /**
             * 当前横向的滑动范围
             * @property scrollWidth
             * @type {number}
             * @since 3.1.5
             * @default 0
             * @readonly
             */
            get: function () {
                return this._scrollWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "scrollHeight", {
            /**
             * 当前纵向的滑动范围
             * @property scrollHeight
             * @type {number}
             * @since 3.1.5
             * @default 0
             * @readonly
             */
            get: function () {
                return this._scrollHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化，也可以反复调用此方法重用scroller
         * @method init
         * @param {annie.DisplayObject} container
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         * @public
         * @since 3.1.5
         */
        Scroller.prototype.init = function (container, viewWidth, viewHeight, scrollWidth, scrollHeight) {
            var s = this;
            if (s._container && s._container != container) {
                //移除
                s._container.removeEventListener(annie.MouseEvent.MOUSE_DOWN, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_MOVE, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_UP, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_OUT, s._mouseEvent);
                s._container.removeEventListener(annie.Event.ENTER_FRAME, s._enterFrame);
            }
            if (s._container != container) {
                s._container = container;
                container.addEventListener(annie.MouseEvent.MOUSE_DOWN, s._mouseEvent, false);
                container.addEventListener(annie.MouseEvent.MOUSE_MOVE, s._mouseEvent, false);
                container.addEventListener(annie.MouseEvent.MOUSE_UP, s._mouseEvent, false);
                container.addEventListener(annie.MouseEvent.MOUSE_OUT, s._mouseEvent);
                container.addEventListener(annie.Event.ENTER_FRAME, s._enterFrame);
            }
            s.isRunning = false;
            s.endTime = 0;
            s.setViewWHAndScrollWH(viewWidth, viewHeight, scrollWidth, scrollHeight);
        };
        /**
         * 当更改了viewWidth,viewHeight其中一个或两个同时也更改了scrollWidth,scrollHeight其中的一个或者两个
         * 需要调用此方法重置，如果只是单方面更改了viewWidth,viewHeight其中一个或两个,则可以调用setViewWH()
         * 如果只是更改了scrollWidth,scrollHeight其中的一个或者两个，则可以调用setScrollWH()
         * @method setViewWHAndScrollWH
         * @public
         * @since 3.1.5
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        Scroller.prototype.setViewWHAndScrollWH = function (viewWidth, viewHeight, scrollWidth, scrollHeight) {
            var s = this;
            s._viewHeight = viewHeight;
            s._viewWidth = viewWidth;
            s._scrollWidth = scrollWidth;
            s._scrollHeight = scrollHeight;
            s._updateViewAndScroll();
        };
        /**
         * 当更改了viewWidth,viewHeight其中一个或两个,需要调用此方法重置.
         * @method setViewWH
         * @public
         * @since 3.1.5
         * @param {number} viewWidth
         * @param {number} viewHeight
         */
        Scroller.prototype.setViewWH = function (viewWidth, viewHeight) {
            var s = this;
            s._viewHeight = viewHeight;
            s._viewWidth = viewWidth;
            s._updateViewAndScroll();
        };
        /**
         * 当更改了scrollWidth,scrollHeight其中的一个或者两个,需要调用此方法重置.
         * @method setScrollWH
         * @public
         * @since 3.1.5
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        Scroller.prototype.setScrollWH = function (scrollWidth, scrollHeight) {
            var s = this;
            s._scrollWidth = scrollWidth;
            s._scrollHeight = scrollHeight;
            s._updateViewAndScroll();
        };
        Scroller.prototype._updateViewAndScroll = function () {
            var s = this;
            s.maxScrollX = s.viewWidth - s.scrollWidth;
            s.maxScrollY = s.viewHeight - s.scrollHeight;
            if (s.maxScrollX > 0) {
                s.maxScrollX = 0;
            }
            if (s.maxScrollY > 0) {
                s.maxScrollY = 0;
            }
            if (!s.isScrollX) {
                s.maxScrollX = 0;
                s._scrollWidth = s.viewWidth;
            }
            if (!s.isScrollY) {
                s.maxScrollY = 0;
                s._scrollHeight = s.viewHeight;
            }
            s.resetPosition(200);
        };
        Scroller.prototype.onEnterFrame = function (e) {
            var s = this;
            if (s.isRunning) {
                var now = Date.now(), newX = void 0, newY = void 0, easing = void 0;
                if (now >= s.destTime) {
                    s.isRunning = false;
                    s._translate(s.destX, s.destY);
                    if (!s.resetPosition(s.bounceTime)) {
                        s.dispatchEvent(annie.Event.ON_SCROLL_STOP);
                        if (s._curX == 0 && s._curY == 0) {
                            s.dispatchEvent(annie.Event.ON_SCROLL_TO_HEAD);
                        }
                        else if (s._curX == s.maxScrollX && s._curY == s.maxScrollY) {
                            s.dispatchEvent(annie.Event.ON_SCROLL_TO_END);
                        }
                    }
                }
                else {
                    now = (now - s.startTime) / s.duration;
                    easing = s.easingFn(now);
                    newX = (s.destX - s.startX) * easing + s.startX;
                    newY = (s.destY - s.startY) * easing + s.startY;
                    s._translate(newX, newY);
                }
            }
        };
        Scroller.prototype.onMouseEvent = function (e) {
            var s = this;
            if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                s.isRunning = false;
                s.mouseStatus = 1;
                s.distX = 0;
                s.distY = 0;
                s.startTime = Date.now();
                s.startX = s._curX;
                s.startY = s._curY;
                s.absStartX = s._curX;
                s.absStartY = s._curY;
                s.pointX = e.localX;
                s.pointY = e.localY;
            }
            else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (s.mouseStatus < 1)
                    return;
                var deltaX = e.localX - s.pointX, deltaY = e.localY - s.pointY, timestamp = Date.now(), newX = void 0, newY = void 0, absDistX = void 0, absDistY = void 0;
                s.pointX = e.localX;
                s.pointY = e.localY;
                s.distX += deltaX;
                s.distY += deltaY;
                absDistX = Math.abs(s.distX);
                absDistY = Math.abs(s.distY);
                if (timestamp - s.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    return;
                }
                if (s.isLocked) {
                    if (absDistX > absDistY + s.lockDis) {
                        deltaY = 0;
                    }
                    else if (absDistY >= absDistX + s.lockDis) {
                        deltaX = 0;
                    }
                }
                deltaX = s.isScrollX ? deltaX : 0;
                deltaY = s.isScrollY ? deltaY : 0;
                newX = s._curX + deltaX;
                newY = s._curY + deltaY;
                if (newX > 0 || newX < s.maxScrollX) {
                    newX = s.isBounce ? s._curX + deltaX / 3 : newX > 0 ? 0 : s.maxScrollX;
                }
                if (newY > 0 || newY < s.maxScrollY) {
                    newY = s.isBounce ? s._curY + deltaY / 3 : newY > 0 ? 0 : s.maxScrollY;
                }
                if (s.mouseStatus == 1) {
                    s.dispatchEvent(annie.Event.ON_SCROLL_START);
                }
                s.mouseStatus = 2;
                s._translate(newX, newY);
                if (timestamp - s.startTime > 300) {
                    s.startTime = timestamp;
                    s.startX = s._curX;
                    s.startY = s._curY;
                }
            }
            else {
                s.endTime = Date.now();
                var momentumX = void 0, momentumY = void 0, duration = s.endTime - s.startTime, newX = s._curX, newY = s._curY, time = 0, easing = null;
                if (s.resetPosition(s.bounceTime)) {
                    return;
                }
                if (s.mouseStatus != 2) {
                    return;
                }
                s.mouseStatus = 0;
                s.scrollTo(newX, newY);
                if (s.isMomentum && duration < 300) {
                    momentumX = s.isScrollX ? Scroller.toMomentum(s._curX, s.startX, duration, s.maxScrollX, s.isBounce ? s.viewWidth / 2 : 0, s.deceleration) : {
                        destination: newX,
                        duration: 0
                    };
                    momentumY = s.isScrollY ? Scroller.toMomentum(s._curY, s.startY, duration, s.maxScrollY, s.isBounce ? s.viewHeight / 2 : 0, s.deceleration) : {
                        destination: newY,
                        duration: 0
                    };
                    newX = momentumX.destination;
                    newY = momentumY.destination;
                    time = Math.max(momentumX.duration, momentumY.duration);
                }
                if (newX != s._curX || newY != s._curY) {
                    if (newX > 0 || newX < s.maxScrollX || newY > 0 || newY < s.maxScrollY) {
                        easing = annie.Tween.quadraticOut;
                    }
                    s.scrollTo(newX, newY, time, easing);
                    return;
                }
                s.dispatchEvent(annie.Event.ON_SCROLL_STOP);
            }
        };
        Scroller.prototype.destroy = function () {
            var s = this;
            if (s._container) {
                s._container.removeEventListener(annie.MouseEvent.MOUSE_MOVE, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_DOWN, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_UP, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_OUT, s._mouseEvent);
                s._container.removeEventListener(annie.Event.ENTER_FRAME, s._enterFrame);
            }
            s._container = null;
            s.easingFn = null;
            _super.prototype.destroy.call(this);
        };
        Scroller.prototype.resetPosition = function (time) {
            if (time === void 0) { time = 0; }
            var s = this;
            var x = s._curX, y = s._curY;
            time = time || 0;
            if (!s.isScrollX || s._curX > 0) {
                x = 0;
            }
            else if (s._curX < s.maxScrollX) {
                x = s.maxScrollX;
            }
            if (!s.isScrollY || s._curY > 0) {
                y = 0;
            }
            else if (s._curY < s.maxScrollY) {
                y = s.maxScrollY;
            }
            if (x == s._curX && y == s._curY) {
                return false;
            }
            s.scrollTo(x, y, time, null);
            return true;
        };
        /**
         * 从设置的x,y坐标滑过来。 注意x y位置是负数，想想为什么
         * @method scrollBy
         * @param {number} x 从哪个x坐标滑过来
         * @param {number} y 从哪个y坐标滑过来
         * @param {number} time 滑动时长 ms,0的话没效果直接跳
         * @param {Function} easing annie.Tween中指定的缓存方法
         * @public
         * @since 3.1.5
         */
        Scroller.prototype.scrollBy = function (x, y, time, easing) {
            if (time === void 0) { time = 0; }
            if (easing === void 0) { easing = null; }
            var s = this;
            x = s._curX + x;
            y = s._curY + y;
            time = time || 0;
            s.scrollTo(x, y, time, easing);
        };
        /**
         * 滑动到设置的x,y坐标。 注意x y位置是负数，想想为什么
         * @method scrollTo
         * @param {number} x 要滑去的x坐标
         * @param {number} y 要滑去的y坐标
         * @param {number} time 滑动时长 ms,0的话没效果直接跳
         * @param {Function} easing annie.Tween中指定的缓存方法
         * @public
         * @since 3.1.5
         */
        Scroller.prototype.scrollTo = function (x, y, time, easing) {
            if (time === void 0) { time = 0; }
            if (easing === void 0) { easing = null; }
            var s = this;
            if (!time) {
                s._translate(x, y);
            }
            else {
                easing = easing || annie.Tween.circularOut;
                s.startX = s._curX;
                s.startY = s._curY;
                s.startTime = Date.now();
                s.destTime = s.startTime + time;
                s.destX = x;
                s.destY = y;
                s.duration = time;
                s.easingFn = easing;
                s.isRunning = true;
            }
        };
        Scroller.prototype._translate = function (x, y) {
            var s = this;
            s._curX = x;
            s._curY = y;
            s.dispatchEvent(annie.Event.ON_SCROLL_ING, { posX: x, posY: y });
        };
        Scroller.toMomentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
            var distance = current - start, speed = Math.abs(distance) / time, destination, duration;
            deceleration = deceleration === undefined ? 0.0006 : deceleration;
            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;
            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            }
            else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }
            return {
                destination: destination,
                duration: duration
            };
        };
        ;
        return Scroller;
    }(annie.EventDispatcher));
    annieUI.Scroller = Scroller;
})(annieUI || (annieUI = {}));
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    /**
     * 用滚动的方式播放MC,回弹默认关闭，可开启
     * @class annieUI.MCScroller
     * @public
     * @extends annie.Scroller
     * @since 3.1.5
     */
    var MCScroller = /** @class */ (function (_super) {
        __extends(MCScroller, _super);
        /**
         * 构造函数
         * @method MCScroller
         * @param {annie.MovieClip} mc 要被滑动的mc
         * @param {number} rate mc 灵敏度，值越大滑动越慢，默认为10
         * @param {boolean} isVertical 是横向还是竖向滑动，默认是竖向
         */
        function MCScroller(mc, rate, isVertical) {
            if (rate === void 0) { rate = 10; }
            if (isVertical === void 0) { isVertical = true; }
            var _this = _super.call(this, mc, 0, 0, 0, 0) || this;
            _this._rate = 0;
            _this._isVertical = true;
            var s = _this;
            s._instanceType = "annieUI.MCScroller";
            s.isBounce = false;
            s.rate = rate;
            s.isVertical = isVertical;
            return _this;
        }
        Object.defineProperty(MCScroller.prototype, "rate", {
            get: function () {
                return this._rate;
            },
            /**
             * 滑动的速率，值越大，滑动越慢,默认是10
             * @property rate
             * @param {number} value
             * @since 3.1.5
             * @public
             */
            set: function (value) {
                var s = this;
                var mc = s._container;
                if (value != s._rate) {
                    s._rate = value;
                    var curFrame = s.curFramePos - 1;
                    var sw = 0, sh = 0;
                    if (s._isVertical) {
                        s._curX = -curFrame * value;
                        sh = mc.totalFrames * value;
                    }
                    else {
                        s._curY = -curFrame * value;
                        sw = mc.totalFrames * value;
                    }
                    s.setScrollWH(sw, sh);
                }
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MCScroller.prototype, "isVertical", {
            /**
             * 鼠标滑动的方向，默认纵向
             * @property isVertical
             * @since 3.1.5
             * @public
             * @return {boolean}
             */
            get: function () {
                return this._isVertical;
            },
            set: function (value) {
                var s = this;
                if (s._isVertical != value) {
                    if (!value) {
                        s._curX = s._curY;
                        s._scrollWidth = s._scrollHeight;
                        s._scrollHeight = 0;
                    }
                    else {
                        s._curY = s._curX;
                        s._scrollHeight = s._scrollWidth;
                        s._scrollWidth = 0;
                    }
                    s._isVertical = value;
                    s._updateViewAndScroll();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCScroller.prototype, "curFramePos", {
            /**
             * 只读，获取当前mc的frame具体值，带小数
             * @property curFramePos
             * @readonly
             * @return {number}
             */
            get: function () {
                var s = this;
                var frame = 0;
                if (s._isVertical) {
                    frame = s._curY / s._rate;
                }
                else {
                    frame = s._curX / s._rate;
                }
                return Math.abs(frame) + 1;
            },
            enumerable: true,
            configurable: true
        });
        MCScroller.prototype._translate = function (x, y) {
            _super.prototype._translate.call(this, x, y);
            var s = this;
            var mc = s._container;
            mc.gotoAndStop(s.curFramePos);
        };
        return MCScroller;
    }(annieUI.Scroller));
    annieUI.MCScroller = MCScroller;
})(annieUI || (annieUI = {}));
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
    var ScrollPage = /** @class */ (function (_super) {
        __extends(ScrollPage, _super);
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {annie.DisplayObject} view 需要滚动的显示对象，可为空，为空的话则会自动生成一个显示容器。
         * @param {number} viewWidth 可视区域宽
         * @param {number} viewHeight 可视区域高
         * @param {number} scrollWidth 可滚动的宽度
         * @param {number} scrollHeight 可滚动的高度
         * @example
         *      s.sPage=new annieUI.ScrollPage(null,640,1040,640,1040*4);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         */
        function ScrollPage(container, viewWidth, viewHeight, scrollWidth, scrollHeight) {
            var _this = _super.call(this) || this;
            //Event
            /**
             * annieUI.ScrollPage 组件滑动到开始位置事件
             * @event annie.Event.ON_SCROLL_TO_HEAD
             * @since 1.1.0
             */
            /**
             * annieUI.ScrollPage 组件滑动到开始位置事件
             * @event annie.Event.ON_SCROLL_ING
             * @since 3.1.0
             */
            /**
             * annieUI.ScrollPage组件停止滑动事件
             * @event annie.Event.ON_SCROLL_STOP
             * @since 1.1.0
             */
            /**
             * annieUI.ScrollPage组件开始滑动事件
             * @event annie.Event.ON_SCROLL_START
             * @since 1.1.0
             */
            /**
             * annieUI.ScrollPage组件滑动到结束位置事件
             * @event annie.Event.ON_SCROLL_TO_END
             * @since 1.1.0
             */
            // 遮罩对象
            _this.maskObj = new Shape();
            _this._view = null;
            var s = _this;
            s._instanceType = "annieUI.ScrollPage";
            if (container) {
                s._view = container;
            }
            else {
                s._view = new annie.Sprite();
            }
            s.addChild(s.maskObj);
            s.addChild(s._view);
            s.view.mask = s.maskObj;
            s.maskObj.x = -1;
            s.maskObj.y = -1;
            s.maskObj["_isUseToMask"] = 0;
            s.maskObj.alpha = 0;
            s._scroller = new annieUI.Scroller(s, viewWidth, viewHeight, scrollWidth, scrollHeight);
            s._scroller.addEventListener(annie.Event.ON_SCROLL_ING, function (e) {
                s._view.y = e.data.posY;
                s._view.x = e.data.posX;
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_START, function (e) {
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_STOP, function (e) {
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_TO_HEAD, function (e) {
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_TO_END, function (e) {
                s.dispatchEvent(e);
            });
            s.setViewWH(viewWidth, viewHeight);
            return _this;
        }
        Object.defineProperty(ScrollPage.prototype, "view", {
            /**
             * 真正的被滚动的显示对象
             * @property view
             * @public
             * @since 1.0.0
             * @type {annie.Sprite}
             */
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPage.prototype, "scroller", {
            /**
             * scroller滑动控制器
             * @property scroller
             * @readonly
             * @public
             * @since 3.1.5
             */
            get: function () {
                return this._scroller;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置，如果只需要一个方向上可滑动，可以将view的宽或者高等于滑动的宽或者高
         * @method setViewWH
         * @param {number}viewWidth 设置可见区域的宽
         * @param {number}viewHeight 设置可见区域的高
         * @public
         * @since 3.1.5
         */
        ScrollPage.prototype.setViewWH = function (viewWidth, viewHeight) {
            var s = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, viewWidth + 2, viewHeight + 2);
            s.maskObj.endFill();
            if (s.scroll) {
                s.scroll.setViewWH(viewWidth, viewHeight);
            }
        };
        ScrollPage.prototype.destroy = function () {
            var s = this;
            s._scroller.destroy();
            s._scroller = null;
            _super.prototype.destroy.call(this);
        };
        return ScrollPage;
    }(Sprite));
    annieUI.ScrollPage = ScrollPage;
})(annieUI || (annieUI = {}));
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    /**
     * 有些时候需要大量的有规则的滚动内容。这个时候就应该用到这个类了
     * @class annieUI.ScrollList
     * @public
     * @extends annieUI.ScrollPage
     * @since 1.0.9
     */
    var ScrollList = /** @class */ (function (_super) {
        __extends(ScrollList, _super);
        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemWidth item宽
         * @param {number} itemHeight item高
         * @param {number} viewWidth 列表的宽
         * @param {number} viewHeight 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @param {number} step 纵向就是分几列，横向就是分几行，默认是1列或者1行
         * @since 1.0.9
         */
        function ScrollList(itemClassName, itemWidth, itemHeight, viewWidth, viewHeight, isVertical, step) {
            if (isVertical === void 0) { isVertical = true; }
            if (step === void 0) { step = 1; }
            var _this = _super.call(this, null, viewWidth, viewHeight, viewWidth, viewHeight) || this;
            _this._items = null;
            _this._isInit = 0;
            _this.data = [];
            _this.downL = null;
            _this._lastFirstId = -1;
            _this._distance = 0;
            _this._paramXY = "y";
            _this._isVertical = true;
            _this._maxDistance = 0;
            var s = _this;
            s._instanceType = "annieUI.ScrollList";
            s._itemW = itemWidth;
            s._itemH = itemHeight;
            s._items = [];
            s._itemClass = itemClassName;
            s._itemCount = 0;
            s._cols = step;
            s.isVertical = isVertical;
            s.addEventListener(annie.Event.ENTER_FRAME, s.flushData.bind(s));
            return _this;
        }
        Object.defineProperty(ScrollList.prototype, "isVertical", {
            get: function () {
                return this._isVertical;
            },
            set: function (value) {
                var s = this;
                s._isVertical = value;
                s._updateItems();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollList.prototype, "loadingView", {
            /**
             * 获取下拉滚动的loadingView对象
             * @property loadingView
             * @since 1.0.9
             * @return {DisplayObject}
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
         * @param {boolean} isReset 是否重置数据列表。
         * @since 1.0.9
         */
        ScrollList.prototype.updateData = function (data, isReset) {
            if (isReset === void 0) { isReset = false; }
            var s = this;
            if (data) {
                if (!s._isInit || isReset) {
                    s.data = data;
                }
                else {
                    s.data = s.data.concat(data);
                }
                s._isInit = 1;
            }
            s._lastFirstId = -1;
            s._maxDistance = Math.ceil(s.data.length / s._cols) * s._itemRow;
            if (s.downL) {
                s.downL[s._paramXY] = Math.max(s._distance, s._maxDistance);
                var wh = s.downL.getWH();
                s._maxDistance += (s._paramXY == "x" ? wh.width : wh.height);
            }
            s.resetMaxDistance();
        };
        ScrollList.prototype.resetMaxDistance = function () {
            var s = this;
            if (s._isVertical) {
                s.scroller._scrollHeight = s._maxDistance;
            }
            else {
                s.scroller._scrollWidth = s._maxDistance;
            }
            s.scroller._updateViewAndScroll();
        };
        ScrollList.prototype.flushData = function () {
            var s = this;
            if (s._isInit > 0) {
                var id = (Math.abs(Math.floor(s._view[s._paramXY] / s._itemRow)) - 1) * s._cols;
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
                    if (s._isInit == 1) {
                        item._a2x_sl_id = -1;
                    }
                    if (item._a2x_sl_id != id) {
                        item.initData(s.data[id] ? id : -1, s.data[id]);
                        item[s._paramXY] = Math.floor(id / s._cols) * s._itemRow;
                        item[s._disParam] = (id % s._cols) * s._itemCol;
                        //如果没有数据则隐藏
                        if (s.data[id]) {
                            item._a2x_sl_id = id;
                            item.visible = true;
                        }
                        else {
                            item._a2x_sl_id = -1;
                            item.visible = false;
                        }
                    }
                    id++;
                }
                s._isInit = 2;
            }
        };
        ScrollList.prototype._updateItems = function () {
            var s = this;
            if (s._isVertical) {
                s._disParam = "x";
                s._paramXY = "y";
                s._itemRow = s._itemH;
                s._itemCol = s._itemW;
                s._distance = s._scroller.viewHeight;
            }
            else {
                s._disParam = "y";
                s._paramXY = "x";
                s._itemRow = s._itemW;
                s._itemCol = s._itemH;
                s._distance = s._scroller.viewWidth;
            }
            var newCount = (Math.ceil(s._distance / s._itemRow) + 1) * s._cols;
            if (newCount != s._itemCount) {
                if (newCount > s._itemCount) {
                    for (var i = s._itemCount; i < newCount; i++) {
                        var item = new s._itemClass();
                        item.id = -1;
                        item.data = null;
                        s._items.push(item);
                        s._view.addChild(item);
                    }
                }
                else {
                    for (var i = 0; i < s._itemCount - newCount; i++) {
                        s._view.removeChild(s._items.pop());
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
                s._view.removeChild(s.downL);
                var wh = s.downL.getWH();
                s._maxDistance -= (s._paramXY == "x" ? wh.width : wh.height);
                s.downL = null;
            }
            if (downLoading) {
                s.downL = downLoading;
                s._view.addChild(downLoading);
                s.downL[s._paramXY] = Math.max(s._distance, s._maxDistance);
                var wh = s.downL.getWH();
                s._maxDistance += (s._paramXY == "x" ? wh.width : wh.height);
            }
            else {
                s.isStop = false;
            }
            s.resetMaxDistance();
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
    }(annieUI.ScrollPage));
    annieUI.ScrollList = ScrollList;
})(annieUI || (annieUI = {}));
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    var Sprite = annie.Sprite;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 有时我们需要从外部获取一张个人头像，将它变成方形或者圆形展示出来。
     * 又希望他能按照我们的尺寸展示，这个时候你就需要用到FacePhoto类啦。
     * @class annieUI.FacePhoto
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    var FacePhoto = /** @class */ (function (_super) {
        __extends(FacePhoto, _super);
        //events
        /**
         * 图片加载完成事件
         * @event COMPLETE
         * @since 1.0.0
         */
        /**
         * 构造函数
         * @method  FacePhoto
         * @since 1.0.0
         * @public
         * @example
         *      var circleface = new annieUI.FacePhoto(),
         *          rectFace=new annieUI.FacePhoto();
         *          //圆形头像
         *          circleface.init('http://test.annie2x.com/biglong/logo.jpg', 100,100, 0);
         *          circleface.x = 260;
         *          circleface.y = 100;
         *          s.addChild(circleface);
         *          //方形头像
         *          rectFace.init('http://test.annie2x.com/biglong/logo.jpg', 200,200, 1);
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
            s.maskObj = new annie.Shape();
            s.photo.onload = function (e) {
                s.bitmap = new annie.Bitmap(s.photo);
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                var scale = s.radio / (s.photo.width < s.photo.height ? s.photo.width : s.photo.height);
                s.bitmap.scaleX = s.bitmap.scaleY = scale;
                s.bitmap.x = (s.radioW - s.photo.width * scale) >> 1;
                s.bitmap.y = (s.radioH - s.photo.height * scale) >> 1;
                if (s.maskType == 0) {
                    s.maskObj.drawEllipse(0, 0, s.radioW, s.radioH);
                }
                else {
                    s.maskObj.drawRect(0, 0, s.radioW, s.radioH);
                }
                s.maskObj.endFill();
                s.addChild(s.bitmap);
                s.addChild(s.maskObj);
                s.bitmap.mask = s.maskObj;
                s.dispatchEvent("onComplete");
            };
            return _this;
        }
        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param {string} src 头像的地址
         * @param {number} w 指定头像的宽
         * @param {number} h 指定头像的高
         * @param {number} maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形或椭圆形 1 正方形或者长方形 默认是圆形
         */
        FacePhoto.prototype.init = function (src, w, h, maskType) {
            if (maskType === void 0) { maskType = 0; }
            var s = this;
            s._bounds.width = w;
            s._bounds.height = h;
            s.radioW = w;
            s.radioH = h;
            if (w > h) {
                s.radio = w;
            }
            else {
                s.radio = h;
            }
            s.photo.corssOrigin = "anonymous";
            if (s.photo.src != src)
                s.photo.src = src;
            if (s.maskType != maskType)
                s.maskType = maskType;
        };
        FacePhoto.prototype.destroy = function () {
            var s = this;
            s.bitmap = null;
            s.photo = null;
            s.maskObj = null;
            _super.prototype.destroy.call(this);
        };
        return FacePhoto;
    }(Sprite));
    annieUI.FacePhoto = FacePhoto;
})(annieUI || (annieUI = {}));
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
    var SlidePage = /** @class */ (function (_super) {
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
            var _this = _super.call(this) || this;
            /**
             * annieUI.Slide 组件开始滑动事件
             * @event annie.Event.ON_SLIDE_START
             * @since 1.1.0
             */
            /**
             * annieUI.Slide 组件结束滑动事件
             * @event annie.Event.ON_SLIDE_END
             * @since 1.1.0
             */
            /**
             * 页面个数
             * @property listLen
             * @type {number}
             * @protected
             * @default 0
             */
            _this.listLen = 0;
            /**
             * 页面滑动容器
             * @property view
             * @type {annie.Sprite}
             * @since 1.1.0
             * @public
             */
            _this.view = new annie.Sprite();
            _this.maskObj = new annie.Shape();
            /**
             * 容器活动速度
             * @property slideSpeed
             * @type {number}
             * @public
             * @default 0.2
             */
            _this.slideSpeed = 0.2;
            //是否滑动中断
            _this._isBreak = false;
            /**
             * 滚动距离
             * @property distance
             * @type {number}
             * @protected
             * @default 0
             * @since 1.0.0
             */
            _this.distance = 0;
            //触摸点结束点X
            _this.touchEndX = 0;
            _this.movingX = 0;
            _this.movingY = 0;
            _this._moveDis = 0;
            //触摸点结束点Y
            _this.touchEndY = 0;
            /**
             * 当前页面索引ID 默认从0开始
             * @property currentPageIndex
             * @type {number}
             * @public
             * @since 1.0.3
             * @default 0
             */
            _this.currentPageIndex = 0;
            /**
             * 上下的回弹率 默认0.3
             * @property reBound
             * @type {number}
             * @public
             * @since 1.0.3
             * @default 0.3
             */
            _this.reBound = 0.3;
            /**
             * 页面是否滑动跟随，默认false
             * @property isPageFollowToMove
             * @type {boolean}
             * @public
             * @since 1.0.3
             * @default false
             */
            _this.isPageFollowToMove = false;
            /**
             * 页面的跟随缓动系数率，默认0.7
             * @property follow
             * @type {number}
             * @public
             * @since 1.0.3
             * @default 0.7
             */
            _this.follow = 0.7;
            /**
             * 页面是否移动
             * @property isMoving
             * @type {boolean}
             * @public
             * @default false
             * @public
             */
            _this.isMoving = false;
            /**
             * 页面宽
             * @property viewWidth
             * @type {number}
             * @protected
             */
            _this.viewWidth = 0;
            /**
             * 页面高
             * @property viewHeight
             * @type {number}
             * @protected
             */
            _this.viewHeight = 0;
            /**
             * 页面对象列表
             * @property pageList
             * @type {Array}
             * @public
             */
            _this.pageList = [];
            /**
             * 页面对象的类列表
             * @property pageClassList
             * @type {Array}
             * @public
             */
            _this.pageClassList = [];
            _this.lastX = 0;
            _this.lastY = 0;
            /**
             * 是否点击了鼠标
             * @property isMouseDown
             * @type {boolean}
             * @public
             */
            _this.isMouseDown = false;
            /**
             * 是否允许通过鼠标去滚动
             * @property isCanUseMouseScroll
             * @type {boolean}
             * @since 3.0.1
             */
            _this.isCanUseMouseScroll = true;
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
            _this.paramXY = "y";
            var s = _this;
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
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, me, false);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, me, false);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, me, false);
            s.addEventListener(annie.MouseEvent.MOUSE_OUT, me);
            return _this;
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
        //触摸事件 onMouseEvent
        SlidePage.prototype.onMouseEvent = function (e) {
            var s = this;
            if (s.isMoving || !s.isCanUseMouseScroll)
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
                if (!s.isMouseDown) {
                    return;
                }
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
            else {
                if (!s.isMouseDown)
                    return;
                var ts = s.movingY;
                s.isMouseDown = false;
                if (!s.isVertical) {
                    ts = s.movingX;
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
         * @param {number} index 要跳到页的索引
         * @param {boolean} noTween 是否需要动画过渡，如果不需要设置成true
         */
        SlidePage.prototype.slideTo = function (index, noTween) {
            if (noTween === void 0) { noTween = false; }
            var s = this;
            if (s.currentPageIndex == index)
                return;
            if (s.isMoving)
                return;
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
    var FlipBook = /** @class */ (function (_super) {
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
            var _this = _super.call(this) || this;
            //Events
            /**
             * annieUI.FlipBook组件翻页开始事件
             * @event annie.Event.ON_FLIP_START
             * @since 1.1.0
             */
            /**
             * annieUI.FlipBook组件翻页结束事件
             * @event annie.Event.ON_FLIP_STOP
             * @since 1.1.0
             */
            /**
             * 电子杂志组件类
             * @class annieUI.FlipBook
             * @public
             * @extends annie.Sprite
             * @since 1.0.3
             */
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
            /**
             * 翻页速度，0-1之间，值越小，速度越快
             * @property
             * @since 1.1.3
             * @type {number}
             */
            _this.speed = 0.4;
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
            var s = _this;
            s._instanceType = "annieUI.FlipBook";
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
            s.rPage0.mouseEnable = false;
            s.rPage1.mouseEnable = false;
            s.shadow0.mouseEnable = false;
            s.shadow1.mouseEnable = false;
            s.setShadowMask(s.shadow0, s.bW * 1.5, s.bH * 3);
            s.setShadowMask(s.shadow1, s.bW * 1.5, s.bH * 3);
            s.rPage1.mask = s.rMask1;
            s.shadow1.mask = s.rMask1;
            s.shadow0.mask = s.rMask0;
            s.rPage0.mask = s.rMask0;
            s.shadow0.visible = false;
            s.shadow1.visible = false;
            s.addChild(s.pageMC);
            s.addChild(s.rPage0);
            s.addChild(s.shadow0);
            s.addChild(s.rPage1);
            s.addChild(s.shadow1);
            s.addChild(s.rMask0);
            s.addChild(s.rMask1);
            s.setPage(s.currPage);
            s.md = s.onMouseDown.bind(s);
            s.mu = s.onMouseUp.bind(s);
            s.mm = s.onMouseMove.bind(s);
            var em = s.onEnterFrame.bind(s);
            s.addEventListener(annie.Event.ADD_TO_STAGE, function (e) {
                s.stage.addEventListener(MouseEvent.MOUSE_DOWN, s.md);
                s.stage.addEventListener(MouseEvent.MOUSE_UP, s.mu);
                s.stage.addEventListener(MouseEvent.MOUSE_MOVE, s.mm);
                s.addEventListener(Event.ENTER_FRAME, em);
            });
            s.addEventListener(annie.Event.REMOVE_TO_STAGE, function (e) {
                s.stage.removeEventListener(MouseEvent.MOUSE_DOWN, s.md);
                s.stage.removeEventListener(MouseEvent.MOUSE_UP, s.mu);
                s.stage.removeEventListener(MouseEvent.MOUSE_MOVE, s.mm);
                s.removeEventListener(Event.ENTER_FRAME, em);
            });
            return _this;
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
                s.getShadow(s.shadow0, s.p1, movePoint, 0.5);
                s.getShadow(s.shadow1, s.p1, movePoint, 0.45);
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
                s.getShadow(s.shadow0, s.p2, movePoint, 0.5);
                s.getShadow(s.shadow1, s.p2, movePoint, 0.45);
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
                s.getShadow(s.shadow0, s.p3, movePoint, 0.5);
                s.getShadow(s.shadow1, s.p3, movePoint, 0.4);
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
                s.getShadow(s.shadow0, s.p4, movePoint, 0.5);
                s.getShadow(s.shadow1, s.p4, movePoint, 0.4);
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
        FlipBook.prototype.setShadowMask = function (shape, g_width, g_height) {
            shape.beginLinearGradientFill([-g_width * 0.5, 4, g_width * 0.5, 4], [[0, "#000000", 0], [1, "#000000", 0.6]]);
            shape.drawRect(-g_width * 0.5, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
            shape.beginLinearGradientFill([-g_width * 0.5, 4, g_width * 0.5, 4], [[1, "#000000", 0], [0, "#000000", 0.6]]);
            shape.drawRect(0, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
        };
        FlipBook.prototype.getShadow = function (shape, point1, point2, arg) {
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
            s.md = null;
            s.mu = null;
            s.mm = null;
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
    annieUI.FlipBook = FlipBook;
})(annieUI || (annieUI = {}));
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 画板类
     * @class annieUI.DrawingBoard
     * @public
     * @extends annie.Bitmap
     * @since 1.1.1
     */
    var DrawingBoard = /** @class */ (function (_super) {
        __extends(DrawingBoard, _super);
        /**
         * 构造函数
         * @method DrawingBoard
         * @param width 画板宽
         * @param height 画板高
         * @param bgColor 背景色 默认透明
         * @since 1.1.1
         */
        function DrawingBoard(width, height, bgColor) {
            if (bgColor === void 0) { bgColor = ""; }
            var _this = _super.call(this, DrawingBoard._getDrawCanvas(width, height)) || this;
            _this.context = null;
            _this._isMouseDown = false;
            _this._drawRadius = 50;
            /**
             * 绘画颜色, 可以是任何的颜色类型
             * @property drawColor
             * @type {string}
             * @public
             * @since
             * @type {any}
             */
            _this.drawColor = "#ffffff";
            /**
             * 背景色 可以是任何的颜色类型
             * @property bgColor
             * @type {any}
             * @public
             * @since 1.1.1
             */
            _this.bgColor = "";
            /**
             * 总步数数据
             * @property totalStepList
             * @protected
             * @type {any[]}
             */
            _this.totalStepList = [];
            /**
             * 当前步数所在的id
             * @property currentStepId
             * @protected
             * @type {number}
             */
            _this.currentStepId = 0;
            var s = _this;
            s._instanceType = "annieUI.DrawingBoard";
            s.context = s._texture.getContext('2d');
            s.context.lineCap = "round";
            s.context.lineJoin = "round";
            s.reset(bgColor);
            var mouseDown = s.onMouseDown.bind(s);
            var mouseMove = s.onMouseMove.bind(s);
            var mouseUp = s.onMouseUp.bind(s);
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, mouseDown);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, mouseMove);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, mouseUp);
            return _this;
        }
        Object.defineProperty(DrawingBoard.prototype, "drawRadius", {
            /**
             * 绘画半径
             * @property drawRadius
             * @type {number}
             * @public
             * @since 1.1.1
             */
            get: function () {
                return this._drawRadius;
            },
            set: function (value) {
                this._drawRadius = value;
            },
            enumerable: true,
            configurable: true
        });
        ;
        DrawingBoard._getDrawCanvas = function (width, height) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };
        DrawingBoard.prototype.onMouseDown = function (e) {
            var s = this;
            s._isMouseDown = true;
            var ctx = s.context;
            ctx.beginPath();
            ctx.strokeStyle = s.drawColor;
            ctx.lineWidth = s._drawRadius;
            var lx = e.localX >> 0;
            var ly = e.localY >> 0;
            ctx.moveTo(lx, ly);
            s.addStepObj = {};
            s.addStepObj.c = s.drawColor;
            s.addStepObj.r = s._drawRadius;
            s.addStepObj.sx = lx;
            s.addStepObj.sy = ly;
            s.addStepObj.ps = [];
        };
        ;
        DrawingBoard.prototype.onMouseUp = function (e) {
            var s = this;
            if (s._isMouseDown) {
                s._isMouseDown = false;
                if (s.addStepObj.ps && s.addStepObj.ps.length > 0) {
                    s.currentStepId++;
                    s.totalStepList.push(s.addStepObj);
                }
            }
        };
        ;
        DrawingBoard.prototype.onMouseMove = function (e) {
            var s = this;
            if (s._isMouseDown) {
                var ctx = s.context;
                var lx = e.localX >> 0;
                var ly = e.localY >> 0;
                ctx.lineTo(lx, ly);
                ctx.stroke();
                s.addStepObj.ps.push(lx, ly);
            }
        };
        ;
        /**
         * 重置画板
         * @method reset
         * @param bgColor
         * @public
         * @since 1.1.1
         */
        DrawingBoard.prototype.reset = function (bgColor) {
            if (bgColor === void 0) { bgColor = ""; }
            var s = this;
            if (bgColor != "") {
                s.bgColor = bgColor;
            }
            if (s.bgColor != "") {
                s.context.fillStyle = s.bgColor;
                s.context.fillRect(0, 0, s._bitmapData.width, s._bitmapData.height);
            }
            else {
                s.context.clearRect(0, 0, s._bitmapData.width, s._bitmapData.height);
            }
            s.currentStepId = 0;
            s.totalStepList = [];
        };
        /**
         * 撤销步骤
         * @method cancel
         * @param {number} step 撤销几步 0则全部撤销,等同于reset
         * @public
         * @since 1.1.1
         */
        DrawingBoard.prototype.cancel = function (step) {
            if (step === void 0) { step = 0; }
            var s = this;
            if (step == 0) {
                s.reset();
            }
            else {
                if (s.currentStepId - step >= 0) {
                    s.currentStepId -= step;
                    s.totalStepList.splice(s.currentStepId, step);
                    if (s.bgColor != "") {
                        s.context.fillStyle = s.bgColor;
                        s.context.fillRect(0, 0, s.bitmapData.width, s.bitmapData.height);
                    }
                    else {
                        s.context.clearRect(0, 0, s.bitmapData.width, s.bitmapData.height);
                    }
                    var len = s.totalStepList.length;
                    for (var i = 0; i < len; i++) {
                        var ctx = s.context;
                        ctx.beginPath();
                        ctx.strokeStyle = s.totalStepList[i].c;
                        ctx.lineWidth = s.totalStepList[i].r;
                        ctx.moveTo(s.totalStepList[i].sx, s.totalStepList[i].sy);
                        var ps = s.totalStepList[i].ps;
                        var pLen = ps.length;
                        for (var m = 0; m < pLen; m += 2) {
                            ctx.lineTo(ps[m], ps[m + 1]);
                            ctx.stroke();
                        }
                    }
                }
                else {
                    return false;
                }
            }
            return true;
        };
        DrawingBoard.prototype.destroy = function () {
            var s = this;
            s.context = null;
            s.totalStepList = null;
            s.drawColor = null;
            s.bgColor = null;
            s.addStepObj = null;
            _super.prototype.destroy.call(this);
        };
        return DrawingBoard;
    }(annie.Bitmap));
    annieUI.DrawingBoard = DrawingBoard;
})(annieUI || (annieUI = {}));
/**
 * @module annieUI
 */
var annieUI;
(function (annieUI) {
    /**
     * 刮刮卡类
     * @class annieUI.ScratchCard
     * @public
     * @extends annie.DrawingBoard
     * @since 1.1.1
     */
    var ScratchCard = /** @class */ (function (_super) {
        __extends(ScratchCard, _super);
        //Events
        /**
         * annie.ScratchCard 刮刮卡事件，刮了多少，一个百分比
         * @event annie.Event.ON_DRAW_PERCENT
         * @since 1.0.9
         *
         */
        /**
         * 构造函数
         * 请监听 annie.Event.ON_DRAW_PERCENT事件来判断刮完多少百分比了。
         * @method ScratchCard
         * @param width 宽
         * @param height 高
         * @param frontColorObj 没刮开之前的图，可以为单色，也可以为位图填充。一般是用位图填充，如果生成位图填充，请自行复习canvas位图填充
         * @param backColorObj 被刮开之后的图，可以为单色，也可以为位图填充。一般是用位图填充，如果生成位图填充，请自行复习canvas位图填充
         * @param drawRadius 刮刮卡刮的时候的半径，默认为50
         */
        function ScratchCard(width, height, frontColorObj, backColorObj, drawRadius) {
            if (drawRadius === void 0) { drawRadius = 50; }
            var _this = _super.call(this, width, height, frontColorObj) || this;
            _this._drawList = [];
            _this._totalDraw = 1;
            _this._currentDraw = 0;
            var s = _this;
            s._instanceType = "annieUI.ScratchCard";
            s.drawColor = backColorObj;
            s.drawRadius = drawRadius;
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, function (e) {
                if (s._isMouseDown) {
                    //通过移动，计算刮开的面积
                    var dw = Math.floor(e.localX / s._drawRadius);
                    var dh = Math.floor(e.localY / s._drawRadius);
                    if (s._drawList[dw] && s._drawList[dw][dh]) {
                        s._drawList[dw][dh] = false;
                        s._currentDraw++;
                        //抛事件
                        var per = Math.floor(s._currentDraw / s._totalDraw * 100);
                        s.dispatchEvent("onDrawPercent", { per: per });
                    }
                }
            });
            return _this;
        }
        /**
         * 重置刮刮卡
         * @method reset
         * @param backColorObj 要更换的被刮出来的图片,不赋值的话默认之前设置的
         * @since 1.1.1
         * @public
         */
        ScratchCard.prototype.reset = function (backColorObj) {
            if (backColorObj === void 0) { backColorObj = ""; }
            _super.prototype.reset.call(this, backColorObj);
            var s = this;
            if (s._drawList) {
                if (backColorObj != "") {
                    s.drawColor = backColorObj;
                }
                s._currentDraw = 0;
                var dw = Math.floor(s._bitmapData.width / s._drawRadius);
                var dh = Math.floor(s._bitmapData.height / s._drawRadius);
                s._totalDraw = dw * dh;
                for (var i = 0; i < dw; i++) {
                    s._drawList[i] = [];
                    for (var j = 0; j < dh; j++) {
                        s._drawList[i][j] = true;
                    }
                }
            }
        };
        /**
         * 撤销步骤 没有任何功能，只是把从基类中的代码移除，调用不会产生任何效果
         * @method cancel
         * @param step
         * @public
         * @since 1.1.1
         * @return {boolean}
         */
        ScratchCard.prototype.cancel = function (step) {
            if (step === void 0) { step = 0; }
            console.log("no support");
            return false;
        };
        Object.defineProperty(ScratchCard.prototype, "drawRadius", {
            set: function (value) {
                var s = this;
                s._drawRadius = value;
                var dw = Math.floor(s._bitmapData.width / s._drawRadius);
                var dh = Math.floor(s._bitmapData.height / s._drawRadius);
                s._totalDraw = dw * dh;
                for (var i = 0; i < dw; i++) {
                    s._drawList[i] = [];
                    for (var j = 0; j < dh; j++) {
                        s._drawList[i][j] = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        ScratchCard.prototype.destroy = function () {
            var s = this;
            s._drawList = null;
            _super.prototype.destroy.call(this);
        };
        return ScratchCard;
    }(annieUI.DrawingBoard));
    annieUI.ScratchCard = ScratchCard;
})(annieUI || (annieUI = {}));
