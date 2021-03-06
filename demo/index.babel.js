'use strict';

// auto collect example 1
var trigger = 'click'; // listen click event
var page = '.*'; // all pages
var element2 = '.js-test-class-2';
var element3 = '.js-test-class-3';
var optionsValidateFailed = {
	trackerName: 'default_emit', // 预设
	validateRule: 'test' // 由于有预设，该规则会被覆盖
};
var optionsValidateFailed2 = {
	trackerName: 'diy', // 预设
	validateRule: 'test' // 由于有预设，该规则会被覆盖
};

// basic demo
ATM.autoCollectTrackData('click', '.*', '.js-test-class-1');

ATM.autoCollectTrackData(trigger, page, element2, optionsValidateFailed);

ATM.autoCollectTrackData(trigger, page, element3, optionsValidateFailed2);

// auto collect target data  TBD
// 当页面加载时，获取某hidden input的值或者某全局变量的值 

// emit collecting example