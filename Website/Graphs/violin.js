console.log("violin.js")

x_list = []
x1_list = []
y_list = []
y1_list = []
y2_list = []
y3_list = []

type = 'Stratovolcano'
type1 = 'Shield'

var selector = d3.select("#selDataset");
var selector1 = d3.select("#selDataset1");

var type_array = [];

d3.json("./Graphs/Vol_cleaned.json", function (err, rows) {
  for (i in rows) {
    type = rows[i].Volcano_Type

    if (type_array.indexOf(type) === -1) {
      type_array.push(type)
      // console.log("type=" + type_array)
    }
  } 


// type_array.sort();
console.log("type=" + type_array)

selector
  .append("option")
  .property("value", "")
  .text("Select Type");

type_array.map((type) => {
  // console.log("type=" + type)

  selector
    .append("option")
    .property("value", type)
    .text(type);
});

selector1
  .append("option")
  .property("value", "")
  .text("Select Type");

type_array.map((type) => {
  selector1
    .append("option")
    .property("value", type)
    .text(type);
});

})

function handleClick() {

  let type = d3.select("#selDataset").property("value");
  let type1 = d3.select("#selDataset1").property("value");
  console.log(type + " " + type1)
  

d3.json("./Graphs/Vol_cleaned.json", function (err, rows) {
 
  for (i in rows) {
    //  console.log(rows[i]) 

     if (rows[i].Volcano_Type===type) {
      x_list.push(rows[i].Region) 
      y_list.push(rows[i].Summit)
      y2_list.push(rows[i].Elevation)
     }

     if (rows[i].Volcano_Type===type1) {
      x1_list.push(rows[i].Region) 
      y1_list.push(rows[i].Summit)
      y3_list.push(rows[i].Elevation)
     }
  }    
    
    let traces1 = [{
      type: 'violin',
      x: x_list,
      y: y_list,
      legendgroup: type,
      scalegroup: type,
      name: type,
      box: {
        visible: true
      },
      line: {
        color: 'maroon',
      },
      meanline: {
        visible: true
      }
    }, {
      type: 'violin',
      x: x1_list,
      y: y1_list,
      legendgroup: type1,
      scalegroup: type1,
      name: type1,
      box: {
        visible: true
      },
      line: {
        color: 'orange',
      },
      meanline: {
        visible: true
      }
    }]
    
    
    var layout = {
      title: "Summit Violin Plot",
      yaxis: {
        zeroline: false
      },
      violinmode: 'group'
    }
    
    Plotly.newPlot('violin1', traces1, layout);
    
    let traces2 = [{
        type: 'violin',
        x: x_list,
        y: y2_list,
        legendgroup: type,
        scalegroup: type,
        name: type,
        box: {
          visible: true
        },
        line: {
          color: 'maroon',
        },
        meanline: {
          visible: true
        }
      }, {
        type: 'violin',
        x: x1_list,
        y: y3_list,
        legendgroup: type1,
        scalegroup: type1,
        name: type1,
        box: {
          visible: true
        },
        line: {
          color: 'orange',
        },
        meanline: {
          visible: true
        }
      }]
      
      
      var layout = {
        title: "Elevation Violin Plot",
        yaxis: {
          zeroline: false
        },
        violinmode: 'group'
      }

      
      Plotly.newPlot('violin2', traces2, layout);
});
}

d3.selectAll("#filter-btn").on("click", handleClick);



// d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/violin_data.csv", function (err, rows) {
//   console.log(rows)

//   function unpack(rows, key) {
//       x = rows.map(function (row) { return row[key]; })
//       // console.log(x)
      
//       return rows.map(function (row) { return row[key]; });
//   }

//   var data = [{
//       type: 'violin',
//       x: unpack(rows, 'day'),
//       y: unpack(rows, 'total_bill'),
//       legendgroup: 'M',
//       scalegroup: 'M',
//       name: 'M',
//       box: {
//           visible: true
//       },
//       line: {
//           color: 'blue',
//       },
//       meanline: {
//           visible: true
//       }
//   }, {
//       type: 'violin',
//       x: unpack(rows, 'day'),
//       y: unpack(rows, 'total_bill'),
//       legendgroup: 'F',
//       scalegroup: 'F',
//       name: 'F',
//       box: {
//           visible: true
//       },
//       line: {
//           color: 'pink',
//       },
//       meanline: {
//           visible: true
//       }
//   }]

//   var layout = {
//       title: "Grouped Violin Plot",
//       yaxis: {
//           zeroline: false
//       },
//       violinmode: 'group'
//   }

//   Plotly.newPlot('violin1', data, layout);
// });