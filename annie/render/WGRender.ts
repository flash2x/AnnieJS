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
        private _shaderProgram: any;

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
            // Enable depth tests
            gl.enable(gl.DEPTH_TEST);
            // Clear the depth buffer and color buffer
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
         *  调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         * @param {number} type 0图片 1矢量 2文字 3容器
         */
        public draw(target: any, type: number): void {
            /* var s = this;
             // Define the vertices for a triangle
             var vertices: any = [
             0.0, 0.5, 0.0,
             -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0
             ];
             // Create a buffer to use in the WebGL instance
             var buffer = s._gl.createBuffer();
             s._gl.bindBuffer(s._gl.ARRAY_BUFFER, buffer);
             // Create and initialize the vertex buffer's data-store
             s._gl.bufferData(s._gl.ARRAY_BUFFER, new Float32Array(vertices), s._gl.STATIC_DRAW);
             // Enable the vertex attribute array
             //开启对应程序接口的数组模式
             s._gl.enableVertexAttribArray(0);
             //把当前工作的数据缓冲区指定给0号位置的程序接口
             s._gl.vertexAttribPointer(0, 3, s._gl.FLOAT, false, 0, 0);
             s._gl.drawArrays(s._gl.TRIANGLES, 0, 3);
             // Force all buffered GL commands to be executed as quickly as possible by the rendering engine
             s._gl.flush();*/
            var s = this;
            var gl = s._gl;
            ////////////////////////////////////////////
            var vertices =
                [
                    1.0, 1.0,
                    1.0, -1.0,
                    -1.0, 1.0,
                    -1.0, -1.0
                ];
            // Create a buffer to use in the WebGL instance
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            // Create and initialize the vertex buffer's data-store
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
            // Enable the vertex attribute array
            //开启对应程序接口的数组模式
            gl.enableVertexAttribArray(0);
            //把当前工作的数据缓冲区指定给0号位置的程序接口
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            //////////////////////////////////////////////////
            //在这里把我们的纹理交给WebGL:
            ////////////////////////////////////////
            var textureObject = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, textureObject);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, target._cacheImg);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //为了安全起见，在使用之前请绑定好纹理ID
            gl.activeTexture(gl.TEXTURE0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        private _getShader(id: number){
            var s = this;
            var gl=s._gl;
            // Find the shader script element
            var shaderText = "";
            // Create the shader object instance
            var shader: any = null;
            if (id == 0) {
                shaderText = 'precision mediump float;varying vec2 textureCoordinate;uniform sampler2D inputImageTexture;void main() {gl_FragColor = texture2D(inputImageTexture, textureCoordinate);}';
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            }
            else {
                shaderText = 'precision mediump float;attribute vec4 position;attribute vec2 inputTextureCoordinate;varying vec2 textureCoordinate;void main() {gl_Position = position;textureCoordinate = vec2((position.x+1.0)/2.0, (position.y+1.0)/2.0);}';
                shader = gl.createShader(gl.VERTEX_SHADER);
            }
            // Set the shader source code in the shader object instance and compile the shader
            gl.shaderSource(shader, shaderText);
            gl.compileShader(shader);
            if (null == gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw Error("Shader compilation failed. Error: \"" + gl.getShaderInfoLog(shader) + "\"");
            }
            // Attach the shaders to the shader program
            gl.attachShader(s._shaderProgram, shader);
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
            s._shaderProgram = gl.createProgram();
            var _shaderProgram=s._shaderProgram;
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
            //初始化顶点着色器和片元着色器
            s._getShader(0);
            s._getShader(1);
            gl.linkProgram(_shaderProgram);
            if (null == gl.getProgramParameter(_shaderProgram, gl.LINK_STATUS)) {
                throw Error("Error linking shader program: \"" + gl.getProgramInfoLog(_shaderProgram) + "\"");
            }
            gl.useProgram(_shaderProgram);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
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
    }
}