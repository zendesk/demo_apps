/**
 * Created by DanSun on 11/22/13.
 */
(function(){

return{
//app goes here.
//defaultState: 'spotifyPlayerWidget',
   events: {
       'app.activated': 'renderTrackPlayer'
  
   },
   renderTrackPlayer: function(){
       this.trackOnSelect = {href:"spotify:track:59bJIFhpDqK5pDIDrzRSDp"};
       this.switchTo('spotifyPlayerWidget',{
           trackOnSelect: this.trackOnSelect
       });
   }
};
}());