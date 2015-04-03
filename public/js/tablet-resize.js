function setHeights(){
        var ew = $('.innerdial').css("width");
        var fontSize = parseInt(ew)/2; 
        var partWidth = $('li.part').css('width');
        var buttonWidth = $('button.parts-btn').css('width');
        $('.innerdial, .meter-outer, #meter-inner').css({'height':ew}); //makes height = fluid width
        $('span.fa').css({'line-height':ew, 'font-size': fontSize}); //makes icon in dial responsive to dial size change
        $('li.part').css({'line-height':partWidth});
        $('.logo, .nav-menu').css({'height': partWidth});
        $('button.parts-btn').css({'height': buttonWidth}); 
    }

$(document).ready(function(){
    setHeights();
    $(window).resize(function () {
        setHeights();
        $('.innerdial_knob').css({'width':'40%', 'height': '40%'});
    });
});