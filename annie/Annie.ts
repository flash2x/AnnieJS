/**
 * @class annie
 */
namespace annie {
    /**
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
     *      trace(annie.version);
     */
    export let version: string = "1.0.5";
    /**
     * 设备的retina值,简单点说就是几个像素表示设备上的一个点
     * @property annie.devicePixelRatio
     * @type {number}
     * @since 1.0.0
     * @public
     * @static
     * @example
     *      //打印当前设备的retina值
     *      trace(annie.devicePixelRatio);
     */
    export let devicePixelRatio: number = window.devicePixelRatio ? window.devicePixelRatio : 1;
    /**
     * 当前设备是否是移动端或或是pc端,移动端是ios 或者 android
     * @property annie.osType
     * @since 1.0.0
     * @public
     * @type {string|string}
     * @static
     * @example
     *      //获取当前设备类型
     *      trace(annie.osType);
     */
    export let osType: string = (function () {
        let n = navigator.userAgent.toLocaleLowerCase();
        let reg1 = /android/;
        let reg2 = /iphone|ipod|ipad/;
        if (reg1.test(n)) {
            return "android";
        } else if (reg2.test(n)) {
            return "ios"
        } else {
            return "pc";
        }
    })();
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
     *              let state=e.currentTarget;
     *              state.scaleMode=aList[i];
     *              state.resize();
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
     * 跳转到指定网址
     * @method annie.navigateToURL
     * @public
     * @since 1.0.0
     * @param {string} url
     * @static
     * @example
     *   displayObject.addEventListener(annie.MouseEvent.CLICK,function (e) {
     *     annie.navigateToURL("http://www.annie2x.com");
     *   })
     *
     */
    export function navigateToURL(url: string): void {
        window.location.href = url;
    }

    /**
     * 向后台发送数据,但不会理会任何的后台反馈
     * @method annie.sendToURL
     * @public
     * @since 1.0.0
     * @param {string} url
     * @static
     * @example
     *      annie.sendToURL("http://www.annie2x.com");
     */
    export function sendToURL(url: string): void {
        let req = new XMLHttpRequest();
        req.open("get", url, true);
        req.send();
    }

    // 作为将显示对象导出成图片的render渲染器
    let _dRender: any = null;
    /**
     * 将显示对象转成base64的图片数据
     * @method annie.toDisplayDataURL
     * @static
     * @param {annie.DisplayObject} obj 显示对象
     * @param {annie.Rectangle} rect 需要裁切的区域，默认不裁切
     * @param {Object} typeInfo {type:"png"}  或者 {type:"jpeg",quality:100}  png格式不需要设置quality，jpeg 格式需要设置quality的值 从1-100
     * @param {string} bgColor 颜色值如 #fff,rgba(255,23,34,44)等！默认值为空的情况下，jpeg格式的话就是黑色底，png格式的话就是透明底
     * @return {string} base64格式数据
     */
    export let toDisplayDataURL = function (obj: DisplayObject, rect: Rectangle = null, typeInfo: any = null, bgColor: string = ""): string {
        if (!_dRender) {
            _dRender = new CanvasRender(null);
        }
        _dRender._stage = obj;
        _dRender.rootContainer = DisplayObject["_canvas"];
        let objInfo = {
            p: obj.parent,
            x: obj.x,
            y: obj.y,
            scX: obj.scaleX,
            scY: obj.scaleY,
            r: obj.rotation,
            skX: obj.skewX,
            skY: obj.skewY
        };
        obj.parent = null;
        obj.x = rect ? -rect.x : 0;
        obj.y = rect ? -rect.y : 0;
        obj.scaleX = obj.scaleY = 1;
        obj.rotation = obj.skewX = obj.skewY = 0;
        obj.update(false, false, false);
        //设置宽高,如果obj没有添加到舞台上就去截图的话,会出现宽高不准的时候，需要刷新一下。
        let whObj: any = obj.getBounds();
        let w: number = rect ? rect.width : whObj.width;
        let h: number = rect ? rect.height : whObj.height;
        _dRender.rootContainer.width = w;
        _dRender.rootContainer.height = h;
        _dRender._ctx = _dRender.rootContainer["getContext"]('2d');
        if (bgColor == "") {
            _dRender._ctx.clearRect(0, 0, w, h);
        } else {
            _dRender._ctx.fillStyle = bgColor;
            _dRender._ctx.fillRect(0, 0, w, h);
        }
        obj.render(_dRender);
        obj.parent = objInfo.p;
        obj.x = objInfo.x;
        obj.y = objInfo.y;
        obj.scaleX = objInfo.scX;
        obj.scaleY = objInfo.scY;
        obj.rotation = objInfo.r;
        obj.skewX = objInfo.skX;
        obj.skewY = objInfo.skY;
        if (!typeInfo) {
            typeInfo = {type: "png"};
        }
        return _dRender.rootContainer.toDataURL("image/" + typeInfo.type, typeInfo.quality);
    };
}