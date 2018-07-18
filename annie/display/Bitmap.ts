/**
 * @module annie
 */
namespace annie {
    /**
     * Bitmap 对象
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
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s._texture="";
            super.destroy();
        }
    }
}