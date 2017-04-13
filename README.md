github地址： https://github.com/xunge0613/ATM

demo： https://xuxun.me/lab/2017/ATM/demo/index.html

---

[TOC]

# Auto Track Module

## ATM简介

**ATM**是一个针对简单UI交互自动埋点的工具。受到小程序数据统计自定义分析管理界面的启发，而尝试实现的小工具模块。
或者，与其说是一个工具模块，更像是一系列**约定**。
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
- [x] 对于简单UI交互的埋点，全局只需要一套独立的代码即可，避免埋点代码与业务代码的耦合  [ Done ]
- [x] 埋点数据收集、处理、上报都交给ATM和配置文件 [ Done ]
- [x] 对于相同埋点事件，使用多套上报工具，只需配置一次即可 [ Done ]
- [x] 对于'不足之处1'，只需要在业务代码中编写**收集数据**的代码，数据处理和上报都交给ATM封装 [ Done ]
- [ ] 对于上一点，进一步优化，在业务代码中，只触发约定好的自定义事件，包括数据收集都交给埋点代码和ATM进行事件响应
- [ ] 后期愿景是能做到像小程序数据统计自定义分析管理界面那样，无代码，简单填写几个参数，自动生成ATM统计代码
- [ ] 再往后期，愿景是不仅一个埋点工具，而是广义上的数据自动采集工具…… 大概？Perhaps, maybe……

# Get Started


## Dependency / 项目依赖

```html
<script type="text/javascript" src="/path/to/ATM.babel.min.js" ></script>
```
 

## Usage / 项目使用
- 全局变量 引用ATM 
- AMD requirejs 引用 （TBD 准备中……）
- ES6 @import 引用  （TBD 准备中……）

**强烈建议全局单独维护一份 ATM 埋点代码，实现业务与埋点代码解耦**
 
## Quick Start
``` html
<html>
	<div class="js-test-atm">Test</div>
	<script type="text/javascript" src="/path/to/ATM.babel.min.js" ></script>
	<script type="text/javascript" src="/path/to/auto-track-module.js"></script> 
</html>
```


``` javascript
// /path/to/auto-track-module.js

// if you want to simply auto-collect track data using preset tracker tool
window.onload(function() {
	ATM.autoCollectTrackData('click', '.*', '.js-test-atm')
})


// that's all
```

## API

#### ATM.autoCollectTrackData(trigger, page, element, options)
 自动收集埋点数据

##### 必填参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| trigger	|   String |  *true*  |   触发事件名   | 
| page	|   String |  *true*  |   触发事件的页面url,大小写不敏感，*表示全部页面   | 
| element	|   String |  *true*  |   触发事件的元素   | 



##### options 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| desc|   Object|  false  |   统计事件描述信息   | 
| desc.trigger	|   String |  false  |   默认为 trigger， 触发事件的描述   | 
| desc.page	|   String |  false  |   默认为 page， 触发事件的页面描述   | 
| desc.element	|   String |  false  |   默认为 element，触发事件的元素描述   | 
| desc.value	|   Number |  false  |   默认为1，触发事件统计学价值   | 
| tracker |   Object / Array |  false  |   构造统计工具参数,类型为Array时，可以一次上报多个统计平台   | 
| trackerName |   String/Array |  false  |   统计工具,类型为Array时，可以一次上报多个统计平台   | 
| validateRule	|   String  |  false    |   默认为 'default_auto', 数据校验规则   | 
| processRule	|   String |  false    |   默认为 'default_auto', 数据处理规则   | 
| reportRule	|   String/Array |  false    |   默认为 'default_auto', 数据上报规则，   | 


##### 约定
-  以**GA**为例，page 对应 category；trigger 对应 action ；element 对应 label ； value 对应 value

##### 示例代码

``` javascript
// 约定
let data = {}
let options = {
    trigger: 'click', // 触发事件名   
    page: '*', // 触发事件的页面url,大小写不敏感，*表示全部页面
    element: '#section-flow', // 触发事件的元素   
    // validateRule: '', // 可空，校验数据方式，默认为 'default_auto', 
    // processRule: '', // 可空，数据处理方式，默认为 'default_auto', 
    // reportRule: '', // 可空，上报方式，默认为 'default_auto',    
}


// 自动收集埋点
window.onLoad(function() {
	ATM.autoCollectTrackData(data, options);
})


```

#### ATM.emitCollectingTrackData(data, options)
主动收集数据
 对于复杂的交互，无法避免会嵌套一些业务耦合较高的埋点代码，可以使用 ATM.emitCollectingTrackData(data, options) 主动收集数据
##### data 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| DIY	|   String |  false  |   DIY   | 
 
