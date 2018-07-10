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
            let s=this;
            CanvasRender.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
            let _ctx = CanvasRender.drawCtx;
            if (s._stage.bgColor != "") {
                _ctx.fillStyle = s._stage.bgColor;
                _ctx.fillRect(0, 0, s._stage.divWidth, s._stage.divHeight);
            } else {
                _ctx.clearRect(0, 0, s._stage.divWidth, s._stage.divHeight);
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
            let s: CanvasRender = this;
            let ctx=CanvasRender.drawCtx;
            ctx.save();
            ctx.globalAlpha = 0;
            s.drawMask(target,ctx);
            ctx.clip();
        }
        private drawMask(target:any,ctx:any):void{
            let s=this;
            let tm = target.cMatrix;
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if(target._instanceType=="annie.Shape"){
                target._draw(ctx);
            }else if(target._instanceType=="annie.Sprite"||target._instanceType=="annie.MovieClip"){
                for(let i=0;i<target.children.length;i++){
                    s.drawMask(target.children[i],ctx);
                }
            }else{
                let bounds=target._bounds;
                ctx.rect(0,0,bounds.width,bounds.height);
            }
        }
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask(): void {
            CanvasRender.drawCtx.restore();
        }

        public end() {
            //CanvasRender.drawCtx.draw();
        }

        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        public draw(target: any): void {
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