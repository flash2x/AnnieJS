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
         * @type {Audio}
         * @public
         * @since 1.0.0
         */
        public media: any = null;
        private _loop: number = 0;

        /**
         * 构造函数
         * @method Sound
         * @param {string} src
         * @param {string}type
         * @since 1.0.0
         */
        public constructor(src: any) {
            super();
            let s = this;
            s._instanceType = "annie.Sound";
            if(typeof src =="string"){
                s.media = annie.app.createInnerAudioContext();
                s.media.src = src;
            }else{
                s.media = src;
            }
            s.media.onEnded(function () {
                s.dispatchEvent("onPlayEnd");
                if (s._loop > 1) {
                    s._loop--;
                    s.media.startTime = 0;
                    s.media.play();
                }
            });
            s.media.onPlay(function () {
                s.dispatchEvent("onPlayStart");
            });
            s.media.onTimeUpdate(function () {
                s.dispatchEvent("onPlayUpdate",{currentTime: s.media.currentTime});
            });
            annie.Sound._soundList.push(s);
        }
        private _repeate: number = 1;
        /**
         * 是否正在播放中
         * @property  isPlaying
         * @public
         * @since 2.0.0
         * @type {boolean}
         */
        public isPlaying: boolean = true;

        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        public play(start: number = 0, loop: number = 0): void {
            let s = this;
            s.media.startTime = start;
            if (loop == 0) {
                s._loop = s._repeate;
            } else {
                s._loop = loop;
                s._repeate = loop;
            }
            s.media.play();
            s.isPlaying = true;
        }

        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        public stop(): void {
            let s=this;
            s.media.stop();
            s.isPlaying=false;
        }
        /**
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放
         * @since 1.0.4
         */
        public pause(isPause:boolean=true): void {
            let s=this;
            if(isPause){
                s.media.pause();
                s.isPlaying=false;
            }else{
                s.media.play();
                s.isPlaying=true;
            }
        }

        /**
         * 每个声音可以有个名字，并且不同的声音名字可以相同
         * @property name
         * @type {string}
         * @since 2.0.0
         */
        public name:string="";
        /**
         * 设置或者获取音量 从0-1
         * @since 1.1.0
         * @property volume
         * @return {number}
         */
        public get volume():number{
            return this.media.volume
        }
        public set volume(value:number){
            this.media.volume=value;
        }
        public stop2() {
            let s = this;
            if (s.isPlaying) {
                s.media.pause();
            }
        }
        public play2() {
            let s = this;
            if (s.isPlaying) {
                s.media.play();
            }
        }
        //声音对象池
        private static _soundList: any = [];
        /**
         * 停止当前所有正在播放的声音，当然一定要是annie.Sound类的声音
         * @method stopAllSounds
         * @since 1.1.1
         * @static
         * @public
         */
        public static stopAllSounds() {
            let len: number = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].stop2();
                } else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
        }

        /**
         * 恢复当前所有正在停止的声音，当然一定要是annie.Sound类的声音
         * @method resumePlaySounds
         * @since 2.0.0
         * @static
         * @public
         */
        public static resumePlaySounds() {
            let len: number = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].play2();
                } else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
        }

        /**
         * 设置当前所有正在播放的声音，当然一定要是annie.Sound类的声音
         * @method setAllSoundsVolume
         * @since 1.1.1
         * @static
         * @public
         * @param {number} volume 音量大小，从0-1
         */
        public static setAllSoundsVolume(volume: number){
            let len: number = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].volume = volume;
                } else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
            Sound._volume = volume;
        }
        private static _volume: number = 1;
        public destroy(){
            let s=this;
            let len: number = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]==s) {
                    annie.Sound._soundList[i].stop();
                    annie.Sound._soundList.splice(i,1);
                    break;
                }
            }
            s.media.offTimeUpdate();
            s.media.offPlay();
            s.media.offEnded();
            s.media = null;
        }
    }
}