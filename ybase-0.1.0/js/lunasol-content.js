$(function () {
  $('#lunasolTabContainer .js-itemMovie').on('click', function (e) {
    e.preventDefault(); //リンクの停止

    var movieID = $(this).data('movie');
    $(this).parent().html('<iframe src="https://www.youtube.com/embed/' + movieID + '?autoplay=1&mute=1&rel=0&controls=0"></iframe>');
  });
  $('#lunasolTabContainer .js-itemAccordionBtn').on('click', function (e) {
    $(this).toggleClass('-show');
    $(this).next('.item-tabCnt-accordion-contents').slideToggle();
  });
  $('#lunasolTabContainer .js-movieBlockMoreBtn').on('click', function (e) {
    var moreBtnDom = $(this).parent('.item-tabCnt-movieBlock-more');
    var movieBlockDom = moreBtnDom.parent('.item-tabCnt-movieBlock');
    moreBtnDom.addClass('-hide');
    movieBlockDom.next('.js-hideMovieBlock').slideDown();
  });
  $('#lunasolTabContainer .js-closeMovieBlock').on('click', function (e) {
    var moreBtnDom = $(this).parents('.tab-panel').find('.item-tabCnt-movieBlock-more');
    var movieBlockDom = moreBtnDom.parent('.item-tabCnt-movieBlock');
    moreBtnDom.removeClass('-hide');
    movieBlockDom.next('.js-hideMovieBlock').slideUp();
  });
  $('#lunasol .js-itemCompareColor').on('click', function (e) {
    $(this).next('.item-comparison-colorList').toggleClass('-show');
  });
  $('#lunasol .js-itemCompareItem').on('click', function (e) {
    var colorname = $(this).data('colorname');
    var colorno = $(this).data('colorno');
    var imageno = $(this).data('imgno');
    var parentDom = $(this).parents('.item-comparison-blockInner');
    var innerDom = $(this).find('span').html();
    parentDom.find('.item-comparison-note').text(colorname);
    parentDom.find('.js-itemCompareColor').html('<span>' + innerDom + '</span>' + colorno);
    parentDom.find('.item-comparison-thumbnail').removeClass('-show');
    parentDom.find('.item-comparison-thumbnail[data-comparisonthum="' + imageno + '"]').addClass('-show');
    parentDom.find('.item-comparison-colorList').removeClass('-show');
  }); // accordion (module_2 .item-newItem)

  $('.item-newItem-detailBtn').on('click', function (e) {
    e.preventDefault();
    $(this).next().slideToggle();
    $(this).toggleClass('-open');
  }); // Youtube Slider (module_2 .item-newItem)

  $('.item-newItem-lookMovie').slick({
    prevArrow: '<button type=”button” class="slick-prev slick-arrow"></button>',
    nextArrow: '<button type=”button” class="slick-next slick-arrow"></button>'
  });
  $('.item-newItem-lookMovie').on('beforeChange', function () {
    var $movie = $('.slick-current').find('.movie')[0].contentWindow;
    $movie.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
  }); // Img Slider (module_2 .item-newItem)

  $('.item-newItem-lookImg').slick({
    prevArrow: '<button type=”button” class="slick-prev slick-arrow"></button>',
    nextArrow: '<button type=”button” class="slick-next slick-arrow"></button>'
  }); // variation

  $('.js-variation-btn.-open').on('click', setOpenData);
  $('.js-variation-btn.-close, .js-variation-gradation-btn').on('click', setCloseData);

  function setHiddenCard($this) {
    var initialItemLength = 11;
    var w = $(window).width();

    if (w <= 991) {
      initialItemLength = 7;
    }

    $this.find('.item-variation-card:gt(' + initialItemLength + ')').addClass('-hideCard').hide();
  }

  var $hiddenCardItem;

  function setOpenData() {
    var $parentElem = $(this).closest('.item-variation');
    $hiddenCardItem = $parentElem.find('.item-variation-card.-hideCard');
    $parentElem.find($hiddenCardItem).slideDown();
    $parentElem.find('.js-variation-btn.-open').css('display', 'none');
    $parentElem.find('.js-variation-btn.-close').css('display', 'inline-block');
    $parentElem.find('.js-variation-gradation-btn').fadeOut();
  }

  function setCloseData($hiddenCardItem) {
    var $parentElem = $(this).closest('.item-variation');
    $hiddenCardItem = $parentElem.find('.item-variation-card.-hideCard');
    $parentElem.find($hiddenCardItem).slideUp();
    $parentElem.find('.js-variation-btn.-close').css('display', 'none');
    $parentElem.find('.js-variation-btn.-open').css('display', 'inline-block');
    $parentElem.find('.js-variation-gradation-btn').fadeIn();
  }

  $(window).on('load', function () {
    // variation
    if ($('.item-variation').length) {
      $('#lunasol .item-variation').each(function () {
        var $this = $(this);
        setHiddenCard($this);
      });
    } // carousel


    if ($('.js-carousel-col3').length) {
      $('.js-carousel-col3').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button type=”button” class="slick-prev slick-arrow"></button>',
        nextArrow: '<button type=”button” class="slick-next slick-arrow"></button>',
        responsive: [{
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }]
      });
    }

    if ($('.js-carousel-col2').length) {
      $('.js-carousel-col2').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        prevArrow: '<button type=”button” class="slick-prev slick-arrow"></button>',
        nextArrow: '<button type=”button” class="slick-next slick-arrow"></button>',
        responsive: [{
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }]
      });
    }

    if ($('.tabArea').length > 0) {
      var tabArea = $('.tabArea');

      tabArea.each(function() {
        var tabLinkLi = $(this).find('.tab-links li');
        var tabLink = tabLinkLi.children('a');
        var tabPanel = $(this).find('.tab-panel');
        tabLinkLi.first().children('a').addClass('is_current');
        tabPanel.first().addClass('is_current');

        var tabSwitch = function (hashID) {
          if (hashID) {
            var scrollFlg = false;

            tabLink.each(function () {
              var idName = $(this).attr('href');

              if (idName == hashID) {
                tabLink.removeClass('is_current');
                $(this).addClass('is_current');

                tabPanel.removeClass('is_current');
                tabPanel.hide();

                $(hashID).addClass('is_current');
                $(hashID).fadeIn();

                scrollFlg = true;
              }
            });

            if (scrollFlg) {
              $('body, html').animate(
                {
                  scrollTop: $(hashID).parents('.tabArea').offset().top,
                },
                400,
                'swing'
              );
            }
          }
        };

        tabSwitch(location.hash);

        tabLink.click(function () {
          tabSwitch($(this).attr('href'));
          return false;
        });
      });
    }

  });
});