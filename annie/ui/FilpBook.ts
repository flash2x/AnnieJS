namespace annieUI {
    import Bitmap=annie.Bitmap;
    import Sprite=annie.Sprite;
    import Shape=annie.Shape;
    import Event=annie.Event;
    import MouseEvent=annie.MouseEvent;
    import Matrix=annie.Matrix;
    import Point=annie.Point;
    export class FlipBook extends Sprite {
        //可设置或可调用接口,页数以单页数计算~
        public book_initpage: Number = 0;//初始化到第N页
        public book_totalpage: Number = 0;//总页数
        public book_page: Number = 0;//当前页
        private book_width: Number;
        private book_height: Number;
        private book_topage: Number;
        private book_CrossGap: Number;
        private bookArray_layer1: Array;
        private bookArray_layer2: Array;
        private book_TimerFlag: String = "stop";
        private book_TimerArg0: Number = 0;
        private book_TimerArg1: Number = 0;
        private book_px: Number = 0;
        private book_py: Number = 0;
        private book_toposArray: Array;
        private book_myposArray: Array;
        private Bmp0: any=new Image();
        private Bmp1: any=new Image();
        private pageMC: Sprite = new Sprite();
        private leftPage: Sprite = null;
        private rightPage: Sprite = null;
        private render0: Shape = new Shape();
        private render1: Shape = new Shape();
        private shadow0: Shape = new Shape();
        private shadow1: Shape = new Shape();
        private Mask0: Shape = new Shape();
        private Mask1: Shape = new Shape();
        private p1: Point;
        private p2: Point;
        private p3: Point;
        private p4: Point;
        private limit_point1: Point;
        private limit_point2: Point;
        private pages: Array = [];
        private stageMP: Point = new Point();
        public constructor() {
            super();
            let s = this;
            s._instanceType = "annieUI.FlipBook";
            /*        for(let i=0;i<11;i++){
             let p=new OnePage();
             p.page_txt.text="第"+i+"页";
             this.pages[i]=p;
             }
             this.InitBook(320,640,this.pages);*/
        }

        /**
         * init Parts
         */
        public InitBook(width: Number, height: Number, pages: Array): void {
            let s = this;
            s.book_width = width;
            s.book_height = height;
            s.book_totalpage = pages.length;
            s.book_page = s.book_topage = s.book_initpage;
            s.book_CrossGap = Math.sqrt(s.book_width * s.book_width + s.book_height * s.book_height);
            s.p1 = new Point(0, 0);
            s.p2 = new Point(0, s.book_height);
            s.p3 = new Point(s.book_width + s.book_width, 0);
            s.p4 = new Point(s.book_width + s.book_width, s.book_height);
            s.limit_point1 = new Point(s.book_width, 0);
            s.limit_point2 = new Point(s.book_width, s.book_height);
            s.book_toposArray = [s.p3, s.p4, s.p1, s.p2];
            s.book_myposArray = [s.p1, s.p2, s.p3, s.p4];
            s.addChild(s.pageMC);
            s.addChild(s.Mask0);
            s.addChild(s.Mask1);
            s.addChild(s.render0);
            s.addChild(s.shadow0);
            s.addChild(s.render1);
            s.addChild(s.shadow1);
            s.SetPageMC(s.book_page);
            s.stage.addEventListener(MouseEvent.MOUSE_DOWN, s.MouseOnDown.bind(this));
            s.stage.addEventListener(MouseEvent.MOUSE_UP, s.MouseOnUp.bind(this));
            s.stage.addEventListener(MouseEvent.MOUSE_MOVE, s.MouseOnMove.bind(this));
            s.addEventListener(Event.ENTER_FRAME, s.bookTimerHandler.bind(this));
        }

        /**
         * DrawPage Parts
         * @param    num
         * @param    _movePoint
         * @param    bmp1
         * @param    bmp2
         */
        private DrawPage(num: Number, _movePoint: Point): void {
            let s = this;
            let _actionPoint: Point;
            let book_array: Array;
            let book_Matrix1: Matrix = new Matrix();
            let book_Matrix2: Matrix = new Matrix();
            let Matrix_angle: Number;
            if (num == 1) {
                _movePoint = s.CheckLimit(_movePoint, s.limit_point1, s.book_width);
                _movePoint = s.CheckLimit(_movePoint, s.limit_point2, s.book_CrossGap);
                book_array = s.GetBook_array(_movePoint, s.p1, s.p2);
                _actionPoint = book_array[1];
                s.GeLayer_array(_movePoint, _actionPoint, s.p1, s.p2, s.limit_point1, s.limit_point2);
                s.DrawShadowShape(s.shadow0, s.Mask0, s.book_width * 1.5, s.book_height * 4, s.p1, _movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.DrawShadowShape(s.shadow1, s.Mask1, s.book_width * 1.5, s.book_height * 4, s.p1, _movePoint, s.bookArray_layer1, 0.45);
                Matrix_angle = s.angle(_movePoint, _actionPoint) + 90;
                book_Matrix1.rotate((Matrix_angle / 180) * Math.PI);
                book_Matrix1.tx = book_array[3].x;
                book_Matrix1.ty = book_array[3].y;
                book_Matrix2.tx = s.p1.x;
                book_Matrix2.ty = s.p1.y;
            } else if (num == 2) {
                _movePoint = s.CheckLimit(_movePoint, s.limit_point2, s.book_width);
                _movePoint = s.CheckLimit(_movePoint, s.limit_point1, s.book_CrossGap);
                book_array = s.GetBook_array(_movePoint, s.p2, s.p1);
                _actionPoint = book_array[1];
                s.GeLayer_array(_movePoint, _actionPoint, s.p2, s.p1, s.limit_point2, s.limit_point1);
                s.DrawShadowShape(s.shadow0, s.Mask0, s.book_width * 1.5, s.book_height * 4, s.p2, _movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.DrawShadowShape(s.shadow1, s.Mask1, s.book_width * 1.5, s.book_height * 4, s.p2, _movePoint, s.bookArray_layer1, 0.45);
                Matrix_angle = s.angle(_movePoint, _actionPoint) - 90;
                book_Matrix1.rotate((Matrix_angle / 180) * Math.PI);
                book_Matrix1.tx = book_array[2].x;
                book_Matrix1.ty = book_array[2].y;
                book_Matrix2.tx = s.p1.x;
                book_Matrix2.ty = s.p1.y;
            } else if (num == 3) {
                _movePoint = s.CheckLimit(_movePoint, s.limit_point1, s.book_width);
                _movePoint = s.CheckLimit(_movePoint, s.limit_point2, s.book_CrossGap);
                book_array = s.GetBook_array(_movePoint, s.p3, s.p4);
                _actionPoint = book_array[1];
                s.GeLayer_array(_movePoint, _actionPoint, s.p3, s.p4, s.limit_point1, s.limit_point2);
                s.DrawShadowShape(s.shadow0, s.Mask0, s.book_width * 1.5, s.book_height * 4, s.p3, _movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.DrawShadowShape(s.shadow1, s.Mask1, s.book_width * 1.5, s.book_height * 4, s.p3, _movePoint, s.bookArray_layer1, 0.4);
                Matrix_angle = s.angle(_movePoint, _actionPoint) + 90;
                book_Matrix1.rotate((Matrix_angle / 180) * Math.PI);
                book_Matrix1.tx = _movePoint.x;
                book_Matrix1.ty = _movePoint.y;
                book_Matrix2.tx = s.limit_point1.x;
                book_Matrix2.ty = s.limit_point1.y;
            } else {
                _movePoint = s.CheckLimit(_movePoint, s.limit_point2, s.book_width);
                _movePoint = s.CheckLimit(_movePoint, s.limit_point1, s.book_CrossGap);
                book_array = s.GetBook_array(_movePoint, s.p4, s.p3);
                _actionPoint = book_array[1];
                s.GeLayer_array(_movePoint, _actionPoint, s.p4, s.p3, s.limit_point2, s.limit_point1);
                s.DrawShadowShape(s.shadow0, s.Mask0, s.book_width * 1.5, s.book_height * 4, s.p4, _movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.DrawShadowShape(s.shadow1, s.Mask1, s.book_width * 1.5, s.book_height * 4, s.p4, _movePoint, s.bookArray_layer1, 0.4);
                Matrix_angle = s.angle(_movePoint, _actionPoint) - 90;
                book_Matrix1.rotate((Matrix_angle / 180) * Math.PI);
                book_Matrix1.tx = _actionPoint.x;
                book_Matrix1.ty = _actionPoint.y;
                book_Matrix2.tx = s.limit_point1.x;
                book_Matrix2.ty = s.limit_point1.y;
            }
            s.DrawShape(s.render1, s.bookArray_layer1, s.Bmp0, book_Matrix1);
            s.DrawShape(s.render0, s.bookArray_layer2, s.Bmp1, book_Matrix2);
        }

        private CheckLimit($point: Point, $limitPoint: Point, $limitGap: Number): Point {
            let s = this;
            let $Gap: Number = Math.abs(s.pos($limitPoint, $point));
            let $Angle: Number = s.angle($limitPoint, $point);
            if ($Gap > $limitGap) {
                let $tmp1: Number = $limitGap * Math.sin(($Angle / 180) * Math.PI);
                let $tmp2: Number = $limitGap * Math.cos(($Angle / 180) * Math.PI);
                $point = new Point($limitPoint.x - $tmp2, $limitPoint.y - $tmp1);
            }
            return $point;
        }

        private GetBook_array($point: Point, $actionPoint1: Point, $actionPoint2: Point): Array {
            let s = this;
            let array_return: Array = [];
            let $Gap1: Number = Math.abs(s.pos($actionPoint1, $point) * 0.5);
            let $Angle1: Number = s.angle($actionPoint1, $point);
            let $tmp1_2: Number = $Gap1 / Math.cos(($Angle1 / 180) * Math.PI);
            let $tmp_point1: Point = new Point($actionPoint1.x - $tmp1_2, $actionPoint1.y);
            let $Angle2: Number = s.angle($point, $tmp_point1) - s.angle($point, $actionPoint2);
            let $Gap2: Number = s.pos($point, $actionPoint2);
            let $tmp2_1: Number = $Gap2 * Math.sin(($Angle2 / 180) * Math.PI);
            let $tmp2_2: Number = $Gap2 * Math.cos(($Angle2 / 180) * Math.PI);
            let $tmp_point2: Point = new Point($actionPoint1.x + $tmp2_2, $actionPoint1.y + $tmp2_1);
            let $Angle3: Number = s.angle($tmp_point1, $point);
            let $tmp3_1: Number = s.book_width * Math.sin(($Angle3 / 180) * Math.PI);
            let $tmp3_2: Number = s.book_width * Math.cos(($Angle3 / 180) * Math.PI);
            let $tmp_point3: Point = new Point($tmp_point2.x + $tmp3_2, $tmp_point2.y + $tmp3_1);
            let $tmp_point4: Point = new Point($point.x + $tmp3_2, $point.y + $tmp3_1);
            array_return.push($point);
            array_return.push($tmp_point2);
            array_return.push($tmp_point3);
            array_return.push($tmp_point4);
            return array_return;
        }

        private GeLayer_array($point1: Point, $point2: Point, $actionPoint1: Point, $actionPoint2: Point, $limitPoint1: Point, $limitPoint2: Point): void {
            let s = this;
            let array_layer1: Array = [];
            let array_layer2: Array = [];
            let $Gap1: Number = Math.abs(s.pos($actionPoint1, $point1) * 0.5);
            let $Angle1: Number = s.angle($actionPoint1, $point1);
            let $tmp1_1: Number = $Gap1 / Math.sin(($Angle1 / 180) * Math.PI);
            let $tmp1_2: Number = $Gap1 / Math.cos(($Angle1 / 180) * Math.PI);
            let $tmp_point1: Point = new Point($actionPoint1.x - $tmp1_2, $actionPoint1.y);
            let $tmp_point2: Point = new Point($actionPoint1.x, $actionPoint1.y - $tmp1_1);
            let $tmp_point3: Point = $point2;
            let $Gap2: Number = Math.abs(s.pos($point1, $actionPoint2));
            //-
            if ($Gap2 > s.book_height) {
                array_layer1.push($tmp_point3);
                //
                let $pos: Number = Math.abs(s.pos($tmp_point3, $actionPoint2) * 0.5);
                let $tmp3: Number = $pos / Math.cos(($Angle1 / 180) * Math.PI);
                $tmp_point2 = new Point($actionPoint2.x - $tmp3, $actionPoint2.y);

            } else {
                array_layer2.push($actionPoint2);
            }
            array_layer1.push($tmp_point2);
            array_layer1.push($tmp_point1);
            array_layer1.push($point1);
            s.bookArray_layer1 = array_layer1;
            array_layer2.push($limitPoint2);
            array_layer2.push($limitPoint1);
            array_layer2.push($tmp_point1);
            array_layer2.push($tmp_point2);
            s.bookArray_layer2 = array_layer2;
        }

        private DrawShape(shape: Shape, point_array: Array, myBmp: any=null, mat: Matrix=null): void {
            let num: number = point_array.length;
            shape.clear();
            if(myBmp) {
                shape.beginBitmapFill(myBmp, mat);
            }else{
                shape.beginFill("#000");
            }
            shape.moveTo(point_array[0].x, point_array[0].y);
            for (let i: number = 1; i < num; i++) {
                shape.lineTo(point_array[i].x, point_array[i].y);
            }
            shape.endFill();
        }

        private DrawShadowShape(shape: Shape, maskShape: Shape, g_width: Number, g_height: Number, $point1: Point, $point2: Point, $maskArray: Array, $arg: Number): void {
            let colors: Array = [0x0, 0x0];
            let alphas1: Array = [0, 0.5];
            let alphas2: Array = [0.5, 0];
            let ratios: Array = [0, 255];
            let matr: Matrix = new Matrix();
            let myscale: Number;
            let myalpha: Number;
            let s = this;
            shape.clear();
            //matr.createGradientBox(g_width, g_height, (0 / 180) * Math.PI, -g_width * 0.5, -g_height * 0.5);
            shape.beginLinearGradientFill(colors, alphas1, ratios);
            shape.drawRect(-g_width * 0.5, -g_height * 0.5, g_width * 0.5, g_height);
            shape.beginLinearGradientFill(colors, alphas2, ratios);
            shape.drawRect(0, -g_height * 0.5, g_width * 0.5, g_height);
            shape.x = $point2.x + ($point1.x - $point2.x) * $arg;
            shape.y = $point2.y + ($point1.y - $point2.y) * $arg;
            shape.rotation = s.angle($point1, $point2);
            myscale = Math.abs($point1.x - $point2.x) * 0.5 / s.book_width;
            myalpha = 1 - myscale * myscale;
            shape.scaleX = myscale + 0.1;
            shape.alpha = myalpha + 0.1;
            s.DrawShape(maskShape, $maskArray);
            shape.mask = maskShape;
        }

        private SetPageMC(pageNum: Number): void {
            let s = this;
            s.pageMC.removeAllChildren();
            if (pageNum > 0 && pageNum < s.book_totalpage) {
                this.leftPage = this.pages[pageNum];
                this.leftPage.x = this.leftPage.y = 0;
                this.pageMC.addChild(this.leftPage);
            }
            if ((pageNum + 1) > 0 && (pageNum + 1) < s.book_totalpage) {
                this.rightPage = this.pages[pageNum + 1];
                this.rightPage.x = s.book_width;
                this.rightPage.y = 0;
                this.pageMC.addChild(this.rightPage);
            }
        }

        /**
         * MouseEvent Parts
         * @param    evt
         */
        private MouseOnDown(evt: MouseEvent): void {
            let s = this;
            if (s.book_TimerFlag != "stop") {
                //不处于静止状态
                return;
            }
            //mouseOnDown时取area绝对值;
            var p:Point=s.globalToLocal(s.stageMP);
            book_TimerArg0 = s.MouseFindArea(p);
            book_TimerArg0 = book_TimerArg0 < 0 ? -book_TimerArg0 : book_TimerArg0;
            if (book_TimerArg0 == 0) {
                //不在area区域
                return;
            } else if ((book_TimerArg0 == 1 || book_TimerArg0 == 2) && s.book_page <= 1) {
                //向左翻到顶
                return;
            } else if ((book_TimerArg0 == 3 || book_TimerArg0 == 4) && s.book_page >= s.book_totalpage) {
                //向右翻到顶
                return;
            } else {
                s.book_TimerFlag = "startplay";
                s.PageUp();
            }
        }

        private MouseOnUp(evt: MouseEvent): void {
            let s = this;
            if (s.book_TimerFlag == "startplay") {
                //处于mousedown状态时
                s.book_TimerArg1 =s.MouseFindArea(new Point(evt.localX, evt.localY));
                s.book_TimerFlag = "autoplay";
            }
        }
        private MouseOnMove(evt: MouseEvent): void {
            let s = this;
            if (s.book_TimerFlag == "startplay") {
               s.stageMP.x=evt.stageX;
               s.stageMP.y=evt.stageY;
            }
        }

        private MouseFindArea(point: Point): Number {
            /* 取下面的四个区域,返回数值:
             *
             *  | -1|     |     | -3 |
             *  |---      |      |
             *  |     1   |   3      |
             *  |-|--|
             *  |     2   |   4      |
             *  |     |      |
             *  | -2 |    |     | -4 |
             *
             */
            let s = this;
            let tmpn: Number;
            let minx: Number = 0;
            let maxx: Number = s.book_width + s.book_width;
            let miny: Number = 0;
            let maxy: Number = s.book_height;
            let areaNum: Number = 50;

            if (point.x > minx && point.x <= maxx * 0.5) {
                tmpn = (point.y > miny && point.y <= (maxy * 0.5)) ? 1 : (point.y > (maxy * 0.5) && point.y < maxy) ? 2 : 0;
                if (point.x <= (minx + areaNum)) {
                    tmpn = (point.y > miny && point.y <= (miny + areaNum)) ? -1 : (point.y > (maxy - areaNum) && point.y < maxy) ? -2 : tmpn;
                }
                return tmpn;
            } else if (point.x > (maxx * 0.5) && point.x < maxx) {
                tmpn = (point.y > miny && point.y <= (maxy * 0.5)) ? 3 : (point.y > (maxy * 0.5) && point.y < maxy) ? 4 : 0;
                if (point.x >= (maxx - areaNum)) {
                    tmpn = (point.y > miny && point.y <= (miny + areaNum)) ? -3 : (point.y > (maxy - areaNum) && point.y < maxy) ? -4 : tmpn;
                }
                return tmpn;
            }
            return 0;
        }

        /**
         * Page Parts
         * @param    topage
         */
        public PageGoto(topage: Number): void {
            let n: Number;
            let s = this;
            topage = topage % 2 == 1 ? topage - 1 : topage;
            n = topage - s.book_page;
            if (s.book_TimerFlag == "stop" && topage >= 0 && topage < s.book_totalpage && n != 0) {
                s.book_TimerArg0 = n < 0 ? 1 : 3;
                s.book_TimerArg1 = -1;
                s.book_topage = topage > s.book_totalpage ? s.book_totalpage : topage;
                s.book_TimerFlag = "autoplay";
                s.PageUp();
            }
        }
        public PageDraw(pageNum: Number): string {
            let s=this;
            if (pageNum > 0 && pageNum < s.book_totalpage) {
                return annie.toDisplayDataURL(this.pages[pageNum],new annie.Rectangle(0,0,s.book_width,s.book_height));
            }
        }
        private PageUp(): void {
            let s = this;
            let page1: Number;
            let page2: Number;
            let point_mypos: Point = s.book_myposArray[s.book_TimerArg0 - 1];
            let p: Sprite = null;
            if (s.book_TimerArg0 == 1 || s.book_TimerArg0 == 2) {
                s.book_topage = s.book_topage == s.book_page ? s.book_page - 2 : s.book_topage;
                page1 = s.book_page;
                page2 = s.book_topage + 1;
                this.pageMC.removeChild(this.leftPage);
                if (s.book_page - 2 > 0) {
                    p = this.pages[s.book_page - 2];
                    p.x = 0;
                    this.leftPage = p;
                    this.pageMC.addChild(p);
                }
                ;
            } else if (s.book_TimerArg0 == 3 || s.book_TimerArg0 == 4) {
                s.book_topage = s.book_topage == s.book_page ? s.book_page + 2 : s.book_topage;
                page1 = s.book_page + 1;
                page2 = s.book_topage;
                this.pageMC.removeChild(this.rightPage);
                if (s.book_page + 3 < this.book_totalpage) {
                    p = this.pages[s.book_page + 3];
                    p.x = this.book_width;
                    this.rightPage = p;
                    this.pageMC.addChild(p);
                }
                ;
            }
            s.book_px = point_mypos.x;
            s.book_py = point_mypos.y;
            s.Bmp0.src = s.PageDraw(page1);
            s.Bmp1.src = s.PageDraw(page2);
        }

        /**
         * Timer Parts
         * @param    event
         */
        private bookTimerHandler(event: Event): void {
            let s = this;
            let point_topos: Point = s.book_toposArray[s.book_TimerArg0 - 1];
            let point_mypos: Point = s.book_myposArray[s.book_TimerArg0 - 1];
            let tox: Number;
            let toy: Number;
            let toflag: Number;
            let tmpx: Number;
            let tmpy: Number;
            let u: number;
            if (s.book_TimerFlag == "startplay") {
                u = 0.4;
                s.render0.clear();
                s.render1.clear();
                var p=s.globalToLocal(s.stageMP);
                s.book_px = ((p.x - s.book_px) * u + s.book_px) >> 0;
                s.book_py = ((p.y- s.book_py) * u + s.book_py) >> 0;
                s.DrawPage(s.book_TimerArg0, new Point(s.book_px, s.book_py));
                //book_timer.stop();
            } else if (s.book_TimerFlag == "autoplay") {
                s.render0.clear();
                s.render1.clear();
                if (Math.abs(point_topos.x - s.book_px) > s.book_width && s.book_TimerArg1 > 0) {
                    //不处于点翻区域并且翻页不过中线时
                    tox = point_mypos.x;
                    toy = point_mypos.y;
                    toflag = 0;
                } else {
                    tox = point_topos.x;
                    toy = point_topos.y;
                    toflag = 1;
                }
                tmpx = (tox - s.book_px) >> 0;
                tmpy = (toy - s.book_py) >> 0;
                if (s.book_TimerArg1 < 0) {
                    //处于点翻区域时
                    u = 0.3;//降低加速度
                    s.book_py = s.Arc(s.book_width, tmpx, point_topos.y);
                } else {
                    u = 0.4;//原始加速度
                    s.book_py = tmpy * u + s.book_py;
                }
                s.book_px = tmpx * u + s.book_px;
                s.DrawPage(s.book_TimerArg0, new Point(s.book_px, s.book_py));
                if (tmpx == 0 && tmpy == 0){
                    s.render0.clear();
                    s.render1.clear();
                    s.shadow0.clear();
                    s.shadow1.clear();
                    s.book_topage = toflag == 0 ? s.book_page : s.book_topage;
                    s.book_page = s.book_topage;
                    s.SetPageMC(s.book_page);
                    //恢得静止状
                    s.book_TimerFlag = "stop";
                }
            }
        }

        /**
         * Tools Parts
         * @param    arg_R
         * @param    arg_N1
         * @param    arg_N2
         * @return
         */
        private Arc(arg_R: Number, arg_N1: Number, arg_N2: Number): Number {
            //--圆弧算法---
            let arg: Number = arg_R * 2;
            let r: Number = arg_R * arg_R + arg * arg;
            let a: Number = Math.abs(arg_N1) - arg_R;
            let R_arg: Number = arg_N2 - (Math.sqrt(r - a * a) - arg);
            return R_arg;
        }

        private angle(target1: Point, target2: Point): Number {
            let tmp_x: Number = target1.x - target2.x;
            let tmp_y: Number = target1.y - target2.y;
            let tmp_angle: Number = Math.atan2(tmp_y, tmp_x) * 180 / Math.PI;
            tmp_angle = tmp_angle < 0 ? tmp_angle + 360 : tmp_angle;
            return tmp_angle;
        }

        private pos(target1: Point, target2: Point): Number {
            let tmp_x: Number = target1.x - target2.x;
            let tmp_y: Number = target1.y - target2.y;
            let tmp_s: Number = Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
            return target1.x > target2.x ? tmp_s : -tmp_s;
        }
    }
}