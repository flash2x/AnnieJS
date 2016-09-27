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
         * HTML的一个Image对象或者是canvas对象或者是video对象
         * @property bitmapData
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public bitmapData:any = null;
        /**
         * 有时候一张大图，我们只需要显示他的部分。其他不显示,对你可能猜到了
         * SpriteSheet就用到了这个属性。默认为null表示全尺寸显示bitmapData需要显示的范围
         * @property rect
         * @public
         * @since 1.0.0
         * @type {annie.Rectangle}
         * @default null
         */
        public rect:Rectangle = null;
        /**
         * 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
         * @property _cacheImg
         * @private
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        private _cacheImg:any=null;
        private _realCacheImg:any=null;
        /**
         * @property _cacheX
         * @private
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        private _cacheX:number = 0;
        /**
         * @property _cacheY
         * @private
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        private _cacheY:number = 0;
        /**
         * @property _isCache
         * @private
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        private _isCache:boolean = false;

        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {Image|Video|other} bitmapData 一个HTMl Image的实例
         * @param {annie.Rectangle} rect 设置显示Image的区域,不设置些值则全部显示Image的内容
         */
        public constructor(bitmapData:any=null, rect:Rectangle = null) {
            super();
            var s = this;
            s.bitmapData = bitmapData;
            s.rect = rect;
        }
        /**
         * 重写渲染
         * @method render
         * @param {annie.IRender} renderObj
         * @public
         * @since 1.0.0
         */
        public render(renderObj:IRender):void {
            if(this._cacheImg) {
                renderObj.draw(this, 0);
            }
            //super.render();
        }

        /**
         * 重写刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        public update():void{
            var s = this;
            super.update();
            //滤镜
            if(s._isNeedUpdate){
                if (s["cFilters"] && s["cFilters"].length > 0) {
                    if(!s._realCacheImg){
                        s._realCacheImg=window.document.createElement("canvas");
                    }
                    var _canvas = s._realCacheImg;
                    var tr = s.rect;
                    var w = tr ? tr.width : s.bitmapData.width;
                    var h = tr ? tr.height : s.bitmapData.height;
                    var newW = w + 20;
                    var newH = h + 20;
                    _canvas.width = newW;
                    _canvas.height = newW;
                    var ctx = _canvas.getContext("2d");
                    ctx.clearRect(0, 0, newW, newH);
                    ctx.translate(10, 10);
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "#0";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    /////////////////////
                    var cf = s.cFilters;
                    var cfLen = cf.length;
                    for (var i = 0; i < cfLen; i++) {
                        if (s.cFilters[i].type == "Shadow") {
                            ctx.shadowBlur = cf[i].blur;
                            ctx.shadowColor = cf[i].color;
                            ctx.shadowOffsetX = cf[i].offsetX;
                            ctx.shadowOffsetY = cf[i].offsetY;
                            break;
                        }
                    }
                    ////////////////////
                    if (tr) {
                        ctx.drawImage(s.bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                    } else {
                        ctx.drawImage(s.bitmapData, 0, 0);
                    }
                    var len = s["cFilters"].length;
                    var imageData = ctx.getImageData(0, 0, newW, newH);
                    for (var i = 0; i < len; i++) {
                        var f:any = s["cFilters"][i];
                        f.drawFilter(imageData);
                    }
                    ctx.putImageData(imageData, 0, 0);
                    //s._realCacheImg.src = _canvas.toDataURL("image/png");
                    s._cacheImg = s._realCacheImg;
                    s._cacheX = -10;
                    s._cacheY = -10;
                    s._isCache = true;
                } else {
                    s._isCache = false;
                    s._cacheX = 0;
                    s._cacheY = 0;
                    s._cacheImg = s.bitmapData;
                }
                s._isNeedUpdate = false;
            }
        }
        /**
         * 重写getBounds
         * 获取Bitmap对象的Bounds
         * @method getBounds
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         */
        public getBounds():Rectangle {
            var s = this;
            var r = new Rectangle();
            if (s.rect) {
                r.width = s.rect.width;
                r.height = s.rect.height;
            } else {
                r.width = s.bitmapData?s.bitmapData.width:0;
                r.height = s.bitmapData?s.bitmapData.height:0;
            }
            return r;
        }

        /**
         * 从SpriteSheet的大图中剥离出单独的小图以供特殊用途
         * @method getSingleBitmap
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Bitmap} bitmap
         * @return {Image}
         */
        public static getBitmapData(bitmap:annie.Bitmap):any{
            if(!bitmap.rect){
                return bitmap.bitmapData;
            }else{
                var _canvas = annie.DisplayObject._canvas;
                var w:number=bitmap.rect.width;
                var h:number=bitmap.rect.height;
                _canvas.width=w;
                _canvas.height=h;
                var ctx = _canvas.getContext("2d");
                var tr=bitmap.rect;
                ctx.clearRect(0, 0, w,h);
                ctx.drawImage(bitmap.bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                var _realCacheImg=window.document.createElement("img");
                _realCacheImg.src = _canvas.toDataURL("image/png");
                return _realCacheImg;
            }
        }
    }
}