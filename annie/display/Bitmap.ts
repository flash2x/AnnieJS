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
        public get bitmapData(): any {
            return this._bitmapData
        };

        public set bitmapData(value: any) {
            this._bitmapData = value;
            this._isNeedUpdate = true;
        }

        private _bitmapData: any = null;
        /**
         * 有时候一张大图，我们只需要显示它的某一部分，其它不显示。对！你可能猜到了
         * SpriteSheet就用到了这个属性。默认值为null表示全尺寸显示bitmapData需要显示的范围
         * @property rect
         * @public
         * @since 1.0.0
         * @type {annie.Rectangle}
         * @default null
         */
        public rect: Rectangle = null;
        /**
         * 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
         * @property _cacheImg
         * @private
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        private _cacheImg: any = null;
        private _realCacheImg: any = null;
        private _isNeedUpdate: boolean = true;
        /**
         * @property _cacheX
         * @private
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        private _cacheX: number = 0;
        /**
         * @property _cacheY
         * @private
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        private _cacheY: number = 0;
        /**
         * @property _isCache
         * @private
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        private _isCache: boolean = false;

        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {Image|Video|other} bitmapData 一个HTMl Image的实例
         * @param {annie.Rectangle} rect 设置显示Image的区域,不设置些值则全部显示Image的内容
         * @example
         *      var imgEle=new Image();
         *      imgEle.onload=function (e) {
         *          var bitmap = new annie.Bitmap(imgEle)
         *          //居中对齐
         *          bitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *          bitmap.y = (s.stage.desHeight - bitmap.height) / 2;
         *          s.addChild(bitmap);
         *
         *          //截取图片的某一部分显示
         *          var rect = new annie.Rectangle(0, 0, 200, 200),
         *          rectBitmap = new annie.Bitmap(imgEle, rect);
         *          rectBitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *          rectBitmap.y = 100;
         *          s.addChild(rectBitmap);
         *      }
         *      imgEle.src='http://test.annie2x.com/biglong/logo.jpg';
         *
         * <p><a href="http://test.annie2x.com/biglong/apiDemo/annieBitmap/index.html" target="_blank">测试链接</a></p>
         */
        public constructor(bitmapData: any = null, rect: Rectangle = null) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
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
        public render(renderObj: IRender): void {
            let s = this;
            if (s.visible && s.cAlpha > 0) {
                if (s._cacheImg) {
                    renderObj.draw(s, 0);
                }
            }
            //super.render();
        }

        /**
         * 重写刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        public update(um: boolean, ua: boolean, uf: boolean): void {
            let s = this;
            if (s.visible) {
                super.update(um, ua, uf);
                //滤镜
                if (s._isNeedUpdate || uf || s._updateInfo.UF) {
                    s._isNeedUpdate = false;
                    if (s.cFilters.length > 0) {
                        if (!s._realCacheImg) {
                            s._realCacheImg = window.document.createElement("canvas");
                        }
                        let _canvas = s._realCacheImg;
                        let tr = s.rect;
                        let w = tr ? tr.width : s.bitmapData.width;
                        let h = tr ? tr.height : s.bitmapData.height;
                        let newW = w + 20;
                        let newH = h + 20;
                        _canvas.width = newW;
                        _canvas.height = newH;
                        _canvas.style.width = newW / devicePixelRatio + "px";
                        _canvas.style.height = newH / devicePixelRatio + "px";
                        let ctx = _canvas.getContext("2d");
                        ctx.clearRect(0, 0, newW, newH);
                        ctx.translate(10, 10);
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "#0";
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        /////////////////////
                        let cf = s.cFilters;
                        let cfLen = cf.length;
                        for (let i = 0; i < cfLen; i++) {
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
                            ctx.drawImage(s._bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                        } else {
                            ctx.drawImage(s._bitmapData, 0, 0);
                        }
                        let len = s["cFilters"].length;
                        let imageData = ctx.getImageData(0, 0, newW, newH);
                        for (let i = 0; i < len; i++) {
                            let f: any = s["cFilters"][i];
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
                        s._cacheImg = s._bitmapData;
                    }
                    //给webgl更新新
                    //WGRender.setDisplayInfo(s, 0);
                }
                s._updateInfo.UF = false;
                s._updateInfo.UM = false;
                s._updateInfo.UA = false;
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
        public getBounds(): Rectangle {
            let s = this;
            let r = new Rectangle();
            if (s.rect) {
                r.width = s.rect.width;
                r.height = s.rect.height;
            } else {
                r.width = s.bitmapData ? s.bitmapData.width : 0;
                r.height = s.bitmapData ? s.bitmapData.height : 0;
            }
            return r;
        }

        /**
         * 从SpriteSheet的大图中剥离出单独的小图以供特殊用途
         * @method convertToImage
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Bitmap} bitmap
         * @return {Image}
         * @example
         *      var spriteSheetImg = new Image(),
         *          rect = new annie.Rectangle(0, 0, 200, 200),
         *          yourBitmap = new annie.Bitmap(spriteSheetImg, rect);
         *       spriteSheetImg.onload=function(e){
         *          var singleSmallImg = annie.Bitmap.convertToImage(yourBitmap);//convertToImage是annie.Bitmap的一个静态方法
         *          trace(singleSmallImg);
         *       }
         *       spriteSheetImg.src = 'http://test.annie2x.com/biglong/apiDemo/annieBitmap/resource/sheet.jpg';
         */
        public static convertToImage(bitmap: annie.Bitmap): any {
            if (!bitmap.rect) {
                return bitmap.bitmapData;
            } else {
                let _canvas = annie.DisplayObject._canvas;
                let w: number = bitmap.rect.width;
                let h: number = bitmap.rect.height;
                _canvas.width = w;
                _canvas.height = h;
                let ctx = _canvas.getContext("2d");
                let tr = bitmap.rect;
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(bitmap.bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                let _realCacheImg = window.document.createElement("img");
                _realCacheImg.src = _canvas.toDataURL("image/png");
                return _realCacheImg;
            }
        }
    }
}