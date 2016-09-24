/**
 * @module annie
 */
namespace annie {
    /**
     * 抽象类 一般不直接使用
     * @class annie.Media
     * @extends annie.AObject
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
         * @type {string}
         * @since 1.0.0
         * @since 1.0.0
         */
        public type = "";
        private _loop: number = 0;

        /**
         * 构造函数
         * @method Media
         * @param {string|HtmlElement} src
         * @param {string} type
         * @since 1.0.0
         */
        public constructor(src: any, type: string) {
            super();
            var s = this;
            if (typeof(src) == "string") {
                s.media = document.createElement(type);
                s.media.src = src;
            } else {
                s.media = src;
            }
            s.media.addEventListener('ended', function () {
                s._loop--;
                if (s._loop > 0) {
                    s.media.play();
                } else {
                    s.media.pause();
                }
                s.dispatchEvent("onPlayEnd");
            }, false);
            this.type = type.toLocaleUpperCase();
            s.media.addEventListener("timeupdate", function () {
                s.dispatchEvent("onPlayUpdate", {currentTime: s.media.currentTime});
            }, false);
        }

        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数
         * @public
         * @since 1.0.0
         */
        public play(start: number, loop: number): void {
            var s = this;
            s._loop = loop;
            //TODO 好像设置了也没什么用，后期再看看
            try {
                s.media.currentTime = start;
            } catch (e) {
                trace(e);
            }
            s.media.play();
        }

        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        public stop(): void {
            this.media.pause();
            this.media.currentTime = 0;
        }

        /**
         * 暂停播放
         * @method pause
         * @public
         * @since 1.0.0
         */
        public pause(): void {
            this.media.pause();
        }
    }
}
