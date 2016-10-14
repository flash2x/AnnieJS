/**
 * Created by anlun on 16/8/8.
 */
/**
 * @module annie
 */
namespace annie {
    /**
     * 将img序列的内容画到canvas里
     * @class annie.ImageFrames
     * @extends annie.Bitmap
     * @public
     * @since 1.0.0
     */
    export class ImageFrames extends EventDispatcher{
        private list: any;
        /**
         * img文件所在的文件夹路径
         * @property src
         * @type {string}
         * @public
         * @since 1.0.0
         */
        public src: string = "";
        private _lastSrc: string = "";
        private _urlLoader: URLLoader;
        private _configInfo: any;
        private _startTime: number;
        private _needBufferFrame: number;
        private _currentLoadIndex: number;
        /**
         * 当前播放到序列的哪一帧
         * @property currentFrame
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public currentFrame: number=0;
        /**
         * 当前播放的序列所在的spriteSheet大图引用
         * @property currentBitmap
         * @since 1.0.0
         * @public
         * @default null
         * @type {number}
         */
        public currentBitmap:HTMLImageElement=null;
        /**
         * 序列的总帧数
         * @property totalsFrame
         * @since 1.0.0
         * @public
         * @type{number}
         * @default 1;
         */
        public totalsFrame: number=1;
        /**
         * 当前帧所在的spriteSheet里的位置区域
         * @property rect
         * @public
         * @since 1.0.0
         * @type {annie.Rectangle}
         */
        public rect:Rectangle=null;
        /**
         * 是否循环播放
         * @property loop
         * @public
         * @since 1.0.0
         * @type {boolean}
         */
        public loop:boolean=false;
        private _isLoaded=false;
        /**
         * 是否能播放状态
         * @type {boolean}
         */
        private canPlay: boolean = false;
        /**
         * 是否在播放中
         * @property isPlaying
         * @type {boolean}
         * @public
         * @since 1.0.0
         */
        public isPlaying: boolean = true;
        /**
         * 是否在自动播放
         * @property autoplay
         * @type {boolean}
         * @public
         * @since 1.0.0
         */
        public autoplay: boolean = false;
        /**
         * 被始化一个序列图视频
         * @method ImageFrames 构架函数
         * @param src
         * @param width
         * @param height
         * @since 1.0.0
         */
        public constructor(src:string,width:number,height:number) {
            super();
            var s = this;
            s.src=src;
            s.rect = new Rectangle(0,0,width,height);
            s.list = [];
            s._urlLoader = new URLLoader();
            s._urlLoader.addEventListener(annie.Event.COMPLETE, s.success.bind(s));
        }

        /**
         * 资源加载成功
         * @private
         * @since 1.0.0
         * @param e
         */
        private success(e:annie.Event){
            var s = this;
            if (e.data.type == "json") {
                //加载到了配置文件
                s._configInfo = {};
                for (var item in e.data.response) {
                    s._configInfo[item] = e.data.response[item];
                }
                s._startTime = Date.now();
                s._urlLoader.responseType = "image";
                s.loadImage();
            } else {
                //加载到了图片
                s.list.push(e.data.response);
                s._currentLoadIndex = s.list.length;
                if (s._currentLoadIndex == s._configInfo.totalsPage) {
                    //加载结束,抛出结束事件
                    if (!s.canPlay) {
                        s.canPlay = true;
                    }
                    s._isLoaded=true;
                    s.dispatchEvent("onload");
                } else {
                    s.loadImage();
                    var bufferFrame = s._currentLoadIndex* s._configInfo.pageCount;
                    if (bufferFrame >= 30) {
                        if (bufferFrame == 30) {
                            //判断网速
                            var _endTime = Date.now();
                            var time = _endTime - s._startTime;
                            if (time < 500) {
                                s._needBufferFrame = 30;
                            } else if (time < 1000) {
                                s._needBufferFrame = 60;
                            } else if (time < 1500) {
                                s._needBufferFrame = 90;
                            } else if (time < 2000) {
                                s._needBufferFrame = 120;
                            } else if (time < 2500) {
                                s._needBufferFrame = 150;
                            } else {
                                s._needBufferFrame = 180;
                            }
                        }
                        if (bufferFrame >= s._needBufferFrame && !s.canPlay) {
                            s.canPlay = true;
                            s.dispatchEvent("oncanplay");
                        }
                    }
                }
            }
        }

