$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
if (el = $('.map-line#b5').get(0)) {
    $(function() {
        if (typeof ymaps != 'undefined')
            ymaps.ready(init);
    });
	var mMap;
	function init () {
		var x = $(el).data('x');
        var y = $(el).data('y');
        mMap = new ymaps.Map('c-map', {
			center: [x, y],
			zoom: 16
		});

		mPlacemark = new ymaps.Placemark(mMap.getCenter(), {
			hintContent: '',
            hasBalloon:false
		}, {
			iconLayout: 'default#image',
			iconImageHref: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2233%22%20height%3D%2241%22%20viewBox%3D%220%200%2033%2041%22%3E%3Cpath%20fill%3D%22%23DD1B45%22%20d%3D%22M15.9%200C7.7.3.9%206.7.1%2014.8c-.2%201.6-.1%203.2.2%204.7%200%200%200%20.2.1.5.3%201.1.6%202.2%201.1%203.2C3.2%2027.1%207%2033.6%2015.6%2040.7c.5.4%201.3.4%201.8%200%208.6-7.1%2012.4-13.6%2014.1-17.5.5-1%20.9-2.1%201.1-3.2.1-.3.1-.5.1-.5.2-1%20.3-2%20.3-3.1C33%207.1%2025.3-.3%2015.9%200zm.6%2024.5c-4.4%200-8-3.6-8-7.9%200-4.4%203.6-7.9%208-7.9s8%203.6%208%207.9c0%204.3-3.6%207.9-8%207.9z%22%2F%3E%3C%2Fsvg%3E',
			iconImageSize: [33, 41],
			iconImageOffset: [-20, -33],
            cursor: false
		});

		mMap.geoObjects.add(mPlacemark);
		mMap.behaviors.disable('scrollZoom');
	}
}
function ShowMore(pageID, itemID, pageNo, featured, target, inPage) {
	if (typeof inPage === 'undefined' || inPage < 1)
		inPage = 3;
	if (!itemID > 0)
		itemID = null;
	$(target).find('a').css('display', 'none');
	$(target).find('.loader-wheel').css('display', 'inline-block');
    JsHttpRequest.query(
        projectPath + 'infoblock/ajax.php',
        {'PageID': pageID, 'Action': 'GetMore', 'ItemID': itemID, 'PageNo': pageNo, 'InPage': inPage, 'Featured': featured},
        function (result, errors) {
        	if (result.Answer && typeof result.Data !== 'undefined') {
                $(target).replaceWith(result.Data);
				if ($('.equal-height').get(0)) {
					$('.equal-height').matchHeight({
						property: 'min-height',
						byRow: true
					});
				}
			}
        }
    )
}

if ($('.map-organizations').get(0)) {
	var tags = $.map($('input[type="checkbox"]:checked'), function (el) {
		if (el.getAttribute('data-category'))
			return el.name;
    });
    var priceCategory = $('input[name="price_category"]:checked').map(function (idx, ele) {
        return $(ele).val();
    }).get();
    if (priceCategory.length)
    {
        priceCategory = priceCategory.join('_');
    }
    var limitStart = null, limitEnd = null, guestLimit = null;
    limitStart=$('input[type="text"][name="limit[start]"]').get(0).value;
    limitEnd=$('input[type="text"][name="limit[end]"]').get(0).value;
    if (limitStart || limitEnd) {
    	guestLimit = limitStart + '-' + limitEnd;
    }
    var price = $('input[type="text"][name="PriceMin"]'), dataPrice = null;
    if (price.get(0) || price.get(1))
    {
    	dataPrice = price.get(0).value + '-' + price.get(1).value;
    }
    var priceClosing = $('input[type="text"][name="PriceClosing"]'), dataPriceClosing = null;
    if (priceClosing.get(0) || priceClosing.get(1))
    {
    	dataPriceClosing = priceClosing.get(0).value + '-' + priceClosing.get(1).value;
    }

    JsHttpRequest.query(
        projectPath + 'infoblock/ajax.php',
        {'PageID': 10, 'Action': 'LoadMap', 'tags': JSON.stringify(tags), 'price_category': priceCategory, 'guest_limit': guestLimit, 'price': dataPrice, 'price_closing': dataPriceClosing},
        function (result, errors) {
        	if (typeof result.Answer !== 'undefined' && result.Answer && typeof result.Data !== 'undefined') {
                $("#map-script").html(result.Data);
            }
        }
    );

    $('#mapsOrg').on('click', function () {
		setCookie('ShowMap', 1);
		$('#organizations').css('display', 'none');
		$('.map-organizations').css('display', '');
		$('#tab-map').css('display', 'none');
		$('#tab-grid').css('display', '');
		return false;
    });
    $('#gridOrg').on('click', function () {
    	deleteCookie('ShowMap');
		$('#organizations').css('display', '');
        $('#organizations .thumb-carousel').slick('unslick');
        $('#organizations .thumb-carousel').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            lazyLoad: 'ondemand',
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        swipe: false
                    }
                }
            ]
        });
		$('.map-organizations').css('display', 'none');
		$('#tab-map').css('display', '');
		$('#tab-grid').css('display', 'none');
		return false;
    });
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

