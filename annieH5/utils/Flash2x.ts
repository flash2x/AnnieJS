/**
 * Flash资源加载或者管理类，静态类，不可实例化
 * 一般都是初始化或者设置从Flash里导出的资源
 * @class annie
 */
namespace annie {
    import URLLoader = annie.URLLoader;
    import Event = annie.Event;
    import ColorFilter=annie.ColorFilter;
    import Shape=annie.Shape;
    import Bitmap=annie.Bitmap;
    import BlurFilter=annie.BlurFilter;
    import ShadowFilter=annie.ShadowFilter;
    import ColorMatrixFilter=annie.ColorMatrixFilter;
    //打包swf用
    export let _isReleased = false;
    export let suffixName = ".swf";
    //打包swf用
    export let _shareSceneList: any = [];
    //存储加载资源的总对象
    export let res: any = {};
    // 加载器是否正在加载中
    let _isLoading: boolean;
    // 加载中的场景名列表
    let _loadSceneNames: any;
    //加载地址的域名地址或前缀
    let _domain: string;
    //当前加载到哪一个资源
    let _loadIndex: number;
    // 当前加载的总资源数
    let _totalLoadRes: number;
    //当前已经加载的资源数
    let _loadedLoadRes: number;
    //加载资源的完成回调
    let _completeCallback: Function;
    //加载资源时的进度回调
    let _progressCallback: Function;
    //加载配置文件的加载器
    let _JSONQueue: URLLoader;
    //加载资源文件的加载器
    let _loaderQueue: URLLoader;
    // 加载器是否初始化过
    let _isInited: Boolean;
    // 当前加载的资源配置文件内容
    let _currentConfig: any;
    //获取当前加载的时间当作随机数用
    let _time: number = new Date().getTime();
    // 加载资源数和总资源数的比
    let _loadPer: number;
    //单个资源占总资源数的比
    let _loadSinglePer: number;
    /**
     * <h4><font color="red">注意:小程序 小游戏里这个方法是同步方法</font></h4>
     * 加载一个flash2x转换的文件内容,如果未加载完成继续调用此方法将会刷新加载器,中断未被加载完成的资源
     * @method annie.loadScene
     * @public
     * @static
     * @since 1.0.0
     * @param {string} sceneName fla通过flash2x转换时设置的包名
     * @param {Function} progressFun 加载进度回调,回调参数为当前的进度值1-100
     * @param {Function} completeFun 加载完成回调,回调参数为当前加载的场景信息
     * @param {string} domain 加载时要设置的url前缀,默认则不更改加载路径
     */
    export let loadScene = function (sceneName: any, progressFun: Function, completeFun: Function, domain: string = ""): void {
        //加载资源配置文件
        if (_isLoading) {
            _JSONQueue.loadCancel();
            _loaderQueue.loadCancel();
        }
        _loadSceneNames = [];
        _domain = domain;
        if (typeof(sceneName) == "string") {
            if (!isLoadedScene(sceneName)) {
                res[sceneName] = {};
                _loadSceneNames.push(sceneName);
            } else {
                let info: any = {};
                info.sceneName = sceneName;
                info.sceneId = 1;
                info.sceneTotal = 1;
                completeFun(info);
            }
        }
        else {
            let len = sceneName.length;
            let index = 0;
            for (let i = 0; i < len; i++) {
                if (!isLoadedScene(sceneName[i])) {
                    res[sceneName[i]] = {};
                    _loadSceneNames.push(sceneName[i]);
                } else {
                    let info: any = {};
                    info.sceneName = sceneName[i];
                    info.sceneId = ++index;
                    info.sceneTotal = len;
                    completeFun(info);
                }
            }
        }
        if (_loadSceneNames.length == 0) {
            return;
        }
        if (!_isInited) {
            _JSONQueue = new URLLoader();
            _JSONQueue.addEventListener(Event.COMPLETE, onCFGComplete);
            _loaderQueue = new URLLoader();
            _loaderQueue.addEventListener(Event.COMPLETE, _onRESComplete);
            _loaderQueue.addEventListener(Event.PROGRESS, _onRESProgress);
            _isInited = true;
        }
        _loadResCount = 0;
        _loadPer = 0;
        _loadIndex = 0;
        _totalLoadRes = 0;
        _loadedLoadRes = 0;
        _isLoading = true;
        _completeCallback = completeFun;
        _progressCallback = progressFun;
        _currentConfig = [];
        if (!_isReleased) {
            _loadConfig();
        } else {
            //加载正式的单个文件
            _totalLoadRes = _loadSceneNames.length;
            _loadSinglePer = 1 / _totalLoadRes;
            for (let i = 0; i < _totalLoadRes; i++) {
                _currentConfig.push([{src: "src/" + _loadSceneNames[i] + "/" + _loadSceneNames[i] + suffixName}]);
            }
            _loadRes();
        }
    };
    //加载配置文件,打包成released线上版时才会用到这个方法。
    //打包released后，所有资源都被base64了，所以线上版不会调用这个方法。
    function _loadConfig(): void {
        _JSONQueue.load(_domain + "resource/" + _loadSceneNames[_loadIndex] + "/" + _loadSceneNames[_loadIndex] + ".res.json?t=" + _time);
    }

