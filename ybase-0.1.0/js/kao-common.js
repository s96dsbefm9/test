//
// Please use this JS file to add common JavaScript used by all sub-sites.
//

// CDC (Gigya)

function gigyaLoginRegister() {
	$('.loader').show();
	gigya.accounts.showScreenSet({
		screenSet : 'Default-RegistrationLogin',
		mobileScreenSet : 'Default-RegistrationLogin',
		startScreen : 'gigya-login-screen',
		onAfterScreenLoad : showMobileView,
		onHide : fixForStyleIssue,
		deviceType : 'auto'
	});
}



function gigyaDirectRegister() {
	$('.loader').show();
	gigya.accounts.showScreenSet({
		screenSet : 'Default-RegistrationLogin',	
		startScreen : 'gigya-register-screen',
		onAfterScreenLoad : showMobileView,
		onHide : fixForStyleIssue,
		deviceType : 'auto'
	});
}

function gigyaProfileUpdate() {
	gigya.accounts.showScreenSet({
		screenSet : 'Default-ProfileUpdate',
		mobileScreenSet : 'Default-ProfileUpdate',
		startScreen : 'gigya-update-profile-screen',
		onAfterSubmit : profileUpdate,
		onHide : fixForStyleIssue,
		onAfterScreenLoad : showMobileView,
		deviceType : 'auto'
	});
}

function gigyaRegistration() {
	gigya.accounts.showScreenSet({
		screenSet : 'Default-RegistrationLogin',	
		startScreen : 'gigya-register-screen',
		onAfterScreenLoad : showMobileView,
		onHide : fixForStyleIssue,
		deviceType : 'auto'

	});
}

profileUpdate = function(response) {
	$.ajax(ACC.config.encodedContextPath + "/gigyaraas/profile", {
		data : {
			gigyaData : JSON.stringify(response.response)
		},
		dataType : "json",
		type : "post"
	});
};

showMobileView = function() {
	$("html").removeClass("gigya-mobile-modal-mode");
};

// PDP Reviews:
function toggleReview() {
	var reviewDiv = document.getElementById("write-review");
	if (reviewDiv.style.display === "none") {
		$('.js-writeReviewStars span').removeClass('active');
		reviewDiv.style.display = "block";
	} else {
		reviewDiv.style.display = "none";
		$('.js-writeReviewStars span').removeClass('active');
	}
}

$(function() {
	if ($.urlParam('loggedin') === 'true'
			|| $("#reviewForm .form-group").hasClass('has-error')) {
		toggleReview();
	}
});

$(document).ready(function() {
	
	if($("#show-registration-screenset").length>0){
		gigyaDirectRegister();
	}
	if($("#showLoginScreenSet").length>0)
	{
			gigyaLoginRegister();
	}	
	if($("#showProfileUpdateScreenSet").length>0)
	{
		gigyaProfileUpdate();
	}
	
	lineAppFunctionality();
	var variantCode = $("#notifyMeProduct").val();	
	var multiVariantPDP =  false;						
	if($("#baseCode").length>0){
		multiVariantPDP =  true;							
	}
	if($("#variantPDP").length>0){
		showPreselectedColorVariant();
	}
	if(multiVariantPDP){							
		prepareMultiVariantPDP();
	}else{
//		var variantObject = getVariantObjectForCode(variantCode);		
//		handleCartAndNotificationButtons(variantObject,variantCode);
	}
	
	// For cart page medical inquiry
	if ($('#medical-inquiry-flag').is(":checked"))
	{
		$("#proceedCheckoutAnonymous").removeClass("disabled");
		$("#proceedCheckout").removeClass("disabled");
	}
	else
	{
		$("#proceedCheckoutAnonymous").addClass("disabled");
		$("#proceedCheckout").addClass("disabled");
	}
})

$(document).on("change", "#medical-inquiry-flag", function (e) {
	if ($('#medical-inquiry-flag').is(":checked"))
	{
		$("#proceedCheckoutAnonymous").removeClass("disabled");
		$("#proceedCheckout").removeClass("disabled");
	}
	else
	{
		$("#proceedCheckoutAnonymous").addClass("disabled");
		$("#proceedCheckout").addClass("disabled");
	}
});

