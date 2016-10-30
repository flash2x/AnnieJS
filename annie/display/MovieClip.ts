/**
 * @module annie
 */
namespace annie {
    class McFrame {
        public frameChildList:Array<any>;
        public keyIndex:number;
        public eventName:string;
        public soundName:string;
        public soundScene:string;
        public soundTimes:number;
        public constructor() {
            var s = this;
            s.frameChildList = new Array();
            s.keyIndex = 0;
            s.eventName = "";
            s.soundName = "";
            s.soundScene = "";
            s.soundTimes = 1;
        }
        public setDisplayInfo(display:DisplayObject, displayBaseInfo:Object=null, displayExtendInfo:Object = null):void {
            var s = this;
            var info:Object = {
                display: display,
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                skewX: 0,
                skewY: 0,
                alpha: 1
            };
            annie.RESManager.d(info, displayBaseInfo, displayExtendInfo);
            s.frameChildList.push(info);
        }
        public setGraphicInfo(loopType:string, firstFrame:number, parentFrameIndex:number):void {
            var s = this;
            var lastIndex = s.frameChildList.length - 1;
            s.frameChildList[lastIndex].graphicInfo = {
                loopType: loopType,
                firstFrame: firstFrame,
                parentFrameIndex: parentFrameIndex
            };
        }
    }
    /**
     * annie引擎核心类
     * @class annie.MovieClip
     * @since 1.0.0
     * @public
     * @extends annie.Sprite
     */
    export class MovieClip extends Sprite {
        /**
         * 时间轴 一般给Flash2x工具使用
         * @property _timeline
         * @private
         * @since 1.0.0
         * @type {Array}
         */
        private _timeline:any=[];

        /**
         * mc的当前帧
         * @property currentFrame
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        public currentFrame:number=1;

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
        public isPlaying:boolean=true;

        /**
         * 动画的播放方向,是顺着播还是在倒着播
         * @property isFront
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         * @readonly
         */
        public isFront:boolean=true;
        /**
         * 当前动画的总帧数
         * @property totalFrames
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 1
         * @readonly
         */
        public totalFrames:number=1;
        private _scriptLayer:any=[];
        private _labelFrame:any={};
        private _frameLabel:any={};
        private _isNeedUpdateChildren:boolean=true;
        private _currentLayer:any;
        private _currentLayerFrame:any;
        private _graphicInfo:any;
        private _isUpdateFrame = false;
        //private _isOnStage:boolean=false;
        public constructor() {
            super();
        }
        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         */
        public stop():void {
            var s = this;
            //s._isNeedUpdateChildren = true;
            s.isPlaying = false;
        }

        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method as
         * @private
         * @since 1.0.0
         * @param {Function} frameScript
         * @param {number} frameIndex
         */
        public as(frameScript:Function, frameIndex:number):void {
            var s = this;
            s._scriptLayer[frameIndex] = frameScript;
        }

        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括从Fla文件中当前帧的代码.
         * @method addFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex {number} 要将代码添加到哪一帧,从0开始.0就是第一帧,1是第二帧...
         * @param {Function}frameScript {Function} 时间轴播放到当前帧时要执行回调方法
         */
        public addFrameScript(frameIndex:number, frameScript:Function):void {
            var s = this;
            s.as(frameScript, frameIndex);
        }

        /**
         * @移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex
         */
        public removeFrameScript(frameIndex:number):void{
            var s = this;
            if(s._scriptLayer[frameIndex]){
                s._scriptLayer[frameIndex]=null;
            }
        }
        //addLayer
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method a
         * @private
         * @since 1.0.0
         * @returns {annie.MovieClip}
         */
        public a():MovieClip {
            var s = this;
            s._currentLayer = [];
            s._timeline.unshift(s._currentLayer);
            return s;
        }

        //addFrame
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method b
         * @private
         * @since 1.0.0
         * @returns {annie.MovieClip}
         * @param {number} count
         */
        public b(count:number):MovieClip {
            var s = this;
            s._currentLayerFrame = new McFrame();
            s._currentLayerFrame.keyIndex = s._currentLayer.length;
            for (var i = 0; i < count; i++) {
                s._currentLayer.push(s._currentLayerFrame);
            }
            if (s.totalFrames < s._currentLayer.length) {
                s.totalFrames = s._currentLayer.length;
            }
            return s;
        }

        //setFrameDisplay
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method c
         * @private
         * @since 1.0.0
         * @param {annie.DisplayObject} display
         * @param {Object} displayBaseInfo
         * @param {Object} displayExtendInfo
         * @returns {annie.MovieClip}
         */
        public c(display:any, displayBaseInfo:any=null, displayExtendInfo:any=null):MovieClip {
            var s = this;
            s._currentLayerFrame.setDisplayInfo(display, displayBaseInfo, displayExtendInfo);
            return s;
        }

