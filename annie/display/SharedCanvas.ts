declare var wx:any;
/**
 * @module annie
 */
namespace annie {
    /**
     * 小游戏中开放子域在主域的显示容器,小程序中无此类
     * @class annie.SharedCanvas
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.0
     */
    export class SharedCanvas extends DisplayObject {
        /**
         * 构造函数
         * @method SharedCanvas
         * @since 1.0.0
         * @public
         * @param width
         * @param height
         * @param fps
         * @param scaleMode
         */
        public constructor(width:number,height:number,fps:number,scaleMode:string){
            super();
            if(!SharedCanvas._isInit) {
                let s = this;
                s._instanceType = "annie.SharedCanvas";
                s._openDataContext = wx.getOpenDataContext();
                let sharedCanvas = s._openDataContext.canvas;
                s._texture = sharedCanvas;
                s.setWH(width, height);
                s.postMessage({
                    event: "initSharedCanvasStage",
                    data: {w: width, h: height, fps: fps, scaleMode: scaleMode,}
                });
                SharedCanvas._isInit=true;
                s.addEventListener(annie.Event.ADD_TO_STAGE,function(e:any){
                    if(s._visible)
                    s.postMessage({event:"onShow"});
                });
                s.addEventListener(annie.Event.REMOVE_TO_STAGE,function(e:any){
                    if(s._visible)
                    s.postMessage({event:"onHide"});
                })
            }else{
                throw new Error("annie.SharedCanvas只能初始化一次");
            }
        }
        set visible(value: boolean) {
            let s=this;
            if(value!=s._visible)
                s._visible=value;
            if(value){
                s.postMessage({event:"onShow"});
            }else{
                s._cp=true;
                s.postMessage({event:"onHide"});
            }
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s._texture=null;
            s._openDataContext=null;
            super.destroy();
        }
        private static _isInit:boolean=false;
        private _openDataContext:any;
        /**
         * 设置子域的宽和高
         * @method setWH
         * @param {number} w
         * @param {number} h
         */
        public setWH(w:number,h:number):void{
            let s=this;
            s._texture.width=w;
            s._texture.height=h;
            s._bounds.width=w;
            s._bounds.height=h;
        }
        /**
         * 向子域传消息
         * @method postMessage
         * @param data
         * @public
         */
        public postMessage(data:any):void{
            //呼叫数据显示端
            this._openDataContext.postMessage(data);
        }
    }
}