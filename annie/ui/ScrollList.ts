/**
 * Created by anlun on 16/8/14.
 */
/**
 * @module annieUI
 */
namespace annieUI {
    import DisplayObject = annie.DisplayObject;
    export interface IScrollListItem extends DisplayObject{
        initData(id:number,data:Array<any>):void;
        id:number;
        data:number;
    }
    /**
     * 有些时候需要大量的有规则的滚动内容。这个时候就应该用到这个类了
     * @class annieUI.ScrollList
     * @public
     * @extends annie.ScrollPage
     * @since 1.0.9
     */
    export class ScrollList extends ScrollPage {
        private _items:Array<IScrollListItem>=null;
        private _itemW:number;
        private _itemH:number;
        private _itemRow:number;
        private _itemCol:number;
        private _itemCount:number;
        private _itemClass:any;
        private _isInit:boolean;
        private _data:Array<any>=[];
        private gp:any=new annie.Point();
        private lp:any=new annie.Point();
        private downL:DisplayObject=null;
        private _cols:number;
        private _colsDis:number;
        private _disParam:string;

        /**
         * 获取下拉滚动的loadingView对象
         * @property loadingView
         * @since 1.0.9
         * @returns {DisplayObject}
         */
        public get loadingView():DisplayObject{
            return this.downL;
        }

        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemWidth item宽
         * @param {number} itemHeight item宽
         * @param {number} vW 列表的宽
         * @param {number} vH 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @param {number} cols 分几列，默认是1列
         * @param {number} colsDis 列之间的间隔，默认为0
         * @since 1.0.9
         */
        constructor(itemClassName:any,itemWidth:number,itemHeight:number,vW: number, vH: number,isVertical: boolean = true,cols:number=1,colsDis:number=0) {
            super(vW, vH, 0, isVertical);
            let s=this;
            s._isInit=false;
            s._instanceType = "annieUI.ScrollList";
            s._itemW=itemWidth;
            s._itemH=itemHeight;
            s._items=[];
            s._itemClass=itemClassName;
            s.maxSpeed=50;
            s._itemCount=0;
            s._cols=cols;
            s._colsDis=colsDis;
            s._updateViewRect();
            s.addEventListener(annie.Event.ENTER_FRAME,function (e:annie.Event) {
                if (s.speed!=0){
                    let item:any=null;
                    if(s.speed<0){
                        item=s._items[0];
                    }else{
                        item=s._items[s._items.length-1];
                    }
                    let lp=s.lp;
                    let gp=s.gp;
                    lp.x=item.x;
                    lp.y=item.y;
                    s.view.localToGlobal(lp,gp);
                    s.globalToLocal(gp,lp);
                    let newId:number=0;
                    //TODO 要把这里实现多行多列就行了
                    if(s.speed<0){
                        lp[s.paramXY]+=s._itemRow;
                        newId=item.id+s._itemCount;
                        newId-=newId%s._cols;
                        if(lp[s.paramXY]<0){
                            //向上求数据
                            let len=s._data.length;
                            for(var i=0;i<s._cols;i++){
                                if(newId<len) {
                                    item=s._items[0];
                                    item.initData(newId, s._data[newId]);
                                    item[s.paramXY]=Math.floor(newId/s._cols)*s._itemRow;
                                    item[s._disParam]=(newId%s._cols)*s._itemCol;
                                    s._items.push(s._items.shift());
                                }
                                newId++;
                            }
                        }
                    }else{
                        newId=item.id-s._itemCount;
                        newId-=newId%s._cols;
                        if(lp[s.paramXY]>s.distance&&newId>=0){
                            //向上求数据
                            for(var i=0;i<s._cols;i++) {
                                item=s._items[s._itemCount-1];
                                item.initData(newId, s._data[newId]);
                                item[s.paramXY]=Math.floor(newId/s._cols)*s._itemRow;
                                item[s._disParam]=(newId%s._cols)*s._itemCol;
                                s._items.unshift(s._items.pop());
                                newId++;
                            }
                        }
                    }
                }
            });
        }
        /**
         * 更新列表数据
         * @method updateData
         * @param {Array} data
         * @param {boolean} isReset 是否重围数据列表。
         * @since 1.0.9
         */
        public updateData(data:Array<any>,isReset:boolean=false):void{
            let s:any=this;
            if(!s._isInit||isReset){
                s._data=data;
                s._isInit=true;
            }else{
                s._data=s._data.concat(data);
            }
            s.flushData();
            s.maxDistance=Math.ceil(s._data.length/s._cols)*s._itemRow;
            if(s.downL){
                s.downL[s.paramXY]=Math.max(s.distance,s.maxDistance);
                var wh=s.downL.getWH();
                s.maxDistance+=(s.paramXY=="x"?wh.width:wh.height);
            }
        }
        private flushData(){
            let s:any=this;
            let id:number=0;
            if(s._items.length>0){
                id=Math.abs(Math.ceil(s.view[s.paramXY]/s._itemRow))*s._cols;
                trace(id);
            }
            for(let i=0;i<s._itemCount;i++){
                let item:any=s._items[i];
                item.initData(id,s._data[id]);
                item[s.paramXY]=Math.floor(id/s._cols)*s._itemRow;
                item[s._disParam]=(id%s._cols)*s._itemCol;
                id++;
            }
        }
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @param {boolean} isVertical 方向
         * @public
         * @since 1.1.1
         */
         public setViewRect(w: number, h: number,isVertical:boolean): void {
            super.setViewRect(w,h,isVertical);
            let s=this;
            if(s._itemRow&&s._itemCol){
                 s._updateViewRect();
             }
        }
        private _updateViewRect(){
            let s:any=this;
            if(s.isVertical){
                s._disParam="x";
                s._itemRow=s._itemH;
                s._itemCol=s._itemW;
            }else{
                s._disParam="y";
                s._itemRow=s._itemW;
                s._itemCol=s._itemH;
            }
            let newCount:number=Math.ceil(s.distance/s._itemRow)+s._cols*2;
            if(newCount!=s._itemCount){
                if(newCount>s._itemCount){
                    let id:number=0;
                    if(s._itemCount>0){
                        id=s._items[s._itemCount-1].id+1;
                    }
                    for(let i=s._itemCount;i<newCount;i++){
                        let item=new s._itemClass();
                        s._items.push(item);
                        s.view.addChild(item);
                        id++;
                    }
                }else{
                    for(let i=0;i<s._itemCount-newCount;i++){
                        s.view.removeChild(s._items.pop());
                    }
                }
                s._itemCount=newCount;
                this.flushData();
            }
        }
        /**
         * 设置加载数据时显示的loading对象
         * @since 1.0.9
         * @method setLoading
         * @param {annie.DisplayObject} downLoading
         */
        public setLoading(downLoading:DisplayObject):void{
            let s:any=this;
            if(s.downL){
                s.view.removeChild(s.downL);
                let wh=s.downL.getWH();
                s.maxDistance-=(s.paramXY=="x"?wh.width:wh.height);
                s.downL=null;
            }
            if(downLoading){
                s.downL=downLoading;
                s.view.addChild(downLoading);
                s.downL[s.paramXY]=Math.max(s.distance,s.maxDistance);
                let wh=s.downL.getWH();
                s.maxDistance+=(s.paramXY=="x"?wh.width:wh.height);
            }else{
                s.isStop=false;
            }
        }
    }
}