require("./lib/social"); //Do not delete

$(document).on('click', 'a[href^="#"]', function(e) {
    // target element id
    var id = $(this).attr('href');

    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();

    // top position relative to the document
    var pos = $(id).offset().top-40;

    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
});

console.log(region_info);
var regionPREV = -1; var regionCUR;

// function for updating with scroll
$(window).scroll(function(){
  console.log("scrolling");

  // figure out where the top of the page is, and also the top and beginning of the map content
  var pos = document.body.scrollTop || document.documentElement.scrollTop;

  // show the landing of the page if the reader is at the top
  regionCUR = -1;
  region_info.forEach(function(region,regionIDX){
    // console.log(region);
    if (pos > $('#'+region.Cuisine).offset().top-200) {
      console.log("at region");
      console.log(regionIDX);
      regionCUR = regionIDX;
    }
  });

  if (regionCUR != regionPREV) {
    $("#container0 #sichuan").fadeTo("opacity",0);
    $("#container1 #shanghai").fadeTo("opacity",0);
    $("#container2 #hunan").fadeTo("opacity",0);
    $("#container2 #guangxi").fadeTo("opacity",0);
    $("#container2 #guangdong").fadeTo("opacity",0);
    $("#container3 #dongbei").fadeTo("opacity",0);
    $("#container3 #xinjiang").fadeTo("opacity",0);
    $("#container3 #tibet").fadeTo("opacity",0);
    $("#container3 #sichuan").fadeTo("opacity",0);
    $("#container3 #yunnan").fadeTo("opacity",0);
    $("#container3 #shaanxi").fadeTo("opacity",0);
    $("#container3 #shandong").fadeTo("opacity",0);
    $("#container4 #taiwan_1_").fadeTo("opacity",0);
    regionPREV = regionCUR;
    if (regionCUR == 0){
      $("#container0 #sichuan").fadeTo("opacity",0.8);
    } else if (regionCUR == 1){
      $("#container1 #shanghai").fadeTo("opacity",0.8);
    } else if (regionCUR == 2){
      $("#container2 #hunan").fadeTo("opacity",0.8);
      $("#container2 #guangxi").fadeTo("opacity",0.8);
      $("#container2 #guangdong").fadeTo("opacity",0.8);
    } else if (regionCUR == 3){
      $("#container3 #dongbei").fadeTo("opacity",0.8);
      $("#container3 #xinjiang").fadeTo("opacity",0.8);
      $("#container3 #tibet").fadeTo("opacity",0.8);
      $("#container3 #sichuan").fadeTo("opacity",0.8);
      $("#container3 #yunnan").fadeTo("opacity",0.8);
      $("#container3 #shaanxi").fadeTo("opacity",0.8);
      $("#container3 #shandong").fadeTo("opacity",0.8);
    } else if (regionCUR == 4){
      $("#container4 #taiwan_1_").fadeTo("opacity",0.8);
    }
  }

});
