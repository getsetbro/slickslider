/*!
 * Init Utils
 *
 */

(function(window, $, undefined) {

    var Carousel = {
        //init
        init: function() {
              $('#scroller').slick({
                slidesToShow: 1,
                centerMode: true,
                variableWidth: true
              });
          var playerTemplate = function(videopID){
            return ''+
            '<div class="playerHide" id="bcp_' + videopID + '">' +
            '<object class="BrightcoveExperience" id="bcv_' + videopID + '">'+
            '<param name="bgcolor" value="#000000" />'+
            '<param name="width" value="530" />'+
            '<param name="height" value="300" />'+
            '<param name="isVid" value="true" />'+
            '<param name="isUI" value="true" />'+
            '<param name="dynamicStreaming" value="true" />'+
            '<param name="playerKey" value="AQ~~,AAABZYdAfHk~,rfwhGZGAOzpg9is3SWrPSaKzW3y1dPmF" />'+
            '<param name="playerID" value="3266798266001" />'+
            '<param name="@videoPlayer" value="' + videopID + '"; />'+
            '<param name="includeAPI" value="true" />'+
            //'<param name="templateLoadHandler" value="Carousel.onTemplateLoad" />'+
            '<param name="templateReadyHandler" value="Carousel.onTemplateReady" />'+
            '</object>'+
            '<div class="playerClose" onClick="Carousel.hideAndStop(' + videopID + ');">Close</div>'+
            '</div>';
          };

          $('[data-bcvid]').each( function(index, item){
              $('#players').append( playerTemplate(item.dataset.bcvid) );
          });

          //brightcove.createExperiences();

        },
        player:null,
        APIModules:null,
        videoPlayer:{},
        //onTemplateLoad: function(experienceID) {
          //console.log("EVENT: onTemplateLoad");
        //},
        onTemplateReady: function(event) {
//        console.log("EVENT.onTemplateReady");
          Carousel.player = brightcove.api.getExperience(event.target.experience.id);
          Carousel.videoPlayer[event.target.experience.id] = Carousel.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
          Carousel.videoPlayer[event.target.experience.id].getCurrentVideo(function(video){
            $("#scroller").slickAdd("<div><img src='" + video.videoStillURL + "' onClick='Carousel.showAndLoad(" + video.id + ");'/></div>", true);

          });
        },
        showAndLoad: function(current) {
            //console.log("EVENT.onClick " + current);
            //console.log(videoData.videos[current].shortDescription);
            // reveal the lightbox
            $("#bcp_"+current).attr("class", "playerShow");
            // load and play the selected video
            Carousel.videoPlayer['bcv_' + current].loadVideoByID(current);
        },
        hideAndStop: function(active) {
              console.log(active);
            Carousel.videoPlayer['bcv_' + active].pause();
            // hide the lightbox
            $("#bcp_"+active).attr("class", "playerHide");
        }
    };

    window.Carousel = Carousel;

}(window, jQuery));

Carousel.init();
