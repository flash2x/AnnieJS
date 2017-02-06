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
        private _cM: annie.Matrix;
        private _maxTextureCount: number = 32;
        private _uniformTexture: number = 0;
        private _posAttr: number = 0;
        private _textAttr: number = 0;
        private _curTextureId: number = -1;

        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.2
         */
        public constructor(stage: Stage) {
            super();
            this._instanceType = "annie.WGRender";
            this._stage = stage;
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.2
         * @public
         */
        public begin(): void {
            let s = this;
            let gl = s._gl;
            if (s._stage.bgColor != "") {
                let color = s._stage.bgColor;
                let r = parseInt("0x" + color.substr(1, 2));
                let g = parseInt("0x" + color.substr(3, 2));
                let b = parseInt("0x" + color.substr(5, 2));
                gl.clearColor(r / 255, g / 255, b / 255, 1.0);
            } else {
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
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
            /* let s = this;
             let gl = s._gl;
             gl.bindFramebuffer(gl.FRAMEBUFFER, s._maskFbo);
             gl.viewport(0, 0, 1024, 1024);
             gl.disable(gl.BLEND);
             if (s._maskObjList.length == 0) {
             gl.clearColor(0.0, 0.0, 0.0, 0.0);
             gl.clear(gl.COLOR_BUFFER_BIT);
             gl.bindTexture(gl.TEXTURE_2D, s._maskTexture);
             gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1024, 1024, 0);
             }
             s._maskObjList.push(target);
             //告诉shader这个时候是画遮罩本身的帧缓冲
             gl.uniform1i(s._uMask, s._maskObjList.length*100);
             s.draw(target, 1);
             gl.bindTexture(gl.TEXTURE_2D, s._maskTexture);
             gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1024, 1024, 0);
             gl.bindFramebuffer(gl.FRAMEBUFFER, null);
             gl.uniform1i(s._uMask, s._maskObjList.length);
             gl.viewport(0, 0, s._dW, s._dH);
             gl.enable(gl.BLEND);*/
        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.2
         */
        public endMask(): void {
            /*let s = this;
             let gl=s._gl;
             let len = s._maskObjList.length;
             if(len>1){
             s._maskObjList.pop();
             let mlCopy:any=s._maskObjList.concat();
             s._maskObjList.length=0;
             for(let i:number=0;i<mlCopy.length;i++){
             s.beginMask(mlCopy[i]);
             }
             }else{
             gl.uniform1i(s._uMask, 0);
             s._maskObjList.length=0;
             }*/
        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.2
         * @method reSize
         */
        public reSize(): void {
            let s = this;
            let c = s.rootContainer;
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
            let s = this;
            let gl = s._gl;
            // Find the shader script element
            let shaderText = "";
            // Create the shader object instance
            let shader: any = null;
            if (id == 0) {
                shaderText = 'precision highp float;' +
                    'varying vec2 v_TC;' +
                    'uniform sampler2D u_texture;' +
                    'uniform float u_A;' +
                    'void main() {' +
                    'gl_FragColor = texture2D(u_texture, v_TC)*u_A;' +
                    '}';
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            }
            else {
                shaderText = 'precision highp float;' +
                    'attribute vec2 a_P;' +
                    'attribute vec2 a_TC;' +
                    'varying vec2 v_TC;' +
                    'uniform mat3 vMatrix;' +
                    'uniform mat3 pMatrix;' +
                    'void main() {' +
                    'gl_Position =vec4((pMatrix*vMatrix*vec3(a_P, 1.0)).xy, 1.0, 1.0);' +
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
            let s = this;
            if (!s.rootContainer) {
                s.rootContainer = document.createElement("canvas");
                s._stage.rootDiv.appendChild(s.rootContainer);
            }
            let c: any = s.rootContainer;
            let gl = c.getContext("webgl") || c.getContext('experimental-webgl');
            s._gl = gl;
            s._program = gl.createProgram();
            let _program = s._program;
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
            //
            s._cM = new annie.Matrix();
            s._maxTextureCount = 3;// gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            s._uniformTexture = gl.getUniformLocation(s._program, "u_texture");
            s._posAttr = gl.getAttribLocation(s._program, "a_P");
            s._textAttr = gl.getAttribLocation(s._program, "a_TC");
            gl.enableVertexAttribArray(s._posAttr);
            gl.enableVertexAttribArray(s._textAttr);
        }

        private setBuffer(buffer: any, data: any): void {
            let s = this;
            let gl = s._gl;
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
            let s = this;
            let img = target._cacheImg;
            if (!img)return;
            let gl = s._gl;
            let tc: any = target.rect;
            let gi:any={};
            if (type==0) {
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
                gi.pw = (img.width - cX * 2);
                gi.ph = (img.height - cY * 2);
            }
            ////////////////////////////////////////////
            let vertices =
                [
                    //x,y,textureX,textureY
                    0.0, 0.0, gi.x, gi.y,
                    gi.pw, 0.0, gi.w, gi.y,
                    0.0, gi.ph, gi.x, gi.h,
                    gi.pw, gi.ph, gi.w, gi.h
                ];
            let m: any;
            if (type> 0) {
                m = s._cM;
                m.identity();
                if (type == 2) {
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
            let vMatrix: any = new Float32Array(
                [
                    m.a, m.b, 0,
                    m.c, m.d, 0,
                    m.tx, m.ty, 1
                ]);
            gl.uniform1i(s._uniformTexture, s.createTexture(img));
            s.setBuffer(s._buffer, new Float32Array(vertices));
            gl.uniform1f(s._uA, target.cAlpha);
            gl.uniformMatrix3fv(s._pMI, false, s._pMatrix);
            gl.uniformMatrix3fv(s._vMI, false, vMatrix);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
/*

        private activeTexture(bitmapData: any): number {
            let s = this;
            let gl = s._gl;
            let newId: number = -1;
            let isHave: boolean = false;
            for (let i = 1; i < s._maxTextureCount; i++) {
                if (s._textures[i] == null) {
                    newId = i;
                    break;
                }
                if (s._textures[i] == texture) {
                    newId = i;
                    isHave = true;
                    break;
                }
            }
            if (newId < 0) {
                if (s._curTextureId < s._maxTextureCount - 1) {
                    s._curTextureId++;
                } else {
                    s._curTextureId = 1;
                }
                newId = s._curTextureId;
            }
            gl.activeTexture(gl["TEXTURE" + newId]);
            if (!isHave) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
            }
            s._textures[newId] = texture;
            return newId;
        }
*/
        public createTexture(bitmapData: any = null, width: number = 1, height: number = 1): WebGLTexture {
            let gl = this._gl;
            gl.activeTexture(gl.TEXTURE0);
            let texture: any = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            if (bitmapData) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            } else {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }
    }
}