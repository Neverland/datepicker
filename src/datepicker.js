/**
 * @file 日历ui组件
 * @author ienix(enix@foxmail.com)
 */

(function (window, doc) {
    /**
     * 构造函数
     *
     * @constructor
     * @param {Element} parent 插入的目标对象
     * @param {Object} option 配置
     * @param {Function} callback 回调
     * @return {Object} 返回instance
     */
    function Datepicker(parent, option, callback) {

        // 简单判断一下
        if (!parent || !parent.nodeType) {
            return false;
        }

        // 存一个引用
        var C = arguments.callee;
        var that = this;

        // 兼容没有使用new实例化的方式

        if (!(this instanceof C)) {
            return new C(parent, option, callback);
        }

        var fn = C.prototype;
        fn.constructor = C;

        var pr = {
            meta: {
                year: '年',
                season: '季',
                season2: '季度',
                month: '月',
                week: ['日', '一', '二', '三', '四', '五', '六'],
                week2: '周',
                day: '日',
                sel: '选择',
                cur: '本',
                prev: '上',
                next: '下',
                all: '全',
                today: '今'
            },
            dayTime: 86400000
        };

        // 工具集合 Singleton
        /**
         * 导入toolkit包
         * @inner
         */
        /*eslint-disable*/
        // import('./toolkit.js');
        var tk = toolKit() || {};
        /*eslint-enable*/

        /**
         * 初始化函数
         *
         * @return {Object} instance
         */
        fn.init = function () {
            var FIVE_YEARS = 5;
            // 添加缓存
            C.cache || (C.cache = {});

            this._parent_ = parent;

            this.date = new Date();

            option = option || ({});

            // 创建一个片段，提升插入到document上的性能
            this.frame = doc.createDocumentFragment();
            this.endYear = option.endYear || this.date.getFullYear() + FIVE_YEARS;
            this.startYear = !isNaN(option.startYear)
                ? option.startYear
                : this.date.getFullYear() - FIVE_YEARS;
            this.year = this.date.getFullYear();
            this.month = this.date.getMonth();
            this.day = this.date.getDate();
            this.startYear = Math.max(1970, this.startYear);
            this.startYear = Math.min(this.startYear, this.year);
            this.time = +this.date;
            this.style = option.style || '-';

            if (option) {
                tk.each(option, function (a, b) {
                    that[b] || (that[b] = a);
                });
            }

            if (this.Y && this.M) {
                this.M = Math.abs(this.M) - 1;
            }

            this.hasHeader = undefined === option.hasHeader ? true : option.hasHeader;

            this.hasFoot = this.hasFoot || false;

            'function' === typeof callback && (this.callback = callback);

            this.createProperty()
                .controlsFactory()
                .createCalFrame()
                .createTableTitle()
                .createYear()
                .createMonth()
                .addEvent();

            this.start();
            return this;
        };


        fn.start = function () {
            var elems = this.elems;

            if (this.Y) {
                tk.each(elems.selectYear, function (a, b) {
                    elems.selectedIndex = b;
                });
                elems.selectYear.value = this.Y;
                elems.selectMonth.selectedIndex = this.M;
                this.createDate(this.Y, this.M);
            }
            else {
                tk.trigger(elems.today, 'click');
            }
            return this;
        };

        /**
         * 创建日历所用到的结构 ['html标签', 'html的属性(多个属性以逗号分隔,属性键值用#分隔)']
         *
         * @return {Object} instance
         */
        fn.createProperty = function () {
            this.elems = {
                // container: datepicker外框
                container: ['div', 'class#cal-container'],

                // header: 用于放置年月日下拉框
                header: ['div', 'class#cal-header'],

                // body: 用于放置日历table
                body: ['div', 'class#cal-body'],

                // selectYear: 选择具体年份
                selectYear: ['select', 'class#select-year'],

                // selectYear: 选择具体月
                selectMonth: ['select', 'class#select-month'],

                // prev: 选取当前月的上一个月
                prev: ['input', 'type#button,class#cal-prev,value#<'],

                // next: 选取当前月的下一个月
                next: ['input', 'type#button,class#cal-next,value#>'],

                // prev: 选取当前月的上一年
                prevPro: ['input', 'type#button,class#cal-prev-pro,value#«'],

                // prev: 选取当前月的下一年
                nextPro: ['input', 'type#button,class#cal-next-pro,value#»'],

                // prev: 选取今天
                today: ['input', 'type#button,class#calToday,value#' + pr.meta.today]
            };

            return this;
        };

        /**
         * 根据createProperty定义生成节点
         *
         * @return {Object} instance
         */
        fn.controlsFactory = function () {
            var node;
            var attr;

            tk.each(this.elems, function (a, b) {

                node = tk.createHtmlElement(a[0]);

                if (a[1]) {
                    tk.each(a[1].split(','), function (x) {
                        attr = x.split('#');
                        attr[0] && node.setAttribute(attr[0], attr[1]);
                    });
                }

                that.elems[b] = node;
            });

            return this;
        };

        /**
         * 组装结构体，并一次插入到文档碎片上
         *
         * @return {Object} instance
         */
        fn.createCalFrame = function () {
            var elems = this.elems;
            var meta = pr.meta;


            // 添加上一年按钮
            elems.header.appendChild(elems.prevPro);
            // 添加上一月按钮
            elems.header.appendChild(elems.prev);

            // 添加年份选择框
            elems.header.appendChild(elems.selectYear);
            elems.header.appendChild(doc.createTextNode(meta.year));

            // 添加年份选择框
            elems.header.appendChild(elems.selectMonth);
            elems.header.appendChild(doc.createTextNode(meta.month));

            // 添加下一月按钮
            elems.header.appendChild(elems.next);

            // 添加下一年按钮
            elems.header.appendChild(elems.nextPro);

            // 今天按钮
            elems.header.appendChild(elems.today);

            true === this.hasHeader && (elems.container.appendChild(elems.header));

            elems.container.appendChild(elems.body);
            this.frame.appendChild(elems.container);

            'function' === this.ongetframe && this.ongetframe.call(this, this.frame);

            return this;
        };

        // 为节点定义事件和处理事件的句柄
        var eventEmitter = {
            'selectYear:change': function (e) {
                e = tk.getEvent(e);
                var target = tk.getTarget(e);
                that.createDate(target.value, that.elems.selectMonth.value);
            },
            'selectMonth:change': function (e) {
                e = tk.getEvent(e);
                var target = tk.getTarget(e);
                that.createDate(that.elems.selectYear.value, target.value);
            },
            'body:click': function (e) {
                e = tk.getEvent(e);

                var target = tk.getTarget(e);
                var val;

                if (!/tr|th|tbody|thead|table/i.test(target.nodeName)) {
                    while (target.nodeName.toLowerCase() !== 'td') {
                        target = target.parentNode;
                    }
                    val = target.innerHTML;
                }
                !/thead|tfoot/i.test(target.parentNode.parentNode.nodeName)
                && val
                && that.getDateValue(val);

                return that;
            },
            'today:click': function () {
                var elems = this.elems;

                elems.selectYear.selectedIndex = that.year;
                elems.selectYear.value = that.year;
                elems.selectMonth.selectedIndex = that.month;
                elems.selectMonth.value = that.month;
                that.createDate(that.year, that.month);
            },
            'next:click': function () {
                var elems = this.elems;
                var m = elems.selectMonth;
                var index = m.selectedIndex;
                var i;
                var y = elems.selectYear;

                if (index + 1 <= 11) {
                    i = index + 1;
                }
                else {
                    if (y.value === that.endYear) {
                        y.options[y.length - 1].selected = ' ';
                        m.value = 0;
                        that.createDate(y.value, m.value);
                        return;
                    }
                    i = 0;
                    y.selectedIndex = y.selectedIndex - 1;
                }

                m.value = i;
                m.selectedIndex = i;
                y.value && that.createDate(y.value, m.value);
            },
            'nextPro:click': function () {
                var elems = this.elems;
                var y = +elems.selectYear.value;
                var m = elems.selectMonth.value;

                if (y++ >= that.endYear) {
                    return;
                }
                elems.selectYear.selectedIndex = y;
                elems.selectYear.value = y;
                that.createDate(y, m);
            },
            'prev:click': function () {
                var elems = this.elems;
                var m = elems.selectMonth;
                var index = m.selectedIndex;
                var i;
                var y = elems.selectYear;

                if (index - 1 >= 0) {
                    i = index - 1;
                }
                else {
                    if (y.value === that.startYear) {
                        y.selectedIndex = y.length;
                    }
                    i = 11;
                    y.selectedIndex = y.selectedIndex + 1;
                }
                m.value = i;
                m.selectedIndex = i;
                y.value && that.createDate(y.value, m.value);
            },
            'prevPro:click': function () {
                var elems = this.elems;
                var y = +elems.selectYear.value;
                var m = elems.selectMonth.value;

                if (y-- <= that.startYear) {
                    return;
                }
                elems.selectYear.selectedIndex = y;
                elems.selectYear.value = y;
                that.createDate(y, m);
            }
        };

        fn.addEvent = function () {
            var elems = this.elems;

            var key = Object.keys(eventEmitter);
            var i = key.length;
            var make = function (item, handler) {
                item = item.split(':');
                var elemType = item[0];
                var event = item[1];

                tk.addEvent(elems[elemType], event, function (e) {
                    'function' === typeof handler && handler.call(that, e);
                }, false);
            };

            // 绑定事件
            while (i--) {
                make(key[i], eventEmitter[key[i]]);
            }

            return this;
        };

        /**
         * 获取选中日期
         *
         * @param {number} val dayNumber
         * @return {Object} instance
         */
        fn.getDateValue = function (val) {
            var date = [];

            date.push(+this.elems.selectYear.value || this.year);
            date.push(+this.elems.selectMonth.value + 1 || this.month);
            date.push(+val || this.day);
            this.selectDate = date;
            'function' === typeof this.ongetdate && this.ongetdate.call(this, date);

            return this;
        };

        /**
         * 生成日期头(周一至周日)
         *
         * @return {Object} instance
         */
        fn.createTableTitle = function () {
            var w = pr.meta.week;
            var len = w.length;
            var html = [];

            while (len--) {
                html.push(
                    '<th title="' + w[len] + '">'
                    + w[len] +
                    '</th>'
                );
            }

            this.title = '<thead>' + html.reverse().join('') + '</thead>';

            return this;
        };

        /**
         * 根据配置生成年份下拉列表
         *
         * @return {Object} instance
         */
        fn.createYear = function () {
            var y = this.endYear - this.startYear + 1;

            while (y--) {
                var num = this.endYear - y;
                this.elems.selectYear.options[y] = new Option(num, num, num === this.year);
            }
            return this;
        };

        /**
         * 根据配置生成月份下拉列表
         *
         * @return {Object} instance
         */
        fn.createMonth = function () {
            var m = 12;

            while (m--) {
                this.elems.selectMonth.options[m] = new Option(m + 1, m, m === this.month);
            }
            return this;
        };

        /**
         * 获取每月最后一天(下个月第一天减一天)
         *
         * @param {string|number} year 年份
         * @param {string|number} month 月份
         * @return {number} 最后一天
         */
        fn.getMaxDays = function (year, month) {
            var t = +month + 1;

            month = t > 12 ? 1 : t;
            year = t > 12 ? (+year + 1) : year;
            return (
                new Date(+(new Date(year, month, 1)) - pr.dayTime)
            ).getDate();
        };

        /**
         * 获取每月第一天
         *
         * @param {number} year 2015
         * @param {number} month 12
         * @return {Object} instance
         */
        fn.getFirstDay = function (year, month) {
            return new Date(year, month, 1).getDay();
        };

        /**
         * 根据年份和月份生成本月组件(有缓存读取缓存，没有生成并缓存至类的_date_属性上)
         *
         * @param {number} Y 2015
         * @param {number} M 12
         * @return {Object} instance
         */
        fn.createDate = function (Y, M) {
            Y = +Y;
            M = +M;

            Y = Math.max(this.startYear, Y);
            Y = Math.min(this.endYear, Y);

            M = isNaN(M) ? this.month : M;
            M = Math.max(M, 0);
            M = Math.min(M, 11);

            var key = '_date_:' + Y + ':' + M;
            var elems = this.elems;

            // 缓存以做复用
            C.cache[key] || (C.cache[key] = this.getDateString(Y, M));

            this.render(elems, key, Y, M);

            return this;
        };

        /**
         * 根据年,月,日获为过去天添加特殊样式
         *
         * @param {number} y 年份
         * @param {number} m 月份
         * @param {number} day 天
         * @return {string} cssName
         */
        function _getOldDayClass(y, m, day) {
            return (this.date > new Date(y, m, day + 1)) ?  'old-day' : '';
        }

        /**
         * 根据年,月,日获为当天添加特殊样式
         *
         * @private
         * @param {number} y 年份
         * @param {number} m 月份
         * @param {number} day 天
         * @return {string} cssName
         */
        function _getCurrentDayClass(y, m, day) {
            return y === this.year
                && m === this.month
                // 如果是当天添加一个class
                && day === this.day ?
                    'current-day' : '';
        }

        /**
         * 根据年,月,日获为单元个添加title
         *
         * @private
         * @param {number} y 年份
         * @param {number} m 月份
         * @param {number} day 天
         * @return {string} 2015-1-15
         */
        function _getCellTitle(y, m, day) {
            return  '' + y + this.style + (m + 1) + this.style + day;
        }

        /**
         * 获取每日单元格html
         *
         * @private
         * @param {number} y 年份
         * @param {number} m 月份
         * @param {number} day 天
         * @return {string} html
         */
        function _getCellHTML(y, m, day) {

            return '<td class="' +
                // 如果是过去的天数，加old-day样式
                _getOldDayClass.call(this, y, m, day) +

                // 如果是当天，加current-day样式
                _getCurrentDayClass.call(this, y, m, day) +

                '" title="' +

                // 根据this.style的风格生成html title
                _getCellTitle.call(this, y, m, day) +
                '">' +

                    day +

            '</td>';
        }

        /**
         * 根据年份月份生成html字符串
         *
         * @private
         * @param {string|number} y 年份
         * @param {string|number} m 月份
         * @return {string} 生成月份对应的html字符串
         */
        fn.getDateString = function (y, m) {
            var that = this;
            var days = this.getMaxDays(y, m);
            var first = this.getFirstDay(y, m);
            var offset = days + first;
            var html = [];
            var row = Math.ceil(offset / 7);
            var cell = row * 7;

            for (var i = 0; i < row; i++) {
                html.push('</tr>');

                for (var j = 0; j < 7; j++) {
                    if (cell-- <= offset && days > 0) {
                        html.push(
                            _getCellHTML.call(this, y, m, days--)
                        );
                    }
                    else {
                        html.push('<td></td>');
                    }
                }

                html.push('<tr>');
            }

            html = html.reverse().join('');

            ('function' === typeof this.ongetdatestring)
            && this.ongetdatestring.call(that, html);

            return html;
        };

        /**
         * 根据选择日期和配置的日期分隔符生成日期字符串
         *
         * @return {string} 日期字符串 2015-1-11
         */
        fn.toString = function () {
            return this.selectDate.join(this.style);
        };

        /**
         * 获取选择日期字符串
         *
         * @return {string} 日期字符串
         */
        fn.valueOf = function () {
            return this.selectDate;
        };

        /**
         * render
         *
         * @param {Array} elems html节点
         * @param {string} key 缓存的键（_date_:2015:0）
         * @param {string|number} y 年
         * @param {string|number} m 月
         * @return  {Object} instance
         */
        fn.render = function (elems, key, y, m) {
            var that = this;
            var meta = pr.meta;
            var tfoot;

            if (true === this.hasFoot) {
                tfoot =
                    '<tfoot>' +
                    '   <tr>' +
                    '       <td colspan="7">' +
                    y + meta.year + (m + 1) + meta.month +
                    '       </td>' +
                    '   </tr>' +
                    '</tfoot>';
            }

            this.elems.body.innerHTML =
                '<table cellpadding="5" border="1" cellspacing="0">' +
                this.title +
                C.cache[key] +
                (true === this.hasFoot ? tfoot : '') +
                '</table>';

            this._parent_.appendChild(this.frame);

            ('function' === typeof this.onrender) && this.onrender.call(that, this.frame);
            return that;
        };

        /**
         * 添加自定义css属性
         *
         * @param {Object} object cssJson e.g {'font-size':'12px','width':'300px'}
         * @return {Object} instance
         */
        fn.setCss = function (object) {
            var value = [];
            tk.is(object) === 'Object' && (tk.each(object, function (a, b) {
                value.push(b + ':' + a);
            }));
            this.elems.container.style.cssText = value.join(';');

            return this;
        };

        /**
         * 显示组件
         *
         * @return {Object} instance
         */
        fn.show = function () {
            this.elems.container.style.display = 'block';
            return this;
        };

        /**
         * 隐藏组件
         *
         * @return {Object} instance
         */
        fn.hide = function () {
            this.elems.container.style.display = 'none';
            return this;
        };

        this.init();

        this.callback && this.callback.call(this);
        return this;
    }


    // AMD support
    if (typeof define === 'function' && define.amd) {
        define('Datepicker', [], function () {
            return Datepicker;
        });
    }
    else {
        window.Datepicker || (window.Datepicker = Datepicker);
    }

})(this, document);
