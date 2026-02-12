/*
Author:     Sander Tiekstra
Company:    Tiekstramedia, http://tiekstramedia.nl
*/

$(function (){
	// INIT
	// posFooter();

	// VARS
	var targetBlank;
	
	// EVENTS
	/* activate links and open audio, video or documents */
	$('#content section a').not('.chapters>li>a').click(function(e) {
		// VARS
		var label = "";
		target = e.target;
		while( target.nodeName != "A" && target.parentNode) {
			target = target.parentNode;
		}
		
		// set active link
		$('#content section .active').removeClass('active');
		$(this).addClass('active');
				
		// open audio and video in overlay, open video in new window
		if ($('span', this).hasClass('audio')) {
			if ($(this).parent().is('dd')) {
				label += $(this).parent().prevAll('dt:first').text() + " - ";
			}
		 	label += $(this).text();
			openAudio(target, 40, 480, label);
			return false;
		} else if ($('span', this).hasClass('video')) {
			var h = !$(this).attr("video-height") ? 480: $(this).attr("video-height");
			var w = !$(this).attr("video-width") ? 640 : $(this).attr("video-width");
			
			openVideo(target, h, w);
			return false;
		} else if ($('span', this).hasClass('doc')) {
			$(this).attr("target", "_blank");
		};
	});

	/* toggle chapters */
	$('#content section ul.chapters>li>a').click(function() {
		$(this).parent().find('.wrapper').slideToggle(function(){
			$(this).parent().toggleClass("animate");
		}).parent().toggleClass("animate open");
		return false;
	}).parent().find('.wrapper').hide();
	
	/* close player */
	$('#player-close').live('click', function() {
		closePlayer();
	});
	$(window).keydown(function(e) {
		if (e.keyCode == 27) {
			closePlayer();
		};
	});
	
	/* vertical center the logo in the header */
	$(window).load(function() {
		$('header hgroup h1 img').each(function() {
			var h1Height = $(this).parent().height();
			var imgHeight = $(this).height();
			$(this).parent().css({height: "auto", top: (h1Height-imgHeight)/2 });	
		});
	});
	
	/* Adjacent selector fallback */
	if ( $('html').hasClass('ie6') ) {
		$('#content section dl dt + dd').addClass('after-dt');
	};

});

function openAudio(t, h, w, txt) {
	var audioSrc = resolveMediaSource(t);

	$('#player').css({
		height: h + "px",
		width: w + "px",
		marginTop: "-" + (h/2) - 40 + $(document).scrollTop() + "px",
		marginLeft: "-" + (w/2) + "px"
	});

	$('#video-player').empty();
	$('#audio-player').html('<audio controls autoplay preload="metadata" style="width:100%;"><source src="' + audioSrc + '" type="audio/mpeg" />Your browser does not support the audio element.</audio>');

	var h = $('body').height() > $(window).height() ? $('body').height() : $(window).height();
	$('#overlay').height(h).show();
	$('#player h1').text(txt);
	$('#player').removeClass('video').addClass('audio').fadeIn('slow');
}

function openVideo(t, h, w) {
	var videoSrc = resolveMediaSource(t);
	
	$('#player').css({
		height: h + "px",
		width: w + "px",
		marginTop: "-" + (h/2) - 0 + $(document).scrollTop() + "px",
		marginLeft: "-" + (w/2) + "px"
	});

	$('#audio-player').empty();
	$('#video-player').html('<video controls autoplay preload="metadata" style="width:100%; height:100%;"><source src="' + videoSrc + '" />Your browser does not support the video tag.</video>');
	
	var h = $('body').height() > $(window).height() ? $('body').height() : $(window).height();
	$('#overlay').height(h).show();
	$('#player h1').text("");
	$('#player').removeClass('audio').addClass('video').fadeIn('slow');
}

function closePlayer() {
	$('#audio-player audio').each(function() {
		this.pause();
	});
	$('#video-player video').each(function() {
		this.pause();
	});
	$("#player").fadeOut('slow');
	$("#overlay").hide();
	$('#audio-player').empty();
	$('#video-player').empty();
}

function resolveMediaSource(target) {
	if (!target) {
		return "";
	}
	if (typeof target === "string") {
		return target;
	}
	if (target.href) {
		return target.href;
	}
	return $(target).attr('href') || "";
}

function posFooter() {
	$(window).load(function() {
		position();
	});
	
	$(window).resize(function() {
		position();
	});
	
	function position() {
		$('footer').css("position", "relative");
		if($(window).height() > $('body').height()) {
			$('footer').css("position", "absolute");
		};
	}
	
}
