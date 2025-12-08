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







}); //끝
