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
         * @property canvas
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public canvas: any = null;
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        public _ctx: any;
        /**
         * @method CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor() {
            super();
            this._instanceType = "annie.CanvasRender";
        }
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin(color: string): void {
            let s = this, c = s.canvas, ctx = s._ctx;
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
            let s: CanvasRender = this, ctx = s._ctx;
            ctx.save();
            ctx.globalAlpha = 0;
            ctx.beginPath();
            s.drawMask(target);
            ctx.closePath();
            ctx.clip();
        }

        private drawMask(target: any): void {
            let s = this, tm = target._cMatrix, ctx = s._ctx;
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
            this._ctx.restore();
        }
        private _blendMode: number = 0;
        public render(target: any){
            if (target._visible && target._cAlpha > 0) {
                let s=this;
                let children = target.children;
                if (target._texture!=null){
                    let cf = target._filters;
                    let cfLen = cf.length;
                    let fId = -1;
                    if (cfLen) {
                        for (let i = 0; i < cfLen; i++) {
                            if (target._filters[i].type == "Shadow") {
                                fId = i;
                                break;
                            }
                        }
                    }
                    if (fId >= 0) {
                        let ctx: any = this._ctx;
                        ctx.shadowBlur = cf[fId].blur;
                        ctx.shadowColor = cf[fId].color;
                        ctx.shadowOffsetX = cf[fId].offsetX;
                        ctx.shadowOffsetY = cf[fId].offsetY;
                        s.draw(target);
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    } else {
                        s.draw(target);
                    }
                }else if(children!=void 0){
                    let maskObj: any;
                    let child: any;
                    let len=children.length;
                    for (let i = 0; i < len; i++) {
                        child = children[i];
                        if (child._isUseToMask > 0) {
                            continue;
                        }
                        if (maskObj !=null) {
                            if (child.mask !=null && child.mask.parent == child.parent) {
                                if (child.mask != maskObj) {
                                    s.endMask();
                                    maskObj = child.mask;
                                    s.beginMask(maskObj);
                                }
                            } else {
                                s.endMask();
                                maskObj = null;
                            }
                        } else {
                            if (child.mask !=null && child.mask.parent == child.parent) {
                                maskObj = child.mask;
                                s.beginMask(maskObj);
                            }
                        }
                        s.render(child);
                    }
                    if (maskObj !=null) {
                        s.endMask();
                    }
                }
            }
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
            let texture = target._texture;
            if (texture.width == 0 || texture.height == 0) return;
            let ctx = s._ctx, tm= target._cMatrix;
            ctx.globalAlpha = target._cAlpha
            if (s._blendMode != target.blendMode) {
                ctx.globalCompositeOperation = BlendMode.getBlendMode(target.blendMode);
                s._blendMode = target.blendMode;
            }
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (target._offsetX != 0 || target._offsetY != 0) {
                ctx.translate(target._offsetX, target._offsetY);
            }
            let sbl = target._splitBoundsList;
            let rect = null;
            let bounds = target._bounds;
            let startX = 0 - bounds.x;
            let startY = 0 - bounds.y;
            for (let i = 0; i < sbl.length; i++) {
                if (sbl[i].isDraw === true) {
                    rect = sbl[i].rect;
                    ctx.drawImage(texture, rect.x + startX, rect.y + startY, rect.width, rect.height, rect.x + startX, rect.y + startY, rect.width, rect.height);
                }
            }
            //getBounds
            /*let rect1=target.getBounds();
            rect=new annie.Rectangle(rect1.x-target._offsetX,rect1.y-target._offsetY,rect1.width,rect1.height);
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
            target.getDrawRect(target._cMatrix);
            rect1=DisplayObject._transformRect;
            rect=new annie.Rectangle(rect1.x-target._offsetX,rect1.y-target._offsetY,rect1.width,rect1.height);
            s._ctx.beginPath();
            s._ctx.lineWidth=2;
            s._ctx.strokeStyle="#00ff00";
            s._ctx.moveTo(rect.x,rect.y);
            s._ctx.lineTo(rect.x+rect.width,rect.y);
            s._ctx.lineTo(rect.x+rect.width,rect.y+rect.height);
            s._ctx.lineTo(rect.x,rect.y+rect.height);
            s._ctx.closePath();
            s._ctx.stroke();
            //*/
        }
        public end() {};
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init(canvas: any): void {
            let s = this;
            s.canvas = canvas;
            s.canvas.id = "_a2x_canvas";
            s._ctx = canvas.getContext('2d');
        }

        /**
         * 当尺寸改变时调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize(width: number, height: number): void {
            let s = this, c = s.canvas;
            c.width = width;
            c.height = height;
            c.style.width = Math.ceil(width / devicePixelRatio) + "px";
            c.style.height = Math.ceil(height / devicePixelRatio) + "px";
        }
        destroy(): void {
            let s = this;
            s.canvas = null;
            s._ctx = null;
        }
    }
}