$("[id^=preBookLoginButton]").on('click',function(e) {
	e.preventDefault();
	if($("#preBookLoginButton").hasClass("disabled")){
		e.preventDefault();
	}
});
$(".variantSelectorLink").on('click',function(e) {	
	e.preventDefault();					
	var variantCode = $(this).data("variantcode");	
	var isVariantPDP = $("#variantPDP").val();
	if(isVariantPDP!=undefined && isVariantPDP)
	{
		  window.location.href = ACC.config.contextPath + "/p/"+variantCode;
	}	
});

$(document).on('click',"[id^=addToCartButton]",function(e){
		e.preventDefault();
		if ($(".page-productDetails").length > 0 ) {
			$("#addToCartForm").submit();
		} else {
            if ($(this).hasClass("repurchaseBtn")){
				var productCode = $(this).closest('#addToCartForm').find('input[name="productCodePost"]').val();
        			for (var i = 0; i < items.length; i++) {
        				if (items[i].item_id === productCode) {
							dataLayer.push({ ecommerce: null });
            				dataLayer.push({
                				'event': 'add_to_cart',
                    			'ecommerce': {
                                    'currency' : items[i].currency,
                                    'value': items[i].price,
                    				'items': [ items[i] ]
                 			}
                 		});
						break;
        			}
        		}
        	}
			$(this).closest('#addToCartForm').submit();
		}
});

$(document).on('click','#addSubscriptionToCartButton',function(e){
		if ($(".page-productDetails").length > 0 && !$(e.target).hasClass('js-subscription-login')) {
			e.preventDefault();
			$("#addToCartForm").submit();
		}
});

$(document).on('click', '.notifyme',function(e) {
	e.preventDefault();
	var productCodes = [];
	var multiVariant = $("#baseCode").val();
	if(multiVariant){
		 $('.variant-section').each(function(){
          	var getStyleValue = $(this).find('.variant-list li.active .multiVariantSelectorLink').data('variantcode'); 
          	productCodes.push(getStyleValue);          	
          });
	}else {		
		var variant = $("#notifyMeProduct").val();		
		productCodes.push(variant);
	}
	var baseURL = ACC.config.encodedContextPath
	var productURL = baseURL.concat('/p');
	var ajaxURL = productURL.concat('/notifyMe');
	$.ajax({
		url : ajaxURL,
		type : "POST",		
		data: {'productCodes':productCodes.toString()},
		success : function(data) {
			location.reload();
		},
		error : function(result) {
			//sonar complaint
			//console.log("notify me ajax failed");
		}
	});
});



$(".pdp-msg").on('click',function (e) {	
		$("#pdp-message-sec").removeClass("show").addClass("hide");	
});

$(document).on('click',"[id^=notify-gigya-redirect]",function (e) {
	if(!$(this).hasClass("prevent-click")){	
		$("#login-plus-notify").val(true);		
		gigyaLoginRegister();		
	}
});

$(".multiVariantSelectorLink").on('click',function (e) {
    e.preventDefault();
      var getStyleVCode = [];
      var multiVariantMap={};
     var multiVariantMedia={};
     var mediaKey='';
      $(this).closest('.variant-list').find('li').removeClass('active');
      $(this).closest('.variant-list').find('li').find('a').removeClass('active');
      var variantCode = $(this).data("variantcode");
      var areaCode = $(this).data('areacode');   
      variantName=$(this).data("variantname");
      $(this).addClass("active");
      $(this).parent('li').addClass('active');       
      var productCodes = [];					
	  $(".multiVariantSelectorLink").each(function(){
			if($(this).hasClass('active')){																
				productCodes.push($(this).data('variantcode'));									
			}
	  });
	  $("#notifyMeProduct").val(productCodes);
	  checkStockValuesForMultiVariants(productCodes);
      $("#multiVariant-"+areaCode).val(variantCode);   
      $("#multiVariantNames-"+areaCode).val(variantName);
      var baseCode = $('#baseCode').value;
      var variantObject =  $.parseJSON(multiVariants[variantCode]);
      var areaName = variantObject.areaName || '' ;
      var res = variantObject.kaoColorCode;
      $(this).closest('.variant-selector').find(".multiStyleName").text(": "+res);
      $('.variant-section').each(function(){
          var getStyleValue = $(this).find('.variant-list li.active .multiVariantSelectorLink').data('variantcode'); 
          mediaKey= mediaKey+getStyleValue;
          if (getStyleValue != null) {
              getStyleVCode.push($.parseJSON(multiVariants[getStyleValue]));
          }       
      });
      multiVariantMedia["galleryImages"]=multiVaraintMedias[mediaKey];
      $('#defaultKey').val(mediaKey);
      $('#image-section').remove(); 
      $('#defaultKey').val(mediaKey);
      ACC.imagegallery.multiProductImageGallery();
      $('#ajaxImageTag').html($("#variantImageTemplate").tmpl(multiVariantMedia));  
      ACC.imagegallery.bindImageGallery();  
      var res =variantObject.kaoColorCode;
      $(this).closest('.variant-selector').find(".multiStyleName").text(": "+res);
      $('#ccfloatBlock > .img').empty();
      $priceBlock = $('.priceBlock');
      $qtyBlock = $('.qtyBlock');
      $('#ccfloatBlock > .contents > .conTxt').empty();
      $('#ccfloatBlock > .contents > .conBtn').empty();
      $('#ccfloatBlock > .contents > .conTxt').html($priceBlock );
      $('#ccfloatBlock > .contents > .conTxt').append($qtyBlock );
      ab.global.setFloatingAddCart();

});

