/**
 * Created by anlun on 16/8/14.
 */
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
         * 横向还是纵向 默认为纵向
         * @property isVertical
         * @type {boolean}
         * @private
         * @since 1.0.0
         * @default true
         */
        private isVertical;
        /**
         * 可见区域的宽
         * @property viewWidth
         * @type {number}
         * @private
         * @since 1.0.0
         * @default 0
         */
        private viewWidth;
        /**
         * 可见区域的高
         * @property viewHeight
         * @type {number}
         * @private
         * @since 1.0.0
         * @default 0
         */
        private viewHeight;
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
         * @private
         * @default 0
         * @since 1.0.0
         */
        private distance;
        /**
         * 最小鼠标滑动距离
         * @type {number}
         */
        private minDis;
        /**
         * 遮罩对象
         * @property maskObj
         * @since 1.0.0
         * @private
         * @type {annie.Shape}
         */
        private maskObj;
        /**
         * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
         * @property view
         * @public
         * @since 1.0.0
         * @type {annie.Sprite}
         */
        view: Sprite;
        /**
         * 最后鼠标经过的坐标值
         * @property lastValue
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private lastValue;
        /**
         * 速度
         * @property speed
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private speed;
        /**
         * 加速度
         * @property addSpeed
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private addSpeed;
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
        private paramXY;
        private stopTimes;
        private isMouseDown;
        /**
         * 是否是通过scrollTo方法在滑动中
         * @property autoScroll
         * @since 1.0.2
         * @type {boolean}
         * @private
         * @default false;
         */
        private autoScroll;
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {number}vW 可视区域宽
         * @param {number}vH 可视区域高
         * @param {number}maxDistance 最大滚动的长度
         * @param {boolean}isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         */
        constructor(vW: number, vH: number, maxDistance: number, isVertical?: boolean);
        /**
         * 改可滚动的方向，比如之前是纵向滚动的,你可以横向的。或者反过来
         * @method changeDirection
         * @param {boolean}isVertical 是纵向还是横向,不传值则默认为纵向
         * @since 1.0.0
         * @public
         */
        changeDirection(isVertical?: boolean): void;
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
         * 滚到指定的坐标位置
         * @method
         * @param dis 坐标位置
         * @param time 滚动需要的时间
         * @since 1.0.2
         * @public
         */
        scrollTo(dis: number, time?: number): void;
    }
}
/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 有时我们需要从外部获取一张个人头像，将它变成方形或者圆形展示出来。
     * 又希望他能按照我们的尺寸展示，这个时候你就需要用到FacePhoto类啦。
     * @class annieUI.FacePhoto
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
    */
    class FacePhoto extends Sprite {
        constructor();
        private photo;
        private bitmap;
        private maskType;
        private radio;
        private maskObj;
        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param src 头像的地址
         * @param radio 指定头像的长宽或者直径
         * @param maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形 1方形
         */
        init(src: string, radio?: number, maskType?: number): void;
    }
}
/**
 * Created by saron on 16/10/19.
 */
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
         * 页面个数
         * @property listLen
         * @type {number}
         * @private
         * @default 0
         */
        private listLen;
        /**
         * 页面滑动容器
         * @property view
         * @type {annie.Sprite}
         * @private
         */
        private view;
        /**
         * 滑动完成回调函数
         * @method callback
         * @type {function}
         * @private
         */
        private callback;
        /**
         * @method onMoveStart
         * @type {function}
         * @private
         */
        private onMoveStart;
        /**
         * 滑动方向
         * @property isVertical
         * @type {boolean}
         * @private
         */
        private isVertical;
        /**
         * 容器活动速度
         * @property slideSpeed
         * @type {number}
         * @private
         * @default 0
         */
        private slideSpeed;
        /**
         * 触摸点开始点X
         * @property touchStartX
         * @type {number}
         * @private
         */
        private touchStartX;
        /**
         * 触摸点开始点Y
         * @property touchStartY
         * @type {number}
         * @private
         */
        private touchStartY;
        /**
         * 触摸点结束点X
         * @property touchEndX
         * @type {number}
         * @private
         */
        private touchEndX;
        private movingX;
        private movingY;
        /**
         * 触摸点结束点Y
         * @property touchEndY
         * @type {number}
         * @private
         * @since
         * @public
         * @default 0
         */
        private touchEndY;
        /**
         * 当前页面索引ID
         * @property currentPageIndex
         * @type {number}
         * @public
         * @since 1.0.3
         * @default 0
         */
        currentPageIndex: number;
        /**
         * 页面是否移动
         * @property currentPageIndex
         * @type {boolean}
         * @public
         * @default false
         * @public
         */
        isMoving: boolean;
        /**
         * 舞台宽
         * @property stageW
         * @type {number}
         * @private
         */
        private stageW;
        /**
         * 舞台高
         * @property stageH
         * @type {number}
         * @private
         */
        private stageH;
        /**
         * 页面列表
         * @property pageList
         * @type {Array}
         * @private
         */
        private pageList;
        /**
         * 两点距离
         * @property distance
         * @type {number}
         * @private
         */
        private distance;
        /**
         *
         * @property fSpeed
         * @type {number}
         * @private
         */
        private fSpeed;
        /**
         * 是否点击了鼠标
         * @property fSpeed
         * @type {boolean}
         * @private
         */
        private isMouseDown;
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
        /**
         * @property slideDirection
         * @type {string}
         * @since 1.0.3
         * @public
         * @default "next"
         */
        slideDirection: string;
        /**
         * 是否为数组
         * @param obj
         * @returns {boolean}
         * @private
         */
        private isArray;
        /**
         * 是否为函数
         * @param fn
         * @returns {boolean}
         * @private
         */
        private isFunction(fn);
        /**
         * 构造函数
         * @method SlidePage
         * @public
         * @since 1.0.2
         * @param option      配置对象{pageList:pageList,callback:Fun,isVertical:true}
         * @param{array}pageList     页面数组
         * @param{method}callback    回调函数
         * @param{boolean}isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @param{number}slideSpeed  页面滑动速度
         * @example
         *      var slideBox = new annieUI.SlidePage({
         *      pageList: [new Page1(), new Page2(), new Page3(), new Page4()],//页面数组集
         *      isVertical: true,//默认值为true,ture为纵向,falas为横向
         *      slideSpeed: .32,//默认值为.4，滑动速度
         *      callback:callback//滑动完成回调函数
         *       });
         */
        constructor(option: any);
        /**
         * 添加到舞台
         * @param e
         */
        private onAddToStage(e);
        /**
         * 触摸事件
         * @param e
         */
        private onMouseEventHandler(e);
        /**
         * 滑动到指定页
         * @method slideToIndex
         * @public
         * @since 1.0.3
         * @param index 页面索引
         */
        slideToIndex(index: any): void;
        /**
         * 用于插入分页
         * @method addPageList
         * @param list 页面数组对象
         * @since 1.0.3
         * @public
         */
        addPageList(list: any): void;
        /**
         * 平面中两点距离公式
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         * @returns {number}
         */
        private getDistance(x1, y1, x2, y2);
    }
}
/**
 * @module annieUI
 */
