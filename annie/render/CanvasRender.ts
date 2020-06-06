/**
 * @module annie
 */
namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.CanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    export class CanvasRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public rootContainer: any = null;
        /**
         * @property viewPort
         *
         */
        public viewPort: annie.Rectangle = new annie.Rectangle();
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        public static _ctx: any;
        /**
         * @protected _stage
         * @protected
         * @default null
         */
        private _stage: Stage;

        /**
         * @method CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor(stage: Stage) {
            super();
            this._instanceType = "annie.CanvasRender";
            this._stage = stage;
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin(color: string): void {
            let s = this, c = s.rootContainer, ctx = CanvasRender._ctx;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (color == "") {
                ctx.clearRect(0, 0, c.width, c.height);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, c.width, c.height);
            }
        }

        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        public beginMask(target: any): void {
            let s: CanvasRender = this, ctx = CanvasRender._ctx;
            ctx.save();
            ctx.globalAlpha = 0;
            ctx.beginPath();
            s.drawMask(target);
            ctx.closePath();
            ctx.clip();
        }

        private drawMask(target: any): void {
            let s = this, tm = target._cMatrix, ctx = CanvasRender._ctx;
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (target._instanceType == "annie.Shape") {
                target._draw(ctx, true);
            } else if (target._instanceType == "annie.Sprite" || target._instanceType == "annie.MovieClip") {
                for (let i = 0; i < target.children.length; i++) {
                    s.drawMask(target.children[i]);
                }
            }
            else {
                let bounds = target._bounds;
                ctx.rect(0, 0, bounds.width, bounds.height);
            }
        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask(): void {
            CanvasRender._ctx.restore();
        }
        public end() {
        };

        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init(canvas: any): void {
            let s = this;
            s.rootContainer = canvas;
            s._stage.rootDiv.appendChild(s.rootContainer);
            s.rootContainer.id = "_a2x_canvas";
            CanvasRender._ctx = canvas.getContext('2d');
        }

        /**
         * 当尺寸改变时调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize(width: number, height: number): void {
            let s = this, c = s.rootContainer;
            c.width = width;
            c.height = height;
            s.viewPort.width = c.width;
            s.viewPort.height = c.height;
            c.style.width = Math.ceil(width / devicePixelRatio) + "px";
            c.style.height = Math.ceil(height / devicePixelRatio) + "px";
        }

        destroy(): void {
            let s = this;
            s.rootContainer = null;
            s._stage = null;
            CanvasRender._ctx = null;
        }
    }
}