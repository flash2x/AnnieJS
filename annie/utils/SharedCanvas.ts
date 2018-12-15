declare var wx: any;
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
        public constructor(){
        };
        public static init(stage: Stage): void {
            let s = SharedCanvas;
            if (s.context) return;
            s.context = wx.getOpenDataContext();
            s.postMessage({
                event: "initSharedCanvasStage",
                data: {
                    dw: stage.divWidth,
                    dh: stage.divHeight,
                    w: stage.desWidth,
                    h: stage.desHeight,
                    fps: stage.getFrameRate(),
                    scaleMode: stage.scaleMode,
                    devicePixelRatio: annie.devicePixelRatio
                }
            });
            s.context.canvas.width = stage.desWidth;
            s.context.canvas.height = stage.desHeight;
        }
        public static destroy():void{
            //清除相应的数据引用
            let s = SharedCanvas;
            s.context = null;
            s.canvas = null;
        }

        public static canvas: any;
        public static context: any;

        /**
         * 向子域传消息
         * @method postMessage
         * @param data
         * @public
         */
        public static postMessage(data: any): void {
            //呼叫数据显示端
            let s = SharedCanvas;
            if (s.context) {
                s.context.postMessage(data);
            }
        }

        /**
         * 显示开放域
         * @method show
         * @since 2.0.1
         */
        public static show(): void {
            let s = SharedCanvas;
            if (s.context) {
                s.context.postMessage({event: "onShow"});
                s.canvas = s.context.canvas;
            }
        }

        /**
         * 隐藏开放域
         * @method hide
         * @since 2.0.1
         */
        public static hide(): void {
            // if(!isSharedDomain) {
            let s = SharedCanvas;
            if (s.context) {
                s.context.postMessage({event: "onHide"});
                s.canvas = null;
            }
            // }else{
            //     annie.Stage.pause=true;
            //     CanvasRender.drawCtx.canvas.width=CanvasRender.drawCtx.canvas.height=0;
            // }
        }
    }
}