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
        public constructor(src:any) {
            super(src,"Audio");
        }
    }
}
