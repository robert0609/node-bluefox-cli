/**
 * 辅助工具
 */

/**
 * 给对象设置默认值
 */
Object.prototype.getValueOrDefault = function (name, defaultValue) {
    if (this[name]) {
        return this[name];
    }
    else {
        return defaultValue;
    }
};