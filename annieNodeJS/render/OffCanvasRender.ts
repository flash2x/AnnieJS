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
    export class OffCanvasRender extends AObject {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public static rootContainer: any;
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        public static _ctx: any;

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
            let  c = OffCanvasRender.rootContainer, ctx = OffCanvasRender._ctx;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, c.width, c.height);
            if(color != ""){
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
            let s: any = this, ctx = OffCanvasRender._ctx;
            ctx.save();
            ctx.beginPath();
            s.drawMask(target);
            ctx.closePath();
            ctx.clip();
        }

        private drawMask(target: any): void {
            let s = this, tm = target._matrix, ctx = OffCanvasRender._ctx;
            ctx.transform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
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
            OffCanvasRender._ctx.restore();
        }
        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        public draw(target: any): void {
            if (target._visible && target._cAlpha > 0) {
                let children: any = target.children;
                let ctx = OffCanvasRender._ctx;
                let tm = target._matrix;
                ctx.save();
                ctx.globalAlpha *= target._alpha;
                ctx.transform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                if(target.children==null) {
                    if (target._offsetX != 0 || target._offsetY != 0) {
                        ctx.translate(target._offsetX, target._offsetY);
                    }
                    target._draw(ctx);
                }else {
                    let len: number = target.children.length;
                    let s: any = this;
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
                }
                ctx.restore();
            }
        }
        public end(){};
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init(): void {
            OffCanvasRender._ctx = OffCanvasRender.rootContainer.getContext('2d');
        }
        /**
         * 当尺寸改变时调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize(width: number, height: number): void {
            let c = OffCanvasRender.rootContainer;
            c.width = width;
            c.height = height;
        }
        destroy(): void {
            OffCanvasRender.rootContainer = null;
            OffCanvasRender._ctx = null;
        }
    }
}