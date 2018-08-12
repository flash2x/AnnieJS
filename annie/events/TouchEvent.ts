/**
 * @module annie
 */
namespace annie {
    /**
     * 多点触碰事件。单点事件请使用mouseEvent,pc和mobile通用
     * @class annie.TouchEvent
     * @extends annie.Event
     */
    export class TouchEvent extends Event {
        /**
         * annie.Stage 的多点触碰事件。这个事件只能在annie.Stage对象上侦听
         * @event ON_MULTI_TOUCH
         * @static
         * @public
         * @since 1.0.3
         * @type {string}
         */
        public static ON_MULTI_TOUCH:string = "onMultiTouch";
        /**
         * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第1个点。
         * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
         * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
         * @property clientPoint1
         * @public
         * @since 1.0.3
         * @type {annie.Point}
         */
        public clientPoint1:Point=new Point();
        /**
         * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第2个点。
         * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
         * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
         * @property clientPoint2
         * @public
         * @since 1.0.3
         * @type {annie.Point}
         */
        public clientPoint2:Point=new Point();
        /**
         * 相对于上一次的缩放值
         * @property scale
         * @since 1.0.3
         */
        public scale:number=0;
        /**
         * 相对于上一次的旋转值
         * @property rotate
         * @since 1.0.3
         */
        public rotate:number=0;
        /**
         * @method TouchEvent
         * @public
         * @since 1.0.3
         * @param {string} type
         */
        public constructor(type:string) {
            super(type);
            this._instanceType="annie.TouchEvent";
        }
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         * @return {void}
         */
        public updateAfterEvent():void{
            this.target.stage._cp=true;
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s.clientPoint1=null;
            s.clientPoint2=null;
            super.destroy();
        }
    }
}