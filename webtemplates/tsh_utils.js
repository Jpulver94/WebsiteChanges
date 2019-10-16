var dhtmlwindow = {
  imagefiles: ['https://hosting.tshinc.com/rn/templates//windowfiles/min.gif', 'https://hosting.tshinc.com/rn/templates//windowfiles/close.gif', 'https://hosting.tshinc.com/rn/templates//windowfiles/restore.gif', 'https://hosting.tshinc.com/rn/templates//windowfiles/resize.gif'],
  //Path to 4 images used by script, in that order
  ajaxbustcache: true,
  //Bust caching when fetching a file via Ajax?
  ajaxloadinghtml: '<b>Loading Page. Please wait...</b>',
  //HTML to show while window fetches Ajax Content?
  minimizeorder: 0,
  zIndexvalue: 1000,
  tobjects: [],
  //object to contain references to dhtml window divs, for cleanup purposes
  lastactivet: {},
  //reference to last active DHTML window
  init: function(t) {
    var domwindow = document.createElement("div") //create dhtml window div
    domwindow.id = t
    domwindow.className = "dhtmlwindow"
    var domwindowdata = ''
    domwindowdata = '<div class="drag-handle">'
    domwindowdata += 'DHTML Window <div class="drag-controls"><img src="' + this.imagefiles[0] + '" title="Minimize" /><img src="' + this.imagefiles[1] + '" title="Close" /></div>'
    domwindowdata += '</div>'
    domwindowdata += '<div class="drag-contentarea"></div>'
    domwindowdata += '<div class="drag-statusarea"><div class="drag-resizearea" style="background: transparent url(' + this.imagefiles[3] + ') top right no-repeat;">&nbsp;</div></div>'
    domwindowdata += '</div>'
    domwindow.innerHTML = domwindowdata
    document.getElementById("dhtmlwindowholder").appendChild(domwindow)
    //this.zIndexvalue=(this.zIndexvalue)? this.zIndexvalue+1 : 100 //z-index value for DHTML window: starts at 0, increments whenever a window has focus
    var t = document.getElementById(t)
    var divs = t.getElementsByTagName("div")
    for (var i = 0; i < divs.length; i++) { //go through divs inside dhtml window and extract all those with class="drag-" prefix
      if (/drag-/.test(divs[i].className)) t[divs[i].className.replace(/drag-/, "")] = divs[i] //take out the "drag-" prefix for shorter access by name
    }
    //t.style.zIndex=this.zIndexvalue //set z-index of this dhtml window
    t.handle._parent = t //store back reference to dhtml window
    t.resizearea._parent = t //same
    t.controls._parent = t //same
    t.onclose = function() {
      return true
    } //custom event handler "onclose"
    t.onmousedown = function() {
      dhtmlwindow.setfocus(this)
    } //Increase z-index of window when focus is on it
    t.handle.onmousedown = dhtmlwindow.setupdrag //set up drag behavior when mouse down on handle div
    t.resizearea.onmousedown = dhtmlwindow.setupdrag //set up drag behavior when mouse down on resize div
    t.controls.onclick = dhtmlwindow.enablecontrols
    t.show = function() {
      dhtmlwindow.show(this)
    } //public function for showing dhtml window
    t.hide = function() {
      dhtmlwindow.hide(this)
    } //public function for hiding dhtml window
    t.close = function() {
      dhtmlwindow.close(this)
    } //public function for closing dhtml window (also empties DHTML window content)
    t.setSize = function(w, h) {
      dhtmlwindow.setSize(this, w, h)
    } //public function for setting window dimensions
    t.moveTo = function(x, y) {
      dhtmlwindow.moveTo(this, x, y)
    } //public function for moving dhtml window (relative to viewpoint)
    t.isResize = function(bol) {
      dhtmlwindow.isResize(this, bol)
    } //public function for specifying if window is resizable
    t.isScrolling = function(bol) {
      dhtmlwindow.isScrolling(this, bol)
    } //public function for specifying if window content contains scrollbars
    t.load = function(contenttype, contentsource, title) {
      dhtmlwindow.load(this, contenttype, contentsource, title)
    } //public function for loading content into window
    this.tobjects[this.tobjects.length] = t
    return t //return reference to dhtml window div
  },
  open: function(t, contenttype, contentsource, title, attr, recalonload) {
    var d = dhtmlwindow //reference dhtml window object
    function getValue(Name) {
      var config = new RegExp(Name + "=([^,]+)", "i") //get name/value config pair (ie: width=400px,)
      return (config.test(attr)) ? parseInt(RegExp.$1) : 0 //return value portion (int), or 0 (false) if none found
    }
    if (document.getElementById(t) == null) //if window doesn't exist yet, create it
    t = this.init(t) //return reference to dhtml window div
    else
    t = document.getElementById(t)
    this.setfocus(t)
    t.setSize(getValue(("width")), (getValue("height"))) //Set dimensions of window
    var xpos = getValue("center") ? "middle" : getValue("left") //Get x coord of window
    var ypos = getValue("center") ? "middle" : getValue("top") //Get y coord of window
    //t.moveTo(xpos, ypos) //Position window
    if (typeof recalonload != "undefined" && recalonload == "recal" && this.scroll_top == 0) { //reposition window when page fully loads with updated window viewpoints?
      if (window.attachEvent && !window.opera) //In IE, add another 400 milisecs on page load (viewpoint properties may return 0 b4 then)
      this.addEvent(window, function() {
        setTimeout(function() {
          t.moveTo(xpos, ypos)
        }, 400)
      }, "load")
      else
      this.addEvent(window, function() {
        t.moveTo(xpos, ypos)
      }, "load")
    }
    t.isResize(getValue("resize")) //Set whether window is resizable
    t.isScrolling(getValue("scrolling")) //Set whether window should contain scrollbars
    t.style.visibility = "visible"
    t.style.display = "block"
    t.contentarea.style.display = "block"
    t.moveTo(xpos, ypos) //Position window
    t.load(contenttype, contentsource, title)
    if (t.state == "minimized" && t.controls.firstChild.title == "Restore") { //If window exists and is currently minimized?
      t.controls.firstChild.setAttribute("src", dhtmlwindow.imagefiles[0]) //Change "restore" icon within window interface to "minimize" icon
      t.controls.firstChild.setAttribute("title", "Minimize")
      t.state = "fullview" //indicate the state of the window as being "fullview"
    }
    return t
  },
  setSize: function(t, w, h) { //set window size (min is 150px wide by 100px tall)
    t.style.width = Math.max(parseInt(w), 150) + "px"
    t.contentarea.style.height = Math.max(parseInt(h), 100) + "px"
  },
  moveTo: function(t, x, y) { //move window. Position includes current viewpoint of document
    this.getviewpoint() //Get current viewpoint numbers
    t.style.left = (x == "middle") ? this.scroll_left + (this.docwidth - t.offsetWidth) / 2 + "px" : this.scroll_left + parseInt(x) + "px"
    t.style.top = (y == "middle") ? this.scroll_top + (this.docheight - t.offsetHeight) / 2 + "px" : this.scroll_top + parseInt(y) + "px"
  },
  isResize: function(t, bol) { //show or hide resize inteface (part of the status bar)
    t.statusarea.style.display = (bol) ? "block" : "none"
    t.resizeBool = (bol) ? 1 : 0
  },
  isScrolling: function(t, bol) { //set whether loaded content contains scrollbars
    t.contentarea.style.overflow = (bol) ? "auto" : "hidden"
  },
  load: function(t, contenttype, contentsource, title) { //loads content into window plus set its title (3 content types: "inline", "iframe", or "ajax")
    if (t.isClosed) {
      jAlert("DHTML Window has been closed, so no window to load contents into. Open/Create the window again.")
      return
    }
    var contenttype = contenttype.toLowerCase() //convert string to lower case
    if (typeof title != "undefined") t.handle.firstChild.nodeValue = title
    if (contenttype == "inline") t.contentarea.innerHTML = contentsource
    else if (contenttype == "div") {
      var inlinedivref = document.getElementById(contentsource)
      t.contentarea.innerHTML = (inlinedivref.defaultHTML || inlinedivref.innerHTML) //Populate window with contents of inline div on page
      if (!inlinedivref.defaultHTML) inlinedivref.defaultHTML = inlinedivref.innerHTML //save HTML within inline DIV
      inlinedivref.innerHTML = "" //then, remove HTML within inline DIV (to prevent duplicate IDs, NAME attributes etc in contents of DHTML window
      inlinedivref.style.display = "none" //hide that div
    } else if (contenttype == "iframe") {
      t.contentarea.style.overflow = "hidden" //disable window scrollbars, as iframe already contains scrollbars
      if (!t.contentarea.firstChild || t.contentarea.firstChild.tagName != "IFRAME") //If iframe tag doesn't exist already, create it first
      t.contentarea.innerHTML = '<iframe src="" style="margin:0; padding:0; width:100%; height: 100%" name="_iframe-' + t.id + '"></iframe>'
      window.frames["_iframe-" + t.id].location.replace(contentsource) //set location of iframe window to specified URL
    } else if (contenttype == "ajax") {
      this.ajax_connect(contentsource, t) //populate window with external contents fetched via Ajax
    }
    t.contentarea.datatype = contenttype //store contenttype of current window for future reference
  },
  setupdrag: function(e) {
    var d = dhtmlwindow //reference dhtml window object
    var t = this._parent //reference dhtml window div
    d.etarget = this //remember div mouse is currently held down on ("handle" or "resize" div)
    var e = window.event || e
    d.initmousex = e.clientX //store x position of mouse onmousedown
    d.initmousey = e.clientY
    d.initx = parseInt(t.offsetLeft) //store offset x of window div onmousedown
    d.inity = parseInt(t.offsetTop)
    d.width = parseInt(t.offsetWidth) //store width of window div
    d.contentheight = parseInt(t.contentarea.offsetHeight) //store height of window div's content div
    if (t.contentarea.datatype == "iframe") { //if content of this window div is "iframe"
      t.style.backgroundColor = "#F8F8F8" //colorize and hide content div (while window is being dragged)
      t.contentarea.style.visibility = "hidden"
    }
    document.onmousemove = d.getdistance //get distance travelled by mouse as it moves
    document.onmouseup = function() {
      if (t.contentarea.datatype == "iframe") { //restore color and visibility of content div onmouseup
        t.contentarea.style.backgroundColor = "white"
        t.contentarea.style.visibility = "visible"
      }
      d.stop()
    }
    return false
  },
  getdistance: function(e) {
    var d = dhtmlwindow
    var etarget = d.etarget
    var e = window.event || e
    d.distancex = e.clientX - d.initmousex //horizontal distance travelled relative to starting point
    d.distancey = e.clientY - d.initmousey
    if (etarget.className == "drag-handle") //if target element is "handle" div
    d.move(etarget._parent, e)
    else if (etarget.className == "drag-resizearea") //if target element is "resize" div
    d.resize(etarget._parent, e)
    return false //cancel default dragging behavior
  },
  getviewpoint: function() { //get window viewpoint numbers
    var ie = document.all && !window.opera
    var domclientWidth = document.documentElement && parseInt(document.documentElement.clientWidth) || 100000 //Preliminary doc width in non IE browsers
    this.standardbody = (document.compatMode == "CSS1Compat") ? document.documentElement : document.body //create reference to common "body" across doctypes
    this.scroll_top = (ie) ? this.standardbody.scrollTop : window.pageYOffset
    this.scroll_left = (ie) ? this.standardbody.scrollLeft : window.pageXOffset
    this.docwidth = (ie) ? this.standardbody.clientWidth : (/Safari/i.test(navigator.userAgent)) ? window.innerWidth : Math.min(domclientWidth, window.innerWidth - 16)
    this.docheight = (ie) ? this.standardbody.clientHeight : window.innerHeight
  },
  rememberattrs: function(t) { //remember certain attributes of the window when it's minimized or closed, such as dimensions, position on page
    this.getviewpoint() //Get current window viewpoint numbers
    t.lastx = parseInt((t.style.left || t.offsetLeft)) - dhtmlwindow.scroll_left //store last known x coord of window just before minimizing
    t.lasty = parseInt((t.style.top || t.offsetTop)) - dhtmlwindow.scroll_top
    t.lastwidth = parseInt(t.style.width) //store last known width of window just before minimizing/ closing
  },
  move: function(t, e) {
    t.style.left = dhtmlwindow.distancex + dhtmlwindow.initx + "px"
    t.style.top = dhtmlwindow.distancey + dhtmlwindow.inity + "px"
  },
  resize: function(t, e) {
    t.style.width = Math.max(dhtmlwindow.width + dhtmlwindow.distancex, 150) + "px"
    t.contentarea.style.height = Math.max(dhtmlwindow.contentheight + dhtmlwindow.distancey, 100) + "px"
  },
  enablecontrols: function(e) {
    var d = dhtmlwindow
    var sourceobj = window.event ? window.event.srcElement : e.target //Get element within "handle" div mouse is currently on (the controls)
    if (/Minimize/i.test(sourceobj.getAttribute("title"))) //if this is the "minimize" control
    d.minimize(sourceobj, this._parent)
    else if (/Restore/i.test(sourceobj.getAttribute("title"))) //if this is the "restore" control
    d.restore(sourceobj, this._parent)
    else if (/Close/i.test(sourceobj.getAttribute("title"))) //if this is the "close" control
    d.close(this._parent)
    return false
  },
  minimize: function(button, t) {
    dhtmlwindow.rememberattrs(t)
    button.setAttribute("src", dhtmlwindow.imagefiles[2])
    button.setAttribute("title", "Restore")
    t.state = "minimized" //indicate the state of the window as being "minimized"
    t.contentarea.style.display = "none"
    t.statusarea.style.display = "none"
    if (typeof t.minimizeorder == "undefined") { //stack order of minmized window on screen relative to any other minimized windows
      dhtmlwindow.minimizeorder++ //increment order
      t.minimizeorder = dhtmlwindow.minimizeorder
    }
    t.style.left = "10px" //left coord of minmized window
    t.style.width = "200px"
    var windowspacing = t.minimizeorder * 10 //spacing (gap) between each minmized window(s)
    t.style.top = dhtmlwindow.scroll_top + dhtmlwindow.docheight - (t.handle.offsetHeight * t.minimizeorder) - windowspacing + "px"
  },
  restore: function(button, t) {
    dhtmlwindow.getviewpoint()
    button.setAttribute("src", dhtmlwindow.imagefiles[0])
    button.setAttribute("title", "Minimize")
    t.state = "fullview" //indicate the state of the window as being "fullview"
    t.style.display = "block"
    t.contentarea.style.display = "block"
    if (t.resizeBool) //if this window is resizable, enable the resize icon
    t.statusarea.style.display = "block"
    t.style.left = parseInt(t.lastx) + dhtmlwindow.scroll_left + "px" //position window to last known x coord just before minimizing
    t.style.top = parseInt(t.lasty) + dhtmlwindow.scroll_top + "px"
    t.style.width = parseInt(t.lastwidth) + "px"
  },
  close: function(t) {
    try {
      var closewinbol = t.onclose()
    } catch (err) { //In non IE browsers, all errors are caught, so just run the below
      var closewinbol = true
    } finally { //In IE, not all errors are caught, so check if variable isn't defined in IE in those cases
      if (typeof closewinbol == "undefined") {
        jAlert("An error has occured somwhere inside your \"onclose\" event handler")
        var closewinbol = true
      }
    }
    if (closewinbol) { //if custom event handler function returns true
      if (t.state != "minimized") //if this window isn't currently minimized
      dhtmlwindow.rememberattrs(t) //remember window's dimensions/position on the page before closing
      if (window.frames["_iframe-" + t.id]) //if this is an IFRAME DHTML window
      window.frames["_iframe-" + t.id].location.replace("about:blank")
      else
      t.contentarea.innerHTML = ""
      t.style.display = "none"
      t.isClosed = true //tell script this window is closed (for detection in t.show())
    }
    return closewinbol
  },
  setopacity: function(targetobject, value) { //Sets the opacity of targetobject based on the passed in value setting (0 to 1 and in between)
    if (!targetobject) return
    if (targetobject.filters && targetobject.filters[0]) { //IE syntax
      if (typeof targetobject.filters[0].opacity == "number") //IE6
      targetobject.filters[0].opacity = value * 100
      else //IE 5.5
      targetobject.style.filter = "alpha(opacity=" + value * 100 + ")"
    } else if (typeof targetobject.style.MozOpacity != "undefined") //Old Mozilla syntax
    targetobject.style.MozOpacity = value
    else if (typeof targetobject.style.opacity != "undefined") //Standard opacity syntax
    targetobject.style.opacity = value
  },
  setfocus: function(t) { //Sets focus to the currently active window
    this.zIndexvalue++
    t.style.zIndex = this.zIndexvalue
    t.isClosed = false //tell script this window isn't closed (for detection in t.show())
    this.setopacity(this.lastactivet.handle, 0.5) //unfocus last active window
    this.setopacity(t.handle, 1) //focus currently active window
    this.lastactivet = t //remember last active window
  },
  show: function(t) {
    if (t.isClosed) {
      jAlert("DHTML Window has been closed, so nothing to show. Open/Create the window again.")
      return
    }
    if (t.lastx) //If there exists previously stored information such as last x position on window attributes (meaning it's been minimized or closed)
    dhtmlwindow.restore(t.controls.firstChild, t) //restore the window using that info
    else
    t.style.display = "block"
    this.setfocus(t)
    t.state = "fullview" //indicate the state of the window as being "fullview"
  },
  hide: function(t) {
    t.style.display = "none"
  },
  ajax_connect: function(url, t) {
    var page_request = false
    var bustcacheparameter = ""
    if (window.XMLHttpRequest) // if Mozilla, IE7, Safari etc
    page_request = new XMLHttpRequest()
    else if (window.ActiveXObject) { // if IE6 or below
      try {
        page_request = new ActiveXObject("Msxml2.XMLHTTP")
      } catch (e) {
        try {
          page_request = new ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
      }
    } else
    return false
    t.contentarea.innerHTML = this.ajaxloadinghtml
    page_request.onreadystatechange = function() {
      dhtmlwindow.ajax_loadpage(page_request, t)
    }
    if (this.ajaxbustcache) //if bust caching of external page
    bustcacheparameter = (url.indexOf("?") != -1) ? "&" + new Date().getTime() : "?" + new Date().getTime()
    page_request.open('GET', url + bustcacheparameter, true)
    page_request.send(null)
  },
  ajax_loadpage: function(page_request, t) {
    if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1)) {
      t.contentarea.innerHTML = page_request.responseText
    }
  },
  stop: function() {
    dhtmlwindow.etarget = null //clean up
    document.onmousemove = null
    document.onmouseup = null
  },
  addEvent: function(target, functionref, tasktype) { //assign a function to execute to an event handler (ie: onunload)
    var tasktype = (window.addEventListener) ? tasktype : "on" + tasktype
    if (target.addEventListener) target.addEventListener(tasktype, functionref, false)
    else if (target.attachEvent) target.attachEvent(tasktype, functionref)
  },
  cleanup: function() {
    for (var i = 0; i < dhtmlwindow.tobjects.length; i++) {
      dhtmlwindow.tobjects[i].handle._parent = dhtmlwindow.tobjects[i].resizearea._parent = dhtmlwindow.tobjects[i].controls._parent = null
    }
    window.onload = null
  }
} //End dhtmlwindow object
document.write('<div id="dhtmlwindowholder"><span style="display:none">.</span></div>') //container that holds all dhtml window divs on page
window.onunload = dhtmlwindow.cleanup
//** Ajax Tabs Content script v2.0- © Dynamic Drive DHTML code library (http://www.dynamicdrive.com)
//** Updated Oct 21st, 07 to version 2.0. Contains numerous improvements
//** Updated Feb 18th, 08 to version 2.1: Adds a public "tabinstance.cycleit(dir)" method to cycle forward or backward between tabs dynamically. Only .js file changed from v2.0.
//** Updated April 8th, 08 to version 2.2:
//   -Adds support for expanding a tab using a URL parameter (ie: http://mysite.com/tabcontent.htm?tabinterfaceid=0) 
//   -fiModified Ajax routine so testing the script out locally in IE7 now works 
var ddajaxtabssettings = {}
ddajaxtabssettings.bustcachevar = 1 //bust potential caching of external pages after initial request? (1=yes, 0=no)
ddajaxtabssettings.loadstatustext = "Loading..."
////NO NEED TO EDIT BELOW////////////////////////
function ddajaxtabs(tabinterfaceid, contentdivid) {
  this.tabinterfaceid = tabinterfaceid //ID of Tab Menu main container
  this.tabs = document.getElementById(tabinterfaceid).getElementsByTagName("a") //Get all tab links within container
  this.enabletabpersistence = true
  this.hottabspositions = [] //Array to store position of tabs that have a "rel" attr defined, relative to all tab links, within container
  this.currentTabIndex = 0 //Index of currently selected hot tab (tab with sub content) within hottabspositions[] array
  this.contentdivid = contentdivid
  this.defaultHTML = ""
  this.defaultIframe = '<iframe src="about:blank" marginwidth="0" marginheight="0" frameborder="0" vspace="0" hspace="0" class="tabcontentiframe" style="width:100%; height:auto; min-height: 100px"></iframe>'
  this.defaultIframe = this.defaultIframe.replace(/<iframe/i, '<iframe name="' + "_ddajaxtabsiframe-" + contentdivid + '" ')
  this.revcontentids = [] //Array to store ids of arbitrary contents to expand/contact as well ("rev" attr values)
  this.selectedClassTarget = "link" //keyword to indicate which target element to assign "selected" CSS class ("linkparent" or "link")
}
ddajaxtabs.connect = function(pageurl, tabinstance) {
  var page_request = false
  var bustcacheparameter = ""
  if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
    try {
      page_request = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {
      try {
        page_request = new ActiveXObject("Microsoft.XMLHTTP")
      } catch (e) {}
    }
  } else if (window.XMLHttpRequest) // if Mozilla, Safari etc
  page_request = new XMLHttpRequest()
  else
  return false
  var params = "";
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  var ajaxfriendlyurl = pageurl.replace(/^http:\/\/[^\/]+\//i, "http://" + window.location.hostname + "/")
  page_request.onreadystatechange = function() {
    ddajaxtabs.loadpage(page_request, pageurl, tabinstance)
  }
  if (ddajaxtabssettings.bustcachevar) //if bust caching of external page
  bustcacheparameter = (ajaxfriendlyurl.indexOf("?") != -1) ? "&" + new Date().getTime() : "?" + new Date().getTime() //
  // page_request.open('GET', ajaxfriendlyurl+bustcacheparameter, true)
  // page_request.send(null)
  page_request.open('POST', ajaxfriendlyurl, true);
  page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  page_request.setRequestHeader("Content-length", params.length);
  page_request.setRequestHeader("Connection", "close");
  page_request.send(params);
}
ddajaxtabs.loadpage = function(page_request, pageurl, tabinstance) {
  var divId = tabinstance.contentdivid
  document.getElementById(divId).innerHTML = ddajaxtabssettings.loadstatustext //Display "fetching page message"
  if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1)) {
    document.getElementById(divId).innerHTML = page_request.responseText
    ddajaxtabs.ajaxpageloadaction(pageurl, tabinstance)
  }
}
ddajaxtabs.ajaxpageloadaction = function(pageurl, tabinstance) {
  tabinstance.onajaxpageload(pageurl) //call user customized onajaxpageload() function when an ajax page is fetched/ loaded
}
ddajaxtabs.getCookie = function(Name) {
  var re = new RegExp(Name + "=[^;]+", "i"); //construct RE to search for target name/value pair
  if (document.cookie.match(re)) //if cookie found
  return document.cookie.match(re)[0].split("=")[1] //return its value
  return ""
}
ddajaxtabs.setCookie = function(name, value) {
  document.cookie = name + "=" + value + ";path=/" //cookie value is domain wide (path=/)
}
ddajaxtabs.prototype = {
  expandit: function(tabid_or_position) { //PUBLIC function to select a tab either by its ID or position(int) within its peers
    this.cancelautorun() //stop auto cycling of tabs (if running)
    var tabref = ""
    try {
      if (typeof tabid_or_position == "string" && document.getElementById(tabid_or_position).getAttribute("rel")) //if specified tab contains "rel" attr
      tabref = document.getElementById(tabid_or_position)
      else if (parseInt(tabid_or_position) != NaN && this.tabs[tabid_or_position].getAttribute("rel")) //if specified tab contains "rel" attr
      tabref = this.tabs[tabid_or_position]
    } catch (err) {
      jAlert("Invalid Tab ID or position entered!")
    }
    if (tabref != "") //if a valid tab is found based on function parameter
    this.expandtab(tabref) //expand this tab
  },
  cycleit: function(dir, autorun) { //PUBLIC function to move foward or backwards through each hot tab (tabinstance.cycleit('foward/back') )
    if (dir == "next") {
      var currentTabIndex = (this.currentTabIndex < this.hottabspositions.length - 1) ? this.currentTabIndex + 1 : 0
    } else if (dir == "prev") {
      var currentTabIndex = (this.currentTabIndex > 0) ? this.currentTabIndex - 1 : this.hottabspositions.length - 1
    }
    if (typeof autorun == "undefined") //if cycleit() is being called by user, versus autorun() function
    this.cancelautorun() //stop auto cycling of tabs (if running)
    this.expandtab(this.tabs[this.hottabspositions[currentTabIndex]])
  },
  setpersist: function(bool) { //PUBLIC function to toggle persistence feature
    this.enabletabpersistence = bool
  },
  loadajaxpage: function(pageurl) { //PUBLIC function to fetch a page via Ajax and display it within the Tab Content instance's container
    ddajaxtabs.connect(pageurl, this)
  },
  loadiframepage: function(pageurl) { //PUBLIC function to fetch a page and load it into the IFRAME of the Tab Content instance's container
    this.iframedisplay(pageurl, this.contentdivid)
  },
  setselectedClassTarget: function(objstr) { //PUBLIC function to set which target element to assign "selected" CSS class ("linkparent" or "link")
    this.selectedClassTarget = objstr || "link"
  },
  getselectedClassTarget: function(tabref) { //Returns target element to assign "selected" CSS class to
    return (this.selectedClassTarget == ("linkparent".toLowerCase())) ? tabref.parentNode : tabref
  },
  urlparamselect: function(tabinterfaceid) {
    var result = window.location.search.match(new RegExp(tabinterfaceid + "=(\\d+)", "i")) //check for "?tabinterfaceid=2" in URL
    return (result == null) ? null : parseInt(RegExp.$1) //returns null or index, where index (int) is the selected tab's index
  },
  onajaxpageload: function(pageurl) { //PUBLIC Event handler that can invoke custom code whenever an Ajax page has been fetched and displayed
    //do nothing by default
  },
  expandtab: function(tabref) {
    var relattrvalue = tabref.getAttribute("rel")
    //Get "rev" attr as a string of IDs in the format ",john,george,trey,etc," to easy searching through
    var associatedrevids = (tabref.getAttribute("rev")) ? "," + tabref.getAttribute("rev").replace(/\s+/, "") + "," : ""
    if (relattrvalue == "#default") document.getElementById(this.contentdivid).innerHTML = this.defaultHTML
    else if (relattrvalue == "#iframe") this.iframedisplay(tabref.getAttribute("href"), this.contentdivid)
    else
    ddajaxtabs.connect(tabref.getAttribute("href"), this)
    this.expandrevcontent(associatedrevids)
    for (var i = 0; i < this.tabs.length; i++) { //Loop through all tabs, and assign only the selected tab the CSS class "selected"
      this.getselectedClassTarget(this.tabs[i]).className = (this.tabs[i].getAttribute("href") == tabref.getAttribute("href")) ? "selected" : ""
    }
    if (this.enabletabpersistence) //if persistence enabled, save selected tab position(int) relative to its peers
    ddajaxtabs.setCookie(this.tabinterfaceid, tabref.tabposition)
    this.setcurrenttabindex(tabref.tabposition) //remember position of selected tab within hottabspositions[] array
  },
  iframedisplay: function(pageurl, contentdivid) {
    if (typeof window.frames["_ddajaxtabsiframe-" + contentdivid] != "undefined") {
      try {
        delete window.frames["_ddajaxtabsiframe-" + contentdivid]
      } //delete iframe within Tab content container if it exists (due to bug in Firefox)
      catch (err) {}
    }
    document.getElementById(contentdivid).innerHTML = this.defaultIframe
    window.frames["_ddajaxtabsiframe-" + contentdivid].location.replace(pageurl) //load desired page into iframe
  },
  expandrevcontent: function(associatedrevids) {
    var allrevids = this.revcontentids
    for (var i = 0; i < allrevids.length; i++) { //Loop through rev attributes for all tabs in this tab interface
      //if any values stored within associatedrevids matches one within allrevids, expand that DIV, otherwise, contract it
      document.getElementById(allrevids[i]).style.display = (associatedrevids.indexOf("," + allrevids[i] + ",") != -1) ? "block" : "none"
    }
  },
  setcurrenttabindex: function(tabposition) { //store current position of tab (within hottabspositions[] array)
    for (var i = 0; i < this.hottabspositions.length; i++) {
      if (tabposition == this.hottabspositions[i]) {
        this.currentTabIndex = i
        break
      }
    }
  },
  autorun: function() { //function to auto cycle through and select tabs based on a set interval
    this.cycleit('next', true)
  },
  cancelautorun: function() {
    if (typeof this.autoruntimer != "undefined") clearInterval(this.autoruntimer)
  },
  init: function(automodeperiod) {
    var persistedtab = ddajaxtabs.getCookie(this.tabinterfaceid) //get position of persisted tab (applicable if persistence is enabled)
    var selectedtab = -1 //Currently selected tab index (-1 meaning none)
    var selectedtabfromurl = this.urlparamselect(this.tabinterfaceid) //returns null or index from: tabcontent.htm?tabinterfaceid=index
    this.automodeperiod = automodeperiod || 0
    this.defaultHTML = document.getElementById(this.contentdivid).innerHTML
    for (var i = 0; i < this.tabs.length; i++) {
      this.tabs[i].tabposition = i //remember position of tab relative to its peers
      if (this.tabs[i].getAttribute("rel")) {
        var tabinstance = this
        this.hottabspositions[this.hottabspositions.length] = i //store position of "hot" tab ("rel" attr defined) relative to its peers
        this.tabs[i].onclick = function() {
          tabinstance.expandtab(this)
          tabinstance.cancelautorun() //stop auto cycling of tabs (if running)
          return false
        }
        if (this.tabs[i].getAttribute("rev")) { //if "rev" attr defined, store each value within "rev" as an array element
          this.revcontentids = this.revcontentids.concat(this.tabs[i].getAttribute("rev").split(/\s*,\s*/))
        }
        if (selectedtabfromurl == i || this.enabletabpersistence && selectedtab == -1 && parseInt(persistedtab) == i || !this.enabletabpersistence && selectedtab == -1 && this.getselectedClassTarget(this.tabs[i]).className == "selected") {
          selectedtab = i //Selected tab index, if found
        }
      }
    } //END for loop
    if (selectedtab != -1) //if a valid default selected tab index is found
    this.expandtab(this.tabs[selectedtab]) //expand selected tab (either from URL parameter, persistent feature, or class="selected" class)
    else //if no valid default selected index found
    this.expandtab(this.tabs[this.hottabspositions[0]]) //Just select first tab that contains a "rel" attr
    if (parseInt(this.automodeperiod) > 500 && this.hottabspositions.length > 1) {
      this.autoruntimer = setInterval(function() {
        tabinstance.autorun()
      }, this.automodeperiod)
    }
  } //END int() function
} //END Prototype assignment
/***********************************************
 * Show Hint script- © Dynamic Drive (www.dynamicdrive.com)
 * This notice MUST stay intact for legal use
 * Visit http://www.dynamicdrive.com/ for this script and 100s more.
 ***********************************************/
