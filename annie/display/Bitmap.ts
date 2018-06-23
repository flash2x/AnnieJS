/// <reference path="DisplayObject.ts" />
/**
 * @module annie
 */
namespace annie {
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
    export class Bitmap extends DisplayObject {
        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {string} imagePath 一个图片地址
        */
        public constructor(imagePath: string) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            s._texture = imagePath;
            annie.getImageInfo({
                src: imagePath,
                success: function (res:any) {
                    s._bounds.width=res.width;
                    s._bounds.height=res.height;
                }
            })
        }
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        public hitTestPoint(globalPoint: Point, isMouseEvent: boolean = false): DisplayObject {
            let s = this;
            if (isMouseEvent && !s.mouseEnable)return null;
            let p = s.globalToLocal(globalPoint);
            if (s.getBounds().isPointIn(p)) {
                return s;
            }
            return null;
        }
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s._texture="";
            super.destroy();
        }
    }
}