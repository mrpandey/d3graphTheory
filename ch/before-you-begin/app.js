$("#slider").animate({opacity:1}, 1000);
$("#slide-nav").animate({opacity:1}, 1000);

var slideLength = $("#slider > div").length;
var currentSlide = 0;

setSlideCounter();

$("#next-slide").on('click', function(){
    if(currentSlide<slideLength-1){
        //remove grey background from prev button
        if(currentSlide==0){
            $("#prev-slide").toggleClass("grey");
        }
        //slide to next
        $("#slider .showing").toggleClass("showing");
        $($("#slider > div")[currentSlide+1]).toggleClass("showing");
        currentSlide++;
        //grey next button if last slide
        if(currentSlide==slideLength-1){
            $("#next-slide").toggleClass("grey");
        }
        setSlideCounter();
    }
});

$("#prev-slide").on('click', function(){
    if(currentSlide>0){
        //remove grey background from next button
        if(currentSlide==slideLength-1){
            $("#next-slide").toggleClass("grey");
        }
        //slide to prev
        $("#slider .showing").toggleClass("showing");
        $($("#slider > div")[currentSlide-1]).toggleClass("showing");
        currentSlide--;
        //grey prev button if first slide
        if(currentSlide==0){
            $("#prev-slide").toggleClass("grey");
        }
        setSlideCounter();
    }
});

//changes the counter to currentSlide e.g. 3/5
function setSlideCounter(){
    $("#slide-counter").text(""+(currentSlide+1)+"/"+slideLength);
}
