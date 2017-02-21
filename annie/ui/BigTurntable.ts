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
     * @class annieUI.BigTurntable
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class BigTurntable extends Sprite {
        /**
         * 转动对象
         * @property turnObj
         * @private
         * @since 1.0.0
         * @type {annie.DisplayObject}
         */
        private turnObj: annie.DisplayObject;
        /**
         * 目标角度
         * @property targetRotation
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private targetRotation: number;
        /**
         * 转盘转动结束回调函数
         * @method callback
         * @private
         * @since 1.0.0
         * @type {function}
         */
        private callback: any;

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
            var s = this;
            if (!option['turnObj']) {
                throw new Error('turnObj转动对象不能为空');
            }
            if (!s.isFunction(option['callback'])) {
                throw new Error('callback参数数据格式不对！callback应为函数');
            }
            s.turnObj = option['turnObj'];
            s.targetRotation = option['targetRotation'] ? option['targetRotation'] : 0;
            s.callback = option['callback'];
            /*抽奖转盘*/
            annie.Tween.to(s.turnObj, 2, {
                rotation: (180 + s.turnObj.rotation), ease: annie.Tween.quarticIn, onComplete: function () {
                    annie.Tween.to(s.turnObj, 3, {
                        rotation: (10 * 360 ), onComplete: function () {
                            annie.Tween.to(s.turnObj, 4, {
                                rotation: (12 * 360) + s.targetRotation,
                                ease: annie.Tween.quarticOut,
                                onComplete: s.callback
                            })
                        }
                    })
                }
            });
        }
    }
}
