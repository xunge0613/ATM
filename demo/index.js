// auto collect example 1
ATM.autoCollectTrackData({
	test3: 1 //  validate not passed
},{
	trigger: 'click',
	page: '*',
	element: '#test',
	validateRule: 'test'
})

// auto collect example 2
ATM.autoCollectTrackData({
	test: 1
},{
	trigger: 'click',
	page: '*',
	element: '.js-test-class'
})

