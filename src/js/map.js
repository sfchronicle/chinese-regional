require("./lib/social"); //Do not delete
require("./lib/leaflet-mapbox-gl");
var d3 = require("d3");

var timeTimeout = 1;

// setting parameters for the center of the map and initial zoom level
var zoom_deg = 9;
var max_zoom_deg = 16;
var min_zoom_deg = 4;

// function to find minimum
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

if (screen.width <= 480) {

  var sf_lat_landing = 37.867064;
  var sf_lat = 37.667064;
  var sf_long = -122.162503;

  var lon_offset = 0;
  var lat_offset = 0.4;
  var start_top = 500;

} else {

  var sf_lat = 37.667064;
  var sf_long = -122.662503;

  var lon_offset = 0.4;
  var lat_offset = 0;
  var start_top = 200;
}

function color_function(region) {
  if (region == "Northern") {
    return "#A8B5A5";//#FFCC32";
  } else if (region == "Eastern") {
    return "#E68173";
  } else if (region == "Taiwanese") {
    return "#7BC2CD";//"#EB8F6A";
  } else if (region == "Western") {
    return "#C9CDAB";
  } else if (region == "Southern") {
    return "#E4C268";
  }
}

// tooltip information
function tooltip_function (d) {
  var html_str = "<div class='bold'>"+d.Restaurant+"</div><div class='address'>"+d.Address+"</div><div>Region in China: "+d.ChineseRegion+"</div><div>Cuisine: "+d.Cuisine+"</div>";
  return html_str;
}

// initialize map with center position and zoom levels
if (screen.width <= 480){
  var map = L.map("map-leaflet", {
    minZoom: min_zoom_deg,
    maxZoom: max_zoom_deg,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false
  }).setView([sf_lat_landing,sf_long], zoom_deg);
} else {
  var map = L.map("map-leaflet", {
    minZoom: min_zoom_deg,
    maxZoom: max_zoom_deg,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false
  }).setView([sf_lat,sf_long], zoom_deg);
}

// initializing the svg layer
L.svg().addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/emro/cjbib4t5e089k2sm7j3xygp50/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA', {
	minZoom: 0,
	maxZoom: 18,
}).addTo(map);

var attribution = L.control.attribution();
attribution.setPrefix('');
attribution.addAttribution('Map data: <a href="http://openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank" class="mapbox-improve-map">Improve this map</a>');
attribution.addTo(map);

// zoom control is on top right
L.control.zoom({
     position:'bottomright'
}).addTo(map);

map.doubleClickZoom.enable();

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
      return d.Restaurant.toLowerCase().replace(/ /g,'').replace(/[&’-]/g,'').replace(new RegExp(/[èéêë]/g),"e");
    })
    .attr("class",function(d) {
      return "dot";
    })
    .style("opacity", function(d) {
      return 0.9;
    })
    .style("fill", function(d) {
      return color_function(d.ChineseRegion);
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      return 10;
    })
    .on('mouseover', function(d) {
      console.log("click");
      var html_str = tooltip_function(d);
      tooltip.html(html_str);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",(d3.event.pageY-10)+"px")
          .style("left",40+"px");
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
    })
    .on("click",function(d){
        console.log("real click");
        // if($("#panel"+d.Restaurant.toLowerCase().replace(/ /g,'').replace(/[&’-]/g,''))){
        //   $('html, body').animate({
        //       scrollTop: $("#panel"+d.Restaurant.toLowerCase().replace(/ /g,'').replace(/[&’-]/g,'')).offset().top-50
        //   }, 2000);
        // } else {
        //   console.log("NO CAPSULE YET");
        // }
    })


  function update() {
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

}

drawMap();
var count;

var selCuisine = document.getElementById('select-cuisine');

