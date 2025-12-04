window.addEventListener("load", function () {
    const loading = document.getElementById("loading");
    setTimeout(() => {
        loading.style.opacity = "0";
        loading.style.transition = "opacity 1s ease";
        setTimeout(() => {
            loading.style.display = "none";
            document.body.classList.remove("no-scroll");
            document.body.style.overflow = "auto"; // 🔥 스크롤 복구
            document.body.style.height = "auto";
        }, 1000);
    }, 4500); // 4.5초 뒤 제거하기
});

//제이쿼리
$(function () {
    $(".hamburger-btn").click(function () {
        $(".header-nav").toggleClass("on");
        $(".header-container").toggleClass("on");
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

var review = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        340: {
            slidesPerView: 1,
            spaceBetween: 15,
        },
        480: {
            slidesPerView: 1,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        960: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
    },
});

window.onload = () => {
    const slideContainer = document.querySelector('.reviews');
    const slides = document.querySelectorAll('.review-box');
    const prevBtn = document.querySelector('.arrow.left');
    const nextBtn = document.querySelector('.arrow.right');

    let currentIndex = 0;
    const gap = 24;
    const slideWidth = slides[0].getBoundingClientRect().width + gap;
    const totalSlides = slides.length;
    let visibleSlides = 3;
    let maxIndex = totalSlides - visibleSlides;

    slideContainer.style.transform = `translateX(0px)`;

    function updateSlidePosition() {
        slideContainer.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    function updateMaxIndex() {
        if (window.innerWidth < 480) visibleSlides = 1;
        else if (window.innerWidth < 768) visibleSlides = 2;
        else visibleSlides = 3;
        maxIndex = totalSlides - visibleSlides;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateSlidePosition();
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlidePosition();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlidePosition();
        }
    });

    window.addEventListener('resize', updateMaxIndex);
};

$(document).ready(function () {
    // .review-header 클릭 시 이벤트 처리
    $('.review-header').on('click', function () {
        // 1. 현재 클릭된 .review-header의 부모 요소(.review-item)를 찾습니다.
        const $reviewItem = $(this).closest('.review-item');

        // 2. 상세 내용을 담고 있는 .review-body를 찾습니다.
        const $reviewBody = $reviewItem.find('.review-body');

        // 3. 토글 버튼을 찾습니다. (aria-expanded 상태 변경용)
        const $toggleButton = $(this).find('.toggle-btn');

        // 4. 슬라이드 토글 애니메이션 실행
        // slideToggle()을 사용하면 max-height, display 등을 신경 쓰지 않아도 jQuery가 부드럽게 처리해 줍니다.
        $reviewBody.slideToggle(300, function () {
            // 애니메이션 완료 후 aria-expanded 상태 업데이트
            const isVisible = $reviewBody.is(':visible');
            $toggleButton.attr('aria-expanded', isVisible ? 'true' : 'false');

            // CSS의 .open 클래스 대신 is(':visible') 상태로 처리하여 arrow-down 회전을 제어합니다.
            // 버튼의 부모 요소(.review-header)에 'active' 클래스를 토글하여 CSS로 회전을 제어할 수 있습니다.
            // 하지만 현재는 aria-expanded 속성으로만 제어하는 것을 유지하겠습니다.
        });
    });
});



