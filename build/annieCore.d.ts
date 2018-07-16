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
         * @return {number}
         * @readonly
         * @example
         *      //获取 annie引擎类对象唯一码
         *      trace(this.instanceId);
         */
        instanceId: number;
        /**
         * 每一个annie类都有一个实例类型字符串，通过这个字符串，你能知道这个实例是从哪个类实例而来
         * @property instanceType
         * @since 1.0.3
         * @public
         * @return {string}
         * @readonly
         */
        instanceType: string;
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         * @method destroy
         * @since 2.0.0
         * @public
         * @return {void}
         */
        abstract destroy(): void;
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
        /**
         * 全局的鼠标事件的监听数对象表
         * @property _MECO
         * @private
         * @since 1.0.0
         */
        private static _MECO;
        static _totalMEC: number;
        /**
         * 看看有多少mouse或者touch侦听数
         * @method getMouseEventCount
         * @return {number}
         * @static
         * @private
         * @since 1.0.0
         * @param {string} type 获取事件类型，默认是所有
         */
        static getMouseEventCount(type?: string): number;
        /**
         * 给对象添加一个侦听
         * @method addEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         * @example
         *      this.addEventListener(annie.Event.ADD_TO_STAGE,function(e){trace(this);}.bind(this));
         */
        addEventListener(type: string, listener: Function, useCapture?: boolean): void;
        /**
         * 增加或删除相应mouse或touch侦听记数
         * @method _changeMouseCount
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} isAdd
         */
        private _changeMouseCount(type, isAdd);
        private _defaultEvent;
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
        dispatchEvent(event: any, data?: any, useCapture?: boolean): boolean;
        /**
         * 是否有添加过此类形的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
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
         * @param {Function} listener 及侦听时绑定的回调方法
         * @param {boolean} useCapture true 捕获阶段 false 冒泡阶段 默认 true
         */
        removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        /**
         * 移除对象中所有的侦听
         * @method removeAllEventListener
         * @public
         * @since 1.0.0
         */
        removeAllEventListener(): void;
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
         * 舞台尺寸发生变化时触发
         * @Event
         * @property RESIZE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static RESIZE: string;
        /**
         * annie引擎暂停或者恢复暂停时触发，这个事件只能在annie.globalDispatcher 中监听
         * @Event
         * @property RESIZE
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
         * 舞台初始化完成后会触发的事件
         * @Event
         * @property ON_STAGE_INIT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static INIT_TO_STAGE: string;
        /**
         * 显示对象加入到舞台事件
         * @Event
         * @property ADD_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ADD_TO_STAGE: string;
        /**
         * 显示对象从舞台移出事件
         * @Event
         * @property REMOVE_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static REMOVE_TO_STAGE: string;
        /**
         * 显示对象 循环帧事件
         * @Event
         * @property ENTER_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ENTER_FRAME: string;
        /**
         * MovieClip 播放完成事件
         * @Event
         * @property END_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static END_FRAME: string;
        /**
         * MovieClip 帧标签事件
         * @Event
         * @property CALL_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static CALL_FRAME: string;
        /**
         * 完成事件
         * @Event
         * @property COMPLETE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static COMPLETE: string;
        /**
         * 加载过程事件
         * @Event
         * @property PROGRESS
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static PROGRESS: string;
        /**
         * 出错事件
         * @Event
         * @property ERROR
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ERROR: string;
        /**
         * 中断事件
         * @Event
         * @property ABORT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static ABORT: string;
        /**
         * 开始事件
         * @Event
         * @property START
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        static START: string;
        /**
         * 定时器触发事件
         * @property TIMER
         * @static
         * @since 1.0.9
         * @public
         * @type {string}
         */
        static TIMER: string;
        /**
         * 定时器完成事件
         * @property TIMER_COMPLETE
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        static TIMER_COMPLETE: string;
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
         */
        constructor(type: string);
        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
         * @method stopImmediatePropagation
         * @public
         * @since 2.0.0
         */
        stopImmediatePropagation(): void;
        /**
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
         * @method stopPropagation
         * @public
         * @since 2.0.0
         */
        stopPropagation(): void;
        private _bpd;
        /**
         * 是否阻止事件向下冒泡
         * @property _pd
         * @type {boolean}
         * @private
         * @since 1.0.0
         */
        private _pd;
        /**
         * @method destroy
         * @public
         * @since 2.0.0
         * @return {void}
         */
        destroy(): void;
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
         * 鼠标或者手指按下事件
         * @property MOUSE_DOWN
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_DOWN: string;
        /**
         * 鼠标或者手指抬起事件
         * @property MOUSE_UP
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_UP: string;
        /**
         * 鼠标或者手指单击
         * @property CLICK
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static CLICK: string;
        /**
         * 鼠标或者手指移动事件
         * @property MOUSE_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_MOVE: string;
        /**
         * 鼠标或者手指移入到显示对象上里触发的事件
         * @property MOUSE_OVER
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        static MOUSE_OVER: string;
        /**
         * 鼠标或者手指移出显示对象边界触发的事件
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
         * @method
         * @public
         * @since 1.0.0
         */
        identity(): void;
        /**
         * 反转一个矩阵
         * @method
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
         * 将多个矩形合成为一个矩形,并将结果存到第一个矩形参数，并返回
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
         * @param {annie.Point} p1
         * @param {..arg} ary
         * @return {annie.Rectangle}
         */
        static createFromPoints(rect: Rectangle, ...arg: Point[]): Rectangle;
        /**
         * 通过两个点来确定一个矩形
         * @param rect
         * @param p1
         * @param p2
         */
        static createRectform2Point(rect: Rectangle, p1: Point, p2: Point): void;
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
        destroy(): void;
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
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        constructor();
        /**
         * 更新信息
         * @property _UI
         * @param UM 是否更新矩阵 UA 是否更新Alpha UF 是否更新滤镜
         */
        protected _UI: {
            UD: boolean;
            UM: boolean;
            UA: boolean;
            UF: boolean;
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
        /**
         * 显示对象在显示列表上的最终表现出来的透明度,此透明度会继承父级的透明度依次相乘得到最终的值
         * @property cAlpha
         * @private
         * @type {number}
         * @since 1.0.0
         * @default 1
         */
        protected cAlpha: number;
        /**
         * 显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的显示属性依次相乘得到最终的值
         * @property cMatrix
         * @private
         * @type {annie.Matrix}
         * @default null
         * @since 1.0.0
         */
        protected cMatrix: Matrix;
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
         * 显示对象上对显示列表上的最终的所有滤镜组
         * @property cFilters
         * @private
         * @default []
         * @since 1.0.0
         * @type {Array}
         */
        protected cFilters: any;
        /**
         * 每一个显示对象都可以给他启一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
         * @property name
         * @since 1.0.0
         * @public
         * @type {string}
         * @default ""
         */
        name: string;
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
         * @pubic
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
         * 支持的混合模式大概有
         * @property blendMode
         * @public
         * @since 1.0.0
         * @type {string}
         * @default 0
         */
        blendMode: string;
        /**
         * 显示对象的变形矩阵
         * @property matrix
         * @public
         * @since 1.0.0
         * @type {annie.Matrix}
         * @default null
         */
        matrix: Matrix;
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
        protected _isUseToMask: number;
        private _mask;
        /**
         * 显示对象的滤镜数组
         * @property filters
         * @since 1.0.0
         * @public
         * @type {Array}
         * @default null
         */
        filters: any[];
        private _filters;
        /**
         * 是否自己的父级发生的改变
         * @type {boolean}
         * @private
         */
        protected _cp: boolean;
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
        /**
         * 为了hitTestPoint，localToGlobal，globalToLocal等方法不复新不重复生成新的点对象而节约内存
         * @type {annie.Point}
         * @private
         * @static
         */
        static _bp: Point;
        static _p1: Point;
        static _p2: Point;
        static _p3: Point;
        static _p4: Point;
        protected _dragBounds: Rectangle;
        protected _isDragCenter: boolean;
        protected _lastDragPoint: Point;
        /**
         * 启动鼠标或者触摸拖动
         * @method startDrag
         * @param {boolean} isCenter 指定将可拖动的对象锁定到指针位置中心 (true)，还是锁定到用户第一次单击该对象的位置 (false) 默认false
         * @param {annie.Rectangle} bounds 相对于显圣对象父级的坐标的值，用于指定 Sprite 约束矩形
         * @since 1.1.2
         * @public
         */
        startDrag(isCenter?: boolean, bounds?: Rectangle): void;
        /**
         * 停止鼠标或者触摸拖动
         * @method stopDrag
         * @public
         * @since 1.1.2
         */
        stopDrag(): void;
        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} point 需要碰到的坐标点
         * @param {boolean} isMouseEvent 是否是鼠标事件调用此方法,用户一般无须理会,除非你要模拟鼠标点击可以
         * @return {annie.DisplayObject}
         */
        hitTestPoint(point: Point, isMouseEvent?: boolean): DisplayObject;
        /**
         * 获取对象的自身的没有任何形变的原始姿态下的原点坐标及宽高,抽像方法
         * @method getBounds
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         * @abstract
         */
        getBounds(): Rectangle;
        /**
         * 获取对象形变后外切矩形。
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @return {annie.Rectangle}
         */
        getDrawRect(): Rectangle;
        /**
         * 更新函数
         * @method update
         * @public
         * @since 1.0.0
         */
        protected update(isDrawUpdate?: boolean): void;
        /**
         * 调用此方法将显示对象渲染到屏幕
         * @method render
         * @public
         * @since 1.0.0
         * @param {annie.IRender} renderObj
         * @abstract
         */
        render(renderObj: IRender | any): void;
        /**
         * 调用些方法会冒泡的将事件向显示列表下方传递
         * @method _onDispatchBubbledEvent
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} updateMc 是否更新movieClip时间轴信息
         * @private
         */
        _onDispatchBubbledEvent(type: string): void;
        /**
         * 获取或者设置显示对象在父级里的x方向的宽，不到必要不要用此属性获取高
         * 如果你要同时获取款高，建议使用getWH()方法获取宽和高
         * @property  width
         * @public
         * @since 1.0.3
         * @return {number}
         */
        width: number;
        /**
         * 获取或者设置显示对象在父级里的y方向的高,不到必要不要用此属性获取高
         * 如果你要同时获取款高，建议使用getWH()方法获取宽和高
         * @property  height
         * @public
         * @since 1.0.3
         * @return {number}
         */
        height: number;
        /**
         * 如果需要同时获取宽和高的值，建议使用此方法更有效率
         * @method getWH
         * @public
         * @return {{width: number, height: number}}
         * @since 1.0.9
         */
        getWH(): {
            width: number;
            height: number;
        };
        /**
         * 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
         * @property _texture
         * @protected
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        protected _texture: any;
        protected _bounds: Rectangle;
        protected _drawRect: Rectangle;
        protected _setProperty(property: string, value: any, type: number): void;
        /**
         * 返回一个id，这个id你要留着作为删除他时使用。
         * 这个声音会根据这个显示对象添加到舞台时播放，移出舞台而关闭
         * @param {annie.Sound} sound
         * @return {number}
         */
        addSound(sound: any): number;
        /**
         * 删除一个已经添加进来的声音
         * @param {number} id -1 删除所有 0 1 2 3...删除对应的声音
         */
        removeSound(id: number): void;
        private _a2x_sounds;
        private _a2x_res_obj;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象的引用的 Bitmap 对象。
     * 创建了 Bitmap 对象后，使用父 Sprite 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 BitmapData 引用，
     * 与转换属性或旋转属性无关。由于能够创建引用相同 BitmapData 对象的多个 Bitmap 对象，
     * 因此，多个显示对象可以使用相同的复杂 BitmapData 对象，而不会因为每个显示对象实例使用一个 BitmapData 对象而产生内存开销。
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
         * @param {string} imagePath 一个图片地址
        */
        constructor(imagePath: string);
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @return {any}
         * @public
         * @since 1.0.0
         */
        hitTestPoint(globalPoint: Point, isMouseEvent?: boolean): DisplayObject;
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
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
     * @extends annie.DisplayObject
     * @since 1.0.0
     * @public
     */
    class Shape extends DisplayObject {
        constructor();
        /**
         * 一个数组，每个元素也是一个数组[类型 0是属性,1是方法,名字 执行的属性或方法名,参数]
         * @property _command
         * @private
         * @since 1.0.0
         * @type {Array}
         * @default []
         */
        private _command;
        /**
         * 通过一系统参数获取生成颜色或渐变所需要的对象
         * 一般给用户使用较少,Flash2x工具自动使用
         * @method getGradientColor
         * @static
         * @param points
         * @param colors
         * @return {any}
         * @since 1.0.0
         * @pubic
         */
        static getGradientColor(points: any, colors: any): any;
        /**
         * 设置位图填充时需要使用的方法,一般给用户使用较少,Flash2x工具自动使用
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
         * 是否对矢量使用像素碰撞 默认开启
         * @property hitTestWidthPixel
         * @type {boolean}
         * @default true
         * @since 1.1.0
         */
        hitTestWidthPixel: boolean;
        /**
         * 添加一条绘画指令,具体可以查阅Html Canvas画图方法
         * @method addDraw
         * @param {string} commandName ctx指令的方法名 如moveTo lineTo arcTo等
         * @param {Array} params
         * @public
         * @since 1.0.0
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
         */
        drawRoundRect(x: number, y: number, w: number, h: number, rTL?: number, rTR?: number, rBL?: number, rBR?: number): void;
        /**
         * 绘画时移动到某一点
         * @method moveTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        moveTo(x: number, y: number): void;
        /**
         * 从上一点画到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method lineTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        lineTo(x: number, y: number): void;
        /**
         * 从上一点画弧到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method arcTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
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
         */
        bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): void;
        /**
         * 闭合一个绘画路径
         * @method closePath
         * @public
         * @since 1.0.0
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
         */
        drawEllipse(x: number, y: number, w: number, h: number): void;
        /**
         * 清除掉之前所有绘画的东西
         * @method clear
         * @public
         * @since 1.0.0
         */
        clear(): void;
        /**
         * 开始绘画填充,如果想画的东西有颜色填充,一定要从此方法开始
         * @method beginFill
         * @param {string} color 颜色值 单色和RGBA格式
         * @public
         * @since 1.0.0
         */
        beginFill(color: string): void;
        /**
         * 线性渐变填充 一般给Flash2x用
         * @method beginLinearGradientFill
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @public
         * @since 1.0.0
         */
        beginLinearGradientFill(points: any, colors: any): void;
        /**
         * 径向渐变填充 一般给Flash2x用
         * @method beginRadialGradientFill
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
         * @public
         * @since 1.0.0
         */
        beginRadialGradientFill: (points: any, colors: any) => void;
        /**
         * 位图填充 一般给Flash2x用
         * @method beginBitmapFill
         * @param {Image} image
         * @param { Array} matrix
         * @public
         * @since 1.0.0
         */
        beginBitmapFill(image: any, matrix: Array<number>): void;
        private _fill(fillStyle);
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
         */
        beginStroke(color: string, lineWidth?: number, cap?: number, join?: number, miter?: number): void;
        private static _caps;
        private static _joins;
        /**
         * 画线性渐变的线条 一般给Flash2x用
         * @method beginLinearGradientStroke
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {number} lineWidth
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        beginLinearGradientStroke(points: Array<number>, colors: any, lineWidth?: number, cap?: number, join?: number, miter?: number): void;
        /**
         * 画径向渐变的线条 一般给Flash2x用
         * @method beginRadialGradientStroke
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        beginRadialGradientStroke: (points: number[], colors: any, lineWidth?: number, cap?: number, join?: number, miter?: number) => void;
        /**
         * 线条位图填充 一般给Flash2x用
         * @method beginBitmapStroke
         * @param {Image} image
         * @param {Array} matrix
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        beginBitmapStroke(image: any, matrix: Array<number>, lineWidth?: number, cap?: number, join?: number, miter?: number): void;
        private _stroke(strokeStyle, width, cap, join, miter);
        /**
         * 结束填充
         * @method endFill
         * @public
         * @since 1.0.0
         */
        endFill(): void;
        /**
         * 结束画线
         * @method endStroke
         * @public
         * @since 1.0.0
         */
        endStroke(): void;
        /**
         * 解析一段路径 一般给Flash2x用
         * @method decodePath
         * @param {Array} data
         * @public
         * @since 1.0.0
         */
        decodePath: (data: any) => void;
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        update(isDrawUpdate?: boolean): void;
        private _draw(ctx);
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @return {any}
         * @public
         * @since 1.0.0
         */
        hitTestPoint(globalPoint: Point, isMouseEvent?: boolean): DisplayObject;
        /**
         * @property _offsetX
         * @protected
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        protected _offsetX: number;
        /**
         * @property _offsetY
         * @protected
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        protected _offsetY: number;
        /**
         * 如果有的话,改变矢量对象的边框或者填充的颜色.
         * @method changeColor
         * @param {Object} infoObj
         * @param {string|any} infoObj.fillColor 填充颜色值，如"#fff" 或者 "rgba(255,255,255,1)"或者是annie.Shape.getGradientColor()方法返回的渐变对象;
         * @param {string} infoObj.strokeColor 线条颜色值，如"#fff" 或者 "rgba(255,255,255,1)";
         * @param {number} infoObj.lineWidth 线条的粗细，如"1,2,3...";
         * @public
         * @since 1.0.2
         */
        changeColor(infoObj: any): void;
        render(renderObj: IRender | any): void;
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
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
        constructor();
        private _a2x_res_class;
        private _a2x_res_children;
        destroy(): void;
        /**
         * 是否可以让children接收鼠标事件,如果为false
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
         */
        addChild(child: DisplayObject): void;
        /**
         * 从Sprite中移除一个child
         * @method removeChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         */
        removeChild(child: DisplayObject): void;
        private static _getElementsByName(rex, root, isOnlyOne, isRecursive, resultList);
        /**
         * 通过给displayObject设置的名字来获取一个child,可以使用正则匹配查找
         * @method getChildByName
         * @param {string} name 对象的具体名字或是一个正则表达式
         * @param {boolean} isOnlyOne 默认为true,如果为true,只返回最先找到的对象,如果为false则会找到所有匹配的对象数组
         * @param {boolean} isRecursive false,如果为true,则会递归查找下去,而不只是查找当前对象中的child,child里的child也会找,依此类推
         * @return {any} 返回一个对象,或者一个对象数组,没有找到则返回空
         * @public
         * @since 1.0.0
         */
        getChildByName(name: string | RegExp, isOnlyOne?: boolean, isRecursive?: boolean): any;
        /**
         * 添加一个child到Sprite中并指定添加到哪个层级
         * @method addChildAt
         * @param {annie.DisplayObject} child
         * @param {number} index 从0开始
         * @pubic
         * @since 1.0.0
         */
        addChildAt(child: DisplayObject, index: number): void;
        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @pubic
         * @since 1.0.0
         * @return {annie.DisplayObject}
         */
        getChildAt(index: number): annie.DisplayObject;
        /**
         * 获取Sprite中一个child所在的层级索引，找到则返回索引数，未找到则返回-1
         * @method getChildIndex
         * @param {annie.DisplayObject} child 子对象
         * @pubic
         * @since 1.0.2
         * @return {number}
         */
        getChildIndex(child: DisplayObject): number;
        /**
         * @method 交换两个显示对象的层级
         * @param child1 显示对象，或者显示对象的索引
         * @param child2 显示对象，或者显示对象的索引
         * @since 2.0.0
         * @return {boolean}
         */
        swapChild(child1: any, child2: any): boolean;
        /**
         * 调用此方法对Sprite及其child触发一次指定事件
         * @method _onDispatchBubbledEvent
         * @private
         * @param {string} type
         * @param {boolean} updateMc 是否更新movieClip时间轴信息
         * @since 1.0.0
         */
        _onDispatchBubbledEvent(type: string): void;
        /**
         * 移除指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         */
        removeChildAt(index: number): void;
        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         */
        removeAllChildren(): void;
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        update(isDrawUpdate?: boolean): void;
        /**
         * 重写碰撞测试
         * @method hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @return {any}
         * @public
         * @since 1.0.0
         */
        hitTestPoint(globalPoint: Point, isMouseEvent?: boolean): DisplayObject;
        /**
         * 重写getBounds
         * @method getBounds
         * @return {any}
         * @since 1.0.0
         * @public
         */
        getBounds(): Rectangle;
        /**
         * 重写渲染
         * @method render
         * @param {annie.IRender} renderObj
         * @public
         * @since 1.0.0
         */
        render(renderObj: IRender): void;
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
         * mc的当前帧
         * @property currentFrame
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        currentFrame: number;
        private _curFrame;
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
        isPlaying: boolean;
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
        isFront: boolean;
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
        totalFrames: number;
        private _lastFrame;
        constructor();
        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         */
        stop(): void;
        private _a2x_script;
        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括从Fla文件中当前帧的代码.
         * @method addFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex {number} 要将代码添加到哪一帧,从0开始.0就是第一帧,1是第二帧...
         * @param {Function}frameScript {Function} 时间轴播放到当前帧时要执行回调方法
         */
        addFrameScript(frameIndex: number, frameScript: Function): void;
        /**
         * @移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex
         */
        removeFrameScript(frameIndex: number): void;
        isButton: boolean;
        private _mode;
        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码.
         * 此方法不可逆，设置后不再能设置回剪辑，一定要这么做的话，请联系作者，看作者答不答应
         * @method initButton
         * @public
         * @since 1.0.0
         */
        initButton(): void;
        clicked: boolean;
        private _clicked;
        private _mouseEvent;
        private _maskList;
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
         */
        nextFrame(): void;
        /**
         * 将播放头向前移一帧并停在下一帧,如果本身在第一帧则不做任何反应
         * @method prevFrame
         * @since 1.0.0
         * @public
         */
        prevFrame(): void;
        /**
         * 将播放头跳转到指定帧并停在那一帧,如果本身在第一帧则不做任何反应
         * @method gotoAndStop
         * @public
         * @since 1.0.0
         * @param {number} frameIndex{number|string} 批定帧的帧数或指定帧的标签名
         */
        gotoAndStop(frameIndex: number | string): void;
        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @public
         * @since 1.0.0
         */
        play(isFront?: boolean): void;
        /**
         * 将播放头跳转到指定帧并从那一帧开始继续播放
         * @method gotoAndPlay
         * @public
         * @since 1.0.0
         * @param {number} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         */
        gotoAndPlay(frameIndex: number | string, isFront?: boolean): void;
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        update(isDrawUpdate?: boolean): void;
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
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
     * @extends annie.DisplayObject
     * @since 1.0.0
     * @public
     */
    class TextField extends DisplayObject {
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
         *
         * @param {number} value
         */
        lineSpacing: number;
        private _lineSpacing;
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
        private _textOffX;
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
        private fontInfo;
        private realLines;
        /**
         * 设置文本在canvas里的渲染样式
         * @param ctx
         * @private
         * @since 1.0.0
         */
        private _draw(ctx);
        /**
         * 获取文本宽
         * @method _getMeasuredWidth
         * @param text
         * @return {number}
         * @private
         * @since 1.0.0
         */
        private _getMeasuredWidth(text);
        /**
         * 获取当前文本中单行文字的宽，注意是文字的不是文本框的宽
         * @method getTextWidth
         * @param {number} lineIndex 获取的哪一行的高度 默认是第1行
         * @since 2.0.0
         * @public
         * @return {number}
         */
        getTextWidth(lineIndex?: number): any;
        /**
         * @property _lines 获取当前文本行数
         * @type {number}
         * @public
         * @readonly
         * @since 2.0.0
         */
        lines: number;
        /**
         * 重写 update
         * @method update
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        update(isDrawUpdate?: boolean): void;
        /**
         * 重写 getBounds
         * @method getBounds
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        getBounds(): Rectangle;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * 无法以全局方式访问 Stage 对象,而是需要利用DisplayObject实例的getStage()方法进行访问
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    class Stage extends Sprite {
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
         * 如果值为true则暂停更新当前显示对象及所有子对象。在视觉上就相当于界面停止了,但一样能会接收鼠标事件<br/>
         * 有时候背景为大量动画的一个对象时,当需要弹出一个框或者其他内容,或者模糊一个背景时可以设置此属性让<br/>
         * 对象视觉暂停更新
         * @property pause
         * @type {boolean}
         * @public
         * @static
         * @since 1.0.0
         * @default false
         */
        static pause: boolean;
        private static _pause;
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
        viewRect: Rectangle;
        /**
         * 开启或关闭多点手势事件 目前仅支持两点 旋转 缩放
         * @property isMultiTouch
         * @since 1.0.3
         * @type {boolean}
         */
        isMultiTouch: boolean;
        /**
         * 开启或关闭多个手指的鼠标事件 目前仅支持两点 旋转 缩放
         * @property isMultiMouse
         * @since 1.1.3
         * @type {boolean}
         */
        isMultiMouse: boolean;
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
         * 默认就是透明背景
         * 可能设置一个颜色值改变舞台背景
         * @property bgColor
         * @public
         * @since 1.0.0
         * @type {string}
         * @default "";
         */
        bgColor: string;
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
         *              state.resize();
         *              if(i>5){i=0;}
         *          }
         *      }
         *
         */
        scaleMode: string;
        private _scaleMode;
        /**
         * 原始为60的刷新速度时的计数器
         * @property _flush
         * @private
         * @since 1.0.0
         * @default 0
         * @type {number}
         */
        private _flush;
        /**
         * 当前的刷新次数计数器
         * @property _currentFlush
         * @private
         * @since 1.0.0
         * @default 0
         * @type {number}
         */
        private _currentFlush;
        static _dragDisplay: DisplayObject;
        /**
         * 上一次鼠标或触碰经过的显示对象列表
         * @type {Array}
         * @private
         */
        private _lastDpList;
        onTouchEvent: any;
        /**
         * 显示对象入口函数
         * @method Stage
         * @param {Canvas} ctx
         * @param {number} desW canvas宽
         * @param {number} desH canvas高
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {string} bgColor 背景颜色-1为透明
         * @public
         * @since 1.0.0
         */
        constructor(ctx: any, canW?: number, canH?: number, desW?: number, desH?: number, frameRate?: number, scaleMode?: string);
        /**
         * 重写刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        update(isDrawUpdate?: boolean): void;
        private _touchEvent;
        /**
         * 渲染函数
         * @method render
         * @param renderObj
         */
        render(renderObj: IRender): void;
        /**
         * 这个是鼠标事件的MouseEvent对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
         * @type {Array}
         * @private
         */
        private _ml;
        /**
         * 这个是事件中用到的Point对象池,以提高性能
         * @type {Array}
         * @private
         */
        private _mp;
        /**
         * 刷新mouse或者touch事件
         * @private
         */
        private _initMouseEvent(event, cp, sp, identifier);
        private _mouseDownPoint;
        /**
         * 循环刷新页面的函数
         */
        private flush();
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method setFrameRate
         * @param {number} fps 最好是60的倍数如 1 2 3 6 10 12 15 20 30 60
         * @since 1.0.0
         * @public
         */
        setFrameRate(fps: number): void;
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         */
        getFrameRate(): number;
        /**
         * 当一个stage不再需要使用,或者要从浏览器移除之前,请先停止它,避免内存泄漏
         * @method kill
         * @since 1.0.0
         * @public
         */
        kill(): void;
        /**
         * html的鼠标或单点触摸对应的引擎事件类型名
         * @type {{mousedown: string, mouseup: string, mousemove: string, touchstart: string, touchmove: string, touchend: string}}
         * @private
         */
        private _mouseEventTypes;
        private muliPoints;
        /**
         * 当document有鼠标或触摸事件时调用
         * @param e
         */
        private _mP1;
        private _mP2;
        private _onMouseEvent;
        /**
         * 设置舞台的对齐模式
         */
        private setAlign;
        getBounds(): Rectangle;
        /**
         * 要循环调用 flush 函数对象列表
         * @method allUpdateObjList
         * @static
         * @since 1.0.0
         * @type {Array}
         */
        private static allUpdateObjList;
        /**
         * 刷新所有定时器
         * @static
         * @private
         * @since 1.0.0
         * @method flushAll
         */
        private static flushAll();
        /**
         * 添加一个刷新对象，这个对象里一定要有一个 flush 函数。
         * 因为一但添加，这个对象的 flush 函数会以stage的fps间隔调用
         * 如，你的stage是30fps 那么你这个对象的 flush 函数1秒会调用30次。
         * @method addUpdateObj
         * @param target 要循化调用 flush 函数的对象
         * @public
         * @static
         * @since
         */
        static addUpdateObj(target: any): void;
        /**
         * 移除掉已经添加的循环刷新对象
         * @method removeUpdateObj
         * @param target
         * @public
         * @static
         * @since 1.0.0
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
     * 声音类
     * @class annie.Sound
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    class Sound extends annie.EventDispatcher {
        /**
         * html 标签 有可能是audio 或者 video
         * @property media
         * @type {Audio}
         * @public
         * @since 1.0.0
         */
        media: any;
        private _loop;
        /**
         * 构造函数
         * @method Sound
         * @param {string} src
         * @param {string}type
         * @since 1.0.0
         */
        constructor(src: string);
        /**
         * 是否正在播放中
         * @property  isPlaying
         * @type {boolean}
         */
        isPlaying: boolean;
        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        play(start?: number, loop?: number): void;
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
        /**
         * 停止播放，给stopAllSounds调用
         */
        private stop2();
        /**
         * 恢复播放，给stopAllSounds调用
         */
        private play2();
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
         * @param {number} volume 音量大小，从0-1
         */
        static setAllSoundsVolume(volume: number): void;
        private static _volume;
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
        draw(target: any): void;
        /**
         * 开始遮罩
         * @param target
         */
        beginMask(target: any): void;
        /**
         * 结束遮罩
         */
        endMask(): void;
        end(): void;
        /**
         * 开始渲染
         */
        begin(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.CanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    class CanvasRender extends AObject implements IRender {
        static drawCtx: any;
        private _stage;
        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        constructor(stage: Stage, ctx: any);
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        begin(): void;
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        beginMask(target: any): void;
        private drawMask(target, ctx);
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        endMask(): void;
        end(): void;
        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        draw(target: any): void;
        destroy(): void;
    }
}
/**
 * @module annie
 */