// search bar code -------------------------------------------------------------
// searchbar code
$("#searchmap").bind("input propertychange", function () {
  var filter = $(this).val().toLowerCase().replace(/ /g,'').replace(/'/g,'').replace(new RegExp(/[èéêë]/g),"e");
  var class_match = 0;
  count = 0;

  var button_list = document.getElementsByClassName("button");
  for (var i=0; i<button_list.length; i++) {
    button_list[i].classList.remove("selected");
  };
  // if (filter == "") {
  //   document.getElementById("showall").classList.add("selected");
  // }

  selCuisine.selectedIndex = 0;

  $(".restaurant-element").filter(function() {
    console.log(this);

    var classes = this.className.split(" ");
    console.log(classes);
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();
      if ( current_class.match(filter)) {
        class_match = class_match + 1;
      }
    }
    if (class_match > 0) {
      $(this).addClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",1);
      count+=1;
    } else {
      $(this).removeClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",0);
    }
    class_match = 0;

  });
});

selCuisine.addEventListener("change",function(event){
  if (event.target.value != "all") {
    selCuisine.classList.add("active");
  } else {
    selCuisine.classList.remove("active");
  }
  check_filters();
});

var north_button = document.getElementById('button-region-north');
var south_button = document.getElementById('button-region-south');
var west_button = document.getElementById('button-region-west');
var east_button = document.getElementById('button-region-east');
var taiwan_button = document.getElementById('button-region-taiwan');

[north_button, south_button, west_button, east_button, taiwan_button].forEach(function (item, idx) {
    item.addEventListener('click', function () {
      console.log(this);
      $(".button-china").value = "all";
      $(".button-china").removeClass("selected");
      $(this).addClass("selected");
      check_filters();
      this.value = "chosen";
      console.log(this.value);
    });
});

  // display text for empty search results
  // if (count > 0) {
  //   document.getElementById('search-noresults').classList.add("hide");
  //   document.getElementById('count-results').classList.remove("hide");
  //   document.getElementById('count-results').innerHTML = count+" result(s)";
  // } else {
  //   document.getElementById('search-noresults').classList.remove("hide");
  //   document.getElementById('count-results').classList.add("hide");
  // }
  // if (count == 100) {
  //   document.getElementById('count-results').classList.add("hide");
  // }

// function to assess all the filters when user picks a new one ---------------------------------------

var cuisine_flag = 1, north_flag = 1, south_flag = 1, east_flag = 1, west_flag = 1, taiwan_flag = 1, flag_min = 1;

function check_filters() {

  // document.getElementById("restaurants-wrap").classList.remove("hide");
  // document.getElementById("intro-container").classList.add("hide");
  // document.getElementById("about").classList.remove("selected");
  //
  // document.getElementById('searchrestaurants').value = "";
  //
  count = 0;
  // showall_button.classList.remove("selected");
  // mylist_starred_button.classList.remove("selected");
  // mylist_checked_button.classList.remove("selected");
  //
  // document.getElementById('no-saved-restaurants').classList.add("hide");
  // document.getElementById('no-checked-restaurants').classList.add("hide");

  $(".restaurant-element").filter(function() {

    // check all the classes for the restaurant
    var classes = this.className.toLowerCase().split(" ");

    // check cuisine
    if (selCuisine.value != "all"){
      cuisine_flag = (classes.indexOf(selCuisine.value)>0)
    } else {
      cuisine_flag = 1;
    }

    // check for new restaurants
    if (north_button.className.indexOf("selected")>0){
      north_flag = (classes.indexOf("north")>0);
    } else {
      north_flag = 1;
    }

    if (south_button.className.indexOf("selected")>0){
      south_flag = (classes.indexOf("south")>0);
    } else {
      south_flag = 1;
    }

    if (west_button.className.indexOf("selected")>0){
      west_flag = (classes.indexOf("west")>0);
    } else {
      west_flag = 1;
    }

    if (east_button.className.indexOf("selected")>0){
      east_flag = (classes.indexOf("east")>0);
    } else {
      east_flag = 1;
    }

    if (taiwan_button.className.indexOf("selected")>0){
      taiwan_flag = (classes.indexOf("taiwan")>0);
    } else {
      taiwan_flag = 1;
    }

    // see if the restaurant satisfies all conditions set by user
    flag_min = [cuisine_flag, north_flag, south_flag, west_flag, east_flag, taiwan_flag].min();

    // show it if yes
    if (flag_min == 1){
      $(this).addClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",1);
      console.log(this.id.split("restaurant")[1]);
      count += 1;
    } else {
      $(this).removeClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",0);
    }

  });

  console.log("COUNT IS");
  console.log(count);
  //
  // // display text for empty search results
  // if (count > 0) {
  //   document.getElementById('search-noresults').classList.add("hide");
  //   document.getElementById('count-results').classList.remove("hide");
  //   document.getElementById('count-results').innerHTML = count+" result(s)";
  // } else {
  //   document.getElementById('search-noresults').classList.remove("hide");
  //   document.getElementById('count-results').classList.add("hide");
  // }
  // if (count == 100) {
  //   showall_button.classList.add("selected");
  //   document.getElementById('count-results').classList.add("hide");
  // }

};





