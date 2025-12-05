
$(function () {


    /****** 1. 메인 비주얼 영역 ******/
    function initSlider() {
        const slider = $(".mv-sec .slide_wrap .slide_ctn");
        let autoplaySpeed = 4000;

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
                    { width: "95%" },
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
                }).animate({ width: "95%" }, autoplaySpeed, "linear", function () {
                    bar.animate({ opacity: 0 }, 500);
                });
            }
        });



        $(document).on("click", ".progress_ctn .bar", function () {
            slider.slick("slickGoTo", $(this).data("slide"));
        });
    }


    // .intro 인트로가 끝난 후 슬라이더 실행
    $(function () {
        setTimeout(function () {
            initSlider();
        }, 3600);
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
        autoplay: true,
        autoplaySpeed: 4000,
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