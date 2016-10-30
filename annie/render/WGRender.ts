/**
 * @module annie
 */
namespace annie {
    /**
     * WebGl 渲染器
     * @class annie.WGRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.2
     */
    export class WGRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.2
         * @type {any}
         * @default null
         */
        public rootContainer: any = null;
        private _gl: any;
        private _stage: Stage;
        private _program: any;
        private _buffer: any;
        private _dW: number;
        private _dH: number;
        private _pMatrix: any;
        private _pMI: number;
        private _vMI: number;
        private _uA: number;
        private _uMask: number;
        private _cM: annie.Matrix;
        private _maxTextureCount: number = 32;
        private _uniformTexture: number = 0;
        private _uniformMaskTexture: number = 0;
        private _posAttr: number = 0;
        private _textAttr: number = 0;
        private _maskFbo: any;
        private _maskObjList: any = [];
        private _maskTexture: any = null;
        private _maskSrcTexture: any = null;
        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.2
         */
        public constructor(stage: Stage) {
            super();
            this._stage = stage;
        }
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.2
         * @public
         */
        public begin(): void {
            var s = this;
            var gl = s._gl;
            if (s._stage.bgColor != "") {
                var color = s._stage.bgColor;
                var r = parseInt("0x" + color.substr(1, 2));
                var g = parseInt("0x" + color.substr(3, 2));
                var b = parseInt("0x" + color.substr(5, 2));
                gl.clearColor(r / 255, g / 255, b / 255, 1.0);
            } else {
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
            s._maskObjList = [];
        }
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.2
         */
        public beginMask(target: any): void {
            //更新缓冲模板
            var s = this;
            var gl = s._gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, s._maskFbo);
            gl.viewport(0,0,1024,1024);
            gl.disable(gl.BLEND);
            if (s._maskObjList.length == 0) {
                gl.clearColor(0.0, 1.0, 1.0, 0.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.bindTexture(gl.TEXTURE_2D, s._maskTexture);
                gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1024, 1024, 0);
            }
            //告诉shader这个时候是画遮罩本身的帧缓冲
            gl.uniform1i(s._uMask, 1000);
            s.draw(target, 1);
            gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1024, 1024, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            s._maskObjList.push(target);
            gl.uniform1i(s._uMask, s._maskObjList.length);
            gl.viewport(0,0,s._dW,s._dH);
            gl.enable(gl.BLEND);

        }
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.2
         */
        public endMask(): void {
            var s = this;
            var len = s._maskObjList.length;
            var gl = s._gl;
            if (len > 0) {
                //更新缓冲模板
                gl.disable(gl.BLEND);
                gl.viewport(0,0,1024,1024);
                gl.bindFramebuffer(gl.FRAMEBUFFER, s._maskFbo);
                gl.uniform1i(s._uMask, -1000);
                s.draw(s._maskObjList[len - 1], 1);
                gl.bindTexture(gl.TEXTURE_2D, s._maskTexture);
                gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1024, 1024, 0);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                s._maskObjList.pop();
                gl.viewport(0,0,s._dW,s._dH);
                gl.enable(gl.BLEND);

            }
            gl.uniform1i(s._uMask, s._maskObjList.length);

        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.2
         * @method reSize
         */
        public reSize(): void {
            var s = this;
            var c = s.rootContainer;
            c.width = s._stage.divWidth * devicePixelRatio;
            c.height = s._stage.divHeight * devicePixelRatio;
            c.style.width = s._stage.divWidth + "px";
            c.style.height = s._stage.divHeight + "px";
            s._gl.viewport(0, 0, c.width, c.height);
            s._dW = c.width;
            s._dH = c.height;
            s._pMatrix = new Float32Array(
                [
                    1 / s._dW * 2, 0.0, 0.0,
                    0.0, -1 / s._dH * 2, 0.0,
                    -1.0, 1.0, 1.0
                ]
            );
        }
        private _getShader(id: number) {
            var s = this;
            var gl = s._gl;
            // Find the shader script element
            var shaderText = "";
            // Create the shader object instance
            var shader: any = null;
            if (id == 0) {
                 shaderText = 'precision highp float;' +
                    'varying vec2 v_TC;' +
                    'varying vec2 v_MP;' +
                    'uniform sampler2D u_texture;' +
                    'uniform sampler2D u_maskTexture;' +
                    'uniform float u_A;' +
                    'uniform int u_Mask;' +
                    'void main() {' +
                        'if(u_Mask==0){' +
                            'gl_FragColor = texture2D(u_texture, v_TC)*u_A;' +
                        '}else if(u_Mask==1000){' +
                             'vec4 textColor = texture2D(u_texture, v_TC);' +
                             'gl_FragColor = texture2D(u_maskTexture, v_MP);' +
                             'if(textColor.a==1.0){gl_FragColor.r+=0.05;gl_FragColor.a=1.0;}' +
                        '}else if(u_Mask==-1000){' +
                             'vec4 textColor = texture2D(u_texture, v_TC);' +
                             'gl_FragColor = texture2D(u_maskTexture, v_MP);' +
                             'if(textColor.a==1.0){gl_FragColor.r-=0.05;if(gl_FragColor.r==0.0){gl_FragColor.a=0.0;}}' +
                        '}else{' +
                            'vec4 textColor=texture2D(u_maskTexture, v_MP);' +
                            'float maskStep=0.0;' +
                            'if(int(textColor.r*20.0)==u_Mask){' +
                                'maskStep=textColor.a;'+
                             '}' +
                            'gl_FragColor = texture2D(u_texture, v_TC)*u_A*maskStep;' +
                        '}' +
                    '}';
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            }
            else {
                shaderText = 'precision highp float;' +
                    'attribute vec2 a_P;' +
                    'attribute vec2 a_TC;' +
                    'varying vec2 v_TC;' +
                    'varying vec2 v_MP;' +
                    'uniform mat3 vMatrix;' +
                    'uniform mat3 pMatrix;' +
                    'void main() {' +
                    'gl_Position =vec4((pMatrix*vMatrix*vec3(a_P, 1.0)).xy, 1.0, 1.0);' +
                    'v_MP=(gl_Position.xy+vec2(1.0,1.0))*0.5;' +
                    'v_TC = a_TC;' +
                    '}';
                shader = gl.createShader(gl.VERTEX_SHADER);
            }
            // Set the shader source code in the shader object instance and compile the shader
            gl.shaderSource(shader, shaderText);
            gl.compileShader(shader);
            // Attach the shaders to the shader program
            gl.attachShader(s._program, shader);
            return shader;
        }
        /**
         * 初始化渲染器
         * @public
         * @since 1.0.2
         * @method init
         */
        public init(): void {
            var s = this;
            if (!s.rootContainer) {
                s.rootContainer = document.createElement("canvas");
                s._stage.rootDiv.appendChild(s.rootContainer);
            }
            var c: any = s.rootContainer;
            var gl = c.getContext("webgl") || c.getContext('experimental-webgl');
            s._gl = gl;
            s._program = gl.createProgram();
            var _program = s._program;
            //初始化顶点着色器和片元着色器
            s._getShader(0);
            s._getShader(1);
            //链接到gpu
            gl.linkProgram(_program);
            //使用当前编译的程序
            gl.useProgram(_program);
            //改变y轴方向,以对应纹理坐标
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            //设置支持有透明度纹理
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            //取消深度检测
            gl.disable(gl.DEPTH_TEST);
            //开启混合模式
            gl.enable(gl.BLEND);
            gl.disable(gl.CULL_FACE);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            // 新建缓存
            s._buffer = gl.createBuffer();
            //
            s._pMI = gl.getUniformLocation(s._program, 'pMatrix');
            s._vMI = gl.getUniformLocation(s._program, 'vMatrix');
            s._uA = gl.getUniformLocation(s._program, 'u_A');
            s._uMask = gl.getUniformLocation(s._program, 'u_Mask');
            //
            s._cM = new annie.Matrix();
            s._maxTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            s._uniformTexture = gl.getUniformLocation(s._program, "u_texture");
            s._uniformMaskTexture = gl.getUniformLocation(s._program, "u_maskTexture");
            s._posAttr = gl.getAttribLocation(s._program, "a_P");
            s._textAttr = gl.getAttribLocation(s._program, "a_TC");
            gl.enableVertexAttribArray(s._posAttr);
            gl.enableVertexAttribArray(s._textAttr);
            s.initMaskBuffer();
        }

