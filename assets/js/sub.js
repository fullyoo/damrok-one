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




    /****** 5. FAQ 자주묻는 질문 영역 ******/

    // 5-1. faq 토글
    $(".open").click(function () {
        var container = $(this).parents(".topic");
        var answer = container.find(".answer");
        var trigger = container.find(".faq-t");

        answer.slideToggle(200);

        if (trigger.hasClass("faq-o")) {
            trigger.removeClass("faq-o");
        }
        else {
            trigger.addClass("faq-o");
        }

        if (container.hasClass("expanded")) {
            container.removeClass("expanded");
        }
        else {
            container.addClass("expanded");
        }
    });


    /********************************************
    *  5-2. FAQ Pagination Setup
    ********************************************/

    const $faqTopicsContainer = $('.topics');
    const $faqAllTopics = $('.topic');
    let faqItemsPerPage = 4;
    let faqCurrentPage = 1;

    function showFaqPage(page) {
        faqCurrentPage = page;
        const start = (page - 1) * faqItemsPerPage;
        const end = start + faqItemsPerPage;

        $faqAllTopics.hide().slice(start, end).show();
        generateFaqPagination();
        playFaqFadeIn();
    }

    function getFaqPageNumbers(current, total) {
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

    function createFaqButton(html, onClick, disabled = false, active = false) {
        const $btn = $('<button></button>').html(html);
        if (disabled) $btn.prop('disabled', true);
        if (active) $btn.addClass('active');
        $btn.on('click', onClick);
        return $btn;
    }

    function generateFaqPagination() {
        const totalPages = Math.ceil($faqAllTopics.length / faqItemsPerPage);
        const $pagination = $('#faq-pagination');
        $pagination.empty();

        if (totalPages <= 1) return;

        $pagination.append(createFaqButton('<i class="iconoir-fast-arrow-left"></i>', () => showFaqPage(1), faqCurrentPage === 1).addClass('page-nav'));
        $pagination.append(createFaqButton('<i class="iconoir-nav-arrow-left"></i>', () => showFaqPage(faqCurrentPage - 1), faqCurrentPage === 1).addClass('page-nav'));

        const pageNumbers = getFaqPageNumbers(faqCurrentPage, totalPages);
        $.each(pageNumbers, (_, num) => {
            if (num === '...') {
                $pagination.append('<span class="dots">...</span>');
            } else {
                $pagination.append(createFaqButton(num, () => showFaqPage(num), false, num === faqCurrentPage).addClass('page-number'));
            }
        });

        $pagination.append(createFaqButton('<i class="iconoir-nav-arrow-right"></i>', () => showFaqPage(faqCurrentPage + 1), faqCurrentPage === totalPages).addClass('page-nav'));
        $pagination.append(createFaqButton('<i class="iconoir-fast-arrow-right"></i>', () => showFaqPage(totalPages), faqCurrentPage === totalPages).addClass('page-nav'));
    }

    function playFaqFadeIn() {
        $faqTopicsContainer.removeClass('fade-in');
        void $faqTopicsContainer[0].offsetWidth;
        $faqTopicsContainer.addClass('fade-in');
    }

    showFaqPage(1);










}); //끝
