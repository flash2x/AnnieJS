/**
 * @module annie
 */
namespace annie {
    /**
     *
     * @class annie.Rectangle
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    export class Rectangle extends AObject {
        /**
         * 构造函数
         * @method Rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        public constructor(x:number=0, y:number=0, width:number=0, height:number=0) {
            super();
            this.x = x;
            this.y = y;
            this.height = height;
            this.width = width;
        }

        /**
         * @property x
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public x:number=0;
        /**
         * @property y
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public y:number=0;
        /**
         * @property width
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public width:number=0;
        /**
         * @property height
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public height:number=0;

        /**
         * 判断一个点是否在矩形内包括边
         * @method isPointIn
         * @param {annie.Point} point
         * @returns {boolean}
         * @public
         * @since 1.0.0
         */
        public isPointIn(point:Point):boolean{
            var s=this;
            return point.x>=s.x&&point.x<=(s.x+s.width)&&point.y>=s.y&&point.y<=(s.y+s.height);
        }
        /**
         * 将多个矩形合成为一个大的矩形
         * 返回包含所有给定的矩阵拼合之后的一个最小矩形
         * @method createFromRects
         * @param {annie.Rectangle} rect
         * @param {..arg} arg
         * @public
         * @since 1.0.0
         * @static
         */
        public static createFromRects(rect:Rectangle,...arg:Rectangle[]):Rectangle{
            var x=rect.x,y=rect.y,w=rect.width,h=rect.height,wx1:number,wx2:number,hy1:number,hy2:number
            for(var i:number=0;i<arg.length;i++){
                if(arg[i]==null)continue;
                wx1=x+w;
                hy1=y+h;
                wx2=arg[i].x+arg[i].width;
                hy2=arg[i].y+arg[i].height;
                if(x>arg[i].x){
                    x=arg[i].x;
                }
                if(y>arg[i].y){
                    y=arg[i].y;
                }
                if(wx1<wx2){
                    wx1=wx2;
                }
                if(hy1<hy2){
                    hy1=hy2;
                }
            }
            return new Rectangle(x,y,wx1-x,hy1-y);
        }
        /**
         * 通过一系列点来生成一个矩形
         * 返回包含所有给定的点的最小矩形
         * @method createFromPoints
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Point} p1
         * @param {..arg} ary
         * @returns {annie.Rectangle}
         */
        public static createFromPoints(p1:Point,...arg:Point[]):Rectangle{
           var x=p1.x,y=p1.y,w=p1.x,h=p1.y;
            for(var i:number=0;i<arg.length;i++){
                if(arg[i]==null)continue;
                if(x>arg[i].x){
                    x=arg[i].x;
                }
                if(y>arg[i].y){
                    x=arg[i].y;
                }
                if(w<arg[i].x){
                    w=arg[i].x;
                }
                if(h<arg[i].y){
                    h=arg[i].y;
                }
            }
            return new Rectangle(x,y,w,h);
        }
    }
}