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
         * @property TOUCH_BEGIN
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static TOUCH_BEGIN:string = "onTouchBegin";
        /**
         * @property TOUCH_END
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static TOUCH_END:string = "onTouchEnd";
        /**
         * @property TOUCH_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static TOUCH_MOVE:string = "onTouchMove";
        /**
         * 多点事件中点的信息
         * @property points
         * @public
         * @since 1.0.0
         * @type {Array<Point>}
         */
        public points:Array<Point>=null;
        /**
         * @method TouchEvent
         * @public
         * @since 1.0.0
         * @param {string} type
         */
        public constructor(type:string) {
            super(type);
            this._instanceType="annie.TouchEvent";
        }
    }
}