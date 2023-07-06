var isMobile = ('ontouchstart' in window);
let isHideSeoBlock = false;

let bodyElement = document.getElementsByTagName("body");
bodyElement[0].addEventListener(isMobile ? "touchend" : "mouseover", function(){
  if(isHideSeoBlock === false){
	isHideSeoBlock = true;
	document.querySelector(".js-rtl").classList.add('isHideContent');
  }
});


let rtlBtn = document.getElementsByClassName("js-showHideRtl");
for (i = 0; i < rtlBtn.length; ++i) {
  rtlBtn[i].addEventListener("click", function(){
	document.querySelector(".js-rtl").classList.toggle('isHideContent');
  });
};