##### options 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| DIY	|   String |  false  |   DIY   | 


注: 此处data, options 的参数由配置文件**约定**

##### 约定
 以**GA**为例，page 对应 category；trigger 对应 action ；element 对应 label ； value 对应 value

##### 示例代码

``` javascript
// 约定
// 如果在业务代码中主动调用此方法，参数可任意填写，只要符合最终上报规则即可
let data = {}
let options = { 
    // validateRule: '', // 可空，校验数据方式，默认为 'default_emit', 
    // processRule: '', // 可空，数据处理方式，默认为 'default_emit', 
    // reportRule: '', // 可空，上报方式，默认为 'default_emit',     
}

// 主动收集
fetch("https://www.example.com/api")
	.then(data => {
		ATM.emitCollectingTrackData(data, options)
	})
	.catch(err => console.error(err))
```

## CONFIG
### ATM_CONFIG
ATM 全局配置，（默认支持piwik、 baidu、 google，其余自定义需要手动配置） 
包含三个部分，是 ATM **约定**的核心构成 
- CONFIG_VALIDATE_RULES 数据校验规则
- CONFIG_PROCESS_RULES 数据处理规则
- CONFIG_REPORT_RULES 数据上报规则

**重要**
-  三种规则如果偷懒可以不填，使用**约定**的默认规则进行校验，处理和上报
-  **但是，如果指定了规则，必须要匹配成功，否则会导致本次上报流程失败。**


#### ATM_CONFIG.VALIDATE_RULES
##### 数据校验规则
调用 ATM.autoCollectTrackData(data, options)， ATM.emitCollectingTrackData(data, options) **都会**根据对应规则进行校验
1. 若**未匹配**到对应规则，则默认**不**进行数据校验
2. 匹配到对应规则后
 -  对于Object类型规则，使用默认验证方式，验证 requiredData 和 requiredOptions 两个数组内字段是否有值
 -  对于Function类型规则，使用该自定义验证函数进行验证

##### 配置说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| validateRule	|   Function/Object |  true  |   类型为Function，自定义验证规则；类型为Object，使用默认验证规则   | 
##### 代码示例
```javascript
const ATM_CONFIG = {
		/*
            数据校验规则         
        */	
		'VALIDATE_RULES': {
			'piwik_emit': function(data,options) {
				return true
			},
			'test': {
				requiredData: ['test'], 
            	requiredOptions: []
			},		
			'default_auto': {
            	requiredData: [], 
            	requiredOptions: []
            },
            'default_emit': {
            	requiredData: [], 
            	requiredOptions: ['trigger']
            },
        },
	}
}
```
#### ATM_CONFIG.PROCESS_RULES
##### 数据处理规则
用于将收集到的数据按照**约定**转换为可上报数据
1. 若**未匹配**到对应规则，则默认**不**进行数据处理
2. 匹配到对应规则后
 -  对于 Array 类型规则，使用默认处理方式，**默认约定只允许从 option 赋值到 data **
 -  对于 Function 类型规则，使用该自定义验证函数进行处理
##### 配置说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| processRule	|   Function/Array |  true  |   类型为Function，自定义处理规则；类型为Array，使用默认处理规则   | 
| processRule[].mergeDataName	|   String |  *true*  |   被赋值的data字段名   | 
| processRule[].mergeOptionName	|   String |  false |   提供赋值的option属性名   | 
| processRule[].mergeOptionValue	|   String |  false |   提供赋值的option属性值   | 

##### 约定 
- processRule[].mergeOptionName 与 processRule[].mergeOptionValue 两者之间必须有一个非空，优选使用 mergeOptionName 进行赋值
- 默认情况下，经过 processRule 从 option 赋值到data 的优先级**低于**原先 data 中已赋值的优先级
`即 data.page = data.page || options.page`


##### 代码示例
```javascript
const ATM_CONFIG = {
		/*
            数据处理规则         
        */
		'PROCESS_RULES': {
			'piwik_emit': function(data,options) {
				return data
			},
			'piwik_auto': [
				{
					mergeDataName: 'category',
					mergeOptionName: 'page'
				},
				{
					mergeDataName: 'action',
					mergeOptionName: 'trigger'
				},
				{
					mergeDataName: 'name',
					mergeOptionName: 'element'
				},
				{
					mergeDataName: 'value',
					mergeOptionValue: 1
				},								
			],
			'default_auto': function(data,options) {
				return data
			},
			'default_emit': [],
		},
	}
}
```
#### ATM_CONFIG.REPORT_RULES
##### 数据上报规则
调用 ATM.emitCollectingTrackData(data, options) **会**根据对应规则进行上报
1. 若**未匹配**到对应规则，则默认**不**进行数据上报
2. 匹配到对应规则后，使用规则进行上报