// var currentrestaurant, prevrestaurant = "", currentLat, currentLon;
// var panels = document.getElementsByClassName("panel");
// var dots = document.getElementsByClassName("dot");
// console.log(dots);
//
// var offset_top = $(".panel-container").offset().top;
//
// // set up scrolling timeout
// var scrollTimer = null;
// $(window).scroll(function () {
//   // handleScroll();
//   if (scrollTimer) {
//       clearTimeout(scrollTimer);   // clear any previous pending timer
//   }
//   scrollTimer = setTimeout(handleScroll, timeTimeout);   // set new timer
//   tooltip.style("visibility", "hidden");
// });
//
// // for (var dotIDX=0; dotIDX<dots.length; dotIDX++){
// //   dots[dotIDX].addEventListener("click", function(e) {
// //     console.log("real click");
// //     console.log(dots[dotIDX].id);
// //     $('html, body').animate({
// //         scrollTop: $("#panel"+dots[dotIDX].id).offset().top
// //     }, 2000);
// //   });
// // };
//
// // function for updating with scroll
// function handleScroll() {
//
//     scrollTimer = null;
//
//     // figure out where the top of the page is, and also the top and beginning of the map content
//     var pos = document.body.scrollTop || document.documentElement.scrollTop;
//     // var pos = $(this).scrollTop();
//     var pos_map_top = $('#bottom-of-top').offset().top-start_top;
//     var pos_map_bottom = $('#top-of-bottom').offset().top;
//
//     // show the landing of the page if the reader is at the top
//     if (pos < pos_map_top){
//
//       map.setView(new L.LatLng(sf_lat,sf_long),zoom_deg);
//       // map.panTo(new L.LatLng(sf_lat, sf_long));
//
//       prevrestaurant = "";
//       $(".dot").css("opacity",0.9);
//
//     // show the appropriate dots if the reader is in the middle of the page
//     } else if (pos < pos_map_bottom){
//
//       currentrestaurant = "";
//       for (var panelIDX = 0; panelIDX < panels.length; panelIDX++){//; panelIDX++){
//         if (panelIDX == 0) {
//           var pos_map = $('#'+panels[panelIDX].id).offset().top - pos - start_top;//offset_top;
//         } else {
//           var pos_map = $('#'+panels[panelIDX].id).offset().top - pos - start_top*1.5;
//         }
//
//         if (pos_map < 0) {
//           currentrestaurant = panels[panelIDX].id;
//         }
//
//         restaurant_info.forEach(function(map,mapIDX){
//           if (currentrestaurant == "panel"+map.Restaurant.toLowerCase().replace(/ /g,'')) {
//             currentLat = +map.Lat;
//             currentLon = +map.Lng;
//           }
//         });
//       };
//       if (currentrestaurant != prevrestaurant){
//         console.log("panning");
//         map.setView(new L.LatLng(currentLat-lat_offset,currentLon-lon_offset),zoom_deg);
//         $(".dot").css("opacity",0.2);
//         console.log(currentrestaurant.substring(5));
//         $("#"+currentrestaurant.substring(5)).css("opacity",1);
//       }
//       prevrestaurant = currentrestaurant;
//     }
//
// }
