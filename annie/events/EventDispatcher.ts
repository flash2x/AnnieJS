/**
 * @module annie
 */
namespace annie {
    /**
     * annie引擎类的基类
     * @class annie.AObject
     * @since 1.0.0
     */
    export abstract class AObject {
        protected _instanceId: number = 0;
        protected _instanceType: string = "annie.AObject";
        protected static _object_id = 0;

        constructor() {
            this._instanceId = AObject._object_id++;
        }

        /**
         * 每一个annie引擎对象都会有一个唯一的id码。
         * @property instanceId
         * @public
         * @since 1.0.0
         * @type {number}
         * @readonly
         * @example
         *      //获取 annie引擎类对象唯一码
         *      trace(this.instanceId);
         */
        public get instanceId(): number {
            return this._instanceId;
        }

        /**
         * 每一个annie类都有一个实例类型字符串，通过这个字符串，你能知道这个实例是从哪个类实例而来
         * @property instanceType
         * @since 1.0.3
         * @public
         * @type {string}
         * @readonly
         */
        public get instanceType(): string {
            return this._instanceType;
        }

        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         * @method destroy
         * @since 2.0.0
         * @public
         * @return {void}
         */
        abstract destroy(): void;

        /**
         * 批量设置属性
         * @property valueMap 键值对
         * @public
         * @since 2.0.0
         * @type {any}
         */
        attrs(valueMap: any) {
            let s: any = this;
            if (valueMap) {
                for (let key in valueMap) {
                    s[key] = valueMap[key];
                }
            }
        }
    }

    /**
     * 事件触发基类
     * @class annie.EventDispatcher
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class EventDispatcher extends AObject {
        protected eventTypes: any = {};
        protected eventTypes1: any = {};

        public constructor() {
            super();
            this._instanceType = "annie.EventDispatcher";
        }

        /**
         * 全局的鼠标事件的监听数对象表
         * @property _MECO
         * @private
         * @since 1.0.0
         */

        private static _MECO: any = {};
        public static _totalMEC: number = 0;

        /**
         * 看看有多少mouse或者touch侦听数
         * @method getMouseEventCount
         * @return {number}
         * @static
         * @private
         * @since 1.0.0
         * @param {string} type 获取事件类型，默认是所有
         */
        public static getMouseEventCount(type: string = ""): number {
            let count: number = 0;
            if (type == "") {
                //返回所有鼠标事件数
                for (let item in EventDispatcher._MECO) {
                    if (item.indexOf("onMouse") == 0) {
                        count += EventDispatcher._MECO[item];
                    }
                }
            } else {
                if (EventDispatcher._MECO[type]) {
                    count = EventDispatcher._MECO[type];
                }
            }
            return count;
        }

        private listenerExist(eventTypes: any, listener: Function) {
            let exist = false;
            eventTypes.some((item: any) => {
                if (item.listener == listener) {
                    exist = true;
                    return true;
                }
            });
            return exist;
        }

        /**
         * 给对象添加一个侦听
         * @method addEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {void}
         * @example
         *      this.addEventListener(annie.Event.ADD_TO_STAGE,function(e){trace(this);}.bind(this));
         */
        public addEventListener(type: string, listener: Function, useCapture = true): void {
            if (!type) {
                throw new Error("添加侦听的type值为undefined");
            }
            if (!listener) {
                throw new Error("侦听回调函数不能为null");
            }
            let s = this;
            let eventTypes = s.eventTypes;
            if (!useCapture) {
                eventTypes = s.eventTypes1;
            }
            if (!eventTypes[type]) {
                eventTypes[type] = [];
            }
            if (!this.listenerExist(eventTypes[type], listener)) {
                eventTypes[type].unshift({listener});
                if (type.indexOf("onMouse") == 0) {
                    s._changeMouseCount(type, true);
                }
            }
        }

        /**
         * 给对象添加一个单次侦听
         * @method once
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {void}
         * @example
         *      this.once(annie.Event.ADD_TO_STAGE,function(e){trace(this);}.bind(this));
         */
        public once(type: string, listener: Function, useCapture = true): void {
            if (!type) {
                throw new Error("添加侦听的type值为undefined");
            }
            if (!listener) {
                throw new Error("侦听回调函数不能为null");
            }
            let s = this;
            let eventTypes = s.eventTypes;
            if (!useCapture) {
                eventTypes = s.eventTypes1;
            }
            if (!eventTypes[type]) {
                eventTypes[type] = [];
            }
            if (!this.listenerExist(eventTypes[type], listener)) {
                eventTypes[type].unshift({listener, once: true});
                if (type.indexOf("onMouse") == 0) {
                    s._changeMouseCount(type, true);
                }
            }
        }

