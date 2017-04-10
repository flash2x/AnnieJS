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
        /**
         * 构造函数，初始化
         * @method Timer
         * @param delay
         * @param repeatCount
         */
        constructor(delay:number, repeatCount:number = 0){
            super();
            if(delay<=0){
                delay=1;
            }
            this._delay=delay;
            this._frameDelay=Math.ceil(delay*0.001*60);
            this._repeatCount=repeatCount;
            Timer._timerList.push(this);
        }
        /**
         * 重置定时器
         * @method reset
         * @public
         * @since 1.0.9
         */
        public reset():void{
            this._running=false;
            this._currentCount=0;
            this._currentFrameDelay=0;
        }
        /**
         * 开始执行定时器
         * @method start
         * @public
         * @since 1.0.9
         */
        public start():void{
            this._running=true;
            if(this._currentCount == this._repeatCount){
                this._currentCount=0;
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
         * @returns {number}
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
         * @returns {number}
         */
        public get 	delay():number{
            return this._delay;
        }
        public set delay(value:number){
            this._delay=value;
            this._frameDelay=Math.ceil(value*0.001*60);
        }
        private _delay:number=0;
        private _frameDelay:number=0;
        private _currentFrameDelay:number=0;

        /**
         * 执行触发Timer 的总次数
         * @public
         * @since 1.0.9
         * @returns {number}
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
         * @returns {boolean}
         */
        public get running():boolean{
            return this._running;
        }
        private _running:boolean=false;

        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时残绕着你
         * @method kill
         * @public
         * @since 1.0.9
         */
        public kill():void{
            var len=Timer._timerList.length;
            var s:any=this;
            for(var i=0;i<len;i++){
                if(Timer._timerList[i]._instanceId==s._instanceId){
                    Timer._timerList.splice(i,1);
                    break;
                }
            }
        }
        private update(){
            if(this._running) {
                this._currentFrameDelay++;
                if (this._currentFrameDelay == this._frameDelay) {
                    if(this._repeatCount) {
                        this._currentCount++;
                    }
                    this._currentFrameDelay=0;
                    //触发事件
                    this.dispatchEvent("onTimer");
                    if (this._repeatCount&&this._currentCount == this._repeatCount) {
                        //触发完成时事件
                        this._running = false;
                        this.dispatchEvent("onTimerComplete");
                    }
                }
            }
        }
        private static _timerList:Array<any>=[];
        private static flush():void{
            var len=Timer._timerList.length;
            for(var i=0;i<len;i++){
                Timer._timerList[i].update();
            }
        }
    }
}