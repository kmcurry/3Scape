//Progress Bar ========================
function progress_bar(container){
    var bar = document.createElement('div');
    bar.setAttribute("class",".progress");
    bar.setAttribute("id","progress_bar");

    bar.style.width = '0%';
    bar.style.height = '100%';
    bar.style.background = '#696969';
    container.appendChild(bar);

    this.set_percentage = function(percentage){
        for(var i = 0; i <= percentage; i++) {
            bar.style.width = i + "%";
        }
    }

}
//=========================================

//Progress Bar ===========================================================
var bar = new progress_bar(document.getElementById('progress'));
slidesPlayed = 0;
isPlaying = 0;
//=======================================================================

//Play Slider============================================================
function playSlides(){
  console.log(slidesPlayed);
  isPlaying = 2;
   timer = window.setInterval(function (){
      kfi = bridgeworks.registry.find("CameraMotion");
      slideTime = kfi.time.getValueDirect();
      Math.floor(slideTime);
      console.log(slideTime);
      if(isPlaying == 1){
          bridgeworks.renderController.play();
          isPlaying = 2;
      }
  },200);
  playSlider = window.setInterval(function () {
      console.log(slidesPlayed);
      if (slideTime >= 5 && slidesPlayed == 0) {
          bridgeworks.updateScene("Slide1.xml");
          slidesPlayed = 1;
      }
      else if(slidesPlayed == 1){
          bridgeworks.updateScene("Slide2.xml");
          slidesPlayed = 2;
      }
      else if (slideTime >= 15 && slidesPlayed == 2){
          bridgeworks.updateScene("Slide3.xml");
          slidesPlayed = 3;
      }
      else if(slideTime >=20 && slidesPlayed == 3){
          bridgeworks.updateScene("Slide4.xml");
          slidesPlayed = 4;
      }
      else if (slideTime >=38 && slidesPlayed == 4){
          bridgeworks.updateScene("Slide5.xml");
          slidesPlayed = 5;
      }
      else if(slideTime >=43 && slidesPlayed == 5){
          bridgeworks.updateScene("Slide6.xml");
          slidesPlayed = 6;
      }
      else if(slideTime >=56 && slidesPlayed == 6){
          bridgeworks.updateScene("Slide7.xml");
          slidesPlayed = 7;
      }
      else if(slideTime >=61 && slidesPlayed == 7){
          bridgeworks.updateScene("Slide8.xml");
          slidesPlayed = 8;
      }
      else if(slideTime >=80 && slidesPlayed == 8){
          bridgeworks.updateScene("Slide9.xml");
          slidesPlayed = 9;
      }
      else if((slideTime >=86 && slidesPlayed == 9)){
          bridgeworks.updateScene("Slide10.xml");
          slidesPlayed = 0;
          isPlaying = 0;
          window.clearInterval(playSlider);
          window.clearInterval(timer);
      }
  },4000);
}

$('#progress').bind('click', function (ev) {
    console.log("Click");
    var $div = $(ev.target);
    // var $display = $div.find('.display');

    var offset = $div.offset();
    var x = ev.clientX - offset.left;

    newbar = document.getElementById('progress_bar');

    newbar.style.width = (x/11.18) + "%";

    elapsedTime = (x/11.9);

    var cmd = "\<Set target='"+CameraMotion+"' time='"+elapsedTime+"'/>";
    var cmd2 = "\<Play/>";
    console.log(cmd);
    bridgeworks.updateScene(cmd);
    bridgeworks.updateScene(cmd2);

    //console.log(bar.style.width);
    //console.log(x);
    //=================================================
});   