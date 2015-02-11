
var stype="owner";
var sval="";
var resultspageurl="http://gisvm107:82/webgis2/alsearch_dw.htm";

function owner_search() {
	stype="owner";
	sval = document.getElementById('searchval').value;

	var iurl = resultspageurl + '?searchtype=' + stype + '&searchString=' + sval
	document.location=iurl;
}

function pin_search() {
	stype="pin";
	sval = document.getElementById('searchval').value;

	var iurl = resultspageurl + '?searchtype=' + stype + '&searchString=' + sval
	document.location=iurl;
}

function sub_search() {
	stype="sub";
	sval = document.getElementById('searchval').value;

	var iurl = resultspageurl + '?searchtype=' + stype + '&searchString=' + sval
	document.location=iurl;
}

function bus_search() {
	stype="bus";
	sval = document.getElementById('searchval').value;

	var iurl = resultspageurl + '?searchtype=' + stype + '&searchString=' + sval
	document.location=iurl;
}
function leg_search() {
	stype="leg";
	sval = document.getElementById('searchval').value;

	var iurl = resultspageurl + '?searchtype=' + stype + '&searchString=' + sval
	document.location=iurl;
}
function address_search(){

	stype="address";

	var st_num = document.getElementById('streetNumber').value;
	var st_unit = document.getElementById('streetUnit').value;
	var st_name = document.getElementById('streetName').value;

	sval = st_num + " " + st_name;
	var iurl = resultspageurl + '?searchtype=' + stype + '&searchString=' + sval
	document.location=iurl;
}



function searchProperty() {
    //var addrval = document.getElementById('tbAddr').value;
    //var pinval = document.getElementById('tbPIN').value;
    //var ownval = document.getElementById('tbOwner').value;

    /*
    var addrval = document.getElementById('ownername').value;
    //var addrval = "schneider";
    var pinval = "";
    var ownval = "";


     sval = addrval;
     //var stype = "address";

    if (addrval != '') {
        sval = addrval;
    } else if (pinval != '') {
        sval = pinval;
        //stype = "pin";
    } else if (ownval != '') {
        //stype = "owner";
        sval = ownval;
    }
    */

    //document.getElementById('ownersearch').style.visibility = "hidden";


    //iurl = 'http://localhost:82/webgis2/WebGIS.asmx/PropertyQuery?searchtype=' + stype + '&searchString=' + sval

    //if (ajaxproxy && ajaxproxy !="")  iurl=ajaxproxy + iurl;

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: iurl,
        cache: false,
        //data: { postVar1: 'theValue1', postVar2: 'theValue2' },
        //dataType: 'json',
        //contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#results').html('<div class="loading"><img src="./theme/default/img/loading.gif" alt="Loading..." /></div>');
        },
        success: function (msg) {
            // $('#mdiv').empty();
            $('#results').html('success');
            //console.log("success");
            //console.log(msg);
            var result = msg.documentElement;
            var jsonr = "";
            var xmlDoc;
            if (document.implementation && document.implementation.createDocument) {
                jsonr = result.textContent;
            } else if (window.ActiveXObject) {
                jsonr = result.text;
            }

            var dobj = JSON.parse(jsonr);
            ShowPropertyResults(dobj);
            //enumObjProps(dobj);
            //$('#mdiv').html(jsonr);
        },
        error: function (xhr, status, error) {

            $('#results').html(error);

        }
    });
}

function isEvenOrOdd(num) {
    var rn = num % 2;
    var re = "even";
    if (rn == true) re = "odd";
    return re;
}

