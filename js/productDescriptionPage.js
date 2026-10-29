// Серое меню, язык и тёмная тема — как на главной.
(function () {
    var nav = document.querySelector(".gray-nav");
    if (!nav) {
        return;
    }

    var navButtons = nav.querySelectorAll(".gray-nav-btn");
    var navList = nav.querySelector(".gray-nav-list");
    var drop = nav.querySelector(".gray-nav-drop");
    var dropButton = nav.querySelector(".gray-nav-drop-btn");
    var dropMenu = nav.querySelector(".gray-nav-menu");
    var langDrop = nav.querySelector(".lang-drop");
    var langButton = nav.querySelector(".lang-btn");
    var langButtonText = nav.querySelector(".lang-btn-text");
    var langMenu = nav.querySelector(".lang-menu");
    var themeButton = nav.querySelector(".theme-switch");
    var themeKey = "theme";

    navButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            navButtons.forEach(function (other) {
                other.classList.remove("active");
                other.removeAttribute("aria-current");
            });
            button.classList.add("active");
            button.setAttribute("aria-current", "page");
        });
    });

    function placeDropMenu() {
        var rect = dropButton.getBoundingClientRect();
        var menuWidth = 180;
        var left = rect.left;

        if (left + menuWidth > window.innerWidth - 12) {
            left = Math.max(12, window.innerWidth - menuWidth - 12);
        }

        dropMenu.style.top = rect.bottom + 8 + "px";
        dropMenu.style.left = left + "px";
    }

    function openDrop() {
        closeLang();
        placeDropMenu();
        drop.classList.add("open");
        dropButton.setAttribute("aria-expanded", "true");
        dropMenu.hidden = false;
    }

    function closeDrop() {
        drop.classList.remove("open");
        dropButton.setAttribute("aria-expanded", "false");
        dropMenu.hidden = true;
    }

    function placeLangMenu() {
        var rect = langButton.getBoundingClientRect();
        var menuWidth = langMenu.offsetWidth;
        var left = rect.left + (rect.width - menuWidth) / 2;

        if (left < 12) {
            left = 12;
        }
        if (left + menuWidth > window.innerWidth - 12) {
            left = window.innerWidth - menuWidth - 12;
        }

        langMenu.style.top = rect.bottom + 8 + "px";
        langMenu.style.left = left + "px";
    }

    function openLang() {
        closeDrop();
        langMenu.hidden = false;
        placeLangMenu();
        langDrop.classList.add("open");
        langButton.setAttribute("aria-expanded", "true");
    }

    function closeLang() {
        langDrop.classList.remove("open");
        langButton.setAttribute("aria-expanded", "false");
        langMenu.hidden = true;
    }

    dropButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (dropMenu.hidden) {
            openDrop();
        } else {
            closeDrop();
        }
    });

    langButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (langMenu.hidden) {
            openLang();
        } else {
            closeLang();
        }
    });

    langMenu.querySelectorAll(".lang-option").forEach(function (button) {
        button.addEventListener("click", function () {
            langMenu.querySelectorAll(".lang-option").forEach(function (other) {
                other.classList.remove("is-selected");
            });
            button.classList.add("is-selected");
            langButtonText.textContent = button.textContent;
            closeLang();
        });
    });

    document.addEventListener("click", function (event) {
        if (!drop.contains(event.target)) {
            closeDrop();
        }
        if (!langDrop.contains(event.target)) {
            closeLang();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeDrop();
            closeLang();
        }
    });

    dropMenu.querySelectorAll("button").forEach(function (button) {
        button.addEventListener("click", function () {
            closeDrop();
        });
    });

    window.addEventListener("resize", function () {
        if (!dropMenu.hidden) {
            placeDropMenu();
        }
        if (!langMenu.hidden) {
            placeLangMenu();
        }
    });

    navList.addEventListener("scroll", function () {
        if (!dropMenu.hidden) {
            placeDropMenu();
        }
    });

    function applyTheme(theme) {
        var isDark = theme === "dark";

        if (isDark) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        themeButton.setAttribute("aria-pressed", isDark ? "true" : "false");
        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme",
        );
    }

    var savedTheme = "light";
    try {
        savedTheme = localStorage.getItem(themeKey) || "light";
    } catch (error) {
        savedTheme = "light";
    }
    applyTheme(savedTheme);

    themeButton.addEventListener("click", function () {
        var isDark =
            document.documentElement.getAttribute("data-theme") === "dark";
        var nextTheme = isDark ? "light" : "dark";

        try {
            localStorage.setItem(themeKey, nextTheme);
        } catch (error) {}

        applyTheme(nextTheme);
    });
})();

var catalogBtn = document.querySelector(".catalog-btn");
var catalog = document.querySelector("#header-second-section .catalog");
var categories = document.querySelectorAll("#header-second-section .catalog-categories .category");
var panels = document.querySelectorAll("#header-second-section .catalog-panels .panel");

if (catalogBtn && catalog) {
    catalogBtn.addEventListener("click", function () {
        catalog.classList.toggle("show");
        catalogBtn.classList.toggle("open");
    });

    categories.forEach(function (category) {
        category.addEventListener("mouseover", function () {
            var number = this.getAttribute("data-cat");
            categories.forEach(function (c) {
                c.classList.remove("active");
            });
            panels.forEach(function (p) {
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
}

// Миниатюры меняют большое фото.
var mainPhoto = document.querySelector(".gallery-main img");
var thumbs = document.querySelectorAll(".gallery-thumbs .thumb");

thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
        thumbs.forEach(function (item) {
            item.classList.remove("active");
        });
        this.classList.add("active");
        if (mainPhoto) {
            mainPhoto.src = this.querySelector("img").src;
        }
    });
});

var favBtn = document.querySelector(".icon-actions .fav-btn");
if (favBtn) {
    favBtn.addEventListener("click", function () {
        this.classList.toggle("on");
    });
}
