/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// JavaScript Document
// Used for External Search Page 
// Hooks Existing Routines for Search Pages 
// var searchmessage = '<br/><img src="images/Product-locator_lng.jpg" width="126" height="14" STYLE="border: none;">';   
var searchmessage = '<br/>';

function fav_template(x) {
    window.alert("Please Login to create a favorites List");
}
//Added code for new search engine externally


function SRLineLoad(prodid, aprodno) {
    var CID = document.forms[0].CustomerId.value;
    var OID = document.forms[0].orderno.value;
    // Added Load of product notes 
    var dummy = widgetload_append_callback(MDSRnUrl + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=NTI&APRODNO=' + aprodno + '&PAGEID=31', '#SRBodyLine' + prodid, function () {});
    var dummy = widgetload_callback(MDSRnUrl + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PRCX&APRODNO=' + aprodno + '&PAGEID=31', '#typedivcontainer' + prodid, function () {
        var aval = '#typedivcontainer' + prodid
        var produm = "EA" ; // hardcode to each for button 
        var pstr = aprodno + "," + produm  ;
        var btext = ' <input type="Button"  title="To order multiple items just enter a quantity in each box below and click Add" height="20px" align="center" value="Add" class="button1 LoginButton" name="' + pstr + '" onclick="javascript:LoginClick(this.name);" >    ' ;      
        var reglink = '<a href="javascript:regme()" > <br> To Order<br> Please Click Here to Create an Account </a>'
          $(aval).append(btext);
    }); // end of call back
}

function SRLineLoad_saved(prodid, aprodno) {
    var aval = '#typedivcontainer' + prodid
    $(aval).html('<a href="javascript:regme()" > Please Click Here to Create an Account <br> and see your price. </a>');
}
//helby link js code
// djf - 8-30-13
// BEGIN GET QUERY STRING CODE


function qrysplit(string, text) {
    if (text.length) {
        name = string.substring(0, string.indexOf(text));
        value = string.substring(string.indexOf(text) + 1);
        eval(name + " = value;");
        // comment the previous line and uncomment this next line if you want to
        // use UNESCAPE, that is, turn %20 into a space, %22 into double quotes, etc.
        // eval("query_" + name + " = unescape(value);");
    }
}

function addfield(Text, Hname, objname) {
    if (testObj(objname)) {
        objname.value = Text;
        return true;
    } else {
        var field = document.createElement("input");
        field.setAttribute("type", "hidden");
        field.setAttribute("value", Text);
        field.setAttribute("name", Hname);
        //add new element to the existing form
        document.forms[0].appendChild(field);
    }
}

function testObj(objToTest) {
    if (objToTest == null || objToTest == undefined) {
        return false;
    }
    return true;
}

function linksetup() {
    weblink = '';
    queryVar = this.location.href;
    var inq = queryVar.indexOf('?');
    queryVar = queryVar.substring(inq + 1);
    queryVar = unescape(queryVar);
    //djf need to unescape value so that & does not get lost
    if (inq > 0) {
        _query_string = queryVar; // full query is also available to body
        var text1 = "&";
        var strLength = queryVar.length,
                txtLength = text1.length;
        var i = queryVar.indexOf(text1);
        while (i + txtLength < strLength) {
            if (i > 0) {
                qrysplit(queryVar.substring(0, i), "=");
            } else {
                qrysplit(queryVar, "=");
            }
            queryVar = queryVar.substring(i + txtLength, strLength);
            var i = queryVar.indexOf(text1);
            if (i < 1) {
                i = strLength + 1;
            }
        }
        qrysplit(queryVar, "="); // last one
        // var CustomerId
        if (weblink !== "" && weblink !== 'undefined') {
            addfield(weblink, "weblink", document.forms[0].weblink);
            var t1 = setTimeout(weblinksearch(weblink), 10);
        }
        ;
    }
}
// Added Web link Code ; 


function weblinksearch(e) {
    showmodalsearch();
    eval(e);
}
$(document).ready(function () {

    linksetup();
    // hide the selection from item search 
    // only show once a search is active 
    $('div[id^="navigation"]').hide();
    $('#docs').hide();
    $('#pcxholder').hide();
    $('#footprintholder').hide();
    $('#SRsortby').hide();
    $('#SRitemsperpage').hide();
    $('#selection').hide();
});

function browsepathG(x, svar) {
    // hide the selection from item search 
    document.forms[0].submitvar.value = svar;
    Manager.store.remove('fq');
    var fq = "searchcat:" + svar.substr(2, svar.length) + "*";
    $.cookie('SearchFilter', fq);
    Manager.doRequest();
    // alert('s1') ;
    var t = setTimeout("showimages()", 1000);
    $('#selection').html('');
}

function browsepath(x, svar) {
    // hide the selection from item search 
    document.forms[0].submitvar.value = svar;
    Manager.store.remove('fq');
    var fq = "searchcat:" + svar.substr(2, svar.length) + "*";
    $.cookie('SearchFilter', fq);
    Manager.doRequest();
    // alert('s1') ;
    var t = setTimeout("showimages()", 1000);
    $('#selection').html('');
}

function FakeSubmit() {
    // alert("Submit Searching...") ;
    // Manager.doRequest(); 
    return false;
}

function showmodalsearch() {
    // alert("Searching...") ;
    Manager.doRequest();
}

function showimages() {
    $("img.lazy").lazyload({
        effect: "fadeIn"
    });
    $('div[id^="navigation"]').show();
    $('#docs').show();
    $(".tab_content").hide();
    $('#Tab2').show(); // show filters
    $('#pcxholder').show();
    $('#footprintholder').show();
    $('#SRsortby').show();
    $('#SRitemsperpage').show();
    $('#slide_holder').hide();
    tsh_hideresults();
}

function TopSearch() {
    //   var values = $('#query').val();
    //   var sval = makesearchfilter(values);
    //   $.cookie('SearchFilter', sval);
    //   Manager.doRequest();
    //   var t = setTimeout("showimages()", 1000);
    PageSearchSetup();
}

function SearchSubmitsm() {
    TopSearch();
    //   var values = $('#query').val();
    //   var sval = makesearchfilter(values);
    //   $.cookie('SearchFilter', sval);
    //   Manager.doRequest();
    //   var t = setTimeout("showimages()", 1000);
}

function trim(myString) {
    return myString.replace(/^s+/g, '').replace(/s+$/g, '');
}

function changepath(x) {
    Manager.doRequest();
}
;

function tsh_hideresults() {
    // alert('hresults') ;
    // Updated to use #SRsearchresults
    if ($.trim($('#SRsearchresults').html()) !== '' || $('#SRsearchresults').html() !== null) {
		var d = new Date();
       // $('#SRsearchresults').html("Your Results returned on " + d.toUTCString() + "<br/>");
        // show content
        $('div[id^="navigation"]').show();
        //  alert('no footprint --'+ checkvar + '--') ;
        $('#docs').show();
        $(".tab_content").hide();
        $('#Tab2').show();
        $('#SRsortby').show();
        $('#SRitemsperpage').show();
        $('#selection').show();
        return;
    }
    if ($.trim($('#footprint').html()) == '' || $('#footprint').html() == null) {
        // show content
        $('div[id^="navigation"]').show();
        //  alert('no footprint --'+ checkvar + '--') ;
        $('#docs').show();
        $(".tab_content").hide();
        $('#Tab2').show();
        $('#SRsortby').show();
        $('#SRitemsperpage').show();
        $('#selection').show();
        return;
    }
    // var SID = document.forms[0].submitvar.value ;
    //  if (SID !== '') {
    //  alert('footprint --'+ checkvar + '--') ;
    $('div[id^="navigation"]').hide();
    $('#docs').hide();
    $(".tab_content").hide();
    $('#Tab1').show(); // Show Categories
    $('#SRsortby').hide();
    $('#SRitemsperpage').hide();
    $('#selection').hide();
    //  }
    // hide content by default
}
/*
 Lazy Load - jQuery plugin for lazy loading images
 */