        //setGraphic
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method g
         * @private
         * @since 1.0.0
         * @param loopType
         * @param {number} firstFrame
         * @param {number} parentFrameIndex
         * @returns {annie.MovieClip}
         */
        public g(loopType:string, firstFrame:number, parentFrameIndex:number):MovieClip {
            var s = this;
            s._currentLayerFrame.setGraphicInfo(loopType, firstFrame, parentFrameIndex);
            return s;
        }

        /**
         * 当将mc设置为图形动画模式时需要设置的相关信息 Flash2x工具调用的方法,用户一般不需要使用
         * @method setGraphicInfo
         * @public
         * @since 1.0.0
         * @param{Object} graphicInfo
         */
        public setGraphicInfo(graphicInfo:any):void {
            var s = this;
            s._graphicInfo = graphicInfo;
        }

        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码
         * @method initButton
         * @public
         * @since 1.0.0
         */
        public initButton():void {
            var s = this;
            s.mouseChildren=false;
            //将mc设置成按钮形式
            if(s.totalFrames>1) {
                s.gotoAndStop(1);
                s.addEventListener("onMouseDown",this._mouseEvent.bind(this));
                s.addEventListener("onMouseUp",this._mouseEvent.bind(this));
                s.addEventListener("onMouseOut",this._mouseEvent.bind(this));
            }
        }
        private _mouseEvent=function (e:MouseEvent):void {
            if(e.type==annie.MouseEvent.MOUSE_DOWN){
                this.gotoAndStop(2);
            }else{
                this.gotoAndStop(1);
            }
        };
        //setLabelFrame;
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method d
         * @private
         * @since 1.0.0
         * @param {string} name
         * @param {number} index
         * @returns {annie.MovieClip}
         */
         public d(name:string, index:number):MovieClip {
            var s = this;
            s._labelFrame[name] = index + 1;
            s._frameLabel[index + 1] = name;
            return s;
        }

        //getFrameLabel
        /**
         * mc的当前帧的标签名,没有则为空
         * @method getCurrentLabel
         * @public
         * @since 1.0.0
         * @returns {string}
         * */
        public getCurrentLabel():string {
            var s = this;
            return s._frameLabel[s.currentFrame] ? s._frameLabel[s.currentFrame] : "";
        }

        //setFrameEvent
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method e
         * @private
         * @since 1.0.0
         * @param {string} eventName
         * @returns {annie.MovieClip}
         */
         public e(eventName:string):MovieClip {
            var s = this;
            s._currentLayerFrame.eventName = eventName;
            return s;
        }

        //setSoundName
        /**
         * Flash2x工具调用的方法,用户一般不需要使用
         * @method f
         * @private
         * @since 1.0.0
         * @param {string} sceneName
         * @param {string} soundName
         * @param {number} times
         * @returns {annie.MovieClip}
         */
        public f(sceneName:string, soundName:string, times:number):MovieClip {
            var s = this;
            s._currentLayerFrame.soundName = soundName;
            s._currentLayerFrame.soundScene = sceneName;
            s._currentLayerFrame.soundTimes = times;
            return s;
        }

        /**
         * 将播放头向后移一帧并停在下一帧,如果本身在最后一帧则不做任何反应
         * @method nextFrame
         * @since 1.0.0
         * @public
         */
        public nextFrame():void {
            var s = this;
            if (s.currentFrame < s.totalFrames) {
                s.currentFrame++;
                s._isNeedUpdateChildren = true;
            }
            s.isPlaying = false;
            s._isUpdateFrame = false;
        }

        /**
         * 将播放头向前移一帧并停在下一帧,如果本身在第一帧则不做任何反应
         * @method prevFrame
         * @since 1.0.0
         * @public
         */
        public prevFrame():void {
            var s = this;
            if (s.currentFrame > 1) {
                s.currentFrame--;
                s._isNeedUpdateChildren = true;
            }
            s.isPlaying = false;
            s._isUpdateFrame = false;
        }

