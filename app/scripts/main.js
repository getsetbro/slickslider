/*!
 * Init Utils
 *
 */

(function(window, $, undefined) {
    var Int = {};
    var Carousel = {
        //init
        playerTemplate: function(videopID){
          return '<div id="bcp_' + videopID + '">' +
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
          Carousel.prop_carousel = $('#prop_carousel').slick({
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
            autoplay:false,
            autoplaySpeed:6000
            //speed:300
          });
        },
        slickLightbox:function(){
          Carousel.prop_lightbox = $('#prop_lightbox').slick({
            //speed:300
          });
        },
        bindImgClicks: function(){
          Carousel.imgClicksBound = true;
          $('#prop_carousel').find('img').click(function(){
            Carousel.prop_carousel.slickPause();
            var carouselcurrent = $(this).parent().attr('index');
            $('.Lightbox').removeClass('Lightbox--hidden');
            Carousel.prop_lightbox.slickGoTo(carouselcurrent);
          });
        },
        init: function() {
          var propImagesWrap = $('#prop_images');
          var propImages = propImagesWrap.find('>div');
          if(propImages.length < 2){
            //do nothing
            return false;
          }
          //continue to create carousel
          propImages.appendTo('#prop_carousel,#prop_lightbox');

          Carousel.slickLightbox();
          Carousel.slickCarousel();
          //videos
          var prop_videos = $('#prop_videos');
          var prop_videos_data = prop_videos.data('bcvid');
          Carousel.prop_videos_arr = JSON.parse("[" + prop_videos_data + "]");
          //if no videos then do not continue
          if( !prop_videos || !prop_videos_data || !Carousel.prop_videos_arr.length ){
            //bind image clicks now that would have been bound after videos
            Carousel.bindImgClicks();
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
        playersAdded:[],
        addAtIndex:0,
        // onTemplateLoad: function(experienceID) {
        //   console.log("EVENT: onTemplateLoad");
        // },
        onTemplateReady: function(event) {
          //console.log("EVENT.onTemplateReady");
          var experienceID = event.target.experience.id;
          Carousel.player = brightcove.api.getExperience(experienceID);
          Carousel.videoPlayer[experienceID] = Carousel.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
          Carousel.videoPlayer[experienceID].getCurrentVideo(function(video){

            if( Carousel.playersAdded.indexOf(video.id) === -1 ){
              Carousel.prop_carousel.slickAdd("<div id='s_"+video.id+"'><img src='" + video.videoStillURL + "'/></div>", Carousel.addAtIndex, true );
              Carousel.playersAdded.push(video.id);
              Carousel.addAtIndex++;
            }

            if( Carousel.playersAdded.length === Carousel.prop_videos_arr.length ){
            Carousel.prop_carousel.slickPlay();

              Carousel.bindImgClicks();
            }

          });
        },
        hideAndStop: function(active) {
            $.each(Carousel.videoPlayer, function(key,val){
              Carousel.videoPlayer[key].pause();
            });
            // hide the lightbox
            //$("#prop_carousel").attr("class", "playerHide");
            Carousel.prop_carousel.slickPlay();
            $('.Lightbox').addClass('Lightbox--hidden');

        }
    };

    window.Carousel = Carousel;

}(window, jQuery));

Carousel.init();
