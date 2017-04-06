'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//---------------------------------------------------------------------
//
// Auto Track Module
// 
// v0.0.4
// URL: [url=https://github.com/xunge0613/ATM/]https://github.com/xunge0613/ATM[/url]
//
// Licensed under the MIT license:
//        [url=http://www.opensource.org/licenses/mit-license.php]http://www.opensource.org/licenses/mit-license.php[/url]
//
//---------------------------------------------------------------------
;(function () {

	// 默认配置 CONFIG
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
			'default_auto': {
				requiredData: [],
				requiredOptions: []
			},
			'default_emit': {
				requiredData: [],
				requiredOptions: ['trigger']
			}
		},
		/*
  数据处理
  */
		'PROCESS_RULES': {
			'piwik_emit': function piwik_emit(data, options) {
				return data;
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
			}],
			'default_auto': function default_auto(data, options) {
				return data;
			},
			'default_emit': []
		},
		/*
  数据上报
  */
		'REPORT_RULES': {
			'default_emit': function default_emit(data, options) {
				console.log("ATM report default_emit", data);
				return;
			},
			'default_auto': function default_auto(data, options) {
				console.log("ATM report default_auto", data);
				//Piwik延时执行
				var piwikTT = setInterval(function () {
					if (!(typeof Piwik === 'undefined')) {
						try {
							var atmTracker = Piwik.getTracker();
							if (data.value) {
								atmTracker.trackEvent(data.page, data.trigger, data.element, data.value);
							} else {
								atmTracker.trackEvent(data.page, data.trigger, data.element);
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
			}
		}

	};

	var ATM = {
		presetRules: {
			'default_auto': {
				validateRule: ATM_CONFIG.VALIDATE_RULES.default_auto,
				processRule: ATM_CONFIG.PROCESS_RULES.default_auto,
				reportRule: ATM_CONFIG.REPORT_RULES.default_auto
			},
			'default_emit': {
				validateRule: ATM_CONFIG.VALIDATE_RULES.default_emit,
				processRule: ATM_CONFIG.PROCESS_RULES.default_emit,
				reportRule: ATM_CONFIG.REPORT_RULES.default_emit
			},
			'piwik_auto': {
				validateRule: ATM_CONFIG.VALIDATE_RULES.default_auto,
				processRule: ATM_CONFIG.PROCESS_RULES.default_auto,
				reportRule: ATM_CONFIG.REPORT_RULES.default_auto
			},
			'google_auto': {
				validateRule: ATM_CONFIG.VALIDATE_RULES.default_auto,
				processRule: ATM_CONFIG.PROCESS_RULES.default_auto,
				reportRule: ATM_CONFIG.REPORT_RULES.google_auto }
		},
		atmTracker: {
			// 缓存已创建的 ATMTracker 实例
			// trackerName: new ATMTracker()
		}
	};

	// ATMTracker

	var ATMTracker = function () {
		function ATMTracker(trackerName, data, options) {
			_classCallCheck(this, ATMTracker);

			if (ATM.presetRules[trackerName]) {
				// 若有预设规则，则使用该规则
				this.validateRule = ATM.presetRules[trackerName].validateRule;
				this.processRule = ATM.presetRules[trackerName].processRule;
				this.reportRule = ATM.presetRules[trackerName].reportRule;
			} else {

				// 若 ruleName 是 string 则匹配是否存在


				// 若 ruleName 是 function 

				// 命名空间
				// 若预设中不存在，则匹配 options[trackerName + 'options'] 字段是否存在 （用于区分同时多个统计工具）
				// 若存在，则使用该对象的属性
				if (options[trackerName + 'options']) {
					// 分别判断 function or string 
					options[trackerName + 'options'].validateRule && (this.validateRule = options.validateRule)(options[trackerName + 'options'].processRule) && (this.processRule = options.processRule)(options[trackerName + 'options'].reportRule) && (this.reportRule = options.reportRule);
				} else {
					// 若都不满足，则取 options.xxxRule
					this.validateRule = options.validateRule;
					this.processRule = options.processRule;
					this.reportRule = options.reportRule;
				}
			}
		}

		_createClass(ATMTracker, [{
			key: 'validateData',
			value: function validateData(data, options) {
				console.log('ATM tracker : validateData');

				if (!this.validateRule) {
					// 指定规则，若未找到rule, 认定校验失败		 
					console.warn("ATM validateData: no matched validate rule, Please check your options.validateRule");
					return false;
				}

				if (typeof this.validateRule === 'function') {
					// 规则为函数，直接用该函数进行判断
					return this.validateRule(data, options);
				} else if (_typeof(this.validateRule) === 'object') {
					// 规则为对象，使用约定方式进行判断			
					this.validateRule.requiredData = this.validateRule.requiredData || [];
					this.validateRule.requiredOptions = this.validateRule.requiredOptions || [];
					// 任何一个未匹配成功即报错 
					return !this.validateRule.requiredData.some(function (val) {
						!data[val] && console.warn("ATM validateData: Validate NOT passed, param: data." + val);
						return !data[val];
					}) && !this.validateRule.requiredOptions.some(function (val) {
						!options[val] && console.warn("ATM validateData: Validate NOT passed, param: options." + val);
						return !options[val];
					});
				}

				console.warn("ATM validateData: Rule unmatched Please check your options.validateRule ");
				return false;
			}
		}, {
			key: 'processData',
			value: function processData(data, options) {
				console.log('ATM tracker : processData');

				if (!this.processRule) {
					// 指定规则，若未找到rule, 认定处理失败		 
					console.warn("ATM validateData: no matched process rule, Please check your options.processRule");
					return false;
				}

				if (typeof this.processRule === 'function') {
					// 规则为函数，直接用该函数进行数据处理
					return this.processRule(data, options);
				} else if (Object.prototype.toString.call(this.processRule) === '[object Array]') {
					// 规则为数组，使用约定方式进行数据处理								 	
					// mergeOptionName 优先级高于 mergeOptionValue
					this.processRule.forEach(function (rule) {
						if (typeof rule.mergeOptionValue !== 'undefined') {
							data[rule.mergeDataName] = options[rule.mergeOptionValue];
						}
						if (typeof rule.mergeOptionName !== 'undefined') {
							data[rule.mergeDataName] = options[rule.mergeOptionName];
						}
					});
					return data;
				}

				console.warn("ATM validateData : Rule unmatched Please check your options.processRule ");
				return false;
			}
		}, {
			key: 'reportData',
			value: function reportData(data, options) {
				console.log('ATM tracker : reportData');

				if (!this.reportRule) {
					// 指定规则，若未找到rule, 认定上报失败		 	 
					console.warn("ATM reportData: no matched report rule, Please check your options.reportRule");
					return false;
				}
				if (typeof this.reportRule === 'function') {
					// 规则为函数，直接用该函数进行判断
					return this.reportRule(data, options);
				}
				console.warn("ATM validateData: Rule unmatched Please check your options.reportRule");
				return false;
			}

			// emit collecting track data 主动上报

		}, {
			key: 'emit',
			value: function emit(data, options) {
				// 验证
				if (!this.validateData(data, options)) {
					return false;
				}
				// 处理
				var _processedData = this.processData(data, options);
				// 上报
				if (_processedData) {
					this.reportData(_processedData, options);
				}
			}
		}]);

		return ATMTracker;
	}();

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


	ATM.autoCollectTrackData = function (trigger, page, element) {
		var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


		// 数据校验，处理，上报都可空，默认使用 default_auto 进行检验
		options.trackerName = options.trackerName || 'default_auto';
		options.validateRule = options.validateRule || 'default_auto';
		options.processRule = options.processRule || 'default_auto';
		options.reportRule = options.reportRule || 'default_auto';

		// 数据预处理
		options.desc = options.desc || {};
		options.desc = {
			trigger: options.desc.trigger || trigger,
			page: options.desc.page || page,
			element: options.desc.element || element,
			value: options.desc.value || 1
		};

		// 此处只验证埋点信息是否正确，不验证数据是否合法，也不对数据进行处理


		if (!trigger || !page || !element) {
			console.warn("ATM autoCollectTrackData: validateRule NOT passed");
			return false;
		}

		// page === .* 表示全部页面都监听	    
		// page 默认后期会由后台自动生成，前期需要自己手写正则
		var pageRegexp = new RegExp(page, 'i');
		var currenturl = window.location.href.toLowerCase();
		try {
			if (currenturl.match(pageRegexp)) {
				if (typeof jQuery === 'undefined') {
					// default : Event Capture 默认捕获方式
					var _nodeList = document.querySelectorAll(element);

					if (_nodeList) {
						var _elements = Array.prototype.slice.call(_nodeList);
						_elements.forEach(function (_element) {
							_element.addEventListener(trigger, function () {
								console.log(this);
								console.log('ATM.emitCollectingTrackData(data,options.desc), native, Event Capture');
								ATM.emitCollectingTrackData(options.trackerName, options.desc, options);
							});
						});
					}
					// 如果异步加载，则使用事件冒泡委托代理
				} else {
					// 如果存在jQuery，可以解决兼容性问题
					$(element).on(trigger, function () {
						console.log(this);
						console.log('ATM.emitCollectingTrackData(data,options) ,jQuery ,Event Capture');
						ATM.emitCollectingTrackData(options.trackerName, options.desc, options);
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	/*
            主动 触发数据收集
         	@param: trackerName 统计工具名 
 			type: String/Array
         @param: options {    
                processType: function() {} // 数据处理方式
            }
            data 和 options 不能同时为空，单一可空
            data 为空时，可能是通过 被动方式 autoCollectingTrackData
            options 为空时， 一般是 直接调用主动方式 emitCollectingTrackData
        */
	ATM.emitCollectingTrackData = function (trackerName, data, options) {
		if (!data && !options) {
			return false;
		}

		// options 为空时，认定为通过主动收集调用，填充默认 
		options = options || {
			trackerName: 'default_emit'
		};

		console.log('emitCollectingTrackData', data, options);

		// 上报数据
		// 如果有多个 reportRule
		// 约定使用reportRule作为processRule

		if (typeof options.trackerName === 'string') {
			_applyATMTracker(options.trackerName, data, options);
		} else if (Object.prototype.toString.call(options.trackerName) === '[object Array]') {
			options.trackerName.forEach(function (_trackerName) {
				_applyATMTracker(_trackerName, data, options);
			});
		}
	};

	// 全局注册 ATMTracker
	function _initATMTracker(trackerName, data, options) {
		// 调用 ATM Tracker 进行数据验证、处理、分析
		// 同时在全局注册该 tracker 实例， 以避免重复new实例	
		if (!ATM.atmTracker[trackerName]) {
			ATM.atmTracker[trackerName] = new ATMTracker(trackerName, data, options);
		}
	}

	function _applyATMTracker(trackerName, data, options) {
		// 全局注册 ATMTracker	
		_initATMTracker(trackerName, data, options);
		// 调用公共方法 emit 进行上报 -> 内部包含 validate, process, report
		ATM.atmTracker[options.trackerName].emit(data, options);
	}

	// TBD
	ATM.setOptions = function (options) {
		console.log("setOptions:");
		console.log("options: " + options);
		console.log("ATM_CONFIG: " + ATM_CONFIG);
	};

	// exports
	// -----------------------------------------------

	// 暴露全局 ATM
	// 如果已存在 ATM ， 为了避免覆盖原有业务中ATM，禁用该插件
	// this.ATM = ATM; babel 转换默认使用 use strict ， 立即执行函数中 this 指向 undefind
	if (window.ATM) {
		console.warn("ATM Fatal Error: window.ATM already exists, Please check");
	}
	window.ATM = window.ATM || ATM;
})();