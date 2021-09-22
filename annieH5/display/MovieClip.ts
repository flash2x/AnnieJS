/**
 * @module annie
 */
namespace annie {
    /**
     * annie引擎核心类
     * @class annie.MovieClip
     * @since 1.0.0
     * @public
     * @extends annie.Sprite
     */
    export class MovieClip extends Sprite {
        //Events
        /**
         * annie.MovieClip 播放完成事件
         * @event annie.Event.END_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        /**
         * annie.MovieClip 帧标签事件
         * @event annie.Event.CALL_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */

        //
        /**
         * mc的当前帧
         * @property currentFrame
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        public get currentFrame(): number {
            let s = this;
            return s._wantFrame > 0 ? s._wantFrame : s._curFrame;
        }

        private _curFrame: number = 0;
        private _wantFrame: number = 1;
        private _lastFrameObj: any = null;

        /**
         * 当前动画是否处于播放状态
         * @property isPlaying
         * @readOnly
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         * @readonly
         */
        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        private _isPlaying: boolean = true;

        /**
         * 动画的播放方向,是顺着播还是在倒着播
         * @property isFront
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         * @readonly
         */
        get isFront(): boolean {
            return this._isFront;
        }

        private _isFront: boolean = true;

        /**
         * 当前动画的总帧数
         * @property totalFrames
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        public get totalFrames(): number {
            return (<any>this)._a2x_res_class.tf;
        }

        //有可能帧数带有小数点
        private _floatFrame: number = 0;

        /**
         * 构造函数
         * @method MovieClip
         * @public
         * @since 1.0.0
         */
        public constructor() {
            super();
            let s: any = this;
            s._instanceType = "annie.MovieClip";
        }

        //sprite 和 moveClip的类资源信息
        private _a2x_res_class: any = {tf: 1};
        private _a2x_res_children: any = [];

        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public stop(): void {
            let s = this;
            if(s._wantFrame==0&&s._curFrame==0){
                s._wantFrame=1;
            }
            s._isPlaying = false;
        }
        private _a2x_script: any = null;

