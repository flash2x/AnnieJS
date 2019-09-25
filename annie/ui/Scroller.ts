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
    export class Scroller extends annie.EventDispatcher{
        //Event
        /**
         * annieUI.Scroller组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_ING
         * @since 3.1.0
         */

        /**
         * 滑动方向
         * @property isVertical
         * @type {boolean}
         */
        public isVertical: boolean = true;
        /**
         * 手指按下后的滑动速度，值越大，滑动越快
         * @property speed
         * @protected
         * @since 3.1.0
         * @type {number}
         */
        public speed:number=0.2;
        /**
         * 滚动的最大速度，直接影响一次滑动之后最长可以滚多远
         * @property maxSpeed
         * @public
         * @since 3.1.0
         * @default 100
         * @type {number}
         */
        public maxSpeed: number = 15;
        /**
         * 松开手指后的自然滚动的摩擦力，摩擦力越大，停止的越快
         * @property fSpeed
         * @since 3.1.0
         * @type {number}
         */
        public fSpeed:number=0.1;
        private _isMouseDownState: number = 0;
        private _moveDis: number = 0;
        /**
         * 是否允许通过鼠标去滚动
         * @property isCanScroll
         * @type {boolean}
         * @since 3.0.1
         */
        public isCanScroll: boolean = true;
        private _isStop:boolean=false;
        private _timer:annie.Timer;
        private _stage:annie.Stage=null;
        private _maxDis:number=1;
        //最后鼠标经过的坐标值
        private _lastValue: number = 0;
        private _frame = 1;
        constructor() {
            super();
            let s = this;
            s._instanceType = "annieUI.Scroller";
        }
        /**
         * 初始化函数
         * @method  ScrollPage
         * @param {annie.Stage} Stage
         * @param {number} maxDis
         * @param {boolean} isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         */
        public init(stage: annie.Stage,maxDis:number,isVertical: boolean = true) {
            let s = this;
            s.mouseEvent = s.onMouseEvent.bind(s);
            s._stage=stage;
            s._maxDis=maxDis;
            stage.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.mouseEvent, false);
            stage.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.mouseEvent, false);
            stage.addEventListener(annie.MouseEvent.MOUSE_UP, s.mouseEvent, false);
            stage.addEventListener(annie.MouseEvent.MOUSE_OUT, s.mouseEvent, false);
            s._timer=new annie.Timer(20);
            s._timer.addEventListener(annie.Event.TIMER, function (){
                if(s._isStop){
                    let frame=s._frame;
                    if (Math.abs(frame - s._moveDis) > 0.001) {
                        frame += s.fSpeed * (s._moveDis - frame);
                        if (frame < 1) {
                            frame = 1;
                            s._isStop=true;
                        } else if (frame >s._maxDis) {
                            frame = s._maxDis;
                            s._isStop=true;
                        }
                        s.dispatchEvent("onScrollIng",frame);
                        s._frame=frame;
                    }else{
                        s._isStop=false;
                    }
                }
            });
            s._timer.start();
        }
        public mouseEvent:any=null;
        private onMouseEvent(e: annie.MouseEvent): void {
            let s = this;
            if (s.isCanScroll){
                let frame = s._frame;
                let moveDis=s._moveDis;
                if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                    if (s.isVertical) {
                        s._lastValue = e.localY;
                    } else {
                        s._lastValue = e.localX;
                    }
                    moveDis = 0;
                    s._isMouseDownState = 1;
                    s._isStop=false;
                } else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                    if (s._isMouseDownState < 1) {
                        return;
                    }
                    s._isMouseDownState = 2;
                    let currentValue: number;
                    if (s.isVertical) {
                        currentValue = e.localY;
                    } else {
                        currentValue = e.localX;
                    }
                    moveDis = s._lastValue-currentValue;
                    if (moveDis > s.maxSpeed) {
                        moveDis = s.maxSpeed;
                    } else if (moveDis < -s.maxSpeed) {
                        moveDis = -s.maxSpeed;
                    }
                    if (moveDis != 0) {
                        frame += moveDis*s.speed;
                        if (frame < 1) {
                            frame = 1;
                        } else if (frame >s._maxDis) {
                            frame = s._maxDis;
                        }
                        s._frame = frame;
                        //触发事件
                        s.dispatchEvent("onScrollIng",s._frame);
                    }
                    s._lastValue = currentValue;
                } else {
                    moveDis*=6;
                    moveDis+=s._frame;
                    if (moveDis < 1) {
                        moveDis = 1;
                    } else if (moveDis >s._maxDis) {
                        moveDis = s._maxDis;
                    }
                    s._isMouseDownState = 0;
                    s._isStop=true;
                }
                s._moveDis=moveDis;
            }
        }
        public destroy(): void {
            let s = this;
            s._stage.removeEventListener(annie.MouseEvent.MOUSE_MOVE,s.mouseEvent,false);
            s._stage.removeEventListener(annie.MouseEvent.MOUSE_OUT,s.mouseEvent,false);
            s._stage.removeEventListener(annie.MouseEvent.MOUSE_UP,s.mouseEvent,false);
            s._stage.removeEventListener(annie.MouseEvent.MOUSE_DOWN,s.mouseEvent,false);
            s._timer.stop();
            s._timer.destroy();
            s._timer=null;
            super.destroy();
        }
    }
}