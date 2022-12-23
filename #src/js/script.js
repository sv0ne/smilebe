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
	const BREAKPOINT_608 = 608.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	// Изменение ширины окна браузера
	$(window).resize(function(){
		w = $(window).outerWidth();
		h = $(window).outerHeight();
	});

	// Действия при скролле
	$(window).scroll(function(){
		let scrollTop = $(window).scrollTop();
		fixedElementOnScroll(scrollTop);
		fixedCardOnScroll(scrollTop);
	});

	@@include('_popup.js');
	@@include('_scroll.js');
	@@include('_validation.js');

///////////////////////////// Логика бургер-меню ///////////////////////////////////////

const $burger = $(".js-burger");
const $menu = $(".js-menu");
const $overlay = $(".js-overlay");
let isActiveMenu = false;
// Открыть/закрыть меню / Скрыть меню при клике вне блока меню
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	let isBurger = $(e.target).hasClass("js-burger");
	let isChildMenu = $menu.has(e.target).length === 1 ? true : false;
	let isMenu = $(e.target).hasClass("js-menu");
	
	let newStateMenu = isActiveMenu;
	if(isBurger){
		newStateMenu = !newStateMenu;
	}else if(isBurger === false && isMenu === false && isChildMenu === false){
		newStateMenu = false;
	}

	if(newStateMenu !== isActiveMenu){
		isActiveMenu = newStateMenu;
		$burger.toggleClass('active', isActiveMenu);
		$menu.toggleClass('active', isActiveMenu);
		$overlay.toggleClass('active', isActiveMenu);
		if(w < BREAKPOINT_md4){$body.toggleClass('lock', isActiveMenu);}
	}
});

///////////////////////////// Выпадающие списки ////////////////////////////////////

// Клик по выпадающему списку
$(document).on("click", ".js-dropdown-head", function(){
	let dropdownItem = $(this).closest('.js-dropdown-item');
	let dropdownBody = dropdownItem.find('.js-dropdown-body');
	let isActive = dropdownItem.hasClass('active');
	dropdownItem.toggleClass("active", !isActive);
	isActive ? dropdownBody.slideUp(300) : dropdownBody.slideDown(300);
});

/** При инициализации страницы закрываем/открываем выпадающий список в зависимости от класса "active" */
$(".js-dropdown-item").each(function(){
	let isActive = $(this).hasClass('active');
	isActive ? $(this).find('.js-dropdown-body').show() : $(this).find('.js-dropdown-body').hide();
});

///////////////////////////////// Слайдеры ///////////////////////////////////////////

$('.js-slider').slick({
	slidesToShow: 3,
	prevArrow: $('.products_withSlider .sliderBtn.btn-prev'),
	nextArrow: $('.products_withSlider .sliderBtn.btn-next'),
	responsive:[
		{ 
			breakpoint: 1150,
			settings: {
				slidesToShow: 2,
			}
		},
		{ 
			breakpoint: 800,
			settings: {
				slidesToShow: 1,
			}
		}
	]
});

//////////////////////// Скопировать ссылку в буфер обмена ////////////////////////// 

// Копирование текста в буфер обмена
function copy_in_buffer(txt) {
	var $tmp = $("<textarea>");
	$("body").append($tmp);
	$tmp.val(txt).select();
	document.execCommand("copy");
	$tmp.remove();
}

// Клик на скопировать ссылку
$(".js-copy-text").click(function(){
	let txt = $(this).data('copy-text');
	let msg = $(this).data('copy-message');
	copy_in_buffer(txt);
	showAlertPupup(msg);
});

// Показать всплывашку снизу поцентру экрана
function showAlertPupup(message) {
	$('.simpleMessage').remove();
	$body.append('<div class="simpleMessage">'+message+'</div>');
}

////////////////////////////// Блок отзывов //////////////////////////////////

let $activeSlidersReviews = null;
// Открыть слайдер с картинками отзывов
$(".js-detect-grid .imageFeedback__item").click(function(){
	if($activeSlidersReviews === null){
		let $parent = $(this).closest('.js-detect-grid');
		let index = $(this).index();

		$parent.removeClass('imageFeedback').addClass("isSliderReviews");
		$parent.find('video').prop('muted', false).prop('controls', true);
		$body.addClass('lock');
		$('.feedbackSliderControls').addClass('active');
		$activeSlidersReviews = $parent;

		$parent.slick({
			prevArrow: $('.feedbackSliderControls .feedbackBtn.btn-prev'),
			nextArrow: $('.feedbackSliderControls .feedbackBtn.btn-next'),
			initialSlide: index
		});
		/*$parent.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			$parent.find('video').get(0).pause();
		});*/
	}
});

