
window.onresize = docResize;

var isIE=false;
/*
(function() {
  if (!window.console) {
    window.console = {};
  }
  // union of Chrome, FF, IE, and Safari console methods
  var m = [
    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
  ];
  // define undefined methods as noops to prevent errors
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = function() {};
    }
  }
})();


if (typeof console == "undefined") {
    this.console = {log: function() {}};
}
*/

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
    var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
    isIE=true;
}

function doclayout(){
	var dtop=document.getElementById('top');
	var dmap=document.getElementById('map');
	var dtoolb=document.getElementById('toolbar');

	var dh=document.body.clientHeight;
	var dw=document.body.clientWidth;
	//var doh=document.body.offsetHeight;
	//var dow=document.body.offsetWidth;

	//var mdw=Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
    //var mdh=Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
	var mdw=Math.max(document.documentElement["clientWidth"] , document.body["offsetWidth"], document.documentElement["offsetWidth"]);
    var mdh=Math.max(document.documentElement["clientHeight"],  document.body["offsetHeight"], document.documentElement["offsetHeight"]);

    /*
    var swsWidth = (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth) - 2;
    var swsHeight = (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight) - 2;

    var loadingTop = (swsHeight/2);
    var loadingLeft = (swsWidth/2);


    var loadingContent = '<div id="loading" style="z-index:170;position:absolute;top:' + loadingTop + 'px; left:' + loadingLeft + 'px;visibility:visible" >';
    loadingContent += '<img id="loadingImg" src="img/loading.gif"/>';
    loadingContent += '</div>';
    document.writeln(loadingContent);
*/

    mdw=mdw-15;
    mdh=mdh-15;
    dw=dw-15;
    dh=dh-15;

	dtop.style.width=(dw + 3 )+ "px";

	dmap.style.width=(dw - dtoolb.offsetWidth) + "px";
	dtoolb.style.left=(dmap.offsetWidth + 3 ) + "px";

	dmap.style.height=(mdh - dtop.offsetHeight) + "px";
	dtoolb.style.height=(mdh - dtop.offsetHeight) + "px";



}

function docResize(){

   doclayout();

}


