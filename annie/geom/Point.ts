/**
 * @module annie
 */
namespace annie {
    /**
     * @class annie.Point
     * @extends annie.AObject
     * @since 1.0.0
     * @public
     */
    export class Point extends annie.AObject{
        public destroy(): void {}
        /**
         * 构造函数
         * @method Point
         * @public
         * @since 1.0.0
         * @param x
         * @param y
         */
        constructor(x:number=0, y:number=0){
            super();
            let s = this;
            s._instanceType="annie.Point";
            s.x = x;
            s.y = y;
        }
        /**
         * 水平坐标
         * @property x
         * @public
         * @since 1.0.0
         * @type{number}
         */
        public x:number=0;
        /**
         * 垂直坐标
         * @property y
         * @since 1.0.0
         * @public
         * @type {number}
         */
        public y:number=0;
        /**
         * 求两点之间的距离
         * @method distance
         * @param args 可变参数 传两个参数的话就是两个annie.Point类型 传四个参数的话分别是两个点的x y x y
         * @return {number}
         */
        public static distance(...args:any[]):number{
            let len=args.length;
            if(len==4){
                return Math.sqrt((args[0]-args[2])*(args[0]-args[2])+(args[1]-args[3])*(args[1]-args[3]));
            }else if(len==2){
                return Math.sqrt((args[0].x-args[1].x)*(args[0].x-args[1].x)+(args[0].y-args[1].y)*(args[0].y-args[1].y));
            }
        }
    }
}