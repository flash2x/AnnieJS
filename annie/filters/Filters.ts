/**
 * @module annie
 */
namespace annie{
    /**
     * 投影或者发光滤镜
     * @class annie.ShadowFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class ShadowFilter extends AObject{
        /**
         * 颜色值
         * @property color
         * @public
         * @readonly
         * @since 1.0.0
         * @default black
         * @type {string}
         */
        public color:string="black";
        /**
         * x方向投影距离
         * @property offsetX
         * @public
         * @readonly
         * @since 1.0.0
         * @default 2
         * @type {number}
         */
        public offsetX:number=2;
        /**
         * y方向投影距离
         * @property offsetY
         * @public
         * @readonly
         * @since 1.0.0
         * @default 2
         * @type {number}
         */
        public offsetY:number=2;
        /**
         * 模糊值
         * @property blur
         * @public
         * @readonly
         * @since 1.0.0
         * @default 2
         * @type {number}
         */
        public blur:number=2;
        /**
         * 滤镜类型 只读
         * @property color
         * @public
         * @readonly
         * @since 1.0.0
         * @default Shadow
         * @type {string}
         */
        public type:string="Shadow";
        /**
         * @method ShadowFilter
         * @param {string} color
         * @param {number} offsetX
         * @param {number} offsetY
         * @param {number} blur
         */
        public  constructor(color:string="black",offsetX:number=2,offsetY:number=2,blur:number=2){
            super();
            let s=this;
            s._instanceType="annie.ShadowFilter";
            s.offsetX=offsetX;
            s.offsetY=offsetY;
            s.blur=blur;
            s.color=color;
        }
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        public toString():string{
            let s=this;
            return s.type+s.offsetX+s.offsetY+s.blur+s.color;
        }
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @public
         * @since 1.0.0
         * @param {ImageData} imageData
         */
        public drawFilter(imageData:ImageData=null){
            //什么也不要做
        }
    }
    /**
     * 普通变色滤镜
     * @class annie.ColorFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class ColorFilter extends AObject{
        /**
         * @property redMultiplier
         * @public
         * @since 1.0.0
         * @readonly
         * @type {number}
         */
        public redMultiplier:number=0;
        /**
         * @property redOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public redOffset:number=0;
        /**
         * @property greenMultiplier
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public greenMultiplier:number=0;
        /**
         * @property greenOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public greenOffset:number=0;
        /**
         * @property blueMultiplier
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public blueMultiplier:number=0;
        /**
         * @property blueOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public blueOffset:number=0;
        /**
         * @property alphaMultiplier
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public alphaMultiplier:number=0;
        /**
         * @property alphaOffset
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public alphaOffset:number=0;
        /**
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @type {string}
         */
        public type:string="Color";
        /**
         * @method ColorFilter
         * @param {number} redMultiplier
         * @param {number} greenMultiplier
         * @param {number} blueMultiplier
         * @param {number} alphaMultiplier
         * @param {number} redOffset
         * @param {number} greenOffset
         * @param {number} blueOffset
         * @param {number} alphaOffset
         */
        public constructor(redMultiplier:number=1, greenMultiplier:number=1, blueMultiplier:number=1, alphaMultiplier:number=1, redOffset:number=0, greenOffset:number=0, blueOffset:number=0, alphaOffset:number=0){
            super();
            let s=this;
            s._instanceType="annie.ColorFilter";
            s.redMultiplier=redMultiplier;
            s.greenMultiplier=greenMultiplier;
            s.blueMultiplier=blueMultiplier;
            s.alphaMultiplier=alphaMultiplier;
            s.redOffset=redOffset;
            s.greenOffset=greenOffset;
            s.blueOffset=blueOffset;
            s.alphaOffset=alphaOffset;
        }
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        public drawFilter(imageData:ImageData=null){
            if(!imageData)return;
            let s=this;
            let data = imageData.data;
            let l = data.length;
            for (let i=0; i<l; i+=4) {
                data[i] = data[i]*s.redMultiplier+s.redOffset;
                data[i+1] = data[i+1]*s.greenMultiplier+s.greenOffset;
                data[i+2] = data[i+2]*s.blueMultiplier+s.blueOffset;
                data[i+3] = data[i+3]*s.alphaMultiplier+s.alphaOffset;
            }
        }

        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        public toString():string{
            let s=this;
            return s.type+s.redMultiplier+s.greenMultiplier+s.blueMultiplier+s.alphaMultiplier+s.redOffset+s.greenOffset+s.blueOffset+s.alphaOffset;
        }
    }
    /**
     * 矩阵变色滤镜
     * @class annie.ColorMatrixFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class ColorMatrixFilter extends  AObject{
        /**
         * @property brightness
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public brightness:number=0;
        /**
         * @property contrast
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public contrast:number=0;
        /**
         * @property saturation
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public saturation:number=0;
        /**
         * @property hue
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public hue:number=0;
        /**
         * 滤镜类型 只读
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @type {string}
         */
        public type:string="ColorMatrix";
        private colorMatrix:any;
        /**
         * @method ColorMatrixFilter
         * @param {number} brightness
         * @param {number} contrast
         * @param {number} saturation
         * @param {number} hue
         * @public
         * @since 1.0.0
         */
        public constructor(brightness:number, contrast:number, saturation:number, hue:number){
            super();
            let s=this;
            s._instanceType="annie.ColorMatrixFilter";
            s.brightness=brightness;
            s.contrast=contrast;
            s.saturation=saturation;
            s.hue=hue;
            s.colorMatrix=[
                1,0,0,0,0,
                0,1,0,0,0,
                0,0,1,0,0,
                0,0,0,1,0,
                0,0,0,0,1
            ];
            //brightness
            brightness = s._cleanValue(brightness,255);
            if(brightness!=0) {
                s._multiplyMatrix([
                    1, 0, 0, 0, brightness,
                    0, 1, 0, 0, brightness,
                    0, 0, 1, 0, brightness,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            //contrast
            contrast = this._cleanValue(contrast,100);
            let x:number;
            if(contrast!=0) {
                if (contrast < 0) {
                    x = 127 + contrast / 100 * 127;
                } else {
                    x = contrast % 1;
                    if (x == 0) {
                        x = ColorMatrixFilter.DELTA_INDEX[contrast];
                    } else {
                        x = ColorMatrixFilter.DELTA_INDEX[(contrast << 0)] * (1 - x) + ColorMatrixFilter.DELTA_INDEX[(contrast << 0) + 1] * x; // use linear interpolation for more granularity.
                    }
                    x = x * 127 + 127;
                }
                s._multiplyMatrix([
                    x / 127, 0, 0, 0, 0.5 * (127 - x),
                    0, x / 127, 0, 0, 0.5 * (127 - x),
                    0, 0, x / 127, 0, 0.5 * (127 - x),
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            //saturation
            saturation = this._cleanValue(saturation,100);
            if(saturation!=0) {
                x = 1 + ((saturation > 0) ? 3 * saturation / 100 : saturation / 100);
                let lumR = 0.3086;
                let lumG = 0.6094;
                let lumB = 0.0820;
                s._multiplyMatrix([
                    lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
                    lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
                    lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            //hue
            hue = this._cleanValue(hue,180)/180*Math.PI;
            if(hue!=0) {
                let cosVal = Math.cos(hue);
                let sinVal = Math.sin(hue);
                let lumR = 0.213;
                let lumG = 0.715;
                let lumB = 0.072;
                s._multiplyMatrix([
                    lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG), lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
                    lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140), lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
                    lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG), lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
        }
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        public drawFilter(imageData:ImageData=null):void{
            if(!imageData) return;
                let data:any = imageData.data;
                let l = data.length;
                let r:number,g:number,b:number,a:number;
                let mtx = this.colorMatrix;
                let m0 =  mtx[0],  m1 =  mtx[1],  m2 =  mtx[2],  m3 =  mtx[3],  m4 =  mtx[4];
                let m5 =  mtx[5],  m6 =  mtx[6],  m7 =  mtx[7],  m8 =  mtx[8],  m9 =  mtx[9];
                let m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
                let m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];
                for (let i=0; i<l; i+=4) {
                    r = data[i];
                    g = data[i+1];
                    b = data[i+2];
                    a = data[i+3];
                    data[i] = r*m0+g*m1+b*m2+a*m3+m4; //red
                    data[i+1] = r*m5+g*m6+b*m7+a*m8+m9; //green
                    data[i+2] = r*m10+g*m11+b*m12+a*m13+m14; //blue
                    data[i+3] = r*m15+g*m16+b*m17+a*m18+m19; //alpha
                }
        }
        public static DELTA_INDEX = [
            0,    0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1,  0.11,
            0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
            0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
            0.44, 0.46, 0.48, 0.5,  0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
            0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
            1.0,  1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
            1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0,  2.12, 2.25,
            2.37, 2.50, 2.62, 2.75, 2.87, 3.0,  3.2,  3.4,  3.6,  3.8,
            4.0,  4.3,  4.7,  4.9,  5.0,  5.5,  6.0,  6.5,  6.8,  7.0,
            7.3,  7.5,  7.8,  8.0,  8.4,  8.7,  9.0,  9.4,  9.6,  9.8,
            10.0
        ];
        private _multiplyMatrix(colorMat:any){
            let i:number, j:number, k:number, col:any = [];
            for (i=0;i<5;i++) {
                for (j=0;j<5;j++) {
                    col[j] = this.colorMatrix[j+i*5];
                }
                for (j=0;j<5;j++) {
                    let val=0;
                    for (k=0;k<5;k++) {
                        val += colorMat[j+k*5]*col[k];
                    }
                    this.colorMatrix[j+i*5] = val;
                }
            }
        }
        private _cleanValue(value:number, limit:number):number {
            return Math.min(limit,Math.max(-limit,value));
        }
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        public toString():string{
            let s=this;
            return s.type+s.brightness+s.hue+s.saturation+s.contrast;
        }
    }
    /**
     * 模糊滤镜
     * @class annie.BlurFilter
     * @extends annie.AOjbect
     * @public
     * @since 1.0.0
     */
    export  class BlurFilter extends AObject{
        /**
         * 滤镜类型 只读
         * @property type
         * @public
         * @readonly
         * @since 1.0.0
         * @type {string}
         */
        public type:string="blur";
        /**
         * @property blurX
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public blurX:number=0;
        /**
         * @property blurY
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public blurY:number=0;
        /**
         * @property quality
         * @public
         * @readonly
         * @since 1.0.0
         * @type {number}
         */
        public quality:number=1;
        /**
         * @method BlurFilter
         * @public
         * @since 1.0.0
         * @param {number} blurX
         * @param {number} blurY
         * @param {number} quality
         */
        public constructor(blurX:number=2, blurY:number=2, quality:number=1){
            super();
            let s=this;
            s._instanceType="annie.BlurFilter";
            s.blurX=blurX>8?8:blurX;
            s.blurY=blurY>8?8:blurY;
            s.quality=quality>3?3:quality;
        }
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        public toString():string{
            let s=this;
            return s.type+s.blurX+s.blurY+s.quality;
        }
        private static SHG_TABLE:any = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];
        private static MUL_TABLE:any = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        public drawFilter(imageData:ImageData=null){
            let s=this;
            let radiusX = s.blurX >> 1;
            if (isNaN(radiusX) || radiusX < 0) return false;
            let radiusY = s.blurY >> 1;
            if (isNaN(radiusY) || radiusY < 0) return false;
            if (radiusX == 0 && radiusY == 0) return false;
            let iterations = s.quality;
            if (isNaN(iterations) || iterations < 1) iterations = 1;
            iterations |= 0;
            if (iterations > 3) iterations = 3;
            if (iterations < 1) iterations = 1;
            let px:any = imageData.data;
            let x=0, y=0, i=0, p=0, yp=0, yi=0, yw=0, r=0, g=0, b=0, a=0, pr=0, pg=0, pb=0, pa=0;
            let divx = (radiusX + radiusX + 1) | 0;
            let divy = (radiusY + radiusY + 1) | 0;
            let w = imageData.width | 0;
            let h = imageData.height | 0;
            let w1 = (w - 1) | 0;
            let h1 = (h - 1) | 0;
            let rxp1 = (radiusX + 1) | 0;
            let ryp1 = (radiusY + 1) | 0;
            let ssx = {r:0,b:0,g:0,a:0};
            let sx:any = ssx;
            for ( i = 1; i < divx; i++ )
            {
                sx = sx.n = {r:0,b:0,g:0,a:0};
            }
            sx.n = ssx;
            let ssy = {r:0,b:0,g:0,a:0};
            let sy:any = ssy;
            for ( i = 1; i < divy; i++ )
            {
                sy = sy.n = {r:0,b:0,g:0,a:0};
            }
            sy.n = ssy;
            let si:any = null;
            let mtx = BlurFilter.MUL_TABLE[radiusX] | 0;
            let stx = BlurFilter.SHG_TABLE[radiusX] | 0;
            let mty = BlurFilter.MUL_TABLE[radiusY] | 0;
            let sty = BlurFilter.SHG_TABLE[radiusY] | 0;
            while (iterations-- > 0) {
                yw = yi = 0;
                let ms = mtx;
                let ss = stx;
                for (y = h; --y > -1;) {
                    r = rxp1 * (pr = px[(yi) | 0]);
                    g = rxp1 * (pg = px[(yi + 1) | 0]);
                    b = rxp1 * (pb = px[(yi + 2) | 0]);
                    a = rxp1 * (pa = px[(yi + 3) | 0]);
                    sx = ssx;
                    for( i = rxp1; --i > -1; )
                    {
                        sx.r = pr;
                        sx.g = pg;
                        sx.b = pb;
                        sx.a = pa;
                        sx = sx.n;
                    }
                    for( i = 1; i < rxp1; i++ )
                    {
                        p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
                        r += ( sx.r = px[p]);
                        g += ( sx.g = px[p+1]);
                        b += ( sx.b = px[p+2]);
                        a += ( sx.a = px[p+3]);

                        sx = sx.n;
                    }
                    si = ssx;
                    for ( x = 0; x < w; x++ )
                    {
                        px[yi++] = (r * ms) >>> ss;
                        px[yi++] = (g * ms) >>> ss;
                        px[yi++] = (b * ms) >>> ss;
                        px[yi++] = (a * ms) >>> ss;
                        p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);
                        r -= si.r - ( si.r = px[p]);
                        g -= si.g - ( si.g = px[p+1]);
                        b -= si.b - ( si.b = px[p+2]);
                        a -= si.a - ( si.a = px[p+3]);
                        si = si.n;
                    }
                    yw += w;
                }
                ms = mty;
                ss = sty;
                for (x = 0; x < w; x++) {
                    yi = (x << 2) | 0;
                    r = (ryp1 * (pr = px[yi])) | 0;
                    g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
                    b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
                    a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;
                    sy = ssy;
                    for( i = 0; i < ryp1; i++ )
                    {
                        sy.r = pr;
                        sy.g = pg;
                        sy.b = pb;
                        sy.a = pa;
                        sy = sy.n;
                    }
                    yp = w;
                    for( i = 1; i <= radiusY; i++ )
                    {
                        yi = ( yp + x ) << 2;
                        r += ( sy.r = px[yi]);
                        g += ( sy.g = px[yi+1]);
                        b += ( sy.b = px[yi+2]);
                        a += ( sy.a = px[yi+3]);
                        sy = sy.n;
                        if( i < h1 )
                        {
                            yp += w;
                        }
                    }
                    yi = x;
                    si = ssy;
                    if ( iterations > 0 )
                    {
                        for ( y = 0; y < h; y++ )
                        {
                            p = yi << 2;
                            px[p+3] = pa =(a * ms) >>> ss;
                            if ( pa > 0 )
                            {
                                px[p]   = ((r * ms) >>> ss );
                                px[p+1] = ((g * ms) >>> ss );
                                px[p+2] = ((b * ms) >>> ss );
                            } else {
                                px[p] = px[p+1] = px[p+2] = 0
                            }
                            p = ( x + (( ( p = y + ryp1) < h1 ? p : h1 ) * w )) << 2;
                            r -= si.r - ( si.r = px[p]);
                            g -= si.g - ( si.g = px[p+1]);
                            b -= si.b - ( si.b = px[p+2]);
                            a -= si.a - ( si.a = px[p+3]);
                            si = si.n;
                            yi += w;
                        }
                    } else {
                        for ( y = 0; y < h; y++ )
                        {
                            p = yi << 2;
                            px[p+3] = pa =(a * ms) >>> ss;
                            if ( pa > 0 )
                            {
                                pa = 255 / pa;
                                px[p]   = ((r * ms) >>> ss ) * pa;
                                px[p+1] = ((g * ms) >>> ss ) * pa;
                                px[p+2] = ((b * ms) >>> ss ) * pa;
                            } else {
                                px[p] = px[p+1] = px[p+2] = 0
                            }
                            p = ( x + (( ( p = y + ryp1) < h1 ? p : h1 ) * w )) << 2;
                            r -= si.r - ( si.r = px[p]);
                            g -= si.g - ( si.g = px[p+1]);
                            b -= si.b - ( si.b = px[p+2]);
                            a -= si.a - ( si.a = px[p+3]);
                            si = si.n;
                            yi += w;
                        }
                    }
                }
            }
        }
    }
}