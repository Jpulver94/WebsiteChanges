// Customer Specific Javascript functions 
// djf 5-17-18 - removed salesman logic 
//Added code for new search engine
function SRLineLoad(prodid, aprodno) {
  var ITP = document.forms[0].itemspage.value;
  if (ITP == 1) {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PIFX&APRODNO=' + aprodno + '&PAGEID=31', '#SRBodyLine' + prodid);
    $('#SRBodyLine' + prodid).css({
      'width': '800',
      'height': '960',
      'padding': '10px',
      'float': 'none',
      'border': 'none'
    });
    $('#SRBodyLine' + prodid).removeClass("shadow");
    // hide the bottom nav as well 
    $("#navigation:eq(1)").hide();
  } else {
    // Added Load of product notes 
setTimeout(function() {
    var dummy = widgetload_append_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=NTI&APRODNO=' + aprodno + '&PAGEID=31', '#SRBodyLine' + prodid, function() {});
 }, 1000) ; 
    var dummy = widgetload_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PRCX&APRODNO=' + aprodno + '&PAGEID=31', '#typedivcontainer' + prodid, function() {
    var stksummy = widgetload_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=STKX&APRODNO=' + aprodno + '&PAGEID=31', '#StockContainer' + prodid, function() {});
});
  }
}
function loadcountdown() {
 var cutoffTime = new Date();
 // var offsethrs = "-6" ;
 // var counthrs = "16" ;
 // hardcoded to 6pm EST right now
 // number of hours to offset from UTC
// for your timezone - from parameter now
 cutoffTime.setHours(counthrs);
 cutoffTime.setMinutes(0);
 cutoffTime.setSeconds(0);
var cmsg = "Order Cut Off Time is: " + $.countdown.UTCDate(offsethrs, cutoffTime)
 $('.CutoffMsg').append(cmsg + ' Time Left to Place Your Order Today ') ;
$('#defaultCountdown').countdown({
 until: $.countdown.UTCDate(offsethrs, cutoffTime),
 format: 'HMS', compact: 'true' ,
 });
}
