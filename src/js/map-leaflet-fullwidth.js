require("./lib/social"); //Do not delete
var d3 = require('d3');

// format numbers
var formatthousands = d3.format(",");

// format dates
function formatDate(date,monSTR) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm PDT' : 'am PDT';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return monSTR + ". " + date.getDate() + ", " + date.getFullYear() + " at " + strTime;
}

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 38.6;
  var sf_long = -122.4;
  var zoom_deg = 8;
  var max_zoom_deg = 8;//16
  var min_zoom_deg = 8;//7

  var offset_top = 900;
  var bottomOffset = 100;

} else {
  var sf_lat = 38.4;
  var sf_long = -123;
  var zoom_deg = 8;
  var max_zoom_deg = 8;//16
  var min_zoom_deg = 8;//7

  var offset_top = 900;
  var bottomOffset = 200;
}

// initialize map with center position and zoom levels
var map = L.map("map-leaflet", {
  minZoom: min_zoom_deg,
  maxZoom: max_zoom_deg,
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
// var gl = L.mapboxGL({
//     accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
//     style: 'mapbox://styles/emro/cj8oq9bxg8zfu2rs3uw1ot59l',
//     attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>'
// }).addTo(map);

L.mapbox.accessToken = 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA';
var styleLayer = L.mapbox.styleLayer('mapbox://styles/emro/cj8oq9bxg8zfu2rs3uw1ot59l')
    .addTo(map);

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
// sizing evacuation and hospital icons
var TallMapIcon = L.Icon.extend({
    options: {
        iconSize:     [25,40],
        iconAnchor:   [10,10],
    }
});
// adding images for evacuations and hospitals
var evacuationIcon = new MapIcon({iconUrl: './assets/graphics/evacuation_icon.png?'});
var hospitalsIcon = new MapIcon({iconUrl: './assets/graphics/hospitalsEvacuated_icon.png?'});
var fireIcon = new TallMapIcon({iconUrl: './assets/graphics/fire_icon2.png?'});

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
    var html_str = "<b>"+d.Name+"</b><br><i>"+d.Address+"</i><br><br>"+d.Description;
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

  origins_data.forEach(function(d){
    var html_str = "<b>"+d.Fire+"</b><br><em>Started at "+d.TimeStarted+"</em><br><em>Burned <b>"+formatthousands(d.Acreage)+"</b> acres</em><br><em>Killed <b>"+d.Victims+"</b></em><br><br>"+d.Description;
    var tempmarker = L.marker([d.Lat, d.Lon], {icon: fireIcon}).addTo(map).bindPopup(html_str);
    markerArray.push(tempmarker);
  });
}

// load all the icons (evacuations, hospitals, wineries, deaths)
drawIcons();

var buttonSTR = "Oct. ";
// when we have a variable number of days, use this ---->
// var size = Object.keys(FireData).length;
// when we cut off the days, use this ---->
var size = 11;
var dateList = Object.keys(FireData);
dateList.sort();

var sortedFireData = [];
for (i = 0; i < size; i++) {
  var element = {};
  var k = dateList[i];
  element.key = k;
  element.json = FireData[k];
  sortedFireData.push(element);
}

for (var i=0; i<(size); i++){
  if (i == (size-1)) {
    // when we have a variable number of days, use this ---->
    // buttonSTR += "<div class='day"+i+" button clickbutton nowbutton active' id='day"+i+"button'>Today</div>";
    // when we cut off the days, use this ---->
    buttonSTR += "<div class='day"+i+" button clickbutton calendarbutton active' id='day"+i+"button'>"+dateList[i].split("-")[2]+"</div>";
  } else {
    buttonSTR += "<div class='day"+i+" button clickbutton calendarbutton active' id='day"+i+"button'>"+dateList[i].split("-")[2]+"</div>";
  }
}
document.getElementById("button-collection").innerHTML = buttonSTR;

//calendar style
// when we have a variable number of days, use this ---->
var daystyle = {"color": "#F2A500","fill-opacity": 0.4,"weight": 3};
var nowstyle = {"color": "#D94100","fill-opacity": 0.8,"weight": 3};
// when we cut off the days, use this ---->
var tempstyle;
var colorsList = ["#FFCC1A","#FFBF0D","#FFB200","#F2A500","#E59800","#FF8800","#F27B00","#FF6721","#F25A14","#E54D07","#CC3400"]//"#D94100",

// adding a layer for every day
var layers = [];
var layerstoggle = [];
for (var i=0; i<(size); i++){
  tempstyle = {"color": colorsList[i],"fill-opacity": 0.8,"weight": 3};
  if (i == (size-1)){
    // when we have a variable number of days, use this ---->
    // layers[i] = L.geoJSON(JSON.parse(sortedFireData[i]["json"]),{style: nowstyle}).addTo(map);
    // when we cut off the days, use this ---->
    layers[i] = L.geoJSON(JSON.parse(sortedFireData[i]["json"]),{style: tempstyle}).addTo(map);
  } else {
    // when we have a variable number of days, use this ---->
    // layers[i] = L.geoJSON(JSON.parse(sortedFireData[i]["json"]),{style: daystyle}).addTo(map);
    // when we cut off the days, use this ---->
    layers[i] = L.geoJSON(JSON.parse(sortedFireData[i]["json"]),{style: tempstyle}).addTo(map);
  }
  layerstoggle.push(1);
}

// writing layers onto map for each day
var td;
for (var t = 0; t < size; t++){
  td = document.getElementById("day"+t+"button");
  if (typeof window.addEventListener === 'function'){
    (function (_td) {
      td.addEventListener('click', function(){
        var IDX = _td.classList[0].split("day")[1];
        if (layerstoggle[IDX] == 1) {
          map.removeLayer(layers[IDX]);
          layerstoggle[IDX] = 0;
          _td.classList.remove("active");
        } else {
          if (IDX == (size-1)){
            // when we have a variable number of days, use this ---->
            // layers[IDX] = L.geoJSON(JSON.parse(sortedFireData[IDX]["json"]),{style: nowstyle}).addTo(map);
            // when we cut off the days, use this ---->
            tempstyle = {"color": colorsList[IDX],"fill-opacity": 0.8,"weight": 3};
            layers[IDX] = L.geoJSON(JSON.parse(sortedFireData[IDX]["json"]),{style: tempstyle}).addTo(map);
          } else {
            // when we have a variable number of days, use this ---->
            // layers[IDX] = L.geoJSON(JSON.parse(sortedFireData[IDX]["json"]),{style: daystyle}).addTo(map);
            // when we cut off the days, use this ---->
            tempstyle = {"color": colorsList[IDX],"fill-opacity": 0.8,"weight": 3};
            layers[IDX] = L.geoJSON(JSON.parse(sortedFireData[IDX]["json"]),{style: tempstyle}).addTo(map);
          }
          layerstoggle[IDX] = 1;
          _td.classList.add("active");
        }
      });
    })(td);
  };
}

// these are variables for if we are showing the icons and the airquality layers
var pins_toggle = 1, pollution_toggle = 0;
var pollutionLayer, contourLayer;

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

      var airSTR = text.substring(4,6)+"/"+text.substring(6,8)+"/"+text.substring(0,4)+" "+text.substring(8,10)+":00 UTC";
      var date = new Date(airSTR);
      var PDTdate = date.toString();
      console.log(PDTdate);
      var eAIR = formatDate(date,PDTdate.split(" ")[1]);

      // fill in when data was last updated
      if (document.getElementById("airDate")) {
        document.getElementById("airDate").innerHTML = "Air quality data updated on " + eAIR;
      }
      if (document.getElementById("airDatemobile")) {
        document.getElementById("airDatemobile").innerHTML = "Air quality data updated on " + eAIR;
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

    var d = new Date(text);
    var e = formatDate(d,text.split(" ")[2]);

    if (document.getElementById("updateID")) {
      document.getElementById("updateID").innerHTML = e;
    }
    if (document.getElementById("updateIDmobile")) {
      document.getElementById("updateIDmobile").innerHTML = e;
    }
  });

  map_timer = setInterval(function() {

    console.log("at update interval");

    drawMap(fire_data);
    d3.text('http://extras.sfgate.com/editorial/wildfires/noaatime.txt', function(text) {

      var d = new Date(text);
      var e = formatDate(d,text.split(" ")[2]);

      if (document.getElementById("updateID")) {
        document.getElementById("updateID").innerHTML = e;
      }
      if (document.getElementById("updateIDmobile")) {
        document.getElementById("updateIDmobile").innerHTML = e;
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
