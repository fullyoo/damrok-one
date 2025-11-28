
$(function () {


    /****** 1. 메인 비주얼 영역 ******/
    function initSlider() {
        let autoplaySpeed = 3000;
        let totalSlides = 0;
        let currentSlide = 0;

        const slideTexts = [
            // "Global",
            // "Service",
            // "Solution"
        ];

        function createProgressBars() {
            totalSlides = $(".mv-sec .slide_wrap .slide_ctn .item").length;
            const barsContainer = $(".bars_container");
            barsContainer.empty();

            for (let i = 0; i < totalSlides; i++) {
                // const text = slideTexts[i] || `Slide ${i + 1}`;
                const text = slideTexts[i] || ``;
                barsContainer.append(`<div class="bar" data-slide="${i}"><span></span><div class="bar-text" data-slide="${i}">${text}</div></div>`);
            }
        }

        function updateProgressBars(current) {
            $(".progress_ctn .bar").each(function (index) {
                if (index === current) {
                    $(this).addClass("active").removeClass("completed");
                    $(this).find("span").css("width", "0%").css("opacity", "1");
                } else {
                    $(this).removeClass("active completed");
                    $(this).find("span").css("width", "0%").css("opacity", "1");
                }
            });
        }

        function startCurrentProgress(duration) {
            const activeBar = $(".progress_ctn .bar.active");
            const barWidth = activeBar.width() - 0;

            activeBar.find("span").stop().animate({
                width: barWidth + "px"
            }, duration, function () {
                $(this).animate({ opacity: 0 }, 500);
            });
        }

        function goToSlide(slideIndex) {
            $(".progress_ctn .bar span").stop(true, false);
            currentSlide = slideIndex;
            updateProgressBars(currentSlide);
            $(".mv-sec .slide_wrap .slide_ctn").slick('slickGoTo', slideIndex);

            setTimeout(function () {
                startCurrentProgress(autoplaySpeed);
            }, 300);
        }

        // 슬라이더 초기화
        createProgressBars();

        $(".mv-sec .slide_wrap .slide_ctn").on("init", function (e, slick) {
            currentSlide = 0;
            updateProgressBars(currentSlide);
            setTimeout(function () {
                startCurrentProgress(autoplaySpeed);
            }, 50);
        }).slick({
            arrows: false,
            fade: true,
            pauseOnHover: false,
            pauseOnFocus: false,
            autoplay: true, //자동재생
            autoplaySpeed: autoplaySpeed,
            infinite: true,
            speed: 0,
            cssEase: 'ease-in-out'
        }).on("beforeChange", function (e, slick, current, next) {
            var currentBgEle = $(this).find(".item").not(".slick-cloned").eq(current).find(".bg");
            var nextBgEle = $(this).find(".item").not(".slick-cloned").eq(next).find(".bg");

            if (currentBgEle.find("video").length) {
                currentBgEle.find("video")[0].pause();
            }

            if (nextBgEle.find("video").length) {
                nextBgEle.find("video")[0].currentTime = 0;
                nextBgEle.find("video")[0].pause();
            }

            currentSlide = next;
            updateProgressBars(currentSlide);
        }).on("afterChange", function (e, slick, current) {
            var bgEle = $(this).find(".item").not(".slick-cloned").eq(current).find(".bg");

            if (bgEle.find("video").length) {
                setTimeout(function () {
                    bgEle.find("video")[0].play();
                }, 0);
            }

            autoplaySpeed = 3000;
            $(".mv-sec .slide_wrap .slide_ctn").slick('slickSetOption', 'autoplaySpeed', autoplaySpeed, false);

            setTimeout(function () {
                startCurrentProgress(autoplaySpeed);
            }, 300);
        });

        // 재생/정지 버튼
        $(".mv-sec .progress_ctn .play_btn .stop").on("click", function () {
            if (!$(this).hasClass("on")) {
                $(this).addClass("on");
                $(".mv-sec .slide_wrap .slide_ctn").slick("slickPause");
                $(".progress_ctn .bar.active span").clearQueue().stop();
            } else {
                $(this).removeClass("on");
                $(".mv-sec .slide_wrap .slide_ctn").slick("slickPlay");

                var currentProgress = parseInt($(".progress_ctn .bar.active span").css("width"));
                var totalWidth = $(".progress_ctn .bar.active").width() - 10;
                var remainingPercent = 1 - (currentProgress / totalWidth);
                var remainingTime = autoplaySpeed * remainingPercent;

                $(".progress_ctn .bar.active span").stop().animate({
                    width: totalWidth + "px"
                }, remainingTime, function () {
                    $(this).animate({ opacity: 0 }, 500);
                });
            }
        });

        // 진행바 클릭
        $(document).on("click", ".progress_ctn .bar, .bar-text", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var index = $(this).data('slide');
            goToSlide(index);
        });
    }

    // .intro 인트로가 끝난 후 4초 뒤 슬라이더 실행
    $(function () {
        setTimeout(function () {
            initSlider();
        }, 100); // 4초 대기
    });




    /****** 2. 어바웃 영역 chair ******/

    $(".m-about-sec .slide_wrap .slide_ctn").slick({
        arrows: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        variableWidth: true,
        centerMode: true,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 1200,
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
    $(".m-news-sec .cont .list .item").hover(function () {
        $(".m-news-sec .cont .tab").addClass("on")
    }, function () {
        $(".m-news-sec .cont .tab").removeClass("on")
    })

    $(".m-news-sec .cont .tab li").on("click", function () {
        var tabTxt = $(this).data('tab');
        console.log(tabTxt)
        $(".m-news-sec .cont .tab li").removeClass("on");
        $(this).addClass("on");
        $(".m-news-sec .cont .list .item").hide()
        $(".m-news-sec .cont .list .item[data-idx='" + tabTxt + "']").show()
    })
})