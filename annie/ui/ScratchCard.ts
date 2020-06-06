/**
 * @module annieUI
 */
namespace annieUI {
    /**
     * 刮刮卡类
     * @class annieUI.ScratchCard
     * @public
     * @extends annie.DrawingBoard
     * @since 1.1.1
     */
    export class ScratchCard extends DrawingBoard {
        //Events
        /**
         * annie.ScratchCard 刮刮卡事件，刮了多少，一个百分比
         * @event annie.Event.ON_DRAW_PERCENT
         * @since 1.0.9
         *
         */
        /**
         * 构造函数
         * 请监听 annie.Event.ON_DRAW_PERCENT事件来判断刮完多少百分比了。
         * @method ScratchCard
         * @param width 宽
         * @param height 高
         * @param frontColorObj 没刮开之前的图，可以为单色，也可以为位图填充。一般是用位图填充，如果生成位图填充，请自行复习canvas位图填充
         * @param backColorObj 被刮开之后的图，可以为单色，也可以为位图填充。一般是用位图填充，如果生成位图填充，请自行复习canvas位图填充
         * @param drawRadius 刮刮卡刮的时候的半径，默认为50
         */
        constructor(width:number,height:number, frontColorObj: any, backColorObj: any, drawRadius: number = 50) {
            super(width,height, frontColorObj);
            let s = this;
            s._instanceType = "annieUI.ScratchCard";
            s.drawColor = backColorObj;
            s.drawRadius = drawRadius;
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, function (e: annie.MouseEvent) {
                if(s._isMouseDown) {
                    //通过移动，计算刮开的面积
                    let dw: number = Math.floor(e.localX / s._drawRadius);
                    let dh: number = Math.floor(e.localY / s._drawRadius);
                    if (s._drawList[dw] && s._drawList[dw][dh]) {
                        s._drawList[dw][dh] = false;
                        s._currentDraw++;
                        //抛事件
                        let per = Math.floor(s._currentDraw / s._totalDraw * 100);
                        s.dispatchEvent("onDrawPercent", {per: per});
                    }
                }
            })
        }
        private _drawList: any = [];
        private _totalDraw: number = 1;
        private _currentDraw: number = 0;

        /**
         * 重置刮刮卡
         * @method reset
         * @param frontColorObj 没刮开之前的图，可以为单色，也可以为位图填充。赋值为""会用之前已设置的
         * @param backColorObj 被刮开之后的图，可以为单色，也可以为位图填充。赋值为""会用之前已设置的
         * @since 1.1.1
         * @public
         */
        public reset(frontColorObj: any="",backColorObj: any = ""): void {
            super.reset(frontColorObj);
            let s = this;
            if (s._drawList) {
                if (backColorObj != "") {
                    s.drawColor = backColorObj;
                }
                s._currentDraw = 0;
                let dw: number = Math.floor(s._bounds.width / s._drawRadius);
                let dh: number = Math.floor(s._bounds.height  / s._drawRadius);
                s._totalDraw = dw * dh;
                for (let i = 0; i < dw; i++) {
                    s._drawList[i] = [];
                    for (let j = 0; j < dh; j++) {
                        s._drawList[i][j] = true;
                    }
                }
            }
        }

        /**
         * 撤销步骤 没有任何功能，只是把从基类中的代码移除，调用不会产生任何效果
         * @method cancel
         * @param step
         * @public
         * @since 1.1.1
         * @return {boolean}
         */
        public cancel(step: number = 0): boolean {
            console.log("no support");
            return false;
        }

        public set drawRadius(value: number) {
            let s = this;
            s._drawRadius = value;
            let dw: number = Math.floor(s._bounds.width / s._drawRadius);
            let dh: number = Math.floor(s._bounds.height  / s._drawRadius);
            s._totalDraw = dw * dh;
            for (let i = 0; i < dw; i++) {
                s._drawList[i] = [];
                for (let j = 0; j < dh; j++) {
                    s._drawList[i][j] = true;
                }
            }
        }
        public destroy(): void {
            let s=this;
           s._drawList=null;
            super.destroy();
        }
    }
}