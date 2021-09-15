/**
 * @module annie
 */
namespace annie {
    /**
     * 显示对象抽象类,不能直接实例化。一切显示对象的基类,包含了显示对象需要的一切属性
     * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
     * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕
     * 上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、TextField 或 MovieClip 类。
     * @class annie.DisplayObject
     * @since 1.0.0
     * @extends annie.EventDispatcher
     */
    export abstract class DisplayObject extends EventDispatcher {
        // events:
        /**
         * annie.DisplayObject显示对象加入到舞台事件
         * @event ADD_TO_STAGE
         * @since 1.0.0
         */
        /**
         * annie.DisplayObject显示对象从舞台移出事件
         * @event REMOVE_TO_STAGE
         * @since 1.0.0
         */

        /**
         * annie.DisplayObject显示对象 循环帧事件
         * @event ENTER_FRAME
         * @since 1.0.0
         */
        //MouseEvent
        /**
         * annie.DisplayObject鼠标或者手指按下事件
         * @event MOUSE_DOWN
         * @since 1.0.0
         */
        /**
         * annie.DisplayObject鼠标或者手指抬起事件
         * @event MOUSE_UP
         * @since 1.0.0
         */
        /**
         * annie.DisplayObject鼠标或者手指单击
         * @event CLICK
         * @type {string}
         */
        /**
         * annie.DisplayObject鼠标或者手指移动事件
         * @event MOUSE_MOVE
         * @since 1.0.0
         */
        /**
         * annie.DisplayObject鼠标或者手指移入到显示对象上里触发的事件
         * @event MOUSE_OVER
         * @since 1.0.0
         */
        /**
         * annie.DisplayObject鼠标或者手指移出显示对象边界触发的事件
         * @event MOUSE_OUT
         * @since 1.0.0
         */

//
        /**
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        constructor() {
            super();
            this._instanceType = "annie.DisplayObject";
        }

        //更新信息对象是否更新矩阵 a2x_ua 是否更新Alpha a2x_uf 是否更新滤镜
        protected a2x_um: boolean = false;
        protected a2x_ua: boolean = false;
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
         * 显示对象的父级
         * @property parent
         * @since 1.0.0
         * @public
         * @type {annie.Sprite}
         * @default null
         * @readonly
         */
        public parent: Sprite = null;
        //显示对象在显示列表上的最终表现出来的透明度,此透明度会继承父级的透明度依次相乘得到最终的值
        public _cAlpha: number = 1;
        //显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的显示属性依次相乘得到最终的值
        public _cMatrix: Matrix = new Matrix();
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
         * 每一个显示对象都可以给他命一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
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
            let s = this;
            if (value != s._x) {
                s._x = value;
                s.a2x_um = true;
            }
            s._changeTransformInfo[0] = true;
        }

