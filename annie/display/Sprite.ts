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
        }

        public destroy(): void {
            let s: any = this;
            //让子级也destroy
            for (let i = 0; i < s.children.length; i++) {
                s.children[i].destroy();
            }
            s.removeAllChildren();
            if (s._parent) s._parent.removeChild(s);
            s.callEventAndFrameScript(0);
            s.children.length = 0;
            s._removeChildren.length = 0;
            super.destroy();
        }

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
        public _removeChildren: DisplayObject[] = [];

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
                        if (child["children"] != null) {
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
            if (!child) return;
            let s = this;
            let sameParent = (s == child.parent);
            let cp = child.parent;
            let len: number;
            if (cp) {
                if (!sameParent) {
                    let cpc = cp.children;
                    len = cpc.length;
                    let isRemove = true;
                    for (let i = 0; i < len; i++) {
                        if (cpc[i] == child) {
                            cpc.splice(i, 1);
                            isRemove = false;
                            break;
                        }
                    }
                    if (isRemove) {
                        let cpc = cp._removeChildren;
                        len = cpc.length;
                        for (let i = 0; i < len; i++) {
                            if (cpc[i] == child) {
                                cpc.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    len = s.children.length;
                    for (let i = 0; i < len; i++) {
                        if (s.children[i] == child) {
                            s.children.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            len = s.children.length;
            if (index >= len) {
                s.children[s.children.length] = child;
            } else if (index == 0) {
                s.children.unshift(child);
            } else {
                s.children.splice(index, 0, child);
            }
            if (cp != s) {
                child["_cp"] = true;
                child.parent = s;
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
            let child: any;
            let len = s.children.length - 1;
            if (len < 0) return;
            if (index == len) {
                child = s.children.pop();
            } else if (index == 0) {
                child = s.children.shift();
            } else {
                child = s.children.splice(index, 1)[0];
            }
            s._removeChildren.push(child);
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

        public update(isDrawUpdate: boolean = true): void {
            let s: any = this;
            if (!s._visible) return;
            let um: boolean = s._UI.UM;
            let ua: boolean = s._UI.UA;
            let uf: boolean = s._UI.UF;
            super.update(isDrawUpdate);
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
            let len = s.children.length;
            let child: any = null;
            for (let i = len - 1; i >= 0; i--) {
                child = s.children[i];
                if (um) {
                    child._UI.UM = um;
                }
                if (uf) {
                    child._UI.UF = uf;
                }
                if (ua) {
                    child._UI.UA = ua;
                }
                child.update(isDrawUpdate);
            }
        }

        public hitTestPoint(hitPoint: Point, isGlobalPoint: boolean = false, isMustMouseEnable: boolean = false): DisplayObject {
            let s = this;
            if (!s.visible || (!s.mouseEnable && isMustMouseEnable)) return null;
            let len = s.children.length;
            let hitDisplayObject: DisplayObject;
            let child: any;
            //这里特别注意是从上往下遍历
            for (let i = len - 1; i >= 0; i--) {
                child = s.children[i];
                if (child._isUseToMask > 0) continue;
                if (child.mask && child.mask.parent == child.parent) {
                    //看看点是否在遮罩内
                    if (!child.mask.hitTestPoint(hitPoint, isGlobalPoint, isMustMouseEnable)) {
                        //如果都不在遮罩里面,那还检测什么直接检测下一个
                        continue;
                    }
                }
                hitDisplayObject = child.hitTestPoint(hitPoint, isGlobalPoint, isMustMouseEnable);
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
            let len: number = s.children.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    if (s.children[i].visible)
                        Rectangle.createFromRects(rect, s.children[i].getDrawRect());
                }
                if (s.mask && s.mask.parent == s.parent) {
                    let maskRect = s.mask.getDrawRect();
                    if (rect.x < maskRect.x) {
                        rect.x = maskRect.x;
                    }
                    if (rect.y < maskRect.y) {
                        rect.y = maskRect.y;
                    }
                    if (rect.width > maskRect.width) {
                        rect.width = maskRect.width
                    }
                    if (rect.height > maskRect.height) {
                        rect.height = maskRect.height
                    }
                }
            }
            return rect;
        }

        public render(renderObj: IRender): void {
            let s: any = this;
            if (s._cp || !s._visible) return;
            if (s._cacheAsBitmap) {
                super.render(renderObj);
            } else {
                if (s.cAlpha > 0 && s._visible) {
                    let maskObj: any;
                    let child: any;
                    let len: number = s.children.length;
                    for (let i = 0; i < len; i++) {
                        child = s.children[i];
                        if (child._isUseToMask > 0) continue;
                        if (child.cAlpha > 0 && child._visible) {
                            if (maskObj) {
                                if (child.mask && child.mask.parent == child.parent) {
                                    if (child.mask != maskObj) {
                                        renderObj.endMask();
                                        maskObj = child.mask;
                                        renderObj.beginMask(maskObj);
                                    }
                                } else {
                                    renderObj.endMask();
                                    maskObj = null;
                                }
                            } else {
                                if (child.mask && child.mask.parent == child.parent) {
                                    maskObj = child.mask;
                                    renderObj.beginMask(maskObj);
                                }
                            }
                            child.render(renderObj);
                        }
                    }
                    if (maskObj) {
                        renderObj.endMask();
                    }
                }
            }
        }
        protected callEventAndFrameScript(callState: number): void {
            let s = this;
            super.callEventAndFrameScript(callState);
            let child: any = null;
            let children: any = null;
            let len = 0;
            if (callState == 0) {
                //上级被移除了，这一层上的所有元素都要执行移除事件
                children = s._removeChildren;
                len = children.length;
                for (let i = len - 1; i >= 0; i--) {
                    child = children[i];
                    child.callEventAndFrameScript(callState);
                    child.stage = null;
                    child.parent = null;
                }
                children = s.children;
                len = children.length;
                for (let i = len - 1; i >= 0; i--) {
                    child = children[i];
                    child.callEventAndFrameScript(callState);
                    child.stage = null;
                }
            } else if (callState == 1) {
                //上级被添加到舞台了,所有在舞台上的元素都要执行添加事件
                children = s.children;
                len = children.length;
                for (let i = len - 1; i >= 0; i--) {
                    child = children[i];
                    child.stage = s.stage;
                    child.parent = s;
                    child.callEventAndFrameScript(callState);
                }
            } else if (callState == 2) {
                //上级没有任何变化，执行对应的移除事件和添加事件
                children = s._removeChildren;
                len = children.length;
                for (let i = len - 1; i >= 0; i--) {
                    child = children[i];
                    child.callEventAndFrameScript(0);
                    child.stage = null;
                    child.parent = null;
                }
                children = s.children;
                len = children.length;
                for (let i = len - 1; i >= 0; i--) {
                    child = children[i];
                    if (child.stage) {
                        child.callEventAndFrameScript(2);
                    } else {
                        child.stage = s.stage;
                        child.parent = s;
                        child.callEventAndFrameScript(1);
                    }
                }
            }
            s._removeChildren.length = 0;
        }
    }
}