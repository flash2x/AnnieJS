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

        private _bitmapData: any = null;
        private _realCacheImg: any = null;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 有时候一张贴图图，我们只需要显示他的部分。其他不显示,对你可能猜到了
         * SpriteSheet就用到了这个属性。默认为null表示全尺寸显示bitmapData需要显示的范围
         * @property rect
         * @public
         * @since 1.0.0
         * @type {annie.Rectangle}
         * @default null
         */
        get rect(): annie.Rectangle {
            return this._rect;
        }

        set rect(value: annie.Rectangle) {
            let s:any=this;
            s._rect = value;
            s._UI.UD=true;
        }
        private _rect: Rectangle = null;
        private _isCache: boolean = false;
        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {Image|Video|other} bitmapData 一个HTMl Image的实例,小程序或者小游戏里则只能是一个图片的地址
         * @param {annie.Rectangle} rect 设置显示Image的区域,不设置些值则全部显示Image的内容，小程序或者小游戏里没有这个参数
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
        public constructor(bitmapData: any = null, rect: Rectangle = null){
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            s._rect = rect;
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
        };

        public set bitmapData(value: any) {
            let s = this;
            s._setProperty("_bitmapData", value, 3);
            if (!value) {
                s._bounds.width = s._bounds.height = 0;
            } else {
                s._bounds.width = s._rect ? s._rect.width : value.width;
                s._bounds.height = s._rect ? s._rect.height : value.height;
            }
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
        public update(isDrawUpdate: boolean = false): void {
            let s = this;
            if (!s._visible) return;
            super.update(isDrawUpdate);
            //滤镜
            let bitmapData = s._bitmapData;
            if ((s._UI.UD || s._UI.UF) && bitmapData) {
                if (bitmapData.width == 0 || bitmapData.height == 0) return;
                s._UI.UD = false;
                if (s.cFilters.length > 0) {
                    if (!s._realCacheImg) {
                        s._realCacheImg = window.document.createElement("canvas");
                    }
                    let _canvas = s._realCacheImg;
                    let tr = s._rect;
                    let w = tr ? tr.width : bitmapData.width;
                    let h = tr ? tr.height : bitmapData.height;
                    let newW = w + 20;
                    let newH = h + 20;
                    _canvas.width = newW;
                    _canvas.height = newH;
                    let ctx = _canvas.getContext("2d");
                    ctx.clearRect(0, 0, newW, newH);
                    ctx.translate(10, 10);
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "#0";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ////////////////////
                    if (tr) {
                        ctx.drawImage(s._bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                    } else {
                        ctx.drawImage(s._bitmapData, 0, 0);
                    }
                    /////////////////////
                    let cf = s.cFilters;
                    let cfLen = cf.length;
                    if (cfLen > 0) {
                        let imageData = ctx.getImageData(0, 0, newW, newH);
                        for (let i = 0; i < cfLen; i++) {
                            cf[i].drawFilter(imageData);
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }
                    //s._realCacheImg.src = _canvas.toDataURL("image/png");
                    s._texture = s._realCacheImg;
                    s._offsetX = -10;
                    s._offsetY = -10;
                    s._isCache = true;
                } else {
                    s._isCache = false;
                    s._offsetX = 0;
                    s._offsetY = 0;
                    s._texture = bitmapData;
                }
                let bw: number;
                let bh: number;
                if (s._rect) {
                    bw = s._rect.width;
                    bh = s._rect.height;
                } else {
                    bw = s._texture.width + s._offsetX * 2;
                    bh = s._texture.height + s._offsetY * 2;
                }
                s._bounds.width = bw;
                s._bounds.height = bh;
                //给webgl更新新
                // s._texture.updateTexture = true;
            }
            s._UI.UF = false;
            s._UI.UM = false;
            s._UI.UA = false;
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
            if (!bitmap._rect) {
                return bitmap.bitmapData;
            } else {
                let _canvas = window.document.createElement("canvas");
                let w: number = bitmap._rect.width;
                let h: number = bitmap._rect.height;
                _canvas.width = w;
                _canvas.height = h;
                // _canvas.style.width = w / devicePixelRatio + "px";
                // _canvas.style.height = h / devicePixelRatio + "px";
                let ctx = _canvas.getContext("2d");
                let tr = bitmap._rect;
                ctx.drawImage(bitmap.bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                if (isNeedImage) {
                    var img = new Image();
                    img.src = _canvas.toDataURL();
                    return img;
                } else {
                    return _canvas;
                }
            }
        }
        public hitTestPoint(hitPoint: Point, isGlobalPoint: boolean = false,isMustMouseEnable:boolean=false): DisplayObject {
            let s = this;
            let obj = super.hitTestPoint(hitPoint, isGlobalPoint,isMustMouseEnable);
            if (obj) {
                if (s.hitTestWidthPixel) {
                    let p:any;
                    if(isGlobalPoint) {
                        p = s.globalToLocal(hitPoint);
                    }else{
                        p= hitPoint;
                    }
                    p.x += s._offsetX;
                    p.y += s._offsetY;
                    let image = s._texture;
                    if (!image || image.width == 0 || image.height == 0) {
                        return null;
                    }
                    let _canvas = DisplayObject["_canvas"];
                    _canvas.width = 1;
                    _canvas.height = 1;
                    let ctx = _canvas["getContext"]('2d');
                    ctx.clearRect(0, 0, 1, 1);
                    if (s._rect) {
                        p.x += s._rect.x;
                        p.y += s._rect.y;
                    }
                    ctx.setTransform(1, 0, 0, 1, -p.x, -p.y);
                    ctx.drawImage(image, 0, 0);
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 0) {
                        return s;
                    }
                } else {
                    return s;
                }
            }
            return null;
        }

        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            s._bitmapData = null;
            s._realCacheImg = null;
            s._rect = null;
            super.destroy();
        }
    }
}