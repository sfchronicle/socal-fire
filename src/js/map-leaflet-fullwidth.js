require("./lib/social"); //Do not delete
var d3 = require('d3');

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 38.6;
  var sf_long = -122.4;
  var zoom_deg = 8;

  var offset_top = 900;
  var bottomOffset = 100;

} else {
  var sf_lat = 38.4;
  var sf_long = -123;
  var zoom_deg = 8;

  var offset_top = 900;
  var bottomOffset = 200;
}

// initialize map with center position and zoom levels
var map = L.map("map-leaflet", {
  minZoom: 7,
  maxZoom: 16,
  zoomControl: false,
}).setView([sf_lat,sf_long], zoom_deg);

// dragging and zooming controls
map.scrollWheelZoom.disable();
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.keyboard.disable();

// initializing the svg layer
L.svg().addTo(map);

// add tiles to the map
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj8oq9bxg8zfu2rs3uw1ot59l/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);

// zoom control is on top right
L.control.zoom({
     position:'topright'
}).addTo(map);

// sizing evacuation and hospital icons
var MapIcon = L.Icon.extend({
    options: {
        iconSize:     [20,20],
        iconAnchor:   [10,10],
    }
});
// adding images for evacuations and hospitals
var evacuationIcon = new MapIcon({iconUrl: './assets/graphics/evacuation_icon.png?'});
var hospitalsIcon = new MapIcon({iconUrl: './assets/graphics/hospitalsEvacuated_icon.png?'});

// icon for deaths
var purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

// icon for damaged wineries
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

// we are going to list all the markers here so we can easily turn them all off and on
var markerArray = new Array();

// function to draw markers
var drawIcons = function() {
  evacuation_data.forEach(function(d){
    var html_str = "<b>"+d.Name+"</b><br>"+d.Address;
    if (d["Phone number"]) {
      html_str += "<br>"+d["Phone number"];
    }
    if (d.Notes){
      html_str += "<br>Note: "+d.Notes;
    }
    var tempmarker = L.marker([d.Lat, d.Lng], {icon: evacuationIcon}).addTo(map).bindPopup(html_str);
    markerArray.push(tempmarker);
  });

  hospitals_data.forEach(function(d){
    var html_str = "<b>"+d.Name+"</b>";
    var tempmarker = L.marker([d.Latitude, d.Longitude], {icon: hospitalsIcon}).addTo(map).bindPopup(html_str);
    markerArray.push(tempmarker);
  });

  winery_data.forEach(function(d){
    var html_str = "<b>"+d.Name+"</b><br><i>"+d.Address+"</i><br>"+d.Description;
    var tempmarker = L.marker([d.Lat, d.Lng], {icon: greenIcon}).addTo(map).bindPopup(html_str);
    markerArray.push(tempmarker);
  });

  deaths_data.forEach(function(d){
    if (d.Name) {
      var html_str = d.StreetName+"<br>"+d.Count+" death(s): "+d.Name;
    } else {
      var html_str = d.StreetName+"<br>"+d.Count+" death(s)";
    }
    var tempmarker = L.marker([d.Lat, d.Lng],{icon: purpleIcon}).addTo(map).bindPopup(html_str);
    markerArray.push(tempmarker);
  });
}

// load all the icons (evacuations, hospitals, wineries, deaths)
drawIcons();

// not using any of this
// var napaStyle = {
//     "color": "#8470ba",
//     "weight": 1,
// };
//
// var last12Style = {
//     "color": "#FF6721",//"#351B77",
//     "fill-opacity": 0.8,
//     "weight": 3,
// };
//
// var last24Style = {
//     "color": "#FF8800",//"#351B77",
//     "fill-opacity": 0.8,
//     "weight": 3,
// };
//
// var last7daysStyle = {
//     "color": "#FFB200",//"#351B77",
//     "fill-opacity": 0.8,
//     "weight": 3,
// };

var day1style = {"color": "#FFCC1A","fill-opacity": 0.3,"weight": 3};
var day2style = {"color": "#FFBF0D","fill-opacity": 0.3,"weight": 3};
var day3style = {"color": "#FFB200","fill-opacity": 0.3,"weight": 3};
var day4style = {"color": "#F2A500","fill-opacity": 0.3,"weight": 3};
var day5style = {"color": "#E59800","fill-opacity": 0.3,"weight": 3};
var day6style = {"color": "#FF8800","fill-opacity": 0.3,"weight": 3};
var day7style = {"color": "#F27B00","fill-opacity": 0.3,"weight": 3};
var day8style = {"color": "#FF6721","fill-opacity": 0.3,"weight": 3};
var day9style = {"color": "#F25A14","fill-opacity": 0.3,"weight": 3};
var day10style = {"color": "#D94100","fill-opacity": 0.3,"weight": 3};//#E54D07
var day11style = {"color": "#D94100","fill-opacity": 0.3,"weight": 3};

