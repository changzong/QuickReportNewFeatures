
var chart = angular.module('chart', []);

chart.controller('ctrl', function($scope, $http){ 
	//$http.jsonp("http://10.3.10.116/quickreport/chart/data.json?id=1&callback=JSON_CALLBACK").success(function(data){
	//	console.log(data);
	//})

	$scope.filter_data = [
		{"field":"price","op":["equal","notequal","less","greater"],"type":"numberbox"},
		{"field":"number","op":["equal","notequal","less","greater"],"type":"numberbox"},
		{"field":"date0","op":["betweenTime"],"type":"daterangebox"},
		{"field":"date1","op":["betweenTime"],"type":"daterangebox"},
		{"field":"title","op":["contains", "notcontains"],"type":"textbox"}
	];
	$scope.mapper = {"price": "价格", "number": "人数", 
		"equal": "等于", "notequal": "不等于", "less": "小于", "greater": "大于", "cancel": "取消", 
		"contains": "包含", "notcontains": "不包含", 
		"betweenTime": "区间",
		"yunbao": "运宝", "trade": "交易", 
		"title": "标题"};
	$scope.dateFilter = [];
	$scope.numberFilter = [];
	$scope.stringFilter = [];

	$scope.submitNumberFilter = function(op, field) {
		$("#toggleButton_"+field).html($scope.mapper[op]);
		if (parseFloat($('#input_'+field).val()) != $('#input_'+field).val()) alert("请输入数字！");
		else {
			var currentFilter = {};
			currentFilter["op"] = op;	
			currentFilter["field"] = field;
			currentFilter["value"] = $('#input_'+field).val();
			$scope.numberFilter.push(currentFilter);
			// $http.post(url, {"数值过滤":$scope.numberFilter, "日期过滤":$scope.dateFilter, "文本过滤":$scope.stringFilter}).success(function(){
			// 	console.log("过滤条件JSON已发送");
			// });
		}

	}
	$scope.submitDateRange = function(op, field) {
		$("#toggleButton_"+field).html($scope.mapper[op]);
		var currentFilter = {};
		var startDate = $('#dt_'+field+'_0').datetimebox('getValue');
		var endDate = $('#dt_'+field+'_1').datetimebox('getValue');
		currentFilter["op"] = op;
		currentFilter["field"] = field;
		currentFilter["value"] = startDate + "&" + endDate;
		$scope.dateFilter.push(currentFilter);
		// $http.post(url, {"数值过滤":$scope.numberFilter, "日期过滤":$scope.dateFilter, "文本过滤":$scope.stringFilter}).success(function(){
		// 	console.log("过滤条件JSON已发送");
		// });
	}
	$scope.submitTextFilter = function(op, field) {
		var currentFilter = {};
		$("#toggleButton_"+field).html($scope.mapper[op]);
		currentFilter["op"] = op;
		currentFilter["field"] = field;
		currentFilter["value"] = $('#input_'+field).val();
		$scope.stringFilter.push(currentFilter);
		// $http.post(url, {"数值过滤":$scope.numberFilter, "日期过滤":$scope.dateFilter, "文本过滤":$scope.stringFilter}).success(function(){
		// 	console.log("过滤条件JSON已发送");
		// });
	}
	$scope.doFilter = function() {
		console.log({"数值过滤":$scope.numberFilter, "日期过滤":$scope.dateFilter, "文本过滤":$scope.stringFilter});
	}
	$scope.cancelFilter = function() {
		$scope.dateFilter = [];
		$scope.numberFilter = [];
		$scope.stringFilter = [];
		console.log({"数值过滤":$scope.numberFilter, "日期过滤":$scope.dateFilter, "文本过滤":$scope.stringFilter});
		// $http.post(url, {"数值过滤":$scope.numberFilter, "日期过滤":$scope.dateFilter, "文本过滤":$scope.stringFilter}).success(function(){
		// 	console.log("过滤条件JSON已发送");
		// });
	}

});