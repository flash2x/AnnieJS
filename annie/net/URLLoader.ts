/**
 * @module annie
 */
namespace annie {
    /**
     * 资源加载类,后台请求,加载资源和后台交互都可以使用此类
     * @class annie.URLLoader
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     * @example
     *      var urlLoader = new annie.URLLoader();
     *      urlLoader.addEventListener('onComplete', function (e) {
     *      //trace(e.data.response);
     *      var bitmapData = e.data.response,//bitmap图片数据
     *      bitmap = new annie.Bitmap(bitmapData);//实例化bitmap对象
     *      //居中对齐
     *      bitmap.x = (s.stage.desWidth - bitmap.width) / 2;
     *      bitmap.y = (s.stage.desHeight - bitmap.height) / 2;
     *      s.addChild(bitmap);
     *      });
     *      urlLoader.load('http://test.annie2x.com/biglong/logo.jpg');//载入外部图片
     */
    export class URLLoader extends EventDispatcher {
        /**
         * 构造函数
         * @method URLLoader
         * @param type text json js xml image sound css svg video unKnow
         */
        public constructor() {
            super();
            this._instanceType = "annie.URLLoader";
        }

        /**
         * 取消加载
         * @method loadCancel
         * @public
         * @since 1.0.0
         */
        public loadCancel(): void {
            let s = this;
            if (s._req) {
                s._req.abort();
                // s._req = null;
            }
        }

        /**
         * @property _req
         * @type {null}
         * @private
         */
        private _req: XMLHttpRequest = null;
        /**
         * @property headers
         * @private
         * @type {any[]}
         */
        private headers: Array<string> = [];

        /**
         * 加载或请求数据
         * @method load
         * @public
         * @since 1.0.0
         * @param {string} url
         * @param {string} contentType 如果请求类型需要设置主体类型，有form json binary jsonp等，请设置 默认为form
         */
        public load(url: string, contentType: string = "form"): void {
            let s = this;
            s.loadCancel();
            // if (s.responseType == null || s.responseType == "") {
                //看看是什么后缀
            let urlSplit = url.split(".");
            let extStr = urlSplit[urlSplit.length - 1];
            let ext = extStr.split("?")[0].toLocaleLowerCase();
            if (ext == "mp3" || ext == "ogg" || ext == "wav") {
                s.responseType = "sound";
            } else if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif") {
                s.responseType = "image";
            } else if (ext == "css") {
                s.responseType = "css";
            } else if (ext == "mp4") {
                s.responseType = "video";
            } else if (ext == "svg") {
                s.responseType = "svg";
            } else if (ext == "xml") {
                s.responseType = "xml";
            } else if (ext == "json") {
                s.responseType = "json";
            } else if (ext == "txt") {
                s.responseType = "text";
            } else if (ext == "js" || ext == "swf") {
                s.responseType = "js";
            } else {
                s.responseType = "unKnow";
            }
            // }
            if (s.responseType == "image") {
                let e: Event = new Event("onComplete");
                e.data = { type: s.responseType, response: null };
                s.dispatchEvent("onProgress", { loadedBytes: 1, totalBytes: 1 });

                let tryTime:number = 0;
                let loadImage = (imageUrl: string, callback: any) => {
                    let itemObj: any;
                    itemObj = document.createElement("img");
                    itemObj.onload = function () {
                        itemObj.onload = null;
                        callback(itemObj);
                    };
                    itemObj.crossOrigin="Anonymous";
                    itemObj.onerror = function(){
                        if (tryTime>2) {
                            // callback(itemObj);
                            loadImage('data:image/gif;base64,R0lGODlhAwADAIABAL6+vv///yH5BAEAAAEALAAAAAADAAMAAAIDjA9WADs=', callback);
                            return;
                        };
                        itemObj = null;
                        tryTime++;
                        loadImage(imageUrl,callback);
                    };
                    itemObj.src = imageUrl;
                }

                loadImage(url, function (itemObj:any){
                    e.data.response = itemObj;
                    s.dispatchEvent(e);
                })
                
                // itemObj = document.createElement("img");
                // itemObj.onload = function () {
                //     e.data.response = itemObj;
                //     itemObj.onload = null;
                //     s.dispatchEvent(e);
                // };
                // itemObj.src = url;
                return;
            }
<<<<<<< HEAD