// we're not actually using any of this so we should delete it
// var napaLayer, sonomaLayer, fireLayerLast7days, fireLayerLast24, fireLayerLast12;
// var avas_toggle = 0, last7days_toggle = 1, last24_toggle = 1, last12_toggle = 1;

// these are variables for if we are showing the icons and the airquality layers
var pins_toggle = 1, pollution_toggle = 0;
var pollutionLayer, contourLayer;

// these are all the layers for the fire perimeters and their toggles
var fireLayerDay1, fireLayerDay2, fireLayerDay3, fireLayerDay4, fireLayerDay5, fireLayerDay6, fireLayerDay7, fireLayerDay8, fireLayerDay9, fireLayerDay10;
var day1_toggle = 1, day2_toggle = 1, day3_toggle = 1, day4_toggle = 1, day5_toggle = 1, day6_toggle = 1, day7_toggle = 1, day8_toggle = 1, day9_toggle = 1, day10_toggle = 1;

// document.getElementById("avas").addEventListener("click",function() {
//   if (avas_toggle == 1) {
//     map.removeLayer(napaLayer);
//     map.removeLayer(sonomaLayer);
//     avas_toggle = 0;
//     this.classList.remove("active");
//   } else {
//     sonomaLayer = L.geoJSON(sonomaGeoJson,{style: napaStyle}).addTo(map);
//     napaLayer = L.geoJSON(napaGeoJson,{style: napaStyle}).addTo(map);
//     avas_toggle = 1;
//     this.classList.add("active");
//   }
// });

// hide and show icons based on button click
document.getElementById("iconsbutton").addEventListener("click",function() {
  // hide icons
  if (pins_toggle == 1) {
    for (var i = 0; i < markerArray.length; i++) {
      map.removeLayer(markerArray[i]);
    }
    this.classList.add("active");
    pins_toggle = 0;
  // show icons
  } else {
    for (var i = 0; i < markerArray.length; i++) {
      map.addLayer(markerArray[i]);
    }
    // drawIcons();
    this.classList.remove("active");
    pins_toggle = 1;
  }
});

// show the about the data box
document.getElementById("aboutthedata").addEventListener("click",function() {
  document.getElementById("aboutthedata-box").classList.add("active");
  document.getElementById("aboutthedata-overlay").classList.add("active");
});

// hide the about the data box
document.getElementById("close-data-box").addEventListener("click",function() {
  document.getElementById("aboutthedata-box").classList.remove("active");
  document.getElementById("aboutthedata-overlay").classList.remove("active");
});

// adding a layer for every day
fireLayerDay1 = L.geoJSON(Day1,{style: day1style}).addTo(map);
fireLayerDay2 = L.geoJSON(Day2,{style: day2style}).addTo(map);
fireLayerDay3 = L.geoJSON(Day3,{style: day3style}).addTo(map);
fireLayerDay4 = L.geoJSON(Day4,{style: day4style}).addTo(map);
fireLayerDay5 = L.geoJSON(Day5,{style: day5style}).addTo(map);
fireLayerDay6 = L.geoJSON(Day6,{style: day6style}).addTo(map);
fireLayerDay7 = L.geoJSON(Day7,{style: day7style}).addTo(map);
fireLayerDay8 = L.geoJSON(Day8,{style: day8style}).addTo(map);
fireLayerDay9 = L.geoJSON(Day9,{style: day9style}).addTo(map);
fireLayerDay10 = L.geoJSON(Day10,{style: day10style}).addTo(map);