(function ($, window) {
    var $window = $(window);
    $.fn.lazyload = function (options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "original",
            skip_invisible: true,
            appear: null,
            load: null
        };

        function update() {
            var counter = 0;
            elements.each(function () {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) { /* Nothing. */
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    $this.trigger("appear"); /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }
        if (options) { /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }
            $.extend(settings, options);
        } /* Cache container as jQuery as object. */
        $container = (settings.container === undefined || settings.container === window) ? $window : $(settings.container); /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function (event) {
                return update();
            });
        }
        this.each(function () {
            var self = this;
            var $self = $(self);
            self.loaded = false; /* When appear is triggered load original image. */
            $self.one("appear", function () {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />").bind("load", function () {
                        $self.hide().attr("src", $self.data(settings.data_attribute))[settings.effect](settings.effect_speed);
                        self.loaded = true; /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function (element) {
                            return !element.loaded;
                        });
                        elements = $(temp);
                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                    }).attr("src", $self.data(settings.data_attribute));
                }
            }); /* When wanted event is triggered load original image */
            /* by triggering appear. */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function (event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        }); /* Check if something appears when window is resized. */
        $window.bind("resize", function (event) {
            update();
        }); /* Force initial check if images should appear. */
        $(document).ready(function () {
            update();
            // drawMenus(); // added redraw of milonic menu with new height       
        });
        return this;
    }; /* Convenience methods in jQuery namespace. */
    /* Use as $.belowthefold(element, {threshold : 100, container : window}) */
    $.belowthefold = function (element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.rightoffold = function (element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.abovethetop = function (element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    $.leftofbegin = function (element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    $.inviewport = function (element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    }; /* Custom selectors for your convenience. */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */
    $.extend($.expr[':'], {
        "below-the-fold": function (a) {
            return $.belowthefold(a, {
                threshold: 0
            });
        },
        "above-the-top": function (a) {
            return !$.belowthefold(a, {
                threshold: 0
            });
        },
        "right-of-screen": function (a) {
            return $.rightoffold(a, {
                threshold: 0
            });
        },
        "left-of-screen": function (a) {
            return !$.rightoffold(a, {
                threshold: 0
            });
        },
        "in-viewport": function (a) {
            return $.inviewport(a, {
                threshold: 0
            });
        },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function (a) {
            return !$.belowthefold(a, {
                threshold: 0
            });
        },
        "right-of-fold": function (a) {
            return $.rightoffold(a, {
                threshold: 0
            });
        },
        "left-of-fold": function (a) {
            return !$.rightoffold(a, {
                threshold: 0
            });
        }
    });
})(jQuery, window);
// ADDED CLASS CALLED LAZY and loaded it.. 
$(document).ready(function () {
    $('img.lazy').load(function () {
        // if(!console) { console={};
        // console.log($(this).attr('src') + ' loaded');
        // }
        var src = $(this).attr('src').split('/');
        var file = src[src.length - 1];
        // if(!console) { console={};
        // console.log(file + ' parsed');
        // }
        // if (file != "spacer.gif") {
        var dataval = $(this).attr('rel')
        eval(dataval);
        // if(!console) { console={};
        // console.log(dataval + ' loaded');
        // }
        // }
    });
    $("img.lazy").lazyload({
        effect: "fadeIn"
    });
});
(function ($) {
    $.cookie = function (key, value, options) {
        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);
            if (value === null || value === undefined) {
                options.expires = -1;
            }
            if (typeof options.expires === 'number') {
                var days = options.expires,
                        t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }
            value = String(value);
            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
        }
        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ?
                function (s) {
                    return s;
                } : decodeURIComponent;
        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key)
                return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);

function process_order(popup) {
    var t = setTimeout("showimages()", 1000);
    return true;
}

function PageSearchSetup(values) {
    // had issues passing values so just check all variables.
    if ($("#query").length > 0) {
        fqval = makesearchfilter($("#query").val());
    } else {
        if ($("#queryother").length > 0) {
            fqval = makesearchfilter($("#queryother").val());
        } else {
            // no value to search so return
            return;
        }
        ;
    }
    ;
    $.cookie('SearchFilter', fqval);
    // save the data as a cookie - then just call the dorequest from the weblink. 
    var pathname = window.location.pathname;
    nhref = pathname + '?weblink=PageSearch()';
    window.location.replace(nhref);
}

function PageSearch() {
    // $('#slide_holder').hide();
    // $('#bigads').hide();
    makesearch();
    Manager.doRequest();
    var t = setTimeout("showimages()", 1000);
    var x = setTimeout("hidesearch()", 1000);
}

function makesearch() {
    if ($("#mask").length < 1) {
        makediv("mask")
    }
    if ($("#SLoader").length < 1) {
        makediv("SLoader")
    }
    var b = $(document).height();
    var d = $(window).width();
    $("#mask").css({
        width: d,
        height: b,
        position: "absolute",
        left: "0",
        top: "0",
        "z-index": "9000",
        "background-color": "#000",
        display: "none"
    });
    $("#mask").fadeIn(1000);
    $("#mask").fadeTo("slow", 0.8);
    var c = $(window).height();
    var a = $(window).width();
    $("#SLoader").css({
        width: "500px",
        height: "260px",
        padding: "10px",
        background: "url(images/ajax-loader.gif) no-repeat top center"
    });
    $("#SLoader").css({
        display: "none",
        "z-index": "9999",
        position: "absolute",
        color: "white"
    });
    $("#SLoader").html("<br><br><br><br><h1>Now searching for your products...</h1>");
    $("#SLoader").css("top", c / 2 - $("#SLoader").height() / 2);
    $("#SLoader").css("left", a / 2 - $("#SLoader").width() / 2);
    $("#SLoader").fadeIn(2000)
}

function hidesearch() {
    $("#SLoader").fadeOut(100);
    $("#mask").hide()
}

function tdate() {
    var now = new Date(),
            now = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    return now;
}

function setsearch(aprodno) {
    if ($("#query").length > 0) {
        $("#query").val(aprodno);
    } else {
        if ($("#queryother").length > 0) {
            $("#queryother").val(aprodno);
        } else {
            // no value to update so return
            // ; 
        }
        ;
    }
    ;
    PageSearchSetup(aprodno)
}
// added hook for autocomplete widget used with page search
AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({
    beforeRequest: function () {},
    afterRequest: function () {
        $(this.target).find('input').unbind().removeData('events').val('');
        var self = this;
        var callback = function (response) {
            var list = [];
            for (var i = 0; i < self.fields.length; i++) {
                var field = self.fields[i];
                for (var facet in response.facet_counts.facet_fields[field]) {
                    list.push({
                        field: field,
                        value: facet,
                        text: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ')'
                    });
                }
            }
            self.requestSent = false;
            $(self.target).find('input').unautocomplete().autocomplete(list, {
                formatItem: function (facet) {
                    return facet.text;
                }
            }).result(function (e, facet) {
                self.requestSent = true;
                PageSearchSetup();
            });
            // This has lower priority so that requestSent is set.
            $(self.target).find('input').bind('keydown', function (e) {
                if (self.requestSent === false && e.which == 13) {
                    var value = $(this).val();
                    PageSearchSetup();
                }
            });
        } // end callback
        var params = ['rows=0&facet=true&facet.limit=25000&facet.mincount=1&json.nl=map'];
        for (var i = 0; i < this.fields.length; i++) {
            params.push('facet.field=' + this.fields[i]);
        }
        params.push('q=' + this.manager.store.get('q').val());
        jQuery.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
    }
});
// end added hook


function loadvalues() {
    // does nothing for the external site 
}

function AddSearchItem(aprodno) {
    var xlink = 'browsepathG("||' + aprodno + '")'
    addfield(xlink, "weblink", document.login.weblink);
    showloginform();
}

function showloginform() {
    if ($("#mask").length < 1) {
        // need to create div 
        makediv("mask");
    }
    if ($("#bdialog").length < 1) {
        // need to create div 
        makediv("bdialog");
    }
    //if mask is clicked
    $('#mask').click(function () {
        $(this).hide();
        $('#bdialog').hide();
    });
    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();
    $('#bdialog').css({
        'width': '800px',
        'height': '580px',
        'padding': '10px',
        'background': 'white',
        'display': 'none',
        'z-index': '9999',
        'position': 'absolute',
        'color': 'black',
        'font-family': 'verdana',
        'font-size': '15px'
    });
    //Set the popup window to center
    $('#bdialog').css('top', winH / 2 - $('#bdialog').height() / 2);
    $('#bdialog').css('left', winW / 2 - $('#bdialog').width() / 2);
    //Set heigth and width to mask to fill up the whole screen
    //	$('#mask').css({'width':maskWidth,'height':maskHeight});
    $('#mask').css({
        'width': maskWidth,
        'height': maskHeight,
        'position': 'absolute',
        'left': '0',
        'top': '0',
        'z-index': '9000',
        'background-color': '#000',
        'display': 'none'
    });
    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow", 0.8);
    $('#bdialog').html(' <br> <h1> Login Form </h1> <br> <br> ');
    $('#bdialog').append($('#popup').html());
    $('#bdialog').append(' <br>  <br> <br/> <div id="bcbutton" class=button1> Click here to close </div> ');
    $('#bdialog').fadeIn(2000);
    $('#bcbutton').click(function (e) {
        //Cancel the link behavior
        // e.preventDefault();
        $('#mask').hide();
        $('#bdialog').hide();
    });
}
//function PCXLineLoad(docid) {
// PCXLineLoad
//}


function PCXLineLoad(prodid) {
    var CID = document.forms[0].CustomerId.value;
    var OID = document.forms[0].orderno.value;
    var SID = document.forms[0].submitvar.value;
    //   var SFlag = document.forms[0].searchflag.value;
    lp = "BRX";
    if (SID !== '') {
        var dummy = widgetload(MDSRnUrl + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=FTX&PAGEID=31&TARGETVAL=' + SID, '#footprintholder');
        data_array = string_decode(SID);
        if (typeof data_array[2] !== 'undefined' && data_array[2] !== null) {
            lp = "BRCX"
        }
        ;
        if (typeof data_array[3] !== 'undefined' && data_array[3] !== null) {
            lp = "BRSX"
        }
        ;
        if (typeof data_array[4] !== 'undefined' && data_array[4] !== null) {
            lp = "BRSCX"
        }
        ;
        if (typeof data_array[5] !== 'undefined' && data_array[4] !== null) {
            lp = "BRSCX";
            SID = "||||||"
        }
        ;
        var dummy = widgetload(MDSRnUrl + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=' + lp + '&PAGEID=31&SUBMITVAR=' + SID, '#pcxholder');
    } else {
        // check if no key word search is active if not display web types 
        // UPDATED 1/27/14 - don't show types as they will have a banner active now 
        // if (SFlag == 'Y'){
        //    var dummy = widgetload_line('login725D?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=' + lp + '&PAGEID=31&SUBMITVAR=' + SID ,'#pcxholder');
        //  }
        //   var t=setTimeout("showimages()",1000);
    }
}

function menuload() {
    return ; // short circuited b/c of CORS issues 
    var pageurl = MDSTemplateURL + 'menuContent.html';
    $("#left_menucontent").load(pageurl);
    //   $( "#left_menucontent" ).css({'overflow':'scroll'}) ;
}
$(document).ready(function () {
    var t = setTimeout("loadq()", 1000);
    menuload();
});
//added registration popup


function regme() {
    var CID = document.forms[0].CustomerId.value;
    var parms = MDSRnUrl + '?LOGINPATH=REG&PAGEID=31&CUSTOMERID=' + CID;
    //  showmodalrnpopup_persist(parms) ;
    window.open(parms);
}

function prod_inquiry(a, b, prodno) {
   var CID = document.forms[0].CustomerId.value;
    var parms = '?LOGINPATH=PIF&PAGEID=31&CUSTOMERID=' + CID + '&APRODNO=' + prodno;
   showmodalrnpopup(parms)
}

function loadspecials() {}
AjaxSolr.theme.prototype.no_items_found = function () {
    var no_msg = "<br>Unfortunately our search was unable to find any results. Please try a new search.";
    //var no_msg = "<br><br> Product not found. Try another search or contact Dove customer service at 336-643-9367 and we will find it for you!"
    var no_msg = no_msg + '<br> <div id="DISCContent"> </div>';
    //   'We are sorry, There were no items found using your current selection criteria <br> Please try a new search <div id="DISCContent"> </div>';
    var fq = $.cookie('SearchFilter') || '';
    var fqarray = fq.split(":");
    var fname = fqarray[0];
    var fval = fqarray[1];
    var str = fval;
    if (str.indexOf(")") > 0) {
        var result = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
    } else {
        result = fname + " " + str;
    }
    var fval = result;
    //  var parms = document.getElementById("toplogin").action + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=DISC&pageid=31&APRODNO=' + fval;
    // var parms = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=DISC&pageid=31&APRODNO=' + fval;
    //  var t1 = setTimeout(widgetload(parms, '#DISCContent'), 500);
    return no_msg;
};

function showmodalrnpopup(parms) {
    parms = MDSRnUrl + parms;
    // Check Existence of Mask and Dialog 
    if ($("#mask").length < 1) {
        // need to create div 
        makediv("mask");
    }
    if ($("#SessLoader").length < 1) {
        // need to create div 
        makediv("SessLoader");
    }
    //Get the screen height and width  
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    //Set heigth and width to mask to fill up the whole screen  
    $('#mask').css({
        'width': maskWidth,
        'height': maskHeight,
        'position': 'absolute',
        'left': '0',
        'top': '0',
        'z-index': '9000',
        'background-color': '#000',
        'display': 'none'
    });
    //transition effect   
    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow", 0.8);
    //Get the window height and width  
    var winH = $(document).height();
    var winW = $(window).width();
    //Set the popup window to center  
    $('#SessLoader').css({
        'width': 'auto',
        'height': 'auto',
        'padding': '20px',
        'background': 'white'
    });
    // $('#SessLoader').css({'width':'530px','height':'300px','padding':'0px','background': 'white'});
    // Added Rounded corders - djf 6-28-13
    $('#SessLoader').css({
        '-webkit-border-radius': '50px',
        '-moz-border-radius': '50px',
        'border-radius': '50px',
        'border': '2px solid #363600',
        'background-color': '#FFFFFF',
        '-webkit-box-shadow': '#CCCCCC 10px 10px 10px',
        '-moz-box-shadow': '#CCCCCC 10px 10px 10px',
        'box-shadow': '#CCCCCC 10px 10px 10px'
    });
    $('#SessLoader').css({
        'display': 'none',
        'z-index': '9999',
        'position': 'absolute',
        'color': 'black'
    });
    $('#SessLoader').html('<div style="font-family:arial;font-size:20px;"> <div style=float:right> <img src="' + image_url + 'close_pop.png" style="padding-right: 33px;" > </div> </div> <div id="SessContent"> </div> ');
    $('#SessLoader').css({
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'margin-top': '-250px',
        'margin-left': '-130px'
    });
    var dummy = widgetload(parms, '#SessContent');
    //transition effect  
    $('#SessLoader').fadeIn(2000);
    //if clicked hide
    $('#SessLoader').click(function () {
        $(this).hide();
        $('#mask').fadeOut(1000)
    });
}
//end added generic popup


function updatesort() {
    // Added options to read/set rows and sort 
    var items = $("select[name='itemspage']").val();
    $("input[name='itemspage']").val(items);
    var sort_field = $("select[name='Changesort']").val();
    $("input[name='Changesort']").val(sort_field);
    Manager.doRequest();
    var t = setTimeout("showimages()", 1000);
}

function loadq() {
    var fq = Manager.store.values('fq');
    var qstr = '';
    for (var i = 0, l = fq.length; i < l; i++) {
        var fqarray = fq[i].split(":");
        var fname = fqarray[0];
        var fval = fqarray[1];
        var str = fval;
        if (str.indexOf(")") > 0) {
            var result = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
        } else {
            result = " " + str;
            //      result = fname + " " + str ;
        }
        var fval = result;
        var qstr = qstr + " " + fval;
    }
    var qstr = qstr.replace(/\*/gi, "");
    var qstr = qstr.replace(/\\/gi, "");
    var qstr = qstr.replace(/AND/gi, "");
    $("#queryother").val(qstr);
}

function Add_To_Order() {
    Manager.doRequest();
}

function makesearchfilter(values) {
    // clean up values from automcomplete with (xx) at the end of the string 
    // var values = values.split('(')[0]  ;
    if (values) {
        if (values.lastIndexOf("(") > 0) {
            ;
            var values = values.substr(0, values.lastIndexOf('('));
        }
        // REMOVE all the extra whitespaces 
        var values = values.replace(/\s{2,}/g, ' ');
        var curval = 'allText:(';
        var pval = ' OR aprodno:(';
        var cival = ' OR citems:(';
        if (mastcust !== '') {
            var cmval = ' OR citems:(';
        } else {
            var cmval = '';
        }
        var rfqarray = values.split(" "); // each word gets added
        var fqarray = [];
        // clean up values in array if only one - don't loop  
        for (var i = 0; i < rfqarray.length; i++) {
            fqvalx = AjaxSolr.Parameter.CleanValue(rfqarray[i])
            if (fqvalx !== '') {
                fqarray.push(rfqarray[i]);
            }
        }
        var fcnt = fqarray.length - 1
        if (fcnt > 0) {
            for (var i = 0; i < fcnt; i++) {
                var fqvalx = AjaxSolr.Parameter.CleanValue(fqarray[i]);
                // fqarray[i] = fqarray[i].replace(/\s+/g, '');     // removed blank spaces
                if (fqvalx !== '') {
                    // solr doesn't do containing so add the * to the end for beginning with 
                    curval += '*' + fqvalx + '*' + ' AND ';
                    pval += '*' + fqvalx + '*' + ' AND ';
                    cival += intcust + '\\*' + fqvalx + '*' + ' AND ';
                    if (mastcust !== '') {
                        cmval += mastcust + '\\*' + fqvalx + '*' + ' AND ';
                    }
                }
            }
            // add last value for each part of query
            var fqvalx = AjaxSolr.Parameter.CleanValue(fqarray[fcnt]);
            if (fqvalx !== '') {
                curval += '*' + fqvalx + '*' + ')';
                pval += '*' + fqvalx + '*' + ')';
                cival += intcust + '\\*' + fqvalx + '*' + ')';
                if (mastcust !== '') {
                    cmval += mastcust + '\\*' + fqvalx + '*' + ')';
                }
            } else {
                curval += ')';
                pval += ')';
                cival += ')';
                if (mastcust !== '') {
                    cmval += ')';
                }
            }
        } else {
            // for single item in search 
            var fqvalx = AjaxSolr.Parameter.CleanValue(fqarray[fcnt]);
            if (fqvalx !== '') {
                curval += '*' + fqvalx + '*' + ')';
                pval += '*' + fqvalx + '*' + ')';
                cival += intcust + '\\*' + fqvalx + '*' + ')';
                if (mastcust !== '') {
                    cmval += mastcust + '\\*' + fqvalx + '*' + ')';
                }
            }
        }
        sval = curval + pval + cival + cmval;
        // added customer history search
        var shist = $("#shistflag").is(':checked');
        if (shist) {
            var sval = '(' + sval + ') AND ( (customers:' + intcust + ') )';
        }
        return sval
    }
}
AjaxSolr.Parameter.CleanValue = function (value) {
    if (value) {
        var value = value.replace(/\s+/g, ''); // GET RID of blank spaces 
        //    var value = value.replace(/[\|&;\$%@"<>\(\)\+,]/g, "");
        var badchars = '+-&!(){}[]^"*?:';
        value = addcslashes(value, badchars);
    }
    return value;
}


//  Added Carousel for Popular and Featured Products 
/**
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */
eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return(c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--)
            r[e(c)] = k[c] || e(c);
        k = [function (e) {
                return r[e]
            }];
        e = function () {
            return'\\w+'
        };
        c = 1
    }
    ;
    while (c--)
        if (k[c])
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(9($){$.1v.C=9(o){z 4.1b(9(){3p r(4,o)})};8 q={Z:F,25:1,21:1,u:7,1c:3,15:7,1K:\'2X\',2c:\'2Q\',1q:0,B:7,1j:7,1G:7,2F:7,2B:7,2z:7,2x:7,2v:7,2s:7,2p:7,1S:\'<P></P>\',1Q:\'<P></P>\',2m:\'2l\',2k:\'2l\',1O:7,1L:7};$.C=9(e,o){4.5=$.16({},q,o||{});4.Q=F;4.D=7;4.H=7;4.t=7;4.U=7;4.R=7;4.N=!4.5.Z?\'1H\':\'26\';4.E=!4.5.Z?\'24\':\'23\';8 a=\'\',1e=e.K.1e(\' \');1r(8 i=0;i<1e.I;i++){6(1e[i].2y(\'C-2w\')!=-1){$(e).1E(1e[i]);8 a=1e[i];1p}}6(e.2t==\'3o\'||e.2t==\'3n\'){4.t=$(e);4.D=4.t.19();6(4.D.1o(\'C-H\')){6(!4.D.19().1o(\'C-D\'))4.D=4.D.B(\'<P></P>\');4.D=4.D.19()}10 6(!4.D.1o(\'C-D\'))4.D=4.t.B(\'<P></P>\').19()}10{4.D=$(e);4.t=$(e).3h(\'>2o,>2n,P>2o,P>2n\')}6(a!=\'\'&&4.D.19()[0].K.2y(\'C-2w\')==-1)4.D.B(\'<P 3g=" \'+a+\'"></P>\');4.H=4.t.19();6(!4.H.I||!4.H.1o(\'C-H\'))4.H=4.t.B(\'<P></P>\').19();4.R=$(\'.C-11\',4.D);6(4.R.u()==0&&4.5.1Q!=7)4.R=4.H.1z(4.5.1Q).11();4.R.V(4.K(\'C-11\'));4.U=$(\'.C-17\',4.D);6(4.U.u()==0&&4.5.1S!=7)4.U=4.H.1z(4.5.1S).11();4.U.V(4.K(\'C-17\'));4.H.V(4.K(\'C-H\'));4.t.V(4.K(\'C-t\'));4.D.V(4.K(\'C-D\'));8 b=4.5.15!=7?1k.1P(4.1m()/4.5.15):7;8 c=4.t.32(\'1F\');8 d=4;6(c.u()>0){8 f=0,i=4.5.21;c.1b(9(){d.1I(4,i++);f+=d.S(4,b)});4.t.y(4.N,f+\'T\');6(!o||o.u===J)4.5.u=c.u()}4.D.y(\'1y\',\'1A\');4.U.y(\'1y\',\'1A\');4.R.y(\'1y\',\'1A\');4.2G=9(){d.17()};4.2b=9(){d.11()};4.1U=9(){d.2q()};6(4.5.1j!=7)4.5.1j(4,\'2a\');6($.2A.28){4.1f(F,F);$(27).1u(\'2I\',9(){d.1t()})}10 4.1t()};8 r=$.C;r.1v=r.2H={C:\'0.2.3\'};r.1v.16=r.16=$.16;r.1v.16({1t:9(){4.A=7;4.G=7;4.X=7;4.13=7;4.14=F;4.1d=7;4.O=7;4.W=F;6(4.Q)z;4.t.y(4.E,4.1s(4.5.21)+\'T\');8 p=4.1s(4.5.25);4.X=4.13=7;4.1i(p,F);$(27).22(\'2E\',4.1U).1u(\'2E\',4.1U)},2D:9(){4.t.2C();4.t.y(4.E,\'3u\');4.t.y(4.N,\'3t\');6(4.5.1j!=7)4.5.1j(4,\'2D\');4.1t()},2q:9(){6(4.O!=7&&4.W)4.t.y(4.E,r.M(4.t.y(4.E))+4.O);4.O=7;4.W=F;6(4.5.1G!=7)4.5.1G(4);6(4.5.15!=7){8 a=4;8 b=1k.1P(4.1m()/4.5.15),N=0,E=0;$(\'1F\',4.t).1b(9(i){N+=a.S(4,b);6(i+1<a.A)E=N});4.t.y(4.N,N+\'T\');4.t.y(4.E,-E+\'T\')}4.1c(4.A,F)},3s:9(){4.Q=1h;4.1f()},3r:9(){4.Q=F;4.1f()},u:9(s){6(s!=J){4.5.u=s;6(!4.Q)4.1f()}z 4.5.u},3q:9(i,a){6(a==J||!a)a=i;6(4.5.u!==7&&a>4.5.u)a=4.5.u;1r(8 j=i;j<=a;j++){8 e=4.L(j);6(!e.I||e.1o(\'C-1a-1D\'))z F}z 1h},L:9(i){z $(\'.C-1a-\'+i,4.t)},2u:9(i,s){8 e=4.L(i),20=0,2u=0;6(e.I==0){8 c,e=4.1B(i),j=r.M(i);1n(c=4.L(--j)){6(j<=0||c.I){j<=0?4.t.2r(e):c.1X(e);1p}}}10 20=4.S(e);e.1E(4.K(\'C-1a-1D\'));1R s==\'3l\'?e.3k(s):e.2C().3j(s);8 a=4.5.15!=7?1k.1P(4.1m()/4.5.15):7;8 b=4.S(e,a)-20;6(i>0&&i<4.A)4.t.y(4.E,r.M(4.t.y(4.E))-b+\'T\');4.t.y(4.N,r.M(4.t.y(4.N))+b+\'T\');z e},1V:9(i){8 e=4.L(i);6(!e.I||(i>=4.A&&i<=4.G))z;8 d=4.S(e);6(i<4.A)4.t.y(4.E,r.M(4.t.y(4.E))+d+\'T\');e.1V();4.t.y(4.N,r.M(4.t.y(4.N))-d+\'T\')},17:9(){4.1C();6(4.O!=7&&!4.W)4.1T(F);10 4.1c(((4.5.B==\'1Z\'||4.5.B==\'G\')&&4.5.u!=7&&4.G==4.5.u)?1:4.A+4.5.1c)},11:9(){4.1C();6(4.O!=7&&4.W)4.1T(1h);10 4.1c(((4.5.B==\'1Z\'||4.5.B==\'A\')&&4.5.u!=7&&4.A==1)?4.5.u:4.A-4.5.1c)},1T:9(b){6(4.Q||4.14||!4.O)z;8 a=r.M(4.t.y(4.E));!b?a-=4.O:a+=4.O;4.W=!b;4.X=4.A;4.13=4.G;4.1i(a)},1c:9(i,a){6(4.Q||4.14)z;4.1i(4.1s(i),a)},1s:9(i){6(4.Q||4.14)z;6(4.5.B!=\'18\')i=i<1?1:(4.5.u&&i>4.5.u?4.5.u:i);8 a=4.A>i;8 b=r.M(4.t.y(4.E));8 f=4.5.B!=\'18\'&&4.A<=1?1:4.A;8 c=a?4.L(f):4.L(4.G);8 j=a?f:f-1;8 e=7,l=0,p=F,d=0;1n(a?--j>=i:++j<i){e=4.L(j);p=!e.I;6(e.I==0){e=4.1B(j).V(4.K(\'C-1a-1D\'));c[a?\'1z\':\'1X\'](e)}c=e;d=4.S(e);6(p)l+=d;6(4.A!=7&&(4.5.B==\'18\'||(j>=1&&(4.5.u==7||j<=4.5.u))))b=a?b+d:b-d}8 g=4.1m();8 h=[];8 k=0,j=i,v=0;8 c=4.L(i-1);1n(++k){e=4.L(j);p=!e.I;6(e.I==0){e=4.1B(j).V(4.K(\'C-1a-1D\'));c.I==0?4.t.2r(e):c[a?\'1z\':\'1X\'](e)}c=e;8 d=4.S(e);6(d==0){3f(\'3e: 3d 1H/26 3c 1r 3b. 3a 39 38 37 36 35. 34...\');z 0}6(4.5.B!=\'18\'&&4.5.u!==7&&j>4.5.u)h.33(e);10 6(p)l+=d;v+=d;6(v>=g)1p;j++}1r(8 x=0;x<h.I;x++)h[x].1V();6(l>0){4.t.y(4.N,4.S(4.t)+l+\'T\');6(a){b-=l;4.t.y(4.E,r.M(4.t.y(4.E))-l+\'T\')}}8 n=i+k-1;6(4.5.B!=\'18\'&&4.5.u&&n>4.5.u)n=4.5.u;6(j>n){k=0,j=n,v=0;1n(++k){8 e=4.L(j--);6(!e.I)1p;v+=4.S(e);6(v>=g)1p}}8 o=n-k+1;6(4.5.B!=\'18\'&&o<1)o=1;6(4.W&&a){b+=4.O;4.W=F}4.O=7;6(4.5.B!=\'18\'&&n==4.5.u&&(n-k+1)>=1){8 m=r.Y(4.L(n),!4.5.Z?\'1l\':\'1N\');6((v-m)>g)4.O=v-g-m}1n(i-->o)b+=4.S(4.L(i));4.X=4.A;4.13=4.G;4.A=o;4.G=n;z b},1i:9(p,a){6(4.Q||4.14)z;4.14=1h;8 b=4;8 c=9(){b.14=F;6(p==0)b.t.y(b.E,0);6(b.5.B==\'1Z\'||b.5.B==\'G\'||b.5.u==7||b.G<b.5.u)b.2j();b.1f();b.1M(\'2i\')};4.1M(\'31\');6(!4.5.1K||a==F){4.t.y(4.E,p+\'T\');c()}10{8 o=!4.5.Z?{\'24\':p}:{\'23\':p};4.t.1i(o,4.5.1K,4.5.2c,c)}},2j:9(s){6(s!=J)4.5.1q=s;6(4.5.1q==0)z 4.1C();6(4.1d!=7)z;8 a=4;4.1d=30(9(){a.17()},4.5.1q*2Z)},1C:9(){6(4.1d==7)z;2Y(4.1d);4.1d=7},1f:9(n,p){6(n==J||n==7){8 n=!4.Q&&4.5.u!==0&&((4.5.B&&4.5.B!=\'A\')||4.5.u==7||4.G<4.5.u);6(!4.Q&&(!4.5.B||4.5.B==\'A\')&&4.5.u!=7&&4.G>=4.5.u)n=4.O!=7&&!4.W}6(p==J||p==7){8 p=!4.Q&&4.5.u!==0&&((4.5.B&&4.5.B!=\'G\')||4.A>1);6(!4.Q&&(!4.5.B||4.5.B==\'G\')&&4.5.u!=7&&4.A==1)p=4.O!=7&&4.W}8 a=4;4.U[n?\'1u\':\'22\'](4.5.2m,4.2G)[n?\'1E\':\'V\'](4.K(\'C-17-1w\')).1J(\'1w\',n?F:1h);4.R[p?\'1u\':\'22\'](4.5.2k,4.2b)[p?\'1E\':\'V\'](4.K(\'C-11-1w\')).1J(\'1w\',p?F:1h);6(4.U.I>0&&(4.U[0].1g==J||4.U[0].1g!=n)&&4.5.1O!=7){4.U.1b(9(){a.5.1O(a,4,n)});4.U[0].1g=n}6(4.R.I>0&&(4.R[0].1g==J||4.R[0].1g!=p)&&4.5.1L!=7){4.R.1b(9(){a.5.1L(a,4,p)});4.R[0].1g=p}},1M:9(a){8 b=4.X==7?\'2a\':(4.X<4.A?\'17\':\'11\');4.12(\'2F\',a,b);6(4.X!==4.A){4.12(\'2B\',a,b,4.A);4.12(\'2z\',a,b,4.X)}6(4.13!==4.G){4.12(\'2x\',a,b,4.G);4.12(\'2v\',a,b,4.13)}4.12(\'2s\',a,b,4.A,4.G,4.X,4.13);4.12(\'2p\',a,b,4.X,4.13,4.A,4.G)},12:9(a,b,c,d,e,f,g){6(4.5[a]==J||(1R 4.5[a]!=\'2h\'&&b!=\'2i\'))z;8 h=1R 4.5[a]==\'2h\'?4.5[a][b]:4.5[a];6(!$.2W(h))z;8 j=4;6(d===J)h(j,c,b);10 6(e===J)4.L(d).1b(9(){h(j,4,d,c,b)});10{1r(8 i=d;i<=e;i++)6(i!==7&&!(i>=f&&i<=g))4.L(i).1b(9(){h(j,4,i,c,b)})}},1B:9(i){z 4.1I(\'<1F></1F>\',i)},1I:9(e,i){8 a=$(e).V(4.K(\'C-1a\')).V(4.K(\'C-1a-\'+i));a.1J(\'2V\',i);z a},K:9(c){z c+\' \'+c+(!4.5.Z?\'-2U\':\'-Z\')},S:9(e,d){8 a=e.2g!=J?e[0]:e;8 b=!4.5.Z?a.1x+r.Y(a,\'2f\')+r.Y(a,\'1l\'):a.2e+r.Y(a,\'2d\')+r.Y(a,\'1N\');6(d==J||b==d)z b;8 w=!4.5.Z?d-r.Y(a,\'2f\')-r.Y(a,\'1l\'):d-r.Y(a,\'2d\')-r.Y(a,\'1N\');$(a).y(4.N,w+\'T\');z 4.S(a)},1m:9(){z!4.5.Z?4.H[0].1x-r.M(4.H.y(\'2T\'))-r.M(4.H.y(\'2S\')):4.H[0].2e-r.M(4.H.y(\'2R\'))-r.M(4.H.y(\'3i\'))},2P:9(i,s){6(s==J)s=4.5.u;z 1k.2O((((i-1)/s)-1k.2N((i-1)/s))*s)+1}});r.16({3m:9(d){z $.16(q,d||{})},Y:9(e,p){6(!e)z 0;8 a=e.2g!=J?e[0]:e;6(p==\'1l\'&&$.2A.28){8 b={\'1y\':\'1A\',\'2M\':\'2L\',\'1H\':\'1q\'},1Y,1W;$.29(a,b,9(){1Y=a.1x});b[\'1l\']=0;$.29(a,b,9(){1W=a.1x});z 1W-1Y}z r.M($.y(a,p))},M:9(v){v=2K(v);z 2J(v)?0:v}})})(3v);', 62, 218, '||||this|options|if|null|var|function||||||||||||||||||||list|size||||css|return|first|wrap|jcarousel|container|lt|false|last|clip|length|undefined|className|get|intval|wh|tail|div|locked|buttonPrev|dimension|px|buttonNext|addClass|inTail|prevFirst|margin|vertical|else|prev|callback|prevLast|animating|visible|extend|next|circular|parent|item|each|scroll|timer|split|buttons|jcarouselstate|true|animate|initCallback|Math|marginRight|clipping|while|hasClass|break|auto|for|pos|setup|bind|fn|disabled|offsetWidth|display|before|block|create|stopAuto|placeholder|removeClass|li|reloadCallback|width|format|attr|animation|buttonPrevCallback|notify|marginBottom|buttonNextCallback|ceil|buttonPrevHTML|typeof|buttonNextHTML|scrollTail|funcResize|remove|oWidth2|after|oWidth|both|old|offset|unbind|top|left|start|height|window|safari|swap|init|funcPrev|easing|marginTop|offsetHeight|marginLeft|jquery|object|onAfterAnimation|startAuto|buttonPrevEvent|click|buttonNextEvent|ol|ul|itemVisibleOutCallback|reload|prepend|itemVisibleInCallback|nodeName|add|itemLastOutCallback|skin|itemLastInCallback|indexOf|itemFirstOutCallback|browser|itemFirstInCallback|empty|reset|resize|itemLoadCallback|funcNext|prototype|load|isNaN|parseInt|none|float|floor|round|index|swing|borderTopWidth|borderRightWidth|borderLeftWidth|horizontal|jcarouselindex|isFunction|normal|clearTimeout|1000|setTimeout|onBeforeAnimation|children|push|Aborting|loop|infinite|an|cause|will|This|items|set|No|jCarousel|alert|class|find|borderBottomWidth|append|html|string|defaults|OL|UL|new|has|unlock|lock|10px|0px|jQuery'.split('|'), 0, {}))

function mycarousel_initCallback(carousel)
{
    carousel.buttonNext.bind('click', function () {
        carousel.startAuto(0);
    });

    carousel.buttonPrev.bind('click', function () {
        carousel.startAuto(0);
    });

    // Pause autoscrolling if the user moves with the cursor over the clip.
    carousel.clip.hover(function () {
        carousel.stopAuto();
    }, function () {
        carousel.startAuto();
    });
    // carousel.scroll(carousel.first);
    //carousel.reload();
    // carousel.reset();
    // carousel.size(2) ;
    // carousel.reload();
}
;

jQuery(document).ready(function () {
	if (('#mycarousel').length) {  
// load popuplar products and convert into jcarousel
    var carousel_autoplay = 2;
    var carousel_items_visible = 2;
    var carousel_scroll = 1;
    jQuery.ajax({
        type: "POST",
        url: MDSRnUrl,
        data: "ORDERNO=888888&PAGEID=31&LOGINPATH=DL&SUBMITVAR=WEBPROD.HTM",
        dataType: "html",
        success: function (data) {
            $('#homecarousel').append(data);
            // alert('Load was performed.');
            jQuery('#mycarousel').jcarousel({
                auto: carousel_autoplay,
                wrap: 'last',
                visible: carousel_items_visible,
                scroll: carousel_scroll,
                initCallback: mycarousel_initCallback
            });
        }
    });
	}
// Load featured products 
if (('#featured-products_block_center').length) {  
    jQuery.ajax({
        type: "POST",
        url: MDSRnUrl,
        data: "ORDERNO=888888&PAGEID=31&LOGINPATH=DL&SUBMITVAR=WEBFEATURE.HTM",
        dataType: "html",
        success: function (data) {
            $('#featured-products_block_center').append(data);
            // alert('Load was performed.');
        }
    });
}
if (('#left_menucontent').length) {  
    jQuery.ajax({
        type: "POST",
        url: MDSRnUrl,
        data: "ORDERNO=888888&PAGEID=31&LOGINPATH=DL&SUBMITVAR=menuContent.html",
        dataType: "html",
        success: function (data) {
            $('#left_menucontent').html(data);
            // alert('Load was performed.');
        }
    });
}
});

/*
 * jQuery Nivo Slider v2.4
 * http://nivo.dev7studios.com
 *
 * Copyright 2011, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function (a) {
    var A = function (s, v) {
        var f = a.extend({}, a.fn.nivoSlider.defaults, v), g = {currentSlide: 0, currentImage: "", totalSlides: 0, randAnim: "", running: false, paused: false, stop: false}, e = a(s);
        e.data("nivo:vars", g);
        e.css("position", "relative");
        e.addClass("nivoSlider");
        var j = e.children();
        j.each(function () {
            var b = a(this), h = "";
            if (!b.is("img")) {
                if (b.is("a")) {
                    b.addClass("nivo-imageLink");
                    h = b
                }
                b = b.find("img:first")
            }
            var c = b.width();
            if (c == 0)
                c = b.attr("width");
            var o = b.height();
            if (o == 0)
                o = b.attr("height");
            c > e.width() &&
                    e.width(c);
            o > e.height() && e.height(o);
            h != "" && h.css("display", "none");
            b.css("display", "none");
            g.totalSlides++
        });
        if (f.startSlide > 0) {
            if (f.startSlide >= g.totalSlides)
                f.startSlide = g.totalSlides - 1;
            g.currentSlide = f.startSlide
        }
        g.currentImage = a(j[g.currentSlide]).is("img") ? a(j[g.currentSlide]) : a(j[g.currentSlide]).find("img:first");
        a(j[g.currentSlide]).is("a") && a(j[g.currentSlide]).css("display", "block");
        e.css("background", 'url("' + g.currentImage.attr("src") + '") no-repeat');
        for (var k = 0; k < f.slices; k++) {
            var p =
                    Math.round(e.width() / f.slices);
            k == f.slices - 1 ? e.append(a('<div class="nivo-slice"></div>').css({left: p * k + "px", width: e.width() - p * k + "px"})) : e.append(a('<div class="nivo-slice"></div>').css({left: p * k + "px", width: p + "px"}))
        }
        e.append(a('<div class="nivo-caption"><p></p></div>').css({display: "none", opacity: f.captionOpacity}));
        if (g.currentImage.attr("title") != "") {
            k = g.currentImage.attr("title");
            if (k.substr(0, 1) == "#")
                k = a(k).html();
            a(".nivo-caption p", e).html(k);
            a(".nivo-caption", e).fadeIn(f.animSpeed)
        }
        var l =
                0;
        if (!f.manualAdvance && j.length > 1)
            l = setInterval(function () {
                r(e, j, f, false)
            }, f.pauseTime);
        if (f.directionNav) {
            e.append('<div class="nivo-directionNav"><a class="nivo-prevNav">Prev</a><a class="nivo-nextNav">Next</a></div>');
            if (f.directionNavHide) {
                a(".nivo-directionNav", e).hide();
                e.hover(function () {
                    a(".nivo-directionNav", e).show()
                }, function () {
                    a(".nivo-directionNav", e).hide()
                })
            }
            a("a.nivo-prevNav", e).live("click", function () {
                if (g.running)
                    return false;
                clearInterval(l);
                l = "";
                g.currentSlide -= 2;
                r(e, j, f, "prev")
            });
            a("a.nivo-nextNav", e).live("click", function () {
                if (g.running)
                    return false;
                clearInterval(l);
                l = "";
                r(e, j, f, "next")
            })
        }
        if (f.controlNav) {
            p = a('<div class="nivo-controlNav"></div>');
            e.append(p);
            for (k = 0; k < j.length; k++)
                if (f.controlNavThumbs) {
                    var t = j.eq(k);
                    t.is("img") || (t = t.find("img:first"));
                    f.controlNavThumbsFromRel ? p.append('<a class="nivo-control" rel="' + k + '"><img src="' + t.attr("rel") + '" alt="" /></a>') : p.append('<a class="nivo-control" rel="' + k + '"><img src="' + t.attr("src").replace(f.controlNavThumbsSearch,
                            f.controlNavThumbsReplace) + '" alt="" /></a>')
                } else
                    p.append('<a class="nivo-control" rel="' + k + '">' + (k + 1) + "</a>");
            a(".nivo-controlNav a:eq(" + g.currentSlide + ")", e).addClass("active");
            a(".nivo-controlNav a", e).live("click", function () {
                if (g.running)
                    return false;
                if (a(this).hasClass("active"))
                    return false;
                clearInterval(l);
                l = "";
                e.css("background", 'url("' + g.currentImage.attr("src") + '") no-repeat');
                g.currentSlide = a(this).attr("rel") - 1;
                r(e, j, f, "control")
            })
        }
        f.keyboardNav && a(window).keypress(function (b) {
            if (b.keyCode ==
                    "37") {
                if (g.running)
                    return false;
                clearInterval(l);
                l = "";
                g.currentSlide -= 2;
                r(e, j, f, "prev")
            }
            if (b.keyCode == "39") {
                if (g.running)
                    return false;
                clearInterval(l);
                l = "";
                r(e, j, f, "next")
            }
        });
        f.pauseOnHover && e.hover(function () {
            g.paused = true;
            clearInterval(l);
            l = ""
        }, function () {
            g.paused = false;
            if (l == "" && !f.manualAdvance)
                l = setInterval(function () {
                    r(e, j, f, false)
                }, f.pauseTime)
        });
        e.bind("nivo:animFinished", function () {
            g.running = false;
            a(j).each(function () {
                a(this).is("a") && a(this).css("display", "none")
            });
            a(j[g.currentSlide]).is("a") &&
                    a(j[g.currentSlide]).css("display", "block");
            if (l == "" && !g.paused && !f.manualAdvance)
                l = setInterval(function () {
                    r(e, j, f, false)
                }, f.pauseTime);
            f.afterChange.call(this)
        });
        var w = function (b, h) {
            var c = 0;
            a(".nivo-slice", b).each(function () {
                var o = a(this), d = Math.round(b.width() / h.slices);
                c == h.slices - 1 ? o.css("width", b.width() - d * c + "px") : o.css("width", d + "px");
                c++
            })
        }, r = function (b, h, c, o) {
            var d = b.data("nivo:vars");
            d && d.currentSlide == d.totalSlides - 1 && c.lastSlide.call(this);
            if ((!d || d.stop) && !o)
                return false;
            c.beforeChange.call(this);
            if (o) {
                o == "prev" && b.css("background", 'url("' + d.currentImage.attr("src") + '") no-repeat');
                o == "next" && b.css("background", 'url("' + d.currentImage.attr("src") + '") no-repeat')
            } else
                b.css("background", 'url("' + d.currentImage.attr("src") + '") no-repeat');
            d.currentSlide++;
            if (d.currentSlide == d.totalSlides) {
                d.currentSlide = 0;
                c.slideshowEnd.call(this)
            }
            if (d.currentSlide < 0)
                d.currentSlide = d.totalSlides - 1;
            d.currentImage = a(h[d.currentSlide]).is("img") ? a(h[d.currentSlide]) : a(h[d.currentSlide]).find("img:first");
            if (c.controlNav) {
                a(".nivo-controlNav a",
                        b).removeClass("active");
                a(".nivo-controlNav a:eq(" + d.currentSlide + ")", b).addClass("active")
            }
            if (d.currentImage.attr("title") != "") {
                var u = d.currentImage.attr("title");
                if (u.substr(0, 1) == "#")
                    u = a(u).html();
                a(".nivo-caption", b).css("display") == "block" ? a(".nivo-caption p", b).fadeOut(c.animSpeed, function () {
                    a(this).html(u);
                    a(this).fadeIn(c.animSpeed)
                }) : a(".nivo-caption p", b).html(u);
                a(".nivo-caption", b).fadeIn(c.animSpeed)
            } else
                a(".nivo-caption", b).fadeOut(c.animSpeed);
            var m = 0;
            a(".nivo-slice", b).each(function () {
                var i =
                        Math.round(b.width() / c.slices);
                a(this).css({height: "0px", opacity: "0", background: 'url("' + d.currentImage.attr("src") + '") no-repeat -' + (i + m * i - i) + "px 0%"});
                m++
            });
            if (c.effect == "random") {
                h = ["sliceDownRight", "sliceDownLeft", "sliceUpRight", "sliceUpLeft", "sliceUpDown", "sliceUpDownLeft", "fold", "fade", "slideInRight", "slideInLeft"];
                d.randAnim = h[Math.floor(Math.random() * (h.length + 1))];
                if (d.randAnim == undefined)
                    d.randAnim = "fade"
            }
            if (c.effect.indexOf(",") != -1) {
                h = c.effect.split(",");
                d.randAnim = h[Math.floor(Math.random() *
                        h.length)];
                if (d.randAnim == undefined)
                    d.randAnim = "fade"
            }
            d.running = true;
            if (c.effect == "sliceDown" || c.effect == "sliceDownRight" || d.randAnim == "sliceDownRight" || c.effect == "sliceDownLeft" || d.randAnim == "sliceDownLeft") {
                var n = 0;
                m = 0;
                w(b, c);
                h = a(".nivo-slice", b);
                if (c.effect == "sliceDownLeft" || d.randAnim == "sliceDownLeft")
                    h = a(".nivo-slice", b)._reverse();
                h.each(function () {
                    var i = a(this);
                    i.css({top: "0px"});
                    m == c.slices - 1 ? setTimeout(function () {
                        i.animate({height: "100%", opacity: "1.0"}, c.animSpeed, "", function () {
                            b.trigger("nivo:animFinished")
                        })
                    },
                            100 + n) : setTimeout(function () {
                        i.animate({height: "100%", opacity: "1.0"}, c.animSpeed)
                    }, 100 + n);
                    n += 50;
                    m++
                })
            } else if (c.effect == "sliceUp" || c.effect == "sliceUpRight" || d.randAnim == "sliceUpRight" || c.effect == "sliceUpLeft" || d.randAnim == "sliceUpLeft") {
                m = n = 0;
                w(b, c);
                h = a(".nivo-slice", b);
                if (c.effect == "sliceUpLeft" || d.randAnim == "sliceUpLeft")
                    h = a(".nivo-slice", b)._reverse();
                h.each(function () {
                    var i = a(this);
                    i.css({bottom: "0px"});
                    m == c.slices - 1 ? setTimeout(function () {
                        i.animate({height: "100%", opacity: "1.0"}, c.animSpeed, "",
                                function () {
                                    b.trigger("nivo:animFinished")
                                })
                    }, 100 + n) : setTimeout(function () {
                        i.animate({height: "100%", opacity: "1.0"}, c.animSpeed)
                    }, 100 + n);
                    n += 50;
                    m++
                })
            } else if (c.effect == "sliceUpDown" || c.effect == "sliceUpDownRight" || d.randAnim == "sliceUpDown" || c.effect == "sliceUpDownLeft" || d.randAnim == "sliceUpDownLeft") {
                var x = m = n = 0;
                w(b, c);
                h = a(".nivo-slice", b);
                if (c.effect == "sliceUpDownLeft" || d.randAnim == "sliceUpDownLeft")
                    h = a(".nivo-slice", b)._reverse();
                h.each(function () {
                    var i = a(this);
                    if (m == 0) {
                        i.css("top", "0px");
                        m++
                    } else {
                        i.css("bottom",
                                "0px");
                        m = 0
                    }
                    x == c.slices - 1 ? setTimeout(function () {
                        i.animate({height: "100%", opacity: "1.0"}, c.animSpeed, "", function () {
                            b.trigger("nivo:animFinished")
                        })
                    }, 100 + n) : setTimeout(function () {
                        i.animate({height: "100%", opacity: "1.0"}, c.animSpeed)
                    }, 100 + n);
                    n += 50;
                    x++
                })
            } else if (c.effect == "fold" || d.randAnim == "fold") {
                m = n = 0;
                w(b, c);
                a(".nivo-slice", b).each(function () {
                    var i = a(this), y = i.width();
                    i.css({top: "0px", height: "100%", width: "0px"});
                    m == c.slices - 1 ? setTimeout(function () {
                        i.animate({width: y, opacity: "1.0"}, c.animSpeed, "", function () {
                            b.trigger("nivo:animFinished")
                        })
                    },
                            100 + n) : setTimeout(function () {
                        i.animate({width: y, opacity: "1.0"}, c.animSpeed)
                    }, 100 + n);
                    n += 50;
                    m++
                })
            } else if (c.effect == "fade" || d.randAnim == "fade") {
                var q = a(".nivo-slice:first", b);
                q.css({height: "100%", width: b.width() + "px"});
                q.animate({opacity: "1.0"}, c.animSpeed * 2, "", function () {
                    b.trigger("nivo:animFinished")
                })
            } else if (c.effect == "slideInRight" || d.randAnim == "slideInRight") {
                q = a(".nivo-slice:first", b);
                q.css({height: "100%", width: "0px", opacity: "1"});
                q.animate({width: b.width() + "px"}, c.animSpeed * 2, "", function () {
                    b.trigger("nivo:animFinished")
                })
            } else if (c.effect ==
                    "slideInLeft" || d.randAnim == "slideInLeft") {
                q = a(".nivo-slice:first", b);
                q.css({height: "100%", width: "0px", opacity: "1", left: "", right: "0px"});
                q.animate({width: b.width() + "px"}, c.animSpeed * 2, "", function () {
                    q.css({left: "0px", right: ""});
                    b.trigger("nivo:animFinished")
                })
            }
        }, z = function (b) {
            this.console && typeof console.log != "undefined" && console.log(b)
        };
        this.stop = function () {
            if (!a(s).data("nivo:vars").stop) {
                a(s).data("nivo:vars").stop = true;
                z("Stop Slider")
            }
        };
        this.start = function () {
            if (a(s).data("nivo:vars").stop) {
                a(s).data("nivo:vars").stop =
                        false;
                z("Start Slider")
            }
        };
        f.afterLoad.call(this)
    };
    a.fn.nivoSlider = function (s) {
        return this.each(function () {
            var v = a(this);
            if (!v.data("nivoslider")) {
                var f = new A(this, s);
                v.data("nivoslider", f)
            }
        })
    };
    a.fn.nivoSlider.defaults = {effect: "random", slices: 15, animSpeed: 500, pauseTime: 3E3, startSlide: 0, directionNav: true, directionNavHide: true, controlNav: true, controlNavThumbs: false, controlNavThumbsFromRel: false, controlNavThumbsSearch: ".jpg", controlNavThumbsReplace: "_thumb.jpg", keyboardNav: true, pauseOnHover: true, manualAdvance: false,
        captionOpacity: 0.8, beforeChange: function () {}, afterChange: function () {}, slideshowEnd: function () {}, lastSlide: function () {}, afterLoad: function () {}};
    a.fn._reverse = [].reverse
})(jQuery);


/*
 * Image preview script 
 * powered by jQuery (http://www.jquery.com)
 * 
 * written by Alen Grakalic (http://cssglobe.com)
 * 
 * for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
 *
 */
 
this.imagePreview = function(){	
	/* CONFIG */
		
		xOffset = 10;
		yOffset = 30;
		
		// these 2 variable determine popup's distance from the cursor
		// you might want to adjust to get the right result
		
	/* END CONFIG */
	$("a.preview").hover(function(e){
		this.t = this.title;
		this.title = "";	
		var c = (this.t != "") ? "<br/>" + this.t : "";
		$("body").append("<p id='preview'><img src='"+ this.href +"' alt='Image preview' />"+ c +"</p>");								 
		$("#preview")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px")
			.fadeIn("fast");						
    },
	function(){
		this.title = this.t;	
		$("#preview").remove();
    });	
	$("a.preview").mousemove(function(e){
		$("#preview")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px");
	});			
};


// starting the script on page load
$(document).ready(function(){
	imagePreview();
});


///////////////////////////////////////////////////////
// document ready functions 
//////////////////////////////////////////////////////
$(document).ready(function() {
  //   $("p").text("The DOM is now loaded and can be manipulated.");
$( ".LoginButton" ).click(function() {
   // alert( "Handler for .click() called." );
   var parms = $(this).attr('name') ; 
   var parms = parms.split(",") ; 
   var pstr = '|' + parms[0] + '|' + $(this).prev().val() + '|' +  parms[1] + "^" ;
   LoginPop(parms) ; 
});
});
            
function LoginClick(aname) {  
// hijacked to allow for order onlien 
//   location.href = "orderOnline.php" ;
//   return ;
// if you uncomment above it will not add items to order for rn..           
   var nid = "#" + aname
   var nid = nid.replace(",","-")  ;
   var parms = aname.split(",") ; 
   var pstr = '|' + parms[0] + '|' + $(nid).val() + '|' +  parms[1] + "^" ;
   LoginPop(pstr) ; 
}

function LoginPop(pstr) {
   var image_url = "" ; 
     $('#SpecLoader').hide();
     $('#mask').fadeOut(1000)
   // check ig logged in and fi so - return final string 
  //  var rn_orderno = $('#rn_orderno').data("ordno") || null ;
    var rn_orderno = $('#rn_orderno').attr("data-ordno") || null ;
// need to use data-ordno to no drop leading zero's     
    if(rn_orderno !== null) {
     var aresult = MultiOrder(".QtyBox", rn_orderno) ; 
     $('#fstring').val(aresult) ;
      if (pstr == "ADD") {
      // assume they want to just upodate the cart 
      var content = $('#rnsearchform').serialize();;
      $("#StatusMsg").show() ;
      $("#StatusMsg").addClass("info") ;
      $("#StatusMsg").html("Sending items...") ; 
      $('#fstring').val('') ; 
  //  var ncontent = "&PAGEID=15&LOGINPATH=AO&STARTPTR=1&ORDERNO=" + orderno + "&final_string=" + aresults
  //  var content = content + ncontent ; 
        var posting = $.post( MDSRnUrl, content ); 
  // Put the results in a div
        posting.done(function( adata ) {
     //   Check for Errors first..
      var emsg =   $(adata).find("form[name='template']" ).find( "table:eq(2)" ).find( "tr:first").find( "td:eq(0)" ).text() ;
      if (emsg.indexOf('The following errors occurred while adding your items:') <= 0) { 
     // if ($.trim(emsg) !== "The following errors occurred while adding your items:") {
        $("#StatusMsg").addClass("Success") ;
        $("#StatusMsg").html("Updated Cart Successfully") ;         
       // var cartinfo = $(data).find( "form[name='template']" ).find( "table:eq(5)" ).html() ;
        var carttotals =  $(adata).find( "form[name='template']" ).find( "table:eq(5)" ).find( "tr:last" ).html()
       // var topcart = "<span id='topcar'> Cart Totals: " + carttotals + " <a href='#' onclick=javascript:$('#innercart').toggle() > Show Details </a> </span> <span id='innercart' style='display: none' > " + cartinfo + " </span>"
        var topcart = "<span id='topcart'> Cart: " + carttotals + " </span>"  
       } else {
        $("#StatusMsg").addClass("Error") ;
        $("#StatusMsg").html("Errors while updating cart...<br>") ;
        var topcart = $(adata).find("form[name='template']" ).find( "table:eq(2)" ).find( "tr:last").find( "td:eq(1)" ).html() ; 
       }           
         $("#StatusMsg").append(topcart) ;
         topcartdisplay() 
         // zap the final string back to null 
          $('#fstring').val('') ;
      //  $("#StatusMsg").fadeOut(5000) ; 
        }) ;    
      } else { 
       document.template.loginpath.value = "AO" ; // reset to add to order for submit 
       $('#rnsearchform').submit() ;
      }  
     return ;
    }

  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("#SessLoader").length < 1) {
    // need to create div 
    makediv("SessLoader");
  }
  //Get the screen height and width  
  var maskHeight = $(document).height();
  var maskWidth = $(window).width();
  //Set heigth and width to mask to fill up the whole screen  
  $('#mask').css({
    'width': maskWidth,
    'height': maskHeight,
    'position': 'absolute',
    'left': '0',
    'top': '0',
    'z-index': '9000',
    'background-color': '#000',
    'display': 'none'
  });
  //transition effect   
  $('#mask').fadeIn(1000);
  $('#mask').fadeTo("slow", 0.8);
  //Get the window height and width  
  var winH = $(document).height();
  var winW = $(window).width();
  //Set the popup window to center  
  $('#SessLoader').css({
    'width': 'auto',
    'height': 'auto',
    'padding': '20px',
    'background': 'white'
  });
  // $('#SessLoader').css({'width':'530px','height':'300px','padding':'0px','background': 'white'});
  // Added Rounded corders - djf 6-28-13
  $('#SessLoader').css({
    '-webkit-border-radius': '50px',
    '-moz-border-radius': '50px',
    'border-radius': '50px',
    'border': '2px solid #363600',
    'background-color': '#FFFFFF',
    '-webkit-box-shadow': '#CCCCCC 10px 10px 10px',
    '-moz-box-shadow': '#CCCCCC 10px 10px 10px',
    'box-shadow': '#CCCCCC 10px 10px 10px'
  });
  $('#SessLoader').css({
    'display': 'none',
    'z-index': '9999',
    'position': 'absolute',
    'color': 'black'
  });
  $('#SessLoader').html('<div style="font-family:arial;font-size:20px;"> <div style=float:right> <a href=# id="SessClose" style="padding-right: 33px;" >X</a> </div> </div> <div id="SessContent"> </div> ');
  $('#SessLoader').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'margin-top': '-250px',
    'margin-left': '-130px'
  });
  // var dummy = widgetload(parms, '#SessContent');
    var fhtml = '' ; 
    fhtml += '<form class="CLLoginForm" action="#" id="LoginForm" method=post>  ' ;
    fhtml += '<input type=hidden name=pageid value="0">                ' ;
    fhtml += '<input type=hidden name=loginpath value="OOH"><br> Please Login Below <br>       ' ;
    fhtml += '<br><INPUT class=inputText id=username maxLength=50 size=15 name=CustomerId Placeholder="Enter Username"> ' ;
    fhtml += '<br><INPUT class=inputText id=password type=password maxLength=50 size=15 name=Password Placeholder="Enter Password"> ' ; 
// var PSTR = |PNO|QTY|UM^
    fhtml += '   <br> <br>  <input class="LoginButton button1" type="button" value="Add My Items and Login" onclick=\javascript:AddRnItem("' + pstr + '")\ >  ' ;
    fhtml += '   <br> <br>  <a onclick="javascript:regme()" href="#" >No Account? Sign Up Here </a>  ' ;
    fhtml += '</form>   ' ;
    fhtml += '   <br> Status: <div id="StatusMsg"> </div> ' ; 
    $('#SessContent').html(fhtml) ; 
    $(window).bind("keypress", function(a) {  if (a.keyCode == 13) {  AddRnItem(pstr ) ;   }});
  //transition effect  
  $('#SessLoader').fadeIn(2000);
  //if clicked hide
  $('#SessClose').click(function() {
    $('#SessLoader').hide();
    $('#mask').fadeOut(1000)
  });
}
//end added generic popup


 // hard code https on login 