$("body").on("click", ".membershipPage", function(e) {	
//	$("#loginMembershipRedirect").val('/membership');
	console.log("Clicked membership");
	document.cookie = "loginMembershipRedirect=1";
	gigyaLoginRegister();
	console.log(getCookie("loginMembershipRedirect"));
});

$("body").on("click", ".favoritePage", function(e) {
	console.log("Clicked favoritePage");
	document.cookie = "loginFavoriteRedirect=1";
	console.log(getCookie("loginFavoriteRedirect"));
	gigyaLoginRegister();
});



$("body").on("click", "#placeOrder.btn--continue-checkout", function(e) {
	$("#loginSuccessRedirect").val('/checkout');
	$(this).addClass("click-prevent");
});

$("body").on("click", ".js-pre-book-login", function(e) {	
	$("#loginSuccessRedirect").val('/cart-pre-book');
	gigyaLoginRegister();
	
});

$(document).on("click", '.js-writeReviewTabLogin', function(e){
	e.preventDefault();
	var loginRedirect = $("#loginSuccessRedirect").val() + "?loggedin=true";
	$("#loginSuccessRedirect").val(loginRedirect);
//	var reviewCookie="loginSuccessRedirect=review";
	document.cookie=reviewCookie;
});

$("button").on("click", function(e) {
	
	if ($(this).hasClass("prevent-click")) {	
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
		
		return false;
	}
});

$.urlParam = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)')
			.exec(window.location.search);

	return (results !== null) ? results[1] || 0 : false;
}

disableElement = function(element) {
	element.removeClass('enabled').addClass('disabled');
	element.attr('disabled', 'disabled');
}

enableElement = function(element) {
	element.removeClass('disabled').addClass('enabled');
	element.removeAttr('disabled');
}

fixForStyleIssue = function(response) {
	$('.loader').show();
	var eventTrigger = JSON.stringify(response.reason);
	var pos = eventTrigger.search("canceled");	
	if (pos >= 0) {
		if ($("#searchResultPage-param").length) {
			window.location = window.location.href;
		} else {
			window.location = window.location.pathname;
		}
	}
};

