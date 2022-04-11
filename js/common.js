

$(document).ready(function() {

    // 접고 펼치기
    $(".accordion").on("click", function() {
      $(this).toggleClass("active");
      $(this).next().slideToggle(200);
    });

    // UNIT 접고 펼치기
    $('.badge-list .badge').on("click", function(){
        $(this).toggleClass("on");
        $(this).parent().parent().parent().parent().find('.chart-line-full').slideToggle(200);
    }); 
    

    // 도넛차트 :: 주간 달성률
    // round corners
	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				arc.round = {
					x: (chart.chartArea.left + chart.chartArea.right) / 2,
					y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
					radius: (chart.outerRadius + chart.innerRadius) / 2,
					thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
					backgroundColor: arc._model.backgroundColor
				}
			}
		},

		afterDraw: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var ctx = chart.chart.ctx;
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				var startAngle = Math.PI / 2 - arc._view.startAngle;
				var endAngle = Math.PI / 2 - arc._view.endAngle;

				ctx.save();
				ctx.translate(arc.round.x, arc.round.y);
				console.log(arc.round.startAngle)
				ctx.fillStyle = arc.round.backgroundColor;
				ctx.beginPath();
				ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		},
	});

	// write text plugin
	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.center) {
				var helpers = Chart.helpers;
				var centerConfig = chart.config.options.elements.center;
				var globalConfig = Chart.defaults.global;
				var ctx = chart.chart.ctx;

				var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
				var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

				if (centerConfig.fontSize)
					var fontSize = centerConfig.fontSize;
					// figure out the best font size, if one is not specified
				else {
					ctx.save();
					var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
					var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
					var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

					do {
						ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
						var textWidth = ctx.measureText(maxText).width;

						// check if it fits, is within configured limits and that we are not simply toggling back and forth
						if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
							fontSize += 1;
						else {
							// reverse last step
							fontSize -= 1;
							break;
						}
					} while (true)
					ctx.restore();
				}

				// save properties
				chart.center = {
					font: helpers.fontString(fontSize, fontStyle, fontFamily),
					fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
				};
			}
		},
		afterDraw: function (chart) {
			if (chart.center) {
				var centerConfig = chart.config.options.elements.center;
				var ctx = chart.chart.ctx;

				ctx.save();
				ctx.font = chart.center.font;
				ctx.fillStyle = chart.center.fillStyle;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
				var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
				ctx.fillText(centerConfig.text, centerX, centerY);
				ctx.restore();
			}
		},
	})

	var config = {
		type: 'doughnut',
		data: {
			datasets: [{
				data: [87, 13],
				backgroundColor: [
					"#4f67ff",
					"#bad2db"
				],
				hoverBackgroundColor: [
					"#4f67ff",
					"#bad2db"
				]
			}]
		},
		options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 78,
			elements: {
				arc: {
					roundedCornersFor: 0
				},
				center: {
                    text: '87%',    // 가운데 % 텍스트
					maxText: '100%',
					fontColor: '#4f67ff',
					fontFamily: "'Noto Sans KR', 'Helvetica', 'Arial', sans-serif",
					fontStyle: '500',
					fontSize: 24,
					minFontSize: 1,
					maxFontSize: 256,
				}
			}
		}
	};
    var ctx = document.getElementById("doughnutChart").getContext("2d");
    var doughnutChart = new Chart(ctx, config);


    // 라인차트 :: 주간 달성률
    var ctx2 = document.getElementById("lineChart");
    var lineChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ["", ["10월","3주"], ["10월","4주"], ["11월","1주"], ["11월","2주"]],
            datasets: [{
                data: [ , 50, 30, 80, 100, ],
                label: '',
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "#4f67ff",
                borderWidth: 1,
                fill: false,
                lineTension: 0,
                radius: 2,
                fontSize : 10, 
                    fontStyle: '500',
                    
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {display: false}, // datasets label  숨김
            title: {
                display: true,
                text: '지난 4주간 달성률 비교',
                fontSize: 12,
                fontColor: 'rgba(99, 120, 255, 1)',
                fontStyle: 'bold',
                padding: 30
            },
            scales: {
                yAxes : [ {
                    ticks : {
                        // beginAtZero : true, // 0부터 시작
                        // max: 21, // 최대치 값
                        stepSize: 50,
                        fontSize : 10, 
                        fontStyle: '500', 
                    },
                }],
                xAxes : [ {
                    ticks : {
                        fontSize : 10, 
                        fontStyle: '500',
                    },
                    gridLines: {
                        borderDash: [1, 3],
                        color: '#b5b5b5',
                    }
                }],
            },
        }
    });


    //레이더 차트 :: 발음평가 종합 그래프
    new Chart(document.getElementById("radarChart").getContext("2d"), {
        type: 'radar',
        data: {
            labels: ["유창성", "발음", "억양", "리듬", "강세"],
            datasets: [{
                data: [40, 80, 60, 80, 90],
                backgroundColor: "rgba(254, 195, 195, .7)",
                borderColor: "rgba(254, 195, 195, .7)",
                pointBorderColor: "rgba(254, 195, 195, .7)",
                pointBackgroundColor: "rgba(254, 195, 195, .7)",
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointRadius: 0,
                fill: true,
            }]
        },
        options: {
            responsive: false,
            legend: {display: false}, // datasets label  숨김
            borderWidth:10,
            scale: {
                reverse: false,
                
                ticks: {
                    display: false,
                    max:100,
                    min: 0,
                    stepSize: 20,
                    beginAtZero: true,
                        fontColor: "#ff0000",
                        backgroundColor: "#000000",
                },
                gridLines: {
                    color: ["#d2d5f6", "#d2d5f6", "#d2d5f6", "#d2d5f6", "#9a9dee"],
                    // color: "#e9efff",
                    // lineWidth:40,
                },
                angleLines: {
                    display: false,
                },
                pointLabels: {
                    fontSize: "15"
                },
            },
        }
    });
    
    // data 없을때
    Chart.plugins.register({
        afterDraw: function(chart) {
            if (chart.data.datasets.length === 0) {
                // No data is present
                var ctx = chart.chart.ctx;
                var width = chart.chart.width;
                var height = chart.chart.height
                //   chart.clear();
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = "14px 'Noto Sans KR'";
                ctx.fillText('학습 정보가 없습니다.', width / 2 + 10, height / 2 - 10);
                ctx.restore();
            }
            
        },
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor && chart.data.datasets.length === 0) {
                var helpers = Chart.helpers;
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;

                ctx.save();
                ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                ctx.restore();
            }
        }
    });
   
    // 라인차트 :: 평균 집중도 그래프 옵션
    var lineFullOptions = {
        legend: {display: false}, // datasets label  숨김
        chartArea: {
            backgroundColor: '#f2f2f2'
        },
        scales: {
            yAxes : [ {
                ticks : {
                    beginAtZero : true, // 0부터 시작
                    max: 5, // 최대치 값
                    stepSize: 1,
                    fontSize : 12, 
                },
                gridLines: {
                    lineWidth: 0,  // y축 격자선 없애기
                }
            }],
            xAxes : [ {
                gridLines: {
                    borderDash: [1, 2],
                    color: '#c7c7c7',
                }
            }],
        }
    }
    // 라인차트 :: 평균 집중도 그래프 1
    var ctx4 = document.getElementById("lineFullChart")
    var lineFullChart = new Chart(ctx4, {
        type: "line",
        data: {
            labels: ["", "", "", "", ""],
            datasets: [{
                data: [0, 3, null, null, null],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(204,214,255,0.2)", // 색상 1
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            }, {
                data: [null, 3, 5, null, null],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(174,182,225,0.6)", // 색상 2
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            },{
                data: [null, null, 5, 4, null],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(204,214,255,0.2)", // 색상 1
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            },
            {
                data: [null, null, null, 4, 0],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(174,182,225,0.6)", // 색상 2
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            }
        ] },
        options: lineFullOptions,
    });

    // 라인차트 :: 평균 집중도 그래프 2
    var ctx5 = document.getElementById("lineFullChart2")
    var lineFullChart2 = new Chart(ctx5, {
        type: "line",
        data: {
            labels: ["", "", "", "", ""],
            datasets: [{
                data: [3, 1, null, null, null],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(204,214,255,0.2)", // 색상 1
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            }, {
                data: [null, 1, 2, null, null],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(174,182,225,0.6)", // 색상 2
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            },{
                data: [null, null, 2, 4, null],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(204,214,255,0.2)", // 색상 1
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            },
            {
                data: [null, null, null, 4, 2],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                backgroundColor: "rgba(174,182,225,0.6)", // 색상 2
                borderWidth: 1,
                fill: true,
                lineTension: 0,
                radius: 2
            }]
        },
        options: lineFullOptions,
    });

    // 라인차트 :: 평균 집중도 그래프 3
    var ctx6 = document.getElementById('lineFullChart3').getContext('2d');
    var lineFullChart3 = new Chart(ctx6, {
        type: 'line',
        data: {
            labels: ["", "", "", "", ""],
            datasets: []
        },
        options: lineFullOptions,
    });

    // 막대차트 :: 요일별 총 학습시간 막대 라운딩
    Chart.elements.Rectangle.prototype.draw = function() {
        var ctx = this._chart.ctx;
        var vm = this._view;
        var left, right, top, bottom, signX, signY, borderSkipped, radius;
        var borderWidth = vm.borderWidth;
        var cornerRadius = 20;
    
        if (!vm.horizontal) {
            left = vm.x - vm.width / 2;
            right = vm.x + vm.width / 2;
            top = vm.y;
            bottom = vm.base;
            signX = 1;
            signY = bottom > top? 1: -1;
            borderSkipped = vm.borderSkipped || 'bottom';
        } else {
            left = vm.base;
            right = vm.x;
            top = vm.y - vm.height / 2;
            bottom = vm.y + vm.height / 2;
            signX = right > left? 1: -1;
            signY = 1;
            borderSkipped = vm.borderSkipped || 'left';
        }
    
        if (borderWidth) {
            var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
            borderWidth = borderWidth > barSize? barSize: borderWidth;
            var halfStroke = borderWidth / 2;
            var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
            var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
            var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
            var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
            if (borderLeft !== borderRight) {
                top = borderTop;
                bottom = borderBottom;
            }
            if (borderTop !== borderBottom) {
                left = borderLeft;
                right = borderRight;
            }
        }
    
        ctx.beginPath();
        ctx.fillStyle = vm.backgroundColor;
        ctx.strokeStyle = vm.borderColor;
        ctx.lineWidth = borderWidth;
        var corners = [
            [left, bottom],
            [left, top],
            [right, top],
            [right, bottom]
        ];
    
        var borders = ['bottom', 'left', 'top', 'right'];
        var startCorner = borders.indexOf(borderSkipped, 0);
        if (startCorner === -1) {
            startCorner = 0;
        }
    
        function cornerAt(index) {
            return corners[(startCorner + index) % 4];
        }
    
        var corner = cornerAt(0);
        ctx.moveTo(corner[0], corner[1]);
    
        for (var i = 1; i < 4; i++) {
            corner = cornerAt(i);
            nextCornerId = i+1;
            if(nextCornerId == 4){
                nextCornerId = 0
            }
    
            nextCorner = cornerAt(nextCornerId);
    
            width = corners[2][0] - corners[1][0];
            height = corners[0][1] - corners[1][1];
            x = corners[1][0];
            y = corners[1][1];
            
            var radius = cornerRadius;
            
            if(radius > height/2){
                radius = height/2;
            }if(radius > width/2){
                radius = width/2;
            }
    
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
        }
    
        ctx.fill();
        if (borderWidth) {
            ctx.stroke();
        }
    };

    // 막대차트 :: 요일별 총 학습시간
    var ctx7 = document.getElementById("weekBarChart").getContext("2d");
    var weekBarChart = new Chart(ctx7, {
        type: 'bar',
        data: {
            labels: ["월", "화", "수", "목", "금", "토", "일"],
            datasets: [{
                display: false,
                barThickness: 12,
                data: [50, 20, 41, 20, 20, 45, 35],
                backgroundColor: 'rgba(79, 103, 255, 1)',
            }]
        },
        options: {
            legend: {display: false}, // datasets label  숨김
            scales: {
                yAxes : [ {
                    ticks : {
                        beginAtZero : true, // 0부터 시작
                        stepSize: 10 ,
                        fontSize : 12, 
                    },
                }],
                xAxes : [ {
                    gridLines: {
                        lineWidth: 0  // x축 격자선 없애기
                    }
                }],
            }
        }
    });

    // 라인차트 :: 요일별 접속 시각 패턴
    var ctx8 = document.getElementById("dayLineChart")
    var dayLineChart = new Chart(ctx8, {
        type: "line",
        data: {
            labels: ["", "월", "화", "수", "목", "금", "토", "일", ""],
            datasets: [{
                data: [ , 7, 16, 13, 21, 15, 11, 13, ],
                pointBackgroundColor: "#6076ff",
                borderColor: "#6076ff",
                borderWidth: 1,
                fill: false,
                lineTension: 0,
                radius: 2
            }]
        },
        options: {
            legend: {display: false}, // datasets label  숨김
            scales: {
                yAxes : [ {
                    ticks : {
                        // beginAtZero : true, // 0부터 시작
                        // max: 21, // 최대치 값
                        stepSize: 2,
                        fontSize : 12, 
                    },
                    gridLines: {
                        lineWidth: 0,  // y축 격자선 없애기
                    }
                }],
                xAxes : [ {
                    gridLines: {
                        borderDash: [0, 300],
                        color: '#c7c7c7',
                    }
                }],
            }
        }
    });
});