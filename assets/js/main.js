
$(function () {


    /****** 1. 메인 비주얼 영역 ******/







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