notifyMeAjax = function(){
	var productCodes = [];
	var multiVariant = $("#baseCode").val();
	if(multiVariant){
		 $('.variant-section').each(function(){
          	var getStyleValue = $(this).find('.variant-list li.active .multiVariantSelectorLink').data('variantcode'); 
          	productCodes.push(getStyleValue);
          	
          });
	}else {
		
		var variant = $("#notifyMeProduct").val();		
		productCodes.push(variant);
	}
	var baseURL = ACC.config.encodedContextPath
	var productURL = baseURL.concat('/p');
	var ajaxURL = productURL.concat('/notifyMe');

	//var reloadURL = productURL.concat('?showNotifyMeSuccessMessage=true');
	$.ajax({
		url : ajaxURL,
		type : "POST",		
		data: {'productCodes':productCodes.toString()},
		success : function(data) {
			location.reload();
		},
		error : function(result) {
			//sonar complaint
			//console.log("notify me ajax failed");
		}
	});
};
setMultiVariantValuesInForm = function setMultiVariantValuesInForm(variantCode,areaCode,name){
	if(variantCode!=undefined && areaCode!=undefined){
		$("#multiVariant-"+areaCode).val(variantCode);  
		$("#multiVariantNames-"+areaCode).val(name); 
	}	
};
checkStockValuesForMultiVariants = function checkStockValuesForMultiVariants(productCodes){

	var outOfStockVariants = [];
	var multiVariantStockStatus =undefined;
	var multiVariantStockLevel = 0;
	productCodes.forEach(function(item) {
    	 var variantObject = getMultiVariantObject(item);
    	 var stockStatusForVariant = getVariantStockStatus(variantObject);    	  
    	 if(stockStatusForVariant==="outOfStock"){
    		  outOfStockVariants.push(item);
    		  multiVariantStockStatus = stockStatusForVariant;
    	 }
    	
    	 if(multiVariantStockLevel===0){    		
    		 multiVariantStockLevel = getStockLevelForVariant(variantObject);    		 
    	 }
    	 else{
    		 multiVariantStockLevel = Math.min(multiVariantStockLevel, getStockLevelForVariant(variantObject));
    	 }
    });	 
	 handleAddToCartForStockStatus(multiVariantStockStatus,$("#baseCode").val(),multiVariantStockLevel);
	 handleAddToFavoriteForStockStatus(multiVariantStockStatus);
	
	 handleRegisterArrivalButton(outOfStockVariants);
};



handleAddToCartForStockStatus = function(stockStatus,variantCode,maxStock){
	if (stockStatus === "outOfStock" || undefined) {
		  $(".outofstock-message").show();
		  $(".js-add-cart-qty").hide();
		  $(".js-product-code-post").val(variantCode);
		  $(".js-qty-selector-input").attr('data-max',maxStock);
		  $(".js-qty-selector-input").val(0);	
		 $("#message-area-pdp").html( ($("#multiVariantOOSMessage").val()));
		 $("#pdp-message-sec").removeClass("hide").addClass("show");		 
		 $("#pdp-message-sec").show();		 
		 $("[id^=notify-me-button]").removeClass("hide").addClass("show");
		 $("[id^=notify-gigya-redirect]").removeClass("hide").addClass("show");
		 $(".purchaseBtn").removeClass("hide").addClass("show");
		 scrollToElement($("#pdp-message-sec"), "");
	  }
	  else {		  
		  $(".outofstock-message").hide();
		  $(".js-add-cart-qty").show();
		  $(".js-product-code-post").val(variantCode);
		  $(".js-qty-selector-input").attr('data-max',maxStock);
		  $(".js-qty-selector-input").val(1);
		  $("[id^=notify-me-button]").removeClass("show").addClass("hide");		 
		  $("[id^=notify-gigya-redirect]").removeClass("show").addClass("hide");
		  $(".purchaseBtn").removeClass("show").addClass("hide");
		  if($("#baseCode").length>0){
			  $(".multiVariantSelectorLink").each(function(){
					if($(this).hasClass('active')){																
						setMultiVariantValuesInForm($(this).data('variantcode'),$(this).data('areacode'),$(this).data('variantname'));
					}
				});
		  }
	  }    
	
};

handleAddToFavoriteForStockStatus = function(stockStatus){
	let cart = $('#preDisplayButton' + '.show');
	if (cart.length <= 0) {
		if (stockStatus === "outOfStock" || undefined) {
			let favoriteBtn = $('.buttons').find('.AddToFavorite-AddToFavoriteAction');
			$('.ButtonActions').append(favoriteBtn);
		}
		else {
			let favoriteBtn = $('.ButtonActions').find('.AddToFavorite-AddToFavoriteAction');
			$('.buttons').append(favoriteBtn);
		}
	}
	else {
		let favoriteBtn = $('.buttons').find('.AddToFavorite-AddToFavoriteAction');
		$('.ButtonActions').append(favoriteBtn);
	}
};


getVariantStockStatus = function getVariantStockStatus(variantObject){	
	var stockStatusForVariant = undefined;
	if(variantObject!=undefined){
		//check Variant Stock
		var variantStock = variantObject.stock;
		var stockStatusForVariant = variantStock.stockLevelStatus.code;	
	}	
	return stockStatusForVariant;
};
getStockLevelForVariant = function getStockLevelForVariant(variantObject){
	var stockLevelForVariant = 0;
	if(variantObject!=undefined){		
		var variantStock = variantObject.stock;
		var stockLevelForVariant = variantObject.stock.stockLevel;	
	}	
	return stockLevelForVariant;
};
getMultiVariantObject = function getMultiVariantObject(variantCode){
	var variantObject = undefined;
	try {
//		variantObject = $.parseJSON(variants[variantCode]);
	     variantObject =  $.parseJSON(multiVariants[variantCode]);
	} catch (err) {
		//sonar complaint
		//console.log("unable to find data for variant");
	}
	return variantObject;
};

