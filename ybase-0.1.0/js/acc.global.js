ACC.global = {

    _autoload: [
    	"scrollEvent",
    	"inputQTY",
    	"checkoutPaymentRadioSelect",
    	"checkoutShippingValidation",
    	"mobileOrderReviewToggle",
    	"bindViewAddressBook",
        ["passwordStrength", $('.password-strength').length > 0],
        "bindToggleOffcanvas",
        "bindToggleXsSearch",
        "bindHoverIntentMainNavigation",
        "initImager",
        "backToHome",
        "bindDropdown",
        "closeAccAlert"
    ],

    scrollEvent: function () {
    	return new cbpScroller( document.getElementById( 'cbp-so-scroller' ) );
    },
    inputQTY: function () {
		$("input[type=number]").on("keydown", function(event) {
	        if (event.keyCode === 37 || event.keyCode === 39) {
	            event.preventDefault();
	        }
		});
		$("input[type=number]").on("keyup", function(event) {
	        var x = $(this).val(); 
			x = x.replace(/^0+/, '');
			$(this).val(x)
		});
    },
    checkoutPaymentRadioSelect: function () {
	    if ($("#card-payemnt-method").is(":checked")) {
			$("#silentOrderPostForm").show();
			$(".convi").hide();
			$('#paymentType').val("CARD");
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").show();
			$(".saved-payment-method").hide();
		}
	    else if ($("#saved-payment-method").is(":checked")){
	    	$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").hide();
			$(".saved-payment-method").show();
			$(".delivery-slot-section").show();
	    }
		else if ($("#cvs-payemnt-method").is(":checked")) {
			$("#silentOrderPostForm").hide();
			$(".convi").show();
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").hide();
			$(".saved-payment-method").hide();
		}
		else if ($("#cash-on-delivery").is(":checked")) {
			$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$(".cash-on-delivery").show();
			$(".delivery-slot-section").show();
			$(".saved-payment-method").hide();
		}
		else if ($("#paypay-payment-method").is(":checked")){
	    	$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").show();
			$(".saved-payment-method").hide();
	    }
	    else if ($("#amazon-payment-method").is(":checked")){
	    	$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").show();
			$(".saved-payment-method").hide();
	    }
		$(document).on("click", "#card-payemnt-method", function (e) {
			$("#silentOrderPostForm").show();
			$(".convi").hide();
			$('#paymentType').val("CARD");
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").show();
			$('#ui-datepicker-div').removeClass('custom-div-pos');
			$(".saved-payment-method").hide();
			$(".paypay-payment-method").hide();
			$(".amazon-payment-method").hide();
		});
		$(document).on("click", "#saved-payment-method", function (e) {
			$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$('#paymentType').val("CARD");
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").hide();
			$('#ui-datepicker-div').removeClass('custom-div-pos');
			$(".saved-payment-method").show();
			$(".paypay-payment-method").hide();
			$(".amazon-payment-method").hide();
		});
		$(document).on("click", "#cvs-payemnt-method", function (e) {
			$("#silentOrderPostForm").hide();
			$(".convi").show();
			$('#paymentType').val("CONVENIENCESTORE");
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").hide();
			$('#ui-datepicker-div').removeClass('custom-div-pos');
			$(".saved-payment-method").hide();
			$(".paypay-payment-method").hide();
			$(".amazon-payment-method").hide();
		});
		$(document).on("click", "#cash-on-delivery", function (e) {
			$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$('#paymentType').val("CASHONDELIVERY");
			$(".cash-on-delivery").show();
			$(".delivery-slot-section").show();
			$('#ui-datepicker-div').addClass('custom-div-pos');
			$(".saved-payment-method").hide();
			$(".paypay-payment-method").hide();
			$(".amazon-payment-method").hide();
		});
		$(document).on("click", "#paypay-payment-method", function (e) {
			$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").show();
			$('#ui-datepicker-div').removeClass('custom-div-pos');
			$(".saved-payment-method").hide();
			$(".paypay-payment-method").show();
			$(".amazon-payment-method").hide();
			$('#paymentType').val("PAYPAY");
		});
		$(document).on("click", "#amazon-payment-method", function (e) {
			$("#silentOrderPostForm").hide();
			$(".convi").hide();
			$(".cash-on-delivery").hide();
			$(".delivery-slot-section").show();
			$('#ui-datepicker-div').removeClass('custom-div-pos');
			$(".saved-payment-method").hide();
			$(".paypay-payment-method").hide();
			$(".amazon-payment-method").show();
			$('#paymentType').val("AMAZON_PAY");
		});
		

		if ($('#selectedDeliveryDate').val() != undefined && $('#selectedDeliveryDate').val().length > 0) {
			var getLoadDate = $('#selectedDeliveryDate').val();
			$('#delivery-day option[value=' + getLoadDate + ']').prop('selected', true);
		}
		
		$(document).ready(function(){
			if ($("#existingBillingAdd").is(":checked")) {
			   $("#shippingAddressForm").addClass("hide");
			   
			}
			else {
				$("#shippingAddressForm").removeClass("hide");
			}
		});
		$('input[type=radio]').change(function() {
			if ($("#existingBillingAdd").is(":checked")) {
				   $("#shippingAddressForm").addClass("hide");
				}
				else {
					$("#shippingAddressForm").removeClass("hide");
				}
		});
		
		
		
		var d = new Date(),
	    n = d.getMonth(),
	    y = d.getFullYear();
		var currentYear = $('#ExpiryYear').find(":selected").text();
		
		$('#ExpiryYear').on('change', function() {
			currentYear = $('#ExpiryYear').find(":selected").text();
//			console.log(currentYear);
			
			if ( currentYear <= y ) {
				$('#ExpiryMonth option').filter(function() {
				    return $(this).val() < (n+1);
				}).prop('disabled', true);
			}
			else {
				$('#ExpiryMonth option').filter(function() {
				    return $(this);
				}).prop('disabled', false);
				// $("#ExpiryMonth option[value='']").attr('disabled',false);
				//$("#ExpiryMonth option[value='']").attr('selected',"selected");
				// $("#ExpiryMonth option[value='']").attr('disabled',true);
			}
			$("#ExpiryMonth option[value='']").attr('disabled',"disabled");
			
		});
		
//		CVV validation while select Credit Card TYPE
		$('.card-types .c-radio_input').on('change', function() {
			$("#card_cvNumber").val("");
		});
		
		/* $("#baddress\\.surName, #baddress\\.name, #baddress\\.lastName, #baddress\\.firstName, #address\\.surName, #address\\.name, #address\\.lastName, #address\\.firstName").keypress(function(event){
	          var inputValue = event.which;
	          if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
	              event.preventDefault();
	          }
	          if(inputValue == 91 || inputValue == 92 || inputValue == 93 || inputValue == 94 || inputValue == 95 || inputValue == 96  ) {
	              event.preventDefault();
	          }	             
		 });*/
		 
		 $(".postal-co input").keypress(function(event) {
			var inputValue = event.which;
			if (inputValue > 31 && (inputValue < 48 || inputValue > 57)) {
				event.preventDefault();
			}
		});
    },
    
    checkoutShippingValidation: function () {
    	$(document).on("click", ".checkout-next", function () {
    		if( !$("#card_nameOnCard").val() ) {
    	          $(".error-cardname").css('display', 'inline');
    	    }
    		if( !$("#ExpiryMonth").val() ) {
    	          $(".error-cardexp").css('display', 'inline');
      		}
    		if( !$("#card_cvNumber").val() ) {
    	          $(".verification-number .err-msg").css('display', 'inline');
      		}
    	});
    	$(document).ready(function() {
    		$("#card_accountNumber").on("focusout", function (e) {
    			$(".error-cardnumber").css('display', 'none');
    		})
    		$("#card_nameOnCard").on("focusout", function (e) {
    			$(".error-cardname").css('display', 'none');
    		})
    		$("#ExpiryMonth").on("focusout", function (e) {
    			$(".error-cardexp").css('display', 'none');
    		})
    		$("#card_cvNumber").on("focusout", function (e) {
    			$(".verification-number .err-msg").css('display', 'none');
    		})
    	});
    },
    
    mobileOrderReviewToggle: function () {
    	$(".mob-order-total").click(function () {
    		$(".mob-order-total .totals").toggleClass("open");
    		$(".order-sum-op").toggle();
    	});
    },
    
    
    bindViewAddressBook: function ()
	{
		$(document).on("click",".js-address-book",function(e){
			
			$("#addressbook").addClass("show");
		});
		$(document).on("click","#addressbook .btn-close",function(e){
			
			$("#addressbook").removeClass("show");
 
		});
		$(document).on("click",".useThisAddress",function(e){
			
			$("#addressbook").removeClass("show");
 
		});

		$(document).on("click","#existingShippingAdd, #newShippingAdd",function(e){
			
			$("#shippingAddressForm .err-msg").css("display", "none");
 
		});
		
		

		/*
		 * $(document).on("click", '#summaryOverlayViewAddressBook', function () {
		 * $('#summaryDeliveryAddressFormContainer').hide();
		 * $('#summaryOverlayViewAddressBook').hide();
		 * $('#summaryDeliveryAddressBook').show(); ACC.colorbox.resize(); });
		 */
	},
    passwordStrength: function () {
        $('.password-strength').pstrength({
            verdicts: [ACC.pwdStrengthTooShortPwd,
                ACC.pwdStrengthVeryWeak,
                ACC.pwdStrengthWeak,
                ACC.pwdStrengthMedium,
                ACC.pwdStrengthStrong,
                ACC.pwdStrengthVeryStrong],
            minCharText: ACC.pwdStrengthMinCharText
        });
    },

    bindToggleOffcanvas: function () {
        $(document).on("click", ".js-toggle-sm-navigation", function () {
            ACC.global.toggleClassState($("main"), "offcanvas");
            ACC.global.toggleClassState($("html"), "offcanvas");
            ACC.global.toggleClassState($("body"), "offcanvas");
            ACC.global.resetXsSearch();
        });
    },

    bindToggleXsSearch: function () {
        $(document).on("click", ".js-toggle-xs-search", function () {
            ACC.global.toggleClassState($(".site-search"), "active");
            ACC.global.toggleClassState($(".js-mainHeader .navigation--middle"), "search-open");
        });
    },

    resetXsSearch: function () {
        $('.site-search').removeClass('active');
        $(".js-mainHeader .navigation--middle").removeClass("search-open");
    },

    toggleClassState: function ($e, c) {
        $e.hasClass(c) ? $e.removeClass(c) : $e.addClass(c);
        return $e.hasClass(c);
    },

    bindHoverIntentMainNavigation: function () {
        enquire.register("screen and (min-width:992px)", {
            match: function() {
                $(".js-enquire-has-sub").removeClass("show");
                $(".my-acc-drop").removeClass("show-menu");
                $(".mobile-menu .login-icon").removeClass("show");
                $(".mobile-menu").removeClass("show");
                $(".mobile-menu-hambur").removeClass("show");
            },
            unmatch: function() {
                $(".js-enquire-has-sub").removeClass("show-sub");
                $(".js_sub__navigation").removeAttr("style");
                $(".my-acc-drop").removeAttr("style");
                $(".site-search-wrap").hide();
            }
        });
        $(document).on("click", function(e) {
            $(".js-enquire-has-sub").removeClass("show-sub");
            $(".my-acc-drop").removeAttr("style");
        });

        //Desktop menu event
        $(".nav .nav__links--primary").mouseover(function(e) {
            var $this = $(this);
            if($this.hasClass("show-sub")) {
                return;
            }
            if(! $this.hasClass("js-enquire-has-sub")) {
                $(".js-enquire-has-sub").removeClass("show-sub");
                $(".js_sub__navigation").removeAttr("style");
                return;
            }
            var $subNav = $this.find(".js_sub__navigation");
            $(".sub__navigation").css("opacity", 0);
            $(".js-enquire-has-sub").removeClass("show-sub");
            $this.addClass("show-sub");
            $subNav.animate({opacity: 1}, "slow");
            $(".my-acc-drop").removeAttr("style");
        });
        $(".nav").mouseleave(function() {
            $(".js-enquire-has-sub").removeClass("show-sub");
        });
        $(".nav").click(function(e) {
            e.stopPropagation();
            $(".my-acc-drop").removeAttr("style");
        });
        $(".top-header-nav .search-icon").click(function(event){
            event.stopPropagation();
            $(".site-search-wrap").slideToggle(200);
            $(".my-acc-drop").removeAttr("style");
        });

        //Mobile menu click Event
        $(".mobile-menu-hambur").click(function(event){
            $(this).toggleClass(" show");
            $(".mobile-menu").toggleClass(" show");
        });
        $(".mobile-menu .js-enquire-has-sub .js_nav__link").click(function(event){
            var $this = $(this);
            var href = $this.find("a").attr("href");
            if(href && href !== '#' && href !== 'javascript:void(0)'){
                return;
            }
            event.preventDefault();
            $this.parent().toggleClass(" show");
        });
        $(".mobile-menu .js-enquire-has-sub .js_nav__link--drill__down").click(function(event){
            $(this).parent().toggleClass(" show");
        });

        // Mobile menu href link change from # to javascript:void(0)
        $(".nav__link a[href='#']").attr("href", "javascript:void(0)");

        // My account menu click Event
        $(".desktop-login").click(function(event){
            event.stopPropagation();
            $(".top-header-nav .my-acc-drop").slideToggle(200);
            $(".js-enquire-has-sub").removeClass("show-sub");
        });
        $(".mobile-login-menu .logged-in").click(function(event){
            $(this).toggleClass(" show");
            $(".mobile-login-menu .my-acc-drop").toggleClass(" show-menu");
        });
        $(".nav__left .logged-in").click(function(event){
            if($(".mobile-menu").hasClass("show")) {
                if($(".mobile-login-menu .logged-in").hasClass("show")) {
                    $(".mobile-login-menu .my-acc-drop").removeClass("show-menu");
                    $(".mobile-login-menu .logged-in").removeClass("show");
                } else {
                    $(".mobile-login-menu .my-acc-drop").addClass(" show-menu");
                    $(".mobile-login-menu .logged-in").addClass(" show");
                }
            } else {
                $(".mobile-login-menu .my-acc-drop").addClass(" show-menu");
                $(".mobile-login-menu .logged-in").addClass(" show");
                $(".mobile-menu").addClass(" show");
                $(".mobile-menu-hambur").addClass(" show");
            }
        });

        $(".search-cont button.btn-link").attr('disabled', false);
        
        //Add target attribut to Discontinued Product Link 
        $('.popularity_link a').attr('target', '_blank');

        //PDP Queries
        $(".pdp-read-link").click(function(){
            $(".pdp-read-link .txt-read").toggle();
            $(".pdp-read-link .txt-close").toggle();
            $(".pdp-read-link").toggleClass("show-down");
            $(".show-more-op").slideToggle();
        });
        $(".pdp-read-link .txt-close").click(function(){
            $('html,body').animate({ scrollTop: 0 }, 'fast');
        });
        // PDP product information accordian
        $(".prod-info h3").click(function(){
            var $this = $(this);
            $this.toggleClass(" clicked");
        });
    },

    initImager: function (elems) {
        elems = elems || '.js-responsive-image';
        this.imgr = new Imager(elems);
    },

    reprocessImages: function (elems) {
        elems = elems || '.js-responsive-image';
        if (this.imgr == undefined) {
            this.initImager(elems);
        } else {
            this.imgr.checkImagesNeedReplacing($(elems));
        }
    },

    // usage: ACC.global.addGoogleMapsApi("callback function"); // callback function name like "ACC.global.myfunction"
    addGoogleMapsApi: function (callback) {
        if (callback != undefined && $(".js-googleMapsApi").length == 0) {
        	var googleApiSrc = "//maps.googleapis.com/maps/api/js?key=" + ACC.common.encodeHtml(ACC.config.googleApiKey) + '&sensor=false&callback=' + ACC.common.encodeHtml(callback);
    		$('head').append($("<script>").addClass("js-googleMapsApi")
    								.attr("type", "text/javascript")
    								.attr("src", googleApiSrc));
        } else if (callback != undefined) {
            eval(callback + "()"); //NOSONAR
        }
    },

    backToHome: function () {
        $(".backToHome").on("click", function () {
            var sUrl = ACC.config.contextPath;
            window.location = sUrl;
        });
    },
    
    bindDropdown: function() {
    	$(document).on("click", ".dropdown-toggle", dropdownToggle);
    },

    closeAccAlert: function () {
        $(".closeAccAlert").on("click", function () {
            $(this).parent('.getAccAlert').remove();
        });
    }

};

/*
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 550) {
        $("header.js-mainHeader").addClass("fixed");
    } else {
        $("header.js-mainHeader").removeClass("fixed");
    }
    
    if (scroll >= 100) {
        $("header.js-mainHeader").addClass("fixed-top");
    } if (scroll < 100) {
        $("header.js-mainHeader").removeClass("fixed-top");
    }
});
*/

// ***** Dropdown begins *****
function dropdownParent($this) {
    var selector = $this.attr('href')
    selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  };

function dropdownClearMenus(e) {
	// if right click, exit
    if (e && e.which === 3) return
    
    // remove class added on dropdownToggle
    $('.dropdown-backdrop').remove()
    
    $(".dropdown-toggle").each(function () {
      var $parent       = dropdownParent($(this))
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.removeClass('open')
    })
  };

 function dropdownToggle(e) {
	var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = dropdownParent($this)
    var isActive = $parent.hasClass('open')

    dropdownClearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', dropdownClearMenus)
      }

      var relatedTarget = { relatedTarget: this }

      if (e.isDefaultPrevented()) return

      // expand the <ul> on the dropdown
      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      // set parent to open
      $parent.toggleClass('open')
    }

    return false
};
//***** Dropdown ends *****