// Gray nav under the black promo bar.
// Handles the active item, the "Digər" menu, the AZ/RU menu, and the theme.

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

    // Clicking a nav item makes it the active (black) one.
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

    // Keep the menu lined up under the "Digər" button.
    // position:fixed so the sideways scroll on small screens does not clip it.
    function placeDropMenu() {
        var rect = dropButton.getBoundingClientRect();
        var menuWidth = 180;
        var left = rect.left;

        if (left + menuWidth > window.innerWidth - 12) {
            left = Math.max(12, window.innerWidth - menuWidth - 12);
        }

        dropMenu.style.top = (rect.bottom + 8) + "px";
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

    // Center the language card under the AZ/RU button.
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

        langMenu.style.top = (rect.bottom + 8) + "px";
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

    // Clicking "Digər" opens the menu; clicking it again closes it.
    // stopPropagation so the document listener does not close it on this same click.
    dropButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (dropMenu.hidden) {
            openDrop();
        } else {
            closeDrop();
        }
    });

    // Clicking AZ/RU opens its menu; clicking it again closes it.
    langButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (langMenu.hidden) {
            openLang();
        } else {
            closeLang();
        }
    });

    // Picking AZ or RU only changes the label. The page is not translated.
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

    // A click outside either menu closes that menu.
    document.addEventListener("click", function (event) {
        if (!drop.contains(event.target)) {
            closeDrop();
        }
        if (!langDrop.contains(event.target)) {
            closeLang();
        }
    });

    // Escape closes whichever menu is open.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeDrop();
            closeLang();
        }
    });

    // Choosing one of the three items closes the menu.
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

    // Colors come from CSS variables. data-theme="dark" on <html> switches them.
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
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );
    }

    // Restore the theme the visitor picked last time.
    var savedTheme = "light";
    try {
        savedTheme = localStorage.getItem(themeKey) || "light";
    } catch (error) {
        savedTheme = "light";
    }
    applyTheme(savedTheme);

    themeButton.addEventListener("click", function () {
        var isDark = document.documentElement.getAttribute("data-theme") === "dark";
        var nextTheme = isDark ? "light" : "dark";

        try {
            localStorage.setItem(themeKey, nextTheme);
        } catch (error) {
            // Storage can be blocked. The theme still changes for this visit.
        }

        applyTheme(nextTheme);
    });
})();
