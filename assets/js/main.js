
$(function () {


    /****** 1. 메인 비주얼 영역 ******/

    // 1-1. if문으로 풀어서 작성
    // const autoplaySpeed = 5000;
    // let autoplaySpeed = 5000;
    // if (/Mobi|Android/i.test(navigator.userAgent)) {
    //     autoplaySpeed = 3000;
    // }


    // 1-2. 삼항연산자- 모바일과 데스크탑에 따라 재생 속도 다르게 설정 - 모바일이 더 빠름
    const autoplaySpeed = (/Mobi|Android/i.test(navigator.userAgent)) ? 3000 : 5000;
    let isPlaying = true;


    // 진행바 생성
    function createProgressBars(slideCount) {
        const barsContainer = $('.bars_container');
        barsContainer.empty(); // 기존 진행바 제거

        for (let i = 0; i < slideCount; i++) {
            const bar = $(`
                <div class="progress_bar" data-index="${i}">
                    <div class="progress_bar_fill"></div>
                </div>
            `);

            // 각 진행바에 클릭 이벤트 직접 바인딩
            bar.on('click', function (e) {
                e.stopPropagation();
                const targetIndex = $(this).data('index');
                console.log('Bar clicked:', targetIndex); // 디버깅용
                $('.mv_slide_ctn').slick('slickGoTo', targetIndex);

                // 클릭 시 자동재생이 멈춰있다면 다시 시작
                if (!isPlaying) {
                    $('.mv_slide_ctn').slick('slickPlay');
                    $('.play_btn').addClass('playing');
                    isPlaying = true;
                }
            });

            barsContainer.append(bar);
        }
    }

    // 진행바 업데이트
    function updateProgressBar(currentIndex) {
        $('.progress_bar').removeClass('active');
        $('.progress_bar .progress_bar_fill').css('width', '0%');

        $('.progress_bar').each(function (index) {
            if (index < currentIndex) {
                $(this).find('.progress_bar_fill').css('width', '100%');
            } else if (index === currentIndex) {
                $(this).addClass('active');
                $(this).find('.progress_bar_fill').css({
                    'animation-duration': (autoplaySpeed / 1000) + 's',
                    'width': '100%'
                });
            }
        });
    }

    // 슬라이더 초기화
    function initSlider() {
        const slideCount = $('.mv_slide_ctn .item').length;

        // 진행바 생성 (슬라이더 초기화 전에)
        createProgressBars(slideCount);

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

        // 초기 진행바 설정
        updateProgressBar(0);

        // 슬라이드 변경 시 진행바 업데이트
        $('.mv_slide_ctn').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            updateProgressBar(nextSlide);
        });

        // 재생/정지 버튼
        $('.play_btn').on('click', function () {
            if (isPlaying) {
                $('.mv_slide_ctn').slick('slickPause');
                $(this).removeClass('playing');
                $('.progress_bar.active .progress_bar_fill').css('animation-play-state', 'paused');
                isPlaying = false;
            } else {
                $('.mv_slide_ctn').slick('slickPlay');
                $(this).addClass('playing');
                $('.progress_bar.active .progress_bar_fill').css('animation-play-state', 'running');
                isPlaying = true;
            }
        });

        // 초기 상태를 재생 중으로 설정
        $('.play_btn').addClass('playing');
    }


    /***********************************************
     * ※ 추가된 기능 : 모바일 스크롤 시 autoplay 유지
     ***********************************************/
    let scrollTimer;

    $(window).on('scroll touchmove', function () {

        // 스크롤 중 자동재생이 꺼져있으면 강제로 다시 재생
        if (!isPlaying) {
            $('.mv_slide_ctn').slick('slickPlay');
            $('.play_btn').addClass('playing');
            isPlaying = true;
        }

        // 스크롤 멈추고 150ms 후에도 autoplay 유지
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            $('.mv_slide_ctn').slick('slickPlay');
            $('.play_btn').addClass('playing');
            isPlaying = true;
        }, 20); // 150ms에서 20ms로 변경
    });


    /***********************************************
     * ※ 추가된 기능 : iOS visibilitychange 대응
     * (Safari가 스크롤 중일 때도 hidden 처리되는 문제)
     ***********************************************/
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            $('.mv_slide_ctn').slick('slickPlay');
            $('.play_btn').addClass('playing');
            isPlaying = true;
        }
    });



    // 상단 비주얼 세로 중앙
    function setVh() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // 페이지 시작
    function startPage() {
        setVh();
        initSlider();
    }

    // 초기 실행
    setVh();

    // intro 끝난 후 (0s: 즉시 실행하도록 수정, 필요시 3600으로 변경)
    setTimeout(startPage, 3600);

    // resize 대응
    $(window).on('resize', function () {
        setVh();
    });




    /****** 2. 인트로-페이지 로드 시 ******/

    $('body').addClass('intro-active');

    // 인트로 애니메이션 종료 후 (4.6초 후)
    setTimeout(function () {
        $('body').removeClass('intro-active');
    }, 4600);





    /****** 3. 어바웃 chair 영역  ******/

    $(".m-about-sec .slide_wrap .slide_ctn").slick({
        arrows: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        variableWidth: true,
        centerMode: true,
        // autoplay: true,
        // autoplaySpeed: 4000,
        speed: 2000,
    }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        var count = slick.slideCount;
        var selectors = [nextSlide, nextSlide - count, nextSlide + count].map(function (n) {
            return '.m-about-sec [data-slick-index="' + n + '"]'
        }).join(',');
        $('.m-about-sec .slick_now').removeClass('slick_now');
        $(selectors).addClass('slick_now');
    });

    $(".m-about-sec .slide_wrap .slide_ctn").find($('.slick-slide[data-slick-index="0"]')).addClass('slick_now');

    $(".m-about-sec .slide_wrap .slide_btn > div").on("click", function (e) {
        if (e.currentTarget.className == "prev") {
            $(".m-about-sec .slide_wrap .slide_ctn").slick("slickPrev")
        } else {
            $(".m-about-sec .slide_wrap .slide_ctn").slick("slickNext")
        }
    })


    /****** 4. 뉴스 news 영역  ******/
    // $(".m-news-sec .cont .list .item").hover(function () {
    //     $(".m-news-sec .cont .tab").addClass("on")
    // }, function () {
    //     $(".m-news-sec .cont .tab").removeClass("on")
    // })

    // $(".m-news-sec .cont .tab li").on("click", function () {
    //     var tabTxt = $(this).data('tab');
    //     console.log(tabTxt)
    //     $(".m-news-sec .cont .tab li").removeClass("on");
    //     $(this).addClass("on");
    //     $(".m-news-sec .cont .list .item").hide()
    //     $(".m-news-sec .cont .list .item[data-idx='" + tabTxt + "']").show()
    // })




}); // 끝코드