        private _x: number = 0;
        protected _offsetX: number = 0;
        protected _offsetY: number = 0;

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
            let s = this;
            if (value != s._y) {
                s._y = value;
                s.a2x_um = true;
            }
            s._changeTransformInfo[1] = true;
        }

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
            let s = this;
            if (value != s._scaleX) {
                s._scaleX = value;
                s.a2x_um = true;
            }
            s._changeTransformInfo[2] = true;
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
            let s = this;
            if (value != s._scaleY) {
                s._scaleY = value;
                s.a2x_um = true;
            }
            s._changeTransformInfo[3] = true;
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
            let s = this;
            if (value != s._rotation || s._skewX != 0 || s._skewY != 0) {
                s._rotation = value;
                s._skewX = 0;
                s._skewY = 0;
                s.a2x_um = true;
            }
            s._changeTransformInfo[4] = true;
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
            let s = this;
            if (value != s._alpha) {
                s._alpha = value;
                s.a2x_ua = true;
            }
            s._changeTransformInfo[5] = true;
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
            let s = this;
            if (value != s._skewX || s._rotation != 0) {
                s._skewX = value;
                s._rotation = 0;
                s.a2x_um = true;
            }
            s._changeTransformInfo[4] = true;
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
            let s = this;
            if (value != s._skewY || s._rotation != 0) {
                s._skewY = value;
                s._rotation = 0;
                s.a2x_um = true;
            }
            s._changeTransformInfo[4] = true;
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
            let s = this;
            if (value != s._anchorX) {
                s._anchorX = value;
                s.a2x_um = true;
            }
        }

        private _anchorX: number = 0;

        /**
         * 显示对象上y方向的缩放或旋转点
         * @property anchorY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public get anchorY(): number {
            return this._anchorY;
        }

        public set anchorY(value: number) {
            let s: any = this;
            if (value != s._anchorY) {
                s._anchorY = value;
                s.a2x_um = true;
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
        public get visible() {
            return this._visible;
        }

        public set visible(value: boolean) {
            let s = this;
            if (value != s._visible) {
                s._cp = true;
                s._visible = value;
            }
        }

        public _visible: boolean = true;

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
        public get mask(): DisplayObject {
            return this._mask;
        }

        public set mask(value: DisplayObject) {
            let s = this;
            if (value != s._mask) {
                if (value instanceof annie.DisplayObject) {
                    value._isUseToMask++;
                } else {
                    if (s._mask instanceof annie.DisplayObject) {
                        s._mask._isUseToMask--;
                    }
                }
                s._mask = value;

            }
        }

        private _mask: DisplayObject = null;
        //是否自己的父级发生的改变
        public _cp: boolean = true;

        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        public globalToLocal(point: Point, bp: Point = null): Point {
            return this._cMatrix.invert().transformPoint(point.x, point.y, bp);
        }

        /**
         *将本地坐标转换到全局坐标值
         * @method localToGlobal
         * @public
         * @since 1.0.0
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        public localToGlobal(point: Point, bp: Point = null): Point {
            return this._cMatrix.transformPoint(point.x, point.y, bp);
        }

        //为了 hitTestPoint，localToGlobal，globalToLocal等方法不复新不重复生成新的点对象而节约内存
        public static _p1: Point = new Point();
        public static _p2: Point = new Point();
        public static _p3: Point = new Point();
        public static _p4: Point = new Point();
        protected _isUseToMask: number = 0;

        /**
         * annie.Sprite显示容器的接受鼠标点击的区域。一但设置，容器里所有子级将不会触发任何鼠标相关的事件。
         * 相当于 mouseChildren=false,但在有大量子级显示对象的情况下，此方法的性能搞出mouseChildren几个数量级，建议使用。
         * @property hitArea
         * @param {annie.Rectangle} rect
         * @since 3.0.1
         */
        public set hitArea(rect: annie.Rectangle) {
            this._hitArea = rect;
        }

        public get hitArea(): annie.Rectangle {
            return this._hitArea;
        }
        private _hitArea: annie.Rectangle = null;
        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} hitPoint 要检测碰撞的点
         * @param {boolean} isGlobalPoint 是不是全局坐标的点,默认false是本地坐标
         * @return {annie.DisplayObject}
         */
        public hitTestPoint(hitPoint: Point, isGlobalPoint: boolean = false): DisplayObject {
            let s = this;
            if (!s.visible || !s.mouseEnable) return null;
            let p: any;
            if (isGlobalPoint) {
                p = s.globalToLocal(hitPoint, DisplayObject._p1);
            } else {
                p = hitPoint;
            }
            //如果有设置鼠标活动区域,则优先使用活动区域
            if (s._hitArea) {
                if (s._hitArea.isPointIn(p)) {
                    return s;
                }
            }
            if (s._bounds.width == 0 || s._bounds.height == 0) {
                return null;
            }
            if (s._bounds.isPointIn(p)) {
                return s;
            }
            return null;
        }

        public getBounds(): Rectangle {
            return this._bounds;
        }

        /**
         * 获取对象形变后外切矩形
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         */
        public getDrawRect(matrix: annie.Matrix = null, bounds: annie.Rectangle = null): void {
            let s = this;
            if (matrix == void 0) {
                matrix = s.matrix;
            }
            if (bounds == void 0) {
                bounds = s.getBounds();
            }
            let x: number = bounds.x, y: number = bounds.y, w: number = bounds.width,
                h: number = bounds.height;
            matrix.transformPoint(x, y, DisplayObject._p1);
            matrix.transformPoint(x + w, y, DisplayObject._p2);
            matrix.transformPoint(x + w, y + h, DisplayObject._p3);
            matrix.transformPoint(x, y + h, DisplayObject._p4);
            Rectangle.createFromPoints(DisplayObject._transformRect, DisplayObject._p1, DisplayObject._p2, DisplayObject._p3, DisplayObject._p4);
        }

        protected _updateMatrix(): void {
            let s = this, cm: Matrix, pcm: Matrix, ca: number, pca: number;
            let isHadParent: boolean = s.parent instanceof annie.Sprite;
            cm = s._cMatrix;
            ca = s._cAlpha;
            if (isHadParent) {
                pcm = s.parent._cMatrix;
                pca = s.parent._cAlpha;
            }
            if (s.a2x_um) {
                s._matrix.createBox(s._x, s._y, s._scaleX, s._scaleY, s._rotation, s._skewX, s._skewY, s._anchorX, s._anchorY);
            }
            if (s._cp) {
                s.a2x_um = s.a2x_ua = true;
            } else {
                if (isHadParent) {
                    let PUI = s.parent;
                    if (PUI.a2x_um) {
                        s.a2x_um = true;
                    }
                    if (PUI.a2x_ua) {
                        s.a2x_ua = true;
                    }
                }
            }
            if (s.a2x_um) {
                cm.setFrom(s._matrix);
                if (isHadParent) {
                    cm.prepend(pcm);
                }
            }
            if (s.a2x_ua) {
                ca = s._alpha;
                if (isHadParent) {
                    ca *= pca
                }
            }
            s._cp = false;
            s._cAlpha = ca;
        }

        public  _draw(ctx:any):void{}
        protected _render(renderObj: IRender | any): void {
            let s = this;
            if (s._visible && s._cAlpha > 0) {
                let ctx = CanvasRender._ctx, tm;
                tm = s._cMatrix;
                if (ctx.globalAlpha != s._cAlpha) {
                    ctx.globalAlpha = s._cAlpha
                }
                ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                if (s.isNeedDraw) {
                    s._draw(ctx);
                }
            }
        }

        /**
         * 获取或者设置显示对象在父级里的x方向的宽，不到必要不要用此属性获取高
         * 如果你要同时获取宽高，建议使用 getWH()方法获取宽和高
         * @property  width
         * @public
         * @since 1.0.3
         * @return {number}
         */
        public get width(): number {
            this._updateMatrix();
            this.getDrawRect();
            return DisplayObject._transformRect.width;
        }

        public set width(value: number) {
            let s = this;
            s._updateMatrix();
            s.getDrawRect();
            let w = DisplayObject._transformRect.width;
            if (w > 0) {
                let sx = value / w;
                s.scaleX *= sx;
            } else {
                s.scaleX = 1;
            }
        }

        /**
         * 获取宽高
         * @method getWH
         * @since 1.1.0
         * @return {{w: number; h: number}}
         */
        public getWH(): { w: number, h: number } {
            this._updateMatrix();
            this.getDrawRect();
            return {w: DisplayObject._transformRect.width, h: DisplayObject._transformRect.height};
        }

        /**
         * 获取或者设置显示对象在父级里的y方向的高,不到必要不要用此属性获取高
         * 如果你要同时获取宽高，建议使用getWH()方法获取宽和高
         * @property  height
         * @public
         * @since 1.0.3
         * @return {number}
         */
        public get height(): number {
            this._updateMatrix();
            this.getDrawRect();
            return DisplayObject._transformRect.height;
        }

        public set height(value: number) {
            let s = this;
            s._updateMatrix();
            s.getDrawRect();
            let h = DisplayObject._transformRect.height;
            if (h > 0) {
                let sy = value / h;
                s.scaleY *= sy;
            } else {
                s.scaleY = 1;
            }
        }
        public static _transformRect: Rectangle = new annie.Rectangle();
        protected _bounds: Rectangle = new Rectangle();


        public isNeedDraw:boolean=false;
        protected _checkDrawBounds() {
            let s = this;
            //检查所有bounds矩阵是否在可视范围里
            if (s.stage) {
                s.getDrawRect(s._cMatrix, s._bounds);
                let dtr = DisplayObject._transformRect;
                s.isNeedDraw = Rectangle.testRectCross(dtr, s.stage.renderObj.viewPort);
            }
        }
        //每个Flash文件生成的对象都有一个自带的初始化信息
        private _a2x_res_obj: any = {};

        public destroy(): void {
            let s: any = this;
            s._a2x_res_obj = null;
            s.mask = null;
            s.parent = null;
            s.stage = null;
            s._bounds = null;
            s._matrix = null;
            s._cMatrix = null;
            super.destroy();
        }

        //这里为什么要用undefined呢，这样可以知道一个对象是否从未添加到舞台过
        public _isOnStage: boolean = undefined;

        public _onRemoveEvent(isReSetMc: boolean): void {
            //如果有音乐,则关闭音乐
            let s = this;
            s._isOnStage = false;
            s.dispatchEvent(annie.Event.REMOVE_TO_STAGE);
        }

        public _onAddEvent(): void {
            let s = this;
            s._isOnStage = true;
            s.dispatchEvent(annie.Event.ADD_TO_STAGE);
        }

        public _onUpdateFrame(mcSpeed: number = 1, isOffCanvas: boolean = false): void {
            if (this._visible && !isOffCanvas) {
                this.dispatchEvent(annie.Event.ENTER_FRAME);
            }
        }
        private _changeTransformInfo: Array<boolean> = [false, false, false, false, false, false];

        /**
         * 如果你在mc更改了对象的x y scale rotation alpha，最后想还原，不再需要自我控制，可以调用这方法
         * @method clearCustomTransform
         * @param transId{number}  //0->x,1->y,2->scaleX,3->scaleY,4->rotation,5->alpha,-1->all
         * @public
         * @since 3.1.0
         */
        public clearCustomTransform(transId: number = -1) {
            let s = this;
            if (transId = -1) {
                for (let i = 0; i < 6; i++) {
                    s._changeTransformInfo[i] = false;
                }
            } else {
                s._changeTransformInfo[transId] = false;
            }
        }

        public clearBounds() {
            this._bounds.x = 0;
            this._bounds.y = 0;
            this._bounds.width = 0;
            this._bounds.height = 0;
        }
    }
}