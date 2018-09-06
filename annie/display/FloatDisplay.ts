/**
 * @module annie
 */
namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 此类对于需要在canvas上放置html其他类型元素的时候非常有用<br/>
     * 比如有时候我们需要放置一个注册,登录或者其他的内容.这些内容包含了输入框<br/>
     * 或者下拉框什么的,无法在canvas里实现,但这些元素又跟canvas里面的元素<br/>
     * 位置,大小,缩放对应.就相当于是annie里的一个显示对象一样。可以随意设置他的<br/>
     * 属性,那么将你的html元素通过此类封装成annie的显示对象再合适不过了
     * @class annie.FloatDisplay
     * @extends annie.DisplayObject
     * @public
     * @since 1.0.0
     */
    export class FloatDisplay extends DisplayObject {
        /**
         * 需要封装起来的html元素的引用。你可以通过这个引用来调用或设置此元素自身的属性方法和事件,甚至是样式
         * @property htmlElement
         * @public
         * @since 1.0.0
         * @type{HtmlElement}
         */
        public htmlElement:any=null;
        // 是否已经添加了舞台事件
        private _isAdded: boolean = false;
        /**
         * 构造函数
         * @method FloatDisplay
         * @since 1.0.0
         * @public
         * @example
         *      var floatDisplay = new annie.FloatDisplay();
         *      floatDisplay.init(document.getElementById('annie'));
         *      s.addChild(floatDisplay);
         *
         * <p><a href="" target="_blank">测试链接</a></p>
         */
        public constructor() {
            super();
            let s = this;
            s._instanceType = "annie.FloatDisplay";
            s.addEventListener(Event.REMOVE_TO_STAGE, function (e: Event) {
                if (s.htmlElement) {
                    s.htmlElement.style.display = "none";
                }
            });
            s.addEventListener(Event.ADD_TO_STAGE, function (e: Event) {
                if(s.htmlElement){
                    let style=s.htmlElement.style;
                    if (!s._isAdded) {
                        s._isAdded = true;
                        s.stage.rootDiv.insertBefore(s.htmlElement, s.stage.rootDiv.childNodes[0]);
                        s.stage["_floatDisplayList"].push(s);
                    } else {
                        if (s.htmlElement && s.visible) {
                            style.display = "inline";
                        }
                    }
                }
            });
        }
        /**
         * 初始化方法,htmlElement 一定要设置width和height样式,并且一定要用px单位
         * @method init
         * @public
         * @since 1.0.0
         * @param {HtmlElement} htmlElement 需要封装起来的html元素的引用。你可以通过这个引用来调用或设置此元素自身的属性方法和事件,甚至是样式
         */
        public init(htmlElement: any): void {
            let s=this;
            let she:any;
            if (typeof(htmlElement) == "string") {
                she = document.getElementById(htmlElement);
            } else if (htmlElement._instanceType == "annie.Video") {
                she = htmlElement.media;
            }else{
                she=htmlElement;
            }
            let style = she.style;
            style.position = "absolute";
            style.display = "none";
            style.transformOrigin = style.WebkitTransformOrigin = "0 0 0";
            let ws=s.getStyle(she,"width");
            let hs=s.getStyle(she,"height");
            let w=0,h=0;
            if(ws.indexOf("px")){
                w=parseInt(ws);
            }
            if(hs.indexOf("px")){
                h=parseInt(hs);
            }
            s._bounds.width=w;
            s._bounds.height=h;
            s.htmlElement=she;
        }

        private getStyle(elem:HTMLElement, cssName:any ):any
        {
            //如果该属性存在于style[]中，则它最近被设置过(且就是当前的)
            if (elem.style[cssName])
            {
                return elem.style[cssName];
            }
            if (document.defaultView && document.defaultView.getComputedStyle)
            {
                //它使用传统的"text-Align"风格的规则书写方式，而不是"textAlign"
                cssName = cssName.replace(/([A-Z])/g,"-$1");
                cssName = cssName.toLowerCase();
                //获取style对象并取得属性的值(如果存在的话)
                let s = document.defaultView.getComputedStyle(elem,"");
                return s && s.getPropertyValue(cssName);
            }
            return null;
        }
        public updateStyle(): void {
            let s:any = this;
            let o = s.htmlElement;
            if (o) {
                let style = o.style;
                let visible = s._visible;
                if(visible){
                    if(!s.stage){
                        visible=false;
                    }else {
                        let parent = s.parent;
                        while (parent) {
                            if (!parent._visible) {
                                visible = false;
                                break;
                            }
                            parent = parent.parent;
                        }
                    }
                }
                let show = visible ? "inline" : "none";
                if (show != style.display) {
                    style.display = show;
                }
                if(visible||s._UI.UM||s._UI.UA||s._UI.UF){
                    if(s._UI.UM) {
                        let mtx = s.cMatrix;
                        let d = annie.devicePixelRatio;
                        style.transform = style.webkitTransform = "matrix(" + (mtx.a / d).toFixed(4) + "," + (mtx.b / d).toFixed(4) + "," + (mtx.c / d).toFixed(4) + "," + (mtx.d / d).toFixed(4) + "," + (mtx.tx / d).toFixed(4) + "," + (mtx.ty / d).toFixed(4) + ")";
                    }
                    if (s._UI.UA){
                        style.opacity = s.cAlpha;
                    }
                    s._UI.UF = false;
                    s._UI.UM = false;
                    s._UI.UA = false;
                }
            }
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            let elem = s.htmlElement;
            if (elem) {
                elem.style.display = "none";
                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
                s._isAdded = false;
                s.htmlElement = null;
            }
            let sf:any=s.stage["_floatDisplayList"];
            let len=sf.length;
            for(let i=0;i<len;i++){
                if(sf[i]==s){
                    sf.splice(i,1);
                    break;
                }
            }
            super.destroy();
        }
    }
}