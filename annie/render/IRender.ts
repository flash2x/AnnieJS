/**
 * @module annie
 */
namespace annie {
    export interface IRender {
        /**
         * 渲染循环
         * @param target
         * @param type
         */
        draw(target:any, type:number):void;
        /**
         * 初始化事件
         * @param stage
         */
        init():void;
        /**
         * 改变尺寸
         */
        reSize():void;
        /**
         * 开始遮罩
         * @param target
         */
        beginMask(target:any):void;
        /**
         * 结束遮罩
         */
        endMask():void;
        /**
         * 最上层容器对象
         */
        rootContainer:any;
        /**
         * 开始渲染
         */
        begin():void;
    }
}