function submitOtherFormUnique(form_data) {
     var form_data = deparam(form_data) ; 
  // Added code to append a unique id
  var fid = new Date().getTime();
  var formname = "form" + fid;
  var _body = document.getElementsByTagName('body')[0];
  var _div = document.createElement('div');
  _body.appendChild(_div);
 // var form_content = '<form name="' + formname + '" id="' + formname + '" method="post" action="' + url + '" target="_blank">';
   var form_content = '<form name="' + formname + '" id="' + formname + '" method="post" action="' + MDSRnUrl + '" target="_self">';
 
  var form_content = form_content + form_data;
  var form_content = form_content + '</form>';
  _div.innerHTML = (form_content);
  document.getElementById(formname).submit();
}
// Attach a submit handler to the form
function AddRnItem( pstring ) {
 // added options to get all qty on page here.. 
  var content = $("#LoginForm").serialize();
  // Send the data using post
  $("#StatusMsg").html("Getting Order Number...") ; 
  if(content == null) {
         $("#StatusMsg").html("Could not get Login Information...") ; 
   return ;  
  } else {
     // we have data so send it. 
      $("#StatusMsg").html("Sending Content...") ; 
  }
  var posting = $.post( MDSRnUrl, content ); 
  // Put the results in a div
  posting.done(function( data ) {
    // var content = $( data ).find( "#content" );
    var orderno =  $( data ).find( "input[name='orderno']" ).val() ;
     
   //  $( "#result" ).empty().append( "Orderno is: " + orderno );
    if(orderno) {
    $("#StatusMsg").html("Order Number " + orderno) ; 
    // Assume we have a good order no so log add item to order 
    var content = $("#LoginForm").serialize();
    var aresults = MultiOrder(".QtyBox", orderno) ;
     $("#StatusMsg").html("Sending items...") ;  
    var ncontent = "&PAGEID=3&LOGINPATH=AO&APROD_STRING=&STARTPTR=1&MANUFACT_STRING=&PROD_STRING=&QTY_STRING=&UM_STRING=&PRICE_STRING=&EXTPRICE_STRING=&ORDERNO=" + orderno + "&final_string=" + aresults
    // var content = ncontent ; 
    var content = content + ncontent ; 
    $("#StatusMsg").html("Adding Item " + aresults) ;     
    submitOtherFormUnique(content); 
     $("#StatusMsg").html("Order Created - Please See New Tab" ) ; 
      $('#SessLoader').fadeOut(2000)  ;
      $('#mask').fadeOut(1000)   ;
    }  else {
    $("#StatusMsg").html("Invalid Login Information, Please try again...") ;
    } 
  });
}  ;
function AddRnItem_single( pstring ) {
  var content = $("#LoginForm").serialize();
  // Send the data using post
  $("#StatusMsg").html("Getting Order Number...") ; 
  var posting = $.post( MDSRnUrl, content ); 
  // Put the results in a div
  posting.done(function( data ) {
    // var content = $( data ).find( "#content" );
    var orderno =  $( data ).find( "input[name='orderno']" ).val() ;
     
   //  $( "#result" ).empty().append( "Orderno is: " + orderno );
    if(orderno) {
    $("#StatusMsg").html("Order Number " + orderno) ; 
    // Assume we have a good order no so log add item to order 
    var content = $("#LoginForm").serialize();
    var ncontent = "&PAGEID=3&LOGINPATH=AO&STARTPTR=1&APROD_STRING=&MANUFACT_STRING=&PROD_STRING=&QTY_STRING=&UM_STRING=&PRICE_STRING=&EXTPRICE_STRING=&ORDERNO=" + orderno + "&final_string=" + orderno + pstring
    var content = content + ncontent ; 
    $("#StatusMsg").html("Adding Item " + pstring) ;     
    submitOtherFormUnique(content); 
     $("#StatusMsg").html("Order Created - Please See New Tab" ) ;  
    }  else {
    $("#StatusMsg").html("Invalid Login Information, Please try again...") ;
    } 
  });
}  ;

