const slides = document.querySelectorAll(".slideshow");

let index = [];

slides.forEach((s,i)=>{
index[i]=0;
});

function showSlide(n,slideIndex){

const imgs = slides[slideIndex].querySelectorAll("img");

if(n>=imgs.length) index[slideIndex]=0;
if(n<0) index[slideIndex]=imgs.length-1;

imgs.forEach(img=>img.classList.remove("curr"));

imgs[index[slideIndex]].classList.add("curr");

}

function next(i){
index[i]++;
showSlide(index[i],i);
}

function previous(i){
index[i]--;
showSlide(index[i],i);
}

function openNav(){
document.getElementById("sidepanel").style.width="250px";
}

function closeNav(){
document.getElementById("sidepanel").style.width="0";
}