/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    class ScrollPage extends Sprite {
        /**
         * annie.ScrollPage组件滑动到开始位置事件
         * @event annie.Event.ON_SCROLL_TO_HEAD
         * @since 1.1.0
         */
        /**
         * annie.ScrollPage组件停止滑动事件
         * @event annie.Event.ON_SCROLL_STOP
         * @since 1.1.0
         */
        /**
         * annie.ScrollPage组件开始滑动事件
         * @event annie.Event.ON_SCROLL_START
         * @since 1.1.0
         */
        /**
         * annie.ScrollPage组件滑动到结束位置事件
         * @event annie.Event.ON_SCROLL_TO_END
         * @since 1.1.0
         */
        /**
         * 横向还是纵向 默认为纵向
         * @property isVertical
         * @type {boolean}
         * @protected
         * @since 1.0.0
         * @default true
         */
        protected isVertical: boolean;
        /**
         * 可见区域的宽
         * @property viewWidth
         * @type {number}
         * @protected
         * @since 1.0.0
         * @default 0
         */
        protected viewWidth: number;
        /**
         * 可见区域的高
         * @property viewHeight
         * @type {number}
         * @protected
         * @since 1.0.0
         * @default 0
         */
        protected viewHeight: number;
        private _tweenId;
        /**
         * 整个滚动的最大距离值
         * @property maxDistance
         * @type {number}
         * @public
         * @since 1.0.0
         * @default 1040
         */
        maxDistance: number;
        /**
         * @property 滚动距离
         * @type {number}
         * @protected
         * @default 0
         * @since 1.0.0
         */
        protected distance: number;
        /**
         * 最小鼠标滑动距离
         * @property  minDis
         * @protected
         * @type {number}
         */
        protected minDis: number;
        private maskObj;
        /**
         * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
         * @property view
         * @public
         * @since 1.0.0
         * @type {annie.Sprite}
         */
        view: Sprite;
        private lastValue;
        /**
         * 速度
         * @property speed
         * @protected
         * @since 1.0.0
         * @type {number}
         */
        protected speed: number;
        /**
         * 加速度
         * @property addSpeed
         * @protected
         * @since 1.0.0
         * @type {number}
         */
        protected addSpeed: number;
        /**
         * 是否是停止滚动状态
         * @property isStop
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         */
        isStop: boolean;
        /**
         * 滚动的最大速度，直接影响一次滑动之后最长可以滚多远
         * @property maxSpeed
         * @public
         * @since 1.0.0
         * @default 100
         * @type {number}
         */
        maxSpeed: number;
        /**
         * 摩擦力,值越大，减速越快
         * @property fSpeed
         * @public
         * @since 1.0.0
         * @default 20
         * @type {number}
         */
        fSpeed: number;
        protected paramXY: string;
        private stopTimes;
        private isMouseDownState;
        private autoScroll;
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {number} vW 可视区域宽
         * @param {number} vH 可视区域高
         * @param {number} maxDistance 最大滚动的长度
         * @param {boolean} isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @example
         *      s.sPage=new annie.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
         */
        constructor(vW: number, vH: number, maxDistance: number, isVertical?: boolean);
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @param {boolean} isVertical 方向
         * @public
         * @since 1.1.1
         */
        setViewRect(w: number, h: number, isVertical: boolean): void;
        private onMouseEvent(e);
        /**
         * 滚到指定的坐标位置
         * @method scrollTo
         * @param {number} dis 需要去到的位置
         * @param {number} time 滚动需要的时间 默认为0 即没有动画效果直接跳到指定页
         * @since 1.1.1
         * @public
         */
        scrollTo(dis: number, time?: number): void;
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
         *      var circleface = new annie.FacePhoto(),
         *          rectFace=new annie.FacePhoto();
         *          //圆形头像
         *          circleface.init('http://test.annie2x.com/biglong/logo.jpg', 100, 0);
         *          circleface.x = 260;
         *          circleface.y = 100;
         *          s.addChild(circleface);
         *          //方形头像
         *          rectFace.init('http://test.annie2x.com/biglong/logo.jpg', 200, 1);
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
         * @param {number} maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形 1方形 默认是0
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
         * annie.Slide 组件开始滑动事件
         * @event annie.Event.ON_SLIDE_START
         * @since 1.1.0
         */
        /**
         * annie.Slide 组件结束滑动事件
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
        reBound: number;
        isPageFollowToMove: boolean;
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
         * 页面列表
         * @property pageList
         * @type {Array}
         * @public
         */
        pageList: Array<any>;
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
        private setMask(w, h);
        private onMouseEvent(e);
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
         * annie.FlipBook组件翻页开始事件
         * @event annie.Event.ON_FLIP_START
         * @since 1.1.0
         */
        /**
         * annie.FlipBook组件翻页结束事件
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
        private drawPage(num, movePoint);
        private checkLimit(point, limitPoint, limitGap);
        private getPage(index);
        private getBookArr(point, actionPoint1, actionPoint2);
        private getLayerArr(point1, point2, actionPoint1, actionPoint2, limitPoint1, limitPoint2);
        private getShape(shape, pointArr);
        private setShadowMask(shape, g_width, g_height);
        private getShadow(shape, point1, point2, arg);
        private setPage(pageNum);
        private onMouseDown(e);
        private onMouseUp(e);
        private onMouseMove(e);
        private checkArea(point);
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
        private flushPage();
        private onEnterFrame(e);
        private arc(argR, argN1, argN2);
        private angle(target1, target2);
        private pos(target1, target2);
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
        /**
         * 获取下拉滚动的loadingView对象
         * @property loadingView
         * @since 1.0.9
         * @return {DisplayObject}
         */
        loadingView: DisplayObject;
        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemWidth item宽
         * @param {number} itemHeight item高
         * @param {number} vW 列表的宽
         * @param {number} vH 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @param {number} cols 分几列，默认是1列
         * @since 1.0.9
         */
        constructor(itemClassName: any, itemWidth: number, itemHeight: number, vW: number, vH: number, isVertical?: boolean, cols?: number);
        /**
         * 更新列表数据
         * @method updateData
         * @param {Array} data
         * @param {boolean} isReset 是否重置数据列表。
         * @since 1.0.9
         */
        updateData(data: Array<any>, isReset?: boolean): void;
        private flushData();
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @param {boolean} isVertical 方向
         * @public
         * @since 1.1.1
         */
        setViewRect(w: number, h: number, isVertical: boolean): void;
        private _updateViewRect();
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
         * 画板宽
         * @property drawWidth
         * @type {number}
         * @readonly
         * @public
         * @since 1.1.1
         */
        drawWidth: number;
        /**
         * 画板高
         * @property drawHeight
         * @type {number}
         * @readonly
         * @public
         * @since 1.1.1
         */
        drawHeight: number;
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
        /**
         * 构造函数
         * @method DrawingBoard
         * @param width 画板宽
         * @param height 画板高
         * @param bgColor 背景色 默认透明
         * @since 1.1.1
         */
        constructor(width: number, height: number, bgColor?: any);
        private onMouseDown(e);
        private onMouseUp(e);
        private onMouseMove(e);
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
         * 请监听 "onDrawTime"事件来判断刮完多少百分比了。
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
         * @param backColorObj 要更换的被刮出来的图片,不赋值的话默认之前设置的
         * @since 1.1.1
         * @public
         */
        reset(backColorObj?: any): void;
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
