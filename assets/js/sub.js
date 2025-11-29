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




    /****** 2. Chair-view 영역 ******/
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



}); //끝