        /**
         * 将播放头跳转到指定帧并停在那一帧,如果本身在第一帧则不做任何反应
         * @method gotoAndStop
         * @public
         * @since 1.0.0
         * @param {number} frameIndex{number|string} 批定帧的帧数或指定帧的标签名
         */
        public gotoAndStop(frameIndex:number|string):void {
            var s = this;
            s.isPlaying = false;
            var tempFrame:any;
            if (typeof(frameIndex) == "string") {
                if (s._labelFrame[frameIndex] != undefined) {
                    tempFrame = s._labelFrame[frameIndex];
                }else{
                    trace("未找到帧标签叫'"+frameIndex+"'的帧");
                }
            } else if (typeof(frameIndex) == "number") {
                if (frameIndex > s.totalFrames) {
                    frameIndex = s.totalFrames;
                }
                if (frameIndex < 1) {
                    frameIndex = 1;
                }
                tempFrame = frameIndex;
            }
            if (s.currentFrame != tempFrame) {
                s.currentFrame = tempFrame;
                s._isNeedUpdateChildren = true;
                s._isUpdateFrame = false;
            }
        }

        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @public
         * @since 1.0.0
         */
        public play(isFront:boolean=true):void {
            var s = this;
            s.isPlaying = true;
            if (isFront == undefined) {
                s.isFront = true;
            } else {
                s.isFront = isFront;
            }
            s._isUpdateFrame = true;
        }
        /**
         * 将播放头跳转到指定帧并从那一帧开始继续播放
         * @method gotoAndPlay
         * @public
         * @since 1.0.0
         * @param {number} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         */
        public gotoAndPlay(frameIndex:number|string, isFront:boolean=true):void {
            var s = this;
            if (isFront == undefined) {
                s.isFront = true;
            } else {
                s.isFront = isFront;
            }
            s.isPlaying = true;
            var tempFrame:any;
            if (typeof(frameIndex) == "string") {
                if (s._labelFrame[frameIndex] != undefined) {
                    tempFrame = s._labelFrame[frameIndex];
                }else{
                    trace("未找到帧标签叫'"+frameIndex+"'的帧");
                }
            } else if (typeof(frameIndex) == "number") {
                if (frameIndex > s.totalFrames) {
                    frameIndex = s.totalFrames;
                }
                if (frameIndex < 1) {
                    frameIndex = 1;
                }
                tempFrame = frameIndex;
            }
            if (s.currentFrame != tempFrame) {
                s.currentFrame = tempFrame;
                s._isUpdateFrame = false;
                s._isNeedUpdateChildren = true;
            }
        }

        /**
         * 动画播放过程中更改movieClip中的一个child的显示属性，
         * 如果是停止状态，可以直接设置子级显示属性
         * 因为moveClip在播放的过程中是无法更新子级的显示属性的，
         * 比如你要更新子级的坐标，透明度，旋转等等，这些更改都会无效
         * 因为，moveClip自己记录了子级每一帧的这些属性，所有你需要通过
         * 此方法告诉moveClip我要自己控制这些属性
         * @method setFrameChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         * @param {Object} attr
         */
        public setFrameChild(child:any, attr:any):void {
            child._donotUpdateinMC = child._donotUpdateinMC || {};
            for (var i in attr) {
                if(attr[i]!=null) {
                    child._donotUpdateinMC[i] = attr[i];
                }else{
                    delete child._donotUpdateinMC[attr[i]];
                }
            }
        }