validateForm = function validateForm() {

	// document.getElementById("ticketdata.TicketCategory").value = "ENQUIRY";
	var message = document.getElementById("ticketdata.message").value;
	var subjectmsg = document.getElementById("subject").value;
	var say = document.getElementById("ticketdata.say").value;
	var mei = document.getElementById("ticketdata.Mei").value;
	var lastName = document.getElementById("ticketdata.lastName").value;
	var name = document.getElementById("ticketdata.name").value;
	var emailAddress = document.getElementById("ticketdata.emailAddress").value;
	var emailAddressCompare = document.getElementById("ticketdata.emailAddressCompare").value;
	var telephoneNumber1 = document.getElementById("telephoneNumber").value;
	var telephoneNumber2 = document.getElementById("telephoneNumber2").value;
	var telephoneNumber3 = document.getElementById("telephoneNumber3").value;
	var telephoneNumber = telephoneNumber1 + telephoneNumber2 + telephoneNumber2;

	var emailRGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var emailResult = emailRGEX.test(emailAddress);



if (subjectmsg == "Please select..." || subjectmsg=="選択してください") {
		var t = $('#subjectmessage').val()
		alert(t);
		return false;
	}
	if (message == "") {

		var t = $('#enquirymsg').val()
		alert(t);
		return false;
	}

	if (lastName == "") {
		var t = $('#lastnamemsg').val()
		alert(t);
		return false;
	}
	if (name == "") {
		var t = $('#namemsg').val()
		alert(t);
		return false;
	}
		if (say == "") {

    		var t = $('#saymsg').val()
    	alert(t);
    		return false;
    	}
    	if (mei == "") {

    		var t = $('#meimsg').val()
    		alert(t);
    		return false;
    	}
	if (emailAddress == "") {
		var t = $('#emailmsg').val()
		alert(t);
		return false;
	}

	if (emailResult == false) {

		var t = $('#invalidemailmsg').val()
		alert(t);
		return false;
	}
	if (emailAddress != emailAddressCompare) {
		var t = $('#confirmemailmsg').val()
		alert(t);
		return false;
	}
if (telephoneNumber1 == "" || telephoneNumber2 == "" || telephoneNumber3 == "") {
		var t = $('#phonemsg').val()
		alert(t);
		return false;
	}
	if (telephoneNumber.length>13) {
		var t = $('#validphonemsg').val()
	alert(t);
		return false;
	} else {
		var t = $('#submitted').val()
		return true;
	}

};

scrollToElement = function scrollToElement(target, el) {
    el = el || $('html, body');
    var elScrollToTopVal = el.scrollTop();
    if(typeof target.offset() !== "undefined"){
	    var targetOffsetVal = target.offset().top;
	    el.animate({
	        scrollTop: targetOffsetVal
	    }, 'slow')
    }
}
loadMultiVariantImage = function loadMultiVariantImage(){
	 var mediaKey='';  
     var multiVariantMap={};
     var multiVariantMedia={};
     var getStyleVCode = [];
    $('.variant-section').each(function(){
        var getStyleValue = $(this).find('.variant-list li.active .multiVariantSelectorLink').data('variantcode'); 
        mediaKey= mediaKey+getStyleValue;
        if (getStyleValue != null) {
            getStyleVCode.push($.parseJSON(multiVariants[getStyleValue]));
        }
        
        
    });
    multiVariantMedia["galleryImages"]=multiVaraintMedias[mediaKey];
    $('#defaultKey').val(mediaKey);
    $('#image-section').remove(); 
    $('#defaultKey').val(mediaKey);
    ACC.imagegallery.multiProductImageGallery();
    $('#ajaxImageTag').html($("#variantImageTemplate").tmpl(multiVariantMedia));  
    ACC.imagegallery.bindImageGallery();    
  

}

