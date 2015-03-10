define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_AttachMixin',
    'dijit/_WidgetsInTemplateMixin',
    'esri/toolbars/navigation',
    'dijit/form/Button',
    "dijit/form/TextBox",
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/text!./prcmin/templates/prcmin.html',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/request',
    'dojo/request/script',
    'dojo/ready',
    'dijit/registry',
    'xstyle/css!./prcmin/css/prcmin.css'
], function (declare, _WidgetBase, _TemplatedMixin,_AttachMixin, _WidgetsInTemplateMixin, Navigation, Button,TextBox, Menu, MenuItem, PopupMenuItem, MenuSeparator, lang, on, PrcMinTemplate
	,topic
	,domConstruct
	,dom
	,Style
	,request
	,script
	,ready
	,registry
	, css
) {
    return declare([_WidgetBase, _TemplatedMixin,  _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: PrcMinTemplate,
        pin:"",
        owner:"",
        address:"",
        homestead:"",
        saved:"n",
        query_type:"",
        query_str:"",
         postCreate: function(){
			this.inherited(arguments);
			this.get_data();
        }
        ,startup: function() {
			this.inherited(arguments);
			//this.pcPIN.innerHTML=this.pin;
	    }
	    ,get_data:function(){
			var iurl = 'WebGIS.asmx/PropertyQueryMinDet?pin=' + this.pin;
           //console.log(iurl);
            var _this=this;
            request.get(iurl,{ handleAs: "json" }).then(
                function (data){
                     _this.populate_form(data);
 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
		}
		,populate_form:function(dobj){

			 this.pcPIN.innerHTML=dobj.pin;
			 this.pcOwner.innerHTML=dobj.owner;

			 //var mailing_addr=dobj.PEFLADDR1.trim() + ' ' + dobj.PEFLADDR2.trim()+ ' ' + dobj.PEFLADDR3.trim() + "\n" + dobj.PEFLCITY.trim();
			 var mailing_addr="";
			 mailing_addr=mailing_addr +  ((dobj.PEFLADDR1.trim()=="") ? "" : dobj.PEFLADDR1.trim() + "<br>");
			 mailing_addr=mailing_addr +  ((dobj.PEFLADDR2.trim()=="") ? "" : dobj.PEFLADDR2.trim() + "<br>");
			 mailing_addr=mailing_addr +  ((dobj.PEFLADDR3.trim()=="") ? "" : dobj.PEFLADDR3.trim() + "<br>");
			 mailing_addr=mailing_addr +  ((dobj.PEFLCITY.trim()=="") ? "" : dobj.PEFLCITY.trim() + ",");
			 mailing_addr=mailing_addr +  ((dobj.PEFLST.trim()=="") ? "" : " " + dobj.PEFLST.trim());
			 mailing_addr=mailing_addr +  ((dobj.PEFLZIP5.trim()=="") ? "" : " " + dobj.PEFLZIP5.trim());
			 mailing_addr=mailing_addr +  ((dobj.PEFLCNTRY.trim()=="") ? "" : "<br>" + dobj.PEFLCNTRY.trim());

			 this.pcAddr.innerHTML=mailing_addr;

             this.owner=dobj.owner;
             this.address=mailing_addr;
             this.homestead=dobj.HMSTD;

             console.log("acres",dobj.acres);

             this.pcAcres.innerHTML=dobj.acres;
             this.pcPropuse.innerHTML=dobj.propertyuse;
             this.pcLanduse.innerHTML=dobj.landuse;

			this.pcLandVal.innerHTML=dobj.land_value;
			this.pcAgVal.innerHTML=dobj.ag_value;
			this.pcBldVal.innerHTML=dobj.bldg_value;
			this.pcMiscVal.innerHTML=dobj.xtra_value;
			this.pcJustVal.innerHTML=dobj.just_value;
			this.pcAssVal.innerHTML=dobj.assd_value;
			this.pcXVal.innerHTML=dobj.exempt_value;
			this.pcTaxVal.innerHTML=dobj.taxable_value;
			//this.pcTaxVal.innerHTML='<a href="https://www.okaloosa.county-taxes.com/public/real_estate/parcels/042N24000000040000" target="_blank">' +dobj.taxable_value + '</a>';
			this.pcHomestead.innerHTML=dobj.HMSTD;
			//this.pcFLU.innerHTML=dobj.FLUPY;
			this.pcFLU.innerHTML='<a href="http://webgis.co.okaloosa.fl.us/website/okaloosagis/gm/chapter2-FLU.pdf" target="_blank">' + dobj.FLUPY + '</a>';
			//this.pcCtyZn.innerHTML=dobj.ZONING;
			this.pcCtyZn.innerHTML='<a href="http://webgis.co.okaloosa.fl.us/website/okaloosagis/gm/chapter2-LDC.pdf" target="_blank">' + dobj.ZONING + '</a>';
			//this.pcFEMAFlood.innerHTML=dobj.FLDZ_BFE;
			this.pcFEMAFlood.innerHTML='<a href="https://www.fema.gov/floodplain-management/flood-zones" target="_blank">' + dobj.FLDZ_BFE + '</a>';
			//this.pcCobra.innerHTML=dobj.COBRA;
			this.pcCobra.innerHTML='<a href="http://www.fema.gov/national-flood-insurance-program-2/coastal-barrier-resources-system" target="_blank">' + dobj.COBRA + '</a>';
			this.pcInFloodway.innerHTML=dobj.FLDWY;
			this.pcInFloodway.innerHTML='<a href="https://suite.io/david-a-todd/23rd2j6" target="_blank">' + dobj.FLDWY + '</a>';
			//this.pcWetlans.innerHTML=dobj.WETLAND;
			this.pcWetlans.innerHTML='<a href="http://en.wikipedia.org/wiki/Wetland" target="_blank">' + dobj.WETLAND + '</a>';
			this.pcPWRServProv.innerHTML=dobj.POWER;
			this.pcWaterServ.innerHTML=dobj.WATER;
			this.pcSub.innerHTML=dobj.SUBDIVISION;
			//this.pcBCCDist.innerHTML=dobj.COMMISSION;
			this.pcBCCDist.innerHTML='<a href="http://www.co.okaloosa.fl.us/bcc_welcome.html" target="_blank">' + dobj.commissioner + " (" + dobj.COMMISSION + ')</a>';

			//this.pcFireDist.innerHTML=dobj.FIRE;
			this.pcFireDist.innerHTML='<a href="http://www.firedepartments.net/county/FL/OkaloosaCounty.html" target="_blank">' + dobj.FIRE + '</a>';

			this.pcCensusTract.innerHTML=dobj.TRACT;

			try {
				this.pcSiteAddr.innerHTML=dobj.Site_Addr;
			} catch (exc) { console.log("error",exc); }

			// sales list
            try {
				if (dobj.sales_list && dobj.sales_list.length > 0) {
					this.pcSLS_Date_1.innerHTML=dobj.sales_list[0].sale_date;
					this.pcSLS_Price_1.innerHTML=dobj.sales_list[0].sale_amount;
					this.pcSLS_Vacant_1.innerHTML=dobj.sales_list[0].vacant;
					this.pcSLS_Qual_1.innerHTML=dobj.sales_list[0].qualified;

					if (dobj.sales_list[1]) {
						this.pcSLS_Date_2.innerHTML=dobj.sales_list[1].sale_date;
						this.pcSLS_Price_2.innerHTML=dobj.sales_list[1].sale_amount;
						this.pcSLS_Vacant_2.innerHTML=dobj.sales_list[1].vacant;
						this.pcSLS_Qual_2.innerHTML=dobj.sales_list[1].qualified;
					}
				}
		    } catch (exc) { console.log("error",exc); }


		}
 		,ebClick:function(e){
			//console.log("ebClick",e,"   ",e.target.parentElement.textContent);
			//document.getElementById("pPageSelDiv").style.visibility="visible";

            //this.znTable.style.visibility="visible";
            //this.slTable.style.visibility="visible";
            var togOb=null;

            if (e.target.parentElement.textContent.indexOf("Permit") !=-1) {
				  togOb=this.znTable;
			}  else if (e.target.parentElement.textContent.indexOf("Value") !=-1) {
				  togOb=this.slTable;
			}  else if (e.target.parentElement.textContent.indexOf("Sales") !=-1) {
				  togOb=this.slsTable;
			}
            if (togOb) {
				if (togOb.style.display=="none") {
					//this.znTable.style.display="block";
					togOb.style.display="";
				} else {
					togOb.style.display="none";
				}
		    }




		}

        ,tbClick: function (e) {
			//console.log('clicked tb',e);

			//if (e.target.id=='navt_n') {

        }
    });
});
