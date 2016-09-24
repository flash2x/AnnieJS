/**
 * @module annie
 */
namespace annie {
    /**
     * annie引擎类的基类
     * @class annie.AObject
     */
    export class AObject {
        private _id:number = 0;
        private static _object_id = 0;
        public constructor(){
            this._id = AObject._object_id++;
        }
        /**
         * 每一个annie引擎对象都会有一个唯一的id码。
         * @method getInstanceId
         * @public
         * @since 1.0.0
         * @returns {number}
         */
        public getInstanceId():number {
            return this._id;
        }
    }
    /**
     * 事件触发类
     * @class annie.EventDispatcher
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class EventDispatcher extends AObject {
        private eventTypes:any = null;
        public constructor() {
            super();
            this.eventTypes = {};
        }

        /**
         * 全局的鼠标事件的监听数对象表
         * @property _MECO
         * @public
         * @since 1.0.0
         */

        private static _MECO:any={};
        /**
         * 看看有多少mouse或者touch侦听数
         * @method getMouseEventCount
         * @returns {number}
         * @static
         * @private
         * @since 1.0.0
         * @param {string} type 获取事件类型，默认是所有
         */
        public static getMouseEventCount(type:string=""):number{
            var count:number=0;
            if(type==""){
                //返回所有鼠标事件数
                for(var item in EventDispatcher._MECO){
                    count+=EventDispatcher._MECO[item];
                }
            }else {
                if (EventDispatcher._MECO[type]){
                    count=EventDispatcher._MECO[type];
                }
            }
            return count;
        }
        /**
         * 给对象添加一个侦听
         * @method addEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @example
         *      //1.使用类实例方法作为侦听函数:
         *       this.addEventListener(annie.MouseEvent.MOUSE_UP,this.onMouseUp.bind(this));
         *      //2.使用匿名方法作为侦听函数:
         *      this.addEventListener(annie.MouseEvent.MOUSE_UP,function(e){...};
         *      //2.使用有名方法作为侦听函数:t
         *      his.addEventListener(annie.MouseEvent.MOUSE_UP,funName);
         */
        public addEventListener(type:string,listener:Function):void {
            if(!type){
                trace("添加侦听的type值为undefined");
                return;
            }
            var s=this;
            if (!s.eventTypes[type]) {
                s.eventTypes[type] = [];
            }
            if(s.eventTypes[type].indexOf(listener)<0){
                s.eventTypes[type].push(listener);
                s._changeMouseCount(type,true);
            }
        }
        /**
         * 增加或删除相应mouse或touch侦听记数
         * @method _changeMouseCount
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} isAdd
         */
        private _changeMouseCount(type:string,isAdd:boolean):void{
            var count=-1;
            if(isAdd){
                count=1;
            }
            if(!EventDispatcher._MECO[type]){
                EventDispatcher._MECO[type]=0;
            }
            EventDispatcher._MECO[type]+=count;
        }
        /**
         * 广播侦听
         * @method dispatchEvent
         * @public
         * @since 1.0.0
         * @param {annie.Event|string} event 广播所带的事件对象,如果传的是字符串则直接自动生成一个的事件对象,事件类型就是你传入进来的字符串的值
         * @param {Object} data 广播后跟着事件一起传过去的其他任信息,默认值为null
         * @returns {boolean} 如果有收听者则返回true
         */
        public dispatchEvent(event:any,data:any=null):boolean {
            var s = this;
            if(typeof(event)=="string"){
                event=new annie.Event(event);
            }
            var listeners = s.eventTypes[event.type];
            if (listeners) {
                var len = listeners.length;
                if(event.target==null) {
                    event.target = s;
                }
                if(data!=null){
                    event.data=data;
                }
                for (var i = 0; i < len; i++) {
                    listeners[i](event);
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
         * @returns {boolean} 如果有则返回true
         */
        public hasEventListener(type:string):boolean {
            if (this.eventTypes[type]) {
                return true
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
         */
        public removeEventListener(type:string,listener:Function):void{
            var s=this;
            var listeners = s.eventTypes[type];
            if (listeners) {
                var len = listeners.length;
                for (var i = len - 1; i >= 0; i--) {
                    if(listeners[i] === listener){
                        listeners.splice(i, 1);
                        if(type.indexOf("onMouse")==0) {
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
         */
        public removeAllEventListener() {
            var s=this;
            for(var type in s.eventTypes){
                if(type.indexOf("onMouse")==0) {
                    for(var j=0;j<s.eventTypes[type].length;j++){
                        s._changeMouseCount(type,false);
                    }
                }
            }
            s.eventTypes = {};
        }
    }
}