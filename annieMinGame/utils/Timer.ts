/**
 * @module annie
 */
namespace annie {

    /**
     * 定时器类
     * @class annie.Timer
     * @public
     * @since 1.0.9
     */
    export class Timer extends annie.EventDispatcher{
        //Evetns
        /**
         * annie.Timer定时器触发事件
         * @event annie.Event.TIMER
         * @since 1.0.9
         */
        /**
         * annie.Timer定时器完成事件
         * @event annie.Event.TIMER_COMPLETE
         * @since 1.0.9
         */
        /**
         * 构造函数，初始化
         * @method Timer
         * @param {number} delay
         * @param {number} repeatCount
         * @example
         *      var timer=new annie.Timer(1000,10);
         *      timer.addEventListener(annie.Event.TIMER,function (e) {
         *          console.log("once");
         *      })
         *      timer.addEventListener(annie.Event.TIMER_COMPLETE, function (e) {
         *          console.log("complete");
         *          e.target.kill();
         *      })
         *      timer.start();
         */
        constructor(delay:number, repeatCount:number = 0){
            super();
            if(delay<=0){
                delay=1;
            }
            let s=this;
            s._delay=delay;
            s._frameDelay=Math.ceil(delay*0.001*Stage._FPS);
            s._repeatCount=repeatCount;
            Timer._timerList.push(s);
        }
        /**
         * 重置定时器
         * @method reset
         * @public
         * @since 1.0.9
         */
        public reset():void{
            let s=this;
            s._running=false;
            s._currentCount=0;
            s._currentFrameDelay=0;
        }
        /**
         * 开始执行定时器
         * @method start
         * @public
         * @since 1.0.9
         */
        public start():void{
            let s=this;
            s._running=true;
            if(s._currentCount == s._repeatCount){
                s._currentCount=0;
            }
        }
        /**
         * 停止执行定时器，通过再次调用start方法可以接着之前未完成的状态运行
         * @method stop
         * @public
         * @since 1.0.9
         */
        public stop():void{
            this._running=false;
        }

        /**
         * 当前触发了多少次Timer事件
         * @property currentCount
         * @readonly
         * @public
         * @since 1.0.9
         * @return {number}
         */
        public get currentCount():number{
            return this._currentCount;
        }
        private _currentCount:number=0;
        /**
         * 设置或者获取当前定时器之间的执行间隔
         * @property delay
         * @since 1.0.9
         * @public
         * @return {number}
         */
        public get 	delay():number{
            return this._delay;
        }
        public set delay(value:number){
            this._delay=value;
            this._frameDelay=Math.ceil(value*0.001*Stage._FPS);
        }
        private _delay:number=0;
        private _frameDelay:number=0;
        private _currentFrameDelay:number=0;

        /**
         * 执行触发Timer 的总次数
         * @method repeatCount
         * @public
         * @since 1.0.9
         * @return {number}
         */
        public get repeatCount():number{
            return this._repeatCount;
        }
        public set repeatCount(value:number){
            if(value<0){
                value=0;
            }
            this._repeatCount=value;
        }
        private _repeatCount:number=0;

        /**
         * 当前是否在运行中
         * @property running
         * @since 1.0.9
         * @return {boolean}
         */
        public get running():boolean{
            return this._running;
        }
        private _running:boolean=false;

        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时缠绕着你
         * @method kill
         * @public
         * @since 1.0.9
         */
        public kill():void{
            let len=Timer._timerList.length;
            let s:any=this;
            for(let i=0;i<len;i++){
                if(Timer._timerList[i]._instanceId==s._instanceId){
                    Timer._timerList.splice(i,1);
                    break;
                }
            }
        }
        private update(){
            let s=this;
            if(s._running) {
                s._currentFrameDelay++;
                if (s._currentFrameDelay == s._frameDelay) {
                    if(s._repeatCount) {
                        s._currentCount++;
                    }
                    s._currentFrameDelay=0;
                    //触发事件
                    s.dispatchEvent("onTimer");
                    if (s._repeatCount&&s._currentCount == s._repeatCount) {
                        //触发完成时事件
                        s._running = false;
                        s.dispatchEvent("onTimerComplete");
                    }
                }
            }
        }
        private static _timerList:Array<any>=[];
        private static flush():void{
            var len=Timer._timerList.length;
            for(let i=len-1;i>=0;i--){
                if(Timer._timerList[i] ) {
                    Timer._timerList[i].update();
                }else{
                    Timer._timerList.splice(i,1);
                }
            }
        }
        public destroy(): void {
            let s=this;
            s.kill();
            super.destroy();
        }
    }
}