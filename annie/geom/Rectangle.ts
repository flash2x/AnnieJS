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
            var s=this;
            s._instanceType="annie.Rectangle";
            s.x = x;
            s.y = y;
            s.height = height;
            s.width = width;
        }

        /**
         * 矩形左上角的 x 坐标
         * @property x
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public x:number=0;
        /**
         * 矩形左上角的 y 坐标
         * @property y
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public y:number=0;
        /**
         * 矩形的宽度（以像素为单位）
         * @property width
         * @public
         * @since 1.0.0
         * @type{number}
         * @default 0
         */
        public width:number=0;
        /**
         * 矩形的高度（以像素为单位）
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
            let s=this;
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
        public static createFromRects(...arg:Rectangle[]):Rectangle{
            for(let i=arg.length-1;i>=0;i--){
                if(arg[i].width*arg[i].height==0){
                    arg.splice(i,1);
                }
            }
            if(arg.length==0){
                return new Rectangle();
            }else if(arg.length==1){
                return new Rectangle(arg[0].x,arg[0].y,arg[0].width,arg[0].height);
            }else{
                let x=arg[0].x,y=arg[0].y,w=arg[0].width,h=arg[0].height,wx1:number,wx2:number,hy1:number,hy2:number;
                for(let i:number=1;i<arg.length;i++){
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
        public static createFromPoints(rect:Rectangle,...arg:Point[]):Rectangle{
           let x=arg[0].x,y=arg[0].y,w=arg[0].x,h=arg[0].y;
            for(let i:number=1;i<arg.length;i++){
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
            rect.x=x;
            rect.y=y;
            rect.width=w-x;
            rect.height=h-y;
            return rect;
        }

        /**
         * 通过两个点来确定一个矩形
         * @param rect
         * @param p1
         * @param p2
         */
        public static createRectform2Point(rect:Rectangle,p1:Point,p2:Point):void{
            let x=p1.x,y=p1.y,w=p1.x,h=p1.y;
                if(x>p2.x){
                    x=p2.x;
                }
                if(y>p2.y){
                    x=p2.y;
                }
                if(w<p2.x){
                    w=p2.x;
                }
                if(h<p2.y){
                    h=p2.y;
                }
                rect.x=x,rect.y=y,rect.width=w-x,rect.height=h-y;
        }
        /**
         * 判读两个矩形是否相交
         * @method testRectCross
         * @public
         * @since 1.0.2
         * @param r1
         * @param r2
         * @return {boolean}
         */
        public static testRectCross(ra:Rectangle,rb:Rectangle):boolean{
            let a_cx:number,a_cy:number; /* 第一个中心点*/
            let b_cx:number,b_cy:number; /* 第二个中心点*/
            a_cx = ra.x + (ra.width/2);
            a_cy = ra.y + (ra.height/2);
            b_cx = rb.x + (rb.width/2);
            b_cy = rb.y + (rb.height/2);
            return ((Math.abs(a_cx - b_cx) <= (ra.width/2 + rb.width/2))&&(Math.abs(a_cy - b_cy) <= (ra.height/2 + rb.height/2)));
        }
    }
}