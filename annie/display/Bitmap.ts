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
    export class Bitmap extends DisplayObject{
        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {string} bitmapData 一个图片对象或者图片地址或者canvas对象
        */
        public constructor(bitmapData:any) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            if(typeof(bitmapData)=="string") {
                s._texture = wx.createImage();
                s._texture.onload = function () {
                    s._bounds.width = s._texture.width;
                    s._bounds.height = s._texture.height;
                };
                s._texture.src = bitmapData;
            }else{
                s._texture=bitmapData;
                s._bounds.width = s._texture.width;
                s._bounds.height = s._texture.height;
            }
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s._texture="";
            super.destroy();
        }
        public update(isDrawUpdate: boolean = true){
            let s=this;
            if (!s._visible) return;
            super.update(isDrawUpdate);
            let UI=s._UI;
            UI.UM = UI.UA = UI.UF=false;
        }
    }
}