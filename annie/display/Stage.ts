
/**
 * @module annie
 */
namespace annie {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * 无法以全局方式访问 Stage 对象,而是需要利用DisplayObject实例的getStage()方法进行访问
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    export class Stage extends Sprite {
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
         * 如果值为true则暂停更新当前显示对象及所有子对象。在视觉上就相当于界面停止了,但一样能会接收鼠标事件<br/>
         * 有时候背景为大量动画的一个对象时,当需要弹出一个框或者其他内容,或者模糊一个背景时可以设置此属性让<br/>
         * 对象视觉暂停更新
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
            let s:any=Stage;
            if (value != s._pause) {
                if (value) {
                    //停止声音
                    Sound.stopAllSounds();
                } else {
                    //恢复声音
                    Sound.resumePlaySounds();
                }
                //触发事件
                s._pause = value;
                globalDispatcher.dispatchEvent("onRunChanged", {pause: value});
            }
        }

        private static _pause: boolean = false;
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
        public viewRect: Rectangle = new Rectangle();
        /**
         * 开启或关闭多点手势事件 目前仅支持两点 旋转 缩放
         * @property isMultiTouch
         * @since 1.0.3
         * @type {boolean}
         */
        public isMultiTouch: boolean = false;
        /**
         * 开启或关闭多个手指的鼠标事件 目前仅支持两点 旋转 缩放
         * @property isMultiMouse
         * @since 1.1.3
         * @type {boolean}
         */
        public isMultiMouse: boolean = false;
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
         * 默认就是透明背景
         * 可能设置一个颜色值改变舞台背景
         * @property bgColor
         * @public
         * @since 1.0.0
         * @type {string}
         * @default "";
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
        private _flush: number = 0;

        // 当前的刷新次数计数器
        private _currentFlush: number = 0;
        public static _dragDisplay: DisplayObject = null;
        /**
         * 上一次鼠标或触碰经过的显示对象列表
         * @type {Array}
         * @private
         */
        private _lastDpList: any = {};
        public onTouchEvent: any;

        /**
         * 显示对象入口函数
         * @method Stage
         * @param {Canvas} ctx
         * @param {number} desW canvas宽
         * @param {number} desH canvas高
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {string} bgColor 背景颜色-1为透明
         * @public
         * @since 1.0.0
         */
        public constructor(ctx: any, canW: number = 640, canH: number = 960, desW: number = 640, desH: number = 1040, frameRate: number = 30, scaleMode: string = "fixedHeight") {
            super();
            let s: Stage = this;
            this._instanceType = "annie.Stage";
            s.stage = this;
            s.name = "stageInstance" + s._instanceId;
            s.desWidth = desW;
            s.desHeight = desH;
            s.divWidth = canW;
            s.divHeight = canH;
            s.setFrameRate(frameRate);
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            //目前具支持canvas
            s.renderObj = new CanvasRender(s, ctx);
            //同时添加到主更新循环中
            Stage.addUpdateObj(s);
            s.onTouchEvent = s._onMouseEvent.bind(s);
            s._scaleMode = scaleMode;
            s.setAlign();
        }

        private _touchEvent: annie.TouchEvent;

        /**
         * 渲染函数
         * @method render
         * @param renderObj
         */
        public render(renderObj: IRender): void {
            let s = this;
            renderObj.begin();
            super.render(renderObj);
            renderObj.end();
        }

        /**
         * 这个是鼠标事件的MouseEvent对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
         * @type {Array}
         * @private
         */
        private _ml: any = [];
        /**
         * 这个是事件中用到的Point对象池,以提高性能
         * @type {Array}
         * @private
         */
        private _mp: any = [];

