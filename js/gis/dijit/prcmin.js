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

			//this.pin="33-1S-24-113C-0000-0080";
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

			//console.log(dobj);

			 this.pcPIN.innerHTML=dobj.pin;
			 this.pcOwner.innerHTML=dobj.owner;

			 var mailing_addr=dobj.PEFLADDR1.trim() + ' ' + dobj.PEFLADDR2.trim()+ ' ' + dobj.PEFLADDR3.trim() + "\n" + dobj.PEFLCITY.trim();
			 this.pcAddr.innerHTML=mailing_addr;

             this.owner=dobj.owner;
             this.address=mailing_addr;
             this.homestead=dobj.HMSTD;

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
			this.pcHomestead.innerHTML=dobj.HMSTD;


			this.pcFLU.innerHTML=dobj.FLUPY;
			this.pcCtyZn.innerHTML=dobj.ZONING;
			this.pcFEMAFlood.innerHTML=dobj.FLDZ_BFE;
			this.pcCobra.innerHTML=dobj.COBRA;
			this.pcInFloodway.innerHTML=dobj.FLDWY;
			this.pcWetlans.innerHTML=dobj.WETLAND;
			this.pcPWRServProv.innerHTML=dobj.POWER;
			this.pcWaterServ.innerHTML=dobj.WATER;
			this.pcSub.innerHTML=dobj.SUBDIVISION;
			this.pcBCCDist.innerHTML=dobj.COMMISSION;
			this.pcFireDist.innerHTML=dobj.FIRE;
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

            if (e.target.parentElement.textContent.indexOf("Zoning") !=-1) {
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