        public addFrameScript(frameIndex: number|string, frameScript: Function): void {
            let s = this;
            var timeLineObj = s._a2x_res_class;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                }
            }
            if (!(s._a2x_script instanceof Object))
                s._a2x_script = {};
            s._a2x_script[frameIndex] = frameScript;
        }

        /**
         * 移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex
         */
        public removeFrameScript(frameIndex: number|string): void {
            let s = this;
            var timeLineObj = s._a2x_res_class;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                }
            }
            if (s._a2x_script instanceof Object)
                s._a2x_script[frameIndex] = null;
        }

        /**
         * 确认是不是按钮形态
         * @property isButton
         * @type {boolean}
         * @public
         * @since 2.0.0
         * @default false
         */
        public get isButton(): boolean {
            return this._a2x_mode == -1;
        }

        //动画模式 按钮 剪辑 图形
        private _a2x_mode: number = -2;

        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码.
         * 此方法不可逆，设置后不再能设置回剪辑，一定要这么做的话，请联系作者，看作者答不答应
         * @method initButton
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public initButton(): void {
            let s: any = this;
            if (s._a2x_mode != -1 && s._a2x_res_class.tf > 1) {
                s.mouseChildren = false;
                //将mc设置成按钮形式
                s.addEventListener("onMouseDown", s._mouseEvent.bind(s));
                s.addEventListener("onMuseOver", s._mouseEvent.bind(s));
                s.addEventListener("onMouseUp", s._mouseEvent.bind(s));
                s.addEventListener("onMouseOut", s._mouseEvent.bind(s));
                s._a2x_mode = -1;
                if (s._clicked) {
                    if (s.totalFrames > 2) {
                        s.gotoAndStop(3);
                    } else {
                        s.gotoAndStop(2);
                    }
                } else {
                    s.gotoAndStop(1);
                }
            }
        }

        public set clicked(value: boolean) {
            let s = this;
            if (value != s._clicked) {
                if (value) {
                    s._mouseEvent({ type: "onMouseDown" });
                } else {
                    s.gotoAndStop(1);
                }
                s._clicked = value;
            }
        }

        /**
         * 如果MovieClip设置成了按钮，则通过此属性可以让它定在按下后的状态上，哪怕再点击它并离开它的时候，他也不会变化状态
         * @property clicked
         * @return {boolean}
         * @public
         * @since 2.0.0
         */
        public get clicked(): boolean {
            return this._clicked;
        }

        private _clicked = false;

        private _mouseEvent(e: any): void {
            let s = this;
            if (!s._clicked) {
                let frame = 2;
                if (e.type == "onMouseDown") {
                    if (s.totalFrames > 2) {
                        frame = 3;
                    }
                } else if (e.type == "onMouseOver") {
                    if (s.totalFrames > 1) {
                        frame = 2;
                    }
                } else {
                    frame = 1;
                }
                s.gotoAndStop(frame);
            }
        };

        /**
         * movieClip的当前帧的标签数组,没有则为null
         * @method getCurrentLabel
         * @public
         * @since 1.0.0
         * @return {Array}
         * */
        public getCurrentLabel(): any {
            let s: any = this;
            if (s._a2x_res_class.tf > 1 && s._a2x_res_class.l[s._curFrame - 1]) {
                return s._a2x_res_class.l[s._curFrame - 1];
            }
            return null;
        }

        /**
         * 将播放头向后移一帧并停在下一帧,如果本身在最后一帧则不做任何反应
         * @method nextFrame
         * @since 1.0.0
         * @public
         * @return {void}
         */
        public nextFrame(): void {
            let s = this;
            s._wantFrame += s._cMcSpeed;
            if (s._wantFrame > s._a2x_res_class.tf) {
                s._wantFrame = s._a2x_res_class.tf;
            }
            s._isPlaying = false;
            s._onCheckUpdateFrame();
        }

        /**
         * 将播放头向前移一帧并停在下一帧,如果本身在第一帧则不做任何反应
         * @method prevFrame
         * @since 1.0.0
         * @public
         * @return {void}
         */
        public prevFrame(): void {
            let s = this;
            s._wantFrame -= s._cMcSpeed;
            if (s._wantFrame < 1) {
                s._wantFrame = 1;
            }
            s._isPlaying = false;
            s._onCheckUpdateFrame();
        }

        /**
         * 将播放头跳转到指定帧并停在那一帧,如果本身在第一帧则不做任何反应
         * @method gotoAndStop
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex 批定帧的帧数或指定帧的标签名
         * @return {void}
         */
        public gotoAndStop(frameIndex: number | string): void {
            let s: any = this;
            let timeLineObj = s._a2x_res_class;
            let isOkFrameIndex = false;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                    isOkFrameIndex = true;
                }
            } else if (typeof (frameIndex) == "number") {
                if (frameIndex >= 1 && frameIndex <= timeLineObj.tf) {
                    isOkFrameIndex = true;
                }
            }
            if (isOkFrameIndex) {
                s._isPlaying = false;
                s._floatFrame = 0;
                s._wantFrame = <number>frameIndex;
                s._onCheckUpdateFrame();
            }
        }

        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @param {boolean} isFront true向前播放，false 向后播放。默认向前
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public play(isFront: boolean = true): void {
            let s = this;
            s._isPlaying = true;
            s._isFront = isFront;
        }

        /**
         * 将播放头跳转到指定帧并从那一帧开始继续播放
         * @method gotoAndPlay
         * @public
         * @since 1.0.0
         * @param {number|string} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         * @return {void}
         */
        public gotoAndPlay(frameIndex: number | string, isFront: boolean = true): void {
            let s: any = this;
            let timeLineObj = s._a2x_res_class;
            let isOkFrameIndex = false;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                    isOkFrameIndex = true;
                }
            } else if (typeof (frameIndex) == "number") {
                if (frameIndex >= 1 && frameIndex <= timeLineObj.tf) {
                    isOkFrameIndex = true;
                }
            }
            if (isOkFrameIndex) {
                s._isPlaying = true;
                s._isFront = isFront;
                s._floatFrame = 0;
                s._wantFrame = <number>frameIndex;
                s._onCheckUpdateFrame();
            }
        }
        private _onCheckUpdateFrame(): void {
            let s = this;
            if (s._wantFrame != s._curFrame) {
                if (s._isOnStage) {
                    s._updateTimeline();
                }
            }
        }

        //flash声音管理
        private _a2x_sounds: any = null;

        public _onAddEvent(): void {
            super._onAddEvent();
            this._onCheckUpdateFrame();
        }

        public _updateTimeline(): void {
            let s: any = this;
            if (s._a2x_res_class.tf > 1) {
                if (s._a2x_mode >= 0) {
                    s._isPlaying = false;
                    if (s.parent instanceof annie.MovieClip) {
                        s._wantFrame = s.parent._wantFrame - s._a2x_mode;
                    } else {
                        s._wantFrame = 1;
                    }
                } else {
                    if (s._isPlaying && s._wantFrame == s._curFrame && s._visible) {
                        if (s._isFront) {
                            s._wantFrame += s._cMcSpeed;
                            if (s._wantFrame > s._a2x_res_class.tf) {
                                s._wantFrame = 1;
                            }
                        } else {
                            s._wantFrame -= s._cMcSpeed;
                            if (s._wantFrame < 1) {
                                s._wantFrame = s._a2x_res_class.tf;
                            }
                        }
                    }
                }
                if (s._wantFrame != s._curFrame){
                    let curFrame = Math.floor(s._curFrame);
                    let wantFrame = Math.floor(s._wantFrame);
                    s._floatFrame = s._wantFrame - wantFrame;
                    s._curFrame = s._wantFrame;
                    if (curFrame != wantFrame) {
                        s.a2x_uf = true;
                        let timeLineObj = s._a2x_res_class;
                        //先确定是哪一帧
                        let allChildren = s._a2x_res_children;
                        let childCount = allChildren.length;
                        let objId: number = 0;
                        let obj: any = null;
                        let objInfo: any = null;
                        let frameIndex = wantFrame - 1;
                        let curFrameScript: any;
                        let isFront = s._isFront;
                        let curFrameObj: any = timeLineObj.f[timeLineObj.timeLine[frameIndex]];
                        let addChildren: Array<DisplayObject> = [];
                        let remChildren: Array<DisplayObject> = [];
                        if (s._lastFrameObj != curFrameObj) {
                            s._lastFrameObj = curFrameObj;
                            s.children.length = 0;
                            let maskObj: any = null;
                            let maskTillId: number = -1;
                            for (let i = childCount - 1; i >= 0; i--) {
                                objId = allChildren[i][0];
                                obj = allChildren[i][1];
                                if (curFrameObj instanceof Object && curFrameObj.c instanceof Object) {
                                    objInfo = curFrameObj.c[objId];
                                } else {
                                    objInfo = null;
                                }
                                if (objInfo instanceof Object) {
                                    //这个对象有可能是新来的，有可能是再次进入帧里的。需要对他进行初始化
                                    annie.d(obj, objInfo, true);
                                    // 检查是否有遮罩
                                    if (objInfo.ma != undefined) {
                                        maskObj = obj;
                                        maskTillId = objInfo.ma;
                                    } else if (maskObj instanceof Object) {
                                        obj.mask = maskObj;
                                        if (objId == maskTillId) {
                                            maskObj = null;
                                        }
                                    }
                                    s.children.unshift(obj);
                                    if (!obj._isOnStage) {
                                        //证明是这一帧新添加进来的，所以需要执行添加事件
                                        addChildren.unshift(obj);
                                    }
                                } else if (obj._isOnStage) {
                                    //这个对象在上一帧存在，这一帧不存在，所以需要执行删除事件
                                    remChildren.unshift(obj);
                                }
                            }
                            if (s._floatFrame > 0) {
                                //帧数带小数点的，所以执行微调
                                s._updateFrameGap();
                            }
                            let count: number = addChildren.length;
                            for (let i = 0; i < count; i++) {
                                obj = addChildren[i];
                                if (!obj._isOnStage && s._isOnStage) {
                                    obj._cp = true;
                                    obj.parent = s;
                                    obj.stage = s.stage;
                                    obj._onAddEvent();
                                }
                            }
                            count = remChildren.length;
                            for (let i = 0; i < count; i++) {
                                obj = remChildren[i];
                                if (obj._isOnStage && s._isOnStage) {
                                    obj._onRemoveEvent(true);
                                    obj.stage = null;
                                    obj.parent = null;
                                }
                            }
                        }
                        //如果发现不是图形动画，则执行脚本
                        if (s._a2x_mode < 0) {
                            //更新完所有后再来确定事件和脚本
                            let isCodeScript = false;
                            //有没有用户后期通过代码调用加入的脚本,有就直接调用然后不再调用时间轴代码
                            if (s._a2x_script instanceof Object) {
                                curFrameScript = s._a2x_script[frameIndex];
                                if (curFrameScript instanceof Function) {
                                    curFrameScript();
                                    isCodeScript = true;
                                }
                            }
                            //有没有用户后期通过代码调用加入的脚本,没有再检查有没有时间轴代码
                            if (!isCodeScript) {
                                curFrameScript = timeLineObj.a[frameIndex];
                                if (curFrameScript instanceof Array) {
                                    s[curFrameScript[0]](curFrameScript[1] == undefined ? true : curFrameScript[1], curFrameScript[2] == undefined ? true : curFrameScript[2]);
                                }
                            }
                            //有没有帧事件
                            curFrameScript = timeLineObj.e[frameIndex];
                            if (curFrameScript instanceof Array) {
                                for (let i = 0; i < curFrameScript.length; i++) {
                                    //抛事件
                                    s.dispatchEvent(Event.CALL_FRAME, {
                                        frameIndex: s._curFrame,
                                        frameName: curFrameScript[i]
                                    });
                                }
                            }
                            //有没有去到帧的最后一帧
                            if (((s._curFrame == 1 && !isFront) || (s._curFrame == s._a2x_res_class.tf && isFront)) && s.hasEventListener(Event.END_FRAME)) {
                                s.dispatchEvent(Event.END_FRAME, {
                                    frameIndex: s._curFrame,
                                    frameName: "endFrame"
                                });
                            }
                        }
                        //有没有声音
                        let curFrameSound = timeLineObj.s[frameIndex];
                        if (curFrameSound instanceof Object) {
                            for (let sound in curFrameSound) {
                                s._a2x_sounds[<any>sound - 1].play(0, curFrameSound[sound]);
                            }
                        }
                    } else if (s._floatFrame > 0) {
                        //帧数带小数点的，所以执行微调
                        s._updateFrameGap();
                    }
                }
            }
        }
        public _onUpdateFrame(mcSpeed: number = 1): void {
            let s = this;
            s._cMcSpeed=s.mcSpeed * mcSpeed;
            s._updateTimeline();
            super._onUpdateFrame(mcSpeed);
        }

        public _onRemoveEvent(isReSetMc: boolean) {
            super._onRemoveEvent(isReSetMc);
            if (isReSetMc) {
                MovieClip._resetMC(this);
            }
        }

        private _updateFrameGap() {
            let s = this;
            s.a2x_uf = true;
            let timeLineObj = s._a2x_res_class;
            //先确定是哪一帧
            let allChildren = s._a2x_res_children;
            let childCount = allChildren.length;
            let objId: number = 0;
            let obj: any = null;
            let nextObjInfo: any = null;
            let curObjInfo: any = null;
            let nextFrameIndex = Math.floor(s._curFrame);
            let curFrameObj: any = s._lastFrameObj;
            let ff = s._floatFrame;
            let nextFrameObj: any = timeLineObj.f[timeLineObj.timeLine[nextFrameIndex]];
            for (let i = childCount - 1; i >= 0; i--) {
                objId = allChildren[i][0];
                obj = allChildren[i][1];
                if (nextFrameObj && nextFrameObj.c && curFrameObj && curFrameObj.c) {
                    nextObjInfo = nextFrameObj.c[objId];
                    curObjInfo = curFrameObj.c[objId];
                    //更新对象信息
                    if (curObjInfo != void 0 && nextObjInfo != void 0) {
                        if (nextObjInfo.tr == void 0 || nextObjInfo.tr.length == 1) {
                            nextObjInfo.tr = [0, 0, 1, 1, 0, 0];
                        }
                        if (nextObjInfo.al == void 0) {
                            nextObjInfo.al = 1;
                        }
                        if (!obj._changeTransformInfo[0]) {
                            obj._x = curObjInfo.tr[0] + (nextObjInfo.tr[0] - curObjInfo.tr[0]) * ff;
                        }
                        if (!obj._changeTransformInfo[1]) {
                            obj._y = curObjInfo.tr[1] + (nextObjInfo.tr[1] - curObjInfo.tr[1]) * ff;
                        }
                        if (!obj._changeTransformInfo[2]) {
                            obj._scaleX = curObjInfo.tr[2] + (nextObjInfo.tr[2] - curObjInfo.tr[2]) * ff;
                        }
                        if (!obj._changeTransformInfo[3]) {
                            obj._scaleY = curObjInfo.tr[3] + (nextObjInfo.tr[3] - curObjInfo.tr[3]) * ff;
                        }
                        if (!obj._changeTransformInfo[4]) {
                            let sx = nextObjInfo.tr[4] - curObjInfo.tr[4];
                            let sy = nextObjInfo.tr[5] - curObjInfo.tr[5];
                            if (sx > 180) {
                                sx -= 360;
                            } else if (sx < -180) {
                                sx += 360;
                            }
                            if (sy > 180) {
                                sy -= 360;
                            } else if (sy < -180) {
                                sy += 360;
                            }
                            obj._skewX = curObjInfo.tr[4] + sx * ff;
                            obj._skewY = curObjInfo.tr[5] + sy * ff;
                        }
                        if (!obj._changeTransformInfo[5]) {
                            obj._alpha = curObjInfo.al + (nextObjInfo.al - curObjInfo.al) * ff;
                            obj.a2x_ua = true;
                        }
                        obj.a2x_um = true;
                    }
                }
            }
            s._floatFrame = 0;
        }

        private static _resetMC(obj: any) {
            //判断obj是否是动画,是的话则还原成动画初始时的状态
            obj._wantFrame = 1;
            obj._curFrame = 0;
            obj._isFront = true;
            obj._floatFrame = 0;
            if (obj._a2x_mode < -1) {
                obj._isPlaying = true;
            } else {
                obj._isPlaying = false;
            }
        }

        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            super.destroy();
            s._lastFrameObj = null;
            s._a2x_script = null;
            s._a2x_res_children = null;
            s._a2x_res_class = null;
            s._a2x_sounds = null;
        }
    }
}
