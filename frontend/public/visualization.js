let margin = {top: 40, right: 20, bottom: 30, left: 40};
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;
let x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
let y = d3.scale.linear().range([height, 0]);
let xAxis = d3.svg.axis().scale(x).orient("bottom");
let yAxis = d3.svg.axis().scale(y).orient("left");

/*******************************************************************************
 * Build the graph of miles and trails
 ******************************************************************************/
let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Number of trails:</strong> " +
               "<span style='color:red'>" + d.length + "</span>";
    })

let svg = d3.select("#trails-to-miles")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
svg.call(tip);

d3.tsv("trail-length.tsv",
  function (d) {
    d.length = +d.length;
    return d
  },
  function (error, data) {
    x.domain(data.map(function (d) {return d.trail;}));
    y.domain([0, d3.max(data, function (d) {return d.length;}) + 20]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .append("text")
        .attr("transform", "translate(" + width + ", " + -10 + ")")
        .attr("x", 6)
        .attr("dx", ".71em")
        .style("text-anchor", "end")
        .text("Miles (mi)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Length");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar bar-hover")
            .attr("x", function(d) {return x(d.trail);})
            .attr("width", x.rangeBand())
            .attr("y", function(d) {return y(d.length);})
            .attr("height", function(d) {return height - y(d.length);})
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
  }
);

/*******************************************************************************
 * Build the graph of resorts to number of photos
 ******************************************************************************/
let tip2 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>" + d.resort + ":</strong> " +
               "<span style='color:red'>" + d.photos + "</span>";
    })

let svg2 = d3.select("#trails-to-miles2")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
svg2.call(tip2);

d3.tsv("resort-to-photos.tsv",
  function (d) {
    d.photos = +d.photos;
    return d;
  },
  function (error, data) {
    x.domain(data.map(function (d) {return d.resort;}));
    y.domain([0, d3.max(data, function (d) {return d.photos;}) + 5]);

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Photos");

    svg2.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar2 bar-hover")
            .attr("x", function(d) {return x(d.resort);})
            .attr("width", x.rangeBand())
            .attr("y", function(d) {return y(d.photos);})
            .attr("height", function(d) {return height - y(d.photos);})
            .on('mouseover', tip2.show)
            .on('mouseout', tip2.hide)
  }
);

/*******************************************************************************
 * Build the graph of resorts to number of five star trails
 ******************************************************************************/
let tip3 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>" + d.resort + ":</strong> " +
               "<span style='color:red'>" + d.fivestartrail + "</span>";
    })

let svg3 = d3.select("#trails-to-miles3")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
svg3.call(tip3);

d3.tsv("resort-to-fivestartrail.tsv",
  function (d) {
    d.fivestartrail = +d.fivestartrail;
    return d;
  },
  function (error, data) {
    x.domain(data.map(function (d) {return d.resort;}));
    y.domain([0, d3.max(data, function (d) {return d.fivestartrail;}) + 5]);

    svg3.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Five Star Trails");

    svg3.selectAll(".bar3")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar3 bar-hover")
            .attr("x", function(d) {return x(d.resort);})
            .attr("width", x.rangeBand())
            .attr("y", function(d) {return y(d.fivestartrail);})
            .attr("height", function(d) {return height - y(d.fivestartrail);})
            .on('mouseover', tip3.show)
            .on('mouseout', tip3.hide)
  }
);