        /**
         * 如果需要单独使用ImageFrames的话,你需要时间调用update来刷新视频的播放进度,使用VideoPlayer的类将无需考虑
         * @method update
         * @since 1.0.0
         * @public
         */
        public update() {
            var s = this;
            if (s.canPlay && s.autoplay) {
                if (s.currentFrame == s._configInfo.totalsFrame) {
                    //播放结束事件
                    s.currentFrame=0;
                    if(!s.loop){
                        s.autoplay=false;
                        s.isPlaying=false;
                    }
                    s.dispatchEvent("onPlayEnd");
                } else {
                    if(s.currentFrame<(s._currentLoadIndex * s._configInfo.pageCount-1)||s._isLoaded){
                        //////////////////////////////渲染//////////////////////////////////
                        var pageIndex = Math.floor(s.currentFrame / s._configInfo.pageCount);
                        var rowIndex = s.currentFrame % s._configInfo.pageCount;
                        var x = Math.floor(rowIndex / s._configInfo.rowCount);
                        var y = rowIndex % s._configInfo.rowCount;
                        s.rect.x = y * (s._configInfo.dis + s._configInfo.width) + s._configInfo.dis;
                        s.rect.y = x * (s._configInfo.dis + s._configInfo.height) + s._configInfo.dis;
                        s.rect.width = s._configInfo.width;
                        s.rect.height = s._configInfo.height;
                        s.currentBitmap= s.list[pageIndex];
                        s.currentFrame++;
                        if (!s.isPlaying) {
                            s.isPlaying = true;
                        }
                    } else {
                        s.canPlay = false;
                        s.isPlaying = false;
                    }
                }
                s.dispatchEvent("onPlayUpdate",{currentTime:s._currentLoadIndex});
            }
            s.checkChange();
        }
        private checkChange(){
            var s=this;
            if (s._lastSrc != s.src) {
                //开始初始化
                if (s.src != "") {
                    //加载配置文件
                    s._urlLoader.responseType = "json";
                    s._urlLoader.load(s.src + "/config.json");
                    s.canPlay = false;
                    s._currentLoadIndex = 0;
                    s.currentFrame = 0;
                    s._needBufferFrame = 1000;
                    s._isLoaded=false;
                    s._lastSrc = s.src;
                } else {
                   s.clear();
                }
            }
        }
        private loadImage(){
            var s = this;
            s._urlLoader.load(s.src + "/" + s._configInfo.name + s._currentLoadIndex + s._configInfo.type);
        }
        /**
         * 播放视频,如果autoplay为true则会加载好后自动播放
         * @method play
         * @public
         * @since 1.0.0
         */
        public play() {
            this.autoplay = true;
        }
        /**
         * 停止播放,如果需要继续播放请再次调用play()方法
         * @method pause
         * @public
         * @since 1.0.0
         */
        public pause(): void {
            this.autoplay = false;
        }
        /**
         *如果播放了视频后不已不再需要的话,这个时候可以调用这个方法进行资源清理,以方便垃圾回收。
         * 调用此方法后,此对象一样可以再次设置src重新使用。或者直接进行src的更换,系统会自动调用此方法以清除先前的序列在内存的资源
         * @method clear
         * @public
         * @since 1.0.0
         */
        public clear():void{
            var s=this;
            s._urlLoader.loadCancel();
            s.list = [];
            s.src="";
            s._lastSrc="";
        }
    }
}