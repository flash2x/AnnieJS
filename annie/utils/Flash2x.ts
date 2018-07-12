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
    //打包swf用
    export let _shareSceneList: any = [];
    /**
     * 存储加载资源的总对象
     * @property res
     * @public
     * @type {Object}
     */
    export let res: any = {};
    /**
     * 加载器是否正在加载中
     * @property _isLoading
     * @type {boolean}
     * @private
     */
    let _isLoading: boolean;
    /**
     * 加载中的场景名列表
     *
     */
    let _loadSceneNames: any;
    /**
     * 加载地址的域名地址或前缀
     */
    let _domain: string;
    /**
     * 当前加载到哪一个资源
     */
    let _loadIndex: number;
    /**
     * 当前加载的总资源数
     */
    let _totalLoadRes: number;
    /**
     * 当前已经加载的资源数
     */
    let _loadedLoadRes: number;
    /**
     * 加载资源的完成回调
     */
    let _completeCallback: Function;
    /**
     * 加载资源时的进度回调
     */
    let _progressCallback: Function;
    /**
     * 加载配置文件的加载器
     */
    let _JSONQueue: URLLoader;
    /**
     * 加载资源文件的加载器
     */
    let _loaderQueue: URLLoader;
    /**
     * 加载器是否初始化过
     */
    let _isInited: Boolean;
    /**
     * 当前加载的资源配置文件内容
     */
    let _currentConfig: any;
    /**
     * 获取当前加载的时间当作随机数用
     */
    let _time: number = new Date().getTime();
    /**
     * 加载资源数和总资源数的比
     */
    let _loadPer: number;
    /**
     * 单个资源占总资源数的比
     */
    let _loadSinglePer: number;
    /**
     * 加载一个flash2x转换的文件内容,如果未加载完成继续调用此方法将会刷新加载器,中断未被加载完成的资源
     * @method loadScene
     * @public
     * @static
     * @since 1.0.0
     * @param {string} sceneName fla通过flash2x转换时设置的包名
     * @param {Function} progressFun 加载进度回调,回调参数为当前的进度值1-100
     * @param {Function} completeFun 加载完成回高,无回调参数
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
            if (_isReleased) {
                trace("AnnieJS:https://github.com/flash2x/annieJS");
            }
            _JSONQueue = new URLLoader();
            _JSONQueue.addEventListener(Event.COMPLETE, onCFGComplete);
            _loaderQueue = new URLLoader();
            _loaderQueue.addEventListener(Event.COMPLETE, _onRESComplete);
            _loaderQueue.addEventListener(Event.PROGRESS, _onRESProgress);
            _isInited = true;
        }
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
            //看看是否需要加载共享资源
            if (_shareSceneList.length > 0 && (!isLoadedScene("f2xShare"))) {
                for (let i = 0; i < _loadSceneNames.length; i++) {
                    if (_shareSceneList.indexOf(_loadSceneNames[i]) >= 0) {
                        _loadSceneNames.unshift("f2xShare");
                        break;
                    }
                }
            }
            _loadIndex = 0;
            _totalLoadRes = _loadSceneNames.length;
            _loadSinglePer = 1 / _totalLoadRes;
            for (let i = 0; i < _totalLoadRes; i++) {
                _currentConfig.push([{src: "src/" + _loadSceneNames[i] + "/" + _loadSceneNames[i] + ".swf"}]);
            }
            _loadRes();
        }
    };

    function _loadConfig(): void {
        _JSONQueue.load(_domain + "resource/" + _loadSceneNames[_loadIndex] + "/" + _loadSceneNames[_loadIndex] + ".res.json?t=" + _time);
    }

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

    function _onRESProgress(e: Event): void {
        if (_progressCallback) {
            _progressCallback((_loadPer + e.data.loadedBytes / e.data.totalBytes * _loadSinglePer) * 100 >> 0);
        }
    }

    function _parseContent(loadContent: any, rootObj: any = null) {
        //在加载完成之后解析并调整json数据文件，_a2x_con应该是con.json文件里最后一个被加载的，这个一定在fla生成json文件时注意
        //主要工作就是遍历时间轴并调整成方便js读取的方式
        let mc: any = null;
        for (let item in loadContent) {
            mc = loadContent[item];
            if (mc.t == 1) {
                if (!mc.f) {
                    mc.f = [];
                    mc.tf = 1;
                    continue;
                }
                if (mc.tf > 1) {
                    let frameList = mc.f;
                    let count = frameList.length;
                    let frameCon: any = null;
                    let children: any = {};
                    let children2: any = {};
                    for (let i = 0; i < count; i++) {
                        frameCon = frameList[i].c;
                        if (frameCon) {
                            for (let j in frameCon) {
                                if (i == 0) {
                                    [children[j]] = [frameCon[j]];
                                } else {
                                    if (frameCon[j].a != 3) {
                                        children2[j] = frameCon[j];
                                    }
                                    if (frameCon[j].a != 1) {
                                        if (frameCon[j].a == 2) {
                                            for (let o in children[j]) {
                                                if (frameCon[j][o] == undefined) {
                                                    frameCon[j][o] = children[j][o];
                                                }
                                            }
                                        } else {
                                            delete  frameCon[j];
                                        }
                                        children[j] = null;
                                        delete  children[j];
                                    }
                                }
                            }
                            if (i > 0) {
                                for (let o in children) {
                                    frameCon[o] = children2[o] = children[o];
                                }
                                children = children2;
                                children2 = {};
                            }
                        }
                    }
                }
            } else {
                //如果是released版本，则需要更新资源数据
                if (_isReleased) {
                    if (loadContent[item] == 2) {
                        //图片
                        var image = new Image();
                        image.src = rootObj[item];
                        rootObj[item] = image;
                    } else if (loadContent[item] == 5) {
                        //声音
                        var audio = new Audio();
                        audio.src = rootObj[item];
                        rootObj[item] = audio;
                    }
                }
            }
        }
    }

    function _onRESComplete(e: Event): void {
        let scene = _loadSceneNames[_loadIndex];
        if (!_isReleased) {
            if (e.data.type != "js" && e.data.type != "css") {
                let loadContent: any = e.data.response;
                if (_currentConfig[_loadIndex][0].id == "_a2x_con") {
                    _parseContent(loadContent);
                }
                res[scene][_currentConfig[_loadIndex][0].id] = loadContent;
            }
        } else {
            if (scene != "f2xShare") {
                _parseContent(annie.res[_loadSceneNames[_loadIndex]]._a2x_con, annie.res[_loadSceneNames[_loadIndex]]);
            } else {
                _currentConfig.shift();
                _loadSceneNames.shift();
                _loadRes();
                return;
            }
        }
        _checkComplete();
    }

    function _checkComplete() {
        _loadedLoadRes++;
        _loadPer = _loadedLoadRes / _totalLoadRes;
        _currentConfig[_loadIndex].shift();
        res[_loadSceneNames[_loadIndex]]._f2x_had_loaded_scene = true;
        if (_currentConfig[_loadIndex].length > 0) {
            _loadRes();
        } else {
            var info: any = {};
            info.sceneName = _loadSceneNames[_loadIndex];
            _loadIndex++;
            info.sceneId = _loadIndex;
            info.sceneTotal = _loadSceneNames.length;
            if (_loadIndex == _loadSceneNames.length) {
                //全部资源加载完成
                _isLoading = false;
                //_progressCallback(100);
                setTimeout(function () {
                    _completeCallback(info);
                }, 100);
            }
            else {
                _completeCallback(info);
                _loadRes();
            }
        }
    }

    function _loadRes(): void {
        let url = _domain + _currentConfig[_loadIndex][0].src;
        if (_isReleased) {
            _loaderQueue.responseType = "js";
            url += "?v=" + _isReleased;
        } else {
            url += "?v=" + _time;
        }
        _loaderQueue.load(url);
    }

    /**
     * 判断一个场景是否已经被加载
     * @method isLoadedScene
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
     * @method unLoadScene
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
     * @method getResource
     * @public
     * @static
     * @since 2.0.0
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    export function getResource(sceneName: string, resName: string): any {
        let s = res;
        if (s[sceneName][resName]) {
            return s[sceneName][resName];
        }
        return null;
    }

    /**
     * 通过已经加载场景中的图片资源创建Bitmap对象实例,此方法一般给Flash2x工具自动调用
     * @method b
     * @public
     * @since 1.0.0
     * @static
     * @param {string} sceneName
     * @param {string} resName
     * @return {any}
     */
    function b(sceneName: string, resName: string): Bitmap {
        return new annie.Bitmap(res[sceneName][resName]);
    }

    /**
     * 用一个对象批量设置另一个对象的属性值,此方法一般给Flash2x工具自动调用
     * @method d
     * @public
     * @static
     * @since 1.0.0
     * @param {Object} target
     * @param {Object} info
     * @param {number} parentFrame
     */
    export function d(target: any, info: any, parentFrame: number = 1): void {
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
            if (info.t != undefined) {
                if (info.t == -1) {
                    //initButton
                    if (target.initButton) {
                        target.initButton();
                    }
                }
                target._mode = info.t;
            }
            ///////////////////////////////////////////
            //添加滤镜
            if (lastInfo.fi != info.fi) {
                if (info.fi != undefined) {
                    let filters: any = [];
                    let blur: any;
                    let color: any;
                    for (let i = 0; i < info.fi.length; i++) {
                        switch (info.fi[i].t) {
                            case 0:
                                blur = (info.fi[i].bx + info.fi[i].by) * 0.5;
                                color = Shape.getRGBA(info.fi[i].c, info.fi[i].a);
                                let offsetX = info.fi[i].by * Math.cos(info.fi[i].r / 180 * Math.PI);
                                let offsetY = info.fi[i].by * Math.sin(info.fi[i].r / 180 * Math.PI);
                                filters[filters.length] = new ShadowFilter(color, offsetX, offsetY, blur);
                                break;
                            case 1:
                                //模糊滤镜
                                filters[filters.length] = new BlurFilter(info.fi[i].bx, info.fi[i].by, info.fi[i].q);
                                break;
                            case 2:
                                blur = (info.fi[i].bx + info.fi[i].by) * 0.5;
                                color = Shape.getRGBA(info.fi[i].c, info.fi[i].a);
                                filters[filters.length] = new ShadowFilter(color, 0, 0, blur);
                                break;
                            case 6:
                                filters[filters.length] = new ColorMatrixFilter(info.fi[i].b, info.fi[i].c, info.fi[i].s, info.fi[i].h);
                                break;
                            case 7:
                                filters[filters.length] = new ColorFilter(info.fi[i].cm);
                                break;
                            default :
                            //其他还示实现
                        }
                    }
                    target.filters = filters;
                } else {
                    target.filters = null;
                }
            }
            target._a2x_res_obj = info;
        }
    }

    let _textLineType: Array<string> = ["single", "multiline"];
    let _textAlign: Array<string> = ["left", "center", "right"];

    /**
     * 创建一个动态文本或输入文本,此方法一般给Flash2x工具自动调用
     * @method t
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
            textObj.lineSpacing = lineSpacing;
        } else {
            textObj = new annie.InputText(textDate[2]);
            textObj.initInfo(text, color, textAlign, size, font, border, lineSpacing);
            textObj.italic = italic;
            textObj.bold = bold;
        }
        return textObj;
    }

    /**
     * 获取矢量位图填充所需要的位图,为什么写这个方法,是因为作为矢量填充的位图不能存在于SpriteSheet中,要单独画出来才能正确的填充到矢量中
     * @method sb
     */
    export function sb(sceneName: string, resName: string): annie.Bitmap {
        let sbName: string = "_f2x_s" + resName;
        if (res[sceneName][sbName]) {
            return res[sceneName][sbName];
        } else {
            let bitmapData: any = null;
            let bitmap = b(sceneName, resName);
            if (bitmap) {
                if (bitmap.rect) {
                    //从SpriteSheet中取出Image单独存放
                    bitmapData = annie.Bitmap.convertToImage(bitmap, false);
                } else {
                    bitmapData = bitmap.bitmapData;
                }
                res[sceneName][sbName] = bitmapData;
                return bitmapData;
            } else {
                trace("error:矢量位图填充时,未找到位图资源!");
                return null;
            }
        }
    }

    /**
     * 创建一个Shape矢量对象,此方法一般给Flash2x工具自动调用
     * @method g
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
                    shape.beginBitmapFill(b(sceneName, shapeDate[i][2][0]).bitmapData, shapeDate[i][2][1]);
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
                    shape.beginBitmapStroke(b(sceneName, shapeDate[i][2][0]).bitmapData, shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endStroke();
            }
        }
        return shape;
    }

    function s(sceneName: string, resName: string): annie.Sound {
        return new annie.Sound(res[sceneName][resName]);
    }

    /**
     * 向后台请求或者传输数据的快速简便方法,比直接用URLLoader要方便,小巧
     * @method ajax
     * @public
     * @since 1.0.0
     * @param info 向后台传送数据所需要设置的信息
     * @param {url} info.url 向后台请求的地址
     * @param {string} info.type 向后台请求的类型 get 和 post,默认为get
     * @param {Function} info.success 发送成功后的回调方法,后台数据将通过参数传回
     * @param {Function} info.error 发送出错后的回调方法,出错信息通过参数传回
     * @param {Object} info.data 向后台发送的信息对象,默认为null
     * @param {string} info.responseType 后台返回数据的类型,默认为"text"
     * @example
     *      //get
     *      Flash2x.ajax({
     *             type: "GET",
     *             url: serverUrl + "Home/Getinfo/getPersonInfo",
     *             responseType: 'json',
     *             success: function (result) {trace(result)},
     *             error: function (result) {trace(result)}
     *      })
     *      //post
     *      Flash2x.ajax({
     *             type: "POST",
     *             url: serverUrl + "Home/Getinfo/getPersonInfo",
     *             data: {phone:'135******58'},
     *             responseType: 'json',
     *             success: function (result) {trace(result)},
     *             error: function (result) {trace(result)}
     *      })
     */
    export function ajax(info: any): void {
        let urlLoader = new URLLoader();
        urlLoader.addHeader("X-Requested-With", "XMLHttpRequest");
        urlLoader.method = info.type == undefined ? "get" : info.type;
        urlLoader.data = info.data == undefined ? null : info.data;
        urlLoader.responseType = info.responseType == undefined ? "text" : info.responseType;
        if (info.success != undefined) {
            urlLoader.addEventListener(annie.Event.COMPLETE, info.success);
        }
        if (info.error != undefined) {
            urlLoader.addEventListener(annie.Event.ERROR, info.error);
        }
        urlLoader.load(info.url);
    }

    /**
     * jsonp调用方法
     * @method jsonp
     * @param url
     * @param type 0或者1 如果是0，后台返回的是data型jsonp 如果是1，后台返回的是方法型jsonp
     * @param callbackName
     * @param callbackFun
     * @static
     * @since 1.0.4
     * @example
     *      Flash2x.jsonp('js/testData.js', 1, 'getdata', function (result) {
     *          trace(result);
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
     * 获取url地址中的get参数
     * @method getQueryString
     * @static
     * @param name
     * @return {any}
     * @since 1.0.9
     * @example
     *      //如果当前网页的地址为http://xxx.xxx.com?id=1&username=anlun
     *      //通过此方法获取id和username的值
     *      var id=Flash2x.getQueryString("id");
     *      var userName=Flash2x.getQueryString("username");
     *      trace(id,userName);
     */
    export function getQueryString(name: string) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    /**
     * 引擎自调用.初始化 sprite和movieClip用
     * @param target
     * @param {string} _resId
     * @private
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
                            label[resClass.l[index][n]] = parseInt(index);
                        }
                    }
                }
                resClass.label = label;
            }
        }
        if (resClass.c) {
            let children = resClass.c;
            let objCount = children.length;
            let obj: any = null;
            let objId: number = 0;
            let maskObj: any = null;
            let maskTillId = 0;
            for (i = 0; i < objCount; i++) {
                //if (children[i].indexOf("_$") == 0) {
                if (Array.isArray(classRoot[children[i]])) {
                    objId = classRoot[children[i]][0];
                } else {
                    objId = classRoot[children[i]].t;
                }
                switch (objId) {
                    case 1:
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
                        break;
                    case 2:
                        //bitmap
                        obj = b(sceneName, children[i]);
                        break;
                    case 3:
                        //shape
                        obj = g(sceneName, children[i]);
                        break;
                    case 4:
                        //text
                        obj = t(sceneName, children[i]);
                        break;
                    case 5:
                        //sound
                        obj = s(sceneName, children[i]);
                        target.addSound(obj);
                }
                //这里一定把要声音添加到里面，以保证objectId与数组下标对应
                target._a2x_res_children[target._a2x_res_children.length] = obj;
                if (!isMc) {
                    let index: number = i + 1;
                    if (objId == 5) {
                        obj._repeate = resClass.s[0][index];
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
                }
                //检查是否有名字
                if (resClass.n[i] != undefined) {
                    target[resClass.n[i]] = obj;
                    obj.name = resClass.n[i];
                }
            }
        }
    }
}
