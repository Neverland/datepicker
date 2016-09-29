#Datepicker
 Datepicker是一个使用非常简单的日期控件，缓存没一个月份所生成的数据，减少运算量。配置丰富能够满足不同的业务需求。

##property
<table>
	<tr>
		<td>Node</td>
	    <td>*htmlNode</td>
	    <td>nodeType为1的节点，控件会被append此节点内</td>
    </tr>
	<tr>
	    <td>Object</td>
		<td>O</td>
	    <td>配置控件可选参数</td>
    </tr>
	<tr>
		<td>number</td>
	    <td>O.Y</td>
	    <td>设置的年份，默认当年，范围(1970-当年+10)</td>
    </tr>
	<tr>
		<td>number</td>
	    <td>O.M</td>
	    <td>设置的月份，默认当月，范围(1-12)</td>
    </tr>
	<tr>
		<td>string</td>
	    <td>O.hasTitle</td>
	    <td>是否有日期控制栏，默认有'true'</td>
    </tr>
	<tr>
		<td>string</td>
	    <td>O.hasFoot</td>
	    <td>是否有脚注用来显示年月，默认无'false'</td>
    </tr>
	<tr>
		<td>string</td>
	    <td>O.style</td>
	    <td>日期分隔符，默认'-'</td>
    </tr>
	<tr>
		<td>number</td>
	    <td>O.startYear</td>
	    <td>开始年，默认2006</td>
    </tr>
	<tr>
		<td>number</td>
	    <td>O.endtYear</td>
	    <td>结束年，默认当年加10</td>
    </tr>
	 <tr>
		<td>Function</td>
	    <td>O.ongetdate</td>
	    <td>用户点击日期单元格时触发，this指向实例，第一个参数为日期对应数组</td>
    </tr>
	<tr>
		<td>Function</td>
	    <td>O.onrender</td>
	    <td>控件插入值dom树时触发，this指向实例，第一个参数为控件对应的dom节点</td>
    </tr>
	<tr>
		<td>Function</td>
	    <td>O.ongetdatestring</td>
	    <td>获得月份所对应的日期字符串时触发，this指向实例，第一个参数为字符串</td>
    </tr>
	<tr>
		<td>Function</td>
	    <td>O.ongetframe</td>
	    <td>组成完毕控件node框架时触发，this指向实例，第一个参数为对应的dom节点</td>
    </tr>
	<tr>
		<td>Function</td>
	    <td>fn</td>
	    <td>类的回调函数，生成控件后触发</td>
    </tr>
 </table>

##method
<table>
    <tr>
        <td>方法名</td>
        <td>参数</td>
        <td>返回值</td>
    </tr>
    <tr>
        <td>createDay</td>
        <td>Y:number/string(2012),M:number/string(0-11)</td>
        <td>实例（1储存日期字符串至Cal的cache中，是数据持久化；2调用render）</td>
    </tr>
    <tr>
        <td>render</td>
        <td>node:(this.elems),key:string('_date_:2012:0'),Y:number(2012),M:number(0-11)</td>
        <td>实例（渲染控件至dom树）</td>
    </tr>
    <tr>
        <td>getDateString</td>
        <td>Y:number(2012),M:number(0-11)</td>
        <td>htmlString</td>
    </tr>
    <tr>
        <td>toString</td>
        <td></td>
        <td>string '2012-12-12' (获取选中日期对应的字符串)</td>
    </tr>
    <tr>
        <td>valueOf</td>
        <td></td>
        <td>Array [2012,12,12] (获取选中日期对应的数组)</td>
    </tr>
    <tr>
        <td>hide</td>
        <td></td>
        <td>实例 (隐藏控件)</td>
    </tr>
    <tr>
        <td>show</td>
        <td></td>
        <td>实例 (显示控件)</td>
    </tr>
    <tr>
        <td>setCss</td>
        <td>Object({'font-size':'12px','width':'300px'})</td>
        <td>实例 (为控件添加样式)</td>
    </tr>
 </table>

###e.g
```javascript
new Datepicker(node,
    {
    ongetdate: function () {
        console.log(this.toString());
    }
});
```