// Действие для закрытия слайдера
$(".js-close-SliderReviews").click(function(){
	closeSliderReviews();
});

// Действие для закрытия слайдера
$(document).on("click", function(e){
	if($activeSlidersReviews !== null && $(e.target).hasClass('imageFeedback__wrap')){
		closeSliderReviews();
	}
});

// Закрыть слайдер с картинками отзывов
function closeSliderReviews() {
	$activeSlidersReviews.slick('unslick');
	$activeSlidersReviews.removeClass('isSliderReviews').addClass("imageFeedback");
	let video = $activeSlidersReviews.find('video');
	if(video.length !== 0){
		video.prop('muted', true).prop('controls', false);
		video.get(0).pause();
	}
	$('.feedbackSliderControls').removeClass('active');
	$body.removeClass('lock');
	$activeSlidersReviews = null;
}

// Узнать сколько картинок в отзывах и задать нужную grid-сетку
$(".js-detect-grid").each(function(){
	let countChild = $(this).children().length;
	$(this).addClass("child-" + countChild);
});

let iterationsDetectVideoDuration = {count: 0, max: 25};

// Узнать есть ли видосики в блоке с отзывами
function detectDurationVideo() {
	if(iterationsDetectVideoDuration.count > iterationsDetectVideoDuration.max){return false;}
	iterationsDetectVideoDuration.count++;
	$(".js-detect-grid .imageFeedback__item video").each(function(){
		let duration = $(this)[0].duration.toFixed(0);
		if(duration === "NaN"){
			setTimeout(function() {detectDurationVideo();}, 1000);
			return false;
		}
		let m = duration % 60;
		let min = Math.floor(duration / 60);
		let result = (min < 10 ? '0' : '') + min + ':' + (m < 10 ? '0' : '') + m;
 		let html = '<span class="imageFeedback__duration">'+result+'</span>';
 		html += '<span class="btnRound btnPlayVideo">';
		html += '<svg class="w-16"><use xlink:href="img/sprite/icons-sprite.svg#play_2"/></svg>';
		html += '</span>';
 		$(this).closest('.imageFeedback__wrap').append(html);
 	});
}
setTimeout(function() {detectDurationVideo();}, 10);

//////////////////// Слайдер в начале страницы "СТРАНИЦА ТОВАРА" ////////////////////////

// Узнать ID слайда с презентацией
let slidePresentationID = $('.sliderBig__item .js-presentation-video').parent().index();

/* Отследить инициализацию слайдера js-sliderBig. Чтобы избежать мигания картинок, до 
   инициализации слайдера скрываем все слайды кроме первого */
$('.js-sliderBig').on('init', function(event, slick){
  $('.js-sliderBig').removeClass('preInit');
});

// Инициализация слайдера
$('.js-sliderBig').slick({
	prevArrow: $('.product .sliderBtn.btn-prev'),
	nextArrow: $('.product .sliderBtn.btn-next'),
	//autoplay: true,
	//autoplaySpeed: 3500,
});

// Отслеживаем действие -> перелистывание слайда
$('.js-sliderBig').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  $('.js-scrollPreview .scrollPreview__item').removeClass('active');
  $('.js-scrollPreview .scrollPreview__item:eq('+nextSlide+')').addClass('active');

  /** Автоперелистывание слайдов в блоке превью слайдов */
  if(w < BREAKPOINT_md2){
  	  let scrollLeft = $('.js-scrollPreview').scrollLeft();
	  let widthScroll = parseInt($('.js-scrollPreview').width());
	  nextSlide = parseFloat(nextSlide);

	  let startVisibility = scrollLeft;
	  let endVisibility = scrollLeft + widthScroll;

	  let leftItem = nextSlide * 96;
	  let rightItem = (nextSlide * 96) + 80;

	  let setScroll = false;
	  if(rightItem > endVisibility){setScroll = rightItem - endVisibility + scrollLeft;}
	  if(leftItem < startVisibility){setScroll = leftItem;}

	  if(setScroll !== false){
	  	$('.js-scrollPreview').animate({scrollLeft: setScroll}, 300);
	  }
  }else{
  	  let scrollLeft = $('.js-scrollPreview').scrollTop();
	  let widthScroll = parseInt($('.js-scrollPreview').height());
	  nextSlide = parseFloat(nextSlide);

	  let startVisibility = scrollLeft;
	  let endVisibility = scrollLeft + widthScroll;

	  let leftItem = nextSlide * 88;
	  let rightItem = (nextSlide * 88) + 80;

	  let setScroll = false;
	  if(rightItem > endVisibility){setScroll = rightItem - endVisibility + scrollLeft;}
	  if(leftItem < startVisibility){setScroll = leftItem;}

	  if(setScroll !== false){
	  	$('.js-scrollPreview').animate({scrollTop: setScroll}, 300);
	  }
  }
  

  // Логика автовоспроизведения видео
  let $video = $(slick.$slides.get(nextSlide)).find('video');
  let isSlideWithVideo = $video.length;
  if(isSlideWithVideo === 1){
  	$video.trigger('play');
  }else{
  	$('.sliderBig__item video').trigger('pause');
  }
});

