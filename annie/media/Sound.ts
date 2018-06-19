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
            let s=this;
            s._instanceType = "annie.Sound";
            annie.Sound._soundList.push(s);
            s.volume=Sound._volume;
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
                    annie.Sound._soundList[i].stop();
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
        public static setAllSoundsVolume(volume: number){
            let len: number = annie.Sound._soundList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (annie.Sound._soundList[i]) {
                    annie.Sound._soundList[i].volume = volume;
                } else {
                    annie.Sound._soundList.splice(i, 1);
                }
            }
            Sound._volume=volume;
        }
        private static _volume:number=1;
    }
}
