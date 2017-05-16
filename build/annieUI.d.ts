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
         * @protected
         * @default 0
         * @since 1.0.0
         */
        protected distance: number;
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
         * @protected
         * @since 1.0.0
         * @type {number}
         */
        protected speed: number;
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
        protected paramXY: string;
        private stopTimes;
        private isMouseDown;
        /**
         * 是否是通过scrollTo方法在滑动中
         * @property autoScroll
         * @since 1.0.2
         * @type {boolean}
         * @private
         * @default false
         */
        private autoScroll;
        /**
         * 构造函数
         * @method  ScrollPage
         * @param {number} vW 可视区域宽
         * @param {number} vH 可视区域高
         * @param {number} maxDistance 最大滚动的长度
         * @param {boolean} isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @example
         *      s.sPage=new annieUI.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
         */
        constructor(vW: number, vH: number, maxDistance: number, isVertical?: boolean);
        /**
         * 改可滚动的方向，比如之前是纵向滚动的,你可以横向的。或者反过来
         * @method changeDirection
         * @param {boolean}isVertical 是纵向还是横向,默认为纵向
         * @since 1.0.0
         * @public
         */
        changeDirection(isVertical?: boolean): void;
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.1.1
         */
        setViewRect(w: number, h: number): void;
        private onMouseEvent(e);
        /**
         * 滚到指定的坐标位置
         * @method
         * @param {number} dis 坐标位置
         * @param {number} time 滚动需要的时间 默认为0 即没有动画效果直接跳到指定页
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
        /**
         * 构造函数
         * @method  FacePhoto
         * @since 1.0.0
         * @public
         * @example
         *      var circleface = new annieUI.FacePhoto(),
         *          rectFace=new annieUI.FacePhoto();
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
        private radio;
        private maskObj;
        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param {string} src 头像的地址
         * @param {number} radio 指定头像的长宽或者直径
         * @param {number} maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形 1方形 默认是0
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
         * @since 1.1.0
         * @public
         */
        view: Sprite;
        maskObj: annie.Shape;
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
         * @public
         * @default 0
         */
        slideSpeed: number;
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
         * @property 滚动距离
         * @type {number}
         * @protected
         * @default 0
         * @since 1.0.0
         */
        protected distance: number;
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
         * 当前页面索引ID 默认从0开始
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
         * 页面宽
         * @property viewWidth
         * @type {number}
         * @private
         */
        viewWidth: number;
        /**
         * 页面高
         * @property viewHeight
         * @type {number}
         * @private
         */
        viewHeight: number;
        /**
         * 页面列表
         * @property pageList
         * @type {Array}
         * @private
         */
        private pageList;
        private pageClassList;
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
        paramXY: string;
        /**
         * 构造函数
         * @method SlidePage
         * @param {number} vW 宽
         * @param {number} vH 高
         * @param {boolean} isVertical 是横向还是纵向 默认纵向
         */
        constructor(vW: number, vH: number, isVertical?: boolean);
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setMask
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.0.0
         */
        private setMask(w, h);
        /**
         * 触摸事件
         * @param e
         */
        private onMouseEvent(e);
        /**
         * 滑动到指定页
         * @method slideTo
         * @public
         * @since 1.0.3
         * @param {number} index 页面索引
         */
        slideTo(isNext: boolean): void;
        /**
         * 用于插入分页
         * @method addPageList
         * @param {Array} classList  每个页面的类，注意是类，不是对象
         * @since 1.0.3
         * @public
         */
        addPageList(classList: any): void;
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
         * @param {number} width 单页宽
         * @param {number} height 单页高
         * @param {number} pageCount 总页数，一般为偶数
         * @param {Function} getPageCallBack，通过此回调获取指定页的内容的显示对象
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
         * @param {number} index 跳到指定的页数
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
/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
declare namespace annieUI {
    import DisplayObject = annie.DisplayObject;
    interface IScrollListItem extends DisplayObject {
        initData(id: number, data: Array<any>): void;
        id: number;
        data: number;
    }
    /**
     * 有些时候需要大量的有规则的滚动内容。这个时候就应该用到这个类了
     * @class annieUI.ScrollList
     * @public
     * @extends annie.ScrollPage
     * @since 1.0.9
     */
    class ScrollList extends ScrollPage {
        private _items;
        private _itemDis;
        private _itemCount;
        private _itemClass;
        private _isInit;
        private _data;
        private gp;
        private lp;
        private downL;
        /**
         * 获取下拉滚动的loadingView对象
         * @property loadingView
         * @since 1.0.9
         * @returns {DisplayObject}
         */
        loadingView: DisplayObject;
        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemDis 各个Item的间隔
         * @param {number} vW 列表的宽
         * @param {number} vH 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @since 1.0.9
         */
        constructor(itemClassName: any, itemDis: number, vW: number, vH: number, isVertical?: boolean);
        /**
         * 更新列表数据
         * @method updateData
         * @param {Array} data
         * @param {boolean} isReset 是否重围数据列表。
         * @since 1.0.9
         */
        updateData(data: Array<any>, isReset?: boolean): void;
        private flushData();
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.1.1
         */
        setViewRect(w: number, h: number): void;
        private _updateViewRect();
        /**
         * 设置加载数据时显示的loading对象
         * @since 1.0.9
         * @method setLoading
         * @param {annie.DisplayObject} downLoading
         */
        setLoading(downLoading: DisplayObject): void;
    }
}
