/**
 * @module annie
 */
namespace annie {
    var isUpdateTween:boolean=true;
    class TweenObj extends AObject {
        public constructor() {
            super();
        }
        private _currentFrame:number = 0;
        private _totalFrames:number = 0;
        private _startData:any;
        private _disData:any;
        public target:any;
        private _isTo:boolean;
        private _isLoop:number = 0;
        private _delay:number = 0;
        public _update:Function;
        public _completeFun:Function;
        public _ease:Function;
        private _isFront:boolean = true;
        private _cParams:Array=null;
        private _loop:boolean=false;

        /**
         * 初始化数据
         * @method init
         * @param target
         * @param times
         * @param data
         * @param isTo
         * @public
         * @since 1.0.0
         */
        public init(target:any, times:number, data:any, isTo:boolean = true):void {
            var s = this;
            s._currentFrame = 1;
            s._totalFrames = times*30>>0;
            s.target = target;
            s._isTo = isTo;
            s._isLoop = 0;
            s._startData = {};
            s._disData = {};
            s._delay = 0;
            s._isFront=true;
            s._ease = null;
            s._update = null;
            s._cParams=null;
            s._loop = false;
            s._completeFun = null;
            for (var item in data) {
                switch (item) {
                    case "useFrame":
                        if(data[item]==true){
                            s._totalFrames=times;
                        }
                        break;
                    case "yoyo":
                        if(data[item]===false) {
                            s._isLoop=0;
                        }else if(data[item]===true){
                            s._isLoop=32767;
                        }else{
                            s._isLoop=data[item];
                        }
                        break;
                    case "delay":
                        s._delay = data[item];
                        break;
                    case "ease":
                        s._ease = data[item];
                        break;
                    case "onUpdate":
                        s._update = data[item];
                        break;
                    case "onComplete":
                        s._completeFun = data[item];
                        break;
                    case "completeParams":
                        s._cParams=data[item];
                        break;
                    case "loop":
                        s._loop=data[item];
                        break;
                    default :
                        if(typeof(data[item])=="number") {
                            if (isTo) {
                                s._startData[item] = target[item];
                                s._disData[item] = data[item] - target[item];
                            } else {
                                s._startData[item] = data[item];
                                s._disData[item] = target[item] - data[item];
                            }
                        }
                }
            }
        }

