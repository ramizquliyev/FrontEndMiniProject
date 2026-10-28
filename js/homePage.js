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
            isDark ? "Switch to light theme" : "Switch to dark theme",
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
        var isDark =
            document.documentElement.getAttribute("data-theme") === "dark";
        var nextTheme = isDark ? "light" : "dark";

        try {
            localStorage.setItem(themeKey, nextTheme);
        } catch (error) {
            // Storage can be blocked. The theme still changes for this visit.
        }

        applyTheme(nextTheme);
    });
})();

// Main image slider: autoplay every 4s, arrows, loop, translateX.
(function () {
    var imagesContainer = document.querySelector("#main-slider .images");
    if (!imagesContainer) {
        return;
    }

    // Slide photos only (not the arrow icons inside the buttons).
    var slides = imagesContainer.querySelectorAll(":scope > img");
    if (slides.length < 2) {
        return;
    }

    // Buttons sit inside .images, so we move only the photos in a track.
    // Then translateX on the track does not move the arrows.
    var track = document.createElement("div");
    track.style.display = "flex";
    track.style.alignItems = "inherit";
    track.style.gap = "inherit";
    track.style.flexShrink = "0";
    track.style.transition = "transform 0.5s ease";

    for (var i = 0; i < slides.length; i++) {
        track.appendChild(slides[i]);
    }
    // Put the track before the buttons so the arrows stay clickable on top.
    imagesContainer.insertBefore(
        track,
        imagesContainer.querySelector(".buttons"),
    );

    var currentIndex = 0;
    var intervalId;
    var isAnimating = false;

    // First button = left arrow, second button = right arrow.
    var arrowButtons = imagesContainer.querySelectorAll(".buttons button");
    var prevButton = arrowButtons[0];
    var nextButton = arrowButtons[1];

    // Furthest the track may move: the last slide, not the empty space after it.
    function getMaxOffset() {
        var lastSlide = slides[slides.length - 1];
        var lastSlideLeft = lastSlide.offsetLeft - slides[0].offsetLeft;
        var maxOffset = track.scrollWidth - imagesContainer.clientWidth;
        if (maxOffset > lastSlideLeft) {
            maxOffset = lastSlideLeft;
        }
        if (maxOffset < 0) {
            maxOffset = 0;
        }
        return maxOffset;
    }

    function goToSlide(index) {
        // Ignore extra clicks while the 0.5s animation is running.
        if (isAnimating) {
            return;
        }

        // Index is already wrapped in nextSlide / prevSlide. Use it as-is.
        currentIndex = index;
        isAnimating = true;

        // Step = distance between two neighbouring slides, including the gap.
        var step = slides[1].offsetLeft - slides[0].offsetLeft;
        // Translate only AFTER the index is corrected, never to an empty slot.
        var offset = currentIndex * step;
        var maxOffset = getMaxOffset();
        if (offset > maxOffset) {
            offset = maxOffset;
        }

        track.style.transform = "translateX(-" + offset + "px)";

        setTimeout(function () {
            isAnimating = false;
        }, 500);
    }

    function nextSlide() {
        if (isAnimating) {
            return;
        }
        var step = slides[1].offsetLeft - slides[0].offsetLeft;
        var maxOffset = getMaxOffset();
        // Already on the last real slide (do not take one more step into empty space).
        var atLastVisible = maxOffset > 0 && currentIndex * step >= maxOffset;
        // Real last index is slides.length - 1 (not slides.length).
        if (currentIndex >= slides.length - 1 || atLastVisible) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        goToSlide(currentIndex);
    }

    function prevSlide() {
        if (isAnimating) {
            return;
        }
        if (currentIndex <= 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex--;
        }
        goToSlide(currentIndex);
    }

    function startAutoplay() {
        intervalId = setInterval(nextSlide, 4000);
    }

    function resetAutoplay() {
        clearInterval(intervalId);
        startAutoplay();
    }

    prevButton.addEventListener("click", function () {
        prevSlide();
        resetAutoplay();
    });

    nextButton.addEventListener("click", function () {
        nextSlide();
        resetAutoplay();
    });

    startAutoplay();
})();



var tabmenu = document.querySelectorAll(
    "#tabmenu-text-section .main-div .tabMenu-div ul li a",
);

tabmenu.forEach((element) => {
    element.addEventListener("click", function (a) {
        a.preventDefault();
        if (!this.classList.contains("activeTabMenuElem")) {
            var active = document.querySelector(
                "#tabmenu-text-section .main-div .tabMenu-div ul li .activeTabMenuElem",
            );

            active.classList.remove("activeTabMenuElem");
            this.classList.add("activeTabMenuElem");
        }
    });
});



var tabs = document.querySelectorAll("#tabmenu-text-section .main-div .tabMenu-div ul li a");
var productBlocks = document.querySelectorAll("#tabMenuProducts-section .products");



tabs.forEach(element => {
    element.addEventListener("click",function(){
        tabs.forEach(t => t.classList.remove("activeTabMenuElem"));      
        productBlocks.forEach(b => b.classList.remove("active"));        

        element.classList.add("activeTabMenuElem");                      
        document.getElementById(element.dataset.tab).classList.add("active");   
    })
});


/* Открытие и закрытие окна с видео */
var cards = document.querySelectorAll("#videos-section .video-card");
var modal = document.querySelector("#videos-section .video-modal");
var iframes = document.querySelectorAll("#videos-section .video-modal-frame iframe");
var closeBtn = document.querySelector("#videos-section .video-modal-close");

cards.forEach(function (card, i) {
    card.addEventListener("click", function () {
        iframes[0].classList.remove("active");
        iframes[1].classList.remove("active");
        iframes[2].classList.remove("active");
        iframes[i].classList.add("active");
        modal.classList.add("show");
    });
});

closeBtn.addEventListener("click", function () {
    modal.classList.remove("show");
    iframes[0].classList.remove("active");
    iframes[1].classList.remove("active");
    iframes[2].classList.remove("active");
    iframes[0].src = iframes[0].src;
    iframes[1].src = iframes[1].src;
    iframes[2].src = iframes[2].src;
});

modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.classList.remove("show");
        iframes[0].classList.remove("active");
        iframes[1].classList.remove("active");
        iframes[2].classList.remove("active");
        iframes[0].src = iframes[0].src;
        iframes[1].src = iframes[1].src;
        iframes[2].src = iframes[2].src;
    }
});