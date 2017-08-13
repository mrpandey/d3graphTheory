$("#slider").animate({opacity:1}, 1000);
$("#slide-nav").animate({opacity:1}, 1000);

var slideLength = $("#slider > div").length;
var currentSlide = 0;
var intervalId = null;
var el = null;

//targets to be highlighted corresponding the value of currentSlide
var highlightTargets = {
    "1": "#map-open",
    "2": "#theory-content",
    "4": "#app-interface",
    "5": "#below-app a.map-flow.next"
};

$("#theory-content").hide();
$("#app-interface").hide();
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
        highlight();
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
        highlight();
    }
});

//changes the counter to currentSlide e.g. 3/5
function setSlideCounter(){
    $("#slide-counter").text(""+(currentSlide+1)+"/"+slideLength);
}

//highlights dom elements based on currentSlide
function highlight(){
    //clear previous call
    if(intervalId){
        clearInterval(intervalId);
        intervalId = null;
        el.removeClass("highlighted");
        el.css("background-color", "rgba(255,255,255,1)");
    }

    if(highlightTargets.hasOwnProperty(""+currentSlide)){
        var x=0;
        el = $(highlightTargets[""+currentSlide]);
        el.addClass("highlighted");
        if(el.css("display")=="none"){
            el.slideToggle();
            el.css("padding", "10px");
        }
        intervalId = setInterval(function(){
            el.css("background-color", "rgba(255,255,100," + Math.abs(Math.sin(x)) + ")");
            x += 0.02;
        }, 10);
    }
}
