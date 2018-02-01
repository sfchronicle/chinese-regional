require("./lib/social"); //Do not delete

document.getElementById("how-to-button").addEventListener("click",function(){
  if ($(this).find($(".fa")).hasClass("fa-angle-double-down")){
    document.getElementById("how-to-text").classList.add("visible");
    $(this).find($(".fa")).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
  } else {
    document.getElementById("how-to-text").classList.remove("visible");
    $(this).find($(".fa")).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
  }
});
