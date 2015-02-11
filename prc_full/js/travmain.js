


var baseWSURL = 'http://webgis.co.okaloosa.fl.us/website/traversal';
baseWSURL = 'http://204.49.20.78/traversal';
        var alayers=null;
        var lyrstr="";
        var map, drawControls, selectControl, selectedFeature;
        var ags_tools;
        var zoombxctrl;
        var fullext;
        var bld_sketch;
        var ajaxproxy = "StreamingProxy.ashx?url=";
        ajaxproxy ="";
        //OpenLayers.ProxyHost= ajaxproxy;


        function init(){

           //doclayout();
           //showMapLoading();

            if (!isSVGCapable()) document.oncontextmenu = mycontextmenu;

            var queryString = window.location.search.substring(1);
            //queryString = queryString.substring(1);
		    var qs=parseQuery(queryString);


		   var rurl = baseWSURL + '/building_sketch.asmx/GetBuildingSketch?pin=' + qs.pin + '&building=' + qs.building  ;
           if (ajaxproxy && ajaxproxy !=""){
               rurl = ajaxproxy + baseWSURL + '/building_sketch.asmx/GetBuildingSketch?pin=' + qs.pin + '&building=' + qs.building;
		   }

		   $.ajax({
		       type: 'GET',
		       url: rurl,
		       //data: { postVar1: 'theValue1', postVar2: 'theValue2' },
		       //dataType: 'json',
		       beforeSend: function () {
		           $('#map').html('<div style="position:relative;top:50%;left:50%"  ><img   src="./theme/default/img/loading.gif" alt="Loading..." /></div>');

		       },
		       success: function (data) {
		          // data = JQuery.trim(data);
		           $('#map').empty();

		           //console..log("success");
		           //console..log(data);
		           var result = data.documentElement;
		           var jsonr = "";
		           var xmlDoc;
		           if (document.implementation && document.implementation.createDocument) {
		               jsonr = result.textContent;
		           } else if (window.ActiveXObject) {
		               jsonr = result.text;
		           }

		           //bld_sketch = JSON.parse(jsonr);
		           bld_sketch = $.parseJSON(jsonr); //parse JSON
		           //console..log(bld_sketch.sketchurl_svg);

		           RenderSketch();
                    if (!isSVGCapable())  addzoom();


		       },
		       error: function (data) { // 500 Status Header
		           var data = $.parseJSON(data);
		           var ct = "";
		           $.each(data.errors, function (index, value) {
		               alert(value);
		               ct = ct + value;
		           });
		           $('#map').html('<div"><span>' + ct + '</span></div>');
		       }

		   });

        }

function mycontextmenu() {
            return false;
}

function zoomimg(zoomfact){
	      var nw=myimage.offsetWidth + (myimage.offsetWidth * zoomfact);
	      var nh=myimage.offsetHeight + (myimage.offsetHeight * zoomfact);
	      myimage.style.width=nw + "px";
	      myimage.style.height=nh + "px";
}
function resetimgsize() {
	      myimage.style.width="900px";
	      myimage.style.height="900px";
}

 var myimage;
