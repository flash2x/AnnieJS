/// <reference path="./display/Stage.ts" />
/// <reference path="./events/EventDispatcher.ts" />
/// <reference path="./utils/Tween.ts" />
/// <reference path="./utils/Timer.ts" />
/**
 * @class 全局
 */
/**
 * 往控制台打印调试信息
 * @method trace
 * @param {Object} arg 任何个数,任意类型的参数
 * @since 1.0.0
 * @public
 * @static
 * @example
 *      trace(1);
 *      trace(1,"hello");
 */
let trace = function (...arg:any[]) {
    for (let i in arguments) {
        console.log(arguments[i]);
    }
};
/**
 * 全局事件触发器
 * @static
 * @property  globalDispatcher
 * @type {annie.EventDispatcher}
 * @public
 * @since 1.0.0
 * @example
 *      //A代码放到任何合适的地方
 *      globalDispatcher.addEventListener("myTest",function(e){
 *          trace("收到了其他地方发来的消息:"+e.data);
 *      });
 *
 *      //B代码放到任何一个可以点击的对象的构造函数中
 *      this.addEventListener(annie.MouseEvent.CLICK,function(e){
 *          globalDispatcher.dispatchEvent("myTest","我是小可");
 *      });
 *
 */
let globalDispatcher:annie.EventDispatcher=new annie.EventDispatcher();
import F2xContainer=annie.Sprite;
import F2xMovieClip=annie.MovieClip;
import F2xText=annie.TextField;
import F2xInputText=annie.InputText;
import F2xBitmap=annie.Bitmap;
import F2xShape=annie.Shape;
annie.Stage["addUpdateObj"](annie.Tween);
annie.Stage["addUpdateObj"](annie.Timer);
annie.Stage["flushAll"]();
