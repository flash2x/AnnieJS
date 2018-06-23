/**
 * @module annie
 */
namespace annie {
    //declare let WeixinJSBridge:any;
    /**
     * 声音类
     * @class annie.Sound
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    export class Sound extends annie.EventDispatcher {
        /**
         * html 标签 有可能是audio 或者 video
         * @property media
         * @type {Video|Audio}
         * @public
         * @since 1.0.0
         */
        public media: any = null;
        private _loop: number = 0;
        /**
         * 构造函数
         * @method Sound
         * @param {string|HtmlElement} src
         * @param {string} type
         * @since 1.0.0
         */
        public constructor(src: string) {
            super();
            let s = this;
            s._instanceType="annie.Sound";
            s.media =annie.createAudio();
            s.media.src = src;
            s.media.onEnded=function(){
                if(s._loop>1){
                    s._loop--;
                    s.media.play();
                }
            }
        }
        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        public play(start: number=0, loop: number=1): void {
            let s = this;
            s.media.startTime = start;
            s._loop=loop;
            s.media.play();
        }
        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        public stop(): void {
            this.media.stop();
        }
        /**
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放
         * @since 1.0.4
         */
        public pause(isPause:boolean=true): void {
            if(isPause){
                this.media.pause();
            }else{
                this.media.play();
            }
        }

        /**
         * 设置或者获取音量 从0-1
         * @since 1.1.0
         * @property volume
         * @returns {number}
         */
        public get volume():number{
            return this.media.volume
        }
        public set volume(value:number){
            this.media.volume=value;
        }
    }
}