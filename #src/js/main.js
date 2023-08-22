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
$(".tab-page__nav").on("scrollend", function(e) {
  if ((this.scrollWidth - this.clientWidth - this.scrollLeft) < 30) {
    $(".tab-page__inner").addClass("scrollend")
  } else {
    $(".tab-page__inner").removeClass("scrollend")
  }
})