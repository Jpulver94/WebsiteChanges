// CSS Menu Load from page 
// djf 5-28-14
//
// use this instead of milonic menu
//
// assumes jquery is loaded 
// UPDATED 11/6/14 TO US A LOAD COMMAND
 function menuload() {
   var OID = document.forms[0].orderno.value  ;
      var pageurl = '?orderno=' + OID + '&LOGINPATH=DL&pageid=31&SUBMITVAR=menuContent.html' ;
  $( "#left_menucontent" ).load( pageurl, function(){
  var $menu = $('#left_menucontent').html();
  $('#nmenu').append($menu);
});
//   $( "#left_menucontent" ).css({'overflow':'scroll'}) ;
 }
$(document).ready(function() { menuload() ; }) ;
