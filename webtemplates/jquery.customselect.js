(function($){
    $.fn.SelectCustomizer = function(settings){


        // Select Customizer jQuery plug-in
        // based on customselect by Ace Web Design http://www.adelaidewebdesigns.com/2008/08/01/adelaide-web-designs-releases-customselect-with-icons/
        // modified by David Vian http://www.ildavid.com/dblog
        // and then modified AGAIN be Dean Collins http://www.dblog.com.au
        //modified on 230909 by Oshua Moreno http://www.oshuamoreno.com

        $.extend($.fn.SelectCustomizer.settings,settings);

        return this.each(function(){
            var obj = $(this);
            var name = obj.attr('name');
            var id_slc_options = name+'_options';
            var id_icn_select = name+'_iconselect';
            var id_holder = name+'_holder';
            var custom_select = name+'_customselect';
            obj.after("<div id=\""+id_slc_options+"\" class=\"customselect_optionswrapper\"> </div>");
            var foundselected=false;
            var numopts=0;
            var selectedvalue;
            var selectedoption;
            var firstvalue;
            var firstoption;
            obj.find('option').each(function(i){
                $("#"+id_slc_options).append("<div title=\"" + $(this).attr("value") + "\" class=\"selectitems\"><span>" + $(this).attr("label") + "</span></div>");
                if (numopts==0){
                    firstvalue=$(this).attr("value");
                    firstoption=$(this).attr("label");
                }
                if(($(this).attr("selected"))&&(!foundselected)){
                    selectedvalue=$(this).attr("value");
                    selectedoption=$(this).attr("label");
                    foundselected=true;
                }
                numopts++;
            });
            if ((!foundselected)&&(numopts>0)){
                selectedvalue=firstvalue;
                selectedoption=firstoption;
            }
            if (numopts>1){
                obj.before("<input type=\"hidden\" value =\""+selectedvalue+"\" name=\"" + this.name + "\" id=\""+custom_select+"\"/><div id=\""+id_icn_select+"\" class=\"customselect_selectedoption customselect_arrow\">" + selectedoption + "</div><div id=\""+id_holder+"\" class=\"customselect_selectwrapper\"> </div>").remove();
            }
            else {
                obj.before("<input type=\"hidden\" value =\""+selectedvalue+"\" name=\"" + this.name + "\" id=\""+custom_select+"\"/><div id=\""+id_icn_select+"\" class=\"customselect_selectedoption\">" + selectedoption + "</div>").remove();
                $("#"+id_slc_options).remove();
            }
            if (numopts>1){
                $("#"+id_icn_select).click(function(a){
                    if($("#"+id_holder).css('display') == 'none') {
                        $("#"+id_holder).fadeIn(200);
                        $("#"+id_holder).focus();
                        a.stopPropagation();
                        $(document).keypress(function(e) {
                            if(!e) var e = window.event;
                            e.cancelBubble = true;
                            e.returnValue = false;
                            if (e.stopPropagation) {
                                e.stopPropagation();
                                e.preventDefault();
                            }
                        });
                        $(document).keyup(function(e) {

                            if(e.which == 40) {
                                var lastSelected = $("#"+id_holder+" .selectedclass");
                                if(lastSelected.size() == 0) {
                                    var nextSelected =  $("#"+id_slc_options+" div:first:");
                                } else {
                                    var nextSelected = lastSelected.next(".selectitems");
                                }
                                if(nextSelected.size() == 1) {
                                    lastSelected.removeClass("selectedclass");
                                    nextSelected.addClass("selectedclass");
                                    $("#"+custom_select).val(nextSelected.title);
                                    $("#"+id_icn_select).html(nextSelected.html());
                                    if (obj.attr('onchange')!=undefined){

                                        obj.change();
                                    }
                                    var rowOffset = (nextSelected.offset().top - $("#"+id_holder).offset().top);
                                    if(rowOffset > 130) {
                                        $("#"+id_slc_options).scrollTo(($("#"+id_slc_options).scrollTop() + 27) +  "px");
                                    }
                                }

                            } else if(e.which == 38) {
                                var lastSelected = $("#"+id_holder+" .selectedclass");
                                var nextSelected = lastSelected.prev(".selectitems");
                                if(nextSelected.size() == 1) {
                                    lastSelected.removeClass("selectedclass");
                                    nextSelected.addClass("selectedclass");
                                    $("#"+custom_select).val(nextSelected.title);
                                    $("#"+id_icn_select).html(nextSelected.html());
                                    if (obj.attr('onchange')!=undefined){
                                        obj.change();
                                    }
                                    var rowOffset = (nextSelected.offset().top - $("#"+id_holder).offset().top);
                                    if(rowOffset > 0) {
                                        $("#"+id_slc_options).scrollTo(($("#"+id_slc_options).scrollTop() - 27) +  "px");
                                    }
                                }
                            } else if(e.which == 13) {
                                $("#"+id_holder).fadeOut(250);
                                $(document).unbind('keyup');
                                $(document).unbind('keypress');
                                $('body').unbind('click');
                            }

                        });
                        $('body').click(function(){
                            $("#"+id_holder).fadeOut(200);
                            $('body').unbind('click');
                            $(document).unbind('keyup');
                            $(document).unbind('keypress');
                        });
                    } else {
                        $("#"+id_holder).fadeOut(200);
                        $('body').unbind('click');
                        $(document).unbind('keyup');
                        $(document).unbind('keypress');
                    }
                    
                });
                $("#"+id_holder).append($("#"+id_slc_options)[0]);
                $("#"+id_holder).append("<div class=\"customselect_selectfooter\"></div>");
                $("#"+id_slc_options+" > div:last").addClass("last");
                $("#"+id_holder+ " .selectitems").mouseover(function(){
                    $(this).addClass("hoverclass");
                });
                $("#"+id_holder+" .selectitems").mouseout(function(){
                    $(this).removeClass("hoverclass");
                });
                $("#"+id_holder+" .selectitems").click(function(){
                    $("#"+id_holder+" .selectedclass").removeClass("selectedclass");
                    $(this).addClass("selectedclass");
                    var thisselection = $(this).html();
                    $("#"+custom_select).val(this.title);
                    $("#"+id_icn_select).html(thisselection);
                    if (obj.attr('onchange')!=undefined){
                        obj.change();
                    }
                    $("#"+id_holder).fadeOut(250);
                    $(document).unbind('keyup');
                    $(document).unbind('keypress');
                    $('body').unbind('click');
                });
            }
            else {
        }
        });
    }

    $.fn.SelectCustomizer.settings = {
        

    }

})(jQuery); 
