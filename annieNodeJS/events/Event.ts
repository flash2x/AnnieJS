/**
 * @module annie
 */
namespace annie {
    /**
     * 事件类,annie引擎中一切事件的基类
     * @class annie.Event
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class Event extends AObject {
        /**
         * annie.Stage舞台初始化完成后会触发的事件
         * @property ON_INIT_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static ON_INIT_STAGE:string = "onInitStage";
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * annie.Stage舞台尺寸发生变化时触发
         * @property RESIZE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static RESIZE:string = "onResize";
        /**
         * annie引擎暂停或者恢复暂停时触发，这个事件只能在annie.globalDispatcher中监听
         * @property ON_RUN_CHANGED
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static ON_RUN_CHANGED:string = "onRunChanged";
        /**
         * annie.Media相关媒体类的播放刷新事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_UPDATE
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_PLAY_UPDATE="onPlayUpdate";
        /**
         * annie.Media相关媒体类的播放完成事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_PLAY_END="onPlayEnd";
        /**
         * annie.Media相关媒体类的开始播放事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_PLAY_START="onPlayStart";
        /**
         * annie.FlipBook组件翻页开始事件
         * @property ON_FLIP_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_FLIP_START="onFlipStart";
        /**
         * annie.FlipBook组件翻页结束事件
         * @property ON_FLIP_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_FLIP_STOP="onFlipStop";
        /**
         * annie.ScrollPage组件滑动到开始位置事件
         * @property ON_SCROLL_TO_HEAD
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_SCROLL_TO_HEAD="onScrollToHead";
        /**
         * annie.ScrollPage组件停止滑动事件
         * @property ON_SCROLL_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_SCROLL_STOP="onScrollStop";
        /**
         * annie.ScrollPage组件开始滑动事件
         * @property ON_SCROLL_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_SCROLL_START="onScrollStart";
        /**
         * annie.Scroller组件开始滑动事件
         * @property ON_SCROLL_ING
         * @static
         * @since 3.1.0
         * @type {string}
         */
        public static ON_SCROLL_ING="onScrollIng";
        /**
         * annie.ScrollPage组件滑动到结束位置事件
         * @property ON_SCROLL_TO_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_SCROLL_TO_END="onScrollToEnd";
        /**
         * annie.Slide 组件开始滑动事件
         * @property ON_SLIDE_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_SLIDE_START="onSlideStart";
        /**
         * annie.Slide 组件结束滑动事件
         * @property ON_SLIDE_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        public static ON_SLIDE_END="onSlideEnd";

        /**
         * annie.DisplayObject显示对象加入到舞台事件
         * @property ADD_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static ADD_TO_STAGE:string = "onAddToStage";
        /**
         * annie.DisplayObject显示对象从舞台移出事件
         * @property REMOVE_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static REMOVE_TO_STAGE:string = "onRemoveToStage";
        /**
         * annie.DisplayObject显示对象 循环帧事件
         * @property ENTER_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static ENTER_FRAME:string = "onEnterFrame";
        /**
         * annie.MovieClip 播放完成事件
         * @property END_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static END_FRAME:string = "onEndFrame";
        /**
         * annie.MovieClip 帧标签事件
         * @property CALL_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static CALL_FRAME:string = "onCallFrame";
        /**
         * 完成事件
         * @property COMPLETE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static COMPLETE:string = "onComplete";
        /**
         * annie.URLLoader加载过程事件
         * @property PROGRESS
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static PROGRESS:string = "onProgress";
        /**
         * annie.URLLoader出错事件
         * @property ERROR
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static ERROR:string = "onError";
        /**
         * annie.URLLoader中断事件
         * @property ABORT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static ABORT:string = "onAbort";
        /**
         * annie.URLLoader开始事件
         * @property START
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        public static START:string = "onStart";
        /**
         * annie.Timer定时器触发事件
         * @property TIMER
         * @static
         * @since 1.0.9
         * @public
         * @type {string}
         */
        public static TIMER:string="onTimer";
        /**
         * annie.Timer定时器完成事件
         * @property TIMER_COMPLETE
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        public static TIMER_COMPLETE:string="onTimerComplete";
        /**
         * annie.ScratchCard 刮刮卡事件，刮了多少，一个百分比
         * @property ON_DRAW_PERCENT
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        public static ON_DRAW_PERCENT:string="onDrawPercent";
        /**
         * 事件类型名
         * @property type
         * @type {string}
         * @public
         * @since 1.0.0
         */
        public type:string="";
        /**
         * 触发此事件的对象
         * @property target
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public target:any=null;
        /**
         * 随着事件一起附带的信息对象
         * 所有需要随事件一起发送的信息都可以放在此对象中
         * @property data
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public data:any=null;

        /**
         * @method Event
         * @param {string} type 事件类型
         * @public
         * @since 1.0.0
         */
        public constructor(type:string) {
            super();
            this._instanceType="annie.Event";
            this.type = type;
        }
        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
         * @method stopImmediatePropagation
         * @public
         * @return {void}
         * @since 2.0.0
         */
        public stopImmediatePropagation():void{
            this._pd=true;
        }
        //是否阻止事件向下冒泡
        private _pd:boolean=false;

        public destroy(): void {
            let s=this;
            s.target=null;
            s.data=null;
        }

        /**
         * 重置事件到初始状态方便重复利用
         * @method reset
         * @param {string} type
         * @param target
         * @since 2.0.0
         * @return {void}
         * @public
         */
        public reset(type:string,target:any):void{
            let s=this;
            s.target=target;
            s._pd=false;
            s.type=type;
        }
    }
}