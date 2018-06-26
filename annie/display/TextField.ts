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
        /**
         * 文本的行高
         * @property lineHeight
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set lineHeight(value: number) {
            this._setProperty("_lineHeight",value,3);
        }

        public get lineHeight(): number {
            return this._lineHeight;
        }
        private _lineHeight: number = 0;
        /**
         * 文本的宽
         * @property lineWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set lineWidth(value: number) {
            this._setProperty("_lineWidth",value,3);
        }

        public get lineWidth(): number {
            return this._lineWidth;
        }
        private _lineWidth: number = 0;
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
        private realLines: any[];

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
            ctx.textAlign = this._textAlign || "left";
            ctx.textBaseline = "top";
            ctx.fillStyle = this._color;
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
         * 获取当前文本中单行文字的宽，注意是文字的不是文本框的宽
         * @method getTextWH
         * @param {number} lineIndex 获取的哪一行的高度 默认是第1行
         * @since 2.0.0
         * @public
         * @return {number}
         */
        public getTextWidth(lineIndex:number=0){
            let s=this;
            s.update();
            let can = s._texture;
            let ctx = can.getContext("2d");
            let obj:any=ctx.measureText(s.realLines[lineIndex]);
            return obj.width;
        }
        /**
         * @property _lines 获取当前文本行数
         * @type {number}
         * @public
         * @readonly
         * @since 2.0.0
         */
        get lines(): number {
            return this.realLines.length;
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
                s.realLines = [];
                s._prepContext(ctx);
                let lineH: number;
                if (s.lineHeight) {
                    lineH = s.lineHeight;
                } else {
                    lineH = s._getMeasuredWidth("M") * 1.2;
                }
                if (!s.lineWidth) {
                    s.lineWidth = lineH * 10;
                    s._bounds.width=s.lineWidth;
                } else {
                    if (s.lineWidth < lineH) {
                        s.lineWidth = lineH;
                    }
                }
                if (s._text.indexOf("\n") < 0 && s.lineType == "single") {
                    s.realLines.push(hardLines[0]);
                    let str = hardLines[0];
                    let lineW = s._getMeasuredWidth(str);
                    if (lineW > s.lineWidth) {
                        let w = s._getMeasuredWidth(str[0]);
                        let lineStr = str[0];
                        let wordW = 0;
                        let strLen = str.length;
                        for (let j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s.lineWidth) {
                                s.realLines[0] = lineStr;
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
                            if (w > this.lineWidth) {
                                s.realLines.push(lineStr);
                                lineStr = str[j];
                                w = wordW;
                            } else {
                                lineStr += str[j];
                            }
                        }
                        s.realLines.push(lineStr);
                    }
                }
                let maxH = lineH * s.realLines.length;
                let maxW = s.lineWidth;
                let tx = 0;
                if (s.textAlign == "center") {
                    tx = maxW * 0.5;
                } else if (s.textAlign == "right") {
                    tx = maxW;
                }
                can.width = maxW + 20;
                can.height = maxH + 20;
                ctx.clearRect(0, 0, can.width, can.width);
                if (s.border) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#000";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(10.5, 10.5, maxW, maxH);
                    ctx.closePath();
                }
                ctx.setTransform(1, 0, 0, 1, tx + 10, 10);
                s._prepContext(ctx);
                for (let i = 0; i < s.realLines.length; i++) {
                    ctx.fillText(s.realLines[i], 0, i * lineH, maxW);
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