document.getElementById("day1button").addEventListener("click",function() {
  if (day1_toggle == 1) {
    map.removeLayer(fireLayerDay1);
    day1_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay1 = L.geoJSON(Day1,{style: day1style}).addTo(map);
    day1_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day2button").addEventListener("click",function() {
  if (day2_toggle == 1) {
    map.removeLayer(fireLayerDay2);
    day2_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay2 = L.geoJSON(Day2,{style: day2style}).addTo(map);
    day2_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day3button").addEventListener("click",function() {
  if (day3_toggle == 1) {
    map.removeLayer(fireLayerDay3);
    day3_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay3 = L.geoJSON(Day3,{style: day3style}).addTo(map);
    day3_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day4button").addEventListener("click",function() {
  if (day4_toggle == 1) {
    map.removeLayer(fireLayerDay4);
    day4_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay4 = L.geoJSON(Day4,{style: day4style}).addTo(map);
    day4_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day5button").addEventListener("click",function() {
  if (day5_toggle == 1) {
    map.removeLayer(fireLayerDay5);
    day5_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay5 = L.geoJSON(Day5,{style: day5style}).addTo(map);
    day5_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day6button").addEventListener("click",function() {
  if (day6_toggle == 1) {
    map.removeLayer(fireLayerDay6);
    day6_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay6 = L.geoJSON(Day6,{style: day6style}).addTo(map);
    day6_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day7button").addEventListener("click",function() {
  if (day7_toggle == 1) {
    map.removeLayer(fireLayerDay7);
    day7_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay7 = L.geoJSON(Day7,{style: day7style}).addTo(map);
    day7_toggle = 1;
    this.classList.add("active");
  }
});

// ADD THIS IN
document.getElementById("day8button").addEventListener("click",function() {
  if (day8_toggle == 1) {
    map.removeLayer(fireLayerDay8);
    day8_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay8 = L.geoJSON(Day8,{style: day8style}).addTo(map);
    day8_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day9button").addEventListener("click",function() {
  if (day9_toggle == 1) {
    map.removeLayer(fireLayerDay9);
    day9_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay9 = L.geoJSON(Day9,{style: day9style}).addTo(map);
    day9_toggle = 1;
    this.classList.add("active");
  }
});

document.getElementById("day10button").addEventListener("click",function() {
  if (day10_toggle == 1) {
    map.removeLayer(fireLayerDay10);
    day10_toggle = 0;
    this.classList.remove("active");
  } else {
    fireLayerDay10 = L.geoJSON(Day10,{style: day10style}).addTo(map);
    day10_toggle = 1;
    this.classList.add("active");
  }
});

// TRYING TO GET THIS TO WORK AS A LOOP BUT COULD NOT
// var td;
// for (var t = 1; t < 8; t++){
//     td = document.getElementById("day"+t+"button");
//     if (typeof window.addEventListener === 'function'){
//         (function (_td) {
//             td.addEventListener('click', function(){
//                 // addLayerFunction(eval("day"+_td+"_toggle"),eval("fireLayerDay"+_td),eval("day"+_td+"style"),this);
//                 var IDX = _td.classList[0].split("day")[1];
//                 addLayerFunction(eval("day"+IDX+"_toggle"),eval("Day"+IDX),eval("fireLayerDay"+IDX),eval("day"+IDX+"style"),this);
//             });
//         })(td);
//     }
// }
//
// var addLayerFunction = function(toggle,layer,layerName,layerStyle,button){
//   console.log(toggle);
//   if (toggle == 1) {
//     map.removeLayer(layerName);
//     toggle = 0;
//     button.classList.remove("active");
//   } else {
//     console.log(layer);
//     layerName = L.geoJSON(layer,{style: layerStyle}).addTo(map);
//     toggle = 1;
//     button.classList.add("active");
//   }
// }


// adding and removing the air quality layer on button click
document.getElementById("airquality").addEventListener("click",function() {
  // remove air quality layer
  if (pollution_toggle == 1) {
    map.removeLayer(pollutionLayer);
    map.removeLayer(contourLayer);
    pollution_toggle = 0;
    this.classList.remove("active");
    document.getElementById("airquallegend").classList.remove("active");
  // add air quality layer
  } else {
    this.classList.add("active");

    // obtain most recent dataset based on file on server
    d3.text('http://extras.sfgate.com/editorial/wildfires/airquality_date.txt?', function(text) {
      var urlpathPollution = "http://berkeleyearth.lbl.gov/air-quality/maps/hour/"+text.substring(0,6)+"/"+text+"/tiles/health/{z}/{x}/{y}.png";
      var urlpathContours = "http://berkeleyearth.lbl.gov/air-quality/maps/hour/"+text.substring(0,6)+"/"+text+"/tiles/contour/{z}/{x}/{y}.png";

      console.log(urlpathPollution);

      // add layer with colors
      pollutionLayer = L.tileLayer(urlpathPollution,{transparent: true,opacity: 0.7})
      pollutionLayer.addTo(map);
      // add layer with contour lines
      contourLayer = L.tileLayer(urlpathContours,{transparent: true,opacity: 0.7})
      contourLayer.addTo(map);
      // now we are showing the air quality layer
      pollution_toggle = 1;

      document.getElementById("airquallegend").classList.add("active");

      // fill in when data was last updated
      if (document.getElementById("airDate")) {
        document.getElementById("airDate").innerHTML = "Air quality data last updated on "+text.substring(4,6)+"/"+text.substring(6,8)+"/"+text.substring(0,4)+" at "+text.substring(8,10)+":00 UTC";
      }
      if (document.getElementById("airDatemobile")) {
        document.getElementById("airDatemobile").innerHTML = "Air quality data last updated on "+text.substring(4,6)+"/"+text.substring(6,8)+"/"+text.substring(0,4)+" at "+text.substring(8,10)+":00 UTC";
      }
    });
  }
});


// data for current fire
var fireDataURL = "http://extras.sfgate.com/editorial/wildfires/noaa.csv";
var timer5minutes = 600000;
var map_timer;

// read in fire data and create timers for re-loading it
d3.csv(fireDataURL, function(fire_data){

  console.log("initial data load");

  // creating Lat/Lon objects that d3 is expecting
  fire_data.forEach(function(d,idx) {
    d.LatLng = new L.LatLng(d.latitude,
                d.longitude);
  });

  clearTimeout(map_timer);
  drawMap(fire_data);
  d3.text('http://extras.sfgate.com/editorial/wildfires/noaatime.txt', function(text) {
    if (document.getElementById("updateID")) {
      document.getElementById("updateID").innerHTML = text;
    }
    if (document.getElementById("updateIDmobile")) {
      document.getElementById("updateIDmobile").innerHTML = text;
    }
  });

  map_timer = setInterval(function() {

    console.log("at update interval");

    drawMap(fire_data);
    d3.text('http://extras.sfgate.com/editorial/wildfires/noaatime.txt', function(text) {
      if (document.getElementById("updateID")) {
        document.getElementById("updateID").innerHTML = text;
      }
      if (document.getElementById("updateIDmobile")) {
        document.getElementById("updateIDmobile").innerHTML = text;
      }
    });

  }, timer5minutes);

});

// draw map with dots on it
var drawMap = function(fire_data) {

  console.log("drawing dots");

  d3.select("svg").selectAll("circle").remove();
  var svg = d3.select("#map-leaflet").select("svg");
  svg.attr("class","dotsSVG")
  var g = svg.append("g");

  var circles = g.selectAll("dotsSVG")
    .data(fire_data)
    .enter()
    .append("g");

  // adding circles to the map
  circles.append("circle")
    .attr("class",function(d) {
      return "dot fireDot";
    })
    .style("opacity", 0.2)
    .style("stroke","#8C0000")
    .style("opacity",1)
    .style("stroke-width","1")
    .style("fill-opacity",0.2)
    .style("fill","#8C0000")
    .attr("r", function(d) {
      if (screen.width <= 480) {
        return 5;
      } else {
        return 8;
      }
    });

  // function that zooms and pans the data when the map zooms and pans
  function update() {
    circles.attr("transform",
    function(d) {
      return "translate("+
        map.latLngToLayerPoint(d.LatLng).x +","+
        map.latLngToLayerPoint(d.LatLng).y +")";
      }
    )
  }

  map.on("viewreset", update);
  map.on("zoom",update);
  update();
}

// creating Lat/Lon objects that d3 is expecting for map labels
fire_names.forEach(function(d,idx) {
  d.LatLng = new L.LatLng(d.Lat,
              d.Lon);
});

// appending labels layer to map
var svg = d3.select("#map-leaflet").select("svg");
var gLabels = svg.append("g");
gLabels.attr("class","dotsLABELS")

// creating the labels
var labels = gLabels.selectAll("dotsLABELS")
  .data(fire_names)
  .enter()
  .append("g");

// adding circles to the map
labels.append("text")
    .style("font-size","18px")
    .style("fill","#595959")
    .text(function(d){
      return d.Name+ " Fire";
    })

// function that zooms and pans the data when the map zooms and pans
function updateLabels() {
  labels.attr("transform",
  function(d) {
    return "translate("+
      map.latLngToLayerPoint(d.LatLng).x +","+
      map.latLngToLayerPoint(d.LatLng).y +")";
    }
  )
}

map.on("viewreset", updateLabels);
map.on("zoom",updateLabels);
updateLabels();
