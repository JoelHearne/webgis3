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
	'dijit/form/DateTextBox',
	'dojo/store/Cache', 'dojo/store/JsonRest',
	'./prc',
	'./prcmin',
	//'dojo/_base/Color',
	"esri/Color",
	'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/graphicsUtils',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/PictureMarkerSymbol',
	 "esri/geometry/Geometry",
	'esri/geometry/Point',
	"esri/geometry/Polygon",
	"esri/geometry/Polyline",
	'esri/SpatialReference',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	   'esri/toolbars/draw',
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
,DateTextBox
,Cache,JsonRest
,prc
,prcmin
,Color
,GraphicsLayer
,Graphic
,graphicsUtils
,SimpleRenderer
,PictureMarkerSymbol
,Geometry
,Point
,Polygon
,Polyline
,SpatialReference
,SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Draw, graphicsUtils, FindTask, FindParameters,QueryTask,Query, Extent,IdentifyTask, IdentifyParameters,InfoTemplate

) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Okaloosa County Property Search',
		html: '<a href="#">Property Search</a>',
		domTarget: 'propertyDijit',
		draggable: true,
		baseClass: 'propertyDijit',
		//property_mapsrvc:'http://gisvm101:6080/arcgis/rest/services/IGIS/MapServer',
		//parcel_lyrid:11,
		//pin_field:"PATPCL_PIN",
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
		polylineGraphics:null,
		polygonGraphics:null,
		pointSymbol:null,
		polylineSymbol:null,
        polygonsymbol:null,
		mapSearchMode:"none", // none,point,box,polygon,polyline
		mapSearchGeomPts:[],
		qryPolyGeom:null,
		qryPlineGeom:null,
		qryPtGeom:null,

		drawToolbar: null,
		qryTask:null,
		qry:null,
		pinlist:[],
		savedlist:[],
		qObj:null,

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
            /*this.parentWidget.show().then(function () {
				dojo.style(this.parentWidget.domNode, 'top', "0px");
				dojo.style(this.parentWidget.domNode, 'left', "8px");
			});
			*/

            this.parentWidget.show() ;

            /*var offst_left=document.body.clientWidth - this.parentWidget.domNode.offsetWidth -5;
            //this.parentWidget.set('style', 'left:' + offst_left + 'px !important;top;-300px !important;position:absolute');


			  Style.set(this.parentWidget, "left",offst_left + 'px');

			  dom.byId("property_parent").set('style', 'left:' + offst_left + 'px !important;top;-300px !important;position:absolute');
			  */

            //domStyle.set(this.parentWidget, "left", "900px");
            //this.parentWidget.set('style', 'left:0px !important;top;0px !important;position:absolute');


            this.drawToolbar = new Draw(this.map);
            this.drawToolbar.on('draw-end', lang.hitch(this, 'onDrawToolbarDrawEnd'));


            this.createGraphicsLayer();
            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));


            this.qObj={
			    querytype:'',
			    queryvalue:'',
			    rec_count:0,
			    startrec:0,
			    endrec:0,
			    qsaleObj:null
			};


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

            var offst_left=document.body.clientWidth - this.parentWidget.domNode.offsetWidth -5;
            this.parentWidget.set('style', 'left:' + offst_left + 'px !important;top:42px !important;position:absolute');


			return this.pshowAtStartup;
        }
        ,createGraphicsLayer: function () {

			 //this.pointSymbol = new PictureMarkerSymbol(require.toUrl('gis/dijit/StreetView/images/blueArrow.png'), 30, 30);
			 this.pointSymbol = new  SimpleMarkerSymbol().setStyle( SimpleMarkerSymbol.STYLE_SQUARE).setColor(new Color([2 ,1,281,0.5]));
			 this.polylineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([2 , 1, 181,0.5]), 3);
			 //this.polylineSymbol = new SimpleLineSymbol.setStyle(SimpleLineSymbol.STYLE_DASH).setColor(new Color([255, 0, 0]), 1);
			 this.polygonsymbol = new  SimpleFillSymbol().setColor(new  Color([2 , 1 , 181,0.5]));

			 this.pointGraphics = new GraphicsLayer({
				id: 'parcel_graphics',
				title: 'Parcel Search'
			 });
			 var pointRenderer = new SimpleRenderer( this.pointSymbol);
			 pointRenderer.label = 'Parcel View';
			 pointRenderer.description = 'Parcel View';
			 this.pointGraphics.setRenderer(pointRenderer);
			 this.map.addLayer(this.pointGraphics);
			 this.pointGraphics.show();

			 this.polygonGraphics = this.map.getLayer("findGraphics_pgon");
			 if (!this.polygonGraphics) this.polygonGraphics = new GraphicsLayer({ id: 'findGraphics_pgon', title: 'Find Graphics' });

			 var polygonrenderer = new  SimpleRenderer(this.polygonsymbol);
			 this.polygonGraphics.setRenderer(polygonrenderer);
			 this.map.addLayer(this.polygonGraphics);
			 this.polygonGraphics.show();
			 this.qryPolyGeom = new  Polygon( this.map.spatialReference);

             this.polylineGraphics = this.map.getLayer("findGraphics_pline");
             if (!this.polylineGraphics)   this.polylineGraphics = new GraphicsLayer({ id: 'findGraphics_pline', title: 'Draw Graphics' });

             var polylineRenderer = new SimpleRenderer(this.polylineSymbol);
             //polylineRenderer.label = 'User drawn lines';
             //polylineRenderer.description = 'User drawn lines';
             this.polylineGraphics.setRenderer(polylineRenderer);
             this.map.addLayer(this.polylineGraphics);
             this.polylineGraphics.show();

             this.qryPlineGeom = new  Polyline( this.map.spatialReference);

             this.qryPtGeom=new Point( this.map.spatialReference);

             //console.log("polyline  ",  " ",polylineRenderer, "  ",this.polylineGraphics);

		},
        onDrawToolbarDrawEnd: function (evt) {
            this.drawToolbar.deactivate();
            var graphic;
            switch (evt.geometry.type) {
                case 'point':
                    graphic = new Graphic(evt.geometry);
                    this.pointGraphics.add(graphic);
                    this.qryPtGeom=evt.geometry;
                    break;
                case 'polyline':
                    graphic = new Graphic(evt.geometry);
                    graphic.setSymbol(this.polylineSymbol);
                    this.polylineGraphics.add(graphic);
                    this.qryPlineGeom=evt.geometry;
                    break;
                case 'polygon':

                    //graphic = new Graphic(evt.geometry, null, {
                    //    ren: 1
                    //});

                    graphic = new Graphic(evt.geometry );

                    graphic.setSymbol(this.polygonsymbol);
                    this.polygonGraphics.add(graphic);
                    this.qryPolyGeom=evt.geometry;
                    break;
                default:
            }
            this.connectMapClick();
        }
		, setMapClickMode: function (mode) {
			this.mapClickMode = mode;
		}

		, modePoint: function (e) {
			this.disconnectMapClick();
			this.mapSearchMode='point';
            this.drawToolbar.activate(Draw.POINT);
		}
		, modePolygon: function (e) {
			this.disconnectMapClick();
			this.mapSearchMode='polygon';
			this.drawToolbar.activate(Draw.POLYGON);
 		}
		, modePolyline: function (e) {
			this.disconnectMapClick();
			this.mapSearchMode='polyline';
			this.drawToolbar.activate(Draw.POLYLINE);
		}
		,modeFreehandLine: function () {
		    this.disconnectMapClick();
		    this.mapSearchMode='polyline';
		    this.drawToolbar.activate(Draw.FREEHAND_POLYLINE);

        }
        ,modeFreehandPolygon: function () {
            this.disconnectMapClick();
            this.mapSearchMode='polygon';
            this.drawToolbar.activate(Draw.FREEHAND_POLYGON);

        }

		, disconnectMapClick: function () {
			this.map.setMapCursor('crosshair');
			//topic.publish('mapClickMode/setCurrent', 'propert_mapselect');
			topic.publish('mapClickMode/setCurrent', 'draw');

		}
		, connectMapClick: function () {
			this.map.setMapCursor('auto');
			topic.publish('mapClickMode/setDefault');
		}
		, clearGraphics: function () {
			this.pointGraphics.clear();
			this.polygonGraphics.clear();
			this.polylineGraphics.clear();

			this.mapSearchGeomPts=[];
			try {
              //this.qryPolyGeom.removeRing(0);
		    } catch (exc){

		    }
		    this.qryPolyGeom=new  Polyline( this.map.spatialReference);
		    this.qryPlineGeom=new  Polyline( this.map.spatialReference);
		    this.qryPtGeom=new Point( this.map.spatialReference);
		}
		,runMapSearch:function(){
			   var qry_gm;
			   if (this.mapSearchMode=='point') {
                    //qry_gm=esri.getGeometries(this.pointGraphics.graphics);
                    qry_gm=this.qryPtGeom;
			   } else if (this.mapSearchMode=='polyline') {
				    //qry_gm=esri.getGeometries(this.polylineGraphics.graphics);
				    qry_gm=this.qryPlineGeom;
			   } else if (this.mapSearchMode=='polygon') {
				    //qry_gm=esri.getGeometries(this.polygonGraphics.graphics);
				    qry_gm=this.qryPolyGeom;
		       }
		       //console.log("runMapSearch",qry_gm);
		       this.connectMapClick();
		       this.mapSearch(qry_gm);
		}
		,mapSearch: function(geom){
				var q_url=this.property_mapsrvc + "/" + this.parcel_lyrid;
				this.qry = new  Query();
				//query.where = "STATE_NAME = 'Washington'";
				//query.outSpatialReference = {wkid:102100};
				//this.qry.geometry = geom[0];
				this.qry.geometry = geom;
				this.qry.outSpatialReference =  this.map.spatialReference ;
				this.qry.returnGeometry = true;
				this.qry.outFields = [this.pin_field];
				this.qryTask=new QueryTask(q_url);
				this.clearGraphics();
				//this.qryTask.execute(this.qry, this.mapqRes  );
				this.qryTask.execute(this.qry, lang.hitch(this, 'mapqRes') );
		}
		,mapqRes: function(results) {
			//console.log("mapqRes");
			//console.log("mapqRes",results);
			//this.clearGraphics();
			var _this=this;
            var zoomExtent = null;
            // var infoTemplate = new InfoTemplate("Parcel Info", "<table><tr><td>PIN: </td><td>${PARCEL ID}</td></tr><tr><td>Owner: </td><td>${OWNER}</td></tr></table>");
            var feats=[];
            var pins=[];
			array.forEach( results.features, function (feature) {
				  var graphic;
                  //feature.setInfoTemplate(infoTemplate);
				  feats.push(feature);
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

								graphic.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
											 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
											 new Color([0, 0, 235]), 3), new Color([0, 10, 205, 0.15])));
                                 console.log(" ...mapqRes 4.7" );
							     console.log(" ...mapqRes 4.8 \r\n .....",_this.polygonGraphics ," \r\n .....",graphic );
							     _this.polygonGraphics.add(graphic);
							     console.log(" ...mapqRes 5" );
								//_this.pointGraphics.add(graphic);

							}
							break;
						default:
				  }
				  if ( _this.polygonGraphics.graphics.length > 0) {
						if (zoomExtent === null) {
							zoomExtent = graphicsUtils.graphicsExtent(_this.polygonGraphics.graphics);
						} else {
							zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(_this.polygonGraphics.graphics));
						}
				  }
			}); // end array.forEach

			if (zoomExtent)  this.map.setExtent(zoomExtent.expand(5.2));
			this.doSearch_Pins(pins);

           // Show info popup
		   //var mapPoint = zoomExtent.getCenter();
		   //this.map.infoWindow.setContent('<div class="loading"></div>');
           //this.map.infoWindow.setFeatures(feats);
           //this.map.infoWindow.show(mapPoint);
		}
		,doSearch_Pins: function(pins){



            var iurl = 'WebGIS.asmx/PropertyQueryPaged?searchtype=pin_list&searchString=' + pins.join() + '&startrec=1&endrec=50';
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
		,activateMapSearch: function(){
			//this.createGraphicsLayer();
			//this.map.on('click', lang.hitch(this, 'mapClickHandler'));
			this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));
			this.disconnectMapClick();
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
					pageSize: 30,
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
           //document.getElementById("pPageSelDiv").style.visibility="hidden";
            document.getElementById("pResCount").innerHTML='';

		   this.btnZoomAll.domNode.style.display="none";
		   this.btnPrLbls.domNode.style.display="none";
		   document.getElementById("pPageSelDiv").style.display="none";

		   var srd=dom.byId("pSearchResults");
		   if (srd) {
			   var img = dojo.doc.createElement('img');
				dojo.attr(img, {
					id:"waitimg",
					src: "images/ajax-loader2.gif",
					alt: "Please Standbye while I search",
					style: {float: "center", border:"5px",padding:"50px",margin:"80px"}
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

			//console.log("doSearch",this.activeMenu);

            domConstruct.empty("pSearchResults");
            domConstruct.empty("pcMinDet");


            this.showWait();

            if (this.activeMenu=='map') {
                this.runMapSearch();
				return;
			}

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
                 stype="salesdata";
                 iurl = this.prepSalesDataURL(startrec,endrec);
			}
            this.qObj={
			    querytype:'',
			    queryvalue:'',
			    rec_count:0,
			    startrec:0,
			    endrec:0,
			    qsaleObj:null
			};
			this.qObj.querytype=stype;
			this.qObj.queryvalue=sval;
			this.qObj.startrec=startrec;
			this.qObj.endrec=endrec;

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


			//console.log("tbSlDateFrom",this.tbSlDateFrom.value)

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

			var prcob=registry.byId(prcID);
 			if (actntype == "pc_zoom") {
               topic.publish('InitZoomer/ZoomParcel', {
			 		 pin:pcObj.pin
               });
			} else if (actntype == "pc_fulldet") {
				this.Open_PRCFull(pcObj.pin);

			} else if (actntype == "pc_mindet") {
				this.addPRC_Min(pcObj.pin);
			} else if (actntype == "pc_save") {
				this.addPRC2Saved(pcObj,prcID);
			} else if (actntype == "pc_delete") {
				this.DelPRCSaved(pcObj,prcID);
			} else if (actntype == "pc_print") {
				this.GetPrintMap(pcObj.pin);

			}
		}
		,DelPRCSaved:function(pcObj,widgetID){
			console.log("DelPRCSaved ",pcObj,widgetID);
             //var srd=dom.byId("pSearchSaved");
			 var prcob=registry.byId(widgetID);
			 console.log("    prcob ",prcob);
			 domConstruct.destroy(prcob.domNode);

			 var i = this.savedlist.indexOf(pcObj.pin);
			 if(i != -1) {
				this.savedlist.splice(i, 1);
			 }

			 if (this.savedlist.length==0){
			   this.btnSavedZoomAll.domNode.style.display="none";
			   this.btnSavedPrLbls.domNode.style.display="none";
			 }

		}
		,addPRC2Saved:function(pcObj,widgetID){

			 this.btnSavedZoomAll.domNode.style.display="block";
			 this.btnSavedPrLbls.domNode.style.display="block";

			 var _this=this;
             var srd=dom.byId("pSearchSaved");
			 var prcob=registry.byId(widgetID);

			 var tprc =new prc(
			    {
						   pin: pcObj.pin,
						   owner: pcObj.owner,
						   address: pcObj.addr,
						   homestead:pcObj.hstead,
						   res_type:"saved"
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
			     if  (actntype == "pc_save")   {
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
						 _this.handlePRCevent("pc_delete",pcObj,this.id);
				    }
				 }

		      });
			  tprc.startup();
			  tprc.saveMe();
			  tprc.placeAt(srd);


			  this.savedlist.push(pcObj.pin);

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

			    this.btnZoomAll.domNode.style.display="block";
			    this.btnPrLbls.domNode.style.display="block";
				// build paging control
				if (dobj.rec_count > 50) {
					//document.getElementById("pPageSelDiv").style.visibility="visible";
					document.getElementById("pPageSelDiv").style.display="block";

					pgcnt = Math.ceil(dobj.rec_count / 50);

					if (dobj.start_rec > 50) rec_page = Math.ceil(dobj.start_rec / 50);

					for (var p = 0; p < pgcnt; p++) {
						select.options[select.options.length]=new Option(p + 1);
					}
				} else {
					// hide the page selection box pPageSelDiv
					//var psdv = dom.byId("pPageSelDiv");
					//document.getElementById("pPageSelDiv").style.visibility="hidden";
					document.getElementById("pPageSelDiv").style.display="none";

				}
				if (dobj.rec_count > 50) select.selectedIndex = rec_page-1;
		   } else {  // no results
			   	this.btnZoomAll.domNode.style.display="none";
			    this.btnPrLbls.domNode.style.display="none";
			    document.getElementById("pPageSelDiv").style.display="none";


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

			console.log("showResults",this.btnZoomAll.domNode,results);



			 this.hideWait();
             var _this=this;
             var srd=dom.byId("pSearchResults");
			 var dlgcont = "";
			 var dobj=results;
			 var pobj = results.ps_res;

			 domConstruct.empty("pSearchResults");
             domConstruct.empty("pcMinDet");
             domConstruct.empty("pResCount");

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


            if (dobj.rec_count) this.qObj.rec_count=dobj.rec_count;

		    this.pinlist=[];

			for (var i = 0; i < pobj.length; i++) {

				 pobj[i].pin=pobj[i].pin.trim();
				 pobj[i].owner= pobj[i].owner.trim();
				 pobj[i].addr= pobj[i].addr.trim();
				 pobj[i].hstead=pobj[i].hstead.trim();


				 this.pinlist.push(pobj[i].pin);

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
		,Open_PRCFull:function(pin){
			var puw=window.open( 'prc_full/prc.php?cl=paqry&pin=' + pin,"prcfull");
			if (window.focus) {puw.focus()}
		}
		,printMailLbls: function(){
            var iurl='./pa.asmx/PrintMailingLabels?search_type=' + this.qObj.querytype + '&search_string=' + this.qObj.queryvalue
            request.get(iurl,{ handleAs: "text" }).then(
                function (text){
                     window.open( text,"prcprint");

 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
		}
		,printMailLblsSaved: function(){
			//savedlist
            var iurl='./pa.asmx/PrintMailingLabels?search_type=pinlist&search_string=' + this.savedlist.join(",");
            request.get(iurl,{ handleAs: "text" }).then(
                function (text){
                     window.open( text,"prcprint");

 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
		}
		,GetPrintMap:function(pin){
            var _this=this;
            var iurl='./pa.asmx/GetPrintMap?pin=' + pin;
            request.get(iurl,{ handleAs: "text" }).then(

                function (text){
                     window.open( text,"prcprint");

 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
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

			 domConstruct.empty("pSearchResults");
             domConstruct.empty("pcMinDet");
             domConstruct.empty("pResCount");
             document.getElementById("pPageSelDiv").style.visibility="hidden";

		}
		,zoomAllListSaved:function() {
			    var whereclause=this.pin_field + "='" + this.savedlist.join("' OR " + this.pin_field + "='") + "'";
				var q_url=this.property_mapsrvc + "/" + this.parcel_lyrid;
				this.qry = new  Query();
				this.qry.where = whereclause;
				this.qry.outSpatialReference =  this.map.spatialReference ;
				this.qry.returnGeometry = true;
				this.qry.outFields = [this.pin_field];
				this.qryTask=new QueryTask(q_url);
				this.clearGraphics();
				this.qryTask.execute(this.qry, lang.hitch(this, 'mapqRes') );
		}
		,zoomAllList:function() {

			//console.profile();
			    var whereclause=this.pin_field + "='" + this.pinlist.join("' OR " + this.pin_field + "='") + "'";

				var q_url=this.property_mapsrvc + "/" + this.parcel_lyrid;
				this.qry = new  Query();
				this.qry.where = whereclause;
				//this.qry.geometry = geom[0];
				this.qry.outSpatialReference =  this.map.spatialReference ;
				this.qry.returnGeometry = true;
				this.qry.outFields = [this.pin_field];
				this.qryTask=new QueryTask(q_url);
				this.clearGraphics();
 				//this.qryTask.execute(this.qry, this.mapqRes  );
				this.qryTask.execute(this.qry, lang.hitch(this, 'mapqRes') );
		}
		,zoomAll:function() {
			// this will zoom to all of the records returned by the current query
			//  large result sets can easily bog down the client and AGS server.
			//  This approach attempts to cut out the RDBMS query step and mirror
			//  the SQL Server query on the parcel layer.

			// TODO: !!IDEA - Build an SDE spatial view that joins parcels with Central_GIS
			    var whereclause="";

			    console.log("this.qObj",this.qObj);

			    if (this.qObj.querytype=="address") {
					whereclause="PATPCL_ADDR1 like '" + this.qObj.queryvalue + "%'";
				} else if (this.qObj.querytype=="owner") {
					whereclause="PATPCL_OWNER like '" + this.qObj.queryvalue + "%'";
				} else if (this.qObj.querytype=="pin") {
					whereclause="PATPCL_PIN like '" + this.qObj.queryvalue + "%'";
				} else if (this.qObj.querytype=="bus") {

				} else if (this.qObj.querytype=="sub") {

				} else if (this.qObj.querytype=="saleslist") {

				} else if (this.qObj.querytype=="salesdata") {

				}

                if (whereclause!="") {
					var q_url=this.property_mapsrvc + "/" + this.parcel_lyrid;
					this.qry = new  Query();
					this.qry.where = whereclause;
					//this.qry.geometry = geom[0];
					this.qry.outSpatialReference =  this.map.spatialReference ;
					this.qry.returnGeometry = true;
					this.qry.outFields = [this.pin_field];
					this.qryTask=new QueryTask(q_url);
					this.clearGraphics();
					//this.qryTask.execute(this.qry, this.mapqRes  );
					this.qryTask.execute(this.qry, lang.hitch(this, 'mapqRes') );
					//console.profileEnd();
			  }



		},
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }
	});
});