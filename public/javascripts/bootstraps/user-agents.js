require(['moment', 'js!d3'], function(moment) {

    // pull out IE Mobile
    var ieErrors = errors.filter(function(d) { return d.browser === 'IE Mobile'; });

    // create histogram
    var ieErrorsHistorgram = d3.layout.histogram()
        .value(function(d) { return new Date(d.time).getTime(); })(ieErrors)

    var width = 800,
        height = 500,
        color = d3.scale.category20c(),
        margin = {
            top: 10,
            right: 10,
            bottom: 20,
            left: 20
        };

    var chart = d3.select('#chart')
        .attr('width', width)
        .attr('height', height);

    // create stacked layout
    var layers = d3.layout.stack()([ieErrorsHistorgram]);

    var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    var x = d3.scale.ordinal()
        .domain(layers[0].map(function(d) { return d.x; }))
        .rangeRoundBands([0, width - margin.left - margin.right], 0.5);

    var y = d3.scale.linear()
        .domain([0, yStackMax])
        .range([height - margin.top - margin.bottom, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom")
        .tickFormat(function(d) { return moment(d).format('HH:mm'); });

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(6)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", 'translate(' + margin.left + ', 0)')
        .call(yAxis);

    var layer = chart.selectAll(".layer")
        .data(layers)
        .enter()
            .append("g")
            .attr("class", "layer")
            .style("fill", function(d, i) { return color(i); });

    var rect = layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", height)
            .attr("width", x.rangeBand())
            .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

});