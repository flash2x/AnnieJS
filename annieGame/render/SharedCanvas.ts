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
        private static onMouseEvent(e:MouseEvent):void{
            let s:any = SharedCanvas;
            s.postMessage({
                type: e.type,
                data: {
                    x: e.localX,
                    y: e.localY
                }
            });
        }
        public static init(w: number, h: number): void {
            let s:any = SharedCanvas;
            if (s.context) return;
            s.context = annie.app.getOpenDataContext();
            s.postMessage({
                type: "initSharedCanvasStage",
            });
            s.view = new annie.Bitmap(s.context.canvas);
            s.view.addEventListener(annie.MouseEvent.CLICK,s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_MOVE,s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_DOWN,s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_UP,s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_OVER,s.onMouseEvent);
            s.view.addEventListener(annie.MouseEvent.MOUSE_OUT,s.onMouseEvent);
            s.resize(w, h);
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