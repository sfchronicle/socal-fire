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
  var sf_lat = 38.3;
  var sf_long = -122.6;
  var zoom_deg = 9;

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
// map._initPathRoot();


// var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
// 	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
// }).addTo(map);

// add tiles to the map
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj8lviggc6b302rqjyezdqc2m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);

L.control.zoom({
     position:'topright'
}).addTo(map);

// creating Lat/Lon objects that d3 is expecting
fire_data.forEach(function(d,idx) {
	d.LatLng = new L.LatLng(d.Latitude,
							d.Longitude);
});

var svg = d3.select("#map-leaflet").select("svg");
var g = svg.append("g");

var MapIcon = L.Icon.extend({
    options: {
        iconSize:     [15,25],
        iconAnchor:   [10,10],
    }
});

var fireIcon = new MapIcon({iconUrl: '../assets/graphics/fire_icon.png?'});
var evacuationIcon = new MapIcon({iconUrl: '../assets/graphics/evacuation_icon.png?'});
var hospitalsIcon = new MapIcon({iconUrl: '../assets/graphics/hospitalsEvacuated_icon.png?'});

// fire_data.forEach(function(d,dIDX){
//   if (d.Latitude <= 43 && d.Latitude > 37 && d.Longitude <= -120){
//     L.marker([d.Latitude, d.Longitude], {icon: fireIcon}).addTo(map);
//   } else {
//     console.log("missed a point");
//   }
// });

evacuation_data.forEach(function(d){
  L.marker([d.Latitude, d.Longitude], {icon: evacuationIcon}).addTo(map);
  if (d.description) {
    var html_str = "<b>"+d.Name+"</b><br>"+d.description;
  } else {
    var html_str = "<b>"+d.Name+"</b><br>"
  }
  L.marker([d.Latitude, d.Longitude], {icon: evacuationIcon}).addTo(map).bindPopup(html_str);
});

hospitals_data.forEach(function(d){
  if (d.description) {
    var html_str = "<b>"+d.Name+"</b><br>"+d.description;
  } else {
    var html_str = "<b>"+d.Name+"</b><br>"
  }
  L.marker([d.Latitude, d.Longitude], {icon: hospitalsIcon}).addTo(map).bindPopup(html_str);
});

var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

var circles = g.selectAll("g")
  .data(fire_data)
  .enter()
  .append("g");

// adding circles to the map
circles.append("circle")
  .attr("class",function(d) {
    // console.log(d);
    return "dot";
  })
  .style("opacity", function(d) {
    return 0.5;
  })
  .style("fill", function(d) {
    return "#c11a1a";//"#E32B2B";//"#3C87CF";
  })
  // .style("stroke","#696969")
  .attr("r", function(d) {
    if (screen.width <= 480) {
      return 5;
    } else {
      return 5;
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
