var svgWidth = 1000;
var svgHeight = 500;

var margin = { top: 75, right: 75, bottom: 75, left: 75 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis="smokes"

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);  
    return xLinearScale;
  }


  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    var randomColor = Math.floor(Math.random()*16777215).toString(16);

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("fill", "#"+randomColor)
  
    return circlesGroup;
  }

  function renderText(textGroup, newXScale,  yLinearScale, chosenXAxis, healthData){

    var randomColor = Math.floor(Math.random()*16777215).toString(16);

    chartGroup
    .selectAll(".scatterText")
    .transition()
    .attr("x", d => newXScale(d[chosenXAxis]-0.01))
    .attr("stroke", "#"+randomColor)
    randomColor = Math.floor(Math.random()*16777215).toString(16);
d3.select("body").style("background-color", "#"+randomColor)

    return textGroup;
  }


  
   
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  $(".tip").remove();
  
  var label;

  if (chosenXAxis === "smokes") {
    label = "smokes";
  }
  else {
    label = "obesity";
  }
  var randomColor = Math.floor(Math.random()*16777215).toString(16);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
  
    .html(function(d) {
      return (`<div class="tip" style="height:200px;width:200px;background-color:#${randomColor};">${d.state}<br>${label} ${d[chosenXAxis]}</div>`);
    });

  circlesGroup.call(toolTip);


  randomColor = Math.floor(Math.random()*16777215).toString(16);

  circlesGroup.on("click", function(data) {
   toolTip.style("background-color", randomColor )
    toolTip.show(data);
  })
    // onmouseout event
    // .on("mouseout", function(data, index) {
      toolTip.hide();
    // });

  return circlesGroup;
}
  
  d3.csv("healthDemographics.csv").then(function(healthData, err) {
    console.log(healthData)

    healthData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
        d.obesity = +d.obesity;
      });
    

      var xLinearScale = xScale(healthData, 'smokes');

      var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.poverty)])
    .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
  


    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup
    .append("g")
    .selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.poverty))
      .attr("r", 30)
      .attr("fill", "blue")
      .attr("opacity", ".75")
     
var textGroup = chartGroup.append("g")
    .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .attr("class", "test")
        .attr("text-anchor", "middle")
        .attr("x", d => xLinearScale(d[chosenXAxis]-0.01))
        .attr("y", d => yLinearScale(d.poverty-0.22))
        .attr("font-size",25)
        .attr("stroke", "red")
        .text(data => data.abbr)
        .attr("class", "scatterText")
        .append().html("<filter id='whiteOutlineEffect'><feMorphology in='SourceAlpha' result='MORPH' operator='dilate' radius='2' />"+
        "<feColorMatrix in='MORPH' result='WHITENED' type='matrix' values='-1 0 0 1 0, 0 -1 0 1 0, 0 0 -1 1 0, 0 0 0 1 0'/>"+
        "<feMerge><feMergeNode in='WHITENED'/><feMergeNode in='SourceGraphic'/></feMerge></filter>")
        .attr("filter", "url(#whiteOutlineEffect)")

  
      var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      var smokingLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "smokes") // value to grab for event listener
      .classed("active", true)
      .text("Measurement of Smoking Level");
  
      var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Measurement of Obesity Level");
  

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Measurement of Poverty Level");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {

        

        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(healthData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
        //   textGroup.remove()
        //  chartGroup.select(textGroup.abbr).remove()
        textGroup=renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, healthData );
        
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


          // changes classes to change bold text
          if (chosenXAxis === "smokes") {
            smokingLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            smokingLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });


    
//   chartGroup.append("text")
//   .style("text-anchor", "middle")
//   .style("font-size", "12px")
//   .selectAll("tspan")
//   .data(healthData)
//   .enter()
//   .append("tspan")
//     //   .attr("x", function(data) {
//     //       return xLinearScale(data.poverty - 0);
//     //   })
//     //   .attr("y", function(data) {
//     //       return yLinearScale(data.phys_act - 0.2);
//     //   })
//       .text(function(data) {
//           return data.abbr
//       });




  }).catch(function(error) {
    console.log(error);
  });
  

    // var toolTip = d3.tip()
    // .attr("class", "tooltip")
    // .offset([80, -60])
    // .html(function(d) {
    //   return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    // });



//   });
