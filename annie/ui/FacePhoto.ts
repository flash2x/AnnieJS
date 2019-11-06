/**
 * @module annieUI
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    import Bitmap = annie.Bitmap;
    import Shape = annie.Shape;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 有时我们需要从外部获取一张个人头像，将它变成方形或者圆形展示出来。
     * 又希望他能按照我们的尺寸展示，这个时候你就需要用到FacePhoto类啦。
     * @class annieUI.FacePhoto
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class FacePhoto extends Sprite {
        //events
        /**
         * 图片加载完成事件
         * @event COMPLETE
         * @since 1.0.0
         */
        /**
         * 构造函数
         * @method  FacePhoto
         * @since 1.0.0
         * @public
         * @example
         *      var circleface = new annieUI.FacePhoto(),
         *          rectFace=new annieUI.FacePhoto();
         *          //圆形头像
         *          circleface.init('http://test.annie2x.com/biglong/logo.jpg', 100,100, 0);
         *          circleface.x = 260;
         *          circleface.y = 100;
         *          s.addChild(circleface);
         *          //方形头像
         *          rectFace.init('http://test.annie2x.com/biglong/logo.jpg', 200,200, 1);
         *          rectFace.x = 260;
         *          rectFace.y = 400;
         *          s.addChild(rectFace);
         */
        constructor() {
            super();
            let s = this;
            s._instanceType = "annieUI.FacePhoto";
            s.photo = new Image();
            s.maskObj = new annie.Shape();
            s.photo.onload = function (e: any) {
                s.bitmap = new annie.Bitmap(s.photo);
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                let scale = s.radio / (s.photo.width < s.photo.height ? s.photo.width : s.photo.height);
                s.bitmap.scaleX = s.bitmap.scaleY = scale;
                s.bitmap.x = (s.radioW - s.photo.width * scale) >> 1;
                s.bitmap.y = (s.radioH - s.photo.height * scale) >> 1;
                if (s.maskType == 0){
                    s.maskObj.drawEllipse(0, 0,s.radioW, s.radioH);
                } else {
                    s.maskObj.drawRect(0, 0, s.radioW, s.radioH);
                }
                s.maskObj.endFill();
                s.addChild(s.bitmap);
                s.addChild(s.maskObj);
                s.bitmap.mask = s.maskObj;
                s.dispatchEvent("onComplete");
            };

        }
        private photo: any;
        private bitmap: Bitmap;
        private maskType: number = 0;
        private radioW: number;
        private radioH: number;
        private radio: number;
        private maskObj: Shape;

        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param {string} src 头像的地址
         * @param {number} w 指定头像的宽
         * @param {number} h 指定头像的高
         * @param {number} maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形或椭圆形 1 正方形或者长方形 默认是圆形
         */
        public init(src: string, w: number,h:number, maskType: number = 0): void {
            let s = this;
            s._bounds.width=w;
            s._bounds.height=h;
            s.radioW = w;
            s.radioH = h;
            if(w>h){
                s.radio=w;
            }else{
                s.radio=h;
            }
            s.photo.corssOrigin="anonymous";
            if (s.photo.src != src)
                s.photo.src = src;
            if (s.maskType != maskType)
                s.maskType = maskType;
        }
        public destroy(): void {
            let s=this;
           s.bitmap=null;
           s.photo=null;
           s.maskObj=null;
            super.destroy();
        }
    }
}