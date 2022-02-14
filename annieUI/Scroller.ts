/**
 * @module annieUI
 */
namespace annieUI {
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.Scroller
     * @public
     * @extends annie.AObject
     * @since 3.1.0
     */
    export class Scroller extends annie.EventDispatcher {
        //Event
        /**
         * annieUI.Scroller 组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_ING
         * @since 3.1.0
         */
        /**
         * annieUI.Scroller 组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_TO_HEAD
         * @since 3.1.5
         */
        /**
         * annieUI.Scroller 组件停止滑动事件
         * @event annie.Event.ON_SCROLL_STOP
         * @since 3.1.5
         */
        /**
         * annieUI.Scroller 组件开始滑动事件
         * @event annie.Event.ON_SCROLL_START
         * @since 3.1.5
         */
        /**
         * annieUI.Scroller 组件滑动到结束位置事件
         * @event annie.Event.ON_SCROLL_TO_END
         * @since 3.1.5
         */
        protected _container: annie.DisplayObject;
        /**
         * 是否纵向滚动
         * @property isScrollY
         * @type {boolean}
         * @public
         * @since 3.1.5
         * @default true;
         */
        public isScrollY: boolean = true;
        /**
         * 是否横向滚动
         * @property isScrollX
         * @type {boolean}
         * @since 3.1.5
         * @public
         * @default true;
         */
        public isScrollX: boolean = true;
        /**
         * 是否松开鼠标后让其自由缓冲滑动
         * @property isMomentum
         * @type {boolean}
         * @since 3.1.5
         * @public
         * @default true;
         */
        public isMomentum: boolean = true;
        /**
         * 是否滑到边界后有回弹效果
         * @property isBounce
         * @type {boolean}
         * @since 3.1.5
         * @public
         * @default true;
         */
        public isBounce: boolean = true;
        /**
         * 回弹的动效时长,单位:ms
         * @property bounceTime
         * @type {number}
         * @public
         * @since 3.1.5
         * @default 300
         */
        public bounceTime: number = 300;
        /**
         * 是否需要横向纵向保护，有些时候你想纵向滑动，但鼠标也轻微的左右飘了，如果不lock刚好左右滑动也被允许的话，则左右也会滑动，横向滑动则相反。
         * 如果想鼠标不那么灵敏的话，可以加上一把锁，这样左右滑的时候上下不会滑，上下滑的时候左右不会滑
         * @property isLocked
         * @type {boolean}
         * @public
         * @since 3.1.5
         * @default 300
         */
        public isLocked: boolean = true;
        /**
         * 锁的像素范围
         * @property lockDis
         * @type {number}
         * @since 3.1.5
         * @public
         * @default 5
         */
        public lockDis: number = 5;

        /**
         * 当前滑动的x坐标 更改此参数则需要调用resetPosition()方法生效
         * @property curX
         * @type {number}
         * @since 3.1.5
         * @default 0
         */
        public get curX(): number {
            return this._curX;
        }

        protected _curX: number = 0;

        /**
         * 当前滑动的y坐标 更改此参数则需要调用resetPosition()方法生效
         * @property curY
         * @type {number}
         * @since 3.1.5
         * @default 0
         */
        public get curY(): number {
            return this._curY;
        }

        protected _curY: number = 0;

        /**
         * 当前显示范围的宽
         * @property viewWidth
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get viewWidth(): number {
            return this._viewWidth;
        }

        public _viewWidth: number = 0;

        /**
         * 当前显示范围的高
         * @property viewHeight
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get viewHeight(): number {
            return this._viewHeight;
        }

        public _viewHeight: number = 0;

        /**
         * 当前横向的滑动范围
         * @property scrollWidth
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get scrollWidth(): number {
            return this._scrollWidth;
        }

        public _scrollWidth: number = 0;

        /**
         * 当前纵向的滑动范围
         * @property scrollHeight
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get scrollHeight(): number {
            return this._scrollHeight;
        }

        public _scrollHeight: number = 0;
        /**
         * 是否正在滑动中
         * @property isRunning
         * @type {boolean}
         * @since 3.1.5
         * @default false
         */
        public isRunning: boolean;
        private startX: number = 0;
        private startY: number = 0;
        private maxScrollX: number = 0;
        private maxScrollY: number = 0;
        private endTime: number = 0;
        private mouseStatus: number = 0;
        private distX: number = 0;
        private distY: number = 0;
        private startTime: number = 0;
        private pointX: number = 0;
        private pointY: number = 0;
        /**
         * 滑动衰减系数，值越大衰减越快
         * @property deceleration
         * @type {number}
         * @public
         * @since 3.2.1
         * @default 0.0006
         */
        public deceleration: number = 0.0006;
        private destTime: number = 0;
        private destX: number = 0;
        private destY: number = 0;
        public duration: number = 0;
        private easingFn: Function;

