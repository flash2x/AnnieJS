/**
 * @module annie
 */
namespace annie {
    /**
     * 显示对象的容器类,可以将其他显示对象放入其中,是annie引擎的核心容器类.
     * Sprite 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。
     * Sprite 对象与影片剪辑类似，但没有时间轴。Sprite 是不需要时间轴的对象的相应基类。
     * 例如，Sprite 将是通常不使用时间轴的用户界面 (UI) 组件的逻辑基类
     * @class annie.Sprite
     * @extends annie.DisplayObject
     * @public
     * @since 1.0.0
     */
    export class Sprite extends DisplayObject {
        public constructor() {
            super();
        }

        /**
         * 是否可以让children接收鼠标事件
         * @property mouseChildren
         * @type {boolean}
         * @default true
         * @public
         * @since 1.0.0
         */
        public mouseChildren:boolean = true;
        /**
         * 显示对象的child列表
         * @property children
         * @type {Array}
         * @public
         * @since 1.0.0
         * @default []
         * @readonly
         */
        public children:DisplayObject[]=[];

        /**
         * 添加一个显示对象到Sprite
         * @method addChild
         * @param {annie.DisplayObject} child
         * @public
         * @since 1.0.0
         */
        public addChild(child:DisplayObject):void {
            this.addChildAt(child, this.children.length);
        }

        /**
         * 从Sprite中移除一个child
         * @method removeChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         */
        public removeChild(child:DisplayObject):void {
            var s = this;
            var len=s.children.length;
            for (var i = 0; i < len; i++) {
                if (s.children[i] == child) {
                    s.removeChildAt(i);
                    break;
                }
            }
        }
        //全局遍历
        private static _getElementsByName(rex:RegExp,root:annie.Sprite,isOnlyOne:boolean,isRecursive:boolean,resultList:Array<annie.DisplayObject>):void{
            var len=root.children.length;
            if(len>0){
                var name:string;
                var child:any;
                for(var i=0;i<len;i++){
                    child=root.children[i];
                    name=child.name;
                    if(name&&name!=""){
                        if(rex.test(name)){
                            resultList.push(child);
                            if(isOnlyOne){
                                return;
                            }
                        }
                    }
                    if(isRecursive){
                        if(child["children"]!=null) {
                            Sprite._getElementsByName(rex, child, isOnlyOne,isRecursive,resultList);
                        }
                    }
                }
            }
        }
        /**
         * 通过给displayObject设置的名字来获取一个child,可以使用正则匹配查找
         * @method getChildByName
         * @param {string} name 对象的具体名字或是一个正则表达式
         * @param {boolean} isOnlyOne 默认为true,如果为true,只返回最先找到的对象,如果为false则会找到所有匹配的对象数组
         * @param {boolean} isRecursive false,如果为true,则会递归查找下去,而不只是查找当前对象中的child,child里的child也会找,依此类推
         * @returns {any} 返回一个对象,或者一个对象数组,没有找到则返回空
         * @public
         * @since 1.0.0
         */
        public getChildByName(name:string|RegExp,isOnlyOne:boolean=true,isRecursive:boolean=false):any {
            if(!name)return null;
            var s = this;
            var rex:any;
            if (typeof(name) == "string"){
                rex=new RegExp("^"+name+"$");
            }else{
                rex=name;
            }
            var  elements:Array<annie.DisplayObject>=[];
            Sprite._getElementsByName(rex,s,isOnlyOne,isRecursive,elements);
            var len=elements.length;
            if(len==0){
                return null;
            }else if(len==1){
                return elements[0];
            }else{
                return elements;
            }
        }

