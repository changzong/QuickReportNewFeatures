
var chart = angular.module('chart', []);

chart.controller('ctrl', function($scope, $http){ 
	//$http.jsonp("http://10.3.10.116/quickreport/chart/data.json?id=1&callback=JSON_CALLBACK").success(function(data){
	//	console.log(data);
	//})
	//此数据要用GET方法从URL上获取
	$scope.data = {"title":"样例-曲线图",
		"chartType":"spline",
		"options":{"unit":"人"},
		"categories":["杭州","萧山","余杭","富阳","绍兴","嘉兴"],
		"series":[{"name":"价格","data":[23,22,25,20,17,19]},{"name":"人数","data":[919,198,283,88,32,18]}]};

	$scope.filter_data = [
		{"field":"price","op":["equal","notequal","less","greater","cancel"],"type":"numberbox"}, 
		{"field":"number","op":["equal","notequal","less","greater","cancel"],"type":"numberbox"}, 
		];
	$scope.mapper = {"price": "价格", "number": "人数", "equal": "等于", "notequal": "不等于", "less": "小于", "greater": "大于", "cancel": "取消"};
	$scope.currentOp = [];
	$scope.currentField = [];
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
	$scope.$watchCollection("currentOp", function(newValue, oldValue) {
		$scope.data = {"title":"样例-曲线图",
			"chartType":"spline",
			"options":{"unit":"人"},
			"categories":["杭州","萧山","余杭","富阳","绍兴","嘉兴"],
			"series":[{"name":"价格","data":[23,22,25,20,17,19]},{"name":"人数","data":[919,198,283,88,32,18]}]};
		if ($scope.currentOp[0] == "cancel") {
			$("#input_"+$scope.currentField[$scope.currentIndex]).val('');
		}
		else {
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

				//数值相等
				if ($scope.currentOp[x] == "equal") {
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
				}
				//数值不等
				else if ($scope.currentOp[x] == "notequal") {
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
				}
				//比数值小
				else if ($scope.currentOp[x] == "less") {
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
				}
				//比数值大
				else if ($scope.currentOp[x] == "greater") {
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
				}
				console.log(comparor);
			}
		}
		console.log($scope.currentOp);
		console.log($scope.currentField);
		console.log(alterData);
		console.log(alterIndex);
		
		setChartData($scope.data); //重新绘制图表
	});

});

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