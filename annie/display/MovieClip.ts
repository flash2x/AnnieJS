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

        /**
         * @property _curFrame
         * @type {number}
         * @private
         * @since 2.0.0
         * @default 1
         */
        private _curFrame: number = 1;
        /**
         * @property _lastFrameObj
         * @type {Object}
         * @private
         * @default null
         */
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

        /**
         * @property _isPlaying
         * @type {boolean}
         * @private
         * @since 2.0.0
         * @default true
         */
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

        /**
         * @property _isFront
         * @type {boolean}
         * @private
         * @default true
         */
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

        /**
         * @property _lastFrame
         * @type {number}
         * @private
         * @default 0
         */
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

        /**
         * sprite 和 moveClip的类资源信息
         * @property _a2x_res_class
         * @type {Object}
         * @since 2.0.0
         * @private
         */
        private _a2x_res_class: any = {tf: 1};
        /**
         * @property _a2x_res_children
         * @type {Array}
         * @private
         * @since 2.0.0
         */
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

        /**
         * @property _a2x_script
         * @type {Object}
         * @default null
         * @private
         * @since 2.0.0
         */
        private _a2x_script: any = null;

        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括从Fla文件中当前帧的代码.
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

        /**
         * @property _mode
         * @type {boolean}
         * @private
         * @default false
         */
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

        /**
         * 设置是否为点击状态
         * @property clicked
         * @param {boolean} value
         * @public
         * @since 2.0.0
         * @default false
         */
        public set clicked(value: boolean) {
            let s = this;
            if (value != s._clicked) {
                if (value) {
                    s._mouseEvent({type: "onMouseDown"});
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
         * @property _maskList
         * @type {Array}
         * @private
         * @default []
         */
        private _maskList: any = [];

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
                s._curFrame++;
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
                s._curFrame--;
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
            s._curFrame = <number>frameIndex;
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
            s._curFrame = <number>frameIndex;
        }
        private _isNeedToCallEvent=false;
        public update(isDrawUpdate: boolean = true): void {
            let s: any = this;
            if (!s._visible) return;
            if (isDrawUpdate && s._a2x_res_class.tf > 1) {
                if (s._mode >= 0) {
                    s._isPlaying = false;
                    s._curFrame = s.parent._curFrame - s._mode;
                }
                if (s._isPlaying) {
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
                if(s._lastFrame != s._curFrame){
                    s._isNeedToCallEvent=true;
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
                        s._removeChildren.length=0;
                        let maskObj: any = null;
                        let maskTillId: number = -1;
                        for (let i = childCount - 1; i >= 0; i--) {
                            objId = allChildren[i][0];
                            obj = allChildren[i][1];
                            objInfo = curFrameObj.c[objId];
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
                                }
                            }
                        }
                    }
                    //有没有声音
                    let frameIndex = s._curFrame - 1;
                    let curFrameSound = timeLineObj.s[frameIndex];
                    if (curFrameSound) {
                        for (let sound in curFrameSound) {
                            s._a2x_sounds[<any>sound - 1].play(0, curFrameSound[sound]);
                        }
                    }
                }else{
                    s._isNeedToCallEvent=false;
                }
            }
            super.update(isDrawUpdate);
        }
        /**
         * @property _a2x_sounds
         * @since 2.0.0
         * @type {Object}
         * @private
         * @default {null}
         */
        private _a2x_sounds: any = null;
        protected callEventAndFrameScript(callState: number):void{
            let s:any=this;
            if( s._isNeedToCallEvent){
                s._isNeedToCallEvent=false;
                let timeLineObj = s._a2x_res_class;
                let frameIndex = s._lastFrame - 1;
                //更新完所有后再来确定事件和脚本
                let curFrameScript: any;
                //有没有脚本，是否用户有动态添加，如果有则覆盖原有的，并且就算用户删除了这个动态脚本，原有时间轴上的脚本一样不再执行
                let isUserScript = false;
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
                if (((s._curFrame == 1 && !s._isFront) || (s._curFrame == s._a2x_res_class.tf && s._isFront)) && s.hasEventListener(Event.END_FRAME)) {
                    s.dispatchEvent(Event.END_FRAME, {
                        frameIndex: s._curFrame,
                        frameName: "endFrame"
                    });
                }
            }
            super.callEventAndFrameScript(callState);
        }
        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            s._lastFrameObj = null;
            s._a2x_script = null;
            s._maskList = null;
            s._a2x_res_children = null;
            s._a2x_res_class = null;
            s._a2x_sounds = null;
            super.destroy();
        }
    }
}