##### 配置说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| reportRule	|   Function |  true  |   类型为Function，上报规则，默认参数 data,options | 



##### 代码示例
```javascript
const ATM_CONFIG = {
		/*
            数据上报规则         
        */
		'REPORT_RULES': {			
            'default_emit': function(data, options) { 
	            console.log("ATM report default_emit",data)                 
                return ;
			},
            'default_auto': function(data, options) { 
	            console.log("ATM report default_auto",data)
                 //Piwik延时执行
                let piwikTT = setInterval(function () {
                    if (!(typeof Piwik === 'undefined')) {
                        try {
                            let atmTracker = Piwik.getTracker();
                            if (data.value) {
                                atmTracker.trackEvent(data.page, data.trigger, data.element, data.value);
                            }
                            else {
                                atmTracker.trackEvent(data.page, data.trigger, data.element);
                            }
                        }
                        catch (error) {
                            //do nothing
                            console.log("piwik 尚未加载");
                        } finally {
                            clearInterval(piwikTT);
                        }
                    }
                }, 200);
                return ;
			},
        }, 
	}
}
```

#### ATM.createTracker(options)  
创建统计工具
##### options 参数说明
| Name		|     Type |   Required   |   Description   |
| :-: | :-:| :-: | :-: |
| trackerName|   String  |  *true*	|  统计工具名   | 
| validateRule	|   String  |  false    |   默认为 'default_auto', 数据校验规则   | 
| processRule	|   String |  false    |   默认为 'default_auto', 数据处理规则   | 
| reportRule	|   String/Array |  false    |   默认为 'default_auto', 数据上报规则，   | 


##### 示例代码

``` javascript
 ATM.createTracker(options)  
``` 

## 兼容性
IE9+ 

无需jQuery依赖

# Change Log

v 0.0.4 重写规则匹配逻辑
-  API 参数结构调整优化，前置必填参数，合并可选参数  v0.0.4  [@Anobaka](https://github.com/anobaka)'s advice
-  重写规则匹配逻辑，原先由配置文件mapping改为实例化tracker对象，规则合为一条 v0.0.4  [@Anobaka](https://github.com/anobaka)'s advice
-  options.page 改用正则匹配 v0.0.4  [@Anobaka](https://github.com/anobaka)'s advice
-  加入线上demo 

v 0.0.1 文档 + 基础功能  + demo 

# 参考

GA 事件追踪 https://support.google.com/analytics/answer/1033068#Anatomy 

piwik 事件追踪 https://piwik.org/docs/event-tracking/

# To Be Done

## Requirements Aspect / 需求层面
- 当页面加载时，获取特定值（某hidden input的值或者某全局变量的值） 进行上报 v0.1.1
- 自动埋点可配置后台开发 v1.0.0
- 自动埋点功能，增加监听数据变化，当数据变化时，自动上报 v0.1.2 

## Code Aspect / 代码层面
-  简化约定，对于自定义规则，rule 必须为 function 类型 v0.0.5 
-  方案A：底层重写，存在多个tracker时，改用 new Tracker() ， 不再使用 trackerName + 'options' 这类不友好的约定；
   即： 将 trackerName, options.xxxRules 抽象成一个类，实现 new ATMTrackerFactory([new TrackerA(), new TrackerB()]) v0.0.5
- 方案B： API接口调整，trackerName 与 options.xxxRule 同级， 只保留一个参数，类型为对象or数组 v0.0.5
-  使用自定义事件代替主动触发 emitCollectingTrackData(data, options) 进一步解耦主动上报逻辑 v0.1.0；从而业务代码中也可以半声明式调用 ATM， 而非命令式，后期可以做到可配置化
-  加入AMD模块化规范 v0.0.6
-  【废弃】配置文件补全 google, baidu, piwik 统计 v0.0.6  
-  【上一条 改为】 配置文件只提供最基本default, 在文档中加入google、baidu等示例，可提供外置json配置文件而非核心库，v0.0.7
-  另外增加一个jQuery版本ATM， 解决兼容性问题 v?.?.?
-  API 调整， ATM.autoCollectTrackData(new ATMCollector(), [new ATMTracker()])  v0.2.0

## Documentation Aspect / 文档层面 
-  文档翻译成英文  


# Misc /  杂七杂八


# Thanks / 鸣谢
> Inspired By & Special Thanks for https://mp.weixin.qq.com/debug/wxadoc/analysis/custom/

Thanks [@Anobaka](https://github.com/anobaka) for advices


# Lisence 
MIT
