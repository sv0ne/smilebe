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

	});

	@@include('_popup.js');
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
			breakpoint: BREAKPOINT_md2,
			settings: {
				slidesToShow: 2,
			}
		},
		{ 
			breakpoint: BREAKPOINT_608,
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

//////////////////////////////////// Прочее /////////////////////////////////////////////

$(".js-full-year").text(new Date().getFullYear()); // В фитере показываем текущий год
$('.js-mask-tel').mask("+7(999)999-99-99"); // Маска для телефонов

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

/////////////////////////////////////////////////////////////////////////////////////////

	$(document).on("click", function(e){
		if(e.ctrlKey){
			
		}
	});
});