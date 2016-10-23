/**
 * @module annie
 */
namespace annie {
    /**
     * 资源加载管理模块
     * @module annie.RESManager
     * @class annie.RESManager
     */
    export namespace RESManager{
        /**
         * 存储加载资源的总对象
         * @type {Object}
         */
        var res:any ={};
        /**
         * 加载器是否正在加载中
         */
        var _isLoading:boolean;
        /**
         * 加载中的场景名列表
         */
        var _loadSceneNames:any;
        /**
         * 加载地址的域名地址或前缀
         */
        var _domain:string;
        /**
         * 当前加载到哪一个资源
         */
        var _loadIndex:number;
        /**
         * 当前加载的总资源数
         */
        var _totalLoadRes:number;
        /**
         * 当前已经加载的资源数
         */
        var _loadedLoadRes:number;
        /**
         * 加载资源的完成回调
         */
        var _completeCallback:Function;
        /**
         * 加载资源时的进度回调
         */
        var _progressCallback:Function;
        /**
         * 加载配置文件的加载器
         */
        var _JSONQueue:URLLoader;
        /**
         * 加载资源文件的加载器
         */
        var _loaderQueue:URLLoader;
        /**
         * 加载器是否初始化过
         */
        var _isInited:Boolean;
        /**
         * 当前加载的资源配置文件内容
         */
        var _currentConfig:any;
        /**
         * 获取当前加载的时间当作随机数用
         */
        var _time:number;
        /**
         * 加载资源数和总资源数的比
         */
        var _loadPer:number;
        /**
         * 单个资源占总资源数的比
         */
        var _loadSinglePer:number
        /**
         * 加载一个flash2x转换的文件内容,如果未加载完成继续调用此方法将会刷新加载器,中断未被加载完成的资源!
         * @method loadScene
         * @public
         * @static
         * @since 1.0.0
         * @param {string} sceneName fla通过flash2x转换时设置的包名
         * @param {Function} progressFun 加载进度回调,回调参数为当前的进度值1-100.
         * @param {Function} completeFun 加载完成回高,无回调参数
         * @param {string} domain 加载时要设置的url前缀,默认则不更改加载路径。
         */
        export var loadScene = function(sceneName:any, progressFun:Function, completeFun:Function,domain:string = ""):void {
            //加载资源配置文件
            if (_isLoading) {
                _JSONQueue.loadCancel();
                _loaderQueue.loadCancel();
            }
            _loadSceneNames = [];
            if (domain == undefined) {
                domain = "";
            }
            _domain = domain;
            if (typeof(sceneName) == "string") {
                if (!isLoadedScene(sceneName)) {
                    _loadSceneNames.push(sceneName);
                    res[sceneName] = new Object();
                }
            }
            else {
                var len = sceneName.length;
                for (var i = 0; i < len; i++) {
                    if (!isLoadedScene(sceneName[i])) {
                        res[sceneName[i]] = new Object();
                        _loadSceneNames.push(sceneName[i]);
                    }
                }
            }
            if (_loadSceneNames.length == 0) {
                if (completeFun) {
                    completeFun();
                }
                return;
            }
            if (!_isInited) {
                _time = new Date().getTime();
                _JSONQueue = new URLLoader();
                _JSONQueue.addEventListener(Event.COMPLETE, onCFGComplete);
                _loaderQueue = new URLLoader();
                _loaderQueue.addEventListener(Event.COMPLETE, _onRESComplete);
                _loaderQueue.addEventListener(Event.PROGRESS, _onRESProgress);
            }
            _loadPer=0;
            _loadIndex = 0;
            _totalLoadRes = 0;
            _loadedLoadRes = 0;
            _isLoading = true;
            _completeCallback = completeFun;
            _progressCallback = progressFun;
            _currentConfig = [];
            _loadConfig();
        }
        function _loadConfig():void {
            _JSONQueue.load(_domain + "resource/" + _loadSceneNames[_loadIndex] + "/" + _loadSceneNames[_loadIndex] + ".res.json?t=" + _time);
        }
        function onCFGComplete(e:Event):void {
            //配置文件加载完成
            var resList:any = e.data.response;
            _currentConfig.push(resList);
            _totalLoadRes += resList.length;
            _loadIndex++;
            if (_loadSceneNames[_loadIndex]) {
                _loadConfig();
            }
            else {
                //所有配置文件加载完成,那就开始加载资源
                _loadIndex = 0;
                _loadSinglePer=1/_totalLoadRes;
                _loadRes();
            }
        }
        function _onRESProgress(e:Event):void {
            if (_progressCallback){
                _progressCallback((_loadPer+e.data.loadedBytes/e.data.totalBytes*_loadSinglePer)*100>>0);
            }
        }
        function _onRESComplete(e:Event):void{
            if (e.data.type != "js"&&e.data.type!="css") {
                var id = _currentConfig[_loadIndex][0].id;
                var scene = _loadSceneNames[_loadIndex];
                if(e.data.type=="sound"){
                    res[scene][id] = new annie.Sound(e.data.response);
                }else {
                    res[scene][id] = e.data.response;
                }
            }
            _checkComplete();

        }
        function _checkComplete() {
            _loadedLoadRes++;
            _loadPer=_loadedLoadRes/_totalLoadRes;
            _currentConfig[_loadIndex].shift();
            if (_currentConfig[_loadIndex].length > 0) {
                _loadRes();
            }else {
                _loadIndex++;
                if (_loadIndex == _loadSceneNames.length) {
                    //全部资源加载完成
                    _isLoading = false;
                    //_progressCallback(100);
                    _completeCallback();
                }
                else {
                    _loadRes();
                }
            }
        }

