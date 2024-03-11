ACC.payment = {
		
		activateSavedPaymentButton: function(){

			$(document).on("click",".js-saved-payments",function(e){
				e.preventDefault();
				
				var titleHtml = $("#savedpaymentstitle").html();
				
				$.colorbox({
					href: "#savedpaymentsbody",
					inline:true,
					maxWidth:"100%",
					opacity:0.7,
					width:"320px",
					title: titleHtml,
					close:'<span class="glyphicon glyphicon-remove"></span>',
					onComplete: function(){
					}
				});
			})
			
			$(document).on("click",".js-remove-payments",function(e){
				e.preventDefault();
				
				var titleHtml = $("#removepaymentstitle").html();
				
				$.colorbox({
					href: "#removepaymentslist",
					inline:true,
					maxWidth:"100%",
					escKey: false,
				    overlayClose: false,
					opacity:0.7,
					width:"1060px",
					title: titleHtml,
					padding: '40px',
					close:'<span class="cardlist-remove"></span>',
					onComplete: function(){
						
					}
				});
			})
			
//			$(document).on("click",".paymentsDeleteBtn",function(e){
//				e.preventDefault();
//				
//				
//				$.colorbox({
//					href: ".js_removePaymentPopup",
//					inline:true,
//					maxWidth:"100%",
//					opacity:0.7,
//					width:"1060px",
//					padding: '40px',
//					close:'<span class="cardlist-remove"></span>',
//					onComplete: function(){
//					}
//				});
//			})
			
			
		},
		bindPaymentCardTypeSelect: function ()
		{
			ACC.payment.filterCardInformationDisplayed();
			$("#card_cardType").change(function ()
			{
				var cardType = $(this).val();
				if (cardType == '024')
				{
					$('#startDate, #issueNum').show();
				}
				else
				{
					$('#startDate, #issueNum').hide();
				}
			});
		},
		filterCardInformationDisplayed: function ()
		{
			var cardType = $('#card_cardType').val();
			if (cardType == '024')
			{
				$('#startDate, #issueNum').show();
			}
			else
			{
				$('#startDate, #issueNum').hide();
			}
		}
}

$(document).ready(function () {
	ACC.payment.activateSavedPaymentButton();
	ACC.payment.bindPaymentCardTypeSelect();
});
	
	
	
