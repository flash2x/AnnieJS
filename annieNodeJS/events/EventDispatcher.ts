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
         *      console.log(this.instanceId);
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
         * 销毁之前一定要做完其他善后工作，否则有可能会出错
         * 特别注意不能在对象自身方法或事件里调用此方法。
         * 比如，不要在显示对象自身的 annie.Event.ON_REMOVE_TO_STAGE 或者其他类似事件调用，一定会报错
         * @method destroy
         * @since 2.0.0
         * @public
         * @return {void}
         */
        public destroy(): void{}
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

        //全局的鼠标事件的监听数对象表
        private static _MECO: any = {};
        public static _totalMEC: number = 0;
        /**
         * 给对象添加一个侦听
         * @method addEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类型
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {void}
         * @example
         *      this.addEventListener(annie.Event.ADD_TO_STAGE,function(e){console.log(this);}.bind(this));
         */
        public addEventListener(type: string, listener: Function,useCapture = true): void {
            if (!type) {
                throw new Error("添加侦听的type值为undefined");
            }
            if (!listener) {
                throw new Error("侦听回调函数不能为null");
            }
            let s = this;
            let eventTypes=s.eventTypes;
            if(!useCapture){
                eventTypes=s.eventTypes1;
            }
            if (!(eventTypes[type] instanceof Object)) {
                eventTypes[type] = [];
            }
            if (eventTypes[type].indexOf(listener) < 0) {
                eventTypes[type].unshift(listener);
            }
        }
        private _defaultEvent: annie.Event;

        /**
         * 广播侦听
         * @method dispatchEvent
         * @public
         * @since 1.0.0
         * @param {annie.Event|string} event 广播所带的事件对象,如果传的是字符串则自动生成一个annie.Event对象,事件类型就是传入进来的字符串的值
         * @param {Object} data 广播后跟着事件一起传过去的其他任信息,默认值为null
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {boolean} 如果有收听者则返回true
         * @example
         *      var mySprite=new annie.Sprite(),
         *      yourEvent=new annie.Event("yourCustomerEvent");
         *      yourEvent.data={a:1,b:2,c:"hello",d:{aa:1,bb:2}};
         *      mySprite.addEventListener("yourCustomerEvent",function(e){
         *          console.log(e.data);
         *      })
         *      mySprite.dispatchEvent(yourEvent);
         */
        public dispatchEvent(event: any, data: any = null,useCapture = true): boolean {
            let s = this;
            if (typeof(event) == "string") {
                if (s._defaultEvent instanceof annie.Event) {
                    s._defaultEvent.reset(event, s);
                } else {
                    s._defaultEvent = new annie.Event(event);
                }
                event = s._defaultEvent;
            }
            let listeners = s.eventTypes[event.type];
            if(!useCapture){
                listeners=s.eventTypes1[event.type];
            }
            if (listeners instanceof Array) {
                if (!(event.target instanceof Object)) {
                    event.target = s;
                }
                if(data!=void 0) {
                    event.data = data;
                }
                let len = listeners.length;
                for (let i = len - 1; i >= 0; i--) {
                    if(!event._pd){
                        if (listeners[i] instanceof Function) {
                            listeners[i](event);
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
         * 是否有添加过此类型的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类型
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {boolean} 如果有则返回true
         */
        public hasEventListener(type: string, useCapture = true): boolean {
            let s = this;
            if (useCapture) {
                if (s.eventTypes&&s.eventTypes[type] instanceof Array && s.eventTypes[type].length > 0) {
                    return true
                }
            } else {
                if (s.eventTypes1&&s.eventTypes1[type] instanceof Array && s.eventTypes1[type].length > 0) {
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
         * @param {Function} listener 侦听时绑定的回调方法
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {void}
         */
        public removeEventListener(type: string, listener: Function,useCapture = true): void {
            let s = this;
            let listeners = s.eventTypes[type];
            if(!useCapture){
                listeners=s.eventTypes1[type];
            }
            if (listeners instanceof Array) {
                let len = listeners.length;
                for (let i = len - 1; i >= 0; i--) {
                    if (listener==void 0||listeners[i] == listener) {
                        listeners.splice(i, 1);
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
        public removeAllEventListener():void {
            let s = this;
            s.eventTypes1 = {};
            s.eventTypes = {};
        }

        /**
         *
         */
        public destroy(): void {
            let s:any=this;
            s.removeAllEventListener();
            s.eventTypes1=null;
            s.eventTypes=null;
            s._defaultEvent=null;
        }
    }
}