declare namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 电子杂志组件类
     * @class annieUI.FlipBook
     * @public
     * @extends annie.Sprite
     * @since 1.0.3
     */
    class FlipBook extends Sprite {
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
        constructor();
        /**
         * 初始化电子杂志
         * @method init
         * @param width 单页宽
         * @param height 单页高
         * @param pageCount 总页数，一般为偶数
         * @param getPageCallBack，通过此回调获取指定页的内容的显示对象
         * @since 1.0.3
         */
        init(width: number, height: number, pageCount: any, getPageCallBack: Function): void;
        private drawPage(num, movePoint);
        private checkLimit(point, limitPoint, limitGap);
        private getPage(index);
        private getBookArr(point, actionPoint1, actionPoint2);
        private getLayerArr(point1, point2, actionPoint1, actionPoint2, limitPoint1, limitPoint2);
        private getShape(shape, pointArr);
        private setShadowMask(shape, maskShape, g_width, g_height);
        private getShadow(shape, maskShape, point1, point2, maskArray, arg);
        private setPage(pageNum);
        private onMouseDown(e);
        private onMouseUp(e);
        private onMouseMove(e);
        private checkArea(point);
        /**
         * 跳到指定的页数
         * @method flipTo
         * @param index
         * @since 1.0.3
         */
        flipTo(index: number): void;
        private flushPage();
        private onEnterFrame(e);
        private arc(argR, argN1, argN2);
        private angle(target1, target2);
        private pos(target1, target2);
    }
}
