ACC.address = {

	_autoload: [
		"bindToChangeAddressButton",
		"bindCreateUpdateAddressForm",
		"bindAddressBookCloseButton",
		"bindSuggestedDeliveryAddresses",
		"bindCountrySpecificAddressForms",
		"showAddressFormButtonPanel",
		"bindShowHideShippingAddress",
		"bindToColorboxClose",
		"bindUseSelectedAddress",
		"showRemoveAddressFromBookConfirmation",
		"bindGetShippingaddressAnchor",
		"bindGetBillingaddressAnchor",
		"backToListAddresses"
	],

	spinner: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),
	addressID: '',
	bindAddressBookCloseButton: function () {
		$(document).on("click","#addressbook .btn-close",function(e){	
			$("#addressbook").removeClass("show");
		});
	},
	handleChangeAddressButtonClick: function ()
	{


		ACC.address.addressID = ($(this).data("address")) ? $(this).data("address") : '';
		$('#summaryDeliveryAddressFormContainer').show();
		$('#summaryOverlayViewAddressBook').show();
		$('#summaryDeliveryAddressBook').hide();

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
		
		$.getJSON(getDeliveryAddressesUrl, ACC.address.handleAddressDataLoad);
		return false;
	},

	handleAddressDataLoad: function (data)
	{
		var selectedOptionValue=$('input[id="address.selectedRadioOption"]').val()
	
		if(selectedOptionValue!== '' && selectedOptionValue !== undefined )
			{
				$('input[name="shippingRadiobutton"]').removeAtt('checked');
				$('input[name="selectedOptionValue"]').attr('checked','checked');
			}
		
		
		ACC.address.setupDeliveryAddressPopupForm(data);

		// Show the delivery address popup
		ACC.colorbox.open("",{
		 	inline: true,
			href: "#summaryDeliveryAddressOverlay",
			overlayClose: false,
			onOpen: function (){
				// empty address form fields
				ACC.address.emptyAddressForm();
				$(document).on('change', '#saveAddress', function ()
				{
					var saveAddressChecked = $(this).prop('checked');
					$('#defaultAddress').prop('disabled', !saveAddressChecked);
					if (!saveAddressChecked)
					{
						$('#defaultAddress').prop('checked', false);
					}
				});
			}
		});

	},

	setupDeliveryAddressPopupForm: function (data)
	{
		// Fill the available delivery addresses
		$('#summaryDeliveryAddressBook').html($('#deliveryAddressesTemplate').tmpl({addresses: data}));
		// Handle selection of address
		$('#summaryDeliveryAddressBook button.use_address').click(ACC.address.handleSelectExistingAddressClick);
		// Handle edit address
		$('#summaryDeliveryAddressBook button.edit').click(ACC.address.handleEditAddressClick);
		// Handle set default address
		$('#summaryDeliveryAddressBook button.default').click(ACC.address.handleDefaultAddressClick);
	},

	emptyAddressForm: function ()
	{
		var options = {
			url: getDeliveryAddressFormUrl,
			data: {addressId: ACC.address.addressID, createUpdateStatus: ''},
			type: 'GET',
            dataType: 'html',
			success: function (data)
			{
				$('#summaryDeliveryAddressFormContainer').html(data);
				ACC.address.bindCreateUpdateAddressForm();
			}
		};

		$.ajax(options);
	},

	handleSelectExistingAddressClick: function ()
	{
		var addressId = $(this).attr('data-address');
		$.postJSON(setDeliveryAddressUrl, {addressId: addressId}, ACC.address.handleSelectExitingAddressSuccess);
		return false;
	},

	handleEditAddressClick: function ()
	{

		$('#summaryDeliveryAddressFormContainer').show();
		$('#summaryOverlayViewAddressBook').show();
		$('#summaryDeliveryAddressBook').hide();

		var addressId = $(this).attr('data-address');
		var options = {
			url: getDeliveryAddressFormUrl,
			data: {addressId: addressId, createUpdateStatus: ''},
			target: '#summaryDeliveryAddressFormContainer',
			type: 'GET',
			success: function (data)
			{
				ACC.address.bindCreateUpdateAddressForm();
				ACC.colorbox.resize();
			},
			error: function (xht, textStatus, ex)
			{
//				console.log("Failed to update cart. Error details [" + xht + ", " + textStatus + ", " + ex + "]");
			}
		};

		$(this).ajaxSubmit(options);
		return false;
	},

	handleDefaultAddressClick: function ()
	{
		var addressId = $(this).attr('data-address');
		var options = {
			url: setDefaultAddressUrl,
			data: {addressId: addressId},
			type: 'GET',
			success: function (data)
			{
				ACC.address.setupDeliveryAddressPopupForm(data);
			},
			error: function (xht, textStatus, ex)
			{
//				console.log("Failed to update address book. Error details [" + xht + ", " + textStatus + ", " + ex + "]");
			}
		};

		$(this).ajaxSubmit(options);
		return false;
	},

	handleSelectExitingAddressSuccess: function (data)
	{
		if (data != null)
		{
			ACC.refresh.refreshPage(data);
			ACC.colorbox.close();
		}
		
	},

	bindCreateUpdateAddressForm: function ()
	{
		$('.create_update_address_form').each(function ()
		{
			var options = {
				type: 'POST',
				beforeSubmit: function ()
				{
					$('#checkout_delivery_address').block({ message: ACC.address.spinner });
				},
				success: function (data)
				{
					$('#summaryDeliveryAddressFormContainer').html(data);
					var status = $('.create_update_address_id').attr('status');
					if (status != null && "success" === status.toLowerCase())
					{
						ACC.refresh.getCheckoutCartDataAndRefreshPage();
						ACC.colorbox.close();
					}
					else
					{
						ACC.address.bindCreateUpdateAddressForm();
						ACC.colorbox.resize();
					}
				},
				error: function (xht, textStatus, ex)
				{
//					console.log("Failed to update cart. Error details [" + xht + ", " + textStatus + ", " + ex + "]");
				},
				complete: function ()
				{
					$('#checkout_delivery_address').unblock();
				}
			};

			$(this).ajaxForm(options);
		});
	},

	refreshDeliveryAddressSection: function (data)
	{
		$('.summaryDeliveryAddress').replaceWith($('#deliveryAddressSummaryTemplate').tmpl(data));

	},

	bindSuggestedDeliveryAddresses: function ()
	{
		var status = $('.add_edit_delivery_address_id').attr('status');
		if (status != null && "hasSuggestedAddresses" == status)
		{
			ACC.address.showSuggestedAddressesPopup();
		}
	},

	showSuggestedAddressesPopup: function ()
	{
		$(document).ready(function(){
			ACC.colorbox.open("Suggested Addresses",{
				href: "#popup_suggested_delivery_addresses",
				inline: true,
				width:"525px",
				onComplete: function ()
				{
					$(this).colorbox.resize();
				}
			});
			
		})	
	},

	bindCountrySpecificAddressForms: function (){
		$(document).on("change",'#countrySelector select', function (){
			var options = {
				'addressCode': '',
				'countryIsoCode': $(this).val()
			};
			ACC.address.displayCountrySpecificAddressForm(options, ACC.address.showAddressFormButtonPanel);
		})

	},

	showAddressFormButtonPanel: function ()
	{
		if ($('#countrySelector :input').val() !== '')
		{
			$('#addressform_button_panel').show();
		}
	},

	bindToColorboxClose: function ()
	{
		$(document).on("click", ".closeColorBox", function ()
		{
			ACC.colorbox.close();
		})
	},


	displayCountrySpecificAddressForm: function (options, callback)
	{
		$.ajax({
			url: ACC.config.encodedContextPath + '/my-account/addressform',
			async: true,
			data: options,
			dataType: "html",
			beforeSend: function ()
			{
				$("#i18nAddressForm").html(ACC.address.spinner);
			}
		}).done(function (data)
				{
					$("#i18nAddressForm").html($(data).html());
					if (typeof callback == 'function')
					{
						callback.call();
					}
				});
	},

	bindToChangeAddressButton: function ()
	{
		$(document).on("click", '.summaryDeliveryAddress .editButton', ACC.address.handleChangeAddressButtonClick);
	},

	
	
	bindShowHideShippingAddress: function(){
		if($(".address-wrap-select:checked").attr('id')=="existingBillingAdd")
			{
				$("input[id='address.selectedRadioOption']").val("existingBillingAdd");
				$("#shippingAddressForm").addClass("hide");
				
			}
		$(document).on("change",'.address-wrap-select',function(e){
			var isChecked = $(this).val();
			if(isChecked=='on'&& $(this).attr('id')!="existingBillingAdd")
			{
				$("#shippingAddressForm").removeClass("hide");	
			}
			else {
				$("#shippingAddressForm").addClass("hide");	
			}	
			
			$("input[id='address.selectedRadioOption']").val($(this).attr('id'));
		});
	},

	bindUseSelectedAddress : function() {
		$(document).on("click", '.useThisAddress', function() {			
			var getParent = $(this).closest("form");
			var fieldsToCopy = ["address.surName","address.name","address.firstName","address.lastName","address.prefectures","address.townCity","address.after.that"];
			
			var lastNameBilling = getParent.find("#addresssurName").val();
			var firstNameBilling = getParent.find("#addressname").val();
			var lastNameKanaBilling = getParent.find("#addresslastName").val();
			var firstNameKanaBilling = getParent.find("#addressfirstName").val();						
			var addressId = getParent.find("#selectedAddressCode").val();
			
			$("#shippingAddressForm input[name=lastName]").val(lastNameBilling);
			$("#shippingAddressForm input[name=firstName]").val(firstNameBilling);
			$("#shippingAddressForm input[name=lastNameKana]").val(lastNameKanaBilling);
			$("#shippingAddressForm input[name=firstNameKana]").val(firstNameKanaBilling);
			//$("#shippingAddressForm input[name=addressId]").val(addressId);
			
			
			/*for(var name of fieldsToCopy){
				var fieldValue = getParent.find("input[name='"+ name +"']").val();
				$("#shippingAddressForm input[id='"+ name+"']").val(fieldValue);
			}*/
								

			var fieldsToCopy = ["address.telephone"];
			var fieldValue = getParent.find("#addresstelephone").val();
            var phonenumbers=fieldValue.split('-');
			length=(fieldValue.match(/-/g) || []).length
			if(length==2)
            {
                 $("#shippingAddressForm input[name='"+ "phone" +"']").val(phonenumbers[0]);
                 $("#shippingAddressForm input[name='"+ "phoneCountryCode" +"']").val(phonenumbers[1]);
                 $("#shippingAddressForm input[name='"+ "phoneAreaCode" +"']").val(phonenumbers[2]);
            }
            if(length==1)
            {
            	$("#shippingAddressForm input[name='"+ "phone" +"']").val(phonenumbers[0]);
            	$("#shippingAddressForm input[name='"+ "phoneCountryCode" +"']").val(phonenumbers[1]);
            }
            if(length==0)
            {
            	$("#shippingAddressForm input[name='"+ "phoneCountryCode" +"']").val(phonenumbers[0]);
            }
		

            var fieldsToCopy = ["address.postalcode"];
			var fieldValue = getParent.find("#addresspostalcode").val();
			var phonenumbers = fieldValue.split('-');
			length=(fieldValue.match(/-/g) || []).length
            if(length==1)
            {
            	$("#shippingAddressForm input[name='"+ "postcodePrefix" +"']").val(phonenumbers[0]);
            	$("#shippingAddressForm input[name='"+ "postcode" +"']").val(phonenumbers[1]);
            }
            if(length==0)
            {
            	$("#shippingAddressForm input[name='"+ "postcode" +"']").val(phonenumbers[0]);
            }
           			
  
            var getprefecture = getParent.find('#addressprefectures').val();
   			var getcity = getParent.find('#addresstownCity').val();
   			var getafterthat = getParent.find('#addresafterthat').val();  			
		
   			$("#shippingAddressForm #prefecture-select").val(getParent.find('#addressprefectures').val());  
   			$("#shippingAddressForm #city-select").val(getcity);
   			$("#shippingAddressForm #town-select").val(getafterthat);
   			$('#addressForm').valid();
   			$('#addressbook-saved').modal('hide');
		});
	},
	
	showRemoveAddressFromBookConfirmation: function ()
	{
		$(document).on("click", ".removeAddressFromBookButton", function ()
		{
			var addressId = $(this).data("addressId");
			var popupTitle = $(this).data("popupTitle");

			ACC.colorbox.open(popupTitle,{
				inline: true,
				height: false,
				href: "#popup_confirm_address_removal_" + addressId,
				onComplete: function ()
				{

					$(this).colorbox.resize();
				}
			});

		})
	},

	bindGetShippingaddressAnchor:function(){
    	$('.js-address-click-Shipping-postalcode').on("click", function(e) {
    		e.preventDefault();
        	var postalcode  = $("#postalcode-select1").val() + $("#postalcode-select2").val();
        	var thisId = $(this).attr('id');
            $.ajax({
                url: ACC.config.encodedContextPath + '/checkout/multi/delivery-address/fetch?pinCode='+postalcode,
                async: false,
                data: "json",
                type: 'GET',
                success: function(response) {
                	 $.each(response, function(key, value) {
                                    		if(typeof response.kaoCity != "undefined") {
                                                  $("."+thisId+".city-select").val(response.kaoCity);
                                              }
                                             if(typeof response.addressAfterThat != "undefined") {
                                              $("."+thisId+".town-select").val(response.addressAfterThat);
                                              }
                                              if(typeof response.prefecture != "undefined") {
                                               $("."+thisId+".prefecture-select option[value='"+response.prefecture+"']").prop("selected", "selected");
                                              }

                                         });
                }
            });
         });
    },


	bindGetBillingaddressAnchor:function(){
    	$('.js-address-click-billing-postalcode').on("click", function(e) {
    		e.preventDefault();
        	var postalcode  = $("#bpostalcode-select1").val() + $("#bpostalcode-select2").val();
        	var thisId = $(this).attr('id');
            $.ajax({
                url: ACC.config.encodedContextPath + '/checkout/multi/delivery-address/fetch?pinCode='+postalcode,
                async: false,
                data: "json",
                type: 'GET',
                success: function(response) {
                	 $.each(response, function(key, value) {
                		 	                                            if(typeof response.kaoCity != "undefined") {
                                                                     		$("."+thisId+".city-select").val(response.kaoCity);
                                                                     	}
                                                                     	if(typeof response.addressAfterThat != "undefined") {
                                                                     		$("."+thisId+".town-select").val(response.addressAfterThat);
                                                                     	}
                                                                     	if(typeof response.prefecture != "undefined") {
                                                                     		$("."+thisId+".prefecture-select option[value='"+response.prefecture+"']").prop("selected", "selected");
                                                         				}
                     });
                }
            });
         });
    },
	backToListAddresses: function(){
		$(".addressBackBtn").on("click", function(){
			var sUrl = $(this).data("backToAddresses");
			window.location = sUrl;
		});
	}
};
