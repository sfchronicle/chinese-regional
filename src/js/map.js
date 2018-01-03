require("./lib/social"); //Do not delete
require("./lib/leaflet-mapbox-gl");
var d3 = require("d3");

var timeTimeout = 1;

// setting parameters for the center of the map and initial zoom level
var sf_lat = 37.667064;
var sf_long = -122.662503;
var zoom_deg = 9;
var max_zoom_deg = 16;
var min_zoom_deg = 4;
var start_top = 200;

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

// var gl = L.mapboxGL({
//     accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
//     style: 'mapbox://styles/emro/cjbib4t5e089k2sm7j3xygp50'
// }).addTo(map);

// var attribution = L.control.attribution();
// attribution.setPrefix('');
// attribution.addAttribution('Map data: <a href="http://openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank" class="mapbox-improve-map">Improve this map</a>');
// attribution.addTo(map);

// var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
// 	maxZoom: 18,
// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 1,
// 	maxZoom: 16,
// 	ext: 'png'
// }).addTo(map);

var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
}).addTo(map);

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

var svg = d3.select("#map-leaflet").select("svg"),
g = svg.append("g");

// show tooltip
var tooltip = d3.select("div.tooltip-map");

var feature;

// draw map with dots on it
var drawMap = function(currentrestaurant,data) {

  console.log("re-drawing the map");

	d3.select("svg").selectAll("circle").remove();
	var svg = d3.select("#map-leaflet").select("svg"),
	g = svg.append("g");

  // transition time
  // var duration = 700;

  // adding circles to the map
  feature = g.selectAll("circle")
    .data(restaurant_info)
    .enter().append("circle")
    .attr("id",function(d) {
      return d.Restaurant.toLowerCase().replace(/ /g,'');
    })
    .attr("class",function(d) {
      return "dot";
    })
    .style("opacity", function(d) {
      // if (currentrestaurant){
      //   if (d.Restaurant.toLowerCase().replace(/ /g,'').replace(new RegExp(/[èéêë]/g),"e") == currentrestaurant){
      //     return 1;
      //   } else {
      //     return 0.3;
      //   }
      // } else {
        return 0.9;
      // }
    })
    .style("fill", function(d) {
      return color_function(d.ChineseRegion);
      // return "#c11a1a";//"#E32B2B";//"#3C87CF";
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      return 10;
      // if (screen.width <= 480) {
      //   return d.Size*6;
      // } else {
      //   return d.Size*10;
      // }
    })
    .on('mouseover', function(d) {
      var html_str = tooltip_function(d);
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
          .style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX-100)+"px");
      }
    })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    });


  function update() {
    console.log("panning the map");
    feature.attr("transform",
    function(d) {
      return "translate("+
        map.latLngToLayerPoint(d.LatLng).x +","+
        map.latLngToLayerPoint(d.LatLng).y +")";
      }
    )
  }

  map.on("zoom", update);
  update();

  // if (currentrestaurant){
  //   if (screen.width <= 480){
  //     map.panTo(data.LatLng);
  //   } else {
  //     map.panTo(new L.LatLng(data.Lat-0.3, data.Lng));
  //   }
  // } else {
  //   map.panTo(new L.LatLng(sf_lat, sf_long));
  //   // map.setView(new L.LatLng(sf_lat, sf_long), map.getZoom(), {"animation": true});
  // }

}

drawMap();
var currentrestaurant, prevrestaurant = "", currentLat, currentLon;
var panels = document.getElementsByClassName("panel");

var offset_top = $(".panel-container").offset().top;
console.log("offset_top = ");
console.log($(".panel-container").offset().top);

// set up scrolling timeout
var scrollTimer = null;
$(window).scroll(function () {
  // handleScroll();
  if (scrollTimer) {
      clearTimeout(scrollTimer);   // clear any previous pending timer
  }
  scrollTimer = setTimeout(handleScroll, timeTimeout);   // set new timer
});

// function for updating with scroll
function handleScroll() {

    scrollTimer = null;

    // figure out where the top of the page is, and also the top and beginning of the map content
    var pos = document.body.scrollTop || document.documentElement.scrollTop;
    // var pos = $(this).scrollTop();
    var pos_map_top = $('#bottom-of-top').offset().top-start_top;
    var pos_map_bottom = $('#top-of-bottom').offset().top;

    // show the landing of the page if the reader is at the top
    if (pos < pos_map_top){

      // drawMap();
      // if (feature) {
        // map.setView(new L.LatLng(sf_lat, sf_long),zoom_deg);
        // update(feature);
      // } else {
        map.panTo(new L.LatLng(sf_lat, sf_long));
      // }

      prevrestaurant = "";
      $(".dot").css("opacity",0.9);
      console.log("we are at the top");

    // show the appropriate dots if the reader is in the middle of the page
    } else if (pos < pos_map_bottom){

      console.log("we are in the middle");

      currentrestaurant = "";
      // var panels = document.getElementsByClassName("panel");
      for (var panelIDX = 0; panelIDX < panels.length; panelIDX++){//; panelIDX++){
        // console.log($('#'+panels[panelIDX].id));
        if (panelIDX == 0) {
          var pos_map = $('#'+panels[panelIDX].id).offset().top - offset_top - pos - start_top;//offset_top;
        } else {
          var pos_map = $('#'+panels[panelIDX].id).offset().top - offset_top - pos;
        }

        if (pos_map < 0) {
          currentrestaurant = panels[panelIDX].id;
        }

        // if (currentrestaurant){
          restaurant_info.forEach(function(map,mapIDX){
            if (currentrestaurant == "panel"+map.Restaurant.toLowerCase().replace(/ /g,'')) {
              currentLat = +map.Lat;
              currentLon = +map.Lng;
            }
          });
        // }
      };
      if (currentrestaurant != prevrestaurant){
        // if (feature) {
          // map.setView(new L.LatLng(sf_lat, sf_long),zoom_deg);
          // update(feature);
        // } else {
        console.log("panning");
          // map.panTo(new L.LatLng(currentLat, currentLon));
          map.setView(new L.LatLng(currentLat,currentLon),zoom_deg);
        // }
        $(".dot").css("opacity",0.3);
        console.log(currentrestaurant.substring(5));
        $("#"+currentrestaurant.substring(5)).css("opacity",1);
      }
      prevrestaurant = currentrestaurant;
    }

}
