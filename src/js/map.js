require("./lib/social"); //Do not delete
require("./lib/leaflet-mapbox-gl");
var d3 = require("d3");

console.log(d3);

var timeTimeout = 100;

// setting parameters for the center of the map and initial zoom level
// if (screen.width <= 480) {
//   var sf_lat = 34.2;
//   var sf_long = -119.0;
//   var zoom_deg = 8;
//   var max_zoom_deg = 16;
//   var min_zoom_deg = 4;
//
//   var offset_top = 900;
//   var bottomOffset = 100;
// } else if (screen.width <= 800) {
//   var sf_lat = 34.2;
//   var sf_long = -119;
//   var zoom_deg = 9;
//   var max_zoom_deg = 16;
//   var min_zoom_deg = 4;
//
//   var offset_top = 900;
//   var bottomOffset = 100;
// } else if (screen.width <= 1400){
//   var sf_lat = 34.2;
//   var sf_long = -119.25;
//   var zoom_deg = 9;
//   var max_zoom_deg = 16;
//   var min_zoom_deg = 4;
//
//   var offset_top = 900;
//   var bottomOffset = 200;
// } else {

  var sf_lat = 37.667064;
  var sf_long = -122.662503;
  var zoom_deg = 9;
  var max_zoom_deg = 16;
  var min_zoom_deg = 4;

  var offset_top = 900;
  var bottomOffset = 200;
// }

function color_function(region) {
  if (region == "Northern") {
    return "#E6B319";//#FFCC32";
  } else if (region == "Eastern") {
    return "#2274A5";
  } else if (region == "Taiwanese") {
    return "#F25C00";//"#EB8F6A";
  } else if (region == "Western") {
    return "#45C16F";
  } else if (region == "Southern") {
    return "#C94EB2";
  }
}

// tooltip information
function tooltip_function (d) {
  var html_str = "<div class='bold'>"+d.Restaurant+"</div><div class='address'>"+d.Address+"</div><div>Region in China: "+d.ChineseRegion+"</div><div>Cuisine: "+d.Cuisine+"</div>";
  return html_str;
}

// initialize map with center position and zoom levels
var map = L.map("map-leaflet", {
  minZoom: min_zoom_deg,
  maxZoom: max_zoom_deg,
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
}).setView([sf_lat,sf_long], zoom_deg);

// initializing the svg layer
L.svg().addTo(map);

var gl = L.mapboxGL({
    accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
    style: 'mapbox://styles/emro/cjbib4t5e089k2sm7j3xygp50'
}).addTo(map);

var attribution = L.control.attribution();
attribution.setPrefix('');
attribution.addAttribution('Map data: <a href="http://openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank" class="mapbox-improve-map">Improve this map</a>');
attribution.addTo(map);

// zoom control is on top right
L.control.zoom({
     position:'bottomright'
}).addTo(map);

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

var purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

var yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

var blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

var grayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

// restaurant_info.forEach(function(d){
//   if (d.Lat){
//     var html_str = "<b>"+d.Restaurant+"</b><br><em>"+d.Address+"</em><br>Region in China: "+d.ChineseRegion+"<br>Cuisine: "+d.Cuisine;
//     if (d.ChineseRegion == "Northern"){
//       var tempmarker = L.marker([+d.Lat, +d.Lng], {icon: redIcon}).addTo(map).bindPopup(html_str);
//     } else if (d.ChineseRegion == "Eastern"){
//       var tempmarker = L.marker([+d.Lat, +d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
//     } else if (d.ChineseRegion == "Taiwanese"){
//       var tempmarker = L.marker([+d.Lat, +d.Lng], {icon: yellowIcon}).addTo(map).bindPopup(html_str);
//     } else if (d.ChineseRegion == "Western"){
//       var tempmarker = L.marker([+d.Lat, +d.Lng], {icon: blueIcon}).addTo(map).bindPopup(html_str);
//     } else if (d.ChineseRegion == "Southern"){
//       var tempmarker = L.marker([+d.Lat, +d.Lng], {icon: grayIcon}).addTo(map).bindPopup(html_str);
//     }
//   }
// });

// creating Lat/Lon objects that d3 is expecting
restaurant_info.forEach(function(d,idx) {
  if (d.Lat){
  	d.LatLng = new L.LatLng(+d.Lat,+d.Lng);
  } else {
    d.LatLng = new L.LatLng(sf_lat,sf_long);
  }
});

console.log(restaurant_info);

