function closeFullScreen() {
  if (document.exitFullscreen) {
      document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
  }
};
// Cross-browser fullscreen check

$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange msfullscreenchange', function (){
  var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen || document.fullscreen || document.msFullscreenElement;
  if(!isFullScreen){
    windowNav();
  }
});
function fullscreenNav(){            
  $('#Navbar').hide();            
  $('#present-tray').show();
  $('#present-toolbar').show();
  if(ancientLoaded == 1) {
      $('#progress').show();
  }
  var docElement
  var request;
  docElement = document.documentElement;
  request = docElement.requestFullScreen || docElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) || docElement.mozRequestFullScreen || docElement.msRequestFullScreen;
  // if(typeof request!="undefined" && request){
  request.call(docElement);
  //  }
  kfi = bridgeworks.registry.find("CameraMotion");
  //Progress Bar ====================================
  interval = window.setInterval(function () {
      elapsedTime = kfi.time.getValueDirect();
      elapsedTime = elapsedTime * 1.07;
      bar.set_percentage(elapsedTime);
      //console.log(elapsedTime);
  }, 50);
}
function windowNav(){            
  $('#Navbar').show();                      
  $('#present-tray').hide();
  $('#present-toolbar').hide();
  $('#progress').hide();
  window.clearInterval(interval);
}