/// NEW FUNCTION TO LOGIN AND GO TO SEARCH PAGE AFTER ADDING ITEMS TO CART 
// Attach a submit handler to the form
function AddRnItem_Search( pstring ) {
 // added options to get all qty on page here.. 
  var content = $("#StandardLoginForm").serialize();
  // Send the data using post
  $("#StatusMsg").html("Getting Order Number...") ; 
  if(content == null) {
         $("#StatusMsg").html("Could not get Login Information...") ; 
   return ;  
  } else {
     // we have data so send it. 
      $("#StatusMsg").html("Sending Login Information...") ; 
  }
  var posting = $.post( MDSRnUrl, content ); 
  // Put the results in a div
  posting.done(function( data ) {
    // var content = $( data ).find( "#content" );
    var orderno =  $( data ).find( "input[name='orderno']" ).val() ;
     
   //  $( "#result" ).empty().append( "Orderno is: " + orderno );
    if(orderno) {
    $("#StatusMsg").html("Order Number " + orderno) ; 
    // Assume we have a good order no so log add item to order 
    var content = $("#StandardLoginForm").serialize();
    // var aresults = AceMultiOrder(".QtyBox", orderno) ;
     $("#StatusMsg").html("Creating Order " + orderno + "...") ;  
    var ncontent = "&PAGEID=7&LOGINPATH=PS&STARTPTR=1&ORDERNO=" + orderno 
    var content = content + ncontent ; 
    $("#StatusMsg").html("Processing Search...") ;     
    submitOtherFormUnique(content); 
     $("#StatusMsg").html("Logged in Successfully" ) ; 
      $('#SessLoader').fadeOut(2000)  ;
      $('#mask').fadeOut(1000)   ;
    }  else {
    $("#StatusMsg").html("Invalid Login Information, Please try again...") ;
    } 
  });
}  ;
function deparam(query) {
    var pairs, i, keyValuePair, key, value, map = '';
    // remove leading question mark if its there
    if (query.slice(0, 1) === '?') {
        query = query.slice(1);
    }
    if (query !== '') {
        pairs = query.split('&');
        for (i = 0; i < pairs.length; i += 1) {
            keyValuePair = pairs[i].split('=');
            key = decodeURIComponent(keyValuePair[0]);
            value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
            map += "<input type=hidden name=" + key + " value=" + value + ">" ;
        }
    }
    return map;
}



