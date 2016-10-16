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
        private _texture:any;
        private _buffer:any;


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
            gl.clear(gl.COLOR_BUFFER_BIT);
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
        }
        private _getShader(id: number){
            var s = this;
            var gl=s._gl;
            // Find the shader script element
            var shaderText = "";
            // Create the shader object instance
            var shader: any = null;
            if (id == 0) {
                shaderText = 'precision mediump float;' +
                    'varying vec2 textureCoordinate;' +
                    'uniform sampler2D inputImageTexture;' +
                    'void main() {' +
                    'gl_FragColor = texture2D(inputImageTexture, textureCoordinate);' +
                    '}';
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            }
            else {
                shaderText = 'precision mediump float;' +
                    'attribute vec4 position;' +
                    'attribute vec2 inputTextureCoordinate;' +
                    'varying vec2 textureCoordinate;' +
                    'void main() {' +
                    'gl_Position = position;' +
                    'textureCoordinate = vec2(position.x, position.y);' +
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
            var c = s.rootContainer;
            s._gl = c["getContext"]('experimental-webgl')||c["getContext"]('webgl');
            var gl = s._gl;
            s._program = gl.createProgram();
            var _program=s._program;
            //初始化顶点着色器和片元着色器
            s._getShader(0);
            s._getShader(1);
            gl.linkProgram(_program);
            if (null == gl.getProgramParameter(_program, gl.LINK_STATUS)) {
                throw Error("Error linking shader program: \"" + gl.getProgramInfoLog(_program) + "\"");
            }
            gl.useProgram(_program);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            s._texture=gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, s._texture);
            s._buffer=gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, s._buffer);
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
            ////////////////////////////////////////////
            var vertices =
                [
                    -1, -1,
                    -1, 1,
                    1, 1,
                    1, -1,
                    -1,-1
                ];
            //绑定buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            //绑定texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, target._cacheImg);
            //设置贴图信息
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //获取变量
            var pos:number=gl.getAttribLocation(s._program,"position");
            //以下两组成对出现，允许position变量从buffer数组里面取数据，并设置取数据规则
            gl.enableVertexAttribArray(pos);
            gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
            // 渲染
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
        }
    }
}