/**
 * @module annie
 */
namespace annie {
    /**
     * 视频类
     * @class annie.Video
     * @extends annie.Media
     * @public
     * @since 1.0.0
     */
    export class Video extends Media {
        /**
         * 构造函数
         * @method Video
         * @param src
         * @param width
         * @param height
         * @public
         * @since 1.0.0
         * @example
         *      var videoPlayer = new annie.Video('http://test.annie2x.com/biglong/apiDemo/video.mp4');
         *          videoPlayer.play();//播放视频
         *          //videoPlayer.pause();//暂停视频
         *          //videoPlayer.stop();//停止播放
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
            if(width&&height) {
                s.media.width = width;
                s.media.height = height;
            }
        }
    }
}