            if(!s._req){
                s._req=new XMLHttpRequest();
            }
            let req: any=s._req;
            req.withCredentials = false;
            req.onprogress = function (event: any): void {
                if (!event || event.loaded > 0 && event.total == 0) {
                    return; // Sometimes we get no "total", so just ignore the progress event.
                }
                s.dispatchEvent("onProgress", {loadedBytes: event.loaded, totalBytes: event.total});
            };
            req.onerror = function (event: any): void {
                reSendTimes++;
                if (reSendTimes > 2) {
                    s.dispatchEvent("onError", {id: 2, msg: event["message"]});
                } else {
                    //断线重连
                    req.abort();
                    if (!s.data) {
                        req.send();
=======
            if (!s._req) {
                s._req = new XMLHttpRequest();
                let req = s._req;
                req.withCredentials = false;
                req.onprogress = function (event: any): void {
                    if (!event || event.loaded > 0 && event.total == 0) {
                        return; // Sometimes we get no "total", so just ignore the progress event.
                    }
                    s.dispatchEvent("onProgress", {loadedBytes: event.loaded, totalBytes: event.total});
                };
                req.onerror = function (event: any): void {
                    reSendTimes++;
                    if (reSendTimes > 2) {
                        s.dispatchEvent("onError", {id: 2, msg: event["message"]});
>>>>>>> flash2x/master
                    } else {
                        //断线重连
                        req.abort();
                        if (!s.data) {
                            req.send();
                        } else {
                            if (contentType == "form") {
                                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                                req.send(s._fqs(s.data, null));
                            } else {
                                var type = "application/json";
                                if (contentType != "json") {
                                    type = "multipart/form-data";
                                }
                                req.setRequestHeader("Content-type", type + ";charset=UTF-8");
                                req.send(s.data);
                            }
                        }
                    }
<<<<<<< HEAD
                }
            };
            req.onreadystatechange = function (event: any): void {
                let t = event.target;
                if (t["readyState"] == 4) {
                    if (req.status == 200||req.status == 0){
                        let isImage: boolean = false;
                        let e: Event = new Event("onComplete");
                        let result = t["response"];
                        e.data = {type: s.responseType, response: null};
                        let item: any;
                        switch (s.responseType) {
                            case "css":
                                item = document.createElement("link");
                                item.rel = "stylesheet";
                                item.href = s.url;
                                break;
                            // case "image":
                            case "sound":
                            case "video":
                                let itemObj: any;
                                // if (s.responseType == "image") {
                                //     isImage = true;
                                //     itemObj = document.createElement("img");
                                //     itemObj.onload = function () {
                                //         URL.revokeObjectURL(itemObj.src);
                                //         itemObj.onload = null;
                                //         s.dispatchEvent(e);
                                //     };
                                //     itemObj.src = URL.createObjectURL(result);
                                //     item = itemObj;
                                // } else {
                                    if (s.responseType == "sound") {
                                        // itemObj = document.createElement("AUDIO");
                                        // itemObj.preload = true;
                                        // itemObj.src = s.url;
                                        item = new Sound(s.url);
                                    } else if (s.responseType == "video") {
                                        itemObj = document.createElement("VIDEO");
                                        itemObj.preload = true;
                                        itemObj.src = s.url;
                                        item = new Video(itemObj);
                                    }
                                // }
                                break;
                            case "json":
                                item = JSON.parse(result);
                                break;
                            case "js":
                                item = "JS_CODE";
                                Eval(result);
                                break;
                            case "text":
                            case "unKnow":
                            case "xml":
                            default:
                                item = result;
                                break;
=======
                };
                req.onreadystatechange = function (event: any): void {
                    let t = event.target;
                    if (t["readyState"] == 4) {
                        if (req.status == 200||req.status==0) {
                            let isImage: boolean = false;
                            let e: Event = new Event("onComplete");
                            let result = t["response"];
                            e.data = {type: s.responseType, response: null};
                            let item: any;
                            switch (s.responseType) {
                                case "css":
                                    item = document.createElement("link");
                                    item.rel = "stylesheet";
                                    item.href = s.url;
                                    break;
                                case "image":
                                case "sound":
                                case "video":
                                    let itemObj: any;
                                    if (s.responseType == "image") {
                                        isImage = true;
                                        itemObj = document.createElement("img");
                                        itemObj.onload = function () {
                                            URL.revokeObjectURL(itemObj.src);
                                            itemObj.onload = null;
                                            s.dispatchEvent(e);
                                        };
                                        itemObj.src = URL.createObjectURL(result);
                                    } else {
                                        if (s.responseType == "sound") {
                                            itemObj = document.createElement("AUDIO");
                                            itemObj.preload = true;
                                            itemObj.src = s.url;
                                        } else if (s.responseType == "video") {
                                            itemObj = document.createElement("VIDEO");
                                            itemObj.preload = true;
                                            itemObj.src = s.url;
                                        }
                                    }
                                    item = itemObj;
                                    break;
                                case "json":
                                    item = JSON.parse(result);
                                    break;
                                case "js":
                                    item = "JS_CODE";
                                    Eval(result);
                                    break;
                                case "text":
                                case "unKnow":
                                case "xml":
                                default:
                                    item = result;
                                    break;
                            }
                            e.data["response"] = item;
                            s.data = null;
                            s.responseType = "";
                            if (!isImage) s.dispatchEvent(e);
                        } else {
                            //服务器返回报错
                            s.dispatchEvent("onError", {id: 0, msg: "访问地址不存在"});
>>>>>>> flash2x/master
                        }
                        e.data["response"] = item;
                        s.data = null;
                        s.responseType = "";
                        s.dispatchEvent(e);
                        // if (!isImage) s.dispatchEvent(e);
                    } else {
                        //服务器返回报错
                        s.dispatchEvent("onError", {id: 0, msg: "访问地址不存在"});
                    }
                };
            }
            let reSendTimes = 0;
            if (s.data && s.method.toLocaleLowerCase() == "get") {
                s.url = s._fus(url, s.data);
                s.data = null;
            } else {
                s.url = url;
            }
            if (s.responseType == "image" || s.responseType == "sound" || s.responseType == "video") {
                req.responseType = "blob";
            } else {
                req.responseType = "text";
            }
            req.open(s.method, s.url, true);
            if (s.headers.length > 0) {
                for (let h = 0; h < s.headers.length; h += 2) {
                    req.setRequestHeader(s.headers[h], s.headers[h + 1]);
                }
                s.headers.length = 0;
            }
            if (!s.data) {
                req.send();
            } else {
                if (contentType == "form") {
                    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                    req.send(s._fqs(s.data, null));
                } else {
                    var type = "application/json";
                    if (contentType != "json") {
                        type = "multipart/form-data";
                    }
                    req.setRequestHeader("Content-type", type + ";charset=UTF-8");
                    req.send(s.data);
                }
            }
            /*req.onloadstart = function (e) {
             s.dispatchEvent("onStart");
             };*/
        }

        /**
         * 后台返回来的数据类弄
         * @property responseType
         * @type {string}
         * @default null
         * @public
         * @since 1.0.0
         */
        public responseType: string = null;
        /**
         * 请求的url地址
         * @property url
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public url: string = "";
        /**
         * 请求后台的类型 get post
         * @property method
         * @type {string}
         * @default get
         * @public
         * @since 1.0.0
         */
        public method: string = "get";
        /**
         * 需要像后台传送的数据对象
         * @property data
         * @public
         * @since 1.0.0
         * @default null
         * @type {Object}
         */
        public data: Object = null;
        /**
         * 格式化post请求参数
         * @method _fqs
         * @param data
         * @param query
         * @return {string}
         * @private
         * @since 1.0.0
         */
        private _fqs = function (data: any, query: any): string {
            let params: any = [];
            if (data) {
                for (let n in data) {
                    params.push(encodeURIComponent(n) + "=" + encodeURIComponent(data[n]));
                }
            }
            if (query) {
                params = params.concat(query);
            }
            return params.join("&");
        };
        //formatURIString
        /**
         * 格式化get 请求参数
         * @method _fus
         * @param src
         * @param data
         * @return {any}
         * @private
         */
        private _fus = function (src: any, data: any): string {
            let s = this;
            if (data == null || data == "") {
                return src;
            }
            let query: any = [];
            let idx = src.indexOf("?");
            if (idx != -1) {
                let q = src.slice(idx + 1);
                query = query.concat(q.split("&"));
                return src.slice(0, idx) + "?" + s._fqs(data, query);
            } else {
                return src + "?" + s._fqs(data, query);
            }
        };
        /**
         * 添加自定义头
         * @method addHeader
         * @param name
         * @param value
         */
        public addHeader(name: string, value: string): void {
            this.headers.push(name, value);
        }
        public destroy(): void {
            let s=this;
            s.loadCancel();
            s.headers=null;
            s.data=null;
            super.destroy();
        }
    }
}