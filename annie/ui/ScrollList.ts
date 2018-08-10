/**
 * @module annieUI
 */
namespace annieUI {
    import DisplayObject = annie.DisplayObject;

    /**
     * 有些时候需要大量的有规则的滚动内容。这个是滚动类的Item类接口
     * @class annieUI.IScrollListItem
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.9
     */
    export interface IScrollListItem extends DisplayObject {
        initData(id: number, data: Array<any>): void;
        id: number;
        data: number;
    }

    /**
     * 有些时候需要大量的有规则的滚动内容。这个时候就应该用到这个类了
     * @class annieUI.ScrollList
     * @public
     * @extends annieUI.ScrollPage
     * @since 1.0.9
     */
    export class ScrollList extends ScrollPage {
        private _items: Array<IScrollListItem> = null;
        private _itemW: number;
        private _itemH: number;
        private _itemRow: number;
        private _itemCol: number;
        private _itemCount: number;
        private _itemClass: any;
        private _isInit: number=0;
        public data: Array<any> = [];
        private downL: DisplayObject = null;
        private _cols: number;
        private _disParam: string;
        private _lastFirstId: number = -1;

        /**
         * 获取下拉滚动的loadingView对象
         * @property loadingView
         * @since 1.0.9
         * @return {DisplayObject}
         */
        public get loadingView(): DisplayObject {
            return this.downL;
        }

        /**
         * 构造函数
         * @method ScrollList
         * @param {Class} itemClassName 可以做为Item的类
         * @param {number} itemWidth item宽
         * @param {number} itemHeight item高
         * @param {number} vW 列表的宽
         * @param {number} vH 列表的高
         * @param {boolean} isVertical 是横向滚动还是纵向滚动 默认是纵向
         * @param {number} cols 分几列，默认是1列
         * @since 1.0.9
         */
        constructor(itemClassName: any, itemWidth: number, itemHeight: number, vW: number, vH: number, isVertical: boolean = true, cols: number = 1) {
            super(vW, vH, 0, isVertical);
            let s = this;
            s._instanceType = "annie.ScrollList";
            s._itemW = itemWidth;
            s._itemH = itemHeight;
            s._items = [];
            s._itemClass = itemClassName;
            s._itemCount = 0;
            s._cols = cols;
            s._updateViewRect();
            s.addEventListener(annie.Event.ENTER_FRAME, s.flushData.bind(s));
        }

        /**
         * 更新列表数据
         * @method updateData
         * @param {Array} data
         * @param {boolean} isReset 是否重置数据列表。
         * @since 1.0.9
         */
        public updateData(data: Array<any>, isReset: boolean = false): void {
            let s: any = this;
            if (!s._isInit || isReset) {
                s.data = data;
            } else {
                s.data = s.data.concat(data);
            }
            s._isInit = 1;
            s._lastFirstId = -1;
            s.maxDistance = Math.ceil(s.data.length / s._cols) * s._itemRow;
            if (s.downL) {
                s.downL[s.paramXY] = Math.max(s.distance, s.maxDistance);
                var wh = s.downL.getWH();
                s.maxDistance += (s.paramXY == "x" ? wh.width : wh.height);
            }
        }
        private flushData() {
            let s: any = this;
            if (s._isInit>0) {
                if(s.view._UI.UM||s._isInit==1){
                    s._isInit=2;
                    let id: number = (Math.abs(Math.floor(s.view[s.paramXY] / s._itemRow)) - 1) * s._cols;
                    id = id < 0 ? 0 : id;
                    if (id != s._lastFirstId) {
                        s._lastFirstId = id;
                        if (id != s._items[0].id) {
                            for (let r = 0; r < s._cols; r++) {
                                if (s.speed > 0) {
                                    s._items.unshift(s._items.pop());
                                } else {
                                    s._items.push(s._items.shift());
                                }
                            }
                        }
                    }
                    for (let i = 0; i < s._itemCount; i++) {
                        let item: any = s._items[i];
                        if (item._a2x_sl_id != id) {
                            item.initData(s.data[id] ? id : -1, s.data[id]);
                            item[s.paramXY] = Math.floor(id / s._cols) * s._itemRow;
                            item[s._disParam] = (id % s._cols) * s._itemCol;
                            //如果没有数据则隐藏
                            if(s.data[id]) {
                                item._a2x_sl_id = id;
                                item.visible =true;
                            }else{
                                item._a2x_sl_id = -1;
                                item.visible =false;
                            }
                        }
                        id++;
                    }
                }
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
        public setViewRect(w: number, h: number, isVertical: boolean): void {
            super.setViewRect(w, h, isVertical);
            let s = this;
            if (s._itemRow && s._itemCol) {
                s._updateViewRect();
            }
        }

        private _updateViewRect() {
            let s: any = this;
            if (s.isVertical) {
                s._disParam = "x";
                s._itemRow = s._itemH;
                s._itemCol = s._itemW;
            } else {
                s._disParam = "y";
                s._itemRow = s._itemW;
                s._itemCol = s._itemH;
            }
            let newCount: number = (Math.ceil(s.distance / s._itemRow) + 1) * s._cols;
            if (newCount != s._itemCount) {
                if (newCount > s._itemCount) {
                    for (let i = s._itemCount; i < newCount; i++) {
                        let item = new s._itemClass();
                        item.id = -1;
                        item.data = null;
                        s._items.push(item);
                        s.view.addChild(item);
                    }
                } else {
                    for (let i = 0; i < s._itemCount - newCount; i++) {
                        s.view.removeChild(s._items.pop());
                    }
                }
                s._itemCount = newCount;
                s._lastFirstId = -1;
            }
        }

        /**
         * 设置加载数据时显示的loading对象
         * @since 1.0.9
         * @method setLoading
         * @param {annie.DisplayObject} downLoading
         */
        public setLoading(downLoading: DisplayObject): void {
            let s: any = this;
            if (s.downL) {
                s.view.removeChild(s.downL);
                let wh = s.downL.getWH();
                s.maxDistance -= (s.paramXY == "x" ? wh.width : wh.height);
                s.downL = null;
            }
            if (downLoading) {
                s.downL = downLoading;
                s.view.addChild(downLoading);
                s.downL[s.paramXY] = Math.max(s.distance, s.maxDistance);
                let wh = s.downL.getWH();
                s.maxDistance += (s.paramXY == "x" ? wh.width : wh.height);
            } else {
                s.isStop = false;
            }
        }

        public destroy(): void {
            let s = this;
            s._items = null;
            s._itemClass = null;
            s.data = null;
            s.downL = null;
            super.destroy();
        }
    }
}