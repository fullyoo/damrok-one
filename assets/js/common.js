

$(function () {
	$(".header .gnb > ul").clone().appendTo(".m_gnb")

	$(".header .gnb > ul").hover(function () {
		$(".header").addClass("hover");
		// $(".header .gnb > ul > li > ul").stop().slideDown(400);
		// $(".header .bg").stop().slideDown(300)
	}, function () {
		$(".header").removeClass("hover");
		$(".header .gnb > ul > li > ul").stop().slideUp(400);
		$(".header .bg").stop().slideUp(500)
	})

	$(".header .header_ui .lang > li > span").on("click", function () {
		$(this).next().stop().slideToggle()
	})
	$(".header .header_ui .m_btn").on("click", function () {
		$(this).toggleClass("on");
		$(".header .header_ui .m_gnb").toggleClass("on");
		$(".header .header_ui .m_gnb > ul > li > a").next().stop().slideUp();
	})

	// $(".header .header_ui .m_gnb > ul > li > a").on("click", function (e) {
	// 	e.preventDefault();
	// 	$(this).next().stop().slideToggle();
	// 	$(".header .header_ui .m_gnb > ul > li > a").not(this).next().stop().slideUp();

	// 	// class'on'추가_250926
	// 	$(this).toggleClass("on");
	// });


	$(".header .header_ui .m_gnb > ul > li > a").on("click", function (e) {
		// e.preventDefault() : 모든 메뉴 링크 이동 막음()
		// e.preventDefault();

		// 클릭한 a 이외의 서브메뉴는 닫기
		// $(this).next().stop().slideToggle();
		// $(".header .header_ui .m_gnb > ul > li > a").not(this).next().stop().slideUp();

		// ★★★☆ 다른 a 태그의 on 클래스 제거 ☆★★★
		$(".header .header_ui .m_gnb > ul > li > a").not(this).removeClass("on");

		// 클릭한 a에 on 클래스 토글
		$(this).toggleClass("on");
	});


	$(".footer .top .family>div").on("click", function () {
		// ul 열고 닫기
		$(this).next().stop().slideToggle();
		// span에 on 클래스 토글
		$(this).find("span").toggleClass("on");
	})
	$(".footer .top_btn").on("click", function () {
		$("html, body").stop().animate({ scrollTop: 0 }, 600)
	});
	$(window).scroll(function () {
		if ($(this).scrollTop() > 10) {
			$(".header").addClass("scroll")
		} else {
			$(".header").removeClass("scroll")
		}
	})
	for (var i = 1; i <= 10; i++) {
		$(".gnb .sub_depth0" + i).clone().appendTo(".lnb0" + i);
	};

	var $winUrl = location.pathname;
	lnbFn($(".lnb .sub_depth > li"));

	function lnbFn(obj) {
		obj.find("a").each(function () {
			$menuUrl01 = $(this).attr("href");
			$res = $menuUrl01.split("/");
			var resLast = $res[$res.length - 1];
			if ($winUrl.match(resLast)) {
				$(this).parent().addClass("on");
			}
		});
	}
});

function search_form() {
	if (searchform.s_keyword.value == '') { alert("검색어를 입력하세요."); searchform.s_keyword.focus(); return false; }
	searchform.submit();
}


// 우측퀵메뉴 추가_250925
let btnTop = document.querySelector(".top_btn"),
	headerH = 70;

// 스크롤시 .show 클래스 적용 됨
window.addEventListener("scroll", () => {
	if (window.scrollY > headerH) {
		btnTop.classList.add("show");
	} else {
		btnTop.classList.remove("show");
	}
});
$(".top_btn").on("click", function () {
	$("html, body").stop().animate({ scrollTop: 0 });
});

