var $ = jQuery;

$(document).ready(function() {
    var sitem = 3;
    if ($(window).width() <= 650) sitem = 2;
    $('.slide_post_vip').owlCarousel({
        items: sitem,
        autoplay: true,
        autoplayTimeout: 2000,
        navigation: false,
        dots: true,
        loop: true,
        rewind: true,
        responsiveRefreshRate: 200,
    })
});


$('.marquee').marquee({
    duration: 19000, //tốc độ tính bằng mili giây, số càng nhỏ chạy càng nhanh
    gap: 100, //khoảng cách giữa các đối tượng
    delayBeforeStart: 0, //thời gian tính bằng mili giây trước khi marquee hoạt hình
    direction: 'left', //hướng left, right, up, down
    duplicated: true,
    startVisible: true
});

function popupCenter(url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}
jQuery('.popupxf').click(function(e) {
    e.preventDefault()
    popupCenter(jQuery(this).attr('href'), 'myPop1', 650, 450);
});
$(".fa-times-circle-o").click(function() {
    $(this).closest('#fixed-menu').hide();
    $('.edit_noti').hide();
});