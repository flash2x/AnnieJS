/**
 * @module annie
 */
namespace annie {
    /**
     * 显示对象的容器类,可以将其他显示对象放入其中,是annie引擎的核心容器类.
     * Sprite 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。
     * Sprite 对象与影片剪辑类似，但没有时间轴。Sprite 是不需要时间轴的对象的相应基类。
     * 例如，Sprite 将是通常不使用时间轴的用户界面 (UI) 组件的逻辑基类
     * @class annie.Sprite
     * @extends annie.DisplayObject
     * @public
     * @since 1.0.0
     */
    export class Sprite extends DisplayObject {
        /**
         * 构造函数
         * @method Sprite
         * @public
         * @since 1.0.0
         */
        public constructor() {
            super();
            let s = this;
            s._instanceType = "annie.Sprite";
            s.hitTestWithPixel=true;
        }

        public destroy(): void {
            let s: any = this;
            //让子级也destroy
            for (let i = 0; i < s.children.length; i++) {
                s.children[i].destroy();
            }
            if (s.parent instanceof annie.Sprite) Sprite._removeFormParent(s.parent, s);
            s.children = null;
            s._hitArea = null;
            super.destroy();
        }

        /**
         * 容器类所有动画的播放速度，默认是1.如果有嵌套的话，速度相乘；
         * @property mcSpeed
         * @public
         * @type {number}
         * @since 3.1.5
         * @default 1
         *
         */
        public mcSpeed: number = 1;
        protected _cMcSpeed: number = 1;
        /**
         * 是否可以让children接收鼠标事件
         * 鼠标事件将不会往下冒泡
         * @property mouseChildren
         * @type {boolean}
         * @default true
         * @public
         * @since 1.0.0
         */
        public mouseChildren: boolean = true;
        /**
         * 显示对象的child列表
         * @property children
         * @type {Array}
         * @public
         * @since 1.0.0
         * @default []
         * @readonly
         */
        public children: DisplayObject[] = [];

        /**
         * 添加一个显示对象到Sprite
         * @method addChild
         * @param {annie.DisplayObject} child
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public addChild(child: DisplayObject): void {
            this.addChildAt(child, this.children.length);
        }

        /**
         * 从Sprite中移除一个child
         * @method removeChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         * @return {void}
         */
        public removeChild(child: DisplayObject): void {
            let s = this;
            let len = s.children.length;
            for (let i = 0; i < len; i++) {
                if (s.children[i] == child) {
                    s.removeChildAt(i);
                    break;
                }
            }
        }

        //全局遍历查找
        private static _getElementsByName(rex: RegExp, root: annie.Sprite, isOnlyOne: boolean, isRecursive: boolean, resultList: Array<annie.DisplayObject>): void {
            let len = root.children.length;
            if (len > 0) {
                let name: string;
                let child: any;
                for (let i = 0; i < len; i++) {
                    child = root.children[i];
                    name = child.name;
                    if (name && name != "") {
                        if (rex.test(name)) {
                            resultList[resultList.length] = child;
                            if (isOnlyOne) {
                                return;
                            }
                        }
                    }
                    if (isRecursive) {
                        if (child instanceof annie.Sprite) {
                            Sprite._getElementsByName(rex, child, isOnlyOne, isRecursive, resultList);
                        }
                    }
                }
            }
        }

        /**
         * 通过给displayObject设置的名字来获取一个child,可以使用正则匹配查找
         * @method getChildByName
         * @param {string} name 对象的具体名字或是一个正则表达式
         * @param {boolean} isOnlyOne 默认为true,如果为true,只返回最先找到的对象,如果为false则会找到所有匹配的对象数组
         * @param {boolean} isRecursive false,如果为true,则会递归查找下去,而不只是查找当前对象中的child,child里的child也会找,依此类推
         * @return {string|Array} 返回一个对象,或者一个对象数组,没有找到则返回空
         * @public
         * @since 1.0.0
         */
        public getChildByName(name: string | RegExp, isOnlyOne: boolean = true, isRecursive: boolean = false): any {
            if (!name) return null;
            let s = this;
            let rex: any;
            if (typeof(name) == "string") {
                rex = new RegExp("^" + name + "$");
            } else {
                rex = name;
            }
            let elements: Array<annie.DisplayObject> = [];
            Sprite._getElementsByName(rex, s, isOnlyOne, isRecursive, elements);
            let len = elements.length;
            if (len == 0) {
                return null;
            } else if (len == 1) {
                return elements[0];
            } else {
                return elements;
            }
        }

