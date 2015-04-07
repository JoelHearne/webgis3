//define.amd.jQuery = true;
define([
	'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'gis/dijit/_FloatingWidgetMixin',
    "dijit/Dialog",
    'dojo/dom-construct',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/dom',
    'dojo/dom-style',
    "dojo/query",
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
	'dojo/store/Cache'
	,'dojo/store/JsonRest',
	'put-selector',
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
    "esri/geometry/normalizeUtils",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",
    "esri/dijit/Legend",
	'esri/InfoTemplate',
	 "dojox/layout/ResizeHandle",
	'./LayerControl',
	//'dojo/i18n!./property/nls/resource',
	'xstyle/css!./property/css/property.css'
	//,'xstyle/css!./property/css/adw-icons.css'
	,"dojo/NodeList-traverse"
	//,"./NodeList-walk"  // !!! your NodeList-walk module
	  ,'dojo/domReady!'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin,Dialog, domConstruct, on, lang
,dom,Style,query,request,script,ready,parser,registry,topic,number,aspect,keys,Memory,template,Button,TabContainer,ContentPane,ToggleButton,CheckBox,DropDownButton,ComboBox,TooltipDialog,Form,array
,ioQuery,functional,JSON,cookie,parser,FilteringSelect,validationtextBox,DateTextBox,Cache,JsonRest,put,prc,prcmin,Color,GraphicsLayer,Graphic,graphicsUtils,SimpleRenderer,PictureMarkerSymbol,Geometry
,Point,Polygon,Polyline,SpatialReference,SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Draw, graphicsUtils, FindTask, FindParameters,QueryTask,Query, Extent,IdentifyTask
, IdentifyParameters, normalizeUtils, GeometryService, BufferParameters,Legend,InfoTemplate,ResizeHandle,LayerControl
//, i18n
) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'WebGIS Main Menu',
		html: '<a href="#">Main Menu</a>',
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
		//mapSearchGeomPts:[],
		qryPolyGeom:null,
		qryPlineGeom:null,
		qryPtGeom:null,

		drawToolbar: null,
		qryTask:null,
		qry:null,
		pinlist:[],
		mapsearchpins:[],
		savedlist:[],
		qObj:null,
		export_dia:null,
	    ptmrStrt:null,
	    mapsearch_auto:false,
	    isAutoFl:false,
	    legendDijit:null,
	    printPIN:null,
	    pResultsSubTabs:null,
	    btnZoomAll:null,
	    btnPrLbls:null,
	    //pSearchResults:null,

		postCreate: function () {
			this.inherited(arguments);
			//this.ptmrStrt= performance.now();

            var _this=this;
			this.parentWidget.draggable = this.draggable;
			this.parentWidget.resizable=true;

			if (this.parentWidget.toggleable) {
				this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
					    this.propctrNode.resize();
					    this.containerNode.resize();
				})));
			} else {

				var help = domConstruct.place(this.html, this.domTarget);
				//on(help, 'click', lang.hitch(this.parentWidget, 'show'));
				on(help, 'click', lang.hitch(this , 'showThis'));
				//on(help, 'click',  this.showThis );
			}

			window.addEventListener('resize', function(event){
                //console.log("window resized ",event);z
               // _this.resizeContents();
               _this.fixWidth();
			});


			//on(document, "keyup", function(event) {
			//	_this.fixLayout(event.keyCode);
			//});


            //this.parentWidget.show() ;
            this.drawToolbar = new Draw(this.map,{showTooltips: false});
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

			// listen for topic broadcasts
			topic.subscribe('property/showSpatial', lang.hitch(this, function (arg) {
			  if (!_this.parentWidget.open) _this.showThis();
			  dijit.byId("pSearchTabs").selectChild(dijit.byId("pSearchTab"));
			  _this.changeSearchForm(null,"map");

			}));

			topic.subscribe('property/toggleSpatial', lang.hitch(this, function (arg) {
				//console.log("property/toggleSpatial",arg);
				_this.external_setMapSrchMode(arg.mode,arg.state);
			}));
			topic.subscribe('property/clearSpatial', lang.hitch(this, function (arg) {
				//console.log("property/clearSpatial",arg);
				_this.clearGraphics();
			}));
			topic.subscribe('property/searchSpatial', lang.hitch(this, function (arg) {
				//console.log("property/searchSpatial",arg);
				_this.external_SelSpatial(arg.geometry);
			}));
			topic.subscribe('property/searchPINs', lang.hitch(this, function (arg) {
				 //console.log("property/searchPINs",arg);
				_this.external_SelPINs(arg.pins);
			}));
           /*
		    topic.subscribe('property/external_search',  lang.hitch(this, function (arg) {
				 console.log("property/external_search request received",arg);

				 // set textbox values
				 if (arg.searchtype=="address"){
					 _this.searchAddr.value=arg.searchvalue;
					 _this.showThis();
					 _this.doSearch();
				 }
		    }));
		    */




			 /// Add Legend widget
			 /*
			 this.map.on("layers-add-result", function (evt) {  // not firing off ..probably because map has already loaded
						 console.log("property fired layers-add-result",evt);
						var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
						  return {layer:layer.layer, title:layer.layer.name};
						});

						console.log("property fired layers-add-result  ....",layerInfo);
						if (layerInfo.length > 0) {
						  var legendDijit = new Legend({
							map: this.map,
							layerInfos: layerInfo
						  }, "pLegendTabCnt");
						  legendDijit.startup();
						}
			 });
			 */
		    /////////END  Add Legend widget   ///



		}
		,startup: function() {
			this.inherited(arguments);
			var _this=this;

			//console.clear();

			/*
			this.setautofill("tbAddr");
			//this.setautofill("tbOwner");
			this.setautofill("tbPIN");
			this.setautofill("tbBus");
			this.setautofill("tbSub");
			//this.setautofill("tbSalesList");
			//this.setautofill("tbSalesData");
			*/

		    // handle results pager
		    /*
		    var sp = document.getElementById("selResPage");
		    if (sp.addEventListener) {
				 sp.addEventListener("change",
				   function(e){
					   _this.resPage=e.target.selectedIndex+1;

                       if (_this.activeMenu=='map') {
						   _this.doSearch_Pins(_this.mapsearchpins);
					   } else {
					       _this.doSearch();
					   }

				   }, false);
			} else {
				 sp.attachEvent('change',  function(e){
					   _this.resPage=e.target.selectedIndex+1;
					   //_this.doSearch();
                       if (_this.activeMenu=='map') {
						   _this.doSearch_Pins(_this.mapsearchpins);
					   } else {
					       _this.doSearch();
					   }
				   }) ;
			}
			*/

			// handle sales list year selection change
			var dc = document.getElementById("selSaleListYear");
			if (dc.addEventListener) {
				dc.addEventListener("change",  this.salesListYearChange, false);
			} else {
				dc.attachEvent('change',  this.salesListYearChange)  ;
			}

            //var offst_left=document.body.clientWidth - this.parentWidget.domNode.offsetWidth -5;
			//this.parentWidget.set('style', 'left:' + offst_left + 'px;top:42px');

           /* if (performance && ptmrSt != null) {
				 var ptmrEnd = performance.now();
				 //console.log(" property widget load perftime from page init.... ",(ptmrEnd-ptmrSt)," ms");
				 //console.log(" property widget load perftime from widget init.... ",(ptmrEnd-this.ptmrStrt)," ms");
		    }
		    */


            /// Add LayerControls widget (TOC)
            var lcOptions={
				id:"layerControl_widget"
				,layerControlLayerInfos:true
				,layerInfos:this.layerInfos
				,map:this.map
				,overlayReorder:true
				,parentWidget:dijit.byId("pLayersTabCnt")
				,seperated:true
				,vectorReorder:true

			};
            //var lyrctrl= new WidgetClass(lcOptions, put('div')).placeAt(dijit.byId("pLayersTabCnt").containerNode);
		     //var lyrctrl=new LayerControl(lcOptions, put('div')).placeAt(dijit.byId("pLayersTabCnt").containerNode);
		    var lyrctrl=new LayerControl(lcOptions, put('div')).placeAt(dijit.byId("pLayersTabCnt") );
		    lyrctrl.startup();

		    //lyrctrl.placeAt(dijit.byId("pLayersTabCnt"));
		    /////////END   Add LayerControls widget (TOC) ///


			// Legend Widget
            //console.log("property:this.legendLayerInfos",this.layerInfos,this.legendLayerInfos.length);
		    if (this.layerInfos.length > 0) {
			  this.legendDijit = new Legend({
				map: this.map,
				layerInfos: this.layerInfos
			  }, "pLegendDiv");
			  this.legendDijit.placeAt(dijit.byId("pLegendTabCnt") );
			  this.legendDijit.startup();
		    }


			this.map.on('update-end', function (layer) {
				 _this.legendDijit.refresh();
			});

			//console.log("property ",this.parentWidget);

		    var rsz=new  ResizeHandle ({
			   targetId: this.parentWidget,
			   minWidth:305
			   ,minHeight:250
			   //,resizeAxis:"y"
			}).placeAt("propSrchActnBar");
			//closeBtn propSrchActnBar
			rsz.startup();

			dojo.subscribe("/dojo/resize/stop", function(inst){
			   // inst.targetDomNode is the node resized. sometimes there will be a inst.targetWidget. inst is the ResizeHandle instance.
 					 //_this.propctrNode.resize();
					 //_this.parentWidget.resize();
					//lang.hitch(_this, 'resizeContents')
					 _this.resizeContents();
					//propertyDijitC propertyNode pSearchTabs
			});

			//dijit.byId("propertyNode").set('style', 'width:350px;');



			// handle querystring search
			 var query = document.location.search.substring(document.location.search.indexOf("?") + 1, document.location.search.length);
			 var qo = dojo.queryToObject(query);
			 if (qo.searchtype) {
				 if (qo.searchtype=="address"){
					 //console.log("this.searchAddr",this.searchAddr);

					 this.showThis();
					 //this.searchAddr.textbox.value=qo.searchvalue;
					 document.getElementById("af_tbAddr").value=qo.searchvalue;
					 //registry.byId("af_tbAddr").textbox.value=qo.searchvalue;
					 this.doSearch();
				 }
			 }

			  on(document, "keypress", function(evt){
				//console.log("keyed",evt  );


              var charCode = evt.which || evt.keyCode;
               var charStr = String.fromCharCode(charCode);


                switch(charStr){
				  case "r":
				    _this.resizeContents();
					break;
				  case "t":
				     _this.fixWidth();
					break;

 				 }

			  });

			//this.resizeContents();
 			 return this.pshowAtStartup;
        }
        ,fixWidth:function(){

			var actbr=dom.byId("propSrchActnBar");
			var ab_owd=actbr.offsetWidth ;

			if (ab_owd <=280) {
				var tcpc= dojo.query(".dijitDialogTitleBar",this.parentWidget.domNode);

				tcpc.forEach(function(node){
				}).style("width", "350px");

				tcpc= dojo.query(".dijitDialogPaneContent",this.parentWidget.domNode);
				tcpc.forEach(function(node){
				}).style("width", "350px");

				tcpc= dojo.query(".propertyNode",this.parentWidget.domNode);
				tcpc.forEach(function(node){
				}).style("width", "350px");

				this.propctrNode.resize();

				this.parentWidget.set('style', 'width:350px');
				this.parentWidget.resize();
		  }

		}
        ,resizeContents:function(){

		    var actbr=dom.byId("propSrchActnBar");
		    var ab_ohgt=actbr.offsetHeight + 28;
			var psr=document.getElementById("pSearchResults");
			var zd=document.getElementById("pZmDv");
		    var ab_owd=actbr.offsetWidth ;
            var  tbs=registry.byId("pSearchTabs");
			var subtbs=registry.byId("pResultsSubTabs");
			var pcmin=document.getElementById("pcMinDet");

	        var rlt=dijit.byId("pResultListTab");
		    var pnd=document.getElementById("property_widget");


			 var parntcn_hgt=this.parentWidget.domNode.offsetHeight-ab_ohgt ;

			//Style.set(this.pTestTab  , 'height', (parntcn_hgt) + "px");
			//Style.set(this.pTestCnt , 'height', (parntcn_hgt) + "px");
			Style.set(this.pSearchTabs  , 'height', (parntcn_hgt) + "px");
			//Style.set(this.pTestTab.containerNode  , 'height', (parntcn_hgt) + "px");

			//this.pTestTab.resize();

			var tcpa2=dojo.query(".dijitTabContainerTop-container",this.parentWidget.domNode);

			//console.dir(tcpa2);

			tcpa2.forEach(function(node){
				  //console.log("tab container node",node );
				  //node.style("height", (parntcn_hgt ) + "px");

			  }).style("height", (parntcn_hgt ) + "px");

			var tcpc=dojo.query(".propertyTabContainer",this.parentWidget.domNode);

			//console.dir(tcpa);

			tcpc.forEach(function(node){
				  //console.log("tab container node",node );
				   //node.style("height", (parntcn_hgt-8) + "px");

			  }).style("height", (parntcn_hgt ) + "px");

			 this.propctrNode.resize();


              if ((psr && psr!=null) ) {
				   psr.style.setProperty("width", ab_owd-3 + 'px', "important");

			  }
			 if ((psr && psr!=null) && (zd && zd!=null)) {

			  // var psr_calch=actbr.offsetTop - psr.offsetTop - zd.offsetTop-21;
			   //var psr_calch=actbr.offsetTop - psr.offsetTop ;
			   var psr_calch=actbr.offsetTop - zd.offsetTop -psr.offsetTop;

			   //console.log("resizing pSearch Results",psr_calch,actbr.offsetTop,actbr.offsetHeight , psr.offsetTop, psr.offsetHeight , zd.offsetTop,psr);
			   //psr.style.height=psr_calch ;
			   //psr.setAttribute('style', psr_calch + "px !important");
			   psr.style.setProperty("height", psr_calch + 'px', "important");
			   //this.parentWidget.resize();

		     }

		     var md=document.getElementById("pcMinDet");
			 if ((md && md!=null)) {
			   var md_calch=actbr.offsetTop - md.offsetTop-31;
			   md.style.height=md_calch+"px";
		     }

		     this.propctrNode.resize();
		     if (subtbs) subtbs.resize();
		     if (tbs) tbs.resize();

             if ((psr && psr!=null) ) {
				  var calc_ht=(actbr.offsetTop-psr.offsetTop)-zd.offsetHeight-zd.offsetTop-document.getElementById("propertyNode").offsetTop;
				  psr.style.setProperty("height", calc_ht + 'px', "important");
				  //odocument.getElementById("propertyNode").style.setProperty("height", calc_ht + 'px', "important");
			 }
			 var pw=document.getElementById("property_widget");
			 if (pw)
			     pw.style.setProperty("height", pw.parentNode.offsetHeight + 'px', "important");

			 if (pcmin && (pcmin !=null)) {
				 //console.log("resizing pcmin ",pcmin);
				 var pmn_calch=(actbr.offsetTop  - pcmin.offsetTop) - actbr.offsetHeight  -document.getElementById("propertyNode").offsetTop - 37;
                 //console.log("resizing pcmin 2",pmn_calch,subtbs.domNode.offsetHeight);
			     pcmin.style.setProperty("height", pmn_calch + 'px', "important");
		     }


		}
        ,showThis:function(){
			this.parentWidget.show();
			this.pSearchTabs.resize();
			 //this.propertyDijitC.resize();
			 //this.propertyNode.resize();

			 //this.propctrNode.resize();
			 //this.parentWidget.resize();
			 //dom.byId("propertyNode").set('style', 'width:100%;height:100%');

			var offst_left=document.body.clientWidth - this.parentWidget.domNode.offsetWidth -5;
		    this.parentWidget.set('style', 'left:' + offst_left + 'px;top:42px;width:350px');
			dijit.byId("pSearchTabs").selectChild(dijit.byId("pSearchTab"));
			this.changeSearchForm(null,"property");

			this.resizeContents();

			if (!this.isAutoFl){
				this.setautofill("tbAddr");
				//this.setautofill("tbOwner");
				this.setautofill("tbPIN");
				this.setautofill("tbBus");
				this.setautofill("tbSub");
				//this.setautofill("tbSalesList");
				//this.setautofill("tbSalesData");
				this.isAutoFl=true;
		   }
		}
        ,createGraphicsLayer: function () {
			 //this.pointSymbol = new PictureMarkerSymbol(require.toUrl('gis/dijit/StreetView/images/blueArrow.png'), 30, 30);
			 this.pointSymbol = new  SimpleMarkerSymbol().setStyle( SimpleMarkerSymbol.STYLE_SQUARE).setColor(new Color([2 ,1,281,0.5]));
			 this.polylineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([2 , 1, 181,0.5]), 3);
			 //this.polylineSymbol = new SimpleLineSymbol.setStyle(SimpleLineSymbol.STYLE_DASH).setColor(new Color([255, 0, 0]), 1);
			 this.polygonsymbol = new  SimpleFillSymbol().setColor(new  Color([2 , 1 , 181,0.5]));

             this.pointGraphics = this.map.getLayer("point_graphics");
             if (!this.pointGraphics)  this.pointGraphics = new GraphicsLayer({ id: 'point_graphics', title: 'Point search' });

			 var pointRenderer = new SimpleRenderer( this.pointSymbol);
			 pointRenderer.label = 'Parcel View';
			 pointRenderer.description = 'Parcel View';
			 this.pointGraphics.setRenderer(pointRenderer);
			 this.map.addLayer(this.pointGraphics);
			 this.pointGraphics.show();

			 this.polygonGraphics = this.map.getLayer("pgon_graphics");
			 if (!this.polygonGraphics) this.polygonGraphics = new GraphicsLayer({ id: 'pgon_graphics', title: 'Polygon Search' });

			 var polygonrenderer = new  SimpleRenderer(this.polygonsymbol);
			 this.polygonGraphics.setRenderer(polygonrenderer);
			 this.map.addLayer(this.polygonGraphics);
			 this.polygonGraphics.show();

             this.polylineGraphics = this.map.getLayer("pline_graphics");
             if (!this.polylineGraphics)   this.polylineGraphics = new GraphicsLayer({ id: 'pline_graphics', title: 'Polyline Search' });

             var polylineRenderer = new SimpleRenderer(this.polylineSymbol);
             //polylineRenderer.label = 'User drawn lines';
             //polylineRenderer.description = 'User drawn lines';
             this.polylineGraphics.setRenderer(polylineRenderer);
             this.map.addLayer(this.polylineGraphics);
             this.polylineGraphics.show();

             this.qryPolyGeom = new  Polygon( this.map.spatialReference);
             this.qryPlineGeom = new  Polyline( this.map.spatialReference);
             this.qryPtGeom=new Point( this.map.spatialReference);
		},
        onDrawToolbarDrawEnd: function (evt) {
            if (!this.mapsearch_auto) this.drawToolbar.deactivate();
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
                    graphic = new Graphic(evt.geometry );
                    graphic.setSymbol(this.polygonsymbol);
                    this.polygonGraphics.add(graphic);
                    this.qryPolyGeom=evt.geometry;
                    break;
                case 'extent':
                     graphic = new Graphic(evt.geometry );
                    graphic.setSymbol(this.polygonsymbol);
                    this.polygonGraphics.add(graphic);
                    this.qryPolyGeom=evt.geometry;
                    break;
                default:
            }
            if (!this.mapsearch_auto) this.connectMapClick();

            if (this.mapsearch_auto) this.doSearch();
        }
		,setMapClickMode: function (mode) {
			this.mapClickMode = mode;
		}
		,external_SelPINs: function(pins) {
			//console.log("external_SelPINs",pins);
			if (!this.parentWidget.open) this.showThis();
            //if (!this.mapsearch_auto) this.drawToolbar.deactivate();
            this.doSearch_Pins(pins);


		}
		,external_SelSpatial: function(geometry) {
			//console.log("external_SelSpatial",geometry);
			if (!this.parentWidget.open) this.showThis();
            if (!this.mapsearch_auto) this.drawToolbar.deactivate();
            var graphic;

            //this.createResultsTab();
            //this.showWait();

            this.mapSearchMode=geometry.type;
            switch (geometry.type) {
                case 'point':
                    //graphic = new Graphic(geometry);
                    //this.pointGraphics.add(graphic);
                    this.qryPtGeom=geometry;
                    break;
                case 'polyline':
                    //graphic = new Graphic(geometry);
                    //graphic.setSymbol(this.polylineSymbol);
                    this.polylineGraphics.add(graphic);
                    this.qryPlineGeom=geometry;
                    break;
                case 'polygon':
                    //graphic = new Graphic(geometry );
                    //graphic.setSymbol(this.polygonsymbol);
                    this.polygonGraphics.add(graphic);
                    this.qryPolyGeom=geometry;
                    break;
                case 'extent':
                    //graphic = new Graphic(geometry );
                    //graphic.setSymbol(this.polygonsymbol);
                    this.polygonGraphics.add(graphic);
                    this.qryPolyGeom=geometry;
                    break;
                default:
			  }

                //if (this.mapsearch_auto)
                var prev_actmenu=this.activeMenu;
                this.activeMenu='map';
                //this.mapSearch(geometry);
                this.doSearch();
                this.activeMenu=prev_actmenu;
		}
		,external_setMapSrchMode: function(mode,state) {
			if (state) {
				// uncomment to make the map menu automatically appear
				if (!this.parentWidget.open) this.showThis();
				this.changeSearchForm(null,"map");

				this.activateMapSearch();
				this.mapsearch_auto=true;
				//this.activeMenu='map';
				if (mode=="box") {
					this.modeBox();
				} else if (mode=="point") {
					this.modePoint();
				}
		    } else {
				this.mapsearch_auto=false;
				this.drawToolbar.deactivate();
				this.clearGraphics();
				this.connectMapClick();
			}
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
		, modeBox: function (e) {
			this.disconnectMapClick();
			this.mapSearchMode='polygon';
			this.drawToolbar.activate(Draw.EXTENT);
 		}
		, disconnectMapClick: function () {
			this.map.setMapCursor('crosshair');
			topic.publish('mapClickMode/setCurrent', 'draw');
		}
		, connectMapClick: function () {
			//console.log("connectMapClick ",this.mapsearch_auto);
			this.map.setMapCursor('auto');
			topic.publish('mapClickMode/setDefault');
		}
		, clearGraphics: function () {
			this.pointGraphics.clear();
			this.polygonGraphics.clear();
			this.polylineGraphics.clear();

			//this.mapSearchGeomPts=[];

		    this.qryPolyGeom=new  Polyline( this.map.spatialReference);
		    this.qryPlineGeom=new  Polyline( this.map.spatialReference);
		    this.qryPtGeom=new Point( this.map.spatialReference);

		    //pMapBuffr.style.display="none";
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
		       //if (this.mapsearch_auto) this.mapsearch_auto="false";
		       //console.log("runMapSearch this.mapsearch_auto ",this.mapsearch_auto);
		       if (!this.mapsearch_auto) this.connectMapClick();
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
			//console.log(arguments.callee," ",results);


			// check if result count exceeded threshhold
			if (results.exceededTransferLimit) {
				// notify the user that the result count exceeds the maximum threshhold
				topic.publish('growler/growl', {
					title: 'Query Threshhold Exceeded',
					message: 'You have exceeded the allowable request size.  Not all of the results were returned.  Please try reducing your search footprint.',
					level: 'warning', //can be: 'default', 'warning', 'info', 'error', 'success'.
					timeout: 2000, //set to 0 for no timeout
					opacity: 0.8
				});
			}


			//console.log("mapqRes");
			//console.log("mapqRes",results);
			//this.clearGraphics();
			var _this=this;
            var zoomExtent = null;
            // var infoTemplate = new InfoTemplate("Parcel Info", "<table><tr><td>PIN: </td><td>${PARCEL ID}</td></tr><tr><td>Owner: </td><td>${OWNER}</td></tr></table>");
            var feats=[];
            //var pins=[];
            this.mapsearchpins=[];
			array.forEach( results.features, function (feature) {
				  var graphic;
                  //feature.setInfoTemplate(infoTemplate);
				  feats.push(feature);
				  if (feature.attributes && feature.attributes.PATPCL_PIN) {
					   _this.mapsearchpins.push(feature.attributes.PATPCL_PIN);
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
							     _this.polygonGraphics.add(graphic);
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
			this.doSearch_Pins(this.mapsearchpins);

			pMapBuffr.style.display="block";

           // Show info popup
		   //var mapPoint = zoomExtent.getCenter();
		   //this.map.infoWindow.setContent('<div class="loading"></div>');
           //this.map.infoWindow.setFeatures(feats);
           //this.map.infoWindow.show(mapPoint);
		}
		,mapqResNoQry: function(results) {
			//console.log(arguments.callee," ",results);

			// check if result count exceeded threshhold
			if (results.exceededTransferLimit) {
				// notify the user that the result count exceeds the maximum threshhold
				topic.publish('growler/growl', {
					title: 'Query Threshhold Exceeded',
					message: 'You have exceeded the allowable request size.  Not all of the results were returned.  Please try reducing your search footprint.',
					level: 'warning', //can be: 'default', 'warning', 'info', 'error', 'success'.
					timeout: 2000, //set to 0 for no timeout
					opacity: 0.8
				});
			}

			var _this=this;
            var zoomExtent = null;
            var feats=[];
            this.mapsearchpins=[];
			array.forEach( results.features, function (feature) {
				  var graphic;
                  //feature.setInfoTemplate(infoTemplate);
				  feats.push(feature);
				  switch (feature.geometry.type) {
						case 'polygon':
							if (feature.geometry.rings && feature.geometry.rings.length > 0) {
								graphic = new Graphic(feature.geometry, null, {
									ren: 1
								});

								graphic.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
											 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
											 new Color([0, 0, 235]), 3), new Color([0, 10, 205, 0.15])));
							     _this.polygonGraphics.add(graphic);
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
			pMapBuffr.style.display="block";

			if (this.printPIN!=null) {
				var pinv=this.printPIN;
				this.printPIN=null;
				//topic.publish('print/showMe', {pin:pinv });
                topic.publish('print/printmap', {pin:pinv });
			}

		}
		,activateMapSearch: function(){
			//this.createGraphicsLayer();
			//this.map.on('click', lang.hitch(this, 'mapClickHandler'));
			this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));
			this.disconnectMapClick();
		}
        ,addPRC_Min: function(pinv){

			// check if detail tab has been created and create it if not
			try {
				if (dijit.byId("pResultDetailTab")==null || dijit.byId("pResultDetailTab")===undefined) {
                   var title="Detail";
                   var idx=1;
                   var   //content='<div id="pResultDetailTab" data-dojo-type="dijit/layout/ContentPane" title="Detail"><div id="pcMinDet" data-dojo-type="dijit/layout/ContentPane" style="padding:0px 0px 7px 0px !important;margin:0px !important;"></div></div>';
                   content='<div id="pcMinDet" data-dojo-type="dijit/layout/ContentPane" style="padding:0px 0px 7px 0px !important;margin:0px !important;"></div>';

                   this.createResTab("pResultDetailTab",title,idx,content);
                   //this.pResultsSubTabs.forward() ;
                   this.resizeContents();
				}
			} catch (ex){
				console.log("error adding min detail tab", ex);
			}


			 dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
            dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultDetailTab"));

			domConstruct.empty("pcMinDet");
			var _this=this;
			var srmd=dom.byId("pcMinDet");
			var tpcmd =new prcmin(
			 {
			   pin: pinv
			 });
			tpcmd.startup();
			tpcmd.placeAt(srmd);



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
							 if (actntype == "pc_zoom") actntype = "pc_zoom_min";
							 //console.log("pcObj",pcObj);
							 _this.handlePRCevent(actntype,pcObj,this.id);
					}
			   }
		    });

		    this.resizeContents();
		     this.zoomPIN(pinv,false);
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

        ,changeSearchForm:function(evt,selForm){
			//this.clearSearch();

			var SearchPane  = registry.byId("psearchForm");
			//var selForm=evt.target.value;
			if (typeof selForm == "undefined")  selForm=evt.target.value;

            var frmObj=null;
            this.activeMenu=selForm;

			if (selForm=="property") {
				frmObj=dijit.byId("pPropSearchForm");

			} else if (selForm=="saleslist") {
				 frmObj=dijit.byId("pSalesListFrm");

			} else if (selForm=="salesdata") {
				 frmObj=dijit.byId("pSalesDataFrm");
				 //this.salesDataPopType();

			} else if (selForm=="sub") {
				 frmObj=dijit.byId("pSubForm");

			} else if (selForm=="business") {
				 //SearchPane.set("href", "./js/gis/dijit/property/templates/business.html");
				 frmObj=dijit.byId("pBusForm");

			} else if (selForm=="map") {
				 frmObj=dijit.byId("pMapFrm");

				 this.activateMapSearch();
			}

			//if (selForm != "map" && this.mapsearch_auto) this.mapsearch_auto=false;

			//this.mapsearch_auto=false;


			// hide all the forms then only show the active form
			dijit.byId("pSubForm").set("style", "display:none");
			dijit.byId("pBusForm").set("style", "display:none");
            dijit.byId("pPropSearchForm").set("style", "display:none");
            dijit.byId("pSalesListFrm").set("style", "display:none");
            dijit.byId("pSalesDataFrm").set("style", "display:none");
            dijit.byId("pMapFrm").set("style", "display:none");
            if (frmObj) frmObj.set("style", "display:block");

            var sfs=document.getElementById("selSearchType") ;
            //document.getElementById("selSearchType").selectedIndex = 5;
			for (var i = 0; i < sfs.options.length; i++) {
				 if (sfs.options[i].value.toLowerCase() == selForm.toLowerCase()) {
					 if (sfs.selectedIndex != i) {
						 sfs.selectedIndex = i;
						 //if (change) sfs.onchange();
					 }
					 break;
				 }
			 }

			if (this.mapsearch_auto) {
				this.mapsearch_auto=false;
				//this.clearGraphics();
				this.connectMapClick();
				this.drawToolbar.deactivate();
				topic.publish('mapClickMode/setDefault');
			}

		}
		,salesDataPopType: function(){
			var select = document.getElementById('selSaleDataType');
            var iurl='./webgis.asmx/GetLanduseLookup';
            var _this=this;
            request.get(iurl,{ handleAs: "json" }).then(
                function (data){
                    //console.log("lulc types: " , data);
					for (var i = 0; i<data.length; i++){
						var opt = document.createElement('option');
						opt.value = data[i].lu_code;
						opt.innerHTML = data[i].lu_desc;
						select.appendChild(opt);
					}
 	            } ,
 	            function (error){
					_this.handleXHR_Err(error,"Property Search Failed (salesDataPopType)");
 	                console.log("Error Occurred: " + error);
 	            }
 	        );
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
				this.showThis();
				//this.resizeContents();
				//this.containerNode.resize();
			}
		}
		,createResultsTab:function(){

			//console.log("createResultsTab-----");

             // create the Results tab
			 try {
			   if (dijit.byId("pResultsTab")==null || dijit.byId("pResultsTab")===undefined) {
				 var title="Results";
				 var idx=1;
				 var  content='';
				 this.createTab("pResultsTab",title,idx,content);

				 // create the pResultsSubTabs tabs object
				 if (this.pResultsSubTabs==null) {

					 this.pResultsSubTabs = new TabContainer({
						 id:"pResultsSubTabs"
						 //,class:"propertyTabContainer"
						 ,class:"resTabs"
						 ,nested:true
						 //,isLayoutContainer:true
						 ,useMenu:false
						 ,useSlider:false
						 ,doLayout: false
						 //,"data-dojo-attach-point": "pResultsSubTabs"
						// ,style: attr.get("pResultsTab", "style")
						//,style: "margin-top:0px !important"
					}, dijit.byId("pResultsTab").containerNode);

					this.pResultsSubTabs.startup();

					// add jump list tab to resultssubtabs
					var stitle="List";
					var sidx=0;
					var  scontent='<div id="pResCount" style="float:center; padding:0px;margin;0px;display:none">res count</div>';
					this.createResTab("pResultListTab",stitle,sidx,scontent);


					 var rlt=dijit.byId("pResultListTab").containerNode;
					//var rlt=dijit.byId("pResultListTab").domNode;

					dojo.place('<div id="pPageSelDiv" style="display:none;padding: 0px; font-size: 9px"><div style="float:left; padding:0px;margin;0px;">jump to page: </div><div style="padding: 0px; float: left; padding:0px;margin;0px;"><select id="selResPage" style="font-size:9pt;padding:0px;margin;0px"><option value="1" selected="true">1</option></select></div></div>', rlt,"last");
					dojo.place('<center><div id="pPageSelDiv3" style="display:none;margin:5px 0px 5px 0px;padding: 0px; font-size: 8px"><a id="pPagePrev" title="previous page" data-dojo-attach-event="onClick:changePage">previous 50 records</a><a id="pPageNext" title="next page" data-dojo-attach-event="onClick:changePage">more records</a></div></center>', rlt,"last");


					//dojo.place('<div id="pZmDv" style="float:center; padding:0px;margin;0px;"><input id="btnZoomAlllIST" data-dojo-attach-point="btnZoomAll" type="button" style="z-index: 900;font-size:10px;margin:0px;padding:0px;height:20px;float:left;display:block" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="zoom to these records" iconClass="dijitNoIcon" data-dojo-attach-event="onClick:zoomAllList"></input><input id="btnPrLbls" data-dojo-attach-point="btnPrLbls" type="button" style="z-index: 900;font-size:10px;margin:0px;padding:0px;height:20px;float:right;display:block" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="export/mailing labels" iconClass="dijitNoIcon" data-dojo-attach-event="onClick:printMailLblsMenu"></input></div><br>', rlt,"last");

					dojo.place('<div id="pZmDv" style="padding:9px 0px 0px 0px;margin:0px 0px 10px 0px;width:335px;height:10px;border-bottom:1pz solid black"></div> ', rlt,"last");



					 // create buttons programmatically
					 var _this=this;
					 this.btnZoomAll=new Button({
					   label: "zoom to records",
						style: "z-index: 900;font-size:10px;margin:0px;padding:0px;height:18px;float:right;display:block;",
					   onClick: function(){
						 console.log("clicked zoomall button" );
						 _this.zoomAllList();
					   }
					 }).placeAt(dom.byId("pZmDv"));

					 this.btnPrLbls=new Button({
					   label: "export/mailing labels",
						style: "z-index: 900;font-size:10px;margin:0px;padding:0px;height:18px;float:left;display:block;",
					   onClick: function(){
						 console.log("clicked printMailLblsMenu button" );
						 _this.printMailLblsMenu();
					   }
					 }).placeAt(dom.byId("pZmDv"));


					  dojo.place('<div id="pSearchResults" data-dojo-type="dijit/layout/ContentPane" style="padding:0px 0px 7px 0px !important;margin:0px !important;overflow-y:scroll"></div>', rlt,"last");


					/*this.pSearchResults=new ContentPane({
						id:"pSearchResults"
						,content:"<p>Searchresults</p>"
						,style:"padding:0px 0px 7px 0px !important;margin:0px !important;height:355px"
					} ,dijit.byId("pResultListTab"))

					//dojo.place(this.pSearchResults,dijit.byId("pResultListTab"));


					 this.pSearchResults.startup();
					 */


					//dojo.place('<center><div id="pPageSelDiv2" style="display:none;margin:3px 0px 0px 0px;padding: 0px;font-size:9px; z-index: 900;height:15px;"><a id="pPagePrev2" title="previous page" data-dojo-attach-event="onClick:changePage">previous 50 records</a><a id="pPageNext2" title="next page" data-dojo-attach-event="onClick:changePage">more records</a></div></center><br>', rlt,"last");


                    var _this=this;
					var cp = document.getElementById("pPageNext");
					if (cp.addEventListener) {
						 cp.addEventListener("click",
						   function(e){
							   _this.resPage+=1;

							   if (_this.activeMenu=='map') {
								   _this.doSearch_Pins(_this.mapsearchpins);
							   } else {
								   _this.doSearch();
							   }

						   }, false);
					} else {
						 cp.attachEvent('click',  function(e){
							   _this.resPage+=1;
							   //this.doSearch();
							   if (this.activeMenu=='map') {
								   _this.doSearch_Pins(this.mapsearchpins);
							   } else {
								   _this.doSearch();
							   }
						   }) ;
					}

					cp = document.getElementById("pPagePrev");
					if (cp.addEventListener) {
						 cp.addEventListener("click",
						   function(e){
							   _this.resPage-=1;

							   if (_this.activeMenu=='map') {
								   _this.doSearch_Pins(_this.mapsearchpins);
							   } else {
								   _this.doSearch();
							   }

						   }, false);
					} else {
						 cp.attachEvent('click',  function(e){
							   _this.resPage-=1;
							   //this.doSearch();
							   if (_this.activeMenu=='map') {
								   _this.doSearch_Pins(_this.mapsearchpins);
							   } else {
								   _this.doSearch();
							   }
						   }) ;
					}

					// add pager handler
					var sp = document.getElementById("selResPage");
					if (sp.addEventListener) {
						 sp.addEventListener("change",
						   function(e){
							   _this.resPage=e.target.selectedIndex+1;
							   if (_this.activeMenu=='map') {
								   _this.doSearch_Pins(_this.mapsearchpins);
							   } else {
								   _this.doSearch();
							   }
						   }, false);
					} else {
						 sp.attachEvent('change',  function(e){
							   _this.resPage=e.target.selectedIndex+1;
							   //this.doSearch();
							   if (_this.activeMenu=='map') {
								   _this.doSearch_Pins(_this.mapsearchpins);
							   } else {
								   _this.doSearch();
							   }
						   }) ;
					}


					//this.fixWidth();
					this.resizeContents();
					//this.parentWidget.resize();

			    }
		      }
			 } catch (ex){
			    console.log("error creating results tab tab", ex);
			 }


		}
		,close: function () {

			//this.createResultsTab();
			//this.showWait();

			if (this.parentWidget.hide) {
				this.parentWidget.hide();
			}

		}
		,showWait:function() {
           if (dijit.byId("pResultsTab")==null || dijit.byId("pResultsTab")===undefined) {
		   } else {
			   try {
				   document.getElementById("pResCount").innerHTML='';
				    this.btnZoomAll.domNode.style.display="none";
				   this.btnPrLbls.domNode.style.display="none";
				   document.getElementById("pResCount").style.display="none";
				  document.getElementById("pPageSelDiv").style.display="none";
				   ////document.getElementById("pPageSelDiv2").style.display="none";
				   document.getElementById("pPageSelDiv3").style.display="none";

				   var srd=dom.byId("pSearchResults");
				   if (srd) {
					   var img = dojo.doc.createElement('img');
						dojo.attr(img, {
							id:"waitimg",
							src: "images/ajax-loader3.gif",
							alt: "Please Standbye while I search",
							//style: {float: "center",  padding:"0px 0px 0px 59px",margin:"80px"}
							style: {float: "center",top:"5px",  padding:"0px 0px 0px 90px",margin:"0px"}
						});
					   //dojo.place(img, srd, "after");
					   dojo.place(img, srd, "before");


				  }
		      } catch (ex){ console.error("error showWait",ex); }

	     }
		}
		,hideWait:function() {
		   var wi=dom.byId("waitimg");
		   if (wi) {
			   wi.parentNode.removeChild(wi);
		   } else {
			   console.log("cant hide the wait");
		   }
		}
		,preBuffer:function(){
			var b_gm=esri.getGeometries(this.polygonGraphics.graphics);
			this.doBuffer(b_gm);
		}
		,unionGeomArray:function(geoms){
           var uPg = new  Polygon( this.map.spatialReference);
           for (var i=0;i<geoms.length;i++){
			   for (var r=0;r<geoms[i].rings.length;r++){
				   uPg.addRing(geoms[i].rings[r]);
			   }
		   }
		   return uPg;
		}
		,doBuffer:function(geometry){
            var _this=this;
			var bDist=parseInt(_this.tbBuffr.value);
			this.drawToolbar.deactivate();
			geometry=this.unionGeomArray(geometry);
			var symbol;
			switch (geometry.type) {
			   case "point":
				 symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));
				 break;
			   case "polyline":
				 symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255,0,0]), 1);
				 break;
			   case "polygon":
				 symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
				 break;
			}
			  var graphic = new Graphic(geometry, symbol);
			  this.polygonGraphics.add(graphic);

			  //setup the buffer parameters
			  var params = new BufferParameters();
			  params.distances = [ bDist ];
			  params.outSpatialReference = this.map.spatialReference;
			  params.unit = GeometryService[esri.tasks.GeometryService.UNIT_FOOT];
			  params.geometries  = [ geometry ];
              params.bufferSpatialReference = this.map.spatialReference;
              params.unionResults=true;

            try {
                var su=dom.byId("selBufUnit").value;
                if (su=="ft") params.unit = GeometryService[esri.tasks.GeometryService.UNIT_FOOT];
                if (su=="mi") params.unit = GeometryService[esri.tasks.GeometryService.UNIT_STATUTE_MILE];
                if (su=="m") params.unit = GeometryService[esri.tasks.GeometryService.UNIT_METER];
                if (su=="km") params.unit = GeometryService[esri.tasks.GeometryService.UNIT_KILOMETER];
			} catch (ex){
				console.log("err3..",ex);
			}
			  //normalize the geometry
              console.log(" 3 ....doBuffer " );
              normalizeUtils.normalizeCentralMeridian([geometry ], esriConfig.defaults.geometryService).then(function(normalizedGeometries) {
                 var normalizedGeometry = normalizedGeometries[0];
				 if (normalizedGeometry.type === "polygon") {
					 //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
					console.log(" 5 ....doBuffer " );
					esriConfig.defaults.geometryService.simplify([normalizedGeometry], function(geometries) {
					params.geometries = geometries;
					//esriConfig.defaults.geometryService.buffer(params, showBuffer);
					esriConfig.defaults.geometryService.buffer(params, lang.hitch(_this, 'showBuffer')  );
				  });
				} else {
				  params.geometries = [normalizedGeometry];
				  //esriConfig.defaults.geometryService.buffer(params, showBuffer);
				  esriConfig.defaults.geometryService.buffer(params, lang.hitch(_this, 'showBuffer')  );
				}
           });
		}
		,showBuffer:function(bufferedGeometries) {
		  var _this=this;
          var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255,0,0,0.65]), 2
            ),
            new Color([255,0,0,0.35])
          );

          array.forEach(bufferedGeometries, function(geometry) {
            var graphic = new Graphic(geometry, symbol);
            //_this.map.graphics.add(graphic);
            _this.polygonGraphics.add(graphic);
            _this.mapSearchMode='polygon';
            _this.qryPolyGeom=geometry;

          });

          //_this.mapSearch(bufferedGeometries[0]);

        }
		,doSearch_Pins: function(pins){

			//console.log("doSearch_Pins",pins);

            this.createResultsTab();
            this.showWait();

            var startrec = 1;
            var endrec = 50;

            if (this.resPage > 1) {
				startrec = ((this.resPage-1) * 50) + 1;
				endrec = (startrec + 50) - 1;
			}

             var _this=this;
             request.post("WebGIS.asmx/PropertyQueryPaged",{
				  handleAs: "json",
				  timeout: 5000
                  ,data: {
					searchtype:"pin_list",
					searchString:pins.join(','),
					startrec:startrec,
					endrec:endrec
				}}).then(
                function (data){
                     //console.log(  data);
                    _this.showResults(data);
 	            } ,
 	            function (error){
					_this.handleXHR_Err(error,"Property Search Failed (doSearch_Pins)");
 	                console.log("Error Occurred: " + error);
 	            }
 	        );

			dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
			dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultListTab"));
		}
		,doSearch: function(){
		    //console.log("doSearch",this.activeMenu);
            //domConstruct.empty("pSearchResults");

            //domConstruct.empty("pcMinDet");

            this.createResultsTab();

            this.showWait();

            if (this.activeMenu=='map') { this.runMapSearch(); return; }

            var startrec = 1;
            var endrec = 50;
            if (this.resPage > 1) {
				startrec = ((this.resPage-1) * 50) + 1;
				endrec = (startrec + 50) - 1;
			}

            var sval,stype;
			if (registry.byId("af_tbAddr") && registry.byId("af_tbAddr").textbox.value && (registry.byId("af_tbAddr").textbox.value !="")){
			          stype="address";
			          sval=registry.byId("af_tbAddr").textbox.value;
			} else  if (registry.byId("af_tbOwner") && registry.byId("af_tbOwner").textbox.value && (registry.byId("af_tbOwner").textbox.value !="")){
			          stype="owner";
			          sval=registry.byId("af_tbOwner").textbox.value;
			} else  if (registry.byId("tbOwner") && registry.byId("tbOwner").textbox.value && (registry.byId("tbOwner").textbox.value !="")){
			          stype="owner";
			          sval=registry.byId("tbOwner").textbox.value;
			} else if (registry.byId("af_tbPIN") && registry.byId("af_tbPIN").textbox.value && (registry.byId("af_tbPIN").textbox.value !="")){
			          stype="pin";
			          sval=registry.byId("af_tbPIN").textbox.value;
			          sval=this.validatePIN(sval);

			} else if (registry.byId("af_tbBus") && registry.byId("af_tbBus").textbox.value && (registry.byId("af_tbBus").textbox.value !="")){
			          stype="bus";
			          sval=registry.byId("af_tbBus").textbox.value;
			} else if (registry.byId("af_tbSub") && registry.byId("af_tbSub").textbox.value && (registry.byId("af_tbSub").textbox.value !="")){
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
			if (this.activeMenu=="salesdata" || this.activeMenu=="saleslist") {
				  request.get(iurl,{ handleAs: "json" }).then(
					function (data){
						 //console.log(  data);
						_this.showResults(data);
					} ,
					function (error){
						console.log("Error Occurred: " + error);
						 topic.publish('growler/growl', {
								title: 'DB Query Error',
								message: 'There was an error getting your query from the database ' + error,
								level: 'error', //can be: 'default', 'warning', 'info', 'error', 'success'.
								timeout: 2500, //set to 0 for no timeout
								opacity: 0.8
			            });
						//_this.handleXHR_Err(error,"Property Search Failed (doSearch)");
					}
				 );
			}  else {
				 request.post("WebGIS.asmx/PropertyQueryPaged",{
					  handleAs: "json"
					  //,timeout: 15000
					  ,data: {
						searchtype:stype,
						searchString:sval.trim(),
						startrec:startrec,
						endrec:endrec
					}}).then(
					function (data){

						_this.showResults(data);
					} ,
					function (error){
						 topic.publish('growler/growl', {
								title: 'DB Query Error',
								message: 'There was an error getting your query from the database ' + error,
								level: 'error', //can be: 'default', 'warning', 'info', 'error', 'success'.
								timeout: 2500, //set to 0 for no timeout
								opacity: 0.8
			            });
						//_this.handleXHR_Err(error,"Property Search Failed (doSearch)");
						console.log("Error Occurred: " + error.message," ",error.lineNumber);
					}
				);
		   }
			dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
			dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultListTab"));

		}
       ,validatePIN: function (pstr){
          var pr=pstr;
          if (pstr.indexOf("-")==-1){
             pr=pstr.substring(2,0) +  "-" +  pstr.substring(2,4) + "-" + pstr.substring(4,6) + "-" + pstr.substring(10,6) + "-" + pstr.substring(14,10) + "-" + pstr.substring(18,14);
          }
          console.log("validated pin" ,pr);
          return pr;
        }
		,handleXHR_Err:function(error,usr_msg){
			console.log("Error Occurred: " + error,"  ",usr_msg);
			this.hideWait();
            var srd=dom.byId("pSearchResults");
			domConstruct.empty("pSearchResults");
            domConstruct.empty("pcMinDet");
            domConstruct.empty("pResCount");
            dom.byId("pSearchResults").innerHTML="<center>There was an problem with this search.<br>Please let the site administrator know.<br>Thank You</center>";

			topic.publish('growler/growl', {
					title: 'Property Search Failed',
					message: usr_msg + "\r\n" + error,
					level: 'error', //can be: 'default', 'warning', 'info', 'error', 'success'.
					timeout: 5000, //set to 0 for no timeout
					opacity: 0.7
				});
 			//alert(usr_msg);
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
			qJsonObj.saleQualification=dom.byId("selSaleDataQual").value;
			qJsonObj.saleVacant=dom.byId("selSaleDataVac").value;
			//qJsonObj.????=dom.byId("selSaleDataType").value;
			if (registry.byId("tbSlAcreTo") && registry.byId("tbSlAcreTo").textbox.value && (registry.byId("tbSlAcreTo").textbox.value !="")){
			          qJsonObj.endAcreage=registry.byId("tbSlAcreTo").textbox.value;
			}

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

            //console.log("handlePRCevent",actntype);
			var prcob=registry.byId(prcID);
 			if (actntype == "pc_zoom") {
               /*topic.publish('InitZoomer/ZoomParcel', {
			 		 pin:pcObj.pin
               });*/
               this.zoomPIN(pcObj.pin,false);
            } else if (actntype == "pc_zoom_min") {
               this.zoomPIN(pcObj.pin,false);
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
			 var prcob=registry.byId(widgetID);
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

			 try {
				if (dijit.byId("pSavedTab")==null || dijit.byId("pSavedTab")===undefined) {
				   var title="Saved";
				   var idx=2;
				   var content='<div id="pSavedZmDv" style="float:center;padding:0px;margin;0px;"><input id="btnZoomAllSaved" data-dojo-attach-point="btnSavedZoomAll" type="button" style="z-index: 900;font-size:10px;margin:0px;padding:0px;height:20px;float:left;display:b" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="zoom to these records" iconClass="dijitNoIcon" data-dojo-attach-event="onClick:zoomAllListSaved"></input><input id="btnSavedPrLbls" data-dojo-attach-point="btnSavedPrLbls" type="button" style="z-index: 900;font-size:10px;margin:0px;padding:0px;height:20px;float:right;display:block" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="print mailing labels" iconClass="dijitNoIcon" data-dojo-attach-event="onClick:printMailLblsSaved"></input></div><br><div class="ptabContent ptabContMain" style="padding:0px !important;margin:0px !important;"><br><div id="pSearchSaved" data-dojo-type="dijit/layout/ContentPane" style="padding:0px 0px 7px 0px !important;margin:0px !important;"></div><br></div>';

				   this.createTab("pSavedTab",title,idx,content);
				   //this.pResultsSubTabs.forward() ;

				   var btn = dom.byId("btnZoomAllSaved");
                   on( btn, "click", lang.hitch(this, 'zoomAllListSaved')  );

				   var btn2 = dom.byId("btnSavedPrLbls");
                   on( btn2, "click", lang.hitch(this, 'printMailLblsSaved'));

				}
			 } catch (ex){
				 console.log("error adding min detail tab", ex);
			 }

			 //console.log("addPRC2Saved",this.savedlist);

			 if (this.savedlist.indexOf(pcObj.pin) != -1) return;

			 this.savedlist.push(pcObj.pin);

			 //this.btnSavedZoomAll.domNode.style.display="block";
			 //this.btnSavedPrLbls.domNode.style.display="block";
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

		}
		,resultsAddPager: function(dobj){
            var rec_page = 0;
            var pgcnt=0;
            if (dobj.rec_count > 0) {
				var select = dom.byId("selResPage");
				select.options.length=0;
				rec_page = 1;
				pgcnt = 1;

			    this.btnZoomAll.domNode.style.display="block";
			    this.btnPrLbls.domNode.style.display="block";
			    document.getElementById("pResCount").style.display="block";
				// build paging control
				if (dobj.rec_count > 50) {

					document.getElementById("pPageSelDiv").style.display="block";
					//document.getElementById("pPageSelDiv2").style.display="block";
					document.getElementById("pPageSelDiv3").style.display="block";
					pgcnt = Math.ceil(dobj.rec_count / 50);
					if (dobj.start_rec > 50) rec_page = Math.ceil(dobj.start_rec / 50);

					for (var p = 0; p < pgcnt; p++) {
						select.options[select.options.length]=new Option(p + 1);
					}
					if (rec_page==1) {
						//document.getElementById("pPagePrev2").style.display="none";
						document.getElementById("pPagePrev").style.display="none";
				    } else {
					    //document.getElementById("pPagePrev2").style.display="block";
					    document.getElementById("pPagePrev").style.display="block";
				    }
					if (rec_page==pgcnt) {
						//document.getElementById("pPageNext2").style.display="none";
						document.getElementById("pPageNext").style.display="none";
				    } else {
					   // document.getElementById("pPageNext2").style.display="block";
					    document.getElementById("pPageNext").style.display="block";
				    }


				} else {
					document.getElementById("pPageSelDiv").style.display="none";
					//document.getElementById("pPageSelDiv2").style.display="none";
					document.getElementById("pPageSelDiv3").style.display="none";
				}
				//if (dobj.rec_count > 50) select.selectedIndex = rec_page-1;
		   } else {  // no results
			   	this.btnZoomAll.domNode.style.display="none";
			    this.btnPrLbls.domNode.style.display="none";
			    document.getElementById("pPageSelDiv").style.display="none";
			    //document.getElementById("pPageSelDiv2").style.display="none";
			    document.getElementById("pPageSelDiv3").style.display="none";
		   }
		    // show the record count
		    var rc = document.getElementById("pResCount");
		    //rc.innerHTML='<b><p>Records ' + dobj.start_rec + "-" + (dobj.start_rec + 49) " of " + dobj.rec_count + '</p></b><br>page ' + rec_page + ' of ' + pgcnt;
		    rc.innerHTML='<b><p style="font-size:8px">Records ' + dobj.start_rec + "-" + (dobj.start_rec + 49) + " of " + dobj.rec_count + '</p></b>' ;

             var s  = dom.byId("selResPage");
             s.value=this.resPage;

		}
		,changePage:function(e){

			var pg=1;
			if (e.target.selectedIndex) {
              pg=e.target.selectedIndex-1;

		    } else {
				//console.log("...changePage using button",e.target);
				//var selobj = dom.byId("selResPage");
				//selobj.options[select.options.length]
				//console.log(".......changePage using butt ",selobj);
				//pg=parseInt(selobj.value);
				pg=this.resPage;

				if (e.target.id.indexOf("Next") > 0){
					pg=pg+1;
				} else if (e.target.id.indexOf("Prev") > 0){
					pg=pg-1;
				}
			}

             this.resPage=pg;


             this.doSearch();
		}
		,showResults: function (results){

			 //console.clear();
			 //console.group("-----showResults-------");
			 //console.groupCollapsed("-----showResults-------");
			 //console.log("showResults----------------");
			 //console.time("res");

			 this.hideWait();
             var _this=this;
             var srd=dom.byId("pSearchResults");
			 var dlgcont = "";
			 var dobj=results;
			 var pobj = results.ps_res;


			 if (!pobj) {
				 console.log("error getting results",results);
			 }

            // show minimal detail if there is only one results
            if (pobj.length==1) {
               //dijit.byId("pSearchTabs").selectChild(dijit.byId("pResultsTab"));
			   //dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultDetailTab"));

			   this.addPRC_Min(pobj[0].pin);
			   return;
		    }

		     //console.log("showResults clearing search reslts");
             //console.log("showResults 2" );
			 domConstruct.empty("pSearchResults");
             //domConstruct.empty("pcMinDet");
             domConstruct.empty("pResCount");

		    // Set the page menu and select current page
            //this.resultsAddPager(dobj);

            if (dobj.rec_count) this.qObj.rec_count=dobj.rec_count;

		    this.pinlist=[];
			for (var i = 0; i < pobj.length; i++) {

				 pobj[i].pin=pobj[i].pin.trim();
				 pobj[i].owner= pobj[i].owner.trim();
				 pobj[i].addr= pobj[i].addr.trim();
				 pobj[i].GIS_SiteAddr=pobj[i].GIS_SiteAddr.trim();

				/*
				var mailing_addr="";
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLADDR1.trim()=="") ? "" : pobj[i].PEFLADDR1.trim() + "<br>");
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLADDR2.trim()=="") ? "" : pobj[i].PEFLADDR2.trim() + "<br>");
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLADDR3.trim()=="") ? "" : pobj[i].PEFLADDR3.trim() + "<br>");
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLCITY.trim()=="") ? "" : pobj[i].PEFLCITY.trim() + ",");
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLST.trim()=="") ? "" : " " + pobj[i].PEFLST.trim());
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLZIP5.trim()=="") ? "" : " " + pobj[i].PEFLZIP5.trim());
				 mailing_addr=mailing_addr +  ((pobj[i].PEFLCNTRY.trim()=="") ? "" : "<br>" + pobj[i].PEFLCNTRY.trim());

				 pobj[i].addr= mailing_addr;

				 */

				 pobj[i].hstead=pobj[i].hstead.trim();


				 this.pinlist.push(pobj[i].pin);
				 var tprc =new prc(
				 {
				   pin: pobj[i].pin,
				   owner: pobj[i].owner,
				   //address: pobj[i].addr,
				   //address: pobj[i].SiteAddr,
				   address: pobj[i].GIS_SiteAddr,

				   homestead:pobj[i].hstead
				 });

				 tprc.on("click", function (e) {
					 var actntype=e.target.id;
					 if ((actntype == "pc_zoom") || (actntype == "pc_fulldet") || (actntype == "pc_mindet")
							|| (actntype == "pc_save")  || (actntype == "pc_print")) {
						 var prcob=registry.byId(this.id);
						 //prcob.expand_detail();
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

			 this.resultsAddPager(dobj);

			 this.resizeContents();

			 document.getElementById("pResultListTab").scrollTop=0;
             //console.table()
			 //console.timeEnd("res");
			 //console.trace();
			 //console.groupEnd();
			 //console.select(document.getElementById("pResultListTab"));
		}
		,Open_PRCFull:function(pin){
			var puw=window.open( 'prc_full/prc.php?cl=paqry&pin=' + pin,"prcfull");
			if (window.focus) {puw.focus()}
		}

		,printMailLblsMenu: function(e,isSavedTab ){

		    if (typeof isSavedTab == "undefined")  isSavedTab = false;

            //console.log("printMailLbls",e,isSavedTab);
            var _this=this;
			var form = new Form();
		    //var dia  = new Dialog({

			//if (this.export_dia==null) {
					 this.export_dia= new Dialog({
								title: "Export/Mailing Labels",
								//content: "export.....",
								content: form,
								style: "width: 300px",
								hide: function(){ _this.export_dia.destroy(); }
							});

					  var cp = new dijit.layout.ContentPane(
					  {
					   title:"Property Search Results"
					   ,content: '<div   style="width: 95%;margin: 0px 0px 20px 0px;"><div id="expoptn" style="width: 95%;float:center">Please select an export option</div><div id="expstatus" style="height:15px;width: 95%;padding:0px;font-size:small;margin: auto;;background-color: rgb(141,214,249)"></div><div id="expres" style="margin: auto;height:12px;width: 95%;float:center;padding:0px;font-size:small;text-shadow: 0px 2px 0.7em rgba(1,84,239,0.8), 0 0 1.2em rgba(1,14,39,0.5),0 0 0.2em rgba(1,114,139,0.5);"></div></div>'

					   //,id:'cpPropresults'
					   //,class:"claro"
					   ,style: "height:180px;width: 99%;background-color: rgb(141,214,249);font-size:10px;text-align: center;",
					   //class:"claro",
						class:'nonModal',
						draggable:true,
						parseOnLoad:false
					  }
					  ).placeAt(form.containerNode);



					/*
					var btn1=new Button({
					  label: "Mailing Labels for Displayed Results",
					  style: "height:17px;width: 75%;margin:0px auto 10px auto 0px;background-color: rgb(200,215,245);font-family:Leelawadee;font-size:xx-small;",
					  onClick: function(){
						 console.log("Mailing Labels for Displayed Results",isSavedTab );
						 _this.printMailLbls(isSavedTab);
						 //lang.hitch(_this, 'printMailLbls') ;
						 //searchProperty("address",dijit.byId('pVal').value);
						 //dom.byId("result1").innerHTML += "Thank you! ";
					  }

					}).placeAt(cp);
					*/

					var btn2=new Button({
					  label: "Export Mailing Labels for Results",
					  style: "height:17px;width: 75%;margin:0px auto 10px auto 0px;background-color: rgb(200,215,245);font-family:Leelawadee;font-size:xx-small;",
					  onClick: function(){
						 console.log("Mailing Labels for All Results" );
						 _this.printMailLblsAll(isSavedTab);
						 //lang.hitch(_this, 'printMailLblsAll') ;
						 //searchProperty("address",dijit.byId('pVal').value);
						 //dom.byId("result1").innerHTML += "Thank you! ";
					  }

					}).placeAt(cp);


					var btn3=new Button({
					  label: "Export CSV for Results",
					  style: "height:17px;width: 75%;margin:0px auto 10px auto 0px;background-color: rgb(200,215,245);font-family:Leelawadee;font-size:xx-small;",
					  onClick: function(){
						 console.log("Exporting to CSV" );
						 _this.export2CSV(isSavedTab);
						 //lang.hitch(_this, 'export2CSV') ;
					  }

					}).placeAt(cp);

					form.startup();
				   this.export_dia.resize();
		           this.export_dia.show();

					 try {

						//Style.set(btn1.domNode, "font-size", "8px");
						//Style.set(btn1.domNode.firstChild, "font-size", "10px");
						Style.set(btn2.domNode.firstChild, "font-size", "10px");
						Style.set(btn3.domNode.firstChild, "font-size", "10px");
						//Style.set(btn1.domNode.firstChild, "width", "75%;");
						Style.set(btn2.domNode.firstChild, "width", "75%;")
						Style.set(btn3.domNode.firstChild, "width", "75%;")
						//Style.set(btn1.domNode  , "margin", "7px");
						Style.set(btn2.domNode  , "margin", "7px");
						Style.set(btn3.domNode  , "margin", "7px");

					} catch (ex) {
						console.error("error",ex);
					}
	      //} else {
		//	   this.export_dia.resize();
		 //       this.export_dia.show();
		 // }

	 }
   ,export2CSV: function(isSavedTab){

            if (typeof isSavedTab == "undefined")  isSavedTab = false;


            var iurl='./webgis.asmx/ExportMailingLabelCSVSession'
            if (isSavedTab) iurl='./webgis.asmx/ExportMailingLabelCSVPINs?pinlist=' + this.savedlist.join(",");




            Style.set(dom.byId("expstatus") , 'background-color', "rgb(246,190,5)");
            dom.byId("expstatus").innerHTML="preparing data ... please standby ";

		    Style.set(dom.byId("btnPrLbls_label") , 'color', "green");

			// TODO: spatially returned results are breaking the mailing labels and csv for all results because there is no session saved on the server
			//if (!this.mapsearch_auto)
			if (this.activeMenu=="map" && !isSavedTab) {
                 iurl='./webgis.asmx/ExportMailingLabelCSVPINs';

               request.post(iurl, { handleAs: "text"
                ,data: {
			  		pinlist:this.mapsearchpins.join(",")
				 }
              }).then(
                function (text){
					 //document.getElementById("expstatus").style.backgroundColor="rgb(0,175,45)";
					 //dom.byId("expstatus").innerHTML="success";

					 document.getElementById("expstatus").style.display="none";
					 dom.byId("expstatus").innerHTML="";


					 Style.set(dom.byId("btnPrLbls_label") , 'color', "black");
                     dom.byId("expres").innerHTML='<a target="_blank" href="' + text + '" download>Download CSV Here</a> ';
 	            } ,
 	            function (error){
					document.getElementById("expstatus").style.backgroundColor="rgb(200,15,15)";
					dom.byId("expstatus").innerHTML="failed to get data";
					Style.set(dom.byId("btnPrLbls_label") , 'color', "red");
					//this.handleXHR_Err(error,"Printing Mailing Labels Failed (printMailLbls)");
 	                console.log("Error Occurred: " + error);
 	            }
 	          );

			} else {
            request.get(iurl,{ handleAs: "text" }).then(
                function (text){
					 //document.getElementById("expstatus").style.backgroundColor="rgb(0,175,45)";
					 //dom.byId("expstatus").innerHTML="success";

					 document.getElementById("expstatus").style.display="none";
					 dom.byId("expstatus").innerHTML="";
					 Style.set(dom.byId("btnPrLbls_label") , 'color', "black");
                     dom.byId("expres").innerHTML='<a target="_blank" href="' + text + '" download>Download CSV Here</a> ';
 	            } ,
 	            function (error){
					document.getElementById("expstatus").style.backgroundColor="rgb(200,15,15)";
					dom.byId("expstatus").innerHTML="failed to get data";
					Style.set(dom.byId("btnPrLbls_label") , 'color', "red");
					//this.handleXHR_Err(error,"Printing Mailing Labels Failed (printMailLbls)");
 	                console.log("Error Occurred: " + error);

 	            }
 	        );
	      }
	}
   ,printMailLblsAll: function(isSavedTab){

	        if (typeof isSavedTab == "undefined")  isSavedTab = false;

            Style.set(dom.byId("expstatus") , 'background-color', "rgb(246,190,5)");
            dom.byId("expstatus").innerHTML="preparing data ... please standby ";


            var iurl='./webgis.asmx/PrintMailingLabelsSession';
            if (isSavedTab) iurl='./pa.asmx/PrintMailingLabels?search_type=pinlist&search_string=' + this.savedlist.join(",");
		    Style.set(dom.byId("btnPrLbls_label") , 'color', "green");


			if (this.activeMenu=="map" && !isSavedTab) {
               iurl='./pa.asmx/PrintMailingLabels';
               request.post(iurl, { handleAs: "text"
                ,data: {
					search_type:"pinlist"
			  		,search_string:this.mapsearchpins.join(",")
				 }
               }).then(
                function (text){
					 //document.getElementById("expstatus").style.backgroundColor="rgb(0,175,45)";
					 //dom.byId("expstatus").innerHTML="success";

					 document.getElementById("expstatus").style.display="none";
					 dom.byId("expstatus").innerHTML="";


					 Style.set(dom.byId("btnPrLbls_label") , 'color', "black");
                     dom.byId("expres").innerHTML='<a target="_blank" href="' + text + '" download>Download CSV Here</a> ';
 	            } ,
 	            function (error){
					document.getElementById("expstatus").style.backgroundColor="rgb(200,15,15)";
					dom.byId("expstatus").innerHTML="failed to get data";
					Style.set(dom.byId("btnPrLbls_label") , 'color', "red");
					//this.handleXHR_Err(error,"Printing Mailing Labels Failed (printMailLbls)");
 	                console.log("Error Occurred: " + error);
 	            }
 	          );

			} else {
				request.get(iurl,{ handleAs: "text" }).then(
                function (text){
					 document.getElementById("expstatus").style.backgroundColor="rgb(0,175,45)";

					 dom.byId("expstatus").innerHTML="success";
					 Style.set(dom.byId("btnPrLbls_label") , 'color', "black");
                     dom.byId("expres").innerHTML='<a target="_blank" href="' + text + '" download>Download Labels Here</a> ';
 	            } ,
 	            function (error){
					document.getElementById("expstatus").style.backgroundColor="rgb(200,15,15)";
					dom.byId("expstatus").innerHTML="failed to get data";
					Style.set(dom.byId("btnPrLbls_label") , 'color', "red");
					//this.handleXHR_Err(error,"Printing Mailing Labels Failed (printMailLbls)");
 	                console.log("Error Occurred: " + error);

 	            }
 	          );
		 }
	}
   ,printMailLbls: function(isSavedTab){

		    console.log("printMailLbls",isSavedTab);

		    if (typeof isSavedTab == "undefined")  isSavedTab = false;






            var iurl='./pa.asmx/PrintMailingLabels?search_type=' + this.qObj.querytype + '&search_string=' + this.qObj.queryvalue
            if (isSavedTab) iurl='./pa.asmx/PrintMailingLabels?search_type=pinlist&search_string=' + this.savedlist.join(",");

		    // TODO: spatially returned results are breaking the mailing labels and csv for all results because there is no session saved on the server
            //if (!this.mapsearch_auto)
			if (this.activeMenu=="map" && !isSavedTab) {

			}

            document.getElementById("expstatus").style="height:15px;width: 95%;padding:0px;margin:auto;font-size:small;float:center;background-color:rgb(0,215,45)";
            document.getElementById("expstatus").innerHTML="getting data";
            Style.set(dom.byId("expstatus") , 'background-color', "rgb(246,190,5)");
            dom.byId("expstatus").innerHTML="preparing data ... please standby ";


		    Style.set(dom.byId("btnPrLbls_label") , 'color', "green");
            request.get(iurl,{ handleAs: "text" }).then(
                function (text){
					 document.getElementById("expstatus").style.backgroundColor="rgb(0,175,45)";

					 dom.byId("expstatus").innerHTML="success";
					 Style.set(dom.byId("btnPrLbls_label") , 'color', "black");
                     dom.byId("expres").innerHTML='<a target="_blank" href="' + text + '" download>Download Labels Here</a> ';
                     //window.open( text,"prcprint");
 	            } ,
 	            function (error){
					//Style.set(dom.byId("expstatus") , 'background-color', "rgb(200,15,15);");
					document.getElementById("expstatus").style.backgroundColor="rgb(200,15,15)";
					dom.byId("expstatus").innerHTML="failed to get data";
					Style.set(dom.byId("btnPrLbls_label") , 'color', "red");
					//this.handleXHR_Err(error,"Printing Mailing Labels Failed (printMailLbls)");
 	                console.log("Error Occurred: " + error);
 	                //alert("Error Printing Labels : " + error);
 	            }
 	        );
		}
		,printMailLblsSaved: function(){
			this.printMailLblsMenu(null,true);
		}
		,GetPrintMap:function(pinv){
             //Style.set(dijit.byId("sidebarLeft").domNode, 'display', "block");
             //topic.publish('viewer/togglePane', {pane:"left",show:"true"});
             //var prcob=dijit.byId("print_parent");
             //prcob.set("open", "true");

             this.printPIN=pinv;

             this.zoomPIN(pinv,false);
             topic.publish('print/showMe', {pin:pinv });
             //topic.publish('print/printmap', {pin:pinv });

			/* topic.publish('growler/growl', {
					title: 'Print Started',
					message: 'Your print job has been sent to the server.  See the print menu in the left panel for the status of your print job.',
					level: 'success', //can be: 'default', 'warning', 'info', 'error', 'success'.
					timeout: 1500, //set to 0 for no timeout
					opacity: 0.8
			 });
			 */

		}
		,createTab: function(idv,titlev,idx,contentv){

             var tab = new dijit.layout.ContentPane({ id:idv,className: "ContentTab", title: titlev, content: contentv, selected: true });
             this.pSearchTabs.addChild(tab, idx);
             tab.startup();
             dijit.byId("pSearchTabs").selectChild(dijit.byId(idv));

		}
		,createResTab: function(idv,titlev,idx,contentv){

             var tab = new dijit.layout.ContentPane({ id:idv,className: "ContentTab", title: titlev, content: contentv, selected: true });
             this.pResultsSubTabs.addChild(tab, idx);
             tab.startup();
             dijit.byId("pResultsSubTabs").selectChild(dijit.byId(idv));

		}
		,selMinDet:function(){

			dijit.byId("pResultsSubTabs").selectChild(dijit.byId("pResultDetailTab"));

		}
		,clearSearch: function(){

           var dobj=dijit.byId("pane1").domNode;
           var iboxes=dobj.getElementsByTagName('input');
           for (var i=0;i<iboxes.length;i++){
			    if (iboxes[i].type=="text"){
                    iboxes[i].value="";
				}
		   }


           try {
              domConstruct.empty("pcMinDet");
	       } catch (ex){}

           try {
			   domConstruct.empty("pSearchResults");
			   domConstruct.empty("pResCount");
			   document.getElementById("pPageSelDiv").style.display="none";
			   //document.getElementById("pPageSelDiv2").style.display="none";
			   document.getElementById("pPageSelDiv3").style.display="none";
			   this.btnZoomAll.domNode.style.display="none";
			   this.btnPrLbls.domNode.style.display="none";
	       } catch (ex){}




           this.clearGraphics();

  		}
		,zoomPIN:function(pin,doDBSearch) {
			    //console.log("zoom to pin");
				if (typeof doDBSearch == "undefined") {
					doDBSearch = true;
				}
			    var whereclause=this.pin_field + "='" + pin + "'";
				var q_url=this.property_mapsrvc + "/" + this.parcel_lyrid;
				this.qry = new  Query();
				this.qry.where = whereclause;
				this.qry.outSpatialReference =  this.map.spatialReference ;
				this.qry.returnGeometry = true;
				this.qry.outFields = [this.pin_field];
				this.qryTask=new QueryTask(q_url);
				this.clearGraphics();
				if (doDBSearch) {
				    this.qryTask.execute(this.qry, lang.hitch(this, 'mapqRes'));
				} else {
                    this.qryTask.execute(this.qry, lang.hitch(this, 'mapqResNoQry'));
				}
		}
		,zoomAllListSaved:function() {
			    //console.log("zoomAllListSaved");

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
				//this.qryTask.execute(this.qry, lang.hitch(this, 'mapqRes') );
				this.qryTask.execute(this.qry, lang.hitch(this, 'mapqResNoQry'));
		}
		,zoomAll:function() {
			// this will zoom to all of the records returned by the current query
			//  large result sets can easily bog down the client and AGS server.
			//  This approach attempts to cut out the RDBMS query step and mirror
			//  the SQL Server query on the parcel layer.

			// TODO: !!IDEA - Build an SDE spatial view that joins parcels with Central_GIS
			    var whereclause="";
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