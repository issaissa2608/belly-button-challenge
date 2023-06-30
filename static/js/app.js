const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Demographic Info
function demographicInfo(id) {
    // Display Info
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let idfilter = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(idfilter).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};


//Ploting
function Plot(id) {
    d3.json(url).then(function (data) {
        //Bar Plot
        let sampleData = data;
        let samples = sampleData.samples;
        let idfilter = samples.filter(sample => sample.id === id);
        let filtered = idfilter[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
        let barTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barData = [barTrace];
        Plotly.newPlot('bar', barData);
        //Bubble Plot
        let bubbleTrace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Portland'
            },
            text: filtered.otu_labels,
        };
        let bubbleData = [bubbleTrace];
        Plotly.newPlot('bubble', bubbleData);
    })
};

//Select ID
function optionChanged(id) {
    Plot(id);
    demographicInfo(id);
};

//Init Function
function init() {
    let dropDown = d3.select('#selDataset');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        Object.values(names).forEach(value => {dropDown.append('option').text(value);
                                    })
        demographicInfo(names[0]);
        Plot(names[0])
    })
};

init();