/**
 * @class annie
 */
namespace annie{
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 全局eval,相比自带的eval annie.Eval始终是全局的上下文。不会因为使用的位置和环境而改变上下文。
     * @public
     * @property annie.Eval
     * @since 1.0.3
     * @public
     * @type {any}
     */
    export let Eval: any = eval.bind(window);
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
    export let debug: boolean = false;
    /**
     * annie引擎的版本号
     * @public
     * @since 1.0.1
     * @property annie.version
     * @type {string}
     * @example
     *      //打印当前引擎的版本号
     *      console.log(annie.version);
     */
    export let version:string="3.1.4";
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 当前设备是否是移动端或或是pc端,移动端是ios 或者 android
     * @property annie.osType
     * @since 1.0.0
     * @public
     * @type {string|string}
     * @static
     * @example
     *      //获取当前设备类型
     *      console.log(annie.osType);
     */
    export let osType: string = (function () {
        let n = navigator.userAgent.toLocaleLowerCase();
        let reg1 = /android/;
        let reg2 = /iphone/;
        if (reg1.test(n)) {
            return "android";
        } else if (reg2.test(n)){
            return "ios"
        } else {
            return "pc";
        }
    })();
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
    export let globalDispatcher:annie.EventDispatcher=new annie.EventDispatcher();
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
    export let devicePixelRatio: number = window.devicePixelRatio ? window.devicePixelRatio : 1;
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
    export let StageScaleMode: {EXACT_FIT: string,NO_BORDER: string,NO_SCALE: string,SHOW_ALL: string,FIXED_WIDTH: string,FIXED_HEIGHT: string} = {
        EXACT_FIT: "exactFit",
        NO_BORDER: "noBorder",
        NO_SCALE: "noScale",
        SHOW_ALL: "showAll",
        FIXED_WIDTH: "fixedWidth",
        FIXED_HEIGHT: "fixedHeight"
    };

    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 跳转到指定网址
     * @method annie.navigateToURL
     * @public
     * @since 1.0.0
     * @param {string} url
     * @static
     * @example
     *      displayObject.addEventListener(annie.MouseEvent.CLICK,function (e) {
     *              annie.navigateToURL("http://www.annie2x.com");
     *      })
     *
     */
    export function navigateToURL(url: string): void {
        window.location.href = url;
    }

    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 向后台发送数据,但不会理会任何的后台反馈
     * @method annie.sendToURL
     * @public
     * @since 1.0.0
     * @param {string} url
     * @static
     * @example
     *      submitBtn.addEventListener(annie.MouseEvent.CLICK,function (e) {
     *           annie.sendToURL("http://www.annie2x.com?key1=value&key2=value");
     *      })
     */
    //TODO 增加post请求
    export function sendToURL(url: string): void {
        let req = new XMLHttpRequest();
        req.open("get", url, true);
        req.send();
    }
    // 作为将显示对象导出成图片的render渲染器
    export let _dRender: any = null;
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 将显示对象转成base64的图片数据,如果要截取的显示对象从来没有添加到舞台更新渲染过，则需要在截图之前手动执行更新方法一次。如:this.update(true);
     * @method annie.toDisplayDataURL
     * @static
     * @param {annie.DisplayObject} obj 显示对象
     * @param {annie.Rectangle} rect 需要裁切的区域，默认不裁切
     * @param {Object} typeInfo {type:"png"}  或者 {type:"jpeg",quality:100}  png格式不需要设置quality，jpeg 格式需要设置quality的值 从1-100
     * @param {string} bgColor 颜色值如 #fff,rgba(255,23,34,44)等！默认值为空的情况下，jpeg格式的话就是黑色底，png格式的话就是透明底
     * @return {string} base64格式数据
     * @example
     *      annie.toDisplayDataURL(DisplayObj,{
     *               x: 0,
     *               y: 32,
     *               width: 441,
     *               height: 694
     *       }, {
     *               type: "jpeg",//数据类型jpg/png
     *               quality: 90//图片质量值1-100,png格式不需要设置quality
     *       }, '#CDDBEB');
     *
     * Tip:在一些需要上传图片，编辑图片，需要提交图片数据，分享作品又或者长按保存作品的项目，运用annie.toDisplayDataURL方法就是最好不过的选择了。
     */
    export let toDisplayDataURL = function (obj: any, rect: Rectangle = null, typeInfo: any = null, bgColor: string = ""): string {
        if (!_dRender) {
            _dRender = new CanvasRender(null);
        }
        _dRender.rootContainer = DisplayObject["_canvas"];
        if(!obj.stage){
            obj.updateMatrix();
        }
        if(!rect){
            obj.getDrawRect();
        }else{
            obj.getDrawRect(obj.matrix,rect);
        }
        rect =DisplayObject._transformRect;
        let sp=obj.parent;
        obj.parent=null;
        obj._cp=true;
        let ox=obj.x;
        let oy=obj.y;
        obj.x=ox-rect.x;
        obj.y=oy-rect.y;
        let w: number =rect.width;
        let h: number =rect.height;
        _dRender.rootContainer.width = w;
        _dRender.rootContainer.height = h;
        _dRender.viewPort.height = h;
        _dRender.viewPort.width = w;
        _dRender.rootContainer.style.width = w / devicePixelRatio + "px";
        _dRender.rootContainer.style.height = h / devicePixelRatio + "px";
        _dRender._ctx = _dRender.rootContainer["getContext"]('2d');
        if (bgColor == ""){
            _dRender._ctx.clearRect(0, 0, w, h);
        } else {
            _dRender._ctx.fillStyle = bgColor;
            _dRender._ctx.fillRect(0, 0, w, h);
        }
        obj.updateMatrix();
        obj.render(_dRender);
        obj.parent = sp;
        obj._cp=true;
        obj.x=ox;
        obj.y=oy;
        if (!typeInfo) {
            typeInfo = {type: "png"};
        }else{
            if(typeInfo.quality){
                typeInfo.quality/=100;
            }
        }
        return _dRender.rootContainer.toDataURL("image/" + typeInfo.type, typeInfo.quality);
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
    export let getStagePixels=function(stage:annie.Stage,rect:annie.Rectangle):Array<number>{
        var newPoint:Point=stage.localToGlobal(new Point(rect.x,rect.y));
        return stage.renderObj.rootContainer.getContext("2d").getImageData(newPoint.x,newPoint.y,rect.width,rect.height);
    }
}