var horizontal_offset = "9px" //horizontal offset of hint box from anchor link
/////No further editting needed
var vertical_offset = "0" //horizontal offset of hint box from anchor link. No need to change.
var ie = document.all
var ns6 = document.getElementById && !document.all
function getposOffset(what, offsettype) {
  var totaloffset = (offsettype == "left") ? what.offsetLeft : what.offsetTop;
  var parentEl = what.offsetParent;
  while (parentEl != null) {
    totaloffset = (offsettype == "left") ? totaloffset + parentEl.offsetLeft : totaloffset + parentEl.offsetTop;
    parentEl = parentEl.offsetParent;
  }
  return totaloffset;
}
function iecompattest() {
  return (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body
}
function clearbrowseredge(obj, whichedge) {
  var edgeoffset = (whichedge == "rightedge") ? parseInt(horizontal_offset) * -1 : parseInt(vertical_offset) * -1
  if (whichedge == "rightedge") {
    var windowedge = ie && !window.opera ? iecompattest().scrollLeft + iecompattest().clientWidth - 30 : window.pageXOffset + window.innerWidth - 40
    dropmenuobj.contentmeasure = dropmenuobj.offsetWidth
    if (windowedge - dropmenuobj.x < dropmenuobj.contentmeasure) edgeoffset = dropmenuobj.contentmeasure + obj.offsetWidth + parseInt(horizontal_offset)
  } else {
    var windowedge = ie && !window.opera ? iecompattest().scrollTop + iecompattest().clientHeight - 15 : window.pageYOffset + window.innerHeight - 18
    dropmenuobj.contentmeasure = dropmenuobj.offsetHeight
    if (windowedge - dropmenuobj.y < dropmenuobj.contentmeasure) edgeoffset = dropmenuobj.contentmeasure - obj.offsetHeight
  }
  return edgeoffset
}
function showhint(menucontents, obj, e, tipwidth) {
  if ((ie || ns6) && document.getElementById("hintbox")) {
    dropmenuobj = document.getElementById("hintbox")
    dropmenuobj.innerHTML = menucontents
    dropmenuobj.style.left = dropmenuobj.style.top = -500
    if (tipwidth != "") {
      dropmenuobj.widthobj = dropmenuobj.style
      dropmenuobj.widthobj.width = tipwidth
    }
    dropmenuobj.x = getposOffset(obj, "left")
    dropmenuobj.y = getposOffset(obj, "top")
    dropmenuobj.style.left = dropmenuobj.x - clearbrowseredge(obj, "rightedge") + obj.offsetWidth + "px"
    dropmenuobj.style.top = dropmenuobj.y - clearbrowseredge(obj, "bottomedge") + "px"
    dropmenuobj.style.visibility = "visible"
    obj.onmouseout = hidetip
  }
}
function hidetip(e) {
  dropmenuobj.style.visibility = "hidden"
  dropmenuobj.style.left = "-500px"
}
function createhintbox() {
  var divblock = document.createElement("div")
  divblock.setAttribute("id", "hintbox")
  document.body.appendChild(divblock)
}
if (window.addEventListener) window.addEventListener("load", createhintbox, false)
else if (window.attachEvent) window.attachEvent("onload", createhintbox)
else if (document.getElementById) window.onload = createhintbox
//added widgetload function via jquery 7-16-11
function widgetload_old(pageurl, targetname) {
  var params = "";
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    data: params,
    dataType: "html",
    success: function(data) {
      $(targetname).html(data);
      // alert('Load was performed.');
    }
  });
}
//added showhint ajax to load a page via ajax
function showhintajax(pageurl, obj, e, tipwidth) {
  x = getposOffset(obj, "left")
  y = getposOffset(obj, "top")
  pleft = x + 20 + obj.offsetWidth + "px"; // added 20px padding plus offset
  // ptop=y+"px"
  ptop = "40px"; // hardcode 130 as top.. 
  pleft = "300px"; //hardcode 300 as left
  if ($("#mouseoverhintbox").length) {} else {
    var divblock = document.createElement("div");
    divblock.setAttribute("id", "mouseoverhintbox");
    document.body.appendChild(divblock);
  }
  $("#mouseoverhintbox").css({
    "position": "fixed",
    "top": ptop,
    "left": pleft
  });
  $('#mouseoverhintbox').html("<div id=Loader></div>");
  $("#mouseoverhintbox").fadeIn("fast");
  var params = "";
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    data: params,
    dataType: "html",
    success: function(data) {
      $('#mouseoverhintbox').html(data);
      // alert('Load was performed.');
      // $("#mouseoverhintbox").fadeIn("fast");
    }
  });
  obj.onmouseout = closepopup;
  //makepopup(url,pleft,ptop) ;
  // clickbool=0 ;
  // ajaxwin=dhtmlwindow.open("popupbox", "ajax", url, "Product Information", "width=400px,height=500px,left="+pleft+",top="+ptop+",resize=0,scrolling=0") ;
  // if (typeof ajaxwin.mouseoverDHTMLWindow=="undefined")
  // ajaxwin.mouseoverDHTMLWindow=0
  // ajaxwin.clickbool=clickbool
  //  ajaxwin.onclose=function(){
  //   this.clickbool=0
  //   return true;
  //  }
  //
  //ajaxwin.onmouseover=function(){
  //this.mouseoverDHTMLWindow=1
  //this.moveTo(pleft, ptop)
  //}
  //ajaxwin.onmouseout=function(){
  //this.mouseoverDHTMLWindow=0
  //}
  //
  //obj.onmouseout=closepopup ;
  //
  //var divblock=document.createElement("div")
  //divblock.setAttribute("id", "hintbox")
  //$.ajax({
  //   type: "POST",
  //   url: "some.php",
  //  data: "name=John&location=Boston",
  //   success: function(msg){
  //     alert( "Data Saved: " + msg );
  //   }
  // });
}
var bustcachevar = 1 //bust potential caching of external pages after initial request? (1=yes, 0=no)
var loadedobjects = ""
var rootdomain = "http://" + window.location.hostname
var bustcacheparameter = ""
function ajaxpage(pageurl, containerid) {
  var page_request = false
  if (window.XMLHttpRequest) // if Mozilla, Safari etc
  page_request = new XMLHttpRequest()
  else if (window.ActiveXObject) { // if IE
    try {
      page_request = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {
      try {
        page_request = new ActiveXObject("Microsoft.XMLHTTP")
      } catch (e) {}
    }
  } else
  return false
  page_request.onreadystatechange = function() {
    loadpage(page_request, containerid)
  }
  var params = "";
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  var ajaxfriendlyurl = pageurl.replace(/^http:\/\/[^\/]+\//i, "http://" + window.location.hostname + "/")
  page_request.onreadystatechange = function() {
    loadpage(page_request, containerid)
  }
  if (bustcachevar) //if bust caching of external page
  bustcacheparameter = (ajaxfriendlyurl.indexOf("?") != -1) ? "&" + new Date().getTime() : "?" + new Date().getTime() //
  // page_request.open('GET', ajaxfriendlyurl+bustcacheparameter, true)
  // page_request.send(null)
  page_request.open('POST', ajaxfriendlyurl, true);
  page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  page_request.setRequestHeader("Content-length", params.length);
  page_request.setRequestHeader("Connection", "close");
  page_request.send(params);
}
function loadpage(page_request, containerid) {
  if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1)) document.getElementById(containerid).innerHTML = page_request.responseText
}
// tsh date picker code
// Title: Timestamp picker
// Description: See the demo at url
// URL: http://www.geocities.com/tspicker/
// Version: 1.0.a (Date selector only) reworked by Richard Perry
// Date: 12-12-2001 (mm-dd-yyyy)
// Author: Denis Gritcyuk <denis@softcomplex.com>; <tspicker@yahoo.com>
// Notes: Permission given to use this script in any kind of applications if
//    header lines are left unchanged. Feel free to contact the author
//    for feature requests and/or donations
// Version 2.0 (Date selector only with mouseover on dates, added image-path) 
// Date: 03-31-2002 (mm-dd-yyyy)
// reworked by The Systems House, Inc. (www.tshinc.com)
function show_calendar4x(str_target, str_datetime, image_path) {
  var arr_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var week_days = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
  var n_weekstart = 0; // day week starts from (normally 0 or 1)
  var dt_datetime = (str_datetime == null || str_datetime == "" ? new Date() : str2dt4x(str_datetime));
  var dt_prev_month = new Date(dt_datetime);
  dt_prev_month.setMonth(dt_datetime.getMonth() - 1);
  if (dt_datetime.getMonth() % 12 != (dt_prev_month.getMonth() + 1) % 12) {
    dt_prev_month.setMonth(dt_datetime.getMonth());
    dt_prev_month.setDate(0);
  }
  var dt_next_month = new Date(dt_datetime);
  dt_next_month.setMonth(dt_datetime.getMonth() + 1);
  if ((dt_datetime.getMonth() + 1) % 12 != dt_next_month.getMonth() % 12) dt_next_month.setDate(0);
  var dt_prev_year = new Date(dt_datetime);
  //dt_prev_year.setYear(dt_datetime.getYear()-1);
  dt_prev_year.setYear(dt_datetime.getFullYear() - 1);
  var dt_next_year = new Date(dt_datetime);
  //dt_next_year.setYear(dt_datetime.getYear()+1);
  dt_next_year.setYear(dt_datetime.getFullYear() + 1);
  var dt_firstday = new Date(dt_datetime);
  dt_firstday.setDate(1);
  dt_firstday.setDate(1 - (7 + dt_firstday.getDay() - n_weekstart) % 7);
  var dt_lastday = new Date(dt_next_month);
  dt_lastday.setDate(0);
  // html generation (feel free to tune it for your particular application)
  // print calendar header
  var str_buffer = new String("<html>\n" + "<head>\n" + "<title>Calendar</title>\n" + "</head>\n" + "<body bgcolor=\"White\">\n" + "<table class=\"clsOTable\" cellspacing=\"0\" border=\"0\" width=\"100%\">\n" + "<tr><td bgcolor=\"#4682B4\">\n" + "<table cellspacing=\"1\" cellpadding=\"3\" border=\"0\" width=\"100%\">\n" + "<tr>\n" + "  <td bgcolor=\"#4682B4\"><a href=\"javascript:window.opener.show_calendar4x('" + str_target + "', '" + dt2dtstr4x(dt_prev_year) + "', '" + image_path + "');\">" + "<img src=\"" + image_path + "prev_year.gif\" width=\"16\" height=\"16\" border=\"0\"" + " alt=\"Previous Year\"></a></td>\n" + "  <td bgcolor=\"#4682B4\"><a href=\"javascript:window.opener.show_calendar4x('" + str_target + "', '" + dt2dtstr4x(dt_prev_month) + "', '" + image_path + "');\">" + "<img src=\"" + image_path + "prev.gif\" width=\"16\" height=\"16\" border=\"0\"" + " alt=\"Previous Month\"></a></td>\n" + "  <td bgcolor=\"#4682B4\" colspan=\"3\">" + "<font color=\"white\" face=\"arial, verdana\" size=\"1\">" + arr_months[dt_datetime.getMonth()] + " " + dt_datetime.getFullYear() + "</font></td>\n" + "  <td bgcolor=\"#4682B4\" align=\"right\"><a href=\"javascript:window.opener.show_calendar4x('" + str_target + "', '" + dt2dtstr4x(dt_next_month) + "', '" + image_path + "');\">" + "<img src=\"" + image_path + "next.gif\" width=\"16\" height=\"16\" border=\"0\"" + " alt=\"Next Month\"></a></td>\n" + "  <td bgcolor=\"#4682B4\" align=\"right\"><a href=\"javascript:window.opener.show_calendar4x('" + str_target + "', '" + dt2dtstr4x(dt_next_year) + "', '" + image_path + "');\">" + "<img src=\"" + image_path + "next_year.gif\" width=\"16\" height=\"16\" border=\"0\"" + " alt=\"Next Year\"></a></td>\n" + "</tr>\n");
  var dt_current_day = new Date(dt_firstday);
  // print weekdays titles
  str_buffer += "<tr>\n";
  for (var n = 0; n < 7; n++)
  str_buffer += "  <td bgcolor=\"#87CEFA\"><b>" + "<font color=\"white\" face=\"arial, verdana\" size=\"2\">" + week_days[(n_weekstart + n) % 7] + "</font></b></td>\n";
  // print calendar table
  str_buffer += "</tr>\n";
  while (dt_current_day.getMonth() == dt_datetime.getMonth() || dt_current_day.getMonth() == dt_firstday.getMonth()) {
    // print row header
    str_buffer += "<tr>\n";
    for (var n_current_wday = 0; n_current_wday < 7; n_current_wday++) {
      if (dt_current_day.getDate() == dt_datetime.getDate() && dt_current_day.getMonth() == dt_datetime.getMonth())
      // print current date
      str_buffer += "  <td bgcolor=\"#FFB6C1\" align=\"right\"" + " onMouseOver=\"this.style.backgroundColor='#FFB6C1'\"" + " onMouseOut=\"this.style.backgroundColor='#FFB6C1'\" >";
      else if (dt_current_day.getDay() == 0 || dt_current_day.getDay() == 6)
      // weekend days
      str_buffer += "  <td bgcolor=\"#DBEAF5\" align=\"right\"" + " onMouseOver=\"this.style.backgroundColor='#FFB6C1'\"" + " onMouseOut=\"this.style.backgroundColor='#DBEAF5'\" >";
      else
      // print working days of current month
      str_buffer += "  <td bgcolor=\"white\" align=\"right\"" + " onMouseOver=\"this.style.backgroundColor='#FFB6C1'\"" + " onMouseOut=\"this.style.backgroundColor='white'\" >";
      if (dt_current_day.getMonth() == dt_datetime.getMonth())
      // print days of current month
      str_buffer += "<a href=\"javascript:window.opener." + str_target + ".value='" + dt2dtstr4x(dt_current_day) + "'; window.close();\">" + "<font color=\"black\" face=\"arial, verdana\" size=\"2\">";
      else
      // print days of other months
      str_buffer += "<a href=\"javascript:window.opener." + str_target + ".value='" + dt2dtstr4x(dt_current_day) + "'; window.close();\">" + "<font color=\"gray\" face=\"arial, verdana\" size=\"2\">";
      str_buffer += dt_current_day.getDate() + "</font></a></td>\n";
      dt_current_day.setDate(dt_current_day.getDate() + 1);
    }
    // print row footer
    str_buffer += "</tr>\n";
  }
  // print calendar footer
  str_buffer += "</table>\n" + "</tr>\n</td>\n</table>\n" + "</body>\n" + "</html>\n";
  var vWinCal = window.open("", "Calendar", "width=250,height=210,status=no,resizable=yes,top=220,left=575");
  vWinCal.opener = self;
  vWinCal.focus();
  var calc_doc = vWinCal.document;
  calc_doc.write(str_buffer);
  calc_doc.close();
}
// datetime parsing and formatting routines. modify them if you wish other datetime format
function str2dt4x(str_datetime) {
  var re_date = /^(\d+)\/(\d+)\/(\d+)$/;
  if (!re_date.exec(str_datetime)) return jAlert("Invalid Datetime format: " + str_datetime);
  return (new Date(RegExp.$3, RegExp.$1 - 1, RegExp.$2));
}
function dt2dtstr4x(dt_datetime) {
  return (new String((dt_datetime.getMonth() + 1) + "/" + dt_datetime.getDate() + "/" + dt_datetime.getFullYear()));
}
//tsh veilblock code 
function CreateBlock1() {
  this.Container = document.getElementById("Container") //reference stitial container
  this.Veil = document.getElementById("Veil") //reference veil
  this.standardbody = (document.compatMode == "CSS1Compat") ? document.documentElement : document.body
  //   document.getElementById("Container").innerHTML=msg
  var ie = document.all && !window.opera
  var dom = document.getElementById
  var scroll_top = (ie) ? this.standardbody.scrollTop : window.pageYOffset
  var scroll_left = (ie) ? this.standardbody.scrollLeft : window.pageXOffset
  var docwidth = (ie) ? this.standardbody.clientWidth : window.innerWidth - this.scrollbarwidth
  var docheight = (ie) ? this.standardbody.clientHeight : window.innerHeight
  var docheightcomplete = (this.standardbody.offsetHeight > this.standardbody.scrollHeight) ? this.standardbody.offsetHeight : this.standardbody.scrollHeight
  var objwidth = this.Container.offsetWidth
  var objheight = this.Container.offsetHeight
  this.Veil.style.width = docwidth + "px" //set up veil over page
  this.Veil.style.height = docheightcomplete + "px" //set up veil over page
  this.Veil.style.left = 0 //Position veil over page
  this.Veil.style.top = 0 //Position veil over page
  this.Veil.style.visibility = "visible" //Show veil over page
  this.Container.style.left = docwidth / 2 - objwidth / 2 + "px" //Position stitial box
  var topposition = (docheight > objheight) ? scroll_top + docheight / 2 - objheight / 2 + "px" : scroll_top + 5 + "px" //Position stitial box
  this.Container.style.top = Math.floor(parseInt(topposition)) + "px"
  this.Container.style.visibility = "visible" //Show stitial box
  //bar1.showBar();
}
// xp_progressbar
// Copyright 2004 Brian Gosselin of ScriptAsylum.com
//
// v1.0 - Initial release
// v1.1 - Added ability to pause the scrolling action (requires you to assign
//        the bar to a unique arbitrary variable).
//      - Added ability to specify an action to perform after a x amount of
//      - bar scrolls. This requires two added arguments.
// v1.2 - Added ability to hide/show each bar (requires you to assign the bar
//        to a unique arbitrary variable).
// var xyz = createBar(
// total_width,
// total_height,
// background_color,
// border_width,
// border_color,
// block_color,
// scroll_speed,
// block_count,
// scroll_count,
// action_to_perform_after_scrolled_n_times
// )
var w3c = (document.getElementById) ? true : false;
var ie = (document.all) ? true : false;
var N = -1;
function createBar(w, h, bgc, brdW, brdC, blkC, speed, blocks, count, action) {
  if (ie || w3c) {
    var t = '<div id="_xpbar' + (++N) + '" style="visibility:visible; position:relative; overflow:hidden; width:' + w + 'px; height:' + h + 'px; background-color:' + bgc + '; border-color:' + brdC + '; border-width:' + brdW + 'px; border-style:solid; font-size:1px;">';
    t += '<span id="blocks' + N + '" style="left:-' + (h * 2 + 1) + 'px; position:absolute; font-size:1px">';
    for (i = 0; i < blocks; i++) {
      t += '<span style="background-color:' + blkC + '; left:-' + ((h * i) + i) + 'px; font-size:1px; position:absolute; width:' + h + 'px; height:' + h + 'px; '
      t += (ie) ? 'filter:alpha(opacity=' + (100 - i * (100 / blocks)) + ')' : '-Moz-opacity:' + ((100 - i * (100 / blocks)) / 100);
      t += '"></span>';
    }
    t += '</span></div>';
    document.write(t);
    var bA = (ie) ? document.all['blocks' + N] : document.getElementById('blocks' + N);
    bA.bar = (ie) ? document.all['_xpbar' + N] : document.getElementById('_xpbar' + N);
    bA.blocks = blocks;
    bA.N = N;
    bA.w = w;
    bA.h = h;
    bA.speed = speed;
    bA.ctr = 0;
    bA.count = count;
    bA.action = action;
    bA.togglePause = togglePause;
    bA.showBar = function() {
      this.bar.style.visibility = "visible";
    }
    bA.hideBar = function() {
      this.bar.style.visibility = "hidden";
    }
    bA.tid = setInterval('startBar(' + N + ')', speed);
    return bA;
  }
}
function startBar(bn) {
  var t = (ie) ? document.all['blocks' + bn] : document.getElementById('blocks' + bn);
  if (parseInt(t.style.left) + t.h + 1 - (t.blocks * t.h + t.blocks) > t.w) {
    t.style.left = -(t.h * 2 + 1) + 'px';
    t.ctr++;
    if (t.ctr >= t.count) {
      eval(t.action);
      t.ctr = 0;
    }
  } else t.style.left = (parseInt(t.style.left) + t.h + 1) + 'px';
}
function togglePause() {
  if (this.tid == 0) {
    this.tid = setInterval('startBar(' + this.N + ')', this.speed);
  } else {
    clearInterval(this.tid);
    this.tid = 0;
  }
}
function CreateBlock2() {
  this.Veil = document.getElementById("Veil") //reference Block
  this.standardbody = (document.compatMode == "CSS1Compat") ? document.documentElement : document.body
  var ie = document.all && !window.opera
  var dom = document.getElementById
  var docwidth = (ie) ? this.standardbody.clientWidth : window.innerWidth - this.scrollbarwidth
  var docheight = (ie) ? this.standardbody.clientHeight : window.innerHeight
  var docheightcomplete = (this.standardbody.offsetHeight > this.standardbody.scrollHeight) ? this.standardbody.offsetHeight : this.standardbody.scrollHeight
  this.Veil.style.width = docwidth + "px" //set up Block over page
  this.Veil.style.height = docheightcomplete + "px" //set up Block over page
  this.Veil.style.left = 0 //Position Block over page
  this.Veil.style.top = 0 //Position Block over page
  this.Veil.style.visibility = "visible" //Show Block over page
  document.body.style.cursor = 'wait';
  //   alert("See how the background is grayd out...")
}
//tsh menubar code 
//**********************************************
// Do not remove this notice.
//
// Copyright 2000-2004 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//**********************************************
//-------------------------------------------
// Code to determine the browser and version.
//-------------------------------------------
function Browser() {
  var ua, s, i;
  this.isIE = false; // Internet Explorer
  this.isOP = false; // Opera
  this.isNS = false; // Netscape
  this.version = null;
  ua = navigator.userAgent;
  s = "Opera";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isOP = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }
  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }
  // Treat any other "Gecko" browser as Netscape 6.1.
  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }
  s = "MSIE";
  if ((i = ua.indexOf(s))) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }
}
var browser = new Browser();
//--------------------------------------------------
// Code for handling the menu bar and active button.
//--------------------------------------------------
var activeButton = null;
/* [MODIFIED] This code commented out, not needed for activate/deactivate
   on mouseover.
// Capture mouse clicks on the page so any active button can be
// deactivated.
if (browser.isIE)
  document.onmousedown = pageMousedown;
else
  document.addEventListener("mousedown", pageMousedown, true);
function pageMousedown(event) {
  var el;
  // If there is no active button, exit.
  if (activeButton == null)
    return;
  // Find the element that was clicked on.
  if (browser.isIE)
    el = window.event.srcElement;
  else
    el = (event.target.tagName ? event.target : event.target.parentNode);
  // If the active button was clicked on, exit.
  if (el == activeButton)
    return;
  // If the element is not part of a menu, reset and clear the active
  // button.
  if (getContainerWith(el, "DIV", "menu") == null) {
    resetButton(activeButton);
    activeButton = null;
  }
}
[END MODIFIED] */
function buttonClick(event, menuId) {
  var button;
  // Get the target button element.
  if (browser.isIE) button = window.event.srcElement;
  else
  button = event.currentTarget;
  // Blur focus from the link to remove that annoying outline.
  button.blur();
  // Associate the named menu to this button if not already done.
  // Additionally, initialize menu display.
  if (button.menu == null) {
    button.menu = document.getElementById(menuId);
    if (button.menu.isInitialized == null) menuInit(button.menu);
  }
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Set mouseout event handler for the button, if not already done.
  if (button.onmouseout == null) button.onmouseout = buttonOrMenuMouseout;
  // Exit if this button is the currently active one.
  if (button == activeButton) return false;
  // [END MODIFIED]
  // Reset the currently active button, if any.
  if (activeButton != null) resetButton(activeButton);
  // Activate this button, unless it was the currently active one.
  if (button != activeButton) {
    depressButton(button);
    activeButton = button;
  } else
  activeButton = null;
  return false;
}
function buttonMouseover(event, menuId) {
  var button;
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Activates this button's menu if no other is currently active.
  if (activeButton == null) {
    buttonClick(event, menuId);
    return;
  }
  // [END MODIFIED]
  // Find the target button element.
  if (browser.isIE) button = window.event.srcElement;
  else
  button = event.currentTarget;
  // If any other button menu is active, make this one active instead.
  if (activeButton != null && activeButton != button) buttonClick(event, menuId);
}
function depressButton(button) {
  var x, y;
  // Update the button's style class to make it look like it's
  // depressed.
  button.className += " menuButtonActive";
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Set mouseout event handler for the button, if not already done.
  if (button.onmouseout == null) button.onmouseout = buttonOrMenuMouseout;
  if (button.menu.onmouseout == null) button.menu.onmouseout = buttonOrMenuMouseout;
  // [END MODIFIED]
  // Position the associated drop down menu under the button and
  // show it.
  x = getPageOffsetLeft(button);
  y = getPageOffsetTop(button) + button.offsetHeight;
  // For IE, adjust position.
  if (browser.isIE) {
    x += button.offsetParent.clientLeft;
    y += button.offsetParent.clientTop;
  }
  button.menu.style.left = x + "px";
  button.menu.style.top = y + "px";
  button.menu.style.visibility = "visible";
  // For IE; size, position and show the menu's IFRAME as well.
  if (button.menu.iframeEl != null) {
    button.menu.iframeEl.style.left = button.menu.style.left;
    button.menu.iframeEl.style.top = button.menu.style.top;
    button.menu.iframeEl.style.width = button.menu.offsetWidth + "px";
    button.menu.iframeEl.style.height = button.menu.offsetHeight + "px";
    button.menu.iframeEl.style.display = "";
  }
}
function resetButton(button) {
  // Restore the button's style class.
  removeClassName(button, "menuButtonActive");
  // Hide the button's menu, first closing any sub menus.
  if (button.menu != null) {
    closeSubMenu(button.menu);
    button.menu.style.visibility = "hidden";
    // For IE, hide menu's IFRAME as well.
    if (button.menu.iframeEl != null) button.menu.iframeEl.style.display = "none";
  }
}
//----------------------------------------
// Code to handle the menus and sub menus.
//----------------------------------------
function menuMouseover(event) {
  var menu;
  // Find the target menu element.
  if (browser.isIE) menu = getContainerWith(window.event.srcElement, "DIV", "menu");
  else
  menu = event.currentTarget;
  // Close any active sub menu.
  if (menu.activeItem != null) closeSubMenu(menu);
}
function menuItemMouseover(event, menuId) {
  var item, menu, x, y;
  // Find the target item element and its parent menu element.
  if (browser.isIE) item = getContainerWith(window.event.srcElement, "A", "menuItem");
  else
  item = event.currentTarget;
  menu = getContainerWith(item, "DIV", "menu");
  // Close any active sub menu and mark this one as active.
  if (menu.activeItem != null) closeSubMenu(menu);
  menu.activeItem = item;
  // Highlight the item element.
  item.className += " menuItemHighlight";
  // Initialize the sub menu, if not already done.
  if (item.subMenu == null) {
    item.subMenu = document.getElementById(menuId);
    if (item.subMenu.isInitialized == null) menuInit(item.subMenu);
  }
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Set mouseout event handler for the sub menu, if not already done.
  if (item.subMenu.onmouseout == null) item.subMenu.onmouseout = buttonOrMenuMouseout;
  // [END MODIFIED]
  // Get position for submenu based on the menu item.
  x = getPageOffsetLeft(item) + item.offsetWidth;
  y = getPageOffsetTop(item);
  // Adjust position to fit in view.
  var maxX, maxY;
  if (browser.isIE) {
    maxX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) + (document.documentElement.clientWidth != 0 ? document.documentElement.clientWidth : document.body.clientWidth);
    maxY = Math.max(document.documentElement.scrollTop, document.body.scrollTop) + (document.documentElement.clientHeight != 0 ? document.documentElement.clientHeight : document.body.clientHeight);
  }
  if (browser.isOP) {
    maxX = document.documentElement.scrollLeft + window.innerWidth;
    maxY = document.documentElement.scrollTop + window.innerHeight;
  }
  if (browser.isNS) {
    maxX = window.scrollX + window.innerWidth;
    maxY = window.scrollY + window.innerHeight;
  }
  maxX -= item.subMenu.offsetWidth;
  maxY -= item.subMenu.offsetHeight;
  if (x > maxX) x = Math.max(0, x - item.offsetWidth - item.subMenu.offsetWidth + (menu.offsetWidth - item.offsetWidth));
  y = Math.max(0, Math.min(y, maxY));
  // Position and show the sub menu.
  item.subMenu.style.left = x + "px";
  item.subMenu.style.top = y + "px";
  item.subMenu.style.visibility = "visible";
  // For IE; size, position and display the menu's IFRAME as well.
  if (item.subMenu.iframeEl != null) {
    item.subMenu.iframeEl.style.left = item.subMenu.style.left;
    item.subMenu.iframeEl.style.top = item.subMenu.style.top;
    item.subMenu.iframeEl.style.width = item.subMenu.offsetWidth + "px";
    item.subMenu.iframeEl.style.height = item.subMenu.offsetHeight + "px";
    item.subMenu.iframeEl.style.display = "";
  }
  // Stop the event from bubbling.
  if (browser.isIE) window.event.cancelBubble = true;
  else
  event.stopPropagation();
}
function closeSubMenu(menu) {
  if (menu == null || menu.activeItem == null) return;
  // Recursively close any sub menus.
  if (menu.activeItem.subMenu != null) {
    closeSubMenu(menu.activeItem.subMenu);
    menu.activeItem.subMenu.style.visibility = "hidden";
    // For IE, hide the sub menu's IFRAME as well.
    if (menu.activeItem.subMenu.iframeEl != null) menu.activeItem.subMenu.iframeEl.style.display = "none";
    menu.activeItem.subMenu = null;
  }
  // Deactivate the active menu item.
  removeClassName(menu.activeItem, "menuItemHighlight");
  menu.activeItem = null;
}
// [MODIFIED] Added for activate/deactivate on mouseover. Handler for mouseout
// event on buttons and menus.
function buttonOrMenuMouseout(event) {
  var el;
  // If there is no active button, exit.
  if (activeButton == null) return;
  // Find the element the mouse is moving to.
  if (browser.isIE) el = window.event.toElement;
  else if (event.relatedTarget != null) el = (event.relatedTarget.tagName ? event.relatedTarget : event.relatedTarget.parentNode);
  // If the element is not part of a menu, reset the active button.
  if (getContainerWith(el, "DIV", "menu") == null) {
    resetButton(activeButton);
    activeButton = null;
  }
}
// [END MODIFIED]
//--------------------------
// Code to initialize menus.
//--------------------------
function menuInit(menu) {
  var itemList, spanList;
  var textEl, arrowEl;
  var itemWidth;
  var w, dw;
  var i, j;
  // For IE, replace arrow characters.
  if (browser.isIE) {
    menu.style.lineHeight = "2.5ex";
    spanList = menu.getElementsByTagName("SPAN");
    for (i = 0; i < spanList.length; i++)
    if (hasClassName(spanList[i], "menuItemArrow")) {
      spanList[i].style.fontFamily = "Webdings";
      spanList[i].firstChild.nodeValue = "4";
    }
  }
  // Find the width of a menu item.
  itemList = menu.getElementsByTagName("A");
  if (itemList.length > 0) itemWidth = itemList[0].offsetWidth;
  else
  return;
  // For items with arrows, add padding to item text to make the
  // arrows flush right.
  for (i = 0; i < itemList.length; i++) {
    spanList = itemList[i].getElementsByTagName("SPAN");
    textEl = null;
    arrowEl = null;
    for (j = 0; j < spanList.length; j++) {
      if (hasClassName(spanList[j], "menuItemText")) textEl = spanList[j];
      if (hasClassName(spanList[j], "menuItemArrow")) arrowEl = spanList[j];
    }
    if (textEl != null && arrowEl != null) {
      textEl.style.paddingRight = (itemWidth - (textEl.offsetWidth + arrowEl.offsetWidth)) + "px";
      // For Opera, remove the negative right margin to fix a display bug.
      if (browser.isOP) arrowEl.style.marginRight = "0px";
    }
  }
  // Fix IE hover problem by setting an explicit width on first item of
  // the menu.
  if (browser.isIE) {
    w = itemList[0].offsetWidth;
    itemList[0].style.width = w + "px";
    dw = itemList[0].offsetWidth - w;
    w -= dw;
    itemList[0].style.width = w + "px";
  }
  // Fix the IE display problem (SELECT elements and other windowed controls
  // overlaying the menu) by adding an IFRAME under the menu.
  if (browser.isIE) {
    var iframeEl = document.createElement("IFRAME");
    iframeEl.frameBorder = 0;
    iframeEl.src = "javascript:;";
    iframeEl.style.display = "none";
    iframeEl.style.position = "absolute";
    iframeEl.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
    menu.iframeEl = menu.parentNode.insertBefore(iframeEl, menu);
  }
  // Mark menu as initialized.
  menu.isInitialized = true;
}
//---------------------------
// General utility functions.
//---------------------------
function getContainerWith(node, tagName, className) {
  // Starting with the given node, find the nearest containing element
  // with the specified tag name and style class.
  while (node != null) {
    if (node.tagName != null && node.tagName == tagName && hasClassName(node, className)) return node;
    node = node.parentNode;
  }
  return node;
}
function hasClassName(el, name) {
  var i, list;
  // Return true if the given element currently has the given class
  // name.
  list = el.className.split(" ");
  for (i = 0; i < list.length; i++)
  if (list[i] == name) return true;
  return false;
}
function removeClassName(el, name) {
  var i, curList, newList;
  if (el.className == null) return;
  // Remove the given class name from the element's className property.
  newList = new Array();
  curList = el.className.split(" ");
  for (i = 0; i < curList.length; i++)
  if (curList[i] != name) newList.push(curList[i]);
  el.className = newList.join(" ");
}
function getPageOffsetLeft(el) {
  var x;
  // Return the x coordinate of an element relative to the page.
  x = el.offsetLeft;
  if (el.offsetParent != null) x += getPageOffsetLeft(el.offsetParent);
  return x;
}
function getPageOffsetTop(el) {
  var y;
  // Return the x coordinate of an element relative to the page.
  y = el.offsetTop;
  if (el.offsetParent != null) y += getPageOffsetTop(el.offsetParent);
  return y;
}
// djf - moved in from build default page 
function helpme(x) {
  helper = window.open(x, 'helper', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=yes,resizable=yes,width=340')
}
function newImage(arg) {
  if (document.images) {
    rslt = new Image();
    rslt.src = arg;
    return rslt;
  }
}
function changeImages() {
  var preloadFlag = true;
  if (document.images && (preloadFlag == true)) {
    for (var i = 0; i < changeImages.arguments.length; i += 2) {
      document[changeImages.arguments[i]].src = changeImages.arguments[i + 1];
    }
  }
}
function changelist_save(path, sflag, templ) {;
  document.forms[0].loginpath.value = path;
  document.forms[0].searchflag.value = sflag;
  document.forms[0].customlist.value = templ;
  document.forms[0].submit();
}
function changelist(path, sflag, templ) {;
  addfield(path, "loginpath", document.forms[0].loginpath);
  addfield("25", "itemspage", document.forms[0].itemspage);
  addfield(sflag, "searchflag", document.forms[0].searchflag);
  // test if the field exist and is a select box if so append
  // otherwise just do the add field 
  var ctrl = "document.forms[0].customlist"
  if (testObj(ctrl)) {
    if ($("[name='customlist']").is('select')) {
      $("[name='customlist']").append('<option value="' + templ + '"> Added </option>');
      $("[name='customlist']").val(templ);
    } else {
      addfield(templ, "customlist", document.forms[0].customlist);
    }
    addfield(templ, "customlist", document.forms[0].customlist);
  }
  document.forms[0].submit();
}
function changecolor(thisdiv, bgcolor) {
  var thisobj
  if (document.all) {
    thisobj = thisdiv
    thisobj.style.backgroundColor = bgcolor
  }
}
//Added Build of default bar djf 7/16/09 ;
function tshbar() {;
  var bar1 = createBar(300, 15, 'white', 1, 'black', 'blue', 85, 7, 3, '')
  bar1.hideBar();
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
function SearchSubmitsm() {
  return; // removed 08/06/14
  //  Sstr = document.getElementById("prodidsm").value ;
  var Sstr = '';
  Sstr = Sstr + "|" + document.getElementById("proddescsm").value;
  // added history flag 
  var chkflg = document.getElementById("histflag").checked
  if (chkflg == true) {
    addfield("Y", "histflag", document.forms[0].histflag);
  }
  addfield(Sstr, "submitvar", document.forms[0].submitvar);
  addfield("Y", "searchflag", document.forms[0].searchflag);
  addfield("1", "searchptr", document.forms[0].searchptr);
  addfield("1", "startptr", document.forms[0].startptr);
  addfield("SR", "loginpath", document.forms[0].loginpath);
  showmodalsearch();
  AddGoogleSearch();
  document.forms[0].submit();
}
function AddGoogleSearch() {
  // DJF 12-22-11 ADDED CODE TO ALLOW FOR GOOGLE ANALYTICS SEARCH
  // NOTE: YOU NEED TO ENABLE ON THE ANALYTICS SITE AS WELL
  //Sstr = document.getElementById("prodidsm").value ;
  var Sstr = '';
//   Sstr = document.getElementById("proddescsm").value;
Sstr = $('#proddescsm').val() ; 
if (Sstr == '') {
Sstr = $('#query').val() ;
}
  pcode = document.title;
  pcode = pcode.replace(/ /g, "_");
  pcode = pcode + "?q=" + Sstr
  _gaq.push(['_trackPageview', pcode]);
}
//ADDA LOGIN PATH JUST IN CASE YOU FORGOT TO ADD IT IN THE CODE
//addfield("XX","loginpath", document.forms[0].loginpath) ;
//Added Global Search and Replace Function - djf
function replacetext() {
  var str = document.getElementById('RnMainBody');
  evar = str.innerHTML.replace(/<td id=datnorm><b>Click here to/gi, '<td id=datnorm style="VISIBILITY: hidden"><b>');
  evar2 = evar.replace(/<td id=datnorm><b>Click here if you wish to/gi, '<td id=datnorm style="VISIBILITY: hidden"><b>');
  str.innerHTML = evar2;
  var str = document.getElementById('RnMenu');
  evar = str.innerHTML.replace(/Home</gi, 'Log Out<');
  str.innerHTML = evar;
}
function UpdateShipto() {
  var str = document.getElementById('RnMainBody');
  evar = str.innerHTML.replace(/Click Here to change ship to:/gi, 'Choose a Shipto <br><a href=# onclick=javascript:ManualShipto()>Add A ShipTo</a> <br> <a href=# onclick=javascript:changepath("OE")> Update this Shipto </a>');
  str.innerHTML = evar;
}
function ManualShipto() {
  //get selected shipto info
  var x = 1
  var val = document.forms[0].Shiptobox.options[x].value;
  var my_array = new Array;
  var my_array = string_decode(val);
  var shipto = my_array[0];
  var Shiptoname = my_array[1];
  var Shiptodesc = my_array[2];
  var Shiptodesc2 = my_array[3];
  var Shiptodesc3 = my_array[4];
  var Shiptocity = my_array[5];
  var Shiptostate = my_array[6];
  var Shiptozip = my_array[7];
  var Shiptocountry = my_array[8];
  // put variables into text boxes
  document.forms[0].shipto.value = shipto;
  document.forms[0].Shiptoname.value = Shiptoname;
  document.forms[0].Shiptodesc.value = Shiptodesc;
  document.forms[0].Shiptodesc2.value = Shiptodesc2;
  document.forms[0].Shiptodesc3.value = Shiptodesc3;
  document.forms[0].Shiptocity.value = Shiptocity;
  document.forms[0].Shiptostate.value = Shiptostate;
  document.forms[0].Shiptozip.value = Shiptozip;
  document.forms[0].Shiptocountry.value = Shiptocountry;
  document.forms[0].Shiptoname.focus();
}
//ADDED TO allow blanking of fields in SR djf 12-9-10
function getElementsByClass(searchClass, domNode, tagName) {
  if (domNode == null) domNode = document;
  if (tagName == null) tagName = '*';
  var el = new Array();
  var tags = domNode.getElementsByTagName(tagName);
  var tcl = " " + searchClass + " ";
  for (i = 0, j = 0; i < tags.length; i++) {
    var test = " " + tags[i].className + " ";
    if (test.indexOf(tcl) != -1) el[j++] = tags[i];
  }
  return el;
}
function hideIfEmpty(inner) {
  // var inner = document.getElementById(innerdiv);
  if (inner.parentNode && inner.parentNode.id) var outerdiv = inner.parentNode.id;
  if (inner.innerHTML == "") document.getElementById(outerdiv).style.display = "none";
  // document.getElementById(outerdiv).style.display="none";
}
function HideLoad() {
  var divs = getElementsByClass('labelhide');
  for (var i = 0, l = divs.length; i < l; i++) {
    //do something to each div like
    hideIfEmpty(divs[i])
  }
}
function changepath(x, sflag) {
  addfield(sflag, "searchflag", document.forms[0].searchflag);
  addfield("1", "searchptr", document.forms[0].searchptr);
  addfield("1", "startptr", document.forms[0].startptr);
  addfield(x, "loginpath", document.forms[0].loginpath);
  document.forms[0].submit();
}
function browsepath(x, svar) {
  addfield(svar, "submitvar", document.forms[0].submitvar);
  addfield("Y", "searchflag", document.forms[0].searchflag);
  addfield("1", "searchptr", document.forms[0].searchptr);
  addfield("1", "startptr", document.forms[0].startptr);
  addfield(x, "loginpath", document.forms[0].loginpath);
  document.forms[0].submit();
}
// added mouse over events
function makepopup(url) {
  openmypage(0, url);
  //showhintajax(url,this,event, '');
  //if (window.ajaxwin) {
  // if (ajaxwin.isClosed) {
  //   ajaxwin=dhtmlwindow.open("popupbox", "ajax", url, "Product Information", "width=650px,height=400px,resize=1,center=1,scrolling=1") ;
  //   } else {
  //   ajaxwin.load('ajax',url,'Updated Product Information') ;
  //   }
  //  } else {
  //  ajaxwin=dhtmlwindow.open("popupbox", "ajax", url, "Product Information", "width=650px,height=400px,resize=1,center=1,scrolling=1") ;
  // }
}
function js_eval(obj) {
  // Added Eval of Javascript
  var scripts = obj.getElementsByTagName('script');
  for (var ix = 0; ix < scripts.length; ix++) {
    // alert(scripts[ix].text);
    eval(scripts[ix].text);
  }
}
function closepopup() {
  $("#mouseoverhintbox").fadeOut("fast");
}
//document.title=ajaxwin.mouseoverDHTMLWindow
//if (!ajaxwin.clickbool && !ajaxwin.mouseoverDHTMLWindow)
//  ajaxwin.hide()
// }
function openmypage(clickbool, url) { //Define arbitrary function to run desired DHTML Window widget codes
  ajaxwin = dhtmlwindow.open("popupbox", "ajax", url, "Product Information", "width=400px,height=500px,resize=0,scrolling=0");
  if (typeof ajaxwin.mouseoverDHTMLWindow == "undefined") ajaxwin.mouseoverDHTMLWindow = 0
  ajaxwin.clickbool = clickbool
  ajaxwin.onclose = function() {
    this.clickbool = 0
    return true;
  }
  ajaxwin.onmouseover = function() {
    this.mouseoverDHTMLWindow = 1
    this.moveTo(this.style.left, this.style.top)
  }
  ajaxwin.onmouseout = function() {
    this.mouseoverDHTMLWindow = 0
  }
}
function hotprod_inquiry(loginpath, sflag, aprodno) {
  addfield(aprodno, "aprodno", document.forms[0].aprodno);
  changepath(loginpath, sflag);
}
function HotAdd_To_Order(prod, qtyid, um) {
  var qty = document.getElementById(qtyid).value;
  var result = "";
  var data = "";
  if (qty == '') { var qty = 1 } ; 
  if (qtychk(qty)) {
    result = result + prod + '|';
    result = result + qty + '|';
    result = result + um + '^';
    $.cookie("RNItemsAdded", "YES");
    addfield("3", "pageid", document.forms[0].pageid);
    addfield(result, "final_string", document.forms[0].final_string);
    addfield("N", "searchflag", document.forms[0].searchflag);
    document.forms[0].submit();
  }
}
function dupcheck(string) {
  var aprod_array = new Array
  var qty_array = new Array
  var um_array = new Array
  aprod_array = string_decode(document.template.Aprod_string.value)
  um_array = string_decode(document.template.um_string.value)
  qty_array = string_decode(document.template.qty_string.value)
  len = aprod_array.length
  var msg = ''
  for (var j = 0; j < len; j++) {
    if (string == aprod_array[j]) {
      var msg = msg + "You have already ordered " + qty_array[j] + " " + um_array[j] + " of product " + aprod_array[j] + "<br> ";
    }
  }
  if (msg != '') {
    $('#header_toplinks').append('<div id="alert">' + msg + ' </div>');
    $('#alert').fadeOut(5000);
  }
  return true;
}
//function to read in name and value and push to prodstring
function back() {
  history.go(-1)
}
function string_decode(x) {
  var string = x
  var start = 0;
  var y = 0;
  var ctr = 0;
  var string_array = new Array;
  //first loop to get amount of products/qty 
  for (var i = 0; i < string.length; i++) {
    var ln = string.substring(i, i + 1);
    if (ln == "|") {
      ctr = ctr + 1;
    }
  }
  //amt of pipes indicate amt of prods (ctr) 
  for (var i = 0; i < ctr; i++) {
    var pos = string.indexOf("|", start)
    var data = string.substring(start, pos)
    string_array[y] = data
    y = y + 1
    start = pos + 1;
  }
  var data = string.substring(start, string.length)
  string_array[y] = data
  return string_array;
}
function string_recode(x) {
  var string = ""
  var string_array = new Array
  string_array = x
  var len = string_array.length - 1
  // we do -1 to account for 0 being the first num 
  for (var i = 0; i < len; i++) {
    if (string_array[i] != "") { //remove the null value 
      string = string + string_array[i] + "|";
    }
  }
  // code to add last item to string without pipe 
  if (string_array[len] != "") { //remove the null value
    string = string + string_array[len];
  }
  return string;
}
//added global add a template function
function new_template(x) {
  str = jPrompt("Please enter the New Template Name. To add items to a template\nuse an existing template name.", "", "Save as Template", function(str) {
    // check to see they clicked ok 
    if (str) {
      // make sure they entered a value ;
      addfield(str, "customlist_save", document.forms[0].customlist_save);
      addfield(x, "loginpath", document.forms[0].loginpath);
      //  document.template.customlist_save.value = str ;
      //  document.template.loginpath.value = x ; 
      document.forms[0].submit();
    } else {
      if (str == "") {
        jAlert("\nYou must enter a New Template name ")
      };
      // return false;
    }
  });
}
//added code for search page messages..
function makediv(dividname) {
  var divblock = document.createElement("div")
  divblock.setAttribute("id", dividname)
  document.body.appendChild(divblock)
}
function showmodalsearch() {
  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("#SLoader").length < 1) {
    // need to create div 
    makediv("SLoader");
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
  var winH = $(window).height();
  var winW = $(window).width();
  //Set the popup window to center  
  $('#SLoader').css({
    'width': '500px',
    'height': '260px',
    'padding': '10px',
    'background': 'url(' + image_url + 'ajax-loader.gif) no-repeat top center'
  });
  $('#SLoader').css({
    'display': 'none',
    'z-index': '9999',
    'position': 'absolute',
    'color': 'white'
  });
  $('#SLoader').html('<br><br><br><br><h1>Now searching for your products...</h1>');
  $('#SLoader').css('top', winH / 2 - $('#SLoader').height() / 2);
  $('#SLoader').css('left', winW / 2 - $('#SLoader').width() / 2);
  //transition effect  
  $('#SLoader').fadeIn(2000);
}
// below are the global load functions.. 
//if (window.addEventListener)
//window.addEventListener("load", UpdateShipto, false)
//else if (window.attachEvent)
//window.attachEvent("onload", UpdateShipto)
//else if (document.getElementById)
//window.onload=UpdateShipto
if (window.addEventListener) window.addEventListener("load", createhintbox, false)
else if (window.attachEvent) window.attachEvent("onload", createhintbox)
else if (document.getElementById) window.onload = createhintbox
// for floating search bar
//if (window.addEventListener)
//window.addEventListener("load", staticbar, false)
//else if (window.attachEvent)
//window.attachEvent("onload", staticbar)
//else if (document.getElementById)
//window.onload=staticbar
//
// Hide Loadfunction
//if (window.addEventListener)
//window.addEventListener("load", HideLoad, false)
//else if (window.attachEvent)
//window.attachEvent("onload", HideLoad)
//else if (document.getElementById)
//window.onload=HideLoad
// uncomment to add replace text function.. 
//if (window.addEventListener)
//window.addEventListener("load", replacetext, false)
//else if (window.attachEvent)
//window.attachEvent("onload", replacetext)
//else if (document.getElementById)
//window.onload=replacetext
// ADDED google analytics tracking code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-25903897-1']);
//  _gaq.push(['_trackPageview']);
_gaq.push(['_setSiteSpeedSampleRate', 25]);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  //     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/u/ga_debug.js';
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
// Added Global Ajax Settings for Jquery
$.ajaxSetup({  async: true,  global: true,  type: "POST"});
// $.ajaxSetup({  async: true,  global: false,  type: "POST"});
/// ADDED GLOBAL KEYPRESS ENTER FUNCTION 
// updated to only trigger for query box...
$("#query").bind('keypress', function(e) {
// $(window).bind('keypress', function(e) {
  if (e.keyCode == 13) {
var pageid = $("[name='pageid']").val() ;
   if (pageid == '31') { // Salesman Login page
        changepath("SUSR","Y")
   } else { 
    SearchSubmitsm();
} 
  }
});
//added widgetload2 function via jquery 1-23-11
function widgetload(pageurl, targetname) {
  var params = "";
  $(targetname).html("<div id=Loader></div>");
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver012B?' + params
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    data: params,
    timeout: 20000,
    proccessData: false,
    // this is true by default
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      //var xhtml = $(data).find('anyType').text() ;
      //alert($data) ;
      //alert(xhtml) ;
      $(targetname).html(data);
      //  $(targetname).html(xhtml);
      // alert('Load was performed.');
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).html('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          //          $.ajax(this);
          return;
        }
        $(targetname).html('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
      if (xhr.status == 500) {
        $(targetname).html('Oops! There seems to be a server problem, please try again later.');
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).html('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
    }
  });
}
function widgetload_callback(pageurl, targetname, callback) {
  var params = "";
  $(targetname).html("<div id=Loader></div>");
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver012B?' + params
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    data: params,
    timeout: 20000,
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      //var xhtml = $(data).find('anyType').text() ;
      //alert($data) ;
      //alert(xhtml) ;
      $(targetname).html(data);
      // Added Call Back function on success
      callback.call();
      //  $(targetname).html(xhtml);
      // alert('Load was performed.');
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).html('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          //          $.ajax(this);
          return;
        }
        $(targetname).html('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
      if (xhr.status == 500) {
        $(targetname).html('Oops! There seems to be a server problem, please try again later.');
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).html('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
    }
  });
}
function widgetload_append(pageurl, targetname) {
  var params = "";
  // $(targetname).html("<div id=Loader></div>");
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver012B?' + params
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: true,
    data: params,
    timeout: 20000,
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      //var xhtml = $(data).find('anyType').text() ;
      //alert($data) ;
      //alert(xhtml) ;
      $(targetname).append(data);
      //  $(targetname).html(xhtml);
      // alert('Load was performed.');
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).append('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          //          $.ajax(this);
          return;
        }
        $(targetname).append('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
      if (xhr.status == 500) {
        $(targetname).append('Oops! There seems to be a server problem, please try again later.');
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).append('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
    }
  });
}
function widgetload_append_callback(pageurl, targetname, callback) {
  var params = "";
  // $(targetname).html("<div id=Loader></div>");
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver012B?' + params
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: true,
    data: params,
    timeout: 20000,
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      //var xhtml = $(data).find('anyType').text() ;
      //alert($data) ;
      //alert(xhtml) ;
       $(targetname).append(data);
      callback.call();
      //  $(targetname).html(xhtml);
      // alert('Load was performed.');
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).append('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          //          $.ajax(this);
          return;
        }
        $(targetname).append('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
      if (xhr.status == 500) {
        $(targetname).append('Oops! There seems to be a server problem, please try again later.');
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).append('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
    }
  });
}
function widgetload_after_callback(pageurl, targetname, callback) {
  var params = "";
  // $(targetname).html("<div id=Loader></div>");
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver012B?' + params
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: true,
    data: params,
    timeout: 20000,
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      //var xhtml = $(data).find('anyType').text() ;
      //alert($data) ;
      //alert(xhtml) ;
      $(targetname).after(data);
//       $(targetname).append(data);
      callback.call();
      //  $(targetname).html(xhtml);
      // alert('Load was performed.');
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).append('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          //          $.ajax(this);
          return;
        }
        $(targetname).append('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
      if (xhr.status == 500) {
        $(targetname).append('Oops! There seems to be a server problem, please try again later.');
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).append('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
    }
  });
}
function widgetload_prepend(pageurl, targetname) {
  var params = "";
  // $(targetname).html("<div id=Loader></div>");
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver012B?' + params
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: true,
    data: params,
    timeout: 20000,
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      //var xhtml = $(data).find('anyType').text() ;
      //alert($data) ;
      //alert(xhtml) ;
      $(targetname).prepend(data);
      //  $(targetname).html(xhtml);
      // alert('Load was performed.');
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).prepend('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          //          $.ajax(this);
          return;
        }
        $(targetname).prepend('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
      if (xhr.status == 500) {
        $(targetname).prepend('Oops! There seems to be a server problem, please try again later.');
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).prepend('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        return;
      }
    }
  });
}
/// ADDED GLOBAL KEYPRESS ENTER FUNCTION 
function EnterSearch() {
  if (window.event.keyCode == 13) {
    SearchSubmitsm();
  }
}
function release_detail(path, x) {
  //   document.template.loginpath.value = path ;
  addfield(path, "loginpath", document.forms[0].loginpath);
  //   document.template.pageid.value = 6 ;
  addfield("6", "pageid", document.forms[0].pageid);
  //   document.template.startptr.value = 1 ;
  addfield("1", "startptr", document.forms[0].startptr);
  //   document.template.mdsorderno.value = x ;
  addfield(x, "mdsorderno", document.forms[0].mdsorderno);
  document.template.submit();
}
// JavaScript Document
// script to poup the cookie testing page
// djf 3-1-13
// Get named HTML object
function GetObject(name) {
  var o = null;
  if (document.getElementById) o = document.getElementById(name);
  else if (document.all) o = document.all.item(name);
  else if (document.layers) o = document.layers[name];
  if (o == null && document.getElementsByName) {
    var e = document.getElementsByName(name);
    if (e.length == 1) o = e[0];
  }
  return o;
}
function setvar(nm, vl) {
  var dta = "";
  var allck = document.cookie;
  var pos = allck.indexOf("dta=");
  if (pos != -1) {
    var start = pos + 4;
    var end = allck.indexOf(";", start);
    if (end == -1) end = allck.length;
    dta = unescape(allck.substring(start, end));
  }
  var a = dta.split(",");
  for (var i = 0; i < a.length; i++) {
    if (a[i].substr(0, nm.length + 1) == nm + "=") break;
  }
  a[i] = nm + "=" + vl;
  dta = a.join(",");
  if (dta.substr(0, 1) == ',') dta = dta.substr(1);
  var exp = new Date((new Date()).getTime() + 20 * 60000); // expire in 20 mins
  document.cookie = "dta=" + escape(dta) + "; expires=" + exp.toGMTString();
}
function makediv(dividname) {
  var divblock = document.createElement("div")
  divblock.setAttribute("id", dividname)
  document.body.appendChild(divblock)
}
function getvar(nm) {
  var value = null;
  var allck = document.cookie;
  var pos = allck.indexOf("dta=");
  if (pos != -1) {
    var start = pos + 4;
    var end = allck.indexOf(";", start);
    if (end == -1) end = allck.length;
    var dta = unescape(allck.substring(start, end));
    pos = dta.indexOf(nm + "=");
    if (pos != -1) {
      start = pos + nm.length + 1;
      end = dta.indexOf(",", start);
      if (end == -1) end = dta.length;
      value = dta.substring(start, end);
    }
  }
  return value;
}
function hidecookiepopup() {
  $('#cookiedialog').hide();
  $('#mask').hide();
}
function showmodal() {
  //Get the screen height and width
  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("cookiedialog").length < 1) {
    // need to create div 
    makediv("cookiedialog");
  }
  // .window{position:absolute;left:0;top:0;width:440px;height:200px;display:none;z-index:9999;padding:20px;}
  // #dialog{width:800px;height:580px;padding:10px;background-color:#ffffff;}
  $('#cookiedialog').css({
    'width': '800px',
    'height': '580px',
    'padding': '10px',
    'background': 'white'
  });
  $('#cookiedialog').css({
    'display': 'none',
    'z-index': '9999',
    'position': 'absolute',
    'color': 'black'
  });
  $('#cookiedialog').html('<div style=float:left> RemotetNet Site Notice</div><div style=float:right><a href=# onclick="javascript:hidecookiepopup();"> <img src="http://hosting.tshinc.com/rn/images/close_pop.png"></a> </div><iframe src="https://hosting.tshinc.com/rn/CookieFail.html" style="margin:0; padding:0; width:100%; height: 90%" name="cokieframe" ></iframe>');
  var maskHeight = $(document).height();
  var maskWidth = $(window).width();
  //Set heigth and width to mask to fill up the whole screen
  // $('#mask').css({'width':maskWidth,'height':maskHeight});
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
  var winH = $(window).height();
  var winW = $(window).width();
  //Set the popup window to center
  $('#cookiedialog').css('top', winH / 2 - $('#cookiedialog').height() / 2);
  $('#cookiedialog').css('left', winW / 2 - $('#cookiedialog').width() / 2);
  //transition effect
  $('#cookiedialog').fadeIn(2000);
}
// added Browser detect code 
var BrowserDetect = {
  init: function() {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
      } else if (dataProp) return data[i].identity;
    }
  },
  searchVersion: function(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [{
    string: navigator.userAgent,
    subString: "Chrome",
    identity: "Chrome"
  }, {
    string: navigator.userAgent,
    subString: "OmniWeb",
    versionSearch: "OmniWeb/",
    identity: "OmniWeb"
  }, {
    string: navigator.vendor,
    subString: "Apple",
    identity: "Safari",
    versionSearch: "Version"
  }, {
    prop: window.opera,
    identity: "Opera",
    versionSearch: "Version"
  }, {
    string: navigator.vendor,
    subString: "iCab",
    identity: "iCab"
  }, {
    string: navigator.vendor,
    subString: "KDE",
    identity: "Konqueror"
  }, {
    string: navigator.userAgent,
    subString: "Firefox",
    identity: "Firefox"
  }, {
    string: navigator.vendor,
    subString: "Camino",
    identity: "Camino"
  }, { // for newer Netscapes (6+)
    string: navigator.userAgent,
    subString: "Netscape",
    identity: "Netscape"
  }, {
    string: navigator.userAgent,
    subString: "MSIE",
    identity: "Explorer",
    versionSearch: "MSIE"
  }, {
    string: navigator.userAgent,
    subString: "Gecko",
    identity: "Mozilla",
    versionSearch: "rv"
  }, { // for older Netscapes (4-)
    string: navigator.userAgent,
    subString: "Mozilla",
    identity: "Netscape",
    versionSearch: "Mozilla"
  }],
  dataOS: [{
    string: navigator.platform,
    subString: "Win",
    identity: "Windows"
  }, {
    string: navigator.platform,
    subString: "Mac",
    identity: "Mac"
  }, {
    string: navigator.userAgent,
    subString: "iPhone",
    identity: "iPhone/iPod"
  }, {
    string: navigator.platform,
    subString: "Linux",
    identity: "Linux"
  }]
};
BrowserDetect.init();
//if dialog is clicked
function showmodalbcheck() {
  var val = $.cookie('RnBrowserCheck');
  if (val == 'YES') {
    return;
  }
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("#bdialog").length < 1) {
    // need to create div 
    makediv("bdialog");
  }
  //if mask is clicked
  $('#mask').click(function() {
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
  // $('#mask').css({'width':maskWidth,'height':maskHeight});
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
  $('#bdialog').html(' <br> <h1> Remotenet Site Notice </h1>');
  $('#bdialog').append('<p>We Think you\'re using ' + BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS + '!</p>');
  $('#bdialog').append(' <br> Our Web site has been designed to work with the latest technology available: ');
  $('#bdialog').append(' <br> <br> And we have determined you are not running a compatible version');
  $('#bdialog').append(' <br> <br/><a target=new href="http://www.microsoft.com/ie">Internet Explorer (click here)</a>');
  $('#bdialog').append(' <br> <br/><a target=new href="http://www.google.com/chrome">Google Chrome (click here)</a>');
  $('#bdialog').append(' <br> <br/><a target=new href="http://www.apple.com/safari/download/">Safari  (click here)</a> ');
  $('#bdialog').append(' <br> <br/><a target=new href="http://www.mozilla.org">Mozilla Firefox  (click here)</a> ');
  $('#bdialog').append(' <br>  <br> <br/>If you could please upgrade to one of these newer versions, we would appreciate it greatly. <br> Please click on your preferred browser.');
  $('#bdialog').append(' <br>  <br> <br/> <div id="bcbutton" class=button1> Click here to close this message </div> ');
  $('#bdialog').fadeIn(2000);
  $.cookie("RnBrowserCheck", "YES");
  $('#bcbutton').click(function(e) {
    //Cancel the link behavior
    // e.preventDefault();
    $('#mask').hide();
    $('#bdialog').hide();
  });
}
// added std functions
function Add_To_Order() {
  if (process_order(0)) {;
    // process order - 1=popup 0=no popup and if true submit 
    var pageid = document.template.pageid.value;
    if (pageid == '2A') { // search results page
      document.template.searchflag.value = 'N'; //tells is not to do another search 
      document.template.startptr.value = Manager.widgets.pager.currentPage;
    }
    document.template.submit();
  }
}
function Add_To_Order_Grid() {
    var pageid = document.template.pageid.value;
if (pageid == '5') {  // current order page - edit mode
   // total new fields from grid
   // update qty box 
var fname = $("[name='gridfield']").val() ; 
var rtnqty = getgridtqty() ;
if (isNaN(rtnqty)) {
 } else {
 $("[name='" + fname + "']").val(rtnqty) ;
  process_order(0) ; 
}
    document.template.submit();
} else { 
  if (process_order(0)) {;
    // process order - 1=popup 0=no popup and if true submit 
    if (pageid == '2A') { // search results page
      document.template.searchflag.value = 'N'; //tells is not to do another search 
      document.template.startptr.value = Manager.widgets.pager.currentPage;
    }
    document.template.submit();
  }
}
}
function process_order(popup) {
  var Aprod_array = new Array
  var prod_array = new Array
  var qty_array = new Array
  var um_array = new Array
  var price_array = new Array
  //var comment_array = new Array
  var manufact_array = new Array
  var X = 0;
  var len = document.template.elements.length
  //loop to put into arrays
  for (var i = 0; i < len; i++) {
    var lname = document.template.elements[i].name
    var lvalue = document.template.elements[i].value
    var e_type = document.template.elements[i].type
    //do a qty chk on lvalue here
    if (lvalue != "" && e_type == "text") {
      //check to make sure name has a pipe
      //is a text type and if so process
      if (is_pipe(lname)) {
        //add one to I to acct for array starting at 0
        if (qtychk2(lvalue, i)) {
          // assumes a good qty was entered so set qty_array
          data_array = string_decode(lname)
          if (dupcheck(data_array[0])) {
            qty_array[X] = lvalue
            Aprod_array[X] = data_array[0]
            prod_array[X] = data_array[1]
            um_array[X] = data_array[2]
            price_array[X] = data_array[3]
            manufact_array[X] = data_array[4]
            X = X + 1;
            //added variable to know they added items
            var items_added = 1
          }
        } else {
          return false;
          //for qtychk failure ; 
        }
      }
      //for type=text and lvalue!= 
    }
    //for next loop in array (length of form) 
  }
  // we have our data in arrays so recode to pipe and send to variable
  document.template.Aprod_string.value = document.template.Aprod_string.value + "|" + string_recode(Aprod_array);
  document.template.prod_string.value = document.template.prod_string.value + "|" + string_recode(prod_array);
  document.template.qty_string.value = document.template.qty_string.value + "|" + string_recode(qty_array);
  document.template.um_string.value = document.template.um_string.value + "|" + string_recode(um_array);
  document.template.price_string.value = document.template.price_string.value + "|" + string_recode(price_array);
  // document.template.comment_string.value = document.template.comment_string.value + "|" + string_recode(comment_array) ;
  document.template.manufact_string.value = document.template.manufact_string.value + "|" + string_recode(manufact_array);
  var msg = "Do you want to add these items?"
  if (items_added) {;
    $.cookie("RNItemsAdded", "YES");
    //            if(popup) { ;
    //               resp = confirm(msg) ;
    //               if (resp) {            return true ;
    //               } else {
    //               return false ;
    //               }
    //            }
  }
  return true;
}
function charcount(string,char) {
 var re = new RegExp(char,"gi");
 return string.match(re).length;
}
function getgridtqty() {
  var X = 0;
  var rtnqty = 0;
  var len = document.template.elements.length
  for (var i = 0; i < len; i++) {
    var lname = document.template.elements[i].name
    var lvalue = document.template.elements[i].value
    var e_type = document.template.elements[i].type
    if (lvalue != "" && e_type == "text") {
      if (is_pipe(lname)) {
        if (qtychk2(lvalue, i)) {
          data_array = string_decode(lname)
          gchk = data_array[1]
          if(gchk == "GRID") { 
            rtnqty = rtnqty + parseInt(lvalue)
          }
        } else {
          return false;
        }
      }
    }
  }
  return parseInt(rtnqty) ;
}
function qtychk(value) {
  var str = value
  // Return false if field is blank.
  if (str == "") {
    jAlert("You did not enter a quantity! ")
    return false;
  }
  // Return false if characters are not digits '0-9'.
  for (var i = 0; i < str.length; i++) {
    var ch = str.substring(i, i + 1);
    if (ch < "0" || "9" < ch) {
      jAlert("The Quantity must be a valid number, digits '0-9'.\n\nPlease re-enter your quanity.");
      //document.template.name.value ="";
      //document.template.name.focus();
      return false;
    }
  }
  return true;
}
function qtychk2(value, x) {
  var str = value
  // Return false if characters are not digits '0-9'.
  for (var i = 0; i < str.length; i++) {
    var ch = str.substring(i, i + 1);
    if (ch < "0" || "9" < ch) {
      jAlert("The Quantity must be a valid number, digits '0-9'.\n\nPlease re-enter your quantity.");
      document.template.elements[x].value = "";
      document.template.elements[x].focus();
      return false;
    }
  }
  return true;
}
function is_pipe(string) {
  for (var j = 0; j < string.length; j++) {
    var ln = string.substring(j, j + 1);
    if (ln == "|") {
      return true;
    }
  }
}
function inventory_inquiry(loginpath, sflag, aprodno) {
  document.template.aprodno.value = aprodno;
  searchpath('1', 'F', loginpath, sflag)
}
function prod_inquiry(loginpath, sflag, aprodno) {
  document.template.aprodno.value = aprodno;
  searchpath('1', 'F', loginpath, sflag)
}
function changesort(path, sflag, sort, footprt) {
  document.template.startptr.value = 1;
  document.template.searchflag.value = sflag;
  document.template.loginpath.value = path;
  document.template.Changesort.value = sort;
  document.template.submitvar.value = footprt;
  document.template.submit();
}
function results_sort(path, sflag, footprt) {
  document.template.startptr.value = 1;
  document.template.searchflag.value = sflag;
  document.template.loginpath.value = path;
  document.template.submitvar.value = footprt;
  document.template.submit();
}
function searchpath(startptr, direction, path, footprt) {
  if (process_order(0)) {;
    // code to get startpointer
    if (direction == "F") {
      convertstring = startptr + "+" + 10;
    } else {
      if (direction == "B") {
        convertstring = startptr + "-" + 10;
      } else {
        convertstring = direction;
      }
    }
    startptr = eval(convertstring)
    if (startptr < 1) {
      startptr = 1;
    }
    //if startptr is greater than total lines then set it to total lines
    if (startptr > 2) {
      startptr = 2;
    }
    document.template.startptr.value = startptr;
    document.template.searchptr.value = startptr;
    document.template.submitvar.value = footprt;
    document.template.searchflag.value = 'N';
    document.template.loginpath.value = path;
    document.template.submit();
  }
}
function browsepath_save(x, svar) {
  document.template.startptr.value = 1;
  document.template.searchflag.value = 'Y';
  document.template.submitvar.value = svar;
  document.template.loginpath.value = x;
  if (document.all || document.getElementById) {
    //screen thru every element in the form, and hunt down 'submit' and 'reset'
    for (i = 0; i < document.template.length; i++) {
      var tempobj = document.template.elements[i]
      if (tempobj.type.toLowerCase() == 'submit' || tempobj.type.toLowerCase() == 'reset' || tempobj.type.toLowerCase() == 'button') {
        //disable em
        tempobj.disabled = true
      }
    }
  }
  document.template.submit();
}
function show_video(video) {
  var pgm = video;
  var name = "showvideo";
  var parms = "toolbar=no,top=200,left=200,width=600,height=400,directories=no,status=no,scrollbars=yes,resizable=yes,menubar=no";
  showvid = window.open(pgm, name, parms);
  showvid.focus();
}
function changesort_toggle(path, sflag, sort) {
  var csort = document.template.Changesort.value;
  if (csort == sort) {
    if (sort.substring(1, 5) == '-DSND') {
      var tlen = len(sort) - 5;
      sort = sort.substring(6, tlen);
    } else {
      sort = '-DSND ' + sort;
    };
  };
  document.template.startptr.value = 1;
  document.template.searchflag.value = sflag;
  document.template.loginpath.value = path;
  document.template.Changesort.value = sort;
  document.template.submit();
}
function changesort_search_toggle(path, sflag, sort) {
  var csort = document.template.Changesort.value;
  if (csort == sort) {
    if (sort.indexOf("asc") > 0) {
      var sort = sort.replace("asc", "desc");
    } else {
      var sort = sort.replace("desc", "asc");
    };
  };
  document.template.startptr.value = 1;
  document.template.searchflag.value = sflag;
  document.template.loginpath.value = path;
  document.template.Changesort.value = sort;
  document.template.submit();
}
// added global popup for add to order
function ShowAdd(prodid) {
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=QAO&pageid=31&APRODNO=' + prodid;
  var dummy = showmodalrnpopup_persist(pageurl);
}
// added global popup for crm
function pcrm(lpath,acustno,mode) {
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=' + lpath + '&pageid=31&ACUSTNO=' + acustno;
if (mode == 'U') { 
$("#NoteStatus").html("Updating Note....") ; 
if (!$.trim($("#notedata").val())) {
$("#NoteStatus").html("Please enter a note to update. Our Apologies, We can't seem to find your note..") ; 
return ; 
}
var notedata = $("#notedata").val() ;
var notedate = $("#notedate").val() ;
var notetime = $("#notetime").val() ;
var notedata = notedata.replace(/\r\n|\r|\n/g,"~");
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=' + lpath + '&pageid=31&ACUSTNO=' + acustno + '&MODE=U&NOTEDATA=' + notedata + '&NOTETIME=' + notetime + '&NOTEDATE=' + notedate ; 
}
if (mode == 'C') { 
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=' + lpath + '&pageid=31&ACUSTNO=' + acustno + '&MODE=C&NOTEDATA=' + notedata + '&NOTETIME=' + notetime + '&NOTEDATE=' + notedate ; 
}
if (mode == 'V') { 
var aptemail = $("#aptemail").val() ;
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=' + lpath + '&pageid=31&ACUSTNO=' + acustno + '&MODE=V&EMAIL=' + aptemail + '&NOTETIME=' + notetime + '&NOTEDATE=' + notedate ; 
}
//   var dummy = showmodalrnpopup_persist(pageurl);
$("#CRMHolderPopup").show() ;
$("#CRMHolderPopup").html("Loading....") ; 
var dummy = widgetload_callback(pageurl,"#CRMHolderPopup", function() { ; 
 //  divcrm=dhtmlwindow.open('divcrmid', 'div', 'CRMHolderPopup', 'Remotenet CRM ', 'width=800px,height=600px,left=20px,top=20px,resize=1,scrolling=1');
// $("#CRMHolderPopup").html("Load Completed....") ; 
 $('#datepairExample .time').timepicker({
        'showDuration': true,
        'timeFormat': 'g:ia',
         'scrollDefault': 'now' 
    });
    $('#datepairExample .date').datepicker({
        'format': 'mm/dd/yy',
        'autoclose': true
    });
    // initialize datepair
    $('#datepairExample').datepair();
}) ; // for call back
}
// Added new popup with X for generic popups
function showmodalrnpopup_persist(parms) {
  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("#SessLoaderPersist").length < 1) {
    // need to create div 
var mdiv = $("<div id='SessLoaderPersist'> </div>");
$("[name='template']").append(mdiv)  ;
//     makediv("SessLoaderPersist");
  }
  //Get the screen height and width  
  var maskHeight = $(document).height();
  var maskWidth = $(document).width();
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
  var winH = $(window).height() - 20;
  var winW = $(window).width() - 20;
  //Set the popup window to center  
  $('#SessLoaderPersist').css({
    'width': 'auto',
    'max-width': winW,
    'height': 'auto',
    'max-height': winH,
    'padding': '20px',
    '-webkit-border-radius': '50px',
    '-moz-border-radius': '50px',
    'border-radius': '50px',
    'border': '2px solid #363600',
    'background-color': '#FFFFFF',
    '-webkit-box-shadow': '#CCCCCC 10px 10px 10px',
    '-moz-box-shadow': '#CCCCCC 10px 10px 10px',
    'box-shadow': '#CCCCCC 10px 10px 10px',
    'display': 'none',
    'z-index': '9999',
    'color': 'black',
    'position': 'fixed',
    'top': '20%',
    'left': '20%'
  });
  $('#SessLoaderPersist').html('<div style="font-family:arial;font-size:20px;"> <div style=float:right> <img id="SessClose" src="' + image_url + 'close_pop.png" style="padding-right: 33px;" > </div> </div> <div id="SessContent"> </div> ');
  var dummy = widgetload(parms, '#SessContent');
  $('#SessContent').css({
    'width': 'auto',
    'max-width': winW,
    'overflow': 'auto',
    'height': 'auto',
    'max-height': winH - 100
   }) ; 
  //transition effect  
//  $('#SessLoaderPersist').css('top', winH / 2 - $('#SessLoaderPersist').height() / 2);
//  $('#SessLoaderPersist').css('left', winW / 2 - $('#SessLoaderPersist').width() / 2);
  $('#SessLoaderPersist').fadeIn(2000);
  //if clicked hide
  $('#SessClose').click(function() {
    $('#SessLoaderPersist').hide();
    $('#mask').fadeOut(1000)
  });
}
//end added generic popup
function HotReorder(result) {
$.cookie("RNItemsAdded", "YES");
  addfield("3", "pageid", document.forms[0].pageid);
  addfield(result, "final_string", document.forms[0].final_string);
  addfield("N", "searchflag", document.forms[0].searchflag);
  document.forms[0].submit();
}
function auto_template(x, templateorderno) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  var today = mm + '/' + dd + '/' + yyyy;
  var tname = "Order: " + templateorderno + " " + today;
  bmsg = "Save Template"
  str = jPrompt("Please enter the New Template Name. To add items to a template\nuse an existing template name.", tname, "Save as Template", function(str) {
    if (str) {
      var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=STTX&pageid=31&TEMPLATEORDERNO=' + templateorderno + '&CUSTOMLIST_SAVE=' + str + '';
      var dummy = showmodalrnpopup_persist(pageurl);
    } else {
      if (str == "") {
        jAlert("\nYou must enter a Template name ")
      };
    }
  });
  //       str = jPrompt("Please enter the Template Name.\n Or Click ok to use the name below\n To add items to a template\nuse an existing template name.",tname) ;
}
function showmodalrnprompt_persist(msg, val, bmsg) {
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
  $('#SessLoader').html('<div style="font-family:arial;font-size:20px;"> <div style=float:right> <img id="SessClose" src="' + image_url + 'close_pop.png" style="padding-right: 33px;" > </div> </div> <div id="SessContent"> </div> ');
  $('#SessLoader').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'margin-top': '-250px',
    'margin-left': '-130px'
  });
  //var dummy = widgetload(parms,'#SessContent');
  // create message to display
  var pmsg = msg + '<input id=presp length=20 value="' + val + '"> <br>  <input type=button value="' + bmsg + '" id="prespbutton" >'
  $('#SessContent').html(pmsg);
  //transition effect  
  $('#SessLoader').fadeIn(2000);
  //if clicked hide
  $('#SessClose').click(function() {
    $('#SessLoader').hide();
    $('#mask').fadeOut(1000)
  });
  $('#prespbutton').click(function() {
    $('#SessLoader').hide();
    $('#mask').fadeOut(1000)
    return $('#presp').val();
  });
}
//end added generic popup
function relexport(etype, relno) {
  var form_content = ''
  var OID = document.forms[0].orderno.value;
  var CID = document.forms[0].CustomerId.value;
  var form_content = form_content + '<input type=hidden name=pageid value="31">';
  var form_content = form_content + '<input type=hidden name=LOGINPATH value="RELX">';
  var form_content = form_content + '<input type=hidden name=HTMLCONVERT value="' + etype + '">';
  var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
  var form_content = form_content + '<input type=hidden name=mdsorderno value="' + relno + '">';
  var form_content = form_content + '<input type=hidden name=TARGETVAL value="' + OID + '">';
  var form_content = form_content + '<input type=hidden name=ITEMSPAGE value="5000">';
  var form_content = form_content + '</form>';
  submitOtherFormUnique(form_content);
}
function fav_te_savedmplate(prodid) {
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=STTX&pageid=31&TEMPLATEPRODNO=' + prodid + '&CUSTOMLIST_SAVE=Favorites'
  var dummy = showmodalrnpopup_persist(pageurl);
}
function fav_template(prodid) {
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=CTTX&pageid=31&TEMPLATEPRODNO=' + prodid + '&CUSTOMLIST_SAVE=Favorites'
  var dummy = showmodalrnpopup_persist(pageurl);
var t = setTimeout($("#templatelist").chosen({ no_results_text: "No results matched" }), 1000);
}
function Add_To_Template(template,prodid) {
  var pageurl = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=STTX&pageid=31&TEMPLATEPRODNO=' + prodid + '&CUSTOMLIST_SAVE=' + template
  var dummy = showmodalrnpopup_persist(pageurl);
}
// Added new create functions and default sales man 
$(window).load(function() {
var val = $.cookie('RnSalesCheck');
if (val !== 'NO') {
  setTimeout(function() {    SlsHeaderShow();  }, 1000);
}
});
function SlsHeaderShow() {
  if (ShowSalesmanCustCreate == "Y") {
    $('.CreateCust').show();
  } else {
    $('.CreateCust').remove();
  };
  if (ShowSalesmanProdCreate == "Y") {
    $('.CreateProd').show();
  } else {
    $('.CreateProd').remove();
  };
  if (ShowSalesmanPricing == "Y") {
    var shtml = '';
    //   shtml += "<div class=slsheader style='font-size: 14px;float: left ;' > " ;
    //   shtml += "<img src='" +  image_url + "/salesman.png' alt='View Salesman Information'>" ;
    //   shtml +=" <a href='#' onclick=\"javascript:showsalesinfo();\" title='View Salesman Information' > + </a> |  "
    //   shtml += "<a href='#' onclick=\"javascript:hidesalesinfo();\" title='Hide Salesman Information' > - </a> "
    //  shtml += "<br><BR><a href='#' onclick=\"javascript:regme();\" title='Create New Customer' > Create Customer </a>" ;
    //  shtml += "<BR><a href='#' onclick=\"javascript:prodcreate();\" title='Create New Product' > Create Product </a>" ;
    //   shtml +=" </div> " ;
    $('#right').prepend(shtml);
    var sheight = $("#SRsearchresults").height();
    $('.slsheader').css({
      'position': 'relative',
      'width': '250px',
      'left': '-30px',
//       'background': 'rgb(240, 248, 255)',
//       'height': sheight
    });
    SalesVisible = true;
    $('.Salesinfo').show();
  };
};
//added registration popup
function regme(origwebid) {
  var url = document.location.href;
  url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
  url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
  url = url.substring(url.lastIndexOf("/") + 1, url.length);
  var pageurl = url + "?";
  //  pageurl += "?ORDERNO=" + $("input[name='orderno']").val() ;
  pageurl += "SLSMNO=" + $("input[name='slsmno']").val();
  pageurl += '&LOGINPATH=REG&PAGEID=31&CUSTOMERID=NEWCUST';
  if (origwebid !== '') {
    pageurl += '&ORIGWEBID=' + origwebid;
  }
  window.open(pageurl);
}
//added registration popup for prospects
function regprospect(origwebid) {
  var url = document.location.href;
  url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
  url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
  url = url.substring(url.lastIndexOf("/") + 1, url.length);
  var pageurl = url + "?";
  //  pageurl += "?ORDERNO=" + $("input[name='orderno']").val() ;
  pageurl += "SLSMNO=" + $("input[name='slsmno']").val();
  pageurl += '&LOGINPATH=REGP&PAGEID=31&CUSTOMERID=NEWCUST';
  if (origwebid !== '') {
    pageurl += '&ORIGWEBID=' + origwebid;
  }
  window.open(pageurl);
}
function prodcreate() {
  var url = document.location.href;
  url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
  url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
  url = url.substring(url.lastIndexOf("/") + 1, url.length);
  var pageurl = url + "?";
  //  pageurl += "?ORDERNO=" + $("input[name='orderno']").val() ;
  pageurl += "SLSMNO=" + $("input[name='slsmno']").val();
  pageurl += '&LOGINPATH=PCE&PAGEID=31&DAPRODNO=DEFAULTPROD&CUSTOMERID=NEWCUST';
  window.open(pageurl);
}
// added new functions from rn header 
function weblinksearch(e) {
  showmodalsearch();
  eval(e);
};
function htmlEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function multiLineHtmlEncode(value) {
  var lines = value.split(/\r\n|\r|\n/);
  for (var i = 0; i < lines.length; i++) {
    lines[i] = htmlEncode(lines[i]);
  }
  return lines.join('\r\n');
}
function htmlEncode(value) {
  return $('<div/>').text(value).html();
}
function htmlDecode(value) {
  return $('<div/>').html(value).text();
}
function loadweborder() {
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&dboption=WEBORD&LOGINPATH=SOX&pageid=31&TARGETVAL=' + OID + '';
  var dummy = showmodalrnpopup(pageurl);
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
 format: 'HMS',
 });
}
function ordergrid_fullpage(prodno) {
//   var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&PRODNO=' + prodno + '&LOGINPATH=GRID&pageid=31';
  addfield("GRID", "loginpath", document.forms[0].loginpath);
  addfield(prodno, "prodno", document.forms[0].prodno);
  document.forms[0].submit();
}
function ordergrid(prodno) {
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&PRODNO=' + prodno + '&LOGINPATH=GRID&pageid=31';
var dummy = showmodalrnpopup_persist(pageurl);
//   $('#SRBodyLine' + prodno).removeClass("shadow");
//   $('div[id^="navigation"]').hide();
//   $('#SRAOButton').hide();
//   var dummy = widgetload(pageurl, '#SRBodyLine' + prodno);
//   $('#SRBodyLine' + prodno).css({
//     'width': '600',
//     'height': 'auto',
//     'padding': '10px',
//     'float': 'none',
//     'border': 'none'
//   });
}
function editgrid(prodno,webkey,fieldname) {
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&PRODNO=' + prodno + '&LOGINPATH=GRID&MODE=EDIT&pageid=31&' + 'WEBKEY=' + webkey ; 
  addfield(fieldname, "gridfield", document.forms[0].gridfield);
var dummy = showmodalrnpopup_persist(pageurl);
}
function showsalesinfo() {
  var sheight = $("#SRsearchresults").height();
  $('.slsheader').css({
    'position': 'relative',
    'width': '250px',
    'left': '-30px',
//     'background': 'rgb(240, 248, 255)',
//     'height': sheight
  });
  //  $('.Salesinfo').css({'display':'block'}) ;
  SalesVisible = true;
  $('.Salesinfo').show();
}
function hidesalesinfo() {
  var sheight = 'auto';
  $('.slsheader').css({
    'position': 'relative',
    'width': 'auto',
    'left': 'auto',
    'background': 'transparent',
    'height': sheight
  });
  // $('.Salesinfo').css({'display':'none'}) ;
  SalesVisible = false;
  $('.Salesinfo').hide();
}
function loadprint() {
  var mywindow = window.open('', 'Print_Web_Order', '');
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&dboption=WEBORD&LOGINPATH=SOX&pageid=31&TARGETVAL=' + OID + '';
  var params = "";
  // BEGIN GET QUERY STRING CODE ;
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    data: params,
    dataType: "html",
    success: function(data) {
      mywindow.document.write('<html><head><title>Print Web Order ' + OID + '</title>');
      mywindow.document.write('<link rel="stylesheet" href="' + StyleID + '" type="text/css" />');
      mywindow.document.write('</head><body >');
      mywindow.document.write(data);
      mywindow.document.write('</body></html>');
      mywindow.document.close();
      mywindow.print();
      return true;
    }
  });
}
// NEW LOAD EXPORT FUNCTION 11-4-13
function loadexport(etype) {
  var form_content = ''
  var form_content = form_content + '<input type=hidden name=pageid value="31">';
  var form_content = form_content + '<input type=hidden name=LOGINPATH value="ORDX">';
  var form_content = form_content + '<input type=hidden name=HTMLCONVERT value="' + etype + '">';
  var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
  var form_content = form_content + '<input type=hidden name=orderno value="' + OID + '">';
  var form_content = form_content + '<input type=hidden name=TARGETVAL value="' + OID + '">';
  var form_content = form_content + '<input type=hidden name=DBOPTION value="WEBORD">';
  var form_content = form_content + '<input type=hidden name=ITEMSPAGE value="5000">';
  //  var form_content = form_content + '</form>';
  //  submitOtherForm(form_content, "exportform") ;
  submitOtherFormUnique(form_content);
}
// END LOAD EXPORT FUNCTION
function ExportGrid(prodno, etype, webkey) {
  var form_content = ''
  var content = $("[name='template']").serialize();
  content = htmlEscape(content);
  // sent_content = multiLineHtmlEncode(sent_content) ;
  var form_content = form_content + '<input type=hidden name=GRIDDATA value="' + content + '">';
  var form_content = form_content + '<input type=hidden name=WEBKEY value="' + webkey + '">';
  var form_content = form_content + '<input type=hidden name=pageid value="31">';
  var form_content = form_content + '<input type=hidden name=LOGINPATH value="GRID">';
  var form_content = form_content + '<input type=hidden name=HTMLCONVERT value="' + etype + '">';
  var form_content = form_content + '<input type=hidden name=PRODNO value="' + prodno + '">';
  var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
  var form_content = form_content + '<input type=hidden name=orderno value="' + OID + '">';
  var form_content = form_content + '<input type=hidden name=MODE value="SAVE">';
  //    $content.append(form_content) ;
  //  var pageurl = 'login' + SUFFIX + '?' +  $content.serialize() ;
  // submitOtherFormUnique(stuff) ;
  // var targetvalue = "_blank" ; 
  //     $content.prop("target", targetvalue);
  //     $content.submit() ; 
  // var targetvalue = "_self" ; 
  //     $content.prop("target", targetvalue);
  submitOtherFormUnique_callback(form_content, function() {
    var t = setTimeout("Add_To_Order_Grid()", 10);
  });
}
// NEW REMIND ME FUNCTION 10-30-13
function remindme(prodid) {
  // get the users' email and display 
  if ($("#StockContent").length < 1) {
    makediv("StockContent");
  }
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=SA&pageid=31&PRODNO=' + prodid
  var params = "";
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: false,
    data: params,
    dataType: "html",
    success: function(data) {
      $("#StockContent").html(data);
      stockalert = dhtmlwindow.open('stockbox', 'inline', data, 'Remind me when this product is available', 'width=450px,height=300px,left=200px,top=150px,resize=1,scrolling=1,center=1');
      $("#StockContent").hide(); // this data is in the popup now.. 
    }
  });
}
function setupstockalert(prodid) {
  //returns false if user clicks on "No" button:
  var emailid = $('#StockEmail').val()
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=SA&pageid=31&EMAIL=' + emailid + '&PRODNO=' + prodid, '#StockContent');
  stockalert.close(); //var returnval=confirm("You are about to close this window. Are you sure?")
  //return returnval
}
function setupquotealert(prodid) {
  //returns false if user clicks on "No" button:
  var emailid = $('#QuoteEmail').val()
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=QOE&pageid=31&EMAIL=' + emailid + '&PRODNO=' + prodid;
  // var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=QOE&pageid=31&EMAIL=' + emailid + '&PRODNO=' + prodid,'#QuoteContent');
  quotealert.close(); //var returnval=confirm("You are about to close this window. Are you sure?")
  var dummy = showmodalrnpopup(pageurl);
  //return returnval
  if (prodid = "HO") {
    // cancelsend("HO") ;
    addfield("HO", "loginpath", document.template.loginpath);
    addfield(OID, "oldorderno", document.template.oldorderno);
    document.template.submit();
  }
}
function sendquote(prodid) {
  // get the users' email and display 
  if ($("#QuoteContent").length < 1) {
    makediv("QuoteContent");
  }
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=QOE&pageid=31&PRODNO=' + prodid
  var params = "";
  queryVar = pageurl;
  var inq = pageurl.indexOf('?');
  queryVar = queryVar.substring(inq + 1);
  queryVar = unescape(queryVar);
  var params = queryVar;
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: false,
    data: params,
    dataType: "html",
    success: function(data) {
      $("#QuoteContent").html(data);
      quotealert = dhtmlwindow.open('quotebox', 'inline', data, ' Send a Quote', 'width=450px,height=300px,left=200px,top=150px,resize=1,scrolling=1,center=1');
      $("#QuoteContent").hide(); // this data is in the popup now.. 
    }
  });
}
function loadsideorder() {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=STX&pageid=31&DBOPTION=WEBORD&ITEMSPAGE=5&TARGETVAL=' + OID , '#printdivcontainer');
}
function loadspecials() {
  if (MDSSpecialsTemplate !== '') {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=HOTV&pageid=31&CUSTOMLIST=WEB*' + MDSSpecialsTemplate, '#RSdivcontainer');
  } else {
    //         $("#RSdivcontainer").html("Missing Template Id in Parameter Web Order Options") ;
  }
}
function loadprodspecials() {
  if (MDSSpecialsTemplate !== '') {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=HOT&pageid=31&CUSTOMLIST=WEB*' + MDSSpecialsTemplate, '#Specialscontainer');
  } else {
    //         $("#Specialscontainer").html("Missing Template Id in Parameter Web Order Options") ;
  }
}
function loadreorders() {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=REOO&pageid=31&ITEMSPAGE=25', '#Reocontainer');
    var dummy2 = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=REOI&pageid=31&ITEMSPAGE=25&CUSTOMLIST=1', '#Reicontainer');
}
function changeprice(prodid, um, aprodno) {
  var dname = '#' + prodid + um + 'salesprice';
  var price = $(dname).val();
  if ($("#PriceContent").length < 1) {
    // need to create div 
    makediv("PriceContent");
    $('#PriceContent').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'margin-top': '-100px',
      'margin-left': '-130px'
    });
    //   $('#PriceContent').click(function () { var dummy = SRLineLoad(prodid,aprodno) ;  $(this).hide();  }  ) ;
  }
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=PRCU&pageid=31&PRICE=' + price + '&PRODNO=' + prodid + '&UM=' + um, '#PriceContent');
  $('#PriceContent').show();
}
function onetimeprice(prodid, um, aprodno, itemline) {
  var dname = '#' + prodid + um + 'salesprice';
  var price = $(dname).val();
  if ($("#PriceContent").length < 1) {
    // need to create div 
    makediv("PriceContent");
    $('#PriceContent').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'margin-top': '-100px',
      'margin-left': '-130px'
    });
  }
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=PRCU&PRICE=' + price + '&pageid=31&ITEMLINE=' + itemline + '&PRODNO=' + prodid + '&UM=' + um, '#PriceContent');
  $('#PriceContent').show();
}
function changegp(prodid, um, aprodno) {
  var dname = '#' + prodid + um + 'salesgp';
  var gp = $(dname).val();
  if ($("#PriceContent").length < 1) {
    // need to create div 
    makediv("PriceContent");
    $('#PriceContent').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'margin-top': '-100px',
      'margin-left': '-130px'
    });
    //   $('#PriceContent').click(function () { var dummy = SRLineLoad(prodid,aprodno) ;  $(this).hide();  }  ) ;
  }
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=PRCU&pageid=31&GP=' + gp + '&PRODNO=' + prodid + '&UM=' + um, '#PriceContent');
  $('#PriceContent').show();
}
// added price cancel
function cancelprice(prodid, um, aprodno) {
  if ($("#PriceContent").length < 1) {
    // need to create div 
    makediv("PriceContent");
    $('#PriceContent').css({
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'margin-top': '-100px',
      'margin-left': '-130px'
    });
    $('#PriceContent').click(function() {
var pageid = document.template.pageid.value;
if (pageid == '2A') { // search results page
      var dummy = SRLineLoad(prodid, aprodno);
}
      $(this).hide();
    });
  }
  var expinfo = 'Y';
  $('#PriceContent').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'margin-top': '-100px',
    'margin-left': '-130px'
  });
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&MODE=U&CUSTOMERID=' + CID + '&LOGINPATH=PRCU&pageid=31&EXPIRE=' + expinfo + '&PRODNO=' + prodid + '&UM=' + um, '#PriceContent');
  $('#PriceContent').show();
}
// END REMIND ME FUNCTION
// added Suggested items logic
function suggitems(prodid) {
  // note: use a template from the customer called WEB and an * and the indexid of the template ie WEB*1,WEB*2 etc. ;
  var params = 'orderno=' + OID + '&LOGINPATH=SUG&pageid=31&ITEMSPAGE=3&CUSTOMLIST=WEB*' + prodid + '&CUSTOMERID=' + CID + '';
  var targetname = '#Suggdiv'
  var loadh = "<img src='" + image_url + "ajax-loader-small.gif'> "
  $(targetname).html(loadh);
  // BEGIN GET QUERY STRING CODE ;
  var pageurl = 'login' + SUFFIX + '?' + params;
  //  var pageurl = '../../rnwebservice/rndriver.asmx/RNDriver' + SUFFIX + '?' + params ;
  jQuery.ajax({
    type: "POST",
    url: pageurl,
    async: true,
    data: params,
    timeout: 20000,
    tryCount: 0,
    retryLimit: 3,
    dataType: "html",
    success: function(data) {
      $(targetname).html(data); // alert('Load was performed.');
      var str = $(targetname).html()
      var n = str.indexOf("Error");
      if (n > 0) {
        $(targetname).html("We don't have any suggestions available at this time, but the more you purchase the better our suggestions will be, so check back soon.");
        // $(targetname).html('No Suggestions Available') ;
        // $('#Suggwrap').hide() ;
      }
      if ($(targetname + ":contains('error_box')").length) {
        $(targetname).html('Remotenet Error');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).html('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times ' + 'Error: ' + textStatus);
        return;
      }
      if (xhr.status == 500) {
        $(targetname).html('Oops! There seems to be a server problem, please try again later.' + 'Error: ' + textStatus);
      } else {
        //            $(targetname).html('Error on Page...') ;
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          //try again
          $.ajax(this);
          return;
        }
        $(targetname).html('There was an Error connecting to the Server. We have tried ' + this.retryLimit + ' times ' + 'Error: ' + textStatus);
        return;
      }
    }
  });
}
//added reorder guide and labels
function loadreorderguide(ordval) {
  var form_content = '<form name="reordform" id="reordform" method="post" action="login' + SUFFIX + '" target="_blank">';
  var form_content = form_content + '<input type=hidden name=pageid value="31">';
  var form_content = form_content + '<input type=hidden name=LOGINPATH value="REO">';
  var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
  var form_content = form_content + '<input type=hidden name=orderno value="' + ordval + '">';
  var form_content = form_content + '<input type=hidden name=ITEMSPAGE value="5000">';
  var form_content = form_content + '</form>';
  submitOtherForm(form_content, "reordform");
}
function loadlabel(ordval, ltype) {
  var form_content = '<form name="labelform" id="labelform" method="post" action="login' + SUFFIX + '" target="_blank">';
  var form_content = form_content + '<input type=hidden name=pageid value="31">';
  var form_content = form_content + '<input type=hidden name=LABELTYPE value="' + ltype + '">';
  var form_content = form_content + '<input type=hidden name=LOGINPATH value="LBL">';
  var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
  var form_content = form_content + '<input type=hidden name=orderno value="' + ordval + '">';
  var form_content = form_content + '</form>';
  submitOtherForm(form_content, "labelform");
}
function submitOtherForm(form_content, form_name) {
  // Added code to append a unique id
  var fid = new Date().getTime();
  var _body = document.getElementsByTagName('body')[0];
  var _div = document.createElement('div');
  _body.appendChild(_div);
  _div.innerHTML = (form_content);
  document.getElementById(form_name).submit();
}
// added new unique forms 
function submitOtherFormUnique(form_data) {
  // Added code to append a unique id
  var fid = new Date().getTime();
  var formname = "form" + fid;
  var _body = document.getElementsByTagName('body')[0];
  var _div = document.createElement('div');
  _body.appendChild(_div);
  var form_content = '<form name="' + formname + '" id="' + formname + '" method="post" action="login' + SUFFIX + '" target="_blank">';
  var form_content = form_content + form_data;
  var form_content = form_content + '</form>';
  _div.innerHTML = (form_content);
  document.getElementById(formname).submit();
}
function submitOtherFormUnique_callback(form_data, callback) {
  // Added code to append a unique id
  var fid = new Date().getTime();
  var formname = "form" + fid;
  var _body = document.getElementsByTagName('body')[0];
  var _div = document.createElement('div');
  _body.appendChild(_div);
  var form_content = '<form name="' + formname + '" id="' + formname + '" method="post" action="login' + SUFFIX + '" target="_blank">';
  var form_content = form_content + form_data;
  var form_content = form_content + '</form>';
  _div.innerHTML = (form_content);
  document.getElementById(formname).submit();
  callback();
}
// ADDED NEW SPECIALS LOGIC..
// added new send order popup
function showmodalsession() {
  // This is for the daily specials popup at login
  var val = $.cookie('SessFilter');
  //  var val = $.cookie('SessFilter[WEB.ORDERNO]') ;
  if (val == 'YES') {
    return;
  }
  if (DailySpecials == '') {
    return;
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
    'width': '530px',
    'height': '300px',
    'padding': '0px',
    'background': 'white'
  });
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
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=DS&pageid=31&TARGETVAL=' + DailySpecials, '#SessContent');
  //transition effect  
  $('#SessLoader').fadeIn(2000);
  $.cookie("SessFilter", "YES");
  // $.cookie("SessFilter[WEB.ORDERNO]", "YES");
  //if clicked hide
  $('#SessLoader').click(function() {
    $(this).hide();
    $('#mask').fadeOut(1000)
  });
}
// end added session specials 
// Added new popup with X for generic popups
function showmodalrnpopup(parms) {
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
  $('#SessLoader').click(function() {
    $(this).hide();
    $('#mask').fadeOut(1000)
  });
}
//end added generic popup
function showmodalspecials() {
  var val = $.cookie('SpecFilter' + OID + '');
  if (val == 'YES') {
    sendorder("SO", "N");
    return;
  }
  if (OrderSpecials == '') {
    sendorder("SO", "N");
    return;
  }
  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("#SpecLoader").length < 1) {
    // need to create div 
    makediv("SpecLoader");
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
    'display': 'none',
    'filter': 'inherit'
  });
  //transition effect   
  $('#mask').fadeIn();
  $('#mask').fadeTo("slow", 0.8);
  // $('#mask').show() ;
  //Get the window height and width  
  var winH = $(document).height();
  var winW = $(window).width();
  //Set the popup window to center  
  $('#SpecLoader').css({
    'width': '530px',
    'height': '400px',
    'padding': '10px',
    'background': 'white'
  });
  $('#SpecLoader').css({
    '-webkit-border-radius': '50px',
    '-moz-border-radius': '50px',
    'border-radius': '50px',
    'border': '2px solid #363600',
    'background-color': '#FFFFFF',
    '-webkit-box-shadow': '#CCCCCC 10px 10px 10px',
    '-moz-box-shadow': '#CCCCCC 10px 10px 10px',
    'box-shadow': '#CCCCCC 10px 10px 10px'
  });
  $('#SpecLoader').css({
    'display': 'none',
    'filter': 'inherit',
    'z-index': '9999',
    'position': 'absolute',
    'color': 'black'
  });
  $('#SpecLoader').html('<div style="font-family:arial;font-size:20px;"> <div style=float:right> <img src="' + image_url + 'close_pop.png" style="padding-right: 33px"> </div> </div> <div id=SpecContent> </div><input type=button class="button2" name="SO" value="No Thanks" onclick=javascript:changepath(name,"N")> <br/> ');
  //$('#SpecLoader').css('top',  winH-460);
  // LOADED 200 PX FROM BOTTOM PLUS SIZE OF DIV
  // $('#SpecLoader').css('top',  winH/2-$('#SLoader').height()/2);
  // $('#SpecLoader').css('left', winW/2-$('#SLoader').width()/2);
  $('#SpecLoader').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'margin-top': '-250px',
    'margin-left': '-130px'
  });
  var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PTX&pageid=31&TARGETVAL=' + OrderSpecials, '#SpecContent');
  //transition effect  
  $('#SpecLoader').fadeIn();
  // $('#SpecLoader').show();
  var cname = "SpecFilter" + OID;
  $.cookie(cname, "YES");
  //if clicked hide
  $('#SpecLoader').click(function() {
    $(this).hide();
    $('#mask').fadeOut(1000)
  });
}
// End added code for specials
// Added scan connect popup
function showmodalsccart() {
  $('#SessLoader').hide();
  // FOR BEADCART DONT SHOW THE FILTER
  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
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
  $('#SCLoader').css({
    'width': '500px',
    'height': '500px',
    'padding': '10px',
    'background': 'white'
  });
  $('#SCLoader').css({
    'display': 'none',
    'z-index': '9999',
    'position': 'absolute',
    'color': 'black'
  });
  $('#SCLoader').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'margin-top': '-250px',
    'margin-left': '-250px'
  });
  //transition effect  
  $('#SCLoader').fadeIn(2000);
  //if clicked hide
  $('#SCLoader').click(function() {
    $(this).hide();
    $('#mask').fadeOut(1000)
  });
}
// end added scan connect popup
// Added archive view
function loadarchive(doctype, xvar) {
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=ARC&pageid=31&DOCTYPE=' + doctype + '&DOCNO=' + xvar
  var dummy = showmodalrnpopup(pageurl);
}
// end of archive view
// Added archive download
function getarchivedoc(docid, doctype) {
  var form_content = ''
  var form_content = form_content + '<input type=hidden name=pageid value="31">';
  var form_content = form_content + '<input type=hidden name=LOGINPATH value="ARC">';
  var form_content = form_content + '<input type=hidden name=SUBMITVAR value="' + docid + '">';
  var form_content = form_content + '<input type=hidden name=FILENAME value="FORM.ARCHIVE,' + doctype + '">';
  var form_content = form_content + '<input type=hidden name=BINMODE value="Y">';
  var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
  var form_content = form_content + '<input type=hidden name=orderno value="' + OID + '">';
  // var form_content = form_content + '</form>';
  submitOtherFormUnique(form_content);
}
// end added archive download
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
    var dummy = widgetload_append_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=NTI&APRODNO=' + aprodno + '&PAGEID=31', '#SRBodyiconwrap' + prodid, function() {});
