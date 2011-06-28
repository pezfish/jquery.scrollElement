/**
* jQuery Scroll Element
* Copyright (c) 2011 Kevin Doyle
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
**/

(function($) {  
	$.fn.scrollElement = function(options) {
		var defaults = {  }
		var options = $.extend(defaults, options);
		return this.each(function() {
			var limit = $("#scrollmove > table").size(),
				delay = 5000,
				timeoutDelay = 5000,
				current = -1,
				next = 0,
				isForced = false,
				isPaused = false,
				isAfterForced = false,
				rotate,
				timeout,
				timeoutStatus,
				currentSlide,
				nextSlide;
			
			function createTimer(){
				rotate = setInterval(autoSwapPhoto,delay);
			}
			
			function stopTimer(){
					clearInterval(rotate);
					if(typeof(timeout) !== 'undefined'){
						clearTimeout(timeout);
					}
			}
			
			function delayTimer(){
				stopTimer();
				if(!isPaused){
					timeout = setTimeout(createTimer, timeoutDelay);
				}
			}
			
			function forceSwapPhoto(event){
				delayTimer();
				var obj = $(event.currentTarget)
				if(obj.attr("id") === "scrollnext"){
					swapPhoto("up");	
				} else if(obj.attr("id") === "scrollprev"){
					swapPhoto("down");	
				}
				return false;
			}
			
			function autoSwapPhoto() {
				swapPhoto("up");
			}
						
			
			function toggleTimer(event){
				if(isPaused){
					createTimer();
					isPaused = false;	
				} else {
					stopTimer();
					isPaused = true;
				}
				$(event.currentTarget).blur();
				return false;
			}

			function swapPhoto(dir) {
				var postContainer = $("#scrollmove > tbody > tr");
				var allPosts = $("#scrollmove > tbody > tr > td");
				
				if(dir === "up"){
					$("#scrollmove").animate({"left":"-330px"}, function(){
						$(allPosts[0]).appendTo(postContainer);
						$("#scrollmove").css("left",0);
					});
				} else if(dir === "down"){
					$(allPosts).last().prependTo(postContainer);
					$("#scrollmove").css("left","-330px");
					$("#scrollmove").animate({"left":0});
				}
				
				if(isForced) {
					$("#rotate_list a").unbind("click");
					$("#rotate_list a").bind("click", forceSwapPhoto);	
					isForced = false;
					isAfterForced = true;
				}
			}
			
			createTimer();
			$("#scroller-new").css("overflow","hidden");
			$("#scrollprev").click(forceSwapPhoto);
			$("#scrollnext").click(forceSwapPhoto);
		});
	}
})(jQuery);