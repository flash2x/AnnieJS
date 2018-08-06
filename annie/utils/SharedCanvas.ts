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
        public constructor(){};
        public static init(stage:Stage): void{
            let s = SharedCanvas;
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
            s.width=stage.divWidth;
            s.height=stage.divHeight;
        }
        public static destroy():void{
            //清除相应的数据引用
            let s = SharedCanvas;
            s.context = null;
            s.canvas = null;
        }
        public static canvas: any;
        public static context: any;
        private static width:number=0;
        private static height:number=0;
        /**
         * 向子域传消息
         * @method postMessage
         * @param data
         * @public
         */
        public static postMessage(data: any): void {
            //呼叫数据显示端
            let s = SharedCanvas;
            if(s.context) {
                s.context.postMessage(data);
            }
        }

        public static show(): void {
            let s = SharedCanvas;
            if(s.context){
                s.context.postMessage({event: "onShow"});
                s.canvas = s.context.canvas;
                s.canvas.width=s.width;
                s.canvas.height=s.height;
            }
        }
        public static hide(isSharedDomain:boolean=true): void {
            if(!isSharedDomain) {
                let s = SharedCanvas;
                if (s.context) {
                    s.context.postMessage({event: "onHide"});
                    s.canvas = null;
                }
            }else{
                annie.Stage.pause=true;
                CanvasRender.drawCtx.canvas.width=CanvasRender.drawCtx.canvas.height=0;
            }
        }
    }
}