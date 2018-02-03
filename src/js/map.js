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

  var sf_lat_landing = 37.57;
  var sf_lat = 37.667064;
  var sf_long = -122.162503;

  var lon_offset = 0;
  var lat_offset = 0.4;
  var start_top = 500;

} else {

  var sf_lat = 37.67064;
  var sf_long = -122.962503;

  var lon_offset = 0.4;
  var lat_offset = 0;
  var start_top = 200;
}

function color_function(region) {
  return "#F4E1A1";
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

// L.tileLayer('https://api.mapbox.com/styles/v1/emro/cj8lviggc6b302rqjyezdqc2m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA', {
// 	minZoom: 0,
// 	maxZoom: 18,
// }).addTo(map);

var gl = L.mapboxGL({
    accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
    style: 'mapbox://styles/emro/cj8lviggc6b302rqjyezdqc2m'
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
      return "dot "+d.Restaurant.toLowerCase().replace(/ /g,'').replace(/[&’-]/g,'').replace(new RegExp(/[èéêë]/g),"e");
    })
    .style("opacity", function(d) {
      return 0.9;
    })
    .style("fill", function(d) {
      return color_function(d.ChineseRegion);
    })
    .style("stroke","#696969")
    .attr("r", 10)
    // .attr("cx",10)
    // .attr("cy",10)
    // .on('mouseover', function(d) {
    //   var html_str = tooltip_function(d);
    //   tooltip.html(html_str);
    //   // if (screen.width > 480){
    //   //   tooltip.style("visibility", "visible");
    //   // }
    // })
    // .on("mousemove", function() {
    //   if (screen.width <= 480) {
    //     return tooltip
    //       .style("top",(d3.event.pageY-20)+"px")
    //       .style("left",40+"px");
    //   } else if (screen.width <= 1024) {
    //     console.log("mid");
    //     return tooltip
    //       .style("top", (d3.event.pageY)+"px")
    //       .style("left",(d3.event.pageX)+"px");
    //   } else {
    //     return tooltip
    //       .style("top", (d3.event.pageY+20)+"px")
    //       .style("left",(d3.event.pageX-100)+"px");
    //   }
    // })
    // .on("mouseout", function(){
    //     return tooltip.style("visibility", "hidden");
    // })
    .on("click",function(d){
      if (d3.select(this).attr("r") != 20){
        d3.selectAll(".restaurant-element").classed("active",false);
        d3.selectAll(".dot").transition(0).attr("r",0);
        if (screen.width > 480){
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
          document.body.scrollTop = document.documentElement.scrollTop = document.getElementById('mobile-top').clientHeight;
        }
        $("#see-all").removeClass("selected");
        $(".how-many-restaurants").css("display","none");
        $(".button-china").value = "all";
        $(".button-china").removeClass("selected");
        document.getElementById('searchmap').value = "";
        // $('body, html').animate({scrollTop: 0});
        d3.select("#REST"+d.Restaurant.toLowerCase().replace(/ /g,'').replace(/[&’-]/g,'').replace(new RegExp(/[èéêë]/g),"e")).classed("active",true);
        d3.select(this).transition(100).attr("r",20);
      }
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
  $(".how-many-restaurants").css("display","block");
  $("#see-all").removeClass("selected");

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
      $("#"+this.id.split("REST")[1]).css("opacity",1);
      d3.select("#"+this.id.split("REST")[1]).attr("r",10);
      count+=1;
    } else {
      $(this).removeClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",0);
    }
    class_match = 0;

  });

  if (count < 35){
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
  document.getElementById('searchmap').value = "";
  if (event.target.value != "all") {
    $("#see-all").removeClass("selected");
    selCuisine.classList.add("active");
  } else {
    selCuisine.classList.remove("active");
  }
  check_filters();
});

// var north_button = document.getElementById('button-region-north');
// var south_button = document.getElementById('button-region-south');
// var west_button = document.getElementById('button-region-west');
// var east_button = document.getElementById('button-region-east');
// var taiwan_button = document.getElementById('button-region-taiwan');

// [north_button, south_button, west_button, east_button, taiwan_button].forEach(function (item, idx) {
//     item.addEventListener('click', function () {
//       document.getElementById('searchmap').value = "";
//       $("#see-all").removeClass("selected");
//       if (this.classList.contains("selected")){
//         $(".button-china").value = "all";
//         $(".button-china").removeClass("selected");
//         check_filters();
//         $(".how-many-restaurants").css("display","none");
//       } else {
//         $(".button-china").value = "all";
//         $(".button-china").removeClass("selected");
//         $(this).addClass("selected");
//         check_filters();
//         this.value = "chosen";
//       }
//     });
// });

document.getElementById("see-all").addEventListener("click",function(){
  $(".button-china").value = "all";
  $(".button-china").removeClass("selected");
  $("#see-all").addClass("selected");
  document.getElementById('searchmap').value = "";
  selCuisine.selectedIndex = 0;
  check_filters();
  $(".how-many-restaurants").css("display","none");
  d3.selectAll(".dot").transition().attr("r",10);
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

    // // check for new restaurants
    // if (north_button.className.indexOf("selected")>0){
    //   north_flag = (classes.indexOf("north")>0);
    // } else {
    //   north_flag = 1;
    // }
    //
    // if (south_button.className.indexOf("selected")>0){
    //   south_flag = (classes.indexOf("south")>0);
    // } else {
    //   south_flag = 1;
    // }
    //
    // if (west_button.className.indexOf("selected")>0){
    //   west_flag = (classes.indexOf("west")>0);
    // } else {
    //   west_flag = 1;
    // }
    //
    // if (east_button.className.indexOf("selected")>0){
    //   east_flag = (classes.indexOf("east")>0);
    // } else {
    //   east_flag = 1;
    // }
    //
    // if (taiwan_button.className.indexOf("selected")>0){
    //   taiwan_flag = (classes.indexOf("taiwan")>0);
    // } else {
    //   taiwan_flag = 1;
    // }

    // see if the restaurant satisfies all conditions set by user
    flag_min = [cuisine_flag, north_flag, south_flag, west_flag, east_flag, taiwan_flag].min();

    // show it if yes
    if (flag_min == 1){
      $(this).addClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",1);
      d3.select("#"+this.id.split("REST")[1]).attr("r",10);
      count += 1;
    } else {
      $(this).removeClass("active");
      $("#"+this.id.split("REST")[1]).css("opacity",0);
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
    document.getElementById("capsules-box").classList.add("active");
    document.getElementById("overlay-capsules").classList.add("active");
    $('body').addClass('noscroll');
    $("#capsule"+t.target.id.split("capsule")[1]).addClass("showme");
  });
};


// resize Flickities
$(".capsule-slideshow").click(function(event) {
  var carousel = document.querySelector('.'+event.target.id);
  var flkty = new Flickity( carousel );
  flkty.resize();
});

// see if the reader is loading a specific restaurant
$(document).ready(function(){

  if(window.location.hash) {

    $(".how-many-restaurants").css("display","block");
    document.getElementById("count-how-many").innerHTML = "is 1 result";
    $("#see-all").removeClass("selected");

    var dotID = window.location.hash.split("#REST")[1];
    d3.selectAll(".dot").transition().attr("r",0);
    d3.select("#"+dotID).transition().attr("r","20");

    $(".restaurant-element").filter(function() {
      if ("REST"+dotID == this.id) {
        $(this).addClass("active");
      } else {
        // console.log(this.id);
        $(this).removeClass("active");
      }
    });
    $('body,html').animate({scrollTop: 0}, 800);
  }

});
