/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    import Bitmap = annie.Bitmap;
    import Shape = annie.Shape;
    /**
     * 有时我们需要从外部获取一张个人头像，将它变成方形或者圆形展示出来。
     * 又希望他能按照我们的尺寸展示，这个时候你就需要用到FacePhoto类啦。
     * @class annieUI.FacePhoto
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class FacePhoto extends Sprite {
        /**
         * 构造函数
         * @method  FacePhoto
         * @since 1.0.0
         * @public
         * @example
         *      var circleface = new annieUI.FacePhoto(),
         *          rectFace=new annieUI.FacePhoto();
         *          //圆形头像
         *          circleface.init('http://test.annie2x.com/biglong/logo.jpg', 100, 0);
         *          circleface.x = 260;
         *          circleface.y = 100;
         *          s.addChild(circleface);
         *          //方形头像
         *          rectFace.init('http://test.annie2x.com/biglong/logo.jpg', 200, 1);
         *          rectFace.x = 260;
         *          rectFace.y = 400;
         *          s.addChild(rectFace);
         */
        constructor() {
            super();
            let s = this;
            s._instanceType = "annieUI.FacePhoto";
            s.photo = new Image();
            s.bitmap = new annie.Bitmap();
            s.maskObj = new annie.Shape();
            s.photo.onload = function (e: any) {
                s.bitmap.bitmapData = s.photo;
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                let scale = s.radio / (s.photo.width < s.photo.height ? s.photo.width : s.photo.height);
                s.bitmap.scaleX = s.bitmap.scaleY = scale;
                s.bitmap.x = (s.radio - s.photo.width * scale) >> 1;
                s.bitmap.y = (s.radio - s.photo.height * scale) >> 1;
                if (s.maskType == 0) {
                    s.maskObj.drawCircle(s.radio >> 1, s.radio >> 1, s.radio >> 1);
                } else {
                    s.maskObj.drawRect(0, 0, s.radio, s.radio);
                }
                s.maskObj.endFill();
            };
            s.addChild(s.bitmap);
            s.bitmap.mask = s.maskObj;
        }

        private photo: any;
        private bitmap: Bitmap;
        private maskType: number = 0;
        private radio: number;
        private maskObj: Shape;

        /**
         * 被始化头像，可反复调用设置不同的遮罩类型或者不同的头像地址
         * @method init
         * @param src 头像的地址
         * @param radio 指定头像的长宽或者直径
         * @param maskType 遮罩类型，是圆形遮罩还是方形遮罩 0 圆形 1方形
         */
        public init(src: string, radio: number = 0, maskType: number = 0): void {
            let s = this;
            s.radio = radio;
            if (s.photo.src != src)
                s.photo.src = src;
            if (s.maskType != maskType)
                s.maskType = maskType;
        }
    }
}