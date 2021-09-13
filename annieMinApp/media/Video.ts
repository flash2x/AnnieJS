/**
 * @module annie
 */
namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 视频类
     * @class annie.Video
     * @extends annie.Media
     * @public
     * @since 1.0.0
     */
    export class Video extends Media{
        /**
         * 构造函数
         * @method Video
         * @param src
         * @param width
         * @param height
         * @public
         * @since 1.0.0
         * @example
         *      //切记在微信里视频地址一定要带上完整域名,并且视频尺寸不要超过1136不管是宽还是高，否则后果很严重
         *      var videoPlayer = new annie.Video('http://test.annie2x.com/biglong/apiDemo/video.mp4');
         *      videoPlayer.play();//播放视频
         *      //videoPlayer.pause();//暂停视频
         *      //videoPlayer.stop();//停止播放
         *      var floatDisplay=new annie.FloatDisplay();
         *      floatDisplay.init(videoPlayer);
         *      //这里的spriteObj是任何一个Sprite类或者其扩展类的实例对象
         *      spriteObj.addChild(floatDisplay);
         */
        public constructor(src: any, width: number=0, height: number=0) {
            super(src, "Video");
            let s = this;
            s._instanceType = "annie.Video";
            s.media.setAttribute("playsinline", "true");
            s.media.setAttribute("webkit-playsinline", "true");
            s.media.setAttribute("x-webkit-airplay", "true");
            s.media.setAttribute("x5-video-player-type", "h5");
            s.media.poster="";
            s.media.preload="auto";
            s.media.controls=false;
            if(width&&height){
                s.media.width = width;
                s.media.height = height;
            }
        }
    }
}