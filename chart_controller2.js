function ChartFilter(data, alias, ele) {
	var filter_conditions = [];
	var filter_data = data;
	var mapper = $.extend({"price": "价格", "number": "人数",
			"equal": "等于", "notequal": "不等于", "less": "小于", "greater": "大于", "cancel": "取消", 
			"contains": "包含", "notcontains": "不包含", 
			"betweenTime": "区间",
			"yunbao": "运宝", "trade": "交易", 
			"title": "标题", "date0":"日期0", "date1":"日期1"},alias);
	var mapper_reverse = $.extend({"等于":"equal", "不等于":"notequal", "小于":"less",
		"大于":"greater", "取消":"cancel", "包含":"contains", "不包含":"notcontains", "区间":"betweenTime", 
		"价格":"price", "人数":"number", "运宝":"yunbao", "交易":"trade", "标题":"title", "日期0":"date0", "日期1":"date1"},
		mapperReverser(alias));

	for (var i=0; i<filter_data.length; i++) {
		
		if (filter_data[i].type == "numberbox") {
			var tmp = "#mm_"+i;
			var element = "<div id='filter_item_"+ i +"' class='numberfilter' style='position:relative; width:20%; margin-left: 20px; margin-right: 20px; float:left'>" + 
				mapper[filter_data[i].field] + 
				"<div class='input-group'>" +
				"<input id='input_"+ i +"' class='form-control'></input>" + 
				"<div class='input-group-btn' id='gb_"+ i +"'>" +
				" <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='button_"+ i +"'>操作<span class='caret'></span></button>" +
				"<ul class='dropdown-menu dropdown-menu-right'>" + 
				"<li><a href='#'>等于</a></li>" + 
				"<li><a href='#'>不等于</a></li>" + 
				"<li><a href='#'>小于</a></li>" + 
				"<li><a href='#'>大于</a></li>" + 
				"<li><a href='#'>清除</a></li>" + 
				"</ul>" +
				"</div>" + 
				"</div>" + 
				"</div>";
			ele.append(element);
			$("#gb_"+i+" ul li").click(function(){
				var tmp = $(this).text();
				var target0 = $(this).parent().prev();
				var target1 = target0.parent().prev();
				if ($(this).text() == "清除") {
					target0.html("操作 <span class='caret'></span>");
					target1.val("");
				}
				else
					target0.html(tmp);
				// if (parseFloat(target1.val()) != target1.val()) alert("请输入数字！");
				// else {
				// 	var currentFilter = {};
				// 	currentFilter["op"] = mapper_reverse[tmp];	
				// 	currentFilter["field"] = mapper_reverse[target1.parent().parent().html().split("<")[0]];
				// 	currentFilter["value"] = target1.val();
				// 	filter_conditions.push(currentFilter);
				// }
			});

		}
		else if (filter_data[i].type == "daterangebox" || filter_data[i].type.toLowerCase() == "daterange") {
			var element = "<div id='filter_item_"+ i +"' class='datefilter' style='position:relative; width:20%; margin-left: 20px; margin-right: 70px; float:left'>" + 
				mapper[filter_data[i].field] + 
				"<br />" + 
				"<input class='easyui-datebox' data-options='required:true,showSeconds:false' value='' style='width:100%' id='dt_"+ i +"_0'>" +
				"<br/>" + 
				"<input class='easyui-datebox' data-options='required:true,showSeconds:false' value='' style='width:100%' id='dt_"+ i +"_1'>" +
				"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='button_"+ i +"' style='position:relative; top:-40px;'> 操作 <span class='caret'></span></button>" +
				"<ul class='dropdown-menu dropdown-menu-right' style='top:65px; right:30px;'>" +
				"<li><a href='#'>区间</a></li>" +
				"<li><a href='#'>清除</a></li>" + 
				"</ul>" +
				"</div>";

			ele.append(element);
			$("#button_"+i).css({left:$("#dt_"+i+"_0").width()+10})
			$("#filter_item_"+i+" ul li").click(function(){
				var tmp = $(this).text();
				var target0 = $(this).parent().prev();
				var target1 = target0.prev().prev();
				var target2 = target1.prev().prev().prev();
				if ($(this).text() == "清除") {
					target0.html("操作 <span class='caret'></span>");
					target1.datebox('setValue', '');
					target2.datebox('setValue', '');
				}
				else
					target0.html(tmp);
				// var currentFilter = {};
				// var startDate = target2.datetimebox('getValue');
				// var endDate = target1.datetimebox('getValue');
				// currentFilter["op"] = mapper_reverse[tmp];
				// currentFilter["field"] = mapper_reverse[target2.prev().parent().html().split("<")[0]];
				// currentFilter["value"] = startDate + "&" + endDate;
				// filter_conditions.push(currentFilter);
			});
		}
		else if (filter_data[i].type == "textbox") {
			var element = "<div id='filter_item_"+ i +"' class='textfilter' style='position:relative; width:40%; margin-left: 20px; margin-right: 20px; float:left'>" +
				mapper[filter_data[i].field] +
				"<div class='input-group'>" +
				"<input id='input_"+ i +"' class='form-control'></input>" + 
				"<div class='input-group-btn' id='gb_"+ i +"'>" +
				" <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='button_"+ i +"'>操作<span class='caret'></span></button>" +
				"<ul class='dropdown-menu dropdown-menu-right'>" + 
				"<li><a href='#'>包含</a></li>" + 
				"<li><a href='#'>清除</a></li>" + 
				"</ul>" +
				"</div>" + 
				"</div>" + 
				"</div>";

			ele.append(element);
			$("#gb_"+i+" ul li").click(function(){
				var tmp = $(this).text();
				var target0 = $(this).parent().prev();
				var target1 = target0.parent().prev();
				if ($(this).text() == "清除") {
					target0.html("操作 <span class='caret'></span>");
					target1.val("");
				}
				else
					target0.html(tmp);
				// var currentFilter = {};
				// currentFilter["op"] = mapper_reverse[tmp];
				// currentFilter["field"] = mapper_reverse[target1.parent().parent().html().split("<")[0]];
				// currentFilter["value"] = target1.val();
				// filter_conditions.push(currentFilter);
			});
		}
	}

	this.getOutput = function() {
		var filter_conditions = [];
		for (var i=0; i<filter_data.length; i++) {
			var currentFilter = {};
			currentFilter["field"] = mapper_reverse[$("#filter_item_"+i).html().split("<")[0]];
			if ($("#filter_item_"+i).attr("class") == "numberfilter" || $("#filter_item_"+i).attr("class") == "textfilter") {
				var operation = $("#filter_item_"+i+" div div button").text().replace(/\s/g, "");
				var value = $("#filter_item_"+i+" div input").val();
				if (operation != "操作" && value != "") {
					currentFilter["op"] = mapper_reverse[operation];
					currentFilter["value"] = value
				}
				else continue;

			}
			else {
				var operation = $("#filter_item_"+i+" button").text().replace(/\s/g, "");
				var startDate = $("#dt_"+i+"_0").datebox('getValue');
				var endDate = $("#dt_"+i+"_1").datebox('getValue');
				if (operation != "操作" && startDate != "" && endDate != "") {
					currentFilter["op"] = mapper_reverse[operation];
					currentFilter["value"] = startDate + "&" + endDate;
				}
				else continue;
			}
			filter_conditions.push(currentFilter);
		}
		return filter_conditions;
	}
	this.cancelFilter = function() {
		$(".form-control").val("");
		$(".easyui-datebox").datebox('setValue', '');
		filter_conditions = [];
		$(".dropdown-toggle").text("操作");
		return filter_conditions;
	}
}

function mapperReverser(map) {
	var map_r = {};
	for (var i in map) {
		map_r[map[i]] = i;
	}	
	return map_r;
}