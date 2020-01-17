/**
 * @module annie
 */
namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.OffCanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    export class OffCanvasRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public rootContainer: any;
        /**
         * @property viewPort
         *
         */
        public viewPort: annie.Rectangle;
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        public _ctx: any;


        /**
         * @method OffCanvasRender
         * @public
         * @since 1.0.0
         */
        public constructor() {
            super();
            this._instanceType = "annie.OffCanvasRender";
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin(color: string): void {
            let s = this, c = s.rootContainer, ctx = s._ctx;
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
            let s: any = this, ctx = s._ctx;
            ctx.save();
            ctx.globalAlpha = 0;
            s.drawMask(target);
            ctx.clip();
        }

        private drawMask(target: any): void {
            let s = this, tm = target._ocMatrix, ctx = s._ctx;
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
                ctx.beginPath();
                ctx.rect(0, 0, bounds.width, bounds.height);
                ctx.closePath();
            }
        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask(): void {
            this._ctx.restore();
        }

        private _blendMode: number = 0;

        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        public draw(target: any): void {
            let s = this;
            let texture = target._texture;
            if (texture.width == 0 || texture.height == 0) return;
            let ctx = s._ctx;
            let tm = target._ocMatrix;
            if (ctx.globalAlpha != target._ocAlpha) {
                ctx.globalAlpha = target._ocAlpha;
            }
            if (s._blendMode != target.blendMode) {
                ctx.globalCompositeOperation = BlendMode.getBlendMode(target.blendMode);
                s._blendMode = target.blendMode;
            }
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (target._offsetX != 0 || target._offsetY != 0) {
                ctx.translate(target._offsetX, target._offsetY);
            }
            ctx.drawImage(texture, 0, 0);
        }
        public end(){

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
            s._ctx = canvas.getContext('2d');
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
            c.style.width = Math.ceil(width / devicePixelRatio) + "px";
            c.style.height = Math.ceil(height / devicePixelRatio) + "px";
        }

        destroy(): void {
            let s = this;
            s.rootContainer = null;
            s._ctx = null;
        }
    }
}