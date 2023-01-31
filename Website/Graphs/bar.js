//Call JSON for map latitude and longitude, showing volcaones locations
// with last eruption in a hover feature
var data = [];

d3.json("./Graphs/Vol_cleaned.json").then(function (inp_data) {
  console.log(inp_data);
  data = inp_data;

  // Once we get a response, send the data.features object to the createFeatures function
  makeDrop();
  makeMap();
  makesun();
  makebar();
});

//MAKE DROP DOWN MENU TO SELECT VOLCANO NAME


function makeDrop() {
  let names=[];
  for (var i = 0; i < data.length; i++) {
    let name = data[i].Region; 
    if(names.indexOf(name)<0){
      d3.select("#arr").append("option").text(name);
      names.push(name);
    }
  }
}
function optionChanged() {
  makeMap();
  makesun();
  makebar();
}


//Filter
function makeMap() {

  // reset map container
  $("#mapContainer").empty();
  $("#mapContainer").append("<div style='height:800px' id='map'></div>")


  let region = d3.select("#arr").node().value;
  let fil_data=data;
  if(region=="All"){
    fil_data=data;
  }else{
    fil_data = data.filter(x => x.Region == region)
  }
  
  // STEP 1: CREATE THE BASE LAYERS
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  // STEP 2: CREATE THE OVERLAY/DATA LAYERS
  let circles = [];
  for (let i = 0; i < fil_data.length; i++) {
    let volcano = fil_data[i];
    let circle = L.circle([volcano.Latitude, volcano.Longitude], {
      fillOpacity: 0.75,
      color: "firebrick",
      weight: 7,
      fillColor: "firebrick",
      radius: 500
    }).bindPopup(`<h2> ${volcano.Volcano_Name} </h2><hr> <h3>${volcano.Last_Eruption} </h3>`);
    circles.push(circle);
  }
  let circleLayer = L.layerGroup(circles)
  // STEP 3: CREATE THE LAYER CONTROL OBJECTS
  let baseMaps = {
    Street: street,
    Topography: topo
  };
  // Overlays that can be toggled on or off
  let overlayMaps = {
    Markers: circleLayer,
  };
  // STEP 4: INITIALIZE MAP
  let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 3,
    layers: [street, circleLayer]
  });
  // STEP 5: ADD LAYER CONTROL TO MAP
  // Create a layer control that contains our baseMaps and overlayMaps, and add them to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

function makesun(){
  let region = d3.select("#arr").node().value;
  let rows=data;
  if(region=="All"){
    rows=data;
  }else{
    rows = data.filter(x => x.Region == region)
  }
  let unique_regions=[];
  let region_counts=[];

  rows.forEach(function(row){
    if(unique_regions.includes(row.Region)){
      let idx=unique_regions.indexOf(row.Region);
      region_counts[idx]+=1;
    } else {
      unique_regions.push(row.Region);
      region_counts.push(1);
    }

    let subregion=row.Subregion + "$" + row.Region;
    if(unique_regions.includes(subregion)){
      let idx=unique_regions.indexOf(subregion);
      region_counts[idx]+=1;
    } else {
      unique_regions.push(subregion);
      region_counts.push(1);
    }
  });

  let labels=[];
  let parents=[];
  let ids =[];
  let cnt=0;

  unique_regions.forEach(function(region){
    if(region.indexOf("$")>0){
      if(labels.indexOf(region.split("$")[0])>=0){
        ids.push(`${region.split("$")[0]}_${cnt}`);
        cnt+=1;
      
      }else{
        ids.push(region.split("$")[0]);
      }
      labels.push(region.split("$")[0]);
      parents.push(region.split("$")[1]);
    } else{
      labels.push(region);
      parents.push("");
      ids.push(region)
    }
  });

    let traces = [{
      type: "sunburst",
      ids: ids,
      labels: labels,
      parents: parents,
      values: region_counts,
      outsidetextfont: {size: 20, color: "#377eb8"},
      // leaf: {opacity: 0.4},
      marker: {line: {width: 2}},
    }];
    
    let layout = {
      margin: {l: 0, r: 0, b: 0, t:25},
      sunburstcolorway:["#636efa","#ef553b","#00cc96"],
      title:"Volcano Number by Region"
    };
    
    Plotly.newPlot('plot2', traces, layout);
}

function makebar(){
  let region = d3.select("#arr").node().value;
  let rows=data;
  if(region=="All"){
     rows=data;
  }else{
     rows = data.filter(x => x.Region == region)
  }

  let holo_data = rows.filter(x => x.epoch_period === "holocene");
let holo_vol = [];
let holo_counts = [];

holo_data.forEach(function(row) {
  let volocano = row.Volcano_Type;

  if (holo_vol.includes(volocano)){
    holo_counts[holo_vol.indexOf(volocano)] +=1;
  } else {
    holo_vol.push(volocano);
    holo_counts.push(1);
  }
});
let plei_data = rows.filter(x => x.epoch_period === "pleistocene");
let plei_vol = [];
let plei_counts = [];

plei_data.forEach(function(row) {
  let volocano = row.Volcano_Type;

  if (plei_vol.includes(volocano)){
    plei_counts[plei_vol.indexOf(volocano)] +=1;
  } else {
    plei_vol.push(volocano);
    plei_counts.push(1);
  }
});

let holo_full = []

holo_vol.forEach(function(volcano){
  let new_row = [volcano, holo_counts[holo_vol.indexOf(volcano)]];
  holo_full.push(new_row);
});

holo_full = holo_full.sort( (a, b) => b[1]- a[1]) 
console.log(holo_full)



let trace1 = {
  x: holo_full.map(x=> x[0]),
  y: holo_full.map(x=> x[1]),
  name: 'holocene',
  type: 'bar',
  marker: {
    color: 'maroon'
  }
};

let trace2 = {
  x: plei_vol,
  y: plei_counts,
  name: 'pleistocene',
  type: 'bar',
    marker: {
    color: 'orange'
  }
};

let traces = [trace1, trace2];

let layout = {barmode: 'stack',title:"Volcano Types by Epoch Period", yaxis:{title:"Count of Volcano Types"}};

Plotly.newPlot('plot1', traces, layout);
}