///////////////////////////////////////////////////////
// document ready functions 
//////////////////////////////////////////////////////
$(document).ready(function() {
  //   $("p").text("The DOM is now loaded and can be manipulated.");
$( ".LoginButton" ).click(function() {
   // alert( "Handler for .click() called." );
   var parms = $(this).attr('name') ; 
   var parms = parms.split(",") ; 
   var pstr = '|' + parms[0] + '|' + $(this).prev().val() + '|' +  parms[1] + "^" ;
   LoginPop(parms) ; 
});
});
            
function LoginClick(aname) {  
// hijacked to allow for order onlien 
//   location.href = "orderOnline.php" ;
//   return ;
// if you uncomment above it will not add items to order for rn..           
   var nid = "#" + aname
   var nid = nid.replace(",","-")  ;
   var parms = aname.split(",") ; 
   var pstr = '|' + parms[0] + '|' + $(nid).val() + '|' +  parms[1] + "^" ;
   LoginPop(pstr) ; 
}

//local copy of hotitems add to order function 

function HotAdd_To_Order(aprodno,nid,um) {            
   var pstr = '|' + aprodno + '|' + $(nid).val() + '|' +  um + "^" ;
   LoginPop(pstr) ; 
}

// added new multi order function 
var Result = '' ;  // GLOBAL VARIABLE
function AceMultiOrder(selector,orderno) {
Result = '' ; 
var rn_orderno = $('#rn_orderno').attr("data-ordno") || null ;
$(selector).each(function (index, value){
var qty = $(this).val() ; 
if(qty.match(/^\d+$/)) {
 Result = Result + orderno + "|" + $(this).attr("data-prodno") + "|" + qty + "|" + $(this).attr("data-um") + "^" ;   
   if(rn_orderno !== null) { $(this).val('')  };
}
});
return Result ;
}

