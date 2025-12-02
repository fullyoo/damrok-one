$(function () {

    /****** 1. 서브 비주얼 영역 ******/
    let fadeSpeed = 120;

    function startFade() {
        const inputText = $('#custom-text').val();
        if (!inputText) return;

        const $fadeText = $('.fade-text'); // 클래스 사용
        $fadeText.empty();

        const chars = inputText.split('');

        $.each(chars, function (index, char) {
            setTimeout(function () {

                if (char === '\n') {
                    $fadeText.append('<br>');
                    return;
                }

                const $span = $('<span>')
                    .addClass('char')
                    .html(char === ' ' ? '&nbsp;' : char);

                $fadeText.append($span);

            }, index * fadeSpeed);
        });
    }

    function resetFade() {
        $('.fade-text').empty();
    }

    // Enter 입력 시 실행
    $('#custom-text').on('keypress', function (e) {
        if (e.key === 'Enter') startFade();
    });

    // 페이지 로드 후 자동 실행
    $(window).on('load', startFade);

    // 속도 조절 input
    $('#speed').on('input', function () {
        fadeSpeed = $(this).val();
        $('#speedValue').text(fadeSpeed + 'ms');
    });




    /****** 2. Chair-list 영역 ******/

    const galleryData = [
        { id: 1, title: "Goyo", category: "living", image: "./assets/images/sub/chair-list1.jpg", description: "자세히 보기" },
        { id: 3, title: "Seonyu", category: "living", image: "./assets/images/sub/chair-list3.jpg", description: "자세히 보기" },
        { id: 6, title: "Ongyeol", category: "living", image: "./assets/images/sub/chair-list6.jpg", description: "자세히 보기" },
        { id: 11, title: "Seori", category: "living", image: "./assets/images/sub/chair-list11.jpg", description: "자세히 보기" },

        { id: 9, title: "Yeobaek", category: "office", image: "./assets/images/sub/chair-list9.jpg", description: "자세히 보기" },
        { id: 2, title: "Dajeong", category: "office", image: "./assets/images/sub/chair-list2.jpg", description: "자세히 보기" },
        { id: 5, title: "Haeon", category: "office", image: "./assets/images/sub/chair-list5.jpg", description: "자세히 보기" },
        { id: 7, title: "Daon", category: "office", image: "./assets/images/sub/chair-list7.jpg", description: "자세히 보기" },
        { id: 10, title: "Sodam", category: "office", image: "./assets/images/sub/chair-list10.jpg", description: "자세히 보기" },

        { id: 4, title: "Cheongyu", category: "cafe", image: "./assets/images/sub/chair-list4.jpg", description: "자세히 보기" },
        { id: 8, title: "Narae", category: "cafe", image: "./assets/images/sub/chair-list8.jpg", description: "자세히 보기" },

    ];

    let currentPage = 1;
    let itemsPerPage = 8;
    let currentCategory = 'all';
    let filteredData = [...galleryData];

    const $galleryContainer = $('#gallery-list');
    const $paginationContainer = $('#pagination');

    /**************************************
     *  버튼 생성 (HTML 아이콘 허용)
    **************************************/
    function createButton(html, onClick, disabled = false, active = false) {
        const $btn = $('<button></button>').html(html);

        if (disabled) $btn.prop('disabled', true);
        if (active) $btn.addClass('active');

        $btn.on('click', onClick);
        return $btn;
    }

    /**************************************
     *  갤러리 생성
    **************************************/
    function generateGalleryItems(items) {
        $galleryContainer.empty();

        if (items.length === 0) {
            $galleryContainer.html('<div class="no-results">No images found in this category.</div>');
            return;
        }

        $.each(items, function (index, item) {
            const $itemDiv = $(`
                <div class="gallery-item" data-category="${item.category}" style="animation-delay:${index * 0.1}s">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-info">
                        <h3>${item.title}</h3>
                        <a href="./chair-view.html" class="cta">
                            ${item.description}
                            <div class="line-wrap">
                                <span class="line"></span>
                                <span class="line"></span>
                            </div>
                        </a>
                    </div>
                </div>
            `);

            $galleryContainer.append($itemDiv);
        });
    }

    /**************************************
     *  페이지 번호 구성
    **************************************/
    function getPageNumbers(current, total) {
        const pages = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (current <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            } else if (current >= total - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = total - 3; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current - 1; i <= current + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            }
        }

        return pages;
    }

    /**************************************
     *  페이지네이션 생성 (아이콘 버전)
    **************************************/
    function generatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        $paginationContainer.empty();

        if (totalPages <= 1) return;

        // 처음 <<
        $paginationContainer.append(
            createButton('<i class="iconoir-fast-arrow-left"></i>', () => goToPage(1), currentPage === 1)
                .addClass('page-nav')
        );

        // 이전 <
        $paginationContainer.append(
            createButton('<i class="iconoir-nav-arrow-left"></i>', () => goToPage(currentPage - 1), currentPage === 1)
                .addClass('page-nav')
        );

        // 페이지 번호
        const pageNumbers = getPageNumbers(currentPage, totalPages);

        $.each(pageNumbers, function (_, num) {
            if (num === '...') {
                $paginationContainer.append('<span class="dots">...</span>');
            } else {
                $paginationContainer.append(
                    createButton(num, () => goToPage(num), false, num === currentPage)
                        .addClass('page-number')
                );
            }
        });

        // 다음 >
        $paginationContainer.append(
            createButton('<i class="iconoir-nav-arrow-right"></i>', () => goToPage(currentPage + 1), currentPage === totalPages)
                .addClass('page-nav')
        );

        // 끝 >>
        $paginationContainer.append(
            createButton('<i class="iconoir-fast-arrow-right"></i>', () => goToPage(totalPages), currentPage === totalPages)
                .addClass('page-nav')
        );
    }

    /**************************************
     *  페이지 이동
    **************************************/
    function goToPage(page) {
        currentPage = page;
        updateDisplay();
        $('html, body').animate({ scrollTop: 0 }, 400);
    }

    /**************************************
     *  카테고리 필터링
    **************************************/
    function filterGallery(category) {
        currentCategory = category;
        currentPage = 1;

        filteredData = category === 'all'
            ? [...galleryData]
            : galleryData.filter(item => item.category === category);

        updateDisplay();
    }

    /**************************************
     *  화면 업데이트
    **************************************/
    function updateDisplay() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const itemsToShow = filteredData.slice(startIndex, startIndex + itemsPerPage);

        generateGalleryItems(itemsToShow);
        generatePagination();
    }

    /**************************************
     *  탭 클릭 이벤트
    **************************************/
    $('.tab').on('click', function () {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        filterGallery($(this).data('category'));
    });

    /**************************************
     *  초기 실행
    **************************************/
    updateDisplay();




    /****** 3. Chair-view 영역 ******/

    /**************************************
     *  화면 좌우 확대
    **************************************/

    $(window).on('scroll resize', function () {
        checkVisible();
    });

    // 화면에 들어왔는지 체크하는 함수
    function checkVisible() {
        $('.watch-visible').each(function () {
            const $el = $(this);
            const rect = this.getBoundingClientRect();
            const windowHeight = $(window).height();

            // 요소가 화면 40% 지점에 들어오면 visible 추가
            if (rect.top < windowHeight * 0.6 && rect.bottom > 0) {
                $el.addClass('visible');
            } else {
                // 다시 올라갈 때 리셋 (옵션)
                $el.removeClass('visible');
            }
        });
    }

    // 감시할 요소들에게 공통 클래스 부여
    $('.s-chair-view-sec .chair-view-wrap').addClass('watch-visible');
    // 페이지 로드시 1회 실행
    $(document).ready(function () {
        checkVisible();
    });




    /****** 4. Why Damrok? 어바웃 영역 ******/
    function initSlider() {
        const slider = $(".mv-sec .slide_wrap .slide_ctn");
        let autoplaySpeed = 3000;

        const bars = $(".progress_ctn .bars_container");

        const updateBars = (i) => {
            bars.find(".bar").removeClass("active");
            bars.find(".bar").eq(i).addClass("active");
        };

        const startProgress = (duration) => {
            const bar = bars.find(".bar.active span");

            bar.stop(true, true)
                .css({
                    width: 0,
                    opacity: 1
                })
                .animate(
                    { width: "90%" },
                    duration,
                    "linear",
                    () => {
                        bar.animate({ opacity: 0 }, 500);
                    }
                );
        };

        slider
            .on("init", function (e, slick) {
                const total = slick.slideCount;

                bars.empty();
                for (let i = 0; i < total; i++) {
                    bars.append(`
                    <div class="bar" data-slide="${i}">
                        <span></span>
                    </div>
                `);
                }

                updateBars(0);

                // 전체 초기화
                bars.find(".bar span").css({ width: 0, opacity: 0 });

                startProgress(autoplaySpeed);
            })

            .on("beforeChange", (e, slick, current, next) => {

                // 🔥 무조건 전체 초기화 (핵심)
                bars.find(".bar span").stop(true, true).css({
                    width: 0,
                    opacity: 0
                });

                updateBars(next);

                // next span만 애니메이션 준비 상태
                bars.find(".bar").eq(next).find("span").css({
                    width: 0,
                    opacity: 1
                });
            })

            .on("afterChange", (e, slick, current) => {
                startProgress(autoplaySpeed);
            })

            .slick({
                arrows: false,
                fade: true,
                autoplay: true,
                autoplaySpeed: autoplaySpeed,
                infinite: true,
                speed: 0,
                pauseOnHover: false,
                pauseOnFocus: false,
                cssEase: "linear",
            });


        let isPaused = false;

        $(".play_btn .stop").on("click", function () {
            const activeBar = bars.find(".bar.active");
            const bar = activeBar.find("span");

            if (!$(this).hasClass("on")) {
                // 정지
                $(this).addClass("on");
                slider.slick("slickPause");

                // 현재 active span 숨기기
                bar.stop(true, true).css({
                    width: 0,
                    opacity: 0
                });
            } else {
                // 재생
                $(this).removeClass("on");
                slider.slick("slickPlay");

                // 항상 0%에서 시작
                bar.css({
                    width: 0,
                    opacity: 1
                }).animate({ width: "100%" }, autoplaySpeed, "linear", function () {
                    bar.animate({ opacity: 0 }, 500);
                });
            }
        });



        $(document).on("click", ".progress_ctn .bar", function () {
            slider.slick("slickGoTo", $(this).data("slide"));
        });
    }


    initSlider();





}); //끝
