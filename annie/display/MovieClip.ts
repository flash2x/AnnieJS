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

        private _curFrame: number = 1;
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

        public constructor() {
            super();
            let s: any = this;
            s._instanceType = "annie.MovieClip";
        }

        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         */
        public stop(): void {
            let s = this;
            s._isPlaying = false;
        }

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
         * @移除帧上的回调方法
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

        public get isButton(): boolean {
            return this._mode==-1;
        }

        private _mode: number = -2;

        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码.
         * 此方法不可逆，设置后不再能设置回剪辑，一定要这么做的话，请联系作者，看作者答不答应
         * @method initButton
         * @public
         * @since 1.0.0
         */
        public initButton(): void {
            let s: any = this;
            if (s._mode !=-1&& s._a2x_res_class.tf > 1) {
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
                }
                s._clicked = value;
            }
        }

        public get clicked(): boolean {
            return this._clicked;
        }

        private _clicked = false;
        private _mouseEvent = function (e: any): void {
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
        private _maskList: any = [];
        /**
         * movieClip的当前帧的标签数组,没有则为null
         * @method getCurrentLabel
         * @public
         * @since 1.0.0
         * @return {Array}
         * */
        public getCurrentLabel(): any {
            let s:any=this;
            if(s._a2x_res_class.tf>1&&s._a2x_res_class.l[s._curFrame-1]){
                return s._a2x_res_class.l[s._curFrame-1];
            }
            return null;
        }
        /**
         * 将播放头向后移一帧并停在下一帧,如果本身在最后一帧则不做任何反应
         * @method nextFrame
         * @since 1.0.0
         * @public
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
         * @param {number} frameIndex{number|string} 批定帧的帧数或指定帧的标签名
         */
        public gotoAndStop(frameIndex: number | string): void {
            let s: any = this;
            s._isPlaying = false;
            let timeLineObj = s._a2x_res_class;
            if (typeof(frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                }else{
                    frameIndex=s._curFrame;
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
         * @param {number} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         */
        public gotoAndPlay(frameIndex: number | string, isFront: boolean = true): void {
            let s: any = this;
            s._isFront = isFront;
            s._isPlaying = true;
            let timeLineObj = s._a2x_res_class;
            if (typeof(frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                }else{
                    frameIndex=s._curFrame;
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
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        public update(isDrawUpdate: boolean = true): void{
            let s: any = this;
            if (isDrawUpdate && s._a2x_res_class.tf > 1) {
                let isNeedUpdate = false;
                if(s._mode>=0){
                    s._isPlaying=false;
                    s._curFrame = s.parent._curFrame-s._mode;
                }
                if (s._lastFrame != s._curFrame){
                    isNeedUpdate = true;
                    s._lastFrame = s._curFrame;
                } else {
                    if (s._isPlaying) {
                        isNeedUpdate = true;
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
                        s._lastFrame = s._curFrame;
                    }
                }
                if (isNeedUpdate) {
                    //先确定是哪一帧
                    let allChildren = s._a2x_res_children;
                    let timeLineObj = s._a2x_res_class;
                    let curFrameObj: any = null;
                    let lastFrameObj = s._lastFrameObj;
                    if (timeLineObj.timeLine[s._curFrame - 1] >= 0) {
                        curFrameObj = timeLineObj.f[timeLineObj.timeLine[s._curFrame - 1]];
                    } else {
                        curFrameObj = {};
                    }
                    if (lastFrameObj != curFrameObj) {
                        //更新元素
                        let lastFrameChildrenObjectIdObj: any = null;
                        if (lastFrameObj && lastFrameObj.c) {
                            //获取上一次动画所在的帧数据
                            lastFrameChildrenObjectIdObj = lastFrameObj.c;
                        } else {
                            lastFrameChildrenObjectIdObj = {};
                        }
                        //获取当前动画所在的帧数据
                        let curFrameChildrenObjectIdObj: any = null;
                        if (curFrameObj.c) {
                            curFrameChildrenObjectIdObj = curFrameObj.c;
                        } else {
                            curFrameChildrenObjectIdObj = {};
                        }
                        //上一帧有，这一帧没有的，要执行移除事件
                        for (let item in lastFrameChildrenObjectIdObj) {
                            if (curFrameChildrenObjectIdObj[item] == undefined) {
                                //remove
                                s.removeChild(allChildren[lastFrameChildrenObjectIdObj[item].o - 1]);
                            }
                        }
                        //这一帧有，上一帧没有，要执行添加到舞台
                        for (let item in curFrameChildrenObjectIdObj) {
                            if (lastFrameChildrenObjectIdObj[item] == undefined) {
                                //add
                                if (curFrameChildrenObjectIdObj[item].at == undefined) {
                                    s.addChildAt(allChildren[curFrameChildrenObjectIdObj[item].o - 1], 0);
                                } else if (curFrameChildrenObjectIdObj[item].at == 0) {
                                    s.addChild(allChildren[curFrameChildrenObjectIdObj[item].o - 1]);
                                } else {
                                    let isFind:boolean=false;
                                    for (let i = 0; i < s.children.length; i++) {
                                        if (s.children[i] == allChildren[curFrameChildrenObjectIdObj[item].at - 1]) {
                                            s.addChildAt(allChildren[curFrameChildrenObjectIdObj[item].o - 1], i);
                                            isFind=true;
                                            break;
                                        }
                                    }
                                    if(!isFind){
                                        //倒播的时候，有些本来先出现的元素变成了后出现，这样的话在children列表里根本找不到是在谁的上面
                                        //所以如果找不到的话就直接添加到最上层
                                        s.addChild(allChildren[curFrameChildrenObjectIdObj[item].o - 1]);
                                    }
                                }
                            }
                        }
                        //更新child属性
                        s._maskList.length = 0;
                        let maskList = s._maskList;
                        if (curFrameObj.c) {
                            for (let i in curFrameObj.c) {
                                annie.d(allChildren[curFrameObj.c[i].o - 1], curFrameObj.c[i]);
                                //检查是否有遮罩
                                if (curFrameObj.c[i].ma != undefined) {
                                    if (curFrameObj.c[i].ma != curFrameObj.c[i].o) {
                                        maskList.push(allChildren[curFrameObj.c[i].ma - 1], allChildren[curFrameObj.c[i].o - 1]);
                                    }
                                    allChildren[curFrameObj.c[i].o - 1]._isUseToMask = true;
                                }
                            }
                        }
                        //如果有遮罩则更新遮罩
                        if (maskList.length > 0) {
                            let isFindMask: boolean = false;
                            for (let i = 0; i < s.children.length; i++) {
                                if (s.children[i] == maskList[0]) {
                                    //找到最下面的mask对象
                                    isFindMask = true;
                                } else if (s.children[i] == maskList[1]) {
                                    //结束mask，并寻找下一个mask
                                    isFindMask = false;
                                    //同时删除maskList前两位元素
                                    maskList.splice(0, 2);
                                    //判断是否还有遮罩，有就继续，没有就退出循环
                                    if (maskList.length == 0) {
                                        break;
                                    }
                                }
                                if (isFindMask) {
                                    s.children[i].mask = maskList[1];
                                }
                            }
                        }
                    }
                    s._lastFrameObj = curFrameObj;
                    //有没有声音
                    let index = s._curFrame - 1;
                    let curFrameOther = timeLineObj.s[index];
                    if (curFrameOther) {
                        for (let sound in curFrameOther) {
                            allChildren[<any>sound - 1]._repeatCount = curFrameOther[sound];
                            allChildren[<any>sound - 1].play();
                        }
                    }
                    //有没有脚本，是否用户有动态添加，如果有则覆盖原有的，并且就算用户删除了这个动态脚本，原有时间轴上的脚本一样不再执行
                    let isUserScript = false;
                    if (s._a2x_script) {
                        curFrameOther = s._a2x_script[index];
                        if (curFrameOther != undefined) {
                            if (curFrameOther != null)
                                curFrameOther();
                            isUserScript = true;
                        }
                    }
                    if (!isUserScript) {
                        curFrameOther = timeLineObj.a[index];
                        if (curFrameOther) {
                            s[curFrameOther[0]](curFrameOther[1]==undefined?true:curFrameOther[1],curFrameOther[2]==undefined?true:curFrameOther[2]);
                        }
                    }
                    //有没有事件
                    if (s.hasEventListener(Event.CALL_FRAME)) {
                        curFrameOther = timeLineObj.e[index];
                        if (curFrameOther) {
                            for (let i = 0; i < curFrameOther.length; i++) {
                                //抛事件
                                s.dispatchEvent(Event.CALL_FRAME, {
                                    frameIndex: s._curFrame,
                                    frameName: curFrameOther[i]
                                });
                            }
                        }
                    }
                    if (((s._curFrame == 1 && !s._isFront) || (s._curFrame == s._a2x_res_class.tf&&s._isFront)) && s.hasEventListener(Event.END_FRAME)) {
                        s.dispatchEvent(Event.END_FRAME, {
                            frameIndex: s._curFrame,
                            frameName: "endFrame"
                        });
                    }
                }
            }
            super.update(isDrawUpdate);
        }

        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
        public destroy(): void {
            //清除相应的数据引用
            let s = this;
            s._lastFrameObj = null;
            s._a2x_script = null;
            s._maskList = null;
            super.destroy();
        }
    }
}