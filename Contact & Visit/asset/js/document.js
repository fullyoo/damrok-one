
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

document.addEventListener('DOMContentLoaded', function () {
    // 모든 토글 버튼을 선택합니다.
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 클릭된 버튼이 속한 리뷰 아이템(.review-item)을 찾습니다.
            const reviewItem = this.closest('.review-item');

            // 상세 내용을 담고 있는 요소(.review-body)를 찾습니다.
            // 버튼의 aria-expanded 속성을 통해 ID를 찾거나, DOM 구조를 이용할 수 있습니다.
            // 현재 HTML 구조에서는 review-item 내의 다음 형제 요소가 review-body가 될 수 있지만,
            // ID를 이용하는 것이 더 안전하고 명확합니다.
            const reviewId = this.parentElement.getAttribute('data-review-id');
            const reviewBody = reviewItem.querySelector(`#review-${reviewId}-detail`);

            // 상세 내용 표시 상태를 확인합니다.
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // 상태를 전환합니다.
            if (isExpanded) {
                // 펼쳐져 있으면 닫습니다.
                reviewBody.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
            } else {
                // 닫혀 있으면 펼칩니다.
                // *선택 사항: 다른 모든 펼쳐진 리뷰를 닫고 현재 리뷰만 펼치려면 아래 주석 처리된 코드를 사용하세요.
                // closeAllReviews(toggleButtons); 
                reviewBody.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 선택 사항: 다른 리뷰를 모두 닫는 함수 (하나만 펼쳐지게 하려면)
    function closeAllReviews(buttons) {
        buttons.forEach(btn => {
            if (btn.getAttribute('aria-expanded') === 'true') {
                const item = btn.closest('.review-item');
                const id = btn.parentElement.getAttribute('data-review-id');
                const body = item.querySelector(`#review-${id}-detail`);

                body.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});