/**
 * Created by saron on 16/10/19.
 */
/**
 * @module annieUI
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 滑动页面类
     * @class annieUI.SlidePage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class SlidePage extends Sprite {
        /**
         * 页面个数
         * @property listLen
         * @type {number}
         * @private
         * @default 0
         */
        private listLen: number = 0;
        /**
         * 页面滑动容器
         * @property slideCon
         * @type {annie.Sprite}
         * @private
         */
        private slideCon: any;
        /**
         * 滑动完成回调函数
         * @method callback
         * @type {function}
         * @private
         */
        private callback: any;
        /**
         * @method onMoveStart
         * @type {function}
         * @private
         */
        private onMoveStart: any;
        /**
         * 滑动方向
         * @property isVertical
         * @type {boolean}
         * @private
         */
        private isVertical: boolean;
        /**
         * 容器活动速度
         * @property slideSpeed
         * @type {number}
         * @private
         * @default 0
         */
        private slideSpeed: number = 0;
        /**
         * 触摸点开始点X
         * @property touchStartX
         * @type {number}
         * @private
         */
        private touchStartX: number = 0;
        /**
         * 触摸点开始点Y
         * @property touchStartY
         * @type {number}
         * @private
         */
        private touchStartY: number = 0;
        /**
         * 触摸点结束点X
         * @property touchEndX
         * @type {number}
         * @private
         */
        private touchEndX: number = 0;
        /**
         * 触摸点结束点Y
         * @property touchEndY
         * @type {number}
         * @private
         * @since
         * @public
         * @default 0
         */
        private touchEndY: number = 0;
        /**
         * 当前页面索引ID
         * @property currentPageIndex
         * @type {number}
         * @public
         * @since 1.0.3
         * @default 0
         */
        public currentPageIndex = 0;
        /**
         * 页面是否移动
         * @property currentPageIndex
         * @type {boolean}
         * @public
         * @default false
         * @public
         */
        public isMoving = false;
        /**
         * 舞台宽
         * @property stageW
         * @type {number}
         * @private
         */
        private stageW: number = 0;
        /**
         * 舞台高
         * @property stageH
         * @type {number}
         * @private
         */
        private stageH: number = 0;
        /**
         * 页面列表
         * @property pageList
         * @type {Array}
         * @private
         */
        private pageList: any;
        /**
         * 两点距离
         * @property distance
         * @type {number}
         * @private
         */
        private distance: number = 0;
        /**
         *
         * @property fSpeed
         * @type {number}
         * @private
         */
        private fSpeed: number = 10;
        /**
         * 是否点击了鼠标
         * @property fSpeed
         * @type {boolean}
         * @private
         */
        private isMouseDown: boolean = false;
        /**
         * 是否可以下一页
         * @property canSlideNext
         * @since 1.0.3
         * @default true
         * @type {boolean}
         * @public
         */
        public canSlideNext: boolean = true;
        /**
         * 是否可以上一页
         * @property canSlidePrev
         * @type {boolean}
         * @public
         * @default true
         */
        public canSlidePrev: boolean = true;

        /**
         * @property slideDirection
         * @type {string}
         * @since 1.0.3
         * @public
         * @default "next"
         */
        public slideDirection: string = 'next';
        /**
         * 是否为数组
         * @param obj
         * @returns {boolean}
         * @private
         */
        private isArray = function (obj: any) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };

        /**
         * 是否为函数
         * @param fn
         * @returns {boolean}
         * @private
         */
        private isFunction(fn: any) {
            return typeof fn === 'function';
        }

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
        constructor(option: any) {
            super();
            var s = this;
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
            // console.log(s);
        }

        /**
         * 添加到舞台
         * @param e
         */
        private onAddToStage(e: annie.Event): void {
            var s = this;
            s.stageW = s.stage.desWidth;
            s.stageH = s.stage.desHeight;
            s.listLen = s.pageList.length;//页面个数
            s.slideCon = new annie.Sprite();
            for (var i = 0; i < s.listLen; i++) {
                s.pageList[i].pageId = i;
                s.pageList[i].canSlidePrev = true;
                s.pageList[i].canSlideNext = true;
                if (s.isVertical) {
                    s.pageList[i].y = i * s.stageH;
                } else {
                    s.pageList[i].x = i * s.stageW;
                }
                s.slideCon.addChild(s.pageList[i]);
            }
            if (s.isMoving) {
                s.slideCon.mouseEnable = false;
                s.slideCon.mouseChildren = false;
            }
            s.slideCon.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEventHandler.bind(s));
            //s.slideCon.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEventHandler.bind(s));
            s.slideCon.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEventHandler.bind(s));
            s.addChild(s.slideCon);
        }

        /**
         * 触摸事件
         * @param e
         */
        private onMouseEventHandler(e: annie.MouseEvent): void {
            var s = this;
            if (s.isMoving) {
                return;
            }
            if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                s.touchStartX = e.stageX;
                s.touchStartY = e.stageY;
                s.isMouseDown = true;
            } else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
               /* if (!s.isMouseDown) {
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
                } else {
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
                }*/
            } else if (e.type == annie.MouseEvent.MOUSE_UP) {
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
                    } else {
                        s.slideDirection = s.touchStartX > s.touchEndX ? 'next' : 'prev';
                    }
                    if (s.slideDirection == 'next') {
                        globalDispatcher.dispatchEvent(new annie.Event('onSlideNextEvent'));
                        if (s.currentPageIndex < s.listLen - 1) {
                            if (!s.canSlideNext || !s.pageList[s.currentPageIndex].canSlideNext) {
                                return;
                            }
                            s.currentPageIndex++;
                            s.slideToIndex(s.currentPageIndex);
                        } else {
                            s.isVertical == true ? annie.Tween.to(s.slideCon, .2, {
                                    y: -s.stageH * (s.listLen - 1),
                                    ease: annie.Tween.backOut
                                }) : annie.Tween.to(s.slideCon, .2, {
                                    x: -s.stageW * (s.listLen - 1),
                                    ease: annie.Tween.backOut
                                });
                        }
                    } else {
                        globalDispatcher.dispatchEvent(new annie.Event('onSlidePrevEvent'));
                        if (s.currentPageIndex > 0) {
                            if (!s.canSlidePrev || !s.pageList[s.currentPageIndex].canSlidePrev) {
                                return;
                            }
                            s.currentPageIndex--;
                            s.slideToIndex(s.currentPageIndex);
                        } else {
                            s.isVertical == true ? annie.Tween.to(s.slideCon, .2, {
                                    y: 0,
                                    ease: annie.Tween.backOut
                                }) : annie.Tween.to(s.slideCon, .2, {x: 0, ease: annie.Tween.backOut});
                        }
                    }
                }
            }
        }

        /**
         * 滑动到指定页
         * @method slideToIndex
         * @public
         * @since 1.0.3
         * @param index 页面索引
         */
        public slideToIndex(index: any): void {
            var s = this;
            if (s.isMoving) {
                return;
            }
            if (s.isVertical) {
                annie.Tween.to(s.slideCon, s.slideSpeed, {
                    y: -index * s.stageH, onComplete: function () {
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
            } else {
                annie.Tween.to(s.slideCon, s.slideSpeed, {
                    x: -index * s.stageW, onComplete: function () {
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
            s.isFunction(s.onMoveStart) && s.onMoveStart(index);//开始滑动动画
        }

        /**
         * 用于插入分页
         * @method addPageList
         * @param list 页面数组对象
         * @since 1.0.3
         * @public
         */
        public addPageList(list: any): void {
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
                } else {
                    list[i].x = s.listLen * s.stageW;
                }
                s.pageList.push(list[i]);
                s.listLen = s.pageList.length;
                // console.log('加长度后：'+s.listLen);
                s.slideCon.addChildAt(list[i], s.listLen);
            }
        }

        /**
         * 平面中两点距离公式
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         * @returns {number}
         */
        private getDistance(x1: number, y1: number, x2: number, y2: number): number {
            var x1 = x1;
            var y1 = y1;
            var x2 = x2;
            var y2 = y2;
            var xdiff = x2 - x1;
            var ydiff = y2 - y1;
            var dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            return dis;
        }

    }
}