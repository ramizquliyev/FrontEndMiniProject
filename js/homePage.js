// Серое меню
let navButtons = document.querySelectorAll(".gray-nav .gray-nav-btn");
let drop = document.querySelector(".gray-nav .gray-nav-drop");
let dropButton = document.querySelector(".gray-nav .gray-nav-drop-btn");
let dropMenu = document.querySelector(".gray-nav .gray-nav-menu");
let langDrop = document.querySelector(".gray-nav .lang-drop");
let langButton = document.querySelector(".gray-nav .lang-btn");
let langButtonText = document.querySelector(".gray-nav .lang-btn-text");
let langMenu = document.querySelector(".gray-nav .lang-menu");
let themeButton = document.querySelector(".gray-nav .theme-switch");

navButtons.forEach((button) => {
    button.addEventListener("click", function () {
        navButtons.forEach((other) => {
            other.classList.remove("active");
        });
        this.classList.add("active");
    });
});

// Меню Digər
dropButton.addEventListener("click", function () {
    if (dropMenu.hidden === true) {
        langDrop.classList.remove("open");
        langMenu.hidden = true;
        let rect = dropButton.getBoundingClientRect();
        dropMenu.style.top = rect.bottom + 8 + "px";
        dropMenu.style.left = rect.left + "px";
        drop.classList.add("open");
        dropMenu.hidden = false;
    } else {
        drop.classList.remove("open");
        dropMenu.hidden = true;
    }
});

dropMenu.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function () {
        drop.classList.remove("open");
        dropMenu.hidden = true;
    });
});

// Язык AZ / RU
langButton.addEventListener("click", function () {
    if (langMenu.hidden === true) {
        drop.classList.remove("open");
        dropMenu.hidden = true;
        langMenu.hidden = false;
        langDrop.classList.add("open");
    } else {
        langDrop.classList.remove("open");
        langMenu.hidden = true;
    }
});

langMenu.querySelectorAll(".lang-option").forEach((button) => {
    button.addEventListener("click", function () {
        langMenu.querySelectorAll(".lang-option").forEach((other) => {
            other.classList.remove("is-selected");
        });
        this.classList.add("is-selected");
        langButtonText.textContent = this.textContent;
        langDrop.classList.remove("open");
        langMenu.hidden = true;
    });
});

document.addEventListener("click", function (e) {
    if (!drop.contains(e.target)) {
        drop.classList.remove("open");
        dropMenu.hidden = true;
    }
    if (!langDrop.contains(e.target)) {
        langDrop.classList.remove("open");
        langMenu.hidden = true;
    }
});

// Тема
if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
}

themeButton.addEventListener("click", function () {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
});

// Слайдер
let imagesContainer = document.querySelector("#main-slider .images");
let slides = document.querySelectorAll("#main-slider .images > img");
let arrowButtons = document.querySelectorAll("#main-slider .images .buttons button");
let prevButton = arrowButtons[0];
let nextButton = arrowButtons[1];

let track = document.createElement("div");
track.style.display = "flex";
track.style.alignItems = "inherit";
track.style.gap = "inherit";
track.style.flexShrink = "0";
track.style.transition = "transform 0.5s ease";

slides.forEach((slide) => {
    track.appendChild(slide);
});
imagesContainer.insertBefore(track, document.querySelector("#main-slider .images .buttons"));

let nomer = 0;
let timer;

function goSlide() {
    let shag = slides[1].offsetLeft - slides[0].offsetLeft;
    let sdvig = nomer * shag;
    let maxSdvig = track.scrollWidth - imagesContainer.clientWidth;
    if (sdvig > maxSdvig) {
        sdvig = maxSdvig;
    }
    track.style.transform = "translateX(-" + sdvig + "px)";
}

function nextSlide() {
    let shag = slides[1].offsetLeft - slides[0].offsetLeft;
    let maxSdvig = track.scrollWidth - imagesContainer.clientWidth;
    if (nomer >= slides.length - 1 || nomer * shag >= maxSdvig) {
        nomer = 0;
    } else {
        nomer = nomer + 1;
    }
    goSlide();
}

function prevSlide() {
    if (nomer <= 0) {
        nomer = slides.length - 1;
    } else {
        nomer = nomer - 1;
    }
    goSlide();
}

function startSlider() {
    timer = setInterval(nextSlide, 4000);
}

prevButton.addEventListener("click", function () {
    prevSlide();
    clearInterval(timer);
    startSlider();
});

nextButton.addEventListener("click", function () {
    nextSlide();
    clearInterval(timer);
    startSlider();
});

startSlider();