function sendForm25(data, target) {
    if (typeof target === 'undefined') {
        target = '#form-order';
    }
    if (typeof data !== 'undefined') {
        var a = data;
    } else {
        var showForm = 'Y';
        var pageID = 25;
        if ($(target).attr('data-show') === 'N')
            showForm = 'N';
        if (typeof $(target).attr('data-pageid') !== 'undefined' && parseInt($(target).attr('data-pageid'), 10) !== NaN)
            pageID = parseInt($(target).attr('data-pageid'), 10);
        var itemID = $('#ItemID').val();
        if (typeof $(target).attr('data-itemid') !== 'undefined' && parseInt($(target).attr('data-itemid'), 10) !== NaN)
            itemID = parseInt($(target).attr('data-itemid'), 10);
        var a = {
            'PageID': pageID,
            'FormSubmitted': 'No',
            'ShowForm': showForm,
            'Action': 'Consult'
        };
        if (typeof itemID !== 'undefined')
            a.ItemID = itemID;
    }
    JsHttpRequest.query(
        projectPath + 'form/ajax.php',
        a,
        function (result, errors) {
            if (typeof result.Data !== 'undefined' && typeof result.Data.Content !== 'undefined') {
                var content = result.Data.Content;
                $(target).html(content);
                $('[name="Phone_Phone_r"]').inputmask("+7 (9{3}) 9{3}-9{2}-9{2}");
                $(document.body).trigger("sticky_kit:recalc");
            }
        }
    );
}
function mapShowModal(el) {
    if ($(el).attr("data-modal") === '.form-modal-card')
    {
        sendForm25();
        return false;
    }
    $('.modal').removeClass('opened');
    $('body').removeClass('overflow');
    if ($('.dropdown-btn, .filter-dropdown-btn').get(0)) {
        $('.dropdown-btn, .filter-dropdown-btn').removeClass('opened');
    }
    $('body').removeClass('overflow-fixed');
    $('.menu').removeClass('opened');
    $('.menu-btn').removeClass('opened');
    var popupContainer = $(el).attr("data-modal");
    $(popupContainer).addClass('opened');
    if ($(el).hasClass('overflow-btn')) {
        if ($('.media-check').outerWidth() <= 1024) {
            $('body').addClass('overflow-fixed');
        }
        else {
            $('body').addClass('overflow');
        }
    }
    if ($('.search-box').hasClass('opened')) {
        $('.profile-btn').addClass('hidden');
    }
    return false;
}
if ($('#form-order').get(0)) {
    sendForm25();
}

