文档先行吧
github地址： https://github.com/xunge0613/ATM


---

[TOC]

# Auto Track Module

## ATM简介

**ATM**是一个针对简单UI交互自动埋点的工具。受到小程序数据统计自定义分析管理界面的启发，而尝试实现的小工具模块。
或者，与其说是一个工具模块，更像是一套**约定**。
约定好统计代码、广告投放代码的数据对接格式，

如果你也遇到过以下**痛点**，不妨尝试一下ATM：
-  数据埋点、数据收集、数据上报代码与业务代码强耦合
-  不同广告投放使用不同规则的数据收集代码，维护成本很大
-  有时候统计代码或者广告代码js报错了，会导致网站炸了…… （面壁中……）

当然毕竟作者是个菜鸟，代码写的不咋样，权当抛砖引玉

## 不足之处
- 对于复杂的交互，无法避免会嵌套一些业务耦合较高的埋点代码
- ATM才刚起步，性能上，设计上可能存在各种神奇的缺陷…… 

## 愿景
- 对于简单UI交互的埋点，全局只需要一套独立的代码即可，避免埋点代码与业务代码的耦合
- 愿景是数据收集、处理、上报都交给ATM和配置文件
- 对于'不足之处1'，由于约定的存在，只需要在业务代码中编写收集数据的代码，数据处理和上报都交给ATM封装
- 后期愿景是能做到像小程序数据统计自定义分析管理界面那样，无代码，简单填写几个参数，自动生成ATM统计代码

# 开始使用ATM

## 内部实现
内部 @import 配置文件 （默认支持piwik, baidu, google ，其余自定义需要手动配置）
function merge()
CONFIG_VALIDATE_RULES
CONFIG_REPORT_RULES
CONFIG_PROCESS_RULES

## 项目依赖

```vbscript-html
<script type="text/javascript" src="/path/to/ATM.babel.min.js" ></script>
```
 

## 项目使用
- 全局变量 引用ATM 
- AMD requirejs 引用 （TBD 准备中……）
- ES6 @import 引用  （TBD 准备中……）

**强烈建议全局单独维护一份 ATM 埋点代码，实现业务与埋点代码解耦**
```vbscript-html
<script type="text/javascript" src="/path/to/auto-track-module.js"></script>
```

## Usage

#### ATM.autoCollectTrackData(data, options)
 自动收集埋点数据
##### data 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| trigger	|   String |  false  |   默认为 options.trigger， 触发事件的描述   | 
| page	|   String |  false  |   默认为 options.page， 触发事件的页面描述   | 
| element	|   String |  false  |   默认为 options.element，触发事件的元素描述   | 
| value	|   Number |  false  |   默认为1，触发事件统计计数   | 

注:   此处data 可为空对象 {}，主要用于描述埋点事件说明


##### options 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| trigger	|   String |  *true*  |   触发事件名   | 
| page	|   String |  *true*  |   触发事件的页面url,大小写不敏感，*表示全部页面   | 
| element	|   String |  *true*  |   触发事件的元素   | 
| value	|   Number |  false  |   默认为 1，触发事件统计计数   | 
| validateRule	|   String  |  *true*  |   数据校验规则   | 
| processRule	|   String |  *true*  |   数据处理规则   | 
| reportRule	|   String |  *true*  |   数据上报规则   | 

注: 此处options 不可为空对象 {}，需要根据options的参数进行埋点事件绑定

##### 约定
 以**GA**为例，page 对应 category；trigger 对应 action ；element 对应 label ； value 对应 value
 
##### 示例代码

``` javascript
// 约定
let data = {}
let options = {
	trigger: 'click', // 触发事件名   
    page: '*', // 触发事件的页面url,大小写不敏感，*表示全部页面
    element: '#section-flow', // 触发事件的元素   
    // validateRule: '', // 可空，校验数据方式，默认piwik
    // processRule: '', // 可空，数据处理方式，默认piwik
    // reportRule: '', // 可空，上报方式，默认piwik    
}


// 自动收集埋点
ATM.autoCollectTrackData(data, options);

```

#### ATM.emitCollectingTrackData(data, options)
主动收集数据
##### data 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| trigger	|   String |  false  |   默认为 options.trigger， 触发事件的描述   | 
| page	|   String |  false  |   默认为 options.page， 触发事件的页面描述   | 
| element	|   String |  false  |   默认为 options.element，触发事件的元素描述   | 
| value	|   Number |  false  |   默认为1，触发事件统计计数   | 

注:   此处data 可为空对象 {}，主要用于描述埋点事件说明


##### options 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| trigger	|   String |  *true*  |   触发事件名   | 
| page	|   String |  *true*  |   触发事件的页面url,大小写不敏感，*表示全部页面   | 
| element	|   String |  *true*  |   触发事件的元素   | 
| value	|   Number |  false  |   默认为 1，触发事件统计计数   | 
| validateRule	|   String  |  *true*  |   数据校验规则   | 
| processRule	|   String |  *true*  |   数据处理规则   | 
| reportRule	|   String |  *true*  |   数据上报规则   | 

注: 此处options 不可为空对象 {}，需要根据options的参数进行埋点事件绑定

##### 约定
 以**GA**为例，page 对应 category；trigger 对应 action ；element 对应 label ； value 对应 value

##### 示例代码

``` javascript
// 约定
let data = {}
let options = {
	trigger: 'click', // 触发事件名   
    page: '*', // 触发事件的页面url,大小写不敏感，*表示全部页面
    element: '#section-flow', // 触发事件的元素   
    // validateRule: '', // 可空，校验数据方式，默认piwik
    // processRule: '', // 可空，数据处理方式，默认piwik
    // reportRule: '', // 可空，上报方式，默认piwik    
}

// 主动收集
fetch("https://www.example.com/api")
	.then(data => {
		ATM.emitCollectingTrackData(data, options)
	})
	.catch(err => console.error(err))
```
#### ATM.setOptions(options)  （TBD 准备中……）
设置全局options

##### 示例代码

``` javascript
ATM.setOptions(options)
``` 

# 参考

GA 事件追踪 https://support.google.com/analytics/answer/1033068#Anatomy 

piwik 事件追踪 https://piwik.org/docs/event-tracking/


# 鸣谢
> Inspired By & Special Thanks for https://mp.weixin.qq.com/debug/wxadoc/analysis/custom/
