/**
 * @module annie
 */
namespace annie {
    /**
     * Canvas 渲染器
     * @class annie.WebGLRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 4.0.0
     */
    export class WebGLRender extends AObject implements IRender {
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 4.0.0
         * @type {any}
         * @default null
         */
        public rootContainer: any = null;
        /**
         * @property viewPort
         *
         */
        public viewPort: annie.Rectangle = new annie.Rectangle();
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        public _ctx: any;

        /**
         * @method WebGLRender
         * @public
         * @since 4.0.0
         */
        public constructor() {
            super();
            this._instanceType = "annie.WebGLRender";
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 4.0.0
         * @public
         */
        public begin(color: string): void {
            let s = this;
            let gl = s._ctx;
            gl.clearColor(s._clearColor.r, s._clearColor.g, s._clearColor.b, s._clearColor.a);
        }

        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 4.0.0
         */
        public beginMask(target: any): void {

        }

        private drawMask(target: any): void {

        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 4.0.0
         */
        public endMask(): void {

        }

        private _blendMode: number = 0;

        /**
         * 调用渲染
         * @public
         * @since 4.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        public draw(target: any): void {
            let s = this;
            s.batchCardCount = 0;
            s._drawBatchGroup(target);
            s._drawBuffers();
        }

        public end() {
        };

        /**
         * 初始化渲染器
         * @public
         * @since 4.0.0
         * @method init
         */
        public init(canvas: any): void {
            let s = this;
            s.rootContainer = canvas;
            s.rootContainer.id = "_a2x_webgl";
            let options = {
                depth: true,
                alpha: true,
                stencil: true,
                antialias: false,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false
            };
            let gl;
            try {
                gl = canvas.getContext('webgl', options) || canvas.getContext("experimental-webgl", options);
            } catch (e) {
                console.log("No Supported WebGL");
                return;
            }
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, s._premultiply);
            //gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
            s._ctx = gl;
            s._batchTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            s._createShaderProgram();
            s._createBuffers();
            for(let i=0;i<s._batchTextureCount;i++) {
                s._batchTextures[i]=s.getBaseTexture();
            }
        }

        /**
         * 当尺寸改变时调用
         * @public
         * @since 4.0.0
         * @method reSize
         */
        public reSize(width: number, height: number): void {
            let s = this, c = s.rootContainer;
            c.width = width;
            c.height = height;
            s.viewPort.width = width;
            s.viewPort.height = height;
            c.style.width = Math.ceil(width / devicePixelRatio) + "px";
            c.style.height = Math.ceil(height / devicePixelRatio) + "px";
            let gl = s._ctx;
            gl.viewportWidth = width;
            gl.viewportHeight = height;
            s.updateViewport();
        }

        destroy(): void {
            let s = this;
            s.rootContainer = null;
            s._ctx = null;
        }

        /**
         * Specifies whether or not the browser's WebGL implementation should try to perform anti-aliasing.
         * @property _antialias
         * @protected
         * @type {Boolean}
         * @default false
         */
        public _antialias: boolean = false;
        /**
         * Specifies whether or not StageGL is handling colours as premultiplied alpha.
         * @property _premultiply
         * @protected
         * @type {Boolean}
         * @default false
         */
        public _premultiply: boolean = false;
        /**
         * Internal value of {{#crossLink "StageGL/autoPurge"}}{{/crossLink}}
         * @property _autoPurge
         * @protected
         * @type {Integer}
         * @default null
         */
        public _autoPurge: number = 0;

        /**
         * A 2D projection matrix used to convert WebGL's viewspace into canvas co-ordinates. Regular canvas display
         * uses Top-Left values of [0,0] where WebGL uses a Center [0,0] Top-Right [1,1] (euclidean) system.
         * @property _projectionMatrix
         * @protected
         * @type {Float32Array}
         * @default null
         */
        public _projectionMatrix: Float32Array = null;
        public _projectionMatrixFlip: Float32Array = null;
        /**
         * The color to use when the WebGL canvas has been cleared. May appear as a background color. Defaults to grey.
         * @property _clearColor
         * @protected
         * @type {Object}
         * @default {r: 0.50, g: 0.50, b: 0.50, a: 0.00}
         */
        public _clearColor: any = {r: 1.0, g: 1.0, b: 1.0, a: 1.00};

        /**
         * The maximum number of cards (aka a single sprite) that can be drawn in one draw call. Use getter/setters to
         * modify otherwise internal buffers may be incorrect sizes.
         * @property _maxCardsPerBatch
         * @protected
         * @type {Number}
         * @default WebGLRender.DEFAULT_MAX_BATCH_SIZE (10000)
         */
        public _maxCardsPerBatch: number = 10000;

        /**
         * The shader program used to draw the current batch.
         * @property _activeShader
         * @protected
         * @type {WebGLProgram}
         * @default null
         */
        public _activeShader: any = null;

        /**
         * The vertex position data for the current draw call.
         * @property _vertices
         * @protected
         * @type {Float32Array}
         * @default null
         */
        public _vertices: Float32Array = null;

        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_vertices:property"}}{{/crossLink}}.
         * @property _vertexPositionBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        public _vertexPositionBuffer: any = null;

        /**
         * The vertex U/V data for the current draw call.
         * @property _uvs
         * @protected
         * @type {Float32Array}
         * @default null
         */
        public _uvs: Float32Array = null;

        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_uvs:property"}}{{/crossLink}}.
         * @property _uvPositionBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        public _uvPositionBuffer: any = null;

        /**
         * The vertex indices data for the current draw call.
         * @property _indices
         * @protected
         * @type {Float32Array}
         * @default null
         */
        public _indices: Float32Array = null;

        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_indices:property"}}{{/crossLink}}.
         * @property _textureIndexBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        public _textureIndexBuffer: any = null;

        /**
         * The vertices data for the current draw call.
         * @property _alphas
         * @protected
         * @type {Float32Array}
         * @default null
         */
        public _alphas: Float32Array = null;

        /**
         * The WebGL buffer attached to {{#crossLink "StageGL/_alphas:property"}}{{/crossLink}}.
         * @property _alphaBuffer
         * @protected
         * @type {WebGLBuffer}
         * @default null
         */
        public _alphaBuffer: any = null;

        /**
         * An index based lookup of every WebGL Texture currently in use.
         * @property _drawTexture
         * @protected
         * @type {Dictionary}
         */
        public _textureDictionary: any = {};


        /**
         * An array of all the textures currently loaded into the GPU. The index in the array matches the GPU index.
         * @property _batchTextures
         * @protected
         * @type {Array}
         */
        public _batchTextures: Array<any> = [];

        /**
         * The number of concurrent textures the GPU can handle. This value is dynamically set from WebGL during initialization
         * via `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`. The WebGL spec states that the lowest guaranteed value is 8,
         * but it could be higher. Do not set this value higher than the value returned by the GPU. Setting it lower will
         * probably reduce performance, but may be advisable to reserve slots for custom filter work.
         * NOTE: Can also act as a length for {{#crossLink "StageGL/_batchTextures:property"}}.
         * @property _batchTextureCount
         * @protected
         * @type {Number}
         * @default 8
         */
        public _batchTextureCount: number = 8;

        /**
         * The location at which the last texture was inserted into a GPU slot in {{#crossLink "StageGL/_batchTextures:property"}}{{/crossLink}}.
         * Manual control of this variable can yield improvements in performance by intelligently replacing textures
         * inside a batch to reduce texture re-load. It is impossible to write automated general use code, as it requires
         * display list look ahead inspection and/or render foreknowledge.
         * @property _lastTextureInsert
         * @protected
         * @type {Number}
         * @default -1
         */
        public _lastTextureInsert: number = -1;

        /**
         * The current batch being drawn, A batch consists of a call to `drawElements` on the GPU. Many of these calls
         * can occur per draw.
         * @property _batchId
         * @protected
         * @type {Number}
         * @default 0
         */
        public _batchID: number = 0;


        /**
         * Used to ensure every canvas used as a texture source has a unique ID.
         * @property _lastTrackedCanvas
         * @protected
         * @type {Number}
         * @default 0
         */
        public _lastTrackedCanvas: number = 0;


        /**
         * The number of triangle indices it takes to form a Card. 3 per triangle, 2 triangles.
         * @property INDICIES_PER_CARD
         * @static
         * @final
         * @type {Number}
         * @default 6
         * @readonly
         */
        public static INDICIES_PER_CARD: number = 6;


        /**
         * Default U/V rect for dealing with full coverage from an image source.
         * @property UV_RECT
         * @static
         * @final
         * @type {Object}
         * @default {t:0, l:0, b:1, r:1}
         * @readonly
         */
        public static UV_RECT: any = {t: 0, l: 0, b: 1, r: 1};

        /**
         * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders. The
         * regular shader is designed to render all expected objects. Shader code may contain templates that are replaced
         * pre-compile.
         * @property REGULAR_VARYING_HEADER
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        public static REGULAR_VARYING_HEADER: string =
            "precision mediump float;" +
            "varying vec2 vTextureCoord;" +
            "varying lowp float indexPicker;" +
            "varying lowp float alphaValue;";

        /**
         * Actual full header for the vertex shader. Includes the varying header. The regular shader is designed to render
         * all expected objects. Shader code may contain templates that are replaced pre-compile.
         * @property REGULAR_VERTEX_HEADER
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        public static REGULAR_VERTEX_HEADER: string =
            WebGLRender.REGULAR_VARYING_HEADER +
            "attribute vec2 vertexPosition;" +
            "attribute vec2 uvPosition;" +
            "attribute lowp float textureIndex;" +
            "attribute lowp float objectAlpha;" +
            "uniform mat4 pMatrix;";

        /**
         * Actual full header for the fragment shader. Includes the varying header. The regular shader is designed to render
         * all expected objects. Shader code may contain templates that are replaced pre-compile.
         * @property REGULAR_FRAGMENT_HEADER
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        public static REGULAR_FRAGMENT_HEADER: string =
            WebGLRender.REGULAR_VARYING_HEADER +
            "uniform sampler2D uSampler[{{count}}];";

        /**
         * Body of the vertex shader. The regular shader is designed to render all expected objects. Shader code may contain
         * templates that are replaced pre-compile.
         * @property REGULAR_VERTEX_BODY
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        public static REGULAR_VERTEX_BODY: string =
            "void main(void) {" +
            "gl_Position = vec4(" +
            "(vertexPosition.x * pMatrix[0][0]) + pMatrix[3][0]," +
            "(vertexPosition.y * pMatrix[1][1]) + pMatrix[3][1]," +
            "pMatrix[3][2]," +
            "1.0" +
            ");" +
            "alphaValue = objectAlpha;" +
            "indexPicker = textureIndex;" +
            "vTextureCoord = uvPosition;" +
            "}";

        /**
         * Body of the fragment shader. The regular shader is designed to render all expected objects. Shader code may
         * contain templates that are replaced pre-compile.
         * @property REGULAR_FRAGMENT_BODY
         * @static
         * @final
         * @type {String}
         * @readonly
         */
        public static REGULAR_FRAGMENT_BODY: string =
            "void main(void) {" +
            "vec4 color = vec4(1.0, 0.0, 0.0, 1.0);" +
            "if (indexPicker <= 0.5) {" +
            "color = texture2D(uSampler[0], vTextureCoord);" +
            "{{alternates}}" +
            "}" +
            "{{fragColor}}" +
            "}";
        public static REGULAR_FRAG_COLOR_NORMAL: string = "gl_FragColor = vec4(color.rgb, color.a * alphaValue);";
        public static REGULAR_FRAG_COLOR_PREMULTIPLY: string =
            "if(color.a > 0.001) {" +
            "gl_FragColor = vec4(color.rgb/color.a, color.a * alphaValue);" +
            "} else {" +
            "gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);" +
            "}";
        public releaseTexture(displayObject: any) {
            let s = this;
            let isHadTexture = true;
            if (displayObject.children) {
                for (let i = 0;i<displayObject.children.length; i++) {
                    s.releaseTexture(displayObject.children[i]);
                }
                if (!displayObject._isCache) {
                    isHadTexture = false;
                }
            }
            if (isHadTexture) {
                let imageData = displayObject._texture;
                if (imageData._storeID != void 0) {
                    s._killTextureObject(s._textureDictionary[imageData._storeID]);
                    delete imageData._storeID;
                }
            }
        };
        public _createShaderProgram() {
            let s = this;
            let success = false;
            while (!success) {
                try {
                    s._activeShader = s._getShaderProgram();
                    success = true;
                } catch (e) {
                    s._batchTextureCount -= 4;
                    if (s._batchTextureCount < 1) {
                        s._batchTextureCount = 1;
                    }
                }
            }
        };

        public updateViewport() {
            let s = this;
            let width: number = s.viewPort.width, height: number = s.viewPort.height;
            let gl = s._ctx;
            if (gl) {
                gl.viewport(0, 0, width, height);
                s._projectionMatrix = new Float32Array([
                    2 / width, 0, 0, 0,
                    0, -2 / height, 1, 0,
                    0, 0, 1, 0,
                    -1, 1, 0.1, 0
                ]);
                s._projectionMatrixFlip = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                s._projectionMatrixFlip.set(s._projectionMatrix);
                s._projectionMatrixFlip[5] *= -1;
                s._projectionMatrixFlip[13] *= -1;
            }
        };

        public getBaseTexture() {
            let s = this;
            let gl = s._ctx;
            let width = 1;
            let height = 1;
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,				// target
                0,							// level of detail
                gl.RGBA,					// internal format
                width, height, 0,			// width, height, border (only for array/null sourced textures)
                gl.RGBA,					// format (match internal format)
                gl.UNSIGNED_BYTE,			// type of texture(pixel color depth)
                null						// image data, we can do null because we're doing array data
            );
            texture.width = width;
            texture.height = height;
            s.setTextureParams();
            return texture;
        };