// Табы с товарами
let tabs = document.querySelectorAll("#tabmenu-text-section .main-div .tabMenu-div ul li a");
let productBlocks = document.querySelectorAll("#tabMenuProducts-section .products");

tabs.forEach((a) => {
    a.addEventListener("click", function (e) {
        e.preventDefault();
        tabs.forEach((t) => {
            t.classList.remove("activeTabMenuElem");
        });
        productBlocks.forEach((b) => {
            b.classList.remove("active");
        });
        this.classList.add("activeTabMenuElem");
        document.getElementById(this.getAttribute("data-tab")).classList.add("active");
    });
});

// Видео-окно
let cards = document.querySelectorAll("#videos-section .video-card");
let modal = document.querySelector("#videos-section .video-modal");
let iframes = document.querySelectorAll("#videos-section .video-modal-frame iframe");
let closeBtn = document.querySelector("#videos-section .video-modal-close");

cards.forEach((card, i) => {
    card.addEventListener("click", function () {
        iframes.forEach((frame) => {
            frame.classList.remove("active");
        });
        iframes[i].classList.add("active");
        modal.classList.add("show");
    });
});

closeBtn.addEventListener("click", function () {
    modal.classList.remove("show");
    iframes.forEach((frame) => {
        frame.classList.remove("active");
        frame.src = frame.src;
    });
});

modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.classList.remove("show");
        iframes.forEach((frame) => {
            frame.classList.remove("active");
            frame.src = frame.src;
        });
    }
});

// Лента логотипов
let advertLine = document.querySelector("#advertisment-section .advertLine-div");
let advertTrack = document.querySelector("#advertisment-section .advert-track");
let advertCards = document.querySelectorAll("#advertisment-section .advert-card");
let advertHalf = advertCards.length / 2;
let advertShag = advertCards[1].offsetLeft - advertCards[0].offsetLeft;
let advertOffset = 0;
let advertDragging = false;
let advertStartX = 0;
let advertStartOffset = 0;

function advertWrap() {
    let cycle = advertShag * advertHalf;
    if (advertOffset <= 0 - cycle) {
        advertOffset = advertOffset + cycle;
    }
    if (advertOffset > 0) {
        advertOffset = advertOffset - cycle;
    }
}

setInterval(function () {
    if (advertDragging === false) {
        advertTrack.style.transition = "transform 0.6s ease";
        advertOffset = advertOffset - advertShag;
        advertTrack.style.transform = "translateX(" + advertOffset + "px)";
        setTimeout(function () {
            if (advertDragging === false) {
                advertTrack.style.transition = "none";
                advertWrap();
                advertTrack.style.transform = "translateX(" + advertOffset + "px)";
            }
        }, 650);
    }
}, 4000);

advertLine.addEventListener("mousedown", function (e) {
    e.preventDefault();
    advertDragging = true;
    advertLine.classList.add("is-dragging");
    advertTrack.style.transition = "none";
    advertStartX = e.clientX;
    advertStartOffset = advertOffset;
});

document.addEventListener("mousemove", function (e) {
    if (advertDragging === true) {
        let moveX = e.clientX - advertStartX;
        advertOffset = advertStartOffset + moveX;
        advertWrap();
        advertStartOffset = advertOffset - moveX;
        advertTrack.style.transform = "translateX(" + advertOffset + "px)";
    }
});

document.addEventListener("mouseup", function () {
    if (advertDragging === true) {
        advertDragging = false;
        advertLine.classList.remove("is-dragging");
        advertWrap();
        advertTrack.style.transform = "translateX(" + advertOffset + "px)";
        advertTrack.style.transition = "transform 0.6s ease";
    }
});

// Каталог
let catalogBtn = document.querySelector("#header-second-section .catalog-btn");
let catalog = document.querySelector("#header-second-section .catalog");
let categories = document.querySelectorAll("#header-second-section .catalog-categories .category");
let panels = document.querySelectorAll("#header-second-section .catalog-panels .panel");

catalogBtn.addEventListener("click", function () {
    catalog.classList.toggle("show");
    catalogBtn.classList.toggle("open");
});

categories.forEach((category) => {
    category.addEventListener("mouseover", function () {
        let number = this.getAttribute("data-cat");
        categories.forEach((c) => {
            c.classList.remove("active");
        });
        panels.forEach((p) => {
            p.classList.remove("active");
        });
        this.classList.add("active");
        document.querySelector('.catalog-panels .panel[data-panel="' + number + '"]').classList.add("active");
    });
});

document.addEventListener("click", function (e) {
    if (!catalog.contains(e.target) && !catalogBtn.contains(e.target)) {
        catalog.classList.remove("show");
        catalogBtn.classList.remove("open");
    }
});
