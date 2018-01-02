/**
 * @module annie
 */
namespace annie {
    /**
     * 矢量对象
     * @class annie.Shape
     * @extends annie.DisplayObject
     * @since 1.0.0
     * @public
     */
    export class Shape extends DisplayObject {
        public constructor() {
            super();
            this._instanceType = "annie.Shape";
            this._texture=window.document.createElement("canvas");
        }

        /**
         * 一个数组，每个元素也是一个数组[类型 0是属性,1是方法,名字 执行的属性或方法名,参数]
         * @property _command
         * @private
         * @since 1.0.0
         * @type {Array}
         * @default []
         */
        private _command: any = [];

        /**
         * 通过一系统参数获取生成颜色或渐变所需要的对象
         * 一般给用户使用较少,Flash2x工具自动使用
         * @method getGradientColor
         * @static
         * @param {string} colors
         * @param {number}ratios
         * @param {annie.Point} points
         * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
         * @returns {any}
         * @since 1.0.0
         * @pubic
         */
        public static getGradientColor(colors: Array<string>, ratios: Array<number>, points: Array<number>): any {
            let colorObj: any;
            let ctx = DisplayObject["_canvas"].getContext("2d");
            if (points.length == 4) {
                colorObj = ctx.createLinearGradient(points[0], points[1], points[2], points[3]);
            } else {
                colorObj = ctx.createRadialGradient(points[0], points[1], points[2], points[3], points[4], points[5]);
            }
            for (let i = 0, l = colors.length; i < l; i++) {
                colorObj.addColorStop(ratios[i], colors[i]);
            }
            return colorObj;
        }
        /**
         * 设置位图填充时需要使用的方法,一般给用户使用较少,Flash2x工具自动使用
         * @method getBitmapStyle
         * @static
         * @param {Image} image HTML Image元素
         * @returns {CanvasPattern}
         * @public
         * @since 1.0.0
         */
        public static getBitmapStyle(image: any): any {
            let ctx = DisplayObject["_canvas"].getContext("2d");
            return ctx.createPattern(image, "repeat");
        }

        /**
         * 通过24位颜色值和一个透明度值生成RGBA值
         * @method getRGBA
         * @static
         * @public
         * @since 1.0.0
         * @param {string} color 字符串的颜色值,如:#33ffee
         * @param {number} alpha 0-1区间的一个数据 0完全透明 1完全不透明
         * @returns {string}
         */
        public static getRGBA(color: string, alpha: number): string {
            if (color.indexOf("0x") == 0) {
                color = color.replace("0x", "#");
            }
            if (color.length < 7) {
                color = "#000000";
            }
            if (alpha != 1) {
                let r = parseInt("0x" + color.substr(1, 2));
                let g = parseInt("0x" + color.substr(3, 2));
                let b = parseInt("0x" + color.substr(5, 2));
                color = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
            }
            return color;
        }
        private _isBitmapStroke: Matrix;
        private _isBitmapFill: Matrix;
        /**
         * 是否对矢量使用像素碰撞 默认开启
         * @property hitTestWidthPixel
         * @type {boolean}
         * @default true
         * @since 1.1.0
         */
        public hitTestWidthPixel: boolean = true;

        /**
         * 添加一条绘画指令,具体可以查阅Html Canvas画图方法
         * @method addDraw
         * @param {string} commandName ctx指令的方法名 如moveTo lineTo arcTo等
         * @param {Array} params
         * @public
         * @since 1.0.0
         */
        public addDraw(commandName: string, params: Array<any>):void{
            let s = this;
            s._UI.UD = true;
            s._command.push([1, commandName, params]);
        }

