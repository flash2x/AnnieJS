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
         * @method OffCanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor() {
            super();
            this._instanceType = "annie.OffCanvasRender";
        }
        private isFirstObj:boolean;
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin(color: string): void {
            let s = this, c = s.canvas, ctx = s._ctx;
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, c.width, c.height);
            if (color != "") {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, c.width, c.height);
            }
            s.isFirstObj=true;
        }

        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        public beginMask(target: any): void {
            let s: OffCanvasRender = this, ctx = s._ctx;
            ctx.save();
            ctx.beginPath();
            s.drawMask(target);
            ctx.closePath();
            ctx.clip();
        }

        private drawMask(target: any): void {
            let s = this, tm = target.matrix, ctx = s._ctx;
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
            this._ctx.restore();
        }
        private _blendMode: number = 0;
        public render(target: any) {
            let s = this;
            let isFistObj=s.isFirstObj;
            if(s.isFirstObj){
                s.isFirstObj=false;
            }
            if (target._visible){
                let children = target.children;
                let texture = target._texture;
                let ctx = s._ctx, tm = target._matrix;
                ctx.save();
                if(!isFistObj){
                    ctx.globalAlpha *= target._alpha;
                    ctx.transform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                    ctx.translate(target._offsetX, target._offsetY);
                }else{
                    ctx.translate(-target._offsetX, -target._offsetY);
                }
                if (texture != null&&!isFistObj) {
                    if (texture.width == 0 || texture.height == 0) { return; }
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
                    }
                    if (s._blendMode != target.blendMode) {
                        ctx.globalCompositeOperation = BlendMode.getBlendMode(target.blendMode);
                        s._blendMode = target.blendMode;
                    }
                    ctx.drawImage(texture, 0, 0);
                } else if (children != void 0) {
                    let maskObj: any;
                    let child: any;
                    let len = children.length;
                    for (let i = 0; i < len; i++) {
                        child = children[i];
                        if (child._isUseToMask > 0) {
                            continue;
                        }
                        if (maskObj != null) {
                            if (child.mask != null && child.mask.parent == child.parent) {
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
                            if (child.mask != null && child.mask.parent == child.parent) {
                                maskObj = child.mask;
                                s.beginMask(maskObj);
                            }
                        }
                        s.render(child);
                    }
                    if (maskObj != null) {
                        s.endMask();
                    }
                }
                ctx.restore();
                //看看是否有滤镜
                let cf: any = target._filters;
                let cfLen = cf.length;
                if (cfLen > 0) {
                    let imageData = ctx.getImageData(0, 0, target._bounds.width, target._bounds.height);
                    for (let i = 0; i < cfLen; i++) {
                        cf[i].drawFilter(imageData);
                    }
                    ctx.putImageData(imageData, 0, 0);
                }
            }
        }
        public end() { };
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init(canvas: any): void {
            let s = this;
            s.canvas = canvas;
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