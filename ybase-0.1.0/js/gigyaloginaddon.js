/*
 * [y] hybris Platform
 *
 * Copyright (c) 2018 SAP SE or an SAP affiliate company.  All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

gigyaHybris = window.gigyaHybris || {};
gigyaHybris.gigyaFunctions = gigyaHybris.gigyaFunctions || {};
gigyaHybris.gigyaCache = gigyaHybris.gigyaCache || {};
window.gigyaHybris.authenticated = ACC.authenticated;


gigyaHybris.gigyaFunctions.logout = function(response) {
    gigya.accounts.logout();
    //window.location.href = gigyaHybris.logoutUrl;
    window.location.href = ACC.config.contextPath + "/logout";
};

gigyaHybris.gigyaFunctions.raasLogin = function(response) {
    jQuery.ajax(ACC.config.contextPath + "/gigyaraas/login", {    	
        data: {
            gigyaData: JSON.stringify(response)
        },
        dataType: "json",
        type: "post"
    }).done(function(data, textStatus, jqXHR) {    
        if (data.code !== 0) {
            ACC.colorbox.open(data.message,{
              html : $(document).find("#dialog").html(),
              maxWidth:"100%",
              width:"420px",
              initialWidth :"420px",
              height:"300px"
            });
        } else {        	
        	var loginSuccessRedirect = $("#loginSuccessRedirect");    
        
        	if (loginSuccessRedirect.length) {
            	console.log(loginSuccessRedirect.val());
        		handleLoginSuccessRedirect(loginSuccessRedirect);
			}
        	

			else {
				
				var loginMembershipRedirect = $("#loginMembershipRedirect");
				var loginRedirectCookie = getCookie("loginMembershipRedirect");	
				var loginFavoriteRedirectCookie = getCookie("loginFavoriteRedirect");
				var loginAddFavoritePro = getCookie("loginAddFavoritePro");
				if(loginRedirectCookie!=undefined && loginRedirectCookie!=null && loginRedirectCookie=='1' ){
					var d = new Date();
					d.setTime(d.getTime());
					var expires = "expires="+d.toUTCString();
					document.cookie = 'loginMembershipRedirect' + "=" + "" + ";domain="+window.location.hostname+";expires=" + expires;
					document.cookie = "loginMembershipRedirect=0";
					window.location.href = ACC.config.contextPath + "/membership";					
				}
				else if(loginFavoriteRedirectCookie!=undefined && loginFavoriteRedirectCookie!=null && loginFavoriteRedirectCookie=='1' ){
					var d = new Date();
					d.setTime(d.getTime());
					var expires = "expires="+d.toUTCString();
					document.cookie = 'loginFavoriteRedirect' + "=" + "" + ";domain="+window.location.hostname+";expires=" + expires;
					document.cookie = "loginFavoriteRedirect=0";
					window.location.href = ACC.config.contextPath + "/my-account/wishlist";
				}
				else if(loginAddFavoritePro!=undefined && loginAddFavoritePro!=null && loginAddFavoritePro=='1' ){
					ACC.favorite.addFavoriteToLogin();
				}
				else if($("#login-plus-notify").length>0 && $("#login-plus-notify").val()!=''){
					notifyMeAjax();
				}
			
                else {
                	// Bug ABK-7120: location.pathname replaced with location.href.
                	// Please make sure, the query string params are included, when fixing for IE.
                	if($("#searchResultPage-param").length)
                	{
                		window.location = window.location.href;
                	}
                	else{
                		if($("#showLoginScreenSet").length>0)
						{
							var redirectURL = window.location.href; 
							redirectURL = redirectURL.replace("#","");
							window.location.href=redirectURL;
						}
						else{					
                			window.location.href = window.location.pathname;
                		}
//                		$("#loginAddToCartForm").submit();
                	}
                }
			}       
        }
    });
};


gigyaHybris.gigyaFunctions.raasEditProfile = function(response) {
	var deleteFlag = response.response.data.deleteFlag;
	if(deleteFlag==="1"){
		  $.ajax(ACC.config.contextPath + "/gigyaraas/profile", {
		        data: {
		            gigyaData: JSON.stringify(response.response)
		        },
		        dataType: "json",
		        type: "post"
		    }).done(function(data, textStatus, jqXHRm,response) {
		        if (data.code !== 0) {
		            ACC.colorbox.open(data.message,{
		                html : $(document).find("#dialog").html(),
		                maxWidth:"100%",
		                width:"420px",
		                initialWidth :"420px",
		                height:"300px"
		              });
		        } else {
                      confirm('deleteAccountCompleteModal').done(
                        function() {
                          gigya.accounts.hideScreenSet("Default-ProfileUpdate");
	 		        	  window.location.href = ACC.config.contextPath + "/logout";
                        }
                      );
		        }
		    });
	}
	else{
    $.ajax(ACC.config.contextPath + "/gigyaraas/profile", {
        data: {
            gigyaData: JSON.stringify(response.response)
        },
        dataType: "json",
        type: "post"
    }).done(function(data, textStatus, jqXHRm,response) {
        if (data.code !== 0) {
            ACC.colorbox.open(data.message,{
                html : $(document).find("#dialog").html(),
                maxWidth:"100%",
                width:"420px",
                initialWidth :"420px",
                height:"300px"
              });
        } else {

            window.location.reload(false);
        }
    });
	}
};


gigyaHybris.gigyaFunctions.raasClick = function() {
    $(".gigya-raas-link").click(
        function(event) {
            event.preventDefault();
            var id = $(this).attr("data-gigya-id");
            gigya.accounts.showScreenSet(window.gigyaHybris.raas[id]);
        });
};


gigyaHybris.gigyaFunctions.raasEmbed = function() {
    if (gigyaHybris.raas) {
        $.each(gigyaHybris.raas, function(name, params) {
            if(!params.profileEdit && params.containerID){
                gigya.accounts.showScreenSet(params);
            }
            
            if(params.profileEdit && params.containerID){
                gigya.accounts.showScreenSet({
                    screenSet : params.screenSet,
                    startScreen : params.startScreen,
                    containerID : params.containerID,
                    onAfterSubmit : gigyaHybris.gigyaFunctions.raasEditProfile
                });
            }
        });
    }
};

gigyaHybris.gigyaFunctions.setAccountInfoForResendVerifyMail = function(idParams) {
    $.ajax(ACC.config.contextPath + "/gigya/accounts/setAccountInfoForResendVerifyMail", {
        data: {
            UID : idParams.UID,
            regToken : idParams.regToken,
            email : idParams.email,
            removeLoginEmails : idParams.removeLoginEmails
            },
        dataType: "json",
        type: "post"
    }).done(function(data) {
        idParams.callback(data);
    });
};

gigyaHybris.gigyaFunctions.resetPassword = function(idParams) {
    $.ajax(ACC.config.contextPath + "/gigya/accounts/resetPassword4CC", {
        data: {
            token : idParams.token,
            newPwd : idParams.newPwd,
            chkPwd : idParams.chkPwd,
            },
        dataType: "json",
        type: "post"
    }).done(function(data) {
        idParams.callback(data);
    });
};

function spliturl(urlString){
    var url = new URL(urlString),
          tidV2Param = url.searchParams.get("tidv2"),
          landingUrlParam = urlString.split('+')[0],
          url1 = new URL(landingUrlParam),
          result = {};
    landingUrlParam = url1.searchParams.get("landingURL").replace("\"", "");
    result.landing=landingUrlParam;
    result.tid=tidV2Param;
    return result;
}

function handleLoginSuccessRedirect(loginSuccessRedirect) {
	var loginFavoriteRedirectCookie = getCookie("loginFavoriteRedirect");
	var loginAddFavoritePro = getCookie("loginAddFavoritePro");
	console.log("inside login success redirect");
	console.log($("#lineAppRedirect").val());
	if($("#lineAppRedirect").val() =="true"){
		console.log(loginSuccessRedirect.val());
	}
	if(loginFavoriteRedirectCookie!=undefined && loginFavoriteRedirectCookie!=null && loginFavoriteRedirectCookie=='1' ){
		var d = new Date();
		d.setTime(d.getTime());
		var expires = "expires="+d.toUTCString();
		document.cookie = 'loginFavoriteRedirect' + "=" + "" + ";domain="+window.location.hostname+";expires=" + expires;
		document.cookie = "loginFavoriteRedirect=0";
		window.location.href = ACC.config.contextPath + "/my-account/wishlist";
	}
	else if(loginSuccessRedirect.val() == "/checkout") {
		$("#cartAdditionalForm").submit();
	}
	else if(loginSuccessRedirect.val() == "/cart") {
		$("#cartAdditionalForm").attr('action', '/cart/revert');
		$("#cartAdditionalForm").submit();
	}
	else if(loginSuccessRedirect.val() == "/cart-pre-book" || loginSuccessRedirect.val() == "/cart-add-subscription") {
	//	tracker = Piwik.getAsyncTracker(piwikTrackerUrl, piwikSiteId);
	//	console.log(tracker);
		$("#addToCartForm").submit();
	}
	else if($("#lineAppRedirect").val() =="true"){
		window.location.href=(spliturl(window.location.href).landing);
	}
	else if(loginAddFavoritePro!=undefined && loginAddFavoritePro!=null && loginAddFavoritePro=='1' ){
		ACC.favorite.addFavoriteToLogin();
	}
	else if($("#login-plus-notify").length>0 && $("#login-plus-notify").val()!=''){
		console.log("login-plus-notify login-plus-notify");
		notifyMeAjax();
	}
		
	else
	{
		window.location.href = ACC.config.encodedContextPath + loginSuccessRedirect.val();
	}
}

/*
 * Register login events
 */
