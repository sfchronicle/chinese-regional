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
var regionPREV = -1;

// function for updating with scroll
$(window).scroll(function(){
  console.log("scrolling");

  // figure out where the top of the page is, and also the top and beginning of the map content
  var pos = document.body.scrollTop || document.documentElement.scrollTop;

  // show the landing of the page if the reader is at the top
  region_info.forEach(function(region,regionIDX){
    // console.log(region);
    if (pos > $('#'+region.Cuisine).offset().top) {
      console.log("at region");
      console.log(regionIDX);
      if (regionIDX != regionPREV) {
        regionPREV = regionIDX;
        if (regionIDX == 0){
          $("#container0 #sichuan").fadeTo("opacity",0.8);
        } else if (regionIDX == 1){
          $("#container1 #shanghai").fadeTo("opacity",0.8);
        } else if (regionIDX == 2){
          $("#container2 #hunan").fadeTo("opacity",0.8);
          $("#container2 #guangxi").fadeTo("opacity",0.8);
          $("#container2 #guangdong").fadeTo("opacity",0.8);
        } else if (regionIDX == 3){
          $("#container3 #dongbei").fadeTo("opacity",0.8);
        } else if (regionIDX == 4){
          $("#container4 #taiwan_1_").fadeTo("opacity",0.8);
        }
      }
    }
    });

});