// Клик по слайду в превью блоке
$(".js-scrollPreview .scrollPreview__item").click(function(){
	var index = $(this).index();
	$('.js-sliderBig').slick('goTo', index);
});

// Клик по "как пользоваться", тоесть открыть презентационное видео
$(".js-view-presentation-video").click(function(){
	$('.js-sliderBig').slick('goTo', slidePresentationID);
});

///////////////////// Видео истории в блоке testimonials ////////////////////////////////

const TIME_SLIDE_DURATION = 5000; // Длительность слайда с картинкой

let $lastVideoPlaying = null;
let isStoped = false; // Слайдер на паузе
// Момент инициализации/переключения слайдов
$('.js-slick-tape').on('init beforeChange', function(event, slick, currentSlide, nextSlide){
	let $video = event.type === "init" ? $(slick.$slides[0]).find('video') : $(slick.$slides.get(nextSlide)).find('video');
	const duration = $video.length === 1 ? $video[0].duration * 1000 : TIME_SLIDE_DURATION;
	const countSlides = $(slick.$slides).length;
	const indexCurrentSlide = event.type === "init" ? 0 : nextSlide;

	// Остановить видео в предыдущем слайде если оно там есть
	if($lastVideoPlaying !== null){
		$lastVideoPlaying.get(0).pause();
	  $lastVideoPlaying = null;
	}

	// Если в текущем слайде есть видео, запустить его
	if($video.length === 1){
		$video[0].currentTime = 0;
		$video.get(0).play();
		$lastVideoPlaying = $video;
	}

	isStoped = false;
	$('.js-tape-pause').removeClass("active");
	$('.js-timescale').remove();
	$('.js-slick-tape').append(addTimescale(countSlides, indexCurrentSlide, duration));
	autoSlide(duration);
});

let timeoutNextSlide = null, startSlideTime;
// Автопереключение слайдов
function autoSlide(delay) {
	startSlideTime = new Date().getTime();
	clearTimeout(timeoutNextSlide);
	timeoutNextSlide = setTimeout(function() {
		$('.js-slick-tape').slick('slickNext');
	}, delay);
}

$('.js-slick-tape').slick({
	prevArrow: $('.js-tape-controls .btnRound.btn-prev'),
	nextArrow: $('.js-tape-controls .btnRound.btn-next'),
});

// Создать временные шкалы (отрезки)
function addTimescale(count, itemActive, duration = TIME_SLIDE_DURATION) {
	let html = '<div class="timescale js-timescale" style="--stories-duration: '+duration+'ms;">';
		html += '<div class="timescale__lines">';
			for (var i = 0; i < count; i++){
				let timescale_leftClass = i === itemActive ? "active" : i < itemActive ? "complete" : "";
				html = html + '<div class="timescale__item"><div class="timescale__left '+timescale_leftClass+'"></div></div>';
			}
		html += '</div>';
	html += '</div>';
	return html;
}

let leftTimeSlide;
// Остановить автопрокрутку сторисов
$(document).on("mousedown", ".js-tape-pause", function(e){
	if(isStoped === false){
		isStoped = true;
		$(this).addClass('active');
		$('.timescale__left').addClass('pause');
		let nowTime = new Date().getTime();
		leftTimeSlide = nowTime - startSlideTime;
		clearTimeout(timeoutNextSlide);
		if($lastVideoPlaying !== null){
			$lastVideoPlaying.get(0).pause();
		}
	}else{
		isStoped = false;
		$(this).removeClass('active');
		$('.timescale__left').removeClass('pause');
		if($lastVideoPlaying !== null){
			$lastVideoPlaying.get(0).play();
		}
		let durationSlide = $lastVideoPlaying !== null ? $lastVideoPlaying.get(0).duration * 1000 : TIME_SLIDE_DURATION;
		autoSlide(durationSlide - leftTimeSlide);
	}
});

