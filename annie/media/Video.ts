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
        public constructor(src:any,width:number,height:number) {
            super(src, "Video");
            let s=this;
            s._instanceType="annie.Video";
            s.media.setAttribute("playsinline", "true");
            s.media.setAttribute("webkit-playsinline", "true");
            s.media.setAttribute("x-webkit-airplay", "true");
            s.media.setAttribute("x5-video-player-type", "h5");
            s.media.poster="";
            s.media.preload="auto";
            s.media.controls=false;
            s.media.width=width;
            s.media.height=height;
        }
    }
}