        private setBuffer(buffer: any, data: any): void {
            var s = this;
            var gl = s._gl;
            //绑定buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            //将buffer赋值给一变量
            gl.vertexAttribPointer(s._posAttr, 2, gl.FLOAT, false, 4 * 4, 0);
            gl.vertexAttribPointer(s._textAttr, 2, gl.FLOAT, false, 4 * 4, 4 * 2);
        }
        /**
         *  调用渲染
         * @public
         * @since 1.0.2
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         * @param {number} type 0图片 1矢量 2文字 3容器
         */
        public draw(target: any, type: number): void {
            var s = this;
            if (!target._cacheImg || (target._cacheImg.nodeName == "IMG" && !target._cacheImg.complete))return;
            var gl = s._gl;
            var gi: any = target._glInfo;
            ////////////////////////////////////////////
            var vertices =
                [
                    //x,y,textureX,textureY
                    0.0, 0.0, gi.x, gi.y,
                    gi.pw, 0.0, gi.w, gi.y,
                    0.0, gi.ph, gi.x, gi.h,
                    gi.pw, gi.ph, gi.w, gi.h
                ];
            var img = target._cacheImg;
            var m: any;
            if (img._annieType > 0) {
                m = s._cM;
                m.identity();
                if (img._annieType == 2) {
                    m.tx = target._cacheX * 2;
                    m.ty = target._cacheY * 2;
                } else {
                    m.tx = -img.width;
                    m.ty = -img.height;
                }
                m.prepend(target.cMatrix);
            } else {
                m = target.cMatrix;
            }
            var vMatrix: any = new Float32Array(
                [
                    m.a, m.b, 0,
                    m.c, m.d, 0,
                    m.tx, m.ty, 1
                ]);
            s.activeTexture(img.texture,0);
            gl.uniform1i(s._uniformTexture, 0);
            s.activeTexture(s._maskTexture,1);
            gl.uniform1i(s._uniformMaskTexture, 1);
            s.setBuffer(s._buffer, new Float32Array(vertices));
            gl.uniform1f(s._uA, target.cAlpha);
            gl.uniformMatrix3fv(s._pMI, false, s._pMatrix);
            gl.uniformMatrix3fv(s._vMI, false, vMatrix);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.flush();
        }
        private initMaskBuffer(): void {
            var s = this;
            s._maskFbo = s.createFramebuffer(1024,1024);
            s._maskSrcTexture=s._maskFbo.texture;
            s._maskTexture=s.createTexture(null,1024,1024);
        }
        public createTexture(bitmapData:any=null,width:number=1,height:number=1):WebGLTexture{
            var gl = this._gl;
            var texture:any = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            var b:any=bitmapData;
            var h:number,w:number;
            if(bitmapData) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
                w=bitmapData.width;
                h=bitmapData.height;
            }else{
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                w=width;
                h=height;
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            texture.bitmapData=b;
            texture.width=w;
            texture.height=h;
            gl.bindTexture(gl.TEXTURE_2D, null);
            return texture;
        }
        public updateTexture(texture:WebGLTexture,bitmapData:any):void{
            var s=this;
            var gl=s._gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        public createFramebuffer(width:number,height:number):WebGLFramebuffer{
            var s=this;
            var gl=s._gl;
            var fb:any = gl.createFramebuffer();
            fb.width=width;
            fb.height=height;
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            var texture = s.createTexture(null,width,height);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            fb.texture=texture;
            gl.bindFramebuffer(gl.FRAMEBUFFER,null);
            return fb;
        }
        public activeTexture(texture:WebGLTexture,id:number=0):void{
            var s=this;
            var gl=s._gl;
            gl.activeTexture(gl["TEXTURE"+id]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
        }
        /**
         * 设置webgl要渲染的东西
         * @method _setGlInfo
         * @param target
         * @param type
         * @private
         */
        public static setDisplayInfo(target:any,type:number):void{
            //判断是不是webgl渲染模式
            if(!target.stage||target.stage.renderType!=1)return;
            if(target.stage) {
                var gi: any = target._glInfo;
                var renderObj:any=target.stage.renderObj;
                var tc: Rectangle = target.rect;
                var img: any = target._cacheImg;
                if (tc) {
                    gi.x = tc.x / img.width;
                    gi.y = tc.y / img.height;
                    gi.w = (tc.x + tc.width) / img.width;
                    gi.h = (tc.y + tc.height) / img.height;
                    gi.pw = tc.width;
                    gi.ph = tc.height;
                } else {
                    var cX: number = target._cacheX;
                    var cY: number = target._cacheY;
                    gi.x = cX / img.width;
                    gi.y = cY / img.height;
                    gi.w = (img.width - cX) / img.width;
                    gi.h = (img.height - cY) / img.height;
                    gi.pw = (img.width - cX*2);
                    gi.ph = (img.height - cY*2);
                    //因为不是雪碧图有可能中途更新了效果，但引用没变，所以需要标记告诉webgl需要更新纹理
                    img._annieType=type;
                    if(img.texture){
                        renderObj.updateTexture(img.texture,img);
                    }
                }
            }
            if(!img.texture){
                img.texture=renderObj.createTexture(img);
            }
        }
    }
}
