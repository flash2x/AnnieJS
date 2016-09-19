/**
 * Created by anlun on 16/8/14.
 */
namespace annieUI
{
    import Sprite = annie.Sprite;
    import Bitmap = annie.Bitmap;
    import Shape = annie.Shape;
    export class FacePhoto extends Sprite{
        constructor(){
            super();
            var s=this;
            s.photo=new Image();
            s.bitmap=new annie.Bitmap();
            s.maskObj=new annie.Shape();
            s.photo.onload=function (e:any){
               s.bitmap.bitmapData=s.photo;
                s.maskObj.clear();
                s.maskObj.beginFill("#000000");
                if(s.maskType==0) {
                    s.bitmap.scaleX=s.bitmap.scaleY=s.radio*2/s.photo.width;
                    s.maskObj.circle(s.radio, s.radio, s.radio);
                }else{
                    s.bitmap.scaleX=s.bitmap.scaleY=s.radio/s.photo.width;
                    s.maskObj.rect(0,0,s.radio,s.radio);
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
        public init(src:string,radio:number=0,maskType:number=0):void{
            this.radio=radio;
            this.photo.src=src;
            this.maskType=maskType;
        }
    }
}