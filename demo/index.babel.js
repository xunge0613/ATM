'use strict';

// auto collect example 1
ATM.autoCollectTrackData({
	test3: 1 //  validate not passed
}, {
	trigger: 'click',
	page: '*',
	element: '#test',
	validateRule: 'test'
});

// auto collect example 2
ATM.autoCollectTrackData({
	test: 1
}, {
	trigger: 'click',
	page: '*',
	element: '.js-test-class'
});

// auto collect target data  TBD
// 当页面加载时，获取某hidden input的值或者某全局变量的值 

// emit collecting example