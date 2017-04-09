/**
 * @module annie
 */
namespace annie {
    /**
     * 显示对象抽奖类,不能直接实例化。一切显示对象的基类,包含了显示对象需要的一切属性
     * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
     * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕
     * 上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、TextField 或 MovieClip 类。
     * @class annie.DisplayObject
     * @since 1.0.0
     * @extends annie.EventDispatcher
     */
    export abstract class DisplayObject extends EventDispatcher {
        /**
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        public constructor(){
            super();
            this._instanceType = "annie.DisplayObject";
        }

        /**
         * 更新信息
         * @property _updateInfo
         * @param UM 是否更新矩阵 UA 是否更新Alpha UF 是否更新滤镜
         */
        protected _updateInfo: {UM: boolean, UA: boolean, UF: boolean} = {UM: true, UA: true, UF: false};
        /**
         * 此显示对象所在的舞台对象,如果此对象没有被添加到显示对象列表中,此对象为空。
         * @property stage
         * @public
         * @since 1.0.0
         * @type {Stage}
         * @default null;
         * @readonly
         * */
        public stage: Stage = null;
        /**
         * 显示对象在显示列表上的最终表现出来的透明度,此透明度会继承父级的透明度依次相乘得到最终的值
         * @property cAlpha
         * @private
         * @type {number}
         * @since 1.0.0
         * @default 1
         */
        protected cAlpha: number = 1;
        /**
         * 显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的显示属性依次相乘得到最终的值
         * @property cMatrix
         * @private
         * @type {annie.Matrix}
         * @default null
         * @since 1.0.0
         */
        protected cMatrix: Matrix = new Matrix();
        /**
         * 因为每次enterFrame事件时都生成一个Event非常浪费资源,所以做成一个全局的
         * @property _enterFrameEvent
         * @private
         * @type {annie.Event}
         * @default null
         * @since 1.0.0
         */
        private _enterFrameEvent: annie.Event = null;
        /**
         * 是否可以接受点击事件,如果设置为false,此显示对象将无法接收到点击事件
         * @property mouseEnable
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        public mouseEnable: boolean = true;
        /**
         * 显示对象上对显示列表上的最终的所有滤镜组
         * @property cFilters
         * @private
         * @default []
         * @since 1.0.0
         * @type {Array}
         */
        protected cFilters: any[] = [];
        /**
         * 每一个显示对象都可以给他启一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
         * @property name
         * @since 1.0.0
         * @public
         * @type {string}
         * @default ""
         */
        public name: string = "";

        /**
         * 显示对象位置x
         * @property x
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get x(): number {
            return this._x;
        }

        public set x(value: number) {
            let s=this;
            if(s._x!=value) {
                s._x = value;
                s._updateInfo.UM = true;
            }
        }

        private _x: number = 0;

        /**
         * 显示对象位置y
         * @property y
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get y(): number {
            return this._y;
        }

        public set y(value: number) {
            let s=this;
            if(s._y!=value) {
                s._y = value;
                s._updateInfo.UM = true;
            }
        };

        private _y: number = 0;

        /**
         * 显示对象x方向的缩放值
         * @property scaleX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        public get scaleX(): number {
            return this._scaleX;
        }

        public set scaleX(value: number) {
            let s=this;
            if(s._scaleX!=value) {
                s._scaleX = value;
                s._updateInfo.UM = true;
            }
        }

        private _scaleX: number = 1;

        /**
         * 显示对象y方向的缩放值
         * @property scaleY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        public get scaleY(): number {
            return this._scaleY;
        }

        public set scaleY(value: number) {
            let s=this;
            if(s._scaleY) {
                s._scaleY = value;
                s._updateInfo.UM = true;
            }
        }
        private _scaleY: number = 1;
        /**
         * 显示对象旋转角度
         * @property rotation
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get rotation(): number {
            return this._rotation;
        }

        public set rotation(value: number) {
            let s=this;
            if(s._rotation!=value) {
                s._rotation = value;
                s._updateInfo.UM = true;
            }
        }

        private _rotation: number = 0;
        /**
         * 显示对象透明度
         * @property alpha
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        public get alpha(): number {
            return this._alpha;
        }

        public set alpha(value: number) {
            let s=this;
            if(s._alpha!=value) {
                s._alpha = value;
                s._updateInfo.UA = true
            }
        }

        private _alpha: number = 1;

        /**
         * 显示对象x方向的斜切值
         * @property skewX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get skewX(): number {
            return this._skewX;
        }

        public set skewX(value: number) {
            var s=this;
            if(s._skewX!=value) {
                s._skewX = value;
                s._updateInfo.UM = true;
            }
        }

        private _skewX: number = 0;

        /**
         * 显示对象y方向的斜切值
         * @property skewY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get skewY(): number {
            return this._skewY;
        }

        public set skewY(value: number) {
            let s=this;
            if(s.skewY!=value) {
                s._skewY = value;
                s._updateInfo.UM = true;
            }
        }
        private _skewY: number = 0;

        /**
         * 显示对象上x方向的缩放或旋转点
         * @property anchorX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get anchorX(): number {
            return this._anchorX;
        }

        public set anchorX(value: number) {
            let s=this;
            if(s._anchorX!=value) {
                s._anchorX = value;
                s._updateInfo.UM = true;
            }
        }

        private _anchorX: number = 0;

        /**
         * 显示对象上y方向的缩放或旋转点
         * @property anchorY
         * @pubic
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get anchorY(): number {
            return this._anchorY;
        }

        public set anchorY(value: number) {
            let s=this;
            if(s._anchorY!=value){
                s._anchorY = value;
                s._updateInfo.UM = true;
            }

        }

        private _anchorY: number = 0;
        /**
         * 显未对象是否可见
         * @property visible
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default 0
         */
        public get visible(){return this._visible;}
        public set visible(value:boolean){
            let s=this;
            if(s._visible!=value){
                s._visible=value;
                s._cp=true;
            }
        }
        public _visible: boolean = true;
        /**
         * 显示对象的混合模式
         * 支持的混合模式大概有
         * @property blendMode
         * @public
         * @since 1.0.0
         * @type {string}
         * @default 0
         */
        public blendMode: string = "normal";

