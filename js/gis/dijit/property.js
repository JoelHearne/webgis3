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
	'dojo/_base/Color',
	'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/graphicsUtils',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/PictureMarkerSymbol',
	 "esri/geometry/Geometry",
	'esri/geometry/Point',
	'esri/SpatialReference',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/graphicsUtils',
	'esri/tasks/FindTask',
	'esri/tasks/FindParameters',
	"esri/tasks/QueryTask",
	"esri/tasks/query",
	'esri/geometry/Extent',
	'esri/tasks/IdentifyTask',
	'esri/tasks/IdentifyParameters',
	'esri/InfoTemplate',
	'xstyle/css!./property/css/property.css'
	 ,'dojo/domReady!'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin, domConstruct, on, lang
,dom
,Style
,request
,script
,ready
,parser
,registry
,topic
,number
,aspect
,keys
,Memory
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
,FilteringSelect
,validationtextBox
,Cache,JsonRest
,prc
,prcmin
,Color
,GraphicsLayer
,Graphic
, graphicsUtils
,SimpleRenderer
,PictureMarkerSymbol
 ,Geometry
,Point
,SpatialReference
,SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, graphicsUtils, FindTask, FindParameters,QueryTask,Query, Extent,IdentifyTask, IdentifyParameters,InfoTemplate

) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Okaloosa County Property Search',
		html: '<a href="#">Property</a>',
		domTarget: 'propertyDijit',
		draggable: true,
		baseClass: 'propertyDijit',
		property_mapsrvc:'http://gisvm101:6080/arcgis/rest/services/IGIS/MapServer',
		parcel_lyrid:11,
		pin_field:"PATPCL_PIN",
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
		}
		,startup: function() {
			this.inherited(arguments);
			var _this=this;

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
		, placePoint: function (e) {
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
            console.log("this.pointGraphics ",this.pointGraphics);
            var  graphic = new Graphic(e.mapPoint);
            this.pointGraphics.add(graphic);


            // Step 1: Query AGS, add the selection to the map, and get the pins for the selected  area
            // 1.a - Query AGS.

			var q_url=this.property_mapsrvc + "/" + this.parcel_lyrid;
			console.log("q_url",q_url);

			var query = new  Query();
			//query.where = "STATE_NAME = 'Washington'";
			//query.outSpatialReference = {wkid:102100};
			query.geometry = mappt;
			query.outSpatialReference = {wkid:this.map.spatialReference.wkid};
			query.returnGeometry = true;
			query.outFields = [this.pin_field];

			var qryTask=new QueryTask(q_url);

			//console.log("queryTask",qryTask);
			qryTask.execute(query,lang.hitch(this, 'mapqRes'));


            // Step 2: Query CentralGIS using the selected PINs

            // Step 3: Add a mechanism to clear the selection set.

            // Step 4: Do proper gqarbage collection and cleanup

		}
		,mapqRes: function(results) {
			console.log("mapqRes",results);
			var _this=this;
			console.log("mapqRes this",this);
            var zoomExtent = null;

            // add graphics layer if it does not already exist
		    var polygonGraphics = this.map.getLayer("findGraphics_polygon");
            if (!polygonGraphics) polygonGraphics = new GraphicsLayer({ id: 'findGraphics_polygon', title: 'Find Graphics' });
            this.map.addLayer(polygonGraphics);
            polygonGraphics.show();

            //console.log("polygonGraphics",polygonGraphics);
            console.log("mapqRes results",results);

            // TODO: make the infotemplate an option/parameter
            // var infoTemplate = new InfoTemplate("Parcel Info", "<table><tr><td>PIN: </td><td>${PARCEL ID}</td></tr><tr><td>Owner: </td><td>${OWNER}</td></tr></table>");


            var feats=[];
            var pins=[];
			array.forEach( results.features, function (feature) {
				  var graphic;
                  //feature.setInfoTemplate(infoTemplate);
				  feats.push(feature);

				  console.log("feature.attributes",feature.attributes);

				  if (feature.attributes && feature.attributes.PATPCL_PIN) {

					   pins.push(feature.attributes.PATPCL_PIN);

				  }


				  switch (feature.geometry.type) {
						case 'point':
						    // TODO: Add point graphics
							break;
						case 'polyline':
						    // TODO: Add polyline graphics
							break;
						case 'polygon':

							if (feature.geometry.rings && feature.geometry.rings.length > 0) {

								graphic = new Graphic(feature.geometry, null, {
									ren: 1
								});


                                // TODO: make symbology an option/parameter
								graphic.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
											 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
											 new Color([0, 0, 235]), 3), new Color([0, 10, 205, 0.15])));

							     polygonGraphics.add(graphic);
								//_this.pointGraphics.add(graphic);

							}
							break;
						default:
				  }

                  // update the results extent
				  /*if ( _this.pointGraphics.graphics.length > 0) {
						if (zoomExtent === null) {
							zoomExtent = graphicsUtils.graphicsExtent(_this.pointGraphics.graphics);
						} else {
							zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(_this.pointGraphics.graphics));
						}
				  }
				  */


				  if ( polygonGraphics.graphics.length > 0) {
						if (zoomExtent === null) {
							zoomExtent = graphicsUtils.graphicsExtent(polygonGraphics.graphics);
						} else {
							zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(polygonGraphics.graphics));
						}
				  }

			}); // end array.forEach

			if (zoomExtent)  this.map.setExtent(zoomExtent.expand(5.2));

			console.log("pins",pins);
			this.doSearch_Pins(pins);

           // Show info popup
		   //var mapPoint = zoomExtent.getCenter();
		   //this.map.infoWindow.setContent('<div class="loading"></div>');
           //this.map.infoWindow.setFeatures(feats);
           //this.map.infoWindow.show(mapPoint);

           // Step 2: Query CentralGIS using the selected PINs

		}
		,doSearch_Pins: function(pins){
            console.log("doSearch_Pins",pins);

            var iurl = 'WebGIS.asmx/PropertyQueryPaged?searchtype=pin_list&searchString=' + pins.join() + '&startrec=1&endrec=50';
            //console.log("iurl",iurl);

            var _this=this;
            request.get(iurl,{ handleAs: "json" }).then(

                function (data){
                     console.log(  data);
                    _this.showResults(data);
 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
			dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
			dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultListTab"));


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

			var qryidx=-1;
			dojo.forEach(this.queries, function(q, i){
			   if (q.inputobj_key==inputobj_key) {
				   qryidx=i;

			   }
			});

			if (qryidx==-1)  console.log("error: could not find query config record: ",qryidx, " fldix:",flidx, " q.inputobj_key:",inputobj_key);

			var testStore = new Memory({ idProperty: "id",data: []});
			var afStore = Cache(JsonRest({ target : this.queries[qryidx].autofill_url     , idProperty: "id" }), Memory());
			this.afStore_list.push(afStore);
			var tbID="af_" + inputobj_key

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
			}, "widget_" + inputobj_key);

			this.filteringSelect_list.push(fs);
			this.filteringSelect_list[flidx].startup();

			dijit.byId(tbID).set("store", this.afStore_list[flidx]);

			var _this=this;
			this.afStore_list[flidx].query().then(function(response) {
				testStore.setData(response.slice(0));
				registry.byId(tbID).set("store", testStore);
			});

			if (dijit.byId(tbID)) {
				 dijit.byId( tbID).set('style', 'width:100%');
				 dijit.byId(  tbID).set('store', testStore);

				 this.own(on(dijit.byId( tbID), 'keyup', lang.hitch(this, function (evt) {
					 if (evt.keyCode === keys.ENTER) _this.doSearch();
					 if(dojo.byId( tbID).value.length > _this.queries[qryidx].minChars )
												dijit.byId(tbID).set("store", _this.afStore_list[flidx]);

					 if(dojo.byId( tbID).value.length <= _this.queries[qryidx].minChars )
							dijit.byId(tbID).set("store",testStore);
				 })));
		   }
 		}
        ,changeSearchForm:function(evt){
			this.clearSearch();
			var SearchPane  = registry.byId("psearchForm");
			var selForm=evt.target.value;
            var frmObj=null;
            this.activeMenu=selForm;

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

            //console.log("qJsonObj to json",dojo.toJson(qJsonObj,true));

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

			var prcob=registry.byId(prcID);
 			if (actntype == "pc_zoom") {
               topic.publish('InitZoomer/ZoomParcel', {
			 		 pin:pcObj.pin
               });
			} else if (actntype == "pc_fulldet") {

			} else if (actntype == "pc_mindet") {
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

			console.log("showResults",results);

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
			   this.addPRC_Min(pobj[0].pin);
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
							 var ownr=prcob.owner.trim();
							 var addrr=prcob.address.trim();
							 var hmstd=prcob.homestead.trim();

							 var pcObj={
								 pin:pin,
								 owner:ownr,
								 address:addrr,
								 homestead:hmstd

							 };
							 _this.handlePRCevent(actntype,pcObj,this.id);
						 }
					 }
				 });
				 tprc.startup();
				 tprc.placeAt(srd);
			 }
		}
		,PclCardClck: function(){

		}
		,clearSearch: function(){
           var dobj=dijit.byId("pane1").domNode;
           var iboxes=dobj.getElementsByTagName('input');
           for (var i=0;i<iboxes.length;i++){
			    if (iboxes[i].type=="text"){
                    iboxes[i].value="";
				}
		   }
		}
	});
});