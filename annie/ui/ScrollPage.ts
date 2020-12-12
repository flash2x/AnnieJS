/**
 * @module annieUI
 */

namespace annieUI {
    import Sprite = annie.Sprite;
    import Shape = annie.Shape;
    import DisplayObject = annie.DisplayObject;

    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class ScrollPage extends Sprite {
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
        private maskObj: Shape = new Shape();
        /**
         * 真正的被滚动的显示对象
         * @property view
         * @public
         * @since 1.0.0
         * @type {annie.Sprite}
         */
        public get view(): DisplayObject {
            return this._view;
        }
        protected _view: DisplayObject = null;
        /**
         * scroller滑动控制器
         * @property scroller
         * @readonly
         * @public
         * @since 3.1.5
         */
        public get scroller(): annieUI.Scroller{
            return this._scroller;
        }
        public _scroller:annieUI.Scroller;

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
        constructor(container: annie.DisplayObject, viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number) {
            super();
            let s = this;
            s._instanceType = "annieUI.ScrollPage";
            if (container) {
                s._view = container;
            } else {
                s._view = new annie.Sprite();
            }
            s.addChild(s.maskObj);
            s.addChild(s._view);
            s.view.mask = s.maskObj;
            s.maskObj.x=-1;
            s.maskObj.y=-1;
            // s.maskObj["_isUseToMask"] = 0;
            s.maskObj.alpha = 0;
            s._scroller = new annieUI.Scroller(s, viewWidth, viewHeight, scrollWidth, scrollHeight);
            s._scroller.addEventListener(annie.Event.ON_SCROLL_ING, function (e: annie.Event) {
                s._view.y = e.data.posY;
                s._view.x = e.data.posX;
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_START, function (e: annie.Event) {
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_STOP, function (e: annie.Event) {
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_TO_HEAD, function (e: annie.Event) {
                s.dispatchEvent(e);
            });
            s._scroller.addEventListener(annie.Event.ON_SCROLL_TO_END, function (e: annie.Event) {
                s.dispatchEvent(e);
            });
            s.setViewWH(viewWidth, viewHeight);
        }
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置，如果只需要一个方向上可滑动，可以将view的宽或者高等于滑动的宽或者高
         * @method setViewWH
         * @param {number}viewWidth 设置可见区域的宽
         * @param {number}viewHeight 设置可见区域的高
         * @public
         * @since 3.1.5
         */
        public setViewWH(viewWidth: number, viewHeight: number): void {
            let s: any = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, viewWidth+2, viewHeight+2);
            s.maskObj.endFill();
            if (s.scroll) {
               s.scroll.setViewWH(viewWidth,viewHeight);
            }
        }
        public destroy(): void {
            let s = this;
            s._scroller.destroy();
            s._scroller=null;
            super.destroy();
        }
    }
}