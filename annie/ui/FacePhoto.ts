/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
namespace annieUI
{
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
    export class FacePhoto extends Sprite{
        constructor(){
            super();
            let s=this;
            s._instanceType="annieUI.FacePhoto";
            s.photo=new Image();
            s.bitmap=new annie.Bitmap();
            s.maskObj=new annie.Shape();
            s.photo.onload=function (e:any){
               s.bitmap.bitmapData=s.photo;
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                if(s.maskType==0) {
                    s.bitmap.scaleX=s.bitmap.scaleY=s.radio*2/s.photo.width;
                    s.maskObj.drawCircle(s.radio, s.radio, s.radio);
                }else{
                    let w=s.photo.width>s.photo.height?s.photo.width:s.photo.height;
                    s.bitmap.scaleX=s.bitmap.scaleY=s.radio/w;
                    s.maskObj.drawRect(0,0,s.radio,s.radio);
                }
                s.maskObj.endFill();
            };
            s.addChild(s.bitmap);
            s.bitmap.mask=s.maskObj;
        }
        private photo:any;
        private bitmap:Bitmap;
        private maskType:number=0;
        private radio:number;
        private maskObj:Shape;
        /**
         * 被始化头像
         * @method init
         * @param src 头像的地址
         * @param radio 指定头像的长宽
         * @param maskType 遮罩类型，是圆形遮罩还是方形遮罩
         */
        public init(src:string,radio:number=0,maskType:number=0):void{
            this.radio=radio;
            this.photo.src=src;
            this.maskType=maskType;
        }
    }
}