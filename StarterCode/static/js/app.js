// get sample data (values, ids, labels for horizontal bar chart and bubble chart)
function buildPlots(sampleID) {
    d3.json("samples.json").then((data) => {
        console.log(data);

        // filter data by test subject ID and display filtered data
        const sampleName = data.samples.filter(row => row.id === sampleID);
        console.log(sampleName);

        const otu = sampleName[0].otu_ids
        console.log(otu);

        // get first 10 samples and reverse order
        const sampleData = sampleName[0].sample_values.slice(0,10)
        const sample_values = sampleData.sort((firstNum, secondNum) => secondNum - firstNum).reverse();
        console.log(sample_values);

        const otuData = sampleName[0].otu_ids.slice(0,10);
        const otuSort = otuData.sort((firstNum, secondNum) => secondNum - firstNum).reverse();

        // add "OTU" to ID numbers
        const otu_ids = otuSort.map(data => "OTU" + " " + data);
        console.log(otu_ids);
    
        const otu_labels = sampleName[0].otu_labels.slice(0,10);
        console.log(otu_labels);

        // horizontal bar chart
        const barhChart = [{
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        }];
    
        const layout = {
            title: "Top 10 OTUs per Test Subject",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            },
            xaxis: {title: "Sample Values"},
            width: 1000
        };
    
        Plotly.newPlot("bar", barhChart, layout);
    
        // bubble chart
        const bubbleChart = [{
            x: sampleName[0].otu_ids,
            y: sampleName[0].sample_values,
            text: sampleName[0].otu_labels,
            mode: "markers",
            marker: {
                size: sampleName[0].sample_values,
                color: sampleName[0].otu_ids
            },
        }];
    
        const bubbleLayout = {
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
            height: 500,
            width: 1200
        };
    
        Plotly.newPlot("bubble", bubbleChart, bubbleLayout);


});

}

// get metadata for demographic info box
function getMetadata(sampleID) {

    d3.json("samples.json").then((data) => {
        console.log(sampleID);

        // get demographic data based on ID
        const results = data.metadata.filter(row => row.id == sampleID);
        console.log(results);

        // grab the html id for the dropdown menu
        const demoInfo = d3.select("#sample-metadata");
        demoInfo.html("");

        // iterate through results to get key and value pairs
        Object.entries(results[0]).forEach(([key, value]) => {
            demoInfo.append("h5").text(`${key}: ${value}`);
        });
    });
}

// function to updata plots and demographic info with new data based on test subject ID selection
function updateData(newData) {
    
    buildPlots(newData);
    getMetadata(newData);
}

// initialize default data
function init() {

    const dropdownMenu = d3.select("#selDataset");

    d3.json("samples.json").then((sampleData) => {
        console.log(sampleData);

        // iterate through names array and append values to dropdown
        sampleData.names.forEach(sample => {
            dropdownMenu.append("option").text(sample).property("value");
        });

        // first sample to build initial plot
        buildPlots(sampleData.names[0]);
        getMetadata(sampleData.names[0]);

    });
}

init();