define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/dom-construct',
	"dojo/dom", "dojo/request", "dojo/json",
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/on',
	'dojo/keys',
	'dojo/store/Memory',
	'dgrid/OnDemandGrid',
	'dgrid/Selection',
	'dgrid/Keyboard',
	'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/graphicsUtils',
	'esri/tasks/FindTask',
	'esri/tasks/FindParameters',
	'esri/geometry/Extent',
	'dojo/text!./PINSearch/templates/PINSearch.html',
	"dijit/Dialog",
	'dijit/form/Form',
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dojo/_base/Color",
	'dijit/form/FilteringSelect',
	'dijit/form/ValidationTextBox',
	'dijit/form/CheckBox',
    "dojo/ready", "dojo/parser", "dijit/registry", "dojo/on",
    "dojo/store/Cache", "dojo/store/JsonRest",
	'xstyle/css!./PINSearch/css/PINSearch.css',
	"dojo/domReady!"
	//,'dojo/request'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domConstruct,dom, request, JSON, lang, array, on, keys, Memory, OnDemandGrid, Selection, Keyboard, GraphicsLayer, Graphic, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, graphicsUtils, FindTask, FindParameters, Extent, PINSearchTemplate,Dialog, Form, TextBox, Button,Color,
FilteringSelect,validationtextBox,checkBox,ready,parser,registry,on,Cache,JsonRest) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: PINSearchTemplate,
		baseClass: 'gis_PINSearchDijit',

		// Spatial Reference. uses the map's spatial reference if none provided
		spatialReference: null,

		// Use 0.0001 for decimal degrees (wkid 4326)
		// or 500 for meters/feet
		pointExtentSize: null,

		// default symbology for found features
		defaultSymbols: {
			point: {
				type: 'esriSMS',
				style: 'esriSMSCircle',
				size: 25,
				color: [0, 255, 255, 32],
				angle: 0,
				xoffset: 0,
				yoffset: 0,
				outline: {
					type: 'esriSLS',
					style: 'esriSLSSolid',
					color: [0, 255, 255, 255],
					width: 2
				}
			},
			polyline: {
				type: 'esriSLS',
				style: 'esriSLSSolid',
				color: [0, 255, 255, 255],
				width: 3
			},
			polygon: {
				type: 'esriSFS',
				style: 'esriSFSSolid',
				color: [0, 255, 255, 32],
				outline: {
					type: 'esriSLS',
					style: 'esriSLSSolid',
					color: [0, 255, 255, 255],
					width: 3
				}
			},
			filteringSelect:null,
			autofill_urls:null
			//,afStores:null
			//,afStore:null
		},

		postCreate: function () {
			this.inherited(arguments);

			if (this.spatialReference === null) {
				this.spatialReference = this.map.spatialReference.wkid;
			}
			if (this.pointExtentSize === null) {
				if (this.spatialReference === 4326) { // special case for geographic lat/lng
					this.pointExtentSize = 0.0001;
				} else {
					this.pointExtentSize = 500; // could be feet or meters
				}
			}

			this.createGraphicLayers();

			// allow pressing enter key to initiate the search
			this.own(on(this.searchTextDijit, 'keyup', lang.hitch(this, function (evt) {
				if (evt.keyCode === keys.ENTER) {
					this.search();
				}
			})));

			this.queryIdx = 0;

			this.autofill_urls=[];
			this.autofill_urls[0]="http://gisvm109/viewer_dev/street_name_lookup.php?";
			this.autofill_urls[1]="http://gisvm109/viewer_dev/owner_lookup.php?";
			this.autofill_urls[2]="http://gisvm109/viewer_dev/pin_lookup.php?";



            //this.afStore = Cache(JsonRest({ target : this.autofill_urls[this.queryIdx], idProperty: "id" }), Memory());

			// add an id so the queries becomes key/value pair store
			var k = 0, queryLen = this.queries.length;
			for (k = 0; k < queryLen; k++) {
				this.queries[k].id = k;
			}

			// add the queries to the drop-down list
			if (queryLen > 1) {
				var queryStore = new Memory({
					data: this.queries
				});
				this.querySelectDijit.set('store', queryStore);
				this.querySelectDijit.set('value', this.queryIdx);
			} else {
				this.querySelectDom.style.display = 'none';
			}



             this.updateAutofill();

		},
		updateAutofill: function() {
            this.inherited(arguments);
			//console.log("autofill--------------");

			if (this.filteringSelect!=null) {
				 //console.log(filteringSelect);
			}

			//lang.hitch(this, //console.log(queries[queryIdx]));

		    var afStore = Cache(JsonRest({ target : this.autofill_urls[this.queryIdx], idProperty: "id" }), Memory());

			var afStores=[];
			 for (k = 0; k < this.queries.length; k++) {

					 afStores[k]= Cache(JsonRest({ target : this.queries[k].autofill_url, idProperty: "id" }), Memory());
			 }



            //console.log(afStores[0]);
			var testStore = new Memory({data: []});

			ready(function(){

				////console.log(lang.hitch(this, 'setFilterSel'));

				//var filteringSelect = new FilteringSelect({
				this.filteringSelect = new FilteringSelect({
					id: "el_id",
					name: "el_id",
					hasDownArrow: false,
					value: "",
					autoComplete: true,
					pageSize: 4,
					//store: testStore,
					store:afStores[0],
					searchAttr: "name",
					disabled:false,
					required:false,
					scrollOnFocus:false,
					queryExpr: "${0}",
					invalidMessage:"not finding this value but, you can search it anyway",
					onKeyUp: function(value){
						 /*if(dojo.byId("el_id").value.length > 2  && dijit.byId("el_id").get("store") == testStore)
								 dijit.byId("el_id").set("store", this.afStore);
						 if(dojo.byId("el_id").value.length <= 2  && dijit.byId("el_id").get("store") == this.afStore)
								 dijit.byId("el_id").set("store", testStore);
						*/
						////console.log(this.queryIdx);
						//this.querySelectDijit.get('value')
						////console.log('onKeyUp');

						//if(dojo.byId("el_id").value.length > 1)
						//		 dijit.byId("el_id").set("store", afStores[this.queryIdx]);





					},
					onChange: function(state){
						  //dijit.byId('city').query.state = this.item.state || /.*/;
						  //console.log("changed");
					}
			}, "dijit_form_ValidationTextBox_2");
			});

		}
		,setFilterSel:function(obj){
			//this.inherited(arguments);
			//console.log("setFilterSel");

			//var afStore = Cache(JsonRest({ target : this.queries[k].autofill_url, idProperty: "id" }), Memory());
			var afStore = Cache(JsonRest({ target : this.autofill_urls[this.queryIdx], idProperty: "id" }), Memory());
			var testStore = new Memory({data: []});

 		    if (dijit.byId("el_id")) {
				//dijit.byId("el_id").set('store', testStore);
				//dijit.byId("el_id").set('value', 0);
				 this.own(on(dijit.byId("el_id"), 'keyup', lang.hitch(this, function (evt) {
					 //console.log('----KEYUP---');
					 if(dojo.byId("el_id").value.length > 2 )
					 		dijit.byId("el_id").set("store", Cache(JsonRest({ target : this.autofill_urls[this.queryIdx], idProperty: "id" }), Memory()));
					 if(dojo.byId("el_id").value.length <= 2 )
							dijit.byId("el_id").set("store", new Memory({data: []}));
			     })));
		    }

		}
		,createGraphicLayers: function () {
			var pointSymbol = null,
				polylineSymbol = null,
				polygonSymbol = null;
			var pointRenderer = null,
				polylineRenderer = null,
				polygonRenderer = null;

			var symbols = lang.mixin({}, this.symbols);
			// handle each property to preserve as much of the object heirarchy as possible
			symbols = {
				point: lang.mixin(this.defaultSymbols.point, symbols.point),
				polyline: lang.mixin(this.defaultSymbols.polyline, symbols.polyline),
				polygon: lang.mixin(this.defaultSymbols.polygon, symbols.polygon)
			};

			// points
			this.pointGraphics = new GraphicsLayer({
				id: 'findGraphics_point',
				title: 'Find'
			});

			if (symbols.point) {
				pointSymbol = new SimpleMarkerSymbol(symbols.point);
				pointRenderer = new SimpleRenderer(pointSymbol);
				pointRenderer.label = 'Find Results (Points)';
				pointRenderer.description = 'Find results (Points)';
				this.pointGraphics.setRenderer(pointRenderer);
			}

			// poly line
			this.polylineGraphics = new GraphicsLayer({
				id: 'findGraphics_line',
				title: 'Find Graphics'
			});

			if (symbols.polyline) {
				polylineSymbol = new SimpleLineSymbol(symbols.polyline);
				polylineRenderer = new SimpleRenderer(polylineSymbol);
				polylineRenderer.label = 'Find Results (Lines)';
				polylineRenderer.description = 'Find Results (Lines)';
				this.polylineGraphics.setRenderer(polylineRenderer);
			}

			// polygons
			this.polygonGraphics = new GraphicsLayer({
				id: 'findGraphics_polygon',
				title: 'Find Graphics'
			});

			if (symbols.polygon) {
				polygonSymbol = new SimpleFillSymbol(symbols.polygon);
				polygonRenderer = new SimpleRenderer(polygonSymbol);
				polygonRenderer.label = 'Find Results (Polygons)';
				polygonRenderer.description = 'Find Results (Polygons)';
				this.polygonGraphics.setRenderer(polygonRenderer);
			}

			this.map.addLayer(this.polygonGraphics);
			this.map.addLayer(this.polylineGraphics);
			this.map.addLayer(this.pointGraphics);
		},
		search: function () {
			var query = this.queries[this.queryIdx];
			var searchText = this.searchTextDijit.get('value');
			if (!query || !searchText || searchText.length === 0) {
				return;
			}
			if (query.minChars && (searchText.length < query.minChars)) {
				this.findResultsNode.innerHTML = 'You must enter at least ' + query.minChars + ' characters.';
				this.findResultsNode.style.display = 'block';
				return;
			}

			this.createResultsGrid();
			this.clearResultsGrid();
			this.clearFeatures();
			domConstruct.empty(this.findResultsNode);

/*
   require([
		"dijit/Dialog",
		"dijit/form/Form",
		"dijit/form/TextBox",
		"dijit/form/Button",
		"dojo/ready", "dojo/parser", "dijit/registry", "dojo/on",
		"dojo/domReady!"
 ], function(Dialog, Form, TextBox, Button) {
	 */
		var form = new Form();
		var dia;
/*
		new TextBox({
			id:"pVal",
			placeHolder: "Name",
			value:"beal",
			onKeyPress: function(evt){
				//console.log("searching value: " );
				if (evt.keyCode==13 ){
				   //searchProperty("address",dijit.byId('pVal').value);
				   searchProperty("address",this.value);
				}
			}
		}).placeAt(form.containerNode);

		new Button({
		  label: "Search",
		  onClick: function(){
			 // Do something:
			 //console.log("search value: " + dijit.byId('pVal').value);
			 searchProperty("address",dijit.byId('pVal').value);
			 //dom.byId("result1").innerHTML += "Thank you! ";
		  }

		}).placeAt(form.containerNode);
*/

		 pRes = new dijit.layout.ContentPane(
		  {
		   title:"Property Search Results"
		   ,content: '<div id="gridDiv" style="height:100%;width: 100%"></div>'
		   ,id:'cpPropresults'
		   ,class:"claro"
		   ,style: "height:400px;width: 99%;background-color: rgb(200,215,245);font-family:Leelawadee;font-size: xx-small;",
		  }
		  ).placeAt(form.containerNode);


		 dia = new Dialog({
			content: form,
			title: "Property Search",
			style: "width: 770px;",
			//class:"claro",
			class:'nonModal',
			draggable:true
		});
		form.startup();


		dia.resize();
		dia.show();
  //});//~require




/*	require(["dojo/dom", "dojo/request", "dojo/json",  "dojo/domReady!"],
		function(dom, request, JSON ){
*/

          function zoom2pin(pin){
			            pin=pin.trim();
			            //console.log(query);
						var findParams = new FindParameters();
						findParams.returnGeometry = true;
						findParams.layerIds = [1]; //query.layerIds;
						findParams.searchFields = ["PATPCL_PIN"];

						//findParams.layerDefs = query.layerDefs;

						findParams.searchText = pin;
						findParams.contains = false;

						 findParams.outSpatialReference = {
						 	wkid: app.map.spatialReference.wkid
						 };

                         //console.log(this.spatialReference);

						var findTask = new FindTask("http://gisvm101:6080/arcgis/rest/services/IGIS/MapServer");  //(query.url);
						////console.log(gis_PINSearchDijit);
						//findTask.execute(findParams,  'showResults');
						findTask.execute(findParams, function (results) {
							//alert("got results");
							//console.log(results);

							//console.log(results.feature);

							 							// get
							 array.forEach( results, function (result) {
							           //console.log(" processing results record");
							           //console.log(result);
							 		   var graphic, feature = result.feature;

                                       //console.log(" 2 - processing results record");

									   //var polygonGraphics = new GraphicsLayer({
									   	//			id: 'findGraphics_polygon',
									   	//			title: 'Find Graphics'
									   	//});


									    var polygonGraphics = map.getLayer("findGraphics_polygon");
                                        //console.log(polygonGraphics);

									    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
												new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
												  new Color([255, 0, 0]), 1), new Color([255, 10, 25, 0.25]));




                                       //console.log("3 - processing results record");
                                       switch (feature.geometry.type) {
											case 'point':

												break;
											case 'polyline':

												break;
											case 'polygon':
												// only add polygons to the map that have rings
												if (feature.geometry.rings && feature.geometry.rings.length > 0) {
													//console.log(" 4 - processing results record");
													graphic = new Graphic(feature.geometry, null, {
														ren: 1
													});
													graphic.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
												new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
												  new Color([255, 0, 0]), 7), new Color([255, 10, 25, 0.25])));

												  //console.log(graphic);

													polygonGraphics.add(graphic);
												}
												break;
											default:
							 		  }

                                  //console.log("5 - processing results record");
                                  app.map.addLayer(polygonGraphics);
                                  //console.log("6 - processing results record");


                                  var zoomExtent = null;
								  if ( polygonGraphics.graphics.length > 0) {
								  				if (zoomExtent === null) {
								  					zoomExtent = graphicsUtils.graphicsExtent(polygonGraphics.graphics);
								  				} else {
								  					zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(polygonGraphics.graphics));
								  				}
								  }

								  //console.log(zoomExtent);

								  if (zoomExtent) {
									    app.map.setExtent(zoomExtent.expand(1.2));
								  		//this.zoomToExtent(zoomExtent);
			                      }



							 	 }); // end array.forEach



						});  // end findTask.execute

		    }

			request.get("proxy/proxy.ashx?http://gisvm107:82/webgis2/WebGIS.asmx/PropertyQueryPaged?searchtype=address&searchString=" + searchText + "&startrec=1&endrec=15", {
				handleAs: "xml"
			}).then(function(data){

				 var result = data.documentElement;
				 var jsonr = "";
				 var xmlDoc;
				 if (document.implementation && document.implementation.createDocument) {
								jsonr = result.textContent;
				 } else if (window.ActiveXObject) {
								jsonr = result.text;
				 }
				 ////console.log("result text: " +  jsonr);

				 //dijit.byId('cpPropresults').innerHTML  = jsonr;
				 //pRes.content  =jsonr;
				 //pRes.innerHTML  = jsonr;

				 //document.getElementById('cpPropresults').innerHTML  = jsonr;
				  var jdata = JSON.parse( jsonr );

				  //console.log("records : " + jdata.start_rec + " to " + jdata.end_rec);
				  //console.log("record count : " + jdata.rec_count);
				  //console.log("sqlWhere: " + jdata.sqlWhere);


				  var data_list = [];
				  for(var i = 0; i <=jdata.ps_res.length; i++) {
					data_list.push(jdata.ps_res[i]);
				  }

				  // Begin Datagrid /////////////////////////////////
				  ///http://dojotoolkit.org/reference-guide/1.10/dojox/grid/DataGrid.html
				  require(['dojo/_base/lang', 'dojox/grid/DataGrid' , 'dojo/data/ItemFileWriteStore' , 'dijit/form/Button',  'dojo/dom' , 'dojo/domReady!'],
					  function(lang, DataGrid, ItemFileWriteStore, Button, dom){


					    var grid;



						function formatter(val){
								var w = new Button({
									label: val,
									onClick: function() {
										//console.log(val);

										// get pin value
										var index = grid.selection.selectedIndex;
										//console.log("selected row: " + index);

										var item = grid.getItem(val);
										//console.log("button pushed row: " );
										//console.log(item);
										//console.log("pin: " + item.pin[0]);

										// do something wit the pin  item.pin[0]
										//zoom2pin(item.pin[0]);
										lang.hitch(this, 'zoom2pin(' + item.pin[0] + ') ');

									}
								});
								w._destroyOnRemove=true;
								return w;
							}

						/*set up data store*/
						var data = {
						  identifier: "id",
						  items: []
						};

						for(var i = 0; i < data_list.length;   i++){
						  data.items.push(lang.mixin({ id: i+1 }, data_list[i]));
						}


						var store = new ItemFileWriteStore({data: data});

						/*set up layout*/
						var layout = [[
						  {'name': 'ID', 'field': 'id', 'width': '35px',formatter: formatter},
						  {'name': 'PIN', 'field': 'pin', 'width': '130px'},
						  {'name': 'owner', 'field': 'owner', 'width': '150px'},
						  {'name': 'addr', 'field': 'addr', 'width': '250px'},
						  {'name': 'hstead', 'field': 'hstead', 'width': '10px'},
						  {'name': 'legal', 'field': 'legal', 'width': '250px'},
						  {'name': 'lastSale', 'field': 'lastSale', 'width': '20px'}

						]];


						/*create a new grid*/
						grid = new DataGrid({
							id: 'grid',
							store: store,
							structure: layout,
							autoWidth: true,
							autoHeight: true,
							rowSelector: '20px'});

						/*append the new grid to the div*/
						grid.placeAt("gridDiv");

						/*Call startup() to render the grid*/
						grid.startup();
				});

				 // End of Datagrid /////////////////////////////////


			},
			function(error){
				//console.log( error);
			});
