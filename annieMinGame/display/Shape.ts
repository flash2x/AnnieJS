/**
 * @module annie
 */
namespace annie {
    /**
     * 矢量对象
     * @class annie.Shape
     * @extends annie.Bitmap
     * @since 1.0.0
     * @public
     */
    export class Shape extends DisplayObject {
        public constructor() {
            super();
            let s=this;
            s._instanceType = "annie.Shape";
        }

        //一个数组，每个元素也是一个数组[类型 0是属性,1是方法,名字 执行的属性或方法名,参数]
        private _command: any = [];

        /**
         * 通过一系统参数获取生成颜色或渐变所需要的对象
         * 一般给用户使用较少,Annie2x工具自动使用
         * @method getGradientColor
         * @static
         * @param points
         * @param colors
         * @return {any}
         * @since 1.0.0
         * @public
         */
        public static getGradientColor(points: any, colors: any): any {
            let colorObj: any;
            let ctx = CanvasRender._ctx;
            if (points.length == 4) {
                colorObj = ctx.createLinearGradient(points[0], points[1], points[2], points[3]);
            } else {
                colorObj = ctx.createRadialGradient(points[0], points[1], 0, points[2], points[3], points[4]);
            }
            for (let i = 0, l = colors.length; i < l; i++) {
                colorObj.addColorStop(colors[i][0], Shape.getRGBA(colors[i][1], colors[i][2]));
            }
            return colorObj;
        }