addVariantToRecent = function addVariantToRecent(variantCode) {
	$.ajax({
       url : ACC.config.encodedContextPath + '/p/'+variantCode+'/recentViewed',
       type : "post",
       success : function(response) {
    	 //sonar complaint
           //console.log("added the variant to recently viewed.");
       },
       error : function(xht, textStatus, ex) {
    	 //sonar complaint
           //console.log(textStatus);
       }
   });
};

showPreselectedColorVariant = function showPreselectedColorVariant(){
	var variant = $(".defaultColorVariant").data('variantcode');
	var variantObject = $.parseJSON(variants[variant]);
	if(variantObject!=undefined){
		var chooseAColorText = $("#selectedVariantText").val();
		$(".variant-styleName").text(variantObject.kaoColorCode+" "+chooseAColorText);
	}
	
}
multiProductImageGallery = function multiProductImageGallery() {

	 var slideno = $('#defaultKey').val();
	 if($('#defaultKey').length>0){
	 var flag=true;
	 $('.js-gallery-carousel .item').each(function(){
		
		 var getKey = $(this).find('img').data('multi-key');
         if(slideno === getKey){
			 var getIndex = $(this).data('slick-index');
			 $('.js-gallery-image').slick('slickGoTo', parseInt(getIndex));		
			 flag=false;
		 }				
	 });
	 if(flag){
		 $("#missingImageSection").removeClass("d-none");
		 $(".mulit-pdp-media-section").addClass("d-none");
	 }else{
		 $("#missingImageSection").addClass("d-none");
		 $(".mulit-pdp-media-section").removeClass("d-none");
	 }
	}
};


toggleNotifyMeButton = function toggleNotifyMeButton(toggleCondition){
	var buttons = $("[id^=notify-me-button]");
	if (toggleCondition) {
		buttons.addClass('enabled');
		buttons.removeClass('disabled');
		buttons.removeClass('prevent-click');
		buttons.removeAttr('disabled');
	} else {
		buttons.removeClass('enabled');
		buttons.addClass('disabled');
		buttons.addClass('prevent-click');
		buttons.attr('disabled', 'disabled');
	}
}

prepareAnonymousPDPPage = function prepareAnonymousPDPPage(variantCode){
	
	
}
isAnonymousPDPPage = function isAnonymousPDPPage(){
	return $('.page-productDetails').length > 0
		&& $("#notify-me-gigya").length > 0;
}

isPDPPage = function (){
	return  $('.page-productDetails').length > 0;
}

prepareMultiVariantPDP = function prepareMultiVariantPDP() {	
	var productCodes = [];					
	$(".multiVariantSelectorLink").each(function(){
		if($(this).hasClass('active')){									
			productCodes.push($(this).data('variantcode'));
			 var variantCode = $(this).data("variantcode");
			 var variantObject =  $.parseJSON(multiVariants[variantCode]);
		      var areaName = variantObject.areaName || '' ;
		      $(this).closest('.variant-selector').find(".multiStyleName").text(": " + variantObject.kaoColorCode);
		      $(this).closest('.variant-selector').find(".multiVariantAreaName").html(areaName);
		      $(this).closest('.variant-selector').find(".multiStyleName").text(": " + variantObject.kaoColorCode);
		      areaCode=$(this).data('areacode');  
			  variantCode = $(this).data("variantcode");
			  variantName=$(this).data("variantname");
			 $("#multiVariant-"+areaCode).val(variantCode); 	
			 $("#multiVariantNames-"+areaCode).val(variantName); 	
		}
	});	
	

	$("#notifyMeProduct").val(productCodes);
	checkStockValuesForMultiVariants(productCodes);
	loadMultiVariantImage();
}

handleRegisterArrivalButton = function handleRegisterArrivalButton(outOfStockVariants){	
	var enableButton=false;
	if(!isAnonymousPDPPage()){
		var productInterest = $("#productInterestsForCustomer").val();			
		if(outOfStockVariants.length>0){		
		$.each(outOfStockVariants, function( index, item ) {		
				if(!productInterest.includes(item)){	
					enableButton=true;
					return;
				}
			});
		}	


	}
	toggleNotifyMeButton(enableButton);
}

kaoLogout = function kaoLogout(){
	  gigya.accounts.logout({callback:hybrisKaoLogout});
//	  window.location.href = ACC.config.contextPath + "/logout";
}

function hybrisKaoLogout(response) {              	 
  	  window.location.href = ACC.config.contextPath + "/logout";    
} 


