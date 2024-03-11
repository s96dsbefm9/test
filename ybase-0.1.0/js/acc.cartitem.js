ACC.cartitem = {

	_autoload: [
		"bindCartItem"
	],

	submitTriggered: false,

	bindCartItem: function ()
	{

		$('.js-execute-entry-action-button').on("click", function ()
		{
			ACC.cartitem.bindDeleteCartItem($(this));
					
		});

		/*$('.update-qty-btn').on("click", function (e) {		
			var getInput = $(this).closest('.cartItem').find('.js-update-entry-quantity-input')[0];
			ACC.cartitem.handleUpdateQuantity(getInput, e);	
			//$('#delete-item').modal('show');
		});.on("keyup", function (e)
		{
			return ACC.cartitem.handleKeyEvent(this, e);
		}
		).on("keydown", function (e)
		{
			return ACC.cartitem.handleKeyEvent(this, e);
		}
		);*/
		
		$('.updatable').change('click',function(e) {
			var getInput = $(this).closest('.cartItem').find('.js-update-entry-quantity-input')[0];
			ACC.cartitem.handleUpdateQuantity(getInput, e);	
	    });
		
		$('.cartQuantity_plus').on('click',function(){
		  var getInput = $(this).closest('.cartQuantity').find('.js-update-entry-quantity-input');
		  var getBtn = $(this).closest('.cartQuantity').find('.cartQuantity_minus');
	      var value = getInput.val();		      
	      getInput.val(++value);
		  
		  if(value > 1){
			  getBtn.removeClass('div-disabled');
		  }
	});
	$('.cartQuantity_minus').on('click',function(){
		var getInput = $(this).closest('.cartQuantity').find('.js-update-entry-quantity-input');
		var getBtn = $(this).closest('.cartQuantity').find('.cartQuantity_minus');
	    var value = getInput.val();		      
		   if(value > 1){
			   getInput.val(--value);
		   }else{
			   getInput.val(1); 
			   getBtn.addClass('div-disabled');
		  }
	});
	
	$('.js-update-entry-quantity-input').on('blur', function(){
		var getVal = $(this).val();
		var getInput = $(this).closest('.cartQuantity').find('.js-update-entry-quantity-input');
		if(getVal < 1){
			getInput.val(1); 
		}
	});


	},
	bindDeleteCartItem:function(selectedButton){	
		$( "#delete-confirm" ).dialog({
			modal: true, 
			autoOpen: true,
			buttons: {
		        "OK": function() {
		        	var entryAction = selectedButton.data("entryAction");
					var entryActionUrl =  selectedButton.data("entryActionUrl");
					var entryProductCode =  selectedButton.data("entryProductCode");
					var entryInitialQuantity =  selectedButton.data("entryInitialQuantity");
					var actionEntryNumbers =  selectedButton.data("actionEntryNumbers");
                    var entryProductCodeString =  selectedButton.attr("data-entry-product-code");

					if(entryAction == 'REMOVE')
					{
						ACC.track.trackRemoveFromCart(entryProductCode, entryInitialQuantity);
						for (var i = 0; i < items.length; i++) {
							if (items[i].item_id === entryProductCodeString) {
								dataLayer.push({ ecommerce: null });
								dataLayer.push({
									'event': 'remove_from_cart',
									'ecommerce': {
                                        'currency' : items[i].currency,
                                        'value': items[i].price*items[i].quantity,
										'items': [ items[i] ]
									}
								});
								break;
							}
						}
					}

					var cartEntryActionForm = $("#cartEntryActionForm");
					var entryNumbers = actionEntryNumbers.toString().split(';');
					entryNumbers.forEach(function(entryNumber) {
						var entryNumbersInput = $("<input>").attr("type", "hidden").attr("name", "entryNumbers").val(entryNumber);
						cartEntryActionForm.append($(entryNumbersInput));
					});
					cartEntryActionForm.attr('action', entryActionUrl).submit();
					
					$( this ).dialog( "close" );
		        },
		        Cancel: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
	},


	handleKeyEvent: function (elementRef, event)
	{
		//console.log("key event (type|value): " + event.type + "|" + event.which);

		if (event.which == 13 && !ACC.cartitem.submitTriggered)
		{
			ACC.cartitem.submitTriggered = ACC.cartitem.handleUpdateQuantity(elementRef, event);
			return false;
		}
		else 
		{
			// Ignore all key events once submit was triggered
			if (ACC.cartitem.submitTriggered)
			{
				return false;
			}
		}

		return true;
	},

	handleUpdateQuantity: function (elementRef, event)
	{

		var form = $(elementRef).closest('form');

		var productCode = form.find('input[name=productCode]').val();
		var initialCartQuantity = form.find('input[name=initialQuantity]').val();
		var newCartQuantity = form.find('input[name=quantity]').val();

		if(initialCartQuantity != newCartQuantity)
		{
			ACC.track.trackUpdateCart(productCode, initialCartQuantity, newCartQuantity);
			form.submit();

			return true;
		}

		return false;
	}
};

$(document).ready(function() {
    $('.js-cartItemDetailBtn').click(function(event) {
        event.stopPropagation();
        var thisDetailGroup =  $(this).parent('.js-cartItemDetailGroup');
        $(thisDetailGroup).toggleClass('open'); //only in its parent
        if ( $(thisDetailGroup).hasClass('open') )  {
            //close all if not this parent
            $('.js-cartItemDetailGroup').not( thisDetailGroup ).removeClass('open');
            //change aria
            $('.js-cartItemDetailBtn').attr('aria-expanded', 'true');

        } else {
            $('.js-cartItemDetailBtn').attr('aria-expanded', 'false');
        }
        $(document).click( function(){
            $(thisDetailGroup).removeClass('open');
        }); // closes when clicking outside this div
        
        
        
    });

    //enable comment for this item only
    $('.js-entry-comment-button').click(function(event) {
        event.preventDefault();
        var linkID = $(this).attr('href');
        $( linkID ).toggleClass('in');
        $( thisDetailGroup ).removeClass('open');
    });
    
    $(".qty-btn").click(function(){
    	$('input[name=quantity]').trigger('blur');
    });
});

