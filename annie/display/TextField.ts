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
    export class TextField extends DisplayObject{
        public constructor() {
            super();
            this._instanceType="annie.TextField";
            this._cacheImg=window.document.createElement("canvas");
        }
        private _cacheObject:any ={border:false,bold:false,italic:false,size:12,lineType:"single",text:"ILoveAnnie",textAlign:"left",font:"Arial",color:"#fff",lineWidth:0,lineHeight:0};
        /**
         * 文本的对齐方式
         * @property textAlign
         * @public
         * @since 1.0.0
         * @type {string}
         * @default left
         */
        public textAlign:string = "left";
        /**
         * 文本的行高
         * @property lineHeight
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public lineHeight:number=0;
        /**
         * 文本的宽
         * @property lineWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public lineWidth:number=0;
        /**
         * 文本类型,单行还是多行 single multi
         * @property lineType
         * @public
         * @since 1.0.0
         * @type {string} 两种 single和multi
         * @default single
         */
        public lineType:string="single";
        /**
         * 文本内容
         * @property text
         * @type {string}
         * @public
         * @default ""
         * @since 1.0.0
         */
        public text:string = "";
        /**
         * 文本的css字体样式
         * @property font
         * @public
         * @since 1.0.0
         * @type {string}
         * @default 12px Arial
         */
        public font:string = "Arial";
        /**
         * 文本的size
         * @property size
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 12
         */
        public size:number=12;
        /**
         * 文本的颜色值
         * @property color
         * @type {string}
         * @public
         * @since 1.0.0
         * @default #fff
         */
        public color:string = "#fff";
        /**
         * 文本是否倾斜
         * @property italic
         * @public
         * @since
         * @default false
         * @type {boolean}
         */
        public italic:boolean=false;
        /**
         * 文本是否加粗
         * @property bold
         * @public
         * @since
         * @default false
         * @type {boolean}
         */
        public bold:boolean=false;
        /**
         * 设置或获取是否有边框
         * @property property
         * @param {boolean} show true或false
         * @public
         * @since 1.0.6
         */
        public border:boolean=false;

        /**
         * 设置文本在canvas里的渲染样式
         * @param ctx
         * @private
         * @since 1.0.0
         */
        private _prepContext(ctx:any):void {
            let s=this;
            let font:any=s.size || 12;
            font+="px ";
            font+=s.font;
            //font-weight:bold;font-style:italic;
            if(s.bold){
                font="bold "+font;
            }
            if(s.italic){
                font="italic "+font;
            }
            ctx.font =font;
            ctx.textAlign = this.textAlign || "left";
            ctx.textBaseline = "top";
            ctx.fillStyle = this.color;
        }

        /**
         * 获取文本宽
         * @method _getMeasuredWidth
         * @param text
         * @return {number}
         * @private
         * @since 1.0.0
         */
        private _getMeasuredWidth(text:string):number {
            let ctx = this._cacheImg.getContext("2d");
            //ctx.save();
            let w = ctx.measureText(text).width;
            //ctx.restore();
            return w;
        }
        /**
         * 重写 render
         * @method render
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        public render(renderObj:IRender):void {
            renderObj.draw(this, 2);
        }
        /**
         * 重写 update
         * @method update
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        public update(um: boolean, ua: boolean, uf: boolean):void {
            super.update(um,ua,uf);
            let s:any = this;
            if(s.visible){
                for (let item in s._cacheObject) {
                    if (s._cacheObject[item] != s[item]) {
                        s._cacheObject[item] = s[item];
                        s._isNeedUpdate = true;
                    }
                }
                if (s._isNeedUpdate||uf||s._updateInfo.UF) {
                    s.text += "";
                    let can = s._cacheImg;
                    let ctx = can.getContext("2d");
                    let hardLines: any = s.text.toString().split(/(?:\r\n|\r|\n)/);
                    let realLines: any = [];
                    s._prepContext(ctx);
                    let lineH: number;
                    if (s.lineHeight) {
                        lineH = s.lineHeight;
                    } else {
                        lineH = s._getMeasuredWidth("M") * 1.2;
                    }
                    if (!s.lineWidth) {
                        s.lineWidth = lineH * 10;
                    } else {
                        if (s.lineWidth < lineH) {
                            s.lineWidth = lineH;
                        }
                    }
                    if (s.text.indexOf("\n") < 0 && s.lineType == "single") {
                        realLines.push(hardLines[0]);
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
                            if(!str)continue;
                            let w = s._getMeasuredWidth(str[0]);
                            let lineStr = str[0];
                            let wordW = 0;
                            let strLen = str.length;
                            for (let j = 1; j < strLen; j++) {
                                wordW = ctx.measureText(str[j]).width;
                                w += wordW;
                                if (w > this.lineWidth) {
                                    realLines.push(lineStr);
                                    lineStr = str[j];
                                    w = wordW;
                                } else {
                                    lineStr += str[j];
                                }
                            }
                            realLines.push(lineStr);
                        }
                    }
                    let maxH = lineH * realLines.length;
                    let maxW = s.lineWidth;
                    let tx = 0;
                    if (s.textAlign == "center") {
                        tx = maxW * 0.5;
                    } else if (s.textAlign == "right") {
                        tx = maxW;
                    }
                    can.width = maxW + 20;
                    can.height = maxH + 20;
                    can.style.width = can.width / devicePixelRatio + "px";
                    can.style.height = can.height / devicePixelRatio + "px";
                    ctx.clearRect(0, 0, can.width, can.width);
                    if(s.border) {
                        ctx.beginPath();
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 1;
                        ctx.strokeRect(10.5, 10.5, maxW, maxH);
                        ctx.closePath();
                    }
                    ctx.setTransform(1, 0, 0, 1, tx + 10, 10);
                    /////////////////////
                    if (s.cFilters.length > 0) {
                        let cf = s.cFilters;
                        let cfLen = cf.length;
                        for (let i = 0; i < cfLen; i++) {
                            if (s.cFilters[i].type == "Shadow") {
                                ctx.shadowBlur = cf[i].blur;
                                ctx.shadowColor = cf[i].color;
                                ctx.shadowOffsetX = cf[i].offsetX;
                                ctx.shadowOffsetY = cf[i].offsetY;
                                break;
                            }
                        }
                    } else {
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "#0";
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    }
                    ////////////////////
                    s._prepContext(ctx);
                    for (let i = 0; i < realLines.length; i++) {
                        ctx.fillText(realLines[i], 0, i * lineH, maxW);
                    }
                    //滤镜
                    let len = s.cFilters.length;
                    if (len > 0) {
                        let imageData = ctx.getImageData(0, 0, maxW + 20, maxH + 20);
                        for (let i = 0; i < len; i++) {
                            let f: any = s.cFilters[i];
                            f.drawFilter(imageData);
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }
                    s._cacheX = -10;
                    s._cacheY = -10;
                    s._isNeedUpdate = false;
                    //给webgl更新新
                    s._cacheImg.updateTexture=true;
                    s._bounds.height=maxH;
                    s._bounds.width=maxW;
                }
                s._updateInfo.UM = false;
                s._updateInfo.UA = false;
                s._updateInfo.UF = false;
            }
        }
        /**
         * 重写 getBounds
         * @method getBounds
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        public getBounds():Rectangle{
            return this._bounds;
        }
    }
}