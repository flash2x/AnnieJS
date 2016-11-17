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
        public totalPage: number = 0;
        public currPage: number = 0;
        private bW: number;
        private bH: number;
        private toPage: number;
        private crossGap: number;
        private layer1Arr: any;
        private layer0Arr: any;
        private state: String = "stop";
        private timerArg0: number = 0;
        private timerArg1: number = 0;
        private px: number = 0;
        private py: number = 0;
        private toPosArr: any;
        private myPosArr: any;
        private rPage0: Sprite = new Sprite();
        private rPage1: Sprite = new Sprite();
        private pageMC: Sprite = new Sprite();
        private leftPage: Sprite = null;
        private rightPage: Sprite = null;
        private rMask0: Shape = new Shape();
        private rMask1: Shape = new Shape();
        private shadow0: Shape = new Shape();
        private shadow1: Shape = new Shape();
        private sMask0: Shape = new Shape();
        private sMask1: Shape = new Shape();
        private p1: Point;
        private p2: Point;
        private p3: Point;
        private p4: Point;
        private limitP1: Point;
        private limitP2: Point;
        private pages: any = [];
        private stageMP: Point = new Point();
        private getPageCallback:Function;
        public constructor() {
            super();
            this._instanceType = "annieUI.FlipBook";
        }
        public init(width: number, height: number, pageCount: any,getPageCallBack:Function): void {
            let s = this;
            s.getPageCallback=getPageCallBack;
            s.bW = width;
            s.bH = height;
            s.totalPage = pageCount;
            s.currPage = s.toPage = 0;
            s.crossGap = Math.sqrt(s.bW * s.bW + s.bH * s.bH);
            s.p1 = new Point(0, 0);
            s.p2 = new Point(0, s.bH);
            s.p3 = new Point(s.bW + s.bW, 0);
            s.p4 = new Point(s.bW + s.bW, s.bH);
            s.limitP1 = new Point(s.bW, 0);
            s.limitP2 = new Point(s.bW, s.bH);
            s.toPosArr = [s.p3, s.p4, s.p1, s.p2];
            s.myPosArr = [s.p1, s.p2, s.p3, s.p4];
            s.addChild(s.pageMC);
            s.addChild(s.rPage0);
            s.addChild(s.shadow0);
            s.addChild(s.rPage1);
            s.addChild(s.shadow1);
            s.setShadowMask(s.shadow0,s.sMask0, s.bW * 1.5, s.bH * 3);
            s.setShadowMask(s.shadow1,s.sMask1, s.bW * 1.5, s.bH * 3);
            s.shadow0.visible = false;
            s.shadow1.visible = false;
            s.rPage1.mask=s.rMask1;
            s.rPage0.mask=s.rMask0;
            s.setPage(s.currPage);
            s.stage.addEventListener(MouseEvent.MOUSE_DOWN, s.onMouseDown.bind(s));
            s.stage.addEventListener(MouseEvent.MOUSE_UP, s.onMouseUp.bind(s));
            s.stage.addEventListener(MouseEvent.MOUSE_MOVE, s.onMouseMove.bind(s));
            s.addEventListener(Event.ENTER_FRAME, s.onEnterFrame.bind(s));
        }
        private drawPage(num: number, movePoint: Point): void {
            let s = this;
            let actionPoint: Point;
            let bArr: any;
            if (num == 1) {
                movePoint = s.checkLimit(movePoint, s.limitP1, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP2, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p1, s.p2);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p1, s.p2, s.limitP1, s.limitP2);
                s.getShadow(s.shadow0, s.sMask0,s.p1, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1,s.p1, movePoint, s.layer1Arr, 0.45);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) + 90;
                s.rPage1.x = bArr[3].x;
                s.rPage1.y = bArr[3].y;
                s.rPage0.x = s.p1.x;
                s.rPage0.y = s.p1.y;
            } else if (num == 2) {
                movePoint = s.checkLimit(movePoint, s.limitP2, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP1, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p2, s.p1);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p2, s.p1, s.limitP2, s.limitP1);
                s.getShadow(s.shadow0, s.sMask0, s.p2, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p2, movePoint, s.layer1Arr, 0.45);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) - 90;
                s.rPage1.x = bArr[2].x;
                s.rPage1.y = bArr[2].y;
                s.rPage0.x = s.p1.x;
                s.rPage0.y = s.p1.y;
            } else if (num == 3){
                movePoint = s.checkLimit(movePoint, s.limitP1, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP2, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p3, s.p4);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p3, s.p4, s.limitP1, s.limitP2);
                s.getShadow(s.shadow0, s.sMask0, s.p3, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p3, movePoint, s.layer1Arr, 0.4);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) + 90;
                s.rPage1.x = movePoint.x;
                s.rPage1.y = movePoint.y;
                s.rPage0.x = s.limitP1.x;
                s.rPage0.y = s.limitP1.y;
            } else {
                movePoint = s.checkLimit(movePoint, s.limitP2, s.bW);
                movePoint = s.checkLimit(movePoint, s.limitP1, s.crossGap);
                bArr = s.getBookArr(movePoint, s.p4, s.p3);
                actionPoint = bArr[1];
                s.getLayerArr(movePoint, actionPoint, s.p4, s.p3, s.limitP2, s.limitP1);
                s.getShadow(s.shadow0, s.sMask0, s.p4, movePoint, [s.p1, s.p3, s.p4, s.p2], 0.5);
                s.getShadow(s.shadow1, s.sMask1, s.p4, movePoint, s.layer1Arr, 0.4);
                s.rPage1.rotation = s.angle(movePoint, actionPoint) - 90;
                s.rPage1.x = actionPoint.x;
                s.rPage1.y = actionPoint.y;
                s.rPage0.x = s.limitP1.x;
                s.rPage0.y = s.limitP1.y;
            }
            s.getShape(s.rMask1, s.layer1Arr);
            s.getShape(s.rMask0, s.layer0Arr);
        }
        private checkLimit(point: Point, limitPoint: Point, limitGap: number): Point {
            let s = this;
            let gap: number = Math.abs(s.pos(limitPoint, point));
            let angle: number = s.angle(limitPoint, point);
            if (gap > limitGap) {
                let tmp1: number = limitGap * Math.sin((angle / 180) * Math.PI);
                let tmp2: number = limitGap * Math.cos((angle / 180) * Math.PI);
                point = new Point(limitPoint.x - tmp2, limitPoint.y - tmp1);
            }
            return point;
        }
        private getPage(index:number):any{
            let s=this;
            if(!s.pages[index-1]){
                s.pages[index-1]=s.getPageCallback(index);
            }
            return s.pages[index-1];
        }
        private getBookArr(point: Point, actionPoint1: Point, actionPoint2: Point): any {
            let s = this;
            let bArr: any = [];
            let gap1: number = Math.abs(s.pos(actionPoint1, point) * 0.5);
            let angle1: number = s.angle(actionPoint1, point);
            let tmp1_2: number = gap1 / Math.cos((angle1 / 180) * Math.PI);
            let tmpPoint1: Point = new Point(actionPoint1.x - tmp1_2, actionPoint1.y);
            let angle2: number = s.angle(point, tmpPoint1) - s.angle(point, actionPoint2);
            let gap2: number = s.pos(point, actionPoint2);
            let tmp2_1: number = gap2 * Math.sin((angle2 / 180) * Math.PI);
            let tmp2_2: number = gap2 * Math.cos((angle2 / 180) * Math.PI);
            let tmpPoint2: Point = new Point(actionPoint1.x + tmp2_2, actionPoint1.y + tmp2_1);
            let angle3: number = s.angle(tmpPoint1, point);
            let tmp3_1: number = s.bW * Math.sin((angle3 / 180) * Math.PI);
            let tmp3_2: number = s.bW * Math.cos((angle3 / 180) * Math.PI);
            let tmpPoint3: Point = new Point(tmpPoint2.x + tmp3_2, tmpPoint2.y + tmp3_1);
            let tmpPoint4: Point = new Point(point.x + tmp3_2, point.y + tmp3_1);
            bArr.push(point);
            bArr.push(tmpPoint2);
            bArr.push(tmpPoint3);
            bArr.push(tmpPoint4);
            return bArr;
        }
        private getLayerArr(point1: Point, point2: Point, actionPoint1: Point, actionPoint2: Point, limitPoint1: Point, limitPoint2: Point): void {
            let s = this;
            let arrLayer1: any = [];
            let arrLayer2: any = [];
            let gap1: number = Math.abs(s.pos(actionPoint1, point1) * 0.5);
            let angle1: number = s.angle(actionPoint1, point1);
            let tmp1_1: number = gap1 / Math.sin((angle1 / 180) * Math.PI);
            let tmp1_2: number = gap1 / Math.cos((angle1 / 180) * Math.PI);
            let tmpPoint1: Point = new Point(actionPoint1.x - tmp1_2, actionPoint1.y);
            let tmpPoint2: Point = new Point(actionPoint1.x, actionPoint1.y - tmp1_1);
            let tmpPoint3: Point = point2;
            let gap2: number = Math.abs(s.pos(point1, actionPoint2));
            if (gap2 > s.bH) {
                arrLayer1.push(tmpPoint3);
                let pos: number = Math.abs(s.pos(tmpPoint3, actionPoint2) * 0.5);
                let tmp3: number = pos / Math.cos((angle1 / 180) * Math.PI);
                tmpPoint2 = new Point(actionPoint2.x - tmp3, actionPoint2.y);
            } else {
                arrLayer2.push(actionPoint2);
            }
            arrLayer1.push(tmpPoint2);
            arrLayer1.push(tmpPoint1);
            arrLayer1.push(point1);
            s.layer1Arr = arrLayer1;
            arrLayer2.push(limitPoint2);
            arrLayer2.push(limitPoint1);
            arrLayer2.push(tmpPoint1);
            arrLayer2.push(tmpPoint2);
            s.layer0Arr = arrLayer2;
        }
        private getShape(shape: Shape, pointArr: any): void {
            let num: number = pointArr.length;
            shape.clear();
            shape.beginFill("#000");
            shape.moveTo(pointArr[0].x, pointArr[0].y);
            for (let i: number = 1; i < num; i++) {
                shape.lineTo(pointArr[i].x, pointArr[i].y);
            }
            shape.endFill();
        }
        private setShadowMask(shape:Shape,maskShape:Shape,g_width: number, g_height: number):void{
            shape.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"], [0, 1], [-g_width * 0.5, 4, g_width * 0.5, 4]);
            shape.drawRect(-g_width * 0.5, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
            shape.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"], [1, 0], [-g_width * 0.5, 4, g_width * 0.5, 4]);
            shape.drawRect(0, -g_height * 0.5, g_width * 0.5, g_height);
            shape.endFill();
            shape.mask = maskShape;
        }
        private getShadow(shape: Shape, maskShape: Shape, point1: Point, point2: Point, maskArray: any, arg: number): void {
            let myScale: number;
            let myAlpha: number;
            let s = this;
            shape.visible = true;
            shape.x = point2.x + (point1.x - point2.x) * arg;
            shape.y = point2.y + (point1.y - point2.y) * arg;
            shape.rotation = s.angle(point1, point2);
            myScale = Math.abs(point1.x - point2.x) * 0.5 / s.bW;
            myAlpha = 1 - myScale * myScale;
            shape.scaleX = myScale + 0.1;
            shape.alpha = myAlpha + 0.1;
            s.getShape(maskShape, maskArray);
        }
        private setPage(pageNum: number): void {
            let s = this;
            if (pageNum >0 && pageNum <= s.totalPage) {
                s.leftPage = s.getPage(pageNum);
                s.leftPage.x = s.leftPage.y = 0;
                s.pageMC.addChild(s.leftPage);
            }
            if((pageNum + 1) > 0 && (pageNum + 1) < s.totalPage) {
                s.rightPage = s.getPage(pageNum+1);
                s.rightPage.x = s.bW;
                s.rightPage.y = 0;
                s.pageMC.addChild(s.rightPage);
            }
        }
        private onMouseDown(e: MouseEvent): void {
            let s = this;
            if (s.state != "stop") {
                return;
            }
            s.stageMP.x = e.clientX;
            s.stageMP.y = e.clientY;
            var p: Point = s.globalToLocal(s.stageMP);
            s.timerArg0 = s.checkArea(p);
            s.timerArg0 = s.timerArg0 < 0 ? -s.timerArg0 : s.timerArg0;
            if (s.timerArg0 > 0) {
                if((s.timerArg0<3&&s.currPage>0)||(s.timerArg0>2&&s.currPage<=s.totalPage-2)){
                    s.state = "start";
                    s.flushPage();
                }
            }
        }
        private onMouseUp(e: MouseEvent): void {
            let s = this;
            s.stageMP.x = e.clientX;
            s.stageMP.y = e.clientY;
            if (s.state == "start") {
                var p: Point = s.globalToLocal(s.stageMP);
                s.timerArg1 = s.checkArea(p);
                s.state = "auto";
            }
        }

        private onMouseMove(e: MouseEvent): void {
            let s = this;
            if (s.state == "start") {
                s.stageMP.x = e.clientX;
                s.stageMP.y = e.clientY;
            }
        }

        private checkArea(point: Point): number {
            let s = this;
            let tmpN: number;
            let minX: number = 0;
            let maxX: number = s.bW + s.bW;
            let minY: number = 0;
            let maxY: number = s.bH;
            let areaNum: number = 50;
            if (point.x > minX && point.x <= maxX * 0.5) {
                tmpN = (point.y > minY && point.y <= (maxY * 0.5)) ? 1 : (point.y > (maxY * 0.5) && point.y < maxY) ? 2 : 0;
                if (point.x <= (minX + areaNum)) {
                    tmpN = (point.y > minY && point.y <= (minY + areaNum)) ? -1 : (point.y > (maxY - areaNum) && point.y < maxY) ? -2 : tmpN;
                }
                return tmpN;
            } else if (point.x > (maxX * 0.5) && point.x < maxX) {
                tmpN = (point.y > minY && point.y <= (maxY * 0.5)) ? 3 : (point.y > (maxY * 0.5) && point.y < maxY) ? 4 : 0;
                if (point.x >= (maxX - areaNum)) {
                    tmpN = (point.y > minY && point.y <= (minY + areaNum)) ? -3 : (point.y > (maxY - areaNum) && point.y < maxY) ? -4 : tmpN;
                }
                return tmpN;
            }
            return 0;
        }

        public flipTo(index: number): void {
            let n: number;
            let s = this;
            index = index % 2 == 1 ? index - 1 : index;
            n = index - s.currPage;
            if (s.state == "stop" && index >= 0 && index < s.totalPage && n != 0) {
                s.timerArg0 = n < 0 ? 1 : 3;
                s.timerArg1 = -1;
                s.toPage = index > s.totalPage ? s.totalPage : index;
                s.state = "auto";
                s.flushPage();
            }
        }
        private flushPage(): void {
            let s = this;
            let page0: number;
            let page1: number;
            let myPos: Point = s.myPosArr[s.timerArg0 - 1];
            let p: Sprite = null;
            if (s.timerArg0 == 1 || s.timerArg0 == 2) {
                s.toPage = s.toPage == s.currPage ? s.currPage - 2 : s.toPage;
                page0 = s.currPage;
                page1 = s.toPage + 1;
                this.pageMC.removeChild(this.leftPage);
                if (s.currPage - 2 > 0) {
                    p = s.getPage(s.currPage - 2);
                    p.x = 0;
                    this.leftPage = p;
                    this.pageMC.addChild(p);
                }
            } else if (s.timerArg0 == 3 || s.timerArg0 == 4) {
                s.toPage = s.toPage == s.currPage ? s.currPage + 2 : s.toPage;
                page0 = s.currPage + 1;
                page1 = s.toPage;
                this.pageMC.removeChild(this.rightPage);
                if (s.currPage + 3 < this.totalPage) {
                    p = s.getPage(s.currPage +3);
                    p.x = this.bW;
                    this.rightPage = p;
                    this.pageMC.addChild(p);
                }
            }
            s.px = myPos.x;
            s.py = myPos.y;
            if(page0>0&&page0<=s.totalPage) {
                p=s.getPage(page0);
                p.x = 0;
                p.y = 0;
                s.rPage0.addChild(p);
            }
            if(page1>0&&page1<=s.totalPage) {
                p=s.getPage(page1);
                p.x = 0;
                p.y = 0;
                s.rPage1.addChild(p);
            }
        }
        private onEnterFrame(e: Event): void {
            let s = this;
            let toPos: Point = s.toPosArr[s.timerArg0 - 1];
            let myPos: Point = s.myPosArr[s.timerArg0 - 1];
            let tox: number;
            let toy: number;
            let toFlag: number;
            let tmpX: number;
            let tmpY: number;
            let u: number;
            if (s.state == "start") {
                u = 0.4;
                var p = s.globalToLocal(s.stageMP);
                s.px += (p.x - s.px) * u >> 0;
                s.py += (p.y - s.py) * u >> 0;
                s.drawPage(s.timerArg0, new Point(s.px, s.py));
            } else if (s.state == "auto") {
                if (Math.abs(toPos.x - s.px) > s.bW * 1.5 && s.timerArg1 > 0) {
                    //不处于点翻区域并且翻页不过中线时
                    tox = myPos.x;
                    toy = myPos.y;
                    toFlag = 0;
                } else {
                    tox = toPos.x;
                    toy = toPos.y;
                    toFlag = 1;
                }
                tmpX = (tox - s.px) >> 0;
                tmpY = (toy - s.py) >> 0;
                if (s.timerArg1 < 0) {
                    u = 0.3;
                    s.py = s.arc(s.bW, tmpX, toPos.y);
                } else {
                    u = 0.4;
                    s.py = tmpY * u + s.py;
                }
                s.px = tmpX * u + s.px;
                s.drawPage(s.timerArg0, new Point(s.px, s.py));
                if(tmpX == 0 && tmpY == 0){
                    s.rPage0.removeAllChildren();
                    s.rPage1.removeAllChildren();
                    s.shadow0.visible = false;
                    s.shadow1.visible = false;
                    s.toPage = toFlag == 0 ? s.currPage : s.toPage;
                    s.currPage = s.toPage;
                    s.pageMC.removeAllChildren();
                    s.setPage(s.currPage);
                    s.state = "stop";
                }
            }
        }
        private arc(argR: number, argN1: number, argN2: number): number {
            let arg: number = argR * 2;
            let r: number = argR * argR + arg * arg;
            let a: number = Math.abs(argN1) - argR;
            return argN2 - (Math.sqrt(r - a * a) - arg);
        }
        private angle(target1: Point, target2: Point): number {
            let tmpX: number = target1.x - target2.x;
            let tmpY: number = target1.y - target2.y;
            let tmp_angle: number = Math.atan2(tmpY, tmpX) * 180 / Math.PI;
            return tmp_angle < 0 ? tmp_angle + 360 : tmp_angle;
        }
        private pos(target1: Point, target2: Point): number {
            let tmpX: number = target1.x - target2.x;
            let tmpY: number = target1.y - target2.y;
            let tmpS: number = Math.sqrt(tmpX * tmpX + tmpY * tmpY);
            return target1.x > target2.x ? tmpS : -tmpS;
        }
    }
}