        /**
         * 画一个带圆角的矩形
         * @method drawRoundRect
         * @param {number} x 点x值
         * @param {number} y 点y值
         * @param {number} w 宽
         * @param {number} h 高
         * @param {number} rTL 左上圆角半径
         * @param {number} rTR 右上圆角半径
         * @param {number} rBL 左下圆角半径
         * @param {number} rBR 右上圆角半径
         * @public
         * @since 1.0.0
         */
        public drawRoundRect(x: number, y: number, w: number, h: number, rTL: number = 0, rTR: number = 0, rBL: number = 0, rBR: number = 0): void {
            let max = (w < h ? w : h) / 2;
            let mTL = 0, mTR = 0, mBR = 0, mBL = 0;
            if (rTL < 0) {
                rTL *= (mTL = -1);
            }
            if (rTL > max) {
                rTL = max;
            }
            if (rTR < 0) {
                rTR *= (mTR = -1);
            }
            if (rTR > max) {
                rTR = max;
            }
            if (rBR < 0) {
                rBR *= (mBR = -1);
            }
            if (rBR > max) {
                rBR = max;
            }
            if (rBL < 0) {
                rBL *= (mBL = -1);
            }
            if (rBL > max) {
                rBL = max;
            }
            let c = this._command;
            c.push([1, "moveTo", [x + w - rTR, y]]);
            c.push([1, "arcTo", [x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR]]);
            c.push([1, "lineTo", [x + w, y + h - rBR]]);
            c.push([1, "arcTo", [x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR]]);
            c.push([1, "lineTo", [x + rBL, y + h]]);
            c.push([1, "arcTo", [x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL]]);
            c.push([1, "lineTo", [x, y + rTL]]);
            c.push([1, "arcTo", [x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL]]);
            c.push([1, "closePath", []]);
        }

        /**
         * 绘画时移动到某一点
         * @method moveTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        public moveTo(x: number, y: number): void {
            this._command.push([1, "moveTo", [x, y]]);
        }

        /**
         * 从上一点画到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method lineTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        public lineTo(x: number, y: number): void {
            this._command.push([1, "lineTo", [x, y]]);
        }

        /**
         * 从上一点画弧到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method arcTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        public arcTo(x: number, y: number): void {
            this._command.push([1, "arcTo", [x, y]]);
        }

        /**
         * 二次贝赛尔曲线
         * 从上一点画二次贝赛尔曲线到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method quadraticCurveTo
         * @param {number} cpX 控制点X
         * @param {number} cpX 控制点Y
         * @param {number} x 终点X
         * @param {number} y 终点Y
         * @public
         * @since 1.0.0
         */
        public quadraticCurveTo(cpX: number, cpY: number, x: number, y: number): void {
            this._command.push([1, "quadraticCurveTo", [cpX, cpY, x, y]]);
        }

        /**
         * 三次贝赛尔曲线
         * 从上一点画二次贝赛尔曲线到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method bezierCurveTo
         * @param {number} cp1X 1控制点X
         * @param {number} cp1Y 1控制点Y
         * @param {number} cp2X 2控制点X
         * @param {number} cp2Y 2控制点Y
         * @param {number} x 终点X
         * @param {number} y 终点Y
         * @public
         * @since 1.0.0
         */
        public bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): void {
            this._command.push([1, "bezierCurveTo", [cp1X, cp1Y, cp2X, cp2Y, x, y]]);
        }

        /**
         * 闭合一个绘画路径
         * @method closePath
         * @public
         * @since 1.0.0
         */
        public closePath(): void {
            this._command.push([1, "closePath", []]);
        }

        /**
         * 画一个矩形
         * @method drawRect
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @public
         * @since 1.0.0
         */
        public drawRect(x: number, y: number, w: number, h: number): void {
            let c = this._command;
            c.push([1, "moveTo", [x, y]]);
            c.push([1, "lineTo", [x + w, y]]);
            c.push([1, "lineTo", [x + w, y + h]]);
            c.push([1, "lineTo", [x, y + h]]);
            c.push([1, "closePath", []]);
        }

        /**
         * 画一个弧形
         * @method drawArc
         * @param {number} x 起始点x
         * @param {number} y 起始点y
         * @param {number} radius 半径
         * @param {number} start 开始角度
         * @param {number} end 结束角度
         * @public
         * @since 1.0.0
         */
        public drawArc(x: number, y: number, radius: number, start: number, end: number): void {
            this._command.push([1, "arc", [x, y, radius, start / 180 * Math.PI, end / 180 * Math.PI]]);
        }