function gigyaRegister() {
    if (ACC.gigyaUserMode === "raas") {
        gigya.accounts.addEventHandlers({
            onLogin: gigyaHybris.gigyaFunctions.raasLogin,
            onLogout: gigyaHybris.gigyaFunctions.logout,
        });
    }
}

function interceptLogoutClickEvent(e) {
    var target = e.target || e.srcElement;
    if ((target!=null && target!==undefined) && target.tagName === 'A' && target.getAttribute('href').endsWith('/logout')) {
        gigya.accounts.logout();
    }
}

gigyaHybris.gigyaFunctions.accountSearch = function(idParams) {
  var sendEmail = true;
  if(typeof idParams.sendEmail  == 'undefined' ){
  	  sendEmail = false;
  } else {
  	  sendEmail = idParams.sendEmail;
  }
  $.ajax(ACC.config.contextPath + "/gigya/accounts/search", {
       data: {
			birthMonth: idParams.birthMonth,
			birthDay: idParams.birthDay,
			email : idParams.email,
			sendEmail : sendEmail
        },
        dataType: "json",
        type: "post"
    }).done(function(data) {
		idParams.callback(data);
	});
};

gigyaHybris.gigyaFunctions.setAccountInfo = function(idParams) {
  $.ajax(ACC.config.contextPath + "/gigya/accounts/setAccountInfo", {
       data: {
			email : idParams.email,
			lastName: idParams.lastName,
			firstName: idParams.firstName,
			birthYear: idParams.birthYear,
			birthMonth: idParams.birthMonth,
			birthDay: idParams.birthDay,
			state: idParams.state,
			city: idParams.city,
			address: idParams.address,
			kanaLastName: idParams.kanaLastName,
			kanaFirstName: idParams.kanaFirstName,
			tel1: idParams.tel1,
			tel2: idParams.tel2,
			tel3: idParams.tel3,
			postCode1: idParams.postCode1,
			postCode2: idParams.postCode2,
			DMNotification: idParams.DMNotification,
			removeLoginEmails: idParams.removeLoginEmails
        },
        dataType: "json",
        type: "post"
    }).done(function(data) {
		idParams.callback(data);
	});
};

$(document).ready(function() {
    gigyaRegister();
    gigyaHybris.gigyaFunctions.raasClick();
    gigyaHybris.gigyaFunctions.raasEmbed();
    if (document.addEventListener) {
        document.addEventListener('click', interceptLogoutClickEvent);
    } else if (document.attachEvent) {
        document.attachEvent('onclick', interceptLogoutClickEvent);
    }
});