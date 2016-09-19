/**
 * Created by anlun on 16/8/14.
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    import Shape = annie.Shape;
    import osType = annie.osType;
    export class ScrollPage extends Sprite {
        /**
         * 横向还是纵向 默认为纵向
         * @property isVertical
         * @type {boolean}
         * @private
         * @since 1.0.0
         * @default true
         */
        private isVertical: boolean = true;
        /**
         * 可见区域的宽
         * @property viewWidth
         * @type {number}
         * @private
         * @since 1.0.0
         * @default 0
         */
        private viewWidth: number = 0;
        /**
         * 可见区域的高
         * @property viewHeight
         * @type {number}
         * @private
         * @since 1.0.0
         * @default 0
         */
        private viewHeight: number = 0;
        /**
         * 整个滚动的最大距离值
         * @property maxDistance
         * @type {number}
         * @public
         * @since 1.0.0
         * @default 1040
         */
        public maxDistance: number = 1040;
        /**
         * @property 滚动距离
         * @type {number}
         * @private
         * @default 0
         * @since 1.0.0
         */
        private distance: number = 0;
        /**
         * 最小鼠标滑动距离
         * @type {number}
         */
        private  minDis:number=2;
        /**
         * 遮罩对象
         * @property maskObj
         * @since 1.0.0
         * @private
         * @type {annie.Shape}
         */
        private maskObj: Shape = null;
        /**
         * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
         * @property view
         * @public
         * @since 1.0.0
         * @type {annie.Sprite}
         */
        public view: Sprite = null;
        /**
         * 最后鼠标经过的坐标值
         * @property lastValue
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private lastValue: number = 0;
        /**
         * 速度
         * @property speed
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private speed: number = 0;
        /**
         * 加速度
         * @property addSpeed
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private addSpeed: number = 0;
        /**
         * 是否是停止滚动状态
         * @property isStop
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         */
        public isStop: boolean = true;
        /**
         * 滚动的最大速度，直接影响一次滑动之后最长可以滚多远
         * @property maxSpeed
         * @public
         * @since 1.0.0
         * @default 100
         * @type {number}
         */
        public maxSpeed: number = 100;
        /**
         * 摩擦力,值越大，减速越快
         * @property fSpeed
         * @public
         * @since 1.0.0
         * @default 20
         * @type {number}
         */
        public fSpeed: number = 20;
        private isMaoPao: boolean = true;
        private paramXY: string = "y";
        private stopTimes: number = -1;

        /**
         * 构造函数
         * @method  ScrollPage
         * @param vW 可视区域宽
         * @param vH 可视区域高
         * @param maxDistance 最大滚动的长度
         * @param isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         */
        constructor(vW: number, vH: number, maxDistance: number, isVertical: boolean = true) {
            super();
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
            } else {
                s.distance = s.viewWidth;
                s.paramXY = "x";
            }
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEvent.bind(s));
            s.addEventListener(annie.Event.ENTER_FRAME, function () {
                var view: any = s.view;
                if (!s.isStop) {
                    if (Math.abs(s.speed) > 0) {
                        view[s.paramXY] += s.speed;
                        //是否超过了边界,如果超过了,则加快加速度,让其停止
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            s.speed += s.addSpeed * s.fSpeed;
                        } else {
                            s.speed += s.addSpeed;
                        }
                        //说明超过了界线,准备回弹
                        if (s.speed * s.addSpeed > 0) {
                            s.speed = 0;
                        }
                    } else {
                        //检测是否超出了边界,如果超出了边界则回弹
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            if (s.addSpeed < 0) {
                                view[s.paramXY] += 0.4 * (0 - view[s.paramXY]);
                                if (Math.abs(view[s.paramXY]) < 0.2) {
                                    s.isStop = true;
                                }
                            } else {
                                view[s.paramXY] += 0.4 * (s.distance - s.maxDistance - view[s.paramXY]);
                                if (Math.abs(s.distance - s.maxDistance - view[s.paramXY]) < 0.2) {
                                    s.isStop = true;
                                }
                            }
                        } else {
                            s.isStop = true;
                        }
                    }
                } else {
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
            })
        }

        /**
         * 改可滚动的方向，比如之前是纵向滚动的,你可以横向的。或者反过来
         * @method changeDirection
         * @param isVertical 是纵向还是横向,不传值则默认为纵向
         */
        public changeDirection(isVertical: boolean = true): void {
            var s = this;
            s.isVertical = isVertical;
            if (isVertical) {
                s.distance = s.viewHeight;
                s.paramXY = "y";
            } else {
                s.distance = s.viewWidth;
                s.paramXY = "x";
            }
        }

        private onMouseEvent(e: annie.MouseEvent): void {
            var s = this;
            var view: any = s.view;
            if (s.distance < s.maxDistance) {
                if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                    if (!s.isStop) {
                        s.isStop = true;
                        //并且需要告诉对应的鼠标弹起事件时不要向下冒泡
                        s.isMaoPao = false;
                    } else {
                        s.isMaoPao = true;
                    }
                    if (s.isVertical) {
                        s.lastValue = e.localY;
                    } else {
                        s.lastValue = e.localX;
                    }
                    s.speed = 0;
                } else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                    var currentValue: number;
                    if (s.isVertical) {
                        currentValue = e.localY;
                    } else {
                        currentValue = e.localX;
                    }
                    s.speed = currentValue - s.lastValue;
                    if (s.speed > s.minDis) {
                        s.addSpeed = -2;
                        if (s.speed > s.maxSpeed) {
                            s.speed = s.maxSpeed;
                        }
                    } else if (s.speed < -s.minDis) {
                        if (s.speed < -s.maxSpeed) {
                            s.speed = -s.maxSpeed;
                        }
                        s.addSpeed = 2;
                    } else {
                        s.speed = 0;
                    }
                    if (s.speed != 0) {
                        var speedPer: number = 1;
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            speedPer = 0.2;
                        }
                        view[s.paramXY] += (currentValue - s.lastValue) * speedPer;
                        s.isMaoPao = false;
                    }
                    s.lastValue = currentValue;
                    s.stopTimes = 0;
                } else {
                    s.isStop = false;
                    s.stopTimes = -1;
                }
            }
            if (!s.isMaoPao) {
                e.preventDefault();
            }
        }
    }
}