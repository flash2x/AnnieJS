/**
 * @module annie
 */
namespace annie {
    export interface IRender {
        /**
         * 渲染循环
         * @param target
         */
        draw(target:any):void;
        /**
         * 开始遮罩
         * @param target
         */
        beginMask(target:any):void;
        /**
         * 结束遮罩
         */
        endMask():void;
        end():void;
        /**
         * 开始渲染
         */
        begin():void;
    }
}