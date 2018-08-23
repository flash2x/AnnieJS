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
            return this._curFrame;
        }

        private _curFrame: number = 1;
        private _wantFrame: number = 0;
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

        private _lastFrame: number = 0;

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
            s._isPlaying = false;
        }

        private _a2x_script: any = null;

        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括Fla文件中当前帧的代码.
         * @method addFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex {number} 要将代码添加到哪一帧,从0开始.0就是第一帧,1是第二帧...
         * @param {Function}frameScript {Function} 时间轴播放到当前帧时要执行回调方法
         */
        public addFrameScript(frameIndex: number, frameScript: Function): void {
            let s = this;
            if (s._a2x_script == undefined)
                s._a2x_script = {};
            s._a2x_script[frameIndex] = frameScript;
        }

        /**
         * 移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex
         */
        public removeFrameScript(frameIndex: number): void {
            let s = this;
            if (s._a2x_script != undefined)
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
            return this._mode == -1;
        }

        //动画模式 按钮 剪辑 图形
        private _mode: number = -2;

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
            if (s._mode != -1 && s._a2x_res_class.tf > 1) {
                s.mouseChildren = false;
                //将mc设置成按钮形式
                s.addEventListener("onMouseDown", s._mouseEvent.bind(s));
                s.addEventListener("onMouseUp", s._mouseEvent.bind(s));
                s.addEventListener("onMouseOut", s._mouseEvent.bind(s));
                s.gotoAndStop(1);
                s._mode = -1;
            }
        }

        public set clicked(value: boolean) {
            let s = this;
            if (value != s._clicked) {
                if (value) {
                    s._mouseEvent({type: "onMouseDown"});
                }else{
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
                    if (s._curFrame > 2) {
                        frame = 3;
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
            if (s._curFrame < s.totalFrames) {
                s._wantFrame = s._curFrame + 1;
            }
            s._isPlaying = false;
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
            if (s._curFrame > 1) {
                s._wantFrame = s._curFrame - 1;
            }
            s._isPlaying = false;
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
            s._isPlaying = false;
            let timeLineObj = s._a2x_res_class;
            if (typeof(frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                } else {
                    frameIndex = s._curFrame;
                }
            } else if (typeof(frameIndex) == "number") {
                if (frameIndex > timeLineObj.tf) {
                    frameIndex = timeLineObj.tf;
                }
                if (frameIndex < 1) {
                    frameIndex = 1;
                }
            }
            s._wantFrame = <number>frameIndex;
        }

        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @public
         * @since 1.0.0
         * @return {void}
         */
        public play(isFront: boolean = true): void {
            let s = this;
            s._isPlaying = true;
            s._isFront = isFront;
            let wf=s._curFrame;
            if(s._isFront){
                wf++;
            }else{
                wf--;
            }
            if(wf>s.totalFrames){
                wf=1;
            }else if(wf<1){
                wf=s.totalFrames;
            }
            s._wantFrame=wf;
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
            s._isFront = isFront;
            s._isPlaying = true;
            let timeLineObj = s._a2x_res_class;
            if (typeof(frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                } else {
                    frameIndex = s._curFrame;
                }
            } else if (typeof(frameIndex) == "number") {
                if (frameIndex > timeLineObj.tf) {
                    frameIndex = timeLineObj.tf;
                }
                if (frameIndex < 1) {
                    frameIndex = 1;
                }
            }
            s._wantFrame = <number>frameIndex;
        }

        private isUpdateFrame: boolean = false;

        public update(isDrawUpdate: boolean = true): void {
            let s: any = this;
            if (s._visible && isDrawUpdate && s._a2x_res_class.tf > 1){
                if (s._mode >= 0) {
                    s._isPlaying = false;
                    s._curFrame = s.parent._curFrame - s._mode;
                } else {
                    if (s._wantFrame != 0) {
                        s._curFrame = s._wantFrame;
                        s._wantFrame = 0;
                    }
                }
                if (s._lastFrame == s._curFrame && s._isPlaying) {
                    if (s._isFront) {
                        s._curFrame++;
                        if (s._curFrame > s._a2x_res_class.tf) {
                            s._curFrame = 1;
                        }
                    } else {
                        s._curFrame--;
                        if (s._curFrame < 1) {
                            s._curFrame = s._a2x_res_class.tf;
                        }
                    }
                }
                if (s._lastFrame != s._curFrame) {
                    if (s._mode < 0) s.isUpdateFrame = true;
                    s._lastFrame = s._curFrame;
                    let timeLineObj = s._a2x_res_class;
                    //先确定是哪一帧
                    let allChildren = s._a2x_res_children;
                    let childCount = allChildren.length;
                    let objId = 0;
                    let obj: any = null;
                    let objInfo: any = null;
                    let curFrameObj: any = timeLineObj.f[timeLineObj.timeLine[s._curFrame - 1]];
                    if (s._lastFrameObj != curFrameObj) {
                        s._lastFrameObj = curFrameObj;
                        s.children.length = 0;
                        s._removeChildren.length = 0;
                        let maskObj: any = null;
                        let maskTillId: number = -1;
                        for (let i = childCount - 1; i >= 0; i--) {
                            objId = allChildren[i][0];
                            obj = allChildren[i][1];
                            if (curFrameObj && curFrameObj.c) {
                                objInfo = curFrameObj.c[objId];
                            } else {
                                objInfo = null;
                            }
                            //证明这一帧有这个对象
                            if (objInfo) {
                                annie.d(obj, objInfo);
                            }
                            if (objInfo || objId == 0) {
                                //如果之前没有在显示对象列表,则添加进来
                                // 检查是否有遮罩
                                if (objInfo.ma != undefined) {
                                    maskObj = obj;
                                    maskTillId = objInfo.ma;
                                } else {
                                    if (maskObj) {
                                        obj.mask = maskObj;
                                        if (objId == maskTillId) {
                                            maskObj = null;
                                        }
                                    }
                                }
                                s.children.unshift(obj);
                                if (!obj.parent || s.parent != s) {
                                    obj["_cp"] = true;
                                    obj.parent = s;
                                }
                            } else {
                                //这一帧没这个对象,如果之前在则删除
                                if (obj.parent) {
                                    s._removeChildren.push(obj);
                                    MovieClip._resetMC(obj);
                                }
                            }
                        }
                    }
                }
            }
            super.update(isDrawUpdate);
        }
        //flash声音管理
        private _a2x_sounds: any = null;
        protected callEventAndFrameScript(callState: number): void {
            let s: any = this;
            if (s.isUpdateFrame) {
                let timeLineObj = s._a2x_res_class;
                s.isUpdateFrame = false;
                let frameIndex = s._curFrame - 1;
                //更新完所有后再来确定事件和脚本
                let curFrameScript: any;
                //有没有脚本，是否用户有动态添加，如果有则覆盖原有的，并且就算用户删除了这个动态脚本，原有时间轴上的脚本一样不再执行
                let isUserScript = false;
                //因为脚本有可能改变Front，所以提前存起来
                let isFront=s._isFront;
                if (s._a2x_script) {
                    curFrameScript = s._a2x_script[frameIndex];
                    if (curFrameScript != undefined) {
                        if (curFrameScript != null)
                            curFrameScript();
                        isUserScript = true;
                    }
                }
                if (!isUserScript) {
                    curFrameScript = timeLineObj.a[frameIndex];
                    if (curFrameScript) {
                        s[curFrameScript[0]](curFrameScript[1] == undefined ? true : curFrameScript[1], curFrameScript[2] == undefined ? true : curFrameScript[2]);
                    }
                }
                //有没有事件
                if (s.hasEventListener(Event.CALL_FRAME)) {
                    curFrameScript = timeLineObj.e[frameIndex];
                    if (curFrameScript) {
                        for (let i = 0; i < curFrameScript.length; i++) {
                            //抛事件
                            s.dispatchEvent(Event.CALL_FRAME, {
                                frameIndex: s._curFrame,
                                frameName: curFrameScript[i]
                            });
                        }
                    }
                }
                if (((s._curFrame == 1 && !isFront) || (s._curFrame == s._a2x_res_class.tf && isFront)) && s.hasEventListener(Event.END_FRAME)) {
                    s.dispatchEvent(Event.END_FRAME, {
                        frameIndex: s._curFrame,
                        frameName: "endFrame"
                    });
                }
                //有没有声音
                let curFrameSound = timeLineObj.s[frameIndex];
                if (curFrameSound) {
                    for (let sound in curFrameSound) {
                        s._a2x_sounds[<any>sound - 1].play(0, curFrameSound[sound]);
                    }
                }
            }
            super.callEventAndFrameScript(callState);
        }

        private static _resetMC(obj: any) {
            //判断obj是否是动画,是的话则还原成动画初始时的状态
            let isNeedToReset = false;
            if (obj._instanceType == "annie.MovieClip") {
                obj._wantFrame = 1;
                obj._lastFrame = 0;
                obj._isFront = true;
                if (obj._mode < -1) {
                    obj._isPlaying = true;
                } else {
                    obj._isPlaying = false;
                }
                isNeedToReset = true;
            }else if(obj._instanceType=="annie.Sprite") {
                isNeedToReset=true;
            }
            if (isNeedToReset) {
                for (let i = 0; i < obj.children.length; i++) {
                    MovieClip._resetMC(obj.children[i]);
                }
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