        /**
         * 初始化
         * @method Scroller
         * @param {annie.MovieClip} container
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        constructor(container: annie.DisplayObject, viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number) {
            super();
            let s = this;
            s._instanceType = "annieUI.Scroller";
            s._mouseEvent = s.onMouseEvent.bind(s);
            s._enterFrame = s.onEnterFrame.bind(s);
            s.init(container, viewWidth, viewHeight, scrollWidth, scrollHeight);
        }

        /**
         * 初始化，也可以反复调用此方法重用scroller
         * @method init
         * @param {annie.MovieClip} container
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         * @public
         * @since 3.1.5
         */
        public init(container: annie.DisplayObject, viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number) {
            let s = this;
            if (s._container && s._container != container) {
                //移除
                s._container.removeEventListener(annie.MouseEvent.MOUSE_DOWN, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_MOVE, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_UP, s._mouseEvent, false);
                //这里不要加false
                s._container.removeEventListener(annie.MouseEvent.MOUSE_OUT, s._mouseEvent);
                s._container.removeEventListener(annie.Event.ENTER_FRAME, s._enterFrame);
            }
            if (s._container != container) {
                s._container = container;
                container.addEventListener(annie.MouseEvent.MOUSE_DOWN, s._mouseEvent, false);
                container.addEventListener(annie.MouseEvent.MOUSE_MOVE, s._mouseEvent, false);
                container.addEventListener(annie.MouseEvent.MOUSE_UP, s._mouseEvent, false);
                //这里不要加false
                container.addEventListener(annie.MouseEvent.MOUSE_OUT, s._mouseEvent);
                container.addEventListener(annie.Event.ENTER_FRAME, s._enterFrame);
            }
            s.isRunning = false;
            s.endTime = 0;
            s.setViewWHAndScrollWH(viewWidth, viewHeight, scrollWidth, scrollHeight);
        }

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
        public setViewWHAndScrollWH(viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number): void {
            let s = this;
            s._viewHeight = viewHeight;
            s._viewWidth = viewWidth;
            s._scrollWidth = scrollWidth;
            s._scrollHeight = scrollHeight;
            s._updateViewAndScroll();
        }

        /**
         * 当更改了viewWidth,viewHeight其中一个或两个,需要调用此方法重置.
         * @method setViewWH
         * @public
         * @since 3.1.5
         * @param {number} viewWidth
         * @param {number} viewHeight
         */
        public setViewWH(viewWidth: number, viewHeight: number) {
            let s = this;
            s._viewHeight = viewHeight;
            s._viewWidth = viewWidth;
            s._updateViewAndScroll();
        }

