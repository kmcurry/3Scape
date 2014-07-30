//Hacks in loadslides function. Right now you send it the number of slides you want loaded. And they have to be named SlideX in order for this to work
function loadSlides(num){
  //slideCount = 1;
  while(slideCount<=num) {
    var popUp = document.getElementById("dropUpTray");
    var slidePanel = document.getElementById("slidePanel");
    var Li = document.createElement('li');
    var S = document.createElement('a');
    S.setAttribute("style", "cursor: pointer;");
    S.setAttribute("onclick", "javascript:bridgeworks.updateScene('Slide"+(slideCount)+".xml');slidesPlayed = "+slideCount);
    S.setAttribute("id", "Slide " + slideCount);
    S.innerHTML = "Slide " + slideCount; // <a>INNER_TEXT</a>
    Li.appendChild(S);
    slidePanel.appendChild(Li);
    //Duplicate steps to populate presentation tray slide dropup. Not DRY because each parent container needs its own unique version of the generated slide link.
    // var popUp = document.getElementById("dropUpTray")
    // var Li2 = document.createElement('li');
    // var S2 = document.createElement('a');
    // S2.setAttribute("style", "cursor: pointer;");
    // S2.setAttribute("onclick", "javascript:bridgeworks.updateScene('Slide"+(slideCount)+".xml')");
    // S2.setAttribute("id", "TraySlide " + slideCount);
    // S2.innerHTML = "Slide " + slideCount; // <a>INNER_TEXT</a>
    // Li2.appendChild(S2);
    // popUp.appendChild(Li2);
    slideCount++;
  }
  slideCount = 1;
  //This makes it so the slides can be changed from active to non active to represent what slide we are on
  $('.nav li a').click(function(e) {
    $('.nav li').removeClass('active');
    var $parent = $(this).parent();
    if (!$parent.hasClass('active')) {
        $parent.addClass('active');
    }
  });
};

function nextSlide(){
  console.debug("Slide Count: "+slideCount);
  if (slideCount <= numSlides) {
    bridgeworks.updateScene('Slide' + (slideCount) + '.xml');
    slideCount++;
    console.log("SLIDE NUMBER = "+slideCount);
  }
};

function previousSlide(){
  console.debug("Slide Count: "+slideCount);
  if (slideCount > 1 && slideCount <= numSlides) {
    slideCount--;
    bridgeworks.updateScene('Slide' + (slideCount) + '.xml');
    console.log("SLIDE NUMBER = "+slideCount);
  }
};

/*
function playing(t) {
  if(t == 1) {
    console.log();
  }
};
*/

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
  };
};
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
};

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