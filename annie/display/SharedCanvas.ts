declare var wx:any;
/**
 * @module annie
 */
namespace annie {
    /**
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
         */
        public constructor(width:number,height:number) {
            super();
            let s = this;
            s._instanceType = "annie.SharedCanvas";
            s._openDataContext = wx.getOpenDataContext();
            let sharedCanvas = s._openDataContext.canvas;
            s._texture = sharedCanvas;
            s.setWH(width,height);
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s._texture=null;
            s._openDataContext=null;
            super.destroy();
        }
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