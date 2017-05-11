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
        private _itemsDis:number;
        private _itemCount:number;
        private _isInit:boolean=false;
        private _data:Array<any>=[];
        private gp:any=new annie.Point();
        private lp:any=new annie.Point();
        private downL:DisplayObject=null;

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
         * @param {number} itemDis 各个Item的间隔
         * @param {number} vW 列表的宽
         * @param {number} vH 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @since 1.0.9
         */
        constructor(itemClassName:any,itemDis:number,vW: number, vH: number, isVertical: boolean = true) {
            super(vW, vH, 0, isVertical);
            let s=this;
            s._instanceType = "annieUI.ScrollList";
            s._itemCount =Math.ceil(s.distance/itemDis);
            s._items=[];
            s._itemsDis=itemDis;
            s.maxSpeed=itemDis*0.8;
            for(let i=0;i<s._itemCount;i++){
                let item=new itemClassName();
                item.visible=false;
                item[s.paramXY]=i*itemDis;
                s._items.push(item);
                s.view.addChild(item);
            }
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
                    if(s.speed<0){
                        lp[s.paramXY]+=s._itemsDis;
                        newId=item.id+s._itemCount;
                        if(lp[s.paramXY]<0&&newId<s._data.length){
                            //向上求数据
                            item.initData(newId,s._data[newId]);
                            item[s.paramXY]=item.id*s._itemsDis;
                            s._items.push(s._items.shift());
                        }
                    }else{
                        newId=item.id-s._itemCount;
                        if(lp[s.paramXY]>s.distance&&newId>=0){
                            //向上求数据
                            item.initData(newId,s._data[newId]);
                            item[s.paramXY]=item.id*s._itemsDis;
                            s._items.unshift(s._items.pop());
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
                for(let i=0;i<data.length&&i<s._itemCount;i++){
                    s._items[i].initData(i,data[i]);
                    s._items[i]._visible=true;
                }
                s._isInit=true;
            }else{
                s._data=s._data.concat(data);
            }
            s.maxDistance=s._data.length*s._itemsDis;
            if(s.downL){
                s.downL[s.paramXY]=Math.max(s.distance,s.maxDistance);
                var wh=s.downL.getWH();
                s.maxDistance+=(s.paramXY=="x"?wh.width:wh.height);
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