        /**
         * 显示对象的变形矩阵
         * @property matrix
         * @public
         * @since 1.0.0
         * @type {annie.Matrix}
         * @default null
         */
        public get matrix(): Matrix {
            return this._matrix
        };

        private _matrix: Matrix = new Matrix();
        /**
         * 显示对象的遮罩, 是一个Shape显示对象或是一个只包含shape显示对象的MovieClip
         * @property mask
         * @public
         * @since 1.0.0
         * @type {annie.DisplayObject}
         * @default null
         */
        public mask: any = null;

        /**
         * 显示对象的滤镜数组
         * @property filters
         * @since 1.0.0
         * @public
         * @type {Array}
         * @default null
         */
        public get filters(): any[] {
            return this._filters;
        }

        public set filters(value: any[]){
            if(!value)return;
            if(value.length==0&&this._filters.length==0)return;
            if(value&&value.length>0) {
                this._filters = value;
            }else{
                this._filters.length=0;
            }
            this._updateInfo.UF = true;
        }
        private _filters: any[] = [];
        /**
         * 显示对象的父级
         * @property parent
         * @since 1.0.0
         * @public
         * @type {annie.Sprite}
         * @default null
         * @readonly
         */
        public parent: Sprite = null;
        /**
         * 是否自己的父级发生的改变
         * @type {boolean}
         * @private
         */
        protected _cp:boolean=false;
        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @returns {annie.Point}
         */
        public globalToLocal(point: Point, bp: Point = null): Point {
            if (!bp) {
                bp = annie.DisplayObject._bp;
            }
            return this.cMatrix.invert().transformPoint(point.x, point.y, bp);
        }

        /**
         *将本地坐标转换到全局坐标值
         * @method localToGlobal
         * @public
         * @since 1.0.0
         * @param {annie.Point} point
         * @returns {annie.Point}
         */
        public localToGlobal(point: Point, bp: Point = null): Point {
            if (!bp) {
                bp = annie.DisplayObject._bp;
            }
            return this.cMatrix.transformPoint(point.x, point.y, bp);
        }