function sticky_fn(boxItem,offsetItem){
	if ($('.media-check').outerWidth() > 1024) {
		if ($(boxItem).get(0)) {
			$(boxItem).stick_in_parent({
				offset_top: offsetItem
			});
		}
	}
	else {
		if ($(boxItem).get(0)) {
			$(boxItem).trigger("sticky_kit:detach");
		}
	}
}
function autoHeightAnimate(element, time){
  	var curHeight = element.height();
	var autoHeight = element.css({'max-height' : 'none', 'height' : 'auto'}).height();
	element.css({'height' : curHeight});
	if (element.hasClass('opened')) {
		curHeight = element.height();
		var initialHeight = element.css({'height' : '','max-height' : ''}).height();
		element.css({'max-height' : 'none','height' : curHeight});
		element.stop().animate({ 'height' : initialHeight }, time, function() {
			element.css({'height' : '','max-height' : ''});
		});
	}
	else {
		element.stop().animate({ 'height' : autoHeight }, time, function() {
			element.css({'max-height' : 'none','height' : 'auto'});
		});
	}
}
function fixbtns(){
	if ($('.media-check').outerWidth() > 1024) {
		if ($('.filter-dropdown-btn.opened').get(0)) {
			var box = $('.filter-dropdown-btn.opened').next('.filter-dropdown-box');
			box.find('.filter-box-btn-box').css({'height' : $('.filter-box-btn').outerHeight()});
			if (box.outerHeight() > $(window).outerHeight() - box.offset().top + $(window).scrollTop()) {
				if ($('.filter-dropdown-btn').hasClass('opened')) {
					box.find('.filter-box-btn').addClass('fixed');
				}
				else {
					$('.filter-box-btn').removeClass('fixed');
//					box.css({'height' : ''});
				}
			}
			else {
				$('.filter-box-btn').removeClass('fixed');
//				box.css({'height' : ''});
			}
		}
	}
}
var hasTouch = false;
$(function(){
	
	for (var i in document.documentElement)
	{
		if ('ontouchstart' === i || ('ontouchstart' in window))
		{
			hasTouch = true;
		}
	}
		
	if (hasTouch) {
		$('body').removeClass('not-touch');
		$('body').addClass('this-touch');
	} 
	else {
		if ($('.media-check').outerWidth() <= 1024) {
			$('body').removeClass('not-touch');
			$('body').addClass('this-touch');
		}
		else {
			$('body').addClass('not-touch');
			$('body').removeClass('this-touch');
		}
	}
	
	var macOS = ['Mac'].indexOf(navigator.platform) >= 0;
	if (macOS) {
		$('body').addClass('macOS');
	}
	
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		$('body').addClass('iOS');
	}
	
	
	$("input[type='file'] + span").click(function(){
	   $(this).parent().find($("input[type='file']")).click();
	});
	
	$("input[type='file']").change(function(e){
		$(this).siblings('span').html(e.target.files[0].name);
	});
	
	if ($('[id*="range-slider"]').get(0)) {
		var rangeSlider = document.getElementById('range-slider-1');

        var rangeValues = [
            document.getElementById('lower-1'),
            document.getElementById('higher-1')
        ];
        var limit = [parseInt(rangeValues[0].min) || 0, parseInt(rangeValues[1].max) || 25000];
		noUiSlider.create(rangeSlider, {
			start: [rangeValues[0].value || limit[0], rangeValues[1].value || limit[1]],
			connect: true,
			step: 100,
			range: {
				'min': limit[0],
				'max': limit[1]
			},
			format: wNumb({
				decimals: 0
			})
		});
		
		rangeSlider.noUiSlider.on('update', function( values, handle ) {
			rangeValues[handle].value = values[handle];

		});
        rangeSlider.noUiSlider.on('change', function () {
            $('.clear-form').show();
            setFilterVal(this.target);
        });

        if (document.getElementById('range-slider-2')) {
			var rangeSlider2 = document.getElementById('range-slider-2');
            if (document.getElementById('lower-2')) {
                var rangeValues2 = [
                    document.getElementById('lower-2'),
                    document.getElementById('higher-2')
                ];

                var limit2 = [parseInt(rangeValues2[0].min) || 0, parseInt(rangeValues2[1].max) || 25000];
                noUiSlider.create(rangeSlider2, {
                    start: [rangeValues2[0].value || limit2[0], rangeValues2[1].value || limit2[1]],
                    connect: true,
                    step: 100,
                    range: {
                        'min': limit2[0],
                        'max': limit2[1]
                    },
                    format: wNumb({
                        decimals: 0
                    })
                });

                rangeSlider2.noUiSlider.on('update', function (values, handle) {
                    rangeValues2[handle].value = values[handle];
                });

                rangeSlider2.noUiSlider.on('change', function () {
                    $('.clear-form').show();
                    setFilterVal(this.target);
                });
            }
        }
	}

	$(document).on('click', '.modal-btn', function() {
		if ($(this).attr("data-modal") === '.form-modal')
		{
            if ($('#headerForm').get(0)) {
                JsHttpRequest.query(
                    projectPath + 'form/ajax.php',
                    {'PageID': 24, 'FormSubmitted': 'No', 'Action': 'Consult'},
                    function (result, errors) {
                        if (typeof result.Data !== 'undefined' && typeof result.Data.Content !== 'undefined') {
                            var content = result.Data.Content;
                            $('#headerForm').html(content);
                            $('[name="Phone_Phone_r"]').inputmask("+7 (9{3}) 9{3}-9{2}-9{2}");
                        }
                    }
                );
            }
		}
		if ($(this).attr("data-modal") === '.form-modal-card')
		{
            if ($('#headerFormCard').get(0)) {
                var itemID = $(this).attr("data-itemID");
                var pageID = 25;
                if (typeof $(this).attr('data-pageid') !== 'undefined' && parseInt($(this).attr('data-pageid'), 10) !== NaN)
                    pageID = parseInt($(this).attr('data-pageid'), 10);
                JsHttpRequest.query(
                    projectPath + 'form/ajax.php',
                    {'PageID': pageID, 'FormSubmitted': 'No', 'Position': true, 'Action': 'Consult', 'ItemID': itemID},
                    function (result, errors) {
                        if (typeof result.Data !== 'undefined' && typeof result.Data.Content !== 'undefined') {
                            var content = result.Data.Content;
                            $('#headerFormCard').html(content);
                        }
                    }
                );
            }
		}
		$('.modal').removeClass('opened');
		$('body').removeClass('overflow');
		if ($('.dropdown-btn, .filter-dropdown-btn').get(0)) {
			$('.dropdown-btn, .filter-dropdown-btn').removeClass('opened');
		}
		$('body').removeClass('overflow-fixed');
		$('.menu').removeClass('opened');
		$('.menu-btn').removeClass('opened');
		var popupContainer = $(this).attr("data-modal");
		$(popupContainer).addClass('opened');
		if ($(this).hasClass('overflow-btn')) {
			if ($('.media-check').outerWidth() <= 1024) {
				$('body').addClass('overflow-fixed');
			}
			else {
				$('body').addClass('overflow');
			}
		}
		if ($('.search-box').hasClass('opened')) {
			$('.profile-btn').addClass('hidden');
		}
		return false;
	});

	$('.close, .overlay').click(function() {
		$('.modal').removeClass('opened');
		$('body').removeClass('overflow');
		$('body').removeClass('overflow-fixed');
		$('.profile-btn').removeClass('hidden');
		return false;
	});
	
	$('.top-banner .close').click(function() {
		$('.top-banner').addClass('hidden');
		return false;
	});
	
	$('.menu-btn').click(function(){
		$('.modal').removeClass('opened');
		$('body').removeClass('overflow');
		$('body').removeClass('overflow-fixed');
		$('.profile-btn').removeClass('hidden');
		if ($('.menu').hasClass('opened')) {
			$('.menu').removeClass('opened');
			$(this).removeClass('opened');
		} 
		else {
			$('.menu').addClass('opened');
			$(this).addClass('opened');
			$('body').addClass('overflow');
		}
		return false;
	});
	
	if ($('select').get(0)) {
		$('select').selectBoxIt();
	}
	
	
	if ($('.card-box-carousel').get(0)) {
		$('.card-box-carousel').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: false,
			arrows: false,
			responsive: [
				{
					breakpoint: 9999,
					settings: "unslick"
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						variableWidth: true,
						dots: false,
						arrows: false
					}
				}
			]
		});	
	}
	
	if ($('.thumb-carousel').get(0)) {
		$('.thumb-carousel').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			responsive: [
				{
					breakpoint: 767,
					settings: {
						swipe: false
					}
				}
			]
		});	
	}
	
	if ($('.img-link-carousel').get(0)) {
			
		$('.img-link-carousel').slick({
			slidesToShow: 8,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			swipe: false,
			responsive: [
				{
					breakpoint: 2000,
					settings: {
						slidesToShow: 6
					}
				},
				{
					breakpoint: 1600,
					settings: {
						slidesToShow: 5
					}
				},
				{
					breakpoint: 1300,
					settings: {
						slidesToShow: 4
					}
				},
				{
					breakpoint: 1025,
					settings: {
						swipe: true,
						slidesToShow: 3
					}
				},
				{
					breakpoint: 900,
					settings: {
						swipe: true,
						slidesToShow: 2
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						arrows: false,
						swipe: true,
						variableWidth: true
					}
				}
			]
		});
		$('.img-link-carousel').imagesLoaded().done( function( ) {
			$('.carousel-box').addClass('loaded');
		});
		
		if ($('.media-check').outerWidth() <= 1024) {
			$('.img-link-carousel.insta').slick('slickGoTo',1, true);
		}
	}
	
	if ($('.gallery-carousel').get(0)) {
			
		$('.gallery-carousel').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			responsive: [
				{
					breakpoint: 9999,
					settings: "unslick"
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						variableWidth: true,
						dots: false,
						arrows: false
					}
				}
			]
		});
	}
	
	if ($('input[type=tel]').get(0)) {
		$('input[type=tel]').inputmask('+7 (999) 999-99-99',{ showMaskOnFocus: true, showMaskOnHover: false });
	}
	
	$('.on-top').click(function() {
		var boxValue = $(this).attr('href');
		$('body').scrollTo(boxValue,500,{offset:-160});
		$('.on-top').removeClass('opened');
		return false;
	});
	
	if ($('.on-top').get(0)) {
		
		$(window).on('mousewheel', function(e) {
			if ($(window).scrollTop() > 600) {
				if (e.deltaY > 0)
				{
					$('.on-top').addClass('opened');
				}
				else
				{
					$('.on-top').removeClass('opened');
				}
			} else {
				$('.on-top').removeClass('opened');
			}
		});

		if (hasTouch){
			$(document).on("touchstart", function(e) {
				var startingY = e.originalEvent.touches[0].pageY;
				$(document).on("touchmove", function(e) {
					var currentY = e.originalEvent.touches[0].pageY;
					var delta = currentY - startingY;
					if ($(window).scrollTop() > 600) {
						if (delta > 0)
						{
							$('.on-top').addClass('opened');
						}
						else
						{
							$('.on-top').removeClass('opened');
						}
					} else {
						$('.on-top').removeClass('opened');
					}
				});
			});
		}
	}
	
	$('.form-btn').click(function() {
		var boxValue = $(this).attr('href');
		if ($('.media-check').outerWidth() < 768) {
			$('body').scrollTo(boxValue,500,{offset:-$('.sticky-menu').outerHeight()});
		}
		else {
			$('body').scrollTo(boxValue,500,{offset:-($('.sticky-menu').outerHeight()+20)});
		}
		return false;
	});
				
	
	$('.dropdown-btn, .filter-dropdown-btn').click(function(){
		if ($(this).hasClass('opened')) {
			$('.dropdown-btn, .filter-dropdown-btn').removeClass('opened');
			$(this).closest('.nowrap-line').css({'overflow' : ''});
		}
		else {
			if ($('.media-check').outerWidth() <= 1024) {
				$(this).closest('.nowrap-line').css({'overflow' : 'visible'});
			}
			if ($('.media-check').outerWidth() < 768) {
				if ($(this).parents('.text-dropdown').length == 0) {
					$('body').addClass('overflow-fixed');
				}
				$('.filter-form-box').removeClass('active');
			}
			$('.dropdown-btn, .filter-dropdown-btn').removeClass('opened');
			$(this).addClass('opened');
			if ($(this).hasClass('filter-dropdown-btn')) {
				$('.filter-form-box').addClass('active');
				fixbtns();
			}
		}
		return false;
	});
	
	$('html').click(function(e) {
		if ($('.dropdown-btn').hasClass('opened')) {
			if ($(e.target).parents('.dropdown-box').length == 0) {
				$('.dropdown-btn').removeClass('opened');
				$('body').removeClass('overflow-fixed');
				return false;
			}
		}
		if ($('.filter-dropdown-btn').hasClass('opened')) {
			if ($(e.target).parents('.filter-dropdown-box').length == 0) {
				$('.filter-dropdown-btn').removeClass('opened');
				$('body').removeClass('overflow-fixed');
				$('.filter-form-box').removeClass('active');
				if ($('.nowrap-line').get(0)) {
					$('.nowrap-line').css({'overflow' : ''});
				}
				return false;
			}
		}
		if ($('.sort-box').hasClass('opened')) {
			if ($(e.target).parents('.sort-box').length == 0) {
				$('.sort-box').removeClass('opened');
				return false;
			}
		}
	});
	
	function setFilterVal(clickButton) {
// TODO: Р·Р°РґРµСЂР¶РєР° С‚РµСЂР±СѓРµС‚СЃСЏ РїСЂРё РєР»РёРєРµ РЅР° РїРѕР»Р·СѓРЅРѕРє (value Сѓ input РЅРµ СѓСЃРїРµРІР°РµС‚ РјРµРЅСЏС‚СЊСЃСЏ)
	    setTimeout(function () {
            var i = $(clickButton).parents('.filter-dropdown-box').find('input[type="checkbox"]').filter(':checked').length;

            if ($(clickButton).parents('.filter-dropdown-box').find('#lower-1').val() > 0 || $(clickButton).parents('.filter-dropdown-box').find('#higher-1').val() < parseInt($(clickButton).parents('.filter-dropdown-box').find('#higher-1').attr('max')))
                i++;
            if ($(clickButton).parents('.filter-dropdown-box').find('#lower-2').val() > 0 || $(clickButton).parents('.filter-dropdown-box').find('#higher-2').val() < parseInt($(clickButton).parents('.filter-dropdown-box').find('#higher-2').attr('max')))
                i++;
            if ($(clickButton).parents('.filter-dropdown-box').find('[type="text"][name="limit[start]"]').val() > '0' || $(clickButton).parents('.filter-dropdown-box').find('[type="text"][name="limit[end]"]').val() > '0')
                i++;

            if (i > 0) {
                $(clickButton).parents('.filter-dropdown-box').prev().find('div').text(i).show();
                $('.clear-form').show();
            }
            else {
                $(clickButton).parents('.filter-dropdown-box').prev().find('div').text('').show();
                $(clickButton).parents('.filter-dropdown-box').prev().find('div').hide();
                var nunbers = $('.filter-dropdown-btn div').get();
                var isHide = true;
                for (var key in nunbers) {
                    if ($(nunbers[key]).html() > 0)
                        isHide = false;
                }
                if (isHide)
                    $('.clear-form').hide();
            }
        }, 100);
    }

	(function () {
        var data = $('#form_filter').find('.no-spaces');
        if (data.length) {
            for (var i = 0; i < data.length; i++)
                setFilterVal(data[i])
        }
    })();
    
	$('input[type="checkbox"], input[type="radio"], input[type="text"]').change(function(){
		if ($('.dropdown-btn').hasClass('opened')) {
			var fieldText = $(this).next().text();
			$(this).parents('.dropdown-box').prev('.dropdown-btn').find('div').text(fieldText).show();
			$('.dropdown-btn').removeClass('opened');
			$('body').removeClass('overflow-fixed');
		}
		if ($('.filter-dropdown-btn').hasClass('opened')) {
			setFilterVal(this);
		}
	});
		
	$('.close-dropdown, .cancel, .filter-dropdown-close').click(function(){
		$('.dropdown-btn, .filter-dropdown-btn').removeClass('opened');
		$('body').removeClass('overflow-fixed');
		$('.filter-form-box').removeClass('active');
		if ($('.nowrap-line').get(0)) {
			$('.nowrap-line').css({'overflow' : ''});
		}
		return false;
	});
	
	$('.clear-form').click(function(){
		// TODO: Р—Р°РєР°Р·С‡РёРє РїРѕСЃС‡РёС‚Р°Р» РЅРµРѕР±С…РѕРґРёРјС‹Рј СЃР±СЂР°СЃС‹РІР°С‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚С‹ РІРјРµСЃС‚Рµ СЃ С„РёР»СЊС‚СЂРѕРј. РЈРґР°Р»РёС‚СЊ РєРѕРґ, РµСЃР»Рё РЅРµ РїРµСЂРµРґСѓРјР°РµС‚.
		// ->
		window.location = this.href;
		return true;
		// <-
		$(this).parents('form').get(0).reset();
		if ($(this).parents('form').find('[id*="range-slider"]').get(0)) {
            if (rangeSlider)
				rangeSlider.noUiSlider.reset();
			if (rangeSlider2)
				rangeSlider2.noUiSlider.reset();
		}
		$('input[type="checkbox"]:checked').prop("checked", false);
		$(this).parents('form').find('.filter-dropdown-btn').find('div').hide();
		$(this).hide();
		$('.dropdown-btn, .filter-dropdown-btn').removeClass('opened');
		$('body').removeClass('overflow-fixed');
		$('.filter-form-box').removeClass('active');
		return false;
	});
	
	$('.sort-box > div:first-child a').click(function(){
		$('.sort-box').toggleClass('opened');
		return false;
	});
	

	if ($('.equal-height').get(0)) {
		$('.equal-height').matchHeight({
			property: 'min-height',
			byRow: true
		});
	}
	
	if ($('.equal-box').get(0)) {
		$('.equal-box').matchHeight({
			byRow: false
		});
	}
	
	if ($('header').get(0)) {
			
		if ($('.media-check').outerWidth() > 1024) {
			if ($(window).scrollTop() > $('.top-banner').outerHeight())
			{	
				$('body').addClass('sticky');
			}
			else {
				$('body').removeClass('sticky');
			}
			$(window).on('scroll', function() {
				if ($(window).scrollTop() > $('.top-banner').outerHeight())
				{	
					$('body').addClass('sticky');
				}
				else {
					$('body').removeClass('sticky');
				}
			});
		}
		else {
			if ($(window).scrollTop() > 0)
			{	
				$('body').addClass('sticky');
			}
			else {
				$('body').removeClass('sticky');
			}

			$(window).on('scroll', function() {
				if ($(window).scrollTop() > 0)
				{	
					$('body').addClass('sticky');
				}
				else {
					$('body').removeClass('sticky');
				}
			});
		}
	}
	
	if ($('.hidden-numbers').get(0)) {
		$('.expand-numbers').click(function(){
			var box = $(this).parents('.hidden-numbers');
			var curHeight = box.height();
			var autoHeight = box.css({'height' : 'auto'}).height();
			box.css({'height' : curHeight});
			box.stop().animate({ 'height' : autoHeight }, 500);
			$(this).hide();
			return false;
		});
	}
	
