d3.json("./Graphs/Vol_cleaned.json").then(function(rows){

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

    let data = [{
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
    
    Plotly.newPlot('plot2', data, layout);
    });
