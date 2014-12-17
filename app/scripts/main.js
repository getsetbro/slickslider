/*!
 * Init Utils
 *
 */

(function(window, $, undefined) {
    var Carousel = {
        playerTemplate: function(videopID){
          return '<div>' +
          '<div style="display:none"></div>'+
          '<object class="BrightcoveExperience" id="bcv_' + videopID + '">'+
          '<param name="bgcolor" value="#000000" />'+
          '<param name="width" value="530" />'+
          '<param name="height" value="300" />'+
          '<param name="isVid" value="true" />'+
          '<param name="isUI" value="true" />'+
          '<param name="htmlFallback" value="true" />'+
          '<param name="dynamicStreaming" value="true" />'+
          '<param name="playerKey" value="AQ~~,AAABZYdAfHk~,rfwhGZGAOzpg9is3SWrPSaKzW3y1dPmF" />'+
          //'<param name="playerID" value="3266798266001" />'+ //replaced by the playerKey param
          '<param name="@videoPlayer" value="' + videopID + '"; />'+
          '<param name="includeAPI" value="true" />'+
          //'<param name="templateLoadHandler" value="Carousel.onTemplateLoad" />'+
          '<param name="templateReadyHandler" value="Carousel.onTemplateReady" />'+
          '</object>'+
          '</div>';
        },
        slickCarousel:function(){
          Carousel.prop_carousel = $('.js-prop_carousel').slick({
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
            autoplay:false,
            autoplaySpeed:6000
            //speed:300
          });
        },
        slickLightbox:function(){
          Carousel.prop_lightbox = $('.js-prop_lightbox').slick({
            //speed:300
          });
        },
        bindImgClicks: function(){
          Carousel.imgClicksBound = true;
          $('.js-prop_carousel').click(function(event){
                console.log(event);
          });
          $('.js-prop_carousel').find('.slick-track').click(function(event){
            var carouselcurrent = $(event.target).parent().attr('index');
            $('.Lightbox').removeClass('Lightbox--hidden');
            Carousel.prop_lightbox.slickGoTo(carouselcurrent);
            Carousel.prop_carousel.slickPause();
          });
        },
        init: function() {
          var propImagesWrap = $('.js-prop_images');
          var propImages = propImagesWrap.find('>div');
          if(propImages.length < 2){
            //do nothing
            return false;
          }
          //continue to create carousel
          propImages.detach().appendTo('.js-prop_carousel,.js-prop_lightbox');

          Carousel.slickLightbox();
          Carousel.slickCarousel();
          Carousel.bindImgClicks();

          //videos
          var prop_videos = $('.js-prop_videos');
          var prop_videos_data = prop_videos.data('bcvid');
          //if there is no element or attribute do not try to parse
          Carousel.prop_videos_arr = (prop_videos_data) ? JSON.parse("[" + prop_videos_data + "]") : [];
          //if no videos then do not continue
          if( !Carousel.prop_videos_arr.length ){
            //bind image clicks now that would have been bound after videos
            return false;
          }

          $.each(Carousel.prop_videos_arr, function(i){
              Carousel.prop_lightbox.slickAdd( Carousel.playerTemplate( Carousel.prop_videos_arr[i] ), true );
          });

          brightcove.createExperiences();

        },
        player:null,
        APIModules:null,
        videoPlayer:{},
        playersAddedArr:[],
        playersAddedObj:{},
        // onTemplateLoad: function(experienceID) {
        //   console.log("EVENT: onTemplateLoad");
        // },
        onTemplateReady: function(event) {
          //console.log("EVENT.onTemplateReady");
          var experienceID = event.target.experience.id;
          Carousel.player = brightcove.api.getExperience(experienceID);
          Carousel.videoPlayer[experienceID] = Carousel.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
          Carousel.videoPlayer[experienceID].getCurrentVideo(function(video){

            if( Carousel.playersAddedArr.indexOf(video.videoStillURL) === -1 ){
              Carousel.playersAddedArr.push(video.videoStillURL);
              Carousel.playersAddedObj[video.id] = video.videoStillURL;
            }
            if( Carousel.playersAddedArr.length === Carousel.prop_videos_arr.length){
              $.each(Carousel.prop_videos_arr, function(i){
                Carousel.prop_carousel.slickAdd("<div class='Carousel-vid'>"+
                  "<img src='" + Carousel.playersAddedObj[Carousel.prop_videos_arr[i]] + "'/>"+
                  "<div class='Carousel-play'></div>"+
                  "</div>", true );
              });
              Carousel.prop_carousel.slickPlay();
              Carousel.playersAddedArr.push('be done');
            }

          });
        },
        hideAndStop: function(active) {
            //pause all vids
            $.each(Carousel.videoPlayer, function(key,val){
              Carousel.videoPlayer[key].pause();
            });
            // restart autoplay and hide the lightbox
            Carousel.prop_carousel.slickPlay();
            $('.Lightbox').addClass('Lightbox--hidden');

        }
    };

    window.Carousel = Carousel;

}(window, jQuery));

Carousel.init();