function ShowPropertyResults(pobj) {

    var dlgcont = "";

    //dlgcont = dlgcont + '<div class="CSSTableGenerator" > ';
    dlgcont = dlgcont + '<table style="top: 0%; left: 0%" align="center" border="1" class="table_class">';
    dlgcont = dlgcont + '<tr><td colspan=7 class="table_header"> Search Criteria: Owner Search=' + sval + ' </td></tr>';
    dlgcont = dlgcont + '<tr><td colspan=7 class="table_header"> Search produced the following results. Select one by clicking the parcel number link in the first column below. </td></tr>';
    dlgcont = dlgcont + '<tr>';
    dlgcont = dlgcont + '<td class="table_header2">Parcel Number</td>';
    dlgcont = dlgcont + '<td class="table_header2">Owner Name</td>';
    dlgcont = dlgcont + '<td class="table_header2">Address</td>';
    dlgcont = dlgcont + '<td class="table_header2">Legal Information</td>';
    dlgcont = dlgcont + '<td class="table_header2">Homestead</td>';
    dlgcont = dlgcont + '<td class="table_header2">Last Sale</td>';
    dlgcont = dlgcont + '<td class="table_header2"> GIS Map </td>';
    dlgcont = dlgcont + '</tr>';



    for (var i = 0; i < pobj.length; i++) {

        dlgcont = dlgcont + '<tr class="' + isEvenOrOdd(i) + '">';
        dlgcont = dlgcont + '<td class="search_value">&nbsp;<a target=_blank href="http://webgis.co.okaloosa.fl.us/website/okaloosagis/PropertyAppraiserDetail.asp?pin=' + pobj[i].pin + '&type=%27parcel%27">' + pobj[i].pin + '</a>&nbsp;</td>';
        dlgcont = dlgcont + '<td class="search_value">&nbsp; ' + pobj[i].owner + ' &nbsp;</td>';
        dlgcont = dlgcont + '<td class="search_value">&nbsp; ' + pobj[i].addr + ' &nbsp;</td>';
        dlgcont = dlgcont + '<td class="search_value">&nbsp; ' + pobj[i].legal + ' &nbsp;</td>';
        dlgcont = dlgcont + '<td class="search_value" align="center">&nbsp; ' + pobj[i].hstead + ' &nbsp;</td>';
        dlgcont = dlgcont + '<td class="search_value" align="center">&nbsp; ' + pobj[i].lastSale + ' &nbsp;</td>';
        dlgcont = dlgcont + '<td class="search_value" align=center>&nbsp;<a target=_blank href="http://webgis.co.okaloosa.fl.us/okaloosagis/viewer.htm?pin=' + pobj[i].pin + '">Map It</a>&nbsp;</td>';
        dlgcont = dlgcont + '</tr>';


    }


    dlgcont = dlgcont + '<tr>';
    dlgcont = dlgcont + '<td class="header_link" align="center" colspan=7>';
    dlgcont = dlgcont + '<a href="mailing_list_dw.php" target="new">Print Mailing Labels</a>';
    dlgcont = dlgcont + '</td>';
    dlgcont = dlgcont + '</tr>';
    dlgcont = dlgcont + '<tr>';
    dlgcont = dlgcont + '<td colspan=7 class="caption">';
    dlgcont = dlgcont + 'The Okaloosa County Property Appraiser\'s Office makes every effort to produce the most accurate information possible. No warranties, expressed or implied, are provided for the data herein, its use or interpretation. The Senior Exemption Does Not Apply to All Taxing Authorities. Just (Market) Value is established by the Property Appraiser for ad valorem tax purposes. It does not represent anticipated selling price. Working values are subject to change.';
    dlgcont = dlgcont + ' Website Updated: February 19, 2014';
    dlgcont = dlgcont + '</td>';
    dlgcont = dlgcont + '</tr>';
    dlgcont = dlgcont + '<tr><td colspan=2 class="header_link"><a href="fl_search_dw.php?county=fl_okaloosa"> Return to Main Search </a></td><td class="sales_link">&nbsp;</td><td class="header_link" colspan=2><a href="http://www.co.okaloosa.fl.us"> Okaloosa Home </a></td></tr>';
    dlgcont = dlgcont + '</table>';



    // dlgcont = dlgcont + '</div><br>';
    $('#results').html(dlgcont);
    //$('#searchdialog').dialog({ show: "slow" });


}


function doclayout() {
    var dtop = document.getElementById('top');
    var dmap = document.getElementById('map');


    var dh = document.body.clientHeight;
    var dw = document.body.clientWidth;
    //var doh=document.body.offsetHeight;
    //var dow=document.body.offsetWidth;

    //var mdw=Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
    //var mdh=Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
    var mdw = Math.max(document.documentElement["clientWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
    var mdh = Math.max(document.documentElement["clientHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);

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

    mdw = mdw - 15;
    mdh = mdh - 15;
    dw = dw - 15;
    dh = dh - 15;

    dtop.style.width = (dw + 3) + "px";

    dmap.style.width = (dw - dtoolb.offsetWidth) + "px";
    //dtoolb.style.left = (dmap.offsetWidth + 3) + "px";

    dmap.style.height = (mdh - dtop.offsetHeight) + "px";
    //dtoolb.style.height = (mdh - dtop.offsetHeight) + "px";



}



function parseQuery(qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i in a) {
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

function checkSubmit(e)
{

   if(e && e.keyCode == 13)
   {
      document.forms[0].submit();
   }
}