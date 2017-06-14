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
        public constructor() {
            super();
            this._instanceType = "annie.Sprite";
        }

        /**
         * 是否可以让children接收鼠标事件,如果为false
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

        //全局遍历
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
                            resultList.push(child);
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
         * @returns {any} 返回一个对象,或者一个对象数组,没有找到则返回空
         * @public
         * @since 1.0.0
         */
        public getChildByName(name: string | RegExp, isOnlyOne: boolean = true, isRecursive: boolean = false): any {
            if (!name)return null;
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
         * @pubic
         * @since 1.0.0
         */
        public addChildAt(child: DisplayObject, index: number): void {
            if(!child)return;
            let s = this;
            let sameParent = (s == child.parent);
            let len: number;
            if (child.parent) {
                if (!sameParent) {
                    child.parent.removeChild(child);
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
            child.parent = s;
            len = s.children.length;
            if (index >= len) {
                s.children.push(child);
            } else if (index == 0) {
                s.children.unshift(child);
            } else {
                s.children.splice(index, 0, child);
            }
            if (s.stage && !sameParent) {
                child["_cp"] = true;
                child._onDispatchBubbledEvent("onAddToStage");
            }
        }

        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @pubic
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
         * @pubic
         * @since 1.0.2
         * @return {number}
         */
        public getChildIndex(child: DisplayObject): number {
            let len = this.children.length;
            for (let i: number = 0; i < len; i++) {
                if (this.children[i] == child) {
                    return i;
                }
            }
            return -1;
        }
        /**
         * 调用此方法对Sprite及其child触发一次指定事件
         * @method _onDispatchBubbledEvent
         * @private
         * @param {string} type
         * @param {boolean} updateMc 是否更新movieClip时间轴信息
         * @since 1.0.0
         */
        public _onDispatchBubbledEvent(type: string, updateMc: boolean = false): void {
            let s = this;
            let len = s.children.length;
            if (type == "onRemoveToStage"&&!s.stage)return;
            s.stage = s.parent.stage;
            for (let i = 0; i < len; i++) {
                s.children[i]._onDispatchBubbledEvent(type, updateMc);
            }
            super._onDispatchBubbledEvent(type, updateMc);
        }

        /**
         * 移除指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         */
        public removeChildAt(index: number): void {
            let s = this;
            let child: any;
            let len = s.children.length - 1;
            if (len < 0)return;
            if (index == len) {
                child = s.children.pop();
            } else if (index == 0) {
                child = s.children.shift();
            } else {
                child = s.children.splice(index, 1)[0];
            }
            child._onDispatchBubbledEvent("onRemoveToStage");
            child.parent = null;
        }

        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         */
        public removeAllChildren(): void {
            let s = this;
            let len = s.children.length;
            for (let i = len - 1; i >= 0; i--) {
                s.removeChildAt(0);
            }
        }

        /**
         * 重写刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        public update(um: boolean, ua: boolean, uf: boolean): void {
            let s: any = this;
            super.update(um, ua, uf);
            if (s._updateInfo.UM) {
                um = true;
            }
            if (s._updateInfo.UA) {
                ua = true;
            }
            if (s._updateInfo.UF) {
                uf = true;
            }
            let len = s.children.length;
            let child: any;
            let maskObjIds: any = [];
            for (let i = len - 1; i >= 0; i--) {
                child = s.children[i];
                //更新遮罩
                if (child.mask && (maskObjIds.indexOf(child.mask.instanceId) < 0)) {
                    child.mask.parent = s;
                    if (s.totalFrames && child.mask.totalFrames) {
                        child.mask.gotoAndStop(s.currentFrame);
                        //一定要为true
                        child.mask.update(true);
                    } else {
                        child.mask.update(um);
                    }
                    maskObjIds.push(child.mask.instanceId);
                }
                child.update(um, ua, uf);
            }
            s._updateInfo.UM = false;
            s._updateInfo.UA = false;
            s._updateInfo.UF = false;
        }

        /**
         * 重写碰撞测试
         * @method hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        public hitTestPoint(globalPoint: Point, isMouseEvent: boolean = false): DisplayObject {
            let s = this;
            if (!s._visible)return null;
            if (isMouseEvent && !s.mouseEnable)return null;
            let len = s.children.length;
            let hitDisplayObject: DisplayObject;
            let child: any;
            //这里特别注意是从上往下遍历
            for (let i = len - 1; i >= 0; i--) {
                child = s.children[i];
                if (child.mask) {
                    //看看点是否在遮罩内
                    if (!child.mask.hitTestPoint(globalPoint, isMouseEvent)) {
                        //如果都不在遮罩里面,那还检测什么直接检测下一个
                        continue;
                    }
                }
                hitDisplayObject = child.hitTestPoint(globalPoint, isMouseEvent);
                if (hitDisplayObject) {
                    return hitDisplayObject;
                }
            }
            return null;
        }

        /**
         * 重写getBounds
         * @method getBounds
         * @returns {any}
         * @since 1.0.0
         * @public
         */
        public getBounds(): Rectangle {
            let s = this;
            let len: number = s.children.length;
            let rect: Rectangle;
            if (len == 0) {
                rect = new Rectangle();
            } else {
                rect = s.children[0].getDrawRect();
                for (let i = 1; i < len; i++) {
                    rect = Rectangle.createFromRects(rect, s.children[i].getDrawRect());
                }
            }
            return rect;
        }

        /**
         * 重写渲染
         * @method render
         * @param {annie.IRender} renderObj
         * @public
         * @since 1.0.0
         */
        public render(renderObj: IRender): void {
            let s: any = this;
            if(s._cp)return;
            if(s.cAlpha > 0 && s._visible) {
                let maskObj: any;
                let child: any;
                let len: number = s.children.length;
                for (let i = 0; i < len; i++) {
                    child = s.children[i];
                    if (child.cAlpha > 0 && child._visible) {
                        if (maskObj) {
                            if (child.mask) {
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
                            if (child.mask) {
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
}