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
         * @property _oldProps
         * @private
         * @since 1.0.0
         * @type {{alpha: number, matrix: {a: number, b: number, c: number, d: number, tx: number, ty: number}}}
         */
        private _oldProps:Object={alpha:1,matrix:{a:1,b:0,c:0,d:1,tx:0,ty:0}};
        /**
         * @property _isAdded
         * @since 1.0.0
         * @type {boolean}
         * @private
         */
        private _isAdded:boolean=false;
        /**
         * @method FloatDisplay
         * @public
         * @param isOnCanvas 是否悬浮在canvas上面,否则会将元素放到canvas下面
         * @since 1.0.0
         */
        public constructor() {
            super();
            var s = this;
            s.addEventListener(Event.REMOVE_TO_STAGE, function (e: Event) {
                if (s.htmlElement) {
                    s.htmlElement.style.display = "none";
                }
            })
            s.addEventListener(Event.ADD_TO_STAGE, function (e: Event) {
                if (!s._isAdded) {
                    s._isAdded = true;
                    s.stage.rootDiv.insertBefore(s.htmlElement,s.stage.rootDiv.childNodes[0]);
                } else {
                    if (s.htmlElement && s.visible) {
                        s.htmlElement.style.display = "inline";
                    }
                }
            })
        }
        /**
         * 初始化方法
         * @method init
         * @public
         * @since 1.0.0
         * @param {HtmlElement} htmlElement 需要封装起来的html元素的引用。你可以通过这个引用来调用或设置此元素自身的属性方法和事件,甚至是样式
         */
        public init(htmlElement:any):void{
            var s =this;
            if (typeof(htmlElement) == "string") {
                htmlElement = document.getElementById(htmlElement);
            }
            var style = htmlElement.style;
            style.position = "absolute";
            style.display="none";
            //style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
            style.transformOrigin=style.webkitTransformOrigin="0 0 0";
            s.htmlElement = htmlElement;
        }

        /**
         * 删除html元素,这样就等于解了封装
         * @method delElement
         * @since 1.0.0
         * @public
         */
        public delElement():void{
            var elem=this.htmlElement;
            if(elem){
                elem.style.display="none";
                if(elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
                this._isAdded=false;
                this.htmlElement=null;
            }
        }

        /**
         * 刷新现实对象
         * @method update
         * @public
         * @since 1.0.0
         */
        public update():void{
            super.update();
            var s=this;
            var o = s.htmlElement;
            if (!o) {
                return;
            }
            var style = o.style;
            var visible=s.visible;
            var parent=s.parent;
            while(visible&&parent){
                visible=parent.visible;
                parent=parent.parent;
            }
            var show = visible ? "inline" : "none";
            if(show!=style.display){
                style.display = show;
            }
            if (!s.visible) {
                return;
            }
            var props:any=new Object;
            props.alpha= s["cAlpha"];
            var mtx = s["cMatrix"];
            var oldProps:any = s._oldProps;
            var d=annie.devicePixelRatio;
            if (!Matrix.isEqual(oldProps.matrix,mtx)){
                style.transform = style.webkitTransform="matrix(" + (mtx.a/d) + "," + (mtx.b/d) + "," + (mtx.c/d) + "," + (mtx.d/d) + "," + (mtx.tx/d)+"," + (mtx.ty/d)+")";
                oldProps.matrix={tx:mtx.tx,ty:mtx.ty,a:mtx.a,b:mtx.b,c:mtx.c,d:mtx.d};
            }
            if (oldProps.alpha != props.alpha){
                style.opacity =props.alpha;
                oldProps.alpha = props.alpha;
            }
        }
        /**
         * 获取对象的bounds
         * @method getBounds
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         */
        public getBounds():Rectangle{
            var s=this;
            var r=new Rectangle();
            if(s.htmlElement){
                var hs=s.htmlElement.style;
                r.width=parseInt(hs.width);
                r.height=parseInt(hs.height);
            }
            return r;
        }
    }
}