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
        protected _bitmapData: any = null;
        private _cacheImg: any = null;
        private rectX: number = 0;
        private rectY: number = 0;
        /**
         * 设置显示元素的显示区间
         * @property rect
         * @param {annie.Rectangle} value
         */
        public set rect(value: Rectangle) {
            let s = this;
            if (value instanceof annie.Rectangle) {
                s._bounds.width = value.width;
                s._bounds.height = value.height;
                s.rectX = value.x;
                s.rectY = value.y;
                s._rect = new annie.Rectangle(value.x, value.y, value.width, value.height);
            } else {
                s.rectX = 0;
                s.rectY = 0;
                s._bounds.width = s._bitmapData.width;
                s._bounds.height = s._bitmapData.height;
                s._rect = new annie.Rectangle(0, 0, s._bounds.width, s._bounds.height);
            }
            s.a2x_uf = true;
        }
        public get rect(): annie.Rectangle {
            return this._rect;
        }
        public _rect: annie.Rectangle = null;

        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {Image|Video|other} bitmapData 一个HTMl Image的实例,小程序或者小游戏里则只能是一个图片的地址
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
        public constructor(bitmapData: any, rect: Rectangle = null) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            s._bitmapData = bitmapData;
            s.rect = rect;
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
        };

        public set bitmapData(value: any) {
            let s = this;
            s._bitmapData = value;
            s._bounds.width = value.width;
            s._bounds.height = value.height;
            s.rectX = 0;
            s.rectY = 0;
            s._rect = new annie.Rectangle(0, 0, value.width, value.height);
            s.a2x_uf = true;
        }

        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 是否对图片对象使用像素碰撞检测透明度，默认关闭
         * @property hitTestWidthPixel
         * @type {boolean}
         * @default false
         * @since 1.1.0
         */
        public hitTestWidthPixel: boolean = false;

        public updateMatrix(): void {
            let s: any = this;
            super.updateMatrix();
            //滤镜,这里一定是UF
            if (s.a2x_uf) {
                let bitmapData: any = s._bitmapData;
                let bw = s._bounds.width, bh = s._bounds.height;
                let cf: any = s.cFilters;
                let cfLen = cf.length;
                if (cfLen > 0) {
                    let newW = bw + 20, newH = bh + 20;
                    if (!(s._cacheImg instanceof Object)) {
                        s._cacheImg = window.document.createElement("canvas");
                        s._cacheImg.width = newW;
                        s._cacheImg.height = newH;
                    }
                    let _canvas = s._cacheImg;
                    let ctx = _canvas.getContext("2d");
                    ctx.clearRect(0, 0, newW, newH);
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "#0";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ////////////////////
                    ctx.drawImage(s._bitmapData, 0, 0, bw, bh, 10, 10, bw, bh);
                    /////////////////////
                    if (cfLen > 0) {
                        let imageData = ctx.getImageData(0, 0, newW, newH);
                        for (let i = 0; i < cfLen; i++) {
                            cf[i].drawFilter(imageData);
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }
                    s._texture = s._cacheImg;
                    s.offsetY = -10;
                    s.offsetX = -10;
                    s.rect.x = 0;
                    s.rect.y = 0;
                    s.rect.width = newW;
                    s.rect.height = newH;
                } else {
                    s._texture = bitmapData;
                    s.offsetY = 0;
                    s.offsetX = 0;
                    s.rect.x = s.rectX;
                    s.rect.y = s.rectY;
                    s.rect.width = bw;
                    s.rect.height = bh;
                }
                //因为这里offset有可能再次改变，需要再次更新下matrix
                s._matrix.createBox(s._lastX, s._lastY, s._scaleX, s._scaleY, s._rotation, s._skewX, s._skewY, s._anchorX - s._offsetX, s._anchorY - s._offsetY);
                s.cMatrix.setFrom(s._matrix);
                s.cMatrix.prepend(s.parent.cMatrix);
            }
            s.a2x_uf = false;
            s.a2x_um = false;
            s.a2x_ua = false;
        }

        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 从SpriteSheet的大图中剥离出单独的小图以供特殊用途
         * @method convertToImage
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Bitmap} bitmap
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
        public static convertToImage(bitmap: annie.Bitmap, isNeedImage: boolean = true): any {
            let _canvas: any;
            if (isNeedImage) {
                _canvas = annie.DisplayObject._canvas;
            } else {
                _canvas = window.document.createElement("canvas");
            }
            let w: number = bitmap._bounds.width,
                h: number = bitmap._bounds.height,
                ctx = _canvas.getContext("2d");
            _canvas.width = w;
            _canvas.height = h;
            ctx.drawImage(bitmap.bitmapData, bitmap._offsetX, bitmap._offsetY, w, h, 0, 0, w, h);
            if (isNeedImage) {
                let img = new Image();
                img.src = _canvas.toDataURL();
                return img;
            } else {
                return _canvas;
            }
        }

        public hitTestPoint(hitPoint: Point, isGlobalPoint: boolean = false): DisplayObject {
            let s = this;
            if (s.hitTestWidthPixel) {
                let texture = s._texture;
                if (texture.width == 0) {
                    return null;
                }
                let p: any;
                if (isGlobalPoint) {
                    p = s.globalToLocal(hitPoint);
                } else {
                    p = hitPoint;
                }
                let _canvas = DisplayObject._canvas, ctx = _canvas.getContext('2d');
                _canvas.width = 1;
                _canvas.height = 1;
                ctx.clearRect(0, 0, 1, 1);
                ctx.setTransform(1, 0, 0, 1, -p.x, -p.y);
                ctx.drawImage(texture, 0, 0);
                if (ctx.getImageData(0, 0, 1, 1).data[3] > 0) {
                    return s;
                } else {
                    return null;
                }
            } else {
                return super.hitTestPoint(hitPoint, isGlobalPoint);
            }
        }
        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            super.destroy();
            s._bitmapData = null;
            s._cacheImg = null;
        }
    }
}