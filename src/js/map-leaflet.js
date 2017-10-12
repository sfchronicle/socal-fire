require("./lib/social"); //Do not delete
var d3 = require('d3');

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 38.2;
  var sf_long = -122.4;
  var zoom_deg = 8;

  var offset_top = 900;
  var bottomOffset = 100;

} else {
  var sf_lat = 38.7;
  var sf_long = -122.6;
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
// map.scrollWheelZoom.disable();
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.keyboard.disable();

// initializing the svg layer
L.svg().addTo(map);

// add tiles to the map

//https://api.mapbox.com/styles/v1/emro/cj4g94j371v732rnptcghibsy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA
//https://api.mapbox.com/styles/v1/emro/cj8lviggc6b302rqjyezdqc2m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj8oq9bxg8zfu2rs3uw1ot59l/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);

L.control.zoom({
     position:'topright'
}).addTo(map);

var MapIcon = L.Icon.extend({
    options: {
        iconSize:     [20,20],
        iconAnchor:   [10,10],
    }
});

// var deathIcon = new MapIcon({iconUrl: 'leaf-white.png'});
var fireIcon = new MapIcon({iconUrl: '../assets/graphics/fire_icon.png?'});
var evacuationIcon = new MapIcon({iconUrl: '../assets/graphics/evacuation_icon.png?'});
var hospitalsIcon = new MapIcon({iconUrl: '../assets/graphics/hospitalsEvacuated_icon.png?'});

var purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

evacuation_data.forEach(function(d){
  var html_str = "<b>"+d.Name+"</b><br>"+d.Address;
  if (d["Phone number"]) {
    html_str += "<br>"+d["Phone number"];
  }
  if (d.Notes){
    html_str += "<br>Note: "+d.Notes;
  }
  L.marker([d.Lat, d.Lng], {icon: evacuationIcon}).addTo(map).bindPopup(html_str);
});

deaths_data.forEach(function(d){
  var html_str = d.Address+"<br>"+d.Count+" death(s)";
  L.marker([d.Lat, d.Lng],{icon: purpleIcon}).addTo(map).bindPopup(html_str);
});

winery_data.forEach(function(d){
  var html_str = "<b>"+d.Name+"</b><br><i>"+d.Address+"</i><br>"+d.Description;
  L.marker([d.Lat, d.Lng], {icon: greenIcon}).addTo(map).bindPopup(html_str);
});

hospitals_data.forEach(function(d){
  var html_str = "<b>"+d.Name+"</b>";
  L.marker([d.Latitude, d.Longitude], {icon: hospitalsIcon}).addTo(map).bindPopup(html_str);
});

var myStyle = {
    "color": "#7D2E68",
    "fill-opacity": 0.8,
    "weight": 1,
    "opacity": 1
};

var fireDataURL = "http://extras.sfgate.com/editorial/wildfires/noaa.csv?v=2";

var timer5minutes = 600000;
var map_timer;


d3.csv(fireDataURL, function(fire_data){

  // creating Lat/Lon objects that d3 is expecting
  fire_data.forEach(function(d,idx) {
  	d.LatLng = new L.LatLng(d.latitude,
  							d.longitude);
  });

  clearTimeout(map_timer);
  drawMap(fire_data);
  d3.text('http://extras.sfgate.com/editorial/wildfires/noaatime.txt', function(text) {
    document.getElementById("updateID").innerHTML = text;
  });

  map_timer = setInterval(function() {

    drawMap(fire_data);
    d3.text('http://extras.sfgate.com/editorial/wildfires/noaatime.txt', function(text) {
      document.getElementById("updateID").innerHTML = text;
    });

  }, timer5minutes);

});

// draw map with dots on it
var drawMap = function(fire_data) {

  d3.select("svg").selectAll("fireDot").remove();
  var svg = d3.select("#map-leaflet").select("svg");
  svg.attr("class","dotsSVG")
  var g = svg.append("g");
  g.attr("class","dotG")

  var circles = g.selectAll("dotG")
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

// creating Lat/Lon objects that d3 is expecting
fire_names.forEach(function(d,idx) {
  d.LatLng = new L.LatLng(d.Lat,
              d.Lon);
});

var svg = d3.select("#map-leaflet").select("svg");
var gLabels = svg.append("g");
gLabels.attr("class","dotsLABELS")

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

// draw map with dots on it
// var drawAir = function(air_data) {
//
//   d3.select("svg").selectAll("airDot").remove();
//   var svg = d3.select("#map-leaflet").select("svg");
//   var g = svg.append("g");
//
//   var circles = g.selectAll("g")
//     .data(air_data)
//     .enter()
//     .append("g");
//
//   // adding circles to the map
//   circles.append("circle")
//     .attr("class",function(d) {
//       // console.log(d);
//       return "dot airDot";
//     })
//     .style("opacity", function(d) {
//       return 0.8;
//     })
//     .style("fill", function(d) {
//       return "blue";//"#E32B2B";//"#3C87CF";
//     })
//     // .style("stroke","#696969")
//     .attr("r", function(d) {
//       if (screen.width <= 480) {
//         return 5;
//       } else {
//         return 8;
//       }
//     });
//
//   // function that zooms and pans the data when the map zooms and pans
//   function update() {
//   	circles.attr("transform",
//   	function(d) {
//   		return "translate("+
//   			map.latLngToLayerPoint(d.LatLng).x +","+
//   			map.latLngToLayerPoint(d.LatLng).y +")";
//   		}
//   	)
//   }
//
//   map.on("viewreset", update);
//   map.on("zoom",update);
//   update();
// }
//
// // creating Lat/Lon objects that d3 is expecting
// air_data.forEach(function(d,idx) {
//   d.LatLng = new L.LatLng(d.Latitude,
//               d.Longitude);
// });
//
// drawAir(air_data);