    //加载配置文件完成时回调，打包成released线上版时才会用到这个方法。
    //打包released后，所有资源都被base64了，所以线上版不会调用这个方法。
    function onCFGComplete(e: Event): void {
        //配置文件加载完成
        let resList: any = e.data.response;
        _currentConfig.push(resList);
        _totalLoadRes += resList.length;
        _loadIndex++;
        if (_loadSceneNames[_loadIndex]) {
            _loadConfig();
        }
        else {
            //所有配置文件加载完成,那就开始加载资源
            _loadIndex = 0;
            _loadSinglePer = 1 / _totalLoadRes;
            _loadRes();
        }
    }

    // 加载资源过程中调用的回调方法。
    function _onRESProgress(e: Event): void {
        if (_progressCallback) {
            let ww: any = window;
            let total = e.data.totalBytes;
            if (ww.swfBytes && ww.swfBytes[_loadSceneNames[_loadIndex]]) {
                total = ww.swfBytes[_loadSceneNames[_loadIndex]];
            }
            _progressCallback((_loadPer + e.data.loadedBytes / total * _loadSinglePer) * 100 >> 0);
        }
    }

    //解析加载后的json资源数据
    function _parseContent(loadContent: any) {
        //在加载完成之后解析并调整json数据文件，_a2x_con应该是con.json文件里最后一个被加载的，这个一定在fla生成json文件时注意
        //主要工作就是遍历时间轴并调整成方便js读取的方式
        let mc: any;
        for (let item in loadContent) {
            mc = loadContent[item];
            if (mc.t == 1) {
                if (!(mc.f instanceof Object)) {
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
                        if (frameCon instanceof Object) {
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
                            if (lastFrameCon instanceof Object) {
                                for (let j in lastFrameCon) {
                                    //上一帧有，这一帧没有，加进来
                                    if (!(frameCon[j] instanceof Object)) {
                                        frameCon[j] = lastFrameCon[j];
                                    } else {
                                        //上一帧有，这一帧也有那么at就只有-1一种可能
                                        if (frameCon[j].at != -1) {
                                            //如果不为空，则更新元素
                                            for (let m in lastFrameCon[j]) {
                                                //这个地方一定要用undefined。因为有些元素可能为0.当然不是所有的元素都要补，比如滤镜，为空就不需要补
                                                if (frameCon[j][m] == void 0&&m!="fi") {
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
        _loadResCount--;
        if (_loadResCount == 0) {
            _checkComplete();
        }
    }

    let _loadResCount = 0;
    let mediaResourceOnload = function (e: any) {
        if (e != void 0) {
            URL.revokeObjectURL(e.target.url);
            if (e.target instanceof Image) {
                e.target.onload = null;
            } else {
                e.target.mediaResourceOnload = null;
            }
        }
        _loadResCount--;
        if (_loadResCount == 0) {
            _checkComplete();
        }
    };

    // 一个场景加载完成后的事件回调
    function _onRESComplete(e: Event): void {
        let scene = _loadSceneNames[_loadIndex];
        let loadContent: any = e.data.response;
        if (!_isReleased) {
            if (e.data.type != "js" && e.data.type != "css") {
                res[scene][_currentConfig[_loadIndex][0].id] = loadContent;
                if (_currentConfig[_loadIndex][0].id == "_a2x_con") {
                    _loadResCount++;
                    _parseContent(loadContent);
                } else {
                    if (e.data.type == "image") {
                        //图片
                        _loadResCount++;
                        let image = new Image();
                        image.onload = mediaResourceOnload;
                        image.src = URL.createObjectURL(loadContent);
                        annie.res[scene][_currentConfig[_loadIndex][0].id] = image;
                    }
                    else if (e.data.type == "sound") {
                        //声音
                        let audio: any = new Audio();
                        _loadResCount++;
                        if (annie.osType == "ios") {
                            let sFileReader = new FileReader();
                            sFileReader.onload = function () {
                                audio.src = sFileReader.result;
                                mediaResourceOnload(null);
                            };
                            sFileReader.readAsDataURL(loadContent);
                        } else {
                            audio.onloadedmetadata = mediaResourceOnload;
                            audio.src = URL.createObjectURL(loadContent);
                        }
                        annie.res[scene][_currentConfig[_loadIndex][0].id] = audio;
                    } else {
                        _checkComplete();
                    }
                }
            } else {
                _checkComplete();
            }
        } else {
            //解析swf
            let fileReader: any = new FileReader();
            let state = 0;
            let lastIndex = 0;
            let currIndex = 1;
            let JSONData: any;
            fileReader.readAsText(loadContent.slice(loadContent.size - currIndex, loadContent.size));
            fileReader.onload = function () {
                if (state == 0) {
                    //获取JSON有多少字节
                    state++;
                    lastIndex = currIndex;
                    currIndex += parseInt(fileReader.result);
                    fileReader.readAsText(loadContent.slice(loadContent.size - currIndex, loadContent.size - lastIndex));
                } else if (state == 1) {
                    //获取JSON具体字节数
                    state++;
                    lastIndex = currIndex;
                    currIndex += parseInt(fileReader.result);
                    fileReader.readAsText(loadContent.slice(loadContent.size - currIndex, loadContent.size - lastIndex));
                } else if (state == 2) {
                    state++;
                    lastIndex = 0;
                    currIndex = 0;
                    //解析JSON数据
                    JSONData = JSON.parse(fileReader.result);
                    lastIndex = currIndex;
                    currIndex += JSONData[0].src;
                    _loadResCount = JSONData.length - 1;
                    fileReader.readAsText(loadContent.slice(lastIndex, currIndex));
                } else if (state == 3) {
                    state++;
                    Eval(fileReader.result);
                    //解析JSON数据
                    for (let i = 1; i < JSONData.length; i++) {
                        lastIndex = currIndex;
                        currIndex += JSONData[i].src;
                        if (JSONData[i].type == "image") {
                            let image: any = new Image();
                            image.onload = mediaResourceOnload;
                            image.src = URL.createObjectURL(loadContent.slice(lastIndex, currIndex));
                            annie.res[scene][JSONData[i].id] = image;
                        } else if (JSONData[i].type == "sound") {
                            let audio: any = new Audio();
                            if (annie.osType == "ios") {
                                let sFileReader = new FileReader();
                                sFileReader.onload = function () {
                                    audio.src = sFileReader.result;
                                    mediaResourceOnload(null);
                                };
                                sFileReader.readAsDataURL(loadContent.slice(lastIndex, currIndex, "audio/mp3"));
                            } else {
                                audio.onloadedmetadata = mediaResourceOnload;
                                audio.src = URL.createObjectURL(loadContent.slice(lastIndex, currIndex, "audio/mp3"));
                            }
                            annie.res[scene][JSONData[i].id] = audio;
                        } else if (JSONData[i].type == "json") {
                            if (JSONData[i].id == "_a2x_con") {
                                let conReader:any=new FileReader();
                                conReader.onload=function(){
                                    annie.res[scene]["_a2x_con"] = JSON.parse(conReader.result);
                                    _parseContent(annie.res[scene]["_a2x_con"]);
                                    conReader.onload=null;
                                };
                                conReader.readAsText(loadContent.slice(lastIndex, currIndex));
                            }
                        }
                    }
                }
            };
        }
    }

    //检查所有资源是否全加载完成
    function _checkComplete(): void {
        if (!_isReleased)
            _currentConfig[_loadIndex].shift();
        _loadedLoadRes++;
        _loadPer = _loadedLoadRes / _totalLoadRes;
        if (!_isReleased && _currentConfig[_loadIndex].length > 0) {
            _loadRes();
        } else {
            res[_loadSceneNames[_loadIndex]]._f2x_had_loaded_scene = true;
            let info: any = {};
            info.sceneName = _loadSceneNames[_loadIndex];
            _loadIndex++;
            info.sceneId = _loadIndex;
            info.sceneTotal = _loadSceneNames.length;
            if (_loadIndex == _loadSceneNames.length) {
                //全部资源加载完成
                _isLoading = false;
                _completeCallback(info);
            }
            else {
                _completeCallback(info);
                _loadRes();
            }
        }
    }

    //加载场景资源
    function _loadRes(): void {
        let url = _domain + _currentConfig[_loadIndex][0].src;
        if (_isReleased) {
            _loaderQueue.responseType = "swf";
            url += "?v=" + _isReleased;
        } else {
            url += "?v=" + _time;
        }
        _loaderQueue.load(url);
    }

    /**
     * 判断一个场景是否已经被加载
     * @method annie.isLoadedScene
     * @public
     * @static
     * @since 1.0.0
     * @param {string} sceneName
     * @return {boolean}
     */
    export function isLoadedScene(sceneName: string): Boolean {
        if (res[sceneName] != undefined && res[sceneName] != null && res[sceneName]._f2x_had_loaded_scene) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 删除一个场景资源,以方便系统垃圾回收
     * @method annie.unLoadScene
     * @public
     * @static
     * @since 1.0.2
     * @param {string} sceneName
     */
    export function unLoadScene(sceneName: string): void {
        delete res[sceneName];
        let w: any = window;
        let scene: any = w[sceneName];
        for (let i in scene) {
            delete scene[i];
        }
        delete w[sceneName];
        scene = null;
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
        return res[sceneName][resName];
    }
    /**
     * 新建一个已经加载到场景中的类生成的对象
     * @method annie.getDisplay
     * @public
     * @static
     * @since 3.2.1
     * @param {string} sceneName
     * @param {string} className
     * @return {any}
     */
    export function getDisplay(sceneName:string,className:string):any {
        let Root: any = window;
        return new Root[sceneName][className]();
    }
    // 通过已经加载场景中的图片资源创建Bitmap对象实例,此方法一般给Annie2x工具自动调用
    function b(sceneName: string, resName: string): Bitmap {
        return new annie.Bitmap(res[sceneName][resName]);
    }

    //用一个对象批量设置另一个对象的属性值,此方法一般给Annie2x工具自动调用
    export function d(target: any, info: any, isMc: boolean = false): void {
        if (target._a2x_res_obj == info) {
            return;
        } else {
            //信息设置的时候看看是不是文本，如果有文本的话还需要设置宽和高
            if (info.tr == undefined || info.tr.length == 1) {
                info.tr = [0, 0, 1, 1, 0, 0];
            }
            let lastInfo = target._a2x_res_obj;
            if (info.al == void 0) {
                info.al = 1;
            }
            if(info.m==void 0){
                info.m=0;
            }
            target.blendMode=info.m;
            if(isMc){
                    let isUmChange:boolean=target.a2x_um;
                    if(!target._changeTransformInfo[0]&&target._x!=info.tr[0]){
                        target._x=info.tr[0];
                        isUmChange=true;
                    }
                    if(!target._changeTransformInfo[1]&&target._y!=info.tr[1]){
                        target._y=info.tr[1];
                        isUmChange=true;
                    }
                    if(!target._changeTransformInfo[2]&&target._scaleX!=info.tr[2]){
                        target._scaleX=info.tr[2];
                        isUmChange=true;
                    }
                    if(!target._changeTransformInfo[3]&&target._scaleY!=info.tr[3]){
                        target._scaleY=info.tr[3];
                        isUmChange=true;
                    }
                    if(!target._changeTransformInfo[4]){
                        if(target._skewX!=info.tr[4]){
                            target._skewX=info.tr[4];
                            target._rotation=0;
                            isUmChange=true;
                        }
                        if(target._skewY!=info.tr[5]){
                            target._skewY=info.tr[5];
                            target._rotation=0;
                            isUmChange=true;
                        }
                    }
                    target.a2x_um=isUmChange;
                if(!target._changeTransformInfo[5]&&target._alpha!=info.al) {
                    target._alpha = info.al;
                    target.a2x_ua = true;
                }
            }else{
                if(lastInfo.tr != info.tr){
                    [target._x, target._y, target._scaleX, target._scaleY, target._skewX, target._skewY] = info.tr;
                    target.a2x_um=true;
                }
                if(target._alpha!=info.al) {
                    target._alpha = info.al;
                    target.a2x_ua = true;
                }
            }
            if (info.w != undefined) {
                target.textWidth = info.w;
                target.textHeight = info.h;
            }
            //动画播放模式 图形 按钮 动画
            if (info.t != undefined) {
                if (info.t == -1) {
                    //initButton
                    if (target.initButton) {
                        target.initButton();
                    }
                }
                target._a2x_mode = info.t;
            }

            ///////////////////////////////////////////
            //添加滤镜
            if (lastInfo.fi != info.fi) {
                if (info.fi != void 0) {
                    let filters: any = [];
                    let blur: any;
                    let color: any;
                    for (let i = 0; i < info.fi.length; i++) {
                        switch (info.fi[i][0]) {
                            case 0:
                                blur = (info.fi[i][2] + info.fi[i][3]) * 0.5;
                                color = Shape.getRGBA(info.fi[i][10], info.fi[i][11]);
                                let offsetX = info.fi[i][4] * Math.cos(info.fi[i][1]);
                                let offsetY = info.fi[i][4] * Math.sin(info.fi[i][1]);
                                filters[filters.length] = new ShadowFilter(color, offsetX, offsetY, blur);
                                break;
                            case 1:
                                //模糊滤镜
                                filters[filters.length] = new BlurFilter(info.fi[i][1], info.fi[i][2], info.fi[i][3]);
                                break;
                            case 2:
                                blur = (info.fi[i][1] + info.fi[i][2]) * 0.5;
                                color = Shape.getRGBA(info.fi[i][7], info.fi[i][6]);
                                filters[filters.length] = new ShadowFilter(color, 0, 0, blur);
                                break;
                            case 6:
                                filters[filters.length] = new ColorMatrixFilter(info.fi[i][1], info.fi[i][2], info.fi[i][3], info.fi[i][4]);
                                break;
                            case 7:
                                filters[filters.length] = new ColorFilter(info.fi[i][1]);
                                break;
                            default :
                            //其他还先未实现
                        }
                    }
                    if (filters.length > 0) {
                        target.filters = filters;
                    } else {
                        target.filters = null;
                    }
                } else {
                    target.filters = null;

                }
            }
            target._a2x_res_obj = info;
        }
    }

    // 解析数据里需要确定的文本类型
    let _textLineType: Array<string> = ["single", "multiline"];
    //解析数据里需要确定的文本对齐方式
    let _textAlign: Array<string> = ["left", "center", "right"];

    //创建一个动态文本或输入文本,此方法一般给Annie2x工具自动调用
    function t(sceneName: string, resName: string): any {
        let textDate = res[sceneName]._a2x_con[resName];
        let textObj: any;
        let text = decodeURIComponent(textDate[9]);
        let font = decodeURIComponent(textDate[4]).replace(/\s(Regular|Medium)/, "");
        let size = textDate[5];
        let textAlign = _textAlign[textDate[3]];
        let lineType = _textLineType[textDate[2]];
        let italic = textDate[11];
        let bold = textDate[10];
        let color = textDate[6];
        let textAlpha = textDate[7];
        let border = textDate[12];
        let lineHeight = textDate[8];
        if (textDate[1] == 0 || textDate[1] == 1) {
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
            textObj.lineHeight = lineHeight;
        } else {
            textObj = new annie.InputText(textDate[2]);
            textObj.initInfo(text, color, textAlign, size, font, border, lineHeight);
            textObj.italic = italic;
            textObj.bold = bold;
        }
        return textObj;
    }

    //创建一个Shape矢量对象,此方法一般给Annie2x工具自动调用
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
                    shape.beginBitmapFill(getResource(sceneName, shapeDate[i][2][0]), shapeDate[i][2][1]);
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
                    shape.beginBitmapStroke(getResource(sceneName, shapeDate[i][2][0]), shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endStroke();
            }
        }
        return shape;
    }

    // 获取声音实例
    function s(sceneName: string, resName: string): annie.Sound {
        return new annie.Sound(res[sceneName][resName]);
    }

    /**
     * 向后台请求或者传输数据的快速简便方法,比直接用URLLoader要方便,小巧
     * @method annie.ajax
     * @public
     * @static
     * @since 1.0.0
     * @param info 向后台传送数据所需要设置的信息
     * @param {url} info.url 向后台请求的地址
     * @param {string} info.type 向后台请求的类型 get 和 post,默认为get
     * @param {Function} info.success 发送成功后的回调方法,后台数据将通过参数传回
     * @param {Function} info.error 发送出错后的回调方法,出错信息通过参数传回
     * @param {Object} info.data 向后台发送的信息对象,默认为null
     * @param {string} info.responseType 后台返回数据的类型,默认为"json"
     * @param {string} info.dataType 传给后台数据的类型,默认为"json"
     * @param {boolean} info.isNeedOption 是否需要添加X-Requested-With 头
     * @example
     *      //get
     *      annie.ajax({
     *             type: "GET",
     *             url: serverUrl + "Home/Getinfo/getPersonInfo",
     *             responseType: 'json',
     *             dataType:"json",
     *             success: function (result) {console.log(result)},
     *             error: function (result) {console.log(result)}
     *      })
     *      //post
     *      annie.ajax({
     *             type: "POST",
     *             url: serverUrl + "Home/Getinfo/getPersonInfo",
     *             data: {phone:'135******58'},
     *             responseType: 'json',
     *             dataType:"json",
     *             success: function (result) {console.log(result)},
     *             error: function (result) {console.log(result)}
     *      })
     */
    export function ajax(info: any): void {
        let urlLoader = new URLLoader();
        urlLoader.method = info.type == undefined ? "get" : info.type;
        urlLoader.data = info.data == undefined ? null : info.data;
        urlLoader.responseType = info.responseType == undefined ? "json":info.responseType;
        if (info.success) {
            urlLoader.addEventListener(annie.Event.COMPLETE, info.success);
        }
        if (info.error||info.fail) {
            if(info.error){
                urlLoader.addEventListener(annie.Event.ERROR, info.error);
            }else{
                urlLoader.addEventListener(annie.Event.ERROR, info.fail);
            }
        }
        if(info.dataType){
            urlLoader.load(info.url,info.dataType);
        }else{
            urlLoader.load(info.url);
        }
    }

    /**
     * <h4><font color="red">注意:小程序 小游戏不支持</font></h4>
     * jsonp调用方法
     * @method annie.jsonp
     * @param url
     * @param type 0或者1 如果是0，后台返回的是data型jsonp 如果是1，后台返回的是方法型jsonp
     * @param callbackName
     * @param callbackFun
     * @static
     * @since 1.0.4
     * @example
     *      annie.jsonp('js/testData.js', 1, 'getdata', function (result) {
     *          console.log(result);
     *      })
     */
    export function jsonp(url: string, type: number, callbackName: string, callbackFun: any) {
        let w: any = window;
        if (type == 1) {
            w[callbackName] = callbackFun;
        }
        let jsonpScript: any = document.createElement('script');
        let head: any = document.getElementsByTagName('head')[0];
        jsonpScript.onload = function (e: any) {
            if (type == 0) {
                callbackFun(w[callbackName]);
            }
            e.path[0].src = "";
            w[callbackName] = null;
            delete w[callbackName];
            head.removeChild(e.path[0]);
        };
        head.appendChild(jsonpScript);
        let param: string;
        if (url.indexOf("?") > 0) {
            param = "&";
        } else {
            param = "?";
        }
        jsonpScript.src = url + param + "a_n_n_i_e=" + Math.random() + "&callback=" + callbackName;
    }

    /**
     * <h4><font color="red">注意:小程序 小游戏不支持</font></h4>
     * 获取url地址中的get参数
     * @method annie.getQueryString
     * @static
     * @param name
     * @return {any}
     * @since 1.0.9
     * @public
     * @example
     *      //如果当前网页的地址为http://xxx.xxx.com?id=1&username=anlun
     *      //通过此方法获取id和username的值
     *      var id=annie.getQueryString("id");
     *      var userName=annie.getQueryString("username");
     *      console.log(id,userName);
     */
    export function getQueryString(name: string) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
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
        let Root: any = window;
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
            if (resClass.timeLine == void 0) {
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
                if (!(resClass.f instanceof Object)) resClass.f = [];
                if (!(resClass.a instanceof Object)) resClass.a = {};
                if (!(resClass.s instanceof Object)) resClass.s = {};
                if (!(resClass.e instanceof Object)) resClass.e = {};
                let label: any = {};
                if (!(resClass.l instanceof Object)) {
                    resClass.l = [];
                } else {
                    for (let index in resClass.l) {
                        for (let n = 0; n < resClass.l[index].length; n++) {
                            label[resClass.l[index][n]] = parseInt(index) + 1;
                        }
                    }
                }
                resClass.label = label;
            }
        }
        let children = resClass.c;
        if (children instanceof Object) {
            let allChildren: any = [];
            let objCount = children.length;
            let obj: any = null;
            let objType: number = 0;
            let maskObj: any = null;
            let maskTillId = 0;
            for (i = 0; i < objCount; i++) {
                //if (children[i].indexOf("_$") == 0) {
                if (classRoot[children[i]] instanceof Array) {
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
                        obj.name = children[i];
                        target.addSound(obj);
                }
                if (!isMc) {
                    let index: number = i + 1;
                    if (objType == 5) {
                        obj._loop = obj._repeate = resClass.s[0][index];
                    } else {
                        d(obj, resClass.f[0].c[index]);
                        // 检查是否有遮罩
                        if (resClass.f[0].c[index].ma != void 0) {
                            maskObj = obj;
                            maskTillId = resClass.f[0].c[index].ma - 1;
                        } else {
                            if (maskObj instanceof Object && i <= maskTillId) {
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
                        obj.isPlaying = false;
                        if (!(target._a2x_sounds instanceof Object)) {
                            target._a2x_sounds = {};
                        }
                        target._a2x_sounds[i] = obj;
                    }
                }
            }
            if (isMc) {
                //将mc里面的实例按照时间轴上的图层排序
                let ol = resClass.ol;
                if (ol instanceof Object) {
                    for (let o = 0; o < ol.length; o++) {
                        target._a2x_res_children[o] = [ol[o], allChildren[ol[o] - 1]];
                    }
                }
            }
        }
    }
    console.log("https://github.com/flash2x/AnnieJS");
}