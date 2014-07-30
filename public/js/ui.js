// Open and Close Side Panel =========
$("#sidebar-button").click(function(){
  $("#container").css("display", "");
  $("#side-nav").collapse('toggle');
  if ($(this).hasClass("closed")) {            
    $(this).removeClass("closed").addClass("opened");
    $('#sidebar-button span').removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-left");
    //clear notification color          
    if($(this).hasClass("btn-info")){
      $(this).removeClass("btn-info").addClass("btn-danger");              
    }
  }else {            
    $(this).removeClass("opened").addClass("closed");
    $('#sidebar-button span').removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right");
  }
});
//====================================

var toggleMode = function(){
  if($('.modeButton:first').hasClass("fa-video-camera")) {
    $('.toggleController').removeClass('btn-info').addClass('btn-danger');
    $('.toggleGlyph').removeClass('fa-video-camera').addClass('fa-anchor');
  }else {
    $('.toggleController').removeClass('btn-danger').addClass('btn-info');
    $('.toggleGlyph').removeClass('fa-anchor').addClass('fa-video-camera');
  }
};
var toggleMap = function(){
  $('#map-controls').fadeToggle();
  $('#object-controls').fadeToggle();
  $('#rotate-slider').fadeToggle();
  $('#scale-slider').fadeToggle();
  $('#rotz-slider').fadeToggle();
  $('#rotx-slider').fadeToggle();
  $('#roty-slider').fadeToggle();
}

$('.dropdown-menu').find('form').click(function (e) {
  e.stopPropagation();
});
//Color picker dropdown doesn't close on click ==========
$('.color-dropdown').click(function(event){
  event.stopPropagation();
});
$('.color-dropdown').on('hide.bs.dropdown', function () {
  return false;
});
$(function () {
  $('.dropdown.keep-open').on({
      "shown.bs.dropdown": function() {
        $(this).data('closable', false);
      },
      "click": function() {
        $(this).data('closable', true);
      },
      "hide.bs.dropdown": function() {
        return $(this).data('closable');
      }
  });
});
$(function () {
  $('.dropup.keep-open').on({
    "shown.bs.dropdown": function() {
      $(this).data('closable', false);
    },
    "click": function() {
      $(this).data('closable', true);
    },
    "hide.bs.dropdown": function() {
      return $(this).data('closable');
    }
  });
});
//============================================

// Getting sidebar tabs to work again. Not sure why they broke// UNECESSARY?
// $(function(){ 
//     $('.nav-tabs a').on('click', function (e) {
//         e.preventDefault();
//         $(this).tab('show');
//     });  
// });