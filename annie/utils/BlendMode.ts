/**
 * @module annie
 */
namespace annie {
    /**
     * 定时器类
     * @class annie.Timer
     * @public
     * @since 1.0.9
     */
    export class BlendMode{
        public static NORMAL:number=0;
        //public static LAYER:number=1;
        public static DARKEN:number=2;
        public static MULTIPLY:number=3;
        public static LIGHTEN:number=4;
        public static SCREEN:number=5;
        public static OVERLAY:number=6;
        public static HARDLIGHT:number=7;
        public static ADD:number=8;
        public static SUBTRACT:number=9;
        public static DIFFERENCE:number=10;
        public static INVERT:number=11;
        public static ALPHA:number=12;
        public static ERASE:number=13;
        public static SOURCE_IN:number=14;
        public static SOFT_LIGHT:number=15;
        public static XOR:number=16;
        public static COPY:number=17;
        public static HUE:number=18;
        public static SATURATION:number=19;
        public static COLOR:number=20;
        public static LUMINOSITY:number=21;
        public static EXCLUSION:number=22;
        public static COLOR_BURN:number=23;
        public static COLOR_DODGE:number=24;
        public static SOURCE_OUT:number=25;
        public static SOURCE_ATOP:number=26;
        private static _modeList:Array<string>=[
            "source-over",
            "layer",
            "darken",
            "multiply",
            "lighten",
            "screen",
            "overlay",
            "hard-light",
            "add",
            "subtract",
            "difference",
            "invert",
            "alpha",
            "erase",
            "source-in",
            "soft-light",
            "xor",
            "copy",
            "hue",
            "saturation",
            "color",
            "luminosity",
            "exclusion",
            "color-burn",
            "color-dodge",
            "source-out",
            "source-atop"
        ];
        public static getBlendMode(mode:number):string{
            return this._modeList[mode];
        }
    }
}