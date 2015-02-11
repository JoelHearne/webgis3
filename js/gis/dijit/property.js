//define.amd.jQuery = true;
define([
	'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'gis/dijit/_FloatingWidgetMixin',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/request',
    'dojo/request/script',
    'dojo/ready', 'dojo/parser', 'dijit/registry',
    'dojo/topic',
    'dojo/number',
    'dojo/aspect',
    'dojo/keys',
	'dojo/store/Memory',
	'dojo/text!./property/templates/PropertyDialog.html',
    'dijit/form/Button',
	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'dijit/form/ToggleButton',
    'dijit/form/CheckBox',
    'dijit/form/DropDownButton',
    "dijit/form/ComboBox",
    'dijit/TooltipDialog',
    'dijit/form/Form',
    //"dijit/form/Select",
    'dojo/_base/array',
    'dojo/io-query',
    'dojox/lang/functional',
    'dojo/json',
    'dojo/cookie',
    "dojo/parser",
     'dijit/form/FilteringSelect',
	'dijit/form/ValidationTextBox',
	'dojo/store/Cache', 'dojo/store/JsonRest',
	'./prc',
	'./prcmin',
	'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/PictureMarkerSymbol',
	//"esri/geometry/Geometry",
	'esri/geometry/Point',
	'esri/SpatialReference',
	'xstyle/css!./property/css/property.css'
	 ,'dojo/domReady!'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin, domConstruct, on, lang
,dom
,Style
,request
,script
,ready,parser,registry
,topic
,number
,aspect
, keys, Memory
,template
,Button
,TabContainer
,ContentPane
,ToggleButton
,CheckBox
,DropDownButton
,ComboBox
,TooltipDialog
,Form
//,Select
,array
,ioQuery
,functional
,JSON
,cookie
,parser
,FilteringSelect,validationtextBox
,Cache,JsonRest
,prc
,prcmin
,GraphicsLayer, Graphic,SimpleRenderer,PictureMarkerSymbol
//,Geometry
,Point,SpatialReference

) {

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Okaloosa County Property Search',
		html: '<a href="#">Property</a>',
		domTarget: 'propertyDijit',
		draggable: true,
		baseClass: 'propertyDijit',
		filteringSelect:null,
		filteringSelect_list:[],
		afStore_list:[],
		autofill_urls:null,
		afStore:null,
		queryIdx:0,
		resPage:1,
		activeMenu:"property",
		mapClickMode: null,
		pointGraphics:null,

		postCreate: function () {
			this.inherited(arguments);

		   //$("div").click(function(){
		   //    alert("clicked p jquery");
		   //});

            //parser.parse();
			this.parentWidget.draggable = this.draggable;
			if (this.parentWidget.toggleable) {
				this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
					this.containerNode.resize();
				})));
			} else {
				var help = domConstruct.place(this.html, this.domTarget);
				on(help, 'click', lang.hitch(this.parentWidget, 'show'));
			}


            // uncomment to open at startup
            this.parentWidget.show();



           /*
           var _this=this;
		   dojo.forEach(this.queries, function(q, i){
			   // check if element exists and set autofill
			   if (registry.byId(q.inputobj_key))   _this.setautofill(q.inputobj_key);
 		   });
 		   */

		}

		,startup: function() {
		      this.inherited(arguments);

		      var _this=this;

		      //this.pstartupDijit.set('value', this.pshowAtStartup);

                     // How to select a tab programmatically
               /*
		             var mainTab = dijit.byId("pSearchTabs"); //Tr
					 var subTab = dijit.byId("pResultsTab"); //tab Id which you want to show
					 mainTab.selectChild(subTab); //Show the selected Tab
					 */

					 // How to load html into contetpanel
					 /*
					 var pane1 = registry.byId("pane1");
					 //pane1.set("href", "./js/viewer/templates/help/property_search.html");
					 pane1.set("href", "./js/viewer/gis/dijit/property/templates/property_search.html");
					 //pane1.domNode.innerHTML
                */


          //this.addPRC_Min();


                // add a generic onchange event listener to the search type selection dropdown
			    /*var el = document.getElementById("selSearchType");
			    if (el.addEventListener) {
					el.addEventListener("change",  this.changeSearchForm, false);
				} else {
					el.attachEvent('change',  this.changeSearchForm)  ;
				}*/


				 this.setautofill("tbAddr");
				 //this.setautofill("tbOwner");
                 this.setautofill("tbPIN");
                 this.setautofill("tbBus");
                 this.setautofill("tbSub");
                 //this.setautofill("tbSalesList");
                 //this.setautofill("tbSalesData");


			   // handle results pager
			   var sp = document.getElementById("selResPage");
			   if (sp.addEventListener) {
					 sp.addEventListener("change",
					   function(e){
						   _this.resPage=e.target.selectedIndex+1;
                           _this.doSearch();
                       }, false);
				} else {
					 sp.attachEvent('change',  function(e){
						   _this.resPage=e.target.selectedIndex+1;
                           _this.doSearch();
                       }) ;
				}



				// handle sales list year selection change
				var dc = document.getElementById("selSaleListYear");
				if (dc.addEventListener) {
					dc.addEventListener("change",  this.salesListYearChange, false);
				} else {
					dc.attachEvent('change',  this.salesListYearChange)  ;
				}




		        return this.pshowAtStartup;
        }
        ,createGraphicsLayer: function () {
			var pointSymbol = new PictureMarkerSymbol(require.toUrl('gis/dijit/StreetView/images/blueArrow.png'), 30, 30);
			this.pointGraphics = new GraphicsLayer({
				id: 'parcel_graphics',
				title: 'Parcel Search'
			});
			var pointRenderer = new SimpleRenderer( pointSymbol);
			 pointRenderer.label = 'Parcel View';
			 pointRenderer.description = 'Parcel View';
			 this.pointGraphics.setRenderer(pointRenderer);
			 this.map.addLayer(this.pointGraphics);
			 this.pointGraphics.show();
		}
		, setMapClickMode: function (mode) {
			this.mapClickMode = mode;
		}
		, placePoint: function () {
			this.disconnectMapClick();
			//get map click, set up listener in post create
		}
		,disconnectMapClick: function () {
			this.map.setMapCursor('crosshair');
			topic.publish('mapClickMode/setCurrent', 'streetview');
		}
		, connectMapClick: function () {
			this.map.setMapCursor('auto');
			topic.publish('mapClickMode/setDefault');
		}
		, clearGraphics: function () {
			this.pointGraphics.clear();
			domStyle.set(this.noStreetViewResults, 'display', 'block');
		}
		,mapSearch: function(e){
            console.log("mapSearch",e);
            var mappt=e.mapPoint;

            console.log("mapSearch pt",mappt.x,"  ",mappt.y);
            var  graphic = new Graphic(e.mapPoint);
            this.pointGraphics.add(graphic);




		}
		,activateMapSearch: function(){

			this.createGraphicsLayer();
			console.log("this.map",this.map);
			this.map.on('click', lang.hitch(this, 'mapSearch'));
			this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));
			this.connectMapClick();


		}
        ,addPRC_Min: function(pinv){

			domConstruct.empty("pcMinDet");

			var _this=this;
			var srmd=dom.byId("pcMinDet");
			var tpcmd =new prcmin(
			 {
			   pin: pinv
			 });
			tpcmd.startup();
			tpcmd.placeAt(srmd);

			dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
            dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultDetailTab"));

			 tpcmd.on("click", function (e) {
			    var actntype=e.target.id;
				  if ((actntype == "pc_zoom") || (actntype == "pc_fulldet") || (actntype == "pc_mindet")
									|| (actntype == "pc_save") 			 || (actntype == "pc_print")) {


						 var prcob=registry.byId(this.id);
						 var pin=prcob.pin.trim();

						 console.log("mindetail menu click",pin," ",actntype);

						 if (pin) {

									 var ownr=prcob.owner.trim();
									 var addrr=prcob.address.trim();
									 var hmstd=prcob.homestead.trim();


									 var pcObj={
										 pin:pin,
										 owner:ownr,
										 address:addrr,
										 homestead:hmstd

									 };

									 //console.log("pcObj",pcObj);
									 _this.handlePRCevent(actntype,pcObj,this.id);

						}
			   }
		    });

		}
      ,setautofill: function(inputobj_key) {

		            var flidx=0;
                    flidx=this.filteringSelect_list.length;

		            //var inputobj_key="tbAddr";
		            var qryidx=-1;

				    dojo.forEach(this.queries, function(q, i){
					   if (q.inputobj_key==inputobj_key) {
						   qryidx=i;

					   }
				    });

				    if (qryidx==-1) {
						console.log("error: could not find query config record: ",qryidx, " fldix:",flidx, " q.inputobj_key:",inputobj_key);

					}

				    //console.log("qryidx",qryidx, " fldix:",flidx);


		            var testStore = new Memory({ idProperty: "id",data: []});
					//this.afStore = Cache(JsonRest({ target : this.queries[qryidx].autofill_url     , idProperty: "id" }), Memory());
					var afStore = Cache(JsonRest({ target : this.queries[qryidx].autofill_url     , idProperty: "id" }), Memory());

					this.afStore_list.push(afStore);

					 var tbID="af_" + inputobj_key

					 //tbID="tbPIN";
					 //ready(function(){
						 ///this.filteringSelect
					 var fs = new FilteringSelect({
										id: tbID,
										name: tbID,
										hasDownArrow: false,
										value: "",
										autoComplete: true,
										pageSize: 10,
										store: testStore,
										//store:afStore,
										searchAttr: "name",
										disabled:false,
										required:false,
										scrollOnFocus:false,
										queryExpr: "${0}",
										invalidMessage:"not finding this value but, you can search it anyway",
										//onKeyUp: function(value){}
										//,onChange: function(state){}
								}, "widget_" + inputobj_key);
					  //});

					  this.filteringSelect_list.push(fs);
					  this.filteringSelect_list[flidx].startup();

                      //console.log("flidx",flidx);
					  //console.log("this.filteringSelect_list[flidx]",this.filteringSelect_list[flidx]);

					  dijit.byId(tbID).set("store", this.afStore_list[flidx]);
					 // dijit.byId(inputobj_key).set("store", testStore);
                      //dijit.byId(inputobj_key).set("store", this.afStore_list[flidx]);

		              var _this=this;
					  this.afStore_list[flidx].query().then(function(response) {

							testStore.setData(response.slice(0));
							registry.byId(tbID).set("store", testStore);
							// _this.own(on(dijit.byId(tbID), 'keyup', lang.hitch(_this, function (evt) {
		                    //            dijit.byId(tbID).set("store", _this.afStore_list[flidx]);
							//})));

					 });


                      if (dijit.byId(tbID)) {

 								 //document.getElementById(tbID).focus();
 								 dijit.byId( tbID).set('style', 'width:100%');
 								 dijit.byId(  tbID).set('store', testStore);
 								 //dijit.byId(tbID).set('value', '');

 								 this.own(on(dijit.byId( tbID), 'keyup', lang.hitch(this, function (evt) {
									  if (evt.keyCode === keys.ENTER) _this.doSearch();

 									 //console.log("dijit keyup dojo.byId(tbID)",dojo.byId(tbID) );

 									 if(dojo.byId( tbID).value.length > _this.queries[qryidx].minChars )
 																dijit.byId(tbID).set("store", _this.afStore_list[flidx]);

 									 if(dojo.byId( tbID).value.length <= _this.queries[qryidx].minChars )
 											dijit.byId(tbID).set("store",testStore);

 								 })));
		            }




 		}
        ,changeSearchForm:function(evt){

			console.log("changeSearchForm",evt," ",this);
			this.clearSearch();


			var SearchPane  = registry.byId("psearchForm");

			var selForm=evt.target.value;

            var frmObj=null;
            this.activeMenu=selForm;
            console.log("changeSearchForm this.activeMenu",this.activeMenu);

			if (selForm=="property") {
				frmObj=dijit.byId("pPropSearchForm");

			} else if (selForm=="saleslist") {
				 frmObj=dijit.byId("pSalesListFrm");

			} else if (selForm=="salesdata") {
				 frmObj=dijit.byId("pSalesDataFrm");

			} else if (selForm=="sub") {
				 frmObj=dijit.byId("pSubForm");

			} else if (selForm=="business") {
				 //SearchPane.set("href", "./js/gis/dijit/property/templates/business.html");
				 frmObj=dijit.byId("pBusForm");

			} else if (selForm=="map") {
				 frmObj=dijit.byId("pMapFrm");
				 this.activateMapSearch();

			}

			// hide all the forms then only show the active form
			dijit.byId("pSubForm").set("style", "display:none");
			dijit.byId("pBusForm").set("style", "display:none");
            dijit.byId("pPropSearchForm").set("style", "display:none");
            dijit.byId("pSalesListFrm").set("style", "display:none");
            dijit.byId("pSalesDataFrm").set("style", "display:none");
            dijit.byId("pMapFrm").set("style", "display:none");

            if (frmObj) frmObj.set("style", "display:block");

			// need a way to impliment autosuggest on the dynamic textboxes
		}
        ,salesListYearChange:function(evt){
			// filter the months for available values
			var selYr=evt.target.value;
			var yrObj=registry.byId("selSaleListYear");
			var mnthObj=dom.byId("selSaleListMonth");

            var monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

            var today = new Date();
            var cmonth = today.getMonth() ;
            var cyear = today.getFullYear();

			// we need to filter months for the current year
			if (cyear==selYr) {
			   mnthObj.options.length=0;
	           for ( var p = 0; p < cmonth; p++) {
				   mnthObj.options[mnthObj.options.length]=new Option(monthNames[p],p+1);
			   }
			   mnthObj.selectedIndex = 0;
			} else {
			   mnthObj.options.length=0;
	           for ( var p = 0; p < monthNames.length; p++) {
				   mnthObj.options[mnthObj.options.length]=new Option(monthNames[p],p+1);
			   }
			   mnthObj.selectedIndex = 0;
			}
		}
		,getQueryObj: function(frmfldid){
			var qo="";
			//console.log("getAutoFillURL",frmfldid);

			if (frmfldid=="property"){
				qo=this.queries[0];
			}
            return qo;
		}

		,onOpen: function () {
			if (!this.openOnStartup) {
				this.containerNode.resize();
			}
		},
		close: function () {
			if (this.parentWidget.hide) {
				this.parentWidget.hide();
			}
		}
		,showWait:function() {
           document.getElementById("pPageSelDiv").style.visibility="hidden";
           document.getElementById("pResCount").innerHTML='';

		   var srd=dom.byId("pSearchResults");
		   if (srd) {
			   var img = dojo.doc.createElement('img');
				dojo.attr(img, {
					id:"waitimg",
					src: "images/ajax-loader2.gif",
					alt: "Please Standbye while I search",
					style: {cursor: "pointer"}
				});
			   dojo.place(img, srd, "after");
	      }

		}
		,hideWait:function() {

		   var wi=dom.byId("waitimg");
		   if (wi) {
			   wi.parentNode.removeChild(wi);

		   }
		}
		,doSearch: function(){
            console.log("doSearch" );
			console.log("doSearch",this.activeMenu);

            domConstruct.empty("pSearchResults");
            this.showWait();

            var startrec = 1;
            var endrec = 50;

            if (this.resPage > 1) {
				startrec = ((this.resPage-1) * 50) + 1;
				endrec = (startrec + 50) - 1;
			}

            var sval;
            var stype;

			if (registry.byId("af_tbAddr") && registry.byId("af_tbAddr").textbox.value && (registry.byId("af_tbAddr").textbox.value !="")){
			          //console.log("addre",registry.byId("af_tbAddr").textbox.value);
			          stype="address";
			          sval=registry.byId("af_tbAddr").textbox.value;
			} else  if (registry.byId("af_tbOwner") && registry.byId("af_tbOwner").textbox.value && (registry.byId("af_tbOwner").textbox.value !="")){
			          //console.log("owner",registry.byId("af_tbOwner").textbox.value);
			          stype="owner";
			          sval=registry.byId("af_tbOwner").textbox.value;
			} else  if (registry.byId("tbOwner") && registry.byId("tbOwner").textbox.value && (registry.byId("tbOwner").textbox.value !="")){
			          stype="owner";
			          sval=registry.byId("tbOwner").textbox.value;
			} else if (registry.byId("af_tbPIN") && registry.byId("af_tbPIN").textbox.value && (registry.byId("af_tbPIN").textbox.value !="")){
			          //console.log("pin",registry.byId("af_tbPIN").textbox.value);
			          stype="pin";
			          sval=registry.byId("af_tbPIN").textbox.value;
			} else if (registry.byId("af_tbBus") && registry.byId("af_tbBus").textbox.value && (registry.byId("af_tbBus").textbox.value !="")){
			          //console.log("bus",registry.byId("af_tbBus").textbox.value);
			          stype="bus";
			          sval=registry.byId("af_tbBus").textbox.value;
			} else if (registry.byId("af_tbSub") && registry.byId("af_tbSub").textbox.value && (registry.byId("af_tbSub").textbox.value !="")){
			          //console.log("sub",registry.byId("af_tbSub").textbox.value);
			          stype="sub";
			          sval=registry.byId("af_tbSub").textbox.value;
			}

            var iurl = 'WebGIS.asmx/PropertyQueryPaged?searchtype=' + stype + '&searchString=' + sval + '&startrec=' + startrec + '&endrec=' + endrec;

			if (this.activeMenu=="saleslist") {
                 stype="saleslist";
                 iurl = this.prepSalesListURL(startrec,endrec);
			}

			if (this.activeMenu=="salesdata") {
                 stype="saleslist";
                 iurl = this.prepSalesDataURL(startrec,endrec);
			}

            var _this=this;
            request.get(iurl,{ handleAs: "json" }).then(

                function (data){
                     //console.log(  data);
                    _this.showResults(data);
 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
			dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
			dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultListTab"));


		}
		,prepSalesDataURL: function(startrec,endrec){

			console.log("prepSalesDataURL");

			 var qJsonObj={
				"subNumber":"",
				"subid":"",
				"sectionValue":"",
				"townshipValue":"",
				"rangeValue":"",
				"startDate":"",
				"endDate":"",
				"startPrice":0,
				"endPrice":0,
				"startArea":0,
				"endArea":0,
				"startAcreage":0,
				"endAcreage":0,
				"saleQualification1":"",
				"saleQualification":"",
				"saleVacant1":"",
				"saleVacant2":"",
				"saleVacant":""
		    };

		    console.log("qJsonObj",qJsonObj);


			if (registry.byId("tbSlDateFrom") && registry.byId("tbSlDateFrom").textbox.value && (registry.byId("tbSlDateFrom").textbox.value !="")){
			          qJsonObj.startDate=registry.byId("tbSlDateFrom").textbox.value;
			}
			if (registry.byId("tbSlDateTo") && registry.byId("tbSlDateTo").textbox.value && (registry.byId("tbSlDateTo").textbox.value !="")){
			          qJsonObj.endDate=registry.byId("tbSlDateTo").textbox.value;
			}
			if (registry.byId("tbSlPriceFrom") && registry.byId("tbSlPriceFrom").textbox.value && (registry.byId("tbSlPriceFrom").textbox.value !="")){
			          qJsonObj.startPrice=registry.byId("tbSlPriceFrom").textbox.value;
			}
			if (registry.byId("tbSlPriceTo") && registry.byId("tbSlPriceTo").textbox.value && (registry.byId("tbSlPriceTo").textbox.value !="")){
			          qJsonObj.endPrice=registry.byId("tbSlPriceTo").textbox.value;
			}

			if (registry.byId("tbSlSGFTFrom") && registry.byId("tbSlSGFTFrom").textbox.value && (registry.byId("tbSlSGFTFrom").textbox.value !="")){
			          qJsonObj.startArea=registry.byId("tbSlSGFTFrom").textbox.value;
			}

			if (registry.byId("tbSlSGFTTo") && registry.byId("tbSlSGFTTo").textbox.value && (registry.byId("tbSlSGFTTo").textbox.value !="")){
			          qJsonObj.endArea=registry.byId("tbSlSGFTTo").textbox.value;
			}
			if (registry.byId("tbSlAcreFrom") && registry.byId("tbSlAcreFrom").textbox.value && (registry.byId("tbSlAcreFrom").textbox.value !="")){
			          qJsonObj.startAcreage=registry.byId("tbSlAcreFrom").textbox.value;
			}

			if (registry.byId("tbSlAcreTo") && registry.byId("tbSlAcreTo").textbox.value && (registry.byId("tbSlAcreTo").textbox.value !="")){
			          qJsonObj.endAcreage=registry.byId("tbSlAcreTo").textbox.value;
			}

             console.log("qJsonObj to json",dojo.toJson(qJsonObj,true));

			return iurl = 'WebGIS.asmx/SalesDataQueryPaged?startrec=' + startrec + '&endrec=' + endrec + '&objjson=' + dojo.toJson(qJsonObj,true);
		}
		,prepSalesListURL: function(startrec,endrec){
			var syear=dom.byId("selSaleListYear").value;
			var smonth=parseInt(dom.byId("selSaleListMonth").value)-1;

            var startDate=new Date(syear,parseInt(smonth),1);
            var endDate=  new Date(new Date(syear,parseInt(smonth)+1,1)  - (24*60*60*1000));

            var qStartDate=(startDate.getMonth() + 1) + '/' + (startDate.getDate() ) + '/' + startDate.getFullYear();
            var qEndDate=(endDate.getMonth() + 1) + '/' + (endDate.getDate()  ) + '/' + endDate.getFullYear();

			return iurl = 'WebGIS.asmx/SalesDataQueryPaged?startrec=' + startrec + '&endrec=' + endrec + '&objjson={"subNumber":"","subid":"","sectionValue":"","townshipValue":"","rangeValue":"","startDate":"' + qStartDate + '","endDate":"' + qEndDate + '","startPrice":0,"endPrice":0,"startArea":0,"endArea":0,"startAcreage":0,"endAcreage":0,"saleQualification1":"","saleQualification":"","saleVacant1":"","saleVacant2":"","saleVacant":""} ';
		}
		,handlePRCevent: function(actntype,pcObj,prcID) {
			 //console.log("handling prc event",pcObj,"  ",actntype);

			 var prcob=registry.byId(prcID);




			//var _this=this;
			if (actntype == "pc_zoom") {
				//console.log("zooming "," map ",this.map);

               topic.publish('InitZoomer/ZoomParcel', {
			 		 pin:pcObj.pin
               });

			} else if (actntype == "pc_fulldet") {

			} else if (actntype == "pc_mindet") {
				//prcob.expand_detail();

				this.addPRC_Min(pcObj.pin);

			} else if (actntype == "pc_save") {
				this.addPRC2Saved(pcObj,prcID);

				// if action card is minimal detail then ...

			} else if (actntype == "pc_print") {

			}



		}
		,addPRC2Saved:function(pcObj,widgetID){

			 var _this=this;
             var srd=dom.byId("pSearchSaved");


			 var prcob=registry.byId(widgetID);


			 var tprc =new prc(
			    {
						   pin: pcObj.pin,
						   owner: pcObj.owner,
						   address: pcObj.addr,
						   homestead:pcObj.hstead
			    });

			 tprc.on("click", function (e) {
			     var actntype=e.target.id;
			     if ((actntype == "pc_zoom") || (actntype == "pc_fulldet") || (actntype == "pc_mindet")
												   || (actntype == "pc_print")) {

				     var pin=prcob.pin.trim();
				     if (pin) {
					 var ownr=prcob.owner.trim();
					 var addrr=prcob.address.trim();
					 var hmstd=prcob.homestead.trim();
					 var pcObj={
						 pin:pin,
						 owner:ownr,
						 address:addrr,
						 homestead:hmstd
					 };
					 _this.handlePRCevent(actntype,pcObj);
				 }
			 }
		    });
			  tprc.startup();
			  tprc.placeAt(srd);
		}
		,resultsAddPager(dobj){


			//TODO: Hide if there are zero results and show if there are > 0
            var rec_page = 0;
            var pgcnt=0;
            if (dobj.rec_count > 0) {
				var select = dom.byId("selResPage");
				select.options.length=0;
				rec_page = 1;
				pgcnt = 1;
				// build paging control
				if (dobj.rec_count > 50) {
					document.getElementById("pPageSelDiv").style.visibility="visible";
					pgcnt = Math.ceil(dobj.rec_count / 50);

					if (dobj.start_rec > 50) rec_page = Math.ceil(dobj.start_rec / 50);

					for (var p = 0; p < pgcnt; p++) {
						select.options[select.options.length]=new Option(p + 1);
					}
				} else {
					// hide the page selection box pPageSelDiv
					//var psdv = dom.byId("pPageSelDiv");
					document.getElementById("pPageSelDiv").style.visibility="hidden";


				}

				if (dobj.rec_count > 50) select.selectedIndex = rec_page-1;
		   }

		   /*
		   var el = document.getElementById("selResPage");
		   if (el.addEventListener) {
		   		 el.addEventListener("change",  this.changePage, false);
		    } else {
		   		 el.attachEvent('change',  this.changePage)  ;
		    }
		    */

		    // show the record count
		    var rc = document.getElementById("pResCount");
		    rc.innerHTML='<br><b><p>' + dobj.rec_count + ' total records</p></b><br>page ' + rec_page + ' of ' + pgcnt;

		}
		,changePage:function(e){

             var pg=e.target.selectedIndex-1;
             console.log("changePage changing page",pg );

             this.resPage=pg;
             this.doSearch();

		}
		,showResults: function (results){

			 this.hideWait();

             var _this=this;
             var srd=dom.byId("pSearchResults");
			 var dlgcont = "";
			 var dobj=results;
			 var pobj = results.ps_res;

			 domConstruct.empty("pSearchResults");

			 if (!pobj) {
				 console.log("error getting results",results);
			 }


			// Set the page menu and select current page
            this.resultsAddPager(dobj);

            // show minimal detail if there is only one results
            if (pobj.length==1) {
               dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
			   dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultDetailTab"));
			   //TODO: show min detail pobj[0].pin
			   this.addPRC_Min(pcObj.pin);

		    }



			 for (var i = 0; i < pobj.length; i++) {
					 var tprc =new prc(
						 {
						   pin: pobj[i].pin,
						   owner: pobj[i].owner,
						   address: pobj[i].addr,
						   homestead:pobj[i].hstead
						 });

						 tprc.on("click", function (e) {
							 var actntype=e.target.id;
							 if ((actntype == "pc_zoom") || (actntype == "pc_fulldet") || (actntype == "pc_mindet")
									|| (actntype == "pc_save") 			 || (actntype == "pc_print")) {



								 // get the prc id, get the widget, fire widget method
								  var prcob=registry.byId(this.id);
								  //prcob.expand_detail();


								 //var pin=this.childNodes[1].childNodes[1].children[0].children[0].children[2].textContent;
                                 var pin=prcob.pin.trim();

								 if (pin) {
									 //pin=pin.replace(/(\r\n|\n|\r)/gm,"").trim();

									 //var ownr=this.childNodes[1].childNodes[1].children[0].children[0].children[4].textContent.replace(/(\r\n|\n|\r)/gm,"").trim();
									 //var addrr=this.childNodes[1].childNodes[1].children[0].children[0].children[6].textContent.replace(/(\r\n|\n|\r)/gm,"").trim();
									 //var hmstd=this.childNodes[1].childNodes[1].children[0].children[0].children[8].textContent.replace(/(\r\n|\n|\r)/gm,"").trim();
									 var ownr=prcob.owner.trim();
									 var addrr=prcob.address.trim();
									 var hmstd=prcob.homestead.trim();


									 var pcObj={
										 pin:pin,
										 owner:ownr,
										 address:addrr,
										 homestead:hmstd

									 };

									 //console.log("pcObj",pcObj);
									 _this.handlePRCevent(actntype,pcObj,this.id);
								 }
							 }
						 });

					 tprc.startup();

				     tprc.placeAt(srd);
			 }


			 // set the pager to active page



			 //dijit.byId("pWaitDiv").set("style", "visibility:hidden");

		}
		,PclCardClck: function(){
			console.log("PclCardClck");


		}
		,clearSearch: function(){


           var dobj=dijit.byId("pane1").domNode;
           var iboxes=dobj.getElementsByTagName('input');
           for (var i=0;i<iboxes.length;i++){
			    if (iboxes[i].type=="text"){
                    iboxes[i].value="";
				}
		   }

          /*
			var selSearchType = dom.byId("selSearchType");
			//console.log("selSearchType",selSearchType);

			 //this.setautofill("tbOwner");
			if (registry.byId("af_tbAddr") && registry.byId("af_tbAddr").textbox.value && (registry.byId("af_tbAddr").textbox.value !="")){
			           registry.byId("af_tbAddr").textbox.value="";
		    }
			if (registry.byId("af_tbOwner") && registry.byId("af_tbOwner").textbox.value && (registry.byId("af_tbOwner").textbox.value !="")){
			           registry.byId("af_tbOwner").textbox.value="";
			}
			if (registry.byId("tbOwner") && registry.byId("tbOwner").textbox.value && (registry.byId("tbOwner").textbox.value !="")){
			           registry.byId("tbOwner").textbox.value="";

			}
			if (registry.byId("af_tbPIN") && registry.byId("af_tbPIN").textbox.value && (registry.byId("af_tbPIN").textbox.value !="")){
			           registry.byId("af_tbPIN").textbox.value="";
			}
			if (registry.byId("af_tbBus") && registry.byId("af_tbBus").textbox.value && (registry.byId("af_tbBus").textbox.value !="")){
			           registry.byId("af_tbBus").textbox.value="";
			}
			if (registry.byId("af_tbSub") && registry.byId("af_tbSub").textbox.value && (registry.byId("af_tbSub").textbox.value !="")){
			           registry.byId("af_tbSub").textbox.value="";
			}
			*/


		}

	});
});