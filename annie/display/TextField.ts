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
         * @property lineHeight
         * @param {number} value
         */
        public set lineHeight(value:number){
            this._setProperty("_lineHeight",value,3);
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
            this._setProperty("_textWidth",value,3);
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
            this._setProperty("_lineType",value,3);

        }
        public get lineType(): string {
            return this._lineType;
        }
        private _lineType: string = "single";
        private  _textOffX:number=0;
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
        /**
         * 描边宽度 默认为0，不显示. 值为正数则是外描边，值为负数则是内描边
         * @property stroke
         * @param {number} value
         * @since 2.0.2
         */
        public set stroke(value:number){
            this._setProperty("_stroke",value,3);
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
            this._setProperty("_strokeColor",value,3);
        }
        public get strokeColor():string{
            return this._strokeColor;
        }
        private _strokeColor:string="#000";
        private _border: boolean = false;
        private fontInfo: any;
        private realLines: any;
        /**
         * 设置文本在canvas里的渲染样式
         * @param ctx
         * @private
         * @since 1.0.0
         */
        private _draw(ctx: any): void {
            let s = this;
            let realLines=s.realLines;
            ctx.font = s.fontInfo;
            ctx.fillStyle = Shape.getRGBA(s._color,s._textAlpha);
            ctx.textAlign = s._textAlign;
            ctx.textBaseline = "top";
            for (let i = 0; i < realLines.length; i++){
                if(s._stroke>0) {
                    ctx.strokeText(s.realLines[i], s._textOffX, i * s.lineHeight, s._bounds.width);
                }
                ctx.fillText(s.realLines[i], s._textOffX, i * s.lineHeight, s._bounds.width);
                if(s._stroke<0) {
                    ctx.strokeText(s.realLines[i], s._textOffX, i * s.lineHeight, s._bounds.width);
                }
            }
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
            let ctx = CanvasRender.drawCtx;
            //ctx.save();
            let w = ctx.measureText(text).width;
            //ctx.restore();
            return w;
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
            s.update();
            let ctx = CanvasRender.drawCtx;
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
                let ctx = CanvasRender.drawCtx;
                let hardLines: any = s._text.toString().split(/(?:\r\n|\r|\n)/);
                s.realLines = [];
                s.fontInfo = s.size || 12;
                s.fontInfo  += "px ";
                s.fontInfo  += s.font;
                if (s._bold) {
                    s.fontInfo  = "bold " + s.fontInfo ;
                }
                if (s._italic) {
                    s.fontInfo  = "italic " + s.fontInfo ;
                }
                ctx.font = s.fontInfo;
                let lineH = s._lineHeight;
                if (s._text.indexOf("\n") < 0 && s.lineType == "single") {
                    s.realLines[s.realLines.length]=hardLines[0];
                    let str = hardLines[0];
                    let lineW = s._getMeasuredWidth(str);
                    if (lineW > s._textWidth) {
                        let w = s._getMeasuredWidth(str[0]);
                        let lineStr = str[0];
                        let wordW = 0;
                        let strLen = str.length;
                        for (let j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
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
                            if (w > s._textWidth) {
                                s.realLines[s.realLines.length]=lineStr;
                                lineStr = str[j];
                                w = wordW;
                            } else {
                                lineStr += str[j];
                            }
                        }
                        s.realLines[s.realLines.length]=lineStr;
                    }
                }
                let maxH = lineH * s.realLines.length;
                let maxW = s._textWidth;
                if (s._textAlign == "center") {
                    s._textOffX = maxW * 0.5;
                } else if (s._textAlign == "right") {
                    s._textOffX = maxW;
                }else{
                    s._textOffX=0;
                }
                s._UI.UD = false;
                s._bounds.height = maxH;
                s._bounds.width = maxW;
            }
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
        }
    }
}