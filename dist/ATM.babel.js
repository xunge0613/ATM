'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	var ATM = {};

	// CONFIG
	// -----------------------------------------------
	var ATM_CONFIG = {
		/*
            数据校验         
        */
		'VALIDATE_RULES': {
			'piwik_emit': function piwik_emit(data, options) {
				return true;
			},
			'test': {
				requiredData: ['test'],
				requiredOptions: []
			},
			'baidu_auto': {
				requiredData: [],
				requiredOptions: ['trigger', 'page', 'element']
			},
			'google_auto': {
				requiredData: [],
				requiredOptions: ['trigger', 'page', 'element']
			},
			'piwik_auto': {
				requiredData: [],
				requiredOptions: ['trigger', 'page', 'element']
			},
			'default': {
				requiredData: [],
				requiredOptions: []
			}
		},
		/*
  数据处理
  */
		'PROCESS_RULES': {
			'piwik_emit': function piwik_emit(data, options) {
				return true;
			},
			'piwik_auto': [{
				mergeDataName: 'category',
				mergeOptionName: 'page'
			}, {
				mergeDataName: 'action',
				mergeOptionName: 'trigger'
			}, {
				mergeDataName: 'name',
				mergeOptionName: 'element'
			}, {
				mergeDataName: 'value',
				mergeOptionValue: 1
			}]
		},
		/*
  数据上报
  */
		'REPORT_RULES': {
			'piwik_auto': function piwik_auto(data, options) {
				console.log("report piwik", data);
				//Piwik延时执行
				var piwikTT = setInterval(function () {
					if (!(typeof Piwik === 'undefined')) {
						try {
							var atmTracker = Piwik.getTracker();
							if (data.value) {
								atmTracker.trackEvent(data.category, data.action, data.name, data.value);
							} else {
								atmTracker.trackEvent(data.category, data.action, data.name);
							}
						} catch (error) {
							//do nothing
							console.log("piwik 尚未加载");
						} finally {
							clearInterval(piwikTT);
						}
					}
				}, 200);
				return;
			},
			'default': function _default(data, options) {
				return;
			}
		}

	};

	// RULES


	// METHODS 
	// -----------------------------------------------

	// 数据校验
	function validateData(rule, data, options) {
		var _validateStatus = true;

		if (!ATM_CONFIG.VALIDATE_RULES[rule]) {
			// 未找到rule, 默认不校验
			// rule = 'default'
			console.warn("ATM validateData: no matched validate rule, default return true");
			return true;
		}

		if (typeof ATM_CONFIG.VALIDATE_RULES[rule] === 'function') {
			// 规则为函数，直接用该函数进行判断
			return ATM_CONFIG.VALIDATE_RULES[rule](data, options);
		} else if (_typeof(ATM_CONFIG.VALIDATE_RULES[rule]) === 'object') {
			// 规则为对象，使用约定方式进行判断			
			ATM_CONFIG.VALIDATE_RULES[rule].requiredData = ATM_CONFIG.VALIDATE_RULES[rule].requiredData || [];
			ATM_CONFIG.VALIDATE_RULES[rule].requiredOptions = ATM_CONFIG.VALIDATE_RULES[rule].requiredOptions || [];
			// 任何一个未匹配成功即报错 
			return !ATM_CONFIG.VALIDATE_RULES[rule].requiredData.some(function (val) {
				!data[val] && console.warn("ATM validateData: Validate NOT passed, param: data." + val);
				return !data[val];
			}) && !ATM_CONFIG.VALIDATE_RULES[rule].requiredOptions.some(function (val) {
				!options[val] && console.warn("ATM validateData: Validate NOT passed, param: options." + val);
				return !options[val];
			});
		}

		console.warn("ATM validateData: Type unmatched Please check your ATM_CONFIG.VALIDATE_RULES ");
		return true;
	}

	// 数据处理
	function processData(rule, data, options) {}

	// 数据上报
	function reportData(rule, data, options) {}

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
	ATM.autoCollectTrackData = function (data, options) {
		// 保证 data 是个对象
		if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== "object" || !data) {
			data = {};
		}

		// 保证事件绑定有效
		if (!options || !options.trigger || !options.page || !options.element) {
			console.warn("ATM autoCollectTrackData: required options missed");
			return false;
		}

		// 数据校验
		if (options.validateRule && !validateData(options.validateRule, data, options)) {
			console.warn("ATM autoCollectTrackData: validateRule NOT passed");
			return false;
		}

		if (options.page === "*") {
			options.page = window.location.href.toLowerCase();
		}

		var currenturl = window.location.href.toLowerCase();
		try {
			if (currenturl.indexOf(options.page) != -1) {
				// default : Event Capture 默认捕获方式
				var _nodeList = document.querySelectorAll(options.element);

				if (_nodeList) {
					var _elements = Array.prototype.slice.call(_nodeList);
					_elements.map(function (_element) {
						_element.addEventListener(options.trigger, function () {
							// ATM.emitCollectingTrackData(data,options)
							console.log(this);
							console.log('ATM.emitCollectingTrackData(data,options)');
						});
					});
				}
				// 事件冒泡

				// 如果存在jQuery 

				//$(options.element).on(options.trigger, data, function () {
				//    ahs.ATM.emitCollectingTrackData(data,options)
				//})
			}
		} catch (error) {
			console.log(error);
		}
	};

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
		options = options || { processType: 'default' };

		// 默认使用Piwik处理数据
		if (!options.processType) {
			options.processType = 'default';
		}

		// 默认使用Piwik上报
		if (!options.reportType) {
			options.reportType = 'default';
		}

		console.log('emitCollectingTrackData', data, options);

		// 处理数据          
		data = ATM_CONFIG.PROCESS_TYPE_MAPPING[options.processType] && ATM_CONFIG.PROCESS_TYPE_MAPPING[options.processType](data, options);

		// 上报数据           
		ATM_CONFIG.REPORT_TYPE_MAPPING[options.reportType] && ATM_CONFIG.REPORT_TYPE_MAPPING[options.reportType](data, options);
	};

	// TBD
	ATM.setOptions = function (options) {
		console.log("setOptions:");
		console.log("options: " + options);
		console.log("ATM_CONFIG: " + ATM_CONFIG);
	};

	// exports
	// -----------------------------------------------

	// 暴露全局 ATM
	// this.ATM = ATM; babel 转换默认使用 use strict ， 立即执行函数中 this 指向 undefind
	window.ATM = ATM;
})();