        /**
         * 为了hitTestPoint，localToGlobal，globalToLocal等方法不复新不重复生成新的点对象而节约内存
         * @type {annie.Point}
         * @private
         * @static
         */
        public static _bp: Point = new Point();

        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} globalPoint 全局坐标中的一个点
         * @param {boolean} isMouseEvent 是否是鼠标事件调用此方法,用户一般无须理会,除非你要模拟鼠标点击可以
         * @returns {annie.DisplayObject}
         */
        public hitTestPoint(globalPoint: Point, isMouseEvent: boolean = false): DisplayObject {
            let s = this;
            if (!s.visible)return null;
            if (isMouseEvent && !s.mouseEnable)return null;
            if (s.getBounds().isPointIn(s.globalToLocal(globalPoint, DisplayObject._bp))) {
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
         * @abstract
         */
        public abstract getBounds(): Rectangle;

        /**
         * 获取对象形变后外切矩形。
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         */
        public getDrawRect(): Rectangle {
            let s = this;
            let rect = s.getBounds();
            let p1: Point = s.matrix.transformPoint(rect.x, rect.y);
            let p2: Point = s.matrix.transformPoint(rect.x + rect.width, rect.y + rect.height);
            Rectangle.createRectform2Point(s._drawRect,p1, p2);
            return s._drawRect;
        }
        /**
         * 更新函数
         * @method update
         * @public
         * @since 1.0.0
         */
        public update(um: boolean, ua: boolean, uf: boolean): void{
            let s = this;
            //enterFrame事件,因为enterFrame不会冒泡所以不需要调用s._enterFrameEvent._pd=false
            if (s.hasEventListener("onEnterFrame")) {
                if (!s._enterFrameEvent) {
                    s._enterFrameEvent = new Event("onEnterFrame");
                }
                s.dispatchEvent(s._enterFrameEvent);
            }
            if(s._cp){
                s._updateInfo.UM=s._updateInfo.UA=s._updateInfo.UF=true;
                s._cp=false;
            }
            if (s._updateInfo.UM) {
                s._matrix.createBox(s._x, s._y, s._scaleX, s._scaleY, s._rotation, s._skewX, s._skewY, s._anchorX, s._anchorY);
            }
            if (um || s._updateInfo.UM) {
                s.cMatrix.setFrom(s._matrix);
                if (s.parent) {
                    s.cMatrix.prepend(s.parent.cMatrix);
                }
            }
            if (ua || s._updateInfo.UA){
                s.cAlpha = s._alpha;
                if (s.parent) {
                    s.cAlpha *= s.parent.cAlpha;
                }
            }
            if (uf || s._updateInfo.UF){
                s.cFilters.length = 0;
                let sf = s._filters;
                let len = sf.length;
                for (let i = 0; i < len; i++) {
                    s.cFilters.push(sf[i]);
                }
                if (s.parent) {
                    if (s.parent.cFilters.length > 0) {
                        let len = s.parent.cFilters.length;
                        let pf = s.parent.cFilters;
                        for (let i = len - 1; i >= 0; i--) {
                            s.cFilters.unshift(pf[i]);
                        }
                    }
                }
            }
        }
        /**
         * 抽象方法
         * 调用此方法将显示对象渲染到屏幕
         * @method render
         * @public
         * @since 1.0.0
         * @param {annie.IRender} renderObj
         * @abstract
         */
        public abstract render(renderObj: IRender): void;

        /**
         * 调用些方法会冒泡的将事件向显示列表下方传递
         * @method _onDispatchBubbledEvent
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} updateMc 是否更新movieClip时间轴信息
         * @private
         */
        public _onDispatchBubbledEvent(type: string, updateMc: boolean = false): void {
            let s = this;
            s.stage = s.parent.stage;
            s.dispatchEvent(type);
            if (type == "onRemoveToStage") {
                s.stage = null;
            }
        }
        /**
         * 获取或者设置显示对象在父级里的x方向的宽,如果你要同时获取款高
         * 之前需要使用getWH或者setWH 现已废弃
         * @property  width
         * @public
         * @since 1.0.3
         * @return {number}
         */
        public get width(): number {
            return this.getWH().width;
        }

        public set width(value: number){
            let s = this;
            let w = s.width;
            if (value != 0) {
                let sx = value / w;
                s.scaleX *= sx;
            }
        }
        /**
         * 获取或者设置显示对象在父级里的y方向的高
         * 之前需要使用getWH或者setWH 现已废弃
         * @property  height
         * @public
         * @since 1.0.3
         * @return {number}
         */
        public get height(): number {
            return this.getWH().height;
        }
        public set height(value: number) {
            let s = this;
            let h = s.height;
            if (value != 0) {
                let sy = value / h;
                s.scaleY *= sy;
            }
        }
        /**
         * 如果需要同时获取宽和高的值，建议使用此方法更有效率
         * @method getWH
         * @public
         * @returns {{width: number, height: number}}
         * @since 1.0.9
         */
        public getWH():{width:number,height:number}{
            let s = this;
            s.update(false,false,false);
            let dr = s.getDrawRect();
            s._updateInfo.UM = true;
            return {width:dr.width,height:dr.height};
        }
        /**
         * 画缓存位图的时候需要使用
         * @property _bitmapCanvas
         * @private
         * @static
         * @since 1.0.0
         * @type {Canvas}
         */
        public static _canvas: any = window.document.createElement("canvas");
        /**
         * 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
         * @property _cacheImg
         * @protected
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        protected _cacheImg:any=null;
        /**
         * @property _cacheX
         * @protected
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        protected _cacheX:number = 0;
        /**
         * @property _cacheY
         * @protected
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        protected _cacheY:number = 0;
        protected _bounds:Rectangle=new Rectangle();
        protected _drawRect:Rectangle=new Rectangle();
    }
}