        /**
         * 当更改了scrollWidth,scrollHeight其中的一个或者两个,需要调用此方法重置.
         * @method setScrollWH
         * @public
         * @since 3.1.5
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        public setScrollWH(scrollWidth: number, scrollHeight: number) {
            let s = this;
            s._scrollWidth = scrollWidth;
            s._scrollHeight = scrollHeight;
            s._updateViewAndScroll();
        }

        public _updateViewAndScroll() {
            let s = this;
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
        }

        private _mouseEvent: Function = null;
        private _enterFrame: Function = null;

        protected onEnterFrame(e: annie.Event){
            let s = this;
            if (s.isRunning) {
                let now = Date.now(),
                    newX:number, newY:number,
                    easing:number;
                if (now >= s.destTime) {
                    s.isRunning = false;
                    s._translate(s.destX, s.destY);
                    if (!s.resetPosition(s.bounceTime)) {
                        s.dispatchEvent(annie.Event.ON_SCROLL_STOP);
                        //有可能内容区域没有滑动区域宽,这两个事件会同时触发，既滑到了头也滑到了尾,所以两个if不用else连接起来
                        if (s._curX == 0 && s._curY == 0) {
                            s.dispatchEvent(annie.Event.ON_SCROLL_TO_HEAD);
                        } 
                        if (s._curX == s.maxScrollX && s._curY == s.maxScrollY) {
                            s.dispatchEvent(annie.Event.ON_SCROLL_TO_END);
                        }
                    }
                } else {
                    now = (now - s.startTime) / s.duration;
                    easing = s.easingFn(now);
                    newX = (s.destX - s.startX) * easing + s.startX;
                    newY = (s.destY - s.startY) * easing + s.startY;
                    s._translate(newX, newY);
                }
            }
        }

        private onMouseEvent(e: annie.MouseEvent): void {
            let s = this;
            if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                s.isRunning = false;
                s.mouseStatus = 1;
                s.distX = 0;
                s.distY = 0;
                s.startTime = Date.now();
                s.startX = s._curX;
                s.startY = s._curY;
                s.pointX = e.localX;
                s.pointY = e.localY;
            } else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (s.mouseStatus < 1) {
                    return;
                }
                let deltaX = e.localX - s.pointX,
                    deltaY = e.localY - s.pointY,
                    timestamp = Date.now(),
                    newX:number, newY:number,
                    absDistX:number, absDistY:number;
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
                    } else if (absDistY >= absDistX + s.lockDis) {
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
            } else {
                s.endTime = Date.now();
                let momentumX: any,
                    momentumY: any,
                    duration: number = s.endTime - s.startTime,
                    newX: number = s._curX,
                    newY: number = s._curY,
                    time: number = 0,
                    easing: Function = null;
                if (s.resetPosition(s.bounceTime)) {
                    s.mouseStatus = 0;
                    return;
                }
                if (s.mouseStatus != 2) {
                    s.mouseStatus = 0;
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
        }

        public destroy(): void {
            let s = this;
            if (s._container) {
                s._container.removeEventListener(annie.MouseEvent.MOUSE_MOVE, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_DOWN, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_UP, s._mouseEvent, false);
                s._container.removeEventListener(annie.MouseEvent.MOUSE_OUT, s._mouseEvent);
                s._container.removeEventListener(annie.Event.ENTER_FRAME, s._enterFrame);
            }
            s._container = null;
            s.easingFn = null;
            super.destroy();
        }

        public resetPosition(time: number = 0): boolean {
            let s = this;
            let x = s._curX,
                y = s._curY;
            time = time || 0;
            if (!s.isScrollX || s._curX > 0) {
                x = 0;
            } else if (s._curX < s.maxScrollX) {
                x = s.maxScrollX;
            }
            if (!s.isScrollY || s._curY > 0) {
                y = 0;
            } else if (s._curY < s.maxScrollY) {
                y = s.maxScrollY;
            }
            if (x == s._curX && y == s._curY) {
                return false;
            }
            s.scrollTo(x, y, time, null);
            return true;
        }

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
        public scrollBy(x: number, y: number, time: number = 0, easing: Function = null) {
            let s = this;
            x = s._curX + x;
            y = s._curY + y;
            time = time || 0;
            s.scrollTo(x, y, time, easing);
        }

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
        public scrollTo(x: number, y: number, time: number = 0, easing: Function = null) {
            let s = this;
            if(isNaN(x)||isNaN(y)) {
                return;
            }
            if (!time) {
                s._translate(x, y);
            } else {
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
        }

        public _translate(x: number, y: number) {
            let s = this;
            if(this.isScrollX) {
                s._curX = x;
            }
            if(this.isScrollY){
                s._curY = y;
            }
            s.dispatchEvent(annie.Event.ON_SCROLL_ING, {posX: s._curX, posY: s._curY});
        }

        private static toMomentum(current: number, start: number, time: number, lowerMargin: number, wrapperSize: number, deceleration: number) {
            let distance = current - start,
                speed = Math.abs(distance) / time,
                destination:number,
                duration:number;
            deceleration = deceleration === undefined ? 0.0006 : deceleration;
            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;
            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }
            return {
                destination: destination,
                duration: duration
            };
        };
    }
}