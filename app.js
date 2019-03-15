


function buildMetadata(sample) {
  //base url and whatever is passed thru the function will get us our json object
  var base_url= "/metadata/";
  var url = base_url+sample;
  d3.json(url).then(function(response){
//console log the response so we know the app.py works
    console.log(response);
    var metaData = [response];
//select the main div and clear out of any existing divs, this will allow us to enter/update new information
    var panel = d3.select(".panel-body")
    .html("")
//select all divs (there will be none since we cleared them all out) and bind it to the JSON object. Enter spaces to create new divs (enough for as many objects in the metadata). 
//Use.html to enter the data using strong tag and .classed to give it the panel-body bootstrap class  
    panel.selectAll("div")
    .data(metaData)
    .enter()
    .append("div")
    .classed("panel-body", true)
    .html(function(d) {
      return `<strong>AGE:</strong> ${d.AGE}<br> <strong>BBTYPE:</strong> ${d.BBTYPE} <br> 
      <strong>ETHNICITY:</strong> ${d.ETHNICITY}<br> <strong>GENDER:</strong> ${d.GENDER}<br> 
      <strong>LOCATION:</strong> ${d.LOCATION}<br> <strong>SAMPLE ID:</strong> ${d.sample}`;
      }); 
  })

}

function unpack(rows,index){
  return rows.map(function(row){
    return row[index];
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var base_url= "/samples/";
  var url = base_url+sample;
  d3.json(url).then(function(response){
    console.log(response);
    var xValues = response.otu_ids;
    var sharedValues = response.sample_values;
    var labels = response.otu_labels;
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace = {
      x: xValues,
      y: sharedValues,
      text: labels,
      mode: "markers", 
      marker: {
        size: sharedValues,
        color: xValues,
      }
    };
    var data = [trace];

    var layout = {
      title: 'OTU ID',
      showlegend: false,
 
    }
    
    Plotly.newPlot('bubble', data, layout);
    // @TODO: Build a Pie Chart
    
    var slicedX = xValues.slice(0,10);
    var slicedShared = sharedValues.slice(0,10);
    var slicedLabels = labels.slice(0,10);

    var data2 = [{
      values: slicedShared, 
      labels: slicedX,
      hoverinfo: slicedLabels,  
      type: "pie"}];

    Plotly.newPlot("pie", data2);
  });
} 

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
