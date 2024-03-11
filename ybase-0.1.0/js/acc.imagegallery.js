ACC.imagegallery = {

	_autoload: [
		"bindImageGallery"
	],

	bindImageGallery: function() {

		$(".js-gallery").each(function() {

			var $image = $(this).find(".js-gallery-image");
			var $carousel = $(this).find(".js-gallery-carousel");

			$image.owlCarousel({
				singleItem : true,
				pagination:true,
				navigation:true,
				lazyLoad:true,
				navigationText : [$("<span>").addClass("glyphicon glyphicon-chevron-left"), $("<span>").addClass("glyphicon glyphicon-chevron-right")],
				afterAction : function(){
					ACC.imagegallery.syncPosition($image,$carousel,this.currentItem);
					$image.data("zoomEnable",true);
				},
				startDragging: function(){
					$image.data("zoomEnable",false);
				},
				afterLazyLoad:function(e){

					var b = $image.data("owlCarousel") || {};
					if(!b.currentItem){
						b.currentItem = 0;
					}

					var $e=$($image.find("img.lazyOwl")[b.currentItem]);
					if(window.innerWidth >= 1024) {
						startZoom($e.parent());
					}

					var owlHeight = parseInt($('.page-productDetails .carousel_box .carousel .owl-wrapper-outer').css("height"));
					var owlActiveCnt = $carousel.find('.owl-wrapper .owl-item.active').length;
					$('.page-productDetails .carousel_box .carousel .owl-wrapper-outer').css("width", owlHeight * owlActiveCnt + "px");
				}
			});


			$carousel.owlCarousel({
				navigation:true,
				navigationText : [$("<span>").addClass("glyphicon glyphicon-chevron-left"), $("<span>").addClass("glyphicon glyphicon-chevron-right")],
				pagination:false,
				items:2,
				itemsDesktop : [5000,7],
				itemsDesktopSmall : [1200,5],
				itemsTablet: [768,4],
				itemsMobile : [480,4],
				lazyLoad:true,
				afterAction : function(){

				},
				afterInit : function(){
					var owlHeight = parseInt($('.page-productDetails .carousel_box .carousel .owl-wrapper-outer').css("height"));
					var owlActiveCnt = $carousel.find('.owl-wrapper .owl-item.active').length;
					$('.page-productDetails .carousel_box .carousel .owl-wrapper-outer').css("width", owlHeight * owlActiveCnt + "px");
				}
			});


			$carousel.on("click","a.item",function(e){
				e.preventDefault();
				$image.trigger("owl.goTo",$(this).parent(".owl-item").data("owlItem"));
			});

			function startZoom(e) {
				$(e).zoom({
					url: $(e).find("img.lazyOwl").data("zoomImage"),
					touch: true,
					on: "mouseover",
					touchduration:300,

					onZoomIn:function(){

					},

					onZoomOut:function(){
						var owl = $image.data('owlCarousel');
						owl.dragging(true);
						$image.data("zoomEnable",true);
					},

					zoomEnableCallBack:function(){
						var bool = $image.data("zoomEnable");
						var owl = $image.data('owlCarousel');

						if(bool === false) {
							owl.dragging(true);
						}
						else {
						 	owl.dragging(false);
						}
						return bool;
					}
				});
			}
		});
	},

	multiProductImageGallery: function() {
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
		},
	syncPosition: function($image,$carousel,currentItem) {
		$carousel.trigger("owl.goTo",currentItem);
	}
};
