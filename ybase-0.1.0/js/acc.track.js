ACC.track = {
	trackAddToCart: function (productCode, quantity, cartData)
	{
		window.mediator.publish('trackAddToCart',{
			productCode: productCode,
			quantity: quantity,
			cartData: cartData
		});
		for (var i = 0; i < items.length; i++) {
        	if (items[i].item_id === productCode) {
        	    items[i].quantity=parseInt(quantity);
				dataLayer.push({ ecommerce: null });
            	dataLayer.push({
                	'event': 'add_to_cart',
                    'ecommerce': {
                        'currency' : items[i].currency,
                        'value': items[i].price*items[i].quantity,
                    	'items': [ items[i] ]
                 	}
                 });
                　break;
        	}
        }
	},
	trackRemoveFromCart: function(productCode, initialCartQuantity)
	{
		window.mediator.publish('trackRemoveFromCart',{
			productCode: productCode,
			initialCartQuantity: initialCartQuantity
		});
	},

	trackUpdateCart: function(productCode, initialCartQuantity, newCartQuantity)
	{
		window.mediator.publish('trackUpdateCart',{
			productCode: productCode,
			initialCartQuantity: initialCartQuantity,
			newCartQuantity: newCartQuantity
		});
	},

    trackShowReviewClick: function(productCode)
    {
        window.mediator.publish('trackShowReviewClick',{});
    }

};