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
            s.mask=new annie.Shape();
            s.photo.onload=function (e){
               s.bitmap.bitmapData=s.photo;
                s.bitmap.scaleX=s.bitmap.scaleY=s.radio/s.photo.width*2;
                s.mask.clear();
                s.mask.beginFill("#000000");
                if(s.maskType==0) {
                    s.mask.circle(s.radio, s.radio, s.radio);
                }else{
                    s.mask.rect(0,0,s.radio,s.radio);
                }
                s.mask.endFill();
            };
            s.addChild(s.bitmap);
            s.bitmap.mask=s.mask;
        }
        private photo:any;
        private bitmap:Bitmap;
        private mask:Shape;
        private maskType:number=0;
        private radio:number;
        public init(src:string,radio:number=0,maskType:number=0):void{
            this.radio=radio;
            this.photo.src=src;
            this.maskType=maskType;
        }
    }
}