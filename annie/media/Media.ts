/**
 * @module annie
 */
namespace annie {
    declare let WeixinJSBridge: any;

    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 抽象类 一般不直接使用
     * @class annie.Media
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    export class Media extends annie.EventDispatcher {
        /**
         * html 标签 有可能是audio 或者 video
         * @property media
         * @type {Video|Audio}
         * @public
         * @since 1.0.0
         */
        public media: any = null;
        /**
         * 媒体类型 VIDEO 或者 AUDIO
         * @property type
         * @type {string}
         * @since 1.0.0
         */
        public type = "";
        /**
         * @property isPlaying
         * @type {boolean}
         * @since 2.0.0
         * @default true
         */
        public isPlaying: boolean = true;
        /**
         * 给一个声音取一个名字，方便获取
         * @property name
         * @type {string}
         */
        public name: string = "";
        private _loop: number = 1;

        /**
         * 构造函数
         * @method Media
         * @param {string|HtmlElement} src
         * @param {string} type
         * @since 1.0.0
         * @example
         *      var media = new annie.Media('http://test.annie2x.com/biglong/apiDemo/annieBitmap/resource/music.mp3', 'Audio');
         *          media.play();//媒体播放
         *          //media.pause();//暂停播放
         *          //media.stop();//停止播放
         */
        public constructor(src: any, type: string) {
            super();
            let s = this;
            s._instanceType = "annie.Media";
            if (typeof(src) == "string") {
                s.media = document.createElement(type);
                s.media.src = src;
            } else {
                s.media = src;
            }
            s._SBWeixin = s._weixinSB.bind(s);
            s.media.addEventListener('ended', s._endEvent = function () {
                if (s._loop == -1) {
                    s.play(0);
                } else {
                    s._loop--;
                    if (s._loop > 0) {
                        s.play(0, s._loop);
                    } else {
                        s.stop();
                    }
                }
                s.dispatchEvent("onPlayEnd");
            }.bind(s));
            s.type = type.toLocaleUpperCase();
            s.media.addEventListener("timeupdate", s._updateEvent = function () {
                s.dispatchEvent("onPlayUpdate", {currentTime: s.media.currentTime});
            });
            s.media.addEventListener("play", s._playEvent = function () {
                s.dispatchEvent("onPlayStart");
            });
        }
        private _playEvent: any;
        private _updateEvent: any;
        private _endEvent: any;
        protected isNeedCheckPlay:boolean=false;
        /**
         * @property _repeate
         * @type {number}
         * @private
         * @default 1
         */
        private _repeate: number = 1;

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
            if (loop == 0) {
                s._loop = s._repeate;
            } else {
                s._loop = loop;
                s._repeate = loop;
            }
            if(s.media.currentTime != start) {
                s.media.currentTime = start;
            }
            //马蛋的有些ios微信无法自动播放,需要做一些特殊处理
            if (s.media.readyState==4) {
                let wsb: any = window;
                if (wsb.WeixinJSBridge) {
                    try {
                        wsb.WeixinJSBridge.invoke("getNetworkType", {}, s._SBWeixin);
                    } catch (e) {
                        s.media.play();
                    }
                } else {
                    s.media.play();
                }
                s.isNeedCheckPlay=false;
            }else{
                s.isNeedCheckPlay=true;
            }
            s.isPlaying = true;
        }
        private _SBWeixin: any;
        private _weixinSB() {
            this.media.play();
        }

        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        public stop(): void {
            let s = this;
            s.media.pause();
            s.media.currentTime = 0;
            s.isPlaying = false;
        }

        /**
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放
         * @since 1.0.4
         */
        public pause(isPause: boolean = true): void {
            let s = this;
            if (isPause) {
                s.media.pause();
                s.isPlaying = false;
            } else {
                s.media.play();
                s.isPlaying = true;
            }
        }

        /**
         * 设置或者获取音量 从0-1
         * @since 1.1.0
         * @property volume
         * @return {number}
         */
        public get volume(): number {
            return this.media.volume
        }

        public set volume(value: number) {
            let s = this;
            s.media.volume = value;
            if (value == 0) {
                s.media.muted = true;
            } else {
                s.media.muted = false;
            }
        }

        public destroy(): void {
            let s = this;
            s.media.pause();
            s.media.removeEventListener("ended", s._endEvent);
            s.media.removeEventListener("onPlayStart", s._playEvent);
            s.media.removeEventListener("timeupdate", s._updateEvent);
            s.media = null;
            super.destroy();
        }
    }
}
