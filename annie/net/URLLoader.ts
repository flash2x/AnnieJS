/**
 * @module annie
 */
namespace annie {
    export let Eval:any=eval.bind(window);
    /**
     * 资源加载类,后台请求,加载资源和后台交互都可以使用此类
     * @class annie.URLLoader
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    export class URLLoader extends EventDispatcher {
        /**
         * @param type text json js xml image sound css svg video unKnow
         */
        public constructor(){
            super();
            this._instanceType="annie.URLLoader";
        }
        /**
         * 取消加载
         * @method loadCancel
         * @public
         * @since 1.0.0
         */
        public loadCancel():void {
            let s = this;
            if (s._req) {
                s._req.abort();
                //s._req = null;
            }
        }
        private _req:XMLHttpRequest;
        private headers:Array<string>=[];
        /**
         * 加载或请求数据
         * @method load
         * @public
         * @since 1.0.0
         * @param {string} url
         * @param {string} contentType 如果请求类型需要设置主体类型，有form json binary jsonp等，请设置 默认为form
         */
        public load(url:string, contentType:string = "form"):void {
            let s = this;
            s.loadCancel();
            if (s.responseType == null || s.responseType == "") {
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
                } else if (ext == "js"||ext=="swf") {
                    s.responseType = "js";
                } else {
                    s.responseType = "unKnow";
                }
            }
            let req:any=null;
            if(!s._req){
                s._req=new XMLHttpRequest();
                req=s._req;
                req.withCredentials = false;
                req.onprogress = function (event:any):void {
                    if (!event || event.loaded > 0 && event.total == 0) {
                        return; // Sometimes we get no "total", so just ignore the progress event.
                    }
                    s.dispatchEvent("onProgress",{loadedBytes:event.loaded,totalBytes:event.total});
                };
                req.onerror = function (event:any):void {
                    reSendTimes++;
                    if(reSendTimes>3){
                        s.dispatchEvent("onError", {id:2,msg:event["message"]});
                    }else {
                        //断线重连
                        req.abort();
                        if (!s.data) {
                            req.send();
                        } else {
                            if (contentType=="form") {
                                req.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
                                req.send(s._fqs(s.data, null));
                            } else {
                                var type="application/json";
                                if(contentType!="json") {
                                    type="multipart/form-data";
                                }
                                req.setRequestHeader("Content-type", type+";charset=UTF-8");
                                req.send(s.data);
                            }
                        }
                    }
                };
                req.onreadystatechange = function (event:any):void {
                    let t = event.target;
                    if (t["readyState"] == 4) {
                        if(req.status==200) {
                            let e: Event = new Event("onComplete");
                            try {
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
                                        let itemObj:any;
                                        let isBlob: boolean = true;
                                        if (s.responseType == "image") {
                                            itemObj = document.createElement("img");
                                            itemObj.onload = function () {
                                                if (isBlob) {
                                                    URL.revokeObjectURL(item.src);
                                                }
                                                itemObj.onload = null;
                                            };
                                            item=itemObj;
                                        } else {
                                            if (s.responseType == "sound") {
                                                itemObj = document.createElement("AUDIO");
                                                item=new Sound(itemObj);
                                            } else if (s.responseType == "video") {
                                                itemObj = document.createElement("VIDEO");
                                                item=new Video(itemObj);
                                            }
                                            itemObj.preload = true;
                                            itemObj.load();
                                            itemObj.onloadeddata = function () {
                                                if (isBlob) {
                                                    //执行下面的代码android有问题，会闪退
                                                    //URL.revokeObjectURL(item.src);
                                                }
                                                itemObj.onloadeddata = null;
                                            };
                                        }
                                        try {
                                            itemObj.src = URL.createObjectURL(result);
                                        } catch (err) {
                                            isBlob = false;
                                            itemObj.src = s.url;
                                        }
                                        break;
                                    case "json":
                                        item = JSON.parse(result);
                                        break;
                                    case "js":
                                        item="JS_CODE";
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
                           }catch (e) {
                                s.dispatchEvent("onError", {id: 1, msg: "服务器返回信息有误"});
                            }
                            s.dispatchEvent(e);
                        }else{
                            //服务器返回报错
                            s.dispatchEvent("onError", {id:0,msg:"访问地址不存在"});
                        }
                    }
                };
            }else {
                req = s._req;
            }
            let reSendTimes=0;
            if (s.data && s.method.toLocaleLowerCase() == "get") {
                s.url = s._fus(url, s.data);
                s.data = null;
            } else {
                s.url = url;
            }
            if (s.responseType == "image" || s.responseType == "sound" || s.responseType == "video") {
                req.responseType = "blob";
            }else{
                req.responseType ="text";
            }
            req.open(s.method, s.url, true);
            if(s.headers.length>0){
                for(let h=0;h<s.headers.length;h+=2){
                    req.setRequestHeader(s.headers[h],s.headers[h+1]);
                }
                s.headers.length=0;
            }
            if (!s.data) {
                req.send();
            } else {
                if (contentType=="form") {
                    req.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
                    req.send(s._fqs(s.data, null));
                } else {
                    var type="application/json";
                    if(contentType!="json") {
                        type="multipart/form-data";
                    }
                    req.setRequestHeader("Content-type", type+";charset=UTF-8");
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
        public responseType:string = null;
        /**
         * 请求的url地址
         * @property url
         * @public
         * @since 1.0.0
         * @type {string}
         */
        public url:string = "";
        /**
         * 请求后台的类型 get post
         * @property method
         * @type {string}
         * @default get
         * @public
         * @since 1.0.0
         */
        public method:string = "get";
        /**
         * 需要像后台传送的数据对象
         * @property data
         * @public
         * @since 1.0.0
         * @default null
         * @type {Object}
         */
        public data:Object = null;
        /**
         * 格式化post请求参数
         * @method _fqs
         * @param data
         * @param query
         * @return {string}
         * @private
         * @since 1.0.0
         */
        private _fqs = function (data:any, query:any):string {
            let params:any = [];
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
        private _fus = function (src:any, data:any):string {
            let s = this;
            if (data == null || data == "") {
                return src;
            }
            let query:any = [];
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
         * @addHeader
         * @param name
         * @param value
         */
        public addHeader(name:string,value:string):void{
            this.headers.push(name,value);
        }
    }
}