/**
 * @class annie
 */
namespace annie {
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
    export let version: string = "2.0.1";
    /**
     * 设备的retina值,简单点说就是几个像素表示设备上的一个点
     * @property annie.devicePixelRatio
     * @type {number}
     * @since 1.0.0
     * @public
     * @static
     */
    export let devicePixelRatio: number = 1;
    /**
     * 全局事件侦听
     * @property annie.globalDispatcher
     * @type {annie.EventDispatcher}
     * @static
     * @example
     */
    export let globalDispatcher: EventDispatcher = new annie.EventDispatcher();
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
     *      var s=this;
     *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
     *          var i=0;
     *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
     *              var aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
     *              s.stage.scaleMode=aList[i];
     *              if(i>5){i=0;}
     *          }
     *      }
     */
    export let StageScaleMode: { EXACT_FIT: string, NO_BORDER: string, NO_SCALE: string, SHOW_ALL: string, FIXED_WIDTH: string, FIXED_HEIGHT: string } = {
        EXACT_FIT: "exactFit",
        NO_BORDER: "noBorder",
        NO_SCALE: "noScale",
        SHOW_ALL: "showAll",
        FIXED_WIDTH: "fixedWidth",
        FIXED_HEIGHT: "fixedHeight"
    };
    let res: any = {};
    /**
     * 创建一个声音对象
     * @type {Audio}
     */
    export let createAudio: Function = null;
    export let getImageInfo: Function = null;
    /**
     * 继承类方法
     * @type {Function}
     */
    export let A2xExtend: any = null;
    /**
     * 加载后的类引用全放在这里
     * @type {Object}
     */
    export let classPool: any = null;
    /**
     * 加载场景的方法
     * @method annie.loadScene
     * @param {String|Array} 单个场景名或者多个场景名组成的数组
     * @type {Function}
     */
    export let loadScene: Function = null;

    /**
     * 是否已经加载过场景
     * @method annie.isLoadedScene
     * @param {string} sceneName
     * @return {boolean}
     */
    export function isLoadedScene(sceneName: string) {
        if (classPool[sceneName]) {
            return true;
        }
        return false;
    }
    /**
     * 删除加载过的场景
     * @method annie.unLoadScene
     * @param {string} sceneName
     */
    export function unLoadScene(sceneName: string) {
        classPool[sceneName] = null;
        delete classPool[sceneName];
    }
    /**
     * 解析资源
     * @method annie.parseScene
     * @param {string} sceneName
     * @param sceneRes
     * @param sceneData
     */
    export function parseScene(sceneName: string, sceneRes: any, sceneData: any) {
        res[sceneName] = {};
        res[sceneName]._a2x_con = sceneData;
        for (let i = 0; i < sceneRes.length; i++) {
            if (sceneRes[i].type == "image" || sceneRes[i].type == "sound") {
                res[sceneName][sceneRes[i].id] = sceneRes[i].src;
            }
        }
        let mc: any;
        for (let item in sceneData) {
            mc = sceneData[item];
            if (mc.t == 1) {
                if (!mc.f) {
                    mc.f = [];
                    continue;
                }
                if (mc.tf > 1) {
                    let frameList = mc.f;
                    let count = frameList.length;
                    let frameCon: any = null;
                    let lastFrameCon: any = null;
                    let ol: any = [];
                    for (let i = 0; i < count; i++) {
                        frameCon = frameList[i].c;
                        //这帧是否为空
                        if (frameCon) {
                            for (let j in frameCon) {
                                let at = frameCon[j].at;
                                if (at != undefined && at != -1) {
                                    if (at == 0) {
                                        ol.push(j);
                                    } else {
                                        for (let l = 0; l < ol.length; l++) {
                                            if (ol[l] == at) {
                                                ol.splice(l, 0, j);
                                                break;
                                            }
                                        }
                                    }
                                    delete frameCon[j].at;
                                }
                            }
                            //上一帧是否为空
                            if (lastFrameCon) {
                                for (let j in lastFrameCon) {
                                    //上一帧有，这一帧没有，加进来
                                    if (!frameCon[j]) {
                                        frameCon[j] = lastFrameCon[j];
                                    } else {
                                        //上一帧有，这一帧也有那么at就只有-1一种可能
                                        if (frameCon[j].at != -1) {
                                            //如果不为空，则更新元素
                                            for (let m in lastFrameCon[j]) {
                                                if (frameCon[j][m]==undefined) {
                                                    frameCon[j][m] = lastFrameCon[j][m];
                                                }
                                            }
                                        } else {
                                            //如果为-1，删除元素
                                            delete frameCon[j];
                                        }
                                    }
                                }
                            }
                        }
                        lastFrameCon = frameCon;
                    }
                    mc.ol = ol;
                }
            }
        }
    }

    /**
     * 获取已经加载场景中的资源
     * @method annie.getResource
     * @public
     * @static
     * @since 2.0.0
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    export function getResource(sceneName: string, resName: string): any {
        if (res[sceneName][resName]) {
            return res[sceneName][resName];
        }
        return null;
    }

    /**
     * 通过已经加载场景中的图片资源创建Bitmap对象实例,此方法一般给Flash2x工具自动调用
     * @method annie.b
     * @public
     * @since 1.0.0
     * @static
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    function b(sceneName: string, resName: string): any {
        return new Bitmap(res[sceneName][resName]);
    }

    /**
     * 用一个对象批量设置另一个对象的属性值,此方法一般给Flash2x工具自动调用
     * @method annie.d
     * @public
     * @static
     * @since 1.0.0
     * @param {Object} target
     * @param {Object} info
     */
    export function d(target: any, info: any): void {
        if (target._a2x_res_obj == info) {
            return;
        } else {
            //是不是文本
            let lastInfo = target._a2x_res_obj;
            if (info.w != undefined) {
                target.textWidth = info.w;
                target.textHeight = info.h;
            }
            //信息设置的时候看看是不是文本，如果有文本的话还需要设置宽和高
            if (info.tr == undefined || info.tr.length == 1) {
                info.tr = [0, 0, 1, 1, 0, 0];
            }
            if (lastInfo.tr != info.tr) {
                [target.x, target.y, target.scaleX, target.scaleY, target.skewX, target.skewY] = info.tr;
            }
            /*if (info.v == undefined) {
                info.v = 1;
            }*/
            //target.visible = new Boolean(info.v);
            target.alpha = info.al == undefined ? 1 : info.al;
            //动画播放模式 图形 按钮 动画
            if(info.t!=undefined) {
                if (info.t == -1) {
                    //initButton
                    if (target.initButton) {
                        target.initButton();
                    }
                }
                target._mode=info.t;
            }
            target._a2x_res_obj = info;
        }
    }
    let _textLineType: Array<string> = ["single", "multiline"];
    let _textAlign: Array<string> = ["left", "center", "right"];
    /**
     * 创建一个动态文本或输入文本,此方法一般给Flash2x工具自动调用
     * @method annie.t
     * @public
     * @static
     * @since 1.0.0
     * @return {annie.TextFiled|annie.InputText}
     */
    function t(sceneName: string, resName: string): any {
        let textDate = res[sceneName]._a2x_con[resName];
        let textObj: any;
        let text = decodeURIComponent(textDate[9]);
        let font = decodeURIComponent(textDate[4]);
        let size = textDate[5];
        let textAlign = _textAlign[textDate[3]];
        let lineType = _textLineType[textDate[2]];
        let italic = textDate[11];
        let bold = textDate[10];
        let color = textDate[6];
        let textAlpha = textDate[7];
        let border = textDate[12];
        let lineSpacing = textDate[8];
        //if (textDate[1] == 0 || textDate[1] == 1) {
        textObj = new annie.TextField();
        textObj.text = text;
        textObj.font = font;
        textObj.size = size;
        textObj.textAlign = textAlign;
        textObj.lineType = lineType;
        textObj.italic = italic;
        textObj.bold = bold;
        textObj.color = color;
        textObj.textAlpha = textAlpha;
        textObj.border = border;
        textObj.lineSpacing = lineSpacing;
        //} else {
        /*textObj = new annie.InputText(textDate[2]);
        textObj.initInfo(text, color, textAlign, size, font, border, lineSpacing);
        textObj.italic = italic;
        textObj.bold = bold;*/
        if (textDate[1] == 2)
            console.log("wxApp isn't support inputText");
        //}
        return textObj;
    }

    /**
     * 创建一个Shape矢量对象,此方法一般给Annie2x工具自动调用
     * @method annie.g
     * @public
     * @static
     * @since 1.0.0
     * @return {annie.Shape}
     */
    function g(sceneName: string, resName: string): Shape {
        let shapeDate = res[sceneName]._a2x_con[resName][1];
        let shape: annie.Shape = new annie.Shape();
        for (let i = 0; i < shapeDate.length; i++) {
            if (shapeDate[i][0] == 1) {
                if (shapeDate[i][1] == 0) {
                    shape.beginFill(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]));
                } else if (shapeDate[i][1] == 1) {
                    shape.beginLinearGradientFill(shapeDate[i][2][0], shapeDate[i][2][1]);
                } else if (shapeDate[i][1] == 2) {
                    shape.beginRadialGradientFill(shapeDate[i][2][0], shapeDate[i][2][1]);
                } else {
                    shape.beginBitmapFill(b(sceneName, shapeDate[i][2][0])._texture, shapeDate[i][2][1]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endFill();
            } else {
                if (shapeDate[i][1] == 0) {
                    shape.beginStroke(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]), shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                } else if (shapeDate[i][1] == 1) {
                    shape.beginLinearGradientStroke(shapeDate[i][2][0], shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                } else if (shapeDate[i][1] == 2) {
                    shape.beginRadialGradientStroke(shapeDate[i][2][0], shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                } else {
                    shape.beginBitmapStroke(b(sceneName, shapeDate[i][2][0])._texture, shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endStroke();
            }
        }
        return shape;
    }
    /**
     * 创建一个Sound声音对象,此方法一般给Annie2x工具自动调用
     * @method annie.s
     * @public
     * @static
     * @since 1.0.0
     * @return {annie.Sound}
     */
    function s(sceneName: string, resName: string): Sound {
        return new Sound(res[sceneName][resName]);
    }

    /**
     * 引擎自调用.初始化 sprite和movieClip用
     * @method annie.initRes
     * @param target
     * @param {string} sceneName
     * @param {string} resName
     * @public
     * @static
     */
    export function initRes(target: any, sceneName: string, resName: string) {
        let Root: any = classPool;
        //资源树最顶层
        let resRoot: any = res[sceneName];
        //资源树里类对象json数据
        let classRoot: any = resRoot._a2x_con;
        //资源树里类对象json数据里非资源类数据
        let resClass: any = classRoot[resName];
        //时间轴
        target._a2x_res_class = resClass;
        let isMc: boolean = false;
        let i: number;
        if (resClass.tf > 1) {
            isMc = true;
            if (resClass.timeLine == undefined) {
                //将时间轴丰满,抽出脚本，抽出标签
                let keyFrameCount = resClass.f.length;
                let timeLine: Array<number> = [];
                let curKeyFrame: number = keyFrameCount > 0 ? resClass.f[0].i : resClass.tf;
                let nextFrame: number = 0;
                if (curKeyFrame > 0) {
                    let frameValue: number = -1;
                    for (let j = 0; j < curKeyFrame; j++) {
                        timeLine[timeLine.length] = frameValue;
                    }
                }
                if (keyFrameCount > 0) {
                    for (i = 0; i < keyFrameCount; i++) {
                        if (i + 1 < keyFrameCount) {
                            nextFrame = resClass.f[i + 1].i
                        } else {
                            nextFrame = resClass.tf;
                        }
                        curKeyFrame = resClass.f[i].i;
                        //将时间线补齐
                        for (let j = 0; j < nextFrame - curKeyFrame; j++) {
                            timeLine[timeLine.length] = i;
                        }
                    }
                }
                resClass.timeLine = timeLine;
                //初始化标签对象方便gotoAndStop gotoAndPlay
                if (!resClass.f) resClass.f = [];
                if (!resClass.c) resClass.c = [];
                if (!resClass.a) resClass.a = {};
                if (!resClass.s) resClass.s = {};
                if (!resClass.e) resClass.e = {};
                let label: any = {};
                if (!resClass.l) {
                    resClass.l = [];
                } else {
                    for (let index in resClass.l) {
                        for (let n = 0; n < resClass.l[index].length; n++) {
                            label[resClass.l[index][n]] = parseInt(index)+1;
                        }
                    }
                }
                resClass.label = label;
            }
        }
        let children = resClass.c;
        if (children) {
            let allChildren: any = [];
            let objCount = children.length;
            let obj: any = null;
            let objType: number = 0;
            let maskObj: any = null;
            let maskTillId = 0;
            for (i = 0; i < objCount; i++) {
                //if (children[i].indexOf("_$") == 0) {
                if (Array.isArray(classRoot[children[i]])) {
                    objType = classRoot[children[i]][0];
                } else {
                    objType = classRoot[children[i]].t;
                }
                switch (objType) {
                    case 1:
                    case 4:
                        //text 和 Sprite
                        //检查是否有名字，并且已经初始化过了
                        if (resClass.n && resClass.n[i] && target[resClass.n[i]]) {
                            obj = target[resClass.n[i]];
                        } else {
                            if (objType == 4) {
                                obj = t(sceneName, children[i]);
                            }
                            else {
                                //displayObject
                                if (children[i].indexOf("_$") == 0) {
                                    if (classRoot[children[i]].tf > 1) {
                                        obj = new annie.MovieClip();
                                    } else {
                                        obj = new annie.Sprite();
                                    }
                                    initRes(obj, sceneName, children[i]);
                                } else {
                                    obj = new Root[sceneName][children[i]]();
                                }
                            }
                            if (resClass.n && resClass.n[i]) {
                                target[resClass.n[i]] = obj;
                                obj.name = resClass.n[i];
                            }
                        }
                        break;
                    case 2:
                        //bitmap
                        obj = b(sceneName, children[i]);
                        break;
                    case 3:
                        //shape
                        obj = g(sceneName, children[i]);
                        break;
                    case 5:
                        //sound
                        obj = s(sceneName, children[i]);
                        obj.name=children[i];
                        target.addSound(obj);
                }
                if (!isMc) {
                    let index: number = i + 1;
                    if (objType == 5) {
                        obj._loop=obj._repeate = resClass.s[0][index];
                    } else {
                        d(obj, resClass.f[0].c[index]);
                        // 检查是否有遮罩
                        if (resClass.f[0].c[index].ma != undefined) {
                            maskObj = obj;
                            maskTillId = resClass.f[0].c[index].ma - 1;
                        } else {
                            if (maskObj && i <= maskTillId) {
                                obj.mask = maskObj;
                                if (i == maskTillId) {
                                    maskObj = null;
                                }
                            }
                        }
                        target.addChildAt(obj, 0);
                    }
                } else {
                    //这里一定把要声音添加到里面，以保证objectId与数组下标对应
                    allChildren[allChildren.length] = obj;
                    //如果是声音，还要把i这个顺序保存下来
                    if (objType == 5) {
                        obj.isPlaying=false;
                        if (!target._a2x_sounds) {
                            target._a2x_sounds = {};
                        }
                        target._a2x_sounds[i] = obj;
                    }
                }
            }
            if (isMc) {
                //将mc里面的实例按照时间轴上的图层排序
                let ol = resClass.ol;
                if (ol) {
                    for (let o = 0; o < ol.length; o++) {
                        target._a2x_res_children[o] = [ol[o], allChildren[ol[o] - 1]];
                    }
                }
            }
        }
    }
    console.log("https://github.com/flash2x/AnnieJS");
}
