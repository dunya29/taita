$(".tab-page__nav span").click(function(e) {
    let href = $(this).attr("data-tab");
    $(this).addClass("active").siblings("span").removeClass("active"),
    $(`[data-block=${href}]`).fadeIn().addClass("active").siblings(".tab-page__block").hide().removeClass("active")
}),
$(".item-report__header").on("click", function () {
    $(this)
      .toggleClass("open")
      .siblings(".item-report__body")
      .slideToggle()
      .parents(".item-report")
      .siblings(".item-report")
      .find(".item-report__header")
      .removeClass("open")
      .siblings(".item-report__body")
      .slideUp();
});