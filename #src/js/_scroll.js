/*Когда у скролла есть wrapScroll ему нужно задать высоту 
так как его дочерний элемент абсолютно позиционирован */
function setHeightWrapScroll() {
	if($('.wrapScroll').length !== 0){
		var scrollHeight = $('.scroll').height();
		$('.wrapScroll').css('height', scrollHeight+'px');
	}
}
setHeightWrapScroll();

/* ВНИМАНИЕ!!! 
	Если кнопки скролла внутри блока .scroll то все ок, а если снаружи то для
	.scroll нужно задать data-scroll-id="" и также и для .scroll__button.btn-prev и 
	для .scroll__button.btn-next.
*/
var ScrollElement = function(elem) {
	let isResponsive = elem.hasClass('responsive');
	var body = elem.find('.scroll__body');
	var wBody = body.width();
	if(isResponsive === true){
		let oneElementWidth;
		if(w > BREAKPOINT_md1){
			oneElementWidth = (wBody - (3*16)) / 4;
		}else if(w > BREAKPOINT_872){
			oneElementWidth = (wBody - (4*16)) / 3;
		}else if(w > BREAKPOINT_552){
			oneElementWidth = (wBody - (3*16)) / 2;
		}else{
			oneElementWidth = (wBody - (2*16)) / 1;
		}
		if(w > BREAKPOINT_md3){elem.find('.cardReviews').css('width', oneElementWidth+'px');}
	}
	var scroll = elem.find('.scroll__scroll');
	var wScroll = scroll.width();
	var scrollID = elem.data('scroll-id');
	if(scrollID == undefined){ // Если кнопки управления лежат внутри .scroll
		var btn_prev = elem.find('.scroll__button.btn-prev');
		var btn_next = elem.find('.scroll__button.btn-next');
	}else{ // Если кнопки управления лежат где то снаружи
		var btn_prev = $('.js-scroll-button.btn-prev[data-scroll-id='+scrollID+']');
		var btn_next = $('.js-scroll-button.btn-next[data-scroll-id='+scrollID+']');
	}
	
	var overlay_prev = elem.find('.overlayArea-prev');
	var overlay_next = elem.find('.overlayArea-next');
	var paddingLeft = parseFloat(scroll.css('padding-left'));
	var paddingRight = parseFloat(scroll.css('padding-right'));

	// Просчитываем количество проскролла и выдаем scrollPosition
	var calcPosition = function (action, direction) {
		var diff = Math.round(scroll.width() +  paddingLeft + paddingRight - body.width());
		var scrollLeft = Math.round(body.scrollLeft());

		if(action === 'buttonClick'){
			if(isResponsive){
				if(w > BREAKPOINT_md1){
					var stepScroll = (elem.width()+16) * 1;
				}else if(w < BREAKPOINT_md3){
					var stepScroll = elem.width() * 0.8;
				}else{
					var stepScroll = (elem.width()-16) * 1;
				}
			}else{
				var stepScroll = elem.width() * 0.8;
			}
			
			if(direction === 'next'){
				scrollLeft += stepScroll;
				if(scrollLeft > diff){scrollLeft = diff;}
			}else{
				scrollLeft -= stepScroll;
				if(scrollLeft < 0){scrollLeft = 0;}
			}
		}
		if(scrollLeft === 0){
			scrollPosition('start');
		}else if(scrollLeft === diff){
			scrollPosition('finish');
		}else{
			scrollPosition('center');
		}
		return scrollLeft;
	}

	// Клик по кнопкам (только для DESKTOP)
	var buttonClick = function (direction){
		var scrollLeft = calcPosition('buttonClick', direction);
		body.stop().animate({scrollLeft:scrollLeft}, 500, 'swing');
	}

	// Скрыть показать кнопки в зависимости от положения скролла
	var scrollPosition = function (position) {
		if(position === 'start'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.addClass('open');
		}else if (position === 'center'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.addClass('open');
		}else if(position === 'finish'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.removeClass('open');
		}else if(position === 'not-scroll'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.removeClass('open');
		}
	}

	// Начальное положение скролла (скролл есть или его нет)
	wScroll > wBody ? scrollPosition('start') : scrollPosition('not-scroll');

	if(isMobile){
		btn_prev.removeClass('open');
		btn_next.removeClass('open');
		
	}else{
		btn_next.click(function(){ buttonClick('next'); });
		btn_prev.click(function(){ buttonClick('prev'); });
	}
	body.scroll(function(){calcPosition();});
}

$(".scroll").each(function(){
	if(!(w < BREAKPOINT_md4 && $(this).hasClass('js-not-md4'))){
		new ScrollElement($(this));
	}
});
