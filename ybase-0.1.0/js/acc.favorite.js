ACC.favorite = {
	_autoload: [
		"favoriteButton",
		["bindFavoriteSort", $('.favorite-items .favorite-item').length > 0],
		["favoritePagination", $('.favorite-items .favorite-item').length > 0]
	],
	bindFavoriteSort: function() {
		$(document).on('click', '.js-remove-favorite', function(e) {
			e.preventDefault();
			let targetUrl = $(this).attr("href");
			try {
				zdRemoveFromFavoriteAsync({ item_id: $(this).data('product'), quantity: 1 })
				.then(function() {
					window.location.href = targetUrl;
				})
			} catch (error) {
				window.location.href = targetUrl;
			}
		});
		$(document).on("change", '#sortList', function (event) {
			event.preventDefault();
			const sortForm = $('#sortFavoriteProduct');
			
		    sortForm.submit();
		});
	},
	favoritePagination: function() {
		var perPage = favoritePageSize || 8;
		var pageProductsLength = $('.favorite-items .favorite-item').length;
		var pagination = "";
		
		// Product intial load
		$('.favorite-items .favorite-item:lt(' + perPage + ')').removeClass('hide').addClass('now');
		// Pagination initial load
		for (var ol = 0; ol < pageProductsLength / perPage; ol++) {
			pagination += '<li class="favorite-pagination-numItem"><a data-page="' + (ol+1) + '" href="#">' + (ol+1) + '</a></li>';
		}
		
		if (pageProductsLength / perPage > 1) {
			$(pagination).insertAfter('.favorite-pagination-wrap .favorite-pagination-prev');
			$('.favorite-pagination-wrap .favorite-pagination-numItem').eq(0).addClass('active');
			$('.favorite-pagination-wrap').show();
		}
		// Click pagination
		$(document).on('click', '.favorite-pagination-wrap .favorite-pagination-numItem a', function(e) {
			e.preventDefault();
			var currentPage = $(this).data('page');
			$('.favorite-pagination-wrap .favorite-pagination-numItem').removeClass('active');
			$(this).parent().addClass('active');
			// Disable next and previous button
			if ($(this).parent().prev('li').hasClass('prevBtn')) {
				$('.prevBtn').addClass('disabled');
			} else {
				$('.prevBtn').removeClass('disabled');
			}
			if ($(this).parent().next('li').hasClass('nextBtn')) {
				$('.nextBtn').addClass('disabled');
			} else {
				$('.nextBtn').removeClass('disabled');
			}
			$('.favorite-items .favorite-item').addClass('hide');
			for (var pr = perPage * currentPage - perPage; pr < perPage * currentPage; pr++) {
				$('.favorite-items .favorite-item:eq(' + pr + ')').removeClass('hide');
				if (pr === pageProductsLength) {
					break;
				}
			};
			$("html, body").animate({ scrollTop: 0 }, 600);
		});
		// Click next and previous
		$(document).on('click', '.nextBtn', function(e) {
			e.preventDefault();
			$('.favorite-pagination-wrap .active').next('li').find('a').trigger('click');
		});
		$(document).on('click', '.prevBtn', function(e) {
			e.preventDefault();
			$('.favorite-pagination-wrap .active').prev('li').find('a').trigger('click');
		});
	},
	favoriteButton: function() {
		$(document).on('click', '.loginFavoriteBtn', function(e) {
			e.preventDefault();
			document.cookie = "loginAddFavoritePro=1";
			gigyaLoginRegister();
		});

		$(document).on('click', '.addToFavoriteButton', function(e) {
			e.preventDefault();
			const productId = $('[name=productCode]').val();
			$.ajax({
				url: ACC.config.contextPath + '/p/addFavorites/products/' + productId,
				type : 'POST',
				data: {'productCode':productId},
				success : function() {
					//Switching favorite button in cart button right
					var addtocartComponent = $('.addtocart-component');
					addtocartComponent.find('.addToFavoriteButton').hide();
					addtocartComponent.find('.deleteToFavoriteButton').show();
					//Switching favorite button in Main image area
					var imageGallery = $('.image-gallery__image');
					imageGallery.find('.addToFavoriteButton').hide();
					imageGallery.find('.deleteToFavoriteButton').show();
					//Switching favorite button in floating area
					var ccfloatBlock = $('#ccfloatBlock');
					ccfloatBlock.find('.addToFavoriteButton').hide();
					ccfloatBlock.find('.deleteToFavoriteButton').show();
					zdAddToFavorite({ item_id: productId, quantity: 1 });
				},
				error : function(response) {
					var message = 'お気に入りの登録・削除でエラーが発生しました。再度お試しいただいても解消しない場合、お問い合わせください。';
					if (response.responseJSON == 'FavoritelimitError') {
						message = 'お気に入りに登録できる数の上限数を超えています。';
					}
					$('#message-area-pdp').text(message);
					$('#pdp-message-sec').removeClass('alert-info').addClass('alert-danger');
					$('#pdp-message-sec').removeClass('hide');
					$(window).scrollTop(0);
				}
			});
		});

		$(document).on('click', '.deleteToFavoriteButton', function(e) {
			e.preventDefault();
			const productId = $('[name=productCode]').val();
			$.ajax({
				url: ACC.config.contextPath + '/p/deleteFavorites/products/' + productId,
				type : 'POST',
				data: {'productCode':productId},
				success : function() {
					//Switching favorite button in cart button right
					var addtocartComponent = $('.addtocart-component');
					addtocartComponent.find('.deleteToFavoriteButton').hide();
					addtocartComponent.find('.addToFavoriteButton').show();
					//Switching favorite button in Main image area
					var imageGallery = $('.image-gallery__image');
					imageGallery.find('.deleteToFavoriteButton').hide();
					imageGallery.find('.addToFavoriteButton').show();
					//Switching favorite button in floating area
					var ccfloatBlock = $('#ccfloatBlock');
					ccfloatBlock.find('.deleteToFavoriteButton').hide();
					ccfloatBlock.find('.addToFavoriteButton').show();
					zdRemoveFromFavorite({ item_id: productId, quantity: 1 });
				},
				error : function() {
					var message = 'お気に入りの登録・削除でエラーが発生しました。再度お試しいただいても解消しない場合、お問い合わせください。';
					$('#message-area-pdp').text(message);
					$('#pdp-message-sec').removeClass('alert-info').addClass('alert-danger');
					$('#pdp-message-sec').removeClass('hide');
					$(window).scrollTop(0);
				}
			});
		});
	},

	addFavoriteToLogin: function() {
		const productId = $('[name=productCode]').val();
		$.ajax({
			url: ACC.config.contextPath + '/p/addFavorites/products/' + productId,
			type : 'POST',
			data: {'productCode':productId},
			success : function() {
				var d = new Date();
				d.setTime(d.getTime());
				var expires = "expires="+d.toUTCString();
				document.cookie = 'loginAddFavoritePro' + "=" + "" + ";domain="+window.location.hostname+";expires=" + expires;
				document.cookie = "loginAddFavoritePro=0";
				try {
					zdAddToFavoriteAsync({ item_id: productId, quantity: 1 })
					.then(function() {
						location.reload();
					})
				} catch (error) {
					location.reload();
				}
			},
			error : function() {
				var d = new Date();
				d.setTime(d.getTime());
				var expires = "expires="+d.toUTCString();
				document.cookie = 'loginAddFavoritePro' + "=" + "" + ";domain="+window.location.hostname+";expires=" + expires;
				document.cookie = "loginAddFavoritePro=0";
				location.reload();
			}
		});
	},
}
