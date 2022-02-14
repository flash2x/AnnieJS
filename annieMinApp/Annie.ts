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
    export let version: string = "annie_MinApp_3.2.5";
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
    /**
     * 设备的retina值,简单点说就是几个像素表示设备上的一个点
     * @property annie.devicePixelRatio
     * @type {number}
     * @since 1.0.0
     * @public
     * @static
     * @example
     *      //打印当前设备的retina值
     *      console.log(annie.devicePixelRatio);
     */
    export let devicePixelRatio: number = 1;
    /**
     * 一个 StageScaleMode 中指定要使用哪种缩放模式的值。以下是有效值：
     * StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。
     * StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的两侧可能会显示边框。
     * StageScaleMode.NO_BORDER -- 整个应用程序填满指定区域，不发生扭曲，但有可能进行一些裁切，同时保持应用程序的原始高宽比。
     * StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * StageScaleMode.FIXED_WIDTH -- 整个应用程序的宽固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * StageScaleMode.FIXED_HEIGHT -- 整个应用程序的高固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * @property annie.StageScaleMode
     * @type {Object}
     * @public
     * @since 1.0.0
     * @static
     * @example
     *      //动态更改stage的对齐方式示例
     *      //以下代码放到一个舞台的显示对象的构造函数中
     *      let s=this;
     *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
     *          let i=0;
     *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
     *              let aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
     *              s.stage.scaleMode=aList[i];
     *              if(i>5){i=0;}
     *          }
     *      }
     *
     */
    export let StageScaleMode: { EXACT_FIT: string, NO_BORDER: string, NO_SCALE: string, SHOW_ALL: string, FIXED_WIDTH: string, FIXED_HEIGHT: string } = {
        EXACT_FIT: "exactFit",
        NO_BORDER: "noBorder",
        NO_SCALE: "noScale",
        SHOW_ALL: "showAll",
        FIXED_WIDTH: "fixedWidth",
        FIXED_HEIGHT: "fixedHeight"
    };
    var _dRender:any;
    export let toDisplayDataURL = function (obj: any, rect: Rectangle = null, typeInfo: any = null, bgColor: string = ""): string {
        if (!_dRender) {
            _dRender = new OffCanvasRender();
            _dRender.init();
        }
        obj._onUpdateFrame(0,true);
        obj._updateMatrix();
        if(rect==null){
            rect=obj.getBounds();
        }
        let w: number = Math.ceil(rect.width);
        let h: number = Math.ceil(rect.height);
        _dRender.reSize(w, h);
        _dRender.begin(bgColor);
        let ctx=OffCanvasRender._ctx;
        ctx.translate(-rect.x,-rect.y);
        _dRender.draw(obj);
        if (!typeInfo) {
            typeInfo = {type: "png",quality:1.0};
        } else {
            if(typeInfo.type=="jpeg"){
                if (typeInfo.quality) {
                    if(typeInfo.quality>1){
                        typeInfo.quality /= 100;
                    }
                }else{
                    typeInfo.quality=0.8;
                }
            }else{
                typeInfo.quality=1.0;
            }
        }
        //抖音里一定要这么拿canvas才能成功,为了统一就都这样吧
        return ctx.canvas.toDataURL("image/" + typeInfo.type, typeInfo.quality);
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