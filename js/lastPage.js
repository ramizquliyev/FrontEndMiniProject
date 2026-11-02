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

// Сортировка товаров
let sortTabs = document.querySelectorAll("#catalog-top-section .sort-tab");
let productsBox = document.querySelector("#catalog-products-section .products-side .products");
let firstCards = [];
document.querySelectorAll("#catalog-products-section .products-side .products .item").forEach((card) => {
    firstCards.push(card);
});

sortTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
        sortTabs.forEach((other) => {
            other.classList.remove("active");
        });
        this.classList.add("active");

        let name = this.getAttribute("data-tab");
        let list = [];
        firstCards.forEach((card) => {
            list.push(card);
        });

        if (name === "discount") {
            list.sort(function (a, b) {
                let aOld = 0;
                let bOld = 0;
                if (a.querySelector(".discount")) {
                    aOld = Number(a.querySelector(".discount").innerText.replace("₼", ""));
                }
                if (b.querySelector(".discount")) {
                    bOld = Number(b.querySelector(".discount").innerText.replace("₼", ""));
                }
                let aNow = Number(a.querySelector(".currentPrice").innerText.replace("₼", ""));
                let bNow = Number(b.querySelector(".currentPrice").innerText.replace("₼", ""));
                return (bOld - bNow) - (aOld - aNow);
            });
        }

        if (name === "cheap") {
            list.sort(function (a, b) {
                let aNow = Number(a.querySelector(".currentPrice").innerText.replace("₼", ""));
                let bNow = Number(b.querySelector(".currentPrice").innerText.replace("₼", ""));
                return aNow - bNow;
            });
        }

        if (name === "expensive") {
            list.sort(function (a, b) {
                let aNow = Number(a.querySelector(".currentPrice").innerText.replace("₼", ""));
                let bNow = Number(b.querySelector(".currentPrice").innerText.replace("₼", ""));
                return bNow - aNow;
            });
        }

        list.forEach((card) => {
            productsBox.appendChild(card);
        });
    });
});

// Вид карточек
let viewBtns = document.querySelectorAll("#catalog-top-section .view-btn");
viewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        viewBtns.forEach((other) => {
            other.classList.remove("active");
        });
        this.classList.add("active");
    });
});

// Daha çox / Daha az
let moreBtn = document.querySelector("#catalog-products-section .more-btn");
let extraCats = document.querySelector("#catalog-products-section .extra-cats");

moreBtn.addEventListener("click", function () {
    extraCats.classList.toggle("open");
    if (extraCats.classList.contains("open")) {
        moreBtn.innerHTML = "Daha az <span>˄</span>";
    } else {
        moreBtn.innerHTML = "Daha çox <span>˅</span>";
    }
});

// Пагинация
let pageNums = document.querySelectorAll("#catalog-pages-section .page-num");
let pageArrows = document.querySelectorAll("#catalog-pages-section .page-arrow");
let leftPage = pageArrows[0];
let rightPage = pageArrows[1];

pageNums.forEach((btn) => {
    btn.addEventListener("click", function () {
        pageNums.forEach((other) => {
            other.classList.remove("active");
        });
        this.classList.add("active");
    });
});

leftPage.addEventListener("click", function () {
    let prevNum;
    let sawActive = false;
    pageNums.forEach((num) => {
        if (num.classList.contains("active")) {
            sawActive = true;
        }
        if (sawActive === false) {
            prevNum = num;
        }
    });
    if (prevNum) {
        pageNums.forEach((num) => {
            num.classList.remove("active");
        });
        prevNum.classList.add("active");
    }
});

rightPage.addEventListener("click", function () {
    let nextNum;
    let found = false;
    pageNums.forEach((num) => {
        if (found === true) {
            if (nextNum === undefined) {
                nextNum = num;
            }
        }
        if (num.classList.contains("active")) {
            found = true;
        }
    });
    if (nextNum) {
        pageNums.forEach((num) => {
            num.classList.remove("active");
        });
        nextNum.classList.add("active");
    }
});

// Стрелки recent
let recentList = document.querySelector("#recent-section .list-wrap .products");
let leftBtn = document.querySelector("#recent-section .left-btn");
let rightBtn = document.querySelector("#recent-section .right-btn");
let move = 0;

leftBtn.addEventListener("click", function () {
    move = move + 314;
    if (move > 0) {
        move = 0;
    }
    recentList.style.marginLeft = move + "px";
});

rightBtn.addEventListener("click", function () {
    move = move - 314;
    if (move < -628) {
        move = -628;
    }
    recentList.style.marginLeft = move + "px";
});