        /**
         * 画一个圆
         * @method drawCircle
         * @param {number} x 圆心x
         * @param {number} y 圆心y
         * @param {number} radius 半径
         * @public
         * @since 1.0.0
         */
        public drawCircle(x: number, y: number, radius: number): void {
            this._command.push([1, "arc", [x, y, radius, 0, 2 * Math.PI]]);
        }

        /**
         * 画一个椭圆
         * @method drawEllipse
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @public
         * @since 1.0.0
         */
        public drawEllipse(x: number, y: number, w: number, h: number): void {
            let k = 0.5522848;
            let ox = (w / 2) * k;
            let oy = (h / 2) * k;
            let xe = x + w;
            let ye = y + h;
            let xm = x + w / 2;
            let ym = y + h / 2;
            let c = this._command;
            c.push([1, "moveTo", [x, ym]]);
            c.push([1, "bezierCurveTo", [x, ym - oy, xm - ox, y, xm, y]]);
            c.push([1, "bezierCurveTo", [xm + ox, y, xe, ym - oy, xe, ym]]);
            c.push([1, "bezierCurveTo", [xe, ym + oy, xm + ox, ye, xm, ye]]);
            c.push([1, "bezierCurveTo", [xm - ox, ye, x, ym + oy, x, ym]]);
        }

        /**
         * 清除掉之前所有绘画的东西
         * @method clear
         * @public
         * @since 1.0.0
         */
        public clear(): void {
            let s = this;
            s._command = [];
            s._UI.UD = true;
            if (s._texture) {
                s._texture.width = 0;
                s._texture.height = 0;
            }
            s._offsetX = 0;
            s._offsetY = 0;
            s._bounds.width = 0;
            s._bounds.height = 0;
        }

        /**
         * 开始绘画填充,如果想画的东西有颜色填充,一定要从此方法开始
         * @method beginFill
         * @param {string} color 颜色值 单色和RGBA格式
         * @public
         * @since 1.0.0
         */
        public beginFill(color: string): void {
            this._fill(color);
        }

        /**
         * 线性渐变填充 一般给Flash2x用
         * @method beginLinearGradientFill
         * @param {Array} colors 一组颜色值
         * @param {Array} ratios 一组范围比例值
         * @param {Array} points 一组点
         * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
         * @public
         * @since 1.0.0
         */
        public beginLinearGradientFill(colors: Array<string>, ratios: Array<number>, points: Array<number>): void {
            this._fill(Shape.getGradientColor(colors, ratios, points));
        }

        /**
         * 径向渐变填充 一般给Flash2x用
         * @method beginRadialGradientFill
         * @param {Array} colors 一组颜色值
         * @param {Array} ratios 一组范围比例值
         * @param {Array} points 一组点
        * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
         * @public
         * @since 1.0.0
         */
        public beginRadialGradientFill = function (colors: Array<string>, ratios: Array<number>, points: Array<number>) {
            this._fill(Shape.getGradientColor(colors, ratios, points));
        };

        /**
         * 位图填充 一般给Flash2x用
         * @method beginBitmapFill
         * @param {Image} image
         * @param {annie.Matrix} matrix
         * @public
         * @since 1.0.0
         */
        public beginBitmapFill(image: any, matrix: Matrix): void {
            let s = this;
            if (matrix) {
                s._isBitmapFill = matrix;
            }
            s._fill(Shape.getBitmapStyle(image));
        }

        private _fill(fillStyle: any): void {
            let c = this._command;
            c.push([0, "fillStyle", fillStyle]);
            c.push([1, "beginPath", []]);
            this._UI.UD = true;
        }

