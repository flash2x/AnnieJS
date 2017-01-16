/**
 * @module annieUI
 */
namespace annieUI {
    /**
     * UI组件事件类
     * @class annieUI.Event
     * @extends annie.Event
     * @public
     * @since 1.0.0
     */
    export class UIEvent extends annie.Event {
        /**
         * 滑动中
         * @property SLIDE_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static SLIDE_MOVE:string = "onSlideMove";
        /**
         * 滑动开始
         * @property SLIDE_START
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static SLIDE_START:string = "onSlideStart";
        /**
         * 滑动结束事件
         * @property SLIDE_END
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static SLIDE_END:string = "onSlideEnd";
        /**
         * 滚动中
         * @property SCROLL_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static SCROLL_MOVE:string = "onScrollMove";
        /**
         * 滚动开始
         * @property SCROLL_START
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static SCROLL_START:string = "onScrollStart";
        /**
         * 滚动结束事件
         * @property SCROLL_END
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public static SCROLL_END:string = "onScrollEnd";
        /**
         * 绑定此事件的侦听对象
         * @property currentTarget
         * @public
         * @since 1.0.0
         * @type{annie.DisplayObject}
         * @default null
         */
        public currentTarget:annie.DisplayObject=null;
        /**
         * @method MouseEvent
         * @public
         * @since 1.0.0
         * @param {string} type
         */
        public constructor(type:string) {
            super(type);
            this._instanceType="annieUI.UIEvent";
        }
    }
}