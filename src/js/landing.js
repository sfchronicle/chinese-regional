require("./lib/social"); //Do not delete

document.getElementById("how-to-button").addEventListener("click",function(){
  if ($(this).find($(".fa")).hasClass("fa-caret-down")){
    document.getElementById("how-to-text").classList.add("visible");
    $(this).find($(".fa")).removeClass('fa-caret-down').addClass('fa-caret-up');
  } else {
    document.getElementById("how-to-text").classList.remove("visible");
    $(this).find($(".fa")).removeClass('fa-caret-up').addClass('fa-caret-down');
  }
});

document.getElementById("credits-button").addEventListener("click",function(){
  if ($(this).find($(".fa")).hasClass("fa-caret-down")){
    document.getElementById("credits-text").classList.add("visible");
    $(this).find($(".fa")).removeClass('fa-caret-down').addClass('fa-caret-up');
  } else {
    document.getElementById("credits-text").classList.remove("visible");
    $(this).find($(".fa")).removeClass('fa-caret-up').addClass('fa-caret-down');
  }
});
