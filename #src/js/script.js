$(document).ready(function () {
	var w = $(window).outerWidth();
	var h = $(window).outerHeight();
	var isMobile = ('ontouchstart' in window);
	const $body = $('body');
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_1045 = 1044.98;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_872 = 871.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	// Изменение ширины окна браузера
	$(window).resize(function(){
		w = $(window).outerWidth();
		h = $(window).outerHeight();
	});

	// Действия при скролле
	$(window).scroll(function(){

	});

	@@include('_validation.js');

	// В фитере показываем текущий год
	$(".js-full-year").text(new Date().getFullYear());


/////////////////////////////////////////////////////////////////////////////////////////

	$(document).on("click", function(e){
		if(e.ctrlKey){
			
		}
	});
});