        /**
         * 给线条着色
         * @method beginStroke
         * @param {string} color  颜色值
         * @param {number} lineWidth 宽度
         * @public
         * @since 1.0.0
         */
        public beginStroke(color: string, lineWidth: number = 1, cap: string = "", join: string = "", miter: number = 0): void {
            this._stroke(color, lineWidth, cap, join, miter);
        }

        /**
         * 画线性渐变的线条 一般给Flash2x用
         * @method beginLinearGradientStroke
         * @param {Array} colors 一组颜色值
         * @param {Array} ratios 一组范围比例值
         * @param {Array} points 一组点
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        public beginLinearGradientStroke(colors: Array<string>, ratios: Array<number>, points: Array<number>, lineWidth: number = 1,cap: string = "butt", join: string = "miter", miter: number = 10): void {
            this._stroke(Shape.getGradientColor(colors, ratios, points), lineWidth, cap, join, miter);
        }

        /**
         * 画径向渐变的线条 一般给Flash2x用
         * @method beginRadialGradientStroke
         * @param {Array} colors 一组颜色值
         * @param {Array} ratios 一组范围比例值
         * @param {Array} points 一组点
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        public beginRadialGradientStroke = function (colors: Array<string>, ratios: Array<number>, points: Array<number>, lineWidth: number = 1, cap: string = "butt", join: string = "miter", miter: number = 10) {
            this._stroke(Shape.getGradientColor(colors, ratios, points), lineWidth, cap, join, miter);
        }

        /**
         * 线条位图填充 一般给Flash2x用
         * @method beginBitmapStroke
         * @param {Image} image
         * @param {annie.Matrix} matrix
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        public beginBitmapStroke(image: any, matrix: Matrix, lineWidth: number = 1, cap: string = "butt", join: string = "miter", miter: number = 10): void {
            let s = this;
            if (matrix) {
                s._isBitmapStroke = matrix;
            }
            s._stroke(Shape.getBitmapStyle(image), lineWidth, cap, join, miter);
        }

        private _stroke(strokeStyle: any, width: number, cap: string, join: string, miter: number): void {
            let c = this._command;
            c.push([0, "lineWidth", width]);
            c.push([0, "lineCap", cap]);
            c.push([0, "lineJoin", join]);
            c.push([0, "miterLimit", miter]);
            c.push([0, "strokeStyle", strokeStyle]);
            c.push([1, "beginPath", []]);
            this._UI.UD = true;
        }

        /**
         * 结束填充
         * @method endFill
         * @public
         * @since 1.0.0
         */
        public endFill(): void {
            let s = this;
            let c = s._command;
            let m = s._isBitmapFill;
            if (m) {
                //c.push([1, "save", []]);
                c.push([2, "setTransform", [m.a, m.b, m.c, m.d, m.tx, m.ty]]);
            }
            c.push([1, "fill", []]);
            if (m) {
                s._isBitmapFill = null;
                //c.push([1, "restore", []]);
            }
        }

        /**
         * 结束画线
         * @method endStroke
         * @public
         * @since 1.0.0
         */
        public endStroke(): void {
            let s = this;
            let c = s._command;
            let m = s._isBitmapStroke;
            if (m) {
                //c.push([1, "save", []]);
                //如果为2则还需要特别处理
                c.push([2, "setTransform", [m.a, m.b, m.c, m.d, m.tx, m.ty]]);
            }
            c.push([1, "stroke", []]);
            if (m) {
                s._isBitmapStroke = null;
                // c.push([1, "restore", []]);
            }
        }

