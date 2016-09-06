$(document).ready(function() {

	function buildXAxis(x, callback) {
		chart.append("g")
				 .attr("transform", "translate(0," + chartHeight + ")")
				 .call(d3.axisBottom(x).tickFormat(callback));

		//Add text label for x-axis
		chart.append("text")
				 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight+50) + ")")
				 .attr("class", "axisLabel")
				 .text("Minutes behind Fastest Time");
	}


	function buildYAxis(y) {
		chart.append("g").attr("transform", "translate(0,0)").call(d3.axisLeft(y));

		//Add Text label for the y-axis
		chart.append("text")
				 .attr("transform", "rotate(-90)")
				 .attr("y", -75)
				 .attr("x", -50)
				 .attr("class", "axisLabel")
				 .attr("dy", "2em")
				 .text("Ranking");
	}


	var chartWidth = 1000;
	var chartHeight = 500;

	var x = d3.scaleTime().range([0, chartWidth]);
	var y = d3.scaleLinear().range([chartHeight, 0]);
  var formatTime = d3.timeFormat("%M:%S"),
		formatSeconds = function(d) { return formatTime(new Date(2016, 0, 1, 0, 0, d)); };

	var chart = d3.select('.chart').attr("width", chartWidth).attr("height", chartHeight).append("g").attr("transform", "translate(" + 0 + "," + 0 + ")");

	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(error, cyclistData) {

		if (error) throw error;

		var lowestPlace = d3.max(cyclistData, function(d) { return d.Place });
		y.domain([lowestPlace+2, 1]);

		var min = d3.min(cyclistData, function(d) { return d.Seconds} );
		var max = d3.max(cyclistData, function(d) { return d.Seconds} );
		x.domain([max-min+15, -15]);

		buildYAxis(y);
		buildXAxis(x, formatSeconds);

		var elem = chart.selectAll("cyclist").data(cyclistData);
		var elemEnter = elem.enter().append("g");

		elemEnter.append("circle")
       .attr("r", 5)
       .attr("cx", function(d) { return x(d.Seconds-min); })
       .attr("cy", function(d) { return y(d.Place); })
       .attr("fill", function(d) { return d.Doping  ? "red" : "lime"; });

	  elemEnter.append("text")
				.attr("dx", function(d){return x(d.Seconds-min-3)})
				.attr("dy", function(d){return y(d.Place+0.25)})
        .text(function(d){return d.Name})


	  /*chart.selectAll("circle")
			.on("mouseover", function() {
				console.log(d3.select(this).data()[0].Name);
			});*/

	});

});
