/**
 * @module annie
 */
namespace annie{
    /**
     * 显示对象抽奖类,不能直接实例化。一切显示对象的基类,包含了显示对象需要的一切属性
     * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
     * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕
     * 上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、TextField 或 MovieClip 类。
     * @class annie.DisplayObject
     * @since 1.0.0
     * @extends annie.EventDispatcher
     */
    export class DisplayObject extends EventDispatcher{
        /**
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        public constructor(){
            super();
        }
        /**
         * 此显示对象所在的舞台对象,如果此对象没有被添加到显示对象列表中,此对象为空。
         * @property stage
         * @public
         * @since 1.0.0
         * @type {Stage}
         * @default null;
         * @readonly
         * */
        public stage:Stage=null;
        /**
         * 显示对象在显示列表上的最终表现出来的透明度,此透明度会继承父级的透明度依次相乘得到最终的值
         * @property cAlpha
         * @private
         * @type {number}
         * @since 1.0.0
         * @default 1
         */
        private cAlpha:number = 1;
        /**
         * 显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的透明度依次相乘得到最终的值
         * @property cMatrix
         * @private
         * @type {annie.Matrix}
         * @default null
         * @since 1.0.0
         */
        private cMatrix:Matrix = new Matrix();
        /**
         * 因为每次enterFrame事件时都生成一个Event非常浪费资源,所以做成一个全局的
         * @property _enterFrameEvent
         * @private
         * @type {annie.Event}
         * @default null
         * @since 1.0.0
         */
        private _enterFrameEvent:annie.Event=null;
        /**
         * 是否可以接受点击事件,如果设置为false,此显示对象将无法接收到点击事件
         * @property mouseEnable
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default true
         */
        public mouseEnable:boolean = true;
        /**
         * 显示对象上对显示列表上的最终的所有滤镜组
         * @property cFilters
         * @private
         * @default []
         * @since 1.0.0
         * @type {Array}
         */
        public cFilters:any[] = [];
        /**
         * 缓存着的滤镜组信息，通过此信息来判断滤镜是否有更新以此来告诉对象是否需要更新缓存视觉
         * @property cCacheFilters
         * @private
         * @default []
         * @since 1.0.0
         * @type {Array}
         */
        private cCacheFilters:any[] = [];
        /**
         * 是否需要更新缓存的开关
         * @property _isNeedUpdate
         * @private
         * @type {boolean}
         * @since 1.0.0
         * @default true
         */
        public _isNeedUpdate:boolean=true;
        /**
         * 每一个显示对象都可以给他启一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
         * @property name
         * @since 1.0.0
         * @public
         * @type {string}
         * @default ""
         */
        public name:string = "";
        /**
         * 显示对象位置x
         * @property x
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public x:number = 0;
        /**
         * 显示对象位置y
         * @property y
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public y:number = 0;
        /**
         * 显示对象x方向的缩放值
         * @property scaleX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        public scaleX:number = 1;
        /**
         * 显示对象y方向的缩放值
         * @property scaleY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        public scaleY:number = 1;
        /**
         * 显示对象旋转角度
         * @property rotation
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public rotation:number = 0;
        /**
         * 显示对象透明度
         * @property alpha
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        public alpha:number = 1;
        /**
         * 显示对象x方向的斜切值
         * @property skewX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public skewX:number = 0;
        /**
         * 显示对象y方向的斜切值
         * @property skewY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public skewY:number = 0;
        /**
         * 显示对象上x方向的缩放或旋转点
         * @property anchorX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public anchorX:number = 0;
        /**
         * 显示对象上y方向的缩放或旋转点
         * @property anchorY
         * @pubic
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public anchorY:number = 0;
        /**
         * 显未对象是否可见
         * @property visible
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default 0
         */
        public visible:boolean = true;
        // /**
        //  * 显示对象的混合模式
        //  * @property blendMode
        //  * @public
        //  * @since 1.0.0
        //  * @type {number}
        //  * @default 0
        //  */
        // public blendMode:number = 0;
        /**
         * 显示对象的变形矩阵
         * @property matrix
         * @public
         * @since 1.0.0
         * @type {annie.Matrix}
         * @default null
         */
        public matrix:Matrix = new Matrix();
        /**
         * 显示对象的遮罩, 是一个Shape显示对象或是一个只包含shape显示对象的MovieClip
         * @property mask
         * @public
         * @since 1.0.0
         * @type {annie.DisplayObject}
         * @default null
         */
        public mask:any = null;
        /**
         * 显示对象的滤镜数组
         * @property filters
         * @since 1.0.0
         * @public
         * @type {Array}
         * @default null
         */
        public filters:any[] = null;
        /**
         * 显示对象的父级
         * @property parent
         * @since 1.0.0
         * @public
         * @type {annie.Sprite}
         * @default null
         * @readonly
         */
        public parent:Sprite = null;

        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @returns {annie.Point}
         */
        public globalToLocal(point:Point):Point {
            return this.cMatrix.invert().transformPoint(point.x, point.y);
        }
        /**
         *将本地坐标转换到全局坐标值
         * @method localToGlobal
         * @public
         * @since 1.0.0
         * @param {annie.Point} point
         * @returns {annie.Point}
         */
        public localToGlobal(point:Point):Point {
            return this.cMatrix.transformPoint(point.x, point.y);
        }
        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} globalPoint 全局坐标中的一个点
         * @param {boolean} isMouseEvent 是否是鼠标事件调用此方法,用户一般无须理会,除非你要模拟鼠标点击可以
         * @returns {annie.DisplayObject}
         */
        public hitTestPoint(globalPoint:Point, isMouseEvent:boolean = false):DisplayObject {
            var s = this;
            if(!s.visible)return null;
            if (isMouseEvent && !s.mouseEnable)return null;
            if (s.getBounds().isPointIn(s.globalToLocal(globalPoint))) {
                return s;
            }
            return null;
        }
        /**
         * 获取对象的自身的没有任何形变的原始姿态下的原点坐标及宽高,抽像方法
         * @method getBounds
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         */
        public getBounds():Rectangle {
            return null;
        }