let storiesVideoMuted = true;
// Включение/Отключение звука на видео
$(document).on("click", ".js-tape-mute", function(e){
	storiesVideoMuted = !storiesVideoMuted;
	$('.tape__item video').prop('muted', storiesVideoMuted);
	$(this).toggleClass('active');
});

////////////////////////////////////// Home ////////////////////////////////////////////

var $video_fScreen = $(".js-fScreen video");
// Запускаем одновременно 2 видео когда они оба подгрузились
function startVideo() {
	let hasError = false;
  	$video_fScreen.each(function(){
		let duration = $(this)[0].duration;
		if(isNaN(duration)){hasError = true;}
	});
	if(hasError === true){
		setTimeout(function(){
			startVideo();
		},500);
	}else{
		$(".js-fScreen").addClass("js-video-active");
		$(".js-fScreen").find(".js-video").trigger('play');
	}
}
startVideo();

/** Сразу фильтруем после инициализации фильтра */

$('.js-slider-bundles').on('init', function(event, slick){
	setTimeout(function() {
		filterBundles($("#js-bandles-first"), "filter-group-1");
	}, 1000);
});


var slidesToShow = 1;
// Посчитать сколько слайдов нужно показывать для слайдера
function calcToShow() {
	const slideWidth = w < BREAKPOINT_md4 ? 332 : 432;
	if(w > BREAKPOINT_md1){
		slidesToShow = BREAKPOINT_md1 / slideWidth;
	}else{
		slidesToShow = (w - 16) / slideWidth;
	}
	
}
calcToShow();

// Слайдер наборов
$('.js-slider-bundles').slick({
	prevArrow: $('.bundles .btnRound.btn-prev'),
	nextArrow: $('.bundles .btnRound.btn-next'),
	slidesToShow: slidesToShow,
	infinite: false
});

// Функция ниже позволяет отфильтровать слайдов внутри слай пу указанному классу (.filter)
$(".js-filter-slider .scroll__item a").click(function(e){
	e.preventDefault();
	let filter = $(this).data('filter');
	filterBundles($(this), filter);
});

// Фильтрация слайдера 
function filterBundles(elem, filter) {
	$(".js-filter-slider .scroll__item a").removeClass('btn_black').addClass("btn_light");
	elem.removeClass('btn_light').addClass("btn_black");

	if(filter === 'all'){
		$('.js-slider-bundles').slick('slickUnfilter').slick('slickFilter', '.bundles__col'); // Отменяем фильтровку
	}else{
		$('.js-slider-bundles').slick('slickUnfilter').slick('slickFilter', '.'+filter); // Фильтруем
	}

	let slickListWidth = $(".js-slider-bundles .slick-list").width();
	let slickTrackWidth = $(".js-slider-bundles .slick-track").width();
	const diff = slickTrackWidth - slickListWidth;
	if(diff < 30){
		$('.bundles .sliderBtn').hide();
	}else{
		$('.bundles .sliderBtn').show();
	}
	setTimeout(function() {
		$('.js-slider-bundles').slick('goTo', 0);
	}, 500);
}

//////////////////////////////////// Корзина ///////////////////////////////////////////

let isFixedTotality = false;
let totalityFixed = $('.js-totalityFixed');
let anchorTotalityFixed = $('.js-totalityFixed-anchor');
let totalityHeight = totalityFixed.outerHeight();
// Фиксируем блок подтверждения заказа при доскролле до него
function fixedCardOnScroll(scrollTop) {
	if(totalityFixed.length === 0 || w > BREAKPOINT_md3){return false;}

	let bottomAnchor = $(document).height() - h - (totalityFixed.height() * 5);
	let topAnchor = anchorTotalityFixed.offset().top - h;

	if((scrollTop > topAnchor && scrollTop < bottomAnchor && isFixedTotality === false) || 
		 ((scrollTop < topAnchor || scrollTop > (bottomAnchor+totalityHeight+32)) && isFixedTotality === true)){
		isFixedTotality = !isFixedTotality;
		totalityFixed.toggleClass('active', isFixedTotality);
	}
}

// В зависимости от разрешения экрана меняем расположение блоков местами
var movementBlockStateDESC = true;
function moveDOMelement (){
	if(w < BREAKPOINT_md2 && movementBlockStateDESC === true){
		$(".js-movement-block").each(function(){
			var id = $(this).closest('.js-movement-block-to-desc').data('id');
			$(this).appendTo('.js-movement-block-to-mob[data-id='+id+']');
			movementBlockStateDESC = false;
		});
	}else if(w > BREAKPOINT_md2 && movementBlockStateDESC === false){
		$(".js-movement-block").each(function(){
			var id = $(this).closest('.js-movement-block-to-mob').data('id');
			$(this).appendTo('.js-movement-block-to-desc[data-id='+id+']');
			movementBlockStateDESC = true;
		});
	}
}
moveDOMelement();

