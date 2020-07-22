var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * annie引擎类的基类
     * @class annie.AObject
     * @since 1.0.0
     */
    var AObject = /** @class */ (function () {
        function AObject() {
            this._instanceId = 0;
            this._instanceType = "annie.AObject";
            this._instanceId = AObject._object_id++;
        }
        Object.defineProperty(AObject.prototype, "instanceId", {
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
            get: function () {
                return this._instanceId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AObject.prototype, "instanceType", {
            /**
             * 每一个annie类都有一个实例类型字符串，通过这个字符串，你能知道这个实例是从哪个类实例而来
             * @property instanceType
             * @since 1.0.3
             * @public
             * @type {string}
             * @readonly
             */
            get: function () {
                return this._instanceType;
            },
            enumerable: true,
            configurable: true
        });
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
        AObject.prototype.destroy = function () { };
        AObject._object_id = 0;
        return AObject;
    }());
    annie.AObject = AObject;
    /**
     * 事件触发基类
     * @class annie.EventDispatcher
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var EventDispatcher = /** @class */ (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            var _this = _super.call(this) || this;
            _this.eventTypes = {};
            _this.eventTypes1 = {};
            _this._instanceType = "annie.EventDispatcher";
            return _this;
        }
        //看看有多少mouse或者touch侦听数
        EventDispatcher.getMouseEventCount = function (type) {
            if (type === void 0) { type = ""; }
            var count = 0;
            if (type == "") {
                //返回所有鼠标事件数
                count = EventDispatcher._totalMEC;
            }
            else {
                if (EventDispatcher._MECO[type]) {
                    count = EventDispatcher._MECO[type];
                }
            }
            return count;
        };
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
        EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
            if (useCapture === void 0) { useCapture = true; }
            if (!type) {
                throw new Error("添加侦听的type值为undefined");
            }
            if (!listener) {
                throw new Error("侦听回调函数不能为null");
            }
            var s = this;
            var eventTypes = s.eventTypes;
            if (!useCapture) {
                eventTypes = s.eventTypes1;
            }
            if (!(eventTypes[type] instanceof Object)) {
                eventTypes[type] = [];
            }
            if (eventTypes[type].indexOf(listener) < 0) {
                eventTypes[type].unshift(listener);
                if (type.indexOf("onMouse") == 0) {
                    s._changeMouseCount(type, true);
                }
            }
        };
        //增加或删除相应mouse或touch侦听记数
        EventDispatcher.prototype._changeMouseCount = function (type, isAdd) {
            var count = isAdd ? 1 : -1;
            if (!EventDispatcher._MECO[type]) {
                EventDispatcher._MECO[type] = 0;
            }
            EventDispatcher._MECO[type] += count;
            if (EventDispatcher._MECO[type] < 0) {
                EventDispatcher._MECO[type] = 0;
            }
            EventDispatcher._totalMEC += count;
        };
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
        EventDispatcher.prototype.dispatchEvent = function (event, data, useCapture) {
            if (data === void 0) { data = null; }
            if (useCapture === void 0) { useCapture = true; }
            var s = this;
            if (typeof (event) == "string") {
                if (s._defaultEvent instanceof annie.Event) {
                    s._defaultEvent.reset(event, s);
                }
                else {
                    s._defaultEvent = new annie.Event(event);
                }
                event = s._defaultEvent;
            }
            var listeners = s.eventTypes[event.type];
            if (!useCapture) {
                listeners = s.eventTypes1[event.type];
            }
            if (listeners instanceof Array) {
                if (!(event.target instanceof Object)) {
                    event.target = s;
                }
                if (data != void 0) {
                    event.data = data;
                }
                var len = listeners.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (!event._pd) {
                        if (listeners[i] instanceof Function) {
                            listeners[i](event);
                        }
                        else {
                            listeners.splice(i, 1);
                        }
                    }
                }
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * 是否有添加过此类型的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类型
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {boolean} 如果有则返回true
         */
        EventDispatcher.prototype.hasEventListener = function (type, useCapture) {
            if (useCapture === void 0) { useCapture = true; }
            var s = this;
            if (useCapture) {
                if (s.eventTypes && s.eventTypes[type] instanceof Array && s.eventTypes[type].length > 0) {
                    return true;
                }
            }
            else {
                if (s.eventTypes1 && s.eventTypes1[type] instanceof Array && s.eventTypes1[type].length > 0) {
                    return true;
                }
            }
            return false;
        };
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
        EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
            if (useCapture === void 0) { useCapture = true; }
            var s = this;
            var listeners = s.eventTypes[type];
            if (!useCapture) {
                listeners = s.eventTypes1[type];
            }
            if (listeners instanceof Array) {
                var len = listeners.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (listener == void 0 || listeners[i] == listener) {
                        listeners.splice(i, 1);
                        if (type.indexOf("onMouse") == 0) {
                            s._changeMouseCount(type, false);
                        }
                    }
                }
            }
        };
        /**
         * 移除对象中所有的侦听
         * @method removeAllEventListener
         * @public
         * @since 1.0.0
         * @return {void}
         */
        EventDispatcher.prototype.removeAllEventListener = function () {
            var s = this;
            for (var type in s.eventTypes) {
                if (type.indexOf("onMouse") == 0) {
                    for (var j = 0; j < s.eventTypes[type].length; j++) {
                        s._changeMouseCount(type, false);
                    }
                }
            }
            for (var type in s.eventTypes1) {
                if (type.indexOf("onMouse") == 0) {
                    for (var j = 0; j < s.eventTypes1[type].length; j++) {
                        s._changeMouseCount(type, false);
                    }
                }
            }
            s.eventTypes1 = {};
            s.eventTypes = {};
        };
        /**
         *
         */
        EventDispatcher.prototype.destroy = function () {
            var s = this;
            s.removeAllEventListener();
            s.eventTypes1 = null;
            s.eventTypes = null;
            s._defaultEvent = null;
        };
        //全局的鼠标事件的监听数对象表
        EventDispatcher._MECO = {};
        EventDispatcher._totalMEC = 0;
        return EventDispatcher;
    }(AObject));
    annie.EventDispatcher = EventDispatcher;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 事件类,annie引擎中一切事件的基类
     * @class annie.Event
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var Event = /** @class */ (function (_super) {
        __extends(Event, _super);
        /**
         * @method Event
         * @param {string} type 事件类型
         * @public
         * @since 1.0.0
         */
        function Event(type) {
            var _this = _super.call(this) || this;
            /**
             * 事件类型名
             * @property type
             * @type {string}
             * @public
             * @since 1.0.0
             */
            _this.type = "";
            /**
             * 触发此事件的对象
             * @property target
             * @public
             * @since 1.0.0
             * @type {any}
             * @default null
             */
            _this.target = null;
            /**
             * 随着事件一起附带的信息对象
             * 所有需要随事件一起发送的信息都可以放在此对象中
             * @property data
             * @public
             * @since 1.0.0
             * @type {any}
             * @default null
             */
            _this.data = null;
            //是否阻止事件向下冒泡
            _this._pd = false;
            _this._instanceType = "annie.Event";
            _this.type = type;
            return _this;
        }
        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
         * @method stopImmediatePropagation
         * @public
         * @return {void}
         * @since 2.0.0
         */
        Event.prototype.stopImmediatePropagation = function () {
            this._pd = true;
        };
        Event.prototype.destroy = function () {
            var s = this;
            s.target = null;
            s.data = null;
        };
        /**
         * 重置事件到初始状态方便重复利用
         * @method reset
         * @param {string} type
         * @param target
         * @since 2.0.0
         * @return {void}
         * @public
         */
        Event.prototype.reset = function (type, target) {
            var s = this;
            s.target = target;
            s._pd = false;
            s.type = type;
        };
        /**
         * annie.Stage舞台初始化完成后会触发的事件
         * @property ON_INIT_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ON_INIT_STAGE = "onInitStage";
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * annie.Stage舞台尺寸发生变化时触发
         * @property RESIZE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.RESIZE = "onResize";
        /**
         * annie引擎暂停或者恢复暂停时触发，这个事件只能在annie.globalDispatcher中监听
         * @property ON_RUN_CHANGED
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ON_RUN_CHANGED = "onRunChanged";
        /**
         * annie.Media相关媒体类的播放刷新事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_UPDATE
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_PLAY_UPDATE = "onPlayUpdate";
        /**
         * annie.Media相关媒体类的播放完成事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_PLAY_END = "onPlayEnd";
        /**
         * annie.Media相关媒体类的开始播放事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_PLAY_START = "onPlayStart";
        /**
         * annie.FlipBook组件翻页开始事件
         * @property ON_FLIP_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_FLIP_START = "onFlipStart";
        /**
         * annie.FlipBook组件翻页结束事件
         * @property ON_FLIP_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_FLIP_STOP = "onFlipStop";
        /**
         * annie.ScrollPage组件滑动到开始位置事件
         * @property ON_SCROLL_TO_HEAD
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_TO_HEAD = "onScrollToHead";
        /**
         * annie.ScrollPage组件停止滑动事件
         * @property ON_SCROLL_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_STOP = "onScrollStop";
        /**
         * annie.ScrollPage组件开始滑动事件
         * @property ON_SCROLL_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_START = "onScrollStart";
        /**
         * annie.Scroller组件开始滑动事件
         * @property ON_SCROLL_ING
         * @static
         * @since 3.1.0
         * @type {string}
         */
        Event.ON_SCROLL_ING = "onScrollIng";
        /**
         * annie.ScrollPage组件滑动到结束位置事件
         * @property ON_SCROLL_TO_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_TO_END = "onScrollToEnd";
        /**
         * annie.Slide 组件开始滑动事件
         * @property ON_SLIDE_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SLIDE_START = "onSlideStart";
        /**
         * annie.Slide 组件结束滑动事件
         * @property ON_SLIDE_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SLIDE_END = "onSlideEnd";
        /**
         * annie.DisplayObject显示对象加入到舞台事件
         * @property ADD_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ADD_TO_STAGE = "onAddToStage";
        /**
         * annie.DisplayObject显示对象从舞台移出事件
         * @property REMOVE_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.REMOVE_TO_STAGE = "onRemoveToStage";
        /**
         * annie.DisplayObject显示对象 循环帧事件
         * @property ENTER_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ENTER_FRAME = "onEnterFrame";
        /**
         * annie.MovieClip 播放完成事件
         * @property END_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.END_FRAME = "onEndFrame";
        /**
         * annie.MovieClip 帧标签事件
         * @property CALL_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.CALL_FRAME = "onCallFrame";
        /**
         * 完成事件
         * @property COMPLETE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.COMPLETE = "onComplete";
        /**
         * annie.URLLoader加载过程事件
         * @property PROGRESS
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.PROGRESS = "onProgress";
        /**
         * annie.URLLoader出错事件
         * @property ERROR
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ERROR = "onError";
        /**
         * annie.URLLoader中断事件
         * @property ABORT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ABORT = "onAbort";
        /**
         * annie.URLLoader开始事件
         * @property START
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.START = "onStart";
        /**
         * annie.Timer定时器触发事件
         * @property TIMER
         * @static
         * @since 1.0.9
         * @public
         * @type {string}
         */
        Event.TIMER = "onTimer";
        /**
         * annie.Timer定时器完成事件
         * @property TIMER_COMPLETE
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        Event.TIMER_COMPLETE = "onTimerComplete";
        /**
         * annie.ScratchCard 刮刮卡事件，刮了多少，一个百分比
         * @property ON_DRAW_PERCENT
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        Event.ON_DRAW_PERCENT = "onDrawPercent";
        return Event;
    }(annie.AObject));
    annie.Event = Event;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 鼠标事件类,电脑端鼠标,移动设备端的触摸都使用此事件来监听
     * @class annie.MouseEvent
     * @extends annie.Event
     * @public
     * @since 1.0.0
     */
    var MouseEvent = /** @class */ (function (_super) {
        __extends(MouseEvent, _super);
        /**
         * @method MouseEvent
         * @public
         * @since 1.0.0
         * @param {string} type
         */
        function MouseEvent(type) {
            var _this = _super.call(this, type) || this;
            /**
             * mouse或touch事件时rootDiv坐标x点
             * @property clientX
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.clientX = 0;
            /**
             * mouse或touch事件时rootDiv坐标y点
             * @property clientY
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.clientY = 0;
            /**
             * mouse或touch事件时全局坐标x点
             * @property stageX
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.stageX = 0;
            /**
             * mouse或touch事件时全局坐标y点
             * @property stageY
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.stageY = 0;
            /**
             * mouse或touch事件时本地坐标x点
             * @property localX
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.localX = 0;
            /**
             * mouse或touch事件时本地坐标y点
             * @property localY
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.localY = 0;
            /**
             * 绑定此事件的侦听对象
             * @property currentTarget
             * @public
             * @since 1.0.0
             * @type{annie.DisplayObject}
             * @default null
             */
            _this.currentTarget = null;
            /**
             * 触摸或者鼠标事件的手指唯一标识
             * @property identifier
             * @type {number}
             * @since 1.1.2
             * @public
             */
            _this.identifier = 0;
            /**
             * 当前时间戳
             * @property timeStamp
             * @type {number}
             */
            _this.timeStamp = 0;
            _this._instanceType = "annie.MouseEvent";
            return _this;
        }
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         * @return {void}
         */
        MouseEvent.prototype.updateAfterEvent = function () {
            this.target.stage._updateMatrix();
        };
        MouseEvent.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s.currentTarget = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * annie.DisplayObject鼠标或者手指按下事件
         * @property MOUSE_DOWN
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_DOWN = "onMouseDown";
        /**
         * annie.DisplayObject鼠标或者手指抬起事件
         * @property MOUSE_UP
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_UP = "onMouseUp";
        /**
         * annie.DisplayObject鼠标或者手指单击
         * @property CLICK
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.CLICK = "onMouseClick";
        /**
         * annie.DisplayObject鼠标或者手指移动事件
         * @property MOUSE_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_MOVE = "onMouseMove";
        /**
         * annie.DisplayObject鼠标或者手指移入到显示对象上里触发的事件
         * @property MOUSE_OVER
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_OVER = "onMouseOver";
        /**
         * annie.DisplayObject鼠标或者手指移出显示对象边界触发的事件
         * @property MOUSE_OUT
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_OUT = "onMouseOut";
        return MouseEvent;
    }(annie.Event));
    annie.MouseEvent = MouseEvent;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 多点触碰事件。单点事件请使用mouseEvent,pc和mobile通用
     * @class annie.TouchEvent
     * @extends annie.Event
     */
    var TouchEvent = /** @class */ (function (_super) {
        __extends(TouchEvent, _super);
        /**
         * @method TouchEvent
         * @public
         * @since 1.0.3
         * @param {string} type
         */
        function TouchEvent(type) {
            var _this = _super.call(this, type) || this;
            /**
             * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第1个点。
             * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
             * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
             * @property clientPoint1
             * @public
             * @since 1.0.3
             * @type {annie.Point}
             */
            _this.clientPoint1 = new annie.Point();
            /**
             * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第2个点。
             * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
             * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
             * @property clientPoint2
             * @public
             * @since 1.0.3
             * @type {annie.Point}
             */
            _this.clientPoint2 = new annie.Point();
            /**
             * 相对于上一次的缩放值
             * @property scale
             * @since 1.0.3
             */
            _this.scale = 0;
            /**
             * 相对于上一次的旋转值
             * @property rotate
             * @since 1.0.3
             */
            _this.rotate = 0;
            _this._instanceType = "annie.TouchEvent";
            return _this;
        }
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         * @return {void}
         */
        TouchEvent.prototype.updateAfterEvent = function () {
            this.target._updateMatrix();
        };
        TouchEvent.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s.clientPoint1 = null;
            s.clientPoint2 = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * annie.Stage 的多点触碰事件。这个事件只能在annie.Stage对象上侦听
         * @property ON_MULTI_TOUCH
         * @static
         * @public
         * @since 1.0.3
         * @type {string}
         */
        TouchEvent.ON_MULTI_TOUCH = "onMultiTouch";
        return TouchEvent;
    }(annie.Event));
    annie.TouchEvent = TouchEvent;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * @class annie.Point
     * @extends annie.AObject
     * @since 1.0.0
     * @public
     */
    var Point = /** @class */ (function (_super) {
        __extends(Point, _super);
        /**
         * 构造函数
         * @method Point
         * @public
         * @since 1.0.0
         * @param x
         * @param y
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            /**
             * 水平坐标
             * @property x
             * @public
             * @since 1.0.0
             * @type{number}
             */
            _this.x = 0;
            /**
             * 垂直坐标
             * @property y
             * @since 1.0.0
             * @public
             * @type {number}
             */
            _this.y = 0;
            var s = _this;
            s._instanceType = "annie.Point";
            s.x = x;
            s.y = y;
            return _this;
        }
        Point.prototype.destroy = function () { };
        /**
         * 求两点之间的距离
         * @method distance
         * @param args 可变参数 传两个参数的话就是两个annie.Point类型 传四个参数的话分别是两个点的x y x y
         * @return {number}
         * @static
         */
        Point.distance = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var len = args.length;
            if (len == 4) {
                return Math.sqrt((args[0] - args[2]) * (args[0] - args[2]) + (args[1] - args[3]) * (args[1] - args[3]));
            }
            else if (len == 2) {
                return Math.sqrt((args[0].x - args[1].x) * (args[0].x - args[1].x) + (args[0].y - args[1].y) * (args[0].y - args[1].y));
            }
        };
        return Point;
    }(annie.AObject));
    annie.Point = Point;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    var PI = Math.PI;
    var HalfPI = PI >> 1;
    var PacPI = PI + HalfPI;
    var TwoPI = PI << 1;
    var DEG_TO_RAD = Math.PI / 180;
    function cos(angle) {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 0;
            case PI:
            case -PI:
                return -1;
            case PacPI:
            case -HalfPI:
                return 0;
            default:
                return Math.cos(angle);
        }
    }
    function sin(angle) {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 1;
            case PI:
            case -PI:
                return 0;
            case PacPI:
            case -HalfPI:
                return -1;
            default:
                return Math.sin(angle);
        }
    }
    /**
     * 2维矩阵,不熟悉的朋友可以找相关书箱看看
     * @class annie.Matrix
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var Matrix = /** @class */ (function (_super) {
        __extends(Matrix, _super);
        /**
         * 构造函数
         * @method Matrix
         * @param {number} a
         * @param {number} b
         * @param {number} c
         * @param {number} d
         * @param {number} tx
         * @param {number} ty
         * @public
         * @since 1.0.0
         */
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            var _this = _super.call(this) || this;
            /**
             * @property a
             * @type {number}
             * @public
             * @default 1
             * @since 1.0.0
             */
            _this.a = 1;
            /**
             * @property b
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.b = 0;
            /**
             * @property c
             * @type {number}
             * @public
             * @since 1.0.0
             */
            _this.c = 0;
            /**
             * @property d
             * @type {number}
             * @public
             * @since 1.0.0
             */
            _this.d = 1;
            /**
             * @property tx
             * @type {number}
             * @public
             * @since 1.0.0
             */
            _this.tx = 0;
            /**
             * @property ty
             * @type {number}
             * @since 1.0.0
             * @public
             */
            _this.ty = 0;
            /**
             * 将一个点通过矩阵变换后的点
             * @method transformPoint
             * @param {number} x
             * @param {number} y
             * @param {annie.Point} 默认为空，如果不为null，则返回的是Point就是此对象，如果为null，则返回来的Point是新建的对象
             * @return {annie.Point}
             * @public
             * @since 1.0.0
             */
            _this.transformPoint = function (x, y, bp) {
                if (bp === void 0) { bp = null; }
                var s = this;
                if (!(bp instanceof annie.Point)) {
                    bp = new annie.Point();
                }
                bp.x = x * s.a + y * s.c + s.tx;
                bp.y = x * s.b + y * s.d + s.ty;
                return bp;
            };
            /**
             * 矩阵相乘
             * @method prepend
             * @public
             * @since 1.0.0
             * @param {annie.Matrix} mtx
             */
            _this.prepend = function (mtx) {
                var s = this;
                var a = mtx.a;
                var b = mtx.b;
                var c = mtx.c;
                var d = mtx.d;
                var tx = mtx.tx;
                var ty = mtx.ty;
                var a1 = s.a;
                var c1 = s.c;
                var tx1 = s.tx;
                s.a = a * a1 + c * s.b;
                s.b = b * a1 + d * s.b;
                s.c = a * c1 + c * s.d;
                s.d = b * c1 + d * s.d;
                s.tx = a * tx1 + c * s.ty + tx;
                s.ty = b * tx1 + d * s.ty + ty;
            };
            var s = _this;
            s._instanceType = "annie.Matrix";
            s.a = a;
            s.b = b;
            s.c = c;
            s.d = d;
            s.tx = tx;
            s.ty = ty;
            return _this;
        }
        /**
         * 复制一个矩阵
         * @method clone
         * @since 1.0.0
         * @public
         * @return {annie.Matrix}
         */
        Matrix.prototype.clone = function () {
            var s = this;
            return new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
        };
        /**
         * 从一个矩阵里赋值给这个矩阵
         * @method setFrom
         * @param {annie.Matrix} mtx
         * @public
         * @since 1.0.0
         */
        Matrix.prototype.setFrom = function (mtx) {
            var s = this;
            s.a = mtx.a;
            s.b = mtx.b;
            s.c = mtx.c;
            s.d = mtx.d;
            s.tx = mtx.tx;
            s.ty = mtx.ty;
        };
        /**
         * 将矩阵恢复成原始矩阵
         * @method identity
         * @public
         * @since 1.0.0
         */
        Matrix.prototype.identity = function () {
            var s = this;
            s.a = s.d = 1;
            s.b = s.c = s.tx = s.ty = 0;
        };
        /**
         * 反转一个矩阵
         * @method invert
         * @return {Matrix}
         * @since 1.0.0
         * @public
         */
        Matrix.prototype.invert = function () {
            var s = this;
            var target = new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
            var a = s.a;
            var b = s.b;
            var c = s.c;
            var d = s.d;
            var tx = s.tx;
            var ty = s.ty;
            if (b == 0 && c == 0) {
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                }
                else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }
                return target;
            }
            var determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return target;
            }
            determinant = 1 / determinant;
            var k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
            return target;
        };
        /**
         * 设置一个矩阵通过普通的显示对象的相关九大属性
         * @method createBox
         * @param {number} x
         * @param {number} y
         * @param {number} scaleX
         * @param {number} scaleY
         * @param {number} rotation
         * @param {number} skewX
         * @param {number} skewY
         * @param {number} ax
         * @param {number} ay
         * @since 1.0.0
         * @public
         */
        Matrix.prototype.createBox = function (x, y, scaleX, scaleY, rotation, skewX, skewY, ax, ay) {
            var s = this;
            if (rotation != 0) {
                skewX = skewY = rotation % 360;
            }
            else {
                skewX %= 360;
                skewY %= 360;
            }
            if ((skewX == 0) && (skewY == 0)) {
                s.a = scaleX;
                s.b = s.c = 0;
                s.d = scaleY;
            }
            else {
                skewX *= DEG_TO_RAD;
                skewY *= DEG_TO_RAD;
                var u = cos(skewX);
                var v = sin(skewX);
                if (skewX == skewY) {
                    s.a = u * scaleX;
                    s.b = v * scaleX;
                }
                else {
                    s.a = cos(skewY) * scaleX;
                    s.b = sin(skewY) * scaleX;
                }
                s.c = -v * scaleY;
                s.d = u * scaleY;
            }
            ;
            s.tx = x + ax - (ax * s.a + ay * s.c);
            s.ty = y + ay - (ax * s.b + ay * s.d);
        };
        /**
         * 判断两个矩阵是否相等
         * @method isEqual
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Matrix} m1
         * @param {annie.Matrix} m2
         * @return {boolean}
         */
        Matrix.isEqual = function (m1, m2) {
            return m1.tx == m2.tx && m1.ty == m2.ty && m1.a == m2.a && m1.b == m2.b && m1.c == m2.c && m1.d == m2.d;
        };
        Matrix.prototype.concat = function (mtx) {
            var s = this;
            var a = s.a, b = s.b, c = s.c, d = s.d, tx = s.tx, ty = s.ty;
            var ma = mtx.a, mb = mtx.b, mc = mtx.c, md = mtx.d, mx = mtx.tx, my = mtx.ty;
            s.a = a * ma + b * mc;
            s.b = a * mb + b * md;
            s.c = c * ma + d * mc;
            s.d = c * mb + d * md;
            s.tx = tx * ma + ty * mc + mx;
            s.ty = tx * mb + ty * md + my;
        };
        /**
         * 对矩阵应用旋转转换。
         * @method rotate
         * @param angle
         * @since 1.0.3
         * @public
         */
        Matrix.prototype.rotate = function (angle) {
            var s = this;
            var sin = Math.sin(angle), cos = Math.cos(angle), a = s.a, b = s.b, c = s.c, d = s.d, tx = s.tx, ty = s.ty;
            s.a = a * cos - b * sin;
            s.b = a * sin + b * cos;
            s.c = c * cos - d * sin;
            s.d = c * sin + d * cos;
            s.tx = tx * cos - ty * sin;
            s.ty = tx * sin + ty * cos;
        };
        /**
         * 对矩阵应用缩放转换。
         * @method scale
         * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
         * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
         * @since 1.0.3
         * @public
         */
        Matrix.prototype.scale = function (sx, sy) {
            var s = this;
            s.a *= sx;
            s.d *= sy;
            s.c *= sx;
            s.b *= sy;
            s.tx *= sx;
            s.ty *= sy;
        };
        /**
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @method translate
         * @public
         * @since 1.0.3
         * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位
         * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位
         */
        Matrix.prototype.translate = function (dx, dy) {
            var s = this;
            s.tx += dx;
            s.ty += dy;
        };
        Matrix.prototype.destroy = function () { };
        return Matrix;
    }(annie.AObject));
    annie.Matrix = Matrix;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     *
     * @class annie.Rectangle
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        /**
         * 构造函数
         * @method Rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var _this = _super.call(this) || this;
            /**
             * 矩形左上角的 x 坐标
             * @property x
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.x = 0;
            /**
             * 矩形左上角的 y 坐标
             * @property y
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.y = 0;
            /**
             * 矩形的宽度（以像素为单位）
             * @property width
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.width = 0;
            /**
             * 矩形的高度（以像素为单位）
             * @property height
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.height = 0;
            var s = _this;
            s._instanceType = "annie.Rectangle";
            s.x = x;
            s.y = y;
            s.height = height;
            s.width = width;
            return _this;
        }
        /**
         * 判断一个点是否在矩形内包括边
         * @method isPointIn
         * @param {annie.Point} point
         * @return {boolean}
         * @public
         * @since 1.0.0
         */
        Rectangle.prototype.isPointIn = function (point) {
            var s = this;
            return point.x >= s.x && point.x <= (s.x + s.width) && point.y >= s.y && point.y <= (s.y + s.height);
        };
        /**
         * 将多个矩形合成为一个矩形,并将结果存到第一个矩形参数返回
         * @method createFromRects
         * @param {annie.Rectangle} rect
         * @param {..arg} arg
         * @public
         * @since 1.0.0
         * @static
         */
        Rectangle.createFromRects = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            if (arg.length == 0) {
                return null;
            }
            else if (arg.length == 1) {
                return arg[0];
            }
            else {
                var rect = arg[0];
                var x = rect.x, y = rect.y, w = rect.width, h = rect.height, wx1 = void 0, wx2 = void 0, hy1 = void 0, hy2 = void 0;
                for (var i = 1; i < arg.length; i++) {
                    wx1 = x + w;
                    hy1 = y + h;
                    wx2 = arg[i].x + arg[i].width;
                    hy2 = arg[i].y + arg[i].height;
                    if (x > arg[i].x || wx1 == 0) {
                        x = arg[i].x;
                    }
                    if (y > arg[i].y || hy1 == 0) {
                        y = arg[i].y;
                    }
                    if (wx1 < wx2) {
                        wx1 = wx2;
                    }
                    if (hy1 < hy2) {
                        hy1 = hy2;
                    }
                    rect.x = x;
                    rect.y = y;
                    rect.width = wx1 - x;
                    rect.height = hy1 - y;
                }
                return rect;
            }
        };
        /**
         * 通过一系列点来生成一个矩形
         * 返回包含所有给定的点的最小矩形
         * @method createFromPoints
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Point} rect
         * @param {..arg} ary
         * @return {annie.Rectangle}
         */
        Rectangle.createFromPoints = function (rect) {
            var arg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg[_i - 1] = arguments[_i];
            }
            var x = arg[0].x, y = arg[0].y, w = arg[0].x, h = arg[0].y;
            for (var i = 1; i < arg.length; i++) {
                if (arg[i] instanceof annie.Point) {
                    if (x > arg[i].x) {
                        x = arg[i].x;
                    }
                    if (y > arg[i].y) {
                        y = arg[i].y;
                    }
                    if (w < arg[i].x) {
                        w = arg[i].x;
                    }
                    if (h < arg[i].y) {
                        h = arg[i].y;
                    }
                }
            }
            rect.x = x;
            rect.y = y;
            rect.width = w - x;
            rect.height = h - y;
            return rect;
        };
        /**
         * 判读两个矩形是否相交
         * @method testRectCross
         * @public
         * @since 1.0.2
         * @param r1
         * @param r2
         * @return {boolean}
         */
        Rectangle.testRectCross = function (ra, rb) {
            var a_cx, a_cy;
            /* 第一个中心点*/
            var b_cx, b_cy;
            /* 第二个中心点*/
            a_cx = ra.x + (ra.width / 2);
            a_cy = ra.y + (ra.height / 2);
            b_cx = rb.x + (rb.width / 2);
            b_cy = rb.y + (rb.height / 2);
            return ((Math.abs(a_cx - b_cx) <= (ra.width / 2 + rb.width / 2)) && (Math.abs(a_cy - b_cy) <= (ra.height / 2 + rb.height / 2)));
        };
        return Rectangle;
    }(annie.AObject));
    annie.Rectangle = Rectangle;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 显示对象抽象类,不能直接实例化。一切显示对象的基类,包含了显示对象需要的一切属性
     * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
     * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕
     * 上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、TextField 或 MovieClip 类。
     * @class annie.DisplayObject
     * @since 1.0.0
     * @extends annie.EventDispatcher
     */
    var DisplayObject = /** @class */ (function (_super) {
        __extends(DisplayObject, _super);
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
        function DisplayObject() {
            var _this = _super.call(this) || this;
            //更新信息对象是否更新矩阵 a2x_ua 是否更新Alpha a2x_uf 是否更新滤镜
            _this.a2x_um = false;
            _this.a2x_ua = false;
            /**
             * 此显示对象所在的舞台对象,如果此对象没有被添加到显示对象列表中,此对象为空。
             * @property stage
             * @public
             * @since 1.0.0
             * @type {Stage}
             * @default null;
             * @readonly
             * */
            _this.stage = null;
            /**
             * 显示对象的父级
             * @property parent
             * @since 1.0.0
             * @public
             * @type {annie.Sprite}
             * @default null
             * @readonly
             */
            _this.parent = null;
            //显示对象在显示列表上的最终表现出来的透明度,此透明度会继承父级的透明度依次相乘得到最终的值
            _this._cAlpha = 1;
            //显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的显示属性依次相乘得到最终的值
            _this._cMatrix = new annie.Matrix();
            /**
             * 是否可以接受点击事件,如果设置为false,此显示对象将无法接收到点击事件
             * @property mouseEnable
             * @type {boolean}
             * @public
             * @since 1.0.0
             * @default false
             */
            _this.mouseEnable = true;
            /**
             * 每一个显示对象都可以给他命一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
             * @property name
             * @since 1.0.0
             * @public
             * @type {string}
             * @default ""
             */
            _this.name = "";
            _this._x = 0;
            _this._offsetX = 0;
            _this._offsetY = 0;
            _this._y = 0;
            _this._scaleX = 1;
            _this._scaleY = 1;
            _this._rotation = 0;
            _this._alpha = 1;
            _this._skewX = 0;
            _this._skewY = 0;
            _this._anchorX = 0;
            _this._anchorY = 0;
            _this._visible = true;
            _this._matrix = new annie.Matrix();
            _this._mask = null;
            //是否自己的父级发生的改变
            _this._cp = true;
            _this._isUseToMask = 0;
            _this._hitArea = null;
            _this._bounds = new annie.Rectangle();
            _this.isNeedDraw = false;
            /**
             * 当前对象包含的声音列表
             * @property soundList
             * @public
             * @since 2.0.0
             * @type {Array}
             * @default []
             */
            _this.soundList = [];
            //每个Flash文件生成的对象都有一个自带的初始化信息
            _this._a2x_res_obj = {};
            //这里为什么要用undefined呢，这样可以知道一个对象是否从未添加到舞台过
            _this._isOnStage = undefined;
            _this._changeTransformInfo = [false, false, false, false, false, false];
            _this._instanceType = "annie.DisplayObject";
            return _this;
        }
        Object.defineProperty(DisplayObject.prototype, "x", {
            /**
             * 显示对象位置x
             * @property x
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._x;
            },
            set: function (value) {
                var s = this;
                if (value != s._x) {
                    s._x = value;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[0] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            /**
             * 显示对象位置y
             * @property y
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._y;
            },
            set: function (value) {
                var s = this;
                if (value != s._y) {
                    s._y = value;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[1] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            /**
             * 显示对象x方向的缩放值
             * @property scaleX
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             */
            get: function () {
                return this._scaleX;
            },
            set: function (value) {
                var s = this;
                if (value != s._scaleX) {
                    s._scaleX = value;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[2] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            /**
             * 显示对象y方向的缩放值
             * @property scaleY
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             */
            get: function () {
                return this._scaleY;
            },
            set: function (value) {
                var s = this;
                if (value != s._scaleY) {
                    s._scaleY = value;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[3] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotation", {
            /**
             * 显示对象旋转角度
             * @property rotation
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                var s = this;
                if (value != s._rotation || s._skewX != 0 || s._skewY != 0) {
                    s._rotation = value;
                    s._skewX = 0;
                    s._skewY = 0;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[4] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            /**
             * 显示对象透明度
             * @property alpha
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             */
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                var s = this;
                if (value != s._alpha) {
                    s._alpha = value;
                    s.a2x_ua = true;
                }
                s._changeTransformInfo[5] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "skewX", {
            /**
             * 显示对象x方向的斜切值
             * @property skewX
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._skewX;
            },
            set: function (value) {
                var s = this;
                if (value != s._skewX || s._rotation != 0) {
                    s._skewX = value;
                    s._rotation = 0;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[4] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "skewY", {
            /**
             * 显示对象y方向的斜切值
             * @property skewY
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._skewY;
            },
            set: function (value) {
                var s = this;
                if (value != s._skewY || s._rotation != 0) {
                    s._skewY = value;
                    s._rotation = 0;
                    s.a2x_um = true;
                }
                s._changeTransformInfo[4] = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "anchorX", {
            /**
             * 显示对象上x方向的缩放或旋转点
             * @property anchorX
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._anchorX;
            },
            set: function (value) {
                var s = this;
                if (value != s._anchorX) {
                    s._anchorX = value;
                    s.a2x_um = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "anchorY", {
            /**
             * 显示对象上y方向的缩放或旋转点
             * @property anchorY
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._anchorY;
            },
            set: function (value) {
                var s = this;
                if (value != s._anchorY) {
                    s._anchorY = value;
                    s.a2x_um = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "visible", {
            /**
             * 显未对象是否可见
             * @property visible
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default 0
             */
            get: function () {
                return this._visible;
            },
            set: function (value) {
                var s = this;
                if (value != s._visible) {
                    s._cp = true;
                    s._visible = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "matrix", {
            /**
             * 显示对象的变形矩阵
             * @property matrix
             * @public
             * @since 1.0.0
             * @type {annie.Matrix}
             * @default null
             */
            get: function () {
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(DisplayObject.prototype, "mask", {
            /**
             * 显示对象的遮罩, 是一个Shape显示对象或是一个只包含shape显示对象的MovieClip
             * @property mask
             * @public
             * @since 1.0.0
             * @type {annie.DisplayObject}
             * @default null
             */
            get: function () {
                return this._mask;
            },
            set: function (value) {
                var s = this;
                if (value != s._mask) {
                    if (value instanceof annie.DisplayObject) {
                        value._isUseToMask++;
                    }
                    else {
                        if (s._mask instanceof annie.DisplayObject) {
                            s._mask._isUseToMask--;
                        }
                    }
                    s._mask = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        DisplayObject.prototype.globalToLocal = function (point, bp) {
            if (bp === void 0) { bp = null; }
            return this._cMatrix.invert().transformPoint(point.x, point.y, bp);
        };
        /**
         *将本地坐标转换到全局坐标值
         * @method localToGlobal
         * @public
         * @since 1.0.0
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        DisplayObject.prototype.localToGlobal = function (point, bp) {
            if (bp === void 0) { bp = null; }
            return this._cMatrix.transformPoint(point.x, point.y, bp);
        };
        Object.defineProperty(DisplayObject.prototype, "hitArea", {
            get: function () {
                return this._hitArea;
            },
            /**
             * annie.Sprite显示容器的接受鼠标点击的区域。一但设置，容器里所有子级将不会触发任何鼠标相关的事件。
             * 相当于 mouseChildren=false,但在有大量子级显示对象的情况下，此方法的性能搞出mouseChildren几个数量级，建议使用。
             * @property hitArea
             * @param {annie.Rectangle} rect
             * @since 3.0.1
             */
            set: function (rect) {
                this._hitArea = rect;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} hitPoint 要检测碰撞的点
         * @param {boolean} isGlobalPoint 是不是全局坐标的点,默认false是本地坐标
         * @return {annie.DisplayObject}
         */
        DisplayObject.prototype.hitTestPoint = function (hitPoint, isGlobalPoint) {
            if (isGlobalPoint === void 0) { isGlobalPoint = false; }
            var s = this;
            if (!s.visible || !s.mouseEnable)
                return null;
            var p;
            if (isGlobalPoint) {
                p = s.globalToLocal(hitPoint, DisplayObject._p1);
            }
            else {
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
        };
        DisplayObject.prototype.getBounds = function () {
            return this._bounds;
        };
        /**
         * 获取对象形变后外切矩形
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         */
        DisplayObject.prototype.getDrawRect = function (matrix, bounds) {
            if (matrix === void 0) { matrix = null; }
            if (bounds === void 0) { bounds = null; }
            var s = this;
            if (matrix == void 0) {
                matrix = s.matrix;
            }
            if (bounds == void 0) {
                bounds = s.getBounds();
            }
            var x = bounds.x, y = bounds.y, w = bounds.width, h = bounds.height;
            matrix.transformPoint(x, y, DisplayObject._p1);
            matrix.transformPoint(x + w, y, DisplayObject._p2);
            matrix.transformPoint(x + w, y + h, DisplayObject._p3);
            matrix.transformPoint(x, y + h, DisplayObject._p4);
            annie.Rectangle.createFromPoints(DisplayObject._transformRect, DisplayObject._p1, DisplayObject._p2, DisplayObject._p3, DisplayObject._p4);
        };
        DisplayObject.prototype._updateMatrix = function () {
            var s = this, cm, pcm, ca, pca;
            var isHadParent = s.parent instanceof annie.Sprite;
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
            }
            else {
                if (isHadParent) {
                    var PUI = s.parent;
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
                    ca *= pca;
                }
            }
            s._cp = false;
            s._cAlpha = ca;
        };
        DisplayObject.prototype._draw = function (ctx) { };
        DisplayObject.prototype._render = function (renderObj) {
            var s = this;
            if (s._visible && s._cAlpha > 0) {
                var ctx = annie.CanvasRender._ctx, tm = void 0;
                tm = s._cMatrix;
                if (ctx.globalAlpha != s._cAlpha) {
                    ctx.globalAlpha = s._cAlpha;
                }
                ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                if (s.isNeedDraw) {
                    s._draw(ctx);
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "width", {
            /**
             * 获取或者设置显示对象在父级里的x方向的宽，不到必要不要用此属性获取高
             * 如果你要同时获取宽高，建议使用 getWH()方法获取宽和高
             * @property  width
             * @public
             * @since 1.0.3
             * @return {number}
             */
            get: function () {
                this._updateMatrix();
                this.getDrawRect();
                return DisplayObject._transformRect.width;
            },
            set: function (value) {
                var s = this;
                s._updateMatrix();
                s.getDrawRect();
                var w = DisplayObject._transformRect.width;
                if (w > 0) {
                    var sx = value / w;
                    s.scaleX *= sx;
                }
                else {
                    s.scaleX = 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取宽高
         * @method getWH
         * @since 1.1.0
         * @return {{w: number; h: number}}
         */
        DisplayObject.prototype.getWH = function () {
            this._updateMatrix();
            this.getDrawRect();
            return { w: DisplayObject._transformRect.width, h: DisplayObject._transformRect.height };
        };
        Object.defineProperty(DisplayObject.prototype, "height", {
            /**
             * 获取或者设置显示对象在父级里的y方向的高,不到必要不要用此属性获取高
             * 如果你要同时获取宽高，建议使用getWH()方法获取宽和高
             * @property  height
             * @public
             * @since 1.0.3
             * @return {number}
             */
            get: function () {
                this._updateMatrix();
                this.getDrawRect();
                return DisplayObject._transformRect.height;
            },
            set: function (value) {
                var s = this;
                s._updateMatrix();
                s.getDrawRect();
                var h = DisplayObject._transformRect.height;
                if (h > 0) {
                    var sy = value / h;
                    s.scaleY *= sy;
                }
                else {
                    s.scaleY = 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 停止这个显示对象上的所有声音
         * @method stopAllSounds
         * @public
         * @since 2.0.0
         * @return {void}
         */
        DisplayObject.prototype.stopAllSounds = function () {
            var sounds = this.soundList;
            if (sounds instanceof Array) {
                for (var i = sounds.length - 1; i >= 0; i--) {
                    sounds[i].stop();
                }
            }
        };
        DisplayObject.prototype._checkDrawBounds = function () {
            var s = this;
            //检查所有bounds矩阵是否在可视范围里
            if (s.stage) {
                s.getDrawRect(s._cMatrix, s._bounds);
                var dtr = DisplayObject._transformRect;
                s.isNeedDraw = annie.Rectangle.testRectCross(dtr, s.stage.renderObj.viewPort);
            }
        };
        /**
         * @method getSound
         * @param {number|string} id
         * @return {Array} 这个对象里所有叫这个名字的声音引用数组
         * @since 2.0.0
         */
        DisplayObject.prototype.getSound = function (id) {
            var sounds = this.soundList, newSounds = [];
            if (sounds instanceof Array) {
                if (typeof (id) == "string") {
                    for (var i = sounds.length - 1; i >= 0; i--) {
                        if (sounds[i].name == id) {
                            //这里是全部找出来
                            newSounds.push(sounds[i]);
                        }
                    }
                }
                else {
                    if (id >= 0 && id < sounds.length) {
                        newSounds.push(sounds[id]);
                    }
                }
            }
            return newSounds;
        };
        /**
         * 返回一个id，这个id你要留着作为删除他时使用。
         * 这个声音会根据这个显示对象添加到舞台时播放，移出舞台而关闭
         * @method addSound
         * @param {annie.Sound} sound
         * @return {void}
         * @since 2.0.0
         * @public
         */
        DisplayObject.prototype.addSound = function (sound) {
            var s = this;
            if (!(s.soundList instanceof Array)) {
                s.soundList = [];
            }
            s.soundList.push(sound);
        };
        /**
         * 删除一个已经添加进来的声音
         * @method removeSound
         * @public
         * @since 2.0.0
         * @param {number|string} id
         * @return {void}
         */
        DisplayObject.prototype.removeSound = function (id) {
            var sounds = this.soundList;
            if (sounds instanceof Array) {
                if (typeof (id) == "string") {
                    for (var i = sounds.length - 1; i >= 0; i--) {
                        //这里是全部找出来
                        if (sounds[i].name == id) {
                            sounds.splice(i, 1);
                        }
                    }
                }
                else {
                    if (id >= 0 && id < sounds.length) {
                        sounds.splice(id, 1);
                    }
                }
            }
        };
        DisplayObject.prototype.destroy = function () {
            var s = this;
            //清除相应的数据引用
            s.stopAllSounds();
            for (var i = 0; i < s.soundList.length; i++) {
                s.soundList[i].destroy();
            }
            s.soundList = null;
            s._a2x_res_obj = null;
            s.mask = null;
            s.parent = null;
            s.stage = null;
            s._bounds = null;
            s._matrix = null;
            s._cMatrix = null;
            _super.prototype.destroy.call(this);
        };
        DisplayObject.prototype._onRemoveEvent = function (isReSetMc) {
            //如果有音乐,则关闭音乐
            var s = this;
            s._isOnStage = false;
            var sounds = s.soundList;
            if (sounds.length > 0) {
                for (var i = 0; i < sounds.length; i++) {
                    sounds[i].stop2();
                }
            }
            s.dispatchEvent(annie.Event.REMOVE_TO_STAGE);
        };
        DisplayObject.prototype._onAddEvent = function () {
            var s = this;
            s._isOnStage = true;
            //如果有音乐，则播放音乐
            var sounds = s.soundList;
            if (sounds.length > 0) {
                for (var i = 0; i < sounds.length; i++) {
                    sounds[i].play2();
                }
            }
            s.dispatchEvent(annie.Event.ADD_TO_STAGE);
        };
        DisplayObject.prototype._onUpdateFrame = function (mcSpeed, isOffCanvas) {
            if (mcSpeed === void 0) { mcSpeed = 1; }
            if (isOffCanvas === void 0) { isOffCanvas = false; }
            if (this._visible && !isOffCanvas) {
                this.dispatchEvent(annie.Event.ENTER_FRAME);
            }
        };
        /**
         * 启动鼠标或者触摸拖动
         * @method startDrag
         * @param {boolean} isCenter 指定将可拖动的对象锁定到指针位置中心 (true)，还是锁定到用户第一次单击该对象的位置 (false) 默认false
         * @param {annie.Rectangle} bounds 相对于显示对象父级的坐标的值，用于指定 Sprite 约束矩形
         * @since 1.1.2
         * @public
         * @return {void}
         */
        DisplayObject.prototype.startDrag = function (isCenter, bounds) {
            if (isCenter === void 0) { isCenter = false; }
            if (bounds === void 0) { bounds = null; }
            var s = this;
            annie.Stage._dragDisplay = s;
            annie.Stage._isDragCenter = isCenter;
            annie.Stage._lastDragPoint.x = Number.MAX_VALUE;
            annie.Stage._lastDragPoint.y = Number.MAX_VALUE;
            if (bounds) {
                annie.Stage._dragBounds.x = bounds.x;
                annie.Stage._dragBounds.y = bounds.y;
                annie.Stage._dragBounds.width = bounds.width;
                annie.Stage._dragBounds.height = bounds.height;
            }
            else {
                annie.Stage._dragBounds.x = 0;
                annie.Stage._dragBounds.y = 0;
                annie.Stage._dragBounds.width = Number.MIN_VALUE;
                annie.Stage._dragBounds.height = Number.MIN_VALUE;
            }
        };
        /**
         * 停止鼠标跟随
         * @method stopDrag
         */
        DisplayObject.prototype.stopDrag = function () {
            annie.Stage._dragDisplay = null;
        };
        /**
         * 如果你在mc更改了对象的x y scale rotation alpha，最后想还原，不再需要自我控制，可以调用这方法
         * @method clearCustomTransform
         * @param transId{number}  //0->x,1->y,2->scaleX,3->scaleY,4->rotation,5->alpha,-1->all
         * @public
         * @since 3.1.0
         */
        DisplayObject.prototype.clearCustomTransform = function (transId) {
            if (transId === void 0) { transId = -1; }
            var s = this;
            if (transId = -1) {
                for (var i = 0; i < 6; i++) {
                    s._changeTransformInfo[i] = false;
                }
            }
            else {
                s._changeTransformInfo[transId] = false;
            }
        };
        DisplayObject.prototype.clearBounds = function () {
            this._bounds.x = 0;
            this._bounds.y = 0;
            this._bounds.width = 0;
            this._bounds.height = 0;
        };
        //为了 hitTestPoint，localToGlobal，globalToLocal等方法不复新不重复生成新的点对象而节约内存
        DisplayObject._p1 = new annie.Point();
        DisplayObject._p2 = new annie.Point();
        DisplayObject._p3 = new annie.Point();
        DisplayObject._p4 = new annie.Point();
        DisplayObject._transformRect = new annie.Rectangle();
        return DisplayObject;
    }(annie.EventDispatcher));
    annie.DisplayObject = DisplayObject;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象的引用的 Bitmap 对象。
     * 创建了 Bitmap 对象后，使用父 Sprite 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * @class annie.Bitmap
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.0
     */
    var Bitmap = /** @class */ (function (_super) {
        __extends(Bitmap, _super);
        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {Image|Video|Canvas} bitmapData 一个HTMl Image的实例,小程序或者小游戏里则只能是一个图片的地址
         * @param {annie.Rectangle} rect 设置显示Image的区域,不设置值则全部显示Image的内容，小程序或者小游戏里没有这个参数
         * @example
         *      //html5
         *      var imgEle=new Image();
         *      imgEle.onload=function (e) {
         *          var bitmap = new annie.Bitmap(imgEle)
         *          //居中对齐
         *          bitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *          bitmap.y = (s.stage.desHeight - bitmap.height) / 2;
         *          s.addChild(bitmap);
         *          //截取图片的某一部分显示
         *          var rect = new annie.Rectangle(0, 0, 200, 200),
         *          rectBitmap = new annie.Bitmap(imgEle, rect);
         *          rectBitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *          rectBitmap.y = 100;
         *          s.addChild(rectBitmap);
         *      }
         *      imgEle.src='http://test.annie2x.com/test.jpg';
         *      //小程序或者小游戏
         *      var imgEle="http://test.annie2x.com/test.jpg";
         *      var bitmap=new annie.Bitmap(imgEle);
         *      s.addChild(bitmap);
         *
         * <p><a href="http://test.annie2x.com/annie/Bitmap/index.html" target="_blank">测试链接</a></p>
         */
        function Bitmap(bitmapData) {
            var _this = _super.call(this) || this;
            // 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
            _this._texture = null;
            var s = _this;
            s._instanceType = "annie.Bitmap";
            s.bitmapData = bitmapData;
            return _this;
        }
        Object.defineProperty(Bitmap.prototype, "bitmapData", {
            /**
             * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
             * HTML的一个Image对象或者是canvas对象或者是video对象
             * @property bitmapData
             * @public
             * @since 1.0.0
             * @type {any}
             * @default null
             */
            get: function () {
                return this._texture;
            },
            set: function (value) {
                var s = this;
                if (typeof (value) == "string") {
                    var img = annie.CanvasRender.rootContainer.createImage();
                    img.src = value;
                    s._texture = img;
                    s.clearBounds();
                }
                else {
                    if (value != s._texture) {
                        s.clearBounds();
                        s._texture = value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype._updateMatrix = function () {
            _super.prototype._updateMatrix.call(this);
            var s = this;
            var texture = s._texture;
            if (!texture || texture.width == 0 || texture.height == 0) {
                return;
            }
            var bw = texture.width;
            var bh = texture.height;
            if (s._bounds.width != bw || s._bounds.height != bh) {
                s._bounds.width = bw;
                s._bounds.height = bh;
                s.a2x_um = true;
            }
            if (s.a2x_um) {
                s._checkDrawBounds();
            }
            s.a2x_um = false;
            s.a2x_ua = false;
        };
        Bitmap.prototype._draw = function (ctx) {
            var s = this;
            ctx.drawImage(s._texture, 0, 0);
        };
        return Bitmap;
    }(annie.DisplayObject));
    annie.Bitmap = Bitmap;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 矢量对象
     * @class annie.Shape
     * @extends annie.Bitmap
     * @since 1.0.0
     * @public
     */
    var Shape = /** @class */ (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            var _this = _super.call(this) || this;
            //一个数组，每个元素也是一个数组[类型 0是属性,1是方法,名字 执行的属性或方法名,参数]
            _this._command = [];
            /**
             * 径向渐变填充 一般给Annie2x用
             * @method beginRadialGradientFill
             * @param {Array} points 一组点
             * @param {Array} colors 一组颜色值
             * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
             * @public
             * @since 1.0.0
             * @return {void}
             * @example
             *      var shape=new annie.Shape();
             *      shape.beginRadialGradientFill([100,100,100,100,100],[[0,"#00ff00",1],[1,"#000000",1]]);
             *      shape.drawRect(0,0,200,200);
             *      shape.endFill();
             *      s.addChild(shape);
             */
            _this.beginRadialGradientFill = function (points, colors) {
                this._fill(Shape.getGradientColor(points, colors));
            };
            /**
             * 画径向渐变的线条 一般给Annie2x用
             * @method beginRadialGradientStroke
             * @param {Array} points 一组点
             * @param {Array} colors 一组颜色值
             * @param {number} lineWidth
             * @param {string} cap 线头的形状 butt round square 默认 butt
             * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
             * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
             * @public
             * @since 1.0.0
             * @return {void}
             */
            _this.beginRadialGradientStroke = function (points, colors, lineWidth, cap, join, miter) {
                if (lineWidth === void 0) { lineWidth = 1; }
                if (cap === void 0) { cap = 0; }
                if (join === void 0) { join = 0; }
                if (miter === void 0) { miter = 10; }
                this._stroke(Shape.getGradientColor(points, colors), lineWidth, cap, join, miter);
            };
            //是否矢量元素有更新
            _this.a2x_ut = true;
            var s = _this;
            s._instanceType = "annie.Shape";
            return _this;
        }
        /**
         * 通过一系统参数获取生成颜色或渐变所需要的对象
         * 一般给用户使用较少,Annie2x工具自动使用
         * @method getGradientColor
         * @static
         * @param points
         * @param colors
         * @return {any}
         * @since 1.0.0
         * @public
         */
        Shape.getGradientColor = function (points, colors) {
            var colorObj;
            var ctx = annie.CanvasRender._ctx;
            if (points.length == 4) {
                colorObj = ctx.createLinearGradient(points[0], points[1], points[2], points[3]);
            }
            else {
                colorObj = ctx.createRadialGradient(points[0], points[1], 0, points[2], points[3], points[4]);
            }
            for (var i = 0, l = colors.length; i < l; i++) {
                colorObj.addColorStop(colors[i][0], Shape.getRGBA(colors[i][1], colors[i][2]));
            }
            return colorObj;
        };
        /**
         * 设置位图填充时需要使用的方法,一般给用户使用较少,Annie2x工具自动使用
         * @method getBitmapStyle
         * @static
         * @param {Image} image HTML Image元素
         * @return {CanvasPattern}
         * @public
         * @since 1.0.0
         */
        Shape.getBitmapStyle = function (image) {
            var ctx = annie.CanvasRender._ctx;
            return ctx.createPattern(image, "repeat");
        };
        /**
         * 通过24位颜色值和一个透明度值生成RGBA值
         * @method getRGBA
         * @static
         * @public
         * @since 1.0.0
         * @param {string} color 字符串的颜色值,如:#33ffee
         * @param {number} alpha 0-1区间的一个数据 0完全透明 1完全不透明
         * @return {string}
         */
        Shape.getRGBA = function (color, alpha) {
            if (color.indexOf("0x") == 0) {
                color = color.replace("0x", "#");
            }
            if (color.length < 7) {
                color = "#000000";
            }
            if (alpha != 1) {
                var r = parseInt("0x" + color.substr(1, 2));
                var g = parseInt("0x" + color.substr(3, 2));
                var b = parseInt("0x" + color.substr(5, 2));
                color = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
            }
            return color;
        };
        /**
         * 添加一条绘画指令,具体可以查阅Html Canvas画图方法
         * @method addDraw
         * @param {string} commandName ctx指令的方法名 如moveTo lineTo arcTo等
         * @param {Array} params
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.addDraw = function (commandName, params) {
            var s = this;
            s._command[s._command.length] = [1, commandName, params];
        };
        /**
         * 画一个带圆角的矩形
         * @method drawRoundRect
         * @param {number} x 点x值
         * @param {number} y 点y值
         * @param {number} w 宽
         * @param {number} h 高
         * @param {number} rTL 左上圆角半径
         * @param {number} rTR 右上圆角半径
         * @param {number} rBL 左下圆角半径
         * @param {number} rBR 右上圆角半径
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.drawRoundRect = function (x, y, w, h, rTL, rTR, rBL, rBR) {
            if (rTL === void 0) { rTL = 0; }
            if (rTR === void 0) { rTR = 0; }
            if (rBL === void 0) { rBL = 0; }
            if (rBR === void 0) { rBR = 0; }
            var max = (w < h ? w : h) / 2;
            var mTL = 0, mTR = 0, mBR = 0, mBL = 0;
            if (rTL < 0) {
                rTL *= (mTL = -1);
            }
            if (rTL > max) {
                rTL = max;
            }
            if (rTR < 0) {
                rTR *= (mTR = -1);
            }
            if (rTR > max) {
                rTR = max;
            }
            if (rBR < 0) {
                rBR *= (mBR = -1);
            }
            if (rBR > max) {
                rBR = max;
            }
            if (rBL < 0) {
                rBL *= (mBL = -1);
            }
            if (rBL > max) {
                rBL = max;
            }
            var c = this._command;
            c[c.length] = [1, "moveTo", [x + w - rTR, y]];
            c[c.length] = [1, "arcTo", [x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR]];
            c[c.length] = [1, "lineTo", [x + w, y + h - rBR]];
            c[c.length] = [1, "arcTo", [x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR]];
            c[c.length] = [1, "lineTo", [x + rBL, y + h]];
            c[c.length] = [1, "arcTo", [x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL]];
            c[c.length] = [1, "lineTo", [x, y + rTL]];
            c[c.length] = [1, "arcTo", [x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL]];
            c[c.length] = [1, "closePath", []];
        };
        /**
         * 绘画时移动到某一点
         * @method moveTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.moveTo = function (x, y) {
            this._command[this._command.length] = [1, "moveTo", [x, y]];
        };
        /**
         * 从上一点画到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method lineTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.lineTo = function (x, y) {
            this._command[this._command.length] = [1, "lineTo", [x, y]];
        };
        /**
         * 从上一点画弧到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method arcTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.arcTo = function (x, y) {
            this._command[this._command.length] = [1, "arcTo", [x, y]];
        };
        /**
         * 二次贝赛尔曲线
         * 从上一点画二次贝赛尔曲线到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method quadraticCurveTo
         * @param {number} cpX 控制点X
         * @param {number} cpX 控制点Y
         * @param {number} x 终点X
         * @param {number} y 终点Y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.quadraticCurveTo = function (cpX, cpY, x, y) {
            this._command[this._command.length] = [1, "quadraticCurveTo", [cpX, cpY, x, y]];
        };
        /**
         * 三次贝赛尔曲线
         * 从上一点画二次贝赛尔曲线到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method bezierCurveTo
         * @param {number} cp1X 1控制点X
         * @param {number} cp1Y 1控制点Y
         * @param {number} cp2X 2控制点X
         * @param {number} cp2Y 2控制点Y
         * @param {number} x 终点X
         * @param {number} y 终点Y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.bezierCurveTo = function (cp1X, cp1Y, cp2X, cp2Y, x, y) {
            this._command[this._command.length] = [1, "bezierCurveTo", [cp1X, cp1Y, cp2X, cp2Y, x, y]];
        };
        /**
         * 闭合一个绘画路径
         * @method closePath
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.closePath = function () {
            this._command[this._command.length] = [1, "closePath", []];
        };
        /**
         * 画一个矩形
         * @method drawRect
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.drawRect = function (x, y, w, h) {
            var c = this._command;
            c[c.length] = [1, "moveTo", [x, y]];
            c[c.length] = [1, "lineTo", [x + w, y]];
            c[c.length] = [1, "lineTo", [x + w, y + h]];
            c[c.length] = [1, "lineTo", [x, y + h]];
            c[c.length] = [1, "closePath", []];
        };
        /**
         * 画一个弧形
         * @method drawArc
         * @param {number} x 起始点x
         * @param {number} y 起始点y
         * @param {number} radius 半径
         * @param {number} start 开始角度
         * @param {number} end 结束角度
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.drawArc = function (x, y, radius, start, end) {
            this._command[this._command.length] = [1, "arc", [x, y, radius, start / 180 * Math.PI, end / 180 * Math.PI]];
        };
        /**
         * 画一个圆
         * @method drawCircle
         * @param {number} x 圆心x
         * @param {number} y 圆心y
         * @param {number} radius 半径
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.drawCircle = function (x, y, radius) {
            this._command[this._command.length] = [1, "arc", [x, y, radius, 0, 2 * Math.PI]];
        };
        /**
         * 画一个椭圆
         * @method drawEllipse
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.drawEllipse = function (x, y, w, h) {
            var k = 0.5522848;
            var ox = (w / 2) * k;
            var oy = (h / 2) * k;
            var xe = x + w;
            var ye = y + h;
            var xm = x + w / 2;
            var ym = y + h / 2;
            var c = this._command;
            c[c.length] = [1, "moveTo", [x, ym]];
            c[c.length] = [1, "bezierCurveTo", [x, ym - oy, xm - ox, y, xm, y]];
            c[c.length] = [1, "bezierCurveTo", [xm + ox, y, xe, ym - oy, xe, ym]];
            c[c.length] = [1, "bezierCurveTo", [xe, ym + oy, xm + ox, ye, xm, ye]];
            c[c.length] = [1, "bezierCurveTo", [xm - ox, ye, x, ym + oy, x, ym]];
        };
        /**
         * 清除掉之前所有绘画的东西
         * @method clear
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.clear = function () {
            var s = this;
            s._command = [];
            s.a2x_ut = false;
            s.clearBounds();
        };
        /**
         * 开始绘画填充,如果想画的东西有颜色填充,一定要从此方法开始
         * @method beginFill
         * @param {string} color 颜色值 单色和RGBA格式
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.beginFill = function (color) {
            this._fill(color);
        };
        /**
         * 线性渐变填充 一般给Annie2x用
         * @method beginLinearGradientFill
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @public
         * @since 1.0.0
         * @return {void}
         * @example
         *      var shape=new annie.Shape();
         *      shape.beginLinearGradientFill([0,0,200,0],[[0,"#ff0000",1],[0.164706,"#ffff00",1],[0.364706,"#00ff00",1],[0.498039,"#00ffff",1],[0.666667,"#0000ff",1],[0.831373,"#ff00ff",1],[1,"#ff0000",1]]);
         *      shape.drawRect(0,0,200,200);
         *      shape.endFill();
         *      s.addChild(shape);
         */
        Shape.prototype.beginLinearGradientFill = function (points, colors) {
            this._fill(Shape.getGradientColor(points, colors));
        };
        /**
         * 位图填充 一般给Annie2x用
         * @method beginBitmapFill
         * @param {Image} image
         * @param { Array} matrix
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.beginBitmapFill = function (image, matrix) {
            var s = this;
            if (matrix) {
                s._isBitmapFill = matrix;
            }
            s._fill(Shape.getBitmapStyle(image));
        };
        Shape.prototype._fill = function (fillStyle) {
            var s = this;
            var c = s._command;
            c[c.length] = [0, "fillStyle", fillStyle];
            c[c.length] = [1, "beginPath", []];
        };
        /**
         * 给线条着色
         * @method beginStroke
         * @param {string} color  颜色值
         * @param {number} lineWidth 宽度
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.beginStroke = function (color, lineWidth, cap, join, miter) {
            if (lineWidth === void 0) { lineWidth = 1; }
            if (cap === void 0) { cap = 0; }
            if (join === void 0) { join = 0; }
            if (miter === void 0) { miter = 0; }
            this._stroke(color, lineWidth, cap, join, miter);
        };
        /**
         * 画线性渐变的线条 一般给Annie2x用
         * @method beginLinearGradientStroke
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {number} lineWidth
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.beginLinearGradientStroke = function (points, colors, lineWidth, cap, join, miter) {
            if (lineWidth === void 0) { lineWidth = 1; }
            if (cap === void 0) { cap = 0; }
            if (join === void 0) { join = 0; }
            if (miter === void 0) { miter = 10; }
            this._stroke(Shape.getGradientColor(points, colors), lineWidth, cap, join, miter);
        };
        /**
         * 线条位图填充 一般给Annie2x用
         * @method beginBitmapStroke
         * @param {Image} image
         * @param {Array} matrix
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.beginBitmapStroke = function (image, matrix, lineWidth, cap, join, miter) {
            if (lineWidth === void 0) { lineWidth = 1; }
            if (cap === void 0) { cap = 0; }
            if (join === void 0) { join = 0; }
            if (miter === void 0) { miter = 10; }
            var s = this;
            if (matrix) {
                s._isBitmapStroke = matrix;
            }
            s._stroke(Shape.getBitmapStyle(image), lineWidth, cap, join, miter);
        };
        Shape.prototype._stroke = function (strokeStyle, width, cap, join, miter) {
            var c = this._command;
            c[c.length] = [0, "lineWidth", width];
            c[c.length] = [0, "lineCap", Shape._caps[cap]];
            c[c.length] = [0, "lineJoin", Shape._joins[join]];
            c[c.length] = [0, "miterLimit", miter];
            c[c.length] = [0, "strokeStyle", strokeStyle];
            c[c.length] = [1, "beginPath", []];
        };
        /**
         * 结束填充
         * @method endFill
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.endFill = function () {
            var s = this;
            var c = s._command;
            var m = s._isBitmapFill;
            if (m) {
                c[c.length] = [2, "setTransform", m];
            }
            c[c.length] = ([1, "fill", []]);
            if (m) {
                s._isBitmapFill = null;
            }
            s.a2x_ut = true;
        };
        /**
         * 设置虚线参数
         * @method setLineDash
         * @param {Array} data 一个长度为2的数组，第1个是虚线长度，第2个是虚线间隔，如果此参数为[]的空数组，则是清除虚线。
         *                如[5,20]是画虚线,[]则是请除虚线，变为实线
         * @since 2.0.2
         * @return {void}
         */
        Shape.prototype.setLineDash = function (data) {
            if (data === void 0) { data = []; }
            var c = this._command;
            c[c.length] = [1, "setLineDash", [data, 0]];
        };
        /**
         * 结束画线
         * @method endStroke
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.endStroke = function () {
            var s = this;
            var c = s._command;
            var m = s._isBitmapStroke;
            if (m) {
                //如果为2则还需要特别处理
                c[c.length] = [2, "setTransform", m];
            }
            c[c.length] = ([1, "stroke", []]);
            if (m) {
                s._isBitmapStroke = null;
            }
            s.a2x_ut = true;
        };
        /**
         * 解析一段路径 一般给Annie2x用
         * @method decodePath
         * @param {Array} data
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Shape.prototype.decodePath = function (data) {
            var s = this;
            var instructions = ["moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "closePath"];
            var count = data.length;
            for (var i = 0; i < count; i++) {
                if (data[i] == 0 || data[i] == 1) {
                    s.addDraw(instructions[data[i]], [data[i + 1], data[i + 2]]);
                    i += 2;
                }
                else {
                    s.addDraw(instructions[data[i]], [data[i + 1], data[i + 2], data[i + 3], data[i + 4]]);
                    i += 4;
                }
            }
            s.a2x_ut = true;
        };
        ;
        Shape.prototype._updateMatrix = function () {
            _super.prototype._updateMatrix.call(this);
            var s = this;
            if (s.a2x_ut) {
                s.a2x_ut = false;
                //更新矢量
                var cLen = s._command.length;
                var leftX = void 0;
                var leftY = void 0;
                var buttonRightX = void 0;
                var buttonRightY = void 0;
                var i = void 0;
                if (cLen > 0) {
                    //确定是否有数据,如果有数据的话就计算出缓存图的宽和高
                    var data = void 0;
                    var lastX = 0;
                    var lastY = 0;
                    var lineWidth = 0;
                    for (i = 0; i < cLen; i++) {
                        data = s._command[i];
                        if (data[0] == 1) {
                            if (data[1] == "moveTo" || data[1] == "lineTo" || data[1] == "arcTo" || data[1] == "bezierCurveTo") {
                                if (leftX == undefined) {
                                    leftX = data[2][0];
                                }
                                if (leftY == undefined) {
                                    leftY = data[2][1];
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = data[2][0];
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = data[2][1];
                                }
                                if (data[1] == "bezierCurveTo") {
                                    leftX = Math.min(leftX, data[2][0], data[2][2], data[2][4]);
                                    leftY = Math.min(leftY, data[2][1], data[2][3], data[2][5]);
                                    buttonRightX = Math.max(buttonRightX, data[2][0], data[2][2], data[2][4]);
                                    buttonRightY = Math.max(buttonRightY, data[2][1], data[2][3], data[2][5]);
                                    lastX = data[2][4];
                                    lastY = data[2][5];
                                }
                                else {
                                    leftX = Math.min(leftX, data[2][0]);
                                    leftY = Math.min(leftY, data[2][1]);
                                    buttonRightX = Math.max(buttonRightX, data[2][0]);
                                    buttonRightY = Math.max(buttonRightY, data[2][1]);
                                    lastX = data[2][0];
                                    lastY = data[2][1];
                                }
                            }
                            else if (data[1] == "quadraticCurveTo") {
                                //求中点
                                var mid1X = (lastX + data[2][0]) * 0.5;
                                var mid1Y = (lastY + data[2][1]) * 0.5;
                                var mid2X = (data[2][0] + data[2][2]) * 0.5;
                                var mid2Y = (data[2][1] + data[2][3]) * 0.5;
                                if (leftX == undefined) {
                                    leftX = mid1X;
                                }
                                if (leftY == undefined) {
                                    leftY = mid1Y;
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = mid1X;
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = mid1Y;
                                }
                                leftX = Math.min(leftX, mid1X, mid2X, data[2][2]);
                                leftY = Math.min(leftY, mid1Y, mid2Y, data[2][3]);
                                buttonRightX = Math.max(buttonRightX, mid1X, mid2X, data[2][2]);
                                buttonRightY = Math.max(buttonRightY, mid1Y, mid2Y, data[2][3]);
                                lastX = data[2][2];
                                lastY = data[2][3];
                            }
                            else if (data[1] == "arc") {
                                var yuanPointX = data[2][0];
                                var yuanPointY = data[2][1];
                                var radio = data[2][2];
                                var yuanLeftX = yuanPointX - radio;
                                var yuanLeftY = yuanPointY - radio;
                                var yuanBRX = yuanPointX + radio;
                                var yuanBRY = yuanPointY + radio;
                                if (leftX == undefined) {
                                    leftX = yuanLeftX;
                                }
                                if (leftY == undefined) {
                                    leftY = yuanLeftY;
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = yuanBRX;
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = yuanBRY;
                                }
                                leftX = Math.min(leftX, yuanLeftX);
                                leftY = Math.min(leftY, yuanLeftY);
                                buttonRightX = Math.max(buttonRightX, yuanBRX);
                                buttonRightY = Math.max(buttonRightY, yuanBRY);
                            }
                        }
                        else {
                            if (data[1] == "lineWidth") {
                                if (lineWidth < data[2]) {
                                    lineWidth = data[2];
                                }
                            }
                        }
                    }
                    if (leftX != undefined || lineWidth > 0) {
                        if (leftX == undefined) {
                            leftX = 0;
                            leftY = 0;
                        }
                        leftX -= lineWidth;
                        leftY -= lineWidth;
                        buttonRightX += lineWidth;
                        buttonRightY += lineWidth;
                        var width = buttonRightX - leftX;
                        var height = buttonRightY - leftY;
                        // s._offsetX = leftX;
                        // s._offsetY = leftY;
                        s._bounds.x = leftX;
                        s._bounds.y = leftY;
                        s._bounds.width = width;
                        s._bounds.height = height;
                        s.a2x_um = true;
                    }
                }
            }
            if (s.a2x_um) {
                s._checkDrawBounds();
            }
            s.a2x_um = false;
            s.a2x_ua = false;
        };
        Shape.prototype._draw = function (ctx, isMask) {
            if (isMask === void 0) { isMask = false; }
            var s = this;
            var com = s._command;
            var cLen = com.length;
            var data;
            ctx.translate(s._offsetX, s._offsetY);
            var isStroke = false;
            for (var i = 0; i < cLen; i++) {
                data = com[i];
                if (data[0] > 0) {
                    var paramsLen = data[2].length;
                    if (isMask && (isStroke || data[1] == "beginPath" || data[1] == "closePath" || paramsLen == 0))
                        continue;
                    if (paramsLen == 0) {
                        ctx[data[1]]();
                    }
                    else if (paramsLen == 2) {
                        ctx[data[1]](data[2][0], data[2][1]);
                    }
                    else if (paramsLen == 4) {
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3]);
                    }
                    else if (paramsLen == 5) {
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], data[2][4]);
                    }
                    else if (paramsLen == 6) {
                        var lx = data[2][4];
                        var ly = data[2][5];
                        /* if (data[0] == 2) {
                             //位图填充
                             lx -= leftX;
                             ly -= leftY;
                         }*/
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], lx, ly);
                    }
                }
                else {
                    if (isMask) {
                        if (data[1] == "strokeStyle") {
                            isStroke = true;
                        }
                        else if (data[1] == "fillStyle") {
                            isStroke = false;
                        }
                    }
                    else {
                        ctx[data[1]] = data[2];
                    }
                }
            }
        };
        /**
         * 如果有的话,改变矢量对象的边框或者填充的颜色.
         * @method changeColor
         * @param {Object} infoObj
         * @param {string|any} infoObj.fillColor 填充颜色值，如"#fff" 或者 "rgba(255,255,255,1)"或者是annie.Shape.getGradientColor()方法返回的渐变对象;
         * @param {string} infoObj.strokeColor 线条颜色值，如"#fff" 或者 "rgba(255,255,255,1)";
         * @param {number} infoObj.lineWidth 线条的粗细，如"1,2,3...";
         * @public
         * @since 1.0.2
         * @return {void}
         */
        Shape.prototype.changeColor = function (infoObj) {
            var s = this;
            var cLen = s._command.length;
            var c = s._command;
            for (var i = 0; i < cLen; i++) {
                if (c[i][0] == 0) {
                    if (c[i][1] == "fillStyle" && infoObj.fillColor && c[i][2] != infoObj.fillColor) {
                        c[i][2] = infoObj.fillColor;
                        s.a2x_ut = true;
                    }
                    if (c[i][1] == "strokeStyle" && infoObj.strokeColor && c[i][2] != infoObj.strokeColor) {
                        c[i][2] = infoObj.strokeColor;
                        s.a2x_ut = true;
                    }
                    if (c[i][1] == "lineWidth" && infoObj.lineWidth && c[i][2] != infoObj.lineWidth) {
                        c[i][2] = infoObj.lineWidth;
                        s.a2x_ut = true;
                    }
                }
            }
        };
        Shape.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s._command = null;
            s._isBitmapStroke = null;
            s._isBitmapFill = null;
            _super.prototype.destroy.call(this);
        };
        Shape._caps = ["butt", "round", "square"];
        Shape._joins = ["miter", "round", "bevel"];
        return Shape;
    }(annie.DisplayObject));
    annie.Shape = Shape;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
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
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        /**
         * 构造函数
         * @method Sprite
         * @public
         * @since 1.0.0
         */
        function Sprite() {
            var _this = _super.call(this) || this;
            /**
             * 容器类所有动画的播放速度，默认是1.如果有嵌套的话，速度相乘；
             * @property mcSpeed
             * @public
             * @type {number}
             * @since 3.1.5
             * @default 1
             *
             */
            _this.mcSpeed = 1;
            _this._cMcSpeed = 1;
            /**
             * 是否可以让children接收鼠标事件
             * 鼠标事件将不会往下冒泡
             * @property mouseChildren
             * @type {boolean}
             * @default true
             * @public
             * @since 1.0.0
             */
            _this.mouseChildren = true;
            /**
             * 显示对象的child列表
             * @property children
             * @type {Array}
             * @public
             * @since 1.0.0
             * @default []
             * @readonly
             */
            _this.children = [];
            var s = _this;
            s._instanceType = "annie.Sprite";
            return _this;
        }
        Sprite.prototype.destroy = function () {
            var s = this;
            //让子级也destroy
            for (var i = 0; i < s.children.length; i++) {
                s.children[i].destroy();
            }
            if (s.parent instanceof annie.Sprite)
                Sprite._removeFormParent(s.parent, s);
            s.children = null;
            s._hitArea = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * 添加一个显示对象到Sprite
         * @method addChild
         * @param {annie.DisplayObject} child
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Sprite.prototype.addChild = function (child) {
            this.addChildAt(child, this.children.length);
        };
        /**
         * 从Sprite中移除一个child
         * @method removeChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         * @return {void}
         */
        Sprite.prototype.removeChild = function (child) {
            var s = this;
            var len = s.children.length;
            for (var i = 0; i < len; i++) {
                if (s.children[i] == child) {
                    s.removeChildAt(i);
                    break;
                }
            }
        };
        //全局遍历查找
        Sprite._getElementsByName = function (rex, root, isOnlyOne, isRecursive, resultList) {
            var len = root.children.length;
            if (len > 0) {
                var name_1;
                var child = void 0;
                for (var i = 0; i < len; i++) {
                    child = root.children[i];
                    name_1 = child.name;
                    if (name_1 && name_1 != "") {
                        if (rex.test(name_1)) {
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
        };
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
        Sprite.prototype.getChildByName = function (name, isOnlyOne, isRecursive) {
            if (isOnlyOne === void 0) { isOnlyOne = true; }
            if (isRecursive === void 0) { isRecursive = false; }
            if (!name)
                return null;
            var s = this;
            var rex;
            if (typeof (name) == "string") {
                rex = new RegExp("^" + name + "$");
            }
            else {
                rex = name;
            }
            var elements = [];
            Sprite._getElementsByName(rex, s, isOnlyOne, isRecursive, elements);
            var len = elements.length;
            if (len == 0) {
                return null;
            }
            else if (len == 1) {
                return elements[0];
            }
            else {
                return elements;
            }
        };
        /**
         * 添加一个child到Sprite中并指定添加到哪个层级
         * @method addChildAt
         * @param {annie.DisplayObject} child
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Sprite.prototype.addChildAt = function (child, index) {
            if (!(child instanceof annie.DisplayObject))
                return;
            var s = this;
            var len;
            var cp = child.parent;
            if (cp instanceof annie.Sprite) {
                Sprite._removeFormParent(cp, child);
            }
            len = s.children.length;
            if (index >= len) {
                s.children[len] = child;
            }
            else if (index == 0) {
                s.children.unshift(child);
            }
            else {
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
        };
        Sprite._removeFormParent = function (cp, child) {
            var cpc = cp.children;
            var len = cpc.length;
            for (var i = 0; i < len; i++) {
                if (cpc[i] == child) {
                    cpc.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {annie.DisplayObject}
         */
        Sprite.prototype.getChildAt = function (index) {
            if ((this.children.length - 1) >= index) {
                return this.children[index];
            }
            else {
                return null;
            }
        };
        /**
         * 获取Sprite中一个child所在的层级索引，找到则返回索引数，未找到则返回-1
         * @method getChildIndex
         * @param {annie.DisplayObject} child 子对象
         * @public
         * @since 1.0.2
         * @return {number}
         */
        Sprite.prototype.getChildIndex = function (child) {
            var s = this;
            var len = s.children.length;
            for (var i = 0; i < len; i++) {
                if (s.children[i] == child) {
                    return i;
                }
            }
            return -1;
        };
        /**
         * 交换两个显示对象的层级
         * @method swapChild
         * @param child1 显示对象，或者显示对象的索引
         * @param child2 显示对象，或者显示对象的索引
         * @since 2.0.0
         * @return {boolean}
         */
        Sprite.prototype.swapChild = function (child1, child2) {
            var s = this;
            var id1 = -1;
            var id2 = -1;
            var childCount = s.children.length;
            if (typeof (child1) == "number") {
                id1 = child1;
            }
            else {
                id1 = s.getChildIndex(child1);
            }
            if (typeof (child2) == "number") {
                id2 = child2;
            }
            else {
                id2 = s.getChildIndex(child2);
            }
            if (id1 == id2 || id1 < 0 || id1 >= childCount || id2 < 0 || id2 >= childCount) {
                return false;
            }
            else {
                var temp = s.children[id1];
                s.children[id1] = s.children[id2];
                s.children[id2] = temp;
                return true;
            }
        };
        /**
         * 移除指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Sprite.prototype.removeChildAt = function (index) {
            var s = this;
            var child;
            var len = s.children.length - 1;
            if (len < 0)
                return;
            if (index == len) {
                child = s.children.pop();
            }
            else if (index == 0) {
                child = s.children.shift();
            }
            else {
                child = s.children.splice(index, 1)[0];
            }
            if (s._isOnStage && child._isOnStage) {
                child._onRemoveEvent(false);
                child.stage = null;
            }
            child.parent = null;
        };
        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         * @return {void}
         */
        Sprite.prototype.removeAllChildren = function () {
            var s = this;
            var len = s.children.length;
            for (var i = len - 1; i >= 0; i--) {
                s.removeChildAt(0);
            }
        };
        Sprite.prototype.hitTestPoint = function (hitPoint, isGlobalPoint) {
            if (isGlobalPoint === void 0) { isGlobalPoint = false; }
            var s = this;
            if (!s._visible || !s.mouseEnable)
                return null;
            if (s._hitArea) {
                _super.prototype.hitTestPoint.call(this, hitPoint, isGlobalPoint);
                return;
            }
            var p = hitPoint;
            if (!isGlobalPoint) {
                p = s.localToGlobal(hitPoint, new annie.Point());
            }
            var len = s.children.length;
            var hitDisplayObject;
            var child;
            var maskObjList = {};
            //这里特别注意是从上往下遍历
            for (var i = len - 1; i >= 0; i--) {
                child = s.children[i];
                if (child._isUseToMask > 0)
                    continue;
                if (child.mask != void 0) {
                    if (maskObjList[child.mask._instanceId] == void 0) {
                        //看看点是否在遮罩内
                        if (child.mask.hitTestPoint(p, true)) {
                            //如果都不在遮罩里面,那还检测什么直接检测下一个
                            maskObjList[child.mask._instanceId] = true;
                        }
                        else {
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
        };
        Sprite.prototype.getBounds = function () {
            var s = this;
            var rect = s._bounds;
            rect.x = 0;
            rect.y = 0;
            rect.width = 0;
            rect.height = 0;
            var children = s.children, len = children.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    if (children[i].visible && children[i]._isUseToMask == 0)
                        children[i].getDrawRect();
                    annie.Rectangle.createFromRects(rect, annie.DisplayObject._transformRect);
                }
            }
            return rect;
        };
        Sprite.prototype._updateMatrix = function () {
            var s = this;
            if (s._visible) {
                _super.prototype._updateMatrix.call(this);
                var children = s.children;
                var len = children.length;
                for (var i = 0; i < len; i++) {
                    children[i]._updateMatrix();
                }
                s.a2x_ua = false;
                s.a2x_um = false;
            }
        };
        Sprite.prototype._render = function (renderObj) {
            var s = this;
            var len = s.children.length;
            if (s._visible && s._cAlpha > 0 && len > 0) {
                var children = s.children;
                var ro = renderObj;
                var maskObj = void 0;
                var child = void 0;
                for (var i = 0; i < len; i++) {
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
                        }
                        else {
                            ro.endMask();
                            maskObj = null;
                        }
                    }
                    else {
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
        };
        Sprite.prototype._onRemoveEvent = function (isReSetMc) {
            var s = this;
            var child = null;
            //这里用concat 隔离出一个新的children是非常重要的一步
            var children = s.children.concat();
            var len = children.length;
            for (var i = len - 1; i >= 0; i--) {
                child = children[i];
                if (child instanceof annie.DisplayObject && child._isOnStage) {
                    child._onRemoveEvent(isReSetMc);
                    child.stage = null;
                }
            }
            _super.prototype._onRemoveEvent.call(this, isReSetMc);
        };
        Sprite.prototype._onAddEvent = function () {
            var s = this;
            var child = null;
            //这里用concat 隔离出一个新的children是非常重要的一步
            var children = s.children.concat();
            var len = children.length;
            for (var i = len - 1; i >= 0; i--) {
                child = children[i];
                if (child instanceof annie.DisplayObject && !child._isOnStage) {
                    child.stage = s.stage;
                    child._onAddEvent();
                }
            }
            _super.prototype._onAddEvent.call(this);
        };
        Sprite.prototype._onUpdateFrame = function (mcSpeed, isOffCanvas) {
            if (mcSpeed === void 0) { mcSpeed = 1; }
            if (isOffCanvas === void 0) { isOffCanvas = false; }
            var s = this;
            s._cMcSpeed = s.mcSpeed * mcSpeed;
            _super.prototype._onUpdateFrame.call(this, s._cMcSpeed, isOffCanvas);
            var child = null;
            var children = s.children.concat();
            var len = children.length;
            for (var i = len - 1; i >= 0; i--) {
                child = children[i];
                if (child) {
                    child._onUpdateFrame(s._cMcSpeed, isOffCanvas);
                }
            }
        };
        return Sprite;
    }(annie.DisplayObject));
    annie.Sprite = Sprite;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    //declare let WeixinJSBridge:any;
    /**
     * 声音类
     * @class annie.Sound
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    var Sound = /** @class */ (function (_super) {
        __extends(Sound, _super);
        /**
         * 构造函数
         * @method Sound
         * @param {string} src
         * @param {string}type
         * @since 1.0.0
         */
        function Sound(src) {
            var _this = _super.call(this) || this;
            /**
             * html 标签 有可能是audio 或者 video
             * @property media
             * @type {Audio}
             * @public
             * @since 1.0.0
             */
            _this.media = null;
            _this._loop = 0;
            _this._repeate = 1;
            /**
             * 是否正在播放中
             * @property  isPlaying
             * @public
             * @since 2.0.0
             * @type {boolean}
             */
            _this.isPlaying = true;
            /**
             * 每个声音可以有个名字，并且不同的声音名字可以相同
             * @property name
             * @type {string}
             * @since 2.0.0
             */
            _this.name = "";
            var s = _this;
            s._instanceType = "annie.Sound";
            if (typeof src == "string") {
                s.media = annie.app.createInnerAudioContext();
                s.media.src = src;
            }
            else {
                s.media = src;
            }
            s.media.onEnded(function () {
                s.dispatchEvent("onPlayEnd");
                if (s._loop > 1) {
                    s._loop--;
                    s.media.startTime = 0;
                    s.media.play();
                }
            });
            s.media.onPlay(function () {
                s.dispatchEvent("onPlayStart");
            });
            s.media.onTimeUpdate(function () {
                s.dispatchEvent("onPlayUpdate", { currentTime: s.media.currentTime });
            });
            annie.Sound._soundList.push(s);
            return _this;
        }
        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        Sound.prototype.play = function (start, loop) {
            if (start === void 0) { start = 0; }
            if (loop === void 0) { loop = 0; }
            var s = this;
            s.media.startTime = start;
            if (loop == 0) {
                s._loop = s._repeate;
            }
            else {
                s._loop = loop;
                s._repeate = loop;
            }
            s.media.play();
            s.isPlaying = true;
        };
        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        Sound.prototype.stop = function () {
            var s = this;
            s.media.stop();
            s.isPlaying = false;
        };
        /**
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放
         * @since 1.0.4
         */
        Sound.prototype.pause = function (isPause) {
            if (isPause === void 0) { isPause = true; }
            var s = this;
            if (isPause) {
                s.media.pause();
                s.isPlaying = false;
            }
            else {
                s.media.play();
                s.isPlaying = true;
            }
        };
        Object.defineProperty(Sound.prototype, "volume", {
            /**
             * 设置或者获取音量 从0-1
             * @since 1.1.0
             * @property volume
             * @return {number}
             */
            get: function () {
                return this.media.volume;
            },
            set: function (value) {
                this.media.volume = value;
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.stop2 = function () {
            var s = this;
            if (s.isPlaying) {
                s.media.pause();
            }
        };
        Sound.prototype.play2 = function () {
            var s = this;
            if (s.isPlaying) {
                s.media.play();
            }
        };
        /**
         * 停止当前所有正在播放的声音，当然一定要是annie.Sound类的声音
         * @method stopAllSounds
         * @since 1.1.1
         * @static
         * @public
         */
        Sound.stopAllSounds = function () {
            var len = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].stop2();
                }
                else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
        };
        /**
         * 恢复当前所有正在停止的声音，当然一定要是annie.Sound类的声音
         * @method resumePlaySounds
         * @since 2.0.0
         * @static
         * @public
         */
        Sound.resumePlaySounds = function () {
            var len = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].play2();
                }
                else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
        };
        /**
         * 设置当前所有正在播放的声音，当然一定要是annie.Sound类的声音
         * @method setAllSoundsVolume
         * @since 1.1.1
         * @static
         * @public
         * @param {number} volume 音量大小，从0-1
         */
        Sound.setAllSoundsVolume = function (volume) {
            var len = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].volume = volume;
                }
                else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
            Sound._volume = volume;
        };
        Sound.prototype.destroy = function () {
            var s = this;
            var len = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i] == s) {
                    annie.Sound._soundList[i].stop();
                    annie.Sound._soundList.splice(i, 1);
                    break;
                }
            }
            s.media.offTimeUpdate();
            s.media.offPlay();
            s.media.offEnded();
            s.media = null;
        };
        //声音对象池
        Sound._soundList = [];
        Sound._volume = 1;
        return Sound;
    }(annie.EventDispatcher));
    annie.Sound = Sound;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * annie引擎核心类
     * @class annie.MovieClip
     * @since 1.0.0
     * @public
     * @extends annie.Sprite
     */
    var MovieClip = /** @class */ (function (_super) {
        __extends(MovieClip, _super);
        /**
         * 构造函数
         * @method MovieClip
         * @public
         * @since 1.0.0
         */
        function MovieClip() {
            var _this = _super.call(this) || this;
            _this._curFrame = 0;
            _this._wantFrame = 1;
            _this._lastFrameObj = null;
            _this._isPlaying = true;
            _this._isFront = true;
            //有可能帧数带有小数点
            _this._floatFrame = 0;
            //sprite 和 moveClip的类资源信息
            _this._a2x_res_class = { tf: 1 };
            _this._a2x_res_children = [];
            _this._a2x_script = null;
            //动画模式 按钮 剪辑 图形
            _this._a2x_mode = -2;
            _this._clicked = false;
            //flash声音管理
            _this._a2x_sounds = null;
            var s = _this;
            s._instanceType = "annie.MovieClip";
            return _this;
        }
        Object.defineProperty(MovieClip.prototype, "currentFrame", {
            //Events
            /**
             * annie.MovieClip 播放完成事件
             * @event annie.Event.END_FRAME
             * @type {string}
             * @static
             * @public
             * @since 1.0.0
             */
            /**
             * annie.MovieClip 帧标签事件
             * @event annie.Event.CALL_FRAME
             * @type {string}
             * @static
             * @public
             * @since 1.0.0
             */
            //
            /**
             * mc的当前帧
             * @property currentFrame
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             * @readonly
             */
            get: function () {
                var s = this;
                return s._wantFrame > 0 ? s._wantFrame : s._curFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "isPlaying", {
            /**
             * 当前动画是否处于播放状态
             * @property isPlaying
             * @readOnly
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default true
             * @readonly
             */
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "isFront", {
            /**
             * 动画的播放方向,是顺着播还是在倒着播
             * @property isFront
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default true
             * @readonly
             */
            get: function () {
                return this._isFront;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "totalFrames", {
            /**
             * 当前动画的总帧数
             * @property totalFrames
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             * @readonly
             */
            get: function () {
                return this._a2x_res_class.tf;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         * @return {void}
         */
        MovieClip.prototype.stop = function () {
            var s = this;
            s._isPlaying = false;
        };
        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括Fla文件中当前帧的代码.
         * @method addFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex {number} 要将代码添加到哪一帧,从0开始.0就是第一帧,1是第二帧...
         * @param {Function}frameScript {Function} 时间轴播放到当前帧时要执行回调方法
         */
        MovieClip.prototype.addFrameScript = function (frameIndex, frameScript) {
            var s = this;
            if (!(s._a2x_script instanceof Object))
                s._a2x_script = {};
            s._a2x_script[frameIndex] = frameScript;
        };
        /**
         * 移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex
         */
        MovieClip.prototype.removeFrameScript = function (frameIndex) {
            var s = this;
            if (s._a2x_script instanceof Object)
                s._a2x_script[frameIndex] = null;
        };
        Object.defineProperty(MovieClip.prototype, "isButton", {
            /**
             * 确认是不是按钮形态
             * @property isButton
             * @type {boolean}
             * @public
             * @since 2.0.0
             * @default false
             */
            get: function () {
                return this._a2x_mode == -1;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码.
         * 此方法不可逆，设置后不再能设置回剪辑，一定要这么做的话，请联系作者，看作者答不答应
         * @method initButton
         * @public
         * @since 1.0.0
         * @return {void}
         */
        MovieClip.prototype.initButton = function () {
            var s = this;
            if (s._a2x_mode != -1 && s._a2x_res_class.tf > 1) {
                s.mouseChildren = false;
                //将mc设置成按钮形式
                s.addEventListener("onMouseDown", s._mouseEvent.bind(s));
                s.addEventListener("onMuseOver", s._mouseEvent.bind(s));
                s.addEventListener("onMouseUp", s._mouseEvent.bind(s));
                s.addEventListener("onMouseOut", s._mouseEvent.bind(s));
                s._a2x_mode = -1;
                if (s._clicked) {
                    if (s.totalFrames > 2) {
                        s.gotoAndStop(3);
                    }
                    else {
                        s.gotoAndStop(2);
                    }
                }
                else {
                    s.gotoAndStop(1);
                }
            }
        };
        Object.defineProperty(MovieClip.prototype, "clicked", {
            /**
             * 如果MovieClip设置成了按钮，则通过此属性可以让它定在按下后的状态上，哪怕再点击它并离开它的时候，他也不会变化状态
             * @property clicked
             * @return {boolean}
             * @public
             * @since 2.0.0
             */
            get: function () {
                return this._clicked;
            },
            set: function (value) {
                var s = this;
                if (value != s._clicked) {
                    if (value) {
                        s._mouseEvent({ type: "onMouseDown" });
                    }
                    else {
                        s.gotoAndStop(1);
                    }
                    s._clicked = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype._mouseEvent = function (e) {
            var s = this;
            if (!s._clicked) {
                var frame = 2;
                if (e.type == "onMouseDown") {
                    if (s.totalFrames > 2) {
                        frame = 3;
                    }
                }
                else if (e.type == "onMouseOver") {
                    if (s.totalFrames > 1) {
                        frame = 2;
                    }
                }
                else {
                    frame = 1;
                }
                s.gotoAndStop(frame);
            }
        };
        ;
        /**
         * movieClip的当前帧的标签数组,没有则为null
         * @method getCurrentLabel
         * @public
         * @since 1.0.0
         * @return {Array}
         * */
        MovieClip.prototype.getCurrentLabel = function () {
            var s = this;
            if (s._a2x_res_class.tf > 1 && s._a2x_res_class.l[s._curFrame - 1]) {
                return s._a2x_res_class.l[s._curFrame - 1];
            }
            return null;
        };
        /**
         * 将播放头向后移一帧并停在下一帧,如果本身在最后一帧则不做任何反应
         * @method nextFrame
         * @since 1.0.0
         * @public
         * @return {void}
         */
        MovieClip.prototype.nextFrame = function () {
            var s = this;
            s._wantFrame += s._cMcSpeed;
            if (s._wantFrame > s._a2x_res_class.tf) {
                s._wantFrame = s._a2x_res_class.tf;
            }
            s._isPlaying = false;
            s._onCheckUpdateFrame();
        };
        /**
         * 将播放头向前移一帧并停在下一帧,如果本身在第一帧则不做任何反应
         * @method prevFrame
         * @since 1.0.0
         * @public
         * @return {void}
         */
        MovieClip.prototype.prevFrame = function () {
            var s = this;
            s._wantFrame -= s._cMcSpeed;
            if (s._wantFrame < 1) {
                s._wantFrame = 1;
            }
            s._isPlaying = false;
            s._onCheckUpdateFrame();
        };
        /**
         * 将播放头跳转到指定帧并停在那一帧,如果本身在第一帧则不做任何反应
         * @method gotoAndStop
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex 批定帧的帧数或指定帧的标签名
         * @return {void}
         */
        MovieClip.prototype.gotoAndStop = function (frameIndex) {
            var s = this;
            var timeLineObj = s._a2x_res_class;
            var isOkFrameIndex = false;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                    isOkFrameIndex = true;
                }
            }
            else if (typeof (frameIndex) == "number") {
                if (frameIndex >= 1 && frameIndex <= timeLineObj.tf) {
                    isOkFrameIndex = true;
                }
            }
            if (isOkFrameIndex) {
                s._isPlaying = false;
                s._floatFrame = 0;
                s._wantFrame = frameIndex;
                s._onCheckUpdateFrame();
            }
        };
        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @param {boolean} isFront true向前播放，false 向后播放。默认向前
         * @public
         * @since 1.0.0
         * @return {void}
         */
        MovieClip.prototype.play = function (isFront) {
            if (isFront === void 0) { isFront = true; }
            var s = this;
            s._isPlaying = true;
            s._isFront = isFront;
        };
        /**
         * 将播放头跳转到指定帧并从那一帧开始继续播放
         * @method gotoAndPlay
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         * @return {void}
         */
        MovieClip.prototype.gotoAndPlay = function (frameIndex, isFront) {
            if (isFront === void 0) { isFront = true; }
            var s = this;
            var timeLineObj = s._a2x_res_class;
            var isOkFrameIndex = false;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                    isOkFrameIndex = true;
                }
            }
            else if (typeof (frameIndex) == "number") {
                if (frameIndex >= 1 && frameIndex <= timeLineObj.tf) {
                    isOkFrameIndex = true;
                }
            }
            if (isOkFrameIndex) {
                s._isPlaying = true;
                s._isFront = isFront;
                s._floatFrame = 0;
                s._wantFrame = frameIndex;
                s._onCheckUpdateFrame();
            }
        };
        MovieClip.prototype._onCheckUpdateFrame = function () {
            var s = this;
            if (s._wantFrame != s._curFrame) {
                if (s._isOnStage) {
                    s._updateTimeline();
                }
            }
        };
        MovieClip.prototype._onAddEvent = function () {
            _super.prototype._onAddEvent.call(this);
            this._onCheckUpdateFrame();
        };
        MovieClip.prototype._updateTimeline = function () {
            var s = this;
            if (s._a2x_res_class.tf > 1) {
                if (s._a2x_mode >= 0) {
                    s._isPlaying = false;
                    if (s.parent instanceof annie.MovieClip) {
                        s._wantFrame = s.parent._wantFrame - s._a2x_mode;
                    }
                    else {
                        s._wantFrame = 1;
                    }
                }
                else {
                    if (s._isPlaying && s._wantFrame == s._curFrame && s._visible) {
                        if (s._isFront) {
                            s._wantFrame += s._cMcSpeed;
                            if (s._wantFrame > s._a2x_res_class.tf) {
                                s._wantFrame = 1;
                            }
                        }
                        else {
                            s._wantFrame -= s._cMcSpeed;
                            if (s._wantFrame < 1) {
                                s._wantFrame = s._a2x_res_class.tf;
                            }
                        }
                    }
                }
                if (s._wantFrame != s._curFrame) {
                    var curFrame = Math.floor(s._curFrame);
                    var wantFrame = Math.floor(s._wantFrame);
                    s._floatFrame = s._wantFrame - wantFrame;
                    s._curFrame = s._wantFrame;
                    if (curFrame != wantFrame) {
                        s.a2x_uf = true;
                        var timeLineObj = s._a2x_res_class;
                        //先确定是哪一帧
                        var allChildren = s._a2x_res_children;
                        var childCount = allChildren.length;
                        var objId = 0;
                        var obj = null;
                        var objInfo = null;
                        var frameIndex = wantFrame - 1;
                        var curFrameScript = void 0;
                        var isFront = s._isFront;
                        var curFrameObj = timeLineObj.f[timeLineObj.timeLine[frameIndex]];
                        var addChildren = [];
                        var remChildren = [];
                        if (s._lastFrameObj != curFrameObj) {
                            s._lastFrameObj = curFrameObj;
                            s.children.length = 0;
                            var maskObj = null;
                            var maskTillId = -1;
                            for (var i = childCount - 1; i >= 0; i--) {
                                objId = allChildren[i][0];
                                obj = allChildren[i][1];
                                if (curFrameObj instanceof Object && curFrameObj.c instanceof Object) {
                                    objInfo = curFrameObj.c[objId];
                                }
                                else {
                                    objInfo = null;
                                }
                                if (objInfo instanceof Object) {
                                    //这个对象有可能是新来的，有可能是再次进入帧里的。需要对他进行初始化
                                    annie.d(obj, objInfo, true);
                                    // 检查是否有遮罩
                                    if (objInfo.ma != undefined) {
                                        maskObj = obj;
                                        maskTillId = objInfo.ma;
                                    }
                                    else if (maskObj instanceof Object) {
                                        obj.mask = maskObj;
                                        if (objId == maskTillId) {
                                            maskObj = null;
                                        }
                                    }
                                    s.children.unshift(obj);
                                    if (!obj._isOnStage) {
                                        //证明是这一帧新添加进来的，所以需要执行添加事件
                                        addChildren.unshift(obj);
                                    }
                                }
                                else if (obj._isOnStage) {
                                    //这个对象在上一帧存在，这一帧不存在，所以需要执行删除事件
                                    remChildren.unshift(obj);
                                }
                            }
                            if (s._floatFrame > 0) {
                                //帧数带小数点的，所以执行微调
                                s._updateFrameGap();
                            }
                            var count = addChildren.length;
                            for (var i = 0; i < count; i++) {
                                obj = addChildren[i];
                                if (!obj._isOnStage && s._isOnStage) {
                                    obj._cp = true;
                                    obj.parent = s;
                                    obj.stage = s.stage;
                                    obj._onAddEvent();
                                }
                            }
                            count = remChildren.length;
                            for (var i = 0; i < count; i++) {
                                obj = remChildren[i];
                                if (obj._isOnStage && s._isOnStage) {
                                    obj._onRemoveEvent(true);
                                    obj.stage = null;
                                    obj.parent = null;
                                }
                            }
                        }
                        //如果发现不是图形动画，则执行脚本
                        if (s._a2x_mode < 0) {
                            //更新完所有后再来确定事件和脚本
                            var isCodeScript = false;
                            //有没有用户后期通过代码调用加入的脚本,有就直接调用然后不再调用时间轴代码
                            if (s._a2x_script instanceof Object) {
                                curFrameScript = s._a2x_script[frameIndex];
                                if (curFrameScript instanceof Function) {
                                    curFrameScript();
                                    isCodeScript = true;
                                }
                            }
                            //有没有用户后期通过代码调用加入的脚本,没有再检查有没有时间轴代码
                            if (!isCodeScript) {
                                curFrameScript = timeLineObj.a[frameIndex];
                                if (curFrameScript instanceof Array) {
                                    s[curFrameScript[0]](curFrameScript[1] == undefined ? true : curFrameScript[1], curFrameScript[2] == undefined ? true : curFrameScript[2]);
                                }
                            }
                            //有没有帧事件
                            curFrameScript = timeLineObj.e[frameIndex];
                            if (curFrameScript instanceof Array) {
                                for (var i = 0; i < curFrameScript.length; i++) {
                                    //抛事件
                                    s.dispatchEvent(annie.Event.CALL_FRAME, {
                                        frameIndex: s._curFrame,
                                        frameName: curFrameScript[i]
                                    });
                                }
                            }
                            //有没有去到帧的最后一帧
                            if (((s._curFrame == 1 && !isFront) || (s._curFrame == s._a2x_res_class.tf && isFront)) && s.hasEventListener(annie.Event.END_FRAME)) {
                                s.dispatchEvent(annie.Event.END_FRAME, {
                                    frameIndex: s._curFrame,
                                    frameName: "endFrame"
                                });
                            }
                        }
                        //有没有声音
                        var curFrameSound = timeLineObj.s[frameIndex];
                        if (curFrameSound instanceof Object) {
                            for (var sound in curFrameSound) {
                                s._a2x_sounds[sound - 1].play(0, curFrameSound[sound]);
                            }
                        }
                    }
                    else if (s._floatFrame > 0) {
                        //帧数带小数点的，所以执行微调
                        s._updateFrameGap();
                    }
                }
            }
        };
        MovieClip.prototype._onUpdateFrame = function (mcSpeed, isOffCanvas) {
            if (mcSpeed === void 0) { mcSpeed = 1; }
            if (isOffCanvas === void 0) { isOffCanvas = false; }
            var s = this;
            var playStatus;
            if (isOffCanvas) {
                playStatus = s._isPlaying;
                s._isPlaying = false;
            }
            s._updateTimeline();
            if (isOffCanvas) {
                s._isPlaying = playStatus;
            }
            _super.prototype._onUpdateFrame.call(this, mcSpeed, isOffCanvas);
        };
        MovieClip.prototype._onRemoveEvent = function (isReSetMc) {
            _super.prototype._onRemoveEvent.call(this, isReSetMc);
            if (isReSetMc)
                MovieClip._resetMC(this);
        };
        MovieClip.prototype._updateFrameGap = function () {
            var s = this;
            /*s.a2x_uf=true;*/
            var timeLineObj = s._a2x_res_class;
            //先确定是哪一帧
            var allChildren = s._a2x_res_children;
            var childCount = allChildren.length;
            var objId = 0;
            var obj = null;
            var nextObjInfo = null;
            var curObjInfo = null;
            var nextFrameIndex = Math.floor(s._curFrame);
            var curFrameObj = s._lastFrameObj;
            var ff = s._floatFrame;
            var nextFrameObj = timeLineObj.f[timeLineObj.timeLine[nextFrameIndex]];
            for (var i = childCount - 1; i >= 0; i--) {
                objId = allChildren[i][0];
                obj = allChildren[i][1];
                if (nextFrameObj && nextFrameObj.c && curFrameObj && curFrameObj.c) {
                    nextObjInfo = nextFrameObj.c[objId];
                    curObjInfo = curFrameObj.c[objId];
                    //更新对象信息
                    if (curObjInfo != void 0 && nextObjInfo != void 0) {
                        if (nextObjInfo.tr == void 0 || nextObjInfo.tr.length == 1) {
                            nextObjInfo.tr = [0, 0, 1, 1, 0, 0];
                        }
                        if (nextObjInfo.al == void 0) {
                            nextObjInfo.al = 1;
                        }
                        if (!obj._changeTransformInfo[0]) {
                            obj._x = curObjInfo.tr[0] + (nextObjInfo.tr[0] - curObjInfo.tr[0]) * ff;
                        }
                        if (!obj._changeTransformInfo[1]) {
                            obj._y = curObjInfo.tr[1] + (nextObjInfo.tr[1] - curObjInfo.tr[1]) * ff;
                        }
                        if (!obj._changeTransformInfo[2]) {
                            obj._scaleX = curObjInfo.tr[2] + (nextObjInfo.tr[2] - curObjInfo.tr[2]) * ff;
                        }
                        if (!obj._changeTransformInfo[3]) {
                            obj._scaleY = curObjInfo.tr[3] + (nextObjInfo.tr[3] - curObjInfo.tr[3]) * ff;
                        }
                        if (!obj._changeTransformInfo[4]) {
                            var sx = nextObjInfo.tr[4] - curObjInfo.tr[4];
                            var sy = nextObjInfo.tr[5] - curObjInfo.tr[5];
                            if (sx > 180) {
                                sx -= 360;
                            }
                            else if (sx < -180) {
                                sx += 360;
                            }
                            if (sy > 180) {
                                sy -= 360;
                            }
                            else if (sy < -180) {
                                sy += 360;
                            }
                            obj._skewX = curObjInfo.tr[4] + sx * ff;
                            obj._skewY = curObjInfo.tr[5] + sy * ff;
                        }
                        if (!obj._changeTransformInfo[5]) {
                            obj._alpha = curObjInfo.al + (nextObjInfo.al - curObjInfo.al) * ff;
                            obj.a2x_ua = true;
                        }
                        obj.a2x_um = true;
                    }
                }
            }
            s._floatFrame = 0;
        };
        MovieClip._resetMC = function (obj) {
            //判断obj是否是动画,是的话则还原成动画初始时的状态
            obj._wantFrame = 1;
            obj._curFrame = 0;
            obj._isFront = true;
            obj._floatFrame = 0;
            if (obj._a2x_mode < -1) {
                obj._isPlaying = true;
            }
            else {
                obj._isPlaying = false;
            }
        };
        MovieClip.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            _super.prototype.destroy.call(this);
            s._lastFrameObj = null;
            s._a2x_script = null;
            s._a2x_res_children = null;
            s._a2x_res_class = null;
            s._a2x_sounds = null;
        };
        return MovieClip;
    }(annie.Sprite));
    annie.MovieClip = MovieClip;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 动态文本类,有时需要在canvas里有一个动态文本,能根据我们的显示内容来改变
     * @class annie.TextField
     * @extends annie.Bitmap
     * @since 1.0.0
     * @public
     */
    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this) || this;
            _this._textAlign = "left";
            _this._textAlpha = 1;
            _this._textHeight = 0;
            _this._lineHeight = 14;
            _this._textWidth = 120;
            _this._lineType = "single";
            _this._text = "";
            _this._font = "Arial";
            _this._size = 12;
            _this._color = "#fff";
            _this._italic = false;
            _this._bold = false;
            _this._border = false;
            _this._stroke = 0;
            _this._strokeColor = "#000";
            _this.realLines = [];
            _this.a2x_ut = true;
            _this._instanceType = "annie.TextField";
            return _this;
        }
        Object.defineProperty(TextField.prototype, "textAlign", {
            get: function () {
                return this._textAlign;
            },
            /**
             * 文本的对齐方式
             * @property textAlign
             * @public
             * @since 1.0.0
             * @type {string}
             * @default left
             */
            set: function (value) {
                var s = this;
                if (value != s._textAlign) {
                    s._textAlign = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textAlpha", {
            get: function () {
                return this._textAlpha;
            },
            /**
             * @property textAlpha
             * @since 2.0.0
             * @public
             */
            set: function (value) {
                var s = this;
                if (value != s._textAlpha) {
                    s._textAlpha = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textHeight", {
            get: function () {
                return this._textHeight;
            },
            /**
             * 文本的行高
             * @property textHeight
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            set: function (value) {
                var s = this;
                if (value != s._textHeight) {
                    s._textHeight = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "lineHeight", {
            get: function () {
                return this._lineHeight;
            },
            /**
             * @property lineHeight
             * @public
             * @since 1.0.0
             * @param {number} value
             */
            set: function (value) {
                var s = this;
                if (value != s._lineHeight) {
                    s._lineHeight = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textWidth", {
            get: function () {
                return this._textWidth;
            },
            /**
             * 文本的宽
             * @property textWidth
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            set: function (value) {
                var s = this;
                if (value != s._textWidth) {
                    s._textWidth = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "lineType", {
            get: function () {
                return this._lineType;
            },
            /**
             * 文本类型,单行还是多行 single multi
             * @property lineType
             * @public
             * @since 1.0.0
             * @type {string} 两种 single和multi
             * @default single
             */
            set: function (value) {
                var s = this;
                if (value != s._lineType) {
                    s._lineType = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this._text;
            },
            /**
             * 文本内容
             * @property text
             * @type {string}
             * @public
             * @default ""
             * @since 1.0.0
             */
            set: function (value) {
                var s = this;
                value += "";
                if (value != s._text) {
                    s._text = value;
                    if (s._text == "") {
                        s.a2x_ut = false;
                        s.clearBounds();
                    }
                    else {
                        s.a2x_ut = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "font", {
            get: function () {
                return this._font;
            },
            /**
             * 文本的css字体样式
             * @property font
             * @public
             * @since 1.0.0
             * @type {string}
             * @default 12px Arial
             */
            set: function (value) {
                var s = this;
                if (value != s._font) {
                    s._font = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "size", {
            get: function () {
                return this._size;
            },
            /**
             * 文本的size
             * @property size
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 12
             */
            set: function (value) {
                var s = this;
                if (value != s._size) {
                    s._size = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "color", {
            get: function () {
                return this._color;
            },
            /**
             * 文本的颜色值
             * @property color
             * @type {string}
             * @public
             * @since 1.0.0
             * @default #fff
             */
            set: function (value) {
                var s = this;
                if (value != s._color) {
                    s._color = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "italic", {
            get: function () {
                return this._italic;
            },
            /**
             * 文本是否倾斜
             * @property italic
             * @public
             * @since
             * @default false
             * @type {boolean}
             */
            set: function (value) {
                var s = this;
                if (value != s._italic) {
                    s._italic = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "bold", {
            get: function () {
                return this._bold;
            },
            /**
             * 文本是否加粗
             * @property bold
             * @public
             * @since
             * @default false
             * @type {boolean}
             */
            set: function (value) {
                var s = this;
                if (value != s._bold) {
                    s._bold = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "border", {
            get: function () {
                return this._border;
            },
            /**
             * 设置或获取是否有边框
             * @property property
             * @param {boolean} show true或false
             * @public
             * @since 1.0.6
             */
            set: function (value) {
                var s = this;
                if (value != s._border) {
                    s._border = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "stroke", {
            get: function () {
                return this._stroke;
            },
            /**
             * 描边宽度 默认为0，不显示. 值为正数则是外描边，值为负数则是内描边
             * @property stroke
             * @param {number} value
             * @since 2.0.2
             */
            set: function (value) {
                var s = this;
                if (value != s._stroke) {
                    s._stroke = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "strokeColor", {
            get: function () {
                return this._strokeColor;
            },
            /**
             * 描边颜色 默认黑色
             * @property strokeColor
             * @param {string} value
             * @since 2.0.2
             */
            set: function (value) {
                var s = this;
                if (value != s._strokeColor) {
                    s._strokeColor = value;
                    s.a2x_ut = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        //设置文本在canvas里的渲染样式
        TextField.prototype._prepContext = function (ctx) {
            var s = this;
            var font = s.size || 12;
            font += "px ";
            font += s.font;
            //font-weight:bold;font-style:italic;
            if (s._bold) {
                font = "bold " + font;
            }
            if (s._italic) {
                font = "italic " + font;
            }
            ctx.font = font;
            ctx.textAlign = s._textAlign || "left";
            ctx.textBaseline = "top";
            ctx.lineJoin = "miter";
            ctx.miterLimit = 2.5;
            ctx.fillStyle = annie.Shape.getRGBA(s._color, s._textAlpha);
            //实线文字
            ctx.strokeStyle = s.strokeColor;
            ctx.lineWidth = Math.abs(s._stroke);
        };
        Object.defineProperty(TextField.prototype, "lines", {
            /**
             * 获取当前文本行数
             * @property lines
             * @type {number}
             * @public
             * @readonly
             * @since 2.0.0
             */
            get: function () {
                return this.realLines.length;
            },
            enumerable: true,
            configurable: true
        });
        // 获取文本宽
        TextField.prototype._getMeasuredWidth = function (text) {
            var ctx = annie.CanvasRender._ctx;
            //ctx.save();
            var w = ctx.measureText(text).width;
            //ctx.restore();
            return w;
        };
        TextField.prototype._updateMatrix = function (isOffCanvas) {
            if (isOffCanvas === void 0) { isOffCanvas = false; }
            var s = this;
            _super.prototype._updateMatrix.call(this);
            if (s.a2x_ut) {
                var ctx = annie.CanvasRender._ctx;
                s.a2x_ut = false;
                var hardLines = s._text.toString().split(/(?:\r\n|\r|\n)/);
                s.realLines.length = 0;
                var realLines = s.realLines;
                s._prepContext(ctx);
                var wordW = 0;
                var lineH = s._lineHeight;
                if (s._text.indexOf("\n") < 0 && s.lineType == "single") {
                    realLines[realLines.length] = hardLines[0];
                    var str = hardLines[0];
                    var lineW = s._getMeasuredWidth(str);
                    if (lineW > s._textWidth) {
                        var w = s._getMeasuredWidth(str[0]);
                        var lineStr = str[0];
                        var strLen = str.length;
                        for (var j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
                                realLines[0] = lineStr;
                                break;
                            }
                            else {
                                lineStr += str[j];
                            }
                        }
                    }
                }
                else {
                    for (var i = 0, l = hardLines.length; i < l; i++) {
                        var str = hardLines[i];
                        if (!str)
                            continue;
                        var w = s._getMeasuredWidth(str[0]);
                        var lineStr = str[0];
                        var strLen = str.length;
                        for (var j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
                                realLines[realLines.length] = lineStr;
                                lineStr = str[j];
                                w = wordW;
                            }
                            else {
                                lineStr += str[j];
                            }
                        }
                        realLines[realLines.length] = lineStr;
                    }
                }
                var maxH = lineH * realLines.length + 4 >> 0;
                var maxW = s._textWidth >> 0;
                s._offsetX = 2;
                if (s._textAlign == "center") {
                    s._offsetX += maxW * 0.5;
                }
                else if (s._textAlign == "right") {
                    s._offsetX += maxW;
                }
                s._bounds.width = maxW;
                s._bounds.height = maxH;
                s.a2x_um = true;
            }
            if (s.a2x_um) {
                s._checkDrawBounds();
            }
            s.a2x_um = false;
            s.a2x_ua = false;
        };
        TextField.prototype._draw = function (ctx, isMask) {
            if (isMask === void 0) { isMask = false; }
            var s = this;
            var realLines = s.realLines;
            var lineHeight = s._lineHeight;
            var w = s._bounds.width;
            s._prepContext(ctx);
            ctx.translate(s._offsetX, s._offsetY);
            for (var i = 0; i < realLines.length; i++) {
                if (s._stroke > 0) {
                    ctx.strokeText(realLines[i], 0, i * lineHeight, w);
                }
                ctx.fillText(realLines[i], 0, i * lineHeight, w);
                if (s._stroke < 0) {
                    ctx.strokeText(realLines[i], 0, i * lineHeight, w);
                }
            }
        };
        return TextField;
    }(annie.DisplayObject));
    annie.TextField = TextField;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    var Stage = /** @class */ (function (_super) {
        __extends(Stage, _super);
        /**
         * 显示对象入口函数
         * @method Stage
         * @param {Object} canvas
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {number} renderType 渲染模式0:canvas 1:webGl 2:dom
         * @public
         * @since 1.0.0
         */
        function Stage(canvas, desW, desH, frameRate, scaleMode, renderType) {
            if (desW === void 0) { desW = 640; }
            if (desH === void 0) { desH = 1040; }
            if (frameRate === void 0) { frameRate = 30; }
            if (scaleMode === void 0) { scaleMode = "fixedHeight"; }
            if (renderType === void 0) { renderType = 0; }
            var _this = _super.call(this) || this;
            /**
             * annie.Stage舞台初始化完成后会触发的事件
             * @event annie.Event.ON_INIT_STAGE
             * @since 1.0.0
             */
            /**
             * annie引擎暂停或者恢复暂停时触发，这个事件只能在annie.globalDispatcher中监听
             * @event annie.Event.ON_RUN_CHANGED
             * @since 1.0.0
             */
            /**
             * annie.Stage 的多点触碰事件。这个事件只能在annie.Stage对象上侦听
             * @event annie.TouchEvent.ON_MULTI_TOUCH
             * @type {string}
             */
            /**
             * 当前stage所使用的渲染器
             * 渲染器有两种,一种是canvas 一种是webGl
             * @property renderObj
             * @public
             * @since 1.0.0
             * @type {IRender}
             * @default null
             */
            _this.renderObj = null;
            /**
             * 渲染模式值 只读 CANVAS:0, webGl: 1
             * @property renderType
             * @readonly
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             * @readonly
             */
            _this.renderType = 0;
            _this._viewRect = new annie.Rectangle();
            /**
             * 开启或关闭多点手势事件 目前仅支持两点 旋转 缩放
             * @property isMultiTouch
             * @since 1.0.3
             * @type {boolean}
             */
            _this.isMultiTouch = false;
            /**
             * 开启或关闭多个手指的鼠标事件
             * @property isMultiMouse
             * @since 1.1.3
             * @type {boolean}
             */
            _this.isMultiMouse = false;
            /**
             * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
             * 当设备尺寸更新，或者旋转后是否自动更新舞台方向
             * 默认不开启
             * @property autoSteering
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default false
             */
            _this.autoSteering = false;
            /**
             * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
             * 当设备尺寸更新，或者旋转后是否自动更新舞台尺寸
             * 默认不开启
             * @property autoResize
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default false
             */
            _this.autoResize = false;
            /**
             * 舞台的尺寸宽,也就是我们常说的设计尺寸
             * @property desWidth
             * @public
             * @since 1.0.0
             * @default 320
             * @type {number}
             * @readonly
             */
            _this.desWidth = 0;
            /**
             * 舞台的尺寸高,也就是我们常说的设计尺寸
             * @property desHeight
             * @public
             * @since 1.0.0
             * @default 240
             * @type {number}
             * @readonly
             */
            _this.desHeight = 0;
            /**
             * 舞台在当前设备中的真实高
             * @property divHeight
             * @public
             * @since 1.0.0
             * @default 320
             * @type {number}
             * @readonly
             */
            _this.divHeight = 0;
            /**
             * 舞台在当前设备中的真实宽
             * @property divWidth
             * @public
             * @since 1.0.0
             * @default 240
             * @readonly
             * @type {number}
             */
            _this.divWidth = 0;
            /**
             * 舞台的背景色
             * 默认为""就是透明背景
             * 可能设置一个颜色值改变舞台背景
             * @property bgColor
             * @public
             * @since 1.0.0
             * @type {string} #FFFFFF" 或 RGB(255,255,255) 或 RGBA(255,255,255,255)
             */
            _this.bgColor = "";
            _this._scaleMode = "onScale";
            _this._lastDpList = {};
            //这个是鼠标事件的MouseEvent对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
            _this._ml = [];
            //这个是事件中用到的Point对象池,以提高性能
            _this._mp = [];
            // 鼠标按下事件的对象池
            _this._mouseDownPoint = {};
            //html的鼠标或单点触摸对应的引擎事件类型名
            _this._mouseEventTypes = {
                mousedown: "onMouseDown",
                mouseup: "onMouseUp",
                mousemove: "onMouseMove",
                touchstart: "onMouseDown",
                touchmove: "onMouseMove",
                touchend: "onMouseUp",
                touchcancel: "onMouseUp",
                ontouchstart: "onMouseDown",
                ontouchmove: "onMouseMove",
                ontouchend: "onMouseUp",
                ontouchcancel: "onMouseUp"
            };
            //stageMousePoint
            _this.sp = new annie.Point();
            //localPoint;
            _this.lp = new annie.Point();
            _this.muliPoints = [];
            //当document有鼠标或触摸事件时调用
            _this._mP1 = new annie.Point();
            //当document有鼠标或触摸事件时调用
            _this._mP2 = new annie.Point();
            /**
             * 当舞台尺寸发生改变时,如果stage autoResize 为 true，则此方法会自己调用；
             * 如果设置stage autoResize 为 false 你需要手动调用此方法以更新界面.
             * 不管autoResize 的状态是什么，你只要侦听 了stage 的 annie.Event.RESIZE 事件
             * 都可以接收到舞台变化的通知。
             * @method resize
             * @public
             * @since 1.0.0
             * @return {void}
             */
            _this.resize = function () {
                var s = this;
                var w = annie.CanvasRender.rootContainer.width;
                var h = annie.CanvasRender.rootContainer.height;
                if (s.divWidth == 0 || s.divHeight == 0) {
                    s.a2x_um = true;
                    s.divWidth = w;
                    s.divHeight = h;
                    s.renderObj.reSize(w, h);
                    s.setAlign();
                    s.dispatchEvent("onInitStage");
                }
                else if (s.autoResize) {
                    if (s.divWidth != w || s.divHeight != h) {
                        s.a2x_um = true;
                        s.divHeight = h;
                        s.divWidth = w;
                        s.renderObj.reSize(w, h);
                        s.setAlign();
                        s.dispatchEvent("onResize");
                    }
                }
            };
            var s = _this;
            s.a2x_ua = true;
            s.a2x_um = true;
            s._instanceType = "annie.Stage";
            s.stage = s;
            s._isOnStage = true;
            s.name = "rootStage";
            s.renderType = renderType;
            s.desWidth = desW;
            s.desHeight = desH;
            s.setFrameRate(frameRate);
            s._scaleMode = scaleMode;
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            s.mouseEvent = s._onMouseEvent.bind(s);
            if (annie.isSharedCanvas) {
                annie.CanvasRender.rootContainer = annie.app.getSharedCanvas();
                annie.globalDispatcher.addEventListener("onMainStageMsg", function (e) {
                    switch (e.data.type) {
                        case annie.MouseEvent.CLICK:
                        case annie.MouseEvent.MOUSE_MOVE:
                        case annie.MouseEvent.MOUSE_UP:
                        case annie.MouseEvent.MOUSE_DOWN:
                        case annie.MouseEvent.MOUSE_OVER:
                        case annie.MouseEvent.MOUSE_OUT:
                            var event_1 = new annie.MouseEvent(e.data.type);
                            event_1.reset(e.data.type, s);
                            event_1.clientX = event_1.stageX = event_1.localX = e.data.x;
                            event_1.clientY = event_1.stageY = event_1.localY = e.data.y;
                            s.dispatchEvent(event_1);
                            break;
                        default:
                    }
                });
            }
            else {
                var sysInfo = annie.app.getSystemInfoSync();
                var canvas_1 = annie.app.createCanvas();
                canvas_1.width = sysInfo.windowWidth * sysInfo.pixelRatio;
                canvas_1.height = sysInfo.windowHeight * sysInfo.pixelRatio;
                annie.CanvasRender.rootContainer = canvas_1;
                annie.app.onTouchStart(function (e) {
                    s.mouseEvent(e);
                });
                annie.app.onTouchMove(function (e) {
                    s.mouseEvent(e);
                });
                annie.app.onTouchEnd(function (e) {
                    s.mouseEvent(e);
                });
                annie.app.onTouchCancel(function (e) {
                    s.mouseEvent(e);
                });
            }
            annie.OffCanvasRender.rootContainer = annie.app.createCanvas();
            //webgl 直到对2d的支持非常成熟了再考虑开启
            if (renderType == 0) {
                //canvas
                s.renderObj = new annie.CanvasRender(s);
            }
            else {
                //webgl
                //s.renderObj = new WebGLRender(s);
            }
            s.renderObj.init();
            //同时添加到主更新循环中
            Stage.addUpdateObj(s);
            Stage.stage = s;
            return _this;
        }
        Object.defineProperty(Stage, "pause", {
            /**
             * 是否暂停
             * @property pause
             * @static
             * @type {boolean}
             * @public
             * @since 1.0.0
             * @default false
             */
            get: function () {
                return Stage._pause;
            },
            set: function (value) {
                var s = Stage;
                if (value != s._pause) {
                    s._pause = value;
                    if (value) {
                        //停止声音
                        annie.Sound.stopAllSounds();
                    }
                    else {
                        //恢复声音
                        annie.Sound.resumePlaySounds();
                    }
                    //触发事件
                    annie.globalDispatcher.dispatchEvent("onRunChanged", { pause: value });
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "scaleMode", {
            /**
             * 舞台的缩放模式
             * 默认为空就是无缩放的真实大小
             * "noBorder" 无边框模式
             * ”showAll" 显示所有内容
             * “fixedWidth" 固定宽
             * ”fixedHeight" 固定高
             * @property scaleMode
             * @public
             * @since 1.0.0
             * @default "onScale"
             * @type {string}
             * @example
             *      //动态更改stage的对齐方式示例
             *      //以下代码放到一个舞台的显示对象的构造函数中
             *      let s=this;
             *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
             *          let i=0;
             *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
             *              let aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
             *              let state=e.currentTarget;
             *              state.scaleMode=aList[i];
             *              if(i>5){i=0;}
             *          }
             *      }
             *
             */
            get: function () {
                return this._scaleMode;
            },
            set: function (value) {
                var s = this;
                if (value != s._scaleMode) {
                    s._scaleMode = value;
                    s.setAlign();
                }
            },
            enumerable: true,
            configurable: true
        });
        Stage.prototype._render = function (renderObj) {
            renderObj.begin(this.bgColor);
            _super.prototype._render.call(this, renderObj);
            renderObj.end();
        };
        //刷新mouse或者touch事件
        Stage.prototype._initMouseEvent = function (event, cp, sp, identifier, timeStamp) {
            event._pd = false;
            event.clientX = cp.x;
            event.clientY = cp.y;
            event.stageX = sp.x;
            event.stageY = sp.y;
            event.timeStamp = timeStamp;
            event.identifier = identifier;
        };
        //循环刷新页面的函数
        Stage.prototype.flush = function () {
            var s = this;
            //看看是否有resize
            s.resize();
            s._onUpdateFrame(1);
            s._updateMatrix();
            s._render(s.renderObj);
        };
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method setFrameRate
         * @param {number} fps 最好是60的倍数如 1 2 3 6 10 12 15 20 30 60
         * @since 1.0.0
         * @public
         * @return {void}
         */
        Stage.prototype.setFrameRate = function (fps) {
            Stage._FPS = fps;
        };
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         * @return {number}
         */
        Stage.prototype.getFrameRate = function () {
            return Stage._FPS;
        };
        Stage.prototype._onMouseEvent = function (e) {
            //检查是否有
            var s = this, offSetX = 0, offSetY = 0;
            var sd = Stage._dragDisplay;
            if (s.isMultiTouch && e.changedTouches.length > 1) {
                if (e.changedTouches.length == 2) {
                    //求角度和距离
                    s._mP1.x = e.changedTouches[0].clientX - offSetX;
                    s._mP1.y = e.changedTouches[0].clientY - offSetY;
                    s._mP2.x = e.changedTouches[1].clientX - offSetX;
                    s._mP2.y = e.changedTouches[1].clientY - offSetY;
                    var angle = Math.atan2(s._mP1.y - s._mP2.y, s._mP1.x - s._mP2.x) / Math.PI * 180;
                    var dis = annie.Point.distance(s._mP1, s._mP2);
                    s.muliPoints.push({ p1: s._mP1, p2: s._mP2, angle: angle, dis: dis });
                    if (s.muliPoints.length >= 2) {
                        //如果有事件，抛事件
                        if (!(s._touchEvent instanceof annie.TouchEvent)) {
                            s._touchEvent = new annie.TouchEvent(annie.TouchEvent.ON_MULTI_TOUCH);
                            s._touchEvent.target = s;
                        }
                        var len = s.muliPoints.length;
                        s._touchEvent.rotate = (s.muliPoints[len - 1].angle - s.muliPoints[len - 2].angle) * 2;
                        s._touchEvent.scale = (s.muliPoints[len - 1].dis - s.muliPoints[len - 2].dis) / (s.divHeight > s.divWidth ? s.desWidth : s.desHeight) * 4;
                        s._touchEvent.clientPoint1.x = s.muliPoints[len - 1].p1.x * annie.devicePixelRatio;
                        s._touchEvent.clientPoint2.x = s.muliPoints[len - 1].p2.x * annie.devicePixelRatio;
                        s._touchEvent.clientPoint1.y = s.muliPoints[len - 1].p1.y * annie.devicePixelRatio;
                        s._touchEvent.clientPoint2.y = s.muliPoints[len - 1].p2.y * annie.devicePixelRatio;
                        s.dispatchEvent(s._touchEvent);
                        s.muliPoints.shift();
                    }
                }
                else {
                    s.muliPoints.length = 0;
                }
                s._mouseDownPoint = {};
                s._lastDpList = {};
                if (sd) {
                    Stage._lastDragPoint.x = Number.MAX_VALUE;
                    Stage._lastDragPoint.y = Number.MAX_VALUE;
                }
            }
            else {
                if (s.muliPoints.length > 0) {
                    s._touchEvent.rotate = 0;
                    s._touchEvent.scale = 0;
                    s._touchEvent.clientPoint1.x = 0;
                    s._touchEvent.clientPoint2.x = 0;
                    s._touchEvent.clientPoint1.y = 0;
                    s._touchEvent.clientPoint2.y = 0;
                    s.dispatchEvent(s._touchEvent);
                    s.muliPoints.length = 0;
                }
                //检查mouse或touch事件是否有，如果有的话，就触发事件函数
                if (annie.EventDispatcher._totalMEC > 0) {
                    var points = void 0;
                    var item = s._mouseEventTypes[e.type];
                    var events = [];
                    var event_2;
                    //clientPoint
                    var cp = void 0;
                    //事件个数
                    var eLen = void 0;
                    var identifier = void 0;
                    if (s.isMultiMouse) {
                        points = e.changedTouches;
                    }
                    else {
                        var fp = e.changedTouches[0];
                        if ((s._lastDpList[fp.identifier] != void 0) || (item == "onMouseDown" && !s._lastDpList.isStart)) {
                            s._lastDpList.isStart = true;
                            points = [fp];
                        }
                        else {
                            return;
                        }
                    }
                    var pLen = points.length;
                    for (var o = 0; o < pLen; o++) {
                        eLen = 0;
                        events.length = 0;
                        identifier = points[o].identifier;
                        if (s._mp.length > 0) {
                            cp = s._mp.shift();
                        }
                        else {
                            cp = new annie.Point();
                        }
                        cp.x = (points[o].clientX - offSetX) * annie.devicePixelRatio;
                        cp.y = (points[o].clientY - offSetY) * annie.devicePixelRatio;
                        s.globalToLocal(cp, s.sp);
                        if (sd && sd.stage && sd.parent) {
                            var x1 = sd.x, y1 = sd.y;
                            sd.parent.globalToLocal(cp, s.lp);
                            if (!Stage._isDragCenter) {
                                if (Stage._lastDragPoint.x != Number.MAX_VALUE) {
                                    x1 += s.lp.x - Stage._lastDragPoint.x;
                                    y1 += s.lp.y - Stage._lastDragPoint.y;
                                }
                                Stage._lastDragPoint.x = s.lp.x;
                                Stage._lastDragPoint.y = s.lp.y;
                            }
                            else {
                                x1 = s.lp.x;
                                y1 = s.lp.y;
                            }
                            s.lp.x = x1;
                            s.lp.y = y1;
                            if (Stage._dragBounds.width != Number.MIN_VALUE) {
                                if (x1 < Stage._dragBounds.x) {
                                    x1 = Stage._dragBounds.x;
                                }
                                else if (x1 > Stage._dragBounds.x + Stage._dragBounds.width) {
                                    x1 = Stage._dragBounds.x + Stage._dragBounds.width;
                                }
                                if (y1 < Stage._dragBounds.y) {
                                    y1 = Stage._dragBounds.y;
                                }
                                else if (y1 > Stage._dragBounds.y + Stage._dragBounds.height) {
                                    y1 = Stage._dragBounds.y + Stage._dragBounds.height;
                                }
                            }
                            sd.x = x1;
                            sd.y = y1;
                        }
                        if (s._ml[eLen] instanceof annie.MouseEvent) {
                            event_2 = s._ml[eLen];
                            event_2.type = item;
                        }
                        else {
                            event_2 = new annie.MouseEvent(item);
                            s._ml[eLen] = event_2;
                        }
                        events[events.length] = event_2;
                        s._initMouseEvent(event_2, cp, s.sp, identifier, e.timeStamp);
                        eLen++;
                        if (item == "onMouseDown") {
                            s._mouseDownPoint[identifier] = cp;
                            //清空上次存在的显示列表
                        }
                        else if (item == "onMouseUp") {
                            if (s._mouseDownPoint[identifier] instanceof annie.Point) {
                                if (annie.Point.distance(s._mouseDownPoint[identifier], cp) < 20) {
                                    //click事件
                                    //这个地方检查是所有显示对象列表里是否有添加对应的事件
                                    if (annie.EventDispatcher.getMouseEventCount("onMouseClick") > 0) {
                                        if (s._ml[eLen] instanceof annie.MouseEvent) {
                                            event_2 = s._ml[eLen];
                                            event_2.type = "onMouseClick";
                                        }
                                        else {
                                            event_2 = new annie.MouseEvent("onMouseClick");
                                            s._ml[eLen] = event_2;
                                        }
                                        events[events.length] = event_2;
                                        s._initMouseEvent(event_2, cp, s.sp, identifier);
                                        eLen++;
                                    }
                                }
                            }
                        }
                        if (eLen > 0) {
                            //证明有事件那么就开始遍历显示列表。就算有多个事件也不怕，因为坐标点相同，所以只需要遍历一次
                            var d_1 = s.hitTestPoint(cp, true);
                            var displayList = [];
                            if (d_1 instanceof annie.DisplayObject) {
                                //证明有点击到事件,然后从最底层追上来,看看一路是否有人添加过mouse或touch事件,还要考虑mousechildren和阻止事件方法
                                //找出真正的target,因为有些父级可能会mouseChildren=false;
                                do {
                                    if (d_1 instanceof annie.Sprite && d_1.mouseChildren == false) {
                                        //丢掉之前的层级,因为根本没用了
                                        displayList.length = 0;
                                    }
                                    displayList[displayList.length] = d_1;
                                    d_1 = d_1.parent;
                                } while (d_1 instanceof annie.DisplayObject);
                            }
                            else {
                                displayList[0] = s;
                            }
                            var len = displayList.length;
                            for (var i = len - 1; i >= 0; i--) {
                                d_1 = displayList[i];
                                for (var j = 0; j < eLen; j++) {
                                    if (!events[j]._pd && d_1.hasEventListener(events[j].type)) {
                                        events[j].currentTarget = d_1;
                                        events[j].target = displayList[0];
                                        d_1.globalToLocal(cp, s.lp);
                                        events[j].localX = s.lp.x;
                                        events[j].localY = s.lp.y;
                                        d_1.dispatchEvent(events[j]);
                                    }
                                }
                            }
                            //这里一定要反转一下，因为会影响mouseOut mouseOver
                            displayList.reverse();
                            for (var i = len - 1; i >= 0; i--) {
                                d_1 = displayList[i];
                                for (var j = 0; j < eLen; j++) {
                                    if (!events[j]._pd && d_1.hasEventListener(events[j].type, false)) {
                                        events[j].currentTarget = d_1;
                                        events[j].target = displayList[eLen - 1];
                                        d_1.globalToLocal(cp, s.lp);
                                        events[j].localX = s.lp.x;
                                        events[j].localY = s.lp.y;
                                        d_1.dispatchEvent(events[j], null, false);
                                    }
                                }
                            }
                            //最后要和上一次的遍历者对比下，如果不相同则要触发onMouseOver和onMouseOut
                            if (item != "onMouseDown") {
                                if (annie.EventDispatcher.getMouseEventCount("onMouseOver") > 0 || annie.EventDispatcher.getMouseEventCount("onMouseOut") > 0) {
                                    if (s._lastDpList[identifier] instanceof Array) {
                                        //从第二个开始，因为第一个对象始终是stage顶级对象
                                        var len1 = s._lastDpList[identifier].length;
                                        var len2 = displayList.length;
                                        len = len1 > len2 ? len1 : len2;
                                        var isDiff = false;
                                        var overEvent = void 0;
                                        var outEvent = void 0;
                                        for (var i = 1; i < len; i++) {
                                            if (!isDiff) {
                                                if (s._lastDpList[identifier][i] != displayList[i]) {
                                                    //好就是这里，需要确定哪些有onMouseOver,哪些有onMouseOut
                                                    isDiff = true;
                                                    if (s._ml[eLen] instanceof annie.MouseEvent) {
                                                        overEvent = s._ml[eLen];
                                                        overEvent.type = "onMouseOver";
                                                    }
                                                    else {
                                                        overEvent = new annie.MouseEvent("onMouseOver");
                                                        s._ml[eLen] = overEvent;
                                                    }
                                                    s._initMouseEvent(overEvent, cp, s.sp, identifier);
                                                    eLen++;
                                                    if (s._ml[eLen] instanceof annie.MouseEvent) {
                                                        outEvent = s._ml[eLen];
                                                        outEvent.type = "onMouseOut";
                                                    }
                                                    else {
                                                        outEvent = new annie.MouseEvent("onMouseOut");
                                                        s._ml[eLen] = outEvent;
                                                    }
                                                    s._initMouseEvent(outEvent, cp, s.sp, identifier);
                                                }
                                            }
                                            if (isDiff) {
                                                if (s._lastDpList[identifier][i]) {
                                                    //触发onMouseOut事件
                                                    d_1 = s._lastDpList[identifier][i];
                                                    if (!outEvent._pd && d_1.hasEventListener("onMouseOut")) {
                                                        outEvent.currentTarget = d_1;
                                                        outEvent.target = s._lastDpList[identifier][len1 - 1];
                                                        d_1.globalToLocal(cp, s.lp);
                                                        outEvent.localX = s.lp.x;
                                                        outEvent.localY = s.lp.y;
                                                        d_1.dispatchEvent(outEvent);
                                                    }
                                                }
                                                d_1 = displayList[i];
                                                if (d_1 instanceof annie.DisplayObject) {
                                                    //触发onMouseOver事件
                                                    if (!overEvent._pd && d_1.hasEventListener("onMouseOver")) {
                                                        overEvent.currentTarget = d_1;
                                                        overEvent.target = displayList[len2 - 1];
                                                        d_1.globalToLocal(cp, s.lp);
                                                        overEvent.localX = s.lp.x;
                                                        overEvent.localY = s.lp.y;
                                                        d_1.dispatchEvent(overEvent);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                s._mp[s._mp.length] = cp;
                            }
                            if (item == "onMouseUp") {
                                delete s._mouseDownPoint[identifier];
                                delete s._lastDpList[identifier];
                                s._lastDpList.isStart = false;
                                if (sd) {
                                    Stage._lastDragPoint.x = Number.MAX_VALUE;
                                    Stage._lastDragPoint.y = Number.MAX_VALUE;
                                }
                            }
                            else {
                                s._lastDpList[identifier] = displayList;
                            }
                        }
                    }
                }
            }
        };
        ;
        //设置舞台的对齐模式
        Stage.prototype.setAlign = function () {
            var s = this;
            var divH = s.divHeight;
            var divW = s.divWidth;
            var desH = s.desHeight;
            var desW = s.desWidth;
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            //设备是否为竖屏
            var isDivH = divH >= divW;
            //内容是否为竖屏内容
            var isDesH = desH >= desW;
            var scaleY = 1;
            var scaleX = 1;
            s.x = (divW - desW) >> 1;
            s.y = (divH - desH) >> 1;
            if (s.autoSteering) {
                if (isDesH != isDivH) {
                    var d_2 = divH;
                    divH = divW;
                    divW = d_2;
                }
            }
            if (s._scaleMode != "noScale") {
                scaleY = divH / desH;
                scaleX = divW / desW;
                switch (s._scaleMode) {
                    case "noBorder":
                        if (scaleX > scaleY) {
                            scaleY = scaleX;
                        }
                        else {
                            scaleX = scaleY;
                        }
                        break;
                    case "showAll":
                        if (scaleX < scaleY) {
                            scaleY = scaleX;
                        }
                        else {
                            scaleX = scaleY;
                        }
                        break;
                    case "fixedWidth":
                        scaleY = scaleX;
                        break;
                    case "fixedHeight":
                        scaleX = scaleY;
                        break;
                }
            }
            s.scaleX = scaleX;
            s.scaleY = scaleY;
            if (s.autoSteering) {
                if (isDesH == isDivH) {
                    s.rotation = 0;
                }
                else {
                    if (desH > desW) {
                        s.rotation = -90;
                    }
                    else {
                        s.rotation = 90;
                    }
                }
            }
            else {
                s.rotation = 0;
            }
            s._viewRect.x = (desW - divW / scaleX) >> 1;
            s._viewRect.y = (desH - divH / scaleY) >> 1;
            s._viewRect.width = desW - s._viewRect.x * 2;
            s._viewRect.height = desH - s._viewRect.y * 2;
        };
        ;
        Object.defineProperty(Stage.prototype, "viewRect", {
            /**
             * 舞台在设备里截取后的可见区域,有些时候知道可见区域是非常重要的,因为这样你就可以根据舞台的可见区域做自适应了。
             * @property viewRect
             * @public
             * @readonly
             * @since 1.0.0
             * @type {annie.Rectangle}
             * @default {x:0,y:0,width:0,height:0}
             * @readonly
             * @example
             *      //始终让一个对象顶对齐，或者
             */
            get: function () {
                return this._viewRect;
            },
            enumerable: true,
            configurable: true
        });
        Stage.flushAll = function () {
            if (Stage._intervalID != -1) {
                clearInterval(Stage._intervalID);
            }
            Stage._intervalID = setInterval(function () {
                if (!Stage._pause) {
                    var len = Stage.allUpdateObjList.length;
                    for (var i = len - 1; i >= 0; i--) {
                        Stage.allUpdateObjList[i] && Stage.allUpdateObjList[i].flush();
                    }
                }
            }, 1000 / Stage._FPS >> 0);
        };
        /**
         * 添加一个刷新对象，这个对象里一定要有一个 flush 函数。
         * 因为一但添加，这个对象的 flush 函数会以stage的fps间隔调用
         * 如，你的stage是30fps 那么你这个对象的 flush 函数1秒会调用30次。
         * @method addUpdateObj
         * @param target 要循化调用 flush 函数的对象
         * @public
         * @static
         * @since
         * @return {void}
         */
        Stage.addUpdateObj = function (target) {
            var isHave = false;
            var len = Stage.allUpdateObjList.length;
            for (var i = 0; i < len; i++) {
                if (Stage.allUpdateObjList[i] == target) {
                    isHave = true;
                    break;
                }
            }
            if (!isHave) {
                Stage.allUpdateObjList.unshift(target);
            }
        };
        /**
         * 移除掉已经添加的循环刷新对象
         * @method removeUpdateObj
         * @param target
         * @public
         * @static
         * @since 1.0.0
         * @return {void}
         */
        Stage.removeUpdateObj = function (target) {
            var len = Stage.allUpdateObjList.length;
            for (var i = 0; i < len; i++) {
                if (Stage.allUpdateObjList[i] == target) {
                    Stage.allUpdateObjList.splice(i, 1);
                    break;
                }
            }
        };
        Stage.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var s = this;
            Stage.removeUpdateObj(s);
            s.renderObj.destroy();
            s.renderObj = null;
        };
        Stage._pause = false;
        Stage.stage = null;
        //原始为60的刷新速度时的计数器
        Stage._FPS = 30;
        Stage._dragDisplay = null;
        Stage._dragBounds = new annie.Rectangle();
        Stage._lastDragPoint = new annie.Point();
        Stage._isDragCenter = false;
        /**
         * 要循环调用 flush 函数对象列表
         * @method allUpdateObjList
         * @static
         * @since 1.0.0
         * @type {Array}
         */
        Stage.allUpdateObjList = [];
        Stage._intervalID = -1;
        return Stage;
    }(annie.Sprite));
    annie.Stage = Stage;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * Canvas 渲染器
     * @class annie.CanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    var CanvasRender = /** @class */ (function (_super) {
        __extends(CanvasRender, _super);
        /**
         * @method CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        function CanvasRender(stage) {
            var _this = _super.call(this) || this;
            /**
             * @property viewPort
             *
             */
            _this.viewPort = new annie.Rectangle();
            _this._instanceType = "annie.CanvasRender";
            return _this;
        }
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        CanvasRender.prototype.begin = function (color) {
            var c = CanvasRender.rootContainer, ctx = CanvasRender._ctx;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (color == "") {
                ctx.clearRect(0, 0, c.width, c.height);
            }
            else {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, c.width, c.height);
            }
        };
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        CanvasRender.prototype.beginMask = function (target) {
            var s = this, ctx = CanvasRender._ctx;
            ctx.save();
            // ctx.globalAlpha = 0;
            ctx.beginPath();
            s.drawMask(target);
            ctx.closePath();
            ctx.clip();
        };
        CanvasRender.prototype.drawMask = function (target) {
            var s = this, tm = target._cMatrix, ctx = CanvasRender._ctx;
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (target._instanceType == "annie.Shape") {
                target._draw(ctx, true);
            }
            else if (target._instanceType == "annie.Sprite" || target._instanceType == "annie.MovieClip") {
                for (var i = 0; i < target.children.length; i++) {
                    s.drawMask(target.children[i]);
                }
            }
            else {
                var bounds = target._bounds;
                ctx.rect(0, 0, bounds.width, bounds.height);
            }
        };
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        CanvasRender.prototype.endMask = function () {
            CanvasRender._ctx.restore();
        };
        CanvasRender.prototype.end = function () {
        };
        ;
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        CanvasRender.prototype.init = function () {
            annie.CanvasRender._ctx = CanvasRender.rootContainer.getContext("2d");
            annie.Stage["flushAll"]();
        };
        /**
         * 当尺寸改变时调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        CanvasRender.prototype.reSize = function (width, height) {
            var s = this;
            s.viewPort.width = width;
            s.viewPort.height = height;
        };
        CanvasRender.prototype.destroy = function () {
            CanvasRender.rootContainer = null;
            CanvasRender._ctx = null;
        };
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        CanvasRender.rootContainer = null;
        return CanvasRender;
    }(annie.AObject));
    annie.CanvasRender = CanvasRender;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * Canvas 渲染器
     * @class annie.OffCanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    var OffCanvasRender = /** @class */ (function (_super) {
        __extends(OffCanvasRender, _super);
        /**
         * @method OffCanvasRender
         * @public
         * @since 1.0.0
         */
        function OffCanvasRender() {
            var _this = _super.call(this) || this;
            _this._instanceType = "annie.OffCanvasRender";
            return _this;
        }
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        OffCanvasRender.prototype.begin = function (color) {
            var c = OffCanvasRender.rootContainer, ctx = OffCanvasRender._ctx;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (color == "") {
                ctx.clearRect(0, 0, c.width, c.height);
            }
        };
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        OffCanvasRender.prototype.beginMask = function (target) {
            var s = this, ctx = OffCanvasRender._ctx;
            ctx.save();
            ctx.beginPath();
            s.drawMask(target);
            ctx.closePath();
            ctx.clip();
        };
        OffCanvasRender.prototype.drawMask = function (target) {
            var s = this, tm = target._matrix, ctx = OffCanvasRender._ctx;
            ctx.transform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (target._instanceType == "annie.Shape") {
                target._draw(ctx, true);
            }
            else if (target._instanceType == "annie.Sprite" || target._instanceType == "annie.MovieClip") {
                for (var i = 0; i < target.children.length; i++) {
                    s.drawMask(target.children[i]);
                }
            }
            else {
                var bounds = target._bounds;
                ctx.rect(0, 0, bounds.width, bounds.height);
            }
        };
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        OffCanvasRender.prototype.endMask = function () {
            OffCanvasRender._ctx.restore();
        };
        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        OffCanvasRender.prototype.draw = function (target) {
            if (target._visible && target._cAlpha > 0) {
                var children = target.children;
                var ctx = OffCanvasRender._ctx;
                var tm = target._matrix;
                ctx.save();
                ctx.globalAlpha *= target._alpha;
                ctx.transform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                if (target.children == null) {
                    if (target._offsetX != 0 || target._offsetY != 0) {
                        ctx.translate(target._offsetX, target._offsetY);
                    }
                    target._draw(ctx);
                }
                else {
                    var len = target.children.length;
                    var s = this;
                    var maskObj = void 0;
                    var child = void 0;
                    for (var i = 0; i < len; i++) {
                        child = children[i];
                        if (child._isUseToMask > 0) {
                            continue;
                        }
                        if (maskObj instanceof annie.DisplayObject) {
                            if (child.mask instanceof annie.DisplayObject && child.mask.parent == child.parent) {
                                if (child.mask != maskObj) {
                                    s.endMask();
                                    maskObj = child.mask;
                                    s.beginMask(maskObj);
                                }
                            }
                            else {
                                s.endMask();
                                maskObj = null;
                            }
                        }
                        else {
                            if (child.mask instanceof annie.DisplayObject && child.mask.parent == child.parent) {
                                maskObj = child.mask;
                                s.beginMask(maskObj);
                            }
                        }
                        s.draw(child);
                    }
                }
                ctx.restore();
            }
        };
        OffCanvasRender.prototype.end = function () { };
        ;
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        OffCanvasRender.prototype.init = function () {
            OffCanvasRender._ctx = OffCanvasRender.rootContainer.getContext('2d');
        };
        /**
         * 当尺寸改变时调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        OffCanvasRender.prototype.reSize = function (width, height) {
            var c = OffCanvasRender.rootContainer;
            c.width = width;
            c.height = height;
        };
        OffCanvasRender.prototype.destroy = function () {
            OffCanvasRender.rootContainer = null;
            OffCanvasRender._ctx = null;
        };
        return OffCanvasRender;
    }(annie.AObject));
    annie.OffCanvasRender = OffCanvasRender;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 小游戏中开放子域在主域的显示容器,小程序中无此类
     * @class annie.SharedCanvas
     * @public
     * @extends annie.AObject
     * @since 1.0.0
     */
    var SharedCanvas = /** @class */ (function () {
        function SharedCanvas() {
        }
        SharedCanvas.onMouseEvent = function (e) {
            var s = SharedCanvas;
            s.postMessage({
                type: e.type,
                data: {
                    x: e.localX,
                    y: e.localY
                }
            });
        };
        SharedCanvas.init = function (w, h) {
            var s = SharedCanvas;
            if (s.context)
                return;
            s.context = annie.app.getOpenDataContext();
            s.context.canvas.width = w;
            s.context.canvas.height = h;
            s.postMessage({
                type: "initSharedCanvasStage",
            });
            s.view = new annie.Bitmap(s.context.canvas);
            s.view.addEventListener(annie.MouseEvent.CLICK, s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_OVER, s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_OUT, s.onMouseEvent);
        };
        SharedCanvas.resize = function (w, h) {
            var s = SharedCanvas;
            s.context.canvas.width = w;
            s.context.canvas.height = h;
            s.postMessage({
                type: "canvasResize",
                data: {
                    w: w,
                    h: h
                }
            });
        };
        SharedCanvas.destroy = function () {
            //清除相应的数据引用
            var s = SharedCanvas;
            s.view.destroy();
            s.context = null;
        };
        /**
         * 向子域传消息
         * @method postMessage
         * @param data
         * @public
         */
        SharedCanvas.postMessage = function (data) {
            //呼叫数据显示端
            var s = SharedCanvas;
            s.context.postMessage(data);
        };
        /**
         * 显示开放域
         * @method show
         * @since 2.0.1
         */
        SharedCanvas.show = function () {
            var s = SharedCanvas;
            s.context.postMessage({ event: "onShow" });
            s.view.visible = true;
        };
        /**
         * 隐藏开放域
         * @method hide
         * @since 2.0.1
         */
        SharedCanvas.hide = function () {
            var s = SharedCanvas;
            s.context.postMessage({ event: "onHide" });
            s.view.visible = true;
        };
        SharedCanvas.view = null;
        return SharedCanvas;
    }());
    annie.SharedCanvas = SharedCanvas;
})(annie || (annie = {}));
/**
 * Flash资源加载或者管理类，静态类，不可实例化
 * 一般都是初始化或者设置从Flash里导出的资源
 * @class annie
 */
var annie;
(function (annie) {
    //打包swf用
    annie._isReleased = false;
    annie.suffixName = ".swf";
    annie.classPool = {};
    //打包swf用
    annie._shareSceneList = [];
    //存储加载资源的总对象
    annie.res = {};
    // 加载器是否正在加载中
    var _isLoading;
    // 加载中的场景名列表
    var _loadSceneNames;
    //加载地址的域名地址或前缀
    var _domain;
    //当前加载到哪一个资源
    var _loadIndex;
    // 当前加载的总资源数
    var _totalLoadRes;
    //当前已经加载的资源数
    var _loadedLoadRes;
    //加载资源的完成回调
    var _completeCallback;
    //加载资源时的进度回调
    var _progressCallback;
    // 当前加载的资源配置文件内容
    var _currentConfig;
    // 加载资源数和总资源数的比
    var _loadPer;
    //单个资源占总资源数的比
    var _loadSinglePer;
    /**
     * <h4><font color="red">注意:小程序 小游戏里这个方法是同步方法</font></h4>
     * 加载一个flash2x转换的文件内容,如果未加载完成继续调用此方法将会刷新加载器,中断未被加载完成的资源
     * @method annie.loadScene
     * @public
     * @static
     * @since 1.0.0
     * @param {string} sceneName fla通过flash2x转换时设置的包名
     * @param {Function} progressFun 加载进度回调,回调参数为当前的进度值1-100
     * @param {Function} completeFun 加载完成回调,回调参数为当前加载的场景信息
     * @param {string} domain 加载时要设置的url前缀,默认则不更改加载路径
     */
    annie.loadScene = function (sceneName, progressFun, completeFun, domain) {
        if (domain === void 0) { domain = ""; }
        //加载资源配置文件
        if (_isLoading) {
            console.log("当前加载未完成");
            return;
        }
        _loadSceneNames = [];
        _domain = domain;
        if (typeof (sceneName) == "string") {
            if (!isLoadedScene(sceneName)) {
                annie.res[sceneName] = {};
                _loadSceneNames.push(sceneName);
            }
            else {
                var info = {};
                info.sceneName = sceneName;
                info.sceneId = 1;
                info.sceneTotal = 1;
                completeFun(info);
            }
        }
        else {
            var len = sceneName.length;
            var index = 0;
            for (var i = 0; i < len; i++) {
                if (!isLoadedScene(sceneName[i])) {
                    annie.res[sceneName[i]] = {};
                    _loadSceneNames.push(sceneName[i]);
                }
                else {
                    var info = {};
                    info.sceneName = sceneName[i];
                    info.sceneId = ++index;
                    info.sceneTotal = len;
                    completeFun(info);
                }
            }
        }
        if (_loadSceneNames.length == 0) {
            return;
        }
        _loadPer = 0;
        _loadIndex = 0;
        _totalLoadRes = 0;
        _loadedLoadRes = 0;
        _isLoading = true;
        _completeCallback = completeFun;
        _progressCallback = progressFun;
        _currentConfig = [];
        _loadConfig();
    };
    /**
     * 加载分包场景的方法
     * @param sceneName 分包名字
     * @param {Function} progressFun
     * @param {Function} completeFun
     * @param {string} domain
     */
    function loadSubScene(subName, progressFun, completeFun) {
        if (isLoadedScene(subName)) {
            completeFun({ status: 1, name: subName });
        }
        else {
            //分包加载
            var loadTask = annie.app.loadSubpackage({
                name: subName,
                success: function (res) {
                    //分包加载成功后通过 success 回调
                    completeFun({ status: 1, name: subName });
                },
                fail: function (res) {
                    //分包加载失败通过 fail 回调
                    completeFun({ status: 0, name: subName });
                }
            });
            loadTask.onProgressUpdate(progressFun);
        }
    }
    annie.loadSubScene = loadSubScene;
    //加载配置文件,打包成released线上版时才会用到这个方法。
    //打包released后，所有资源都被base64了，所以线上版不会调用这个方法。
    function _loadConfig() {
        if (_domain.indexOf("http") != 0) {
            //本地
            var sourceUrl = "../resource/";
            if (_domain != "") {
                sourceUrl = "../" + _domain + "/resource/";
            }
            var result = require(sourceUrl + _loadSceneNames[_loadIndex] + "/" + _loadSceneNames[_loadIndex] + ".res.js");
            _onCFGComplete(result);
        }
        else {
            var downloadTask = annie.app.downloadFile({
                url: _domain + "resource/" + _loadSceneNames[_loadIndex] + "/" + _loadSceneNames[_loadIndex] + ".res.json",
                success: function (result) {
                    if (result.statusCode == 200) {
                        var resultData = annie.app.getFileSystemManager().readFileSync(result.tempFilePath, "utf8");
                        _onCFGComplete(JSON.parse(resultData));
                    }
                }
            });
            downloadTask.onProgressUpdate(function (res) {
                //远程资源的进度条根据每个加载文件K数才计算
                if (_progressCallback) {
                    _progressCallback((res.progress + 100 * _loadIndex) / _loadSceneNames.length >> 0);
                }
            });
        }
    }
    function _onCFGComplete(data) {
        _currentConfig.push(data);
        _totalLoadRes += data.length;
        _loadIndex++;
        if (_loadSceneNames[_loadIndex]) {
            _loadConfig();
        }
        else {
            //所有配置文件加载完成,那就开始加载资源
            _loadIndex = 0;
            _loadSinglePer = 1 / _totalLoadRes;
            _loadRes();
        }
    }
    //解析加载后的json资源数据
    function _parseContent(loadContent) {
        //在加载完成之后解析并调整json数据文件，_a2x_con应该是con.json文件里最后一个被加载的，这个一定在fla生成json文件时注意
        //主要工作就是遍历时间轴并调整成方便js读取的方式
        var mc;
        for (var item in loadContent) {
            mc = loadContent[item];
            if (mc.t == 1) {
                if (!(mc.f instanceof Object)) {
                    mc.f = [];
                    continue;
                }
                if (mc.tf > 1) {
                    var frameList = mc.f;
                    var count = frameList.length;
                    var frameCon = null;
                    var lastFrameCon = null;
                    var ol = [];
                    for (var i = 0; i < count; i++) {
                        frameCon = frameList[i].c;
                        //这帧是否为空
                        if (frameCon instanceof Object) {
                            for (var j in frameCon) {
                                var at = frameCon[j].at;
                                if (at != undefined && at != -1) {
                                    if (at == 0) {
                                        ol.push(j);
                                    }
                                    else {
                                        for (var l = 0; l < ol.length; l++) {
                                            if (ol[l] == at) {
                                                ol.splice(l, 0, j);
                                                break;
                                            }
                                        }
                                    }
                                    delete frameCon[j].at;
                                }
                            }
                            //上一帧是否为空
                            if (lastFrameCon instanceof Object) {
                                for (var j in lastFrameCon) {
                                    //上一帧有，这一帧没有，加进来
                                    if (!(frameCon[j] instanceof Object)) {
                                        frameCon[j] = lastFrameCon[j];
                                    }
                                    else {
                                        //上一帧有，这一帧也有那么at就只有-1一种可能
                                        if (frameCon[j].at != -1) {
                                            //如果不为空，则更新元素
                                            for (var m in lastFrameCon[j]) {
                                                //这个地方一定要用undefined。因为有些元素可能为0.当然不是所有的元素都要补，比如滤镜，为空就不需要补
                                                if (frameCon[j][m] == void 0 && m != "fi") {
                                                    frameCon[j][m] = lastFrameCon[j][m];
                                                }
                                            }
                                        }
                                        else {
                                            //如果为-1，删除元素
                                            delete frameCon[j];
                                        }
                                    }
                                }
                            }
                        }
                        lastFrameCon = frameCon;
                    }
                    mc.ol = ol;
                }
            }
        }
    }
    //检查所有资源是否全加载完成
    function _checkComplete() {
        _currentConfig[_loadIndex].shift();
        if (_domain.indexOf("http") != 0) {
            //本地的进度条根据加个的总文件数才计算
            _loadedLoadRes++;
            _loadPer = _loadedLoadRes / _totalLoadRes;
            if (_progressCallback) {
                _progressCallback(_loadPer * 100 >> 0);
            }
        }
        if (_currentConfig[_loadIndex].length > 0) {
            _loadRes();
        }
        else {
            annie.res[_loadSceneNames[_loadIndex]]._f2x_had_loaded_scene = true;
            var info = {};
            info.sceneName = _loadSceneNames[_loadIndex];
            _loadIndex++;
            info.sceneId = _loadIndex;
            info.sceneTotal = _loadSceneNames.length;
            if (_loadIndex == _loadSceneNames.length) {
                //全部资源加载完成
                _isLoading = false;
                if (_completeCallback) {
                    _completeCallback(info);
                }
            }
            else {
                if (_completeCallback) {
                    _completeCallback || _completeCallback(info);
                }
                _loadRes();
            }
        }
    }
    //加载场景资源
    function _loadRes() {
        var scene = _loadSceneNames[_loadIndex];
        var type = _currentConfig[_loadIndex][0].type;
        if (type != "javascript") {
            var loadContent = void 0;
            if (_currentConfig[_loadIndex][0].id == "_a2x_con") {
                if (_domain.indexOf("http") != 0) {
                    //本地
                    var sourceUrl = "../";
                    if (_domain != "") {
                        sourceUrl = "../" + _domain + "/";
                    }
                    loadContent = require(sourceUrl + _currentConfig[_loadIndex][0].src);
                }
                else {
                    loadContent = _currentConfig[_loadIndex][0].src;
                }
                annie.res[scene][_currentConfig[_loadIndex][0].id] = loadContent;
                _parseContent(loadContent);
            }
            else {
                if (type == "image") {
                    //图片
                    loadContent = annie.app.createImage();
                    if (_domain.indexOf("http") != 0) {
                        var sourceUrl = "";
                        if (_domain != "") {
                            sourceUrl = _domain + "/";
                        }
                        loadContent.src = sourceUrl + _currentConfig[_loadIndex][0].src;
                    }
                    else {
                        loadContent.src = _currentConfig[_loadIndex][0].src;
                    }
                    annie.res[scene][_currentConfig[_loadIndex][0].id] = loadContent;
                }
                else if (type == "sound") {
                    //声音
                    loadContent = annie.app.createInnerAudioContext();
                    if (_domain.indexOf("http") != 0) {
                        var sourceUrl = "";
                        if (_domain != "") {
                            sourceUrl = _domain + "/";
                        }
                        loadContent.src = sourceUrl + _currentConfig[_loadIndex][0].src;
                    }
                    else {
                        loadContent.src = _currentConfig[_loadIndex][0].src;
                    }
                    annie.res[scene][_currentConfig[_loadIndex][0].id] = loadContent;
                }
            }
        }
        else {
            //本地
            var sourceUrl = "../";
            if (_domain != "" && _domain.indexOf("http") != 0) {
                sourceUrl = "../" + _domain + "/";
            }
            require(sourceUrl + _currentConfig[_loadIndex][0].src);
        }
        _checkComplete();
    }
    /**
     * 判断一个场景是否已经被加载
     * @method annie.isLoadedScene
     * @public
     * @static
     * @since 1.0.0
     * @param {string} sceneName
     * @return {boolean}
     */
    function isLoadedScene(sceneName) {
        if (annie.res[sceneName] != undefined && annie.res[sceneName] != null && annie.res[sceneName]._f2x_had_loaded_scene) {
            return true;
        }
        else {
            return false;
        }
    }
    annie.isLoadedScene = isLoadedScene;
    /**
     * 删除一个场景资源,以方便系统垃圾回收
     * @method annie.unLoadScene
     * @public
     * @static
     * @since 1.0.2
     * @param {string} sceneName
     */
    function unLoadScene(sceneName) {
        delete annie.res[sceneName];
        var w = window;
        var scene = w[sceneName];
        for (var i in scene) {
            delete scene[i];
        }
        delete w[sceneName];
        scene = null;
    }
    annie.unLoadScene = unLoadScene;
    /**
     * 获取已经加载到场景中的资源
     * @method annie.getResource
     * @public
     * @static
     * @since 2.0.0
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    function getResource(sceneName, resName) {
        return annie.res[sceneName][resName];
    }
    annie.getResource = getResource;
    /**
     * 新建一个已经加载到场景中的类生成的对象
     * @method annie.getDisplay
     * @public
     * @static
     * @since 3.2.1
     * @param {string} sceneName
     * @param {string} className
     * @return {any}
     */
    function getDisplay(sceneName, className) {
        return new annie.classPool[sceneName][className]();
    }
    annie.getDisplay = getDisplay;
    // 通过已经加载场景中的图片资源创建Bitmap对象实例,此方法一般给Annie2x工具自动调用
    function b(sceneName, resName) {
        return new annie.Bitmap(annie.res[sceneName][resName]);
    }
    //用一个对象批量设置另一个对象的属性值,此方法一般给Annie2x工具自动调用
    function d(target, info, isMc) {
        if (isMc === void 0) { isMc = false; }
        var _a;
        if (target._a2x_res_obj == info) {
            return;
        }
        else {
            //信息设置的时候看看是不是文本，如果有文本的话还需要设置宽和高
            if (info.tr == undefined || info.tr.length == 1) {
                info.tr = [0, 0, 1, 1, 0, 0];
            }
            var lastInfo = target._a2x_res_obj;
            if (info.al == void 0) {
                info.al = 1;
            }
            if (isMc) {
                var isUmChange = target.a2x_um;
                if (!target._changeTransformInfo[0] && target._x != info.tr[0]) {
                    target._x = info.tr[0];
                    isUmChange = true;
                }
                if (!target._changeTransformInfo[1] && target._y != info.tr[1]) {
                    target._y = info.tr[1];
                    isUmChange = true;
                }
                if (!target._changeTransformInfo[2] && target._scaleX != info.tr[2]) {
                    target._scaleX = info.tr[2];
                    isUmChange = true;
                }
                if (!target._changeTransformInfo[3] && target._scaleY != info.tr[3]) {
                    target._scaleY = info.tr[3];
                    isUmChange = true;
                }
                if (!target._changeTransformInfo[4]) {
                    if (target._skewX != info.tr[4]) {
                        target._skewX = info.tr[4];
                        target._rotation = 0;
                        isUmChange = true;
                    }
                    if (target._skewY != info.tr[5]) {
                        target._skewY = info.tr[5];
                        target._rotation = 0;
                        isUmChange = true;
                    }
                }
                target.a2x_um = isUmChange;
                if (!target._changeTransformInfo[5] && target._alpha != info.al) {
                    target._alpha = info.al;
                    target.a2x_ua = true;
                }
            }
            else {
                if (lastInfo.tr != info.tr) {
                    _a = info.tr, target._x = _a[0], target._y = _a[1], target._scaleX = _a[2], target._scaleY = _a[3], target._skewX = _a[4], target._skewY = _a[5];
                    target.a2x_um = true;
                }
                if (target._alpha != info.al) {
                    target._alpha = info.al;
                    target.a2x_ua = true;
                }
            }
            if (info.w != undefined) {
                target.textWidth = info.w;
                target.textHeight = info.h;
            }
            //动画播放模式 图形 按钮 动画
            if (info.t != undefined) {
                if (info.t == -1) {
                    //initButton
                    if (target.initButton) {
                        target.initButton();
                    }
                }
                target._a2x_mode = info.t;
            }
            target._a2x_res_obj = info;
        }
    }
    annie.d = d;
    // 解析数据里需要确定的文本类型
    var _textLineType = ["single", "multiline"];
    //解析数据里需要确定的文本对齐方式
    var _textAlign = ["left", "center", "right"];
    //创建一个动态文本或输入文本,此方法一般给Annie2x工具自动调用
    function t(sceneName, resName) {
        var textDate = annie.res[sceneName]._a2x_con[resName];
        var textObj;
        var text = decodeURIComponent(textDate[9]);
        var font = decodeURIComponent(textDate[4]).replace(/\s(Regular|Medium)/, "");
        var size = textDate[5];
        var textAlign = _textAlign[textDate[3]];
        var lineType = _textLineType[textDate[2]];
        var italic = textDate[11];
        var bold = textDate[10];
        var color = textDate[6];
        var textAlpha = textDate[7];
        var border = textDate[12];
        var lineHeight = textDate[8];
        // if (textDate[1] == 0 || textDate[1] == 1) {
        textObj = new annie.TextField();
        textObj.text = text;
        textObj.font = font;
        textObj.size = size;
        textObj.textAlign = textAlign;
        textObj.lineType = lineType;
        textObj.italic = italic;
        textObj.bold = bold;
        textObj.color = color;
        textObj.textAlpha = textAlpha;
        textObj.border = border;
        textObj.lineHeight = lineHeight;
        // } else {
        /*textObj = new annie.InputText(textDate[2]);
        textObj.initInfo(text, color, textAlign, size, font, border, lineHeight);
        textObj.italic = italic;
        textObj.bold = bold;*/
        // }
        return textObj;
    }
    //创建一个Shape矢量对象,此方法一般给Annie2x工具自动调用
    function g(sceneName, resName) {
        var shapeDate = annie.res[sceneName]._a2x_con[resName][1];
        var shape = new annie.Shape();
        for (var i = 0; i < shapeDate.length; i++) {
            if (shapeDate[i][0] == 1) {
                if (shapeDate[i][1] == 0) {
                    shape.beginFill(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]));
                }
                else if (shapeDate[i][1] == 1) {
                    shape.beginLinearGradientFill(shapeDate[i][2][0], shapeDate[i][2][1]);
                }
                else if (shapeDate[i][1] == 2) {
                    shape.beginRadialGradientFill(shapeDate[i][2][0], shapeDate[i][2][1]);
                }
                else {
                    shape.beginBitmapFill(getResource(sceneName, shapeDate[i][2][0]), shapeDate[i][2][1]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endFill();
            }
            else {
                if (shapeDate[i][1] == 0) {
                    shape.beginStroke(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]), shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                else if (shapeDate[i][1] == 1) {
                    shape.beginLinearGradientStroke(shapeDate[i][2][0], shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                else if (shapeDate[i][1] == 2) {
                    shape.beginRadialGradientStroke(shapeDate[i][2][0], shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                else {
                    shape.beginBitmapStroke(getResource(sceneName, shapeDate[i][2][0]), shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endStroke();
            }
        }
        return shape;
    }
    // 获取声音实例
    function s(sceneName, resName) {
        return new annie.Sound(annie.res[sceneName][resName]);
    }
    /**
     * <h4><font color="red">注意:小程序 小游戏不支持</font></h4>
     * 获取url地址中的get参数
     * @method annie.getQueryString
     * @static
     * @param name
     * @return {any}
     * @since 1.0.9
     * @public
     * @example
     *      //如果当前网页的地址为http://xxx.xxx.com?id=1&username=anlun
     *      //通过此方法获取id和username的值
     *      var id=annie.getQueryString("id");
     *      var userName=annie.getQueryString("username");
     *      console.log(id,userName);
     */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return null;
    }
    annie.getQueryString = getQueryString;
    /**
     * 引擎自调用.初始化 sprite和movieClip用
     * @method annie.initRes
     * @param target
     * @param {string} sceneName
     * @param {string} resName
     * @public
     * @static
     */
    function initRes(target, sceneName, resName) {
        var Root = annie.classPool;
        //资源树最顶层
        var resRoot = annie.res[sceneName];
        //资源树里类对象json数据
        var classRoot = resRoot._a2x_con;
        //资源树里类对象json数据里非资源类数据
        var resClass = classRoot[resName];
        //时间轴
        target._a2x_res_class = resClass;
        var isMc = false;
        var i;
        if (resClass.tf > 1) {
            isMc = true;
            if (resClass.timeLine == void 0) {
                //将时间轴丰满,抽出脚本，抽出标签
                var keyFrameCount = resClass.f.length;
                var timeLine = [];
                var curKeyFrame = keyFrameCount > 0 ? resClass.f[0].i : resClass.tf;
                var nextFrame = 0;
                if (curKeyFrame > 0) {
                    var frameValue = -1;
                    for (var j = 0; j < curKeyFrame; j++) {
                        timeLine[timeLine.length] = frameValue;
                    }
                }
                if (keyFrameCount > 0) {
                    for (i = 0; i < keyFrameCount; i++) {
                        if (i + 1 < keyFrameCount) {
                            nextFrame = resClass.f[i + 1].i;
                        }
                        else {
                            nextFrame = resClass.tf;
                        }
                        curKeyFrame = resClass.f[i].i;
                        //将时间线补齐
                        for (var j = 0; j < nextFrame - curKeyFrame; j++) {
                            timeLine[timeLine.length] = i;
                        }
                    }
                }
                resClass.timeLine = timeLine;
                //初始化标签对象方便gotoAndStop gotoAndPlay
                if (!(resClass.f instanceof Object))
                    resClass.f = [];
                if (!(resClass.a instanceof Object))
                    resClass.a = {};
                if (!(resClass.s instanceof Object))
                    resClass.s = {};
                if (!(resClass.e instanceof Object))
                    resClass.e = {};
                var label = {};
                if (!(resClass.l instanceof Object)) {
                    resClass.l = [];
                }
                else {
                    for (var index in resClass.l) {
                        for (var n = 0; n < resClass.l[index].length; n++) {
                            label[resClass.l[index][n]] = parseInt(index) + 1;
                        }
                    }
                }
                resClass.label = label;
            }
        }
        var children = resClass.c;
        if (children instanceof Object) {
            var allChildren = [];
            var objCount = children.length;
            var obj = null;
            var objType = 0;
            var maskObj = null;
            var maskTillId = 0;
            for (i = 0; i < objCount; i++) {
                //if (children[i].indexOf("_$") == 0) {
                if (classRoot[children[i]] instanceof Array) {
                    objType = classRoot[children[i]][0];
                }
                else {
                    objType = classRoot[children[i]].t;
                }
                switch (objType) {
                    case 1:
                    case 4:
                        //text 和 Sprite
                        //检查是否有名字，并且已经初始化过了
                        if (resClass.n && resClass.n[i] && target[resClass.n[i]]) {
                            obj = target[resClass.n[i]];
                        }
                        else {
                            if (objType == 4) {
                                obj = t(sceneName, children[i]);
                            }
                            else {
                                //displayObject
                                if (children[i].indexOf("_$") == 0) {
                                    if (classRoot[children[i]].tf > 1) {
                                        obj = new annie.MovieClip();
                                    }
                                    else {
                                        obj = new annie.Sprite();
                                    }
                                    initRes(obj, sceneName, children[i]);
                                }
                                else {
                                    obj = new Root[sceneName][children[i]]();
                                }
                            }
                            if (resClass.n && resClass.n[i]) {
                                target[resClass.n[i]] = obj;
                                obj.name = resClass.n[i];
                            }
                        }
                        break;
                    case 2:
                        //bitmap
                        obj = b(sceneName, children[i]);
                        break;
                    case 3:
                        //shape
                        obj = g(sceneName, children[i]);
                        break;
                    case 5:
                        //sound
                        obj = s(sceneName, children[i]);
                        obj.name = children[i];
                        target.addSound(obj);
                }
                if (!isMc) {
                    var index = i + 1;
                    if (objType == 5) {
                        obj._loop = obj._repeate = resClass.s[0][index];
                    }
                    else {
                        d(obj, resClass.f[0].c[index]);
                        // 检查是否有遮罩
                        if (resClass.f[0].c[index].ma != void 0) {
                            maskObj = obj;
                            maskTillId = resClass.f[0].c[index].ma - 1;
                        }
                        else {
                            if (maskObj instanceof Object && i <= maskTillId) {
                                obj.mask = maskObj;
                                if (i == maskTillId) {
                                    maskObj = null;
                                }
                            }
                        }
                        target.addChildAt(obj, 0);
                    }
                }
                else {
                    //这里一定把要声音添加到里面，以保证objectId与数组下标对应
                    allChildren[allChildren.length] = obj;
                    //如果是声音，还要把i这个顺序保存下来
                    if (objType == 5) {
                        obj.isPlaying = false;
                        if (!(target._a2x_sounds instanceof Object)) {
                            target._a2x_sounds = {};
                        }
                        target._a2x_sounds[i] = obj;
                    }
                }
            }
            if (isMc) {
                //将mc里面的实例按照时间轴上的图层排序
                var ol = resClass.ol;
                if (ol instanceof Object) {
                    for (var o = 0; o < ol.length; o++) {
                        target._a2x_res_children[o] = [ol[o], allChildren[ol[o] - 1]];
                    }
                }
            }
        }
    }
    annie.initRes = initRes;
    console.log("https://github.com/flash2x/AnnieJS");
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * TweenObj，具体的tween对象类
     * @class annie.TweenObj
     * @public
     * @since 1.0.0
     */
    var TweenObj = /** @class */ (function (_super) {
        __extends(TweenObj, _super);
        function TweenObj() {
            var _this = _super.call(this) || this;
            /**
             * 是否暂停，默认false
             * @property pause
             * @type {boolean}
             */
            _this.pause = false;
            /**
             * 当前帧
             * @property currentFrame
             * @type {number}
             */
            _this.currentFrame = 0;
            /**
             * 总帧数
             * @property totalFrames
             * @type {number}
             */
            _this.totalFrames = 0;
            _this._isLoop = 0;
            _this._delay = 0;
            _this._isFront = true;
            _this._cParams = null;
            _this._loop = false;
            return _this;
        }
        /**
         * 初始化数据
         * @method init
         * @param target
         * @param times
         * @param data
         * @param isTo
         * @param isPlay
         * @public
         * @since 1.0.0
         */
        TweenObj.prototype.init = function (target, times, data, isTo, isPlay) {
            if (isTo === void 0) { isTo = true; }
            if (isPlay === void 0) { isPlay = true; }
            if (times <= 0 || typeof (times) != "number") {
                throw new Error("annie.Tween.to()或者annie.Tween.from()方法的第二个参数一定要是大于0的数字");
            }
            var s = this;
            s.currentFrame = 1;
            var tTime = times * annie.Stage._FPS >> 0;
            s.totalFrames = tTime > 0 ? tTime : 1;
            s.target = target;
            s._isTo = isTo;
            s._isLoop = 0;
            s._startData = {};
            s._disData = {};
            s._delay = 0;
            s._isFront = true;
            s._ease = null;
            s._update = null;
            s._cParams = null;
            s._loop = false;
            s._completeFun = null;
            for (var item in data) {
                switch (item) {
                    case "useFrame":
                        if (data[item] == true) {
                            s.totalFrames = times;
                        }
                        break;
                    case "yoyo":
                        if (typeof (data[item]) == "number") {
                            s._isLoop = data[item];
                        }
                        else {
                            if (data[item] == false) {
                                s._isLoop = 0;
                            }
                            else if (data[item] == true) {
                                s._isLoop = Number.MAX_VALUE;
                            }
                        }
                        break;
                    case "delay":
                        if (data.useFrame) {
                            s._delay = data[item];
                        }
                        else {
                            s._delay = data[item] * annie.Stage._FPS >> 0;
                        }
                        break;
                    case "ease":
                        s._ease = data[item];
                        break;
                    case "onUpdate":
                        s._update = data[item];
                        break;
                    case "onComplete":
                        s._completeFun = data[item];
                        break;
                    case "completeParams":
                        s._cParams = data[item];
                        break;
                    case "loop":
                        s._loop = data[item];
                        break;
                    default:
                        if (typeof (data[item]) == "number") {
                            if (isTo) {
                                s._startData[item] = target[item];
                                s._disData[item] = data[item] - target[item];
                            }
                            else {
                                s._startData[item] = data[item];
                                s._disData[item] = target[item] - data[item];
                                target[item] = data[item];
                            }
                        }
                }
            }
        };
        /**
         * 更新数据
         * @method update
         * @since 1.0.0
         * @public
         */
        TweenObj.prototype.update = function () {
            var s = this;
            if (s.pause)
                return;
            if (s._isFront && s._delay > 0) {
                s._delay--;
                return;
            }
            //更新数据
            var per = s.currentFrame / s.totalFrames;
            if (per < 0 || per > 1)
                return;
            if (s._ease) {
                per = s._ease(per);
            }
            var isHave = false;
            for (var item in s._disData) {
                isHave = true;
                s.target[item] = s._startData[item] + s._disData[item] * per;
            }
            if (!isHave) {
                //如果发现tween被全新的tween全部给替换了，那就直接回收这个
                Tween.kill(s.instanceId);
                return;
            }
            if (s._update) {
                s._update(per);
            }
            var cf = s._completeFun;
            var pm = s._cParams;
            if (s._isFront) {
                s.currentFrame++;
                if (s.currentFrame > s.totalFrames) {
                    if (s._loop) {
                        s.currentFrame = 1;
                    }
                    else {
                        if (cf) {
                            cf(pm, s._isLoop == 0);
                        }
                        if (s._isLoop > 0) {
                            s._isFront = false;
                            s.currentFrame = s.totalFrames;
                            s._isLoop--;
                        }
                        else {
                            Tween.kill(s.instanceId);
                        }
                    }
                }
            }
            else {
                s.currentFrame--;
                if (s.currentFrame < 0) {
                    if (cf) {
                        cf(pm, s._isLoop == 0);
                    }
                    if (s._isLoop > 0) {
                        s._isFront = true;
                        s.currentFrame = 1;
                    }
                    else {
                        Tween.kill(s.instanceId);
                    }
                }
            }
        };
        TweenObj.prototype.destroy = function () {
            var s = this;
            s._update = null;
            s._completeFun = null;
            s._ease = null;
        };
        return TweenObj;
    }(annie.AObject));
    annie.TweenObj = TweenObj;
    /**
     * 全局静态单列类,不要实例化此类
     * @class annie.Tween
     * @public
     * @since 1.0.0
     */
    var Tween = /** @class */ (function () {
        function Tween() {
        }
        /**
         * 将target对象从data中指定的属性数值渐变到target属性当前的数值
         * @method to
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 如果data.useFrame为true 这里就是帧数，如果data.useFrame为false则这里就是时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否像摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成结束函数. 默认为null. 两个参数，第一个是data.completeParams的值,第二个是true或者false，表示是否真的结束了,或者是一次yoyo,一次loop的结束
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数,回传参数是当前的Tween时间比.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        Tween.to = function (target, totalFrame, data) {
            return Tween.createTween(target, totalFrame, data, true);
        };
        /**
         * 将target对象从data中指定的属性数值渐变到target属性当前的数值
         * @method from
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 如果data.useFrame为true 这里就是帧数，如果data.useFrame为false则这里就是时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否像摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成结束函数. 默认为null. 两个参数，第一个是data.completeParams的值,第二个是true或者false，表示是否真的结束了,或者是一次yoyo,一次loop的结束
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数,回传参数是当前的Tween时间比.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        Tween.from = function (target, totalFrame, data) {
            return Tween.createTween(target, totalFrame, data, false);
        };
        Tween.createTween = function (target, totalFrame, data, isTo, isPlay) {
            if (isPlay === void 0) { isPlay = true; }
            var tweenObj;
            var len = Tween._tweenList.length;
            for (var i = 0; i < len; i++) {
                tweenObj = Tween._tweenList[i];
                if (target == tweenObj.target) {
                    for (var item in tweenObj._startData) {
                        if (data[item] != undefined) {
                            delete tweenObj._startData[item];
                            delete tweenObj._disData[item];
                        }
                    }
                }
            }
            len = Tween._tweenPool.length;
            if (len > 0) {
                tweenObj = Tween._tweenPool.shift();
                //考虑到对象池回收后需要变更id
                tweenObj._instanceId = annie.AObject["_object_id"]++;
            }
            else {
                tweenObj = new TweenObj();
            }
            Tween._tweenList.push(tweenObj);
            tweenObj.init(target, totalFrame, data, isTo, isPlay);
            return tweenObj.instanceId;
        };
        /**
         * 销毁所有正在运行的Tween对象
         * @method killAll
         * @static
         * @public
         * @since 1.0.0
         */
        Tween.killAll = function () {
            var len = Tween._tweenList.length;
            var tweenObj;
            for (var i = 0; i < len; i++) {
                tweenObj = Tween._tweenList[i];
                tweenObj.target = null;
                tweenObj._completeFun = null;
                tweenObj._cParams = null;
                tweenObj._update = null;
                tweenObj._ease = null;
                tweenObj._loop = false;
                Tween._tweenPool.push(tweenObj);
            }
            Tween._tweenList.length = 0;
        };
        /**
         * @通过创建Tween对象返回时的唯一id来销毁对应的Tween对象
         * @method kill
         * @static
         * @public
         * @param {annie.Tween} tween
         * @since 1.0.0
         */
        Tween.kill = function (tweenId) {
            var len = Tween._tweenList.length;
            var tweenObj;
            for (var i = 0; i < len; i++) {
                tweenObj = Tween._tweenList[i];
                if (tweenObj.instanceId == tweenId) {
                    tweenObj.target = null;
                    tweenObj._completeFun = null;
                    tweenObj._cParams = null;
                    tweenObj._update = null;
                    tweenObj._ease = null;
                    tweenObj._loop = null;
                    Tween._tweenPool.push(tweenObj);
                    Tween._tweenList.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * quadraticIn缓动类型
         * @method quadraticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quadraticIn = function (k) {
            return k * k;
        };
        /**
         * quadraticOut 缓动类型
         * @method quadraticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quadraticOut = function (k) {
            return k * (2 - k);
        };
        /**
         * quadraticInOut 缓动类型
         * @method quadraticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quadraticInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        };
        /**
         * cubicIn 缓动类型
         * @method cubicIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.cubicIn = function (k) {
            return k * k * k;
        };
        /**
         * cubicOut 缓动类型
         * @method cubicOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.cubicOut = function (k) {
            return --k * k * k + 1;
        };
        /**
         * cubicInOut 缓动类型
         * @method cubicInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.cubicInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        };
        /**
         * quarticIn 缓动类型
         * @method quarticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quarticIn = function (k) {
            return k * k * k * k;
        };
        /**
         * quarticOut 缓动类型
         * @method quarticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quarticOut = function (k) {
            return 1 - (--k * k * k * k);
        };
        /**
         * quarticInOut 缓动类型
         * @method quarticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quarticInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        };
        /**
         * quinticIn 缓动类型
         * @method quinticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quinticIn = function (k) {
            return k * k * k * k * k;
        };
        /**
         * quinticOut 缓动类型
         * @method quinticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quinticOut = function (k) {
            return --k * k * k * k * k + 1;
        };
        /**
         * quinticInOut 缓动类型
         * @method quinticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.quinticInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        };
        /**
         * sinusoidalIn 缓动类型
         * @method sinusoidalIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.sinusoidalIn = function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        };
        /**
         * sinusoidalOut 缓动类型
         * @method sinusoidalOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.sinusoidalOut = function (k) {
            return Math.sin(k * Math.PI / 2);
        };
        /**
         * sinusoidalInOut 缓动类型
         * @method sinusoidalInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.sinusoidalInOut = function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        };
        /**
         * exponentialIn 缓动类型
         * @method exponentialIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.exponentialIn = function (k) {
            return k == 0 ? 0 : Math.pow(1024, k - 1);
        };
        /**
         * exponentialOut 缓动类型
         * @method exponentialOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.exponentialOut = function (k) {
            return k == 1 ? 1 : 1 - Math.pow(2, -10 * k);
        };
        /**
         * exponentialInOut 缓动类型
         * @method exponentialInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.exponentialInOut = function (k) {
            if (k == 0) {
                return 0;
            }
            if (k == 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        };
        /**
         * circularIn 缓动类型
         * @method circularIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.circularIn = function (k) {
            return 1 - Math.sqrt(1 - k * k);
        };
        /**
         * circularOut 缓动类型
         * @method circularOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.circularOut = function (k) {
            return Math.sqrt(1 - (--k * k));
        };
        /**
         * circularInOut 缓动类型
         * @method circularInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.circularInOut = function (k) {
            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        };
        /**
         * elasticIn 缓动类型
         * @method elasticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.elasticIn = function (k) {
            if (k == 0) {
                return 0;
            }
            if (k == 1) {
                return 1;
            }
            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        };
        /**
         * elasticOut 缓动类型
         * @method elasticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.elasticOut = function (k) {
            if (k == 0) {
                return 0;
            }
            if (k == 1) {
                return 1;
            }
            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
        };
        /**
         * elasticInOut 缓动类型
         * @method elasticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.elasticInOut = function (k) {
            if (k == 0) {
                return 0;
            }
            if (k == 1) {
                return 1;
            }
            k *= 2;
            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        };
        /**
         * backIn 缓动类型
         * @method backIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.backIn = function (k) {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        };
        /**
         * backOut 缓动类型
         * @method backOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.backOut = function (k) {
            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        };
        /**
         * backInOut 缓动类型
         * @method backInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.backInOut = function (k) {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        };
        /**
         * bounceIn 缓动类型
         * @method bounceIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.bounceIn = function (k) {
            return 1 - Tween.bounceOut(1 - k);
        };
        /**
         * bounceOut 缓动类型
         * @method bounceOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.bounceOut = function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            }
            else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            }
            else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            }
            else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        };
        /**
         * bounceInOut 缓动类型
         * @method bounceInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        Tween.bounceInOut = function (k) {
            if (k < 0.5) {
                return Tween.bounceIn(k * 2) * 0.5;
            }
            return Tween.bounceOut(k * 2 - 1) * 0.5 + 0.5;
        };
        //这里之所有要独立运行,是因为可能存在多个stage，不能把这个跟其中任何一个stage放在一起update
        Tween.flush = function () {
            var len = Tween._tweenList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (Tween._tweenList[i]) {
                    Tween._tweenList[i].update();
                }
                else {
                    Tween._tweenList.splice(i, 1);
                }
            }
        };
        Tween._tweenPool = [];
        Tween._tweenList = [];
        return Tween;
    }());
    annie.Tween = Tween;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 定时器类
     * @class annie.Timer
     * @public
     * @since 1.0.9
     */
    var Timer = /** @class */ (function (_super) {
        __extends(Timer, _super);
        //Evetns
        /**
         * annie.Timer定时器触发事件
         * @event annie.Event.TIMER
         * @since 1.0.9
         */
        /**
         * annie.Timer定时器完成事件
         * @event annie.Event.TIMER_COMPLETE
         * @since 1.0.9
         */
        /**
         * 构造函数，初始化
         * @method Timer
         * @param {number} delay
         * @param {number} repeatCount
         * @example
         *      var timer=new annie.Timer(1000,10);
         *      timer.addEventListener(annie.Event.TIMER,function (e) {
         *          console.log("once");
         *      })
         *      timer.addEventListener(annie.Event.TIMER_COMPLETE, function (e) {
         *          console.log("complete");
         *          e.target.kill();
         *      })
         *      timer.start();
         */
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            var _this = _super.call(this) || this;
            _this._currentCount = 0;
            _this._delay = 0;
            _this._frameDelay = 0;
            _this._currentFrameDelay = 0;
            _this._repeatCount = 0;
            _this._running = false;
            if (delay <= 0) {
                delay = 1;
            }
            var s = _this;
            s._delay = delay;
            s._frameDelay = Math.ceil(delay * 0.001 * annie.Stage._FPS);
            s._repeatCount = repeatCount;
            Timer._timerList.push(s);
            return _this;
        }
        /**
         * 重置定时器
         * @method reset
         * @public
         * @since 1.0.9
         */
        Timer.prototype.reset = function () {
            var s = this;
            s._running = false;
            s._currentCount = 0;
            s._currentFrameDelay = 0;
        };
        /**
         * 开始执行定时器
         * @method start
         * @public
         * @since 1.0.9
         */
        Timer.prototype.start = function () {
            var s = this;
            s._running = true;
            if (s._currentCount == s._repeatCount) {
                s._currentCount = 0;
            }
        };
        /**
         * 停止执行定时器，通过再次调用start方法可以接着之前未完成的状态运行
         * @method stop
         * @public
         * @since 1.0.9
         */
        Timer.prototype.stop = function () {
            this._running = false;
        };
        Object.defineProperty(Timer.prototype, "currentCount", {
            /**
             * 当前触发了多少次Timer事件
             * @property currentCount
             * @readonly
             * @public
             * @since 1.0.9
             * @return {number}
             */
            get: function () {
                return this._currentCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "delay", {
            /**
             * 设置或者获取当前定时器之间的执行间隔
             * @property delay
             * @since 1.0.9
             * @public
             * @return {number}
             */
            get: function () {
                return this._delay;
            },
            set: function (value) {
                this._delay = value;
                this._frameDelay = Math.ceil(value * 0.001 * annie.Stage._FPS);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "repeatCount", {
            /**
             * 执行触发Timer 的总次数
             * @method repeatCount
             * @public
             * @since 1.0.9
             * @return {number}
             */
            get: function () {
                return this._repeatCount;
            },
            set: function (value) {
                if (value < 0) {
                    value = 0;
                }
                this._repeatCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "running", {
            /**
             * 当前是否在运行中
             * @property running
             * @since 1.0.9
             * @return {boolean}
             */
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时缠绕着你
         * @method kill
         * @public
         * @since 1.0.9
         */
        Timer.prototype.kill = function () {
            var len = Timer._timerList.length;
            var s = this;
            for (var i = 0; i < len; i++) {
                if (Timer._timerList[i]._instanceId == s._instanceId) {
                    Timer._timerList.splice(i, 1);
                    break;
                }
            }
        };
        Timer.prototype.update = function () {
            var s = this;
            if (s._running) {
                s._currentFrameDelay++;
                if (s._currentFrameDelay == s._frameDelay) {
                    if (s._repeatCount) {
                        s._currentCount++;
                    }
                    s._currentFrameDelay = 0;
                    //触发事件
                    s.dispatchEvent("onTimer");
                    if (s._repeatCount && s._currentCount == s._repeatCount) {
                        //触发完成时事件
                        s._running = false;
                        s.dispatchEvent("onTimerComplete");
                    }
                }
            }
        };
        Timer.flush = function () {
            var len = Timer._timerList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (Timer._timerList[i]) {
                    Timer._timerList[i].update();
                }
                else {
                    Timer._timerList.splice(i, 1);
                }
            }
        };
        Timer.prototype.destroy = function () {
            var s = this;
            s.kill();
            _super.prototype.destroy.call(this);
        };
        Timer._timerList = [];
        return Timer;
    }(annie.EventDispatcher));
    annie.Timer = Timer;
})(annie || (annie = {}));
/**
 * @class annie
 */
var annie;
(function (annie) {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 是否开启调试模式
     * @public
     * @since 1.0.1
     * @public
     * @property annie.debug
     * @type {boolean}
     * @example
     *      //在初始化stage之前输入以下代码，将会在界面调出调度面板
     *      annie.debug=true;
     */
    annie.version = "3.2.2";
    annie.app = null;
    annie.isSharedCanvas = false;
    /**
     * 全局事件触发器
     * @static
     * @property  annie.globalDispatcher
     * @type {annie.EventDispatcher}
     * @public
     * @since 1.0.0
     * @example
     *      //A代码放到任何合适的地方
     *      annie.globalDispatcher.addEventListener("myTest",function(e){
     *          console.log("收到了其他地方发来的消息:"+e.data);
     *      });
     *      //B代码放到任何一个可以点击的对象的构造函数中
     *      this.addEventListener(annie.MouseEvent.CLICK,function(e){
     *          annie.globalDispatcher.dispatchEvent("myTest","我是小可");
     *      });
     *
     */
    annie.globalDispatcher = new annie.EventDispatcher();
    /**
     * 设备的retina值,简单点说就是几个像素表示设备上的一个点
     * @property annie.devicePixelRatio
     * @type {number}
     * @since 1.0.0
     * @public
     * @static
     * @example
     *      //打印当前设备的retina值
     *      console.log(annie.devicePixelRatio);
     */
    annie.devicePixelRatio = 1;
    /**
     * 一个 StageScaleMode 中指定要使用哪种缩放模式的值。以下是有效值：
     * StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。
     * StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的两侧可能会显示边框。
     * StageScaleMode.NO_BORDER -- 整个应用程序填满指定区域，不发生扭曲，但有可能进行一些裁切，同时保持应用程序的原始高宽比。
     * StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * StageScaleMode.FIXED_WIDTH -- 整个应用程序的宽固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * StageScaleMode.FIXED_HEIGHT -- 整个应用程序的高固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * @property annie.StageScaleMode
     * @type {Object}
     * @public
     * @since 1.0.0
     * @static
     * @example
     *      //动态更改stage的对齐方式示例
     *      //以下代码放到一个舞台的显示对象的构造函数中
     *      let s=this;
     *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
     *          let i=0;
     *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
     *              let aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
     *              s.stage.scaleMode=aList[i];
     *              if(i>5){i=0;}
     *          }
     *      }
     *
     */
    annie.StageScaleMode = {
        EXACT_FIT: "exactFit",
        NO_BORDER: "noBorder",
        NO_SCALE: "noScale",
        SHOW_ALL: "showAll",
        FIXED_WIDTH: "fixedWidth",
        FIXED_HEIGHT: "fixedHeight"
    };
    var _dRender;
    annie.toDisplayDataURL = function (obj, rect, typeInfo, bgColor) {
        if (rect === void 0) { rect = null; }
        if (typeInfo === void 0) { typeInfo = null; }
        if (bgColor === void 0) { bgColor = ""; }
        if (!_dRender) {
            _dRender = new annie.OffCanvasRender();
            _dRender.init();
        }
        obj._updateMatrix();
        if (rect == null) {
            rect = obj.getBounds();
        }
        var w = Math.ceil(rect.width);
        var h = Math.ceil(rect.height);
        _dRender.reSize(w, h);
        _dRender.begin(bgColor);
        annie.OffCanvasRender._ctx.translate(-rect.x, -rect.y);
        _dRender.draw(obj);
        if (!typeInfo) {
            typeInfo = { type: "png" };
        }
        else {
            if (typeInfo.quality) {
                typeInfo.quality /= 100;
            }
        }
        return annie.OffCanvasRender.rootContainer.toDataURL("image/" + typeInfo.type, typeInfo.quality);
    };
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 获取显示区域的颜色值，会返回颜色值的数组
     * @method annie.getStagePixels
     * @param {annie.Stage} stage
     * @param {annie.Rectangle} rect
     * @return {Array}
     * @public
     * @since 1.1.1
     */
    annie.getStagePixels = function (stage, rect) {
        var newPoint = stage.localToGlobal(new annie.Point(rect.x, rect.y));
        return annie.CanvasRender._ctx.getImageData(newPoint.x, newPoint.y, rect.width, rect.height);
    };
})(annie || (annie = {}));
/**
 * @class 全局类和方法
 */
annie.Stage["addUpdateObj"](annie.Tween);
annie.Stage["addUpdateObj"](annie.Timer);

annie.A2xExtend=__extends;
annie.app=wx;
GameGlobal.AnnieRoot=annie.classPool;
GameGlobal.trace = console.log;
GameGlobal.annie = annie;
module.exports=annie;
