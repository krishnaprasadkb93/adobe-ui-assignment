let slideIndex = 1;
let slides = document.getElementsByClassName("carousel__slides");
let dots = "";
let carousel_dots = document.createElement("div");

// create dots container
let createDotContainer = () => {
    carousel_dots.className = "carousel__dots";
    document.querySelector(".carousel").appendChild(carousel_dots);
};
// create dots based on the images
let crerateDots = () => {
    for (let i = 0; i < slides.length; i++) {
        var dot = document.createElement("div");
        dot.className = "carousel__dot";
        dot.addEventListener("click", () => carouselDotHandler(i + 1), false);
        dot.id = i + 1;
        carousel_dots.appendChild(dot);
    }
    dots = document.querySelectorAll(".carousel__dot");
};

//call funtions to append the dots
createDotContainer();
crerateDots();

// call initCarousel funtion
initCarousel(slideIndex);

// carousel next click
const carouselNextItem = () => {
    initCarousel((slideIndex += 1));
};
// carousel previous click
const carouselPrevItem = () => {
    initCarousel((slideIndex += -1));
};

// carousel dot click
const carouselDotHandler = n => {
    console.log(dots);
    initCarousel((slideIndex = n));
};

// carousal init
function initCarousel(n) {
    var i;
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex - 1].className += " active";
    slides[slideIndex - 1].style.display = "block";
}
// carousal create navigation controls
const createNavControls = () => {
    const carousel__next = document.createElement("div");
    carousel__next.className = "carousel__next";
    carousel__next.addEventListener("click", () => carouselNextItem(), false);
    const carousel__prev = document.createElement("div");
    carousel__prev.className = "carousel__prev";
    carousel__prev.addEventListener("click", () => carouselPrevItem(), false);
    document
        .querySelector(".carousel .carousel__container")
        .appendChild(carousel__next);
    document
        .querySelector(".carousel .carousel__container")
        .appendChild(carousel__prev);
};
// call createNavControls function
createNavControls();
