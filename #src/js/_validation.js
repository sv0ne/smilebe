// Инициируем обработчики валидации
function initValidators() {
	// Валидируем поля формы перед отправкой
	$('.js-validation-form').submit(function (e) {
		if($(e.originalEvent.submitter).hasClass('js-submit-without-validate') === true){return true;}

		let isSubmitForm = true;
		$(this).find("._validate").each(function(){
			let validateType = $(this).data('validation-type');
			let value = $(this).val();
			let error = false;
			for (var i = 0; i < validateType.length; i++) {
				let isValid = validator[validateType[i]](value);
				if(isValid !== true){error = isValid; break;}
			}
			if(error !== false){
				isSubmitForm = false;
				$(this).addClass('_error');
				$(this).closest('.js-validation-block').find('.js-validation-error').text(errorMessage[error]);
			}
		});

		if(isSubmitForm === false){
			$(this).find('.js-form-submit').addClass('disabled');
		}
		return isSubmitForm;
	});

	// Про фокусе поля убираем у него ошибку
	$(".js-validation-form ._validate").on("focus change", function(){
		if($(this).hasClass('_error')){
			$(this).removeClass('_error');
			$(this).closest('.js-validation-block').find('.js-validation-error').text('');
		}

		let errorsCount = $(this).closest(".js-validation-form").find('._error').length;
		if(errorsCount === 0){
			$(this).closest(".js-validation-form").find('.js-form-submit').removeClass('disabled');
		}
	});
}
initValidators();

// Все виды валидации
let validator = {
	req: function (value) {
		if(value === ""){return "required";}
		return true;
	},
	tel: function (value) {
		if(value === ""){return true;}
		if(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){8,14}(\s*)?$/.test(value) === false){return "wrongTelephone";}
		return true;
	},
	email: function (value) {
		if(value === ""){return true;}
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value) === false){return "wrongEmail";}
		return true;
	},
	name: function (value) {
		if(value === ""){return true;}
		if(value.length < 2){return "wrongNameShort";}
		if(value.length > 100){return "wrongNameLong";}
		return true;
	},
	password: function (value) {
		if(value === ""){return true;}
		if(/^[a-zA-Z0-9]+$/.test(value) === false){return "passwordOnlyLatin";}
		if(/^[^-() /]*$/.test(value) === false){return "passwordWithoutCharacters";}
		if(value.length < 8){return "wrongPasswordShort";}
		if(value.length > 100){return "wrongPasswordLong";}
		if(parseInt(value.substr(0, 1))){return "passwordFirstSymbolLeter";}
		return true;
	},
	passwordMatch: function (value) {
		let firstPasswordValue = $('.js-password-match').val();
		if(firstPasswordValue !== value){return "passwordNotMatch";}
		return true;
	},
	reqAddress: function (value) {
		if(value === ""){return "requiredAddress";}
		return true;
	},
	bankCard: function (value) {
		if(value === ""){return true;}
		if(/[-0-9]{16}/.test(value) === false){return "wrongWankCard";}
		return true;
	},
	reqImage: function (value) {
		if(value === ""){return "requiredImage";}
		return true;
	}
};

// Показать/скрыть пароль
$(".js-showHidePassword").click(function(){
	var parent = $(this).closest('.js-showHidePasswordParent');
	if (parent.find('input').attr('type') === 'password'){
		parent.find('input').attr('type', 'text');
		$(this).addClass('active');
	} else {
		parent.find('input').attr('type', 'password');
		$(this).removeClass('active');
	}
});

// Все виды ошибок
let errorMessage = {
	"required" : "Поле обязательное для заполнения",
	"wrongTelephone": "Неверный формат номера телефона",
	"wrongEmail": "Неверный формат электронной почты",
	"wrongNameShort": "Cлишком короткое значение (мин. 2 символа)",
	"wrongNameLong": "Cлишком длинное значение (макс. 100 символов)",
	"wrongPasswordShort": "Пароль должен содержать больше 8 символов",
	"wrongPasswordLong": "Пароль должен содержать меньше 80 символов",
	"passwordOnlyLatin": "Пароль должен содержать только латинские буквы и цифры",
	"passwordWithoutCharacters": "Пароль не должен содержать спецсимволы (),/- []",
	"passwordFirstSymbolLeter": "Пароль должен начинаться с буквы",
	"passwordNotMatch": "Пароли не совпадают",
	"requiredAddress" : "Выберите адрес доставки",
	"wrongWankCard": "Поле должно содержать 16 цифр",
	"requiredImage": "Необходимо прикрепить скриншот"
};