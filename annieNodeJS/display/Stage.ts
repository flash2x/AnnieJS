/**
 * @module annie
 */
namespace annie {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    export class Stage extends Sprite {
        /**
         * annie.Stage舞台初始化完成后会触发的事件
         * @event annie.Event.ON_INIT_STAGE
         * @since 1.0.0
         */
        /**
         * annie引擎暂停或者恢复暂停时触发，这个事件只能在annie.globalDispatcher中监听
         * @event annie.Event.ON_RUN_CHANGED
         * @since 1.0.0
         */
        /**
         * annie.Stage 的多点触碰事件。这个事件只能在annie.Stage对象上侦听
         * @event annie.TouchEvent.ON_MULTI_TOUCH
         * @type {string}
         */
        /**
         * 当前stage所使用的渲染器
         * 渲染器有两种,一种是canvas 一种是webGl
         * @property renderObj
         * @public
         * @since 1.0.0
         * @type {IRender}
         * @default null
         */
        public renderObj: IRender = null;
        /**
         * 是否暂停
         * @property pause
         * @static
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        static get pause(): boolean {
            return Stage._pause;
        }

        static set pause(value: boolean) {
            let s: any = Stage;
            if (value != s._pause) {
                s._pause = value;
                //触发事件
                globalDispatcher.dispatchEvent("onRunChanged", {pause: value});
            }
        }
        private static _pause: boolean = false;
        private static stage: Stage = null;
        /**
         * 舞台的尺寸宽,也就是我们常说的设计尺寸
         * @property desWidth
         * @public
         * @since 1.0.0
         * @default 320
         * @type {number}
         * @readonly
         */
        public desWidth: number = 0;
        /**
         * 舞台的尺寸高,也就是我们常说的设计尺寸
         * @property desHeight
         * @public
         * @since 1.0.0
         * @default 240
         * @type {number}
         * @readonly
         */
        public desHeight: number = 0;
        /**
         * 舞台的背景色
         * 默认为""就是透明背景
         * 可能设置一个颜色值改变舞台背景
         * @property bgColor
         * @public
         * @since 1.0.0
         * @type {string} #FFFFFF" 或 RGB(255,255,255) 或 RGBA(255,255,255,255)
         */
        public bgColor: string = "";
        //原始为60的刷新速度时的计数器
        public static _FPS: number = 30;

        /**
         * 显示对象入口函数
         * @method Stage
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @public
         * @since 1.0.0
         */
        public constructor(desW: number = 640, desH: number = 1040, frameRate: number = 30) {
            super();
            let s: any = this;
            s.a2x_ua = true;
            s.a2x_um = true;
            s._instanceType = "annie.Stage";
            s.stage = s;
            s._isOnStage = true;
            s.name = "rootStage";
            s.desWidth = desW;
            s.desHeight = desH;
            s.setFrameRate(frameRate);
            let canvas = annie.app.createCanvas();
            canvas.width =desW;
            canvas.height = desH;
            annie.CanvasRender.rootContainer = canvas;
            annie.OffCanvasRender.rootContainer = annie.app.createCanvas();
            s.renderObj = new CanvasRender(s);
            s.renderObj.init();
            s.renderObj.reSize(desW, desH);
            //同时添加到主更新循环中
            Stage.addUpdateObj(s);
            Stage.stage = s;
            s.a2x_um = true;
        }
        public _render(renderObj: IRender): void {
            renderObj.begin(this.bgColor);
            super._render(renderObj);
            renderObj.end();
        }
        //循环刷新页面的函数
        private flush(): void {
            let s = this;
            s._onUpdateFrame(1);
            s._updateMatrix();
            s._render(s.renderObj);
        }

        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method setFrameRate
         * @param {number} fps 最好是60的倍数如 1 2 3 6 10 12 15 20 30 60
         * @since 1.0.0
         * @public
         * @return {void}
         */
        public setFrameRate(fps: number): void {
            Stage._FPS = fps;
        }

        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         * @return {number}
         */
        public getFrameRate(): number {
            return Stage._FPS;
        }
        /**
         * 要循环调用 flush 函数对象列表
         * @method allUpdateObjList
         * @static
         * @since 1.0.0
         * @type {Array}
         */
        private static allUpdateObjList: Array<any> = [];
        private static _intervalID: number = -1;

        private static flushAll(): void {
            if (Stage._intervalID != -1) {
                clearInterval(Stage._intervalID);
            }
            Stage._intervalID = setInterval(function () {
                if (!Stage._pause) {
                    let len = Stage.allUpdateObjList.length;
                    for (let i = len - 1; i >= 0; i--) {
                        Stage.allUpdateObjList[i] && Stage.allUpdateObjList[i].flush();
                    }
                }
            }, 1000 / Stage._FPS >> 0);
        }

        /**
         * 添加一个刷新对象，这个对象里一定要有一个 flush 函数。
         * 因为一但添加，这个对象的 flush 函数会以stage的fps间隔调用
         * 如，你的stage是30fps 那么你这个对象的 flush 函数1秒会调用30次。
         * @method addUpdateObj
         * @param target 要循化调用 flush 函数的对象
         * @public
         * @static
         * @since
         * @return {void}
         */
        public static addUpdateObj(target: any): void {
            let isHave: boolean = false;
            let len = Stage.allUpdateObjList.length;
            for (let i = 0; i < len; i++) {
                if (Stage.allUpdateObjList[i] == target) {
                    isHave = true;
                    break;
                }
            }
            if (!isHave) {
                Stage.allUpdateObjList.unshift(target);
            }
        }

        /**
         * 移除掉已经添加的循环刷新对象
         * @method removeUpdateObj
         * @param target
         * @public
         * @static
         * @since 1.0.0
         * @return {void}
         */
        public static removeUpdateObj(target: any): void {
            let len = Stage.allUpdateObjList.length;
            for (let i = 0; i < len; i++) {
                if (Stage.allUpdateObjList[i] == target) {
                    Stage.allUpdateObjList.splice(i, 1);
                    break;
                }
            }
        }

        public destroy(): void {
            super.destroy();
            let s = this;
            Stage.removeUpdateObj(s);
            s.renderObj.destroy();
            s.renderObj = null;
        }
    }
}