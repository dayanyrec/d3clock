/*jshint globals: true, browser: true*/
/* global d3 */

window.onload = function () {
	var fields, width, height, offSetX, offSetY, pi, scaleSecsMins, scaleHours, vis, clockGroup, render, rad;

	fields = function () {
		var data, currentTime, hour, minute, second;
		currentTime = new Date();
		second = currentTime.getSeconds();
		minute = currentTime.getMinutes();
		hour = currentTime.getHours() + minute / 60;
		data = [{
			"unit": "seconds",
			"numeric": second
		}, {
			"unit": "minutes",
			"numeric": minute
		}, {
			"unit": "hours",
			"numeric": hour
		}];
		return data;
	};

	width = window.innerWidth;
	height = window.innerHeight;
	offSetX = width / 2;
	offSetY = height / 2;
	rad = offSetX < offSetY ? 0.7 * offSetX : 0.7 * offSetY;

	pi = Math.PI;

	scaleSecsMins = d3.scale.linear().domain([0, 59 + 59 / 60]).range([0, 2 * pi]);
	scaleHours = d3.scale.linear().domain([0, 11 + 59 / 60]).range([0, 2 * pi]);

	vis = d3.selectAll(".chart")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	clockGroup = vis.append("svg:g")
		.attr("transform", "translate(" + offSetX + "," + offSetY + ")");

	clockGroup.append("svg:circle")
		.attr("r", rad).attr("fill", "none")
		.attr("class", "clock outercircle")
		.attr("stroke", "black")
		.attr("stroke-width", 2);

	clockGroup.append("svg:circle")
		.attr("r", 4)
		.attr("fill", "black")
		.attr("class", "clock innercircle");

	render = function (data) {
		var hourArc, minuteArc, secondArc;

		clockGroup.selectAll(".clockhand").remove();

		secondArc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(rad - 10)
			.startAngle(function (d) {
				return scaleSecsMins(d.numeric);
			})
			.endAngle(function (d) {
				return scaleSecsMins(d.numeric);
			});

		minuteArc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(rad - 10)
			.startAngle(function (d) {
				return scaleSecsMins(d.numeric);
			})
			.endAngle(function (d) {
				return scaleSecsMins(d.numeric);
			});

		hourArc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(0.5 * rad)
			.startAngle(function (d) {
				return scaleHours(d.numeric % 12);
			})
			.endAngle(function (d) {
				return scaleHours(d.numeric % 12);
			});

		clockGroup.selectAll(".clockhand")
			.data(data)
			.enter()
			.append("svg:path")
			.attr("d", function (d) {
				if (d.unit === "seconds") {
					return secondArc(d);
				} else if (d.unit === "minutes") {
					return minuteArc(d);
				} else if (d.unit === "hours") {
					return hourArc(d);
				}
			})
			.attr("class", "clockhand")
			.attr("stroke", "black")
			.attr("stroke-width", function (d) {
				if (d.unit === "seconds") {
					return 2;
				} else if (d.unit === "minutes") {
					return 3;
				} else if (d.unit === "hours") {
					return 3;
				}
			})
			.attr("fill", "none");
	};

	render(fields());

	setInterval(function () {
		var data;
		data = fields();
		return render(data);
	}, 1000);
};
