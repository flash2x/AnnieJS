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
        /**
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        constructor(){
            super();
            this._instanceType = "annie.DisplayObject";
        }

        //更新信息对象是否更新矩阵 UA 是否更新Alpha UF 是否更新滤镜
        protected _UI: { UD: boolean, UM: boolean, UA: boolean, UF: boolean } = {
            UD: false,
            UM: true,
            UA: true,
            UF: false
        };
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
        protected cAlpha: number = 1;

        //显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的显示属性依次相乘得到最终的值
        protected cMatrix: Matrix = new Matrix();

        /**
         * 是否可以接受点击事件,如果设置为false,此显示对象将无法接收到点击事件
         * @property mouseEnable
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        public mouseEnable: boolean = true;
        //显示对象上对显示列表上的最终的所有滤镜组
        protected cFilters: any = [];
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
            this._setProperty("_x", value, 0);
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
            this._setProperty("_y", value, 0);
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
            this._setProperty("_scaleX", value, 0);
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
            this._setProperty("_scaleY", value, 0);
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
            this._setProperty("_rotation", value, 0);
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
            this._setProperty("_alpha", value, 1);
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
            this._setProperty("_skewX", value, 0);
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
            this._setProperty("_skewY", value, 0);
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
            this._setProperty("_anchorX", value, 0);
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
            this._setProperty("_anchorY", value, 0);
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
                s._visible = value;
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
        //public blendMode: string = "normal";
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
                if (value) {
                    value["_isUseToMask"]++;
                } else {
                    if (s._mask != null) {
                        s._mask["_isUseToMask"]--;
                    }
                }
                s._mask = value;
            }
        }

        private _mask: DisplayObject = null;

        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
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

        public set filters(value: any[]) {
            this._setProperty("_filters", value, 2);
        }

        private _filters: any[] = [];

        //是否自己的父级发生的改变
        protected _cp: boolean = true;

        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        public globalToLocal(point: Point, bp: Point = null): Point {
            return this.cMatrix.invert().transformPoint(point.x, point.y, bp);
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
            let s = this;
            if (s.parent) {
                //下一级的坐标始终应该是相对父级来说的，所以是用父级的矩阵去转换
                return s.parent.cMatrix.transformPoint(point.x, point.y, bp);
            } else {
                //没有父级
                return s.cMatrix.transformPoint(point.x, point.y, bp);
            }
        }

        //为了hitTestPoint，localToGlobal，globalToLocal等方法不复新不重复生成新的点对象而节约内存
        public static _bp: Point = new Point();
        public static _p1: Point = new Point();
        public static _p2: Point = new Point();
        public static _p3: Point = new Point();
        public static _p4: Point = new Point();
        protected _dragBounds: Rectangle = new Rectangle();
        protected _isDragCenter: boolean = false;
        protected _lastDragPoint: Point = new Point();

        /**
         * 启动鼠标或者触摸拖动
         * @method startDrag
         * @param {boolean} isCenter 指定将可拖动的对象锁定到指针位置中心 (true)，还是锁定到用户第一次单击该对象的位置 (false) 默认false
         * @param {annie.Rectangle} bounds 相对于显圣对象父级的坐标的值，用于指定 Sprite 约束矩形
         * @since 1.1.2
         * @public
         * @return {void}
         */
        public startDrag(isCenter: boolean = false, bounds: Rectangle = null): void {
            let s = this;
            if (!s.stage) {
                console.log("The DisplayObject is not on stage");
                return;
            }
            Stage._dragDisplay = s;
            s._isDragCenter = isCenter;
            s._lastDragPoint.x = Number.MAX_VALUE;
            s._lastDragPoint.y = Number.MAX_VALUE;
            if (bounds) {
                s._dragBounds.x = bounds.x;
                s._dragBounds.y = bounds.y;
                s._dragBounds.width = bounds.width;
                s._dragBounds.height = bounds.height;
            } else {
                s._dragBounds.x = 0;
                s._dragBounds.y = 0;
                s._dragBounds.width = 0;
                s._dragBounds.height = 0;
            }
        }

        protected _isUseToMask: number = 0;

        /**
         * 停止鼠标或者触摸拖动
         * @method stopDrag
         * @public
         * @since 1.1.2
         * @return {void}
         */
        public stopDrag(): void {
            if (Stage._dragDisplay == this) {
                Stage._dragDisplay = null;
            }
        }

        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} hitPoint 要检测碰撞的点
         * @param {boolean} isGlobalPoint 是不是全局坐标的点,默认false是本地坐标
         * @param {boolean} isMustMouseEnable 是不是一定要MouseEnable为true的显示对象才接受点击测试,默认为不需要 false
         * @return {annie.DisplayObject}
         */
        public hitTestPoint(hitPoint: Point, isGlobalPoint: boolean = false, isMustMouseEnable: boolean = false): DisplayObject {
            let s = this;
            if (!s.visible || (!s.mouseEnable && isMustMouseEnable)) return null;
            let p: Point;
            if (isGlobalPoint) {
                p = s.globalToLocal(hitPoint, DisplayObject._bp);
            } else {
                p = hitPoint;
            }
            if (s.getBounds().isPointIn(p)) {
                return s;
            }
            return null;
        }

        /**
         * 获取对象的自身的没有任何形变的原始姿态下的原点坐标及宽高,抽像方法
         * @method getBounds
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         */
        public getBounds(): Rectangle {
            return this._bounds;
        };

        /**
         * 获取对象形变后外切矩形。
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         */
        public getDrawRect(): Rectangle {
            let s = this;
            let rect = s.getBounds();
            if (s._mask) {
                let maskRect = s._mask.getDrawRect();
                if (rect.x < maskRect.x) {
                    rect.x = maskRect.x;
                }
                if (rect.y < maskRect.y) {
                    rect.y = maskRect.y;
                }
                if (rect.width > maskRect.width) {
                    rect.width = maskRect.width;
                }
                if (rect.height > maskRect.height) {
                    rect.height = maskRect.height;
                }
            }
            s.matrix.transformPoint(rect.x, rect.y, DisplayObject._p1);
            s.matrix.transformPoint(rect.x + rect.width, rect.y, DisplayObject._p2);
            s.matrix.transformPoint(rect.x + rect.width, rect.y + rect.height, DisplayObject._p3);
            s.matrix.transformPoint(rect.x, rect.y + rect.height, DisplayObject._p4);
            Rectangle.createFromPoints(s._drawRect, DisplayObject._p1, DisplayObject._p2, DisplayObject._p3, DisplayObject._p4);
            return s._drawRect;
        }

        /**
         * 更新函数
         * @method update
         * @public
         * @since 1.0.0
         * @return {void}
         */
        protected update(isDrawUpdate: boolean = true): void {
            let s = this;
            if(!s._visible)return;
            let UI = s._UI;
            if (s._cp) {
                UI.UM = UI.UA = UI.UF = true;
                s._cp = false;
            }
            if (UI.UM) {
                s._matrix.createBox(s._x, s._y, s._scaleX, s._scaleY, s._rotation, s._skewX, s._skewY, s._anchorX, s._anchorY);
            }
            if (UI.UM) {
                s.cMatrix.setFrom(s._matrix);
                if (s.parent) {
                    s.cMatrix.prepend(s.parent.cMatrix);
                }
            }
            if (UI.UA) {
                s.cAlpha = s._alpha;
                if (s.parent) {
                    s.cAlpha *= s.parent.cAlpha;
                }
            }
            if (UI.UF) {
                s.cFilters.length = 0;
                let sf = s._filters;
                if (sf) {
                    let len = sf.length;
                    for (let i = 0; i < len; i++) {
                        s.cFilters.push(sf[i]);
                    }
                }
                if (s.parent){
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
         * 调用此方法将显示对象渲染到屏幕
         * @method render
         * @public
         * @since 1.0.0
         * @param {annie.IRender} renderObj
         * @return {void}
         */
        public render(renderObj: IRender | any): void {
            let s = this;
            let cf = s.cFilters;
            let cfLen = cf.length;
            let fId = -1;
            if (cfLen) {
                for (let i = 0; i < cfLen; i++) {
                    if (s.cFilters[i].type == "Shadow") {
                        fId = i;
                        break;
                    }
                }
            }
            if (fId >= 0) {
                let ctx: any = renderObj["_ctx"];
                ctx.shadowBlur = cf[fId].blur;
                ctx.shadowColor = cf[fId].color;
                ctx.shadowOffsetX = cf[fId].offsetX;
                ctx.shadowOffsetY = cf[fId].offsetY;
                renderObj.draw(s);
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            } else {
                renderObj.draw(s);
            }
        }

        /**
         * 获取或者设置显示对象在父级里的x方向的宽，不到必要不要用此属性获取高
         * 如果你要同时获取款高，建议使用getWH()方法获取宽和高
         * @property  width
         * @public
         * @since 1.0.3
         * @return {number}
         */
        public get width(): number {
            return this.getWH().width;
        }

        public set width(value: number) {
            let s = this;
            let w = s.width;
            if (value > 0 && w > 0) {
                let sx = value / w;
                s.scaleX *= sx;
            }
        }

        /**
         * 获取或者设置显示对象在父级里的y方向的高,不到必要不要用此属性获取高
         * 如果你要同时获取款高，建议使用getWH()方法获取宽和高
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
            if (value > 0 && h > 0) {
                let sy = value / h;
                s.scaleY *= sy;
            }
        }

        /**
         * 如果需要同时获取宽和高的值，建议使用此方法更有效率
         * @method getWH
         * @public
         * @return {{width: number, height: number}}
         * @since 1.0.9
         */
        public getWH(): { width: number, height: number } {
            let s = this;
            s.update();
            let dr = s.getDrawRect();
            return {width: dr.width, height: dr.height};
        }

        //画缓存位图的时候需要使用
        //<h4><font color="red">小游戏不支持 小程序不支持</font></h4>
        public static _canvas: any = window.document.createElement("canvas");

        // 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
        protected _texture: any = null;

        protected _offsetX: number = 0;

        protected _offsetY: number = 0;

        protected _bounds: Rectangle = new Rectangle();

        protected _drawRect: Rectangle = new Rectangle();

        //设置属性
        protected _setProperty(property: string, value: any, type: number) {
            let s: any = this;
            if (s[property] != value) {
                s[property] = value;
                let UI = s._UI;
                if (type == 0) {
                    UI.UM = true;
                } else if (type == 1) {
                    UI.UA = true;
                } else if (type == 2) {
                    UI.UF = true;
                } else if (type == 3) {
                    UI.UD = true;
                }
            }
        }

        /**
         * 停止这个显示对象上的所有声音
         * @method stopAllSounds
         * @public
         * @since 2.0.0
         * @return {void}
         */
        public stopAllSounds(): void {
            let sounds = this.soundList;
            if (sounds) {
                for (let i = sounds.length - 1; i >= 0; i--) {
                    sounds[i].stop();
                }
            }
        }
        /**
         * @method getSound
         * @param {number|string} id
         * @return {Array} 这个对象里所有叫这个名字的声音引用数组
         * @since 2.0.0
         */
        public getSound(id: any): any {
            let sounds = this.soundList;
            let newSounds: any = [];
            if (sounds) {
                if (typeof(id) == "string") {
                    for (let i = sounds.length - 1; i >= 0; i--) {
                        if (sounds[i].name == id) {
                            newSounds.push(sounds[i]);
                        }
                    }
                } else {
                    if (id >= 0 && id < sounds.length) {
                        newSounds.push(sounds[id]);
                    }
                }
            }
            return newSounds;
        }

        /**
         * 当前对象包含的声音列表
         * @property soundList
         * @public
         * @since 2.0.0
         * @type {Array}
         * @default []
         */
        public soundList: any = [];

        /**
         * 返回一个id，这个id你要留着作为删除他时使用。
         * 这个声音会根据这个显示对象添加到舞台时播放，移出舞台而关闭
         * @method addSound
         * @param {annie.Sound} sound
         * @return {void}
         * @since 2.0.0
         * @public
         */
        public addSound(sound: annie.Sound): void {
            let s = this;
            if (!s.soundList) {
                s.soundList = [];
            }
            let sounds = s.soundList;
            sounds.push(sound);
        }
        /**
         * 删除一个已经添加进来的声音
         * @method removeSound
         * @public
         * @since 2.0.0
         * @param {number|string} id
         * @return {void}
         */
        public removeSound(id: number | string): void {
            let sounds = this.soundList;
            if (sounds) {
                if (typeof(id) == "string") {
                    for (let i = sounds.length - 1; i >= 0; i--) {
                        if (sounds[i].name == "id") {
                            sounds.splice(id, 1);
                        }
                    }
                } else {
                    if (id >= 0 && id < sounds.length) {
                        sounds.splice(id, 1);
                    }
                }
            }
        }

        //每个Flash文件生成的对象都有一个自带的初始化信息
        private _a2x_res_obj: any = {};
        public destroy(): void {
            //清除相应的数据引用
            let s:any = this;
            s.stopAllSounds();
            for(let i=0;i<s.soundList.length;i++){
                s.soundList[i].destroy();
            }
            s._a2x_res_obj = null;
            s.mask = null;
            s.filters = null;
            s.parent = null;
            s.stage = null;
            s._bounds = null;
            s._drawRect = null;
            s._dragBounds = null;
            s._lastDragPoint = null;
            s.cFilters = null;
            s._matrix = null;
            s.cMatrix = null;
            s._UI = null;
            s._texture = null;
            s._visible=false;
            super.destroy();
        }
        //更新流程走完之后再执行脚本和事件执行流程
        protected callEventAndFrameScript(callState: number):void {
            let s: any = this;
            if (!s.stage) return;
            let sounds = s.soundList;
            if (callState == 0) {
                s.dispatchEvent(annie.Event.REMOVE_TO_STAGE);
                //如果有音乐,则关闭音乐
                if (sounds.length > 0) {
                    for (let i = 0; i < sounds.length; i++) {
                        sounds[i].stop2();
                    }
                }
            } else {
                if (callState == 1){
                    //如果有音乐，则播放音乐
                    if (sounds.length > 0) {
                        for (let i = 0; i < sounds.length; i++) {
                            sounds[i].play2();
                        }
                    }
                    s.dispatchEvent(annie.Event.ADD_TO_STAGE);
                }
                if(s._visible)
                s.dispatchEvent(annie.Event.ENTER_FRAME);
            }
        }
    }
}