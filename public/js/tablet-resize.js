function setHeights() {
  var ew = $('.innerdial').css('width'),
    fontSize = parseInt(ew, 10) / 2,
    buttonWidth = $('button.parts-btn').css('width'),
    navFontSize = parseInt(buttonWidth, 10) * 0.7;
  $('.innerdial, .meter-outer, #meter-inner').css({'height': ew}); //makes height = fluid width
  $('dial span.fa').css({'line-height': ew, 'font-size': fontSize}); //makes icon in dial responsive to dial size change
  $('li.part').css({'height': buttonWidth});
  $('.logo, .nav-menu, button.parts-btn').css({'height': buttonWidth});
  $('.nav-menu').css({'font-size': navFontSize});
}

$(document).ready(function () {
  setHeights();
  $(window).resize(function () {
    $('.innerdial_knob').css({'width': '40%', 'height': '40%'});
  });
});
