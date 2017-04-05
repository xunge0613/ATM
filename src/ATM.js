//---------------------------------------------------------------------
//
// Auto Track Module
// 
// v0.0.2
// URL: [url=https://github.com/xunge0613/ATM/]https://github.com/xunge0613/ATM[/url]
//
// Licensed under the MIT license:
//        [url=http://www.opensource.org/licenses/mit-license.php]http://www.opensource.org/licenses/mit-license.php[/url]
//
//---------------------------------------------------------------------
;(function () {
	const ATM = {}
 
	// CONFIG
	// -----------------------------------------------
	const ATM_CONFIG = {
		/*
            数据校验         
        */
		'VALIDATE_RULES': {
			'piwik_emit': function(data,options) {
				return true
			},
			'test': {
				requiredData: ['test'], 
            	requiredOptions: []
			},
			'baidu_auto': {
				requiredData: [], 
            	requiredOptions: ['trigger','page', 'element']
			},
			'google_auto': {
				requiredData: [], 
            	requiredOptions: ['trigger','page', 'element']
			},
            'piwik_auto': {
            	requiredData: [], 
            	requiredOptions: ['trigger','page', 'element']
            },
            'default_auto': {
            	requiredData: [], 
            	requiredOptions: ['trigger','page', 'element']
            },
            'default_emit': {
            	requiredData: [], 
            	requiredOptions: []
            },
        },
        /*
			数据处理
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
			'default_auto': [
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
			'default_emit': [],
		},
        /*
			数据上报
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
                                atmTracker.trackEvent(data.category, data.action, data.name, data.value);
                            }
                            else {
                                atmTracker.trackEvent(data.category, data.action, data.name);
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

	// RULES

 
	// METHODS 
	// -----------------------------------------------

	// 数据校验
	function validateData(rule, data, options) {
		let _validateStatus = true 

		if(!ATM_CONFIG.VALIDATE_RULES[rule]) {
			// 指定规则，若未找到rule, 认定校验失败		 
			console.warn("ATM validateData: no matched validate rule, Please check your VALIDATE_RULES")
			return false
		}

		if(typeof ATM_CONFIG.VALIDATE_RULES[rule] === 'function') {
			// 规则为函数，直接用该函数进行判断
			return ATM_CONFIG.VALIDATE_RULES[rule](data,options)

		} else if (typeof ATM_CONFIG.VALIDATE_RULES[rule] === 'object') {
			// 规则为对象，使用约定方式进行判断			
			ATM_CONFIG.VALIDATE_RULES[rule].requiredData = ATM_CONFIG.VALIDATE_RULES[rule].requiredData || []
			ATM_CONFIG.VALIDATE_RULES[rule].requiredOptions = ATM_CONFIG.VALIDATE_RULES[rule].requiredOptions || []
			// 任何一个未匹配成功即报错 
			return !ATM_CONFIG.VALIDATE_RULES[rule].requiredData.some(function(val) {		 
				!data[val] && console.warn("ATM validateData: Validate NOT passed, param: data." + val)						
				return !data[val] 
			}) && !ATM_CONFIG.VALIDATE_RULES[rule].requiredOptions.some(function(val) {				
				!options[val] && console.warn("ATM validateData: Validate NOT passed, param: options." + val)
				return !options[val] 
			})  
			
		}


		console.warn("ATM validateData: Type unmatched Please check your ATM_CONFIG.VALIDATE_RULES ")
		return false
	}

	// 数据预处理
	function processData(rule = '', data = {} , options = {}) { 
		if(!ATM_CONFIG.PROCESS_RULES[rule]) {
			// 指定规则，若未找到rule, 认定处理失败		 
			console.warn("ATM validateData: no matched validate rule, Please check your PROCESS_RULES")
			return false
		}	

		if(typeof ATM_CONFIG.PROCESS_RULES[rule] === 'function') {
			// 规则为函数，直接用该函数进行数据处理
			return ATM_CONFIG.PROCESS_RULES[rule](data,options)

		} else if (Object.prototype.toString.call(ATM_CONFIG.PROCESS_RULES[rule]) === '[object Array]') {
			// 规则为数组，使用约定方式进行数据处理								 	
			// mergeOptionName 优先级高于 mergeOptionValue
			ATM_CONFIG.PROCESS_RULES[rule].forEach(function(rule) {				
				if(typeof rule.mergeOptionValue !== 'undefined') {
					data[rule.mergeDataName] = options[rule.mergeOptionValue]
				}
				if(typeof rule.mergeOptionName !== 'undefined') {
					data[rule.mergeDataName] = options[rule.mergeOptionName]
				}
			})
			return data 
		}	
		
	}

	// 数据上报
	function reportData(rule = '', data = {}, options = {}) {				
		if(!ATM_CONFIG.REPORT_RULES[rule]) {
			// 指定规则，若未找到rule, 认定上报失败		 	 
			console.warn("ATM validateData: no matched validate rule, Please check your REPORT_RULES")
			return false
		}

		return ATM_CONFIG.REPORT_RULES[rule](data,options)		 
	}

	// API
	// -----------------------------------------------

	/*
        被动方式 - 代理绑定埋点事件，收集埋点数据，并自动进行数据上报
        @param: data // 需要自定义记录的数据
        data: {
            page: '', // 页面名称: home/index， 默认是 options.page
            trigger: '', // 事件名or操作名 ，默认是 options.element + options.trigger
            element: '', // 触发事件的元素名,默认是 options.element
            value: Number, // 统计计数，默认是1
        }

        @param: options // required
        options: {
            trigger: 'eventName', // required, 触发事件名
            action: '', // 一次性上报or分步骤上报
            page: '', // required, 页面url,大小写不敏感，*表示全部页面
            element: '#id .class tag', // required, 触发事件的元素   
            eventType: 'capture', // 默认 capture 捕获 ，如果使用冒泡方式，则默认绑定在document上
            validateRule: '', // 验证规则
            processRule: '', // 处理规则
            reportRule: '', // 上报规则

        }
    */
	ATM.autoCollectTrackData = function (data = {}, options = {}) {
	  
	    // 数据校验，处理，上报都可空，默认使用 default_auto 进行检验
	    options.validateRule = options.validateRule || 'default_auto'
	    options.processRule = options.processRule || 'default_auto'
	    options.reportRule = options.reportRule || 'default_auto'

	    if(!validateData(options.validateRule, data, options)) {
	    	console.warn("ATM autoCollectTrackData: validateRule NOT passed")
	    	return false
	    }

	   	// page === * 表示全部页面都监听
	    if (options.page === "*") {
	        options.page = window.location.href.toLowerCase();
	    }

	    var currenturl = window.location.href.toLowerCase();
	    try {
	        if (currenturl.indexOf(options.page) != -1) {
	        	if(typeof jQuery === 'undefined') {
		        	// default : Event Capture 默认捕获方式
		        	let _nodeList = document.querySelectorAll(options.element)

		        	if(_nodeList) {
		        		let _elements = Array.prototype.slice.call(_nodeList)
		        		_elements.forEach(function(_element) {
		        			_element.addEventListener(options.trigger,function() {			        		 	
			        		 	console.log(this)
			        		 	console.log('ATM.emitCollectingTrackData(data,options), native, Event Capture')
			        		 	ATM.emitCollectingTrackData(data,options)
			        		 })
		        		})
		        		 
		        	}
		        	// 如果异步加载，则使用事件冒泡委托代理
	        	} else {
	        		// 如果存在jQuery，可以解决兼容性问题
		            $(options.element).on(options.trigger, data, function () {
		                console.log(this)
	        		 	console.log('ATM.emitCollectingTrackData(data,options) ,jQuery ,Event Capture')
	        		 	ATM.emitCollectingTrackData(data,options)
		            })
	        	}	        		        	
	        }                
	    }
	    catch (error) {
	         console.log(error)
	    }
	    
	}

	/*
            主动 触发数据收集
            @param: data {
                page: '', // 页面: home/index， 默认是 options.page
                trigger: '', // 事件名or操作名 ，默认是 options.element + options.trigger
                element: '', // 触发事件的元素名,默认是 options.element
                value: Number, // 统计计数，默认是1
            }
            @param: options {    
                processType: function() {} // 数据处理方式
            }
            data 和 options 不能同时为空，单一可空
            data 为空时，可能是通过 被动方式 autoCollectingTrackData
            options 为空时， 一般是 直接调用主动方式 emitCollectingTrackData
        */
    ATM.emitCollectingTrackData = function (data, options) {
        if (!data && !options) {
            return false;
        }
        // options 为空时，认定为通过主动收集调用，填充默认 processRule, validateRule, reportRule
        options = options || { 
        	processRule: 'default_emit',
        	validateRule: 'default_emit',
        	reportRule: 'default_emit'
        }

        // 默认使用default_emit校验数据
        if (!options.validateRule) {
            options.validateRule = 'default_emit'
        } 

        // 默认使用default_emit处理数据
        if (!options.processRule) {
            options.processRule = 'default_emit'
        } 

        // 默认使用default_emit上报
        if (!options.reportRule) {
            options.reportRule = 'default_emit'
        }

        console.log('emitCollectingTrackData', data, options)   

        // 验证数据         
        if(!validateData(options.validateRule, data, options)) {
        	return false
        }
       
        

        // 上报数据
        // 如果有多个 reportRule
        // 约定使用reportRule作为processRule
	 
        if(typeof options.reportRule === 'string') {
        	// 处理单条数据          
	        // 若返回 false 表示数据处理失败
	        data = processData(options.processRule, data, options)
	        if(data) {
	        	reportData(options.reportRule, data, options)  
	        }		 
		} else if (Object.prototype.toString.call(options.reportRule) === '[object Array]') {
			options.reportRule.forEach(function(rule) {

				// 处理数据          
		        // 若返回 false 表示数据处理失败
		        let _processedData = processData(options.processRule, data, options)		      
		        if(_processedData) {
		        	reportData(rule, _processedData, options)  
		        }
				
			})
		}                      
    }


	// TBD
	ATM.setOptions = function(options) {
		console.log("setOptions:")
		console.log("options: " + options)
		console.log("ATM_CONFIG: " + ATM_CONFIG)	 
	}



	// exports
	// -----------------------------------------------

	// 暴露全局 ATM
	// 如果已存在 ATM ， 为了避免覆盖原有业务中ATM，禁用该插件
	// this.ATM = ATM; babel 转换默认使用 use strict ， 立即执行函数中 this 指向 undefind
	if(window.ATM) {
		console.warn("ATM Fatal Error: window.ATM already exists, Please check")
	}
	window.ATM = window.ATM || ATM

})();
