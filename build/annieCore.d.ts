/**
 * @module annie
 */
declare namespace annie {
    /**
     * annie引擎类的基类
     * @class annie.AObject
     * @since 1.0.0
     */
    abstract class AObject {
        protected _instanceId: number;
        protected _instanceType: string;
        protected static _object_id: number;
        constructor();
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
        readonly instanceId: number;
        /**
         * 每一个annie类都有一个实例类型字符串，通过这个字符串，你能知道这个实例是从哪个类实例而来
         * @property instanceType
         * @since 1.0.3
         * @public
         * @type {string}
         * @readonly
         */
        readonly instanceType: string;
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
        destroy(): void;
    }
    /**
     * 事件触发基类
     * @class annie.EventDispatcher
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class EventDispatcher extends AObject {
        protected eventTypes: any;
        protected eventTypes1: any;
        constructor();
        private static _MECO;
        static _totalMEC: number;
        static getMouseEventCount(type?: string): number;
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
        addEventListener(type: string, listener: Function, useCapture?: boolean): void;
        private _changeMouseCount;
        private _defaultEvent;
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
        dispatchEvent(event: any, data?: any, useCapture?: boolean): boolean;
        /**
         * 是否有添加过此类型的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类型
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @return {boolean} 如果有则返回true
         */
        hasEventListener(type: string, useCapture?: boolean): boolean;
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
        removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        /**
         * 移除对象中所有的侦听
         * @method removeAllEventListener
         * @public
         * @since 1.0.0
         * @return {void}
         */
        removeAllEventListener(): void;
        /**
         *
         */
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 事件类,annie引擎中一切事件的基类
     * @class annie.Event
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class Event extends AObject {
        /**
         * annie.Stage舞台初始化完成后会触发的事件
         * @property ON_INIT_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ON_INIT_STAGE: string;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * annie.Stage舞台尺寸发生变化时触发
         * @property RESIZE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static RESIZE: string;
        /**
         * annie引擎暂停或者恢复暂停时触发，这个事件只能在annie.globalDispatcher中监听
         * @property ON_RUN_CHANGED
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ON_RUN_CHANGED: string;
        /**
         * annie.Media相关媒体类的播放刷新事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_UPDATE
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_PLAY_UPDATE: string;
        /**
         * annie.Media相关媒体类的播放完成事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_PLAY_END: string;
        /**
         * annie.Media相关媒体类的开始播放事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_PLAY_START: string;
        /**
         * annie.FlipBook组件翻页开始事件
         * @property ON_FLIP_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_FLIP_START: string;
        /**
         * annie.FlipBook组件翻页结束事件
         * @property ON_FLIP_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_FLIP_STOP: string;
        /**
         * annie.ScrollPage组件滑动到开始位置事件
         * @property ON_SCROLL_TO_HEAD
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_SCROLL_TO_HEAD: string;
        /**
         * annie.ScrollPage组件停止滑动事件
         * @property ON_SCROLL_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_SCROLL_STOP: string;
        /**
         * annie.ScrollPage组件开始滑动事件
         * @property ON_SCROLL_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_SCROLL_START: string;
        /**
         * annie.Scroller组件开始滑动事件
         * @property ON_SCROLL_ING
         * @static
         * @since 3.1.0
         * @type {string}
         */
        static ON_SCROLL_ING: string;
        /**
         * annie.ScrollPage组件滑动到结束位置事件
         * @property ON_SCROLL_TO_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_SCROLL_TO_END: string;
        /**
         * annie.Slide 组件开始滑动事件
         * @property ON_SLIDE_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_SLIDE_START: string;
        /**
         * annie.Slide 组件结束滑动事件
         * @property ON_SLIDE_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        static ON_SLIDE_END: string;
        /**
         * annie.DisplayObject显示对象加入到舞台事件
         * @property ADD_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ADD_TO_STAGE: string;
        /**
         * annie.DisplayObject显示对象从舞台移出事件
         * @property REMOVE_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static REMOVE_TO_STAGE: string;
        /**
         * annie.DisplayObject显示对象 循环帧事件
         * @property ENTER_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ENTER_FRAME: string;
        /**
         * annie.MovieClip 播放完成事件
         * @property END_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static END_FRAME: string;
        /**
         * annie.MovieClip 帧标签事件
         * @property CALL_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static CALL_FRAME: string;
        /**
         * 完成事件
         * @property COMPLETE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static COMPLETE: string;
        /**
         * annie.URLLoader加载过程事件
         * @property PROGRESS
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static PROGRESS: string;
        /**
         * annie.URLLoader出错事件
         * @property ERROR
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ERROR: string;
        /**
         * annie.URLLoader中断事件
         * @property ABORT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ABORT: string;
        /**
         * annie.URLLoader开始事件
         * @property START
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static START: string;
        /**
         * annie.Timer定时器触发事件
         * @property TIMER
         * @static
         * @since 1.0.9
         * @public
         * @type {string}
         */
        static TIMER: string;
        /**
         * annie.Timer定时器完成事件
         * @property TIMER_COMPLETE
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        static TIMER_COMPLETE: string;
        /**
         * annie.ScratchCard 刮刮卡事件，刮了多少，一个百分比
         * @property ON_DRAW_PERCENT
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        static ON_DRAW_PERCENT: string;
        /**
         * 事件类型名
         * @property type
         * @type {string}
         * @public
         * @since 1.0.0
         */
        type: string;
        /**
         * 触发此事件的对象
         * @property target
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        target: any;
        /**
         * 随着事件一起附带的信息对象
         * 所有需要随事件一起发送的信息都可以放在此对象中
         * @property data
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        data: any;
        /**
         * @method Event
         * @param {string} type 事件类型
         * @public
         * @since 1.0.0
         */
        constructor(type: string);
        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
         * @method stopImmediatePropagation
         * @public
         * @return {void}
         * @since 2.0.0
         */
        stopImmediatePropagation(): void;
        private _pd;
        destroy(): void;
        /**
         * 重置事件到初始状态方便重复利用
         * @method reset
         * @param {string} type
         * @param target
         * @since 2.0.0
         * @return {void}
         * @public
         */
        reset(type: string, target: any): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 鼠标事件类,电脑端鼠标,移动设备端的触摸都使用此事件来监听
     * @class annie.MouseEvent
     * @extends annie.Event
     * @public
     * @since 1.0.0
     */
    class MouseEvent extends Event {
        /**
         * annie.DisplayObject鼠标或者手指按下事件
         * @property MOUSE_DOWN
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_DOWN: string;
        /**
         * annie.DisplayObject鼠标或者手指抬起事件
         * @property MOUSE_UP
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_UP: string;
        /**
         * annie.DisplayObject鼠标或者手指单击
         * @property CLICK
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static CLICK: string;
        /**
         * annie.DisplayObject鼠标或者手指移动事件
         * @property MOUSE_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_MOVE: string;
        /**
         * annie.DisplayObject鼠标或者手指移入到显示对象上里触发的事件
         * @property MOUSE_OVER
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_OVER: string;
        /**
         * annie.DisplayObject鼠标或者手指移出显示对象边界触发的事件
         * @property MOUSE_OUT
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_OUT: string;
        /**
         * mouse或touch事件时rootDiv坐标x点
         * @property clientX
         * @public
         * @since 1.0.0
         * @type {number}
         */
        clientX: number;
        /**
         * mouse或touch事件时rootDiv坐标y点
         * @property clientY
         * @public
         * @since 1.0.0
         * @type {number}
         */
        clientY: number;
        /**
         * mouse或touch事件时全局坐标x点
         * @property stageX
         * @public
         * @since 1.0.0
         * @type {number}
         */
        stageX: number;
        /**
         * mouse或touch事件时全局坐标y点
         * @property stageY
         * @public
         * @since 1.0.0
         * @type {number}
         */
        stageY: number;
        /**
         * mouse或touch事件时本地坐标x点
         * @property localX
         * @public
         * @since 1.0.0
         * @type {number}
         */
        localX: number;
        /**
         * mouse或touch事件时本地坐标y点
         * @property localY
         * @public
         * @since 1.0.0
         * @type {number}
         */
        localY: number;
        /**
         * 绑定此事件的侦听对象
         * @property currentTarget
         * @public
         * @since 1.0.0
         * @type{annie.DisplayObject}
         * @default null
         */
        currentTarget: DisplayObject;
        /**
         * 触摸或者鼠标事件的手指唯一标识
         * @property identifier
         * @type {number}
         * @since 1.1.2
         * @public
         */
        identifier: any;
        /**
         * 当前时间戳
         * @property timeStamp
         * @type {number}
         */
        timeStamp: number;
        /**
         * @method MouseEvent
         * @public
         * @since 1.0.0
         * @param {string} type
         */
        constructor(type: string);
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         * @return {void}
         */
        updateAfterEvent(): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 多点触碰事件。单点事件请使用mouseEvent,pc和mobile通用
     * @class annie.TouchEvent
     * @extends annie.Event
     */
    class TouchEvent extends Event {
        /**
         * annie.Stage 的多点触碰事件。这个事件只能在annie.Stage对象上侦听
         * @property ON_MULTI_TOUCH
         * @static
         * @public
         * @since 1.0.3
         * @type {string}
         */
        static ON_MULTI_TOUCH: string;
        /**
         * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第1个点。
         * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
         * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
         * @property clientPoint1
         * @public
         * @since 1.0.3
         * @type {annie.Point}
         */
        clientPoint1: Point;
        /**
         * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第2个点。
         * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
         * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
         * @property clientPoint2
         * @public
         * @since 1.0.3
         * @type {annie.Point}
         */
        clientPoint2: Point;
        /**
         * 相对于上一次的缩放值
         * @property scale
         * @since 1.0.3
         */
        scale: number;
        /**
         * 相对于上一次的旋转值
         * @property rotate
         * @since 1.0.3
         */
        rotate: number;
        /**
         * @method TouchEvent
         * @public
         * @since 1.0.3
         * @param {string} type
         */
        constructor(type: string);
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         * @return {void}
         */
        updateAfterEvent(): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * @class annie.Point
     * @extends annie.AObject
     * @since 1.0.0
     * @public
     */
    class Point extends annie.AObject {
        destroy(): void;
        /**
         * 构造函数
         * @method Point
         * @public
         * @since 1.0.0
         * @param x
         * @param y
         */
        constructor(x?: number, y?: number);
        /**
         * 水平坐标
         * @property x
         * @public
         * @since 1.0.0
         * @type{number}
         */
        x: number;
        /**
         * 垂直坐标
         * @property y
         * @since 1.0.0
         * @public
         * @type {number}
         */
        y: number;
        /**
         * 求两点之间的距离
         * @method distance
         * @param args 可变参数 传两个参数的话就是两个annie.Point类型 传四个参数的话分别是两个点的x y x y
         * @return {number}
         * @static
         */
        static distance(...args: any[]): number;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 2维矩阵,不熟悉的朋友可以找相关书箱看看
     * @class annie.Matrix
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class Matrix extends annie.AObject {
        /**
         * @property a
         * @type {number}
         * @public
         * @default 1
         * @since 1.0.0
         */
        a: number;
        /**
         * @property b
         * @public
         * @since 1.0.0
         * @type {number}
         */
        b: number;
        /**
         * @property c
         * @type {number}
         * @public
         * @since 1.0.0
         */
        c: number;
        /**
         * @property d
         * @type {number}
         * @public
         * @since 1.0.0
         */
        d: number;
        /**
         * @property tx
         * @type {number}
         * @public
         * @since 1.0.0
         */
        tx: number;
        /**
         * @property ty
         * @type {number}
         * @since 1.0.0
         * @public
         */
        ty: number;
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
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
         * 复制一个矩阵
         * @method clone
         * @since 1.0.0
         * @public
         * @return {annie.Matrix}
         */
        clone(): Matrix;
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
        transformPoint: (x: number, y: number, bp?: Point) => Point;
        /**
         * 从一个矩阵里赋值给这个矩阵
         * @method setFrom
         * @param {annie.Matrix} mtx
         * @public
         * @since 1.0.0
         */
        setFrom(mtx: Matrix): void;
        /**
         * 将矩阵恢复成原始矩阵
         * @method identity
         * @public
         * @since 1.0.0
         */
        identity(): void;
        /**
         * 反转一个矩阵
         * @method invert
         * @return {Matrix}
         * @since 1.0.0
         * @public
         */
        invert(): Matrix;
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
        createBox(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, ax: number, ay: number): void;
        /**
         * 矩阵相乘
         * @method prepend
         * @public
         * @since 1.0.0
         * @param {annie.Matrix} mtx
         */
        prepend: (mtx: Matrix) => void;
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
        static isEqual(m1: Matrix, m2: Matrix): boolean;
        concat(mtx: annie.Matrix): void;
        /**
         * 对矩阵应用旋转转换。
         * @method rotate
         * @param angle
         * @since 1.0.3
         * @public
         */
        rotate(angle: number): void;
        /**
         * 对矩阵应用缩放转换。
         * @method scale
         * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
         * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
         * @since 1.0.3
         * @public
         */
        scale(sx: number, sy: number): void;
        /**
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @method translate
         * @public
         * @since 1.0.3
         * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位
         * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位
         */
        translate(dx: number, dy: number): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     *
     * @class annie.Rectangle
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class Rectangle extends AObject {
        /**
         * 构造函数
         * @method Rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
         * 矩形左上角的 x 坐标
         * @property x
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        x: number;
        /**
         * 矩形左上角的 y 坐标
         * @property y
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        y: number;
        /**
         * 矩形的宽度（以像素为单位）
         * @property width
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        width: number;
        /**
         * 矩形的高度（以像素为单位）
         * @property height
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        height: number;
        /**
         * 判断一个点是否在矩形内包括边
         * @method isPointIn
         * @param {annie.Point} point
         * @return {boolean}
         * @public
         * @since 1.0.0
         */
        isPointIn(point: Point): boolean;
        /**
         * 将多个矩形合成为一个矩形,并将结果存到第一个矩形参数返回
         * @method createFromRects
         * @param {annie.Rectangle} rect
         * @param {..arg} arg
         * @public
         * @since 1.0.0
         * @static
         */
        static createFromRects(...arg: Rectangle[]): Rectangle;
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
        static createFromPoints(rect: Rectangle, ...arg: Point[]): Rectangle;
        /**
         * 判读两个矩形是否相交
         * @method testRectCross
         * @public
         * @since 1.0.2
         * @param r1
         * @param r2
         * @return {boolean}
         */
        static testRectCross(ra: Rectangle, rb: Rectangle): boolean;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 定时器类
     * @class annie.Timer
     * @public
     * @since 1.0.9
     */
    class BlendMode {
        static NORMAL: number;
        static DARKEN: number;
        static MULTIPLY: number;
        static LIGHTEN: number;
        static SCREEN: number;
        static OVERLAY: number;
        static HARDLIGHT: number;
        static ADD: number;
        static SUBTRACT: number;
        static DIFFERENCE: number;
        static INVERT: number;
        static ERASE: number;
        static SOURCE_IN: number;
        static SOFT_LIGHT: number;
        static XOR: number;
        static COPY: number;
        static HUE: number;
        static SATURATION: number;
        static COLOR: number;
        static LUMINOSITY: number;
        static EXCLUSION: number;
        static COLOR_BURN: number;
        static COLOR_DODGE: number;
        static SOURCE_OUT: number;
        static SOURCE_ATOP: number;
        private static _modeList;
        static getBlendMode(mode: number): string;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 显示对象抽象类,不能直接实例化。一切显示对象的基类,包含了显示对象需要的一切属性
     * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
     * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕
     * 上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、TextField 或 MovieClip 类。
     * @class annie.DisplayObject
     * @since 1.0.0
     * @extends annie.EventDispatcher
     */
    abstract class DisplayObject extends EventDispatcher {
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
        /**
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        constructor();
        protected a2x_um: boolean;
        protected a2x_ua: boolean;
        protected a2x_uf: boolean;
        /**
         * 是否被缓存了
         * @property isCache
         * @since 3.2.0
         * @type {boolean}
         */
        readonly isCache: boolean;
        _isCache: boolean;
        /**
         * 是否将这个对象缓存为位图了
         * @property cacheAsBitmap
         * @since 3.2.0
         * @return {boolean}
         */
        cacheAsBitmap: boolean;
        private _cacheAsBitmap;
        /**
         * 此显示对象所在的舞台对象,如果此对象没有被添加到显示对象列表中,此对象为空。
         * @property stage
         * @public
         * @since 1.0.0
         * @type {Stage}
         * @default null;
         * @readonly
         * */
        stage: Stage;
        /**
         * 显示对象的父级
         * @property parent
         * @since 1.0.0
         * @public
         * @type {annie.Sprite}
         * @default null
         * @readonly
         */
        parent: Sprite;
        _cAlpha: number;
        _cMatrix: Matrix;
        /**
         * 是否可以接受点击事件,如果设置为false,此显示对象将无法接收到点击事件
         * @property mouseEnable
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        mouseEnable: boolean;
        /**
         * 每一个显示对象都可以给他命一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
         * @property name
         * @since 1.0.0
         * @public
         * @type {string}
         * @default ""
         */
        name: string;
        private _drawRect;
        private _UVRect;
        private _vertices;
        /**
         * 显示对象位置x
         * @property x
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        x: number;
        private _x;
        protected _offsetX: number;
        protected _offsetY: number;
        /**
         * 显示对象位置y
         * @property y
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        y: number;
        private _y;
        /**
         * 显示对象x方向的缩放值
         * @property scaleX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        scaleX: number;
        private _scaleX;
        /**
         * 显示对象y方向的缩放值
         * @property scaleY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        scaleY: number;
        private _scaleY;
        /**
         * 显示对象旋转角度
         * @property rotation
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        rotation: number;
        private _rotation;
        /**
         * 显示对象透明度
         * @property alpha
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         */
        alpha: number;
        private _alpha;
        /**
         * 显示对象x方向的斜切值
         * @property skewX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        skewX: number;
        private _skewX;
        /**
         * 显示对象y方向的斜切值
         * @property skewY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        skewY: number;
        private _skewY;
        /**
         * 显示对象上x方向的缩放或旋转点
         * @property anchorX
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        anchorX: number;
        private _anchorX;
        /**
         * 显示对象上y方向的缩放或旋转点
         * @property anchorY
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        anchorY: number;
        private _anchorY;
        /**
         * 显未对象是否可见
         * @property visible
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default 0
         */
        visible: boolean;
        _visible: boolean;
        /**
         * 显示对象的混合模式
         * 支持的混合模式大概有23种，具体查看annie.BlendMode
         * @property blendMode
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        blendMode: number;
        private _blendMode;
        /**
         * 显示对象的变形矩阵
         * @property matrix
         * @public
         * @since 1.0.0
         * @type {annie.Matrix}
         * @default null
         */
        readonly matrix: Matrix;
        private _matrix;
        /**
         * 显示对象的遮罩, 是一个Shape显示对象或是一个只包含shape显示对象的MovieClip
         * @property mask
         * @public
         * @since 1.0.0
         * @type {annie.DisplayObject}
         * @default null
         */
        mask: DisplayObject;
        private _mask;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 显示对象的滤镜数组
         * @property filters
         * @since 1.0.0
         * @public
         * @type {Array}
         * @default null
         */
        filters: any[];
        private _filters;
        _cp: boolean;
        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        globalToLocal(point: Point, bp?: Point): Point;
        /**
         *将本地坐标转换到全局坐标值
         * @method localToGlobal
         * @public
         * @since 1.0.0
         * @param {annie.Point} point
         * @return {annie.Point}
         */
        localToGlobal(point: Point, bp?: Point): Point;
        static _p1: Point;
        static _p2: Point;
        static _p3: Point;
        static _p4: Point;
        protected _isUseToMask: number;
        /**
         * annie.Sprite显示容器的接受鼠标点击的区域。一但设置，容器里所有子级将不会触发任何鼠标相关的事件。
         * 相当于 mouseChildren=false,但在有大量子级显示对象的情况下，此方法的性能搞出mouseChildren几个数量级，建议使用。
         * @property hitArea
         * @param {annie.Rectangle} rect
         * @since 3.0.1
         */
        hitArea: annie.Rectangle;
        private _hitArea;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 是否对图片对象使用像素碰撞检测透明度，默认关闭
         * @property hitTestWithPixel
         * @type {boolean}
         * @default false
         * @since 1.1.0
         */
        hitTestWithPixel: boolean;
        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} hitPoint 要检测碰撞的点
         * @param {boolean} isGlobalPoint 是不是全局坐标的点,默认false是本地坐标
         * @return {annie.DisplayObject}
         */
        hitTestPoint(hitPoint: Point, isGlobalPoint?: boolean): DisplayObject;
        getBounds(): Rectangle;
        /**
         * 获取对象形变后外切矩形
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         */
        getDrawRect(matrix?: annie.Matrix, bounds?: annie.Rectangle): annie.Rectangle;
        /**
         * 更新贴图
         */
        abstract _onUpdateTexture(): void;
        protected _onUpdateMatrixAndAlpha(): void;
        /**
         * 获取或者设置显示对象在父级里的x方向的宽，不到必要不要用此属性获取高
         * 如果你要同时获取宽高，建议使用 getWH()方法获取宽和高
         * @property  width
         * @public
         * @since 1.0.3
         * @return {number}
         */
        width: number;
        /**
         * 获取宽高
         * @method getWH
         * @since 1.1.0
         * @return {{w: number; h: number}}
         */
        getWH(): {
            w: number;
            h: number;
        };
        /**
         * 获取或者设置显示对象在父级里的y方向的高,不到必要不要用此属性获取高
         * 如果你要同时获取宽高，建议使用getWH()方法获取宽和高
         * @property  height
         * @public
         * @since 1.0.3
         * @return {number}
         */
        height: number;
        static _canvas: any;
        _texture: any;
        static _transformRect: Rectangle;
        protected _bounds: Rectangle;
        /**
         * 停止这个显示对象上的所有声音
         * @method stopAllSounds
         * @public
         * @since 2.0.0
         * @return {void}
         */
        stopAllSounds(): void;
        protected _needCheckWebGlUVAndUI: boolean;
        protected _checkWebGlUVAndUI(): void;
        /**
         * @method getSound
         * @param {number|string} id
         * @return {Array} 这个对象里所有叫这个名字的声音引用数组
         * @since 2.0.0
         */
        getSound(id: any): any;
        /**
         * 当前对象包含的声音列表
         * @property soundList
         * @public
         * @since 2.0.0
         * @type {Array}
         * @default []
         */
        soundList: any;
        /**
         * 返回一个id，这个id你要留着作为删除他时使用。
         * 这个声音会根据这个显示对象添加到舞台时播放，移出舞台而关闭
         * @method addSound
         * @param {annie.Sound} sound
         * @return {void}
         * @since 2.0.0
         * @public
         */
        addSound(sound: annie.Sound): void;
        /**
         * 删除一个已经添加进来的声音
         * @method removeSound
         * @public
         * @since 2.0.0
         * @param {number|string} id
         * @return {void}
         */
        removeSound(id: number | string): void;
        private _a2x_res_obj;
        destroy(): void;
        _isOnStage: boolean;
        _onRemoveEvent(isReSetMc: boolean): void;
        _onAddEvent(): void;
        _onUpdateFrame(mcSpeed?: number): void;
        /**
         * 启动鼠标或者触摸拖动
         * @method startDrag
         * @param {boolean} isCenter 指定将可拖动的对象锁定到指针位置中心 (true)，还是锁定到用户第一次单击该对象的位置 (false) 默认false
         * @param {annie.Rectangle} bounds 相对于显示对象父级的坐标的值，用于指定 Sprite 约束矩形
         * @since 1.1.2
         * @public
         * @return {void}
         */
        startDrag(isCenter?: boolean, bounds?: Rectangle): void;
        /**
         * 停止鼠标跟随
         * @method stopDrag
         */
        stopDrag(): void;
        private _changeTransformInfo;
        /**
         * 如果你在mc更改了对象的x y scale rotation alpha，最后想还原，不再需要自我控制，可以调用这方法
         * @method clearCustomTransform
         * @param transId{number}  //0->x,1->y,2->scaleX,3->scaleY,4->rotation,5->alpha,-1->all
         * @public
         * @since 3.1.0
         */
        clearCustomTransform(transId?: number): void;
        clearBounds(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象的引用的 Bitmap 对象。
     * 创建了 Bitmap 对象后，使用父 Sprite 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * @class annie.Bitmap
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.0
     */
    class Bitmap extends DisplayObject {
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
        constructor(bitmapData: any);
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * HTML的一个Image对象或者是canvas对象或者是video对象
         * @property bitmapData
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        bitmapData: any;
        private _cacheCanvas;
        protected _bitmapData: any;
        _onUpdateTexture(): void;
        protected _onUpdateMatrixAndAlpha(): void;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 从Bitmap中剥离出单独的小图以供特殊用途
         * @method convertToImage
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Bitmap} bitmap
         * @param {annie.Rectangle} rect 截图范围
         * @param {boolean} isNeedImage 是否一定要返回img，如果不为true则有时返回的是canvas
         * @return {Canvas|BitmapData}
         * @example
         *      var spriteSheetImg = new Image(),
         *      rect = new annie.Rectangle(0, 0, 200, 200),
         *      yourBitmap = new annie.Bitmap(spriteSheetImg, rect);
         *      spriteSheetImg.onload=function(e){
         *          var singleSmallImg = annie.Bitmap.convertToImage(yourBitmap);//convertToImage是annie.Bitmap的一个静态方法
         *          console.log(singleSmallImg);
         *      }
         *      spriteSheetImg.src = 'http://test.annie2x.com/test.jpg';
         */
        static convertToImage(bitmap: annie.Bitmap, rect: Rectangle, isNeedImage?: boolean): any;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 矢量对象
     * @class annie.Shape
     * @extends annie.Bitmap
     * @since 1.0.0
     * @public
     */
    class Shape extends Bitmap {
        constructor();
        private _command;
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
        static getGradientColor(points: any, colors: any): any;
        /**
         * 设置位图填充时需要使用的方法,一般给用户使用较少,Annie2x工具自动使用
         * @method getBitmapStyle
         * @static
         * @param {Image} image HTML Image元素
         * @return {CanvasPattern}
         * @public
         * @since 1.0.0
         */
        static getBitmapStyle(image: any): any;
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
        static getRGBA(color: string, alpha: number): string;
        private _isBitmapStroke;
        private _isBitmapFill;
        /**
         * 添加一条绘画指令,具体可以查阅Html Canvas画图方法
         * @method addDraw
         * @param {string} commandName ctx指令的方法名 如moveTo lineTo arcTo等
         * @param {Array} params
         * @public
         * @since 1.0.0
         * @return {void}
         */
        addDraw(commandName: string, params: Array<any>): void;
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
        drawRoundRect(x: number, y: number, w: number, h: number, rTL?: number, rTR?: number, rBL?: number, rBR?: number): void;
        /**
         * 绘画时移动到某一点
         * @method moveTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        moveTo(x: number, y: number): void;
        /**
         * 从上一点画到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method lineTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        lineTo(x: number, y: number): void;
        /**
         * 从上一点画弧到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method arcTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        arcTo(x: number, y: number): void;
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
        quadraticCurveTo(cpX: number, cpY: number, x: number, y: number): void;
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
        bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): void;
        /**
         * 闭合一个绘画路径
         * @method closePath
         * @public
         * @since 1.0.0
         * @return {void}
         */
        closePath(): void;
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
        drawRect(x: number, y: number, w: number, h: number): void;
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
        drawArc(x: number, y: number, radius: number, start: number, end: number): void;
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
        drawCircle(x: number, y: number, radius: number): void;
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
        drawEllipse(x: number, y: number, w: number, h: number): void;
        /**
         * 清除掉之前所有绘画的东西
         * @method clear
         * @public
         * @since 1.0.0
         * @return {void}
         */
        clear(): void;
        /**
         * 开始绘画填充,如果想画的东西有颜色填充,一定要从此方法开始
         * @method beginFill
         * @param {string} color 颜色值 单色和RGBA格式
         * @public
         * @since 1.0.0
         * @return {void}
         */
        beginFill(color: string): void;
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
        beginLinearGradientFill(points: any, colors: any): void;
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
        beginRadialGradientFill: (points: any, colors: any) => void;
        /**
         * 位图填充 一般给Annie2x用
         * @method beginBitmapFill
         * @param {Image} image
         * @param { Array} matrix
         * @public
         * @since 1.0.0
         * @return {void}
         */
        beginBitmapFill(image: any, matrix: Array<number>): void;
        private _fill;
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
        beginStroke(color: string, lineWidth?: number, cap?: number, join?: number, miter?: number): void;
        private static _caps;
        private static _joins;
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
        beginLinearGradientStroke(points: Array<number>, colors: any, lineWidth?: number, cap?: number, join?: number, miter?: number): void;
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
        beginRadialGradientStroke: (points: number[], colors: any, lineWidth?: number, cap?: number, join?: number, miter?: number) => void;
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
        beginBitmapStroke(image: any, matrix: Array<number>, lineWidth?: number, cap?: number, join?: number, miter?: number): void;
        private _stroke;
        /**
         * 结束填充
         * @method endFill
         * @public
         * @since 1.0.0
         * @return {void}
         */
        endFill(): void;
        /**
         * 设置虚线参数
         * @method setLineDash
         * @param {Array} data 一个长度为2的数组，第1个是虚线长度，第2个是虚线间隔，如果此参数为[]的空数组，则是清除虚线。
         *                如[5,20]是画虚线,[]则是请除虚线，变为实线
         * @since 2.0.2
         * @return {void}
         */
        setLineDash(data?: Array<number>): void;
        /**
         * 结束画线
         * @method endStroke
         * @public
         * @since 1.0.0
         * @return {void}
         */
        endStroke(): void;
        /**
         * 解析一段路径 一般给Annie2x用
         * @method decodePath
         * @param {Array} data
         * @public
         * @since 1.0.0
         * @return {void}
         */
        decodePath(data: Array<number>): void;
        private a2x_ut;
        _onUpdateTexture(): void;
        private _draw;
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
        changeColor(infoObj: any): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
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
    class Sprite extends DisplayObject {
        /**
         * 构造函数
         * @method Sprite
         * @public
         * @since 1.0.0
         */
        constructor();
        destroy(): void;
        /**
         * 容器类所有动画的播放速度，默认是1.如果有嵌套的话，速度相乘；
         * @property mcSpeed
         * @public
         * @type {number}
         * @since 3.1.5
         * @default 1
         *
         */
        mcSpeed: number;
        protected _cMcSpeed: number;
        /**
         * 是否可以让children接收鼠标事件
         * 鼠标事件将不会往下冒泡
         * @property mouseChildren
         * @type {boolean}
         * @default true
         * @public
         * @since 1.0.0
         */
        mouseChildren: boolean;
        /**
         * 显示对象的child列表
         * @property children
         * @type {Array}
         * @public
         * @since 1.0.0
         * @default []
         * @readonly
         */
        children: DisplayObject[];
        /**
         * 添加一个显示对象到Sprite
         * @method addChild
         * @param {annie.DisplayObject} child
         * @public
         * @since 1.0.0
         * @return {void}
         */
        addChild(child: DisplayObject): void;
        /**
         * 从Sprite中移除一个child
         * @method removeChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         * @return {void}
         */
        removeChild(child: DisplayObject): void;
        private static _getElementsByName;
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
        getChildByName(name: string | RegExp, isOnlyOne?: boolean, isRecursive?: boolean): any;
        /**
         * 添加一个child到Sprite中并指定添加到哪个层级
         * @method addChildAt
         * @param {annie.DisplayObject} child
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {void}
         */
        addChildAt(child: DisplayObject, index: number): void;
        private static _removeFormParent;
        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {annie.DisplayObject}
         */
        getChildAt(index: number): annie.DisplayObject;
        /**
         * 获取Sprite中一个child所在的层级索引，找到则返回索引数，未找到则返回-1
         * @method getChildIndex
         * @param {annie.DisplayObject} child 子对象
         * @public
         * @since 1.0.2
         * @return {number}
         */
        getChildIndex(child: DisplayObject): number;
        /**
         * 交换两个显示对象的层级
         * @method swapChild
         * @param child1 显示对象，或者显示对象的索引
         * @param child2 显示对象，或者显示对象的索引
         * @since 2.0.0
         * @return {boolean}
         */
        swapChild(child1: any, child2: any): boolean;
        /**
         * 移除指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         * @return {void}
         */
        removeChildAt(index: number): void;
        /**
         * 如果对容器缓存为位图过,则会更新缓存,没事别乱调用
         * @method updateCache
         * @since 3.2.0
         * @return {void}
         */
        updateCache(): void;
        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         * @return {void}
         */
        removeAllChildren(): void;
        hitTestPoint(hitPoint: Point, isGlobalPoint?: boolean): DisplayObject;
        getBounds(): Rectangle;
        protected _onUpdateMatrixAndAlpha(): void;
        _onUpdateTexture(): void;
        _onRemoveEvent(isReSetMc: boolean): void;
        _onAddEvent(): void;
        _onUpdateFrame(mcSpeed?: number): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 抽象类 一般不直接使用
     * @class annie.Media
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    class Media extends annie.EventDispatcher {
        /**
         * html 标签 有可能是audio 或者 video
         * @property media
         * @type {Video|Audio}
         * @public
         * @since 1.0.0
         */
        media: any;
        /**
         * 媒体类型 VIDEO 或者 AUDIO
         * @property type
         * @type {string}
         * @since 1.0.0
         */
        type: string;
        /**
         * @property isPlaying
         * @type {boolean}
         * @since 2.0.0
         * @default true
         */
        isPlaying: boolean;
        /**
         * 给一个声音取一个名字，方便获取
         * @property name
         * @type {string}
         */
        name: string;
        private _loop;
        /**
         * 构造函数
         * @method Media
         * @param {string|HtmlElement} src
         * @param {string} type
         * @since 1.0.0
         * @example
         *      var media = new annie.Media('http://test.annie2x.com/biglong/apiDemo/annieBitmap/resource/music.mp3', 'Audio');
         *          media.play();//媒体播放
         *          //media.pause();//暂停播放
         *          //media.stop();//停止播放
         */
        constructor(src: any, type: string);
        private _playEvent;
        private _updateEvent;
        private _endEvent;
        /**
         * @property _repeate
         * @type {number}
         * @private
         * @default 1
         */
        private _repeate;
        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        play(start?: number, loop?: number): void;
        private _SBWeixin;
        private _weixinSB;
        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        stop(): void;
        /**
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放
         * @since 1.0.4
         */
        pause(isPause?: boolean): void;
        /**
         * 设置或者获取音量 从0-1
         * @since 1.1.0
         * @property volume
         * @return {number}
         */
        volume: number;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 声音类
     * @class annie.Sound
     * @extends annie.Media
     * @public
     * @since 1.0.0
     */
    class Sound extends Media {
        /**
         * annie.Media相关媒体类的播放刷新事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @event annie.Event.ON_PLAY_UPDATE
         * @since 1.1.0
         */
        /**
         * annie.Media相关媒体类的播放完成事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @event annie.Event.ON_PLAY_END
         * @since 1.1.0
         */
        /**
         * annie.Media相关媒体类的开始播放事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @event annie.Event.ON_PLAY_START
         * @since 1.1.0
         */
        /**
         * 构造函数
         * @method  Sound
         * @since 1.0.0
         * @public
         * @param src
         * @example
         *      var soundPlayer = new annie.Sound('http://test.annie2x.com/biglong/apiDemo/annieBitmap/resource/music.mp3');
         *          soundPlayer.play();//播放音乐
         *          //soundPlayer.pause();//暂停音乐
         *          //soundPlayer.stop();//停止音乐
         */
        constructor(src: any);
        /**
         * 从静态声音池中删除声音对象,如果一个声音再也不用了，建议先执行这个方法，再销毁
         * @method destroy
         * @public
         * @since 1.1.1
         */
        destroy(): void;
        /**
         * 作用和stop()相同,但你用这个方法停止声音了，用play2()方法才会有效
         * @method stop2
         * @since 2.0.0
         * @public
         * @return {void}
         */
        stop2(): void;
        /**
         * 如果你的项目有背景音乐一直在播放,但可能项目里需要播放视频的时候，需要停止背景音乐或者其他需求，
         * 视频播放完之后再恢复背景音乐播放。这个时候，你要考虑用户之前是否有主动关闭过背景音乐，有的话，
         * 这个时候你再调用play()方法或者pause()方法就违背用户意愿。所以你应该调用play2()方法。
         * 这个方法的原理就是如果用户之前关闭过了，那调用这个方法就不会播放声音，如果没关闭则会播放声音。
         * @method play2
         * @since 2.0.0
         * @public
         * @return {void}
         */
        play2(): void;
        private static _soundList;
        /**
         * 停止当前所有正在播放的声音，当然一定要是annie.Sound类的声音
         * @method stopAllSounds
         * @since 1.1.1
         * @static
         * @public
         */
        static stopAllSounds(): void;
        /**
         * 恢复当前所有正在停止的声音，当然一定要是annie.Sound类的声音
         * @method resumePlaySounds
         * @since 2.0.0
         * @static
         * @public
         */
        static resumePlaySounds(): void;
        /**
         * 设置当前所有正在播放的声音，当然一定要是annie.Sound类的声音
         * @method setAllSoundsVolume
         * @since 1.1.1
         * @static
         * @public
         * @param {number} volume 音量大小，从0-1 在ios里 volume只能是0 或者1，其他无效
         */
        static setAllSoundsVolume(volume: number): void;
        private static _volume;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 视频类
     * @class annie.Video
     * @extends annie.Media
     * @public
     * @since 1.0.0
     */
    class Video extends Media {
        /**
         * 构造函数
         * @method Video
         * @param src
         * @param width
         * @param height
         * @public
         * @since 1.0.0
         * @example
         *      //切记在微信里视频地址一定要带上完整域名,并且视频尺寸不要超过1136不管是宽还是高，否则后果很严重
         *      var videoPlayer = new annie.Video('http://test.annie2x.com/biglong/apiDemo/video.mp4');
         *      videoPlayer.play();//播放视频
         *      //videoPlayer.pause();//暂停视频
         *      //videoPlayer.stop();//停止播放
         *      var floatDisplay=new annie.FloatDisplay();
         *      floatDisplay.init(videoPlayer);
         *      //这里的spriteObj是任何一个Sprite类或者其扩展类的实例对象
         *      spriteObj.addChild(floatDisplay);
         */
        constructor(src: any, width?: number, height?: number);
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * annie引擎核心类
     * @class annie.MovieClip
     * @since 1.0.0
     * @public
     * @extends annie.Sprite
     */
    class MovieClip extends Sprite {
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
        /**
         * mc的当前帧
         * @property currentFrame
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        readonly currentFrame: number;
        private _curFrame;
        private _wantFrame;
        private _lastFrameObj;
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
        readonly isPlaying: boolean;
        private _isPlaying;
        /**
         * 动画的播放方向,是顺着播还是在倒着播
         * @property isFront
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         * @readonly
         */
        readonly isFront: boolean;
        private _isFront;
        /**
         * 当前动画的总帧数
         * @property totalFrames
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        readonly totalFrames: number;
        private _floatFrame;
        /**
         * 构造函数
         * @method MovieClip
         * @public
         * @since 1.0.0
         */
        constructor();
        private _a2x_res_class;
        private _a2x_res_children;
        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         * @return {void}
         */
        stop(): void;
        private _a2x_script;
        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括Fla文件中当前帧的代码.
         * @method addFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex {number} 要将代码添加到哪一帧,从0开始.0就是第一帧,1是第二帧...
         * @param {Function}frameScript {Function} 时间轴播放到当前帧时要执行回调方法
         */
        addFrameScript(frameIndex: number, frameScript: Function): void;
        /**
         * 移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex
         */
        removeFrameScript(frameIndex: number): void;
        /**
         * 确认是不是按钮形态
         * @property isButton
         * @type {boolean}
         * @public
         * @since 2.0.0
         * @default false
         */
        readonly isButton: boolean;
        private _a2x_mode;
        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码.
         * 此方法不可逆，设置后不再能设置回剪辑，一定要这么做的话，请联系作者，看作者答不答应
         * @method initButton
         * @public
         * @since 1.0.0
         * @return {void}
         */
        initButton(): void;
        /**
        * 如果MovieClip设置成了按钮，则通过此属性可以让它定在按下后的状态上，哪怕再点击它并离开它的时候，他也不会变化状态
        * @property clicked
        * @return {boolean}
        * @public
        * @since 2.0.0
        */
        clicked: boolean;
        private _clicked;
        private _mouseEvent;
        /**
         * movieClip的当前帧的标签数组,没有则为null
         * @method getCurrentLabel
         * @public
         * @since 1.0.0
         * @return {Array}
         * */
        getCurrentLabel(): any;
        /**
         * 将播放头向后移一帧并停在下一帧,如果本身在最后一帧则不做任何反应
         * @method nextFrame
         * @since 1.0.0
         * @public
         * @return {void}
         */
        nextFrame(): void;
        /**
         * 将播放头向前移一帧并停在下一帧,如果本身在第一帧则不做任何反应
         * @method prevFrame
         * @since 1.0.0
         * @public
         * @return {void}
         */
        prevFrame(): void;
        /**
         * 将播放头跳转到指定帧并停在那一帧,如果本身在第一帧则不做任何反应
         * @method gotoAndStop
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex 批定帧的帧数或指定帧的标签名
         * @return {void}
         */
        gotoAndStop(frameIndex: number | string): void;
        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @param {boolean} isFront true向前播放，false 向后播放。默认向前
         * @public
         * @since 1.0.0
         * @return {void}
         */
        play(isFront?: boolean): void;
        /**
         * 将播放头跳转到指定帧并从那一帧开始继续播放
         * @method gotoAndPlay
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         * @return {void}
         */
        gotoAndPlay(frameIndex: number | string, isFront?: boolean): void;
        private _onCheckUpdateFrame;
        private _a2x_sounds;
        _onAddEvent(): void;
        _updateTimeline(): void;
        _onUpdateFrame(mcSpeed?: number): void;
        _onRemoveEvent(isReSetMc: boolean): void;
        private _updateFrameGap;
        private static _resetMC;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 此类对于需要在canvas上放置html其他类型元素的时候非常有用<br/>
     * 比如有时候我们需要放置一个注册,登录或者其他的内容.这些内容包含了输入框<br/>
     * 或者下拉框什么的,无法在canvas里实现,但这些元素又跟canvas里面的元素<br/>
     * 位置,大小,缩放对应.就相当于是annie里的一个显示对象一样。可以随意设置他的<br/>
     * 属性,那么将你的html元素通过此类封装成annie的显示对象再合适不过了
     * @class annie.FloatDisplay
     * @extends annie.DisplayObject
     * @public
     * @since 1.0.0
     */
    class FloatDisplay extends DisplayObject {
        /**
         * 需要封装起来的html元素的引用。你可以通过这个引用来调用或设置此元素自身的属性方法和事件,甚至是样式
         * @property htmlElement
         * @public
         * @since 1.0.0
         * @type{HtmlElement}
         */
        htmlElement: any;
        private _isAdded;
        /**
         * 构造函数
         * @method FloatDisplay
         * @since 1.0.0
         * @public
         * @example
         *      var floatDisplay = new annie.FloatDisplay();
         *      floatDisplay.init(document.getElementById('annie'));
         *      s.addChild(floatDisplay);
         *
         * <p><a href="" target="_blank">测试链接</a></p>
         */
        constructor();
        /**
         * 初始化方法,htmlElement 一定要设置width和height样式,并且一定要用px单位
         * @method init
         * @public
         * @since 1.0.0
         * @param {HtmlElement} htmlElement 需要封装起来的html元素的引用。你可以通过这个引用来调用或设置此元素自身的属性方法和事件,甚至是样式
         */
        init(htmlElement: any): void;
        private getStyle;
        _onUpdateTexture(): void;
        _onUpdateFrame(): void;
        protected _onUpdateMatrixAndAlpha(): void;
        private removeHtmlElement;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 动态文本类,有时需要在canvas里有一个动态文本,能根据我们的显示内容来改变
     * @class annie.TextField
     * @extends annie.Bitmap
     * @since 1.0.0
     * @public
     */
    class TextField extends Bitmap {
        constructor();
        /**
         * 文本的对齐方式
         * @property textAlign
         * @public
         * @since 1.0.0
         * @type {string}
         * @default left
         */
        textAlign: string;
        private _textAlign;
        /**
         * @property textAlpha
         * @since 2.0.0
         * @public
         */
        textAlpha: number;
        private _textAlpha;
        /**
         * 文本的行高
         * @property textHeight
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        textHeight: number;
        private _textHeight;
        /**
         * @property lineHeight
         * @public
         * @since 1.0.0
         * @param {number} value
         */
        lineHeight: number;
        private _lineHeight;
        /**
         * 文本的宽
         * @property textWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        textWidth: number;
        private _textWidth;
        /**
         * 文本类型,单行还是多行 single multi
         * @property lineType
         * @public
         * @since 1.0.0
         * @type {string} 两种 single和multi
         * @default single
         */
        lineType: string;
        private _lineType;
        /**
         * 文本内容
         * @property text
         * @type {string}
         * @public
         * @default ""
         * @since 1.0.0
         */
        text: string;
        private _text;
        /**
         * 文本的css字体样式
         * @property font
         * @public
         * @since 1.0.0
         * @type {string}
         * @default 12px Arial
         */
        font: string;
        private _font;
        /**
         * 文本的size
         * @property size
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 12
         */
        size: number;
        private _size;
        /**
         * 文本的颜色值
         * @property color
         * @type {string}
         * @public
         * @since 1.0.0
         * @default #fff
         */
        color: string;
        _color: string;
        /**
         * 文本是否倾斜
         * @property italic
         * @public
         * @since
         * @default false
         * @type {boolean}
         */
        italic: boolean;
        private _italic;
        /**
         * 文本是否加粗
         * @property bold
         * @public
         * @since
         * @default false
         * @type {boolean}
         */
        bold: boolean;
        _bold: boolean;
        /**
         * 设置或获取是否有边框
         * @property property
         * @param {boolean} show true或false
         * @public
         * @since 1.0.6
         */
        border: boolean;
        private _border;
        /**
         * 描边宽度 默认为0，不显示. 值为正数则是外描边，值为负数则是内描边
         * @property stroke
         * @param {number} value
         * @since 2.0.2
         */
        stroke: number;
        private _stroke;
        /**
         * 描边颜色 默认黑色
         * @property strokeColor
         * @param {string} value
         * @since 2.0.2
         */
        strokeColor: string;
        private _strokeColor;
        private _prepContext;
        /**
         * 获取当前文本行数
         * @property lines
         * @type {number}
         * @public
         * @readonly
         * @since 2.0.0
         */
        readonly lines: number;
        private _getMeasuredWidth;
        private realLines;
        a2x_ut: boolean;
        _onUpdateTexture(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 输入文本,此文本类是annie.FloatDisplay对象的典型代表
     * @class annie.InputText
     * @public
     * @since 1.0.0
     * @extends annie.FloatDisplay
     */
    class InputText extends FloatDisplay {
        /**
         * 输入文本的类型.
         * @property inputType
         * @public
         * @since 1.0.0
         * @type {number} 0 input 1 password 2 mulit
         * @default 0
         */
        inputType: number;
        /**
         * 在手机端是否需要自动收回软键盘，在pc端此参数无效
         * @property isAutoDownKeyBoard
         * @type {boolean}
         * @since 1.0.3
         * @default true
         */
        isAutoDownKeyBoard: boolean;
        private static _inputTypeList;
        /**
         * @method InputText
         * @public
         * @since 1.0.0
         * @param {number} inputType 0 input 1 password 2 multiline
         * @example
         *      var inputText=new annie.InputText('singleline');
         *      inputText.initInfo('annie',100,100,'#ffffff','left',14,'微软雅黑',false,2);
         */
        constructor(inputType?: number);
        /**
         * 初始化输入文本
         * @method init
         * @param htmlElement
         * @public
         * @return {void}
         * @since 1.0.0
         */
        init(htmlElement: any): void;
        /**
         * 被始化输入文件的一些属性
         * @method initInfo
         * @public
         * @since 1.0.0
         * @param {string} text 默认文字
         * @param {string}color 文字颜色
         * @param {string}align 文字的对齐方式
         * @param {number}size  文字大小
         * @param {string}font  文字所使用的字体
         * @param {boolean}showBorder 是否需要显示边框
         * @param {number}lineHeight 如果是多行,请设置行高
         */
        initInfo(text: string, color: string, align: string, size: number, font: string, showBorder: boolean, lineHeight: number): void;
        /**
         * @property lineHeight
         * @public
         * @since 2.0.0
         * @type {number}
         */
        lineHeight: number;
        /**
         * 设置文本是否为粗体
         * @property bold
         * @public
         * @type {boolean}
         * @since 1.0.3
         */
        bold: boolean;
        /**
         * @property size
         * @public
         * @since 2.0.0
         * @type {number}
         */
        size: number;
        private _size;
        /**
         * 设置文本颜色
         * @property font
         * @type {string}
         * @public
         * @since 1.0.3
         */
        font: string;
        private _font;
        /**
         * 设置文本是否倾斜
         * @property italic
         * @public
         * @type {boolean}
         * @since 1.0.3
         */
        italic: boolean;
        /**
         * 文本的行高
         * @property textHeight
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        textHeight: number;
        /**
         * 文本的宽
         * @property textWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        textWidth: number;
        /**
         * 设置文本颜色
         * @property color
         * @type {string}
         * @public
         * @since 1.0.3
         */
        color: string;
        /**
         * 设置或获取是否有边框
         * @property property
         * @type {boolean}
         * @public
         * @since 1.0.3
         */
        border: boolean;
        /**
         * 获取或设置输入文本的值
         * 之前的getText 和setText 已废弃
         * @property text
         * @public
         * @since 1.0.3
         * @type {string}
         */
        text: string;
        /**
         * 输入文本的最大输入字数
         * @public
         * @since 1.1.0
         * @property maxCharacters
         * @type {number}
         */
        maxCharacters: number;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    class Stage extends Sprite {
        /**
         * annie.Stage舞台初始化完成后会触发的事件
         * @event annie.Event.ON_INIT_STAGE
         * @since 1.0.0
         */
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * annie.Stage舞台尺寸发生变化时触发
         * @event annie.Event.RESIZE
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
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 是否阻止ios端双击后页面会往上弹的效果，因为如果阻止了，可能有些html元素出现全选框后无法取消
         * 所以需要自己灵活设置,默认阻止.
         * @property iosTouchendPreventDefault
         * @type {boolean}
         * @default true
         * @since 1.0.4
         * @public
         */
        iosTouchendPreventDefault: boolean;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 是否禁止引擎所在的DIV的鼠标事件或触摸事件的默认行为，默认为true是禁止的。
         * @property isPreventDefaultEvent
         * @since 1.0.9
         * @default true
         * @type {boolean}
         */
        isPreventDefaultEvent: boolean;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 整个引擎的最上层的div元素,
         * 承载canvas的那个div html元素
         * @property rootDiv
         * @public
         * @since 1.0.0
         * @type {Html Div}
         * @default null
         */
        rootDiv: any;
        /**
         * 当前stage所使用的渲染器
         * 渲染器有两种,一种是canvas 一种是webGl
         * @property renderObj
         * @public
         * @since 1.0.0
         * @type {IRender}
         * @default null
         */
        renderObj: IRender;
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
        renderType: number;
        /**
         * 是否暂停
         * @property pause
         * @static
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        static pause: boolean;
        private static _pause;
        private _viewRect;
        /**
         * 开启或关闭多点手势事件 目前仅支持两点 旋转 缩放
         * @property isMultiTouch
         * @since 1.0.3
         * @type {boolean}
         */
        isMultiTouch: boolean;
        /**
         * 开启或关闭多个手指的鼠标事件
         * @property isMultiMouse
         * @since 1.1.3
         * @type {boolean}
         */
        isMultiMouse: boolean;
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
        autoSteering: boolean;
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
        autoResize: boolean;
        /**
         * 舞台的尺寸宽,也就是我们常说的设计尺寸
         * @property desWidth
         * @public
         * @since 1.0.0
         * @default 320
         * @type {number}
         * @readonly
         */
        desWidth: number;
        /**
         * @property viewPort
         *
         */
        viewPort: annie.Rectangle;
        /**
         * 舞台的尺寸高,也就是我们常说的设计尺寸
         * @property desHeight
         * @public
         * @since 1.0.0
         * @default 240
         * @type {number}
         * @readonly
         */
        desHeight: number;
        /**
         * 舞台在当前设备中的真实高
         * @property divHeight
         * @public
         * @since 1.0.0
         * @default 320
         * @type {number}
         * @readonly
         */
        divHeight: number;
        /**
         * 舞台在当前设备中的真实宽
         * @property divWidth
         * @public
         * @since 1.0.0
         * @default 240
         * @readonly
         * @type {number}
         */
        divWidth: number;
        /**
         * 舞台的背景色
         * 默认为""就是透明背景
         * 可能设置一个颜色值改变舞台背景
         * @property bgColor
         * @public
         * @since 1.0.0
         * @type {string} #FFFFFF" 或 RGB(255,255,255) 或 RGBA(255,255,255,255)
         */
        bgColor: string;
        private _isFullScreen;
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
        scaleMode: string;
        private _scaleMode;
        private static _isLoadedVConsole;
        private _lastDpList;
        /**
         * 显示对象入口函数
         * @method Stage
         * @param {string} rootDivId
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {number} renderType 渲染模式0:canvas 1:webGl 2:dom
         * @public
         * @since 1.0.0
         */
        constructor(rootDivId?: string, desW?: number, desH?: number, frameRate?: number, scaleMode?: string, renderType?: number);
        private _touchEvent;
        private _ml;
        private _mp;
        private _initMouseEvent;
        private _mouseDownPoint;
        private flush;
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method setFrameRate
         * @param {number} fps 最好是60的倍数如 1 2 3 6 10 12 15 20 30 60
         * @since 1.0.0
         * @public
         * @return {void}
         */
        setFrameRate(fps: number): void;
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         * @return {number}
         */
        getFrameRate(): number;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 获取引擎所在的div宽高
         * @method getRootDivWH
         * @public
         * @since 1.0.0
         * @param {HTMLDivElement} div
         * @return {Object}
         */
        getRootDivWH(div: HTMLDivElement): {
            w: number;
            h: number;
        };
        private _mouseEventTypes;
        private sp;
        private lp;
        private muliPoints;
        private _mP1;
        private _mP2;
        private mouseEvent;
        static _dragDisplay: annie.DisplayObject;
        static _dragBounds: annie.Rectangle;
        static _lastDragPoint: annie.Point;
        static _isDragCenter: boolean;
        _isMouseClickCanvas: boolean;
        private _onMouseEvent;
        private setAlign;
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
        resize: () => void;
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
        readonly viewRect: Rectangle;
        /**
         * 要循环调用 flush 函数对象列表
         * @method allUpdateObjList
         * @static
         * @since 1.0.0
         * @type {Array}
         */
        private static allUpdateObjList;
        static _FPS: number;
        private static _intervalID;
        private static flushAll;
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
        static addUpdateObj(target: any): void;
        /**
         * 移除掉已经添加的循环刷新对象
         * @method removeUpdateObj
         * @param target
         * @public
         * @static
         * @since 1.0.0
         * @return {void}
         */
        static removeUpdateObj(target: any): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 投影或者发光滤镜
     * @class annie.ShadowFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class ShadowFilter extends AObject {
        /**
         * 颜色值
         * @property color
         * @public
         * @readonly
         * @since 1.0.0
         * @default black
         * @type {string}
         */
        color: string;
        /**
         * x方向投影距离
         * @property offsetX
         * @public
         * @readonly
         * @since 1.0.0
         * @default 2
         * @type {number}
         */
        offsetX: number;
        /**
         * y方向投影距离
         * @property offsetY
         * @public
         * @readonly
         * @since 1.0.0
         * @default 2
         * @type {number}
         */
        offsetY: number;
        /**
         * 模糊值
         * @property blur
         * @public
         * @readonly
         * @since 1.0.0
         * @default 2
         * @type {number}
         */
        blur: number;
        /**
         * 滤镜类型只读
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @default Shadow
         * @type {string}
         */
        type: string;
        /**
         * @method ShadowFilter
         * @param {string} color
         * @param {number} offsetX
         * @param {number} offsetY
         * @param {number} blur
         */
        constructor(color?: string, offsetX?: number, offsetY?: number, blur?: number);
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        toString(): string;
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @public
         * @since 1.0.0
         * @param {ImageData} imageData
         */
        drawFilter(imageData?: ImageData): void;
        destroy(): void;
    }
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 普通变色滤镜
     * @class annie.ColorFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class ColorFilter extends AObject {
        /**
         * @property redMultiplier
         * @public
         * @since 1.0.0
         * @readonly
         * @type {number}
         */
        redMultiplier: number;
        /**
         * @property redOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        redOffset: number;
        /**
         * @property greenMultiplier
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        greenMultiplier: number;
        /**
         * @property greenOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        greenOffset: number;
        /**
         * @property blueMultiplier
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        blueMultiplier: number;
        /**
         * @property blueOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        blueOffset: number;
        /**
         * @property alphaMultiplier
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        alphaMultiplier: number;
        /**
         * @property alphaOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        alphaOffset: number;
        /**
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @type {string}
         */
        type: string;
        /**
         * @method ColorFilter
         * @param {number} colorArrays 颜色值数据
         */
        constructor(colorArrays: number[]);
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        drawFilter(imageData?: ImageData): void;
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        toString(): string;
        destroy(): void;
    }
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 矩阵变色滤镜
     * @class annie.ColorMatrixFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    class ColorMatrixFilter extends AObject {
        /**
         * @property brightness
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        brightness: number;
        /**
         * @property contrast
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        contrast: number;
        /**
         * @property saturation
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        saturation: number;
        /**
         * @property hue
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        hue: number;
        /**
         * 滤镜类型 只读
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @type {string}
         */
        type: string;
        private colorMatrix;
        /**
         * @method ColorMatrixFilter
         * @param {number} brightness
         * @param {number} contrast
         * @param {number} saturation
         * @param {number} hue
         * @public
         * @since 1.0.0
         */
        constructor(brightness: number, contrast: number, saturation: number, hue: number);
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        drawFilter(imageData?: ImageData): void;
        static DELTA_INDEX: number[];
        private _multiplyMatrix;
        private _cleanValue;
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        toString(): string;
        destroy(): void;
    }
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 模糊滤镜
     * @class annie.BlurFilter
     * @extends annie.AOjbect
     * @public
     * @since 1.0.0
     */
    class BlurFilter extends AObject {
        /**
         * 滤镜类型 只读
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @type {string}
         */
        type: string;
        /**
         * 水平模糊量
         * @property blurX
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        blurX: number;
        /**
         * 垂直模糊量
         * @property blurY
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        blurY: number;
        /**
         * 模糊品质
         * @property quality
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        quality: number;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * @method BlurFilter
         * @public
         * @since 1.0.0
         * @param {number} blurX
         * @param {number} blurY
         * @param {number} quality
         * @example
         *      var imgEle = new Image();
         *           imgEle.onload = function (e) {
         *       var rect = new annie.Rectangle(0, 0, 200, 200),
         *           rectBitmap = new annie.Bitmap(imgEle, rect);
         *           rectBitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *           rectBitmap.y = (s.stage.desHeight - bitmap.height) / 2;
         *           var blur=new annie.BlurFilter(30,30,1);//实例化模糊滤镜
         *           rectBitmap.filters=[blur];//为bitmap添加模糊滤镜效果
         *           s.addChild(rectBitmap);
         *       }
         *       imgEle.src = 'http://test.annie2x.com/biglong/logo.jpg';
         */
        constructor(blurX?: number, blurY?: number, quality?: number);
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        toString(): string;
        private static SHG_TABLE;
        private static MUL_TABLE;
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        drawFilter(imageData?: ImageData): boolean;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    interface IRender {
        /**
         * 渲染循环
         * @param target
         */
        render(target: any): void;
        /**
         * 初始化事件
         * @param canvas
         */
        init(canvas: any): void;
        /**
         * 改变尺寸
         */
        reSize(width: number, height: number): void;
        /**
         * 开始遮罩
         * @param target
         */
        beginMask(target: any): void;
        /**
         * 结束遮罩
         */
        endMask(): void;
        /**
         * 最上层容器对象
         */
        canvas: any;
        /**
         * 开始渲染
         */
        begin(color: string): void;
        /**
         * 结束渲染
         */
        end(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.WebGLRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 4.0.0
     */
    class WebGLRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 4.0.0
         * @type {any}
         * @default null
         */
        canvas: any;
        /**
         * @property viewPort
         *
         */
        viewPort: annie.Rectangle;
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        _ctx: any;
        /**
         * @method WebGLRender
         * @public
         * @since 4.0.0
         */
        constructor();
        /**
         * 开始渲染时执行
         * @method begin
         * @since 4.0.0
         * @public
         */
        begin(color: string): void;
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 4.0.0
         */
        beginMask(target: any): void;
        private drawMask;
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 4.0.0
         */
        endMask(): void;
        private _blendMode;
        /**
         * 调用渲染
         * @public
         * @since 4.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        render(target: any): void;
        end(): void;
        /**
         * 初始化渲染器
         * @public
         * @since 4.0.0
         * @method init
         */
        init(canvas: any): void;
        /**
         * 当尺寸改变时调用
         * @public
         * @since 4.0.0
         * @method reSize
         */
        reSize(width: number, height: number): void;
        destroy(): void;
        /**
         * Specifies whether or not the browser's WebGL implementation should try to perform anti-aliasing.
         * @property _antialias
         * @protected
         * @type {Boolean}
         * @default false
         */
        _antialias: boolean;
        /**
         * Specifies whether or not StageGL is handling colours as premultiplied alpha.
         * @property _premultiply
         * @protected
         * @type {Boolean}
         * @default false
         */
        _premultiply: boolean;
        /**
         * Internal value of {{#crossLink "StageGL/autoPurge"}}{{/crossLink}}
         * @property _autoPurge
         * @protected
         * @type {Integer}
         * @default null
         */
        _autoPurge: number;
        /**
         * A 2D projection matrix used to convert WebGL's viewspace into canvas co-ordinates. Regular canvas display
         * uses Top-Left values of [0,0] where WebGL uses a Center [0,0] Top-Right [1,1] (euclidean) system.
         * @property _projectionMatrix
         * @protected
         * @type {Float32Array}
         * @default null
         */
        _projectionMatrix: Float32Array;
        _projectionMatrixFlip: Float32Array;
        /**
         * The color to use when the WebGL canvas has been cleared. May appear as a background color. Defaults to grey.
         * @property _clearColor
         * @protected
         * @type {Object}
         * @default {r: 0.50, g: 0.50, b: 0.50, a: 0.00}
         */
        _clearColor: any;
        /**
         * The maximum number of cards (aka a single sprite) that can be drawn in one draw call. Use getter/setters to
         * modify otherwise internal buffers may be incorrect sizes.
         * @property _maxCardsPerBatch
         * @protected
         * @type {Number}
         * @default WebGLRender.DEFAULT_MAX_BATCH_SIZE (10000)
         */
        _maxCardsPerBatch: number;
        /**
         * The shader program used to draw the current batch.
         * @property _activeShader
         * @protected
         * @type {WebGLProgram}
         * @default null
         */
        _activeShader: any;
        /**
         * The vertex position data for the current draw call.
         * @property _vertices
         * @protected
         * @type {Float32Array}
         * @default null
         */
        _vertices: Float32Array;
        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_vertices:property"}}{{/crossLink}}.
         * @property _vertexPositionBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        _vertexPositionBuffer: any;
        /**
         * The vertex U/V data for the current draw call.
         * @property _uvs
         * @protected
         * @type {Float32Array}
         * @default null
         */
        _uvs: Float32Array;
        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_uvs:property"}}{{/crossLink}}.
         * @property _uvPositionBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        _uvPositionBuffer: any;
        /**
         * The vertex indices data for the current draw call.
         * @property _indices
         * @protected
         * @type {Float32Array}
         * @default null
         */
        _indices: Float32Array;
        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_indices:property"}}{{/crossLink}}.
         * @property _textureIndexBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        _textureIndexBuffer: any;
        /**
         * The vertices data for the current draw call.
         * @property _alphas
         * @protected
         * @type {Float32Array}
         * @default null
         */
        _alphas: Float32Array;
        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_alphas:property"}}{{/crossLink}}.
         * @property _alphaBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        _alphaBuffer: any;
        /**
         * An index based lookup of every WebGL Texture currently in use.
         * @property _drawTexture
         * @protected
         * @type {Dictionary}
         */
        _textureDictionary: any;
        /**
         * An array of all the textures currently loaded into the GPU. The index in the array matches the GPU index.
         * @property _batchTextures
         * @protected
         * @type {Array}
         */
        _batchTextures: Array<any>;
        /**
         * The number of concurrent textures the GPU can handle. This value is dynamically set from WebGL during initialization
         * via `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`. The WebGL spec states that the lowest guaranteed value is 8,
         * but it could be higher. Do not set this value higher than the value returned by the GPU. Setting it lower will
         * probably reduce performance, but may be advisable to reserve slots for custom filter work.
         * NOTE: Can also act as a length for {{#crossLink "StageGL/_batchTextures:property"}}.
         * @property _batchTextureCount
         * @protected
         * @type {Number}
         * @default 8
         */
        _batchTextureCount: number;
        /**
         * The location at which the last texture was inserted into a GPU slot in {{#crossLink "StageGL/_batchTextures:property"}}{{/crossLink}}.
         * Manual control of this variable can yield improvements in performance by intelligently replacing textures
         * inside a batch to reduce texture re-load. It is impossible to write automated general use code, as it requires
         * display list look ahead inspection and/or render foreknowledge.
         * @property _lastTextureInsert
         * @protected
         * @type {Number}
         * @default -1
         */
        _lastTextureInsert: number;
        /**
         * The current batch being drawn, A batch consists of a call to `drawElements` on the GPU. Many of these calls
         * can occur per draw.
         * @property _batchId
         * @protected
         * @type {Number}
         * @default 0
         */
        _batchID: number;
        /**
         * Used to ensure every canvas used as a texture source has a unique ID.
         * @property _lastTrackedCanvas
         * @protected
         * @type {Number}
         * @default 0
         */
        _lastTrackedCanvas: number;
        /**
         * The number of triangle indices it takes to form a Card. 3 per triangle, 2 triangles.
         * @property INDICIES_PER_CARD
         * @static
         * @final
         * @type {Number}
         * @default 6
         * @readonly
         */
        static INDICIES_PER_CARD: number;
        /**
         * Default U/V rect for dealing with full coverage from an image source.
         * @property UV_RECT
         * @static
         * @final
         * @type {Object}
         * @default {t:0, l:0, b:1, r:1}
         * @readonly
         */
        static UV_RECT: any;
        /**
         * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders. The
         * regular shader is designed to render all expected objects. Shader code may contain templates that are replaced
         * pre-compile.
         * @property REGULAR_VARYING_HEADER
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        static REGULAR_VARYING_HEADER: string;
        /**
         * Actual full header for the vertex shader. Includes the varying header. The regular shader is designed to render
         * all expected objects. Shader code may contain templates that are replaced pre-compile.
         * @property REGULAR_VERTEX_HEADER
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        static REGULAR_VERTEX_HEADER: string;
        /**
         * Actual full header for the fragment shader. Includes the varying header. The regular shader is designed to render
         * all expected objects. Shader code may contain templates that are replaced pre-compile.
         * @property REGULAR_FRAGMENT_HEADER
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        static REGULAR_FRAGMENT_HEADER: string;
        /**
         * Body of the vertex shader. The regular shader is designed to render all expected objects. Shader code may contain
         * templates that are replaced pre-compile.
         * @property REGULAR_VERTEX_BODY
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        static REGULAR_VERTEX_BODY: string;
        /**
         * Body of the fragment shader. The regular shader is designed to render all expected objects. Shader code may
         * contain templates that are replaced pre-compile.
         * @property REGULAR_FRAGMENT_BODY
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        static REGULAR_FRAGMENT_BODY: string;
        static REGULAR_FRAG_COLOR_NORMAL: string;
        static REGULAR_FRAG_COLOR_PREMULTIPLY: string;
        releaseTexture(displayObject: any): void;
        _createShaderProgram(): void;
        updateViewport(): void;
        getBaseTexture(): any;
        setTextureParams(): void;
        _getShaderProgram(): any;
        _createShader(type: any, str: string): any;
        _createBuffers(): void;
        _storeID: number;
        _createTexture(texData: any): any;
        _pushTextureToBatch(texture: any): void;
        _updateTextureData(texture: any): void;
        _killTextureObject(texture: any): void;
        batchCardCount: number;
        _drawBatchGroup(sprite: annie.Sprite): void;
        _drawBuffers(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.OffCanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    class OffCanvasRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property canvas
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        canvas: any;
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        _ctx: any;
        /**
         * @method OffCanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        constructor();
        private isFirstObj;
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        begin(color: string): void;
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        beginMask(target: any): void;
        private drawMask;
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        endMask(): void;
        private _blendMode;
        render(target: any): void;
        end(): void;
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        init(canvas: any): void;
        /**
         * 当尺寸改变时调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        reSize(width: number, height: number): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 资源加载类,后台请求,加载资源和后台交互都可以使用此类
     * @class annie.URLLoader
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     * @example
     *      var urlLoader = new annie.URLLoader();
     *      urlLoader.addEventListener('onComplete', function (e) {
     *      //console.log(e.data.response);
     *      var bitmapData = e.data.response,//bitmap图片数据
     *      bitmap = new annie.Bitmap(bitmapData);//实例化bitmap对象
     *      //居中对齐
     *      bitmap.x = (s.stage.desWidth - bitmap.width) / 2;
     *      bitmap.y = (s.stage.desHeight - bitmap.height) / 2;
     *      s.addChild(bitmap);
     *      });
     *      urlLoader.load('http://test.annie2x.com/biglong/logo.jpg');//载入外部图片
     */
    class URLLoader extends EventDispatcher {
        /**
         * 完成事件
         * @event annie.Event.COMPLETE
         * @since 1.0.0
         */
        /**
         * annie.URLLoader加载过程事件
         * @event annie.Event.PROGRESS
         * @since 1.0.0
         */
        /**
         * annie.URLLoader出错事件
         * @event annie.Event.ERROR
         * @since 1.0.0
         */
        /**
         * annie.URLLoader中断事件
         * @event annie.Event.ABORT
         * @since 1.0.0
         */
        /**
         * annie.URLLoader开始事件
         * @event annie.Event.START
         * @since 1.0.0
         */
        /**
         * 构造函数
         * @method URLLoader
         * @param type text json js xml image sound css svg video unKnow
         */
        constructor();
        /**
         * 取消加载
         * @method loadCancel
         * @public
         * @since 1.0.0
         */
        loadCancel(): void;
        private _req;
        private headers;
        /**
         * 加载或请求数据
         * @method load
         * @public
         * @since 1.0.0
         * @param {string} url
         * @param {string} contentType 如果请求类型需要设置主体类型，有form json binary jsonp等，请设置 默认为form
         */
        load(url: string, contentType?: string): void;
        /**
         * 后台返回来的数据类型
         * @property responseType
         * @type {string}
         * @default null
         * @public
         * @since 1.0.0
         */
        responseType: string;
        /**
         * 请求的url地址
         * @property url
         * @public
         * @since 1.0.0
         * @type {string}
         */
        url: string;
        /**
         * 请求后台的类型 get post
         * @property method
         * @type {string}
         * @default get
         * @public
         * @since 1.0.0
         */
        method: string;
        /**
         * 需要向后台传送的数据对象
         * @property data
         * @public
         * @since 1.0.0
         * @default null
         * @type {Object}
         */
        data: any;
        private _fqs;
        private _fus;
        /**
         * 添加自定义头
         * @method addHeader
         * @param name
         * @param value
         */
        addHeader(name: string, value: string): void;
        destroy(): void;
    }
}
/**
 * Flash资源加载或者管理类，静态类，不可实例化
 * 一般都是初始化或者设置从Flash里导出的资源
 * @class annie
 */
declare namespace annie {
    let _isReleased: boolean;
    let suffixName: string;
    let _shareSceneList: any;
    let res: any;
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
    let loadScene: (sceneName: any, progressFun: Function, completeFun: Function, domain?: string) => void;
    /**
     * 判断一个场景是否已经被加载
     * @method annie.isLoadedScene
     * @public
     * @static
     * @since 1.0.0
     * @param {string} sceneName
     * @return {boolean}
     */
    function isLoadedScene(sceneName: string): Boolean;
    /**
     * 删除一个场景资源,以方便系统垃圾回收
     * @method annie.unLoadScene
     * @public
     * @static
     * @since 1.0.2
     * @param {string} sceneName
     */
    function unLoadScene(sceneName: string): void;
    /**
     * 获取已经加载场景中的资源
     * @method annie.getResource
     * @public
     * @static
     * @since 2.0.0
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    function getResource(sceneName: string, resName: string): any;
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
    function getDisplay(sceneName: string, className: string): any;
    function d(target: any, info: any, isMc?: boolean): void;
    /**
     * <h4><font color="red">注意:小程序 小游戏不支持</font></h4>
     * 向后台请求或者传输数据的快速简便方法,比直接用URLLoader要方便,小巧
     * @method annie.ajax
     * @public
     * @static
     * @since 1.0.0
     * @param info 向后台传送数据所需要设置的信息
     * @param {url} info.url 向后台请求的地址
     * @param {string} info.type 向后台请求的类型 get 和 post,默认为get
     * @param {Function} info.success 发送成功后的回调方法,后台数据将通过参数传回
     * @param {Function} info.error 发送出错后的回调方法,出错信息通过参数传回
     * @param {Object} info.data 向后台发送的信息对象,默认为null
     * @param {string} info.responseType 后台返回数据的类型,默认为"text"
     * @param {boolean} info.isNeedOption 是否需要添加X-Requested-With 头
     * @example
     *      //get
     *      annie.ajax({
     *             type: "GET",
     *             url: serverUrl + "Home/Getinfo/getPersonInfo",
     *             responseType: 'json',
     *             success: function (result) {console.log(result)},
     *             error: function (result) {console.log(result)}
     *      })
     *      //post
     *      annie.ajax({
     *             type: "POST",
     *             url: serverUrl + "Home/Getinfo/getPersonInfo",
     *             data: {phone:'135******58'},
     *             responseType: 'json',
     *             success: function (result) {console.log(result)},
     *             error: function (result) {console.log(result)}
     *      })
     */
    function ajax(info: any): void;
    /**
     * <h4><font color="red">注意:小程序 小游戏不支持</font></h4>
     * jsonp调用方法
     * @method annie.jsonp
     * @param url
     * @param type 0或者1 如果是0，后台返回的是data型jsonp 如果是1，后台返回的是方法型jsonp
     * @param callbackName
     * @param callbackFun
     * @static
     * @since 1.0.4
     * @example
     *      annie.jsonp('js/testData.js', 1, 'getdata', function (result) {
     *          console.log(result);
     *      })
     */
    function jsonp(url: string, type: number, callbackName: string, callbackFun: any): void;
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
    function getQueryString(name: string): string;
    /**
     * 引擎自调用.初始化 sprite和movieClip用
     * @method annie.initRes
     * @param target
     * @param {string} sceneName
     * @param {string} resName
     * @public
     * @static
     */
    function initRes(target: any, sceneName: string, resName: string): void;
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * TweenObj，具体的tween对象类
     * @class annie.TweenObj
     * @public
     * @since 1.0.0
     */
    class TweenObj extends AObject {
        constructor();
        /**
         * 是否暂停，默认false
         * @property pause
         * @type {boolean}
         */
        pause: boolean;
        /**
         * 当前帧
         * @property currentFrame
         * @type {number}
         */
        currentFrame: number;
        /**
         * 总帧数
         * @property totalFrames
         * @type {number}
         */
        totalFrames: number;
        protected _startData: any;
        protected _disData: any;
        /**
         * 当前被tween的对象
         * @property target
         * @type {Object}
         */
        target: any;
        private _isTo;
        private _isLoop;
        private _delay;
        _update: Function;
        _completeFun: Function;
        _ease: Function;
        private _isFront;
        private _cParams;
        private _loop;
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
        init(target: any, times: number, data: any, isTo?: boolean, isPlay?: boolean): void;
        /**
         * 更新数据
         * @method update
         * @since 1.0.0
         * @public
         */
        update(): void;
        destroy(): void;
    }
    /**
     * 全局静态单列类,不要实例化此类
     * @class annie.Tween
     * @public
     * @since 1.0.0
     */
    class Tween {
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
        static to(target: any, totalFrame: number, data: Object): number;
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
        static from(target: any, totalFrame: number, data: Object): number;
        static createTween(target: any, totalFrame: number, data: any, isTo: boolean, isPlay?: boolean): number;
        /**
         * 销毁所有正在运行的Tween对象
         * @method killAll
         * @static
         * @public
         * @since 1.0.0
         */
        static killAll(): void;
        /**
         * @通过创建Tween对象返回时的唯一id来销毁对应的Tween对象
         * @method kill
         * @static
         * @public
         * @param {annie.Tween} tween
         * @since 1.0.0
         */
        static kill(tweenId: number): void;
        private static _tweenPool;
        private static _tweenList;
        /**
         * quadraticIn缓动类型
         * @method quadraticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quadraticIn(k: number): number;
        /**
         * quadraticOut 缓动类型
         * @method quadraticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quadraticOut(k: number): number;
        /**
         * quadraticInOut 缓动类型
         * @method quadraticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quadraticInOut(k: number): number;
        /**
         * cubicIn 缓动类型
         * @method cubicIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static cubicIn(k: number): number;
        /**
         * cubicOut 缓动类型
         * @method cubicOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static cubicOut(k: number): number;
        /**
         * cubicInOut 缓动类型
         * @method cubicInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static cubicInOut(k: number): number;
        /**
         * quarticIn 缓动类型
         * @method quarticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quarticIn(k: number): number;
        /**
         * quarticOut 缓动类型
         * @method quarticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quarticOut(k: number): number;
        /**
         * quarticInOut 缓动类型
         * @method quarticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quarticInOut(k: number): number;
        /**
         * quinticIn 缓动类型
         * @method quinticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quinticIn(k: number): number;
        /**
         * quinticOut 缓动类型
         * @method quinticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quinticOut(k: number): number;
        /**
         * quinticInOut 缓动类型
         * @method quinticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static quinticInOut(k: number): number;
        /**
         * sinusoidalIn 缓动类型
         * @method sinusoidalIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static sinusoidalIn(k: number): number;
        /**
         * sinusoidalOut 缓动类型
         * @method sinusoidalOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static sinusoidalOut(k: number): number;
        /**
         * sinusoidalInOut 缓动类型
         * @method sinusoidalInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static sinusoidalInOut(k: number): number;
        /**
         * exponentialIn 缓动类型
         * @method exponentialIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static exponentialIn(k: number): number;
        /**
         * exponentialOut 缓动类型
         * @method exponentialOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static exponentialOut(k: number): number;
        /**
         * exponentialInOut 缓动类型
         * @method exponentialInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static exponentialInOut(k: number): number;
        /**
         * circularIn 缓动类型
         * @method circularIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static circularIn(k: number): number;
        /**
         * circularOut 缓动类型
         * @method circularOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static circularOut(k: number): number;
        /**
         * circularInOut 缓动类型
         * @method circularInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static circularInOut(k: number): number;
        /**
         * elasticIn 缓动类型
         * @method elasticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static elasticIn(k: number): number;
        /**
         * elasticOut 缓动类型
         * @method elasticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static elasticOut(k: number): number;
        /**
         * elasticInOut 缓动类型
         * @method elasticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static elasticInOut(k: number): number;
        /**
         * backIn 缓动类型
         * @method backIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static backIn(k: number): number;
        /**
         * backOut 缓动类型
         * @method backOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static backOut(k: number): number;
        /**
         * backInOut 缓动类型
         * @method backInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static backInOut(k: number): number;
        /**
         * bounceIn 缓动类型
         * @method bounceIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static bounceIn(k: number): number;
        /**
         * bounceOut 缓动类型
         * @method bounceOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static bounceOut(k: number): number;
        /**
         * bounceInOut 缓动类型
         * @method bounceInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @return {number}
         */
        static bounceInOut(k: number): number;
        private static flush;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 定时器类
     * @class annie.Timer
     * @public
     * @since 1.0.9
     */
    class Timer extends annie.EventDispatcher {
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
        constructor(delay: number, repeatCount?: number);
        /**
         * 重置定时器
         * @method reset
         * @public
         * @since 1.0.9
         */
        reset(): void;
        /**
         * 开始执行定时器
         * @method start
         * @public
         * @since 1.0.9
         */
        start(): void;
        /**
         * 停止执行定时器，通过再次调用start方法可以接着之前未完成的状态运行
         * @method stop
         * @public
         * @since 1.0.9
         */
        stop(): void;
        /**
         * 当前触发了多少次Timer事件
         * @property currentCount
         * @readonly
         * @public
         * @since 1.0.9
         * @return {number}
         */
        readonly currentCount: number;
        private _currentCount;
        /**
         * 设置或者获取当前定时器之间的执行间隔
         * @property delay
         * @since 1.0.9
         * @public
         * @return {number}
         */
        delay: number;
        private _delay;
        private _frameDelay;
        private _currentFrameDelay;
        /**
         * 执行触发Timer 的总次数
         * @method repeatCount
         * @public
         * @since 1.0.9
         * @return {number}
         */
        repeatCount: number;
        private _repeatCount;
        /**
         * 当前是否在运行中
         * @property running
         * @since 1.0.9
         * @return {boolean}
         */
        readonly running: boolean;
        private _running;
        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时缠绕着你
         * @method kill
         * @public
         * @since 1.0.9
         */
        kill(): void;
        private update;
        private static _timerList;
        private static flush;
        destroy(): void;
    }
}
/**
 * @class annie
 */
declare namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 全局eval,相比自带的eval annie.Eval始终是全局的上下文。不会因为使用的位置和环境而改变上下文。
     * @public
     * @property annie.Eval
     * @since 1.0.3
     * @public
     * @type {any}
     */
    let Eval: any;
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
    let debug: boolean;
    /**
     * annie引擎的版本号
     * @public
     * @since 1.0.1
     * @property annie.version
     * @type {string}
     * @example
     *      //打印当前引擎的版本号
     *      console.log(annie.version);
     */
    let version: string;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 当前设备是否是移动端或或是pc端,移动端是ios 或者 android
     * @property annie.osType
     * @since 1.0.0
     * @public
     * @type {string|string}
     * @static
     * @example
     *      //获取当前设备类型
     *      console.log(annie.osType);
     */
    let osType: string;
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
    let globalDispatcher: annie.EventDispatcher;
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
    let devicePixelRatio: number;
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
    let StageScaleMode: {
        EXACT_FIT: string;
        NO_BORDER: string;
        NO_SCALE: string;
        SHOW_ALL: string;
        FIXED_WIDTH: string;
        FIXED_HEIGHT: string;
    };
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 跳转到指定网址
     * @method annie.navigateToURL
     * @public
     * @since 1.0.0
     * @param {string} url
     * @static
     * @example
     *      displayObject.addEventListener(annie.MouseEvent.CLICK,function (e) {
     *              annie.navigateToURL("http://www.annie2x.com");
     *      })
     *
     */
    function navigateToURL(url: string): void;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 向后台发送数据,但不会理会任何的后台反馈
     * @method annie.sendToURL
     * @public
     * @since 1.0.0
     * @param {string} url
     * @static
     * @example
     *      submitBtn.addEventListener(annie.MouseEvent.CLICK,function (e) {
     *           annie.sendToURL("http://www.annie2x.com?key1=value&key2=value");
     *      })
     */
    function sendToURL(url: string): void;
    let _dRender: any;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 将显示对象转成base64的图片数据,如果要截取的显示对象从来没有添加到舞台更新渲染过，则需要在截图之前手动执行更新方法一次。如:this.update(true);
     * @method annie.toDisplayDataURL
     * @static
     * @param {annie.DisplayObject} obj 显示对象
     * @param {annie.Rectangle} rect 需要裁切的区域，默认不裁切
     * @param {Object} typeInfo {type:"png"}  或者 {type:"jpeg",quality:100}  png格式不需要设置quality，jpeg 格式需要设置quality的值 从1-100
     * @param {string} bgColor 颜色值如 #fff,rgba(255,23,34,44)等！默认值为空的情况下，jpeg格式的话就是黑色底，png格式的话就是透明底
     * @return {string} base64格式数据
     * @example
     *      annie.toDisplayDataURL(DisplayObj,{
     *               x: 0,
     *               y: 32,
     *               width: 441,
     *               height: 694
     *       }, {
     *               type: "jpeg",//数据类型jpg/png
     *               quality: 90//图片质量值1-100,png格式不需要设置quality
     *       }, '#CDDBEB');
     *
     * Tip:在一些需要上传图片，编辑图片，需要提交图片数据，分享作品又或者长按保存作品的项目，运用annie.toDisplayDataURL方法就是最好不过的选择了。
     */
    let toDisplayDataURL: (obj: any, rect?: Rectangle, typeInfo?: any, bgColor?: string) => string;
    let createCache: (obj: any) => void;
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
    let getStagePixels: (stage: Stage, rect: Rectangle) => number[];
}
