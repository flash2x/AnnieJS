/**
 * @class annie
 */
namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 是否开启调试模式
     * @public
     * @since 1.0.1
     * @public
     * @property annie.debug
     * @type {boolean}
     * @example
     *      //在初始化stage之前输入以下代码，将会在界面调出调度面板
     *      annie.debug=true;
     */
     export let version: string = "annie_nodeJS_3.2.3";
     export let app:any=null;
    /**
     * 全局事件触发器
     * @static
     * @property  annie.globalDispatcher
     * @type {annie.EventDispatcher}
     * @public
     * @since 1.0.0
     * @example
     *      //A代码放到任何合适的地方
     *      annie.globalDispatcher.addEventListener("myTest",function(e){
     *          console.log("收到了其他地方发来的消息:"+e.data);
     *      });
     *      //B代码放到任何一个可以点击的对象的构造函数中
     *      this.addEventListener(annie.MouseEvent.CLICK,function(e){
     *          annie.globalDispatcher.dispatchEvent("myTest","我是小可");
     *      });
     *
     */
    export let globalDispatcher: annie.EventDispatcher = new annie.EventDispatcher();
    var _dRender:any;
    export let toDisplayDataURL = function (obj: any, rect: Rectangle = null, typeInfo: any = null, bgColor: string = ""): string {
        if (!_dRender) {
            _dRender = new OffCanvasRender();
            _dRender.init();
        }
        obj._updateMatrix();
        if(rect==null){
            rect=obj.getBounds();
        }
        let w: number = Math.ceil(rect.width);
        let h: number = Math.ceil(rect.height);
        _dRender.reSize(w, h);
        _dRender.begin(bgColor);
        OffCanvasRender._ctx.translate(-rect.x,-rect.y);
        _dRender.draw(obj);
        if (!typeInfo) {
            typeInfo = {type: "png"};
        } else {
            if(typeInfo.type=="jpeg"){
                if (typeInfo.quality) {
                typeInfo.quality /= 100;
                }else{
                    typeInfo.quality=0.8;
                }
            }
        }
        return OffCanvasRender.rootContainer.toDataURL("image/" + typeInfo.type, typeInfo.quality);
    };

    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 获取显示区域的颜色值，会返回颜色值的数组
     * @method annie.getStagePixels
     * @param {annie.Stage} stage
     * @param {annie.Rectangle} rect
     * @return {Array}
     * @public
     * @since 1.1.1
     */
    export let getStagePixels = function (stage: annie.Stage, rect: annie.Rectangle): Array<number> {
        let newPoint: Point = stage.localToGlobal(new Point(rect.x, rect.y));
        return CanvasRender._ctx.getImageData(newPoint.x, newPoint.y, rect.width, rect.height);
    }
}