function MultiOrder(selector) {
var Result = '' ;  // GLOBAL VARIABLE
$(selector).each(function (index, value){
var qty = $(this).val() ; 
if(qty.match(/^\d+$/)) {
 Result = Result + $(this).attr("data-prodno") + "|" + qty + "|" + $(this).attr("data-um") + "^" ;
}
});
return Result ;
}

// expects format 
//<input class="QtyBox" data-prodno="[A.PROD.NO]" data-um="[UN.MEAS]"  type="text" >
// onnclick="javascript:MultiOrder(".QtyBox")"
function replaceURLWithHTMLLinks(text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;  
   if(typeof text !== 'string') {
        // throw new Error('only string parameter supported!');
        return text
    }
  // any text to use as anchor text?
 // var anchor = document.getElementById("anchortexttxt").value;
//  if (anchor == "") {
    return text.replace(exp,"<a href='$1'>$1</a>");
 //    }
 // else {
  //  return text.replace(exp,"<a href='$1'>" + anchor + "</a>");
  // }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function insertParam(key, value) {
    key = encodeURI(key); value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');
    var nkvp = [] ; 
    var i=kvp.length; var x; while(i--) {
        x = kvp[i].split('=');
        if (x[0]==key) {
            x[1] = value;
            nkvp[i] = x.join('=');
            break;
        }
    }
    // if(i<0) {nkvp[nkvp.length] = [key,value].join('=');}   
    // searchstring = nkvp.join('&');
    searchstring = "&" + nkvp[i] ; 
    return searchstring ; 
}

function psearch(svar) {
    // hide the selection from item search 
    document.forms[0].submitvar.value = svar;
    Manager.store.remove('fq');
    var fq = svar
    $.cookie('SearchFilter', fq);
    Manager.doRequest();
    // alert('s1') ;
    var t = setTimeout("showimages()", 1000);
   // $('#selection').html('');
}
