

$(function () {
	let autoplaySpeed = 5000;
	$(".mv-sec .slide_wrap .slide_ctn").on("init", function (e, slick) {
		$(".mv-sec .progress_ctn .bar span").stop().animate({ width: "100%" }, autoplaySpeed)
	}).slick({
		arrows: false,
		fade: true,
		pauseOnHover: false,
		pauseOnFocus: false,
		autoplay: true,
		autoplaySpeed: autoplaySpeed,
	}).on("beforeChange", function (e, slick, current, next) {
		var bgEle = $(this).find(".item").not(".slick-cloned").find(".bg0" + (next + 1))
		if (bgEle.find("video").length) {
			var video = bgEle.find("video")[0]
			video.currentTime = 0;
			video.play();
		}
		$(".mv-sec .progress_ctn .bar span").stop().animate({ width: "0" }, 0)
	}).on("afterChange", function (e, slick, current, next) {
		var bgEle = $(this).find(".item").not(".slick-cloned").find(".bg0" + (current + 1))
		if (bgEle.find("video").length) {
			var video = bgEle.find("video")[0]
			autoplaySpeed = video.duration - video.currentTime; //총 재생시간 - 재생시간
		} else {
			autoplaySpeed = 5
		}
		$(".mv-sec .slide_wrap .slide_ctn").slick('slickSetOption', 'autoplaySpeed', autoplaySpeed * 1000, false);
		$(".mv-sec .progress_ctn .bar span").stop().animate({ width: "100%" }, autoplaySpeed * 1000)
	})
	$(".mv-sec .progress_ctn .play_btn .stop").on("click", function () {
		if (!$(this).hasClass("on")) {
			$(this).addClass("on")
			$(".mv-sec .slide_wrap .slide_ctn").slick("slickPause")
			$(".mv-sec .progress_ctn .bar span").clearQueue()
			$(".mv-sec .progress_ctn .bar span").stop()
		} else {
			$(this).removeClass("on")
			$(".mv-sec .slide_wrap .slide_ctn").slick("slickPlay")
			$(".mv-sec .progress_ctn .bar span").stop().animate({ width: "100%" }, autoplaySpeed)
		}
	})



	// about 섹션

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