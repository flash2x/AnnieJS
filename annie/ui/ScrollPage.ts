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
        protected scroll: annieUI.Scroller;
        /**
         * 当前显示范围的宽
         * @property viewWidth
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get viewWidth():number{
            if(this.scroll){
                return this.scroll.viewWidth;
            }
            return 0;
        }
        /**
         * 当前显示范围的高
         * @property viewHeight
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get viewHeight():number{
            if(this.scroll){
                return this.scroll.viewHeight;
            }
            return 0;
        }
        /**
         * 当前横向的滑动范围
         * @property scrollWidth
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get scrollWidth():number{
            if(this.scroll){
                return this.scroll.scrollWidth;
            }
            return 0;
        }
        /**
         * 当前纵向的滑动范围
         * @property scrollHeight
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        public get scrollHeight():number{
            if(this.scroll){
                return this.scroll.scrollHeight;
            }
            return 0;
        }
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {annie.DisplayObject} view 需要滚动的显示对象，可为空，为空的话则会自动生成一个显示容器。
         * @param {number} vW 可视区域宽
         * @param {number} vH 可视区域高
         * @param {number} maxDistance 最大滚动的长度
         * @param {boolean} isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @example
         *      s.sPage=new annieUI.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
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
            s.maskObj["_isUseToMask"] = 0;
            s.maskObj.alpha = 0;
            s.setViewWH(viewWidth, viewHeight);
            s.scroll = new annieUI.Scroller(s, viewWidth, viewHeight, scrollWidth, scrollHeight);
            s.scroll.addEventListener(annie.Event.ON_SCROLL_ING, function (e: annie.Event) {
                s._view.y = e.data.posY;
                s._view.x = e.data.posX;
                s.dispatchEvent(e);
            });
            s.scroll.addEventListener(annie.Event.ON_SCROLL_START, function (e: annie.Event) {
                s.dispatchEvent(e);
            });
            s.scroll.addEventListener(annie.Event.ON_SCROLL_STOP, function (e: annie.Event) {
                s.dispatchEvent(e);
            })
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
            s.maskObj.drawRect(0, 0, viewWidth, viewHeight);
            s.maskObj.endFill();
            if (s.scroll) {
               s.scroll.setViewWH(viewWidth,viewHeight);
            }
        }
        /**
         * 设置滑动的长度和宽度，如果只需要一个方向上可滑动，可以将view的宽或者高等于滑动的宽或者高
         * @method setScrollWH
         * @param {number}scrollWidth 设置滑动区域的宽
         * @param {number}scrollHeight 设置滑动区域的高
         * @public
         * @since 3.1.5
         */
        public setScrollWH(scrollWidth:number,scrollHeight:number){
            let s=this;
            if(s.scroll){
                s.scroll.setScrollWH(scrollWidth,scrollHeight);
            }
        }
        public destroy(): void {
            let s = this;
            s.maskObj = null;
            s._view = null;
            s.scroll.destroy();
            super.destroy();
        }
    }
}