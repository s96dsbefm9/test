
if (!window.ab) {
    window.ab = {};
}

var ab = window.ab;
var $backToTop = $('.back-to-top');
if($('#orderHistoryTemplate').length > 0) {
    var pagearray = orderHistoryJsonList || [];
}
(function ($) {
    $.fn.textNodeText = function() {
        var result = "";
        $(this).contents().each(function() {
            if (this.nodeType === 3 && this.data) {
                result += jQuery.trim( $(this).text() );
            }
        });
        return result;
    };
    ab.global = {
        scrollPosition : 0,
        breakpoints: {
            sm: 480,
            md: 768,
            lg: 992,
            xl: 1200
        },
        resMobile: true,
        resDesktop: true,

        responsiveView: function(){
            var _self = ab.global;

            if (_self.screenWidth <= _self.breakpoints.lg - 1 && _self.resMobile === true) {
                _self.resMobile = false;
                _self.resDesktop = true;
                $('body').removeClass('desktop-view').addClass('mobile-view');
            }
            else if(_self.screenWidth >= _self.breakpoints.lg && _self.resDesktop === true ){
                _self.resMobile = true;
                _self.resDesktop = false;
                $("body").addClass('desktop-view').removeClass('mobile-view');
            }
        },
       
        scrollTarget: function (target, el, val) {
            el = el || jQuery('html, body');
            val = val || 0;
            var elScrollToTopVal = el.scrollTop();
            var targetOffsetVal = target.offset().top - val;
            el.animate({
                scrollTop: targetOffsetVal
            }, 'slow');
        },

        mobileMenu : function() {
             $("#burger").on('click', function(e){ 
                 e.preventDefault();
                 $(this).toggleClass("open");
                 $('body').toggleClass('offcanvas');
                 $('.js_navigation--bottom').slideToggle();
             });
        },

        homePageBanner : function() {
            if(!$('body', parent.document).hasClass('is-storefront')) {
	            $('.carousel_suquu').slick({
	                dots: true,
	                arrows: true,
	                autoplay: true,
	                fade: false,
	                prevArrow:'<div class="g-carousel_btn g-carousel_prev"><i class="g-i g-i-arrow-l" aria-hidden="true"><img src="/_ui/responsive/theme-lunasol/images/ic_chevron_left.png"></i></div>',
    	            nextArrow:'<div class="g-carousel_btn g-carousel_next"><i class="g-i g-i-arrow-r" aria-hidden="true"><img src="/_ui/responsive/theme-lunasol/images/ic_chevron_right.png"></i></div>',
                    centerMode: false
	            });
        	}
        },

        productsSliderOption : {
            dots: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            arrows: true,
            infinite: true,
            prevArrow:"<button type='button' class='slick-prev pull-left glyphicon glyphicon-menu-left' aria-label='前へ'></button>",
            nextArrow:"<button type='button' class='slick-next pull-right glyphicon glyphicon-menu-right' aria-label='次へ'></button>",
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }
            ]
        },

        categoryTab : function() {
            $('.category-tab .tab-menu').on('click', function() {
                var targetName = $(this).data('name');
                var tabRoot = $(this).closest('.category-tab');
                tabRoot.find('.tab-content').hide();
                tabRoot.find('.tab-menu').removeClass('active');
                $(this).addClass('active');
                tabRoot.find(".tab-content[data-name='" + targetName + "']").show()
                    .find('.slick-initialized').slick('setPosition');
            });
        },

        requestRecommend : function(component) {
            let sliders = component.find('.popularityranking:not(.slick-initialized)');
            if (sliders.length > 0) {
                let template = component.find('.js-recommend-template');
                let deferreds = [];
                let userId;
                if (component.data('specifyUser') == 1) {
                    userId = component.data('user_id') || getCookie('zd-cookie-user-id');
                    if (!userId) {
                        return;
                    }
                }
                const params = ['model_id','l','goods_id','goods_id__not','in_stock','category'];

                sliders.each(function() {
                    let url = $(this).data('url');
                    let data = { brand: 'lunasol', user_id: userId };
                    for (let i = 0; i < params.length; i++) {
                        if ($(this).data(params[i]) !== '') {
                            data[params[i]] = $(this).data(params[i]);
                        }
                    }
                    deferreds.push($.ajax({
                        type: 'POST',
                        url: url,
                        async: true,
                        dataType: 'json',
                        data: data,
                        timeout: 5000
                    }));
                });

                $.when.apply($, deferreds).done(function() {
                    try {
                        let empty = false;
                        let resArray = sliders.length === 1 ? [arguments] : arguments;
                        for(let i = 0; i < resArray.length; i++) {
                            let result = resArray[i][0].result;
                            if (result.items.length > 0) {
                                template.tmpl(result).appendTo(sliders[i]);
                            } else {
                                empty = true;
                                break;
                            }
                        }
                        if (!empty) {
                            component.show();
                            sliders.slick(ab.global.productsSliderOption);
                        }
                    } catch(e) {
                    }
                });
            }
        },

        recommendComponent : function() {
            var _self = ab.global;
            let components = $('.recommend__component');
            if (components.length > 0) {
                components.each(function() {
                    _self.requestRecommend($(this));
                });
                _self.categoryTab();
            }
        },
        
        hashtagComponent : function() {
            const hashtagElements = $('div.zh-hashtag-item').get();
            while (hashtagElements.length > 0) {
                const $target = $(hashtagElements.shift());
                const apiUrl = $target.data('api-url');
                const linkUrl = $target.data('destination-url');
                const params = {
                    brand_id: $target.data('query-brand_id'),
                    limit: $target.data('query-limit'),
                    zh_sort: $target.data('query-zh_sort'),
                    product_code: $target.data('query-product_code'),
                    category_id: $target.data('query-category_id'),
                    hashtag: $target.data('query-hashtag')
                };
                for (let i = 0; i < hashtagElements.length; i++) {
                    if ($target[0].isEqualNode(hashtagElements[i])) {
                        $target.push(hashtagElements[i]);
                        hashtagElements.splice(i, 1);
                        i--;
                    }
                }

                $.ajax({
                    type: 'GET',
                    url: apiUrl,
                    async: true,
                    dataType: 'jsonp',
                    data: params,
                    timeout: 5000
                }).done(function(data) {
                    if (data.length > 0) {
                        let html = '';
                        for (let i = 0; i < data.length; i++) {
                            html += '<a class="zh-hashtag-item" href="'
                                + linkUrl.replace('{{ hashtag }}', data[i]) + '">'
                                + data[i] + '</a>';
                        }
                        $target.html(html);
                        $target.closest('.hashtag__component').show();
                    }
                });
            }
        },

        carouselComponent : function() {
            let slider = $('.carousel__component .popularityranking:not(.slick-initialized)');
            if (slider.length > 0) {
                slider.slick(ab.global.productsSliderOption);
            }
        },

        backToTop : function() {
            $backToTop.click(function(){ 
               $("html, body").animate({ scrollTop: 0 }, 600); 
               return false; 
           }); 

       },

       backToTopScroll : function() {
           var buttonSticky ='';
            if ($(window).width() < 992) {
                buttonSticky = 290;
             }
             else {
                buttonSticky = 100;
             }
         if ($(window).scrollTop() > 90) { 
            $backToTop.fadeIn('slow');
            $backToTop.addClass('float');
             if ($(".page-productDetails").length > 0 ) {
                 if ($('#ccfloatBlock').is(":visible")) {
                     $backToTop.css('bottom', $('#ccfloatBlock').height() +  20);
                 }
             }
        } else { 
            $backToTop.fadeOut('slow', function(){
                $(window).removeClass('float');
            }); 
        } 
    },
    
    formValidation: function(){
	    $('.form-validation').each(function () {
	        $(this).validate({
	            errorClass: "err-msg",
	            validClass: "success",
	            errorElement: 'span',
	            focusInvalid: true,                    
	            errorPlacement: function (error, element) {
	                if (element.is(':input, textarea, select')) {
	                    error.appendTo(element.closest('.form-group').addClass('error'));   
	                    //ab.global.scrollTarget($('.form-group.error'));                    
	                } else {
	                    error.insertAfter(element);
	                }
	            },
	            onfocusout: function (element) {
	                this.element(element);
	            },
	            highlight: function (element, errorClass, validClass) {
	                $(element).parents('.form-group').addClass('error');
	            },
	            unhighlight: function (element) {
	                $(element).removeClass("err-msg");
	                if($('.form-group.error').find('.multiNumber').length) {
                        var noError = true;
                        $(element).parents('.form-group').children('.multiNumber').children('.atp').each(function(){
                            if($(this).find('input').val() === "") {
                                noError = false;
                            }
                        });
                        if (noError === true) {
                            $(element).parents('.form-group').removeClass("error");
                        }
                    } else {
                        $(element).parents('.form-group').removeClass("error");
                    }
	            }
	        });
	
	    });
	    
	    // Japanese full width chars to half width chars
        function toASCII(chars) {
            var ascii = '';
            for(var i=0, l=chars.length; i<l; i++) {
                var c = chars[i].charCodeAt(0);

                // make sure we only convert half-full width char
                if (c >= 0xFF00 && c <= 0xFFEF) {
                    c = '';
                   // c = 0xFF & (c + 0x20);
                }

                ascii += String.fromCharCode(c);
            }

            return ascii;
        }
        
     // Japanese half width chars remove    
        
        let halfWidthChar;
        
        function checkHalfWidthChars(input) {
        	halfWidthChar = false;
            for (let i = 0; i < input.length; i++) {
                let code = input.charCodeAt(i);
                if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
                	halfWidthChar = true;
                }
            }
            return halfWidthChar;
        }
        
     // half width character check 
        
        $.validator.addMethod("data-msg-halfwidth", function (value, element) {
        	var halfWidth = checkHalfWidthChars(value);
        	return halfWidth === false;
        }, function (params, element) {
        	return $(element).data('msg-halfwidth') != null ? $(element).data('msg-halfwidth') : "Please enter only full width characters.";
        });
      
     // Japanese kana character check
        
        $.validator.addMethod("data-msg-kana", function(value, element) {
            return this.optional(element) || value == value.match(/^[ァ-ヴ―－ー]*$/);
         }, function (params, element) {
            return $(element).data('msg-kana') != null ? $(element).data('msg-kana') : "Please enter full-width kana characters.";
        });
        
     // Japanese full width and half width chars check     
        function checkFHCharsLength(input) {
            let len = 0;
            for (let i = 0; i < input.length; i++) {
                let code = input.charCodeAt(i);
                if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
                    len += 1;
                } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
                    len += 2;
                } else {
                    len += 0;
                }
            }
            return len;
        }

        // full and half width character maxlength check    
        $.validator.addMethod("data-msg-fhlength", function (value, element) {
        	var finalLength = checkFHCharsLength(value);
        	return finalLength <= $(element).data('fhlength');
        }, function (params, element) {
        	return $(element).data('msg-fhlength') != null ? $(element).data('msg-fhlength') : "Please enter within 50 full-width or 100 half-width characters.";
        });
        
      //To remove the decimal dot
        $(".js-qty-selector-input, .js-update-entry-quantity-input").on("keyup paste focusout", function (e) {
        	let qtyValue = $(this).val().replace(/[^0-9]+/g, "");
        	$(this).val('');
        	$(this).val(qtyValue);
        });
        
        
	    //Allow only numbers
        
        $(".numbersOnly").on("keyup paste focusout", function (e) {
        	let thisValue = $(this).val();
        	const isNumber = isFinite(thisValue);
        	if(isNumber === false) {
        		let finalValue = thisValue.replace(/[^0-9]+/g, "");
        		$(this).val(finalValue);
        	}
        });
        
        $(".numbersOnly").on("keydown", function (event) {
        	const numFlag = isFinite(event.key)
        	if(!(event.ctrlKey && event.keyCode==86) && numFlag === false && event.which !== 8 && event.which !== 46 && event.which !== 37 && event.which !== 39 && event.which !== 9 && event.which !== 13 && event.which !== 16 && event.which !== 17 && event.which !== 18 && event.which !== 19 && event.which !== 20 && event.which !== 27 && event.which !== 35 && event.which !== 36 && event.which !== 45 || event.which === 32) {
        		return false;
        	}
        });
        
        // prevent maxlength

        $('#msgTextArea').on('blur', function(){
        	  var maxlength = parseInt($(this).attr('maxlength')),
        	      text = $(this).val(),
        	      eol = text.match(/(\r\n|\n|\r)/g),
        	      count_eol = $.isArray(eol) ? eol.length : 0,//error if eol is null
        	      count_chars = text.length - count_eol;
        	  if (maxlength && count_chars > maxlength)
        	    $(this).val(text.substring(0, maxlength + count_eol));
        	});
        
        $('#cartAdditionalForm').submit(function () {
        	if($(this).find('.error').length){	
        		$('html, body').animate({
                    scrollTop: ($(".error").offset() || { "top": NaN }).top
                }, 300);
        		return false;
        	}
        });
          
          $('.customAlphaNumberOnly').on('keyup input', function(){
      		var thisValue = $(this).val();
      		var valMatch = (thisValue == thisValue.match(/^[^~`!%\&^_\-=\}\]{\[\\$.|#@?*+()"';:/<>,.]+$/));
      		if(valMatch === false && thisValue != "") {
      			$(this).next('.err-msg').remove();
      			var errorMsg = $(this).data('msg-alphanmeric') || 'Special characters are not allowed';
      			$(this).parent().append('<span for="msgTextArea" class="err-msg">' + errorMsg +'</span>');
      		}else {
      			$(this).parent().find('.err-msg').remove();
      		}
      	});
    	
    	$('.maxLengthChar').on('keyup blur paste', function(){
  		  var maxlength = parseInt($(this).attr('data-max-length')),
  		      text = $(this).val(),
  		      eol = text.match(/(\r\n|\n|\r)/g),
  		      count_eol = $.isArray(eol) ? eol.length : 0,//error if eol is null
  		      count_chars = text.length - count_eol;
  		  if (maxlength && count_chars > maxlength)
  		    $(this).val(text.substring(0, maxlength + count_eol));
  		});
        
        // Allow only chars
        $.validator.addMethod("alphaOnly", function(value, element) {
            return this.optional(element) || value == value.match(/^[^0-9~`!%\&^_\-=\}\]{\[\\$.|#@?*+()"';:/<>,.]+$/);
         }, function (params, element) {
            return $(element).data('msg-alphanmeric') != null ? $(element).data('msg-alphanmeric') : "Must accept only alphabet & spaces, no special chars and numbers";
        });

        // Allow only chars & numbers
        $.validator.addMethod("alphaNumbers", function (value, element) {
            return this.optional(element) || value == value.match(/^[^~`!%\&^_\-=\}\]{\[\\$.|#@?*+()"';:/<>,.]+$/);
        }, function (params, element) {
            return $(element).data('msg-alphanmeric') != null ? $(element).data('msg-alphanmeric') : "Special characters are not allowed";
        });

        // Allow only chars, numbers & certain special characters for message card textarea
        $.validator.addMethod("alphaNumericMc", function (value, element) {
            return this.optional(element) || isValidMessageCardContent(value);
        }, function (params, element) {
            return $(element).data('msg-alphanmeric') != null ? $(element).data('msg-alphanmeric') : "Special characters are not allowed";
        });
        
        $.validator.addMethod("alphanumeric", function(value, element) {
        	return this.optional(element) || /^[^~`!%\&^\-=\}\]{\[\\$.|#@?*+()"';:/<>,.]+$/i.test(value);
        }, $("#invalidtext").val());
        
        $.validator.addMethod("alphanumericOnly", function(value, element) {
        	return this.optional(element) || value == value.match(/[0-9a-zA-Z ]+$/);
         }, function (params, element) {
            return $(element).attr('alphanmericonly') != null ? $(element).attr('alphanmericonly') : "Please enter alpha numeric characters";
        });
    },
     
//    jsBarcodeInit: function () {
//    	JsBarcode(".barcode").init();
//    },
    
    searchResultValidation: function(){$('#suqquSearchFilterForm').validate({ 
		errorClass: "err-msg",
        validClass: "success",
        errorElement: 'span',
        focusInvalid: true, 
		 errorPlacement: function (error, element) {
                if (element.is(':input, textarea, select')) {
                    error.appendTo(element.closest('.form-group').addClass('error'));   
                    //ab.global.scrollTarget($('.form-group.error'));                    
                } else {
                    error.insertAfter(element);
                }
            },
            onfocusout: function (element) {
                this.element(element);
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form-group').addClass('error');
            },
            unhighlight: function (element) {
                $(element).removeClass("err-msg");
                $(element).parents('.form-group').removeClass("error");
            },				
	    	rules: {
	    		productName:{
	    			alphanumeric: true
	    		},
	            keyword:{
	            	alphanumeric: true
	            }
            },
            
            
	    });
    },

    deliveryStatement: function() {
      	$('.simpleAccordion_btn').on('click', function(){
      		this.classList.toggle("acc-active");
      	});
    },

    datePickerUI : function() {
    	//AMP-616 fix
    	var selectDate = $(".selectedDate").text();
    	var selectedDate = new Date(selectDate);
    	var dayNamesShort= ['日', '月', '火', '水', '木', '金', '土'];
    	var d = new Date(selectedDate);
    	var lang = 'ja-JP',
    		year = d.toLocaleString(lang, {year:'numeric'}),
    		formatYear = year.replace("年", " 年"),
    	    month = d.toLocaleString(lang, {month:'short'}),
    	    day = d.toLocaleString(lang, {day:'numeric'}),
    		fullDate = formatYear + ' ' + month + ' ' + day; //'${formatYear} ${month} ${day}'; 
    	var formattedDate = fullDate.concat( " (", dayNamesShort[ selectedDate.getDay()], ")");  
    	
    	$(".selectedDate").text(formattedDate);

        if($('#datepicker').length > 0) {
            var userLang = navigator.language || navigator.userLanguage;
            var dateDefaultValue ='Please Select';
            if($('html').attr('lang') == "ja") {
                //$.datepicker.setDefaults($.datepicker.regional['ja']);
                  dateDefaultValue='指定なし';
                  $.datepicker.setDefaults({
                    monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                    monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                    dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
                    dayNamesShort: ['日','月','火','水','木','金','土'],
                    dayNamesMin: ['日','月','火','水','木','金','土'],
                    weekHeader: '週',
                    isRTL: false,
                    yearSuffix: '<strong>年</strong>',
                  });
            }

           // var unavailableDates =$('#restrictedDates').val();
           var unavailable = function(date) {
        	   var datePart = date.getDate();
        	   if(datePart<10){
            		  datePart = '0'+datePart;
               }
               dmy = datePart+ "-" + (date.getMonth()+1) + "-" + date.getFullYear();
              if ($.inArray(dmy, unavailableDates) == -1) {
                return [true, ""];
              } else {
                return [false,"unavailable","Unavailable"];
              }

            }


            var updateSelected = function(datenew) {
            	var getFormatedDate;
                $("#delivery-day option").each(function(index) {                	
                	if($('html').attr('lang') == "ja") {  
                		getFormatedDate = $.datepicker.formatDate('yy 年 M dd日 (D)', $("#datepicker").datepicker('getDate')); 
                	}else{
                		getFormatedDate = $.datepicker.formatDate('yy MM d (D)', $("#datepicker").datepicker('getDate')); 
                	}
                    if($(this).text() == getFormatedDate)
                        $('#delivery-day option').eq(index).prop('selected', true);
                });
                $("#deliveryDate").val($('#delivery-day option:selected').val());               
            }
            
            var datenew = new Date();
            datenew.setDate(datenew.getDate() + 6);
            $( "#datepicker" ).datepicker({
                beforeShowDay: unavailable,
                minDate: datenew,
                maxDate: "+27D",
                defaultDate: null,
                dateFormat: 'yy MM d (D)',
                onSelect: updateSelected,
                setDate: '',
                autoUpdateInput: false,
                ignoreReadonly: true,
                allowInputToggle: true,
                onClose: function() {
                   $('.calendar-payment').removeClass('open');
                   $('.calendar-payment').addClass('C-open');                    
                    setTimeout(function() {
                       $('.calendar-payment').removeClass('C-open');
                   }, 1000);
                },
                beforeShow:function(){
                    $('.delivery-day').append($('#ui-datepicker-div'));
                }     
            });

            $(document).on('click',".calendar-payment",function(){
                 if(!$(this).hasClass('open') && !$(this).hasClass('C-open')){
                    $("#datepicker").datepicker("show");
                    $(this).addClass('open');
                    if($('html').attr('lang') == "ja") { 
                        $('.ui-datepicker-title').addClass('center-xs d-flex reverse row');
                        $('.ui-datepicker-year').addClass('last-xs');
                    }
                }else{
                    $(this).removeClass('open C-open');
                }
             });

            var date = new Date();
            var startDate = date.setDate(date.getDate() + 6),
                endDate  = date.setDate(date.getDate() + 21),
                dateRange = [], dateFormated = [];

            // populate the array
            for (var d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
                if($('html').attr('lang') == "ja") {                	
            		dateRange.push($.datepicker.formatDate('yy 年 M dd日 (D)', d));
            	}else{
            		dateRange.push($.datepicker.formatDate('yy MM d (D)', d));
            	}
                dateFormated.push($.datepicker.formatDate('dd-m-yy', d));
            }

            var options;
            for(var i = 0; i < dateRange.length; i++){
                options += '<option value="'+dateFormated[i]+'">'+dateRange[i]+'</option>';
            }

            $("#delivery-day").html(options);
            $("#deliveryTime").val($('.delivery-hours option:selected').val());
            
            if($("#delivery-day").val()!=undefined){
            	 for(var i = 0; i < unavailableDates.length; i++){
                     $("#delivery-day").find("[value='" + unavailableDates[i] + "']").remove();
                 }
            }
            
            $("#delivery-day").prepend("<option value=''>"+dateDefaultValue+"</option>");
            
            if($('#selectedDeliveryDate').val()!=undefined && $('#selectedDeliveryDate').val().length>0){
                var getLoadDate =$('#selectedDeliveryDate').val();
                $('#delivery-day option[value='+getLoadDate+']').prop('selected', true);  
                $("#deliveryDate").val($("#delivery-day").val());
            }else{                               
                $('#delivery-day').find('option').eq(0).prop('selected', true);
                $("#deliveryDate").val("");
            }
            
            if($('html').attr('lang') == "ja") {
                $('.ui-datepicker-title').addClass('center-xs d-flex reverse row');
            }
        }
      
    },

     creditCartInputFieldCheck : function() {
    		
//		  $("#card_nameOnCard").keypress(function(event){
//	          var inputValue = event.which;
//	          if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
//	              event.preventDefault();
//	          }
//	          if(inputValue == 91 || inputValue == 92 || inputValue == 93 || inputValue == 94 || inputValue == 95 || inputValue == 96  ) {
//	              event.preventDefault();
//	          }
//	             
//	       });
		  
    		$("#card_accountNumber").keypress(function(event){
    			 var inputValue = event.which;
    			if(inputValue > 31 && (inputValue < 48 || inputValue > 57)) {
  	              event.preventDefault();
  	          }
    			
    		});
       },
        
        //ABK-3560 Fix
       /* cartTextarea: function(){
        	var ctrlDown = false,
            ctrlKey = 17,
            cmdKey = 91,
            vKey = 86,
            cKey = 67;

	        $("#msgTextArea").keydown(function(e) {
	        	$(this).focus();
	            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
	        }).keyup(function(e) {
	            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
	        });
        },*/

       validateCVVNumber : function() {

			var $cvvNumber = $('#card_cvNumber');
			$('input[name="card_cardType"]').on("change",function() {
				var cardId = $(this).attr("id");
				if (cardId == "card-amex") {
                    $cvvNumber.attr('data-max-length', '4');
                    $cvvNumber.attr('minlength', '4');
                 
                } else {
                    if ($cvvNumber.attr('data-max-length') == 4) {
                        $cvvNumber.val('');
                    }
                    $cvvNumber.attr('data-max-length', '3');
                    $cvvNumber.attr('minlength', '3');
                    
                }

			});
		},
          
		isOneChecked :function() {
            $("#cvs-payemnt-method").click(function(){
               $('.submit_silentOrderPostForm').prop('disabled', true);
                if($("#cvs-payemnt-method:checked").length==1){
                   $(".choiceList input.c-radio_input").click(function(){
                    var val = $(".choiceList input.c-radio_input:checked").length;
                    if(val==1){
                        $('.submit_silentOrderPostForm').prop('disabled', false);
                    }
                    else{
                        $(".choiceList").next().append("<p>please select atleast one payee</p>");
                    }
                    });
                }
           });
           $("#card-payemnt-method").click(function(){
               if($("#card-payemnt-method:checked").length==1){
                   $('.submit_silentOrderPostForm').prop('disabled', false);
                   $(".choiceList input.c-radio_input").prop('checked', false)
               }
               
           });
           $("#cash-on-delivery").click(function(){
               if($("#cash-on-delivery:checked").length==1){
                   $('.submit_silentOrderPostForm').prop('disabled', false);
                   $(".choiceList input.c-radio_input").prop('checked', false)
               }
               
           });
       },
       creaditCardCheck: function () {
           var $cvvNumber = $('#card_cvNumber');
           $('.card-payemnt-method input[type=radio]').on('change', function () {
				var cardId = $(this).attr("id");
								
               if (cardId == "card-amex") {
                   $cvvNumber.attr('data-max-length', '4');
                   $cvvNumber.attr('minlength', '4');
               } else {
                   if ($cvvNumber.attr('data-max-length') == 4) {
                       $cvvNumber.val('');
                   }
                   $cvvNumber.attr('data-max-maxlength', '3');
                   $cvvNumber.attr('minlength', '3');
               }
           });
				},
				
       orderHistoryPagination: function() {
           var perPage = 10;
           var pageProducts = '';
           var perPageArray = [];

           var pagination = "<a href='#' class='prevBtn nextPrevDisabled'></a><ul>";

           // Product intial load
           for (var il = 0; il < perPage; il++) {
           	perPageArray.push(pagearray[il]);
           }
           pageProducts += "<div>" + ($('#orderHistoryTag').html($("#orderHistoryTemplate").tmpl(perPageArray))) + "</div>";
          // $('.pageProducts').append(pageProducts);

           // Pagination initial load
           for (var ol = 0; ol < pagearray.length / perPage; ol++) {
               pagination += "<li><a data-page='" + (ol+1) + "' href='#'>" + (ol+1) + "</a></li>";
           }
           pagination += "</ul> <a href='#' class='nextBtn'></a>";
           if (pagearray.length / perPage > 1){
               $('.order-pagination').append(pagination);
               $('.order-pagination ul li:first-child a').addClass('active');
           }

           // Click pagination
           $(document).on('click','.order-pagination ul li a', function(e){
               e.preventDefault();
               $('.pageProducts').empty();
               pageProducts = '';
               var currentPage = $(this).data('page');
               $('.order-pagination ul li a').removeClass('active');
               $(this).addClass('active');
               perPageArray =[];

               // Disable next and previous button
               if($(this).parent().is(':first-child')){
                   $('.prevBtn').addClass('nextPrevDisabled');
               }else {
                   $('.prevBtn').removeClass('nextPrevDisabled');
               }

               if($(this).parent().is(':last-child')){
                   $('.nextBtn').addClass('nextPrevDisabled');
               }else {
                   $('.nextBtn').removeClass('nextPrevDisabled');
               }
               
               for (var pr = perPage * currentPage - perPage; pr < perPage * currentPage; pr++) {
                   if (pr === pagearray.length) {
                       break;
                   }
                   perPageArray.push(pagearray[pr]);
               };
               pageProducts += "<div>" + ($('#orderHistoryTag').html($("#orderHistoryTemplate").tmpl(perPageArray))) + "</div>";
               $("html, body").animate({ scrollTop: 0 }, 600); 
              // $('.pageProducts').append(pageProducts);
           });

           // Click next and previous
           $(document).on('click','.nextBtn', function(e){
               e.preventDefault();
               $('.order-pagination ul li a.active').parent().next("li").find('a').trigger('click');
           });

           $(document).on('click','.prevBtn', function(e){
               e.preventDefault();
               $('.order-pagination ul li a.active').parent().prev("li").find('a').trigger('click');
           });

           $(document).on('click','.ordered-full-details .accordian-wrapper h6', function(e){
               $(this).parent().find('.complete-details').slideToggle();
               $(this).find('.accordion-btn').toggleClass('opened');
           });
       },
       
       
       orderHistoryFilter : function() {
       	var currentDate = new Date();
       	var currentYear = currentDate.getFullYear();
       	var currentMonth = currentDate.getMonth();
       	var enMonthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
       	var jpMonthNames = ["01月", "02月", "03月", "04月", "05月", "06月","07月", "08月", "09月", "10月", "11月", "12月"];
       	var monthList = '';
           var yearList = '';
           var siteLang = $('html').attr('lang');
           var jpYear = '';
           var selectedYear = '';
           var monthNames = enMonthNames;
           var monthCount = '';
           var jpSearchEmptyError = '検索条件を確認してください。';
           var searchEmptyError = 'Check the search conditions.';
           var searchFrom = '';
           var searchTo = '';
           var filterProducts = '';

           // Lang check for 
           if (siteLang === "ja") {
               jpYear = '年';
               monthNames = jpMonthNames;
               searchEmptyError = jpSearchEmptyError;
           }

           $('.empty-search-result').hide();
           
           let years = 0;
           if (orderHistoryJsonList) {
               years = currentYear - Math.min(...orderHistoryJsonList.map((item) =>
                   parseInt(item.dateFilter.slice(0, 4), 10) // 'yyyyMM' -> yyyy
               ));
           }

           for (var yr = 0; yr <= years; yr++) {
       		yearList += "<option value='"+ parseInt(currentYear - yr) +"'>" + parseInt(currentYear - yr) + jpYear +  "</option>";
           }
           
           // Calender initial load
           $('.year select').append(yearList);

           function pad2(number) {
               return (number < 10 ? '0' : '') + number
           }
       	
       	$('.year select').on('change', function(){
               monthList = '';
               selectedYear = $(this).val();

               if(selectedYear == currentYear) {
                   monthCount = currentMonth
               } else {
                   monthCount = 11;
               }

               for(var mon = 0; mon <= monthCount; mon++) {
                   monthList += "<option value='"+ pad2(parseInt(mon+1)) +"'>" + monthNames[mon] + "</option>";
               }

               $(this).parent().next('.month').find('select').empty().append(monthList);
           });

           // Error Close
        	$('.history-alerts .close').on('click', function(){
        		$('.history-alerts').fadeOut();
        	});

            // Search Filter
            $('.searchBtn').on('click', function(){
            	if ($('.yearFrom').val() === '' || $('.yearTo').val() === '') {
             	   $('.history-alerts').fadeIn().find('span').text(searchEmptyError);
                } else if (($('.yearFrom').val() + $('.monthFrom').val()) > ($('.yearTo').val() + $('.monthTo').val())) {
                	$('.history-alerts').hide();
                    $('.history-alerts').fadeIn().find('span').text(searchEmptyError);
                } else {
             	   $('.history-alerts').hide();
                    pagearray = [];
                    var noMatch = true;
                    searchFrom = $('.yearFrom').val() + $('.monthFrom').val();
                    searchTo = $('.yearTo').val() + $('.monthTo').val();
                    $.each(orderHistoryJsonList, function(index, val) { 
                        if(val.dateFilter >= searchFrom && val.dateFilter <= searchTo) {
                            pagearray.push(val);
                            $('.empty-search-result').hide();
                            noMatch = false;
                        }
                    });
                    if(noMatch) {
                        $('.empty-search-result').show();
                        $('.order-pagination').empty();
                    };
                    filterProducts += "<div>" + ($('#orderHistoryTag').html($("#orderHistoryTemplate").tmpl(pagearray))) + "</div>";
                
                    var filterArray = pagearray;
                    var perPage = 10;
                    var pagination = "<a href='#' class='prevBtn nextPrevDisabled'></a> <ul>";
                    var perPageArray = [];
                    var pageProducts = '';

                    // Product intial load
                    for (var il = 0; il < perPage; il++) {
                        perPageArray.push(filterArray[il]);
                    }
                    pageProducts += "<div>" + ($('#orderHistoryTag').html($("#orderHistoryTemplate").tmpl(perPageArray))) + "</div>";

                    for (var ol = 0; ol < filterArray.length / perPage; ol++) {
                        pagination += "<li><a data-page='" + (ol+1) + "' href='#'>" + (ol+1) + "</a></li>";
                    }
                    pagination += "</ul> <a href='#' class='nextBtn'></a>";
                    $('.order-pagination').empty();
                    if (filterArray.length / perPage > 1){
                        $('.order-pagination').append(pagination);
                        $('.order-pagination ul li:first-child a').addClass('active');
                    }
                }
            });
       },
       
       onPageLoadComplete: function() {
    	   $("a, img, button").prop("title", ""); 
    	   $('#image-section, .banner').css('opacity', 1);
           $(".c-radio").addClass('radio-active');
           $('.submit_silentOrderPostForm, .submit_savedPaymentSelect').removeClass('click-prevent');
           $('.variants-select-wrap, .purchaseArea').removeClass('hide');
       },
       userAgentDetection: function() {    	   
    	   var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
    	   if(isIE11) {
    		   $('body').addClass('isIE');
    	   }else{
    		   $('body').addClass('isNotIE');
    	   }    	   
       },
       freeProductDisable: function() {
           var $selector = $('.js-update-entry-quantity-input:disabled').parents('.cartQuantity');

           $selector.find('.cartQuantity_minus, .cartQuantity_plus').prop('disabled','true');
           $selector.find('.update-qty-btn button').remove();
       },
       
       fontLoad: function(){
           //Client font related code
           //全ての文字にフォントが適用されるようにWEBフォントをリロード
           setTimeout(function(){
               var fontset1 = {'fontname':'TsukuGoPr5-M', 'nickname':'TsukuGoPr5-M', 'text':'亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠'};        
               var fontset2 = {'fontname':'TsukuGoPr5-M', 'nickname':'TsukuGoPr5-M', 'text':'彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎'};
               var fontset3 = {'fontname':'TsukuGoPr5-M', 'nickname':'TsukuGoPr5-M', 'text':'槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕'};
               var fontset4 = {'fontname':'TsukuGoPr5-M', 'nickname':'TsukuGoPr5-M', 'text':'丼傲刹哺喩嗅嘲彙恣惧慄憬拉摯曖楷毀璧瘍箋籠緻羞訃諧貪踪辣錮鬱あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨャュョラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヵヶァィゥェォッヴabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９!@~`#$%^&*()_-+=\|}{][;:/?.,<>！＠？〜｀＃＄％＾＊（）＿ー＝＋｜￥｝｛\'\"：；・？＞。、＜「」『』¡¢£¤¥¦§¨©ª«¬¯°±²³´µ¶·¸¹º»¼½¾¿，．゛゜￣ヽヾゝゞ〃仝〆―‐／＼∥...‥\'\"〔〕［］〈〉《》【】－×÷≠≦≧∞∴♂♀′″℃￠￡＆☆★○●◎◇◆■△▲▽▼※〒→←↑↓〓∈∋⊆⊇⊂⊃∪∩∧∨￢⇒⇔∀∃∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬Å‰♯♭♪†‡◯ゎゐゑヮヰヱ'};
               var fontset5 = {'fontname':'TsukuGoPro-B', 'nickname':'TsukuGoPro-B', 'text':'亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠'};        
               var fontset6 = {'fontname':'TsukuGoPro-B', 'nickname':'TsukuGoPro-B', 'text':'彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎'};
               var fontset7 = {'fontname':'TsukuGoPro-B', 'nickname':'TsukuGoPro-B', 'text':'槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕'};
               var fontset8 = {'fontname':'TsukuGoPro-B', 'nickname':'TsukuGoPro-B', 'text':'丼傲刹哺喩嗅嘲彙恣惧慄憬拉摯曖楷毀璧瘍箋籠緻羞訃諧貪踪辣錮鬱あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨャュョラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヵヶァィゥェォッヴabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９!@~`#$%^&*()_-+=\|}{][;:/?.,<>！＠？〜｀＃＄％＾＊（）＿ー＝＋｜￥｝｛\'\"：；・？＞。、＜「」『』¡¢£¤¥¦§¨©ª«¬¯°±²³´µ¶·¸¹º»¼½¾¿，．゛゜￣ヽヾゝゞ〃仝〆―‐／＼∥...‥\'\"〔〕［］〈〉《》【】－×÷≠≦≧∞∴♂♀′″℃￠￡＆☆★○●◎◇◆■△▲▽▼※〒→←↑↓〓∈∋⊆⊇⊂⊃∪∩∧∨￢⇒⇔∀∃∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬Å‰♯♭♪†‡◯ゎゐゑヮヰヱ'};
               
               FONTPLUS.load([fontset1, fontset2, fontset3, fontset4, fontset5, fontset6, fontset7, fontset8],function(){window.fontlist1=true;},'loadname1');
           }, 10);
       }, 
       
       showReview: function() {
        $('#showreview').click(function() {
            $('html, body').animate({
               scrollTop: ($("#tabreview").offset() || { "top": NaN }).top
           }, 1000);
        });
       },
       
       customModal: function() {
           $('.custom-modal-btn').on('click', function() {
               var customTarget = $(this).data('modal-target');
               $('#'+customTarget).show();
               $('body').append('<div class="custom-modal-overlay"></div>');
               $('body').addClass('scroll-lock');
           });
           $('.custom-modal-close').on('click', function() {
               $(this).parents('.custom-modal').hide();
               $('.custom-modal-overlay:eq(0)').remove();
               if($('.custom-modal-overlay').length === 0) {
               	$('body').removeClass('scroll-lock');
               }
           });
       },

       subscriptionPagination: function() {
            var perPage = 10;
            var $subscriptionOrders = $(".subscription-history .ordered-details-widget");
            var pageProductsLength = $subscriptionOrders.length;
            var pagination = "<a href='#' class='prevBtn nextPrevDisabled'></a><ul>";

            // Product intial load
            $('.subscription-history .ordered-details-widget:lt('+perPage+')').removeClass('hide').addClass('show');

            // Pagination initial load
            for (var ol = 0; ol < pageProductsLength / perPage; ol++) {
                pagination += "<li><a data-page='" + (ol+1) + "' href='#'>" + (ol+1) + "</a></li>";
            }

            pagination += "</ul> <a href='#' class='nextBtn'></a>";

            if (pageProductsLength / perPage > 1){
                $('.order-pagination').append(pagination);
                $('.order-pagination ul li:first-child a').addClass('active');
            }

            // Click pagination
            $(document).on('click','.order-pagination ul li a', function(e){
                e.preventDefault();

                var currentPage = $(this).data('page');
                $('.order-pagination ul li a').removeClass('active');
                $(this).addClass('active');

                // Disable next and previous button
                if($(this).parent().is(':first-child')){
                    $('.prevBtn').addClass('nextPrevDisabled');
                }else {
                    $('.prevBtn').removeClass('nextPrevDisabled');
                }

                if($(this).parent().is(':last-child')){
                    $('.nextBtn').addClass('nextPrevDisabled');
                }else {
                    $('.nextBtn').removeClass('nextPrevDisabled');
                }
                
                $('.subscription-history .ordered-details-widget.show').addClass('hide').removeClass('show');

                for (var pr = perPage * currentPage - perPage; pr < perPage * currentPage; pr++) {
                    $('.subscription-history .ordered-details-widget:eq('+pr+')').removeClass('hide').addClass('show');
                    if (pr === pageProductsLength) {
                        break;
                    }
                };

                $("html, body").animate({ scrollTop: 0 }, 600); 
            });

            // Click next and previous
            $(document).on('click','.nextBtn', function(e){
                e.preventDefault();
                $('.order-pagination ul li a.active').parent().next("li").find('a').trigger('click');
            });

            $(document).on('click','.prevBtn', function(e){
                e.preventDefault();
                $('.order-pagination ul li a.active').parent().prev("li").find('a').trigger('click');
            });
        },
       
        bindCancelItem:function(){	
         	$(document).ready(function(){
         		var orderParameter=$('#cancelcomfirmOrderCode');
         		if(orderParameter!=null&&orderParameter!=undefined)
         		{
         			var cancelordercode=orderParameter.val();
         			if(cancelordercode!=null&&cancelordercode!='')
         			{
         				$('#cancelcomfirm').modal('show');
         				$('#cancelcomfirm').removeClass('cboxElement');
         			}
         		}
         	});          	
		},
		
		bindCanceBtn:function(){	
         	$('body').on('click','.click-once',function(e){
    			if ($(this).hasClass('link-clicked')) { 
        			e.preventDefault();
        			return false;
    			} else {
        			$(this).addClass('link-clicked').trigger('click');
    			}
         	});                  	
		},
        setFloatingAddCart:function () {
            if ($(".page-productDetails").length > 0 ) {
                let ccfloatBlock = $('#ccfloatBlock');
                let variant = $(".defaultColorVariant").data('variantcode');
                if (typeof variant !== "undefined") {
                    let variantObject = $.parseJSON(variants[variant]);
                    //画像
                    if (typeof variantObject !== "undefined" && typeof variantObject.colorImage !== "undefined") {
                        ccfloatBlock.children('.img').append('<img src = "' + variantObject.colorImage.url + '">');
                    }
                }
                let mvariants = [];
                $(".colorVariant" + ".multiVariantSelectorLink" + ".active").each(function (i, elem) {
                    mvariants.push($(elem).data('variantcode'));
                });
                if (mvariants.length > 0) {
                    $.each(mvariants,function () {
                        let variantObject = $.parseJSON(multiVariants [this]);
                        if ( typeof variantObject.colorImage !== "undefined") {
                            ccfloatBlock.children('.img').append('<img src = "' + variantObject.colorImage.url + '">');
                        }
                    });
                    if(mvariants.length > 1){
                        ccfloatBlock.children('.img').addClass('multi-img')
                        ccfloatBlock.children('.contents').addClass('multi-contents')
                    }
                }
                if(typeof variant === "undefined" && mvariants.length === 0) {
                    ccfloatBlock.addClass('noImg');
                    ccfloatBlock.remove('.img');
                }
                //金額
                let price = $('.product-price-wrap  > .price').textNodeText().trim();
                let tax = $('.product-price-wrap > .price > .tax').text().trim();
                //let basePrice = $('.product-price-wrap > .price > .base_price').text().trim();
                //let pricetext = price + tax + ' ' + basePrice;
                let price2 =  price.replace(/\s+/g, "");
                let pricetext = price2 + tax;
                ccfloatBlock.children('.contents').children('.conTxt').children('.priceBlock').html(pricetext);
                //ccfloatBlock.children('.contents').children('.conTxt').html(pricetext + qty);
                $('.qtyBlock').css("display", "initial");
                let cart = $('.purchaseBtn' + '.show');
                if (cart.length <= 0) {
                    cart = $('#addToCartForm');
                    if( cart.find('button').length <= 0 || !cart.find('button').is(':visible')){
                      cart = $('#preDisplayButton' + '.show');
                      if (cart.length <= 0) {
                        cart = $('.outofstock-message');
                      }
                    }
                    cart = cart.clone();
                    cart.find('.c-text').css('margin','initial');
                } else {
                    if( cart.find('.oos-notification-reg' + ".hide").length > 0  || cart.text().trim() === '') {
                        cart = $('.outofstock-message');
                        if(  $('#preDisplayButton' + '.show').length > 0){
                            cart = $('#preDisplayButton' + '.show');
                        }
                        cart = cart.clone();
                        cart.find('.c-text').css('font-size','3.3vw');
                        cart.find('.c-text').css('margin','initial');
                        if( typeof multiVariants !== "undefined" ){
                            cart.find('strong').css('font-size','2.9vw');
                        }
                    } else {
                        cart = cart.clone();
                    }
                }

                let favorite = $('.addtocart-component').find('.AddToFavorite-AddToFavoriteAction');
                favorite = favorite.clone();
                favorite.removeClass('hidden-xs').removeClass('hidden-sm');
                ccfloatBlock.children('.contents').children('.conBtn').html(cart);
                ccfloatBlock.children('.contents').children('.conBtn').append(favorite);
                ccfloatBlock.css('opacity','1');
            }
        },

        init: function () {
            var _self = ab.global;              
            _self.screenWidth = $(window).width();           
           
            _self.fontLoad();
            _self.responsiveView(); 
            _self.mobileMenu();    
            _self.homePageBanner();             
            _self.backToTopScroll();
            _self.backToTop();
            _self.formValidation();
            _self.datePickerUI();
            _self.freeProductDisable();
            _self.creditCartInputFieldCheck();
            //   _self.cartTextarea();
            _self.validateCVVNumber();
            _self.isOneChecked();
            _self.searchResultValidation();
//            _self.jsBarcodeInit();
            _self.deliveryStatement();
            _self.showReview();
            _self.userAgentDetection();
            _self.creaditCardCheck();
            _self.carouselComponent();
            _self.recommendComponent();
            _self.hashtagComponent();
            _self.customModal();
            _self.bindCancelItem();
            _self.bindCanceBtn();
            kaoCommonFunctions.giftCardPreview({textArea:$('#msgTextArea'),charsInRow:20, maxRow:5, maxByte:200});
            kaoCommonFunctions.messageDetailReplaceNewLine({textArea:$('#msgTextArea')});
            if($('#orderHistoryTemplate').length > 0) {
                _self.orderHistoryFilter();
                _self.orderHistoryPagination();
                kaoCommonFunctions.orderDetailMessageViewFormat();
            }
            if($('.subscription-history').length > 0) {
                _self.subscriptionPagination();
             }
        }
    };


    $(document).ready(function () {    
        var _self = ab.global;
        _self.init();
        _self.scrollPosition = $(window).scrollTop();       
    });

    $(window).on('scroll', function(){
        var _self = ab.global;
        _self.scrollPosition = $(window).scrollTop();
        _self.backToTopScroll();
    });

    $(window).on('load',function() {
        var _self = ab.global;
        _self.onPageLoadComplete();
        _self.setFloatingAddCart();
    });

    $(window).resize(function () {
        var _self = ab.global;            
        _self.screenWidth = $(window).width();
        _self.responsiveView();
    });

})(jQuery);