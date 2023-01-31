//Call JSON for map latitude and longitude, showing volcaones locations
// with last eruption in a hover feature
var data = [];

d3.json("./Graphs/Vol_cleaned.json").then(function (inp_data) {
  console.log(inp_data);
  data = inp_data;

  // Once we get a response, send the data.features object to the createFeatures function
  makeDrop();
  makeMap();
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
}


//Filter
function makeMap() {

  // reset map container
  $("#mapContainer").empty();
  $("#mapContainer").append("<div style='height:800px' id='map'></div>")


  let region = d3.select("#arr").node().value;
  let fil_data = data.filter(x => x.Region == region)
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