//     var dummy = widgetload_append_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=NTI&APRODNO=' + aprodno + '&PAGEID=31', '#SRBodyLine' + prodid, function() {});
 }, 1000) ; 
    var dummy = widgetload_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PRCX&APRODNO=' + aprodno + '&PAGEID=31', '#typedivcontainer' + prodid, function() {;
      // Added salesman logic
      if (ShowSalesmanPricing == "Y") {
        //  if (SLSID !== '') { 
        if ($("#SalesContent" + prodid).length > 0) {
          $("#SalesContent" + prodid).html('Updating...');
          $("#SalesContent" + prodid).remove();
        }
        var dummy = widgetload_append_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PRCS&APRODNO=' + aprodno + '&PAGEID=31', '#typedivcontainer'+ prodid , function() {
//         var dummy = widgetload_append_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PRCS&APRODNO=' + aprodno + '&PAGEID=31', '.slsheader' , function() {
          if (SalesVisible) {
            $('.Salesinfo').show();
          };
        });
      }
    }); // end of call back
  }
}
function PCXLineLoad(prodid) {
  var CID = document.forms[0].CustomerId.value;
  var OID = document.forms[0].orderno.value;
  var SID = document.forms[0].submitvar.value;
  //   var dummy = widgetload_line('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PCX&PAGEID=31&PRODNO=' + prodid ,'#pcxholder');
  if (SID !== '') {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=FTX&PAGEID=31&TARGETVAL=' + SID, '#footprintholder');
  } else {
    var dummy = widgetload('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PCX&PAGEID=31&PRODNO=' + prodid, '#pcxholder');
  }
}
$(window).load(function() {
  if (ShowSalesmanPricing == "Y") {
    //if ($("[name='slsmno']").val() !== '') {
    var shtml = '';
    shtml += "<div class=slsheader style='font-size: 14px;float: left ;' >";
 var slsuser = $("[name='slsmn_id']").val()
    shtml += "<img src='" + image_url + "/salesman.png' alt='View Salesman Information'>";
    shtml += " <a href='#' onclick=\"javascript:showsalesinfo();\" title='View Salesman Information' > + </a> |  "
    shtml += "<a href='#' onclick=\"javascript:hidesalesinfo();\" title='Hide Salesman Information' > - </a> "
    shtml += "Salesman User: " + slsuser+ " "
    shtml += " </div> ";
    $('#right').prepend(shtml);
    // Added code to set height/css properties
    //  $('#header_toplinks').prepend(shtml);
  };
});
$(window).load(function() {
  if (ShowSalesmanPricing == "Y") {
    var shtml = '';
shtml += "<li style=\"border-top: 1px solid #c7c7c7;\">  <a class=\"menuItem1\" href=\"#\" onclick=\"javascript:changepath('SUSR')\">Sales Login</a>" ;
shtml += " <span class=\"CreateCust\" > <a class=\"menuItem1\" href=\"#\" onclick=\"javascript:regme()\">Create Customer</a> </span>" ;
shtml += " <span class=\"CreateProd\"> <a class=\"menuItem1\" href=\"#\" onclick=\"javascript:prodcreate()\">Create Product</a> </span>" ;
shtml += " <span class=\"GPSales\" > <a class=\"menuItem1\" href=\"#\" onclick=\"javascript:changepath('CRM')\"> My Prospects (CRM) </a> </span>" ;
shtml += " <span class=\"GPSales\" > <a class=\"menuItem1\" href=\"#\" onclick=\"javascript:regprospect()\">Create Prospect</a> </span> </li>" ;
    $('.mini-login-menu ul').append(shtml);
  };
});
// ADDED alerts and popups 
// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Website: http://abeautifulsite.net/blog/2008/12/jquery-alert-dialogs/
//
// Usage:
//  jAlert( message, [title, callback] )
//  jConfirm( message, [title, callback] )
//  jPrompt( message, [value, title, callback] )
// 
// History:
//
//  1.00 - Released (29 December 2008)
//
//  1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
(function($) {
  $.alerts = {
    // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time
    verticalOffset: -75,
    // vertical offset of the dialog from center screen, in pixels
    horizontalOffset: 0,
    // horizontal offset of the dialog from center screen, in pixels/
    repositionOnResize: true,
    // re-centers the dialog on window resize
    overlayOpacity: .01,
    // transparency level of overlay
    overlayColor: '#FFF',
    // base color of overlay
    draggable: true,
    // make the dialogs draggable (requires UI Draggables plugin)
    okButton: '&nbsp;OK&nbsp;',
    // text for the OK button
    cancelButton: '&nbsp;Cancel&nbsp;',
    // text for the Cancel button
    dialogClass: null,
    // if specified, this class will be applied to all dialogs
    // Public methods
    alert: function(message, title, callback) {
      if (title == null) title = 'Alert';
      $.alerts._show(title, message, null, 'alert', function(result) {
        if (callback) callback(result);
      });
    },
    confirm: function(message, title, callback) {
      if (title == null) title = 'Confirm';
      $.alerts._show(title, message, null, 'confirm', function(result) {
        if (callback) callback(result);
      });
    },
    prompt: function(message, value, title, callback) {
      if (title == null) title = 'Prompt';
      $.alerts._show(title, message, value, 'prompt', function(result) {
        if (callback) callback(result);
      });
    },
    // Private methods
    _show: function(title, msg, value, type, callback) {
      $.alerts._hide();
      $.alerts._overlay('show');
      $("BODY").append('<div id="popup_container">' + '<h1 id="popup_title"></h1>' + '<div id="popup_content">' + '<div id="popup_message"></div>' + '</div>' + '</div>');
      if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);
      // IE6 Fix
      var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';
      $("#popup_container").css({
        position: pos,
        zIndex: 99999,
        padding: 0,
        margin: 0
      });
      $("#popup_title").text(title);
      $("#popup_content").addClass("J" + type);
// CHANGED TO USE J CLASSES SINCE ALERT IS COMMONLY USED
//       $("#popup_content").addClass(type);
      $("#popup_message").text(msg);
      $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
      $("#popup_container").css({
        minWidth: $("#popup_container").outerWidth(),
        maxWidth: $("#popup_container").outerWidth()
      });
      $.alerts._reposition();
      $.alerts._maintainPosition(true);
      switch (type) {
      case 'alert':
        $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
        $("#popup_ok").click(function() {
          $.alerts._hide();
          callback(true);
        });
        $("#popup_ok").focus().keypress(function(e) {
          if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click');
        });
        break;
      case 'confirm':
        $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
        $("#popup_ok").click(function() {
          $.alerts._hide();
          if (callback) callback(true);
        });
        $("#popup_cancel").click(function() {
          $.alerts._hide();
          if (callback) callback(false);
        });
        $("#popup_ok").focus();
        $("#popup_ok, #popup_cancel").keypress(function(e) {
          if (e.keyCode == 13) $("#popup_ok").trigger('click');
          if (e.keyCode == 27) $("#popup_cancel").trigger('click');
        });
        break;
      case 'prompt':
        $("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
        $("#popup_prompt").width($("#popup_message").width());
        $("#popup_ok").click(function() {
          var val = $("#popup_prompt").val();
          $.alerts._hide();
          if (callback) callback(val);
        });
        $("#popup_cancel").click(function() {
          $.alerts._hide();
          if (callback) callback(null);
        });
        $("#popup_prompt, #popup_ok, #popup_cancel").keypress(function(e) {
          if (e.keyCode == 13) $("#popup_ok").trigger('click');
          if (e.keyCode == 27) $("#popup_cancel").trigger('click');
        });
        if (value) $("#popup_prompt").val(value);
        $("#popup_prompt").focus().select();
        break;
      }
      // Make draggable
      if ($.alerts.draggable) {
        try {
          $("#popup_container").draggable({
            handle: $("#popup_title")
          });
          $("#popup_title").css({
            cursor: 'move'
          });
        } catch (e) { /* requires jQuery UI draggables */
        }
      }
    },
    _hide: function() {
      $("#popup_container").remove();
      $.alerts._overlay('hide');
      $.alerts._maintainPosition(false);
    },
    _overlay: function(status) {
      switch (status) {
      case 'show':
        $.alerts._overlay('hide');
        $("BODY").append('<div id="popup_overlay"></div>');
        $("#popup_overlay").css({
          position: 'absolute',
          zIndex: 99998,
          top: '0px',
          left: '0px',
          width: '100%',
          height: $(document).height(),
          background: $.alerts.overlayColor,
          opacity: $.alerts.overlayOpacity
        });
        break;
      case 'hide':
        $("#popup_overlay").remove();
        break;
      }
    },
    _reposition: function() {
      var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
      var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
      if (top < 0) top = 0;
      if (left < 0) left = 0;
      // IE6 fix
      if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();
      $("#popup_container").css({
        top: top + 'px',
        left: left + 'px'
      });
      $("#popup_overlay").height($(document).height());
    },
    _maintainPosition: function(status) {
      if ($.alerts.repositionOnResize) {
        switch (status) {
        case true:
          $(window).bind('resize', $.alerts._reposition);
          break;
        case false:
          $(window).unbind('resize', $.alerts._reposition);
          break;
        }
      }
    }
  }
  // Shortuct functions
  jAlert = function(message, title, callback) {
    $.alerts.alert(message, title, callback);
  }
  jConfirm = function(message, title, callback) {
    $.alerts.confirm(message, title, callback);
    // Added hack to pass back same as js native
    return callback;
  };
  jPrompt = function(message, value, title, callback) {
    $.alerts.prompt(message, value, title, callback);
  };
})(jQuery);
// added functions from custom item list page
//function to set qty to 0 so user does not have to enter it.
function del_item(X, templ, prodno) {;
  var msg = "Are you sure you want to delete " + prodno + " from this template?";
  var ptest = "We are sorry you cannot remove items from your purchasing history template ";
  if (templ == "1") {
    jAlert(ptest);
    return
  };
  resp = jConfirm(msg, "Please Confirm", function(resp) {
    if (resp) {
      document.template.pageid.value = "4A";
      // pageid 4a indicates they are deleting the line
      document.template.aprodno.value = prodno;
      document.template.submit();
    } else {
      return;
    }
  });
}
function del_template() {;
  templ = $("select[name='customlist']").val();
  var ptest = "We are sorry you cannot delete your purchasing history template";
  if (templ == "1") {
    jAlert(ptest);
    return
  };
  document.template.loginpath.value = "DT";
  document.template.submit();
}
function loadvalues() {
  //function to set values in drop down boxes ;
}
function ShowPRCS(prodid,aprodno,targetid) { 
    if (ShowSalesmanPricing == "Y") {
        if ($("#SalesContent" + prodid).length > 0) {
          $("#SalesContent" + prodid).html('Updating...');
          $("#SalesContent" + prodid).remove();
        }
//         if ($(targetid).length > 0) {
//           $(targetid).html('Updating...');
//           $(targetid).remove();
//         }
        var dummy = widgetload_append_callback('login' + SUFFIX + '?orderno=' + OID + '&CUSTOMERID=' + CID + '&LOGINPATH=PRCS&APRODNO=' + aprodno + '&PAGEID=31', targetid, function() {
 $('.Salesinfo').css({ "min-width": "200px", "top": "0px", "left": "0px" });
          if (SalesVisible) {
            $('.Salesinfo').show();
          };
        });
      }
 }