var svg = d3.select("#map-leaflet").select("svg"),
g = svg.append("g");

// show tooltip
var tooltip = d3.select("div.tooltip-map");

console.log(tooltip);

// draw map with dots on it
var drawMap = function() {

  console.log("re-drawing the map");

	d3.select("svg").selectAll("circle").remove();
	var svg = d3.select("#map-leaflet").select("svg"),
	g = svg.append("g");

  // transition time
  // var duration = 700;

  // adding circles to the map
  var feature = g.selectAll("circle")
    .data(restaurant_info)
    .enter().append("circle")
    // .attr("id",function(d) {
    //   return d.Location;
    // })
    .attr("class",function(d) {
      return "dot";
    })
    .style("opacity", function(d) {
      // if ((d.Count == current_event) || (current_event == 100)) {
        return 0.9;
      // } else {
      //   return 0.4;
      // }
    })
    .style("fill", function(d) {
      return color_function(d.ChineseRegion);
      // return "#c11a1a";//"#E32B2B";//"#3C87CF";
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      return 8;
      // if (screen.width <= 480) {
      //   return d.Size*6;
      // } else {
      //   return d.Size*10;
      // }
    })
    .on('mouseover', function(d) {
      var html_str = tooltip_function(d);
      console.log(html_str);
      tooltip.html(html_str);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",70+"px")
          .style("left",40+"px");
          // .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          // .style("left",10+"px");
      } else if (screen.width <= 1024) {
        console.log("mid");
        return tooltip
          .style("top", (d3.event.pageY)+"px")
          .style("left",(d3.event.pageX)+"px");
      } else {
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-100)+"px");
      }
    })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    });

  map.on("zoom", update);
  update();

  function update() {
    feature.attr("transform",
    function(d) {
      return "translate("+
        map.latLngToLayerPoint(d.LatLng).x +","+
        map.latLngToLayerPoint(d.LatLng).y +")";
      }
    )
  }

  // if (current_event != 101){
  //   if (screen.width >= 480) {
  //     map.panTo(new L.LatLng(dayData[dayData.length-1]["Lat"], dayData[dayData.length-1]["Lon"]-0.3));
  //   } else {
  //     map.panTo(new L.LatLng(dayData[dayData.length-1]["Lat"]-0.3, dayData[dayData.length-1]["Lon"]));
  //   }
  // } else {
  //   map.panTo(new L.LatLng(sf_lat, sf_long));
  //   // map.setView(new L.LatLng(sf_lat, sf_long), map.getZoom(), {"animation": true});
  // }

}

drawMap();

// // initialize map with all dots, faded out
// var dayData = protestData.filter(function(d) {
//     return d.Day <= 101
// });
// drawMap(dayData,101);
//
// // initial variable, which indicates that map is on landing on load
// var prevmapIDX = -1;

// set up scrolling timeout
var scrollTimer = null;
$(window).scroll(function () {
    if (scrollTimer) {
        clearTimeout(scrollTimer);   // clear any previous pending timer
    }
    scrollTimer = setTimeout(handleScroll, timeTimeout);   // set new timer
});

// function for updating with scroll
function handleScroll() {

    scrollTimer = null;

    // figure out where the top of the page is, and also the top and beginning of the map content
    var pos = $(this).scrollTop();
    var pos_map_top = $('#bottom-of-top').offset().top;
    var pos_map_bottom = $('#top-of-bottom').offset().top-bottomOffset;

    // show the landing of the page if the reader is at the top
    if (pos < pos_map_top){
      // var dayData = protestData.filter(function(d) {
      //     return d.Day <= 101
      // });
      // drawMap(dayData,101);

      var prevmapIDX = -1;

    // show the appropriate dots if the reader is in the middle of the page
    } else if (pos < pos_map_bottom){

      var currentIDX = -1;
      // protestData.forEach(function(map,mapIDX) {
      //   var pos_map = $('#mapevent'+mapIDX).offset().top-offset_top;
      //   if (pos > pos_map) {
      //     currentIDX = Math.max(mapIDX,currentIDX);
      //   }
      // });
      // console.log(currentIDX);
      // prevmapIDX = currentIDX;
      // var dayData = protestData.filter(function(d) {
      //     return d.Count <= currentIDX
      // });
      // drawMap(dayData,+currentIDX);

    // hide the day box if the reader is at the bottom of the page
    } else {
      // document.getElementById("day-box").classList.remove("show");
    }
}