getVariantObjectForCode =  function getVariantObjectForCode(variantCode){
	try {
		return variantObject = $.parseJSON(variants[variantCode]);
	} catch (err) {
		return variantObject = undefined;
	}
}

lineAppFunctionality = function lineAppFunctionality(){
	var lineApp = (new URL(location.href)).searchParams.get('tidv2');
	if(null!=lineApp){
		if($("#loginSuccessRedirect").length<=0){
			$("input").attr("type", 'hidden').attr("id","loginSuccessRedirect").appendTo("body");
		}
	var lineAppRedirect = (new URL(location.href)).searchParams.get('landingURL');
	if(null!=lineAppRedirect && undefined!=lineAppRedirect){	
		$("#lineAppRedirect").val("true");
	}
	else{
		$("#loginSuccessRedirect").val('/membership');
		$("#lineAppRedirect").val("false");
	}
	if($("#blankPage").length>0)
	{
		if($("#cdcReturnCall").length<=0){		
				gigyaLoginRegister();			
		}
		
	}
	
		
	}
	
	
}

handleCartAndNotificationButtons = function handleCartAndNotificationButtons(variantObject,variantCode){
	
	if (variantObject != undefined) {		
		var variantStock = variantObject.stock;
		var stockStatus = variantStock.stockLevelStatus.code;
		var stockLevel = variantObject.stock.stockLevel!=undefined ? variantObject.stock.stockLevel : 0;
		handleAddToCartForStockStatus(stockStatus,variantCode,stockLevel);	
		console.log(variantObject);		
		if(variantObject.limitedItem){			
			$(".oos-notification-reg").text($("#reg-oos-label").val());
			$(".oos-notification-reg").addClass("disabled prevent-click");
			toggleNotifyMeButton(false);
		}
		else{
			handleRegisterArrivalButton([variantCode]);	
		}
		
	}
	else{
		if($("#notify-me-button").length>0){
			var productInterest = $("#productInterestsForCustomer").val();	
			if($("#limited-item-flag").val()){
				$(".oos-notification-reg").text($("#reg-oos-label").val());
				$(".oos-notification-reg").addClass("disabled prevent-click");
				toggleNotifyMeButton(false);
			}else{
				toggleNotifyMeButton(!productInterest.includes(variantCode));
			}
			
		}		
	}
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}

loginNotifyMeAjax = function(productCodes){	
	var baseURL = ACC.config.encodedContextPath
	var productURL = baseURL.concat('/p');
	var ajaxURL = productURL.concat('/notifyMe');

	//var reloadURL = productURL.concat('?showNotifyMeSuccessMessage=true');
	$.ajax({
		url : ajaxURL,
		type : "POST",		
		data: {'productCodes':productCodes.toString()},
		success : function(data) {			
			window.location.href = ACC.config.contextPath + "/p/"+productCodes;
		},
		error : function(result) {
			//sonar complaint
			//console.log("notify me ajax failed");
		}
	});
};

$(document).on("change", '.address-wrap-select', function() {	
	$("#shippingAddressForm input[name=lastName]").val("");
	$("#shippingAddressForm input[name=firstName]").val("");
	$("#shippingAddressForm input[name=lastNameKana]").val("");
	$("#shippingAddressForm input[name=firstNameKana]").val("");
	
	$("#shippingAddressForm input[name='"+ "phone" +"']").val("");
	$("#shippingAddressForm input[name='"+ "phoneCountryCode" +"']").val("");
	$("#shippingAddressForm input[name='"+ "phoneAreaCode" +"']").val("");
    
	$("#shippingAddressForm input[name='"+ "postcodePrefix" +"']").val("");
    $("#shippingAddressForm input[name='"+ "postcode" +"']").val("");
    
	$("#shippingAddressForm #prefecture-select").val("");  
	$("#shippingAddressForm #city-select").val("");
	$("#shippingAddressForm #town-select").val("");
	
	$("#shippingAddressForm input[name=addressId]").val("");
});

$("body").on("click", ".js-subscription-login", function(e) {
	$("#loginSuccessRedirect").val('/cart-add-subscription');
	gigyaLoginRegister();
});
$(document).on("click", '.js-add-subs-normal-to-cart', function(e){
	$(".js-as-subscription-product").val('false');
	$("#addToCartForm").submit();
});