        /**
         * 更新数据
         * @method update
         * @since 1.0.0
         * @public
         */
        public update():void {
            var s = this;
            if (s._isFront && s._delay > 0) {
                s._delay--;
                return;
            }
            //更新数据
            var per = s._currentFrame / s._totalFrames;
            if (s._ease) {
                per = s._ease(per);
            }
            for (var item in s._disData) {
                s.target[item] = s._startData[item] + s._disData[item] * per;
            }
            if (s._update) {
                s._update();
            }
            var cf=s._completeFun;
            var pm=s._cParams;
            if (s._isFront) {
                s._currentFrame++;
                if (s._currentFrame > s._totalFrames) {
                    if(s._loop){
                        s._currentFrame=1;
                    }else {
                        if (s._isLoop > 0) {
                            s._isFront = false;
                            s._currentFrame = s._totalFrames;
                            s._isLoop--;
                        } else {
                            Tween.kill(s.getInstanceId());
                        }
                    }
                    if(cf){
                        cf.apply(null,pm);
                    }
                }
            } else {
                s._currentFrame--;
                if (s._currentFrame <0) {
                    if (s._isLoop>0) {
                        s._isFront = true;
                        s._currentFrame = 1;
                    }else{
                        Tween.kill(s.getInstanceId());
                    }
                    if(cf){
                        cf.apply(null,pm);
                    }
                }
            }
        }
    }
    /**
     * 全局静态单列类,不要实例化此类
     * @class annie.Tween
     * @public
     * @since 1.0.0
     */
    export class Tween {
        /**
         * 将target对象的属性数值渐变到data中对应属性指定的数值
         * @method to
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 用帧数来表示时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否向摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成函数. 默认为null
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        public static to(target:any, totalFrame:number, data:Object):number {
            return Tween.createTween(target, totalFrame, data, true);
        }

        /**
         * 将target对象从data中指定的属性数值渐变到target属性当前的数值
         * @method from
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 用帧数来表示时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否向摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成结束函数. 默认为null
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        public static from(target:any, totalFrame:number, data:Object):number {
            return Tween.createTween(target, totalFrame, data, false);
        }
        private static createTween(target:any, totalFrame:number, data:any, isTo:boolean):number{
            var tweenOjb:TweenObj;
            var len=Tween._tweenList.length;
            for(var i=0;i<len;i++){
                if (target == Tween._tweenList[i].target) {
                    tweenOjb = Tween._tweenList[i];
                    break;
                }
            }
            if(!tweenOjb) {
                len = Tween._tweenPool.length;
                if (len > 0) {
                    tweenOjb = Tween._tweenPool[0];
                    Tween._tweenPool.shift();
                } else {
                    tweenOjb = new TweenObj();
                }
                Tween._tweenList.push(tweenOjb);
            }
            tweenOjb.init(target, totalFrame, data, isTo);
            return tweenOjb.getInstanceId();
        }
        /**
         * 销毁所有正在运行的Tween对象
         * @method killAll
         * @static
         * @public
         * @since 1.0.0
         */
        public static killAll():void {
            var len:number = Tween._tweenList.length;
            for (var i = 0; i < len; i++) {
                Tween._tweenList[i].target = null;
                Tween._tweenList[i]._completeFun = null;
                Tween._tweenList[i]._cParams = null;
                Tween._tweenList[i]._update = null;
                Tween._tweenList[i]._ease = null;
                Tween._tweenList[i]._loop = false;
                Tween._tweenPool.push(Tween._tweenList[i]);
            }
            Tween._tweenList.length = 0;
        }

        /**
         * @通过创建Tween对象返回时的唯一id来销毁对应的Tween对象
         * @method kill
         * @static
         * @public
         * @param {annie.Tween} tween
         * @since 1.0.0
         */
        public static kill(tweenId:number):void {
            var len:number = Tween._tweenList.length;
            for (var i = 0; i < len; i++) {
                if (Tween._tweenList[i].getInstanceId() == tweenId) {
                    Tween._tweenList[i].target = null;
                    Tween._tweenList[i]._completeFun = null;
                    Tween._tweenList[i]._cParams = null;
                    Tween._tweenList[i]._update = null;
                    Tween._tweenList[i]._ease = null;
                    Tween._tweenList[i]._loop = null;
                    Tween._tweenPool.push(Tween._tweenList[i]);
                    Tween._tweenList.splice(i, 1);
                    break;
                }
            }
        }
        private static _tweenPool:Array<TweenObj> = [];
        private static _tweenList:Array<TweenObj> = [];

