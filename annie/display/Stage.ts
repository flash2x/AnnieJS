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
         * 是否阻止ios端双击后页面会往上弹的效果，因为如果阻止了，可能有些html元素出现全选框后无法取消
         * 所以需要自己灵活设置,默认阻止.
         * @property iosTouchendPreventDefault
         * @type {boolean}
         * @default true
         * @since 1.0.4
         * @public
         */
        public iosTouchendPreventDefault: boolean = true;
        /**
         * 是否禁止引擎所在的canvas的鼠标事件或触摸事件的默认形为，默认为true是禁止的。
         * @property isPreventDefaultEvent
         * @since 1.0.9
         * @default true
         * @type {boolean}
         */
        public isPreventDefaultEvent:boolean=true;
        /**
         * 整个引擎的最上层的div元素,
         * 承载canvas的那个div html元素
         * @property rootDiv
         * @public
         * @since 1.0.0
         * @type {Html Div}
         * @default null
         */
        public rootDiv: any = null;
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
         * 如果值为true则暂停更新当前显示对象及所有子对象。在视觉上就相当于界面停止了,但一样能会接收鼠标事件<br/>
         * 有时候背景为大量动画的一个对象时,当需要弹出一个框或者其他内容,或者模糊一个背景时可以设置此属性让<br/>
         * 对象视觉暂停更新
         * @property pause
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        public pause: boolean = false;
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
         * 开启或关闭多点触碰 目前仅支持两点 旋转 缩放
         * @property isMultiTouch
         * @since 1.0.3
         * @type {boolean}
         */
        public isMultiTouch: boolean = false;
        /**
         * 当设备尺寸更新，或者旋转后是否自动更新舞台方向
         * 端默认不开启
         * @property autoSteering
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        public autoSteering: boolean = false;
        /**
         * 当设备尺寸更新，或者旋转后是否自动更新舞台尺寸
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
         *              state.resize();
         *              if(i>5){i=0;}
         *          }
         *      }
         *
         */
        public scaleMode: string = "onScale";
        /**
         * 原始为60的刷新速度时的计数器
         * @property _flush
         * @private
         * @since 1.0.0
         * @default 0
         * @type {number}
         */
        private _flush: number = 0;
        /**
         * 当前的刷新次数计数器
         * @property _currentFlush
         * @private
         * @since 1.0.0
         * @default 0
         * @type {number}
         */
        private _currentFlush: number = 0;
        /**
         * 上一次鼠标或触碰经过的显示对象列表
         * @type {Array}
         * @private
         */
        private static _isLoadedVConsole: boolean = false;
        private _lastDpList: any = {};
        private _rid = -1;
        /**
         * 鼠标事件后强制更新
         * @type {boolean}
         * @private
         */
        private _uae=false;

        /**
         * 显示对象入口函数
         * @method Stage
         * @param {string} rootDivId
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {string} bgColor 背景颜色-1为透明
         * @param {number} renderType 渲染模式0:canvas 1:webGl 2:dom
         * @public
         * @since 1.0.0
         */
        public constructor(rootDivId: string = "annieEngine", desW: number = 640, desH: number = 1040, frameRate: number = 30, scaleMode: string = "fixedHeight", renderType: number = 0) {
            super();
            let s: Stage = this;
            this._instanceType = "annie.Stage";
            s.stage = this;
            let resizeEvent = "resize";
            s.name = "stageInstance_" + s.instanceId;
            let div: any = document.getElementById(rootDivId);
            s.renderType = renderType;
            s.desWidth = desW;
            s.desHeight = desH;
            s.rootDiv = div;
            s.setFrameRate(frameRate);
            s.scaleMode = scaleMode;
            s.anchorX = desW / 2;
            s.anchorY = desH / 2;
            if (renderType == 0) {
                //canvas
                s.renderObj = new CanvasRender(s);
            } else {
                //webgl
                s.renderObj = new WGRender(s);
            }
            s.renderObj.init();
            window.addEventListener(resizeEvent, function (e: any) {
                clearTimeout(s._rid);
                s._rid = setTimeout(function () {
                    if (s.autoResize) {
                        s.resize();
                    }
                    let event = new Event("onResize");
                    s.dispatchEvent(event);
                }, 200);
            });
            setTimeout(function () {
                s.resize();
                //同时添加到主更新循环中
                Stage.addUpdateObj(s);
                //告诉大家我初始化完成
                //判断debug,如果debug等于true并且之前没有加载过则加载debug所需要的js文件
                if (debug && !Stage._isLoadedVConsole) {
                    let script: HTMLScriptElement = document.createElement("script");
                    script.onload = function () {
                        s.dispatchEvent(new annie.Event("onInitStage"));
                        script.onload = null;
                    };
                    document.head.appendChild(script);
                    script.src = "libs/vConsole.min.js";
                } else {
                    s.dispatchEvent(new annie.Event("onInitStage"));
                }
            }, 100);
            let rc = s.renderObj.rootContainer;
            let mouseEvent = s.onMouseEvent.bind(s);
            if (osType != "pc") {
                rc.addEventListener("touchstart", mouseEvent, false);
                rc.addEventListener('touchmove', mouseEvent, false);
                rc.addEventListener('touchend', mouseEvent, false);
            } else {
                rc.addEventListener("mousedown", mouseEvent, false);
                rc.addEventListener('mousemove', mouseEvent, false);
                rc.addEventListener('mouseup', mouseEvent, false);
            }
        }

        /**
         * 刷新函数
         * @method update
         */
        public update(): void {
            let s = this;
            if (!s.pause) {
                let su=s._updateInfo;
                super.update(su.UM,su.UA,su.UF);
            }
        }

        private _touchEvent: annie.TouchEvent;

        /**
         * 渲染函数
         * @method render
         * @param renderObj
         */
        public render(renderObj: IRender): void {
            let s = this;
            if (!s.pause) {
                renderObj.begin();
                super.render(renderObj);
            }

        }

        /**
         * 这个是鼠标事件的对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
         * @type {Array}
         * @private
         */
        private _ml: any = [];
        /**
         * 刷新mouse或者touch事件
         * @private
         */
        private _mouseDownPoint:any={};

        private _initMouseEvent(event: MouseEvent, cp: Point, sp: Point): void {
            event["_pd"] = false;
            event.clientX = cp.x;
            event.clientY = cp.y;
            event.stageX = sp.x;
            event.stageY = sp.y;
        }

        /**
         * 循环刷新页面的函数
         */
        private flush(): void {
            let s = this;
            if (s._flush == 0) {
                s.update();
                s.render(s.renderObj);
            } else {
                //将更新和渲染分放到两个不同的时间更新值来执行,这样可以减轻cpu同时执行的压力。
                if (s._currentFlush == 0) {
                    s.update();
                    s._currentFlush = s._flush;
                } else {
                    if (s._currentFlush == s._flush) {
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
         */
        public getFrameRate(): number {
            return 60 / (this._flush + 1);
        }

        /**
         * 获取引擎所在的div宽高
         * @method getRootDivWH
         * @public
         * @since 1.0.0
         * @param {HTMLDivElement} div
         * @returns {{w: number, h: number}}
         */
        public getRootDivWH(div: HTMLDivElement) {
            let sw = div.style.width;
            let sh = div.style.height;
            let iw = document.body.clientWidth;
            let ih = document.body.clientHeight;
            let vW = parseInt(sw);
            let vH = parseInt(sh);
            if (vW.toString() == "NaN") {
                vW = iw;
            } else {
                if (sw.indexOf("%") > 0) {
                    vW *= iw / 100;
                }
            }
            if (vH.toString() == "NaN") {
                vH = ih;
            } else {
                if (sh.indexOf("%") > 0) {
                    vH *= ih / 100;
                }
            }
            return {w: vW, h: vH};
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
            touchend: "onMouseUp"
        };
        private muliPoints: Array<any> = [];
        /**
         * 当document有鼠标或触摸事件时调用
         * @param e
         */
        private onMouseEvent = function (e: any): void {
            //检查是否有
            let s: any = this;
            if (s.isMultiTouch&&e.targetTouches) {
                if (e.targetTouches.length == 2) {
                    //求角度和距离
                    let p1 = new Point(e.targetTouches[0].clientX - e.target.offsetLeft, e.targetTouches[0].clientY - e.target.offsetTop);
                    let p2 = new Point(e.targetTouches[1].clientX - e.target.offsetLeft, e.targetTouches[1].clientY - e.target.offsetTop);
                    let angle = Math.atan2(p1.y - p2.y, p1.x - p2.x) / Math.PI * 180;
                    let dis = annie.Point.distance(p1, p2);
                    s.muliPoints.push({p1: p1, p2: p2, angle: angle, dis: dis});
                    if (s.muliPoints.length >= 2) {
                        //如果有事件，抛事件
                        if (!s._touchEvent) {
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
                        s.muliPoints = [];
                    }
                } else {
                    s.muliPoints = [];
                }
            }
            //检查mouse或touch事件是否有，如果有的话，就触发事件函数
            if (EventDispatcher._totalMEC > 0) {
                let item = s._mouseEventTypes[e.type];
                let points: any;
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
                let identifier:any;
                if (osType == "pc") {
                    e.identifier="pc";
                    points = [e];
                } else {
                    points = e.changedTouches;
                }
                for(let o=0;o<points.length;o++) {
                    eLen=0;
                    events=[];
                    identifier="m"+points[o].identifier;
                    cp=new Point((points[o].clientX - points[o].target.offsetLeft) * devicePixelRatio,(points[o].clientY - points[o].target.offsetTop) * devicePixelRatio);
                    //这个地方检查是所有显示对象列表里是否有添加任何鼠标或触碰事件,有的话就检测,没有的话就算啦。
                    sp = s.globalToLocal(cp, DisplayObject._bp);
                    if (EventDispatcher.getMouseEventCount() > 0) {
                        if (!s._ml[eLen]) {
                            event = new MouseEvent(item);
                            s._ml[eLen] = event;
                        } else {
                            event = s._ml[eLen];
                            event.type = item;
                        }
                        events.push(event);
                        s._initMouseEvent(event, cp, sp);
                        eLen++;
                    }
                    if (item == "onMouseDown") {
                        s._mouseDownPoint[identifier] = cp;
                        //清空上次存在的显示列表
                    } else if (item == "onMouseUp") {
                        if(s._mouseDownPoint[identifier]) {
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
                                    events.push(event);
                                    s._initMouseEvent(event, cp, sp);
                                    eLen++;
                                }
                            }
                        }
                    }
                    if (eLen > 0) {
                        //证明有事件那么就开始遍历显示列表。就算有多个事件也不怕，因为坐标点相同，所以只需要遍历一次
                        let d: any = s.hitTestPoint(cp, true);
                        let displayList: Array<DisplayObject> = [];
                        if (d) {
                            //证明有点击到事件,然后从最底层追上来,看看一路是否有人添加过mouse或touch事件,还要考虑mousechildren和阻止事件方法
                            //找出真正的target,因为有些父级可能会mouseChildren=false;
                            while (d) {
                                if (d["mouseChildren"] === false) {
                                    //丢掉之前的层级,因为根本没用了
                                    displayList.length = 0;
                                }
                                displayList.push(d);
                                d = d.parent;
                            }
                        } else {
                            displayList.push(s);
                        }
                        let len: number = displayList.length;
                        displayList.reverse();
                        for (let i = 0; i < len; i++) {
                            d = displayList[i];
                            for (let j = 0; j < eLen; j++) {
                                if (events[j]["_pd"] === false) {
                                    if (d.hasEventListener(events[j].type)) {
                                        events[j].currentTarget = d;
                                        events[j].target = displayList[len - 1];
                                        lp = d.globalToLocal(cp,DisplayObject._bp);
                                        events[j].localX = lp.x;
                                        events[j].localY = lp.y;
                                        d.dispatchEvent(events[j]);
                                    }
                                }
                            }
                        }
                        //最后要和上一次的遍历者对比下，如果不相同则要触发onMouseOver和onMouseOut
                        if(item!="onMouseDown"){
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
                                                s._initMouseEvent(overEvent, cp, sp);
                                                eLen++;
                                                if (!s._ml[eLen]) {
                                                    outEvent = new MouseEvent("onMouseOut");
                                                    s._ml[eLen] = outEvent;
                                                } else {
                                                    outEvent = s._ml[eLen];
                                                    outEvent.type = "onMouseOut";
                                                }
                                                s._initMouseEvent(outEvent, cp, sp);
                                            }
                                        }
                                        if (isDiff) {
                                            if (s._lastDpList[identifier][i]) {
                                                //触发onMouseOut事件
                                                if (outEvent["_pd"] === false) {
                                                    d = s._lastDpList[identifier][i];
                                                    if (d.hasEventListener("onMouseOut")) {
                                                        outEvent.currentTarget = d;
                                                        outEvent.target = s._lastDpList[identifier][len1 - 1];
                                                        lp = d.globalToLocal(cp,DisplayObject._bp);
                                                        outEvent.localX = lp.x;
                                                        outEvent.localY = lp.y;
                                                        d.dispatchEvent(outEvent);
                                                    }
                                                }
                                            }
                                            if (displayList[i]) {
                                                //触发onMouseOver事件
                                                if (overEvent["_pd"] === false) {
                                                    d = displayList[i];
                                                    if (d.hasEventListener("onMouseOver")) {
                                                        overEvent.currentTarget = d;
                                                        overEvent.target = displayList[len2 - 1];
                                                        lp = d.globalToLocal(cp,DisplayObject._bp);
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
                        }
                        if(item=="onMouseUp"){
                            s._mouseDownPoint[identifier]=null;
                            s._lastDpList[identifier] = null;
                            delete s._mouseDownPoint[identifier];
                            delete s._lastDpList[identifier];
                        }else {
                            s._lastDpList[identifier] = displayList;
                        }
                    }
                }
            }
            if(s.isPreventDefaultEvent) {
                if ((e.type == "touchend") && (annie.osType == "ios") && (s.iosTouchendPreventDefault)) {
                    e.preventDefault();
                }
                if ((e.type == "touchmove") || (e.type == "touchstart" && annie.osType == "android")) {
                    e.preventDefault();
                }
            }
            if(s._uae){
                s.update();
                s._uae=false;
            }
        };
        /**
         * 设置舞台的对齐模式
         */
        private setAlign = function () {
            let s = this;
            let divH = s.divHeight * devicePixelRatio;
            let divW = s.divWidth * devicePixelRatio;
            let desH = s.desHeight;
            let desW = s.desWidth;
            //设备是否为竖屏
            let isDivH = divH > divW;
            //内容是否为竖屏内容
            let isDesH = desH > desW;
            let scaleY = 1;
            let scaleX = 1;
            s.x = (divW - desW) / 2;
            s.y = (divH - desH) / 2;
            if (s.autoSteering) {
                if (isDesH != isDivH) {
                    let d = divH;
                    divH = divW;
                    divW = d;
                }
            }
            if (s.scaleMode != "noScale") {
                scaleY = divH / desH;
                scaleX = divW / desW;
                switch (s.scaleMode) {
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
            s.viewRect.x = (desW - divW / scaleX) / 2;
            s.viewRect.y = (desH - divH / scaleY) / 2;
            s.viewRect.width = desW - s.viewRect.x * 2;
            s.viewRect.height = desH - s.viewRect.y * 2;
            if (s.autoSteering) {
                if (isDesH == isDivH) {
                    s.rotation = 0;
                } else {
                    if(desH>desW){
                        s.rotation = -90;
                    }else{
                        s.rotation = 90;
                    }
                }
            } else {
                s.rotation = 0;
            }
        };
        /**
         * 当舞台尺寸发生改变时,如果stage autoResize 为 true，则此方法会自己调用；
         * 如果设置stage autoResize 为 false 你需要手动调用此方法以更新界面.
         * 不管autoResize 的状态是什么，你只要侦听 了stage 的 annie.Event.RESIZE 事件
         * 都可以接收到舞台变化的通知。
         * @method resize
         * @public
         * @since 1.0.0
         */
        public resize = function ():void {
            let s: Stage = this;
            let whObj = s.getRootDivWH(s.rootDiv);
            s._updateInfo.UM=true;
            s.divHeight = whObj.h;
            s.divWidth = whObj.w;
            s.renderObj.reSize();
            s.setAlign();
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
        /**
         * 刷新所有定时器
         * @static
         * @private
         * @since 1.0.0
         * @method flushAll
         */
        private static flushAll(): void {
            let len = Stage.allUpdateObjList.length;
            for (let i = 0; i < len; i++) {
                Stage.allUpdateObjList[i] && Stage.allUpdateObjList[i].flush();
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
    }
}