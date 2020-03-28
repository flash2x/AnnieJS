/**
 * @module annieUI
 */
declare namespace annieUI {
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.Scroller
     * @public
     * @extends annie.AObject
     * @since 3.1.0
     */
    class Scroller extends annie.EventDispatcher {
        /**
         * annieUI.Scroller 组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_ING
         * @since 3.1.0
         */
        /**
         * annieUI.Scroller 组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_TO_HEAD
         * @since 3.1.5
         */
        /**
         * annieUI.Scroller 组件停止滑动事件
         * @event annie.Event.ON_SCROLL_STOP
         * @since 3.1.5
         */
        /**
         * annieUI.Scroller 组件开始滑动事件
         * @event annie.Event.ON_SCROLL_START
         * @since 3.1.5
         */
        /**
         * annieUI.Scroller 组件滑动到结束位置事件
         * @event annie.Event.ON_SCROLL_TO_END
         * @since 3.1.5
         */
        protected _container: annie.DisplayObject;
        /**
         * 是否纵向滚动
         * @property isScrollY
         * @type {boolean}
         * @public
         * @since 3.1.5
         * @default true;
         */
        isScrollY: boolean;
        /**
         * 是否横向滚动
         * @property isScrollX
         * @type {boolean}
         * @since 3.1.5
         * @public
         * @default true;
         */
        isScrollX: boolean;
        /**
         * 是否松开鼠标后让其自由缓冲滑动
         * @property isMomentum
         * @type {boolean}
         * @since 3.1.5
         * @public
         * @default true;
         */
        isMomentum: boolean;
        /**
         * 是否滑到边界后有回弹效果
         * @property isBounce
         * @type {boolean}
         * @since 3.1.5
         * @public
         * @default true;
         */
        isBounce: boolean;
        /**
         * 回弹的动效时长,单位:ms
         * @property bounceTime
         * @type {number}
         * @public
         * @since 3.1.5
         * @default 300
         */
        bounceTime: number;
        /**
         * 是否需要横向纵向保护，有些时候你想纵向滑动，但鼠标也轻微的左右飘了，如果不lock刚好左右滑动也被允许的话，则左右也会滑动，横向滑动则相反。
         * 如果想鼠标不那么灵敏的话，可以加上一把锁，这样左右滑的时候上下不会滑，上下滑的时候左右不会滑
         * @property isLocked
         * @type {boolean}
         * @public
         * @since 3.1.5
         * @default 300
         */
        isLocked: boolean;
        /**
         * 锁的像素范围
         * @property lockDis
         * @type {number}
         * @since 3.1.5
         * @public
         * @default 5
         */
        lockDis: number;
        /**
         * 当前滑动的x坐标 更改此参数则需要调用resetPosition()方法生效
         * @property curX
         * @type {number}
         * @since 3.1.5
         * @default 0
         */
        readonly curX: number;
        protected _curX: number;
        /**
         * 当前滑动的y坐标 更改此参数则需要调用resetPosition()方法生效
         * @property curY
         * @type {number}
         * @since 3.1.5
         * @default 0
         */
        readonly curY: number;
        protected _curY: number;
        /**
         * 当前显示范围的宽
         * @property viewWidth
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        readonly viewWidth: number;
        _viewWidth: number;
        /**
         * 当前显示范围的高
         * @property viewHeight
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        readonly viewHeight: number;
        _viewHeight: number;
        /**
         * 当前横向的滑动范围
         * @property scrollWidth
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        readonly scrollWidth: number;
        _scrollWidth: number;
        /**
         * 当前纵向的滑动范围
         * @property scrollHeight
         * @type {number}
         * @since 3.1.5
         * @default 0
         * @readonly
         */
        readonly scrollHeight: number;
        _scrollHeight: number;
        /**
         * 是否正在滑动中
         * @property isRunning
         * @type {boolean}
         * @since 3.1.5
         * @default false
         */
        isRunning: boolean;
        private startX;
        private startY;
        private maxScrollX;
        private maxScrollY;
        private endTime;
        private mouseStatus;
        private distX;
        private distY;
        private startTime;
        private absStartX;
        private absStartY;
        private pointX;
        private pointY;
        private deceleration;
        private destTime;
        private destX;
        private destY;
        private duration;
        private easingFn;
        /**
         * 初始化
         * @method Scroller
         * @param {annie.DisplayObject} container
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        constructor(container: annie.DisplayObject, viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number);
        /**
         * 初始化，也可以反复调用此方法重用scroller
         * @method init
         * @param {annie.DisplayObject} container
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         * @public
         * @since 3.1.5
         */
        init(container: annie.DisplayObject, viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number): void;
        /**
         * 当更改了viewWidth,viewHeight其中一个或两个同时也更改了scrollWidth,scrollHeight其中的一个或者两个
         * 需要调用此方法重置，如果只是单方面更改了viewWidth,viewHeight其中一个或两个,则可以调用setViewWH()
         * 如果只是更改了scrollWidth,scrollHeight其中的一个或者两个，则可以调用setScrollWH()
         * @method setViewWHAndScrollWH
         * @public
         * @since 3.1.5
         * @param {number} viewWidth
         * @param {number} viewHeight
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        setViewWHAndScrollWH(viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number): void;
        /**
         * 当更改了viewWidth,viewHeight其中一个或两个,需要调用此方法重置.
         * @method setViewWH
         * @public
         * @since 3.1.5
         * @param {number} viewWidth
         * @param {number} viewHeight
         */
        setViewWH(viewWidth: number, viewHeight: number): void;
        /**
         * 当更改了scrollWidth,scrollHeight其中的一个或者两个,需要调用此方法重置.
         * @method setScrollWH
         * @public
         * @since 3.1.5
         * @param {number} scrollWidth
         * @param {number} scrollHeight
         */
        setScrollWH(scrollWidth: number, scrollHeight: number): void;
        _updateViewAndScroll(): void;
        private _mouseEvent;
        private _enterFrame;
        private onEnterFrame;
        private onMouseEvent;
        destroy(): void;
        resetPosition(time?: number): boolean;
        /**
         * 从设置的x,y坐标滑过来。 注意x y位置是负数，想想为什么
         * @method scrollBy
         * @param {number} x 从哪个x坐标滑过来
         * @param {number} y 从哪个y坐标滑过来
         * @param {number} time 滑动时长 ms,0的话没效果直接跳
         * @param {Function} easing annie.Tween中指定的缓存方法
         * @public
         * @since 3.1.5
         */
        scrollBy(x: number, y: number, time?: number, easing?: Function): void;
        /**
         * 滑动到设置的x,y坐标。 注意x y位置是负数，想想为什么
         * @method scrollTo
         * @param {number} x 要滑去的x坐标
         * @param {number} y 要滑去的y坐标
         * @param {number} time 滑动时长 ms,0的话没效果直接跳
         * @param {Function} easing annie.Tween中指定的缓存方法
         * @public
         * @since 3.1.5
         */
        scrollTo(x: number, y: number, time?: number, easing?: Function): void;
        _translate(x: number, y: number): void;
        private static toMomentum;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    /**
     * 用滚动的方式播放MC,回弹默认关闭，可开启
     * @class annieUI.MCScroller
     * @public
     * @extends annie.Scroller
     * @since 3.1.5
     */
    class MCScroller extends annieUI.Scroller {
        /**
         * 滑动的速率，值越大，滑动越慢,默认是10
         * @property rate
         * @param {number} value
         * @since 3.1.5
         * @public
         */
        rate: number;
        private _rate;
        /**
         * 鼠标滑动的方向，默认纵向
         * @property isVertical
         * @since 3.1.5
         * @public
         * @return {boolean}
         */
        isVertical: boolean;
        /**
         * 只读，获取当前mc的frame具体值，带小数
         * @property curFramePos
         * @readonly
         * @return {number}
         */
        readonly curFramePos: number;
        private _isVertical;
        /**
         * 构造函数
         * @method MCScroller
         * @param {annie.MovieClip} mc 要被滑动的mc
         * @param {number} rate mc 灵敏度，值越大滑动越慢，默认为10
         * @param {boolean} isVertical 是横向还是竖向滑动，默认是竖向
         */
        constructor(mc: annie.MovieClip, rate?: number, isVertical?: boolean);
        _translate(x: number, y: number): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    import DisplayObject = annie.DisplayObject;
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    class ScrollPage extends Sprite {
        /**
         * annieUI.ScrollPage 组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_TO_HEAD
         * @since 1.1.0
         */
        /**
         * annieUI.ScrollPage 组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_ING
         * @since 3.1.0
         */
        /**
         * annieUI.ScrollPage组件停止滑动事件
         * @event annie.Event.ON_SCROLL_STOP
         * @since 1.1.0
         */
        /**
         * annieUI.ScrollPage组件开始滑动事件
         * @event annie.Event.ON_SCROLL_START
         * @since 1.1.0
         */
        /**
         * annieUI.ScrollPage组件滑动到结束位置事件
         * @event annie.Event.ON_SCROLL_TO_END
         * @since 1.1.0
         */
        private maskObj;
        /**
         * 真正的被滚动的显示对象
         * @property view
         * @public
         * @since 1.0.0
         * @type {annie.Sprite}
         */
        readonly view: DisplayObject;
        protected _view: DisplayObject;
        /**
         * scroller滑动控制器
         * @property scroller
         * @readonly
         * @public
         * @since 3.1.5
         */
        readonly scroller: annieUI.Scroller;
        _scroller: annieUI.Scroller;
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {annie.DisplayObject} view 需要滚动的显示对象，可为空，为空的话则会自动生成一个显示容器。
         * @param {number} viewWidth 可视区域宽
         * @param {number} viewHeight 可视区域高
         * @param {number} scrollWidth 可滚动的宽度
         * @param {number} scrollHeight 可滚动的高度
         * @example
         *      s.sPage=new annieUI.ScrollPage(null,640,1040,640,1040*4);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         */
        constructor(container: annie.DisplayObject, viewWidth: number, viewHeight: number, scrollWidth: number, scrollHeight: number);
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置，如果只需要一个方向上可滑动，可以将view的宽或者高等于滑动的宽或者高
         * @method setViewWH
         * @param {number}viewWidth 设置可见区域的宽
         * @param {number}viewHeight 设置可见区域的高
         * @public
         * @since 3.1.5
         */
        setViewWH(viewWidth: number, viewHeight: number): void;
        destroy(): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    import DisplayObject = annie.DisplayObject;
    /**
     * 有些时候需要大量的有规则的滚动内容。这个是滚动类的Item类接口
     * @class annieUI.IScrollListItem
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.9
     */
    interface IScrollListItem extends DisplayObject {
        initData(id: number, data: Array<any>): void;
        id: number;
        data: number;
    }
    /**
     * 有些时候需要大量的有规则的滚动内容。这个时候就应该用到这个类了
     * @class annieUI.ScrollList
     * @public
     * @extends annieUI.ScrollPage
     * @since 1.0.9
     */
    class ScrollList extends ScrollPage {
        private _items;
        private _itemW;
        private _itemH;
        private _itemRow;
        private _itemCol;
        private _itemCount;
        private _itemClass;
        private _isInit;
        data: Array<any>;
        private downL;
        private _cols;
        private _disParam;
        private _lastFirstId;
        private _distance;
        private _paramXY;
        isVertical: boolean;
        private _isVertical;
        private _maxDistance;
        /**
         * 获取下拉滚动的loadingView对象
         * @property loadingView
         * @since 1.0.9
         * @return {DisplayObject}
         */
        readonly loadingView: DisplayObject;
        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemWidth item宽
         * @param {number} itemHeight item高
         * @param {number} viewWidth 列表的宽
         * @param {number} viewHeight 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @param {number} step 纵向就是分几列，横向就是分几行，默认是1列或者1行
         * @since 1.0.9
         */
        constructor(itemClassName: any, itemWidth: number, itemHeight: number, viewWidth: number, viewHeight: number, isVertical?: boolean, step?: number);
        /**
         * 更新列表数据
         * @method updateData
         * @param {Array} data
         * @param {boolean} isReset 是否重置数据列表。
         * @since 1.0.9
         */
        updateData(data: Array<any>, isReset?: boolean): void;
        private resetMaxDistance;
        private flushData;
        private _updateItems;
        /**
         * 设置加载数据时显示的loading对象
         * @since 1.0.9
         * @method setLoading
         * @param {annie.DisplayObject} downLoading
         */
        setLoading(downLoading: DisplayObject): void;
        destroy(): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 有时我们需要从外部获取一张个人头像，将它变成方形或者圆形展示出来。
     * 又希望他能按照我们的尺寸展示，这个时候你就需要用到FacePhoto类啦。
     * @class annieUI.FacePhoto
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    class FacePhoto extends Sprite {
        /**
         * 图片加载完成事件
         * @event COMPLETE
         * @since 1.0.0
         */
        /**
         * 构造函数
         * @method  FacePhoto
         * @since 1.0.0
         * @public
         * @example
         *      var circleface = new annieUI.FacePhoto(),
         *          rectFace=new annieUI.FacePhoto();
         *          //圆形头像
         *          circleface.init('http://test.annie2x.com/biglong/logo.jpg', 100,100, 0);
         *          circleface.x = 260;
         *          circleface.y = 100;
         *          s.addChild(circleface);
         *          //方形头像
         *          rectFace.init('http://test.annie2x.com/biglong/logo.jpg', 200,200, 1);
         *          rectFace.x = 260;
         *          rectFace.y = 400;
         *          s.addChild(rectFace);
         */
        constructor();
        private photo;
        private bitmap;
        private maskType;
        private radioW;
        private radioH;
        private radio;
        private maskObj;
        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param {string} src 头像的地址
         * @param {number} w 指定头像的宽
         * @param {number} h 指定头像的高
         * @param {number} maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形或椭圆形 1 正方形或者长方形 默认是圆形
         */
        init(src: string, w: number, h: number, maskType?: number): void;
        destroy(): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 滑动页面类
     * @class annieUI.SlidePage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    class SlidePage extends Sprite {
        /**
         * annieUI.Slide 组件开始滑动事件
         * @event annie.Event.ON_SLIDE_START
         * @since 1.1.0
         */
        /**
         * annieUI.Slide 组件结束滑动事件
         * @event annie.Event.ON_SLIDE_END
         * @since 1.1.0
         */
        /**
         * 页面个数
         * @property listLen
         * @type {number}
         * @protected
         * @default 0
         */
        protected listLen: number;
        /**
         * 页面滑动容器
         * @property view
         * @type {annie.Sprite}
         * @since 1.1.0
         * @public
         */
        view: Sprite;
        maskObj: annie.Shape;
        /**
         * 滑动方向
         * @property isVertical
         * @type {boolean}
         * @protected
         */
        protected isVertical: boolean;
        /**
         * 容器活动速度
         * @property slideSpeed
         * @type {number}
         * @public
         * @default 0.2
         */
        slideSpeed: number;
        private _isBreak;
        /**
         * 滚动距离
         * @property distance
         * @type {number}
         * @protected
         * @default 0
         * @since 1.0.0
         */
        protected distance: number;
        private touchEndX;
        private movingX;
        private movingY;
        private _moveDis;
        private touchEndY;
        /**
         * 当前页面索引ID 默认从0开始
         * @property currentPageIndex
         * @type {number}
         * @public
         * @since 1.0.3
         * @default 0
         */
        currentPageIndex: number;
        /**
         * 上下的回弹率 默认0.3
         * @property reBound
         * @type {number}
         * @public
         * @since 1.0.3
         * @default 0.3
         */
        reBound: number;
        /**
         * 页面是否滑动跟随，默认false
         * @property isPageFollowToMove
         * @type {boolean}
         * @public
         * @since 1.0.3
         * @default false
         */
        isPageFollowToMove: boolean;
        /**
         * 页面的跟随缓动系数率，默认0.7
         * @property follow
         * @type {number}
         * @public
         * @since 1.0.3
         * @default 0.7
         */
        follow: number;
        /**
         * 页面是否移动
         * @property isMoving
         * @type {boolean}
         * @public
         * @default false
         * @public
         */
        isMoving: boolean;
        /**
         * 页面宽
         * @property viewWidth
         * @type {number}
         * @protected
         */
        protected viewWidth: number;
        /**
         * 页面高
         * @property viewHeight
         * @type {number}
         * @protected
         */
        protected viewHeight: number;
        /**
         * 页面对象列表
         * @property pageList
         * @type {Array}
         * @public
         */
        pageList: Array<any>;
        /**
         * 页面对象的类列表
         * @property pageClassList
         * @type {Array}
         * @public
         */
        pageClassList: Array<any>;
        private lastX;
        private lastY;
        /**
         * 是否点击了鼠标
         * @property isMouseDown
         * @type {boolean}
         * @public
         */
        isMouseDown: boolean;
        /**
         * 是否允许通过鼠标去滚动
         * @property isCanUseMouseScroll
         * @type {boolean}
         * @since 3.0.1
         */
        isCanUseMouseScroll: boolean;
        /**
         * 是否可以下一页
         * @property canSlideNext
         * @since 1.0.3
         * @default true
         * @type {boolean}
         * @public
         */
        canSlideNext: boolean;
        /**
         * 是否可以上一页
         * @property canSlidePrev
         * @type {boolean}
         * @public
         * @default true
         */
        canSlidePrev: boolean;
        paramXY: string;
        private _ease;
        /**
         * 构造函数
         * @method SlidePage
         * @param {number} vW 宽
         * @param {number} vH 高
         * @param {boolean} isVertical 是横向还是纵向 默认纵向
         * @param {Function} ease annie.Tween的缓存函数，也可以是自定义的缓动函数，自定义的话,请尊守annie.Tween缓动函数接口
         */
        constructor(vW: number, vH: number, isVertical?: boolean, ease?: Function);
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setMask
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.0.0
         */
        private setMask;
        private onMouseEvent;
        /**
         * 滑动到指定页
         * @method slideTo
         * @public
         * @since 1.1.1
         * @param {number} index 要跳到页的索引
         * @param {boolean} noTween 是否需要动画过渡，如果不需要设置成true
         */
        slideTo(index: number, noTween?: boolean): void;
        /**
         * 用于插入分页
         * @method addPageList
         * @param {Array} classList  每个页面的类，注意是类，不是对象
         * @since 1.0.3
         * @public
         */
        addPageList(classList: any): void;
        destroy(): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    class FlipBook extends Sprite {
        /**
         * annieUI.FlipBook组件翻页开始事件
         * @event annie.Event.ON_FLIP_START
         * @since 1.1.0
         */
        /**
         * annieUI.FlipBook组件翻页结束事件
         * @event annie.Event.ON_FLIP_STOP
         * @since 1.1.0
         */
        /**
         * 电子杂志组件类
         * @class annieUI.FlipBook
         * @public
         * @extends annie.Sprite
         * @since 1.0.3
         */
        /**
         * 总页数
         * @property totalPage
         * @type {number}
         */
        totalPage: number;
        /**
         * 当前页数
         * @property
         * @type {number}
         * @since 1.0.3
         */
        currPage: number;
        /**
         * 翻页速度，0-1之间，值越小，速度越快
         * @property
         * @since 1.1.3
         * @type {number}
         */
        speed: number;
        private bW;
        private bH;
        private toPage;
        private crossGap;
        private layer1Arr;
        private layer0Arr;
        private state;
        private timerArg0;
        private timerArg1;
        private px;
        private py;
        private toPosArr;
        private myPosArr;
        private rPage0;
        private rPage1;
        private pageMC;
        private leftPage;
        private rightPage;
        private rMask0;
        private rMask1;
        private shadow0;
        private shadow1;
        private sMask0;
        private sMask1;
        private p1;
        private p2;
        private p3;
        private p4;
        private limitP1;
        private limitP2;
        private pages;
        private stageMP;
        private getPageCallback;
        /**
         * 指定是否能够翻页动作
         * @property canFlip
         * @since 1.0.3
         * @type {boolean}
         */
        canFlip: boolean;
        /**
         * 初始化电子杂志
         * @method FlipBook
         * @param {number} width 单页宽
         * @param {number} height 单页高
         * @param {number} pageCount 总页数，一般为偶数
         * @param {Function} getPageCallBack，通过此回调获取指定页的内容的显示对象
         * @since 1.0.3
         */
        constructor(width: number, height: number, pageCount: any, getPageCallBack: Function);
        private md;
        private mu;
        private mm;
        private drawPage;
        private checkLimit;
        private getPage;
        private getBookArr;
        private getLayerArr;
        private getShape;
        private setShadowMask;
        private getShadow;
        private setPage;
        private onMouseDown;
        private onMouseUp;
        private onMouseMove;
        private checkArea;
        /**
         * 跳到指定的页数
         * @method flipTo
         * @param {number} index 跳到指定的页数
         * @since 1.0.3
         */
        flipTo(index: number): void;
        /**
         * @method nextPage
         * @public
         * @since 1.1.1
         */
        nextPage(): void;
        /**
         * @method prevPage
         * @public
         * @since 1.1.1
         */
        prevPage(): void;
        /**
         * @method startPage
         * @public
         * @since 1.1.1
         */
        startPage(): void;
        /**
         * @method endPage
         * @public
         * @since 1.1.1
         */
        endPage(): void;
        private flushPage;
        private onEnterFrame;
        private arc;
        private angle;
        private pos;
        destroy(): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 画板类
     * @class annieUI.DrawingBoard
     * @public
     * @extends annie.Bitmap
     * @since 1.1.1
     */
    class DrawingBoard extends annie.Bitmap {
        protected context: CanvasRenderingContext2D;
        protected _isMouseDown: boolean;
        /**
         * 绘画半径
         * @property drawRadius
         * @type {number}
         * @public
         * @since 1.1.1
         */
        drawRadius: number;
        protected _drawRadius: number;
        /**
         * 绘画颜色, 可以是任何的颜色类型
         * @property drawColor
         * @type {string}
         * @public
         * @since
         * @type {any}
         */
        drawColor: any;
        /**
         * 背景色 可以是任何的颜色类型
         * @property bgColor
         * @type {any}
         * @public
         * @since 1.1.1
         */
        bgColor: any;
        /**
         * 总步数数据
         * @property totalStepList
         * @protected
         * @type {any[]}
         */
        protected totalStepList: any;
        /**
         * 单步数据
         * @protected
         * @property addStepObj
         * @type {Object}
         */
        protected addStepObj: any;
        /**
         * 当前步数所在的id
         * @property currentStepId
         * @protected
         * @type {number}
         */
        protected currentStepId: number;
        protected static _getDrawCanvas(width: number, height: number): HTMLCanvasElement;
        /**
         * 构造函数
         * @method DrawingBoard
         * @param width 画板宽
         * @param height 画板高
         * @param bgColor 背景色 默认透明
         * @since 1.1.1
         */
        constructor(width: number, height: number, bgColor?: any);
        private onMouseDown;
        private onMouseUp;
        private onMouseMove;
        /**
         * 重置画板
         * @method reset
         * @param bgColor
         * @public
         * @since 1.1.1
         */
        reset(bgColor?: any): void;
        /**
         * 撤销步骤
         * @method cancel
         * @param {number} step 撤销几步 0则全部撤销,等同于reset
         * @public
         * @since 1.1.1
         */
        cancel(step?: number): boolean;
        destroy(): void;
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    /**
     * 刮刮卡类
     * @class annieUI.ScratchCard
     * @public
     * @extends annie.DrawingBoard
     * @since 1.1.1
     */
    class ScratchCard extends DrawingBoard {
        /**
         * annie.ScratchCard 刮刮卡事件，刮了多少，一个百分比
         * @event annie.Event.ON_DRAW_PERCENT
         * @since 1.0.9
         *
         */
        /**
         * 构造函数
         * 请监听 annie.Event.ON_DRAW_PERCENT事件来判断刮完多少百分比了。
         * @method ScratchCard
         * @param width 宽
         * @param height 高
         * @param frontColorObj 没刮开之前的图，可以为单色，也可以为位图填充。一般是用位图填充，如果生成位图填充，请自行复习canvas位图填充
         * @param backColorObj 被刮开之后的图，可以为单色，也可以为位图填充。一般是用位图填充，如果生成位图填充，请自行复习canvas位图填充
         * @param drawRadius 刮刮卡刮的时候的半径，默认为50
         */
        constructor(width: number, height: number, frontColorObj: any, backColorObj: any, drawRadius?: number);
        private _drawList;
        private _totalDraw;
        private _currentDraw;
        /**
         * 重置刮刮卡
         * @method reset
         * @param frontColorObj 没刮开之前的图，可以为单色，也可以为位图填充。赋值为""会用之前已设置的
         * @param backColorObj 被刮开之后的图，可以为单色，也可以为位图填充。赋值为""会用之前已设置的
         * @since 1.1.1
         * @public
         */
        reset(frontColorObj?: any, backColorObj?: any): void;
        /**
         * 撤销步骤 没有任何功能，只是把从基类中的代码移除，调用不会产生任何效果
         * @method cancel
         * @param step
         * @public
         * @since 1.1.1
         * @return {boolean}
         */
        cancel(step?: number): boolean;
        drawRadius: number;
        destroy(): void;
    }
}