declare namespace annie {
    class TweenObj extends AObject {
        constructor();
        currentFrame: number;
        totalFrames: number;
        protected _startData: any;
        protected _disData: any;
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
         * @public
         * @since 1.0.0
         */
        init(target: any, times: number, data: any, isTo?: boolean): void;
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
         * 将target对象的属性数值渐变到data中对应属性指定的数值
         * @method to
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 如果data.useFrame为true 这里就是帧数，如果data.useFrame为false则这里就是时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否向摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成函数. 默认为null
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数,回传参数是当前的Tween时间比.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位,默认以秒为单位
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
         * @param {number:boolean} data.yoyo 是否向摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成结束函数. 默认为null
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数,回传参数是当前的Tween时间比.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        static from(target: any, totalFrame: number, data: Object): number;
        private static createTween(target, totalFrame, data, isTo);
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
        /**
         * 这里之所有要独立运行,是因为可能存在多个stage，不能把这个跟其中任何一个stage放在一起update
         * @method flush
         * @private
         * @since 1.0.0
         */
        private static flush();
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
         * 构造函数，初始化
         * @method Timer
         * @param {number} delay
         * @param {number} repeatCount
         * @example
         *      var timer=new annie.Timer(1000,10);
         *      timer.addEventListener(annie.Event.TIMER,function (e) {
         *          trace("once");
         *      })
         *      timer.addEventListener(annie.Event.TIMER_COMPLETE, function (e) {
         *          trace("complete");
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
        currentCount: number;
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
        running: boolean;
        private _running;
        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时残绕着你
         * @method kill
         * @public
         * @since 1.0.9
         */
        kill(): void;
        private update();
        private static _timerList;
        private static flush();
        destroy(): void;
    }
}
/**
 * @class annie
 */
declare namespace annie {
    /**
     * annie引擎的版本号
     * @public
     * @since 1.0.1
     * @property annie.version
     * @type {string}
     * @example
     *      //打印当前引擎的版本号
     *      trace(annie.version);
     */
    let version: string;
    /**
     * 设备的retina值,简单点说就是几个像素表示设备上的一个点
     * @property annie.devicePixelRatio
     * @type {number}
     * @since 1.0.0
     * @public
     * @static
     */
    let devicePixelRatio: number;
    /**
     * 全局事件侦听
     * @property globalDispatcher
     * @type {annie.EventDispatcher}
     */
    let globalDispatcher: EventDispatcher;
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
     *              let state=e.currentTarget;
     *              state.scaleMode=aList[i];
     *              state.resize();
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
     * 创建一个声音对象
     * @type {Audio}
     */
    let createAudio: Function;
    let getImageInfo: Function;
    /**
     * 继承类方法
     * @type {Function}
     */
    let A2xExtend: any;
    /**
     * 加载后的类引用全放在这里
     * @type {Object}
     */
    let classPool: any;
    /**
     * 加载场景的方法
     * @method loadScene
     * @param {String|Array} 单个场景名或者多个场景名组成的数组
     * @type {Function}
     */
    let loadScene: Function;
    /**
     * 是否已经加载过场景
     * @method isLoadedScene
     * @param {string} sceneName
     * @return {boolean}
     */
    function isLoadedScene(sceneName: string): boolean;
    /**
     * 删除加载过的场景
     * @method unLoadScene
     * @param {string} sceneName
     */
    function unLoadScene(sceneName: string): void;
    /**
     * 解析资源
     * @method parseScene
     * @param {string} sceneName
     * @param sceneRes
     * @param sceneData
     */
    function parseScene(sceneName: string, sceneRes: any, sceneData: any): void;
    /**
     * 获取已经加载场景中的资源
     * @method getResource
     * @public
     * @static
     * @since 2.0.0
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    function getResource(sceneName: string, resName: string): any;
    /**
     * 用一个对象批量设置另一个对象的属性值,此方法一般给Flash2x工具自动调用
     * @method d
     * @public
     * @static
     * @since 1.0.0
     * @param {Object} target
     * @param {Object} info
     */
    function d(target: any, info: any): void;
    /**
     * 引擎自调用.初始化 sprite和movieClip用
     * @param target
     * @param {string} _resId
     * @private
     */
    function initRes(target: any, sceneName: string, resName: string): void;
}