        /**
         * 重写刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        public update():void {
            //super.update();
            var s:any = this;
            if (s.pauseUpdate)return;
            if (s._graphicInfo) {
                //核心代码
                //loopType,firstFrame,parentFrameIndex
                var curParentFrameIndex:number = s.parent["currentFrame"] ? s.parent["currentFrame"] : 1;
                var tempCurrentFrame = 1;
                var pStartFrame = s._graphicInfo.parentFrameIndex + 1;
                var cStartFrame = s._graphicInfo.firstFrame + 1;
                if (s._graphicInfo.loopType == "play once") {
                    if (curParentFrameIndex - pStartFrame >= 0) {
                        tempCurrentFrame = curParentFrameIndex - pStartFrame + cStartFrame;
                        if (tempCurrentFrame > s.totalFrames) {
                            tempCurrentFrame = s.totalFrames;
                        }
                    }
                } else if (s._graphicInfo.loopType == "loop") {
                    if (curParentFrameIndex - pStartFrame >= 0) {
                        tempCurrentFrame = (curParentFrameIndex - pStartFrame + cStartFrame) % s.totalFrames;
                    }
                    if (tempCurrentFrame == 0) {
                        tempCurrentFrame = s.totalFrames;
                    }
                } else {
                    tempCurrentFrame = cStartFrame;
                }
                if (s.currentFrame != tempCurrentFrame) {
                    s.currentFrame = tempCurrentFrame;
                    s._isNeedUpdateChildren = true;
                }
                s.isPlaying = false;
            } else {
                if (s.isPlaying && s._isUpdateFrame) {
                    //核心代码
                    if (s.isFront) {
                        s.currentFrame++;
                        if (s.currentFrame > s.totalFrames) {
                            s.currentFrame = 1;
                        }
                    } else {
                        s.currentFrame--;
                        if (s.currentFrame < 1) {
                            s.currentFrame = s.totalFrames;
                        }
                    }
                    s._isNeedUpdateChildren = true;
                }
            }
            s._isUpdateFrame = true;
            if (s._isNeedUpdateChildren) {
                var layerCount = s._timeline.length;
                var frameCount = 0;
                var frame:McFrame = null;
                var displayObject:any = null;
                var infoObject:any = null;
                var frameChildrenCount = 0;
                var lastFrameChildren = s.children;
                var i:number;
                var frameEvents:any = [];
                for (i = 0; i < s.children.length; i++) {
                    lastFrameChildren[i].parent = null;
                }
                s.children = [];
                for (i = 0; i < layerCount; i++) {
                    frameCount = s._timeline[i].length;
                    if (s.currentFrame <= frameCount) {
                        frame = s._timeline[i][s.currentFrame - 1];
                        if (frame == undefined)continue;
                        if (frame.keyIndex == (s.currentFrame - 1)) {
                            if (frame.soundName != "") {
                                annie.RESManager.getMediaByName(frame.soundScene, frame.soundName).play(0, frame.soundTimes);
                            }
                            if (frame.eventName != "" && s.hasEventListener(Event.CALL_FRAME)) {
                                var event = new Event(Event.CALL_FRAME);
                                event.data = {frameIndex: s.currentFrame, frameName: frame.eventName};
                                frameEvents.push(event);
                            }
                        }
                        frameChildrenCount = frame.frameChildList.length;
                        for (var j = 0; j < frameChildrenCount; j++) {
                            infoObject = frame.frameChildList[j];
                            displayObject = infoObject.display;
                            displayObject.x = infoObject.x;
                            displayObject.y = infoObject.y;
                            displayObject.scaleX = infoObject.scaleX;
                            displayObject.scaleY = infoObject.scaleY;
                            displayObject.rotation = infoObject.rotation;
                            displayObject.skewX = infoObject.skewX;
                            displayObject.skewY = infoObject.skewY;
                            displayObject.alpha = infoObject.alpha;
                            if (infoObject.filters) {
                                displayObject.filters = infoObject.filters;
                            } else {
                                displayObject.filters = null;
                            }
                            if (infoObject.graphicInfo) {
                                displayObject["_graphicInfo"] = infoObject.graphicInfo;
                            } else {
                                if (displayObject["_graphicInfo"]) {
                                    displayObject["_graphicInfo"] = null;
                                }
                            }
                            if (displayObject["_donotUpdateinMC"] != undefined) {
                                for (var o in displayObject["_donotUpdateinMC"]) {
                                    if (displayObject["_donotUpdateinMC"][o] != undefined) {
                                        displayObject[o] = displayObject["_donotUpdateinMC"][o];
                                    }
                                }
                            }
                            displayObject.parent = s;
                            s.children.push(displayObject);
                            if (lastFrameChildren.indexOf(displayObject) < 0) {
                                displayObject._onDispatchBubbledEvent("onAddToStage");
                            }
                        }
                    }
                }
                s._isNeedUpdateChildren = false;
                //update一定要放在事件处理之前
                var len = lastFrameChildren.length;
                for (i = 0; i < len; i++) {
                    if (!lastFrameChildren[i].parent){
                        lastFrameChildren[i].parent=s;
                        lastFrameChildren[i]._onDispatchBubbledEvent("onRemoveToStage");
                        lastFrameChildren[i].parent=null;
                    }
                }
                super.update();
                //看看是否到了第一帧，或是最后一帧,如果是准备事件
                if ((s.currentFrame == 1 && !s.isFront) || (s.currentFrame == s.totalFrames && s.isFront)) {
                    if (s.hasEventListener(Event.END_FRAME)) {
                        var event = new Event(Event.END_FRAME);
                        event.data = {
                            frameIndex: s.currentFrame,
                            frameName: s.currentFrame == 1 ? "firstFrame" : "endFrame"
                        };
                        frameEvents.push(event);
                    }
                }
                //看看是否有帧事件,有则派发
                var len = frameEvents.length;
                for (i = 0; i < len; i++) {
                    s.dispatchEvent(frameEvents[i]);
                }
                //看看是否有回调,有则调用
                if (s._scriptLayer[s.currentFrame - 1] != undefined) {
                    s._scriptLayer[s.currentFrame - 1]();
                }
            } else {
                super.update();
            }
        }
        /**
         * 触发显示列表上相关的事件
         * @method _onDispatchBubbledEvent
         * @param {string} type
         * @private
         */
        public _onDispatchBubbledEvent(type:string):void {
            super._onDispatchBubbledEvent(type);
            if (type == "onRemoveToStage") {
                var s = this;
                s.currentFrame = 1;
                s.isPlaying = true;
                s.isFront = true;
                s._isNeedUpdateChildren = true;
                s._isUpdateFrame = false;
            }
        }
    }
}