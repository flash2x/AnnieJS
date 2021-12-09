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

        private _req: any = null;

        /**
         * 加载或请求数据
         * @method load
         * @public
         * @since 1.0.0
         * @param {string} url
         * @param {string} contentType 如果请求类型需要设置主体类型，有form json binary jsonp等，请设置 默认为form
         */
        public load(url: string): void {
            let s=this;
            if(s.dataType=="json"){
                s.headers["content-type"]="application/json";
            }else{
                s.headers["content-type"]="application/x-www-form-urlencoded";
            }
            s._req=annie.app.request({
                    url:url,
                    data:s.data,
                    dataType:s.dataType,
                    responseType:s.responseType,
                    method:s.method,
                    header:s.headers,
                    success:function(result:any){
                        s.dispatchEvent(annie.Event.COMPLETE,{type: s.responseType,response:result.data});
                    },
                    faile:function(result:any){
                        s.dispatchEvent("onError", {msg: result});
                    }
            })
        }

        /**
         * 后台返回来的数据类型
         * @property responseType
         * @type {string}
         * @default null
         * @public
         * @since 1.0.0
         */
        public responseType: string = "json";
        /**
         * 传给后台的数据类型
         * @property dataType
         * @type {string}
         * @default null
         * @public
         * @since 1.0.0
         */
        public dataType: string = "json";
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
         * @default ""
         * @type {Object}
         */
        public data: any = "";
        private headers: any = {};
        /**
         * 添加自定义头
         * @method addHeader
         * @param name
         * @param value
         */
         public addHeader(name: string, value: string): void {
            this.headers[name]=value;
        }
        public destroy(): void {
            let s = this;
            s.loadCancel();
            s.data = null;
            s.headers=null;
            s._req=null;
            super.destroy();
        }
    }
}