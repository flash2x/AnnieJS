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
        }
        private _cacheImg:any=window.document.createElement("canvas");
        private _cacheX:number = 0;
        private _cacheY:number = 0;
        private _cacheObject:any ={bold:false,italic:false,size:12,lineType:"single",text:"ILoveAnnie",textAlign:"left",font:"Arial",color:"#fff",lineWidth:0,lineHeight:0};
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
         * 设置文本在canvas里的渲染样式
         * @param ctx
         * @private
         * @since 1.0.0
         */
        private _prepContext(ctx:any):void {
            var s=this;
            var font:any=s.size || 12;
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
            var ctx = this._cacheImg.getContext("2d");
            //ctx.save();
            var w = ctx.measureText(text).width;
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
            var s = this;
            if (s._cacheImg.src!="") {
                renderObj.draw(s, 2);
            }
            //super.render();
        }
        /**
         * 重写 update
         * @method update
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        public update():void {
            var s:any = this;
            if(s.pauseUpdate)return;
            super.update();
            for(var item in s._cacheObject){
                if(s._cacheObject[item]!=s[item]){
                    s._cacheObject[item]=s[item];
                    s._isNeedUpdate=true;
                }
            }
            if(s._isNeedUpdate){
                s.text+="";
                var can=s._cacheImg;
                var ctx = can.getContext("2d");
                var hardLines:any = s.text.toString().split(/(?:\r\n|\r|\n)/);
                var realLines:any = [];
                s._prepContext(ctx);
                var lineH:number;
                if (s.lineHeight) {
                    lineH = s.lineHeight;
                } else {
                    lineH = s._getMeasuredWidth("M") * 1.2;
                }
                if(!s.lineWidth){
                    s.lineWidth=lineH*10;
                }else{
                    if(s.lineWidth<lineH){
                        s.lineWidth=lineH;
                    }
                }
                if(s.text.indexOf("\n")<0&&s.lineType=="single"){
                    realLines.push(hardLines[0]);
                    var str = hardLines[0];
                    var lineW=s._getMeasuredWidth(str);
                    if(lineW>s.lineWidth) {
                        var w=s._getMeasuredWidth(str[0]);
                        var lineStr = str[0];
                        var wordW = 0;
                        var strLen=str.length;
                        for (var j = 1; j < strLen; j++) {
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
                }else{
                    for (var i = 0, l = hardLines.length; i < l; i++) {
                        var str = hardLines[i];
                        var w=s._getMeasuredWidth(str[0]);
                        var lineStr=str[0];
                        var wordW=0;
                        var strLen=str.length;
                        for (var j = 1;j<strLen;j++) {
                            wordW= ctx.measureText(str[j]).width;
                            w+=wordW;
                            if (w>this.lineWidth){
                                realLines.push(lineStr);
                                lineStr = str[j];
                                w=wordW;
                            } else {
                               lineStr+=str[j];
                            }
                        }
                        realLines.push(lineStr);
                    }
                }
                var maxH=lineH * realLines.length;
                var maxW=s.lineWidth;
                var tx = 0;
                if (s.textAlign == "center") {
                    tx = maxW * 0.5;
                } else if (s.textAlign == "right") {
                    tx = maxW;
                }
                can.width = maxW+20;
                can.height = maxH+20;
                can.style.width=can.width/devicePixelRatio+"px";
                can.style.height=can.height/devicePixelRatio+"px";
                ctx.clearRect(0, 0, maxW, maxH);
                ctx.setTransform(1, 0, 0, 1, tx+10, 10);
                /////////////////////
                if(s["cFilters"]&&s["cFilters"].length>0) {
                    var cf = s.cFilters;
                    var cfLen = cf.length;
                    for (var i = 0; i < cfLen; i++) {
                        if (s.cFilters[i].type == "Shadow") {
                            ctx.shadowBlur = cf[i].blur;
                            ctx.shadowColor = cf[i].color;
                            ctx.shadowOffsetX = cf[i].offsetX;
                            ctx.shadowOffsetY = cf[i].offsetY;
                            break;
                        }
                    }
                }else{
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "#0";
                    ctx.shadowOffsetX =0;
                    ctx.shadowOffsetY =0;
                }
                ////////////////////
                s._prepContext(ctx);
                for (var i = 0; i<realLines.length; i++) {
                    ctx.fillText(realLines[i], 0, i * lineH, maxW);
                }
                //滤镜
                if(s["cFilters"]&&s["cFilters"].length>0) {
                    var len=s["cFilters"].length;
                    var imageData = ctx.getImageData(0, 0, maxW+20, maxH+20);
                    for(var i=0;i<len;i++) {
                        var f:any = s["cFilters"][i];
                        f.drawFilter(imageData);
                    }
                    ctx.putImageData(imageData,0,0);
                }
                s._cacheX=-10;
                s._cacheY=-10;
                s._isNeedUpdate = false;
                WGRender.setDisplayInfo(s,2);
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
            var s=this;
            var r=new Rectangle();
            if(s._cacheImg){
                r.x=0;
                r.y=0;
                r.width=s._cacheImg.width-20;
                r.height=s._cacheImg.height-20;
            }
            return r;
        }
    }
}