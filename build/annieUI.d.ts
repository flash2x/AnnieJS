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
         * 被始化头像
         * @method init
         * @param src 头像的地址
         * @param radio 指定头像的长宽
         * @param maskType 遮罩类型，是圆形遮罩还是方形遮罩
         */
        init(src: string, radio?: number, maskType?: number): void;
    }
}
