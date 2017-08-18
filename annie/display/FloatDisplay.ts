/**
 * @module annie
 */
namespace annie {
    /**
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
        /**
         * 是否已经添加了舞台事件
         * @property _isAdded
         * @since 1.0.0
         * @type {boolean}
         * @private
         */
        private _isAdded: boolean = false;

        /**
         * 构造函数
         * @method FloatDisplay
         * @since 1.0.0
         * @public
         * @example
         *      var floatDisplay = new annie.FloatDisplay();
         *      floatDisplay.init(document.getElementById('Flash2x'));
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
                if(s.htmlElement) {
                    let style=s.htmlElement.style;
                    if (!s._isAdded) {
                        s._isAdded = true;
                        s.stage.rootDiv.insertBefore(s.htmlElement, s.stage.rootDiv.childNodes[0]);
                    } else {
                        if (s.htmlElement && s.visible) {
                            style.display = "block";
                        }
                    }
                }
            });
        }

        /**
         * 初始化方法
         * @method init
         * @public
         * @since 1.0.0
         * @param {HtmlElement} htmlElement 需要封装起来的html元素的引用。你可以通过这个引用来调用或设置此元素自身的属性方法和事件,甚至是样式
         */
        public init(htmlElement: any): void {
            let s=this;
            if (typeof(htmlElement) == "string") {
                s.htmlElement = document.getElementById(htmlElement);
            } else if (htmlElement._instanceType == "annie.Video") {
                s.htmlElement = htmlElement.media;
            }else{
                s.htmlElement=htmlElement;
            }
            let style = htmlElement.style;
            style.position = "absolute";
            style.display = "none";
            style.transformOrigin = style.WebkitTransformOrigin = "0 0 0";

        }
        /**
         * 删除html元素,这样就等于解了封装
         * @method delElement
         * @since 1.0.0
         * @public
         */
        public delElement(): void {
            let elem = this.htmlElement;
            if (elem) {
                elem.style.display = "none";
                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
                this._isAdded = false;
                this.htmlElement = null;
            }
        }
        public getBounds():Rectangle{
            let s=this;
            s._bounds.width=0;
            s._bounds.height=0;
            if(s.htmlElement){
                let sh=s.htmlElement;
                let ss=sh.style;
                if(sh.width&&sh.height){
                    s._bounds.width=sh.width;
                    s._bounds.height=sh.height;
                }else{
                    if(ss.width.indexOf("px")<0||ss.height.indexOf("px")<0){
                        trace("htmlElement must set style.width and style.height with 'px'");
                    }else{
                        s._bounds.width=parseInt(ss.width);
                        s._bounds.height=parseInt(ss.height);
                    }
                }
            }
            return s._bounds;
        }
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        public update(isDrawUpdate:boolean=false): void {
            let s = this;
            let o = s.htmlElement;
            if (o) {
                let style = o.style;
                let visible = s._visible;
                if(visible){
                    let parent = s.parent;
                    while (parent) {
                        if(!parent._visible){
                            visible=false;
                            break;
                        }
                        parent=parent.parent;
                    }
                }
                let show = visible ? "block" : "none";
                if (show != style.display) {
                    style.display = show;
                }
                if(visible){
                    super.update(isDrawUpdate);
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
    }
}