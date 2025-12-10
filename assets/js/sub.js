$(function () {

    /****** 1. 서브 비주얼 영역 ******/
    let fadeSpeed = 120;
    let timers = []; // ★ 실행 중인 모든 타이머 저장

    function clearTimers() {
        timers.forEach(t => clearTimeout(t));
        timers = [];
    }

    function startFade() {
        clearTimers(); // ★ 기존 타이머 전부 제거 (겹침 방지)

        const inputText = $('#custom-text').val();
        if (!inputText) return;

        const $fadeText = $('.fade-text');
        $fadeText.empty(); // ★ 기존 글자 제거

        const chars = inputText.split('');

        $.each(chars, function (index, char) {
            const timer = setTimeout(function () {

                if (char === '\n') {
                    $fadeText.append('<br>');
                    return;
                }

                const $span = $('<span>')
                    .addClass('char')
                    .html(char === ' ' ? '&nbsp;' : char);

                $fadeText.append($span);

            }, index * fadeSpeed);

            timers.push(timer); // ★ 타이머 저장
        });
    }

    /*** ↓↓↓↓↓ 이미지 애니 종료 0.3초 전 실행 ↓↓↓↓↓ ***/

    const $img = $(".sv-sec img");
    const $fadeText = $(".sv-title-wrap h2.fade-text");

    // aniDuration 읽기 + fallback
    let aniDuration = window.getComputedStyle($img[0]).animationDuration;
    let aniSec = parseFloat(aniDuration);
    if (!aniSec || aniSec === 0) aniSec = 1;

    let aniMs = aniSec * 1000;
    let startBefore = 300;
    let delay = aniMs - startBefore;
    if (delay < 0) delay = 0;

    // load와 무관하게 강제 실행
    setTimeout(function () {

        $fadeText.addClass("sv-fade-start");
        startFade();

    }, delay);

    /*** ↑↑↑↑↑ END ↑↑↑↑↑ ***/

    $('#custom-text').on('keypress', function (e) {
        if (e.key === 'Enter') startFade();
    });

    $('#speed').on('input', function () {
        fadeSpeed = $(this).val();
        $('#speedValue').text(fadeSpeed + 'ms');
    });




    /****** 2. Chair-list 리스트 영역 ******/

    /********************************************
         *  Gallery Section
    ********************************************/
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

    let galleryCurrentPage = 1;
    let galleryItemsPerPage = 8;
    let galleryCurrentCategory = 'all';
    let filteredGalleryData = [...galleryData];

    const $galleryContainer = $('#gallery-list');
    const $galleryPaginationContainer = $('#gallery-pagination');

    function createGalleryButton(html, onClick, disabled = false, active = false) {
        const $btn = $('<button></button>').html(html);
        if (disabled) $btn.prop('disabled', true);
        if (active) $btn.addClass('active');
        $btn.on('click', onClick);
        return $btn;
    }

    function generateGalleryItems(items) {
        $galleryContainer.empty();
        if (!items.length) {
            $galleryContainer.html('<div class="no-results">No images found in this category.</div>');
            return;
        }
        $.each(items, (index, item) => {
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

    function getGalleryPageNumbers(current, total) {
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

    function generateGalleryPagination() {
        const totalPages = Math.ceil(filteredGalleryData.length / galleryItemsPerPage);
        $galleryPaginationContainer.empty();
        if (totalPages <= 1) return;

        $galleryPaginationContainer.append(createGalleryButton('<i class="iconoir-fast-arrow-left"></i>', () => goToGalleryPage(1), galleryCurrentPage === 1).addClass('page-nav'));
        $galleryPaginationContainer.append(createGalleryButton('<i class="iconoir-nav-arrow-left"></i>', () => goToGalleryPage(galleryCurrentPage - 1), galleryCurrentPage === 1).addClass('page-nav'));

        const pageNumbers = getGalleryPageNumbers(galleryCurrentPage, totalPages);
        $.each(pageNumbers, (_, num) => {
            if (num === '...') {
                $galleryPaginationContainer.append('<span class="dots">...</span>');
            } else {
                $galleryPaginationContainer.append(createGalleryButton(num, () => goToGalleryPage(num), false, num === galleryCurrentPage).addClass('page-number'));
            }
        });

        $galleryPaginationContainer.append(createGalleryButton('<i class="iconoir-nav-arrow-right"></i>', () => goToGalleryPage(galleryCurrentPage + 1), galleryCurrentPage === totalPages).addClass('page-nav'));
        $galleryPaginationContainer.append(createGalleryButton('<i class="iconoir-fast-arrow-right"></i>', () => goToGalleryPage(totalPages), galleryCurrentPage === totalPages).addClass('page-nav'));
    }

    function goToGalleryPage(page) {
        galleryCurrentPage = page;
        updateGalleryDisplay();
        $('html, body').animate({ scrollTop: 0 }, 400);
    }

    function filterGallery(category) {
        galleryCurrentCategory = category;
        galleryCurrentPage = 1;
        filteredGalleryData = category === 'all'
            ? [...galleryData]
            : galleryData.filter(item => item.category === category);
        updateGalleryDisplay();
    }

    function updateGalleryDisplay() {
        const startIndex = (galleryCurrentPage - 1) * galleryItemsPerPage;
        const itemsToShow = filteredGalleryData.slice(startIndex, startIndex + galleryItemsPerPage);
        generateGalleryItems(itemsToShow);
        generateGalleryPagination();
    }

    $('.tab').on('click', function () {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        filterGallery($(this).data('category'));
    });

    updateGalleryDisplay();




    /****** 3. Chair-view 뷰 영역 ******/

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
    /***************************************************
             * 1. 모바일 감지
             * - Mobi 또는 Android 문자열이 userAgent에 있으면 모바일로 판단
             ***************************************************/
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);


    /***************************************************
     * 2. autoplaySpeed 설정
     * - 모바일: 2000ms (좀 더 빠르게)
     * - PC: 3000ms
     ***************************************************/
    const autoplaySpeed = isMobile ? 3000 : 3000;

    /***************************************************
     * 3. 재생 상태 저장 변수
     * - true  : 자동재생 중
     * - false : 일시정지 상태
     ***************************************************/
    let isPlaying = true;



    /***************************************************
     * 4. 진행바(막대) 생성 함수
     * - 슬라이드 개수만큼 진행바 DOM 생성
     * - 진행바 클릭 시 해당 슬라이드로 이동
     ***************************************************/
    function createProgressBars(slideCount) {
        const barsContainer = $('.bars_container');
        barsContainer.empty(); // 기존 진행바 초기화

        for (let i = 0; i < slideCount; i++) {
            // 진행바 단일 요소 생성
            const bar = $(`
            <div class="progress_bar" data-index="${i}">
                <div class="progress_bar_fill"></div>
            </div>
        `);

            /***********************************************
             * 진행바 클릭 시
             * - 해당 슬라이드로 이동 (slickGoTo)
             * - 만약 재생 중이 아니라면 자동재생 재시작
             ***********************************************/
            bar.on('click', function (e) {
                e.stopPropagation();
                const targetIndex = $(this).data('index');

                $('.mv_slide_ctn').slick('slickGoTo', targetIndex);

                if (!isPlaying) {
                    $('.mv_slide_ctn').slick('slickPlay');
                    $('.play_btn').addClass('playing');
                    isPlaying = true;
                }
            });

            // 막대 컨테이너에 추가
            barsContainer.append(bar);
        }
    }



    /***************************************************
     * 5. 진행바 업데이트
     * - 현재 슬라이드 기준으로 이전 막대는 모두 100%
     * - 현재 슬라이드는 width 0 → 100% 애니메이션
     ***************************************************/
    function updateProgressBar(currentIndex) {
        // 모든 진행바 초기화
        $('.progress_bar').removeClass('active');
        $('.progress_bar .progress_bar_fill').css('width', '0%');

        // 하나씩 체크
        $('.progress_bar').each(function (index) {

            // 이미 지난 슬라이드는 100%
            if (index < currentIndex) {
                $(this).find('.progress_bar_fill').css('width', '100%');

                // 현재 슬라이드 → 애니메이션 실행
            } else if (index === currentIndex) {
                $(this).addClass('active');
                $(this).find('.progress_bar_fill').css({
                    'animation-duration': (autoplaySpeed / 1000) + 's',
                    'width': '100%'
                });
            }
        });
    }



    /***************************************************
     * 6. 슬라이더 초기화
     * - slick 옵션 등록
     * - beforeChange에서 진행바 업데이트
     * - 재생/일시정지 버튼 동작
     ***************************************************/
    function initSlider() {
        const slideCount = $('.mv_slide_ctn .item').length;

        // 슬라이더 초기화 전에 진행바 먼저 생성
        createProgressBars(slideCount);

        /***************************************************
         * slick() 슬라이더 설정
         ***************************************************/
        $('.mv_slide_ctn').slick({
            arrows: false,
            fade: true,
            autoplay: true,
            autoplaySpeed: autoplaySpeed,
            infinite: true,
            speed: 500,
            pauseOnHover: false,
            pauseOnFocus: false,
            cssEase: "linear",
        });

        // 첫 슬라이드의 진행바 적용
        updateProgressBar(0);


        /***************************************************
         * 슬라이드 변경 직전에 발생
         * - nextSlide 값 기준으로 진행바 업데이트
         ***************************************************/
        $('.mv_slide_ctn').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            updateProgressBar(nextSlide);
        });


        /***************************************************
         * 재생/정지 버튼
         * - isPlaying 값에 따라 slickPause / slickPlay 실행
         ***************************************************/
        $('.play_btn').on('click', function () {
            if (isPlaying) {
                // 일시정지 처리
                $('.mv_slide_ctn').slick('slickPause');
                $(this).removeClass('playing');
                $('.progress_bar.active .progress_bar_fill').css('animation-play-state', 'paused');
                isPlaying = false;

            } else {
                // 다시 재생 처리
                $('.mv_slide_ctn').slick('slickPlay');
                $(this).addClass('playing');
                $('.progress_bar.active .progress_bar_fill').css('animation-play-state', 'running');
                isPlaying = true;
            }
        });

        // 초기 상태는 재생 중 상태로 표시
        $('.play_btn').addClass('playing');
    }



    /***************************************************
     * 7. 모바일 전용 기능
     * - 모바일에서만 스크롤 시 autoplay 강제로 유지
     * - iOS Safari의 visibilitychange 문제도 모바일에서만 적용
     ***************************************************/
    if (isMobile) {

        let scrollTimer;

        /***********************************************
         * 모바일 Scroll / TouchMove 시 동작
         * - 자동재생이 꺼져 있으면 다시 재생
         * - 스크롤 중에도 autoplay가 멈추지 않도록 강제 유지
         ***********************************************/
        $(window).on('scroll touchmove', function () {

            // 재생이 꺼져있으면 다시 실행
            if (!isPlaying) {
                $('.mv_slide_ctn').slick('slickPlay');
                $('.play_btn').addClass('playing');
                isPlaying = true;
            }

            // 스크롤 멈추고 20ms 후에도 재생 유지
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                $('.mv_slide_ctn').slick('slickPlay');
                $('.play_btn').addClass('playing');
                isPlaying = true;
            }, 20);
        });


        /***********************************************
         * iOS Safari 전용 문제 대응
         * - 스크롤 중에도 visibilityState가 hidden으로 바뀌는 버그 존재
         * - 다시 visible로 돌아왔을 때 autoplay 강제 재개
         ***********************************************/
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                $('.mv_slide_ctn').slick('slickPlay');
                $('.play_btn').addClass('playing');
                isPlaying = true;
            }
        });
    }



    /***************************************************
     * 8. 슬라이더 실제 실행
     ***************************************************/
    initSlider();







    /****** 5. FAQ 자주묻는 질문 영역 ******/












}); //끝
