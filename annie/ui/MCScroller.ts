/**
 * @module annieUI
 */
namespace annieUI {
    /**
     * 用滚动的方式播放MC,回弹默认关闭，可开启
     * @class annieUI.MCScroller
     * @public
     * @extends annie.Scroller
     * @since 3.1.5
     */
    export class MCScroller extends annieUI.Scroller {
        /**
         * 滑动的速率，值越大，滑动越慢,默认是10
         * @property rate
         * @param {number} value
         * @since 3.1.5
         * @public
         */
        public set rate(value: number) {
            let s = this;
            let mc:any=s._container;
            if (value != s._rate) {
                s._rate = value;
                let curFrame = s.curFramePos - 1;
                let sw: number = 0, sh: number = 0;
                if (s._isVertical) {
                    s._curX = -curFrame * value;
                    sh = mc.totalFrames * value;
                } else {
                    s._curY = -curFrame * value;
                    sw = mc.totalFrames * value;
                }
                s.setScrollWH(sw, sh);
            }
        };

        public get rate(): number {
            return this._rate;
        }

        private _rate: number = 0;

        /**
         * 鼠标滑动的方向，默认纵向
         * @property isVertical
         * @since 3.1.5
         * @public
         * @return {boolean}
         */
        public get isVertical(): boolean {
            return this._isVertical;
        }

        public set isVertical(value: boolean) {
            let s = this;
            if(s._isVertical!=value) {
                if (!value) {
                    s._curX = s._curY;
                    s._scrollWidth = s._scrollHeight;
                    s._scrollHeight = 0;
                } else {
                    s._curY = s._curX;
                    s._scrollHeight = s._scrollWidth;
                    s._scrollWidth = 0;
                }
                s._isVertical = value;
                s._updateViewAndScroll();
            }
        }

        /**
         * 只读，获取当前mc的frame具体值，带小数
         * @property curFramePos
         * @readonly
         * @return {number}
         */
        public get curFramePos(): number {
            let s = this;
            let frame: number = 0;
            if (s._isVertical) {
                frame = s._curY / s._rate;
            } else {
                frame = s._curX / s._rate;
            }
            return Math.abs(frame) + 1;
        }

        private _isVertical: boolean = true;

        /**
         * 构造函数
         * @method MCScroller
         * @param {annie.MovieClip} mc 要被滑动的mc
         * @param {number} rate mc 灵敏度，值越大滑动越慢，默认为10
         * @param {boolean} isVertical 是横向还是竖向滑动，默认是竖向
         */
        constructor(mc: annie.MovieClip, rate: number = 10, isVertical: boolean = true) {
            super(mc, 0, 0, 0, 0);
            let s = this;
            s._instanceType = "annieUI.MCScroller";
            s.isBounce = false;
            s.rate = rate;
            s.isVertical = isVertical;
        }
        public _translate(x: number, y: number) {
            super._translate(x,y);
            let s=this;
            let mc:any=s._container;
            mc.gotoAndStop(s.curFramePos);
        }
    }
}