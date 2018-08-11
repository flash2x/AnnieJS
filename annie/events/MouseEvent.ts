/**
 * @module annie
 */
namespace annie {
    /**
     * 鼠标事件类,电脑端鼠标,移动设备端的触摸都使用此事件来监听
     * @class annie.MouseEvent
     * @extends annie.Event
     * @public
     * @since 1.0.0
     */
    export class MouseEvent extends Event {
        /**
         * 鼠标或者手指按下事件
         * @event MOUSE_DOWN
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static MOUSE_DOWN:string = "onMouseDown";
        /**
         * 鼠标或者手指抬起事件
         * @event MOUSE_UP
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static MOUSE_UP:string = "onMouseUp";
        /**
         * 鼠标或者手指单击
         * @event CLICK
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static CLICK:string = "onMouseClick";
        /**
         * 鼠标或者手指移动事件
         * @event MOUSE_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static MOUSE_MOVE:string = "onMouseMove";
        /**
         * 鼠标或者手指移入到显示对象上里触发的事件
         * @event MOUSE_OVER
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static MOUSE_OVER:string = "onMouseOver";
        /**
         * 鼠标或者手指移出显示对象边界触发的事件
         * @event MOUSE_OUT
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static MOUSE_OUT:string = "onMouseOut";
        /**
         * mouse或touch事件时rootDiv坐标x点
         * @property clientX
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public clientX:number=0;
        /**
         * mouse或touch事件时rootDiv坐标y点
         * @property clientY
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public clientY:number=0;
        /**
         * mouse或touch事件时全局坐标x点
         * @property stageX
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public stageX:number=0;
        /**
         * mouse或touch事件时全局坐标y点
         * @property stageY
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public stageY:number=0;
        /**
         * mouse或touch事件时本地坐标x点
         * @property localX
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public localX:number=0;
        /**
         * mouse或touch事件时本地坐标y点
         * @property localY
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public localY:number=0;
        /**
         * 绑定此事件的侦听对象
         * @property currentTarget
         * @public
         * @since 1.0.0
         * @type{annie.DisplayObject}
         * @default null
         */
        public currentTarget:DisplayObject=null;
        /**
         * 触摸或者鼠标事件的手指唯一标识
         * @property identifier
         * @type {number}
         * @since 1.1.2
         * @public
         */
        public identifier:any=0;
        /**
         * @method MouseEvent
         * @public
         * @since 1.0.0
         * @param {string} type
         */
        public constructor(type:string) {
            super(type);
            this._instanceType="annie.MouseEvent";
        }
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         */
        public updateAfterEvent(){
            this.target.stage._cp=true;
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s.currentTarget=null;
            super.destroy();
        }
    }
}