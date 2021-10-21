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
         * 渲染模式值 只读 CANVAS:0, webGl: 1
         * @property renderType
         * @readonly
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         * @readonly
         */
        public renderType = 0;

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
                if (value) {
                    //停止声音
                    Sound.stopAllSounds();
                } else {
                    //恢复声音
                    Sound.resumePlaySounds();
                }
                //触发事件
                globalDispatcher.dispatchEvent("onRunChanged", {pause: value});
            }
        }

        private static _pause: boolean = false;
        private static stage: Stage = null;
        private _viewRect: Rectangle = new Rectangle();
        /**
         * 开启或关闭多点手势事件 目前仅支持两点 旋转 缩放
         * @property isMultiTouch
         * @since 1.0.3
         * @type {boolean}
         */
        public isMultiTouch: boolean = false;
        /**
         * 开启或关闭多个手指的鼠标事件
         * @property isMultiMouse
         * @since 1.1.3
         * @type {boolean}
         */
        public isMultiMouse: boolean = false;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 当设备尺寸更新，或者旋转后是否自动更新舞台方向
         * 默认不开启
         * @property autoSteering
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        public autoSteering: boolean = false;
        /**
         * <h4><font color="red">小游戏不支持 小程序不支持</font></h4>
         * 当设备尺寸更新，或者旋转后是否自动更新舞台尺寸
         * 默认不开启
         * @property autoResize
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        public autoResize: boolean = false;
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
         * 舞台在当前设备中的真实高
         * @property divHeight
         * @public
         * @since 1.0.0
         * @default 320
         * @type {number}
         * @readonly
         */
        public divHeight: number = 0;
        /**
         * 舞台在当前设备中的真实宽
         * @property divWidth
         * @public
         * @since 1.0.0
         * @default 240
         * @readonly
         * @type {number}
         */
        public divWidth: number = 0;
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

        /**
         * 舞台的缩放模式
         * 默认为空就是无缩放的真实大小
         * "noBorder" 无边框模式
         * ”showAll" 显示所有内容
         * “fixedWidth" 固定宽
         * ”fixedHeight" 固定高
         * @property scaleMode
         * @public
         * @since 1.0.0
         * @default "onScale"
         * @type {string}
         * @example
         *      //动态更改stage的对齐方式示例
         *      //以下代码放到一个舞台的显示对象的构造函数中
         *      let s=this;
         *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
         *          let i=0;
         *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
         *              let aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
         *              let state=e.currentTarget;
         *              state.scaleMode=aList[i];
         *              if(i>5){i=0;}
         *          }
         *      }
         *
         */
        get scaleMode(): string {
            return this._scaleMode;
        }

        set scaleMode(value: string) {
            let s = this;
            if (value != s._scaleMode) {
                s._scaleMode = value;
                s.setAlign();
            }
        }

        private _scaleMode: string = "onScale";
        //原始为60的刷新速度时的计数器
        public static _FPS: number = 30;
        private _lastDpList: any = {};

        /**
         * 显示对象入口函数
         * @method Stage
         * @param {Object} canvas
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {number} renderType 渲染模式0:canvas 1:webGl 2:dom
         * @public
         * @since 1.0.0
         */
        public constructor(canvas: any, desW: number = 640, desH: number = 1040, frameRate: number = 30, scaleMode: string = "fixedHeight", renderType: number = 0) {
            super();
            let s: any = this;
            s.a2x_ua = true;
            s.a2x_um = true;
            s._instanceType = "annie.Stage";
            s.stage = s;
            s._isOnStage = true;
            s.name = "rootStage";
            s.renderType = renderType;
            s.desWidth = desW;
            s.desHeight = desH;
            s.setFrameRate(frameRate);
            s._scaleMode = scaleMode;
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            s.mouseEvent = s._onMouseEvent.bind(s);
            if (annie.isSharedCanvas) {
                annie.CanvasRender.rootContainer = annie.app.getSharedCanvas();
                annie.globalDispatcher.addEventListener("onMainStageMsg", function (e: any) {
                    switch (e.data.type) {
                        case annie.MouseEvent.CLICK:
                        case annie.MouseEvent.MOUSE_MOVE:
                        case annie.MouseEvent.MOUSE_UP:
                        case annie.MouseEvent.MOUSE_DOWN:
                        case annie.MouseEvent.MOUSE_OVER:
                        case annie.MouseEvent.MOUSE_OUT:
                            let event: MouseEvent = new MouseEvent(e.data.type);
                            event.reset(e.data.type, s);
                            event.clientX = event.stageX = event.localX = e.data.x;
                            event.clientY = event.stageY = event.localY = e.data.y;
                            s.dispatchEvent(event);
                            break;
                        default:
                    }
                });
            } else {
                let sysInfo = annie.app.getSystemInfoSync();
                let canvas=annie.app.createCanvas();
                canvas.width=sysInfo.windowWidth*sysInfo.pixelRatio;
                canvas.height=sysInfo.windowHeight*sysInfo.pixelRatio;
                annie.CanvasRender.rootContainer= canvas;
                annie.app.onTouchStart(function (e: any) {
                    if(e.type==undefined){
                        e.type="touchstart";
                    }
                    s.mouseEvent(e);
                });
                annie.app.onTouchMove(function (e: any) {
                    if(e.type==undefined){
                        e.type="touchmove";
                    }
                    s.mouseEvent(e);
                });
                annie.app.onTouchEnd(function (e: any) {
                    if(e.type==undefined){
                        e.type="touchend";
                    }
                    s.mouseEvent(e);
                });
                // annie.app.onTouchCancel(function (e: any) {
                //     if(e.type==undefined){
                //         e.type="touchcancel";
                //     }
                //     s.mouseEvent(e);
                // });
            }
            annie.OffCanvasRender.rootContainer= annie.app.createCanvas();
            //webgl 直到对2d的支持非常成熟了再考虑开启
            if (renderType == 0) {
                //canvas
                s.renderObj = new CanvasRender(s);
            } else {
                //webgl
                //s.renderObj = new WebGLRender(s);
            }
            s.renderObj.init();
            //同时添加到主更新循环中
            Stage.addUpdateObj(s);
            Stage.stage = s;
             //这里需要做个延时，方便init事件捕捉
             setTimeout(() => {
                Stage.flushAll();
            }, 0);
        }

        private _touchEvent: annie.TouchEvent;

        public _render(renderObj: IRender): void {
            renderObj.begin(this.bgColor);
            super._render(renderObj);
            renderObj.end();
        }

        //这个是鼠标事件的MouseEvent对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
        private _ml: any = [];
        //这个是事件中用到的Point对象池,以提高性能
        private _mp: any = [];

        //刷新mouse或者touch事件
        private _initMouseEvent(event: any, cp: Point, sp: Point, identifier: number, timeStamp: number): void {
            event._pd = false;
            event.clientX = cp.x;
            event.clientY = cp.y;
            event.stageX = sp.x;
            event.stageY = sp.y;
            event.timeStamp = timeStamp;
            event.identifier = identifier;
        }

        // 鼠标按下事件的对象池
        private _mouseDownPoint: any = {};

        //循环刷新页面的函数
        private flush(): void {
            let s = this;
            //看看是否有resize
            s.resize();
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
            Stage._FPS=fps;
            Stage._flushTime=1000/fps;
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

        //html的鼠标或单点触摸对应的引擎事件类型名
        private _mouseEventTypes: any = {
            mousedown: "onMouseDown",
            mouseup: "onMouseUp",
            mousemove: "onMouseMove",
            touchstart: "onMouseDown",
            touchmove: "onMouseMove",
            touchend: "onMouseUp",
            ontouchstart: "onMouseDown",
            ontouchmove: "onMouseMove",
            ontouchend: "onMouseUp"
        };
        //stageMousePoint
        private sp: Point = new annie.Point();
        //localPoint;
        private lp: Point = new annie.Point();
        private muliPoints: Array<any> = [];
        //当document有鼠标或触摸事件时调用
        private _mP1: Point = new Point();
        //当document有鼠标或触摸事件时调用
        private _mP2: Point = new Point();
        public static _dragDisplay: annie.DisplayObject = null;
        public static _dragBounds: annie.Rectangle = new annie.Rectangle();
        public static _lastDragPoint: annie.Point = new annie.Point();
        public static _isDragCenter: boolean = false;

        private _onMouseEvent(e: any): void {
            //检查是否有
            let s: any = this, offSetX = 0, offSetY = 0;
            let sd: any = Stage._dragDisplay;
            if (s.isMultiTouch && e.changedTouches.length > 1) {
                if (e.changedTouches.length == 2) {
                    //求角度和距离
                    s._mP1.x = e.changedTouches[0].clientX - offSetX;
                    s._mP1.y = e.changedTouches[0].clientY - offSetY;
                    s._mP2.x = e.changedTouches[1].clientX - offSetX;
                    s._mP2.y = e.changedTouches[1].clientY - offSetY;
                    let angle = Math.atan2(s._mP1.y - s._mP2.y, s._mP1.x - s._mP2.x) / Math.PI * 180;
                    let dis = annie.Point.distance(s._mP1, s._mP2);
                    s.muliPoints.push({p1: s._mP1, p2: s._mP2, angle: angle, dis: dis});
                    if (s.muliPoints.length >= 2) {
                        //如果有事件，抛事件
                        if (!(s._touchEvent instanceof annie.TouchEvent)) {
                            s._touchEvent = new annie.TouchEvent(annie.TouchEvent.ON_MULTI_TOUCH);
                            s._touchEvent.target = s;
                        }
                        let len = s.muliPoints.length;
                        s._touchEvent.rotate = (s.muliPoints[len - 1].angle - s.muliPoints[len - 2].angle) * 2;
                        s._touchEvent.scale = (s.muliPoints[len - 1].dis - s.muliPoints[len - 2].dis) / (s.divHeight > s.divWidth ? s.desWidth : s.desHeight) * 4;
                        s._touchEvent.clientPoint1.x = s.muliPoints[len - 1].p1.x * annie.devicePixelRatio;
                        s._touchEvent.clientPoint2.x = s.muliPoints[len - 1].p2.x * annie.devicePixelRatio;
                        s._touchEvent.clientPoint1.y = s.muliPoints[len - 1].p1.y * annie.devicePixelRatio;
                        s._touchEvent.clientPoint2.y = s.muliPoints[len - 1].p2.y * annie.devicePixelRatio;
                        s.dispatchEvent(s._touchEvent);
                        s.muliPoints.shift();
                    }
                } else {
                    s.muliPoints.length = 0;
                }
                s._mouseDownPoint = {};
                s._lastDpList = {};
                if (sd) {
                    Stage._lastDragPoint.x = Number.MAX_VALUE;
                    Stage._lastDragPoint.y = Number.MAX_VALUE;
                }
            } else {
                if (s.muliPoints.length > 0) {
                    s._touchEvent.rotate = 0;
                    s._touchEvent.scale = 0;
                    s._touchEvent.clientPoint1.x = 0;
                    s._touchEvent.clientPoint2.x = 0;
                    s._touchEvent.clientPoint1.y = 0;
                    s._touchEvent.clientPoint2.y = 0;
                    s.dispatchEvent(s._touchEvent);
                    s.muliPoints.length = 0;
                }
                //检查mouse或touch事件是否有，如果有的话，就触发事件函数
                if (EventDispatcher._totalMEC > 0) {
                    let points: any;
                    let item = s._mouseEventTypes[e.type];
                    let events: any = [];
                    let event: any;
                    //clientPoint
                    let cp: Point;
                    //事件个数
                    let eLen: number;
                    let identifier: any;
                    if (s.isMultiMouse) {
                        points = e.changedTouches;
                    } else {
                        let fp = e.changedTouches[0];
                        if ((s._lastDpList[fp.identifier] != void 0) || (item == "onMouseDown" && !s._lastDpList.isStart)) {
                            s._lastDpList.isStart = true;
                            points = [fp];
                        } else {
                            return;
                        }
                    }
                    let pLen = points.length;
                    for (let o = 0; o < pLen; o++) {
                        eLen = 0;
                        events.length = 0;
                        identifier = points[o].identifier;
                        if (s._mp.length > 0) {
                            cp = s._mp.shift();
                        } else {
                            cp = new Point();
                        }
                        cp.x = (points[o].clientX - offSetX) * devicePixelRatio;
                        cp.y = (points[o].clientY - offSetY) * devicePixelRatio;
                        s.globalToLocal(cp, s.sp);
                        if (sd && sd.stage && sd.parent) {
                            let x1 = sd.x, y1 = sd.y;
                            sd.parent.globalToLocal(cp, s.lp);
                            if (!Stage._isDragCenter) {
                                if (Stage._lastDragPoint.x != Number.MAX_VALUE) {
                                    x1 += s.lp.x - Stage._lastDragPoint.x;
                                    y1 += s.lp.y - Stage._lastDragPoint.y;
                                }
                                Stage._lastDragPoint.x = s.lp.x;
                                Stage._lastDragPoint.y = s.lp.y;
                            } else {
                                x1 = s.lp.x;
                                y1 = s.lp.y;
                            }
                            s.lp.x = x1;
                            s.lp.y = y1;
                            if (Stage._dragBounds.width != Number.MIN_VALUE) {
                                if (x1 < Stage._dragBounds.x) {
                                    x1 = Stage._dragBounds.x;
                                } else if (x1 > Stage._dragBounds.x + Stage._dragBounds.width) {
                                    x1 = Stage._dragBounds.x + Stage._dragBounds.width;
                                }
                                if (y1 < Stage._dragBounds.y) {
                                    y1 = Stage._dragBounds.y;
                                } else if (y1 > Stage._dragBounds.y + Stage._dragBounds.height) {
                                    y1 = Stage._dragBounds.y + Stage._dragBounds.height;
                                }
                            }
                            sd.x = x1;
                            sd.y = y1;
                        }
                        if (s._ml[eLen] instanceof annie.MouseEvent) {
                            event = s._ml[eLen];
                            event.type = item;
                        } else {
                            event = new MouseEvent(item);
                            s._ml[eLen] = event;
                        }
                        events[events.length] = event;
                        s._initMouseEvent(event, cp, s.sp, identifier, e.timeStamp);
                        eLen++;
                        if (item == "onMouseDown") {
                            s._mouseDownPoint[identifier] = cp;
                            //清空上次存在的显示列表
                        } else if (item == "onMouseUp") {
                            if (s._mouseDownPoint[identifier] instanceof annie.Point) {
                                if (annie.Point.distance(s._mouseDownPoint[identifier], cp) < 20) {
                                    //click事件
                                    //这个地方检查是所有显示对象列表里是否有添加对应的事件
                                    if (EventDispatcher.getMouseEventCount("onMouseClick") > 0) {
                                        if (s._ml[eLen] instanceof annie.MouseEvent) {
                                            event = s._ml[eLen];
                                            event.type = "onMouseClick";
                                        } else {
                                            event = new MouseEvent("onMouseClick");
                                            s._ml[eLen] = event;
                                        }
                                        events[events.length] = event;
                                        s._initMouseEvent(event, cp, s.sp, identifier);
                                        eLen++;
                                    }
                                }
                            }
                        }
                        if (eLen > 0) {
                            //证明有事件那么就开始遍历显示列表。就算有多个事件也不怕，因为坐标点相同，所以只需要遍历一次
                            let d: any = s.hitTestPoint(cp, true);
                            let displayList: Array<DisplayObject> = [];
                            if (d instanceof annie.DisplayObject) {
                                //证明有点击到事件,然后从最底层追上来,看看一路是否有人添加过mouse或touch事件,还要考虑mousechildren和阻止事件方法
                                //找出真正的target,因为有些父级可能会mouseChildren=false;
                                do {
                                    if (d instanceof annie.Sprite && d.mouseChildren == false) {
                                        //丢掉之前的层级,因为根本没用了
                                        displayList.length = 0;
                                    }
                                    displayList[displayList.length] = d;
                                    d = d.parent;
                                } while (d instanceof annie.DisplayObject)
                            } else {
                                displayList[0] = s;
                            }
                            let len: number = displayList.length;
                            for (let i = len - 1; i >= 0; i--) {
                                d = displayList[i];
                                for (let j = 0; j < eLen; j++) {
                                    if (!events[j]._pd && d.hasEventListener(events[j].type)) {
                                        events[j].currentTarget = d;
                                        events[j].target = displayList[0];
                                        d.globalToLocal(cp, s.lp);
                                        events[j].localX = s.lp.x;
                                        events[j].localY = s.lp.y;
                                        d.dispatchEvent(events[j]);
                                    }
                                }
                            }
                            //这里一定要反转一下，因为会影响mouseOut mouseOver
                            displayList.reverse();
                            for (let i = len - 1; i >= 0; i--) {
                                d = displayList[i];
                                for (let j = 0; j < eLen; j++) {
                                    if (!events[j]._pd && d.hasEventListener(events[j].type, false)) {
                                        events[j].currentTarget = d;
                                        events[j].target = displayList[eLen - 1];
                                        d.globalToLocal(cp, s.lp);
                                        events[j].localX = s.lp.x;
                                        events[j].localY = s.lp.y;
                                        d.dispatchEvent(events[j], null, false);
                                    }
                                }
                            }
                            //最后要和上一次的遍历者对比下，如果不相同则要触发onMouseOver和onMouseOut
                            if (item != "onMouseDown") {
                                if (EventDispatcher.getMouseEventCount("onMouseOver") > 0 || EventDispatcher.getMouseEventCount("onMouseOut") > 0) {
                                    if (s._lastDpList[identifier] instanceof Array) {
                                        //从第二个开始，因为第一个对象始终是stage顶级对象
                                        let len1 = s._lastDpList[identifier].length;
                                        let len2 = displayList.length;
                                        len = len1 > len2 ? len1 : len2;
                                        let isDiff = false;
                                        let overEvent: any;
                                        let outEvent: any;
                                        for (let i = 1; i < len; i++) {
                                            if (!isDiff) {
                                                if (s._lastDpList[identifier][i] != displayList[i]) {
                                                    //好就是这里，需要确定哪些有onMouseOver,哪些有onMouseOut
                                                    isDiff = true;
                                                    if (s._ml[eLen] instanceof annie.MouseEvent) {
                                                        overEvent = s._ml[eLen];
                                                        overEvent.type = "onMouseOver";
                                                    } else {
                                                        overEvent = new MouseEvent("onMouseOver");
                                                        s._ml[eLen] = overEvent;
                                                    }
                                                    s._initMouseEvent(overEvent, cp, s.sp, identifier);
                                                    eLen++;
                                                    if (s._ml[eLen] instanceof annie.MouseEvent) {
                                                        outEvent = s._ml[eLen];
                                                        outEvent.type = "onMouseOut";
                                                    } else {
                                                        outEvent = new MouseEvent("onMouseOut");
                                                        s._ml[eLen] = outEvent;
                                                    }
                                                    s._initMouseEvent(outEvent, cp, s.sp, identifier);
                                                }
                                            }
                                            if (isDiff) {
                                                if (s._lastDpList[identifier][i]) {
                                                    //触发onMouseOut事件
                                                    d = s._lastDpList[identifier][i];
                                                    if (!outEvent._pd && d.hasEventListener("onMouseOut")) {
                                                        outEvent.currentTarget = d;
                                                        outEvent.target = s._lastDpList[identifier][len1 - 1];
                                                        d.globalToLocal(cp, s.lp);
                                                        outEvent.localX = s.lp.x;
                                                        outEvent.localY = s.lp.y;
                                                        d.dispatchEvent(outEvent);
                                                    }
                                                }
                                                d = displayList[i];
                                                if (d instanceof annie.DisplayObject) {
                                                    //触发onMouseOver事件
                                                    if (!overEvent._pd && d.hasEventListener("onMouseOver")) {
                                                        overEvent.currentTarget = d;
                                                        overEvent.target = displayList[len2 - 1];
                                                        d.globalToLocal(cp, s.lp);
                                                        overEvent.localX = s.lp.x;
                                                        overEvent.localY = s.lp.y;
                                                        d.dispatchEvent(overEvent);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                s._mp[s._mp.length] = cp;
                            }
                            if (item == "onMouseUp") {
                                delete s._mouseDownPoint[identifier];
                                delete s._lastDpList[identifier];
                                s._lastDpList.isStart = false;
                                if (sd) {
                                    Stage._lastDragPoint.x = Number.MAX_VALUE;
                                    Stage._lastDragPoint.y = Number.MAX_VALUE;
                                }
                            } else {
                                s._lastDpList[identifier] = displayList;
                            }
                        }
                    }
                }
            }
        };

        //设置舞台的对齐模式
        private setAlign(): void {
            let s = this;
            let divH = s.divHeight;
            let divW = s.divWidth;
            let desH = s.desHeight;
            let desW = s.desWidth;
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            //设备是否为竖屏
            let isDivH = divH >= divW;
            //内容是否为竖屏内容
            let isDesH = desH >= desW;
            let scaleY = 1;
            let scaleX = 1;
            s.x = (divW - desW) >> 1;
            s.y = (divH - desH) >> 1;
            if (s.autoSteering) {
                if (isDesH != isDivH) {
                    let d = divH;
                    divH = divW;
                    divW = d;
                }
            }
            if (s._scaleMode != "noScale") {
                scaleY = divH / desH;
                scaleX = divW / desW;
                switch (s._scaleMode) {
                    case "noBorder":
                        if (scaleX > scaleY) {
                            scaleY = scaleX;
                        } else {
                            scaleX = scaleY;
                        }
                        break;
                    case "showAll":
                        if (scaleX < scaleY) {
                            scaleY = scaleX;
                        } else {
                            scaleX = scaleY;
                        }
                        break;
                    case "fixedWidth":
                        scaleY = scaleX;
                        break;
                    case "fixedHeight":
                        scaleX = scaleY;
                        break;
                }
            }
            s.scaleX = scaleX;
            s.scaleY = scaleY;
            if (s.autoSteering) {
                if (isDesH == isDivH) {
                    s.rotation = 0;
                } else {
                    if (desH > desW) {
                        s.rotation = -90;
                    } else {
                        s.rotation = 90;
                    }
                }
            } else {
                s.rotation = 0;
            }
            s._viewRect.x = (desW - divW / scaleX) >> 1;
            s._viewRect.y = (desH - divH / scaleY) >> 1;
            s._viewRect.width = desW - s._viewRect.x * 2;
            s._viewRect.height = desH - s._viewRect.y * 2;
        };

        /**
         * 当舞台尺寸发生改变时,如果stage autoResize 为 true，则此方法会自己调用；
         * 如果设置stage autoResize 为 false 你需要手动调用此方法以更新界面.
         * 不管autoResize 的状态是什么，你只要侦听 了stage 的 annie.Event.RESIZE 事件
         * 都可以接收到舞台变化的通知。
         * @method resize
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public resize = function (): void {
            let s: Stage = this;
            let w = CanvasRender.rootContainer.width;
            let h = CanvasRender.rootContainer.height;
            if (s.divWidth == 0 || s.divHeight == 0) {
                s.a2x_um = true;
                s.divWidth = w;
                s.divHeight = h;
                s.renderObj.reSize(w, h);
                s.setAlign();
                s.dispatchEvent("onInitStage");
            } else if (s.autoResize) {
                if (s.divWidth != w || s.divHeight != h) {
                    s.a2x_um = true;
                    s.divHeight = h;
                    s.divWidth = w;
                    s.renderObj.reSize(w, h);
                    s.setAlign();
                    s.dispatchEvent("onResize");
                }
            }
        };

        /**
         * 舞台在设备里截取后的可见区域,有些时候知道可见区域是非常重要的,因为这样你就可以根据舞台的可见区域做自适应了。
         * @property viewRect
         * @public
         * @readonly
         * @since 1.0.0
         * @type {annie.Rectangle}
         * @default {x:0,y:0,width:0,height:0}
         * @readonly
         * @example
         *      //始终让一个对象顶对齐，或者
         */
        public get viewRect(): Rectangle {
            return this._viewRect;
        }

        /**
         * 要循环调用 flush 函数对象列表
         * @method allUpdateObjList
         * @static
         * @since 1.0.0
         * @type {Array}
         */
        private static allUpdateObjList: Array<any> = [];
        //刷新所有定时器
        private static _flushTime:number=0;
        private static _lastFluashTime:number=0;
        private static flushAll(): void {
            let nowTime:number=new Date().getTime();
            if(Stage._flushTime-nowTime+Stage._lastFluashTime<Stage._flushTime*0.1){
                Stage._lastFluashTime=nowTime;
                if (!Stage._pause) {
                    let len = Stage.allUpdateObjList.length;
                    for (let i = len - 1; i >= 0; i--) {
                        Stage.allUpdateObjList[i] && Stage.allUpdateObjList[i].flush();
                    }
                }
            }
            requestAnimationFrame(Stage.flushAll);
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