/**
 * @file toolkit.js
 * @author ienix(enix@foxmail.com)
 */

var toolKit = function () {
    var S = arguments.callee;
    var fn = S.prototype;
    var doc = doc || document;

    S.constructor = S;

    if (!Object.keys) {
        Object.keys = function (o) {
            var keys = [];
            for (keys[keys.length] in o) { }
            return keys;
        };
    }

    /**
     * @param {*} o 任意类型
     * @return {string} 字符串 Object|Array|Function|Number等js数据类型
     */
    fn.is = function (o) {
        return ({}).toString.call(o).slice(8, -1);
    };

    /**
     * @param {Array|Object} object 要遍历的对象
     * @param {Function} callback 回调函数
     */
    fn.each = function (object, callback) {
        var index;
        var i = 0;
        // all>>>0可用把非数字处理为0，解决访问不到length属性报错的情况
        var len = object.length >>> 0;
        var isO = 'object' === typeof object;

        if (isO) {
            for (index in object) {
                if (callback.call(object[index], object[index], index) === false) {
                    break;
                }
            }
        }
        else {
            for (; i < len;) {
                if (callback.call(object[i], object[i], i++) === false) {
                    break;
                }
            }
        }
    };

    /**
     * 获取html节点
     * @param {string} tag htmltag
     * @return {Element} node
     */
    fn.createHtmlElement = function (tag) {

        // 缓存后可复用
        S.element || (S.element = {});
        S.element[tag] || (S.element[tag] = doc.createElement(tag));

        var node = S.element[tag].cloneNode(true);

        return node;
    };

    /**
     * 获取event对象
     * 用于处理w3c event和ie旧事件机制以达到兼容ie8以下版本的ie
     * @param {Event=} e event
     * @return {Event} event
     */
    fn.getEvent = function (e) {
        return e || window.event;
    };

    /**
     * 通过event获取target
     * @param {Event} e Event
     * @return {Element} Element
     */
    fn.getTarget = function (e) {
        return e.srcElement || e.target;
    };

    /**
     * 为元素添加事件监听
     * @param {Element} elem element
     * @param {Event} evType domEvent
     * @param {Function} fn callback
     * @param {boolean} capture 是否冒泡
     */
    fn.addEvent = function (elem, evType, fn, capture) {
        if (elem.attachEvent) {
            elem.attachEvent('on' + evType, fn);
        }
        else if (elem.addEventListener) {
            elem.addEventListener(evType, fn, capture || false);
        }
        else {
            elem['on' + evType] = function () {
                fn();
            };
        }
    };

    /**
     * 在匹配的节点上触发对应的事件
     * @param {Element} elem 节点
     * @param {string} evType htmlevent
     */
    fn.trigger = function (elem, evType) {
        var event;

        if (doc.createEvent) {
            event = doc.createEvent('MouseEvents');
            event.initMouseEvent(
                evType,
                true,
                true,
                doc.defaultView,
                0, 0, 0, 0, 0,
                false, false, false, false,
                0, null
            );
            elem.dispatchEvent(event);
        }
        else {
            event = doc.createEventObject();
            event.screenX = 100;
            event.screenY = 0;
            event.clientX = 0;
            event.clientY = 0;
            event.ctrlKey = false;
            event.altKey = false;
            event.shiftKey = false;
            event.button = false;
            elem.fireEvent('on' + evType, event);
        }

    };

    if (window === this) {
        return new S();
    }
};
