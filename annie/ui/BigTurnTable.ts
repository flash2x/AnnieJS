/**
 * Created by Saron on 2017/2/21.
 */

/**
 * @module annieUI
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    /**
     * 大转盘抽奖类
     * @class annieUI.BigTurnTable
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class BigTurnTable extends Sprite {
        /**
         * 是否在转动中
         * @property isTurnning
         * @public
         * @since 1.0.0
         * @default false
         * @type {boolean}
         */
        private isTurnning: boolean = false;

        /**
         * 是否为函数
         * @param fn
         * @returns {boolean}
         * @private
         */
        private isFunction(fn: any) {
            return typeof fn === 'function';
        }

        constructor(option: any) {
            super();
        }

        /**
         * 转动方法
         * @param turnObj  转动对象
         * @param targetRotation 目标角度
         * @param callback 转动结束回调函数
         * @example
         *      var lotteryController=new annieUI.BigTurnTable();
         *      lotteryController.turnTo(turnObj,120,function(){
         *      trace('turnFinish!');
         *      })
         */
        private turnTo(turnObj: annie.DisplayObject, targetRotation: number, callback: any) {
            let s = this,
                turnObjInitRotation: number = 0;
            if (!turnObj) {
                throw new Error('turnObj转动对象不能为空');
            }
            if (!s.isFunction(callback)) {
                throw new Error('callback参数数据格式不对！callback应为函数');
            }
            if (s.isTurnning) {
                return;
            }
            turnObjInitRotation = turnObj.rotation;//转动对象rotation初始值
            s.isTurnning = true;
            /*抽奖转盘*/
            annie.Tween.to(turnObj, 2, {
                rotation: (180 + turnObjInitRotation), ease: annie.Tween.quarticIn, onComplete: function () {
                    annie.Tween.to(turnObj, 3, {
                        rotation: (10 * 360 ), onComplete: function () {
                            annie.Tween.to(turnObj, 4, {
                                rotation: (12 * 360) + targetRotation + turnObjInitRotation,
                                ease: annie.Tween.quarticOut,
                                onComplete: function () {
                                    turnObj.rotation = targetRotation + turnObjInitRotation;
                                    s.isTurnning = false;
                                    s.isFunction(callback) && callback();//执行结束回调函数
                                }
                            })
                        }
                    })
                }
            });
        }
    }
}
