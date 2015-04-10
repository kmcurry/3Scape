$(document).ready(function(){
    var list = $('ul.pans'),
        scrollContainer = $('.palette');
        listWidth = parseInt(list.css('width'));
    console.log(listWidth);
    scrollContainer.scrollLeft(0);
    
    $('.scroll-right').click(function(){
        var scrolledLeft = scrollContainer.scrollLeft();
        
        if (scrolledLeft == listWidth ){
            $(this).removeClass('scroll-active');
        }
        
        if (scrolledLeft < listWidth){
            console.log("I'm not at the end!");
            $(this).addClass('scroll-active');
            scrollContainer.animate({scrollLeft: scrolledLeft+300}, 500);
        };

    });
    
     $('.scroll-left').click(function(){
         var scrolledLeft = scrollContainer.scrollLeft();
        if (scrolledLeft == 0 ){
            $(this).removeClass('scroll-active');
        }
        
        if (scrolledLeft > 0){
            $(this).addClass('scroll-active');
            scrollContainer.animate({scrollLeft: scrolledLeft-300}, 500);
        };
     });
    
});