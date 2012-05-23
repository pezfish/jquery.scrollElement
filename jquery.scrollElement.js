/**
* jQuery Scroll Element
* Copyright (c) 2011 Kevin Doyle
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
**/

(function($){
	var config = {
		prev : ".scrollprev",
		next : ".scrollnext",
		container : ".scrollcontainer",
		mode : "page",
		pagesize : 3,
		displayed : null,
		disabledclass : "disabled",
	};
	var el, calc, scrollcontainer, scrolllist;
	var methods = {
		init : function(settings) {
			if (settings) { $.extend(config, settings); }
			return this.each(function(){
				var objdata;
				
				el = $(this);
				scrollcontainer = el.find(config.container);
				scrolllist = scrollcontainer.find("td");
				if(config.displayed === null){
					config.displayed = config.pagesize;	
				}

				el.data("scroll", {
					prevbutton : el.find(config.prev),
					nextbutton : el.find(config.next),
					container : scrollcontainer,
					currentelement : 0,
					elementlist : scrolllist,
					elementcontainer : scrollcontainer.find("tr"),
					limit : scrolllist.length - 1,
					elementpositions : [],
					pages : 0,
					pageindex : 0,
					pagesize : config.pagesize,
					displayed : config.displayed,
					disabledclass : config.disabledclass
				});
				
				objdata = el.data("scroll");

				objdata.container.scrollLeft(0);
				objdata.container.css({"overflow":"hidden"});
				objdata.prevbutton.addClass(objdata.disabledclass);
				
				methods._calcPosition(false, el);
				
				switch(config.mode){
					case "page":
						methods._calcPages(el);
						if(objdata.pages <= 1){
							objdata.nextbutton.addClass(objdata.disabledclass);
						}
						
						objdata.prevbutton.bind("click", {dir : "prev", scope : el}, methods._pageScroll);
						objdata.nextbutton.bind("click", {dir : "next", scope : el}, methods._pageScroll);
						break;
					case "infinite":
						objdata.prevbutton.removeClass(objdata.disabledclass);
						objdata.prevbutton.bind("click", {dir : "prev", scope : el}, methods._infiniteScroll);
						objdata.nextbutton.bind("click", {dir : "next", scope : el}, methods._infiniteScroll);
						break;
				}
			});
		},
		_pageScroll : function(event){
			var obj = event.data.scope,
				objdata = obj.data("scroll");

			if(event.data.dir === "prev" && objdata.pageindex > 0){
				objdata.pageindex -= 1;
				if(objdata.nextbutton.hasClass(objdata.disabledclass)){
					objdata.nextbutton.removeClass(objdata.disabledclass);
				}
				
				if(objdata.pageindex === 0){
					objdata.prevbutton.addClass(objdata.disabledclass);	
				}
			} else if(event.data.dir === "next" && objdata.pageindex < objdata.pages) {
				objdata.pageindex += 1;
				objdata.prevbutton.removeClass(objdata.disabledclass);
				
				if(objdata.pageindex === objdata.pages){
					objdata.nextbutton.addClass(objdata.disabledclass);	
				}
			}
			
			calc = objdata.elementpositions[objdata.pageindex * objdata.pagesize];
		
			objdata.container.stop().animate({
				scrollLeft : calc
			}, "fast");
			
			return false;
		},
		_infiniteScroll : function(event){
			var obj = event.data.scope,
				objdata = obj.data("scroll");

			calc = objdata.elementpositions[1];
			if(event.data.dir === "prev"){
				objdata.elementlist.eq(-1).prependTo(objdata.elementcontainer);
				objdata.container.scrollLeft(calc);
				objdata.container.stop().animate({
					scrollLeft : 0	
				}, "fast", function(){
					methods._calcPosition(true, obj);	
				});
			} else if(event.data.dir === "next") {
				objdata.container.stop().animate({
					scrollLeft : calc
				}, "fast", function(){
					objdata.elementlist.eq(0).appendTo(objdata.elementcontainer);
					objdata.container.scrollLeft(0);
					methods._calcPosition(true, obj);
				});			
			}
			
			return false;
		},
		_calcPages : function(scope){
			var obj = scope,
				objdata = obj.data("scroll");

			objdata.pages = Math.max(1, Math.ceil((objdata.limit - (objdata.displayed - objdata.pagesize)) / objdata.pagesize));
			
			objdata.pageindex = Math.max(0, objdata.pageindex);
			objdata.pageindex = Math.min(objdata.pages, objdata.pageindex);
		},
		_calcPosition : function(recalc, scope){
			var obj = scope,
				objdata = obj.data("scroll");

			if(recalc){
				objdata.elementlist = objdata.container.find("td");
			}
			objdata.elementlist.each(function(i){
				objdata.elementpositions[i] = Math.ceil($(this).position().left);
			});	
		}			
	};
	
	$.fn.scrollElement = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on scrollElement');
		}    
	};
})(jQuery);
