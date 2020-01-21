require("./lib/social"); //Do not delete
require("./lib/leaflet-mapbox-gl");
var d3 = require("d3");

var timeTimeout = 1;

// setting parameters for the center of the map and initial zoom level
var zoom_deg = 9;
var max_zoom_deg = 16;
var min_zoom_deg = 4;

var numRestaurants = restaurant_info.length;
console.log(numRestaurants);

// function to find minimum
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

if (screen.width <= 480) {

  console.log("mobile");

  var sf_lat = 37.57;
  var sf_long = -122.162503;

  var lon_offset = 0;
  var lat_offset = 0.4;
  var start_top = 500;

} else if (screen.width <= 768) {

  console.log("tablet");

  var sf_lat = 37.67064;
  var sf_long = -122.562503;

  var lon_offset = 0;
  var lat_offset = 0.4;
  var start_top = 500;

} else {

  console.log("desktop");

  var sf_lat = 37.67064;
  var sf_long = -122.962503;

  var lon_offset = 0.4;
  var lat_offset = 0;
  var start_top = 200;
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

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	minZoom: 0,
	maxZoom: 18,
}).addTo(map);

// var gl = L.mapboxGL({
//     accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
//     style: 'mapbox://styles/emro/cj8lviggc6b302rqjyezdqc2m'
// }).addTo(map);

var attribution = L.control.attribution();
attribution.setPrefix('');
attribution.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>');
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
    console.log("ERROR");
    d.LatLng = new L.LatLng(sf_lat,sf_long);
  }
});

capsule_info.forEach(function(d,idx){
  d.Key = d.Restaurant.toLowerCase().replace(/ /g,'').replace(/[&’-]/g,'').replace(/\./g,'').replace(new RegExp(/[èéêë]/g),"e");
});

var svg = d3.select("#map-leaflet").select("svg"),
g = svg.append("g");

// show tooltip
var tooltip = d3.select("div.tooltip-map");

var feature, images;

