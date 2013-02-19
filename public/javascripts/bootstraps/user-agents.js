require(['moment', 'bonzo', 'qwery', 'js!d3'], function(moment, bonzo, qwery) {

    var width = 900,
        height = 1000,
        color = d3.scale.category20(),
        margin = {
            top: 10,
            right: 200,
            bottom: 500,
            left: 40
        },
        chart,
        legend;

    init();
    update('browser');

    function init() {

        chart = d3.select('#chart')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        legend = chart.append('g')
            .attr('id', 'key')
            .attr('transform', 'translate(' + (width - margin.right) + ', 0)');

        // xAxis = 
    }

    function update(type) {
        var config = createHistograms(type)
        updateStacks(d3.layout.stack()(config.histograms));
        addKey(config.uniqueTypes);
        addEvents();
    }

    function createHistograms(type) {
        var histogramRange = [null, null];
        // pull out types
        var types = errors.map(function(e) { 
            // create histogram range while here
            var time = moment(e.time).valueOf();
            if (time < histogramRange[0] || histogramRange[0] === null) {
                histogramRange[0] = time;
            }
            if (time > histogramRange[1] || histogramRange[1] === null) {
                histogramRange[1] = time;
            }
            return e[type]; 
        });
        // pull out unique types
        var uniqueTypes = types.filter(function(d, i) { 
            return this.indexOf(d) === i; 
        }, types);

        var histograms = [];
        var histogramLayout = d3.layout.histogram()
            .bins(15)
            .range(histogramRange)
            .value(function(d) { return new Date(d.time).getTime(); })
        // create histogram layouts
        uniqueTypes.forEach(function(b) {
            histograms.push(
                histogramLayout(errors.filter(function(d) { return d[type] === b; }))
            );
        });
        return {histograms : histograms, uniqueTypes: uniqueTypes};
    }

    function addEvents() {
        var that = this;
        d3.selectAll('#controls input')
            .on('change', function(d, i) {
                update(this.value);
            });
    }

    function updateStacks(stacks) {

        var yStackMax = d3.max(stacks, function(stack) { return d3.max(stack, function(d) { return d.y0 + d.y; }); });

        var x = d3.scale.ordinal()
            .domain(stacks[0].map(function(d) { return d.x; }))
            .rangeRoundBands([0, width - margin.left - margin.right], 0.3);

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
            .call(yAxis);

        // UPDATE
        var layer = chart.selectAll(".layer")
            .data(stacks)

        // ENTER
        layer.enter()
            .append("g")
            .attr("class", "layer")
            .style("fill", function(d, i) { return color(i); });

        // EXIT
        layer.exit()
            .remove();

        // UPDATE
        var rect = layer.selectAll("rect")
            .data(function(d) { return d; });

        rect.transition()
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

        // ENTER
        var rectEnter = rect.enter();

        rectEnter.append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

        // UPDATE & ENTER


        // EXIT
        rect.exit()
            .remove();
    }

    function addKey(types) {
        // UPDATE
        var key = legend.selectAll('.key')
            .data(types);

        // ENTER
        var keyEnter = key.enter()
            .append('g')
            .classed('key', true)
            .attr('transform', function(d, i) { return 'translate(0, ' + (i * 20) + ')'; });

        keyEnter.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function(d, i) { return color(i); })
            .on('mouseover', function(d, i) {
                // fade out other layers
                d3.selectAll('.layer').filter(function(e, j) { return i !== j; })
                    .style('opacity', 0.1);
            })
            .on('mouseout', function(d, i) {
                // fade in layers
                d3.selectAll('.layer')
                    .style('opacity', 1);
            });

        keyEnter.append('text')
            .text(function(d) { return d; })
            .attr('y', 10)
            .attr('x', 18);

        // UPDATE & ENTER
        key.select('text')
            .text(function(d) { return d; });

        // EXIT
        key.exit()
            .remove();

    }

});