/**
 * @module annie
 */
namespace annie {
    declare let WeixinJSBridge:any;
    /**
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
            let s = this;
            s._instanceType="annie.Media";
            if (typeof(src) == "string") {
                s.media = document.createElement(type);
                s.media.src = src;
            } else {
                s.media = src;
            }
            s._SBWeixin=s._weixinSB.bind(s);
            s.media.addEventListener('ended', function(){
                s._loop--;
                if (s._loop > 0) {
                    s.play(0,s._loop);
                } else {
                    s.media.pause();
                }
                s.dispatchEvent("onPlayEnd");
            }.bind(s), false);
            s.type = type.toLocaleUpperCase();
            s.media.addEventListener("timeupdate", function () {
                s.dispatchEvent("onPlayUpdate", {currentTime: s.media.currentTime});
            }, false);
        }
        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        public play(start: number=1, loop: number=1): void {
            let s = this;
            s._loop = loop;
            //TODO 好像设置了也没什么用，后期再看看
            try {
                s.media.currentTime = start;
            } catch (e) {
                trace(e);
            }
            //马蛋的有些ios微信无法自动播放,需要做一些特殊处理
            try{
                WeixinJSBridge.invoke("getNetworkType",{},s._SBWeixin);
            }catch(e){
                s.media.play();
            }
        }
        private _SBWeixin:any;
        private _weixinSB(){
            this.media.play();
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
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放 1.0.4新增的参数
         * @since 1.0.4
         */
        public pause(isPause:boolean=true): void {
            if(isPause){
                this.media.pause();
            }else{
                this.media.play();
            }
        }
    }
}