// draw map with dots on it
var drawMap = function() {

  console.log("re-drawing the map");

	d3.select("svg").selectAll("circle").remove();
	var svg = d3.select("#map-leaflet").select("svg"),
	g = svg.append("g");

  images = g.selectAll("circle")
    .data(restaurant_info)
    .enter()
    .filter(function(d){ return d.New === true; })
    .append("image")
    .attr("xlink:href","../assets/manychinas_star.png")
    .attr("height","40px")
    .attr("width","40px")
    .attr("x", "-20")
    .attr("y", "-20")
    .attr("id",function(d) {
      return d.Restaurant.toLowerCase().replace(/ /g,'').replace("'",'').replace(/[&’-]/g,'').replace(/\./g,'').replace(new RegExp(/[èéêë]/g),"e");
    })
    .attr("class",function(d) {
      return "dot "+d.Restaurant.toLowerCase().replace(/ /g,'').replace("'",'').replace(/[&’-]/g,'').replace(/\./g,'').replace(new RegExp(/[èéêë]/g),"e");
    })
    .style("opacity", function(d) {
      return 0.9;
    })
    .style("fill", function(d) {
      return "#F4E1A1";
    })
    .style("stroke","#696969")
    .attr("r", 10)
    .on("click",function(d){

      d.Key = d.Key.replace(/\./g,'');
      if (screen.width <= 480) {
        d3.selectAll(".restaurant-element").classed("active",false);
        $("#REST"+d.Key).addClass("active");
        $('html, body').animate({scrollTop: $("#map-leaflet").offset().top}, 200);
      } else {
        $(".restaurant-element").removeClass("highlighted");
        $("#REST"+d.Key).addClass("highlighted");
        $('html, body').animate({scrollTop: $("#REST"+d.Key).offset().top - 40}, 200);
      }

      // un-highlight all dots
      d3.selectAll(".dot").attr("r",10);
      d3.selectAll(".dot").style("fill","#F4E1A1");

      $("#see-all").removeClass("selected");
      $(".how-many-restaurants").css("display","none");
      $(".button-china").value = "all";
      $(".button-china").removeClass("selected");

      // highlight clicked-on dot
      //d3.select(this).transition(100).attr("r",20);
      d3.select(this).style("fill","#7BB7D4");

    })

  // adding circles to the map
  feature = g.selectAll("circle")
    .data(restaurant_info)
    .enter()
    .filter(function(d){ return d.New !== true; })
    .append("circle")
    .filter(function(d){ //console.log(d); 
      return true; 
    })
    .attr("id",function(d) {
      return d.Restaurant.toLowerCase().replace(/ /g,'').replace("'",'').replace(/[&’-]/g,'').replace(new RegExp(/[èéêë]/g),"e");
    })
    .attr("class",function(d) {
      return "dot "+d.Restaurant.toLowerCase().replace(/ /g,'').replace("'",'').replace(/[&’-]/g,'').replace(new RegExp(/[èéêë]/g),"e");
    })
    .style("opacity", function(d) {
      return 0.9;
    })
    .style("fill", function(d) {
      return "#F4E1A1";
    })
    .style("stroke","#696969")
    .attr("r", 10)
    .on("click",function(d){

      if (screen.width <= 480) {
        d3.selectAll(".restaurant-element").classed("active",false);
        $("#REST"+d.Key).addClass("active");
        $('html, body').animate({scrollTop: $("#map-leaflet").offset().top}, 200);
      } else {
        $(".restaurant-element").removeClass("highlighted");
        $("#REST"+d.Key).addClass("highlighted");
        $('html, body').animate({scrollTop: $("#REST"+d.Key).offset().top - 40}, 200);
      }

      // un-highlight all dots
      d3.selectAll(".dot").attr("r",10);
      d3.selectAll(".dot").style("fill","#F4E1A1");

      $("#see-all").removeClass("selected");
      $(".how-many-restaurants").css("display","none");
      $(".button-china").value = "all";
      $(".button-china").removeClass("selected");

      // highlight clicked-on dot
      //d3.select(this).transition(100).attr("r",20);
      d3.select(this).style("fill","#7BB7D4");

    })

  function update() {
    feature.attr("transform",
    function(d) {
      return "translate("+
        map.latLngToLayerPoint(d.LatLng).x +","+
        map.latLngToLayerPoint(d.LatLng).y +")";
      }
    )
    images.attr("transform",
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

  var filter = $(this).val().toLowerCase().replace(/ /g,'').replace(/'/g,'').replace(new RegExp(/[èéêë]/g),"e").replace('&','');
  var class_match = 0;
  count = 0;

  $(".how-many-restaurants").css("display","block");
  $("#see-all").removeClass("selected");

  $(".restaurant-element").removeClass("highlighted");
  d3.selectAll(".dot").style("fill","#F4E1A1");

  var button_list = document.getElementsByClassName("button");
  for (var i=0; i<button_list.length; i++) {
    button_list[i].classList.remove("selected");
  };

  selCuisine.selectedIndex = 0;

  $(".restaurant-element").filter(function() {

    var classes = this.className.split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();
      if ( current_class.match(filter)) {
        class_match = class_match + 1;
      }
    }
    if (class_match > 0) {
      $(this).addClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",0.9);
      // LOL we don't need this anyway
      //d3.select("#"+this.id.split("REST")[1]).attr("r",10);
      $("#"+this.id.split("REST")[1]).removeClass("hide");
      count+=1;
    } else {
      $(this).removeClass("active");
      $("#"+this.id.split("REST")[1]).addClass("hide");
    }
    class_match = 0;

  });

  if (count < numRestaurants){
    if (count == 1){
      document.getElementById("count-how-many").innerHTML = "is 1 result";
    } else {
      document.getElementById("count-how-many").innerHTML = "are "+ count+" results";
    }
  } else {
    $(".how-many-restaurants").css("display","none");
  }

});

selCuisine.addEventListener("change",function(event){

  $(".restaurant-element").removeClass("highlighted");
  document.getElementById('searchmap').value = "";
  d3.selectAll(".dot").style("fill","#F4E1A1");
  $(".dot").removeClass("hide");

  if (event.target.value != "all") {
    $("#see-all").removeClass("selected");
    selCuisine.classList.add("active");
  } else {
    selCuisine.classList.remove("active");
  }
  check_filters();
});

document.getElementById("see-all").addEventListener("click",function(){

  $(".restaurant-element").removeClass("highlighted");
  $(".dot").removeClass("hide");

  $(".button-china").value = "all";
  $(".button-china").removeClass("selected");
  $("#see-all").addClass("selected");

  document.getElementById('searchmap').value = "";
  selCuisine.selectedIndex = 0;
  check_filters();

  $(".how-many-restaurants").css("display","none");
  d3.selectAll(".dot").style("fill","#F4E1A1");
  d3.selectAll(".dot").attr("r",10);

  if (screen.width <= 480){
    $('.restaurant-container').animate({scrollTop: 0}, "fast");
  }
});

// function to assess all the filters when user picks a new one ---------------------------------------

var cuisine_flag = 1, north_flag = 1, south_flag = 1, east_flag = 1, west_flag = 1, taiwan_flag = 1, flag_min = 1;

function check_filters() {

  $(".how-many-restaurants").css("display","block");

  count = 0;

  $(".restaurant-element").filter(function() {

    // check all the classes for the restaurant
    var classes = this.className.toLowerCase().split(" ");

    // check cuisine
    if (selCuisine.value != "all"){
      cuisine_flag = (classes.indexOf(selCuisine.value.toLowerCase())>0);
    } else {
      cuisine_flag = 1;
    }

    // see if the restaurant satisfies all conditions set by user
    flag_min = [cuisine_flag, north_flag, south_flag, west_flag, east_flag, taiwan_flag].min();

    // show it if yes
    if (flag_min == 1){
      $(this).addClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",0.9);
      //d3.select("#"+this.id.split("REST")[1]).attr("r",10);
      $("#"+this.id.split("REST")[1]).removeClass("hide");
      count += 1;
    } else {
      $(this).removeClass("active");
      $("#"+this.id.split("REST")[1]).addClass("hide");
    }

  });

  console.log("COUNT IS");
  console.log(count);

  if (count == 1){
    document.getElementById("count-how-many").innerHTML = "is 1 result";
  } else {
    document.getElementById("count-how-many").innerHTML = "are "+ count+" results";
  }

};

// hide the about the data box
document.getElementById("close-capsules-box").addEventListener("click",function() {
  document.getElementById("overlay-capsules").classList.remove("active");
  $('body').removeClass('noscroll');
  $(".capsule").removeClass("showme");
});

// show the about the data box
var capsules_buttons = document.getElementsByClassName("capsule-link");
for (var tidx=0; tidx < capsules_buttons.length; tidx++){
  capsules_buttons[tidx].addEventListener("click",function(t) {

    var capsuleID = t.target.id.split("capsule")[1];

    document.getElementById("capsules-box").classList.add("active");
    document.getElementById("overlay-capsules").classList.add("active");
    $('body').addClass('noscroll');
    $("#capsule"+capsuleID).addClass("showme");

    // un-highlight all dots
    d3.selectAll(".dot").attr("r",10);
    d3.selectAll(".dot").style("fill","#F4E1A1");
    // highlight clicked-on dot
    d3.select("#"+capsuleID).transition(100).attr("r",20);
    d3.select("#"+capsuleID).style("fill","#7BB7D4");

    $(".restaurant-element").removeClass("highlighted");

    if (screen.width <= 480){
      d3.selectAll(".restaurant-element").classed("active",false);
      $("#REST"+capsuleID).addClass("active");
      $('html, body').animate({scrollTop: $("#map-leaflet").offset().top}, 200);
      $("#see-all").removeClass("selected");
    } else {
      $("#REST"+capsuleID).addClass("highlighted");
      $('html, body').animate({scrollTop: $("#REST"+capsuleID).offset().top - 40}, 600);
    }

  });
};

// resize Flickities
$(".capsule-slideshow").click(function(event) {
  var carousel = document.querySelector('.'+event.target.id);
  var flkty = new Flickity( carousel );
  flkty.resize();
});

// see if the reader is loading a specific restaurant
// $(document).ready(function(){
window.addEventListener("load", function(event) {

  if(window.location.hash) {

    $("#see-all").removeClass("selected");

    var dotID = window.location.hash.split("#REST")[1];

    document.getElementById("capsules-box").classList.add("active");
    document.getElementById("overlay-capsules").classList.add("active");
    $('body').addClass('noscroll');
    $("#capsule"+dotID).addClass("showme");

    // un-highlight all dots
    d3.selectAll(".dot").attr("r",10);
    d3.selectAll(".dot").style("fill","#F4E1A1");
    // highlight clicked-on dot
    d3.select("#"+dotID).transition(100).attr("r",20);
    d3.select("#"+dotID).style("fill","#7BB7D4");

    setTimeout(function(){
      var carousel = document.querySelector('.capsule'+dotID);
      var flkty = new Flickity( carousel );
      flkty.resize();
    },100);

    if (screen.width <= 480){
      d3.selectAll(".restaurant-element").classed("active",false);
      $("#REST"+dotID).addClass("active");
      $('html, body').animate({scrollTop: $("#map-leaflet").offset().top}, 200);
    } else {
      $("#REST"+dotID).addClass("highlighted");
      $('html, body').animate({scrollTop: $("#REST"+dotID).offset().top - 40}, 600);
    }

  }

});