//	if ($('.input-datepicker').get(0)) {
//	
//		if ($('.media-check').outerWidth() > 1024) {
//			$('#datepicker').datepicker();
//		}
//		else {
//			$('.input-datepicker').attr('type','date');
//		}
//	}
	
	if ($('.scroll-menu').get(0)) {
		$('.scroll-menu').onePageNav();
	}
	if ($('.scroll-nav').get(0)) {
		if ($('.media-check').outerWidth() >= 768) {
			$('.scroll-nav').onePageNav({
				scrollOffset: $('.sticky-menu').outerHeight() + 20,
				filter: 'a'
			});
		}
		else {
			$('.scroll-nav').onePageNav({
				scrollOffset: $('.sticky-menu').outerHeight() + 40,
				filter: 'a'
			});
		}
	}
	
	sticky_fn('.sticky-box',0);
		
	if ($('.btns-box').get(0)) {
		if ($('.media-check').outerWidth() >= 768) {
			$('.btns-box').each(function(){
				if ($(this).children().first().outerHeight() > $(this).outerHeight()) {
					$(this).addClass('overflowed');
				}
			});
		}
		
		$('.btns-box-btn').click(function() {
			$(this).parents('.btns-box').toggleClass('opened');
			fixbtns();
			return false;
		});		
	}
	
	if ($('.expand-box').get(0)) {
		$('.expand-box').each(function(){
			if ($(this).children().first().outerHeight() > $(this).outerHeight()) {
				$(this).addClass('overflowed');
			}
		});
		
		$('.expand-btn').click(function() {
			var box = $(this).prev();
			autoHeightAnimate(box, 500);
			box.toggleClass('opened');
			return false;
		});		
	}
	
	if ($('.sticky-menu').get(0)) {
		var offset =  $('header').outerHeight();
		if ($('.not-sticky').get(0)) {
			offset = 0;
		}
		if ($(window).scrollTop() > $('.sticky-menu-spacer').offset().top - offset)
		{	
			$('.sticky-menu').addClass('fixed');
		}
		else {
			$('.sticky-menu').removeClass('fixed');
		}
		var checkMenu = true;
		$(window).on('scroll', function() {
			if ($(window).scrollTop() > $('.sticky-menu-spacer').offset().top - offset)
			{	
				if (checkMenu) {
					$('.sticky-menu-spacer').css({'height' : $('.sticky-menu').outerHeight()});
					checkMenu = false;
				}
				$('.sticky-menu').addClass('fixed');
			}
			else {
				$('.sticky-menu').removeClass('fixed');
				$('.sticky-menu-spacer').css({'height' : ''});
				checkMenu = true;
			}
		});
	}
	
	if ($('.gallery-carousel').get(0)) {
		$( '.gallery-carousel a' ).summitLightbox();
	}
	
	$(document).on('click', '#tml-content', function(){
		$( '.gallery-carousel a' ).data('summitLightbox').nextContent();
	});
	
		
	$(window).on('scroll', function() {
		if ($('.media-check').outerWidth() > 1024) {
			if ($('.filter-dropdown-btn.opened').get(0)) {	
				var box = $('.filter-dropdown-btn.opened').next('.filter-dropdown-box.full-width');
				if ($(window).scrollTop() > box.offset().top + box.outerHeight() - $(window).outerHeight())
				{	
					box.find('.filter-box-btn').removeClass('fixed');
				}
				else {
					box.find('.filter-box-btn').addClass('fixed');
				}
			}
		}
	});
	
	$('.checkbox-btn').click(function(){
		if ($(this).hasClass('checked-label')) {
			$(this).addClass('hovered');
			$(this).removeClass('checked-label');
		}
		else {
            $(this).addClass('checked-label');
            if ($(this).hasClass('hovered')) {
                $(this).removeClass('hovered');
            }
        }
	});
	
	$('.checkbox-btn').on('mouseleave', function(){
		if ($(this).hasClass('hovered')) {
			$(this).removeClass('checked-label');
		}
		$('.checkbox-btn').removeClass('hovered');
	});
	
});

