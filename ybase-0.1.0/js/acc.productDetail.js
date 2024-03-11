ACC.productDetail = {

    _autoload: [
        "initPageEvents",
        "bindVariantOptions",
        "bindToAddToCartForm"
    ],

	popupPNodeSelector: '',
	popupCNodeSelector: '',
	popupHiddenSelector: '',
	popupMsgId: '',
	popupMsgIdMain: 'product_popup_text_main',
	popupMsgIdSP: 'product_popup_text_sp',
    bindToAddToCartForm: function () {
        $('#addToCartButton').click(function(){
			ACC.productDetail.popupPNodeSelector = '#addToCartForm';
			ACC.productDetail.popupCNodeSelector = '#addToCartButton';
			ACC.productDetail.popupHiddenSelector = '#addToCartForm input';
			ACC.productDetail.popupMsgId = ACC.productDetail.popupMsgIdMain;
		}),
        $('.conBtn').delegate('#addToCartButton','click',function(){
			ACC.productDetail.popupPNodeSelector = '.conBtn form';
			ACC.productDetail.popupCNodeSelector = '.conBtn button';
			ACC.productDetail.popupHiddenSelector = '.conBtn form input';
			ACC.productDetail.popupMsgId = ACC.productDetail.popupMsgIdSP;
		}),
        $('#addToCartForm').submit(function(){
            var formElement = $('.add_to_cart_form');
            var productCode = $('[name=productCodePost]', formElement).val();
            var quantityField = $('[name=qty]', formElement).val();
            var productName = formElement.data("productname");
            var productPrice = formElement.data("price");
            
            var quantity = 1;
            if (quantityField != undefined) {
                quantity = quantityField;
            }

            var cartData = {
                "cartCode": '',
                "productCode": productCode, "quantity": quantity,
                "productPrice": productPrice,
                "productName": productName
            };  
            ACC.track.trackAddToCart(productCode, quantity, cartData);

			if(document.querySelector("#addToCartButton") == undefined || $("#reservation-PDP").val() == "true" 
				|| ACC.productDetail.popupPNodeSelector == undefined || ACC.productDetail.popupPNodeSelector == "" 
				|| ACC.productDetail.popupCNodeSelector == undefined || ACC.productDetail.popupCNodeSelector == "" ) {
				return true;
			}

			var ret = true;
			var cartError = "";
			var statusCode = "";

			var popupPNode = null;
			var popupCNode = null;
			var popupMsgNode = null;
			popupPNode = document.querySelector(ACC.productDetail.popupPNodeSelector);
			popupCNode = document.querySelector(ACC.productDetail.popupCNodeSelector);
			popupMsgNode = document.querySelector('#' + ACC.productDetail.popupMsgId);
			if(popupMsgNode == undefined ) {
				popupMsgNode = document.createElement('span');
				var attrClass = document.createAttribute('class');
				var attrId = document.createAttribute('id');
				attrClass.value = ACC.productDetail.popupMsgId;
				attrId.value = ACC.productDetail.popupMsgId;
				popupMsgNode.setAttributeNode(attrClass);
				popupMsgNode.setAttributeNode(attrId);
				popupPNode.insertBefore(popupMsgNode, popupCNode);
			}
			if(document.querySelector('#'  + ACC.productDetail.popupMsgIdMain) != undefined) {
				document.querySelector('#'  + ACC.productDetail.popupMsgIdMain).innerHTML = '';
			}
			if(document.querySelector('#'  + ACC.productDetail.popupMsgIdSP) != undefined) {
				document.querySelector('#'  + ACC.productDetail.popupMsgIdSP).innerHTML = '';
			}

			popupCNode.disabled = true;
			popupMsgNode.innerHTML= "<span class=\"product_popup_show\"><br><img class=\"product_popup_click_loader\" src=\"/_ui/responsive/theme-lunasol/images/bigLoader.gif\"></span>";
			$('.product_popup_show').css('visibility','visible');

			var deleteNodes = document.getElementsByClassName('global-alerts');
			if(deleteNodes != undefined && deleteNodes[0] != undefined) {
				deleteNodes[0].innerHTML = "";
			}

			var hidden_arr = {};
			var form_input_arr = Array.from(document.querySelectorAll(ACC.productDetail.popupHiddenSelector));
			form_input_arr.forEach( wk_hidden => {
				if(wk_hidden.type === 'hidden') {
					hidden_arr[wk_hidden.name] = wk_hidden.value;
				}
			});

            $.ajax({
               url: ACC.config.encodedContextPath +  '/cart/add/popup' ,
               async: false,
				data: hidden_arr,
                dataType: "json",
                type: 'POST',
                success: function(response) {

					 var parsedJson = JSON.parse(response);
					if(typeof parsedJson.result != "undefined") {
						if(typeof parsedJson.cartCount != "undefined") {
							let elements = document.getElementsByClassName('js-lunasol-headMenu-cartCount')
							if(elements != undefined && elements[0] != undefined ) {
								elements[0].innerHTML=parsedJson.cartCount;
								if( parsedJson.cartCount != "0" ) {
									$('.js-lunasol-headMenu-cartCount').removeClass("hide");
								} else {
									$('.js-lunasol-headMenu-cartCount').addClass("hide");
									parsedJson.result = "error";
								}
							}
						}
						if(typeof parsedJson.message != "undefined" && parsedJson.message != "") {
							$('.product_popup_show').css('visibility','hidden');
							var errorMessage = ACC.sanitizer.sanitize(parsedJson.message);
							var appendHTML ="<div class=\"alert alert-danger alert-dismissable getAccAlert\"><button class=\"close closeAccAlert\" aria-hidden=\"true\" data-bs-dismiss=\"alert\" type=\"button\" title=\"\">×</button>" + errorMessage + "</div>";
							var deleteNodes = document.getElementsByClassName('global-alerts');
							if(deleteNodes != undefined && deleteNodes[0] != undefined) {
								deleteNodes[0].innerHTML = appendHTML;
							} else {
								var emsgPNode = document.getElementsByClassName('main__inner-wrapper');
								var emsgCNode = document.querySelector('#pdp-message-sec');
								var emsg = document.createElement('div');
								var emsgAttr = document.createAttribute('class');
								emsgAttr.value = 'global-alerts'
								emsg.setAttributeNode(emsgAttr);
								emsg.innerHTML = appendHTML;
								emsgPNode[0].insertBefore(emsg, emsgCNode);
							}
							window.scrollTo(0, 0);
							ret = false;
						} 
						if(parsedJson.result == "success" ) {
							popupCNode = document.querySelector(ACC.productDetail.popupCNodeSelector);
							popupMsgNode = document.querySelector('#' + ACC.productDetail.popupMsgId);
							popupCNode.disabled = false;
							popupMsgNode.innerHTML= "<span class=\"product_popup_show\"><div class=\"product_popup_close\"><span onClick=\"location.href='/cart';\"><span style=\"margin-left:180px;\">&nbsp;</span></span><img src=\"/_ui/responsive/theme-lunasol/images/ic_close.png\" style=\"width:20px; height:20px;\" onClick=\"document.querySelector('#" + ACC.productDetail.popupMsgId + "').innerHTML='';\"></div><span onClick=\"location.href='/cart';\"><span style=\"margin-left:1px;\">&nbsp;</span>商品をカートに追加しました<span style=\"margin-right:1px;\">&nbsp;</span><br><span style=\"margin-left:40px;\">&nbsp;</span><span class=\"product_popup_view_cart\">カートを見る</span>&nbsp;<img src=\"/_ui/responsive/theme-lunasol/images/ic_cart_black.png\" width=\"20px\" height=\"20px\"><span style=\"margin-right:40px;\">&nbsp;</span><br><span style=\"margin-left:100px;margin-right:100px;\">&nbsp;</span></span></span>";
							$('.product_popup_show').css('visibility','visible');

							const popupDelete = function() {
								$('.product_popup_show').css('visibility','hidden');
							}

							clearTimeout(popupDelete);
							setTimeout(popupDelete,6000);

							ret = false;
						} else if(parsedJson.result == "pageFlow" || parsedJson.result == "subscription") {
							ret = true;
						}
					}
				},
				error : function(xht, textStatus, ex) {
					$('.product_popup_show').css('visibility','hidden');
					var errorMessage = ACC.sanitizer.sanitize("商品をカートに追加することができませんでした。ページをリロードして再度カートへ追加をしてください。");
					var appendHTML ="<div class=\"alert alert-danger alert-dismissable getAccAlert\"><div class=\"container\"><button class=\"close closeAccAlert\" aria-hidden=\"true\" data-bs-dismiss=\"alert\" type=\"button\" title=\"\">×</button>" + errorMessage + "</div></div>";
					var deleteNodes = document.getElementsByClassName('global-alerts');
					if(deleteNodes != undefined && deleteNodes[0] != undefined) {
						deleteNodes[0].innerHTML = appendHTML;
					} else {
						var emsgPNode = document.getElementsByClassName('main__inner-wrapper');
						var emsgCNode = document.querySelector('#pdp-message-sec');
						var emsg = document.createElement('div');
						var emsgAttr = document.createAttribute('class');
						emsgAttr.value = 'global-alerts'
						emsg.setAttributeNode(emsgAttr);
						emsg.innerHTML = appendHTML;
						emsgPNode[0].insertBefore(emsg, emsgCNode);
					}
					ret = false;
				}
            });
			popupCNode.disabled = false;
			return ret;

        })
    },


    checkQtySelector: function (self, mode) {
    	var $qtySelector = $(document).find(self).parents(".js-qty-selector");
        var input = $qtySelector.find(".js-qty-selector-input");
        var inputVal = parseInt(input.val());
        var max = input.data("max");
        var minusBtn = $qtySelector.find(".js-qty-selector-minus");
        var plusBtn = $qtySelector.find(".js-qty-selector-plus");

        $qtySelector.find(".btn").removeAttr("disabled");

        if (mode == "minus") {
            if (inputVal != 1) {
                ACC.productDetail.updateQtyValue(self, inputVal - 1)
                if (inputVal - 1 == 1) {
                    minusBtn.attr("disabled", "disabled")
                }

            } else {
                minusBtn.attr("disabled", "disabled")
            }
        } else if (mode == "reset") {
            ACC.productDetail.updateQtyValue(self, 1)

        } else if (mode == "plus") {
        	if(max == "FORCE_IN_STOCK") {
        		ACC.productDetail.updateQtyValue(self, inputVal + 1)
        	} else if (inputVal <= max) {
                ACC.productDetail.updateQtyValue(self, inputVal + 1)
                if (inputVal + 1 == max) {
                    plusBtn.attr("disabled", "disabled")
                }
            } else {
                plusBtn.attr("disabled", "disabled")
            }
        } else if (mode == "input") {
            if (inputVal == 1) {
                minusBtn.attr("disabled", "disabled")
            } else if(max == "FORCE_IN_STOCK" && inputVal > 0) {
            	ACC.productDetail.updateQtyValue(self, inputVal)
            } else if (inputVal == max) {
                plusBtn.attr("disabled", "disabled")
            } else if (inputVal < 1) {
                ACC.productDetail.updateQtyValue(self, 1)
                minusBtn.attr("disabled", "disabled")
            } else if (inputVal > max) {
                ACC.productDetail.updateQtyValue(self, max)
                plusBtn.attr("disabled", "disabled")
            }
        } else if (mode == "focusout") {
        	if (isNaN(inputVal)){
                ACC.productDetail.updateQtyValue(self, 1);
                minusBtn.attr("disabled", "disabled");
        	} else if(inputVal >= max) {
                plusBtn.attr("disabled", "disabled");
            }
        }

    },


    
    updateQtyValue: function (self, value) {
        if (Number($("#maxOrderQuantity").val()) >= Number(value)) {
            if (typeof self !== "undefined") {
                var input = $(document).find(self).parents(".js-qty-selector").find(".js-qty-selector-input");
                var addtocartQty = $(document).find(self).parents(".addtocart-component").find("#addToCartForm").find(".js-qty-selector-input");
                var configureQty = $(document).find(self).parents(".addtocart-component").find("#configureForm").find(".js-qty-selector-input");
                input.val(value);
                addtocartQty.val(value);
                configureQty.val(value);
            }
            $(".js-qty-selector-input").each(function (i, elem) {
                $(elem).val(value);
            });
            $("#optQtyOption").val(value)
        }
    },

    initPageEvents: function () {
        $(document).on("click", '.js-qty-selector .js-qty-selector-minus', function () {
            ACC.productDetail.checkQtySelector(this, "minus");
        })

        $(document).on("click", '.js-qty-selector .js-qty-selector-plus', function () {
            ACC.productDetail.checkQtySelector(this, "plus");
        })

        $(document).on("change", '#optQtyOption', function () {
            let qty = $(this).val();
            ACC.productDetail.updateQtyValue(null,qty);
            let minusBtn = $(".addtocart-component").find(".js-qty-selector-minus");
            let plusBtn = $(".addtocart-component").find(".js-qty-selector-plus");
            if(Number(qty) === 1){
                minusBtn.attr("disabled", "disabled");
            } else   if(Number($("#maxOrderQuantity").val()) === Number(qty)) {
                minusBtn.removeAttr("disabled");
                plusBtn.attr("disabled", "disabled");
            } else {
                minusBtn.removeAttr("disabled");
                plusBtn.removeAttr("disabled");

            }
        })

        $(document).on("keydown", '.js-qty-selector .js-qty-selector-input', function (e) {

            if (($(this).val() != " " && ((e.which >= 48 && e.which <= 57 ) || (e.which >= 96 && e.which <= 105 ))  ) || e.which == 8 || e.which == 46 || e.which == 37 || e.which == 39 || e.which == 9) {
            }
            else if (e.which == 38) {
                ACC.productDetail.checkQtySelector(this, "plus");
            }
            else if (e.which == 40) {
                ACC.productDetail.checkQtySelector(this, "minus");
            }
            else {
                e.preventDefault();
            }
        })

        $(document).on("keyup", '.js-qty-selector .js-qty-selector-input', function (e) {
            ACC.productDetail.checkQtySelector(this, "input");
            ACC.productDetail.updateQtyValue(this, $(this).val());

        })
        
        $(document).on("focusout", '.js-qty-selector .js-qty-selector-input', function (e) {
            ACC.productDetail.checkQtySelector(this, "focusout");
            ACC.productDetail.updateQtyValue(this, $(this).val());
        })
        


        $("#Size").change(function () {
            changeOnVariantOptionSelection($("#Size option:selected"));
        });

        $("#variant").change(function () {
            changeOnVariantOptionSelection($("#variant option:selected"));
        });

        $(".selectPriority").change(function () {
            window.location.href = $(this[this.selectedIndex]).val();
        });

        function changeOnVariantOptionSelection(optionSelected) {
            window.location.href = optionSelected.attr('value');
        }
    },

    bindVariantOptions: function () {
        ACC.productDetail.bindCurrentStyle();
        ACC.productDetail.bindCurrentSize();
        ACC.productDetail.bindCurrentType();
    },

    bindCurrentStyle: function () {
        var currentStyle = $("#currentStyleValue").data("styleValue");
        var styleSpan = $(".styleName");
        if (currentStyle != null) {
            styleSpan.text(": " + currentStyle);
        }
    },

    bindCurrentSize: function () {
        var currentSize = $("#currentSizeValue").data("sizeValue");
        var sizeSpan = $(".sizeName");
        if (currentSize != null) {
            sizeSpan.text(": " + currentSize);
        }
    },

    bindCurrentType: function () {
        var currentSize = $("#currentTypeValue").data("typeValue");
        var sizeSpan = $(".typeName");
        if (currentSize != null) {
            sizeSpan.text(": " + currentSize);
        }
    }
};