function PriceUpdate(prodid,aprodno) {
var pageid = document.template.pageid.value;
if (pageid == '2A') { // search results page
   SRLineLoad(prodid,aprodno);
} else {
  var slsxid = "#SlsHolder" + prodid ;
   ShowPRCS(prodid,aprodno,slsxid) ;
}
// $('#PriceContent').hide();
 var msg = "Please Remember to Update your Cart <br> to View Updated Pricing" ;
  $('#PriceContent').append('<div id="alert">' + msg + ' </div>');
  $('#PriceContent').fadeOut(5000);
}
function copyprod(prodid) {
  var pageurl = 'login' + SUFFIX + '?orderno=' + OID + '&MODE=CAT&CUSTOMERID=' + CID + '&LOGINPATH=PCC&pageid=31&APRODNO=' + prodid;
  var dummy = showmodalrnpopup(pageurl);
}
function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
}
/**
* NG Responsive Tables v1.0
* Inspiration: http://css-tricks.com/examples/ResponsiveTables/responsive.php
* Author: Tomislav Matijevic
* List of functions:
*	- targetTable: Searches for each table row , find td and take its current index.
*      Apply to that index same index of table head or td in first table row ( in case there are no table header applied )
*	- checkForTableHead: If there is no table head defined, use td in first table row as table head (prevention mode)
* Config:
* - Adjust paddings
* - On each td there is class named "tdno[index]", so you can modify each td if you need custom padding
*/
;(function ( $ ) {
	$.fn.ngResponsiveTables = function(options) {
		var defaults = {
		smallPaddingCharNo: 5,
		mediumPaddingCharNo: 10,
		largePaddingCharNo: 15
		},
		$selElement = this,
		ngResponsiveTables = {
			opt: '',
			dataContent: '',
			globalWidth: 0,
		init: function(){
			this.opt = $.extend( defaults, options );
			ngResponsiveTables.targetTable();
		},
		targetTable: function(){
			var that = this;
			$selElement.find('tr').each(function(){
				$(this).find('td').each(function(i, v){
					that.checkForTableHead( $(this), i );
					$(this).addClass('tdno' + i);
				});
			});
		},
		checkForTableHead: function(element, index){
			if( $selElement.find('th').length ){
				this.dataContent = $selElement.find('th')[index].textContent;
			}else{
				this.dataContent = $selElement.find('tr:first td')[index].textContent;
			}
			// This padding is for large texts inside header of table
			// Use small, medium and large paddingMax values from defaults to set-up offsets for each class
			if( this.opt.smallPaddingCharNo > this.dataContent.length ){
				element.addClass('small-padding');
			}else if( this.opt.mediumPaddingCharNo > this.dataContent.length ){
				element.addClass('medium-padding');
			}else{
				element.addClass('large-padding');
			}
			element.attr('data-content', this.dataContent);
		}
	};
  $(function(){
		ngResponsiveTables.init();
	});
		return this;
	};
}( jQuery ));
(function($) {
    'use strict';
    $.fn.tooltipOnOverflow = function() {
        $(this).on("mouseenter", function() {
            if (this.offsetWidth < this.scrollWidth) {
                $(this).attr('title', $(this).text());
            } else {
                $(this).removeAttr("title");
            }
        });
    };
})(jQuery);
function sendcontractid(Sstr) {
//new send of CONTRACT data using jquery and ajax
    $('#header_toplinks').append('<div id="alert"></div>');
      var dummyU = widgetload('login' + SUFFIX +'?orderno=' + OID + '&MODE=U&LOGINPATH=PCU&pageid=31&CUSTOMERID=' + CID +'&TARGETVAL=' + Sstr ,'#alert');
   $('#alert').fadeOut(5000);
} 
function EproLogout() {  jAlert("Please submit your po or cancel using E-Procurement"); } 
function track_detail(website_link) { 
 var pgm = website_link ; 
 var name = "sub" ; 
 var parms = "toolbar=no,top=50,left=50,width=900,height=600,directories=no,status=yes,scrollbars=yes,resizable=yes,menubar=no" ; 
 trackdtl = window.open(pgm,name,parms) ; 
 trackdtl.focus() ; 
} 
// New Pedigree print option - 01-07-14
function peddetailinq(ordno,user,pedkey,mdsorderno) {
var form_content =''
var form_content = form_content + '<input type=hidden name=pageid value="31">';
var form_content = form_content + '<input type=hidden name=LOGINPATH value="PEDP">';
var form_content = form_content + '<input type=hidden name=PEDIGREENO value="' + pedkey + '">';
var form_content = form_content + '<input type=hidden name=MDSORDERNO value="' + mdsorderno + '">';
var form_content = form_content + '<input type=hidden name=CustomerId value="' + CID + '">';
var form_content = form_content + '<input type=hidden name=orderno value="' + OID + '">';
submitOtherFormUnique(form_content) ;
}
// NEW COUNTDOWN FUNCTIONS
(function() {
  var j = false;
  window.JQClass = function() {};
  JQClass.classes = {};
  JQClass.extend = function extender(f) {
    var g = this.prototype;
    j = true;
    var h = new this();
    j = false;
    for (var i in f) {
      h[i] = typeof f[i] == 'function' && typeof g[i] == 'function' ? (function(d, e) {
        return function() {
          var b = this._super;
          this._super = function(a) {
            return g[d].apply(this, a || [])
          };
          var c = e.apply(this, arguments);
          this._super = b;
          return c
        }
      })(i, f[i]) : f[i]
    }
    function JQClass() {
      if (!j && this._init) {
        this._init.apply(this, arguments)
      }
    }
    JQClass.prototype = h;
    JQClass.prototype.constructor = JQClass;
    JQClass.extend = extender;
    return JQClass
  }
})();
(function($) {
  JQClass.classes.JQPlugin = JQClass.extend({
    name: 'plugin',
    defaultOptions: {},
    regionalOptions: {},
    _getters: [],
    _getMarker: function() {
      return 'is-' + this.name
    },
    _init: function() {
      $.extend(this.defaultOptions, (this.regionalOptions && this.regionalOptions['']) || {});
      var c = camelCase(this.name);
      $[c] = this;
      $.fn[c] = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        if ($[c]._isNotChained(a, b)) {
          return $[c][a].apply($[c], [this[0]].concat(b))
        }
        return this.each(function() {
          if (typeof a === 'string') {
            if (a[0] === '_' || !$[c][a]) {
              throw 'Unknown method: ' + a;
            }
            $[c][a].apply($[c], [this].concat(b))
          } else {
            $[c]._attach(this, a)
          }
        })
      }
    },
    setDefaults: function(a) {
      $.extend(this.defaultOptions, a || {})
    },
    _isNotChained: function(a, b) {
      if (a === 'option' && (b.length === 0 || (b.length === 1 && typeof b[0] === 'string'))) {
        return true
      }
      return $.inArray(a, this._getters) > -1
    },
    _attach: function(a, b) {
      a = $(a);
      if (a.hasClass(this._getMarker())) {
        return
      }
      a.addClass(this._getMarker());
      b = $.extend({}, this.defaultOptions, this._getMetadata(a), b || {});
      var c = $.extend({
        name: this.name,
        elem: a,
        options: b
      }, this._instSettings(a, b));
      a.data(this.name, c);
      this._postAttach(a, c);
      this.option(a, b)
    },
    _instSettings: function(a, b) {
      return {}
    },
    _postAttach: function(a, b) {},
    _getMetadata: function(d) {
      try {
        var f = d.data(this.name.toLowerCase()) || '';
        f = f.replace(/'/g, '"');
        f = f.replace(/([a-zA-Z0-9]+):/g, function(a, b, i) {
          var c = f.substring(0, i).match(/"/g);
          return (!c || c.length % 2 === 0 ? '"' + b + '":' : b + ':')
        });
        f = $.parseJSON('{' + f + '}');
        for (var g in f) {
          var h = f[g];
          if (typeof h === 'string' && h.match(/^new Date\((.*)\)$/)) {
            f[g] = eval(h)
          }
        }
        return f
      } catch (e) {
        return {}
      }
    },
    _getInst: function(a) {
      return $(a).data(this.name) || {}
    },
    option: function(a, b, c) {
      a = $(a);
      var d = a.data(this.name);
      if (!b || (typeof b === 'string' && c == null)) {
        var e = (d || {}).options;
        return (e && b ? e[b] : e)
      }
      if (!a.hasClass(this._getMarker())) {
        return
      }
      var e = b || {};
      if (typeof b === 'string') {
        e = {};
        e[b] = c
      }
      this._optionsChanged(a, d, e);
      $.extend(d.options, e)
    },
    _optionsChanged: function(a, b, c) {},
    destroy: function(a) {
      a = $(a);
      if (!a.hasClass(this._getMarker())) {
        return
      }
      this._preDestroy(a, this._getInst(a));
      a.removeData(this.name).removeClass(this._getMarker())
    },
    _preDestroy: function(a, b) {}
  });

  function camelCase(c) {
    return c.replace(/-([a-z])/g, function(a, b) {
      return b.toUpperCase()
    })
  }
  $.JQPlugin = {
    createPlugin: function(a, b) {
      if (typeof a === 'object') {
        b = a;
        a = 'JQPlugin'
      }
      a = camelCase(a);
      var c = camelCase(b.name);
      JQClass.classes[c] = JQClass.classes[a].extend(b);
      new JQClass.classes[c]()
    }
  }
})(jQuery);
/* http://keith-wood.name/countdown.html
   Countdown for jQuery v2.0.2.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Available under the MIT (http://keith-wood.name/licence.html) license. 
   Please attribute the author if you use it. */
(function($) { // Hide scope, no $ conflict
  var pluginName = 'countdown';
  var Y = 0; // Years
  var O = 1; // Months
  var W = 2; // Weeks
  var D = 3; // Days
  var H = 4; // Hours
  var M = 5; // Minutes
  var S = 6; // Seconds
  /** Create the countdown plugin.
   <p>Sets an element to show the time remaining until a given instant.</p>
   <p>Expects HTML like:</p>
   <pre>&lt;div>&lt;/div></pre>
   <p>Provide inline configuration like:</p>
   <pre>&lt;div data-countdown="name: 'value'">&lt;/div></pre>
   @module Countdown
   @augments JQPlugin
   @example $(selector).countdown({until: +300}) */
  $.JQPlugin.createPlugin({ /** The name of the plugin. */
    name: pluginName,
    /** Countdown expiry callback.
     Triggered when the countdown expires.
     @callback expiryCallback */
    /** Countdown server synchronisation callback.
     Triggered when the countdown is initialised.
     @callback serverSyncCallback
     @return {Date} The current date/time on the server as expressed in the local timezone. */
    /** Countdown tick callback.
     Triggered on every <code>tickInterval</code> ticks of the countdown.
     @callback tickCallback
     @param periods {number[]} The breakdown by period (years, months, weeks, days,
     hours, minutes, seconds) of the time remaining/passed. */
    /** Countdown which labels callback.
     Triggered when the countdown is being display to determine which set of labels
     (<code>labels</code>, <code>labels1</code>, ...) are to be used for the current period value.
     @callback whichLabelsCallback
     @param num {number} The current period value.
     @return {number} The suffix for the label set to use. */
    /** Default settings for the plugin.
     @property until {Date|number|string} The date/time to count down to, or number of seconds
     offset from now, or string of amounts and units for offset(s) from now:
     'Y' years, 'O' months, 'W' weeks, 'D' days, 'H' hours, 'M' minutes, 'S' seconds.
     @example until: new Date(2013, 12-1, 25, 13, 30)
     until: +300
     until: '+1O -2D'
     @property [since] {Date|number|string} The date/time to count up from, or
     number of seconds offset from now, or string for unit offset(s):
     'Y' years, 'O' months, 'W' weeks, 'D' days, 'H' hours, 'M' minutes, 'S' seconds.
     @example since: new Date(2013, 1-1, 1)
     since: -300
     since: '-1O +2D'
     @property [timezone=null] {number} The timezone (hours or minutes from GMT) for the target times,
     or null for client local timezone.
     @example timezone: +10
     timezone: -60
     @property [serverSync=null] {serverSyncCallback} A function to retrieve the current server time
     for synchronisation.
     @property [format='dHMS'] {string} The format for display - upper case for always, lower case only if non-zero,
     'Y' years, 'O' months, 'W' weeks, 'D' days, 'H' hours, 'M' minutes, 'S' seconds.
     @property [layout=''] {string} Build your own layout for the countdown.
     @example layout: '{d<}{dn} {dl}{d>} {hnn}:{mnn}:{snn}'
     @property [compact=false] {boolean} True to display in a compact format, false for an expanded one.
     @property [padZeroes=false] {boolean} True to add leading zeroes
     @property [significant=0] {number} The number of periods with non-zero values to show, zero for all.
     @property [description=''] {string} The description displayed for the countdown.
     @property [expiryUrl=''] {string} A URL to load upon expiry, replacing the current page.
     @property [expiryText=''] {string} Text to display upon expiry, replacing the countdown. This may be HTML.
     @property [alwaysExpire=false] {boolean} True to trigger <code>onExpiry</code> even if target time has passed.
     @property [onExpiry=null] {expiryCallback} Callback when the countdown expires -
     receives no parameters and <code>this</code> is the containing division.
     @example onExpiry: function() {
     ...
     }
     @property [onTick=null] {tickCallback} Callback when the countdown is updated -
     receives <code>number[7]</code> being the breakdown by period
     (years, months, weeks, days, hours, minutes, seconds - based on
     <code>format</code>) and <code>this</code> is the containing division.
     @example onTick: function(periods) {
     var secs = $.countdown.periodsToSeconds(periods);
     if (secs < 300) { // Last five minutes
     ...
     }
     }
     @property [tickInterval=1] {number} The interval (seconds) between <code>onTick</code> callbacks. */
    defaultOptions: {
      until: null,
      since: null,
      timezone: null,
      serverSync: null,
      format: 'dHMS',
      layout: '',
      compact: false,
      padZeroes: false,
      significant: 0,
      description: '',
      expiryUrl: '',
      expiryText: '',
      alwaysExpire: false,
      onExpiry: null,
      onTick: null,
      tickInterval: 1
    },
    /** Localisations for the plugin.
     Entries are objects indexed by the language code ('' being the default US/English).
     Each object has the following attributes.
     @property [labels=['Years','Months','Weeks','Days','Hours','Minutes','Seconds']] {string[]}
     The display texts for the counter periods.
     @property [labels1=['Year','Month','Week','Day','Hour','Minute','Second']] {string[]}
     The display texts for the counter periods if they have a value of 1.
     Add other <code>labels<em>n</em></code> attributes as necessary to
     cater for other numeric idiosyncrasies of the localisation.
     @property [compactLabels=['y','m','w','d']] {string[]} The compact texts for the counter periods.
     @property [whichLabels=null] {whichLabelsCallback} A function to determine which
     <code>labels<em>n</em></code> to use.
     @example whichLabels: function(num) {
     return (num > 1 ? 0 : 1);
     }
     @property [digits=['0','1',...,'9']] {number[]} The digits to display (0-9).
     @property [timeSeparator=':'] {string} Separator for time periods in the compact layout.
     @property [isRTL=false] {boolean} True for right-to-left languages, false for left-to-right. */
    regionalOptions: { // Available regional settings, indexed by language/country code
      '': { // Default regional settings - English/US
        labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
        labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
        compactLabels: ['y', 'm', 'w', 'd'],
        whichLabels: null,
        digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        timeSeparator: ':',
        isRTL: false
      }
    },
    /** Names of getter methods - those that can't be chained. */
    _getters: ['getTimes'],
    /* Class name for the right-to-left marker. */
    _rtlClass: pluginName + '-rtl',
    /* Class name for the countdown section marker. */
    _sectionClass: pluginName + '-section',
    /* Class name for the period amount marker. */
    _amountClass: pluginName + '-amount',
    /* Class name for the period name marker. */
    _periodClass: pluginName + '-period',
    /* Class name for the countdown row marker. */
    _rowClass: pluginName + '-row',
    /* Class name for the holding countdown marker. */
    _holdingClass: pluginName + '-holding',
    /* Class name for the showing countdown marker. */
    _showClass: pluginName + '-show',
    /* Class name for the description marker. */
    _descrClass: pluginName + '-descr',
    /* List of currently active countdown elements. */
    _timerElems: [],
    /** Additional setup for the countdown.
     Apply default localisations.
     Create the timer. */
    _init: function() {
      var self = this;
      this._super();
      this._serverSyncs = [];
      var now = (typeof Date.now == 'function' ? Date.now : function() {
        return new Date().getTime();
      });
      var perfAvail = (window.performance && typeof window.performance.now == 'function');
      // Shared timer for all countdowns


      function timerCallBack(timestamp) {
        var drawStart = (timestamp < 1e12 ? // New HTML5 high resolution timer
        (perfAvail ? (performance.now() + performance.timing.navigationStart) : now()) :
        // Integer milliseconds since unix epoch
        timestamp || now());
        if (drawStart - animationStartTime >= 1000) {
          self._updateElems();
          animationStartTime = drawStart;
        }
        requestAnimationFrame(timerCallBack);
      }
      var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
      // This is when we expect a fall-back to setInterval as it's much more fluid
      var animationStartTime = 0;
      if (!requestAnimationFrame || $.noRequestAnimationFrame) {
        $.noRequestAnimationFrame = null;
        setInterval(function() {
          self._updateElems();
        }, 980); // Fall back to good old setInterval
      } else {
        animationStartTime = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || now();
        requestAnimationFrame(timerCallBack);
      }
    },
    /** Convert a date/time to UTC.
     @param tz {number} The hour or minute offset from GMT, e.g. +9, -360.
     @param year {Date|number} the date/time in that timezone or the year in that timezone.
     @param [month] {number} The month (0 - 11) (omit if <code>year</code> is a <code>Date</code>).
     @param [day] {number} The day (omit if <code>year</code> is a <code>Date</code>).
     @param [hours] {number} The hour (omit if <code>year</code> is a <code>Date</code>).
     @param [mins] {number} The minute (omit if <code>year</code> is a <code>Date</code>).
     @param [secs] {number} The second (omit if <code>year</code> is a <code>Date</code>).
     @param [ms] {number} The millisecond (omit if <code>year</code> is a <code>Date</code>).
     @return {Date} The equivalent UTC date/time.
     @example $.countdown.UTCDate(+10, 2013, 12-1, 25, 12, 0)
     $.countdown.UTCDate(-7, new Date(2013, 12-1, 25, 12, 0)) */
    UTCDate: function(tz, year, month, day, hours, mins, secs, ms) {
      if (typeof year == 'object' && year.constructor == Date) {
        ms = year.getMilliseconds();
        secs = year.getSeconds();
        mins = year.getMinutes();
        hours = year.getHours();
        day = year.getDate();
        month = year.getMonth();
        year = year.getFullYear();
      }
      var d = new Date();
      d.setUTCFullYear(year);
      d.setUTCDate(1);
      d.setUTCMonth(month || 0);
      d.setUTCDate(day || 1);
      d.setUTCHours(hours || 0);
      d.setUTCMinutes((mins || 0) - (Math.abs(tz) < 30 ? tz * 60 : tz));
      d.setUTCSeconds(secs || 0);
      d.setUTCMilliseconds(ms || 0);
      return d;
    },
    /** Convert a set of periods into seconds.
     Averaged for months and years.
     @param periods {number[]} The periods per year/month/week/day/hour/minute/second.
     @return {number} The corresponding number of seconds.
     @example var secs = $.countdown.periodsToSeconds(periods) */
    periodsToSeconds: function(periods) {
      return periods[0] * 31557600 + periods[1] * 2629800 + periods[2] * 604800 + periods[3] * 86400 + periods[4] * 3600 + periods[5] * 60 + periods[6];
    },
    /** Resynchronise the countdowns with the server.
     @example $.countdown.resync() */
    resync: function() {
      var self = this;
      $('.' + this._getMarker()).each(function() { // Each countdown
        var inst = $.data(this, self.name);
        if (inst.options.serverSync) { // If synced
          var serverSync = null;
          for (var i = 0; i < self._serverSyncs.length; i++) {
            if (self._serverSyncs[i][0] == inst.options.serverSync) { // Find sync details
              serverSync = self._serverSyncs[i];
              break;
            }
          }
          if (serverSync[2] == null) { // Recalculate if missing
            var serverResult = ($.isFunction(inst.options.serverSync) ? inst.options.serverSync.apply(this, []) : null);
            serverSync[2] = (serverResult ? new Date().getTime() - serverResult.getTime() : 0) - serverSync[1];
          }
          if (inst._since) { // Apply difference
            inst._since.setMilliseconds(inst._since.getMilliseconds() + serverSync[2]);
          }
          inst._until.setMilliseconds(inst._until.getMilliseconds() + serverSync[2]);
        }
      });
      for (var i = 0; i < self._serverSyncs.length; i++) { // Update sync details
        if (self._serverSyncs[i][2] != null) {
          self._serverSyncs[i][1] += self._serverSyncs[i][2];
          delete self._serverSyncs[i][2];
        }
      }
    },
    _instSettings: function(elem, options) {
      return {
        _periods: [0, 0, 0, 0, 0, 0, 0]
      };
    },
    /** Add an element to the list of active ones.
     @private
     @param elem {Element} The countdown element. */
    _addElem: function(elem) {
      if (!this._hasElem(elem)) {
        this._timerElems.push(elem);
      }
    },
    /** See if an element is in the list of active ones.
     @private
     @param elem {Element} The countdown element.
     @return {boolean} True if present, false if not. */
    _hasElem: function(elem) {
      return ($.inArray(elem, this._timerElems) > -1);
    },
    /** Remove an element from the list of active ones.
     @private
     @param elem {Element} The countdown element. */
    _removeElem: function(elem) {
      this._timerElems = $.map(this._timerElems, function(value) {
        return (value == elem ? null : value);
      }); // delete entry
    },
    /** Update each active timer element.
     @private */
    _updateElems: function() {
      for (var i = this._timerElems.length - 1; i >= 0; i--) {
        this._updateCountdown(this._timerElems[i]);
      }
    },
    _optionsChanged: function(elem, inst, options) {
      if (options.layout) {
        options.layout = options.layout.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      }
      this._resetExtraLabels(inst.options, options);
      var timezoneChanged = (inst.options.timezone != options.timezone);
      $.extend(inst.options, options);
      this._adjustSettings(elem, inst, options.until != null || options.since != null || timezoneChanged);
      var now = new Date();
      if ((inst._since && inst._since < now) || (inst._until && inst._until > now)) {
        this._addElem(elem[0]);
      }
      this._updateCountdown(elem, inst);
    },
    /** Redisplay the countdown with an updated display.
     @private
     @param elem {Element|jQuery} The containing division.
     @param inst {object} The current settings for this instance. */
    _updateCountdown: function(elem, inst) {
      elem = elem.jquery ? elem : $(elem);
      inst = inst || this._getInst(elem);
      if (!inst) {
        return;
      }
      elem.html(this._generateHTML(inst)).toggleClass(this._rtlClass, inst.options.isRTL);
      if ($.isFunction(inst.options.onTick)) {
        var periods = inst._hold != 'lap' ? inst._periods : this._calculatePeriods(inst, inst._show, inst.options.significant, new Date());
        if (inst.options.tickInterval == 1 || this.periodsToSeconds(periods) % inst.options.tickInterval == 0) {
          inst.options.onTick.apply(elem[0], [periods]);
        }
      }
      var expired = inst._hold != 'pause' && (inst._since ? inst._now.getTime() < inst._since.getTime() : inst._now.getTime() >= inst._until.getTime());
      if (expired && !inst._expiring) {
        inst._expiring = true;
        if (this._hasElem(elem[0]) || inst.options.alwaysExpire) {
          this._removeElem(elem[0]);
          if ($.isFunction(inst.options.onExpiry)) {
            inst.options.onExpiry.apply(elem[0], []);
          }
          if (inst.options.expiryText) {
            var layout = inst.options.layout;
            inst.options.layout = inst.options.expiryText;
            this._updateCountdown(elem[0], inst);
            inst.options.layout = layout;
          }
          if (inst.options.expiryUrl) {
            window.location = inst.options.expiryUrl;
          }
        }
        inst._expiring = false;
      } else if (inst._hold == 'pause') {
        this._removeElem(elem[0]);
      }
    },
    /** Reset any extra labelsn and compactLabelsn entries if changing labels.
     @private
     @param base {object} The options to be updated.
     @param options {object} The new option values. */
    _resetExtraLabels: function(base, options) {
      for (var n in options) {
        if (n.match(/[Ll]abels[02-9]|compactLabels1/)) {
          base[n] = options[n];
        }
      }
      for (var n in base) { // Remove custom numbered labels
        if (n.match(/[Ll]abels[02-9]|compactLabels1/) && typeof options[n] === 'undefined') {
          base[n] = null;
        }
      }
    },
    /** Calculate internal settings for an instance.
     @private
     @param elem {jQuery} The containing division.
     @param inst {object} The current settings for this instance.
     @param recalc {boolean} True if until or since are set. */
    _adjustSettings: function(elem, inst, recalc) {
      var serverEntry = null;
      for (var i = 0; i < this._serverSyncs.length; i++) {
        if (this._serverSyncs[i][0] == inst.options.serverSync) {
          serverEntry = this._serverSyncs[i][1];
          break;
        }
      }
      if (serverEntry != null) {
        var serverOffset = (inst.options.serverSync ? serverEntry : 0);
        var now = new Date();
      } else {
        var serverResult = ($.isFunction(inst.options.serverSync) ? inst.options.serverSync.apply(elem[0], []) : null);
        var now = new Date();
        var serverOffset = (serverResult ? now.getTime() - serverResult.getTime() : 0);
        this._serverSyncs.push([inst.options.serverSync, serverOffset]);
      }
      var timezone = inst.options.timezone;
      timezone = (timezone == null ? -now.getTimezoneOffset() : timezone);
      if (recalc || (!recalc && inst._until == null && inst._since == null)) {
        inst._since = inst.options.since;
        if (inst._since != null) {
          inst._since = this.UTCDate(timezone, this._determineTime(inst._since, null));
          if (inst._since && serverOffset) {
            inst._since.setMilliseconds(inst._since.getMilliseconds() + serverOffset);
          }
        }
        inst._until = this.UTCDate(timezone, this._determineTime(inst.options.until, now));
        if (serverOffset) {
          inst._until.setMilliseconds(inst._until.getMilliseconds() + serverOffset);
        }
      }
      inst._show = this._determineShow(inst);
    },
    /** Remove the countdown widget from a div.
     @param elem {jQuery} The containing division.
     @param inst {object} The current instance object. */
    _preDestroy: function(elem, inst) {
      this._removeElem(elem[0]);
      elem.empty();
    },
    /** Pause a countdown widget at the current time.
     Stop it running but remember and display the current time.
     @param elem {Element} The containing division.
     @example $(selector).countdown('pause') */
    pause: function(elem) {
      this._hold(elem, 'pause');
    },
    /** Pause a countdown widget at the current time.
     Stop the display but keep the countdown running.
     @param elem {Element} The containing division.
     @example $(selector).countdown('lap') */
    lap: function(elem) {
      this._hold(elem, 'lap');
    },
    /** Resume a paused countdown widget.
     @param elem {Element} The containing division.
     @example $(selector).countdown('resume') */
    resume: function(elem) {
      this._hold(elem, null);
    },
    /** Toggle a paused countdown widget.
     @param elem {Element} The containing division.
     @example $(selector).countdown('toggle') */
    toggle: function(elem) {
      var inst = $.data(elem, this.name) || {};
      this[!inst._hold ? 'pause' : 'resume'](elem);
    },
    /** Toggle a lapped countdown widget.
     @param elem {Element} The containing division.
     @example $(selector).countdown('toggleLap') */
    toggleLap: function(elem) {
      var inst = $.data(elem, this.name) || {};
      this[!inst._hold ? 'lap' : 'resume'](elem);
    },
    /** Pause or resume a countdown widget.
     @private
     @param elem {Element} The containing division.
     @param hold {string} The new hold setting. */
    _hold: function(elem, hold) {
      var inst = $.data(elem, this.name);
      if (inst) {
        if (inst._hold == 'pause' && !hold) {
          inst._periods = inst._savePeriods;
          var sign = (inst._since ? '-' : '+');
          inst[inst._since ? '_since' : '_until'] =
          this._determineTime(sign + inst._periods[0] + 'y' + sign + inst._periods[1] + 'o' + sign + inst._periods[2] + 'w' + sign + inst._periods[3] + 'd' + sign + inst._periods[4] + 'h' + sign + inst._periods[5] + 'm' + sign + inst._periods[6] + 's');
          this._addElem(elem);
        }
        inst._hold = hold;
        inst._savePeriods = (hold == 'pause' ? inst._periods : null);
        $.data(elem, this.name, inst);
        this._updateCountdown(elem, inst);
      }
    },
    /** Return the current time periods.
     @param elem {Element} The containing division.
     @return {number[]} The current periods for the countdown.
     @example var periods = $(selector).countdown('getTimes') */
    getTimes: function(elem) {
      var inst = $.data(elem, this.name);
      return (!inst ? null : (inst._hold == 'pause' ? inst._savePeriods : (!inst._hold ? inst._periods : this._calculatePeriods(inst, inst._show, inst.options.significant, new Date()))));
    },
    /** A time may be specified as an exact value or a relative one.
     @private
     @param setting {string|number|Date} The date/time value as a relative or absolute value.
     @param defaultTime {Date} The date/time to use if no other is supplied.
     @return {Date} The corresponding date/time. */
    _determineTime: function(setting, defaultTime) {
      var self = this;
      var offsetNumeric = function(offset) { // e.g. +300, -2
        var time = new Date();
        time.setTime(time.getTime() + offset * 1000);
        return time;
      };
      var offsetString = function(offset) { // e.g. '+2d', '-4w', '+3h +30m'
        offset = offset.toLowerCase();
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDate();
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        var pattern = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;
        var matches = pattern.exec(offset);
        while (matches) {
          switch (matches[2] || 's') {
          case 's':
            second += parseInt(matches[1], 10);
            break;
          case 'm':
            minute += parseInt(matches[1], 10);
            break;
          case 'h':
            hour += parseInt(matches[1], 10);
            break;
          case 'd':
            day += parseInt(matches[1], 10);
            break;
          case 'w':
            day += parseInt(matches[1], 10) * 7;
            break;
          case 'o':
            month += parseInt(matches[1], 10);
            day = Math.min(day, self._getDaysInMonth(year, month));
            break;
          case 'y':
            year += parseInt(matches[1], 10);
            day = Math.min(day, self._getDaysInMonth(year, month));
            break;
          }
          matches = pattern.exec(offset);
        }
        return new Date(year, month, day, hour, minute, second, 0);
      };
      var time = (setting == null ? defaultTime : (typeof setting == 'string' ? offsetString(setting) : (typeof setting == 'number' ? offsetNumeric(setting) : setting)));
      if (time) time.setMilliseconds(0);
      return time;
    },
    /** Determine the number of days in a month.
     @private
     @param year {number} The year.
     @param month {number} The month.
     @return {number} The days in that month. */
    _getDaysInMonth: function(year, month) {
      return 32 - new Date(year, month, 32).getDate();
    },
    /** Default implementation to determine which set of labels should be used for an amount.
     Use the <code>labels</code> attribute with the same numeric suffix (if it exists).
     @private
     @param num {number} The amount to be displayed.
     @return {number} The set of labels to be used for this amount. */
    _normalLabels: function(num) {
      return num;
    },
    /** Generate the HTML to display the countdown widget.
     @private
     @param inst {object} The current settings for this instance.
     @return {string} The new HTML for the countdown display. */
    _generateHTML: function(inst) {
      var self = this;
      // Determine what to show
      inst._periods = (inst._hold ? inst._periods : this._calculatePeriods(inst, inst._show, inst.options.significant, new Date()));
      // Show all 'asNeeded' after first non-zero value
      var shownNonZero = false;
      var showCount = 0;
      var sigCount = inst.options.significant;
      var show = $.extend({}, inst._show);
      for (var period = Y; period <= S; period++) {
        shownNonZero |= (inst._show[period] == '?' && inst._periods[period] > 0);
        show[period] = (inst._show[period] == '?' && !shownNonZero ? null : inst._show[period]);
        showCount += (show[period] ? 1 : 0);
        sigCount -= (inst._periods[period] > 0 ? 1 : 0);
      }
      var showSignificant = [false, false, false, false, false, false, false];
      for (var period = S; period >= Y; period--) { // Determine significant periods
        if (inst._show[period]) {
          if (inst._periods[period]) {
            showSignificant[period] = true;
          } else {
            showSignificant[period] = sigCount > 0;
            sigCount--;
          }
        }
      }
      var labels = (inst.options.compact ? inst.options.compactLabels : inst.options.labels);
      var whichLabels = inst.options.whichLabels || this._normalLabels;
      var showCompact = function(period) {
        var labelsNum = inst.options['compactLabels' + whichLabels(inst._periods[period])];
        return (show[period] ? self._translateDigits(inst, inst._periods[period]) + (labelsNum ? labelsNum[period] : labels[period]) + ' ' : '');
      };
      var minDigits = (inst.options.padZeroes ? 2 : 1);
      var showFull = function(period) {
        var labelsNum = inst.options['labels' + whichLabels(inst._periods[period])];
        return ((!inst.options.significant && show[period]) || (inst.options.significant && showSignificant[period]) ? '<span class="' + self._sectionClass + '">' + '<span class="' + self._amountClass + '">' + self._minDigits(inst, inst._periods[period], minDigits) + '</span>' + '<span class="' + self._periodClass + '">' + (labelsNum ? labelsNum[period] : labels[period]) + '</span></span>' : '');
      };
      return (inst.options.layout ? this._buildLayout(inst, show, inst.options.layout, inst.options.compact, inst.options.significant, showSignificant) : ((inst.options.compact ? // Compact version
      '<span class="' + this._rowClass + ' ' + this._amountClass + (inst._hold ? ' ' + this._holdingClass : '') + '">' + showCompact(Y) + showCompact(O) + showCompact(W) + showCompact(D) + (show[H] ? this._minDigits(inst, inst._periods[H], 2) : '') + (show[M] ? (show[H] ? inst.options.timeSeparator : '') + this._minDigits(inst, inst._periods[M], 2) : '') + (show[S] ? (show[H] || show[M] ? inst.options.timeSeparator : '') + this._minDigits(inst, inst._periods[S], 2) : '') :
      // Full version
      '<span class="' + this._rowClass + ' ' + this._showClass + (inst.options.significant || showCount) + (inst._hold ? ' ' + this._holdingClass : '') + '">' + showFull(Y) + showFull(O) + showFull(W) + showFull(D) + showFull(H) + showFull(M) + showFull(S)) + '</span>' + (inst.options.description ? '<span class="' + this._rowClass + ' ' + this._descrClass + '">' + inst.options.description + '</span>' : '')));
    },
    /** Construct a custom layout.
     @private
     @param inst {object} The current settings for this instance.
     @param show {boolean[]} Flags indicating which periods are requested.
     @param layout {string} The customised layout.
     @param compact {boolean} True if using compact labels.
     @param significant {number} The number of periods with values to show, zero for all.
     @param showSignificant {boolean[]} Other periods to show for significance.
     @return {string} The custom HTML. */
    _buildLayout: function(inst, show, layout, compact, significant, showSignificant) {
      var labels = inst.options[compact ? 'compactLabels' : 'labels'];
      var whichLabels = inst.options.whichLabels || this._normalLabels;
      var labelFor = function(index) {
        return (inst.options[(compact ? 'compactLabels' : 'labels') + whichLabels(inst._periods[index])] || labels)[index];
      };
      var digit = function(value, position) {
        return inst.options.digits[Math.floor(value / position) % 10];
      };
      var subs = {
        desc: inst.options.description,
        sep: inst.options.timeSeparator,
        yl: labelFor(Y),
        yn: this._minDigits(inst, inst._periods[Y], 1),
        ynn: this._minDigits(inst, inst._periods[Y], 2),
        ynnn: this._minDigits(inst, inst._periods[Y], 3),
        y1: digit(inst._periods[Y], 1),
        y10: digit(inst._periods[Y], 10),
        y100: digit(inst._periods[Y], 100),
        y1000: digit(inst._periods[Y], 1000),
        ol: labelFor(O),
        on: this._minDigits(inst, inst._periods[O], 1),
        onn: this._minDigits(inst, inst._periods[O], 2),
        onnn: this._minDigits(inst, inst._periods[O], 3),
        o1: digit(inst._periods[O], 1),
        o10: digit(inst._periods[O], 10),
        o100: digit(inst._periods[O], 100),
        o1000: digit(inst._periods[O], 1000),
        wl: labelFor(W),
        wn: this._minDigits(inst, inst._periods[W], 1),
        wnn: this._minDigits(inst, inst._periods[W], 2),
        wnnn: this._minDigits(inst, inst._periods[W], 3),
        w1: digit(inst._periods[W], 1),
        w10: digit(inst._periods[W], 10),
        w100: digit(inst._periods[W], 100),
        w1000: digit(inst._periods[W], 1000),
        dl: labelFor(D),
        dn: this._minDigits(inst, inst._periods[D], 1),
        dnn: this._minDigits(inst, inst._periods[D], 2),
        dnnn: this._minDigits(inst, inst._periods[D], 3),
        d1: digit(inst._periods[D], 1),
        d10: digit(inst._periods[D], 10),
        d100: digit(inst._periods[D], 100),
        d1000: digit(inst._periods[D], 1000),
        hl: labelFor(H),
        hn: this._minDigits(inst, inst._periods[H], 1),
        hnn: this._minDigits(inst, inst._periods[H], 2),
        hnnn: this._minDigits(inst, inst._periods[H], 3),
        h1: digit(inst._periods[H], 1),
        h10: digit(inst._periods[H], 10),
        h100: digit(inst._periods[H], 100),
        h1000: digit(inst._periods[H], 1000),
        ml: labelFor(M),
        mn: this._minDigits(inst, inst._periods[M], 1),
        mnn: this._minDigits(inst, inst._periods[M], 2),
        mnnn: this._minDigits(inst, inst._periods[M], 3),
        m1: digit(inst._periods[M], 1),
        m10: digit(inst._periods[M], 10),
        m100: digit(inst._periods[M], 100),
        m1000: digit(inst._periods[M], 1000),
        sl: labelFor(S),
        sn: this._minDigits(inst, inst._periods[S], 1),
        snn: this._minDigits(inst, inst._periods[S], 2),
        snnn: this._minDigits(inst, inst._periods[S], 3),
        s1: digit(inst._periods[S], 1),
        s10: digit(inst._periods[S], 10),
        s100: digit(inst._periods[S], 100),
        s1000: digit(inst._periods[S], 1000)
      };
      var html = layout;
      // Replace period containers: {p<}...{p>}
      for (var i = Y; i <= S; i++) {
        var period = 'yowdhms'.charAt(i);
        var re = new RegExp('\\{' + period + '<\\}([\\s\\S]*)\\{' + period + '>\\}', 'g');
        html = html.replace(re, ((!significant && show[i]) || (significant && showSignificant[i]) ? '$1' : ''));
      }
      // Replace period values: {pn}
      $.each(subs, function(n, v) {
        var re = new RegExp('\\{' + n + '\\}', 'g');
        html = html.replace(re, v);
      });
      return html;
    },
    /** Ensure a numeric value has at least n digits for display.
     @private
     @param inst {object} The current settings for this instance.
     @param value {number} The value to display.
     @param len {number} The minimum length.
     @return {string} The display text. */
    _minDigits: function(inst, value, len) {
      value = '' + value;
      if (value.length >= len) {
        return this._translateDigits(inst, value);
      }
      value = '0000000000' + value;
      return this._translateDigits(inst, value.substr(value.length - len));
    },
    /** Translate digits into other representations.
     @private
     @param inst {object} The current settings for this instance.
     @param value {string} The text to translate.
     @return {string} The translated text. */
    _translateDigits: function(inst, value) {
      return ('' + value).replace(/[0-9]/g, function(digit) {
        return inst.options.digits[digit];
      });
    },
    /** Translate the format into flags for each period.
     @private
     @param inst {object} The current settings for this instance.
     @return {string[]} Flags indicating which periods are requested (?) or
     required (!) by year, month, week, day, hour, minute, second. */
    _determineShow: function(inst) {
      var format = inst.options.format;
      var show = [];
      show[Y] = (format.match('y') ? '?' : (format.match('Y') ? '!' : null));
      show[O] = (format.match('o') ? '?' : (format.match('O') ? '!' : null));
      show[W] = (format.match('w') ? '?' : (format.match('W') ? '!' : null));
      show[D] = (format.match('d') ? '?' : (format.match('D') ? '!' : null));
      show[H] = (format.match('h') ? '?' : (format.match('H') ? '!' : null));
      show[M] = (format.match('m') ? '?' : (format.match('M') ? '!' : null));
      show[S] = (format.match('s') ? '?' : (format.match('S') ? '!' : null));
      return show;
    },
    /** Calculate the requested periods between now and the target time.
     @private
     @param inst {object} The current settings for this instance.
     @param show {string[]} Flags indicating which periods are requested/required.
     @param significant {number} The number of periods with values to show, zero for all.
     @param now {Date} The current date and time.
     @return {number[]} The current time periods (always positive)
     by year, month, week, day, hour, minute, second. */
    _calculatePeriods: function(inst, show, significant, now) {
      // Find endpoints
      inst._now = now;
      inst._now.setMilliseconds(0);
      var until = new Date(inst._now.getTime());
      if (inst._since) {
        if (now.getTime() < inst._since.getTime()) {
          inst._now = now = until;
        } else {
          now = inst._since;
        }
      } else {
        until.setTime(inst._until.getTime());
        if (now.getTime() > inst._until.getTime()) {
          inst._now = now = until;
        }
      }
      // Calculate differences by period
      var periods = [0, 0, 0, 0, 0, 0, 0];
      if (show[Y] || show[O]) {
        // Treat end of months as the same
        var lastNow = this._getDaysInMonth(now.getFullYear(), now.getMonth());
        var lastUntil = this._getDaysInMonth(until.getFullYear(), until.getMonth());
        var sameDay = (until.getDate() == now.getDate() || (until.getDate() >= Math.min(lastNow, lastUntil) && now.getDate() >= Math.min(lastNow, lastUntil)));
        var getSecs = function(date) {
          return (date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds();
        };
        var months = Math.max(0, (until.getFullYear() - now.getFullYear()) * 12 + until.getMonth() - now.getMonth() + ((until.getDate() < now.getDate() && !sameDay) || (sameDay && getSecs(until) < getSecs(now)) ? -1 : 0));
        periods[Y] = (show[Y] ? Math.floor(months / 12) : 0);
        periods[O] = (show[O] ? months - periods[Y] * 12 : 0);
        // Adjust for months difference and end of month if necessary
        now = new Date(now.getTime());
        var wasLastDay = (now.getDate() == lastNow);
        var lastDay = this._getDaysInMonth(now.getFullYear() + periods[Y], now.getMonth() + periods[O]);
        if (now.getDate() > lastDay) {
          now.setDate(lastDay);
        }
        now.setFullYear(now.getFullYear() + periods[Y]);
        now.setMonth(now.getMonth() + periods[O]);
        if (wasLastDay) {
          now.setDate(lastDay);
        }
      }
      var diff = Math.floor((until.getTime() - now.getTime()) / 1000);
      var extractPeriod = function(period, numSecs) {
        periods[period] = (show[period] ? Math.floor(diff / numSecs) : 0);
        diff -= periods[period] * numSecs;
      };
      extractPeriod(W, 604800);
      extractPeriod(D, 86400);
      extractPeriod(H, 3600);
      extractPeriod(M, 60);
      extractPeriod(S, 1);
      if (diff > 0 && !inst._since) { // Round up if left overs
        var multiplier = [1, 12, 4.3482, 7, 24, 60, 60];
        var lastShown = S;
        var max = 1;
        for (var period = S; period >= Y; period--) {
          if (show[period]) {
            if (periods[lastShown] >= max) {
              periods[lastShown] = 0;
              diff = 1;
            }
            if (diff > 0) {
              periods[period]++;
              diff = 0;
              lastShown = period;
              max = 1;
            }
          }
          max *= multiplier[period];
        }
      }
      if (significant) { // Zero out insignificant periods
        for (var period = Y; period <= S; period++) {
          if (significant && periods[period]) {
            significant--;
          } else if (!significant) {
            periods[period] = 0;
          }
        }
      }
      return periods;
    }
  });
})(jQuery);
// END NEW COUNT DOWN FUNCTIONS
///////////////////////////////////////////////////////
// document ready functions 
//////////////////////////////////////////////////////
$(document).ready(function() {
// load countdown clock
loadcountdown() ; 
// Added filter for text boxes to stop bad characters
$("input[type='text'], textarea").blur(function() { this.value = this.value.replace(/[^\x20-\x7E]+/g, ''); });
// loaderrortracker() ;
//function to set search results on mobile to grid view.
 if ($(window).width() < 720 ) {$.cookie('viewtype','grid')  ;   }
// added sticky  header 
$(window).scroll(function() {
    if ($(this).scrollTop() > 1){  
        $('#header').addClass("sticky");
    }
    else{
        $('#header').removeClass("sticky");
    }
});
// ADDED WEB LOCK MESSAGE
   $(".weblockmsg").click(function() {     $(".weblockmsg").hide();   });
$('.togglenext').click(function(event) {
//    event.preventDefault();
event.preventDefault ? event.preventDefault() : (event.returnValue = false);
// hack for ie and event.prevendefault
    $(this).next('div').slideToggle(200);
});
if( $.trim( $('.weblockmsg').html() ).length ) { $(".weblockmsg").show();   }
  //   $("p").text("The DOM is now loaded and can be manipulated.");
//     var pageid = document.template.pageid.value;
// added tool tips to search
//  $("td, th").tooltipOnOverflow();
// use this to add tips for search results... 
// Added Mobile Menu Load to Nmenu
var $menu = $('#left_menucontent').html();
   $('#nmenu').append($menu);
 var pageid = $("[name='pageid']").val() ;
if (pageid == '3') { // quick order
$(window).bind('beforeunload', function(){ process_order(0) ; });
}
    if (pageid == '2A') { // sr order page
         setTimeout(function() {    window.scrollBy(0, 1)  }, 300);
    }
    if (pageid == '5') { // current order page
 $('.Salesinfo').css({ "min-width": "200px", "top": "0px", "left": "0px" });
}
  var fqc = $.cookie('SearchFilter') || '';
  if (fqc !== '' && fqc !== 'null') {
 var btn = "<input id='Resumebutton' style='width: 100%' type=\"button\" class=\"button2\" name=\"SR\" value='Resume Last Search' onclick=\"javascript:changepath(name,'N')\" onmouseover=\"this.className='button2 buttonhov2'\"  onmouseout=\"this.className='button2' ;\" >"
  $(".bread-heading").append(btn) ;
}
  pcode = document.forms[0].loginpath.value;
  pcode = pcode + '-' + document.title;
  pcode = pcode.replace(/ /g, "_");
  _gaq.push(['_trackPageview', pcode]);
  // ADDED ACCORDION CODE - 2-9-12
  if (ShowInventory == "N") {
    injectStyles('.InStock { display: none ; }');
    injectStyles('.OutStock { display: none ; }');
    $("select[name='Changesort']").find("option[value='stock asc, price desc']").remove();
  };
  $('div.accordionButton').click(function() {
    $(this).next().slideUp('normal');
    if ($(this).next().is(':hidden') == true) {
      $(this).next().slideDown('normal');
    }
  })
  $("div.accordionContent").hide();
  // try to store a cookie, if failed show popup
  var vc = getvar("vcount");
  if (vc == null) setvar("vcount", 0);
  else setvar("vcount", parseInt(vc) + 1);
  vc = getvar("vcount");
  if (vc == null) {
    var t = setTimeout("showmodal()", 1000);
  }
  //select all the a tag with name equal to modal
  //if dialog is clicked
  $('#cookiedialog').click(function(e) {
    //Cancel the link behavior
    // e.preventDefault();
    $('#mask').hide();
    $('#cookiedialog').hide();
  });
  // document.write('<p>You\'re using ' + BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS + '!</p>');
  if ((BrowserDetect.browser == 'Firefox' && BrowserDetect.version >= '7') || (BrowserDetect.browser == 'Chrome' && BrowserDetect.version >= '15') || (BrowserDetect.browser == 'Explorer' && BrowserDetect.version >= '10') || (BrowserDetect.browser == 'Safari' && BrowserDetect.version >= '5.1') || (BrowserDetect.browser == 'Mozilla' && BrowserDetect.version >= '7')) {
    // alert("Your Browser is currently Supported!! - please log in.. ") ;
  } else {
    // document.write(smsg);
    //alert("Your Browser is currently not supported!!");
    var t = setTimeout("showmodalbcheck()", 1000);
  }
  // Added Olark Chat Code for Remotenet 3-9-16
  if (ChatID != '') {
    window.olark || (function(c) {
      var f = window,
          d = document,
          l = f.location.protocol == "https:" ? "https:" : "http:",
          z = c.name,
          r = "load";
      var nt = function() {
        f[z] = function() {
          (a.s = a.s || []).push(arguments)
        };
        var a = f[z]._ = {},
            q = c.methods.length;
        while (q--) {
          (function(n) {
            f[z][n] = function() {
              f[z]("call", n, arguments)
            }
          })(c.methods[q])
        }
        a.l = c.loader;
        a.i = nt;
        a.p = {
          0: +new Date
        };
        a.P = function(u) {
          a.p[u] = new Date - a.p[0]
        };
        function s() {
          a.P(r);
          f[z](r)
        }
        f.addEventListener ? f.addEventListener(r, s, false) : f.attachEvent("on" + r, s);
        var ld = function() {
          function p(hd) {
            hd = "head";
            return ["<", hd, "></", hd, "><", i, ' onl' + 'oad="var d=', g, ";d.getElementsByTagName('head')[0].", j, "(d.", h, "('script')).", k, "='", l, "//", a.l, "'", '"', "></", i, ">"].join("")
          }
          var i = "body",
              m = d[i];
          if (!m) {
            return setTimeout(ld, 100)
          }
          a.P(1);
          var j = "appendChild",
              h = "createElement",
              k = "src",
              n = d[h]("div"),
              v = n[j](d[h](z)),
              b = d[h]("iframe"),
              g = "document",
              e = "domain",
              o;
          n.style.display = "none";
          m.insertBefore(n, m.firstChild).id = z;
          b.frameBorder = "0";
          b.id = z + "-loader";
          if (/MSIE[ ]+6/.test(navigator.userAgent)) {
            b.src = "javascript:false"
          }
          b.allowTransparency = "true";
          v[j](b);
          try {
            b.contentWindow[g].open()
          } catch (w) {
            c[e] = d[e];
            o = "javascript:var d=" + g + ".open();d.domain='" + d.domain + "';";
            b[k] = o + "void(0);"
          }
          try {
            var t = b.contentWindow[g];
            t.write(p());
            t.close()
          } catch (x) {
            b[k] = o + 'd.write("' + p().replace(/"/g, String.fromCharCode(92) + '"') + '");d.close();'
          }
          a.P(2)
        };
        ld()
      };
      nt()
    })({
      loader: "static.olark.com/jsclient/loader0.js",
      name: "olark",
      methods: ["configure", "extend", "declare", "identify"]
    }); /* custom configuration goes here (www.olark.com/documentation) */
    $("#footer").prepend('<div id="olark-box-container"></div>');
    olark.identify(ChatID);
    // added code to push username, customer and salesman
    var fname = 'Cust: ' + ChatCustomer + ' Logon: ' + ChatLogon + ' Sls: ' + ChatSalesman;
    olark('api.visitor.updateFullName', {
      fullName: fname
    });
    Sstr = $.cookie('SearchFilter');
    pval = 'Current Page: ' + document.title;
    pval1 = 'Total Lines: ' + TotLines;
    pval2 = 'Last Search:' + Sstr;
    //  pcode = pcode.replace(/ /g, "_");
    //  olark('api.chat.updateVisitorStatus', { snippet: pcode  });
    olark('api.chat.updateVisitorStatus', {
      snippet: [pval1, pval2, pval]
    });
    // olark.configure('box.inline', true);
  } // for chatid = '' 
  //SHOW ITEMS ADDED ON LOAD
  if (xweblink !== '') {
    var t1 = setTimeout(weblinksearch(xweblink), 10);
  };
  var val = $.cookie('RNItemsAdded');
  if (val == 'YES') {
 $('body').append('<div class="success" id="itemsaddedmsg">Your Order has been Updated...</div>');
    $('#itemsaddedmsg').fadeOut(5000);
    $.cookie("RNItemsAdded", "");
  }
  // Show the current order widget 
  $('div.accordionContent:last').show();
  // Added Global Keypress - 
  $(".QtyBox").keypress(function(e) {
//   $(document).keypress(function(e) {
    if (e.which == 13) {
      // enter pressed
      if (testObj(document.forms[0].pageid)) {
        var pageid = document.forms[0].pageid.value;
        if (pageid == '2') {
          PageSearch(document.forms[0].searchbox.value);
        } else {
          Add_To_Order();
        }
      }
    }
  });
  // Added shistflag
  var schk = $.cookie('HistoryFlag');
  if (schk == 'true') {
    $("#shistflag").attr('checked', true);
    if ($('#SRfootprints').length) {
      $('#SRfootprints').prepend("<div id=ErrorMsg>This search is only showing product history</div>");
    }
  }
  // Added specials load 
 // loadspecials();
 // loadsideorder() ; 
  // moved to onclick in the accordion
  $("select[name='Shiptobox']").chosen({
    no_results_text: "No results matched"
  });
  $("select[name='customlist']").chosen({
    no_results_text: "No results matched"
  });
  showmodalsession();
  $('#reqddt').datepick({
    showOnFocus: false,
    showTrigger: '#calImg'
  });
  $(".sendorder").click(function() {
    var t = setTimeout("showmodalspecials()", 10);
  });
// Added Salesman functions
if (ShowSalesGP == "Y") {  $(".GPSales").css({'display':'inline'}); } ;
  if (ShowSalesmanCustCreate == "Y") {
    $('.CreateCust').show();
  } else {
    $('.CreateCust').remove();
  };
  if (ShowSalesmanProdCreate == "Y") {
    $('.CreateProd').show();
  } else {
    $('.CreateProd').remove();
  };
  // added for sidebar filters
  $("#CloseFilter").click(function() {
    $(".FaccordionContent").hide();
  });
  $("#OpenFilter").click(function() {
    $(".FaccordionContent").show();
  });
$(function(){
   $('.ng-table').ngResponsiveTables({    smallPaddingCharNo: 13,    mediumPaddingCharNo: 18,    largePaddingCharNo: 30  });
// $('.ng-table').stacktable() ;
});
// Added +/- buttons to quantity boxes
// $(function() {
//     $(".QtyBox").after('<div class="inc qbutton">+</div><div class="dec qbutton">-</div>');
// });
$(function() {
 $(document).on('click', '.qbutton', function() {
  var $button = $(this);
  if ($button.text() == "+") {
   var $qbox = $button.prev(".QtyBox");
   var oldValue =  $qbox.val() ; 
   oldValue = parseInt(oldValue) || 0 ; 
	  var newVal = oldValue + 1;
	} else {
   // Don't allow decrementing below zero
   var $qbox = $button.prev().prev(".QtyBox");
   var oldValue =  $qbox.val() ; 
   oldValue = parseInt(oldValue) || 0 ; 
    if (oldValue > 0) {
      var newVal = oldValue - 1;
    } else {
      newVal = 0;
    }
  }
   $qbox.val(newVal) ; 
});
});
// ADDED HOOK FOR all qty boxes and watch the dom since
// the qty boxes are loaded dynamically on product search
//
// $("body").bind("DOMSubtreeModified", function() { AddQtyButtons() ; });
$( document ).ajaxComplete(function() {
//Added Document Image Replace
  var ilen = image_url.length ; 
    $('img').each(function() {
      var mysrc = $(this).attr("src");
      ckstr = mysrc.substr(ilen  ,4) ;
//    $("#d").append(' -- ' + mysrc + " --- " + ckstr)
      if(ckstr == 'http' || ckstr == 'HTTP') {      
         newsrc = mysrc.substring(ilen );
//           $("#d").append(' changed' + newsrc + " --- " + ckstr)
         $(this).attr("src", newsrc);
      }   
    });
$('.QtyBox').each(function () { 
 //  console.log($(this).text());
  if ( $( this ).next().hasClass( "qbutton" ) ) { } else { 
   $(this).wrap('<div class="qwrap"> </div> ');
   $(this).after('<div class="inc qbutton">+</div><div class="dec qbutton">-</div>');
  }
});
});
}); // FOR DOCUMENT.READY
$( document ).ajaxComplete(function() { if (ShowSalesGP == "Y") {  $(".GPSales").css({'display':'inline'});   } ; }) ;
// 
// Added Ajax complete functions.. 
function AddQtyButtons() {
    $(".QtyBox").after('<div class="inc qbutton">+</div><div class="dec qbutton">-</div>');
$(".qbutton").on("click", function() {
  var $button = $(this);
  if ($button.text() == "+") {
   var $qbox = $button.prev(".QtyBox");
   var oldValue =  $qbox.val() ; 
   oldValue = parseInt(oldValue) || 0 ; 
	  var newVal = oldValue + 1;
	} else {
   // Don't allow decrementing below zero
   var $qbox = $button.prev().prev(".QtyBox");
   var oldValue =  $qbox.val() ; 
   oldValue = parseInt(oldValue) || 0 ; 
    if (oldValue > 0) {
      var newVal = oldValue - 1;
    } else {
      newVal = 0;
    }
  }
   $qbox.val(newVal) ; 
});
}
function togglenext(obj) {
//    event.preventDefault();
event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    $(obj).next('div').slideToggle(200);
} 
 function text_lock() {
   jAlert("\nTo change or add manual ship-tos, \nyou must have this ability set up by your system administrator.") ;
//   $("#noshipto").prop('disabled', true);
// changed to make it readonly in the program
 }
//function to set search results on mobile to grid view.
$( window ).resize(function() {
//   $( "body" ).prepend( "<div>" + $(window).width() + "</div>" );
});
function loaderrortracker() { 
var surl = "https://cdn.ravenjs.com/3.17.0/raven.min.js";
$.getScript( surl, function() {
     Raven.config('https://2e192f733592495f8314d006226d3678@sentry.io/205753', {
            logger: 'RemoteNet-logger',
            release: 'Version1' ,
            whitelistUrls: [
                /getsentry\.com/
            ],
            ignoreErrors: [             
            ],
            includePaths: [               
            ]
        }).install();
        var RavenLoaded = true ; 
});
}
// loaded it inline rather then on ready 
//
        var RavenLoaded = false ; 
loaderrortracker() ;
function handleRouteError(err) {
if (RavenLoaded) {   Raven.captureException(err);}
//   Raven.showReportDialog();
};
window.onerror = function (msg, url, lineNo, columnNo, error) {
//     var string = msg.toLowerCase();
//     var substring = "script error";
//     if (string.indexOf(substring) > -1){
//         alert('Script Error: See Browser Console for Detail');
//     } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');
//         alert(message);
            handleRouteError(message);
//     }
    return false;
};
