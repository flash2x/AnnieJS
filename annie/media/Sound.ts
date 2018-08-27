/**
 * @module annie
 */
namespace annie {

    /**
     * 声音类
     * @class annie.Sound
     * @extends annie.Media
     * @public
     * @since 1.0.0
     */
    export class Sound extends Media {
        //Event
        /**
         * annie.Media相关媒体类的播放刷新事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @event annie.Event.ON_PLAY_UPDATE
         * @since 1.1.0
         */
        /**
         * annie.Media相关媒体类的播放完成事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @event annie.Event.ON_PLAY_END
         * @since 1.1.0
         */
        /**
         * annie.Media相关媒体类的开始播放事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @event annie.Event.ON_PLAY_START
         * @since 1.1.0
         */
        //
        /**
         * 构造函数
         * @method  Sound
         * @since 1.0.0
         * @public
         * @param src
         * @example
         *      var soundPlayer = new annie.Sound('http://test.annie2x.com/biglong/apiDemo/annieBitmap/resource/music.mp3');
         *          soundPlayer.play();//播放音乐
         *          //soundPlayer.pause();//暂停音乐
         *          //soundPlayer.stop();//停止音乐
         */
        public constructor(src: any) {
            super(src, "Audio");
            let s = this;
            s._instanceType = "annie.Sound";
            annie.Sound._soundList.push(s);
            s.volume = Sound._volume;
        }

        /**
         * 从静态声音池中删除声音对象,如果一个声音再也不用了，建议先执行这个方法，再销毁
         * @method destroy
         * @public
         * @since 1.1.1
         */
        public destroy(): void {
            let len: number = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (!annie.Sound._soundList[i] || annie.Sound._soundList[i] == this) {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
            super.destroy();
        }

        /**
         * 作用和stop()相同,但你用这个方法停止声音了，用play2()方法才会有效
         * @method stop2
         * @since 2.0.0
         * @public
         * @return {void}
         */
        public stop2():void {
            let s = this;
            if (s.isPlaying) {
                s.media.pause();
            }
        }
        /**
         * 如果你的项目有背景音乐一直在播放,但可能项目里需要播放视频的时候，需要停止背景音乐或者其他需求，
         * 视频播放完之后再恢复背景音乐播放。这个时候，你要考虑用户之前是否有主动关闭过背景音乐，有的话，
         * 这个时候你再调用play()方法或者pause()方法就违背用户意愿。所以你应该调用play2()方法。
         * 这个方法的原理就是如果用户之前关闭过了，那调用这个方法就不会播放声音，如果没关闭则会播放声音。
         * @method play2
         * @since 2.0.0
         * @public
         * @return {void}
         */
        public play2() {
            let s = this;
            if (s.isPlaying) {
                s.play();
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
         * @param {number} volume 音量大小，从0-1 在ios里 volume只能是0 或者1，其他无效
         */
        public static setAllSoundsVolume(volume: number) {
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
    }
}
