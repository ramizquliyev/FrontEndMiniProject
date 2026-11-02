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

// Миниатюры меняют большое фото
let mainPhoto = document.querySelector(".gallery-main .gallery-photo");
let thumbs = document.querySelectorAll(".gallery-thumbs .thumb");

thumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
        thumbs.forEach((item) => {
            item.classList.remove("active");
        });
        this.classList.add("active");
        mainPhoto.src = this.querySelector("img").src;
    });
});

let favBtn = document.querySelector(".fav-btn");
favBtn.addEventListener("click", function () {
    this.classList.toggle("on");
});

// Рассрочка: срок, ежемесячный платёж и первый взнос
let productPrice = 2399.99;
let months = 18;
let downPayment = 0;
let monthlyPay = document.getElementById("monthly-pay");
let totalPay = document.getElementById("total-pay");
let hissePrice = document.getElementById("hisse-price");
let hisseMonth = document.getElementById("hisse-month");
let downValue = document.getElementById("down-value");
let monthBtns = document.querySelectorAll(".month-btn");
let payPills = document.querySelectorAll(".pay-pill");
let downMinus = document.getElementById("down-minus");
let downPlus = document.getElementById("down-plus");

function updateCredit() {
    let left = productPrice - downPayment;
    let monthly = left / months;
    monthlyPay.textContent = monthly.toFixed(2) + " ₼";
    totalPay.textContent = left.toFixed(2) + " ₼";
    hissePrice.textContent = monthly.toFixed(2);
    hisseMonth.textContent = months;
    downValue.textContent = downPayment;
}

monthBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        monthBtns.forEach((item) => {
            item.classList.remove("active");
        });
        this.classList.add("active");
        months = Number(this.getAttribute("data-month"));
        updateCredit();
    });
});

payPills.forEach((pill) => {
    pill.addEventListener("click", function () {
        payPills.forEach((item) => {
            item.classList.remove("active");
        });
        this.classList.add("active");
    });
});

downMinus.addEventListener("click", function () {
    downPayment = downPayment - 50;
    if (downPayment < 0) {
        downPayment = 0;
    }
    updateCredit();
});

downPlus.addEventListener("click", function () {
    downPayment = downPayment + 50;
    if (downPayment > productPrice) {
        downPayment = productPrice;
    }
    updateCredit();
});

// Товары «купить вместе» и блок отзывов
let togetherBtns = document.querySelectorAll(".together-buy");
togetherBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        this.classList.toggle("on");
        if (this.classList.contains("on")) {
            this.textContent = "Əlavə olundu";
        } else {
            this.textContent = "+ Birlikdə al";
        }
    });
});

let specsCard = document.querySelector(".specs-card");
let specsToggle = document.querySelector(".specs-toggle");
specsToggle.addEventListener("click", function () {
    specsCard.classList.toggle("closed");
    if (specsCard.classList.contains("closed")) {
        this.innerHTML = "Göstərmək üçün kliklə <span>˅</span>";
    } else {
        this.innerHTML = "Kiçiltmək üçün kliklə <span>^</span>";
    }
});

let reviewsToggle = document.getElementById("reviews-toggle");
reviewsToggle.addEventListener("click", function () {
    let card = this.parentNode;
    let plus = this.querySelector(".info-plus");
    card.classList.toggle("open");
    if (card.classList.contains("open")) {
        plus.textContent = "−";
    } else {
        plus.textContent = "+";
    }
});
