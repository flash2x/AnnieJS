/**
 * @module annie
 */
namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.CanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    export class CanvasRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public rootContainer:any=null;
        private _ctx:any;
        private _stage:Stage;
        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor(stage:Stage){
            super();
            this._stage=stage;
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin():void{
            var s=this;
            var c=s.rootContainer;
            s._ctx.save();
            s._ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (s._stage.bgColor != "") {
                s._ctx.fillStyle = s._stage.bgColor;
                s._ctx.fillRect(0, 0, c.width + 1, c.height + 1);
            }else{
                s._ctx.clearRect(0, 0, c.width + 1, c.height + 1);
            }
            s._ctx.restore();
        }
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        public beginMask(target:any):void{
            var s:CanvasRender=this;
            var isHadPath = false;
            if(target.children&&target.children.length>0){
                target=target.children[0];
            }
            if(target._command){
                s._ctx.save();
                s._ctx.globalAlpha=0;
                var tm=target.cMatrix;
                s._ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
                var data:any;
                var cLen:number = target._command.length;
                for (var i = 0; i < cLen; i++) {
                    data = target._command[i];
                    if (data[0] == 1) {
                        isHadPath = true;
                        var paramsLen = data[2].length;
                        if (paramsLen == 0) {
                            s._ctx[data[1]]();
                        } else if (paramsLen == 2) {
                            s._ctx[data[1]](data[2][0], data[2][1]);
                        } else if (paramsLen == 4) {
                            s._ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3]);
                        }else if(paramsLen==5){
                            s._ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], data[2][4]);
                        }else if(paramsLen==6){
                            s._ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], data[2][4], data[2][5]);
                        }
                    }
                    /*else {
                     //这里因为是作为遮罩,所以不需要任何填充或线条
                     s._ctx[data[1]] = data[2];
                     }*/
                }
                s._ctx.restore();
            }
            //和后面endMask的restore对应
            s._ctx.save();
            if(isHadPath) {
                s._ctx.clip();
            }
        }
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask():void{
            this._ctx.restore();
        }
        /**
         *  调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         * @param {number} type 0图片 1矢量 2文字 3容器
         */
        public draw(target:any, type:number):void {
            var s = this;
            s._ctx.save();
            s._ctx.globalAlpha = target.cAlpha;
            var tm=target.cMatrix;
            s._ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (type == 0) {
                //图片
                if(target._cacheImg){
                    var tr = target.rect;
                    //因为如果有滤镜的话是重新画了图的,所以尺寸什么的跟SpriteSheet无关了
                    if (tr&&!target._isCache){
                        s._ctx.drawImage(target._cacheImg, tr.x, tr.y, tr.width, tr.height, 0, 0, tr.width, tr.height);
                    } else {
                        s._ctx.translate(target._cacheX,target._cacheY);
                        s._ctx.drawImage(target._cacheImg, 0, 0);
                    }
                }
            } else{
                //矢量和文字
                if(target._cacheImg){
                    //需要渲染缓存
                    s._ctx.translate(target._cacheX,target._cacheY);
                    s._ctx.drawImage(target._cacheImg, 0, 0);
                }
            }
            s._ctx.restore();
        }

        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init():void {
            var s = this;
            if(!s.rootContainer) {
                s.rootContainer = document.createElement("canvas");
                s._stage.rootDiv.appendChild(s.rootContainer);
            }
            var c=s.rootContainer;
            s._ctx = c["getContext"]('2d');
        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize():void{
            var s=this;
            var c=s.rootContainer;
            c.width = s._stage.divWidth *devicePixelRatio;
            c.height = s._stage.divHeight *devicePixelRatio;
            c.style.width = s._stage.divWidth + "px";
            c.style.height = s._stage.divHeight + "px";
        }
    }
}