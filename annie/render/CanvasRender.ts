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
        protected _ctx: any;
        private _stage: Stage;

        /**
         * @CanvasRender
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
        public begin(): void {
            let s = this;
            let c = s.rootContainer;
            s._ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (s._stage.bgColor != "") {
                s._ctx.fillStyle = s._stage.bgColor;
                s._ctx.fillRect(0, 0, c.width, c.height);
            } else {
                s._ctx.clearRect(0, 0, c.width, c.height);
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
            let isHadPath = false;
            if (target.children && target.children.length > 0) {
                target = target.children[0];
            }
            if (target._command && target._command.length > 0) {
                s._ctx.save();
                s._ctx.globalAlpha = 0;
                let tm = target.cMatrix;
                s._ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                target._drawShape(s._ctx, true);
                s._ctx.restore();
                isHadPath = true;
            }
            //和后面endMask的restore对应
            s._ctx.save();
            if (isHadPath) {
                s._ctx.clip();
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
            if (target._cp)return;
            let texture = target._texture;
            if (texture && texture.width > 0 && texture.height > 0) {
                let ctx = s._ctx;
                ctx.globalAlpha = target.cAlpha;
                let tm = target.cMatrix;
                ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                if (target.rect && !target._isCache){
                    let tr = target.rect;
                    ctx.drawImage(texture, tr.x, tr.y, tr.width, tr.height, 0, 0, tr.width, tr.height);
                } else {
                    ctx.translate(target._offsetX, target._offsetY);
                    ctx.drawImage(texture, 0, 0);
                }
            }
        }

        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init(): void {
            let s = this;
            if (!s.rootContainer) {
                s.rootContainer = document.createElement("canvas");
                s._stage.rootDiv.appendChild(s.rootContainer);
                s.rootContainer.id="_a2x_canvas";
            }
            let c = s.rootContainer;
            s._ctx = c["getContext"]('2d');
        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize(): void {
            let s = this;
            let c = s.rootContainer;
            c.width = s._stage.divWidth * devicePixelRatio;
            c.height = s._stage.divHeight * devicePixelRatio;
            c.style.width = s._stage.divWidth + "px";
            c.style.height = s._stage.divHeight + "px";
        }
    }
}