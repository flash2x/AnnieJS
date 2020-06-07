/**
 * @module annie
 */
namespace annie {
    export interface IRender {
        /**
         * 初始化事件
         * @param canvas
         */
        init():void;
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
         * 开始渲染
         */
        begin(color:string):void;

        /**
         * 结束渲染
         */
        end():void;
        destroy():void;
        /**
         * viewPort
         */
        viewPort:annie.Rectangle;
    }
}