        /**
         * 获取对象形变后外切矩形。
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽主y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         */
        public getDrawRect():Rectangle{
            var s = this;
            var rect:Rectangle;
            var bounds = s.getBounds();
            if (bounds){
                var p1:Point = s.matrix.transformPoint(bounds.x, bounds.y);
                var p2:Point = s.matrix.transformPoint(bounds.x + bounds.width, bounds.y + bounds.height);
                rect = Rectangle.createFromPoints(p1, p2);
                rect.width -= rect.x;
                rect.height -= rect.y;
            }
            return rect;
        }
        /**
         * 更新函数
         * @method update
         * @public
         * @since 1.0.0
         */
        public update():void {
            var s = this;
            s.matrix.createBox(s.x, s.y, s.scaleX, s.scaleY, s.rotation, s.skewX, s.skewY, s.anchorX, s.anchorY);
            s.cFilters.length=0;
            s.cMatrix.setFrom(s.matrix);
            if (s.parent) {
                s.cMatrix.prepend(s.parent.cMatrix);
                s.cAlpha = s.alpha * s.parent.cAlpha;
                if (s.parent.cFilters && s.parent.cFilters.length > 0) {
                    var len=s.parent.cFilters.length;
                    var pf=s.parent.cFilters;
                    for(var i=0;i<len;i++) {
                        s.cFilters[i]=pf[i];
                    }
                }
            } else {
                s.cAlpha = s.alpha;
            }
            if(s.visible) {
                //如果visible为true更新他们的显示列表信息
                if (s.filters && s.filters.length > 0) {
                    var len = s.filters.length;
                    var sf = s.filters;
                    for (var i = 0; i < len; i++) {
                        s.cFilters.push(sf[i]);
                    }
                }
                //判读是否显示对象链上是否有滤镜更新
                if (s.cFilters.length > 0) {
                    var cLen = s.cFilters.length;
                    var isNeedUpdateFilters = false;
                    if (s.cCacheFilters.length != cLen) {
                        isNeedUpdateFilters = true;
                    } else {
                        for (var i = 0; i < cLen; i++) {
                            if (s.cFilters[i].toString() != s.cCacheFilters[i]) {
                                isNeedUpdateFilters = true;
                                break;
                            }
                        }
                    }
                    if (isNeedUpdateFilters) {
                        s._isNeedUpdate = true;
                        s.cCacheFilters.length = 0;
                        for (var i = 0; i < cLen; i++) {
                            s.cCacheFilters[i] = s.cFilters[i].toString();
                        }
                    }
                } else if (s.cCacheFilters.length > 0) {
                    s.cCacheFilters.length = 0;
                    s._isNeedUpdate = true;
                }
            }
            //enterFrame事件,因为enterFrame不会冒泡所以不需要调用s._enterFrameEvent._pd=false
            if (s.hasEventListener("onEnterFrame")) {
                if(!s._enterFrameEvent){
                    s._enterFrameEvent=new Event("onEnterFrame");
                }
                s.dispatchEvent(s._enterFrameEvent);
            }
        }
        /**
         * 抽象方法
         * 调用此方法将显示对象渲染到屏幕
         * @method render
         * @public
         * @since 1.0.0
         * @param {annie.IRender} renderObj
         */
        public render(renderObj:IRender):void {
            //this.isNeedUpdate =false;
        }
        /**
         * 调用些方法会冒泡的将事件向显示列表下方传递
         * @method _onDispatchBubbledEvent
         * @private
         * @since 1.0.0
         * @param {string} type
         * @private
         */
        public _onDispatchBubbledEvent(type:string):void {
            var s = this;
            s.stage=s.parent.stage;
            s.dispatchEvent(type);
            if(type=="onRemoveToStage"){
                s.stage=null;
            }
        }
        /**
         * 返回显示对象的宽和高
         * @method getWH
         * @public
         * @since 1.0.0
         * @returns {width: number, height: number}
         */
        public getWH():{width:number,height:number} {
            var s = this;
            var dr = s.getDrawRect();
            return {width: dr.width, height: dr.height};
        }
        /**
         * 设置显示对象的宽和高
         * @method setWH
         * @public
         * @since 1.0.0
         * @param {number} w
         * @param {number} h
         */
        public setWH(w:number, h:number):void {
            var s = this;
            var wh = s.getWH();
            if (w != 0) {
                var sx = w / wh.width;
                s.scaleX *= sx;
            }
            if (h != 0) {
                var sy = h / wh.height;
                s.scaleY *= sy;
            }
        }
        /**
         * 画缓存位图的时候需要使用
         * @property _bitmapCanvas
         * @private
         * @static
         * @since 1.0.0
         * @type {Canvas}
         */
        public static _canvas:any = window.document.createElement("canvas");
    }
}