        public setTextureParams() {
            let gl = this._ctx;
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };

        public _getShaderProgram() {
            let s = this;
            let gl = s._ctx;
            gl.useProgram(null);
            let targetVtx: any = WebGLRender.REGULAR_VERTEX_HEADER + WebGLRender.REGULAR_VERTEX_BODY;
            let targetFrag: any = WebGLRender.REGULAR_FRAGMENT_HEADER + WebGLRender.REGULAR_FRAGMENT_BODY;
            let vertexShader = s._createShader(gl.VERTEX_SHADER, targetVtx);
            let fragmentShader = s._createShader(gl.FRAGMENT_SHADER, targetFrag);
            let shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
            gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);
            shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
            gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);
            shaderProgram.alphaAttribute = gl.getAttribLocation(shaderProgram, "objectAlpha");
            gl.enableVertexAttribArray(shaderProgram.alphaAttribute);
            let samplers = [];
            for (let i = 0; i < s._batchTextureCount; i++) {
                samplers[i] = i;
            }
            shaderProgram.samplerData = samplers;
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            gl.uniform1iv(shaderProgram.samplerUniform, samplers);
            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
            return shaderProgram;
        };

        public _createShader(type: any, str: string) {
            let s = this;
            let gl = s._ctx;
            // inject the static number
            str = str.replace(/{{count}}/g, s._batchTextureCount + "");
            // TODO: WebGL 2.0 does not need this support
            let insert = "";
            for (let i = 1; i < s._batchTextureCount; i++) {
                insert += "} else if (indexPicker <= " + i + ".5) { color = texture2D(uSampler[" + i + "], vTextureCoord);";
            }
            str = str.replace(/{{alternates}}/g, insert);
            str = str.replace(/{{fragColor}}/g, s._premultiply ? WebGLRender.REGULAR_FRAG_COLOR_PREMULTIPLY : WebGLRender.REGULAR_FRAG_COLOR_NORMAL);
            // actually compile the shader
            let shader = gl.createShader(type);
            gl.shaderSource(shader, str);
            gl.compileShader(shader);
            return shader;
        };

        public _createBuffers() {
            let s = this;
            let gl = s._ctx;
            let groupCount = s._maxCardsPerBatch * WebGLRender.INDICIES_PER_CARD;
            let groupSize, i, l;
            let vertexPositionBuffer = s._vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
            groupSize = 2;
            let vertices = s._vertices = new Float32Array(groupCount * groupSize);
            for (i = 0, l = vertices.length; i < l; i += groupSize) {
                vertices[i] = vertices[i + 1] = 0;
            }
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
            vertexPositionBuffer.itemSize = groupSize;
            vertexPositionBuffer.numItems = groupCount;

            // where on the texture it gets its information
            let uvPositionBuffer = s._uvPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
            groupSize = 2;
            let uvs = s._uvs = new Float32Array(groupCount * groupSize);
            for (i = 0, l = uvs.length; i < l; i += groupSize) {
                uvs[i] = uvs[i + 1] = 0;
            }
            gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
            uvPositionBuffer.itemSize = groupSize;
            uvPositionBuffer.numItems = groupCount;

            // what texture it should use
            let textureIndexBuffer = s._textureIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
            groupSize = 1;
            let indices = s._indices = new Float32Array(groupCount * groupSize);
            for (i = 0, l = indices.length; i < l; i++) {
                indices[i] = 0;
            }
            gl.bufferData(gl.ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
            textureIndexBuffer.itemSize = groupSize;
            textureIndexBuffer.numItems = groupCount;

            // what alpha it should have
            let alphaBuffer = s._alphaBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
            groupSize = 1;
            let alphas = s._alphas = new Float32Array(groupCount * groupSize);
            for (i = 0, l = alphas.length; i < l; i++) {
                alphas[i] = 1;
            }
            gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
            alphaBuffer.itemSize = groupSize;
            alphaBuffer.numItems = groupCount;
        };

        public _storeID = 0;

        public _createTexture(texData: any) {
            let s = this;
            let storeID = s._storeID++;
            let texture:any;
            if (storeID < s._batchTextureCount) {
                texture=s._batchTextures[storeID];
            } else {
                texture=s.getBaseTexture();
            }
            texture._activeIndex = -1;
            s._textureDictionary[storeID]=texture;
            texData._storeID = storeID;
            texture._storeID = storeID;
            texture._imageData = texData;
            return texture;
        };

        public _pushTextureToBatch(texture: any) {
            let s = this;
            if (texture._activeIndex == -1 || s._batchTextures[texture._activeIndex] != texture) {
                let found = -1;
                let start = (s._lastTextureInsert + 1) % s._batchTextureCount;
                let look = start;
                do {
                    if (s._batchTextures[look]._batchID != s._batchID) {
                        found = look;
                        break;
                    }
                    look = (look + 1) % s._batchTextureCount;
                } while (look !== start);
                if (found == -1) {
                    s._drawBuffers();
                    s.batchCardCount = 0;
                    found = start;
                }
                texture._activeIndex = found;
                s._lastTextureInsert = found;
                s._batchTextures[found] = texture;
                s._updateTextureData(texture);
            } else {
                //看看是滞需要更新贴图
                //s._updateTextureImageData(texture);
            }
            texture._batchID = s._batchID;
        };

        public _updateTextureData(texture: any) {
            let s = this;
            let gl = s._ctx;
            gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            s.setTextureParams();
            try {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture._imageData);
            } catch (e) {
            }
        };

        public _killTextureObject(texture: any) {
            if (!texture) {
                return;
            }
            let s = this;
            let gl = s._ctx;
            if (texture._storeID !== undefined) {
                delete s._textureDictionary[texture._storeID];
                delete texture._imageData._storeID;
                delete texture._storeID;
                try {
                    if (texture._frameBuffer) {
                        gl.deleteFramebuffer(texture._frameBuffer);
                        delete texture._frameBuffer;
                    }
                } catch (e) {
                }
                try {
                    gl.deleteTexture(texture);
                } catch (e) {

                }
            }
        };

        public batchCardCount: number = 0;
        public _drawBatchGroup(container: annie.Sprite) {
            let s = this;
            let subL, subT, subR, subB;
            let l = container.children.length;
            for (let i = 0; i < l; i++) {
                let item: any = container.children[i];
                if (!item._visible || item._cAlpha < 0) {
                    continue;
                }
                if (item.children && !item._isCache) {
                    s._drawBatchGroup(item);
                    continue;
                }
                let image = item._texture;
                if (!image || image.width <= 0) {
                    continue;
                }
                if (s.batchCardCount + 1 > s._maxCardsPerBatch) {
                    s._drawBuffers();
                    s.batchCardCount = 0;
                }
                let uvRect: any, texIndex, texture, drawRect;
                let uvs = s._uvs;
                let vertices = s._vertices;
                let texI = s._indices;
                let alphas = s._alphas;
                if (image._storeID == void 0) {
                    texture = s._createTexture(image);
                } else {
                    texture = s._textureDictionary[image._storeID];
                    if (!texture) {
                        continue;
                    }
                }
                drawRect = item._a2x_drawRect;
                s._pushTextureToBatch(texture);
                texIndex = texture._activeIndex;
                if (drawRect.isSheetSprite){
                    // calculate uvs
                    if (!item._uvRect) {
                        item._uvRect = {};
                    }

                    uvRect = item._uvRect;
                    uvRect.t = (drawRect.y) / image.height;
                    uvRect.l = (drawRect.x) / image.width;
                    uvRect.b = (drawRect.y + drawRect.h) / image.height;
                    uvRect.r = (drawRect.x + drawRect.w) / image.width;
                    // calculate vertices
                    subL = 0;
                    subT = 0;
                    subR = drawRect.w + subL;
                    subB = drawRect.h + subT;
                } else {
                    // calculate uvs
                    uvRect = WebGLRender.UV_RECT;
                    // calculate vertices
                    subL = 0;
                    subT = 0;
                    subR = image.width + subL;
                    subB = image.height + subT;
                }
                let offV1 = s.batchCardCount * WebGLRender.INDICIES_PER_CARD;
                let offV2 = offV1<<1;
                let iMtx = item._cMatrix;
                vertices[offV2] = subL * iMtx.a + subT * iMtx.c + iMtx.tx;
                vertices[offV2 + 1] = subL * iMtx.b + subT * iMtx.d + iMtx.ty;
                vertices[offV2 + 2] = subL * iMtx.a + subB * iMtx.c + iMtx.tx;
                vertices[offV2 + 3] = subL * iMtx.b + subB * iMtx.d + iMtx.ty;
                vertices[offV2 + 4] = subR * iMtx.a + subT * iMtx.c + iMtx.tx;
                vertices[offV2 + 5] = subR * iMtx.b + subT * iMtx.d + iMtx.ty;
                vertices[offV2 + 6] = vertices[offV2 + 2];
                vertices[offV2 + 7] = vertices[offV2 + 3];
                vertices[offV2 + 8] = vertices[offV2 + 4];
                vertices[offV2 + 9] = vertices[offV2 + 5];
                vertices[offV2 + 10] = subR * iMtx.a + subB * iMtx.c + iMtx.tx;
                vertices[offV2 + 11] = subR * iMtx.b + subB * iMtx.d + iMtx.ty;
                // apply uvs
                uvs[offV2] = uvRect.l;
                uvs[offV2 + 1] = uvRect.t;
                uvs[offV2 + 2] = uvRect.l;
                uvs[offV2 + 3] = uvRect.b;
                uvs[offV2 + 4] = uvRect.r;
                uvs[offV2 + 5] = uvRect.t;
                uvs[offV2 + 6] = uvRect.l;
                uvs[offV2 + 7] = uvRect.b;
                uvs[offV2 + 8] = uvRect.r;
                uvs[offV2 + 9] = uvRect.t;
                uvs[offV2 + 10] = uvRect.r;
                uvs[offV2 + 11] = uvRect.b;
                // apply texture
                texI[offV1] = texI[offV1 + 1] = texI[offV1 + 2] = texI[offV1 + 3] = texI[offV1 + 4] = texI[offV1 + 5] = texIndex;
                // apply alpha
                alphas[offV1] = alphas[offV1 + 1] = alphas[offV1 + 2] = alphas[offV1 + 3] = alphas[offV1 + 4] = alphas[offV1 + 5] = item._cAlpha;
                s.batchCardCount++;
            }
        };

        public _drawBuffers() {
            let s = this;
            let gl = s._ctx;
            if (s.batchCardCount <= 0) {
                return;
            }
            let shaderProgram = s._activeShader;
            let vertexPositionBuffer = s._vertexPositionBuffer;
            let textureIndexBuffer = s._textureIndexBuffer;
            let uvPositionBuffer = s._uvPositionBuffer;
            let alphaBuffer = s._alphaBuffer;
            //gl.useProgram(shaderProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, s._vertices);
            gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
            gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, textureIndexBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, s._indices);
            gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, s._uvs);
            gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
            gl.vertexAttribPointer(shaderProgram.alphaAttribute, alphaBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, s._alphas);
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, s._projectionMatrix);
            for (let i = 0; i < s._batchTextureCount; i++) {
                let texture = s._batchTextures[i];
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                s.setTextureParams();
            }
            gl.drawArrays(gl.TRIANGLES, 0, s.batchCardCount * WebGLRender.INDICIES_PER_CARD);
            s._batchID++;
            if (s._batchID == Number.MAX_VALUE) {
                s._batchID = 0;
            }
        };
    }
}