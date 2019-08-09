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
            let s = this;
            if (value != s._textAlign) {
                s._textAlign = value;
                s.UF = true;
            }
        }

        public get textAlign(): string {
            return this._textAlign;
        }
        private _textAlign = "left";

        /**
         * @property textAlpha
         * @since 2.0.0
         * @public
         */
        public set textAlpha(value: number) {
            let s = this;
            if (value != s._textAlpha) {
                s._textAlpha = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._textHeight) {
                s._textHeight = value;
                s.UF = true;
            }
        }

        public get textHeight(): number{
            return this._textHeight;
        }
        private _textHeight: number = 0;

        /**
         * @property lineHeight
         * @public
         * @since 1.0.0
         * @param {number} value
         */
        public set lineHeight(value:number){
            let s = this;
            if (value != s._lineHeight) {
                s._lineHeight = value;
                s.UF = true;
            }
        }
        public get lineHeight():number{
            return this._lineHeight;
        }
        private _lineHeight: number =14;
        /**
         * 文本的宽
         * @property textWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set textWidth(value: number) {
            let s = this;
            if (value != s._textWidth) {
                s._textWidth = value;
                s.UF = true;
            }
        }

        public get textWidth(): number {
            return this._textWidth;
        }
        private _textWidth: number = 120;
        /**
         * 文本类型,单行还是多行 single multi
         * @property lineType
         * @public
         * @since 1.0.0
         * @type {string} 两种 single和multi
         * @default single
         */
        public set lineType(value: string) {
            let s = this;
            if (value != s._lineType) {
                s._lineType = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._text) {
                s._text = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._font) {
                s._font = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._size) {
                s._size = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._color) {
                s._color = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._italic) {
                s._italic = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._bold) {
                s._bold = value;
                s.UF = true;
            }
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
            let s = this;
            if (value != s._border) {
                s._border = value;
                s.UF = true;
            }
        }

        public get border(): boolean {
            return this._border;
        }

        private _border: boolean = false;

        /**
         * 描边宽度 默认为0，不显示. 值为正数则是外描边，值为负数则是内描边
         * @property stroke
         * @param {number} value
         * @since 2.0.2
         */
        public set stroke(value:number){
            let s = this;
            if (value != s._stroke) {
                s._stroke = value;
                s.UF = true;
            }
        }
        public get stroke():number{
            return this._stroke;
        }
        private _stroke:number=0;
        /**
         * 描边颜色 默认黑色
         * @property strokeColor
         * @param {string} value
         * @since 2.0.2
         */
        public set strokeColor(value:string){
            let s = this;
            if (value != s._strokeColor) {
                s._strokeColor = value;
                s.UF = true;
            }
        }
        public get strokeColor():string{
            return this._strokeColor;
        }
        private _strokeColor:string="#000";
        //设置文本在canvas里的渲染样式
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
            ctx.lineJoin = "miter";
            ctx.miterLimit = 2.5;
            ctx.fillStyle = Shape.getRGBA(s._color,s._textAlpha);
            //实线文字
            ctx.strokeStyle = s.strokeColor;
            ctx.lineWidth = Math.abs(s._stroke);
        }
        /**
         * 获取当前文本中单行文字的宽，注意是文字的不是文本框的宽
         * @method getTextWidth
         * @param {number} lineIndex 获取的哪一行的高度 默认是第1行
         * @since 2.0.0
         * @public
         * @return {number}
         */
        public getTextWidth(lineIndex:number=0){
            let s=this;
            s.updateMatrix();
            let can = s._texture;
            let ctx = can.getContext("2d");
            let obj:any=ctx.measureText(s.realLines[lineIndex]);
            return obj.width;
        }
        /**
         * 获取当前文本行数
         * @property lines
         * @type {number}
         * @public
         * @readonly
         * @since 2.0.0
         */
        get lines(): number {
            return this.realLines.length;
        }
        // 获取文本宽
        private _getMeasuredWidth(text: string): number {
            let ctx = this._texture.getContext("2d");
            //ctx.save();
            let w = ctx.measureText(text).width;
            //ctx.restore();
            return w;
        }
        private realLines: any = [];
        public updateMatrix(): void {
            let s: any = this;
            if (s.UF) {
                s._text += "";
                let can = s._texture;
                let ctx = can.getContext("2d");
                let hardLines: any = s._text.toString().split(/(?:\r\n|\r|\n)/);
                let realLines: any = [];
                s.realLines=realLines;
                s._prepContext(ctx);
                let wordW = 0;
                let lineH = s._lineHeight;
                if (s._text.indexOf("\n") < 0 && s.lineType == "single") {
                    realLines[realLines.length]=hardLines[0];
                    let str = hardLines[0];
                    let lineW = s._getMeasuredWidth(str);
                    if (lineW > s._textWidth){
                        let w = s._getMeasuredWidth(str[0]);
                        let lineStr = str[0];
                        let strLen = str.length;
                        for (let j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
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
                        let strLen = str.length;
                        for (let j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
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
                let maxW = s._textWidth;
                let tx = 0;
                if (s._textAlign == "center") {
                    tx = maxW * 0.5;
                } else if (s._textAlign == "right"){
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
                for (let i = 0; i < realLines.length; i++){
                    if(s._stroke>0) {
                        ctx.strokeText(realLines[i], 0, i * lineH, maxW);
                    }
                    ctx.fillText(realLines[i], 0, i * lineH, maxW);
                    if(s._stroke<0) {
                        ctx.strokeText(realLines[i], 0, i * lineH, maxW);
                    }

                }
                /////////////////////////////////////
                s.updateFilters();
                let cf:any=s.cFilters;
                let cfLen = cf.length;
                if(cfLen>0) {
                    let imageData = ctx.getImageData(0, 0, maxW, maxH);
                    for (let i = 0; i < cfLen; i++) {
                        cf[i].drawFilter(imageData);
                    }
                    ctx.putImageData(imageData, 0, 0);
                }
                s.offsetX = -10;
                s.offsetY = -10;
                s._bounds.x=10;
                s._bounds.y=10;
                s._bounds.height = maxH;
                s._bounds.width = maxW;
            }
            super.updateMatrix();
            s.UM = false;
            s.UA = false;
            s.UF = false;
        }
    }
}