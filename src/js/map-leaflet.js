require("./lib/social"); //Do not delete
var d3 = require('d3');

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 38.2;
  var sf_long = -122.4;
  var zoom_deg = 9;

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

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(map);

// initializing the svg layer
// L.svg().addTo(map);

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
        // shadowUrl: 'leaf-shadow.png',
        iconSize:     [15,25],
        // shadowSize:   [50, 64],
        iconAnchor:   [10,10],
        // shadowAnchor: [4, 62],
        // popupAnchor:  [-3, -76]
    }
});

var fireIcon = new MapIcon({iconUrl: '../assets/graphics/fire_icon.png?'});
var evacuationIcon = new MapIcon({iconUrl: '../assets/graphics/evacuation_icon.png?'});
var hospitalsIcon = new MapIcon({iconUrl: '../assets/graphics/hospitalsEvacuated_icon.png?'});

fire_data.forEach(function(d,dIDX){
  if (d.Latitude <= 43 && d.Latitude > 37 && d.Longitude <= -120){
    L.marker([d.Latitude, d.Longitude], {icon: fireIcon}).addTo(map);
  } else {
    console.log("missed a point");
  }
});

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

var geojsonFeature = {
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },

"features": [
{ "type": "Feature", "properties": { "Name": "Polygon 19", "description": null, "timestamp": null, "begin": null, "end": null, "altitudeMode": null, "tessellate": -1, "extrude": -1, "visibility": -1, "drawOrder": null, "icon": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.3931885, 38.30287, 0.0 ], [ -122.3519897, 38.2381801, 0.0 ], [ -122.3052979, 38.2462695, 0.0 ], [ -122.2640991, 38.2834691, 0.0 ], [ -122.169342, 38.2818521, 0.0 ], [ -122.1645355, 38.3351933, 0.0 ], [ -122.1974945, 38.3658871, 0.0 ], [ -122.2366333, 38.3486571, 0.0 ], [ -122.2634125, 38.3131072, 0.0 ], [ -122.3313904, 38.3050253, 0.0 ], [ -122.3931885, 38.30287, 0.0 ] ] ] } },
{ "type": "Feature", "properties": { "Name": "Polygon 20", "description": null, "timestamp": null, "begin": null, "end": null, "altitudeMode": null, "tessellate": -1, "extrude": -1, "visibility": -1, "drawOrder": null, "icon": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.7042389, 38.3211883, 0.0 ], [ -122.5531769, 38.315801, 0.0 ], [ -122.4941254, 38.2322473, 0.0 ], [ -122.4228128, 38.2460529, 0.0 ], [ -122.4453735, 38.2899366, 0.0 ], [ -122.4219437, 38.2995043, 0.0 ], [ -122.4199677, 38.3448874, 0.0 ], [ -122.4762726, 38.3481185, 0.0 ], [ -122.4961853, 38.3637335, 0.0 ], [ -122.5469971, 38.3691172, 0.0 ], [ -122.5909424, 38.3798834, 0.0 ], [ -122.645874, 38.3809599, 0.0 ], [ -122.7069855, 38.3820365, 0.0 ], [ -122.7042389, 38.3211883, 0.0 ] ] ] } },
{ "type": "Feature", "properties": { "Name": "Polygon 21", "description": null, "timestamp": null, "begin": null, "end": null, "altitudeMode": null, "tessellate": -1, "extrude": -1, "visibility": -1, "drawOrder": null, "icon": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.6932526, 38.6469082, 0.0 ], [ -122.7303314, 38.5481654, 0.0 ], [ -122.7557373, 38.50949, 0.0 ], [ -122.7790833, 38.50143, 0.0 ], [ -122.7790833, 38.4412201, 0.0 ], [ -122.6609802, 38.4412201, 0.0 ], [ -122.6589203, 38.5154001, 0.0 ], [ -122.6067352, 38.5449433, 0.0 ], [ -122.5614166, 38.5825262, 0.0 ], [ -122.6266479, 38.6286725, 0.0 ], [ -122.6932526, 38.6469082, 0.0 ] ] ] } },
{ "type": "Feature", "properties": { "Name": "Polygon 23", "description": null, "timestamp": null, "begin": null, "end": null, "altitudeMode": null, "tessellate": -1, "extrude": -1, "visibility": -1, "drawOrder": null, "icon": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.9212189, 38.7015876, 0.0 ], [ -122.8676605, 38.7460507, 0.0 ], [ -122.9576111, 38.8086807, 0.0 ], [ -123.0242157, 38.8113559, 0.0 ], [ -123.0166626, 38.7728224, 0.0 ], [ -122.9212189, 38.7015876, 0.0 ] ] ] } },
{ "type": "Feature", "properties": { "Name": "Polygon 22", "description": null, "timestamp": null, "begin": null, "end": null, "altitudeMode": null, "tessellate": -1, "extrude": -1, "visibility": -1, "drawOrder": null, "icon": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.2380066, 38.5025047, 0.0 ], [ -122.2647858, 38.50143, 0.0 ], [ -122.3313904, 38.4310009, 0.0 ], [ -122.2901917, 38.3739622, 0.0 ], [ -122.1920013, 38.3976441, 0.0 ], [ -122.1762085, 38.4557396, 0.0 ], [ -122.2380066, 38.5025047, 0.0 ] ] ] } }
]
}

var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

//
// var circles = g.selectAll("g")
//   .data(fire_data)
//   .enter()
//   .append("g");
//
// // adding circles to the map
// circles.append("circle")
//   .attr("class",function(d) {
//     // console.log(d);
//     return "dot";
//   })
//   .style("opacity", function(d) {
//     return 0.2;
//   })
//   .style("fill", function(d) {
//     return "#c11a1a";//"#E32B2B";//"#3C87CF";
//   })
//   // .style("stroke","#696969")
//   .attr("r", function(d) {
//     if (screen.width <= 480) {
//       return 5;
//     } else {
//       return 5;
//     }
//   });
//
// // function that zooms and pans the data when the map zooms and pans
// function update() {
// 	circles.attr("transform",
// 	function(d) {
// 		return "translate("+
// 			map.latLngToLayerPoint(d.LatLng).x +","+
// 			map.latLngToLayerPoint(d.LatLng).y +")";
// 		}
// 	)
// }
//
// map.on("viewreset", update);
// map.on("zoom",update);
// update();