// Селект похожий на обычный
$('.js-select-once-2').select2({ 
	minimumResultsForSearch: -1,
	width: 'auto',
	dropdownCssClass: "select-once-2-dropdown",
});

// Отследить инициализацию слайдера в корзине
$('.js-cartSlider').on('init', function(event, slick){
  $('.js-cartSlider-slideCount').text(slick.slideCount);
});

// Слайдер в корзине
$('.js-cartSlider').slick({
	prevArrow: $('.js-cartSlider-control.btn-prev'),
	nextArrow: $('.js-cartSlider-control.btn-next'),
});

$('.js-cartSlider-slideCount').text();
// Узнать текущий слайд для слайдера в корзине
$('.js-cartSlider').on('afterChange', function(event, slick, currentSlide, nextSlide){
	let currentNumberSlide = (currentSlide ? currentSlide : 0) + 1;
	$('.js-cartSlider-currentSlide').text(currentNumberSlide);
	$('.js-cartSlider-slideCount').text(slick.slideCount);
});

//////////////////////////////////// Прочее /////////////////////////////////////////////

$(".js-full-year").text(new Date().getFullYear()); // В фитере показываем текущий год
$('.js-mask-tel').mask("+7(999)999-99-99"); // Маска для телефонов
$('.js-mask-card').mask("9999-9999-9999-9999"); // Маска для банковских карточек

// Если это страница ввода кода при входе, включаем таймер до повторной отправки кода
let $resendCodeText = $('.js-rest-time-resend-code');
let restSecondToResend = 59;
if($resendCodeText.length !== 0){
	let TIMER_CODE = setInterval(function(){
		$resendCodeText.text(restSecondToResend);
		restSecondToResend--;
		if(restSecondToResend === 0){
			clearInterval(TIMER_CODE);
			$('.js-rest-time-exist').remove();
			$('.js-rest-time-missing').removeClass('dn');
		}
	}, 1000);
}

// Редактировать персональную информацию
$(".js-personal-edit").click(function(){
	$(this).addClass('dn');
	$(this).closest('.js-validation-form').find('input').removeAttr('disabled');
	$(this).closest('.js-validation-form').find('.js-form-submit').removeClass('dn');
});

// Кнопки play|stop управляют видео в рамках подителя .js-video-container
$(".js-video-control").click(function(){
	var $parent = $(this).closest('.js-video-container');
	var isPlayingVideo = $parent.hasClass('js-video-active');
	$(this).closest('.js-video-container').toggleClass("js-video-active", !isPlayingVideo);
	$parent.find(".js-video").trigger(isPlayingVideo ? 'pause' : 'play');
	$(this).toggleClass("active", isPlayingVideo);
});

/** Включить выключить звук на видео */
$(".js-video-mute").click(function(){
	var $parent = $(this).closest('.js-video-container');
	var isSoundVideo = $parent.hasClass('js-video-sound');
	$(this).closest('.js-video-container').toggleClass("js-video-sound", !isSoundVideo);
	$parent.find(".js-video").prop('muted', !isSoundVideo);
	$(this).toggleClass("active", isSoundVideo);
});

// Узнать сколько картинок в отзывах и задать нужную grid-сетку
$(".js-detect-grid").each(function(){
	let countChild = $(this).children().length;
	$(this).addClass("child-" + countChild);
});

// Задаем рейтинг продукта в звездочках
$(".js-rating").each(function(){
	let rating = $(this).data('rating');
	for(let i = 1; i < 6; i++){
		let icon = i <= rating ? "star-fill" : "star";
		$(this).append('<svg><use xlink:href="'+pathSprite+'#'+icon+'"/></svg>');
	}
});

let isFixedCard = false;
let fixedCard = $('.js-fixed-card');
// Фиксируем карточку товара
function fixedElementOnScroll(scrollTop) {
	let bottomAnchor = $(document).height() - h - (fixedCard.height() * 2);
	if((scrollTop > h && scrollTop < bottomAnchor && isFixedCard === false) || 
		 ((scrollTop < h || scrollTop > bottomAnchor) && isFixedCard === true)){
		isFixedCard = !isFixedCard;
		fixedCard.toggleClass('active', isFixedCard);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", function(e){
	if(e.ctrlKey){
		
	}
});

});