        /**
         * 刷新mouse或者touch事件
         * @private
         */
        private _initMouseEvent(event: MouseEvent, cp: Point, sp: Point, identifier: number): void {
            event["_pd"] = false;
            event["_bpd"] = false;
            event.clientX = cp.x;
            event.clientY = cp.y;
            event.stageX = sp.x;
            event.stageY = sp.y;
            event.identifier = identifier;
        }
        // 鼠标按下事件的对象池
        private _mouseDownPoint: any = {};
        //循环刷新页面的函数
        private flush(): void {
            let s = this;
            if (s._flush == 0) {
                s.callEventAndFrameScript(2);
                s.update(true);
                s.render(s.renderObj);
            } else {
                //将更新和渲染分放到两个不同的时间更新值来执行,这样可以减轻cpu同时执行的压力。
                if (s._currentFlush == 0) {
                    s._currentFlush = s._flush;
                } else {
                    if (s._currentFlush == s._flush) {
                        s.callEventAndFrameScript(2);
                        s.update(true);
                        s.render(s.renderObj);
                    }
                    s._currentFlush--;
                }
            }
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
            let s = this;
            s._flush = 60 / fps - 1 >> 0;
            if (s._flush < 0) {
                s._flush = 0;
            }
        }

        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         * @return {number}
         */
        public getFrameRate(): number {
            return 60 / (this._flush + 1);
        }

        /**
         * 当一个stage不再需要使用,或者要从浏览器移除之前,请先停止它,避免内存泄漏
         * @method kill
         * @since 1.0.0
         * @public
         */
        public kill(): void {
            Stage.removeUpdateObj(this);
        }

