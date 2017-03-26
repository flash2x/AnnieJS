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
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class ScrollList extends ScrollPage {
        private _items:Array<IScrollListItem>=null;
        private _itemsDis:number;
        private _itemCount:number;
        private _isInit:boolean=false;
        private _data:Array<any>=[];
        /**
         * 构造函数
         * @method  ScrollList
         * @param {number}vW 可视区域宽
         * @param {number}vH 可视区域高
         * @param {boolean}isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @example
         *      s.sPage=new annieUI.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
         */
        constructor(itemClassName:any,itemDis:number,vW: number, vH: number, isVertical: boolean = true) {
            super(vW, vH, 0, isVertical);
            let s=this;
            s._instanceType = "annieUI.ScrollList";
            s._itemCount =Math.ceil(s.distance/itemDis)+2;
            s._items=[];
            s._itemsDis=itemDis;
            s.maxSpeed<itemDis*0.8;
            for(let i=0;i<s._itemCount;i++){
                let item=new itemClassName();
                item.visible=false;
                item[s.paramXY]=i*itemDis;
                s._items.push(item);
                s.view.addChild(item);
            }
            s.addEventListener(annie.Event.ENTER_FRAME,function (e:annie.Event) {
                if (s.speed!=0){
                    let gp:any=new annie.Point();
                    let lp:any=new annie.Point();
                    let item:any=null;
                    if(s.speed<0){
                        item=s._items[0];
                    }else{
                        item=s._items[s._items.length-1];
                    }
                    lp.x=item.x;
                    lp.y=item.y;
                    s.view.localToGlobal(lp,gp);
                    s.globalToLocal(gp,lp);
                    if(s.speed<0){
                        lp[s.paramXY]+=s._itemsDis;
                        if(lp[s.paramXY]<0&&item.id+s._itemCount<s._data.length){
                            //向上求数据
                            item.initData(item.id+s._itemCount,s._data[item.id+s._itemCount]);
                            item[s.paramXY]=item.id*s._itemsDis;
                            s._items.push(s._items.shift());
                        }
                    }else{
                        if(lp[s.paramXY]>(s._itemCount-2)*s._itemsDis&&item.id-s._itemCount>=0){
                            item.initData(item.id-s._itemCount,s._data[item.id-s._itemCount]);
                            item[s.paramXY]=item.id*s._itemsDis;
                            s._items.unshift(s._items.pop());
                        }
                    }
                }
            });
        }
        public updateData(data:Array<any>):void{
            let s=this;
            if(!s._isInit){
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
        }
    }
}