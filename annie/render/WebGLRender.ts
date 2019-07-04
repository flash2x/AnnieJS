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
     * @since 1.0.0
     */
    export class WebGLRender extends AObject implements IRender {
        public bufferSize: number = 1 << 20;
        /**
         * 渲染器所在最上层的对象
         * @property rootContainer
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public rootContainer: any = null;
        /**
         * @property _ctx
         * @protected
         * @default null
         */
        protected _ctx: any;
        /**
         * @protected _stage
         * @protected
         * @default null
         */
        private _stage: Stage;
        private _dataLength: number = 0;
        private _dataBuffer: Float32Array = null;
        //WEGL
        public DEFAULT_PROGRAM: number = 0;
        public currentProgramId: number = 0;
        private curProgram: WebGLProgram;
        private programList: any = {};

        /**
         * @method WebGLRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        public constructor(stage: Stage) {
            super();
            this._instanceType = "annie.WebGLRender";
            this._stage = stage;
        }

        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        public begin(): void {
            let s = this;
            let gl = s._ctx;
            if (s._stage.bgColor != -1) {
                let color: any = s._stage._bgColorRGBA;
                gl.clearColor(color.r, color.g, color.b, color.a);
            } else {
                gl.clearColor(0, 0, 0, 0);
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
            s.clearDataStatus();
            s._dataLength = 0;
        }

        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        public beginMask(target: any): void {
            /* let s: WebGLRender = this;
             s._ctx.save();
             s._ctx.globalAlpha = 0;
             s.drawMask(target);
             s._ctx.clip();*/
        }

        private drawMask(target: any): void {
            /*let s = this;
            target.updateMatrix();
            let tm = target.cMatrix;
            s._ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            if (target._instanceType == "annie.Shape") {
                target._draw(s._ctx, true);
            } else if (target._instanceType == "annie.Sprite") {
                target._updateState = 0;
                for (let i = 0; i < target.children.length; i++) {
                    s.drawMask(target.children[i]);
                }
            } else if (target._instanceType == "annie.MovieClip") {
                target._frameState = 0;
                target._updateState = 0;
                for (let i = 0; i < target.children.length; i++) {
                    s.drawMask(target.children[i]);
                }
            }
            else {
                let bounds = target._bounds;
                s._ctx.rect(0, 0, bounds.width, bounds.height);
            }*/
        }

        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        public endMask(): void {
            //this._ctx.restore();
        }

        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        public draw(target: any): void {
            let s = this;
            let gl = s._ctx;
            let texture = target._texture;
            if (texture && texture.width > 0 && texture.height > 0) {
                let texId = s.setTexture(texture);
                if (texId < 0) {
                    //说明纹理通道用完了,这个时候画一次。
                    gl.bufferData(gl.ARRAY_BUFFER, s._dataBuffer.subarray(0, s._dataLength), gl.STATIC_DRAW);
                    gl.drawArrays(gl.TRIANGLES, 0, s._dataLength / 12);
                    //清除纹理状态
                    s.clearDataStatus();
                    s._dataLength = 0;
                    //继续获取texId
                    texId = s.setTexture(texture);
                }
                /////////////////////////
                let rect: Rectangle;
                if (target.rect && !target._isCache) {
                    rect = target.rect;
                } else {
                    rect = new Rectangle(0, 0, texture.width, target.height);
                }
                let w = rect.width;
                let h = rect.height;
                let tx = rect.x / texture.width;
                let ty = rect.y / texture.height;
                let tw = (rect.x + rect.width) / texture.width;
                let th = (rect.y + rect.height) / texture.height;
                let alpha = target.cAlpha;
                let a = target.cMatrix.a;
                let b = target.cMatrix.b;
                let c = target.cMatrix.c;
                let d = target.cMatrix.d;
                let x = target.cMatrix.tx;
                let y = target.cMatrix.ty;
                let dataArray = [
                    0, 0, tx, ty, texId, alpha, a, b, c, d, x, y,
                    w, 0, tw, ty, texId, alpha, a, b, c, d, x, y,
                    0, h, tx, th, texId, alpha, a, b, c, d, x, y,
                    0, h, tx, th, texId, alpha, a, b, c, d, x, y,
                    w, 0, tw, ty, texId, alpha, a, b, c, d, x, y,
                    w, h, tw, th, texId, alpha, a, b, c, d, x, y];
                if (s._dataLength > s.bufferSize - dataArray.length) {
                    //说明缓冲空间用完了,这个时候画一次。
                    gl.bufferData(gl.ARRAY_BUFFER, s._dataBuffer.subarray(0, s._dataLength), gl.STATIC_DRAW);
                    gl.drawArrays(gl.TRIANGLES, 0, s._dataLength / 12);
                    s._dataLength = 0;
                }
                for (let i = 0; i < dataArray.length; i++) {
                    s._dataBuffer[s._dataLength++] = dataArray[i];
                }
            }
        }

        public end() {
            let s = this;
            if (s._dataLength > 0) {
                let gl = s._ctx;
                gl.bufferData(gl.ARRAY_BUFFER, s._dataBuffer.subarray(0, s._dataLength), gl.STATIC_DRAW);
                gl.drawArrays(gl.TRIANGLES, 0, s._dataLength / 12);
            }
        }

        /**
         * 初始化渲染器
         * @public
         * @since 1.0.0
         * @method init
         */
        public init(): void {
            let s = this;
            if (!s.rootContainer) {
                s.rootContainer = document.createElement("canvas");
                s._stage.rootDiv.appendChild(s.rootContainer);
                s.rootContainer.id = "_a2x_canvas";
                s._ctx = s.rootContainer["getContext"]('webgl');
                if (!s._ctx) {
                    console.log("no support WebGL");
                    return;
                }
                s._dataBuffer = new Float32Array(s.bufferSize);
                let gl = s._ctx;
                s.initTextureCount();
                //创建program
                let program = s.createProgram(s.DEFAULT_PROGRAM);
                s.curProgram = program;
                //创建buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
                var positionLocation = gl.getAttribLocation(program, "a_position");
                var texUVIALocation = gl.getAttribLocation(program, "a_texUVIA");
                var matABCDLocation = gl.getAttribLocation(program, "a_matABCD");
                var matXYLocation = gl.getAttribLocation(program, "a_matXY");
                gl.enableVertexAttribArray(positionLocation);
                gl.enableVertexAttribArray(texUVIALocation);
                gl.enableVertexAttribArray(matABCDLocation);
                gl.enableVertexAttribArray(matXYLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 4 * 12, 0 * 4);
                gl.vertexAttribPointer(texUVIALocation, 4, gl.FLOAT, false, 4 * 12, 2 * 4);
                gl.vertexAttribPointer(matABCDLocation, 4, gl.FLOAT, false, 4 * 12, 6 * 4);
                gl.vertexAttribPointer(matXYLocation, 2, gl.FLOAT, false, 4 * 12, 10 * 4);
                //设置混合模式
                gl.enable(gl.BLEND);
                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            }
        }

        /**
         * 当舞台尺寸改变时会调用
         * @public
         * @since 1.0.0
         * @method reSize
         */
        public reSize(): void {
            let s = this;
            let c = s.rootContainer;
            c.width = s._stage.divWidth * devicePixelRatio;
            c.height = s._stage.divHeight * devicePixelRatio;
            c.style.width = s._stage.divWidth + "px";
            c.style.height = s._stage.divHeight + "px";
            let gl: any = s._ctx;
            gl.viewport(0, 0, c.width, c.height);
            let resolutionLocation = gl.getUniformLocation(s.curProgram, "u_resolution");
            gl.uniform2f(resolutionLocation, c.width, c.height);
        }

        public destroy(): void {
            let s = this;
            s.rootContainer = null;
            s._stage = null;
            s._ctx = null;
        }

        private createTextureCountScript(type: number): string {
            let s = this;
            if (type == 1) {
                let script = "uniform sampler2D u_texture0;\n";
                for (let i = 1; i < s.textureCount; i++) {
                    script += "uniform sampler2D u_texture" + i + ";\n";
                }
                return script;
            } else if (type == 2) {
                let script = "float ok0=float(v_texCoord[2]==0.0);\n";
                for (let i = 1; i < s.textureCount; i++) {
                    script += "float ok" + i + "=float(v_texCoord[2]==" + i + ".0);\n";
                }
                return script;
            } else if (type == 3) {
                let script = "gl_FragColor = texture2D(u_texture0, v_texCoord.xy)*ok0\n";
                for (let i = 1; i < s.textureCount; i++) {
                    script += "+texture2D(u_texture" + i + ", v_texCoord.xy)*ok" + i;
                }
                script += ";\n";
                return script;
            }
        }

        public createProgram(id: number): WebGLProgram {
            let s = this;
            let gl = s._ctx;
            if (s.programList["p" + id] == null) {
                let program = gl.createProgram();
                let vSource: string;
                let fSource: string;
                if (id == s.DEFAULT_PROGRAM) {
                    vSource = "attribute vec2 a_position;\n" +
                        "attribute vec4 a_texUVIA;\n" +
                        "attribute vec4 a_matABCD;\n" +
                        "attribute vec2 a_matXY;\n" +
                        "uniform vec2 u_resolution;\n" +
                        "varying vec4 v_texCoord;\n" +
                        "void main() {\n" +
                        "   mat3 matrix=mat3(a_matABCD[0],a_matABCD[1],0,a_matABCD[2],a_matABCD[3],0,a_matXY.x,a_matXY.y,1);\n" +
                        "   vec2 position=(matrix*vec3(a_position,1)).xy;\n" +
                        "   position = ((position/u_resolution)*2.0-1.0)* vec2(1, -1);\n" +
                        "   gl_Position = vec4(position,0,1);\n" +
                        "   v_texCoord = a_texUVIA;\n" +
                        "}";
                    fSource =
                        "precision mediump float;\n" +
                        s.createTextureCountScript(1) +
                        "varying vec4 v_texCoord;\n" +
                        "void main(){\n" +
                        s.createTextureCountScript(2) +
                        s.createTextureCountScript(3) +
                        "gl_FragColor.a*=v_texCoord[3];}";
                }
                let vertexShader = gl.createShader(gl.VERTEX_SHADER); // 创建着色器对象
                gl.shaderSource(vertexShader, vSource); // 提供数据源
                gl.compileShader(vertexShader); // 编译 -> 生成着色器
                gl.attachShader(program, vertexShader);
                let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 创建着色器对象
                gl.shaderSource(fragmentShader, fSource); // 提供数据源
                gl.compileShader(fragmentShader); // 编译 -> 生成着色器
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);
                gl.useProgram(program);
                s.programList["p" + id] = program;
            }
            s.currentProgramId = id;
            return s.programList["p" + id];
        }
        private textureList: Array<WebGLTexture> = [];
        private textureCount = 1;
        public initTextureCount(): void {
            let s = this;
            let gl = s._ctx;
            let i = 0;
            while (gl["TEXTURE" + i] != undefined) {
                i++;
            }
            //这个地方为什么只取一半的通道，如果取所有通道片元着色器会编译链接失败，原因待查
            s.textureCount = (i >> 1);
        }
        private dataStatus: Array<boolean> = [];
        private dataRefList: Array<any> = [];
        public clearDataStatus() {
            let s: any = this;
            for (let i = 0; i < s.textureCount; i++) {
                s.dataStatus[i] = false;
            }
        }
        public setTexture(data: any): number {
            let id: number = -1;
            let s: any = this;
            let gl: any = s._ctx;
            //是否绑定过,0也什是false,所以我们判断写法一定要注意
            if (data._webgl_tex_id>0) {
                id = data._webgl_tex_id;
                //看看此通道在当前渲染中是否已经被绑定过了
                if (!s.dataStatus[id]) {
                    //如果没有绑定其他资源，那么现在就绑定
                    s.dataStatus[id] = true;
                    if (s.dataRefList[id] == data) {
                        //如果发现这个通道的资源就是它
                        if (!data._webgl_data_changed) {
                            //这个资源发现没有任何更新,那就不要管他
                            return data._webgl_tex_id;
                        }
                    } else {
                        s.dataRefList[id] = data;
                    }
                } else {
                    //如果被绑定了，看看是不是自己之前绑定的
                    if (s.dataRefList[id] == data) {
                        //已经成功绑定过了
                        return data._webgl_tex_id;
                    }
                    //发现这个坑被人占了，那么需要重新给他找个坑
                    id = -1;
                }
            }
            if (id < 0) {
                //是否还有没用过的纹理通道
                for (let i = 0; i < s.textureCount; i++) {
                    if (this.dataRefList[i] == null) {
                        //找到了未使用的通道，将他分配给目前的资源
                        s.dataRefList[i] = data;
                        s.dataStatus[i] = true;
                        id = i;
                        break;
                    }
                }
                if (id < 0) {
                    return -1;
                }
            }
            gl.activeTexture(gl.TEXTURE0 + id);
            if (s.textureList[id] == null) {
                let texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                // Set the parameters so we can render any size image.
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                // 设置使用的纹理单元
                let u_image0Location = gl.getUniformLocation(s.curProgram, "u_texture" + id);
                gl.uniform1i(u_image0Location, id);  // 纹理单元
                s.textureList[id] = texture;
            }
            // Upload the image into the texture.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
            data._webgl_data_changed = false;
            data._webgl_tex_id = id;
            return data._webgl_tex_id;
        }
    }
}