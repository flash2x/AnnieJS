/**
 * @module annie
 */
namespace annie {
    /**
     * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
     * 资源加载类,后台请求,加载资源和后台交互都可以使用此类
     * @class annie.URLLoader
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     * @example
     *      var urlLoader = new annie.URLLoader();
     *      urlLoader.addEventListener('onComplete', function (e) {
     *      //console.log(e.data.response);
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
        //Event
        /**
         * 完成事件
         * @event annie.Event.COMPLETE
         * @since 1.0.0
         */
        /**
         * annie.URLLoader加载过程事件
         * @event annie.Event.PROGRESS
         * @since 1.0.0
         */
        /**
         * annie.URLLoader出错事件
         * @event annie.Event.ERROR
         * @since 1.0.0
         */
        /**
         * annie.URLLoader中断事件
         * @event annie.Event.ABORT
         * @since 1.0.0
         */

        /**
         * annie.URLLoader开始事件
         * @event annie.Event.START
         * @since 1.0.0
         */
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
            }
        }

        private _req: XMLHttpRequest = null;
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
            if (s.responseType == "") {
                //看看是什么后缀
                let urlSplit = url.split(".");
                let extStr = urlSplit[urlSplit.length - 1];
                let ext = extStr.split("?")[0].toLocaleLowerCase();
                if ("." + ext == annie.suffixName) {
                    if (annie._isReleased) {
                        s.responseType = "swf";
                    } else {
                        s.responseType = "js";
                    }
                } else if (ext == "mp3" || ext == "ogg" || ext == "wav") {
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
                } else if (ext == "js") {
                    s.responseType = "js";
                } else {
                    s.responseType = "unKnow";
                }
            }
            let reSendTimes = 0;
            if (!(s._req instanceof XMLHttpRequest)) {
                s._req = new XMLHttpRequest();
                s._req.withCredentials = false;
                s._req.onprogress = function (event: any): void {
                    s.dispatchEvent("onProgress", {loadedBytes: event.loaded, totalBytes: event.total});
                };
                s._req.onerror = function (event: any): void {
                    reSendTimes++;
                    if (reSendTimes > 2) {
                        s.dispatchEvent("onError", {id: 2, msg: event["message"]});
                    } else {
                        //断线重连
                        s._req.abort();
                        if (s.data instanceof Object) {
                            s._req.send(s.data);
                        } else {
                            s._req.send();
                        }
                    }
                };
                s._req.onload = function (): void {
                    //是否异步
                    let e: Event = new Event("onComplete");
                    let result = s._req.response;
                    e.data = {type: s.responseType, response: null};
                    let item: any;
                    switch (s.responseType) {
                        case "css":
                            item = document.createElement("link");
                            item.rel = "stylesheet";
                            item.href = s.url;
                            break;
                        case "video":
                            item = s.url;
                            break;
                        case "json":
                            item = JSON.parse(result);
                            break;
                        case "js":
                            item = "JS_CODE";
                            Eval(result);
                            break;
                        default:
                            item = result;
                            break;
                    }
                    e.data["response"] = item;
                    s.data = null;
                    s.responseType = "";
                    s.dispatchEvent(e);
                };
            }
            if (s.data instanceof Object && s.method.toLocaleLowerCase() == "get") {
                s.url = s._fus(url, s.data);
                s.data = null;
            } else {
                s.url = url;
            }
            if (s.responseType == "swf" || s.responseType == "image" || s.responseType == "sound") {
                s._req.responseType = "blob";
            } else {
                s._req.responseType = "";
            }
            s._req.open(s.method, s.url, true);
            if (s.headers.length > 0) {
                for (let h = 0; h < s.headers.length; h += 2) {
                    s._req.setRequestHeader(s.headers[h], s.headers[h + 1]);
                }
                s.headers.length = 0;
            }
            if (contentType == "form") {
                s._req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                s._req.send(s._fqs(s.data, null));
            } else {
                var type = "application/json";
                if (contentType != "json") {
                    type = "multipart/form-data";
                }
                s._req.setRequestHeader("Content-type", type + ";charset=UTF-8");
                s._req.send(s.data);
            }
        }

        /**
         * 后台返回来的数据类型
         * @property responseType
         * @type {string}
         * @default null
         * @public
         * @since 1.0.0
         */
        public responseType: string = "";
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
         * 需要向后台传送的数据对象
         * @property data
         * @public
         * @since 1.0.0
         * @default null
         * @type {Object}
         */
        public data: any = null;
        //格式化post请求参数
        private _fqs = function (data: any, query: any): string {
            let params: any = [];
            if (data instanceof Object) {
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
        //格式化get 请求参数
        private _fus = function (src: any, data: any): string {
            let s = this;
            if (data ==void 0) {
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
            let s = this;
            s.loadCancel();
            s.headers = null;
            s.data = null;
            super.destroy();
        }
    }
}