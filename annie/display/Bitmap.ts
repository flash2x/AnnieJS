/**
 * @module annie
 */
namespace annie {
    /**
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象的引用的 Bitmap 对象。
     * 创建了 Bitmap 对象后，使用父 Sprite 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
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
        public constructor(bitmapData: any) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            s.bitmapData = bitmapData;
        }

        // 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
        public _texture: any = null;

        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * HTML的一个Image对象或者是canvas对象或者是video对象
         * @property bitmapData
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public get bitmapData(): any {
            return this._texture;
        }

        public set bitmapData(value: any) {
            let s = this;
            if(typeof(value)=="string"){
                let img=annie.CanvasRender.rootContainer.createImage();
                img.src=value;
                s._texture=img;
                s.clearBounds();
            }else {
                if (value != s._texture) {
                    s.clearBounds();
                    s._texture = value;
                }
            }
        }

        protected _updateMatrix(): void {
            super._updateMatrix();
            let s = this;
            let texture: any = s._texture;
            if (!texture || texture.width == 0 || texture.height == 0) {
                return;
            }
            let bw = texture.width;
            let bh = texture.height;
            if (s._bounds.width != bw || s._bounds.height != bh) {
                s._bounds.width = bw;
                s._bounds.height = bh;
                s.a2x_um = true;
            }
            if (s.a2x_um) {
                s._checkDrawBounds();
            }
            s.a2x_um = false;
            s.a2x_ua = false;
        }
        public _draw(ctx: any): void {
            let s = this;
            ctx.drawImage(s._texture, 0, 0);
        }
    }
}