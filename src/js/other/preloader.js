'use strict';
// Preloader
const preloader = document.querySelector('.preloader');
if(preloader) {
	let currentImage = 0;
	let images = document.querySelectorAll('.preloader__img');

	let id;
	function initSlideshow() {  
		setImage(0);
		id = setInterval(function() {
			nextImage();
		}, 200);
	}

	function nextImage() {
		if(images.length === currentImage + 1){
			currentImage = 0;
		} else {
			currentImage++;
		}
		setImage(currentImage);
	}

	function setImage(image) {
		images.forEach((image) => image.classList.remove('active'));
		images[image].classList.add('active');
	}

	initSlideshow();

	if (!sessionStorage.getItem('showPreloader')) {
		sessionStorage.setItem('showPreloader', 'true');
		setTimeout(function() {
			preloader.classList.add('hide');
			clearInterval(id);
		}, 2000);
	} else {
		setTimeout(function() {
			preloader.classList.add('hide');
			clearInterval(id);
		}, 500);
	}
}