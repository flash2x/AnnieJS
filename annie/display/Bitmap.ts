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
        public constructor(bitmapData: any,rect:any=null) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            if(rect!=void 0){
                let drawRect:any=s._a2x_drawRect;
                drawRect.isSheetSprite=true;
                drawRect.x=rect.x;
                drawRect.y=rect.x;
                drawRect.w=rect.width;
                drawRect.h=rect.height;
            }
            s.bitmapData = bitmapData;

        }
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
            return this._bitmapData;
        }

        public set bitmapData(value: any) {
            let s = this;
            if (value != s._bitmapData) {
                s.clearBounds();
                s._bitmapData = value;
                s._texture = value;
            }
        }
        private _cacheCanvas: any = null;
        protected _bitmapData: any = null;
        protected _updateMatrix(isOffCanvas: boolean = false): void {
            super._updateMatrix(isOffCanvas);
            let s: any = this;
            let texture: any = s._bitmapData;
            if (!texture || texture.width == 0 || texture.height == 0) {
                s._texture = null;
                return;
            }
            let drawRect:any=s._a2x_drawRect;
            let bw = texture.width;
            let bh =texture.height;
            if(drawRect.isSheetSprite){
                bw=drawRect.w;
                bh=drawRect.h;
            }
            if (s._bounds.width != bw || s._bounds.height != bh) {
                s._bounds.width = bw;
                s._bounds.height = bh;
                if (bw > 0) {
                    s.boundsRow = Math.ceil(bw / 1000);
                }
                if (bh > 0) {
                    s.boundsCol = Math.ceil(bh / 1000);
                }
                s._updateSplitBounds();
                s._checkDrawBounds();
                if (s._filters.length > 0) {
                    s.a2x_uf = true;
                }
                s._texture = texture;
            } else if (s.a2x_um) {
                s._checkDrawBounds();
            }
            if (!isOffCanvas) {
                s.a2x_um = false;
                s.a2x_ua = false;
            }
            if (s.a2x_uf) {
                s.a2x_uf = false;
                if(!s._cacheCanvas){
                    s._cacheCanvas=document.createElement("canvas");
                }
                let canvas = s._cacheCanvas;
                canvas.width=bw;
                canvas.heigth=bh;
                canvas.style.width = Math.ceil(bw / devicePixelRatio) + "px";
                canvas.style.height = Math.ceil(bh / devicePixelRatio) + "px";
                let ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, bw, bh);
                ////////////////////
                ctx.drawImage(texture, 0, 0);
                /////////////////////
                let cf: any = s._filters;
                let cfLen = cf.length;
                if (cfLen > 0) {
                    let imageData = ctx.getImageData(0, 0, bw, bh);
                    for (let i = 0; i < cfLen; i++) {
                        cf[i].drawFilter(imageData);
                    }
                    if(drawRect.isSheetSprite){
                        ctx.putImageData(imageData, drawRect.x,drawRect.y,bw,bh,0, 0,bw,bh);
                    }else{
                        ctx.putImageData(imageData, 0, 0);
                    }
                    s._texture = canvas;
                }else{
                    s._texture = texture;
                }
            }
        }

        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 从Bitmap中剥离出单独的小图以供特殊用途
         * @method convertToImage
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Bitmap} bitmap
         * @param {annie.Rectangle} rect 截图范围
         * @param {boolean} isNeedImage 是否一定要返回img，如果不为true则有时返回的是canvas
         * @return {Canvas|BitmapData}
         * @example
         *      var spriteSheetImg = new Image(),
         *      rect = new annie.Rectangle(0, 0, 200, 200),
         *      yourBitmap = new annie.Bitmap(spriteSheetImg, rect);
         *      spriteSheetImg.onload=function(e){
         *          var singleSmallImg = annie.Bitmap.convertToImage(yourBitmap);//convertToImage是annie.Bitmap的一个静态方法
         *          console.log(singleSmallImg);
         *      }
         *      spriteSheetImg.src = 'http://test.annie2x.com/test.jpg';
         */
        public static convertToImage(bitmap: annie.Bitmap, rect: Rectangle, isNeedImage: boolean = true): any {
            let _canvas: any;
            if (isNeedImage) {
                _canvas = annie.DisplayObject._canvas;
            } else {
                _canvas = window.document.createElement("canvas");
            }
            let w: number = rect.width,
                h: number = rect.height,
                ctx = _canvas.getContext("2d");
            _canvas.width = w;
            _canvas.height = h;
            ctx.drawImage(bitmap.bitmapData, rect.x, rect.y, w, h, 0, 0, w, h);
            if (isNeedImage) {
                let img = new Image();
                img.src = _canvas.toDataURL();
                return img;
            } else {
                return _canvas;
            }
        }
        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            super.destroy();
            s._bitmapData = null;
            s._cacheCanvas = null;
        }
    }
}