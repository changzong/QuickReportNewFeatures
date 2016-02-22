
var chart = angular.module('chart', []);

chart.controller('ctrl', function($scope, $http){ 
	//$http.jsonp("http://10.3.10.116/quickreport/chart/data.json?id=1&callback=JSON_CALLBACK").success(function(data){
	//	console.log(data);
	//})
	//此数据要用GET方法从URL上获取
	// $scope.data = {"title":"样例-曲线图",
	// 	"chartType":"spline",
	// 	"options":{"unit":"人"},
	// 	"categories":["杭州","萧山","余杭","富阳","绍兴","嘉兴"],
	// 	"series":[{"name":"价格","data":[23,22,25,20,17,19]},{"name":"人数","data":[919,198,283,88,32,18]}]};
	$scope.data = {
		"title":"转圈圈-最近7天平均耗时曲线图",
		"chartType":"spline",
		"options":{
			"unit":"毫秒",
			"classify":"warName",
			"datafield":"avgExecTime"},
		"categories":["2016-02-10","2016-02-11","2016-02-12","2016-02-13","2016-02-14","2016-02-15","2016-02-16","2016-02-17","2016-02-18"],
		"series":[{"name":"yunbao","data":[24.25,35.67,67.51,73.42,8.56,42.63,50.22,21.67,4.8]},
			{"name":"lbcApi","data":[139.16,125.64,132.31,126.19,134.84,140.77,121.73,126.33]},
			{"name":"trade","data":[29.51,33.16,32.98,31.1,47.14,55.19,52.2,54.33,38.47]},
			{"name":"ownerTradeApi","data":[79.24,353.9,95.2,352.26,186.87,175.08,160.97,256.62,120.56]},
			{"name":"myWallet","data":[101.07,112.94,127.02,154.44,99.03,118.12,85.72,78.26,84.09]},
			{"name":"cashBillSite","data":[4.54,173.24,144.28,175.31,130.84,135.42,132.94,129.93,143.06]},
			{"name":"partyApi","data":[35.3,35.49,60.19,69.83,40.81,53.75,56.91,60.33,73.74]},
			{"name":"reportDataService","data":[14.38,19.42,23.82,18.05,14.3,40.9,35.14,36.08,118.47]},
			{"name":"tradeView","data":[40.49,41.24,66.41,75.43,58.72,13.9,39.22,17.57,75.52]},
			{"name":"driverTradeApi","data":[122.35,112.14,116.35,123.29,163.51,189.48,186.15,186.4,146.75]},
			{"name":"contactApi","data":[167.0,146.33,133.05,169.59,135.87,137.66,149.58,137.46,196.27]},
			{"name":"passport","data":[34.17,49.19,37.24,30.56,36.06,33.91,4.27,24.03,2.44]},
			{"name":"party","data":[12.35,12.55,13.81,14.49,16.63,19.01,17.99,45.99,23.71]}]};

	// $scope.filter_data = [
	// 	{"field":"price","op":["equal","notequal","less","greater","cancel"],"type":"numberbox"}, 
	// 	{"field":"number","op":["equal","notequal","less","greater","cancel"],"type":"numberbox"}, 
	// 	];
	$scope.filter_data = [
		{"field":"yunbao","op":["equal","notequal","less","greater","cancel"],"type":"numberbox"},
		{"field":"trade","op":["equal","notequal","less","greater","cancel"],"type":"numberbox"},
		{"field":"date","op":["between"],"type":"daterangebox"}
	];
	$scope.mapper = {"price": "价格", "number": "人数", 
		"equal": "等于", "notequal": "不等于", "less": "小于", "greater": "大于", "cancel": "取消", 
		"yunbao": "yunbao", "trade": "trade"};
	$scope.currentOp = [];
	$scope.currentField = [];
	$scope.currentDate = ['1900-01-01 00:00', '2100-01-01 00:00'];
	for(var i=0; i<$scope.filter_data.length; i++) {
		$scope.currentOp.push("");
	}

	setChartData($scope.data);
	$scope.toggleAchieveButton = function(op, field, index) {
		$("#toggleButton_"+field).html($scope.mapper[op]);
		$scope.currentOp[index] = op;
		$scope.currentField[index] = field;
		$scope.currentIndex = index;
	}
	$scope.submitDateRange = function(field) {
		console.log($('#dt_'+field+'_0').datetimebox('getValue'));
		console.log($('#dt_'+field+'_1').datetimebox('getValue'));
		$scope.startDate = $('#dt_'+field+'_0').datetimebox('getValue');
		$scope.endDate = $('#dt_'+field+'_1').datetimebox('getValue');
		$scope.currentDate = [$scope.startDate, $scope.endDate];
	}
	// 日期选择行为监测
	$scope.$watchCollection("currentDate", function(newValue, oldValue) {
		console.log($scope.currentDate);
		var alterData = $scope.data["categories"];
		var alterIndex = []; //符合过滤条件的数值位置
		for (var i=0; i<alterData.length; i++) {
			if (Date.parse(alterData[i].replace(/-/g, '/')) >= Date.parse($scope.currentDate[0].replace(/-/g, '/')) && 
				Date.parse(alterData[i].replace(/-/g, '/')) <= Date.parse($scope.currentDate[1].replace(/-/g, '/'))) {
				alterIndex.push(i);
			}
		}
		for (var j=0; j<$scope.data["series"].length; j++) {
			var tmp = $scope.data["series"][j]["data"];
			$scope.data["series"][j]["data"] = [];
			for (var k=0; k<alterIndex.length; k++) {
				$scope.data["series"][j]["data"].push(tmp[alterIndex[k]]);
			}
		}
		setChartData($scope.data); //重新绘制图表
	});
	// 数值选择行为监测
	$scope.$watchCollection("currentOp", function(newValue, oldValue) {
		//此数据要用GET方法从URL上获取
		// $scope.data = {"title":"样例-曲线图",
		// 	"chartType":"spline",
		// 	"options":{"unit":"人"},
		// 	"categories":["杭州","萧山","余杭","富阳","绍兴","嘉兴"],
		// 	"series":[{"name":"价格","data":[23,22,25,20,17,19]},{"name":"人数","data":[919,198,283,88,32,18]}]};
		$scope.data = {
			"title":"转圈圈-最近7天平均耗时曲线图",
			"chartType":"spline",
			"options":{
				"unit":"毫秒",
				"classify":"warName",
				"datafield":"avgExecTime"},
			"categories":["2016-02-10","2016-02-11","2016-02-12","2016-02-13","2016-02-14","2016-02-15","2016-02-16","2016-02-17","2016-02-18"],
			"series":[{"name":"yunbao","data":[24.25,35.67,67.51,73.42,8.56,42.63,50.22,21.67,4.8]},
				{"name":"lbcApi","data":[139.16,125.64,132.31,126.19,134.84,140.77,121.73,126.33]},
				{"name":"trade","data":[29.51,33.16,32.98,31.1,47.14,55.19,52.2,54.33,38.47]},
				{"name":"ownerTradeApi","data":[79.24,353.9,95.2,352.26,186.87,175.08,160.97,256.62,120.56]},
				{"name":"myWallet","data":[101.07,112.94,127.02,154.44,99.03,118.12,85.72,78.26,84.09]},
				{"name":"cashBillSite","data":[4.54,173.24,144.28,175.31,130.84,135.42,132.94,129.93,143.06]},
				{"name":"partyApi","data":[35.3,35.49,60.19,69.83,40.81,53.75,56.91,60.33,73.74]},
				{"name":"reportDataService","data":[14.38,19.42,23.82,18.05,14.3,40.9,35.14,36.08,118.47]},
				{"name":"tradeView","data":[40.49,41.24,66.41,75.43,58.72,13.9,39.22,17.57,75.52]},
				{"name":"driverTradeApi","data":[122.35,112.14,116.35,123.29,163.51,189.48,186.15,186.4,146.75]},
				{"name":"contactApi","data":[167.0,146.33,133.05,169.59,135.87,137.66,149.58,137.46,196.27]},
				{"name":"passport","data":[34.17,49.19,37.24,30.56,36.06,33.91,4.27,24.03,2.44]},
				{"name":"party","data":[12.35,12.55,13.81,14.49,16.63,19.01,17.99,45.99,23.71]}]};
		if ($scope.currentOp[0] == "cancel") {
			$("#input_"+$scope.currentField[$scope.currentIndex]).val('');
		}
		else {
			// 检测每个过滤器，合并过滤条件
			for(var x=0; x<$scope.currentOp.length; x++) {
				var comparor = $("#input_"+$scope.currentField[x]).val(); //待比较数值
				//通过中英文对应关系获取待比较的数据结构
				for (var i=0 ; i<$scope.data["series"].length; i++) {
					if ($scope.data["series"][i]["name"] == $scope.mapper[$scope.currentField[x]]) {
						var tmp = $scope.data["series"][i]["data"];
						var alterData = tmp;
						console.log(alterData);
						break;
					}
				}
				var alterIndex = []; //符合过滤条件的数值位置
				// 过滤开始
				switch($scope.currentOp[x]) {
					//数值相等
					case "equal":
						for (var i=0; i<alterData.length; i++) {
							if (alterData[i] == comparor) {
								alterIndex.push(i);
							}
						}
						for (var j=0; j<$scope.data["series"].length; j++) {
							var tmp = $scope.data["series"][j]["data"];
							$scope.data["series"][j]["data"] = [];
							for (var k=0; k<alterIndex.length; k++) {
								$scope.data["series"][j]["data"].push(tmp[alterIndex[k]]);
							}
						}
						break;
					//数值不等
					case "notequal":
						for (var i=0; i<alterData.length; i++) {
							if (alterData[i] != comparor) {
								alterIndex.push(i);
							}
						}
						for (var j=0; j<$scope.data["series"].length; j++) {
							var tmp = $scope.data["series"][j]["data"];
							$scope.data["series"][j]["data"] = [];
							for (var k=0; k<alterIndex.length; k++) {
								$scope.data["series"][j]["data"].push(tmp[alterIndex[k]]);
							}
						}
						break;
					//比数值小
					case "less":
						for (var i=0; i<alterData.length; i++) {
							if (alterData[i] < comparor) {
								alterIndex.push(i);
							}
						}
						for (var j=0; j<$scope.data["series"].length; j++) {
							var tmp = $scope.data["series"][j]["data"];
							$scope.data["series"][j]["data"] = [];
							for (var k=0; k<alterIndex.length; k++) {
								$scope.data["series"][j]["data"].push(tmp[alterIndex[k]]);
							}
						}
						break;
					//比数值大
					case "greater":
						for (var i=0; i<alterData.length; i++) {
							if (alterData[i] > comparor) {
								alterIndex.push(i);
							}
						}
						for (var j=0; j<$scope.data["series"].length; j++) {
							var tmp = $scope.data["series"][j]["data"];
							$scope.data["series"][j]["data"] = [];
							for (var k=0; k<alterIndex.length; k++) {
								$scope.data["series"][j]["data"].push(tmp[alterIndex[k]]);
							}
						}
						break;
					default:
						break;
				}
			}
		}
		
		setChartData($scope.data); //重新绘制图表
	});

});

// highcharts options
function setChartData(data) {
	$('.highcharts-container').highcharts({
        title: {
            text: data["title"],
            x: -20 //center
        },
        xAxis: {
            categories: data["categories"]
        },
        yAxis: {
            title: {
                text: 'Vales'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        series: data["series"]
    });
}