        /**
         * quadraticIn缓动类型
         * @method quadraticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quadraticIn(k:number):number {
            return k * k;
        }
        /**
         * quadraticOut 缓动类型
         * @method quadraticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quadraticOut(k:number):number {
            return k * (2 - k);
        }
        /**
         * quadraticInOut 缓动类型
         * @method quadraticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quadraticInOut(k:number):number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        }
        /**
         * cubicIn 缓动类型
         * @method cubicIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static cubicIn(k:number):number {
            return k * k * k;

        }
        /**
         * cubicOut 缓动类型
         * @method cubicOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static cubicOut(k:number):number {

            return --k * k * k + 1;

        }
        /**
         * cubicInOut 缓动类型
         * @method cubicInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static cubicInOut(k:number):number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);

        }
        /**
         * quarticIn 缓动类型
         * @method quarticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quarticIn(k:number):number {

            return k * k * k * k;

        }
        /**
         * quarticOut 缓动类型
         * @method quarticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quarticOut(k:number):number {

            return 1 - (--k * k * k * k);

        }
        /**
         * quarticInOut 缓动类型
         * @method quarticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quarticInOut(k:number):number {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);

        }
        /**
         * quinticIn 缓动类型
         * @method quinticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quinticIn(k:number):number {

            return k * k * k * k * k;

        }
        /**
         * quinticOut 缓动类型
         * @method quinticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quinticOut(k:number):number {

            return --k * k * k * k * k + 1;

        }
        /**
         * quinticInOut 缓动类型
         * @method quinticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static quinticInOut(k:number):number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }

            return 0.5 * ((k -= 2) * k * k * k * k + 2);

        }
        /**
         * sinusoidalIn 缓动类型
         * @method sinusoidalIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static sinusoidalIn(k:number):number {

            return 1 - Math.cos(k * Math.PI / 2);

        }
        /**
         * sinusoidalOut 缓动类型
         * @method sinusoidalOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static sinusoidalOut(k:number):number {

            return Math.sin(k * Math.PI / 2);
        }
        /**
         * sinusoidalInOut 缓动类型
         * @method sinusoidalInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static sinusoidalInOut(k:number):number {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
        /**
         * exponentialIn 缓动类型
         * @method exponentialIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static exponentialIn(k:number):number {

            return k === 0 ? 0 : Math.pow(1024, k - 1);

        }
        /**
         * exponentialOut 缓动类型
         * @method exponentialOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static exponentialOut(k:number):number {

            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

        }
        /**
         * exponentialInOut 缓动类型
         * @method exponentialInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static exponentialInOut(k:number):number {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }
        /**
         * circularIn 缓动类型
         * @method circularIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static circularIn(k:number):number {

            return 1 - Math.sqrt(1 - k * k);

        }
        /**
         * circularOut 缓动类型
         * @method circularOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static circularOut(k:number):number {

            return Math.sqrt(1 - (--k * k));

        }
        /**
         * circularInOut 缓动类型
         * @method circularInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static circularInOut(k:number):number {

            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }

            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

        }
        /**
         * elasticIn 缓动类型
         * @method elasticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static elasticIn(k:number):number {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

        }
        /**
         * elasticOut 缓动类型
         * @method elasticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static elasticOut(k:number):number {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }
            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

        }
        /**
         * elasticInOut 缓动类型
         * @method elasticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static elasticInOut(k:number):number {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }

            k *= 2;

            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        }
        /**
         * backIn 缓动类型
         * @method backIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static backIn(k:number):number {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        }
        /**
         * backOut 缓动类型
         * @method backOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static backOut(k:number):number {
            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        }
        /**
         * backInOut 缓动类型
         * @method backInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static backInOut(k:number):number {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
        /**
         * bounceIn 缓动类型
         * @method bounceIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static bounceIn(k:number):number {
            return 1 - Tween.bounceOut(1 - k);
        }
        /**
         * bounceOut 缓动类型
         * @method bounceOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static bounceOut(k:number):number {

            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        }
        /**
         * bounceInOut 缓动类型
         * @method bounceInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        public static bounceInOut(k:number):number {
            if (k < 0.5) {
                return Tween.bounceIn(k * 2) * 0.5;
            }
            return Tween.bounceOut(k * 2 - 1) * 0.5 + 0.5;
        }
        /**
         * 这里之所有要独立运行,是因为可能存在多个stage，不能把这个跟其中任何一个stage放在一起update
         * @method flush
         * @private
         * @since 1.0.0
         */
        private static flush():void{
            if(isUpdateTween){
                var len:number = Tween._tweenList.length;
                for (var i = len-1; i>=0; i--) {
                    Tween._tweenList[i].update();
                }
            }
            isUpdateTween=!isUpdateTween;
        }
    }
}