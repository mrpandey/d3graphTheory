$(document).ready(function(){

	//to set dimensions of svg
	univSvgWidth = $("nav.navbar-static-top > div.container").outerWidth() * 2/3 - 48;
	univSvgHeight = univSvgWidth*0.54;
	if(univSvgWidth < 616)
		univSvgWidth = 616;
	if(univSvgHeight < 400)
		univSvgHeight = 400;

	//query = query string i.e. "?title"
	var query = window.location.search;
	var home = "vertices-and-edges";
	if(query.length>1){
		query = query.substr(1);
		if(!contentData)
			$("#status-container h1").text("Error!! The page doesn't exist.");
		else if(contentData.hasOwnProperty(query))
			loadContent(query);
		else
			loadContent(home);
	}
	else
		loadContent(home);

	//chapIndex is used to set scrollTop value of map-list
	var chapIndex = 0,
			flag = true;

	//set map list
	if(contentData){
		for(var chap in contentData){
			if(contentData.hasOwnProperty(chap)){
				var newEntry = '<li ';
				if($("#content-title").text()==contentData[chap]['content-title']){
					newEntry += 'class="current-chap"';
					flag = false;
				}
				newEntry += '><a href="?' + chap + '">' + contentData[chap]['content-title'] + '<\/a><\/li>';
				$("#map-list ol").append(newEntry);
			}
			if(flag)
				chapIndex++;
		} //for ends here
	}

	//map overlay click events
	//lightbox is hidden by default
	$("#map-open").on('click', function(event){
		$("#lightbox").toggleClass("hidden");
		var listHeight = $("#map-overlay").innerHeight() - $("#map-header").outerHeight() -10;
		$("#map-list").css('max-height', '' + listHeight + 'px');
		//scroll animation
		$('#map-list').animate({
        scrollTop : $("#map-list li").outerHeight()*chapIndex,
    }, 500);
	});

	$("#map-close").on('click', function(){
		$("#lightbox").toggleClass("hidden");
	});

	$("#lightbox").on('click', function(){
		$("#lightbox").toggleClass("hidden");
	});

	$("#map-overlay").on('click', function(event){
		//if click propagates to lightbox, then overlay closes
		event.stopPropagation();
	});

	//Hide Toggle Content by default
	$(".toggle-content").each(function(){
		$(this).hide();
	});

	//Toggle on click
	$(".toggle-link").click(function(){
		$(this).next(".toggle-content").slideToggle();
		if($(this).hasClass("target-hidden"))
			$(this).text("Click to Hide");
		else
			$(this).text("Click to Show");
		$(this).toggleClass("target-hidden");
	});

	//To resize the theory and app areas to fit them in viewport.
	resizeContent();
	$(window).on('resize', resizeContent);
});

function resizeContent(){

	//need to resize map-overlay too
	if(!$("#lightbox").hasClass("hidden")){
		var listHeight = $("#map-overlay").innerHeight() - $("#map-header").outerHeight() -10;
		$("#map-list").css('max-height', '' + listHeight + 'px');
	}

	//set height of theory-area and app-area
	var h = $(window).height()-80;
	var w = $(window).width();

	if(w<992) {
		$('#theory-area').css('max-height', '');
		//$('#app-area').css('max-height', '');
		return;
	}
	//if(h<400)	return;
	$('#theory-area').css('max-height', '' + Math.max(h, 450) + 'px');
	//$('#app-area').css('max-height', '' + h + 'px');
}

function loadContent(query){
	
	var currentChap = contentData[query];
	
	document.title = currentChap["content-title"] + " - D3 Graph Theory";

	//initially: status -> not hidden; app, footer -> hidden
	$("#status-container").toggleClass("hidden");
	$("#app-container").toggleClass("hidden");

	//Set text contents
	$("#content-title").html(currentChap["content-title"]);
	$("#theory-content").html(currentChap["theory-content"]);
	$("#interface-title h4").html(currentChap["interface-title"]);
	$("#interface-content").html(currentChap["interface-content"]);
	$("#svg-buttons").html(currentChap["svg-buttons"]);
	$("#svg-output").html(currentChap["svg-output"]);

	//set prev
	if(currentChap["prev"])
		$("#below-app .prev").attr("href", currentChap["prev"]);
	else
		$("#below-app .prev").addClass("hidden");
	//set next
	if(currentChap["next"])
		$("#below-app .next").attr("href", currentChap["next"]);
	else
		$("#below-app .next").addClass("hidden");

	//load app styling
	$("head").append('<link href="ch/' + query + '/' + currentChap["style"] + '" rel="stylesheet">');

	//load app script
	$("body").append('<script type="text/javascript" src="ch/' + query + '/' + currentChap["script"] + '"></script>');
}
