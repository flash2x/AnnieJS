/**
 * Created by anlun on 2017/5/24.
 */
/**
 * @module annieUI
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 画板类
     * @class annieUI.DrawingBoard
     * @public
     * @extends annie.Bitmap
     * @since 1.1.1
     */
    export class DrawingBoard extends annie.Bitmap {
        private _ctx:any;
        private _isMouseDown: boolean = false;
        /**
         * 半径
         * @type {number}
         */
        public drawRadius:number=10;
        /**
         * 颜色
         * @type {string}
         */
        public drawColor:any="#000";
        /**
         * 背景
         * @type {string}
         */
        public bgColor:string="";
        /**
         * 构造函数
         * @param width 画板宽
         * @param height 画板高
         * @param bgColor 背景 默认透明
         */
        constructor(width: number, height: number,bgColor: string="") {
            super();
            var s = this;
            var bd=document.createElement("canvas");
            bd.width=width;
            bd.height=height;
            s._ctx=bd.getContext("2d");
            s.bgColor=bgColor;
            s.clear();
            s.bitmapData=bd;
            var mouseDown = s.onMouseDown.bind(s);
            var mouseMove = s.onMouseMove.bind(s);
            var mouseUp = s.onMouseUp.bind(s);
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, mouseDown);
            s.addEventListener(annie.MouseEvent.MOUSE_OVER, mouseDown);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, mouseMove);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, mouseUp);
            s.addEventListener(annie.MouseEvent.MOUSE_OUT, mouseUp);
        }
        private onMouseDown(e:annie.MouseEvent): void {
            var s = this;
            var ctx = s._ctx;
            ctx.beginPath();
            ctx.strokeStyle = s.drawColor;
            ctx.lineWidth = s.drawRadius;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(e.localX >> 0, e.localY >> 0);
            s._isMouseDown = true;
        };
        private onMouseUp(e:annie.MouseEvent):void {
            this._isMouseDown = false;
        };
        private onMouseMove(e:annie.MouseEvent):void{
            var s = this;
            if (s._isMouseDown) {
                var ctx = s._ctx;
                ctx.lineTo(e.localX >> 0, e.localY >> 0);
                ctx.stroke();
            }
        };
        public clear():void{
            let s=this;
            if (s.bgColor != "") {
                s._ctx.fillStyle = s.bgColor;
                s._ctx.fillRect(0, 0, s.bitmapData.width, s.bitmapData.height);
            } else {
                s._ctx.clearRect(0, 0, s.bitmapData.width, s.bitmapData.height);
            }
        }
    }
}