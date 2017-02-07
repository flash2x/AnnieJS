/**
 * @module annie
 */
namespace annie {
    /**
     * 将video的内容或者是序列图画到canvas里形成连续播放的效果,以方便做交互
     * @class annie.VideoPlayer
     * @extends annie.Bitmap
     * @public
     * @since 1.0.0
     */
    export class VideoPlayer extends Bitmap{
        /**
         * @method VideoPlayer
         * @param {string} src
         * @param {number} width
         * @param {number} height
         * @param {number} type 视频类型 值为0则会自动检测android下用序列图,其他系统下支持mp4的用mp4,不支持mp4的用序列图\n,值为1时全部使用序列图,值为2时全部使用mp4
         */
        public constructor(src:any,type:number=0,width:number,height:number){
            super();
            var isUseVideo:any=true;
            if(type==0){
                if(annie.osType=="android"){
                    isUseVideo=false;
                }else{
                    //检测是否支持mp4,如果不支持,也将用序列
                    var testVideo=document.createElement("video");
                    isUseVideo=testVideo.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')=="probably";
                }
            }else if(type==1){
                isUseVideo=false;
            }
            if(isUseVideo){
                this.video=new Video(src+".mp4",width,height);
            }else{
                this.video=new ImageFrames(src,width,height);
            }
            this.videoType=isUseVideo?1:0;
        }
        /**
         * 视频的引用
         */
        private video:any;
        /**
         * 播放的视频类型 值为0是序列图,1是视频 只读
         * @property videoType
         * @puboic
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public videoType:number=0;

        /**
         * 继承刷新方法
         */
        public update(){
            //刷新视频
            if(this.videoType==0){
                this.video.update();
                this.rect=this.video.rect;
                this["_cacheImg"]=this.bitmapData=this.video.currentBitmap;
            }else{
                this["_cacheImg"]=this.bitmapData=this.video;
            }
            super.update();
        }
    }
}