/**
 * @module annie
 */
namespace annie {
    var PI:number = Math.PI;
    var HalfPI:number = PI>>1;
    var PacPI:number = PI + HalfPI;
    var TwoPI:number = PI<<1;
    var DEG_TO_RAD:number = Math.PI / 180;
    function cos(angle:number):number {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 0;
            case PI:
            case -PI:
                return -1;
            case PacPI:
            case -HalfPI:
                return 0;
            default:
                return Math.cos(angle);
        }
    }

    /**
     * @private
     */
    function sin(angle:number):number {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 1;
            case PI:
            case -PI:
                return 0;
            case PacPI:
            case -HalfPI:
                return -1;
            default:
                return Math.sin(angle);
        }
    }

    /**
     * 2维矩阵,不熟悉的朋友可以找相关书箱看看
     * @class annie.Matrix
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class Matrix extends annie.AObject {
        /**
         * @property a
         * @type {number}
         * @public
         * @default 1
         * @since 1.0.0
         */
        public a:number=1;
        /**
         * @property b
         * @public
         * @since 1.0.0
         * @type {number}
         */
        public b:number=0;
        /**
         * @property c
         * @type {number}
         * @public
         * @since 1.0.0
         */
        public c:number=0;
        /**
         * @property d
         * @type {number}
         * @public
         * @since 1.0.0
         */
        public d:number=1;
        /**
         * @property tx
         * @type {number}
         * @public
         * @since 1.0.0
         */
        public tx:number=0;
        /**
         * @property ty
         * @type {number}
         * @since 1.0.0
         * @public
         */
        public ty:number=0;

        /**
         * 构造函数
         * @method Matrix
         * @param {number} a
         * @param {number} b
         * @param {number} c
         * @param {number} d
         * @param {number} tx
         * @param {number} ty
         * @public
         * @since 1.0.0
         */
        public constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0) {
            super();
            var s = this;
            s.a = a;
            s.b = b;
            s.c = c;
            s.d = d;
            s.tx = tx;
            s.ty = ty;
        }

        /**
         * 复制一个矩阵
         * @method clone
         * @since 1.0.0
         * @public
         * @returns {annie.Matrix}
         */
        public clone():Matrix {
            var s = this;
            return new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
        }

        /**
         * 将一个点通过矩阵变换后的点
         * @method transformPoint
         * @param {number} x
         * @param {number} y
         * @param {annie.Point} 默认为空，如果不为null，则返回的是Point就是此对象，如果为null，则返回来的Point是新建的对象
         * @returns {annie.Point}
         * @public
         * @since 1.0.0
         */
        public transformPoint = function (x:number, y:number,bp:Point=null):Point {
            var s = this;
            if(!bp){
                bp=new Point();
            }
            bp.x=x * s.a + y * s.c + s.tx;
            bp.y=x * s.b + y * s.d + s.ty;
            return bp
        };

        /**
         * 从一个矩阵里赋值给这个矩阵
         * @method setFrom
         * @param {annie.Matrix} mtx
         * @public
         * @since 1.0.0
         */
        public setFrom(mtx:Matrix):void {
            var s = this;
            s.a = mtx.a;
            s.b = mtx.b;
            s.c = mtx.c;
            s.d = mtx.d;
            s.tx = mtx.tx;
            s.ty = mtx.ty;
        }

        /**
         * 将矩阵恢复成原始矩阵
         * @method
         * @public
         * @since 1.0.0
         */
        public identity():void {
            var s = this;
            s.a = s.d = 1;
            s.b = s.c = s.tx = s.ty = 0;
        }

        /**
         * 反转一个矩阵
         * @method
         * @returns {Matrix}
         * @since 1.0.0
         * @public
         */
        public invert():Matrix {
            var s = this;
            var target:Matrix = new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
            var a = s.a;
            var b = s.b;
            var c = s.c;
            var d = s.d;
            var tx = s.tx;
            var ty = s.ty;
            if (b == 0 && c == 0) {
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                }
                else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }
                return target;
            }
            var determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return target;
            }
            determinant = 1 / determinant;
            var k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
            return target;
        }

        /**
         * 设置一个矩阵通过普通的显示对象的相关九大属性
         * @method createBox
         * @param {number} x
         * @param {number} y
         * @param {number} scaleX
         * @param {number} scaleY
         * @param {number} rotation
         * @param {number} skewX
         * @param {number} skewY
         * @param {number} ax
         * @param {number} ay
         * @since 1.0.0
         * @public
         */
        public createBox(x:number,y:number,scaleX:number, scaleY:number, rotation:number,skewX:number, skewY:number, ax:number, ay:number):void {
            var s = this;
            if(rotation!=0){
                skewX =skewY=rotation%360;
            }else {
                skewX %= 360;
                skewY %= 360;
            }
            if ((skewX == 0) && (skewY == 0)) {
                s.a = scaleX;
                s.b = s.c = 0;
                s.d = scaleY;
            } else {
                skewX *= DEG_TO_RAD;
                skewY *= DEG_TO_RAD;
                var u = cos(skewX);
                var v = sin(skewX);
                if (skewX == skewY) {
                    s.a = u * scaleX;
                    s.b = v * scaleX;
                }
                else {
                    s.a = cos(skewY) * scaleX;
                    s.b = sin(skewY) * scaleX;
                }
                s.c = -v * scaleY;
                s.d = u * scaleY;
            };
            s.tx = x+ax-(ax * s.a + ay * s.c);
            s.ty = y+ay-(ax * s.b + ay * s.d);
        }

        /**
         * 矩阵相乘
         * @method prepend
         * @public
         * @since 1.0.0
         * @param {annie.Matrix} mtx
         */
        public prepend = function (mtx:Matrix):void {
            var s = this;
            var a = mtx.a;
            var b = mtx.b;
            var c = mtx.c;
            var d = mtx.d;
            var tx = mtx.tx;
            var ty = mtx.ty;
            var a1 = s.a;
            var c1 = s.c;
            var tx1 = s.tx;
            s.a = a * a1 + c * s.b;
            s.b = b * a1 + d * s.b;
            s.c = a * c1 + c * s.d;
            s.d = b * c1 + d * s.d;
            s.tx = a * tx1 + c * s.ty + tx;
            s.ty = b * tx1 + d * s.ty + ty;
        };

        /**
         * 判断两个矩阵是否相等
         * @method isEqual
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Matrix} m1
         * @param {annie.Matrix} m2
         * @returns {boolean}
         */
        public static isEqual(m1:Matrix, m2:Matrix):boolean {
            return m1.tx == m2.tx && m1.ty == m2.ty && m1.a == m2.a && m1.b == m2.b && m1.c == m2.c && m1.d == m2.d;
        }
    }
}