        /**
         * html的鼠标或单点触摸对应的引擎事件类型名
         * @type {{mousedown: string, mouseup: string, mousemove: string, touchstart: string, touchmove: string, touchend: string}}
         * @private
         */
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
        private muliPoints: Array<any> = [];
        /**
         * 当document有鼠标或触摸事件时调用
         * @param e
         */
        private _mP1: Point = new Point();
        private _mP2: Point = new Point();
        private _onMouseEvent = function (e: any): void {
            //检查是否有
            let s: any = this;
            //判断是否有drag的显示对象
            let sd: any = Stage._dragDisplay;
            if (s.isMultiTouch && e.changedTouches && e.changedTouches.length > 1) {
                if (e.changedTouches.length == 2) {
                    //求角度和距离
                    s._mP1.x = e.changedTouches[0].pageX ;
                    s._mP1.y = e.changedTouches[0].pageY;
                    s._mP2.x = e.changedTouches[1].pageX;
                    s._mP2.y = e.changedTouches[1].pageY;
                    let angle = Math.atan2(s._mP1.y - s._mP2.y, s._mP1.x - s._mP2.x) / Math.PI * 180;
                    let dis = annie.Point.distance(s._mP1, s._mP2);
                    s.muliPoints.push({p1: s._mP1, p2: s._mP2, angle: angle, dis: dis});
                    if (s.muliPoints.length >= 2) {
                        //如果有事件，抛事件
                        if (!s._touchEvent) {
                            s._touchEvent = new annie.TouchEvent(annie.TouchEvent.ON_MULTI_TOUCH);
                            s._touchEvent.target = s;
                        }
                        let len = s.muliPoints.length;
                        s._touchEvent.rotate = (s.muliPoints[len - 1].angle - s.muliPoints[len - 2].angle) * 2;
                        s._touchEvent.scale = (s.muliPoints[len - 1].dis - s.muliPoints[len - 2].dis) / (s.divHeight > s.divWidth ? s.desWidth : s.desHeight) * 4;
                        s._touchEvent.clientPoint1.x = s.muliPoints[len - 1].p1.x;
                        s._touchEvent.clientPoint2.x = s.muliPoints[len - 1].p2.x;
                        s._touchEvent.clientPoint1.y = s.muliPoints[len - 1].p1.y;
                        s._touchEvent.clientPoint2.y = s.muliPoints[len - 1].p2.y;
                        s.dispatchEvent(s._touchEvent);
                        s.muliPoints.shift();
                    }
                } else {
                    s.muliPoints.length = 0;
                }
                if (sd) {
                    sd._lastDragPoint.x = Number.MAX_VALUE;
                    sd._lastDragPoint.y = Number.MAX_VALUE;
                }
                s._mouseDownPoint = {};
                s._lastDpList = {};
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
                    let events: any;
                    let event: any;
                    //stageMousePoint
                    let sp: Point;
                    //localPoint;
                    let lp: Point;
                    //clientPoint
                    let cp: Point;
                    //事件个数
                    let eLen: number;
                    let identifier: any;
                    if (s.isMultiMouse) {
                        points = e.changedTouches;
                    } else {
                        points = [e.changedTouches[0]];
                    }
                    for (let o = 0; o < points.length; o++) {
                        eLen = 0;
                        events = [];
                        identifier = points[o].identifier;
                        if (s._mp.length > 0) {
                            cp = s._mp.shift();
                        } else {
                            cp = new Point();
                        }
                        cp.x = points[o].pageX;
                        cp.y = points[o].pageY;
                        //这个地方检查是所有显示对象列表里是否有添加任何鼠标或触碰事件,有的话就检测,没有的话就算啦。
                        sp = s.globalToLocal(cp, DisplayObject._bp);
                        //if (EventDispatcher.getMouseEventCount() > 0) {
                            if (!s._ml[eLen]) {
                                event = new MouseEvent(item);
                                s._ml[eLen] = event;
                            } else {
                                event = s._ml[eLen];
                                event.type = item;
                            }
                            events[events.length] = event;
                            s._initMouseEvent(event, cp, sp, identifier);
                            eLen++;
                        //}
                        if (item == "onMouseDown") {
                            s._mouseDownPoint[identifier] = cp;
                            //清空上次存在的显示列表
                        } else if (item == "onMouseUp") {
                            if (s._mouseDownPoint[identifier]) {
                                if (annie.Point.distance(s._mouseDownPoint[identifier], cp) < 20) {
                                    //click事件
                                    //这个地方检查是所有显示对象列表里是否有添加对应的事件
                                    if (EventDispatcher.getMouseEventCount("onMouseClick") > 0) {
                                        if (!s._ml[eLen]) {
                                            event = new MouseEvent("onMouseClick");
                                            s._ml[eLen] = event;
                                        } else {
                                            event = s._ml[eLen];
                                            event.type = "onMouseClick";
                                        }
                                        events[events.length] = event;
                                        s._initMouseEvent(event, cp, sp, identifier);
                                        eLen++;
                                    }
                                }
                            }
                        }
                        if (eLen > 0) {
                            //证明有事件那么就开始遍历显示列表。就算有多个事件也不怕，因为坐标点相同，所以只需要遍历一次
                            let d: any = s.hitTestPoint(cp, true,true);
                            let displayList: Array<DisplayObject> = [];
                            if (d) {
                                //证明有点击到事件,然后从最底层追上来,看看一路是否有人添加过mouse或touch事件,还要考虑mousechildren和阻止事件方法
                                //找出真正的target,因为有些父级可能会mouseChildren=false;
                                while (d) {
                                    if (d["mouseChildren"] === false) {
                                        //丢掉之前的层级,因为根本没用了
                                        displayList.length = 0;
                                    }
                                    displayList[displayList.length] = d;
                                    d = d.parent;
                                }
                            } else {
                                displayList[displayList.length] = s;
                            }
                            let len: number = displayList.length;
                            for (let i =len-1; i >=0; i--) {
                                d = displayList[i];
                                for (let j = 0; j <eLen; j++) {
                                    if (!events[j]["_bpd"]) {
                                        if (d.hasEventListener(events[j].type)) {
                                            events[j].currentTarget = d;
                                            events[j].target = displayList[0];
                                            lp = d.globalToLocal(cp, DisplayObject._bp);
                                            events[j].localX = lp.x;
                                            events[j].localY = lp.y;
                                            d.dispatchEvent(events[j]);
                                        }
                                    }
                                }
                            }
                            //这里一定要反转一下，因为会影响mouseOut mouseOver
                            displayList.reverse();
                            for (let i =len-1; i >=0; i--) {
                                d = displayList[i];
                                for (let j = 0; j <eLen; j++) {
                                    if (!events[j]["_bpd"]){
                                        if (d.hasEventListener(events[j].type)) {
                                            events[j].currentTarget = d;
                                            events[j].target = displayList[eLen-1];
                                            lp = d.globalToLocal(cp, DisplayObject._bp);
                                            events[j].localX = lp.x;
                                            events[j].localY = lp.y;
                                            d.dispatchEvent(events[j],null,false);
                                        }
                                    }
                                }
                            }
                            //最后要和上一次的遍历者对比下，如果不相同则要触发onMouseOver和onMouseOut
                            if (item != "onMouseDown") {
                                if (EventDispatcher.getMouseEventCount("onMouseOver") > 0 || EventDispatcher.getMouseEventCount("onMouseOut") > 0) {
                                    if (s._lastDpList[identifier]) {
                                        //从第二个开始，因为第一个对象始终是stage顶级对象
                                        let len1 = s._lastDpList[identifier].length;
                                        let len2 = displayList.length;
                                        len = len1 > len2 ? len1 : len2;
                                        let isDiff = false;
                                        let overEvent: annie.MouseEvent;
                                        let outEvent: annie.MouseEvent;
                                        for (let i = 1; i < len; i++) {
                                            if (!isDiff) {
                                                if (s._lastDpList[identifier][i] != displayList[i]) {
                                                    //好就是这里，需要确定哪些有onMouseOver,哪些有onMouseOut
                                                    isDiff = true;
                                                    if (!s._ml[eLen]) {
                                                        overEvent = new MouseEvent("onMouseOver");
                                                        s._ml[eLen] = overEvent;
                                                    } else {
                                                        overEvent = s._ml[eLen];
                                                        overEvent.type = "onMouseOver";
                                                    }
                                                    s._initMouseEvent(overEvent, cp, sp, identifier);
                                                    eLen++;
                                                    if (!s._ml[eLen]) {
                                                        outEvent = new MouseEvent("onMouseOut");
                                                        s._ml[eLen] = outEvent;
                                                    } else {
                                                        outEvent = s._ml[eLen];
                                                        outEvent.type = "onMouseOut";
                                                    }
                                                    s._initMouseEvent(outEvent, cp, sp, identifier);
                                                }
                                            }
                                            if (isDiff) {
                                                if (s._lastDpList[identifier][i]) {
                                                    //触发onMouseOut事件
                                                    if (outEvent["_bpd"] === false) {
                                                        d = s._lastDpList[identifier][i];
                                                        if (d.hasEventListener("onMouseOut")) {
                                                            outEvent.currentTarget = d;
                                                            outEvent.target = s._lastDpList[identifier][len1 - 1];
                                                            lp = d.globalToLocal(cp, DisplayObject._bp);
                                                            outEvent.localX = lp.x;
                                                            outEvent.localY = lp.y;
                                                            d.dispatchEvent(outEvent);
                                                        }
                                                    }
                                                }
                                                if (displayList[i]) {
                                                    //触发onMouseOver事件
                                                    if (overEvent["_bpd"] === false) {
                                                        d = displayList[i];
                                                        if (d.hasEventListener("onMouseOver")) {
                                                            overEvent.currentTarget = d;
                                                            overEvent.target = displayList[len2 - 1];
                                                            lp = d.globalToLocal(cp, DisplayObject._bp);
                                                            overEvent.localX = lp.x;
                                                            overEvent.localY = lp.y;
                                                            d.dispatchEvent(overEvent);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                s._mp[s._mp.length] = cp;
                            }
                            if (sd && sd.stage && sd.parent) {
                                let x1 = sd.x, y1 = sd.y;
                                lp = sd.parent.globalToLocal(cp, DisplayObject._bp);
                                if (!sd._isDragCenter) {
                                    if (sd._lastDragPoint.x != Number.MAX_VALUE) {
                                        x1 += lp.x - sd._lastDragPoint.x;
                                        y1 += lp.y - sd._lastDragPoint.y;
                                    }
                                    sd._lastDragPoint.x = lp.x;
                                    sd._lastDragPoint.y = lp.y;
                                } else {
                                    x1 = lp.x;
                                    y1 = lp.y;
                                }
                                lp.x = x1;
                                lp.y = y1;
                                if (sd._dragBounds.width != 0) {
                                    if (!sd._dragBounds.isPointIn(lp)) {
                                        if (x1 < sd._dragBounds.x) {
                                            x1 = sd._dragBounds.x;
                                        } else if (x1 > sd._dragBounds.x + sd._dragBounds.width) {
                                            x1 = sd._dragBounds.x + sd._dragBounds.width;
                                        }
                                        if (y1 < sd._dragBounds.y) {
                                            y1 = sd._dragBounds.y;
                                        } else if (y1 > sd._dragBounds.y + sd._dragBounds.height) {
                                            y1 = sd._dragBounds.y + sd._dragBounds.height;
                                        }
                                    }
                                }
                                sd.x = x1;
                                sd.y = y1;
                            }
                            if (item == "onMouseUp") {
                                if (sd) {
                                    sd._lastDragPoint.x = Number.MAX_VALUE;
                                    sd._lastDragPoint.y = Number.MAX_VALUE;
                                }
                                delete s._mouseDownPoint[identifier];
                                delete s._lastDpList[identifier];
                            } else {
                                s._lastDpList[identifier] = displayList;
                            }
                        }
                    }
                }
            }
        };
        /**
         * 设置舞台的对齐模式
         */
        private setAlign = function () {
            let s = this;
            let divH = s.divHeight;
            let divW = s.divWidth;
            let desH = s.desHeight;
            let desW = s.desWidth;
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            //设备是否为竖屏
            let isDivH = divH > divW;
            //内容是否为竖屏内容
            let isDesH = desH > desW;
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
            // s.viewRect=new annie.Rectangle();
            s.viewRect.x = (desW - divW / scaleX) >> 1;
            s.viewRect.y = (desH - divH / scaleY) >> 1;
            s.viewRect.width = desW - s.viewRect.x * 2;
            s.viewRect.height = desH - s.viewRect.y * 2;
            if (isDesH == isDivH) {
                s.rotation = 0;
            } else {
                if (desH > desW) {
                    s.rotation = -90;
                } else {
                    s.rotation = 90;
                }
            }
        };

        public getBounds(): Rectangle {
            return this.viewRect;
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
        private static flushAll(): void {
            Stage._runIntervalId=setInterval(function () {
                if (!Stage._pause) {
                    let len = Stage.allUpdateObjList.length;
                    for (let i = 0; i < len; i++) {
                        Stage.allUpdateObjList[i] && Stage.allUpdateObjList[i].flush();
                    }
                }
            }, 16);
            //什么时候支持这个方法，什么时候就换上
            //requestAnimationFrame(Stage.flushAll);
        }
        private static _runIntervalId=-1;

        /**
         * 当小程序unload的时候，同时也unload 整个annie项目
         * @method unLoadAnnie
         * @public
         * @static
         */
        public static unLoadAnnie():void{
            clearInterval(Stage._runIntervalId);
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
                if (Stage.allUpdateObjList[i] === target) {
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
                if (Stage.allUpdateObjList[i] === target) {
                    Stage.allUpdateObjList.splice(i, 1);
                    break;
                }
            }
        }
        public destroy():void{
            let s = this;
            Stage.removeUpdateObj(s);
            super.destroy();
        }
    }
}