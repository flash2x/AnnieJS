/**
 * @module annie
 */
namespace annie {
    /**
     * 输入文本,此文本类是annie.FloatDisplay对象的典型代表
     * @class annie.InputText
     * @public
     * @since 1.0.0
     * @extends annie.FloatDisplay
     */
    export class InputText extends FloatDisplay {
        /**
         * 输入文本的类型.
         * multiline 多行
         * password 密码
         * singleline 单行
         * @property inputType
         * @public
         * @since 1.0.0
         * @type {string}
         * @default "singleline"
         */
        public inputType:string="singleline";

        /**
         * @method InputText
         * @public
         * @since 1.0.0
         * @param {string} inputType multiline 多行 password 密码 singleline 单行
         */
        public constructor(inputType:string) {
            super();
            var input:any = null;
            var s:InputText = this;
            if (inputType != "multiline") {
                input = document.createElement("input");
                if (inputType == "password") {
                    input.type = "password";
                } else {
                    input.type = "text";
                }
            } else {
                input = document.createElement("textarea");
                input.style.resize = "none";
                input.style.overflow = "hidden";
            }
            s.inputType = inputType;
            s.init(input);
        }
        public init(htmlElement:any):void{
            super.init(htmlElement);
            //默认设置
            var s=this;
            s.htmlElement.style.outline = "none";
            s.htmlElement.style.borderWidth = "thin";
            s.htmlElement.style.borderColor = "#000";
        }
        /**
         * 被始化输入文件的一些属性
         * @method initInfo
         * @public
         * @since 1.0.0
         * @param {string} text 默认文字
         * @param {number} w 文本宽
         * @param {number} h 文本高
         * @param {string}color 文字颜色
         * @param {string}align 文字的对齐方式
         * @param {number}size  文字大小
         * @param {string}font  文字所使用的字体
         * @param {boolean}showBorder 是否需要显示边框
         * @param {number}lineSpacing 如果是多行,请设置行高
         */
        public initInfo(text:string, w:number, h:number, color:string, align:string,size:number,font:string, showBorder:boolean, lineSpacing:number):void {
            var s:InputText = this;
            s.htmlElement.placeholder = text;
            s.htmlElement.style.width = w + "px";
            s.htmlElement.style.height = h + "px";
            //font包括字体和大小
            s.htmlElement.style.font = size+"px "+font;
            s.htmlElement.style.color = color;
            s.htmlElement.style.textAlign = align;
            /////////////////////设置边框//////////////
            s.setBorder(showBorder);
            //color:blue; text-align:center"
            if (s.inputType == "multiLine") {
                s.htmlElement.style.lineHeight = lineSpacing+"px";
            }
        }

        /**
         * 设置粗体
         * @method setBold
         * @param {boolean} bold true或false
         * @public
         * @since 1.0.0
         */
        public setBold(bold:boolean):void{
            var s=this.htmlElement.style;
            if(bold){
                s.fontWeight="bold";
            }else{
                s.fontWeight="normal";
            }
        }

        /**
         * 设置文本是否倾斜
         * @method setItalic
         * @param {boolean} italic true或false
         * @public
         * @since 1.0.0
         */
        public setItalic(italic:boolean):void{
            var s=this.htmlElement.style;
            if(italic){
                s.fontStyle="italic";
            }else{
                s.fontStyle="normal";
            }
        }
        /**
         * 设置是否有边框
         * @method setBorder
         * @param {boolean} show true或false
         * @public
         * @sinc 1.0.0
         */
        public setBorder(show:boolean):void {
            var s = this;
            if (show) {
                s.htmlElement.style.borderStyle = "inset";
                s.htmlElement.style.backgroundColor = "#fff";
            } else {
                s.htmlElement.style.borderStyle = "none";
                s.htmlElement.style.backgroundColor = "transparent";
            }
        }

        /**
         * 获取输入文本的值,因为输入文本调用了html的input标签,所以不能直接像动态文本那样用textObj.text获取值或者设置值
         * @method getText
         * @public
         * @since 1.0.0
         * @returns {string}
         */
        public getText():string{
            var s=this;
            if(s.htmlElement){
                return s.htmlElement.value;
            }
        }

        /**
         * 设置输入文本的值,因为输入文本调用了html的input标签,所以不能直接像动态文本那样用textObj.text获取值或者设置值
         * @method setText
         * @param {string} text
         */
        public setText(text:string):void{
            var s=this;
            if(s.htmlElement) {
                s.htmlElement.value = text;
            }
        }
    }
}