/**
 * @module annie
 */
namespace annie {
    /**
     * 小游戏中开放子域在主域的显示容器,小程序中无此类
     * @class annie.SharedCanvas
     * @public
     * @extends annie.AObject
     * @since 1.0.0
     */
    export class SharedCanvas {
        public static context: any;
        public static view: annie.Bitmap = null;
        public static init(w: number, h: number): void {
            let s = SharedCanvas;
            if (s.context) return;
            s.context = wx.getOpenDataContext();
            s.postMessage({
                type: "initSharedCanvasStage",
            });
            s.context.canvas.width = w;
            s.context.canvas.height = h;
            s.view = new annie.Bitmap(s.context.canvas);
            s.view.addEventListener(annie.MouseEvent.CLICK,function(e:MouseEvent){
                s.postMessage({
                    type: e.type,
                    data: {
                        x: e.localX,
                        y: e.localY
                    }
                });
            });
            s.view.addEventListener(annie.MouseEvent.MOUSE_MOVE,function(e:MouseEvent){
                s.postMessage({
                    type: e.type,
                    data: {
                        x: e.localX,
                        y: e.localY
                    }
                });
            });
            s.view.addEventListener(annie.MouseEvent.MOUSE_OUT,function(e:MouseEvent){
                s.postMessage({
                    //不要搞错了，这里要设置成UP
                    type: annie.MouseEvent.MOUSE_UP,
                    data: {
                        x: e.localX,
                        y: e.localY
                    }
                });
            });
            s.view.addEventListener(annie.MouseEvent.MOUSE_OVER,function(e:MouseEvent){
                s.postMessage({
                    //不要搞错了，这里要设置成down
                    type: annie.MouseEvent.MOUSE_DOWN,
                    data: {
                        x: e.localX,
                        y: e.localY
                    }
                });
            });
            s.view.addEventListener(annie.MouseEvent.MOUSE_UP,function(e:MouseEvent){
                s.postMessage({
                    type: e.type,
                    data: {
                        x: e.localX,
                        y: e.localY
                    }
                });
            });
        }
        public static resize(w: number, h: number) {
            let s = SharedCanvas;
            s.postMessage({
                type: "canvasResize",
                data: {
                    w: w,
                    h: h,
                }
            });
            s.context.canvas.width = w;
            s.context.canvas.height = h;
        }
        public static destroy(): void {
            //清除相应的数据引用
            let s = SharedCanvas;
            s.view.destroy();
            s.context = null;
        }
        /**
         * 向子域传消息
         * @method postMessage
         * @param data
         * @public
         */
        public static postMessage(data: any): void {
            //呼叫数据显示端
            let s = SharedCanvas;
            s.context.postMessage(data);
        }

        /**
         * 显示开放域
         * @method show
         * @since 2.0.1
         */
        public static show(): void {
            let s = SharedCanvas;
            s.context.postMessage({event: "onShow"});
            s.view.visible = true;
        }
        /**
         * 隐藏开放域
         * @method hide
         * @since 2.0.1
         */
        public static hide(): void {
            let s = SharedCanvas;
            s.context.postMessage({event: "onHide"});
            s.view.visible = true;
        }
    }
}