        /**
         * 增加或删除相应mouse或touch侦听记数
         * @method _changeMouseCount
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} isAdd
         * @return {void}
         */
        private _changeMouseCount(type: string, isAdd: boolean): void {
            let count = isAdd ? 1 : -1;
            if (!EventDispatcher._MECO[type]) {
                EventDispatcher._MECO[type] = 0;
            }
            EventDispatcher._MECO[type] += count;
            if (EventDispatcher._MECO[type] < 0) {
                EventDispatcher._MECO[type] = 0;
            }
            EventDispatcher._totalMEC += count;
        }

        private _defaultEvent: annie.Event;

        /**
         * 广播侦听
         * @method dispatchEvent
         * @public
         * @since 1.0.0
         * @param {annie.Event|string} event 广播所带的事件对象,如果传的是字符串则直接自动生成一个的事件对象,事件类型就是你传入进来的字符串的值
         * @param {Object} data 广播后跟着事件一起传过去的其他任信息,默认值为null
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {boolean} 如果有收听者则返回true
         * @example
         *      var mySprite=new annie.Sprite(),
         *          yourEvent=new annie.Event("yourCustomerEvent");
         *       yourEvent.data='false2x';
         *       mySprite.addEventListener("yourCustomerEvent",function(e){
         *          trace(e.data);
         *        })
         *       mySprite.dispatchEvent(yourEvent);
         */
        public dispatchEvent(event: any, data: any = null, useCapture = true): boolean {
            let s = this;
            if (typeof(event) == "string") {
                if (!s._defaultEvent) {
                    s._defaultEvent = new annie.Event(event);
                } else {
                    s._defaultEvent.reset(event, s);
                }
                event = s._defaultEvent;
            }
            let listeners = s.eventTypes[event.type];
            if (!useCapture) {
                listeners = s.eventTypes1[event.type];
            }
            if (listeners) {
                let len = listeners.length;
                if (event.target == null) {
                    event.target = s;
                }
                if (data != null) {
                    event.data = data;
                }
                for (let i = len - 1; i >= 0; i--) {
                    if (!event["_pd"]) {
                        if (listeners[i]) {
                            let {listener, once} = listeners[i];
                            listener(event);
                            if (once) {
                                listeners.splice(i, 1);
                            }
                        } else {
                            listeners.splice(i, 1);
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        /**
         * 是否有添加过此类形的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {boolean} 如果有则返回true
         */
        public hasEventListener(type: string, useCapture = true): boolean {
            let s = this;
            if (useCapture) {
                if (s.eventTypes[type] && s.eventTypes[type].length > 0) {
                    return true
                }
            } else {
                if (s.eventTypes1[type] && s.eventTypes1[type].length > 0) {
                    return true
                }
            }
            return false;
        }

        /**
         * 移除对应类型的侦听
         * @method removeEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 要移除的侦听类型
         * @param {Function} listener 及侦听时绑定的回调方法
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {void}
         */
        public removeEventListener(type: string, listener: Function, useCapture = true): void {
            let s = this;
            let listeners = s.eventTypes[type];
            if (!useCapture) {
                listeners = s.eventTypes1[type];
            }
            if (listeners) {
                let len = listeners.length;
                for (let i = len - 1; i >= 0; i--) {
                    if (listeners[i].listener === listener) {
                        listeners.splice(i, 1);
                        if (type.indexOf("onMouse") == 0) {
                            s._changeMouseCount(type, false);
                        }
                    }
                }
            }
        }

        /**
         * 移除对象中所有的侦听
         * @method removeAllEventListener
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public removeAllEventListener(): void {
            let s = this;
            for (let type in s.eventTypes) {
                if (type.indexOf("onMouse") == 0) {
                    for (let j = 0; j < s.eventTypes[type].length; j++) {
                        s._changeMouseCount(type, false);
                    }
                }
            }
            for (let type in s.eventTypes1) {
                if (type.indexOf("onMouse") == 0) {
                    for (let j = 0; j < s.eventTypes1[type].length; j++) {
                        s._changeMouseCount(type, false);
                    }
                }
            }
            s.eventTypes1 = {};
            s.eventTypes = {};
        }

        destroy(): void {
            let s = this;
            s.removeAllEventListener();
            s.eventTypes = null;
        }
    }
}