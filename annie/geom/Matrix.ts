/**
 * @module annie
 */
namespace annie {
    let PI:number = Math.PI;
    let HalfPI:number = PI>>1;
    let PacPI:number = PI + HalfPI;
    let TwoPI:number = PI<<1;
    let DEG_TO_RAD:number = Math.PI / 180;

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
            let s = this;
            s._instanceType="annie.Matrix";
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
         * @return {annie.Matrix}
         */
        public clone():Matrix {
            let s = this;
            return new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
        }

        /**
         * 将一个点通过矩阵变换后的点
         * @method transformPoint
         * @param {number} x
         * @param {number} y
         * @param {annie.Point} 默认为空，如果不为null，则返回的是Point就是此对象，如果为null，则返回来的Point是新建的对象
         * @return {annie.Point}
         * @public
         * @since 1.0.0
         */
        public transformPoint = function (x:number, y:number,bp:Point=null):Point {
            let s = this;
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
            let s = this;
            s.a = mtx.a;
            s.b = mtx.b;
            s.c = mtx.c;
            s.d = mtx.d;
            s.tx = mtx.tx;
            s.ty = mtx.ty;
        }

        /**
         * 将矩阵恢复成原始矩阵
         * @method identity
         * @public
         * @since 1.0.0
         */
        public identity():void {
            let s = this;
            s.a = s.d = 1;
            s.b = s.c = s.tx = s.ty = 0;
        }

        /**
         * 反转一个矩阵
         * @method invert
         * @return {Matrix}
         * @since 1.0.0
         * @public
         */
        public invert():Matrix {
            let s = this;
            let target:Matrix = new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
            let a = s.a;
            let b = s.b;
            let c = s.c;
            let d = s.d;
            let tx = s.tx;
            let ty = s.ty;
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
            let determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return target;
            }
            determinant = 1 / determinant;
            let k = target.a = d * determinant;
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
            let s = this;
            if(rotation!=0){
                skewX=skewY=rotation%360;
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
                let u = cos(skewX);
                let v = sin(skewX);
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
            let s = this;
            let a = mtx.a;
            let b = mtx.b;
            let c = mtx.c;
            let d = mtx.d;
            let tx = mtx.tx;
            let ty = mtx.ty;
            let a1 = s.a;
            let c1 = s.c;
            let tx1 = s.tx;
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
         * @return {boolean}
         */
        public static isEqual(m1:Matrix, m2:Matrix):boolean {
            return m1.tx == m2.tx && m1.ty == m2.ty && m1.a == m2.a && m1.b == m2.b && m1.c == m2.c && m1.d == m2.d;
        }
        public concat(mtx:annie.Matrix):void{
            let s=this;
            let a = s.a, b = s.b, c = s.c, d = s.d,
                tx = s.tx, ty = s.ty;
            let ma = mtx.a, mb = mtx.b, mc = mtx.c, md = mtx.d,
                mx = mtx.tx, my = mtx.ty;
            s.a = a * ma + b * mc;
            s.b = a * mb + b * md;
            s.c = c * ma + d * mc;
            s.d = c * mb + d * md;
            s.tx = tx * ma + ty * mc + mx;
            s.ty = tx * mb + ty * md + my;
        }
        /**
         * 对矩阵应用旋转转换。
         * @method rotate
         * @param angle
         * @since 1.0.3
         * @public
         */
        public rotate(angle:number):void{
            let s=this;
            let sin = Math.sin(angle), cos = Math.cos(angle),
            a = s.a, b = s.b, c = s.c, d = s.d,
            tx = s.tx, ty = s.ty;
            s.a = a * cos - b * sin;
            s.b = a * sin + b * cos;
            s.c = c * cos - d * sin;
            s.d = c * sin + d * cos;
            s.tx = tx * cos - ty * sin;
            s.ty = tx * sin + ty * cos;
        }

        /**
         * 对矩阵应用缩放转换。
         * @method scale
         * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
         * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
         * @since 1.0.3
         * @public
         */
        public scale(sx:number, sy:number):void{
            let s=this;
            s.a *= sx;
            s.d *= sy;
            s.c *= sx;
            s.b *= sy;
            s.tx *= sx;
            s.ty *= sy;
        }
        /**
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @method translate
         * @public
         * @since 1.0.3
         * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位
         * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位
         */
        public translate(dx:number, dy:number){
            let s=this;
            s.tx += dx;
            s.ty += dy;
        }

        destroy(): void {
        }
    }
}