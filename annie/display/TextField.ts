/**
 * @module annie
 */
namespace annie {
    /**
     * 动态文本类,有时需要在canvas里有一个动态文本,能根据我们的显示内容来改变
     * @class annie.TextField
     * @extends annie.DisplayObject
     * @since 1.0.0
     * @public
     */
    export class TextField extends DisplayObject {
        public constructor() {
            super();
            this._instanceType = "annie.TextField";
            this._texture = window.document.createElement("canvas");
        }

        /**
         * 文本的对齐方式
         * @property textAlign
         * @public
         * @since 1.0.0
         * @type {string}
         * @default left
         */
        public set textAlign(value: string) {
            this._setProperty("_textAlign",value,3);
        }

        public get textAlign(): string {
            return this._textAlign;
        }
        private _textAlign = "left";
        public set textAlpha(value: number) {
            this._setProperty("_textAlpha",value,3);
        }

        public get textAlpha(): number {
            return this._textAlpha;
        }
        private _textAlpha:number= 1;

        /**
         * 文本的行高
         * @property textHeight
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set textHeight(value: number) {
            this._setProperty("_textHeight",value,3);
        }

        public get textHeight(): number {
            return this._textHeight;
        }
        private _textHeight: number = 0;

        /**
         *
         * @param {number} value
         */
        public set lineSpacing(value:number){
            this._setProperty("_lineSpacing",value,3);
        }
        public get lineSpacing():number{
            return this._lineSpacing;
        }
        private _lineSpacing: number =14;
        /**
         * 文本的宽
         * @property textWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set textWidth(value: number) {
            this._setProperty("_textWidth",value,3);
        }

        public get textWidth(): number {
            return this._textWidth;
        }
        private _textWidth: number = 0;
        /**
         * 文本类型,单行还是多行 single multi
         * @property lineType
         * @public
         * @since 1.0.0
         * @type {string} 两种 single和multi
         * @default single
         */
        public set lineType(value: string) {
            this._setProperty("_lineType",value,3);

        }
        public get lineType(): string {
            return this._lineType;
        }
        private _lineType: string = "single";
        /**
         * 文本内容
         * @property text
         * @type {string}
         * @public
         * @default ""
         * @since 1.0.0
         */
        public set text(value: string) {
            this._setProperty("_text",value,3);
        }

        public get text(): string {
            return this._text;
        }
        private _text: string = "";
        /**
         * 文本的css字体样式
         * @property font
         * @public
         * @since 1.0.0
         * @type {string}
         * @default 12px Arial
         */
        public set font(value: string) {
            this._setProperty("_font",value,3);
        }

        public get font(): string {
            return this._font;
        }
        private _font: string = "Arial";
        /**
         * 文本的size
         * @property size
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 12
         */
        public set size(value: number) {
            this._setProperty("_size",value,3);
        }

        public get size(): number {
            return this._size;
        }
        private _size: number = 12;
        /**
         * 文本的颜色值
         * @property color
         * @type {string}
         * @public
         * @since 1.0.0
         * @default #fff
         */
        public set color(value: string) {
            this._setProperty("_color",value,3);
        }

        public get color(): string {
            return this._color;
        }
        public _color: string = "#fff";
        /**
         * 文本是否倾斜
         * @property italic
         * @public
         * @since
         * @default false
         * @type {boolean}
         */
        public set italic(value: boolean) {
            this._setProperty("_italic",value,3);
        }

        public get italic(): boolean {
            return this._italic;
        }
        private _italic: boolean = false;
        /**
         * 文本是否加粗
         * @property bold
         * @public
         * @since
         * @default false
         * @type {boolean}
         */
        public set bold(value: boolean) {
            this._setProperty("_bold",value,3);
        }
        public get bold(): boolean {
            return this._bold;
        }
        public _bold: boolean = false;
        /**
         * 设置或获取是否有边框
         * @property property
         * @param {boolean} show true或false
         * @public
         * @since 1.0.6
         */
        public set border(value: boolean) {
            this._setProperty("_border",value,3);
        }

        public get border(): boolean {
            return this._border;
        }
        private _border: boolean = false;