function addzoom(){
	 myimage = document.getElementById("trimg");


	$('#trimg').mousedown(function(event) {


		switch (event.which) {

			case 1:
				zoomimg(0.1);
				break;
			case 2:
				//alert('Middle mouse button pressed');
				resetimgsize();
				break;
			case 3:
				//alert('Right mouse button pressed');

				zoomimg(-0.1);

				break;
			default:
				alert('You have a strange mouse');
		}

		 return false;
	});



}


        function isSVGCapable() {
			var r=false;
			if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")){
				r=true;
			}
			if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0")){
				r=true;
			}
			return r;
		}

        function RenderSketch() {

            //$('#map').html('<img src="' + bld_sketch.sketchurl_svg + '" alt="Building Sketch" />');

             var obstr="";

             var svginstr ="<div id=\"insdiv\"  class=\"idiv\" style=\"left: 2%;\"><p>Use <b>mousewheel</b> to <i>zoom in</i> and <i>zoom out</i> and <b>left mouse button</b> to <i>pan</i>.</p></div><br>";

             var jpginstr ="<div id=\"insdiv\"  class=\"iediv\" style=\"left: 2%;width:290px\"><p>use <b>left and right mouse buttons</b> to <i>zoom in and out.</i>.</p></div><br>";


              if (isSVGCapable()) {
               obstr=svginstr + "<object id=\"svgobj\" height=\"80%\" width=\"80%\"  data='" + bld_sketch.sketchurl_svg + "'>";
			   obstr=obstr + "<img id=\"trimg\"  style=\"width:900px;height:900px\" src='" + bld_sketch.sketchurl_jpg + "'/>";
               obstr=obstr + "</object>";
			  } else {
                obstr= jpginstr + "<img  id=\"trimg\"   src='" + bld_sketch.sketchurl_jpg + "'/>";
			  }

            $('#map').html(obstr);

            $('#traversal').html('<span><b>Parcel Number: ' + bld_sketch.pin + '</b><br><br><b>Traveral Information:</b><br><font size="-2"><p>' + bld_sketch.traversal + '</p></font></span>');

            var atblstr = "";
            atblstr = atblstr + '    <table class="leg">';
            atblstr = atblstr + '        <tr>';
            atblstr = atblstr + '            <th>';
            atblstr = atblstr + '                <font size="-2">Color</font>';
            atblstr = atblstr + '            </th>';
            atblstr = atblstr + '            <th>';
            atblstr = atblstr + '                <font size="-2">Area Type</font>';
            atblstr = atblstr + '            </th>';
            atblstr = atblstr + '            <th>';
            atblstr = atblstr + '                <font size="-2">Area Type Description</font>';
            atblstr = atblstr + '            </th>';
            atblstr = atblstr + '            <th>';
            atblstr = atblstr + '                <font size="-2">Area</font>';
            atblstr = atblstr + '            </th>';
            atblstr = atblstr + '            <th>';
            atblstr = atblstr + '                <font size="-2">Year Built</font>';
            atblstr = atblstr + '            </th>';
            atblstr = atblstr + '        </tr>';
            for (var i = 0; i < bld_sketch.areatypes.length; i++) {
                //atblstr=atblstr+bld_sketch.areatypes[i].code + "   " + bld_sketch.areatypes[i].yearblt + "   " + bld_sketch.areatypes[i].desc + "<br>";
                atblstr = atblstr + '        <tr>';
                atblstr = atblstr + '            <th bgcolor="#' + bld_sketch.areatypes[i].color_code + '" width="14">';
                atblstr = atblstr + '                &nbsp;</th>';
                atblstr = atblstr + '            <th>';
                atblstr = atblstr + '                <font size="-2">&nbsp; ';
                atblstr = atblstr + '    ' + bld_sketch.areatypes[i].code + '</font>';
                atblstr = atblstr + '            </th>';
                atblstr = atblstr + '            <td nowrap="">';
                atblstr = atblstr + '                <b><font size="-2">&nbsp; ' + bld_sketch.areatypes[i].desc + ' </font></b>';
                atblstr = atblstr + '            </td>';
                atblstr = atblstr + '            <td nowrap="">';
                atblstr = atblstr + '                <b><font size="-2">&nbsp;' + bld_sketch.areatypes[i].sq_feet + '</font></b>';
                atblstr = atblstr + '            </td>';
                atblstr = atblstr + '            <td nowrap="">';
                atblstr = atblstr + '                <b><font size="-2">&nbsp; ' + bld_sketch.areatypes[i].yearblt + '</font></b>';
                atblstr = atblstr + '            </td>';
                atblstr = atblstr + '        </tr>';
            }
            atblstr = atblstr + '    </table>';
            $('#legend').html(atblstr);

        }


function parseQuery(qstr)
{
  var query = {};
  var a = qstr.split('&');
  for (var i in a)
  {
    var b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
    var sdfsdf = 0;
  }

  return query;
}





function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    //console..log('Query variable %s not found', variable);
}











function makeCheckBox(id, lbltext) {

	var d = document.createElement("div");
    d.setAttribute("id", "d_" + id);

    var sel = document.createElement("input");
    sel.setAttribute("id", "cb_" + id);
    sel.setAttribute("name", "cb_" + id);
    sel.setAttribute("type", "checkbox");
    sel.setAttribute("value", "id");
    //_setStyle(sel, "position:relative; left:6%;");
    //sel.style.top = '0px';
    //sel.style.left = '6%';
    //sel.onclick=  ToggleLayer ;
    //sel.onchange= function(){buildQryString;};
    //sel.onchange=  buildQryString ;
    //sel.onkeypress = doEnter;

    var p = document.createElement("label");
    p.setAttribute("for", "cb__" + id);
    //_setStyle(p, "position:relative; left: 20%; font-size: 9pt; font-family: Sylfaen");
    var text = document.createTextNode(lbltext);
    p.appendChild(text);
    //p.style.top = '0px';
    //p.style.left = "25%";

    d.appendChild(sel);
    d.appendChild(p);
    return d;
}


function makeLabel(id, lbltext) {
    var p = document.createElement("p");
    p.setAttribute("id", "l_" + id);
    _setStyle(p, "position:absolute; left: 6%; top: 186px;font-size: 9pt; font-family: Sylfaen");
    var text = document.createTextNode(lbltext);
    p.appendChild(text);
    p.style.top = '0px';
    p.style.left = "0px";
    return p;
}

function rzCC(s) {
    for (var exp = /-([a-z])/; exp.test(s); s = s.replace(exp, RegExp.$1.toUpperCase())); return s; ; }
function _setStyle(element, declaration) {
    if (declaration.charAt(declaration.length - 1) == ';')declaration = declaration.slice(0,  - 1);
    var k, v;
    var splitted = declaration.split(';');
    for (var i = 0, len = splitted.length; i < len; i++) {
        k = rzCC(splitted[i].split(':')[0]);
        v = splitted[i].split(':')[1];
        eval("element.style." + k + "='" + v + "'");
    }
}

