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
        public static drawCtx: any = null;
        private _stage: Stage;

        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor(stage: Stage, ctx: any) {
            super();
            let s = this;
            s._instanceType = "annie.CanvasRender";
            s._stage = stage;
            CanvasRender.drawCtx = ctx;
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin(): void {
            CanvasRender.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        }

        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        public beginMask(target: any): void {
            let _ctx = CanvasRender.drawCtx;
            let tm = target.cMatrix;
            _ctx.globalAlpha = 0;
            _ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            target._draw(_ctx);
            _ctx.clip();
        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask(): void {
        }

        public end() {
            CanvasRender.drawCtx.draw();
        }

        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        public draw(target: any): void {
            let s = this;
            //由于某些原因导致有些元件没来的及更新就开始渲染了,就不渲染，过滤它
            if (target._cp) return;
            let ctx = CanvasRender.drawCtx;
            ctx.globalAlpha = target.cAlpha;
            let tm = target.cMatrix;
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            let texture = target._texture;
            if (texture) {
                ctx.drawImage(texture, 0, 0);
            } else {
                target._draw(ctx);
            }
        }

        destroy(): void {
            let s = this;
            s._stage = null;
        }
    }
}