$(document).ready(function(){
    var list = $('ul.actions-list'),
        scrollContainer = $('.palette');
        listWidth = parseInt(list.css('width'));
        scrollContainer.scrollLeft(0);

    $('.scroll-right').click(function(){
        var scrolledLeft = scrollContainer.scrollLeft();

        if (scrolledLeft == listWidth ){
            $(this).removeClass('scroll-active');
        }

        if (scrolledLeft < listWidth){
            console.log("I'm not at the end!");
            $(this).addClass('scroll-active');
            scrollContainer.animate({scrollLeft: scrolledLeft+300}, 300);
        };

    });

     $('.scroll-left').click(function(){
         var scrolledLeft = scrollContainer.scrollLeft();
        if (scrolledLeft == 0 ){
            $(this).removeClass('scroll-active');
        }

        if (scrolledLeft > 0){
            $(this).addClass('scroll-active');
            scrollContainer.animate({scrollLeft: scrolledLeft-300}, 300);
        };
     });
    
    var element = document.querySelector('.palette');
    if((element.offsetWidth < element.scrollWidth)){
        // your element have overflow
        $('.scroll-right, .scroll-left').show();
        console.log('show scroll buttons');
    }
    else{
        //your element doesn't have overflow
        
         $('.scroll-right, .scroll-left').hide();
        scrollContainer.css({'width': '100%'});
        console.log(scrollContainer.offsetWidth + " and " + scrollContainer.scrollWidth);
    }

});
