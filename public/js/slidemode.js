//Hacks in loadslides function. Right now you send it the number of slides you want loaded. And they have to be named SlideX in order for this to work
function loadSlides(num){
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
}

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
