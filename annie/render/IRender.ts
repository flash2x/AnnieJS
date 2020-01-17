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
         * 初始化事件
         * @param canvas
         */
        init(canvas:any):void;
        /**
         * 改变尺寸
         */
        reSize(width:number,height:number):void;
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
        begin(color:string):void;

        /**
         * 结束渲染
         */
        end():void;

        /**
         * viewPort
         */
        viewPort:annie.Rectangle;
    }
}