        private static BASE_64 = {
            "A": 0,
            "B": 1,
            "C": 2,
            "D": 3,
            "E": 4,
            "F": 5,
            "G": 6,
            "H": 7,
            "I": 8,
            "J": 9,
            "K": 10,
            "L": 11,
            "M": 12,
            "N": 13,
            "O": 14,
            "P": 15,
            "Q": 16,
            "R": 17,
            "S": 18,
            "T": 19,
            "U": 20,
            "V": 21,
            "W": 22,
            "X": 23,
            "Y": 24,
            "Z": 25,
            "a": 26,
            "b": 27,
            "c": 28,
            "d": 29,
            "e": 30,
            "f": 31,
            "g": 32,
            "h": 33,
            "i": 34,
            "j": 35,
            "k": 36,
            "l": 37,
            "m": 38,
            "n": 39,
            "o": 40,
            "p": 41,
            "q": 42,
            "r": 43,
            "s": 44,
            "t": 45,
            "u": 46,
            "v": 47,
            "w": 48,
            "x": 49,
            "y": 50,
            "z": 51,
            "0": 52,
            "1": 53,
            "2": 54,
            "3": 55,
            "4": 56,
            "5": 57,
            "6": 58,
            "7": 59,
            "8": 60,
            "9": 61,
            "+": 62,
            "/": 63
        };
        /**
         * 解析一段路径 一般给Flash2x用
         * @method decodePath
         * @param {string} data
         * @public
         * @since 1.0.0
         */
        public decodePath = function (data: string): void {
            let s = this;
            let instructions = ["moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "closePath"];
            let paramCount = [2, 2, 4, 6, 0];
            let i = 0, l = data.length;
            let params: any;
            let x = 0, y = 0;
            let base64: any = Shape.BASE_64;
            while (i < l) {
                let c = data.charAt(i);
                let n: any = base64[c];
                let fi = n >> 3; // highest order bits 1-3 code for operation.
                let f = instructions[fi];
                // check that we have a valid instruction & that the unused bits are empty:
                if (!f || (n & 3)) {
                    throw("bad path data (@" + i + "): " + c);
                }
                let pl = paramCount[fi];
                if (!fi) {
                    x = y = 0;
                } // move operations reset the position.
                params = [];
                i++;
                let charCount = (n >> 2 & 1) + 2;  // 4th header bit indicates number size for this operation.
                for (let p = 0; p < pl; p++) {
                    let num: any = base64[data.charAt(i)];
                    let sign = (num >> 5) ? -1 : 1;
                    num = ((num & 31) << 6) | (base64[data.charAt(i + 1)]);
                    if (charCount == 3) {
                        num = (num << 6) | (base64[data.charAt(i + 2)]);
                    }
                    num = sign * num / 10;
                    if (p % 2) {
                        x = (num += x);
                    }
                    else {
                        y = (num += y);
                    }
                    params[p] = num;
                    i += charCount;
                }
                s.addDraw(f, params);
            }
        };
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        public update(isDrawUpdate:boolean=false): void {
            let s = this;
            if(!s._visible)return;
            super.update(isDrawUpdate);
            if (s._UI.UD || s._UI.UF){
                //更新缓存
                let cLen: number = s._command.length;
                let leftX: number;
                let leftY: number;
                let buttonRightX: number;
                let buttonRightY: number;
                let i: number;
                if (cLen > 0){
                    //确定是否有数据,如果有数据的话就计算出缓存图的宽和高
                    let data: any;
                    let lastX = 0;
                    let lastY = 0;
                    let lineWidth = 0;
                    for (i = 0; i < cLen; i++) {
                        data = s._command[i];
                        if (data[0] == 1) {
                            if (data[1] == "moveTo" || data[1] == "lineTo" || data[1] == "arcTo" || data[1] == "bezierCurveTo") {
                                if (leftX == undefined) {
                                    leftX = data[2][0];
                                }
                                if (leftY == undefined) {
                                    leftY = data[2][1];
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = data[2][0];
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = data[2][1];
                                }

                                if (data[1] == "bezierCurveTo") {
                                    leftX = Math.min(leftX, data[2][0], data[2][2], data[2][4]);
                                    leftY = Math.min(leftY, data[2][1], data[2][3], data[2][5]);
                                    buttonRightX = Math.max(buttonRightX, data[2][0], data[2][2], data[2][4]);
                                    buttonRightY = Math.max(buttonRightY, data[2][1], data[2][3], data[2][5]);
                                    lastX = data[2][4];
                                    lastY = data[2][5];
                                } else {
                                    leftX = Math.min(leftX, data[2][0]);
                                    leftY = Math.min(leftY, data[2][1]);
                                    buttonRightX = Math.max(buttonRightX, data[2][0]);
                                    buttonRightY = Math.max(buttonRightY, data[2][1]);
                                    lastX = data[2][0];
                                    lastY = data[2][1];
                                }
                            } else if (data[1] == "quadraticCurveTo") {
                                //求中点
                                let mid1X = (lastX + data[2][0]) * 0.5;
                                let mid1Y = (lastY + data[2][1]) * 0.5;
                                let mid2X = (data[2][0] + data[2][2]) * 0.5;
                                let mid2Y = (data[2][1] + data[2][3]) * 0.5;
                                if (leftX == undefined) {
                                    leftX = mid1X;
                                }
                                if (leftY == undefined) {
                                    leftY = mid1Y;
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = mid1X;
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = mid1Y;
                                }
                                leftX = Math.min(leftX, mid1X, mid2X, data[2][2]);
                                leftY = Math.min(leftY, mid1Y, mid2Y, data[2][3]);
                                buttonRightX = Math.max(buttonRightX, mid1X, mid2X, data[2][2]);
                                buttonRightY = Math.max(buttonRightY, mid1Y, mid2Y, data[2][3]);
                                lastX = data[2][2];
                                lastY = data[2][3];
                            } else if (data[1] == "arc") {
                                let yuanPointX = data[2][0];
                                let yuanPointY = data[2][1];
                                let radio = data[2][2];
                                let yuanLeftX = yuanPointX - radio;
                                let yuanLeftY = yuanPointY - radio;
                                let yuanBRX = yuanPointX + radio;
                                let yuanBRY = yuanPointY + radio;
                                if (leftX == undefined) {
                                    leftX = yuanLeftX;
                                }
                                if (leftY == undefined) {
                                    leftY = yuanLeftY;
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = yuanBRX;
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = yuanBRY;
                                }
                                leftX = Math.min(leftX, yuanLeftX);
                                leftY = Math.min(leftY, yuanLeftY);
                                buttonRightX = Math.max(buttonRightX, yuanBRX);
                                buttonRightY = Math.max(buttonRightY, yuanBRY);
                            }
                        } else {
                            if (data[1] == "lineWidth"){
                                if (lineWidth < data[2]){
                                    lineWidth = data[2];
                                }
                            }
                        }
                    }
                    if (leftX != undefined || lineWidth > 0) {
                        if (leftX == undefined) {
                            leftX = 0;
                            leftY = 0;
                        }
                        leftX -= 20 + lineWidth >> 1;
                        leftY -= 20 + lineWidth >> 1;
                        buttonRightX += 20 + lineWidth >> 1;
                        buttonRightY += 20 + lineWidth >> 1;
                        let w = buttonRightX - leftX;
                        let h = buttonRightY - leftY;
                        s._offsetX = leftX;
                        s._offsetY = leftY;
                        s._bounds.x=leftX;
                        s._bounds.y=leftY;
                        s._bounds.width = w-20;
                        s._bounds.height = h-20;
                        ///////////////////////////是否是遮罩对象,如果是遮罩对象///////////////////////////
                        if(!s.isUseToMask&&!s.parent.isUseToMask){
                            let _canvas: any = s._texture;
                            let ctx = _canvas["getContext"]('2d');
                            _canvas.width = w;
                            _canvas.height = h;
                            _canvas.style.width = w / devicePixelRatio + "px";
                            _canvas.style.height = h / devicePixelRatio + "px";
                            ctx.clearRect(0, 0, w, h);
                            ctx.setTransform(1, 0, 0, 1, -leftX, -leftY);
                            ////////////////////
                            s._drawShape(ctx);
                            ///////////////////////////
                            //滤镜
                            let cf = s.cFilters;
                            let cfLen = cf.length;
                            if (cfLen > 0) {
                                let imageData = ctx.getImageData(0, 0, w, h);
                                for (let i = 0; i < cfLen; i++) {
                                    cf[i].drawFilter(imageData);
                                }
                                ctx.putImageData(imageData, 0, 0);
                            }
                            //给webgl更新新
                            //_canvas.updateTexture = true;
                        }
                    }
                }
                s._UI.UD = false;
            }
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
        }

        private _drawShape(ctx: any, isMask: boolean = false): void {
            let s = this;
            let com = s._command;
            let cLen = com.length;
            let data: any;
            let leftX: number = s._offsetX;
            let leftY: number = s._offsetY;
            for (let i = 0; i < cLen; i++) {
                data = com[i];
                if (data[0] > 0) {
                    let paramsLen = data[2].length;
                    if (paramsLen == 0) {
                        ctx[data[1]]();
                    } else if (paramsLen == 2) {
                        ctx[data[1]](data[2][0], data[2][1]);
                    } else if (paramsLen == 4) {
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3]);
                    } else if (paramsLen == 5) {
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], data[2][4]);
                    } else if (paramsLen == 6) {
                        let lx = data[2][4];
                        let ly = data[2][5];
                        if (data[0] == 2) {
                            //位图填充
                            lx -= leftX;
                            ly -= leftY;
                        }
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], lx, ly);
                    }
                } else {
                    if (!isMask)
                        ctx[data[1]] = data[2];
                }
            }
        }
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        public hitTestPoint(globalPoint: Point, isMouseEvent: boolean = false): DisplayObject {
            let s = this;
            if (isMouseEvent && !s.mouseEnable)return null;
            //如果都不在缓存范围内,那就更不在矢量范围内了;如果在则继续看
            let p:Point = globalPoint;
            if(isMouseEvent) {
                p=s.globalToLocal(globalPoint);
            }
            if (s.getBounds().isPointIn(p)){
                if (s.hitTestWidthPixel) {
                    let image = s._texture;
                    if (!image || image.width == 0 || image.height == 0) {
                        return null;
                    }
                    let _canvas = DisplayObject["_canvas"];
                    _canvas.width = 1;
                    _canvas.height = 1;
                    p.x -= s._offsetX;
                    p.y -= s._offsetY;
                    let ctx = _canvas["getContext"]('2d');
                    ctx.clearRect(0, 0, 1, 1);
                    ctx.setTransform(1, 0, 0, 1, -p.x, -p.y);
                    ctx.drawImage(image, 0, 0);
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 0) {
                        return s;
                    }
                } else {
                    return s;
                }
            }
            return null;
        }
        /**
         * 如果有的话,改变矢量对象的边框或者填充的颜色.
         * @method changeColor
         * @param {Object} infoObj
         * @param {string|any} infoObj.fillColor 填充颜色值，如"#fff" 或者 "rgba(255,255,255,1)"或者是annie.Shape.getGradientColor()方法返回的渐变对象;
         * @param {string} infoObj.strokeColor 线条颜色值，如"#fff" 或者 "rgba(255,255,255,1)";
         * @param {number} infoObj.lineWidth 线条的粗细，如"1,2,3...";
         * @public
         * @since 1.0.2
         */
        public changeColor(infoObj: any): void{
            let s = this;
            let cLen: number = s._command.length;
            let c = s._command;
            for (let i = 0; i < cLen; i++) {
                if (c[i][0] == 0) {
                    if (c[i][1] == "fillStyle" && infoObj.fillColor && c[i][2] != infoObj.fillColor) {
                        c[i][2] = infoObj.fillColor;
                        s._UI.UD = true;
                    }
                    if (c[i][1] == "strokeStyle" && infoObj.strokeColor && c[i][2] != infoObj.strokeColor) {
                        c[i][2] = infoObj.strokeColor;
                        s._UI.UD = true;
                    }
                    if (c[i][1] == "lineWidth" && infoObj.lineWidth && c[i][2] != infoObj.lineWidth) {
                        c[i][2] = infoObj.lineWidth;
                        s._UI.UD = true;
                    }
                }
            }
        }
    }
}