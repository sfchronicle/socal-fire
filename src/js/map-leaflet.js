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
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj8lviggc6b302rqjyezdqc2m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
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

var grayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png?',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

evacuation_data.forEach(function(d){
  // L.marker([d.Lat, d.Lng], {icon: evacuationIcon}).addTo(map);
  if (d.description) {
    var html_str = "<b>"+d.Name+"</b><br>"+d.Address+"<br>"+d["Phone number"]+"<br>"+d.description;
  } else {
    var html_str = "<b>"+d.Name+"</b><br>"+d.Address+"<br>"+d["Phone number"];
  }
  L.marker([d.Lat, d.Lng], {icon: evacuationIcon}).addTo(map).bindPopup(html_str);
});

deaths_data.forEach(function(d){
  var html_str = d.Address+"<br>"+d.Count+" death(s)";
  L.marker([d.Lat, d.Lng],{icon: grayIcon}).addTo(map).bindPopup(html_str);
});

var myStyle = {
    "color": "#7D2E68",
    "fill-opacity": 0.8,
    "weight": 1,
    "opacity": 1
};

var myLayer = L.geoJSON(wineriesGeoJson,{style:myStyle}).addTo(map);
// console.log(wineriesGeoJson);
// myLayer.addData(wineriesGeoJson);

// var polygon = L.polygon(wineries_data["items"][0]["neighborhood_poly"]).addTo(map);

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
  var g = svg.append("g");

  var circles = g.selectAll("g")
    .data(fire_data)
    .enter()
    .append("g");

  // adding circles to the map
  circles.append("circle")
    .attr("class",function(d) {
      // console.log(d);
      return "dot fireDot";
    })
    .style("opacity", function(d) {
      return 0.8;
    })
    .style("fill", function(d) {
      return "#FF530D";//"#E32B2B";//"#3C87CF";
    })
    // .style("stroke","#696969")
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

// draw map with dots on it
var drawAir = function(air_data) {

  d3.select("svg").selectAll("airDot").remove();
  var svg = d3.select("#map-leaflet").select("svg");
  var g = svg.append("g");

  var circles = g.selectAll("g")
    .data(air_data)
    .enter()
    .append("g");

  // adding circles to the map
  circles.append("circle")
    .attr("class",function(d) {
      // console.log(d);
      return "dot airDot";
    })
    .style("opacity", function(d) {
      return 0.8;
    })
    .style("fill", function(d) {
      return "blue";//"#E32B2B";//"#3C87CF";
    })
    // .style("stroke","#696969")
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
air_data.forEach(function(d,idx) {
  d.LatLng = new L.LatLng(d.Latitude,
              d.Longitude);
});

drawAir(air_data);


// drawMap(fire_data);

// using togeojson in nodejs

// omnivore.kml("../assets/mapfiles/fire.kml").addTo(map);

//
// var kml = new DOMParser().parseFromString(fs.readFileSync('../assets/mapfiles/fire.kml', 'utf8'));
// var converted = tj.kml(kml);
// var convertedWithStyles = tj.kml(kml, { styles: true });
//
// console.log(kml);