        /**
         * 添加一个child到Sprite中并指定添加到哪个层级
         * @method addChildAt
         * @param {annie.DisplayObject} child
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public addChildAt(child: DisplayObject, index: number): void {
            if (!(child instanceof annie.DisplayObject)) return;
            let s = this;
            let len: number;
            let cp = child.parent;
            if (cp instanceof annie.Sprite) {
                Sprite._removeFormParent(cp, child);
                cp.a2x_uf=true;
            }
            len = s.children.length;
            if (index >= len) {
                s.children[len] = child;
            } else if (index == 0) {
                s.children.unshift(child);
            } else {
                s.children.splice(index, 0, child);
            }
            if (cp != s) {
                child._cp = true;
                child.parent = s;
                if (s._isOnStage && !child._isOnStage) {
                    child.stage = s.stage;
                    child._onAddEvent();
                }
            }
            s.a2x_uf=true;
        }

        private static _removeFormParent(cp: Sprite, child: DisplayObject): void {
            let cpc = cp.children;
            let len = cpc.length;
            for (let i = 0; i < len; i++) {
                if (cpc[i] == child) {
                    cpc.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {annie.DisplayObject}
         */
        public getChildAt(index: number): annie.DisplayObject {
            if ((this.children.length - 1) >= index) {
                return this.children[index];
            } else {
                return null;
            }
        }

        /**
         * 获取Sprite中一个child所在的层级索引，找到则返回索引数，未找到则返回-1
         * @method getChildIndex
         * @param {annie.DisplayObject} child 子对象
         * @public
         * @since 1.0.2
         * @return {number}
         */
        public getChildIndex(child: DisplayObject): number {
            let s = this;
            let len = s.children.length;
            for (let i: number = 0; i < len; i++) {
                if (s.children[i] == child) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * 交换两个显示对象的层级
         * @method swapChild
         * @param child1 显示对象，或者显示对象的索引
         * @param child2 显示对象，或者显示对象的索引
         * @since 2.0.0
         * @return {boolean}
         */
        public swapChild(child1: any, child2: any): boolean {
            let s = this;
            let id1 = -1;
            let id2 = -1;
            let childCount = s.children.length;
            if (typeof(child1) == "number") {
                id1 = child1;
            } else {
                id1 = s.getChildIndex(child1);
            }
            if (typeof(child2) == "number") {
                id2 = child2;
            } else {
                id2 = s.getChildIndex(child2);
            }
            if (id1 == id2 || id1 < 0 || id1 >= childCount || id2 < 0 || id2 >= childCount) {
                return false;
            } else {
                let temp: any = s.children[id1];
                s.children[id1] = s.children[id2];
                s.children[id2] = temp;
                return true;
            }
        }

        /**
         * 移除指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public removeChildAt(index: number): void {
            let s = this;
            let child: DisplayObject;
            let len = s.children.length - 1;
            if (len < 0) return;
            if (index == len) {
                child = s.children.pop();
            } else if (index == 0) {
                child = s.children.shift();
            } else {
                child = s.children.splice(index, 1)[0];
            }
            if (s._isOnStage && child._isOnStage) {
                child._onRemoveEvent(false);
                child.stage = null;
            }
            child.parent = null;
            s.a2x_uf=true;
        }

        /**
         * 如果对容器缓存为位图过,则会更新缓存,没事别乱调用
         * @method updateCache
         * @since 3.2.0
         * @return {void}
         */
        public updateCache(): void {
            this.a2x_uf = true;
        }

        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public removeAllChildren(): void {
            let s = this;
            let len = s.children.length;
            for (let i = len - 1; i >= 0; i--) {
                s.removeChildAt(0);
            }
        }
        public hitTestPoint(hitPoint: Point, isGlobalPoint: boolean = false): DisplayObject {
            let s = this;
            if (!s._visible || !s.mouseEnable) return null;
            if(s._isCache){
                return super.hitTestPoint(hitPoint,isGlobalPoint);
            }
            let p: Point = hitPoint;
            if (!isGlobalPoint) {
                p = s.localToGlobal(hitPoint, new Point());
            }
            let len = s.children.length;
            let hitDisplayObject: DisplayObject;
            let child: any;
            let maskObjList: any = {};
            //这里特别注意是从上往下遍历
            for (let i = len - 1; i >= 0; i--) {
                child = s.children[i];
                if (child._isUseToMask > 0) continue;
                if (child.mask != void 0) {
                    if (maskObjList[child.mask._instanceId] == void 0) {
                        //看看点是否在遮罩内
                        if (child.mask.hitTestPoint(p, true)) {
                            //如果都不在遮罩里面,那还检测什么直接检测下一个
                            maskObjList[child.mask._instanceId] = true;
                        } else {
                            maskObjList[child.mask._instanceId] = false;
                        }
                    }
                    if (maskObjList[child.mask._instanceId] == false) {
                        continue;
                    }
                }
                hitDisplayObject = child.hitTestPoint(p, true);
                if (hitDisplayObject) {
                    return hitDisplayObject;
                }
            }
            return null;
        }

        public getBounds(): Rectangle {
            let s = this;
            let rect: Rectangle = s._bounds;
            rect.x = 0;
            rect.y = 0;
            rect.width = 0;
            rect.height = 0;
            let children: any = s.children, len: number = children.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    if (children[i].visible && children[i]._isUseToMask == 0)
                        children[i].getDrawRect();
                    Rectangle.createFromRects(rect, DisplayObject._transformRect);
                }
            }
            return rect;
        }