        /**
         * 添加一个child到Sprite中并指定添加到哪个层级
         * @method addChildAt
         * @param {annie.DisplayObject} child
         * @param {number} index 从0开始
         * @pubic
         * @since 1.0.0
         */
        public addChildAt(child:DisplayObject, index:number):void {
            var s = this;
            var sameParent=s==child.parent;
            var len:number;
            if (child.parent) {
                if(!sameParent) {
                    child.parent.removeChild(child);
                }else{
                     len=s.children.length;
                    for (var i = 0; i < len; i++) {
                        if (s.children[i] == child) {
                            s.children.splice(i,1);
                            break;
                        }
                    }
                }
            }
            child.parent = s;
            len=s.children.length;
            if (index >= len) {
                s.children.push(child);
            } else if (index == 0) {
                s.children.unshift(child);
            } else {
                s.children.splice(index, 0, child);
            }
            if(s.stage&&!sameParent){
                child._onDispatchBubbledEvent("onAddToStage");
            }
        }
        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @pubic
         * @since 1.0.0
         * @return {annie.DisplayObject}
         */
        public getChildAt(index:number):annie.DisplayObject {
           if((this.children.length-1)>=index){
               return this.children[index];
           }else{
               return null;
           }
        }
        /**
         * 调用此方法对Sprite及其child触发一次指定事件
         * @method _onDispatchBubbledEvent
         * @private
         * @param {string} type
         * @since 1.0.0
         */
        public _onDispatchBubbledEvent(type:string):void {
            var s = this;
            var len=s.children.length;
            s.stage=s.parent.stage;
            for (var i = 0; i < len; i++){
                s.children[i]._onDispatchBubbledEvent(type);
            }
            super._onDispatchBubbledEvent(type);
        }
        /**
         * 移动指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         */
        public removeChildAt(index:number):void {
            var s = this;
            var child:any;
            var len=s.children.length;
            if(len==0)return;
            if (index == len) {
                child = s.children.pop();
            } else if (index == 0) {
                child = s.children.shift();
            } else {
                child = s.children.splice(index, 1)[0];
            }
            child._onDispatchBubbledEvent("onRemoveToStage");
            child.parent=null;
        }
        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         */
        public removeAllChildren():void {
            var s = this;
            var len=s.children.length;
            for (var i = len- 1; i >= 0; i--) {
                s.removeChildAt(i);
            }
        }

        /**
         * 刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        public update():void {
            var s = this;
            super.update();
            var len=s.children.length;
            var child:any;
            for (var i = len-1; i>=0; i--) {
                child=s.children[i];
                //因为悬浮的html元素要时时更新来检查他的visible属性
                child.update();
            }
        }
        /**
         * 碰撞测试
         * @method hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        public hitTestPoint(globalPoint:Point,isMouseEvent:boolean=false):DisplayObject{
            var s=this;
            if(!s.visible)return null;
            if(isMouseEvent&&!s.mouseEnable)return null;
            var len=s.children.length;
            var hitDisplayObject:DisplayObject;
            var child:any;
            //这里特别注意是从上往下遍历
            for(var i=len-1;i>=0;i--){
                //TODO 这里要考虑遮罩
                child=s.children[i];
                if(child.mask){
                    //看看点是否在遮罩内
                    if(!child.mask.hitTestPoint(globalPoint,isMouseEvent)){
                        //如果都不在遮罩里面,那还检测什么直接检测下一个
                        continue;
                    }
                }
                hitDisplayObject=child.hitTestPoint(globalPoint,isMouseEvent);
                if(hitDisplayObject){
                    return hitDisplayObject;
                }
            }
            return null;
        }
        /**
         * @method getBounds
         * @returns {any}
         * @since 1.0.0
         * @public
         */
        public getBounds():Rectangle{
            var s=this;
            var len:number= s.children.length;
            if(len==0){
                return null;
            }
            var rect=s.children[0].getDrawRect();
            for (var i = 1; i < len; i++) {
                rect=Rectangle.createFromRects(rect,s.children[i].getDrawRect());
            }
          return rect;
        }

        /**
         * 渲染
         * @method render
         * @param {annie.IRender} renderObj
         * @public
         * @since 1.0.0
         */
        public render(renderObj:IRender):void {
            var s:any = this;
            var maskObj:any;
            var maskObjIds:any = [];
            var child:any;
            var len:number= s.children.length;
            for (var i = 0; i < len; i++) {
                child = s.children[i];
                if (child.cAlpha > 0 && child.visible) {
                    if (maskObj) {
                        if (child.mask) {
                            if (child.mask != maskObj) {
                                renderObj.endMask();
                                maskObj = child.mask;
                                var mId:number = maskObj.getInstanceId();
                                //就是检测遮罩是否被更新过。因为动画遮罩反复更新的话他会播放同一次渲染要确定只能更新一回。
                                if (maskObjIds.indexOf(mId) < 0) {
                                    maskObj.parent=s;
                                    if(s.totalFrames&&maskObj.totalFrames) {
                                        maskObj.gotoAndStop(s.currentFrame);
                                    }
                                    maskObj.update();
                                    maskObjIds.push(mId);
                                }
                                renderObj.beginMask(maskObj);
                            }
                        } else {
                            renderObj.endMask();
                            maskObj = null;
                        }
                    } else {
                        if (child.mask) {
                            maskObj = child.mask;
                            var mId:number = maskObj.getInstanceId();
                            if (maskObjIds.indexOf(mId) < 0) {
                                maskObj.parent=s;
                                if(s.totalFrames&&maskObj.totalFrames) {
                                    maskObj.gotoAndStop(s.currentFrame);
                                }
                                maskObj.update();
                                maskObjIds.push(mId);
                            }
                            renderObj.beginMask(maskObj);
                        }
                    }
                    child.render(renderObj);
                }
            }
            if (maskObj) {
                renderObj.endMask();
            }
            //super.render();
        }
    }
}