        /**
         * 设置文本在canvas里的渲染样式
         * @param ctx
         * @private
         * @since 1.0.0
         */
        private _prepContext(ctx: any): void {
            let s = this;
            let font: any = s.size || 12;
            font += "px ";
            font += s.font;
            //font-weight:bold;font-style:italic;
            if (s._bold) {
                font = "bold " + font;
            }
            if (s._italic) {
                font = "italic " + font;
            }
            ctx.font = font;
            ctx.textAlign = s._textAlign || "left";
            ctx.textBaseline = "top";
            ctx.fillStyle = Shape.getRGBA(s._color,s._textAlpha)
        }

        /**
         * 获取文本宽
         * @method _getMeasuredWidth
         * @param text
         * @return {number}
         * @private
         * @since 1.0.0
         */
        private _getMeasuredWidth(text: string): number {
            let ctx = this._texture.getContext("2d");
            //ctx.save();
            let w = ctx.measureText(text).width;
            //ctx.restore();
            return w;
        }
        /**
         * 重写 update
         * @method update
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        public update(isDrawUpdate:boolean=false): void {
            super.update(isDrawUpdate);
            let s: any = this;
            if(!s._visible)return;
            if (s._UI.UD || s._UI.UF) {
                s._text += "";
                let can = s._texture;
                let ctx = can.getContext("2d");
                let hardLines: any = s._text.toString().split(/(?:\r\n|\r|\n)/);
                let realLines: any = [];
                s._prepContext(ctx);
                let lineH = s._lineSpacing;
                if (s._text.indexOf("\n") < 0 && s.lineType == "single") {
                    realLines[realLines.length]=hardLines[0];
                    let str = hardLines[0];
                    let lineW = s._getMeasuredWidth(str);
                    if (lineW > s.textWidth) {
                        let w = s._getMeasuredWidth(str[0]);
                        let lineStr = str[0];
                        let wordW = 0;
                        let strLen = str.length;
                        for (let j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s.textWidth) {
                                realLines[0] = lineStr;
                                break;
                            } else {
                                lineStr += str[j];
                            }
                        }
                    }
                } else {
                    for (let i = 0, l = hardLines.length; i < l; i++) {
                        let str = hardLines[i];
                        if (!str)continue;
                        let w = s._getMeasuredWidth(str[0]);
                        let lineStr = str[0];
                        let wordW = 0;
                        let strLen = str.length;
                        for (let j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > this.textWidth) {
                                realLines[realLines.length]=lineStr;
                                lineStr = str[j];
                                w = wordW;
                            } else {
                                lineStr += str[j];
                            }
                        }
                        realLines[realLines.length]=lineStr;
                    }
                }
                let maxH = lineH * realLines.length;
                let maxW = s.textWidth;
                let tx = 0;
                if (s._textAlign == "center") {
                    tx = maxW * 0.5;
                } else if (s._textAlign == "right") {
                    tx = maxW;
                }
                can.width = maxW + 20;
                can.height = maxH + 20;
                ctx.clearRect(0, 0, can.width, can.width);
                if (s.border) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#000";
                    ctx.textWidth = 1;
                    ctx.strokeRect(10.5, 10.5, maxW, maxH);
                    ctx.closePath();
                }
                ctx.setTransform(1, 0, 0, 1, tx + 10, 10);
                s._prepContext(ctx);
                for (let i = 0; i < realLines.length; i++) {
                    ctx.fillText(realLines[i], 0, i * lineH, maxW);
                }
                /////////////////////
                let cf = s.cFilters;
                let cfLen = cf.length;
                if(cfLen>0) {
                    let imageData = ctx.getImageData(0, 0, maxW, maxH);
                    for (let i = 0; i < cfLen; i++) {
                        cf[i].drawFilter(imageData);
                    }
                    ctx.putImageData(imageData, 0, 0);
                }
                s._offsetX = -10;
                s._offsetY = -10;
                s._UI.UD = false;
                //给webgl更新新
                //s._texture.updateTexture = true;
                s._bounds.height = maxH;
                s._bounds.width = maxW;
            }
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
        }
        /**
         * 重写 getBounds
         * @method getBounds
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        public getBounds(): Rectangle {
            return this._bounds;
        }
    }
}