        /**
         * 设置位图填充时需要使用的方法,一般给用户使用较少,Annie2x工具自动使用
         * @method getBitmapStyle
         * @static
         * @param {Image} image HTML Image元素
         * @return {CanvasPattern}
         * @public
         * @since 1.0.0
         */
        public static getBitmapStyle(image: any): any {
            let ctx = CanvasRender._ctx;
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
         * @return {string}
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

        private _isBitmapStroke: Array<number>;
        private _isBitmapFill: Array<number>;

        /**
         * 添加一条绘画指令,具体可以查阅Html Canvas画图方法
         * @method addDraw
         * @param {string} commandName ctx指令的方法名 如moveTo lineTo arcTo等
         * @param {Array} params
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public addDraw(commandName: string, params: Array<any>): void {
            let s = this;
            s._command[s._command.length] = [1, commandName, params];
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
         * @return {void}
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
            c[c.length] = [1, "moveTo", [x + w - rTR, y]];
            c[c.length] = [1, "arcTo", [x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR]];
            c[c.length] = [1, "lineTo", [x + w, y + h - rBR]];
            c[c.length] = [1, "arcTo", [x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR]];
            c[c.length] = [1, "lineTo", [x + rBL, y + h]];
            c[c.length] = [1, "arcTo", [x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL]];
            c[c.length] = [1, "lineTo", [x, y + rTL]];
            c[c.length] = [1, "arcTo", [x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL]];
            c[c.length] = [1, "closePath", []];
        }

        /**
         * 绘画时移动到某一点
         * @method moveTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public moveTo(x: number, y: number): void {
            this._command[this._command.length] = [1, "moveTo", [x, y]];
        }

        /**
         * 从上一点画到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method lineTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public lineTo(x: number, y: number): void {
            this._command[this._command.length] = [1, "lineTo", [x, y]];
        }

        /**
         * 从上一点画弧到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method arcTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public arcTo(x: number, y: number): void {
            this._command[this._command.length] = [1, "arcTo", [x, y]];
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
         * @return {void}
         */
        public quadraticCurveTo(cpX: number, cpY: number, x: number, y: number): void {
            this._command[this._command.length] = [1, "quadraticCurveTo", [cpX, cpY, x, y]];
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
         * @return {void}
         */
        public bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): void {
            this._command[this._command.length] = [1, "bezierCurveTo", [cp1X, cp1Y, cp2X, cp2Y, x, y]];
        }

        /**
         * 闭合一个绘画路径
         * @method closePath
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public closePath(): void {
            this._command[this._command.length] = [1, "closePath", []];
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
         * @return {void}
         */
        public drawRect(x: number, y: number, w: number, h: number): void {
            let c = this._command;
            c[c.length] = [1, "moveTo", [x, y]];
            c[c.length] = [1, "lineTo", [x + w, y]];
            c[c.length] = [1, "lineTo", [x + w, y + h]];
            c[c.length] = [1, "lineTo", [x, y + h]];
            c[c.length] = [1, "closePath", []];
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
         * @return {void}
         */
        public drawArc(x: number, y: number, radius: number, start: number, end: number): void {
            this._command[this._command.length] = [1, "arc", [x, y, radius, start / 180 * Math.PI, end / 180 * Math.PI]];
        }

        /**
         * 画一个圆
         * @method drawCircle
         * @param {number} x 圆心x
         * @param {number} y 圆心y
         * @param {number} radius 半径
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public drawCircle(x: number, y: number, radius: number): void {
            this._command[this._command.length] = [1, "arc", [x, y, radius, 0, 2 * Math.PI]];
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
         * @return {void}
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
            c[c.length] = [1, "moveTo", [x, ym]];
            c[c.length] = [1, "bezierCurveTo", [x, ym - oy, xm - ox, y, xm, y]];
            c[c.length] = [1, "bezierCurveTo", [xm + ox, y, xe, ym - oy, xe, ym]];
            c[c.length] = [1, "bezierCurveTo", [xe, ym + oy, xm + ox, ye, xm, ye]];
            c[c.length] = [1, "bezierCurveTo", [xm - ox, ye, x, ym + oy, x, ym]];
        }

        /**
         * 清除掉之前所有绘画的东西
         * @method clear
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public clear(): void {
            let s = this;
            s._command = [];
            s.a2x_ut = false;
            s.clearBounds();
        }

        /**
         * 开始绘画填充,如果想画的东西有颜色填充,一定要从此方法开始
         * @method beginFill
         * @param {string} color 颜色值 单色和RGBA格式
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public beginFill(color: string): void {
            this._fill(color);
        }

        /**
         * 线性渐变填充 一般给Annie2x用
         * @method beginLinearGradientFill
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @public
         * @since 1.0.0
         * @return {void}
         * @example
         *      var shape=new annie.Shape();
         *      shape.beginLinearGradientFill([0,0,200,0],[[0,"#ff0000",1],[0.164706,"#ffff00",1],[0.364706,"#00ff00",1],[0.498039,"#00ffff",1],[0.666667,"#0000ff",1],[0.831373,"#ff00ff",1],[1,"#ff0000",1]]);
         *      shape.drawRect(0,0,200,200);
         *      shape.endFill();
         *      s.addChild(shape);
         */
        public beginLinearGradientFill(points: any, colors: any): void {
            this._fill(Shape.getGradientColor(points, colors));
        }

        /**
         * 径向渐变填充 一般给Annie2x用
         * @method beginRadialGradientFill
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
         * @public
         * @since 1.0.0
         * @return {void}
         * @example
         *      var shape=new annie.Shape();
         *      shape.beginRadialGradientFill([100,100,100,100,100],[[0,"#00ff00",1],[1,"#000000",1]]);
         *      shape.drawRect(0,0,200,200);
         *      shape.endFill();
         *      s.addChild(shape);
         */
        public beginRadialGradientFill = function (points: any, colors: any): void {
            this._fill(Shape.getGradientColor(points, colors));
        };

        /**
         * 位图填充 一般给Annie2x用
         * @method beginBitmapFill
         * @param {Image} image
         * @param { Array} matrix
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public beginBitmapFill(image: any, matrix: Array<number>): void {
            let s = this;
            if (matrix) {
                s._isBitmapFill = matrix;
            }
            s._fill(Shape.getBitmapStyle(image));
        }

        private _fill(fillStyle: any): void {
            let s = this;
            let c = s._command;
            c[c.length] = [0, "fillStyle", fillStyle];
            c[c.length] = [1, "beginPath", []];
        }

        /**
         * 给线条着色
         * @method beginStroke
         * @param {string} color  颜色值
         * @param {number} lineWidth 宽度
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public beginStroke(color: string, lineWidth: number = 1, cap: number = 0, join: number = 0, miter: number = 0): void {
            this._stroke(color, lineWidth, cap, join, miter);
        }

        private static _caps: Array<string> = ["butt", "round", "square"];
        private static _joins: Array<string> = ["miter", "round", "bevel"];

        /**
         * 画线性渐变的线条 一般给Annie2x用
         * @method beginLinearGradientStroke
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {number} lineWidth
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public beginLinearGradientStroke(points: Array<number>, colors: any, lineWidth: number = 1, cap: number = 0, join: number = 0, miter: number = 10): void {
            this._stroke(Shape.getGradientColor(points, colors), lineWidth, cap, join, miter);
        }

        /**
         * 画径向渐变的线条 一般给Annie2x用
         * @method beginRadialGradientStroke
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public beginRadialGradientStroke = function (points: Array<number>, colors: any, lineWidth: number = 1, cap: number = 0, join: number = 0, miter: number = 10) {
            this._stroke(Shape.getGradientColor(points, colors), lineWidth, cap, join, miter);
        };

        /**
         * 线条位图填充 一般给Annie2x用
         * @method beginBitmapStroke
         * @param {Image} image
         * @param {Array} matrix
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public beginBitmapStroke(image: any, matrix: Array<number>, lineWidth: number = 1, cap: number = 0, join: number = 0, miter: number = 10): void {
            let s = this;
            if (matrix) {
                s._isBitmapStroke = matrix;
            }
            s._stroke(Shape.getBitmapStyle(image), lineWidth, cap, join, miter);
        }

        private _stroke(strokeStyle: any, width: number, cap: number, join: number, miter: number): void {
            let c = this._command;
            c[c.length] = [0, "lineWidth", width];
            c[c.length] = [0, "lineCap", Shape._caps[cap]];
            c[c.length] = [0, "lineJoin", Shape._joins[join]];
            c[c.length] = [0, "miterLimit", miter];
            c[c.length] = [0, "strokeStyle", strokeStyle];
            c[c.length] = [1, "beginPath", []];

        }

        /**
         * 结束填充
         * @method endFill
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public endFill(): void {
            let s = this;
            let c = s._command;
            let m = s._isBitmapFill;
            if (m) {
                c[c.length] = [2, "setTransform", m];
            }
            c[c.length] = ([1, "fill", []]);
            if (m) {
                s._isBitmapFill = null;
            }
            s.a2x_ut = true;
        }

        /**
         * 设置虚线参数
         * @method setLineDash
         * @param {Array} data 一个长度为2的数组，第1个是虚线长度，第2个是虚线间隔，如果此参数为[]的空数组，则是清除虚线。
         *                如[5,20]是画虚线,[]则是请除虚线，变为实线
         * @since 2.0.2
         * @return {void}
         */
        public setLineDash(data: Array<number> = []): void {
            let c = this._command;
            c[c.length] = [1, "setLineDash", [data, 0]];
        }

        /**
         * 结束画线
         * @method endStroke
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public endStroke(): void {
            let s = this;
            let c = s._command;
            let m = s._isBitmapStroke;
            if (m) {
                //如果为2则还需要特别处理
                c[c.length] = [2, "setTransform", m];
            }
            c[c.length] = ([1, "stroke", []]);
            if (m) {
                s._isBitmapStroke = null;
            }
            s.a2x_ut = true;
        }

        /**
         * 解析一段路径 一般给Annie2x用
         * @method decodePath
         * @param {Array} data
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public decodePath(data: Array<number>): void {
            let s = this;
            let instructions = ["moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "closePath"];
            let count = data.length;
            for (let i = 0; i < count; i++) {
                if (data[i] == 0 || data[i] == 1) {
                    s.addDraw(instructions[data[i]], [data[i + 1], data[i + 2]]);
                    i += 2;
                } else {
                    s.addDraw(instructions[data[i]], [data[i + 1], data[i + 2], data[i + 3], data[i + 4]]);
                    i += 4;
                }
            }
            s.a2x_ut = true;
        };
        //是否矢量元素有更新
        private a2x_ut: boolean = true;
        protected _updateMatrix(): void {
            super._updateMatrix();
            let s: any = this;
            if (s.a2x_ut){
                s.a2x_ut = false;
                //更新矢量
                let cLen: number = s._command.length;
                let leftX: number;
                let leftY: number;
                let buttonRightX: number;
                let buttonRightY: number;
                let i: number;
                if (cLen > 0) {
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
                            if (data[1] == "lineWidth") {
                                if (lineWidth < data[2]) {
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
                        leftX -=lineWidth;
                        leftY -=lineWidth;
                        buttonRightX += lineWidth;
                        buttonRightY += lineWidth;
                        let width = buttonRightX - leftX;
                        let height = buttonRightY - leftY;
                        // s._offsetX = leftX;
                        // s._offsetY = leftY;
                        s._bounds.x = leftX;
                        s._bounds.y = leftY;
                        s._bounds.width = width;
                        s._bounds.height = height;
                        s.a2x_um=true;
                    }
                }
            }
            if(s.a2x_um){
                s._checkDrawBounds();
            }
            s.a2x_um = false;
            s.a2x_ua = false;
        }
        public _draw(ctx: any, isMask: boolean = false): void {
            let s = this;
            let com = s._command;
            let cLen = com.length;
            let data: any;
            ctx.translate(s._offsetX, s._offsetY);
            let isStroke = false;
            for (let i = 0; i < cLen; i++) {
                data = com[i];
                if (data[0] > 0) {
                    let paramsLen = data[2].length;
                    if (isMask && (isStroke || data[1] == "beginPath" || data[1] == "closePath" || paramsLen == 0)) continue;
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
                       /* if (data[0] == 2) {
                            //位图填充
                            lx -= leftX;
                            ly -= leftY;
                        }*/
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], lx, ly);
                    }
                } else {
                    if (isMask) {
                        if (data[1] == "strokeStyle") {
                            isStroke = true;
                        } else if (data[1] == "fillStyle") {
                            isStroke = false;
                        }
                    } else {
                        ctx[data[1]] = data[2];
                    }
                }
            }
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
         * @return {void}
         */
        public changeColor(infoObj: any): void {
            let s = this;
            let cLen: number = s._command.length;
            let c = s._command;
            for (let i = 0; i < cLen; i++) {
                if (c[i][0] == 0) {
                    if (c[i][1] == "fillStyle" && infoObj.fillColor && c[i][2] != infoObj.fillColor) {
                        c[i][2] = infoObj.fillColor;
                        s.a2x_ut = true;
                    }
                    if (c[i][1] == "strokeStyle" && infoObj.strokeColor && c[i][2] != infoObj.strokeColor) {
                        c[i][2] = infoObj.strokeColor;
                        s.a2x_ut = true;
                    }
                    if (c[i][1] == "lineWidth" && infoObj.lineWidth && c[i][2] != infoObj.lineWidth) {
                        c[i][2] = infoObj.lineWidth;
                        s.a2x_ut = true;
                    }
                }
            }
        }

        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            s._command = null;
            s._isBitmapStroke = null;
            s._isBitmapFill = null;
            super.destroy();
        }
    }
}