        function _loadRes():void {
            var url = _domain + _currentConfig[_loadIndex][0].src;
            _loaderQueue.load(url);
        }

        /**
         * 判断一个场景是否已经被加载
         * @method isLoadedScene
         * @public
         * @static
         * @since 1.0.0
         * @param {string} sceneName
         * @returns {boolean}
         */
        export function isLoadedScene(sceneName:string):Boolean {
            if (res[sceneName] != undefined && res[sceneName] != null) {
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
         * @since 1.0.0
         * @param {string} sceneName
         */
        export function unLoadScene(sceneName:string):void{
            delete res[sceneName];
            var scene:any = eval(sceneName);
            for (var i in scene) {
                delete scene[i];
            }
            eval(sceneName + "=null;");
        }
        /**
         * 获取已经加载场景中的声音或视频资源
         * @method getMediaByName
         * @public
         * @static
         * @since 1.0.0
         * @param {string} sceneName
         * @param {string} mediaName
         * @returns {any}
         */
        export function getMediaByName(sceneName:string, mediaName:string):any {
            var s = res;
            if (s[sceneName][mediaName]) {
                return s[sceneName][mediaName];
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
         * @param {string} imageName
         * @returns {any}
         */
        export function b(sceneName:string, imageName:string):Bitmap {
            var s = res;
            var isFind = false;
            if (s[sceneName][imageName]) {
                return new annie.Bitmap(s[sceneName][imageName]);
            } else {
                var m = 0;
                while (s[sceneName]["F2xSSIMG" + m]) {
                    var data = s[sceneName]["F2xSSIMGData" + m];
                    if (data[imageName] != undefined) {
                        isFind = true;
                        var imgData = data[imageName];
                        var spriteSheet = s[sceneName]["F2xSSIMG" + m];
                        //return {image: spriteSheet, rect: imgData};
                        return new annie.Bitmap(spriteSheet, imgData);
                    }
                    m++;
                }
                return null;
            }
        }

        /**
         * 用一个对象批量设置另一个对象的属性值,此方法一般给Flash2x工具自动调用
         * @method d
         * @public
         * @static
         * @since 1.0.0
         * @param {Object} display
         * @param {Object} baseInfo
         * @param {Object} extendInfo
         */
        export function d(display:any, baseInfo:any=null, extendInfo:any = null):void {
            if (baseInfo) {
                if (baseInfo.x != undefined) {
                    display.x = baseInfo.x;
                }
                if (baseInfo.y != undefined) {
                    display.y = baseInfo.y;
                }
                if (baseInfo.a != undefined) {
                    display.scaleX = baseInfo.a;
                }
                if (baseInfo.b != undefined) {
                    display.scaleY = baseInfo.b;
                }
                if (baseInfo.r != undefined) {
                    display.rotation = baseInfo.r;
                }
                if (baseInfo.c != undefined) {
                    display.skewX = baseInfo.c;
                }
                if (baseInfo.d != undefined) {
                    display.skewY = baseInfo.d;
                }
                if (baseInfo.o != undefined) {
                    display.alpha = baseInfo.o;
                }
                if (baseInfo.v != undefined) {
                    display.visible = baseInfo.v;
                }
            }
            if(extendInfo&&extendInfo.length>0){
                var index=0;
                display.filters=[];
                while(extendInfo[index]!=undefined){
                    if(extendInfo[index]==0){
                        display.filters.push(new ColorFilter(extendInfo[index+1],extendInfo[index+2],extendInfo[index+3],extendInfo[index+4],extendInfo[index+5],extendInfo[index+6],extendInfo[index+7],extendInfo[index+8]));
                        index+=9;
                    }else if(extendInfo[index]==1){
                        display.filters.push(new BlurFilter(extendInfo[index+1],extendInfo[index+2],extendInfo[index+3]));
                        index+=4;
                    }else if(extendInfo[index]==2){
                        var blur=(extendInfo[index+1]+extendInfo[index+2])*0.5;
                        var color=Shape.getRGBA(extendInfo[index+4],extendInfo[index+5]);
                        var offsetX=extendInfo[index+7]*Math.cos(extendInfo[index+6]/180*Math.PI);
                        var offsetY=extendInfo[index+7]*Math.sin(extendInfo[index+6]/180*Math.PI);
                        display.filters.push(new ShadowFilter(color,offsetX,offsetY,blur));
                        index+=8;
                    }else if(extendInfo[index]==3){
                        var blur=(extendInfo[index+1]+extendInfo[index+2])*0.5;
                        var color=Shape.getRGBA(extendInfo[index+4],extendInfo[index+5]);
                        display.filters.push(new ShadowFilter(color,0,0,blur));
                        index+=6;
                    }else if(extendInfo[index]==4){
                        display.filters.push(new ColorMatrixFilter(extendInfo[index+1],extendInfo[index+2],extendInfo[index+3],extendInfo[index+4]));
                        index+=5;
                    }
                }
            }
        }
        /**
         * 创建一个动态文本或输入文本,此方法一般给Flash2x工具自动调用
         * @method t
         * @public
         * @static
         * @since 1.0.0
         * @param {number} type
         * @param {string} text
         * @param {number} size
         * @param {string} color
         * @param {string} face
         * @param {number} top
         * @param {number} left
         * @param {number} width
         * @param {number} height
         * @param {number} lineSpacing
         * @param {string} align
         * @param {boolean} italic
         * @param {boolean} bold
         * @param {string} lineType
         * @param {boolean} showBorder
         * @returns {annie.TextFiled|annie.InputText}
         */
        export function t(type:number, text:string, size:number, color:string, face:string, top:number, left:number, width:number, height:number, lineSpacing:number, align:string, italic:boolean = false, bold:boolean = false, lineType:string = "single", showBorder:boolean = false):any {
            var textObj:any;
            if (type == 0 || type == 1) {
                textObj = new annie.TextField();
                textObj.text = text;
                textObj.font = face;
                textObj.size = size;
                textObj.lineWidth = width;
                textObj.lineHeight = lineSpacing;
                textObj.textAlign = align;
                textObj.italic = italic;
                textObj.bold = bold;
                textObj.color = color;
                textObj.lineType=lineType;
            } else {
                textObj = new annie.InputText(lineType);
                textObj.initInfo(text, width, height, color, align,size,face,showBorder, lineSpacing / size);
                if (italic) {
                    textObj.setItalic(true);
                }
                if (bold) {
                    textObj.setBold(true);
                }
            }
            return textObj;

        }

        /**
         * 获取矢量位图填充所需要的位图,为什么写这个方法,是因为作为矢量填充的位图不能存在于SpriteSheet中,要单独画出来才能正确的填充到矢量中
         */
        function sb(sceneName:string,bitmapName:string):annie.Bitmap{
            var bitmap:annie.Bitmap=null;
            var sbName:string="_f2x_s"+bitmapName;
            if(res[sceneName][sbName]){
                bitmap=res[sceneName][sbName];
            }else{
                bitmap=b(sceneName,bitmapName);
                if(bitmap&&bitmap.rect) {
                    //从SpriteSheet中取出Image单独存放
                    res[sceneName][sbName]=bitmap=annie.Bitmap.convertToImage(bitmap);
                }
            }
            return bitmap;
        }
        /**
         * 创建一个Shape矢量对象,此方法一般给Flash2x工具自动调用
         * @method s
         * @public
         * @static
         * @since 1.0.0
         * @param {Object} pathObj
         * @param {Object} fillObj
         * @param {Object} strokeObj
         * @returns {annie.Shape}
         */
        export function s(pathObj:any, fillObj:any, strokeObj:any):Shape {
            var shape = new annie.Shape();
            if (fillObj) {
                if (fillObj.type == 0) {
                    shape.beginFill(fillObj.color);
                } else if (fillObj.type == 1) {
                    shape.beginRadialGradientFill(fillObj.gradient[0], fillObj.gradient[1], fillObj.points);
                } else if (fillObj.type == 2) {
                    shape.beginLinearGradientFill(fillObj.gradient[0], fillObj.gradient[1], fillObj.points);
                } else {
                    shape.beginBitmapFill(sb(fillObj.bitmapScene,fillObj.bitmapName), fillObj.matrix);
                }
            }
            if (strokeObj) {
                if (strokeObj.type == 0) {
                    shape.beginStroke(strokeObj.color, strokeObj.lineWidth);
                } else if (strokeObj.type == 1) {
                    shape.beginRadialGradientStroke(strokeObj.gradient[0], strokeObj.gradient[1], strokeObj.points, strokeObj.lineWidth);
                } else if (strokeObj.type == 2) {
                    shape.beginLinearGradientStroke(strokeObj.gradient[0], strokeObj.gradient[1], strokeObj.points, strokeObj.lineWidth);
                } else {
                    shape.beginBitmapStroke(sb(strokeObj.bitmapScene,strokeObj.bitmapName), strokeObj.matrix, strokeObj.lineWidth);
                }
            }
            if (pathObj.type == 0) {
                shape.decodePath(pathObj.data);
            } else {
                shape.drawRoundRect(pathObj.data.x, pathObj.data.y, pathObj.data.w, pathObj.data.h, pathObj.data.topLeftRadius, pathObj.data.topRightRadius, pathObj.data.bottomLeftRadius, pathObj.data.bottomRightRadius);
            }
            if (fillObj) {
                shape.endFill();
            }
            if (strokeObj) {
                shape.endStroke();
            }
            return shape;
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
         * @param {string} info.responseType 后台返回数据的类型,默认为"json"
         */
        export function ajax(info:any):void{
            var urlLoader=new URLLoader();
            urlLoader.method=info.type==undefined?"get":info.type;
            urlLoader.data=info.data==undefined?null:info.data;
            urlLoader.responseType=info.responseType==undefined?"text":info.responseType;
            if(info.success!=undefined){
                urlLoader.addEventListener(annie.Event.COMPLETE, info.success);
            }
            if(info.error!=undefined) {
                urlLoader.addEventListener(annie.Event.ERROR, info.error);
            }
            urlLoader.load(info.url);
        }
    }
}