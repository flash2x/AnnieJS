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
         * @method CanvasRender
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
            let s: CanvasRender = this, ctx = s._ctx;
            ctx.save();
            ctx.globalAlpha = 0;
            s.drawMask(target);
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
            if (target._visible && target._cAlpha > 0) {
                let isContainer: boolean = target instanceof annie.Sprite;
                if (!isContainer|| target._isCache){
                    let texture = target._texture;
                    if (!texture || texture.width == 0 || texture.height == 0) return;
                    let ctx = s._ctx, tm;
                    tm = target._cMatrix;
                    if (ctx.globalAlpha != target._cAlpha) {
                        ctx.globalAlpha = target._cAlpha
                    }
                    if (s._blendMode != target.blendMode) {
                        ctx.globalCompositeOperation = BlendMode.getBlendMode(target.blendMode);
                        s._blendMode = target.blendMode;
                    }
                    ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                    let sbl = target._splitBoundsList;
                    let sblLen = sbl.length;
                    let drawRect = target._a2x_drawRect;
                    if (sblLen == 1&&(!drawRect.isSheetSprite||target._isCache)) {
                        ctx.drawImage(texture, 0, 0);
                    } else {
                        let tStarX = 0;
                        let tStarY = 0;
                        if (drawRect.isSheetSprite) {
                            tStarX = drawRect.x;
                            tStarY = drawRect.y;
                        }
                        for (let i = 0; i < sblLen; i++) {
                            if (sbl[i].isDraw === true) {
                                let rect = sbl[i].rect;
                                ctx.drawImage(texture, rect.x  + tStarX, rect.y  + tStarY, rect.width, rect.height, rect.x , rect.y , rect.width, rect.height);
                            }
                        }
                    }
                } else {
                    let len: number = target.children.length;
                    if (len > 0) {
                        let children: any = target.children;
                        let maskObj: any;
                        let child: any;
                        for (let i = 0; i < len; i++) {
                            child = children[i];
                            if (child._isUseToMask > 0) {
                                continue;
                            }
                            if (maskObj instanceof annie.DisplayObject) {
                                if (child.mask instanceof annie.DisplayObject && child.mask.parent == child.parent) {
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
                                if (child.mask instanceof annie.DisplayObject && child.mask.parent == child.parent) {
                                    maskObj = child.mask;
                                    s.beginMask(maskObj);
                                }
                            }
                            s.draw(child);
                        }
                        if (maskObj instanceof annie.DisplayObject) {
                            s.endMask();
                        }
                    }
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
            s.rootContainer.id = "_a2x_canvas";
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
            s.viewPort.width = c.width;
            s.viewPort.height = c.height;
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