        protected _updateMatrix(isOffCanvas: boolean = false): void {
            let s = this;
            if (s._visible) {
                super._updateMatrix(isOffCanvas);
                let children: any = s.children;
                let len: number = children.length;
                for (let i = 0; i < len; i++) {
                    children[i]._updateMatrix(isOffCanvas);
                }
                //所有未缓存的信息还是一如既往的更新,保持信息同步
                if (s.a2x_uf) {
                    s.a2x_uf = false;
                    if (s._isCache) {
                        //更新缓存
                        annie.createCache(s);
                        s._updateSplitBounds();
                        s._checkDrawBounds();
                    }
                }
                if (!isOffCanvas){
                    s.a2x_ua = false;
                    s.a2x_um = false;
                }
            }
        }
        public _render(renderObj: IRender): void {
            let s: any = this;
            if (s._isCache && s.parent) {
                //这里为什么要加上s.parent判断呢，因为离屏渲染也是走的这个方法，显然离屏渲染就是为了生成缓存的，当然就不能直接走缓存这个逻辑
                super._render(renderObj);
            } else {
                let len: number = s.children.length;
                if (s._visible && s._cAlpha > 0 && len > 0) {
                    let children: any = s.children;
                    let ro: any = renderObj;
                    let maskObj: any;
                    let child: any;
                    for (let i = 0; i < len; i++) {
                        child = children[i];
                        if (child._isUseToMask > 0) {
                            continue;
                        }
                        if (maskObj instanceof annie.DisplayObject) {
                            if (child.mask instanceof annie.DisplayObject && child.mask.parent == child.parent) {
                                if (child.mask != maskObj) {
                                    ro.endMask();
                                    maskObj = child.mask;
                                    ro.beginMask(maskObj);
                                }
                            } else {
                                ro.endMask();
                                maskObj = null;
                            }
                        } else {
                            if (child.mask instanceof annie.DisplayObject && child.mask.parent == child.parent) {
                                maskObj = child.mask;
                                ro.beginMask(maskObj);
                            }
                        }
                        child._render(ro);
                    }
                    if (maskObj instanceof annie.DisplayObject) {
                        ro.endMask();
                    }
                }
            }
        }

        public _onRemoveEvent(isReSetMc: boolean): void {
            let s = this;
            let child: any = null;
            //这里用concat 隔离出一个新的children是非常重要的一步
            let children = s.children.concat();
            let len = children.length;
            for (let i = len - 1; i >= 0; i--) {
                child = children[i];
                if (child instanceof annie.DisplayObject && child._isOnStage) {
                    child._onRemoveEvent(isReSetMc);
                    child.stage = null;
                }
            }
            super._onRemoveEvent(isReSetMc);
        }
        public _onAddEvent(): void {
            let s = this;
            let child: any = null;
            //这里用concat 隔离出一个新的children是非常重要的一步
            let children = s.children.concat();
            let len = children.length;
            for (let i = len - 1; i >= 0; i--) {
                child = children[i];
                if (child instanceof annie.DisplayObject && !child._isOnStage) {
                    child.stage = s.stage;
                    child._onAddEvent();
                }
            }
            super._onAddEvent();
        }

        public _onUpdateFrame(mcSpeed: number = 1, isOffCanvas: boolean = false): void {
            let s = this;
            s._cMcSpeed = s.mcSpeed * mcSpeed;
            super._onUpdateFrame(s._cMcSpeed, isOffCanvas);
            let child: any = null;
            let children = s.children.concat();
            let len = children.length;
            for (let i = len - 1; i >= 0; i--) {
                child = children[i];
                if (child) {
                    child._onUpdateFrame(s._cMcSpeed, isOffCanvas);
                }
            }
        }
    }
}