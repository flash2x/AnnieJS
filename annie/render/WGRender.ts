/**
 * @module annie
 */
namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.WGRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    export class WGRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public rootContainer: any = null;
        private _gl: any;
        private _stage: Stage;
        private _program: any;
        private _vBuffer: any;
        private _tBuffer: any;
        private _dW: number;
        private _dH: number;
        private _pMatrix: any;
        private _pMI: number;
        private _vMI: number;
        private _uA: number;
        private _cM: annie.Matrix;
        private _currentTextureId: number = 0;
        private _textures: any = [];
        private _images: any = [];
        private _maxTextureCount: number = 32;
        private _uniformTexture: number = 32;

        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor(stage: Stage) {
            super();
            this._stage = stage;
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
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
        }

        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        public beginMask(target: any): void {

        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask(): void {

        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.0
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
                    'uniform sampler2D u_texture;' +
                    'uniform float u_A;' +
                    'varying float v_A;'+
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
         * @since 1.0.0
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
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            //取消深度检测
            gl.disable(gl.DEPTH_TEST);
            //开启混合模式
            gl.enable(gl.BLEND);
            gl.disable(gl.CULL_FACE);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            //新建缓存
            s._vBuffer = gl.createBuffer();
            s._tBuffer = gl.createBuffer();
            //
            s._pMI = gl.getUniformLocation(s._program, 'pMatrix');
            s._vMI = gl.getUniformLocation(s._program, 'vMatrix');
            s._uA=gl.getUniformLocation(s._program, 'u_A');
            //
            s._cM = new annie.Matrix();
            s._maxTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            gl.activeTexture(gl.TEXTURE0);
            s._uniformTexture = gl.getUniformLocation(s._program, "u_texture");
        }

        private setBuffer(attr: string, buffer: any, data: any): void {
            var s = this;
            var gl = s._gl;
            //绑定buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            var pos: number = gl.getAttribLocation(s._program, attr);
            //将buffer赋值给一变量
            gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(pos);
        }

        private setTexture(img: any): void {
            var s = this;
            var images = s._images;
            var gl = s._gl;
            //一般打上这种标签的都不是雪碧图，强行在第一通道上更新
            var imagesCount: number = images.length;
            var updateTexture: boolean = true;
            if(img["glUpdate"]!=undefined|| imagesCount == 0) {
                //需要强制更新纹理
                if (img["glUpdate"]) {
                    img["glUpdate"] = false;
                    s._currentTextureId = 0;
                }else{
                    s._currentTextureId =1;
                }
            }else {
                for (var i = 0; i < imagesCount; i++) {
                    if (img == images[i]) {
                        s._currentTextureId = i;
                        //不需要更新纹理
                        updateTexture = false;
                        break;
                    }
                }
                if (updateTexture) {
                    if (s._currentTextureId < s._maxTextureCount - 1) {
                        s._currentTextureId++;
                    } else {
                        s._currentTextureId = 1;
                    }
                }
            }
            gl.activeTexture(gl["TEXTURE" + s._currentTextureId]);
            if (updateTexture) {
                var t: any;
                if (!s._textures[s._currentTextureId]) {
                    //如果不存在就建
                    t = gl.createTexture();
                    s._textures[s._currentTextureId] = t;
                } else {
                    //如果存在就换
                    t = s._textures[s._currentTextureId];
                }
                gl.bindTexture(gl.TEXTURE_2D, t);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                //设置贴图信息
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                images[s._currentTextureId] = img;
            }
            gl.uniform1i(s._uniformTexture, s._currentTextureId);
        }

        /**
         *  调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         * @param {number} type 0图片 1矢量 2文字 3容器
         */
        public draw(target: any, type: number): void {
            var s = this;
            var gl = s._gl;
            var gi: any = target._glInfo;
            ////////////////////////////////////////////
            var vertices =
                [
                    0.0, 0.0,
                    gi.pw, 0.0,
                    0.0, gi.ph,
                    gi.pw, gi.ph
                ];
            var textureCoord =
                [
                    gi.x, gi.y,
                    gi.w, gi.y,
                    gi.x, gi.h,
                    gi.w, gi.h
                ];
            //绑定buffer
            s.setBuffer("a_P", s._vBuffer, new Float32Array(vertices));
            s.setBuffer("a_TC", s._tBuffer, new Float32Array(textureCoord));
            var img = target._cacheImg;
            s.setTexture(img);
            var m: any;
            if (img.nodeName == "CANVAS") {
                m = s._cM;
                m.identity();
                m.tx = -img.width;
                m.ty = -img.height;
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
            gl.uniform1f(s._uA,target.cAlpha);
            gl.uniformMatrix3fv(s._pMI, false, s._pMatrix);
            gl.uniformMatrix3fv(s._vMI, false, vMatrix);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
}