$(window).load(function() {
	$('body').removeClass('loading');
});

$(window).resize(function() {

	if ($('.media-check').outerWidth() <= 1024) {
		$('body').removeClass('not-touch');
		$('body').addClass('this-touch');
	}
	else {
		$('body').addClass('not-touch');
		$('body').removeClass('this-touch');
	}
	
	if ($('header').get(0)) {
		
		if ($('.media-check').outerWidth() > 1024) {
			if ($(window).scrollTop() > 0)
			{	
				$('body').addClass('sticky');
			}
			else {
				$('body').removeClass('sticky');
			}
		}
	}
	
	sticky_fn('.sticky-box',140);
	
	if ($('.media-check').outerWidth() >= 768) {
		$('.btns-box').each(function(){
			$(this).removeClass('opened');
			if ($(this).children().first().outerHeight() > $(this).outerHeight()) {
				$(this).addClass('overflowed');
			}
			else {
				$(this).removeClass('overflowed');
			}
		});
	}
	
	if ($('.sticky-menu').get(0)) {
		$('.sticky-menu-spacer').css({'height' : $('.sticky-menu').outerHeight()});

		if ($(window).scrollTop() > $('.sticky-menu-spacer').offset().top - $('header').outerHeight())
		{	
			$('.sticky-menu').addClass('fixed');
		}
		else {
			$('.sticky-menu').removeClass('fixed');
		}
	}
	
	fixbtns();
		
});

$(document).ready(function() {
	if ($(".hidden1").length){
		var w=$(window).width();
		$(".onetagonly").show();
		if (w >= 768){
			$(".phone-for-mob").hide();
		}
		else{
			$(".phone-for-mob").show();
		}
        $(".on-top svg").css("margin","14px 0 0");
	}
	else{
		$(".phone-for-mob").hide();
		$(".onetagonly").hide();
	}
});