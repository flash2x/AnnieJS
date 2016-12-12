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
         * 在手机端是否需要自动收回软键盘，在pc端此参数无效
         * @property isAutoDownKeyBoard
         * @type {boolean}
         * @since 1.0.3
         * @default true
         */
        public isAutoDownKeyBoard:boolean=true;
        /**
         * @method InputText
         * @public
         * @since 1.0.0
         * @param {string} inputType multiline 多行 password 密码 singleline 单行 number 数字 等
         */
        public constructor(inputType:string) {
            super();
            var input:any = null;
            let s:InputText = this;
            s._instanceType="annie.InputText";
            if (inputType != "multiline") {
                input = document.createElement("input");
                input.type = inputType;
            } else {
                input = document.createElement("textarea");
                input.style.resize = "none";
                input.style.overflow = "hidden";
            }
            s.inputType = inputType;
            var remove=function () {
                if(s.isAutoDownKeyBoard) {
                    s.htmlElement&&s.htmlElement.blur();
                }
            }.bind(s);
            s.addEventListener(Event.REMOVE_TO_STAGE, function (e:Event) {
                s.stage.removeEventListener(annie.MouseEvent.MOUSE_UP,remove);
            });
            s.addEventListener(Event.ADD_TO_STAGE, function (e:Event) {
                s.stage.addEventListener(annie.MouseEvent.MOUSE_UP,remove);
            });
            s.init(input);
        }
        public init(htmlElement:any):void{
            super.init(htmlElement);
            //默认设置
            let s=this;
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
            let s:InputText = this;
            s.htmlElement.placeholder = text;
            s.htmlElement.style.width = w + "px";
            s.htmlElement.style.height = h + "px";
            //font包括字体和大小
            s.htmlElement.style.font = size+"px "+font;
            s.htmlElement.style.color = color;
            s.htmlElement.style.textAlign = align;
            /////////////////////设置边框//////////////
            s.border=showBorder;
            //color:blue; text-align:center"
            if (s.inputType == "multiLine") {
                s.htmlElement.style.lineHeight = lineSpacing+"px";
            }
        }
        /**
         * 设置文本是否为粗体
         * @property bold
         * @param {boolean} bold true或false
         * @public
         * @since 1.0.3
         */
        public set bold(bold:boolean){
            let ss=this.htmlElement.style;
            if(bold){
                ss.fontWeight="bold";
            }else{
                ss.fontWeight="normal";
            }
        }
        public get bold():boolean{
            return this.htmlElement.style.fontWeight=="bold";
        }

        /**
         * 设置文本是否倾斜
         * @property italic
         * @param {boolean} italic true或false
         * @public
         * @since 1.0.3
         */
        public set italic(italic:boolean){
            let s=this.htmlElement.style;
            if(italic){
                s.fontStyle="italic";
            }else{
                s.fontStyle="normal";
            }
        }
        public get italic():boolean{
            return this.htmlElement.style.fontStyle=="italic"
        }
        /**
         * 设置文本颜色
         * @property color
         * @param {boolean} italic true或false
         * @public
         * @since 1.0.3
         */
        public set color(value:string){
            var ss=this.htmlElement.style;
            ss.color = value;
        }
        public get color():string{
            return this.htmlElement.style.color;
        }
        /**
         * 设置或获取是否有边框
         * @property property
         * @param {boolean} show true或false
         * @public
         * @since 1.0.3
         */
        public set border(show:boolean) {
            let s = this;
            if (show) {
                s.htmlElement.style.borderStyle = "inset";
                s.htmlElement.style.backgroundColor = "#fff";
            } else {
                s.htmlElement.style.borderStyle = "none";
                s.htmlElement.style.backgroundColor = "transparent";
            }
        }
        public get border():boolean {
            return this.htmlElement.style.borderStyle != "none";
        }
        /**
         * 获取或设置输入文本的值
         * 之前的getText 和setText 已废弃
         * @property text
         * @public
         * @since 1.0.3
         * @returns {string}
         */
        public get text():string{
            let s=this;
            if(s.htmlElement){
                return s.htmlElement.value;
            }
        }

        public set text(value:string){
            let s=this;
            if(s.htmlElement) {
                s.htmlElement.value = value;
            }
        }
    }
}