var slideshow = loadXMLFile("BwContent/SlideShow.xml");

function trashSlide(rowId) {
  $("#" + rowId).remove();
}

function addSlide() {
  var slideList = document.getElementById("slide-list");

  if (slideshow && slideList) {

    ++g_numSlides;

    var li = document.createElement('li');
    li.setAttribute("id", "slide-" + g_numSlides);
    li.setAttribute("style", "background-color:#dddddd;height:26px;width:100%;");
    li.setAttribute("class", "col-sm-6");
    slideList.appendChild(li);

    var span = document.createElement('span');
    span.setAttribute("class", "ui-icon ui-icon-arrowthick-2-n-s");
    li.appendChild(span);
    var a = document.createElement('a');
    a.setAttribute("style", "cursor: pointer;");
    a.setAttribute("class", "col-sm-9");
    a.innerHTML = "Slide " + g_numSlides; // <a>INNER_TEXT</a>
    li.appendChild(a);


    var trashColumn = document.createElement('div');
    trashColumn.setAttribute("class", "col-sm-1");
    li.appendChild(trashColumn);
    var trashBtn = document.createElement('span');
    trashBtn.setAttribute("id", "trash" + name);
    trashBtn.setAttribute("class", 'shape fa fa-trash-o');
    trashBtn.setAttribute("style", "margin-top:3px;");
    trashBtn.setAttribute("title", 'Remove');
    trashBtn.setAttribute("onClick", "trashSlide('" + "slide-" + g_numSlides + "');");
    trashColumn.appendChild(trashBtn);

    var camera = bridgeworks.registry.find("Camera");

    var ai = slideshow.createElement("AutoInterpolate");
    ai.setAttribute("name", "Slide-" + g_numSlides)
    ai.setAttribute("target", "Camera");
    var aiPos = slideshow.createElement("position");
    aiPos.setAttribute("x", camera.position.values[0].toFixed(2));
    aiPos.setAttribute("y", camera.position.values[1].toFixed(2));
    aiPos.setAttribute("z", camera.position.values[2].toFixed(2));
    ai.appendChild(aiPos);
    var aiRot = slideshow.createElement("rotation");
    aiRot.setAttribute("x", camera.rotation.values[0].toFixed(2));
    aiRot.setAttribute("y", camera.rotation.values[1].toFixed(2));
    aiRot.setAttribute("z", camera.rotation.values[2].toFixed(2));
    ai.appendChild(aiRot);

    var xmlText = new XMLSerializer().serializeToString(ai);

    console.log(xmlText);

    a.setAttribute("onclick", "bridgeworks.updateScene('" + xmlText + "')");

    // This makes it so the slides can be changed from active to non active
    // to represent what slide we are on

    $('#slide-list li a').click(function(e) {
        $('#slide-list li').removeClass('activeSlide');

        var $parent = $(this).parent();
        if (!$parent.hasClass('activeSlide')) {
            $parent.addClass('activeSlide');
        }
    });

  }
}



//Hacks in loadslides function. Right now you send it the number
// of slides you want loaded. And they have to be named SlideX in order for this to work
function loadSlides(num) {
    g_isPlaying = 0;
    g_currSlide = 0;
    g_numSlides = 0;

    var slideList = document.getElementById("slide-list");

    for(i = 1; i <= num; ++i) {
        var li = document.createElement('li');
        li.setAttribute("style", "background-color:#dddddd;height:26px;");
        var span = document.createElement('span');
        span.setAttribute("class", "ui-icon ui-icon-arrowthick-2-n-s");
        li.appendChild(span);
        var aTag = document.createElement('a');
        aTag.setAttribute("style", "cursor: pointer;padding-left:20px");
        aTag.setAttribute("onclick", "playSlide(" + i + ")");
        aTag.setAttribute("id", "Slide " + i);
        var text = document.createTextNode("Slide " + i);
        aTag.appendChild(text);

        li.appendChild(aTag);
        slideList.appendChild(li);
    }

    g_numSlides = slideList.childNodes.length;

    console.log("loaded " + g_numSlides + " slides.");
    //console.log(slideList);

    //This makes it so the slides can be changed from active to non active to represent what slide we are on

    $('#slide-list li a').click(function(e) {
        $('#slide-list li').removeClass('activeSlide');

        var $parent = $(this).parent();
        if (!$parent.hasClass('activeSlide')) {
            $parent.addClass('activeSlide');
        }
    });

}

function nextSlide(){

  console.debug("Curr slide: "+g_currSlide);
  if (g_currSlide == g_numSlides) g_currSlide = -1;
  if (g_currSlide <= g_numSlides) {

      g_currSlide++;
      bridgeworks.updateScene('Slide' + (g_currSlide) + '.xml');
      console.log("SLIDE NUMBER = "+g_currSlide);
  }
};

function playSlide(n) {
  console.log("Playing Slide: " + n);
  bridgeworks.updateScene("Slide" + n +".xml");
  g_currSlide = n;
}

function previousSlide(){
    console.debug("Curr slide: "+g_currSlide);
  if (g_currSlide > 1 && g_currSlide <= g_numSlides) {
      g_currSlide--;
      bridgeworks.updateScene('Slide' + (g_currSlide) + '.xml');
      console.log("SLIDE NUMBER = "+g_currSlide);
  }
};



//Play Slider============================================================
function playSlides(){
    console.log(g_slidesPlayed);
    var slideTime = 0;
    g_isPlaying = 2;
     g_timer = window.setInterval(function (){
        var kfi = bridgeworks.registry.find("CameraMotion");
        slideTime = kfi.time.getValueDirect();
        Math.floor(slideTime);
        if(g_isPlaying == 1){
            bridgeworks.renderController.play();
            g_isPlaying = 2;
        }
    },200);
    g_playSlider = window.setInterval(function () {
        console.log(g_slidesPlayed);
        if (slideTime >= 5 && g_slidesPlayed == 0) {
            bridgeworks.updateScene("Slide1.xml");
            g_slidesPlayed = 1;
        }
        else if(g_slidesPlayed == 1){
            bridgeworks.updateScene("Slide2.xml");
            g_slidesPlayed = 2;
        }
        else if (slideTime >= 15 && g_slidesPlayed == 2){
            bridgeworks.updateScene("Slide3.xml");
            g_slidesPlayed = 3;
        }
        else if(slideTime >=20 && g_slidesPlayed == 3){
            bridgeworks.updateScene("Slide4.xml");
            g_slidesPlayed = 4;
        }
        else if (slideTime >=38 && g_slidesPlayed == 4){
            bridgeworks.updateScene("Slide5.xml");
            g_slidesPlayed = 5;
        }
        else if(slideTime >=43 && g_slidesPlayed == 5){
            bridgeworks.updateScene("Slide6.xml");
            g_slidesPlayed = 6;
        }
        else if(slideTime >=56 && g_slidesPlayed == 6){
            bridgeworks.updateScene("Slide7.xml");
            g_slidesPlayed = 7;
        }
        else if(slideTime >=61 && g_slidesPlayed == 7){
            bridgeworks.updateScene("Slide8.xml");
            g_slidesPlayed = 8;
        }
        else if(slideTime >=80 && g_slidesPlayed == 8){
            bridgeworks.updateScene("Slide9.xml");
            g_slidesPlayed = 9;
        }
        else if((slideTime >=86 && g_slidesPlayed == 9)){
            bridgeworks.updateScene("Slide10.xml");
            g_slidesPlayed = 0;
            g_isPlaying = 0;
            window.clearInterval(g_playSlider);
            window.clearInterval(g_timer);
        }
    },4000);
}
