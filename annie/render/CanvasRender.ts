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
        public _ctx: any;
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
        public begin(): void {
            let s = this, c = s.rootContainer, ctx = s._ctx;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, c.width, c.height);
            if (s._stage.bgColor != "") {
                ctx.fillStyle = s._stage.bgColor;
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
            let s: CanvasRender = this, ctx = s._ctx;
            ctx.save();
            ctx.globalAlpha = 0;
            s.drawMask(target);
            ctx.clip();
        }

        private drawMask(target: any): void {
            let s = this, tm = target.cMatrix, ctx = s._ctx;
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            ctx.translate(-target._offsetX, -target._offsetY);
            if (target._instanceType == "annie.Shape") {
                target._draw(ctx, true);
            } else if (target._instanceType == "annie.Sprite") {
                target._updateState = 0;
                for (let i = 0; i < target.children.length; i++) {
                    s.drawMask(target.children[i]);
                }
            } else if (target._instanceType == "annie.MovieClip") {
                target._frameState = 0;
                target._updateState = 0;
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
            if(texture.width==0||texture.height==0)return;
            let ctx = s._ctx, tm = target.cMatrix;
            if (ctx.globalAlpha != target.cAlpha) {
                ctx.globalAlpha = target.cAlpha
            }
            if (s._blendMode != target.cBlendMode) {
                ctx.globalCompositeOperation = BlendMode.getBlendMode(target.cBlendMode);
                s._blendMode = target.cBlendMode;
            }
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if(s._stage) {
                let sbl = target._splitBoundsList;
                let rect = null;
                for (let i = 0; i < sbl.length; i++) {
                    if (sbl[i].isDraw === true) {
                        rect = sbl[i].rect;
                        ctx.drawImage(texture, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height);
                    }
                }
            }else{
                ctx.drawImage(texture,0,0);
            }

            /*
            //getBounds
            rect=target.getBounds();
            //s._ctx.setTransform(1, 0, 0, 1, 0, 0);
            s._ctx.beginPath();
            s._ctx.lineWidth=4;
            s._ctx.strokeStyle="#ff0000";
            s._ctx.moveTo(rect.x,rect.y);
            s._ctx.lineTo(rect.x+rect.width,rect.y);
            s._ctx.lineTo(rect.x+rect.width,rect.y+rect.height);
            s._ctx.lineTo(rect.x,rect.y+rect.height);
            s._ctx.closePath();
            s._ctx.stroke();
            //getDrawRect
            s._ctx.setTransform(1, 0, 0, 1, 0, 0);
            target.getDrawRect(target.cMatrix);
            rect=DisplayObject._transformRect;
            s._ctx.beginPath();
            s._ctx.lineWidth=2;
            s._ctx.strokeStyle="#00ff00";
            s._ctx.moveTo(rect.x,rect.y);
            s._ctx.lineTo(rect.x+rect.width,rect.y);
            s._ctx.lineTo(rect.x+rect.width,rect.y+rect.height);
            s._ctx.lineTo(rect.x,rect.y+rect.height);
            s._ctx.closePath();
            s._ctx.stroke();
            //
            */
        }

        public end() {
        };

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
                s.rootContainer.id = "_a2x_canvas";
            }
            s._ctx = s.rootContainer.getContext('2d');
        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize(): void {
            let s = this, c = s.rootContainer;
            c.width = s._stage.divWidth * devicePixelRatio;
            c.height = s._stage.divHeight * devicePixelRatio;
            c.style.width = s._stage.divWidth + "px";
            c.style.height = s._stage.divHeight + "px";
            s.viewPort.width = c.width;
            s.viewPort.height = c.height;
        }

        destroy(): void {
            let s = this;
            s.rootContainer = null;
            s._stage = null;
            s._ctx = null;
        }
    }
}