/**
 * @module annieUI
 */
namespace annieUI {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 画板类
     * @class annieUI.DrawingBoard
     * @public
     * @extends annie.Bitmap
     * @since 1.1.1
     */
    export class DrawingBoard extends annie.Bitmap {
        protected context: CanvasRenderingContext2D = null;
        protected _isMouseDown: boolean = false;

        /**
         * 绘画半径
         * @property drawRadius
         * @type {number}
         * @public
         * @since 1.1.1
         */
        public get drawRadius(): number {
            return this._drawRadius;
        };

        public set drawRadius(value: number) {
            this._drawRadius = value;
        }

        protected _drawRadius: number = 50;
        /**
         * 绘画颜色, 可以是任何的颜色类型
         * @property drawColor
         * @type {string}
         * @public
         * @since
         * @type {any}
         */
        public drawColor: any = "#ffffff";
        /**
         * 背景色 可以是任何的颜色类型
         * @property bgColor
         * @type {any}
         * @public
         * @since 1.1.1
         */
        public bgColor: any = "";
        /**
         * 总步数数据
         * @property totalStepList
         * @protected
         * @type {any[]}
         */
        protected totalStepList: any = [];
        /**
         * 单步数据
         * @protected
         * @property addStepObj
         * @type {Object}
         */
        protected addStepObj: any;
        /**
         * 当前步数所在的id
         * @property currentStepId
         * @protected
         * @type {number}
         */
        protected currentStepId: number = 0;

        protected static _getDrawCanvas(width: number, height: number): HTMLCanvasElement {
            let canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }

        /**
         * 构造函数
         * @method DrawingBoard
         * @param width 画板宽
         * @param height 画板高
         * @param bgColor 背景色 默认透明
         * @since 1.1.1
         */
        constructor(width: number, height: number, bgColor: any = "") {
            super(DrawingBoard._getDrawCanvas(width, height));
            let s = this;
            s._instanceType = "annieUI.DrawingBoard";
            s.context = s._texture.getContext('2d');
            s.context.lineCap = "round";
            s.context.lineJoin = "round";
            s.reset(bgColor);
            let mouseDown = s.onMouseDown.bind(s);
            let mouseMove = s.onMouseMove.bind(s);
            let mouseUp = s.onMouseUp.bind(s);
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, mouseDown);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, mouseMove);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, mouseUp);
        }

        private onMouseDown(e: annie.MouseEvent): void {
            let s = this;
            s._isMouseDown = true;
            let ctx = s.context;
            ctx.beginPath();
            ctx.strokeStyle = s.drawColor;
            ctx.lineWidth = s._drawRadius;
            let lx: number = e.localX >> 0;
            let ly: number = e.localY >> 0;
            ctx.moveTo(lx, ly);
            s.addStepObj = {};
            s.addStepObj.c = s.drawColor;
            s.addStepObj.r = s._drawRadius;
            s.addStepObj.sx = lx;
            s.addStepObj.sy = ly;
            s.addStepObj.ps = [];
        };

        private onMouseUp(e: annie.MouseEvent): void {
            let s = this;
            if (s._isMouseDown) {
                s._isMouseDown = false;
                if (s.addStepObj.ps && s.addStepObj.ps.length > 0) {
                    s.currentStepId++;
                    s.totalStepList.push(s.addStepObj);
                }
            }
        };

        private onMouseMove(e: annie.MouseEvent): void {
            let s = this;
            if (s._isMouseDown) {
                if(s.addStepObj) {
                    let ctx = s.context;
                    let lx: number = e.localX >> 0;
                    let ly: number = e.localY >> 0;
                    ctx.lineTo(lx, ly);
                    ctx.stroke();
                    s.addStepObj.ps.push(lx, ly);
                }else{
                    s.onMouseDown(e);
                }
            }
        };

        /**
         * 重置画板
         * @method reset
         * @param bgColor
         * @public
         * @since 1.1.1
         */
        public reset(bgColor: any = ""): void {
            let s = this;
            if (bgColor != "") {
                s.bgColor = bgColor;
            }
            if (s.bgColor != "") {
                s.context.fillStyle = s.bgColor;
            }else{
                s.context.fillStyle="#00000000";
            }
            s.context.clearRect(0, 0, s.bitmapData.width, s.bitmapData.height);
            s.context.fillRect(0, 0, s._bitmapData.width, s._bitmapData.height);
            s.currentStepId = 0;
            s.totalStepList = [];
            s.addStepObj = null;
            s._isMouseDown=false;
        }

        /**
         * 撤销步骤
         * @method cancel
         * @param {number} step 撤销几步 0则全部撤销,等同于reset
         * @public
         * @since 1.1.1
         */
        public cancel(step: number = 0): boolean {
            let s = this;
            if (step == 0) {
                s.reset();
            } else {
                if (s.currentStepId - step >= 0) {
                    s.currentStepId -= step;
                    s.totalStepList.splice(s.currentStepId, step);
                    if (s.bgColor != "") {
                        s.context.fillStyle = s.bgColor;
                    }else{
                        s.context.fillStyle = "#00000000";
                    }
                    s.context.clearRect(0, 0, s.bitmapData.width, s.bitmapData.height);
                    s.context.fillRect(0, 0, s.bitmapData.width, s.bitmapData.height);
                    let len: number = s.totalStepList.length;
                    for (let i = 0; i < len; i++) {
                        let ctx = s.context;
                        ctx.beginPath();
                        ctx.strokeStyle = s.totalStepList[i].c;
                        ctx.lineWidth = s.totalStepList[i].r;
                        ctx.moveTo(s.totalStepList[i].sx, s.totalStepList[i].sy);
                        let ps: any = s.totalStepList[i].ps;
                        let pLen: number = ps.length;
                        for (let m = 0; m < pLen; m += 2) {
                            ctx.lineTo(ps[m], ps[m + 1]);
                            ctx.stroke();
                        }
                    }
                } else {
                    return false;
                }
            }
            return true;
        }

        public destroy(): void {
            let s = this;
            s.context = null;
            s.totalStepList = null;
            s.drawColor = null;
            s.bgColor = null;
            s.addStepObj = null;
            super.destroy();
        }
    }
}