import svg4everybody from 'svg4everybody';
import Swiper, {
	EffectCoverflow
} from 'swiper';
import MicroModal from 'micromodal';
import {
	toggle
} from 'slidetoggle';
import NiceSelect from "nice-select2/dist/js/nice-select2";
import enquire from 'enquire.js';

document.addEventListener('DOMContentLoaded', function () {
	svg4everybody();
	const mmopts = {
		awaitCloseAnimation: true,
		disableFocus: true,
	}
	MicroModal.init(mmopts);

	// Variables
	const urlParams = new URLSearchParams(window.location.search);
	const search = urlParams.get('stag');

	let withCredentials = false;

	const header = document.querySelector('.header');
	const headerLogo = document.querySelector('.header__logo');
	const mobileMenu = document.querySelector('.mobile-menu');
	const mobileMenuHeader = document.querySelector('.mobile-menu__header');
	const body = document.body;
	const html = document.querySelector('html');
	const lang = document.querySelector('.lang');
	const ticker = document.querySelector('.ticker');

	const APIURL = 'https://www.loft.partners/api';

	if (search !== null) localStorage.setItem('stag', search);
			
	if (search !== null || localStorage.getItem('stag') !== null) {
		withCredentials = true;
		doFetchStag(APIURL + '/client/partner/track_stag', {
				method: 'POST',
				body: JSON.stringify({
					"stag": search || localStorage.getItem('stag'),
				})
			})
			.then(res => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(res);
			})
			.catch(err => {
				console.log(err);
			});
	}

	// Enquire.js
	enquire
		.register('screen and (max-width: 992px)', {
			match: function () {
				mobileMenuHeader.appendChild(lang);
				window.removeEventListener("scroll", highlightMenu);
			},
			unmatch: function () {
				headerLogo.after(lang);
				window.addEventListener("scroll", highlightMenu);
			},
		})

	// Select
	const selects = document.querySelectorAll('.select');
	selects.forEach((select) => {
		new NiceSelect(select, {});
	});

	// Swiper.js
	const swiperNews = new Swiper('.slider-news', {
		modules: [EffectCoverflow],
		slidesPerView: 1,
		speed: 500,
		effect: 'coverflow',
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: 'auto',
		slideToClickedSlide: true,
		coverflowEffect: {
			rotate: 0,
			stretch: 200,
			depth: 200,
			modifier: 1,
			slideShadows: false,
		},
		breakpoints: {
			768: {
				coverflowEffect: {
					rotate: 0,
					stretch: 450,
					depth: 200,
					modifier: 1,
					slideShadows: false,
				},
			}
		}
	});

	// Fixed header
	function fixedHeader() {
		if (window.pageYOffset > 0) {
			header.classList.add("fixed");
		} else {
			header.classList.remove("fixed");
		}
	}

	if (header) {
		window.addEventListener('scroll', function () {
			fixedHeader();
		});
		fixedHeader();
	}

	function closeMenu() {
		mobileMenu.classList.remove('active');
		body.classList.remove('blur');
		html.classList.remove('lock');
	}

	// Click events
	document.addEventListener('click', function (e) {
		const faqHeader = e.target.closest('.item-faq__header');
		if (faqHeader) {
			const faq = faqHeader.closest('.item-faq');
			const faqBody = faq.querySelector('.item-faq__body');
			faq.classList.toggle('active');
			toggle(faqBody, {
				miliseconds: 300,
				transitionFunction: 'ease',
			});
		}

		const hamburger = e.target.closest('.hamburger');
		if (hamburger) {
			mobileMenu.classList.toggle('active');
			body.classList.toggle('blur');
			html.classList.toggle('lock');
		}

		if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger') && mobileMenu.classList.contains('active')) {
			closeMenu();
		}

		const modalRestore = e.target.closest('.modal .form-auth__restore-password');
		if (modalRestore) {
			MicroModal.close('modal-login');
			MicroModal.show('modal-restore-password', mmopts);
		}

		const langBtn = e.target.closest('.lang__current');
		if (langBtn) {
			lang.classList.toggle('active');
		}

		if (!e.target.closest('.lang') && lang.classList.contains('active')) {
			lang.classList.remove('active');
		}

		const mobileMenuLink = e.target.closest('.nav-mobile-menu a');
		if (mobileMenuLink) {
			closeMenu();
		}
	});

	// Ticker
	if (ticker) {
		window.addEventListener('scroll', function () {
			if (window.pageYOffset > 0) {
				ticker.classList.add('active');
			}
		});
	}

	// Sidebar
	let navItems = document.querySelectorAll(".panel-sidebar a");
	let navItemHome = document.querySelector('.panel-sidebar a[href="#"]');
	let firstSection = document.querySelector('.home > section, .content-page > section');

	const highlightMenu = function () {
		let fromTop = window.scrollY + 300;

		navItems.forEach(link => {
			let section = document.getElementById(link.hash.substr(1));
			if (!section && !firstSection) return;

			if (navItemHome) {
				if ((firstSection.offsetTop <= fromTop && firstSection.offsetTop + firstSection.offsetHeight > fromTop) || fromTop <= firstSection.offsetTop) {
					navItemHome.parentElement.classList.add("current-menu-item");
					return;
				} else {
					navItemHome.parentElement.classList.remove("current-menu-item");
				}
			}

			if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
				link.parentElement.classList.add("current-menu-item");
				return;
			} else {
				link.parentElement.classList.remove("current-menu-item");
			}
		});
	}

	window.addEventListener("scroll", highlightMenu);

	// Helpers
	function isStrEmpty(str) {
		return !str.trim().length;
	}

	// Forms
	function doFetch(url, settings = {}) {
		return fetch(url, {
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
			...settings
		});
	}

	// Form for stag
	function doFetchStag(url, settings = {}) {
		return fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			...settings
		});
	}

	const getError = function (control, err) {
		let type = '';
		switch (err) {
			case "can't be blank":
				type = "blank";
				break;
			case "not found" || "не найден":
				type = "notFound";
				break;
			case "invalid email":
				type = "wrongEmail";
				break;
			case "is too short (minimum is 6 characters)":
				type = "tooShort";
				break;
			case "is too long (maximum is 70 characters)":
				type = "tooLongS";
				break;
			case "is too long (maximum is 128 characters)":
				type = "tooLong";
				break;
			case "doesn't match Password":
				type = "notMatchesServer";
				break;
			case "must be accepted":
				type = "accept";
				break;
			default:
				break;
		}
		return control.dataset[type] ? control.dataset[type] : err;
	}

	function showErrors(errors, form) {
		if (!form) return;

		const errorsList = errors.errors;
		const errorSingle = errors.error;

		if (errorsList) {
			Object.keys(errorsList).forEach((key) => {
				errorsList[key].forEach((err) => {
					const control = form.querySelector(`.form__control[name="${key}"], .form__checkbox .checkbox__input[name="${key}"]`);
					if (control) {
						showControlError(control, getError(control, err));
					} else {
						showFormError(form, err);
					}
				});
			});
		} else if (errorSingle) {
			const err = form.querySelector('.single-error').value;
			showFormError(form, err);
		}
	}

	function resetControl(control) {
		control.classList.remove('is-valid');
		control.classList.remove('is-invalid');

		const wrapper = control.closest('.form__controls');
		if (!wrapper) return;

		const err = wrapper.querySelector(`.msg-form[data-name="${control.name}"]`);
		if (!err) return;

		wrapper.removeChild(err);
	}

	function showFormError(form, msg) {
		const wrapper = form.querySelector('.form__controls');
		if (!wrapper) return;

		const err = wrapper.querySelector(`.msg-form[data-name="${msg}"]`);
		if (err) return;

		const template = errorTemplate(msg, {
			name: msg
		});
		wrapper.insertAdjacentHTML('beforeend', template);
	}

	function showControlError(control, msg) {
		control.classList.remove('is-valid');
		control.classList.add('is-invalid');

		const wrapper = control.closest('.form__controls');
		if (!wrapper) return;

		const err = wrapper.querySelector(`.msg-form[data-name="${control.name}"]`);
		if (err) return;

		const templateMsg = msg || control.dataset.invalidMessage || 'Error';
		const template = errorTemplate(templateMsg, {
			name: control.name
		});
		wrapper.insertAdjacentHTML('beforeend', template);
	}

	function removeControlError(control) {
		control.classList.remove('is-invalid');
		control.classList.add('is-valid');

		const wrapper = control.closest('.form__controls');
		if (!wrapper) return;

		const err = wrapper.querySelector(`.msg-form[data-name="${control.name}"]`);
		if (!err) return;

		wrapper.removeChild(err);
	}

	function showPasswordsError(password1, password2) {
		password1.classList.remove('is-valid');
		password1.classList.add('is-invalid');
		password2.classList.remove('is-valid');
		password2.classList.add('is-invalid');

		const wrapper = password2.closest('.form__controls');
		if (!wrapper) return;

		const err = wrapper.querySelector(`.msg-form[data-name="${password2.name}"]`);
		if (err) return;

		const templateMsg = password2.dataset.passwordNotmatches || 'Error';
		const template = errorTemplate(templateMsg, {
			name: password2.name
		});
		wrapper.insertAdjacentHTML('beforeend', template);
	}

	function removePasswordsError(password1, password2) {
		password1.classList.remove('is-invalid');
		password1.classList.add('is-valid');
		password2.classList.remove('is-invalid');
		password2.classList.add('is-valid');

		const wrapper = password2.closest('.form__controls');
		if (!wrapper) return;

		const err = wrapper.querySelector(`.msg-form[data-name="${password2.name}"]`);
		if (!err) return;

		wrapper.removeChild(err);
	}

	function errorTemplate(msg, {
		name,
		isLogin
	}) {
		return `
			<div class="form__msg msg-form msg-form_danger ${typeof(isLogin) !== 'undefined' && isLogin ? 'msg-form_login' : ''}" data-name="${name}">
				<img src="${typeof(WPURLS) !== 'undefined' ? WPURLS.themeurl + '/' : ''}assets/img/icons/error.svg" alt="alt" class="msg-form__icon">
				<div class="msg-form__text">${msg}</div>
			</div>
		`;
	}

	const regExpDic = {
		shortStr: /^.{1,128}$/,
		email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,10}|[0-9]{1,3})(\]?)$/,
		notEmpty: /([^\s])/,
	}

	function validate(el) {
		if (el.type === 'checkbox') {
			if (el.checked) {
				return true;
			} else {
				return false;
			}
		}

		if (window.getComputedStyle(el.closest('.form__col'), null).display === 'none') {
			return true;
		}

		const regExpName = el.dataset.required;
		if (!regExpDic[regExpName]) return true;
		return regExpDic[regExpName].test(el.value);
	}

	function isFormValid(controls) {
		return controls.every(el => {
			return validate(el) === true;
		});
	}

	function validatePasswordsMatch(password1, password2) {
		const password1Val = password1.value;
		const password2Val = password2.value;

		if ((!isStrEmpty(password1Val) && !isStrEmpty(password2Val)) && password1Val === password2Val) {
			return true;
		} else {
			return false;
		}
	}

	const formJoin = document.forms['formJoin'];

	function onFormJoinSubmit(controls) {
		if(!isFormValid(controls)) return;

		const formData = new FormData(formJoin);

		const user = {};

		formData.forEach(function (value, key) {
			user[key] = value;
		});

		const data = {
			partner_user: user,
			withCredentials: withCredentials
		}

		doFetch(APIURL + formJoin.getAttribute('action'), {
				method: 'POST',
				body: JSON.stringify(data)
			})
			.then(res => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(res);
			})
			.then(data => {
				console.log(data);
				alert(document.querySelector(".register-msg").value);
			})
			.catch(err => {
				err.json().then((msg) => {
					showErrors(msg, formJoin);
				})
			});
	}

	if (formJoin) {
		const submitBtn = formJoin.querySelector('.form__btn[type="submit"]');
		const controls = [...formJoin.querySelectorAll('.form-join__control, .form-join__checkbox .checkbox__input')];
		const checkboxes = formJoin.querySelectorAll('.form-join__checkbox .checkbox__input');
		const contactType = document.querySelector('.form-join__select');
		const skype = document.querySelector('.form-join__control[name="skype"]');
		const telegram = document.querySelector('.form-join__control[name="telegram"]');

		formJoin.addEventListener('submit', function (e) {
			e.preventDefault();

			onFormJoinSubmit(controls);
		});

		controls.forEach(function (control) {
			control.addEventListener('input', function () {
				if (isFormValid(controls)) {
					submitBtn.disabled = false;
				} else {
					submitBtn.disabled = true;
				}

				if (control.name === 'password' || control.name === 'password_confirmation') {
					const password1 = document.querySelector('.form-join__control[name="password"]');
					const password2 = document.querySelector('.form-join__control[name="password_confirmation"]');

					if (control.name === 'password' && isStrEmpty(password2.value)) {
						if (validate(control)) {
							removeControlError(control);
							return;
						} else {
							showControlError(control);
							return;
						}
					}

					if (validatePasswordsMatch(password1, password2)) {
						removePasswordsError(password1, password2);
					} else {
						showPasswordsError(password1, password2);
					}
					return;
				}

				if (validate(control)) {
					removeControlError(control);
				} else {
					showControlError(control);
				}

			});
		});

		checkboxes.forEach((el) => {
			el.addEventListener('change', function (e) {
				if (isFormValid(controls)) {
					submitBtn.disabled = false;
				} else {
					submitBtn.disabled = true;
				}
			});
		});

		if (contactType) {
			contactType.addEventListener('change', function () {
				if (isFormValid(controls)) {
					submitBtn.disabled = false;
				} else {
					submitBtn.disabled = true;
				}

				if (contactType.value === 'telegram') {
					skype.closest('.form-join__col').style.display = 'none';
					telegram.closest('.form-join__col').style.display = 'block';
					skype.value = '';
					resetControl(skype);
				} else if (contactType.value === 'skype') {
					skype.closest('.form-join__col').style.display = 'block';
					telegram.closest('.form-join__col').style.display = 'none';
					telegram.value = '';
					resetControl(telegram);
				} else {
					return;
				}
			});

			if (contactType.value === 'telegram') {
				skype.closest('.form-join__col').style.display = 'none';
				telegram.closest('.form-join__col').style.display = 'block';
			} else if (contactType.value === 'skype') {
				skype.closest('.form-join__col').style.display = 'block';
				telegram.closest('.form-join__col').style.display = 'none';
			}
		}
	}

	const formsLogin = [document.forms['formLogin'], document.forms['modalFormLogin']];

	function onFormLoginSubmit(controls, form) {
		if (!isFormValid(controls)) return;

		const formData = new FormData(form);

		const user = {};

		formData.forEach(function (value, key) {
			user[key] = value;
		});

		const data = {
			partner_user: user
		}

		doFetch(APIURL + form.getAttribute('action'), {
				method: 'POST',
				body: JSON.stringify(data),
				credentials: "include"
			})
			.then(res => {
				console.log(res);
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(res);
			})
			.then(data => {
				console.log(data);
				window.location.href = "https://www.loft.partners/partner/dashboard";
			})
			.catch(err => {
				err.json().then((msg) => {
					showErrors(msg, form);
				})
			});
	}

	formsLogin.forEach((form) => {
		if (form) {
			const submitBtn = form.querySelector('.form__btn[type="submit"]');
			const controls = [...form.querySelectorAll('.form-auth__control, .form-auth__checkbox .checkbox__input')];
			const checkboxes = form.querySelectorAll('.form-auth__checkbox .checkbox__input');

			form.addEventListener('submit', function (e) {
				e.preventDefault();

				onFormLoginSubmit(controls, form);
			});

			controls.forEach(function (control) {
				control.addEventListener('input', function () {
					if (isFormValid(controls)) {
						submitBtn.disabled = false;
					} else {
						submitBtn.disabled = true;
					}

					if (validate(control)) {
						removeControlError(control);
					} else {
						showControlError(control);
					}
				});
			});

			checkboxes.forEach((el) => {
				el.addEventListener('change', function (e) {
					if (isFormValid(controls)) {
						submitBtn.disabled = false;
					} else {
						submitBtn.disabled = true;
					}
				});
			});
		}
	});

	const formsRestore = [document.forms['formRestorePassword'], document.forms['modalFormRestorePassword']];

	function onFormRestoreSubmit(controls, form) {
		if (!isFormValid(controls)) return;

		const formData = new FormData(form);

		const user = {};

		formData.forEach(function (value, key) {
			user[key] = value;
		});

		const data = {
			partner_user: user
		}

		doFetch(APIURL + form.getAttribute('action'), {
				method: 'POST',
				body: JSON.stringify(data)
			})
			.then(res => {
				if (res.ok) {
					console.log(res);
					alert(document.querySelector(".restore-msg").value)
					return res.json();
				}
				return Promise.reject(res);
			})
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				err.json().then((msg) => {
					showErrors(msg, form);
				})
			});
	}

	formsRestore.forEach((form) => {
		if (form) {
			const submitBtn = form.querySelector('.form__btn[type="submit"]');
			const controls = [...form.querySelectorAll('.form-auth__control, .form-auth__checkbox .checkbox__input')];
			const checkboxes = form.querySelectorAll('.form-auth__checkbox .checkbox__input');

			form.addEventListener('submit', function (e) {
				e.preventDefault();

				onFormRestoreSubmit(controls, form);
			});

			controls.forEach(function (control) {
				control.addEventListener('input', function () {
					if (isFormValid(controls)) {
						submitBtn.disabled = false;
					} else {
						submitBtn.disabled = true;
					}

					if (validate(control)) {
						removeControlError(control);
					} else {
						showControlError(control);
					}
				});
			});

			checkboxes.forEach((el) => {
				el.addEventListener('change', function (e) {
					if (isFormValid(controls)) {
						submitBtn.disabled = false;
					} else {
						submitBtn.disabled = true;
					}
				});
			});
		}
	})

});