//		}
//	);














/*

			if (!query || !query.url || !query.layerIds || !query.searchFields) {
				return;
			}

			//create find parameters
			var findParams = new FindParameters();
			findParams.returnGeometry = true;
			findParams.layerIds = query.layerIds;
			findParams.searchFields = query.searchFields;
			findParams.layerDefs = query.layerDefs;

			findParams.searchText = searchText;
			findParams.contains = !this.containsSearchText.checked;

			findParams.outSpatialReference = {
				wkid: this.spatialReference
			};

			this.findResultsNode.innerHTML = 'Searching...';
			this.findResultsNode.style.display = 'block';

			var findTask = new FindTask(query.url);
			findTask.execute(findParams, lang.hitch(this, 'showResults'));
			*/


		},

		createResultsGrid: function () {
			if (!this.resultsStore) {
				this.resultsStore = new Memory({
					idProperty: 'id',
					data: []
				});
			}

			if (!this.resultsGrid) {
				var Grid = declare([OnDemandGrid, Keyboard, Selection]);
				this.resultsGrid = new Grid({
					selectionMode: 'single',
					cellNavigation: false,
					showHeader: true,
					store: this.resultsStore,
					columns: {
						layerName: 'Layer',
						foundFieldName: 'Field',
						value: 'Result'
					},
					sort: [{
						attribute: 'value',
						descending: false
					}]
					//minRowsPerPage: 250,
					//maxRowsPerPage: 500
				}, this.findResultsGrid);

				this.resultsGrid.startup();
				this.resultsGrid.on('dgrid-select', lang.hitch(this, 'selectFeature'));
			}
		},

		showResults: function (results) {
			/*
			var resultText = '';
			this.resultIdx = 0;
			this.results = results;

			if (this.results.length > 0) {
				var s = (this.results.length === 1) ? '' : 's';
				resultText = this.results.length + ' Result' + s + ' Found';
				this.highlightFeatures();
				this.showResultsGrid();
			} else {
				resultText = 'No Results Found';
			}
			this.findResultsNode.innerHTML = resultText;
*/
		},

		showResultsGrid: function () {
			var query = this.queries[this.queryIdx];
			//console.log(this.results);
			this.resultsGrid.store.setData(this.results);
			this.resultsGrid.refresh();

			var lyrDisplay = 'block';
			if (query.layerIds.length === 1) {
				lyrDisplay = 'none';
			}
			this.resultsGrid.styleColumn('layerName', 'display:' + lyrDisplay);

			if (query && query.hideGrid !== true) {
				this.findResultsGrid.style.display = 'block';
			}
		},

		highlightFeatures: function () {

			var unique = 0;
			array.forEach(this.results, function (result) {
				// add a unique key for the store
				result.id = unique;
				unique++;
				var graphic, feature = result.feature;
				/*
				switch (feature.geometry.type) {
				case 'point':
					// only add points to the map that have an X/Y
					if (feature.geometry.x && feature.geometry.y) {
						graphic = new Graphic(feature.geometry);
						this.pointGraphics.add(graphic);
					}
					break;
				case 'polyline':
					// only add polylines to the map that have paths
					if (feature.geometry.paths && feature.geometry.paths.length > 0) {
						graphic = new Graphic(feature.geometry);
						this.polylineGraphics.add(graphic);
					}
					break;
				case 'polygon':
					// only add polygons to the map that have rings
					if (feature.geometry.rings && feature.geometry.rings.length > 0) {
						graphic = new Graphic(feature.geometry, null, {
							ren: 1
						});
						this.polygonGraphics.add(graphic);
					}
					break;
				default:
				}
				*/

			}, this);

			// zoom to layer extent
			var zoomExtent = null;
			//If the layer is a single point then extents are null
			// if there are no features in the layer then extents are null
			// the result of union() to null extents is null

			if (this.pointGraphics.graphics.length > 0) {
				zoomExtent = this.getPointFeaturesExtent(this.pointGraphics.graphics);
			}
			if (this.polylineGraphics.graphics.length > 0) {
				if (zoomExtent === null) {
					zoomExtent = graphicsUtils.graphicsExtent(this.polylineGraphics.graphics);
				} else {
					zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(this.polylineGraphics.graphics));
				}
			}
			if (this.polygonGraphics.graphics.length > 0) {
				if (zoomExtent === null) {
					zoomExtent = graphicsUtils.graphicsExtent(this.polygonGraphics.graphics);
				} else {
					zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(this.polygonGraphics.graphics));
				}
			}

			if (zoomExtent) {
				this.zoomToExtent(zoomExtent);
			}
		},

		selectFeature: function (event) {
			var result = event.rows;

			// zoom to feature
			if (result.length) {
				var data = result[0].data;
				if (data) {
					var feature = data.feature;
					if (feature) {
						var extent = feature.geometry.getExtent();
						if (!extent && feature.geometry.type === 'point') {
							extent = this.getExtentFromPoint(feature);
						}
						if (extent) {
							this.zoomToExtent(extent);
						}
					}
				}
			}
		},

		zoomToExtent: function (extent) {
			this.map.setExtent(extent.expand(1.2));
		},

		clearResults: function () {
			//this.results = null;
			this.clearResultsGrid();
			//this.clearFeatures();
			this.searchFormDijit.reset();
			this.querySelectDijit.setValue(this.queryIdx);
			domConstruct.empty(this.findResultsNode);

			dijit.byId("el_id").set('value', '');
		},

		clearResultsGrid: function () {
			if (this.resultStore) {
				this.resultsStore.setData([]);
			}
			if (this.resultsGrid) {
				this.resultsGrid.refresh();
			}
			this.findResultsNode.style.display = 'none';
			this.findResultsGrid.style.display = 'none';
		},

		clearFeatures: function () {
			this.pointGraphics.clear();
			this.polylineGraphics.clear();
			//this.polygonGraphics.clear();
		},

		getPointFeaturesExtent: function (pointFeatures) {
			var extent = graphicsUtils.graphicsExtent(pointFeatures);
			if (extent === null && pointFeatures.length > 0) {
				extent = this.getExtentFromPoint(pointFeatures[0]);
			}

			return extent;
		},

		getExtentFromPoint: function (point) {
			var sz = this.pointExtentSize; // hack
			var pt = point.geometry;
			var extent = new Extent({
				'xmin': pt.x - sz,
				'ymin': pt.y - sz,
				'xmax': pt.x + sz,
				'ymax': pt.y + sz,
				'spatialReference': {
					wkid: this.spatialReference
				}
			});
			return extent;
		},

		_onQueryChange: function (queryIdx) {
			if (queryIdx >= 0 && queryIdx < this.queries.length) {
				this.queryIdx = queryIdx;
				//this.updateAutofill();
				//var afStore = Cache(JsonRest({ target : this.autofill_urls[this.queryIdx], idProperty: "id" }), Memory());
				//this.afStore.target=this.autofill_urls[this.queryIdx];
			    //dijit.byId("el_id").set("store",  afStore);

			    this.setFilterSel(this.queryIdx);
			}

		   //console.log("_onQueryChange--------------");
		   ////console.log(this.afStore );


			 if (this.filteringSelect!=null) {
					 //console.log(filteringSelect);
		     }


		}
	});
});