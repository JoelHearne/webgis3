define([
	'esri/map',
	'dojo/dom',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'dojo/dom-class',
	"dojo/dom-construct",
	'dojo/on',
	'dojo/_base/array',
 //'../gis/dijit/introSplash',
	'dijit/layout/BorderContainer',
	'dijit/layout/ContentPane',
	'gis/dijit/FloatingTitlePane',
	'dojo/_base/lang',
	'dojo/text!./templates/mapOverlay.html',
	'gis/dijit/FloatingWidgetDialog',
	'put-selector',
	'dojo/aspect',
	'dojo/has',
	'dojo/topic',
	'esri/dijit/PopupMobile',
	"esri/dijit/InfoWindow",
	'dijit/Menu',
	'esri/IdentityManager'
    ,'esri/geometry/Point'
    ,'esri/geometry/Extent'

	,'../gis/dijit/mapservLayer'
], function (Map, dom, domStyle, domGeom, domClass,domConstruct , on, array
 //,introSplash
, BorderContainer, ContentPane, FloatingTitlePane, lang, mapOverlay, FloatingWidgetDialog, put, aspect, has, topic, PopupMobile, InfoWindow,Menu,IdentityManager,Point,Extent,MapservLayer) {

	return {
		legendLayerInfos: [],
		editorLayerInfos: [],
		identifyLayerInfos: [],
		layerControlLayerInfos: [],
		panes: {
			left: {
				id: 'sidebarLeft',
				placeAt: 'outer',
				collapsible: true,
				region: 'left'
			},
			center: {
				id: 'mapCenter',
				placeAt: 'outer',
				region: 'center',
				content: mapOverlay
			}
		},
		collapseButtons: {},

		startup: function (config) {
			this.config = config;
			this.mapClickMode = {
				current: config.defaultMapClickMode,
				defaultMode: config.defaultMapClickMode
			};
			// simple feature detection. kinda like dojox/mobile without the overhead
			if (has('touch') && (has('ios') || has('android') || has('bb'))) {
				has.add('mobile', true);
				if (screen.availWidth < 500 || screen.availHeight < 500) {
					has.add('phone', true);
				} else {
					has.add('tablet', true);
				}
			}
			if (config.titles) {
				this.addTitles();
			}
			this.addTopics();
			this.initPanes();

			if (config.isDebug) {
				window.app = this; //dev only
			}

            //if (config.showSplashScreen) {
               // this.showIntroSplash(false, 500, new Date().getTime());
            //}

		}
		,showIntroSplash:function(showHelp, duration, appStartTime) {
/*
			var showProgress = false;
			//var showDialog = showHelp || window.userPreferences.showWelcome;
	        var showDialog =true;
	       // if (!this.introSplash) {
				showProgress = true;
                 this.introSplash = new introSplash({
                        showAtStartup: true,
                        showStartupMetrics: true,
                        appStartTime: appStartTime,
                        devEmail: "jhearne@co.okaloosa.fl.us"
                        //,getPermissions: config.getPermissions
                        //,permissionsFile: config.permissionsFile
                });

                showDialog = this.introSplash.startup();
*/

                // Insert a Help title pane for each widget that is included and has a help link
                /*
                this.helpNode = this.introSplash.help;
                var allKeys = functional.keys(config.widgets);
                var keys = array.filter(allKeys, lang.hitch(this, function(key) {
                    var widgetCfg = config.widgets[key];
                    return (widgetCfg.hasOwnProperty('include') && widgetCfg.include && widgetCfg.hasOwnProperty('title'));
                }));
                this.numHelp = keys.length;
                this.addWidgetHelp(keys);
                */


			//}


		}
		// add topics for subscribing and publishing
		,addTopics: function () {
			// toggle a sidebar pane
			topic.subscribe('viewer/togglePane', lang.hitch(this, function (args) {
				this.togglePane(args.pane, args.show);
			}));

			// load a widget
			topic.subscribe('viewer/loadWidget', lang.hitch(this, function (args) {
				this.widgetLoader(args.options, args.position);
			}));

			// setup error handler. centralize the debugging
			if (this.config.isDebug) {
				topic.subscribe('viewer/handleError', lang.hitch(this, 'handleError'));
			}

			// set the current mapClickMode
			topic.subscribe('mapClickMode/setCurrent', lang.hitch(this, function (mode) {
				this.mapClickMode.current = mode;
				topic.publish('mapClickMode/currentSet', mode);
			}));

			// set the current mapClickMode to the default mode
			topic.subscribe('mapClickMode/setDefault', lang.hitch(this, function () {
				topic.publish('mapClickMode/setCurrent', this.mapClickMode.defaultMode);
			}));

		},
		// set titles (if any)
		addTitles: function () {
			var titles = this.config.titles;
			if (titles.header) {
				var headerTitleNode = dom.byId('headerTitleSpan');
				if (headerTitleNode) {
					headerTitleNode.innerHTML = titles.header;
				}
			}
			if (titles.subHeader) {
				var subHeaderTitle = dom.byId('subHeaderTitleSpan');
				if (subHeaderTitle) {
					subHeaderTitle.innerHTML = titles.subHeader;
				}
			}
			if (titles.pageTitle) {
				document.title = titles.pageTitle;
			}
		},
		// setup all the sidebar panes
		initPanes: function () {
			var key, panes = this.config.panes || {};
			for (key in this.panes) {
				if (this.panes.hasOwnProperty(key)) {
					panes[key] = lang.mixin(this.panes[key], panes[key]);
				}
			}

			this.panes.outer = new BorderContainer({
				id: 'borderContainerOuter',
				design: 'sidebar',
				gutters: false
			}).placeAt(document.body);

			var options, placeAt, type;
			for (key in panes) {
				if (panes.hasOwnProperty(key)) {
					options = lang.clone(panes[key]);
					placeAt = this.panes[options.placeAt] || this.panes.outer;
					options.id = options.id || key;
					type = options.type;
					delete options.placeAt;
					delete options.type;
					delete options.collapsible;
					if (placeAt) {
						if (type === 'border') {
							this.panes[key] = new BorderContainer(options).placeAt(placeAt);
						} else if (options.region) {
							this.panes[key] = new ContentPane(options).placeAt(placeAt);
						}
					}
				}
			}
			this.panes.outer.startup();
			this.initMap();

			// where to place the buttons
			// either the center map pane or the outer pane?
			this.collapseButtonsPane = this.config.collapseButtonsPane || 'outer';

			for (key in panes) {
				if (panes.hasOwnProperty(key)) {
					if (panes[key].collapsible) {
						this.collapseButtons[key] = put(this.panes[this.collapseButtonsPane].domNode, 'div.sidebarCollapseButton.sidebar' + key + 'CollapseButton.sidebarCollapseButton' + ((key === 'bottom' || key === 'top') ? 'Vert' : 'Horz') + ' div.dijitIcon.button.close').parentNode;
						on(this.collapseButtons[key], 'click', lang.hitch(this, 'togglePane', key));
						this.positionSideBarToggle(key);
						if (this.collapseButtonsPane === 'outer') {
							var splitter = this.panes[key]._splitterWidget;
							if (splitter) {
								aspect.after(splitter, '_startDrag', lang.hitch(this, 'splitterStartDrag', key));
								aspect.after(splitter, '_stopDrag', lang.hitch(this, 'splitterStopDrag', key));
							}
						}
						if (panes[key].open !== undefined) {
							this.togglePane(key, panes[key].open);
						}
					}
					if (key !== 'center' && this.panes[key]._splitterWidget) {
						domClass.add(this.map.root.parentNode, 'pane' + key);
						if (key === 'right' && this.panes.top) {
							domClass.add(this.panes.top.domNode, 'pane' + key);
						}
						if (key === 'right' && this.panes.bottom) {
							domClass.add(this.panes.bottom.domNode, 'pane' + key);
						}
						if (key === 'left' && this.panes.top) {
							domClass.add(this.panes.top.domNode, 'pane' + key);
						}
						if (key === 'left' && this.panes.bottom) {
							domClass.add(this.panes.bottom.domNode, 'pane' + key);
						}
					}
				}
			}

			// respond to media query changes
			// matchMedia works in most browsers (http://caniuse.com/#feat=matchmedia)
			if (window.matchMedia) {
				window.matchMedia('(max-width: 991px)').addListener(lang.hitch(this, 'repositionSideBarButtons'));
				window.matchMedia('(max-width: 767px)').addListener(lang.hitch(this, 'repositionSideBarButtons'));
			}

			this.panes.outer.resize();
		},
		initMap: function () {
			if (has('phone') && !this.config.mapOptions.infoWindow) {
				this.config.mapOptions.infoWindow = new PopupMobile(null, put('div'));
			}


            //this.config.mapOptions.infoWindow = new InfoWindow({}, domConstruct.create("div")).startup();

			this.map = new Map('mapCenter', this.config.mapOptions);
			if (this.config.mapOptions.basemap) {
				this.map.on('load', lang.hitch(this, 'initLayers'));
			} else {
				this.initLayers();
			}
			if (this.config.operationalLayers && this.config.operationalLayers.length > 0) {
				on.once(this.map, 'layers-add-result', lang.hitch(this, 'initWidgets'));
			} else {
				this.initWidgets();
			}
		},
		initLayers: function () {

			this.map.on('resize', function (evt) {
				var pnt = evt.target.extent.getCenter();
				setTimeout(function () {
					evt.target.centerAt(pnt);
				}, 100);
			});


			///////////////////////////////////////////////////////////////////
			// This hack is my attempt to make JSAPI mousewheel zoom behave like OpenLayers
			//   OpenLayers is way more responsive than JSAPI

            var _this=this;

			this.map.on('mouse-wheel', function (evt) {
				 if (evt.detail > 0) {
                    _this.map.setZoom(_this.map.getZoom()+_this.config.mouseWheelSensitivity)
				 } else if (evt.detail < 0) {
                    _this.map.setZoom(_this.map.getZoom()-_this.config.mouseWheelSensitivity)
				 }
			});

			///////////////////////////////////////////////////////////////////
			// This hack is my attempt to make JSAPI pan have momentum like OpenLayers
/*
            var dragStartTime=null;
            var dragStartPoint=[];
            var dragRate=0;
            var panGeoStartPoint=null;
            var isDragged=0;

			this.map.on('mouse-drag-end', function (evt) {
				 var ms=new Date() - dragStartTime;
				 var dist=Math.sqrt(Math.pow((evt.clientX - dragStartPoint[0]),2) - Math.pow((evt.clientY - dragStartPoint[1]),2));
				 dragRate=dist/ms;
				 isDragged=1;
			});

			this.map.on('mouse-drag-start', function (evt) {
				 dragStartTime=new Date();
				 dragStartPoint[0]=evt.clientX;
				 dragStartPoint[1]=evt.clientY;
				 isDragged=1;
			});


			this.map.on('pan-end', function (evt) {
				  //console.log('pan-end',evt);

			   if (isDragged==1) {
				  var panGeoEndPoint=_this.map.extent.getCenter();
				  var dX=panGeoStartPoint.x - panGeoEndPoint.x;
				  var dY=panGeoStartPoint.y - panGeoEndPoint.y;
				  var slope=dY/dX;
				  var yInt=panGeoEndPoint.y - (slope * panGeoEndPoint.x);
				  var ofsetFactor=((_this.map.extent.xmax - _this.map.extent.xmin)/ (10 - _this.config.panFloatSensitivity)) * (dragRate  );

				  // extrapolate a new point based on dragRate
				  var nX=0 ;
				  if (dX <0) {
					  nX=(panGeoEndPoint.x  + ofsetFactor) ;
				  } else {
					  nX=(panGeoEndPoint.x  - ofsetFactor) ;
				  }

				  var nY=(nX * slope) + yInt ;
				  var oX=nX-panGeoEndPoint.x;
				  var oY=nY-panGeoEndPoint.y;

                  if (nX && nY) {
				     var newPt=new Point(nX,nY, _this.map.spatialReference);
					 _this.map.centerAt(newPt);
				   }
				   isDragged=0;
               }
			});

			this.map.on('pan-start', function (evt) {
				  panGeoStartPoint=_this.map.extent.getCenter();
			});

*/

			// TODO: Add handler for map unload event to prevent memory leaks


			///////////////////////////////////////////////////////////////////
			// Placeholders for map events

			/*
			this.map.on('extent-change', function (evt) {
				 console.log('extent-change',evt);
			});

			this.map.on('key-down', function (evt) {
				 console.log('key-down',evt);
			});

			this.map.on('key-up', function (evt) {
				 console.log('key-up',evt);
			});

			this.map.on('mouse-down', function (evt) {
				 console.log('mouse-down',evt);
			});

			this.map.on('mouse-up', function (evt) {
				 console.log('mouse-up',evt);
			});


			this.map.on('mouse-drag', function (evt) {
				 console.log('mouse-drag',evt);
			});

			this.map.on('mouse-drag-end', function (evt) {
				 console.log('mouse-drag-end',evt);
			});

			this.map.on('mouse-drag-start', function (evt) {
				 console.log('mouse-drag-start',evt);
			});

			this.map.on('mouse-drag', function (evt) {
				// console.log('mouse-drag',evt);
			});
			*/


            /*
			this.map.on('unload', function (evt) {
				 console.log('unload',evt);
			});

			this.map.on('update-start', function (evt) {
				 console.log('update-start',evt);
			});

			this.map.on('zoom', function (evt) {
				 console.log('zoom',evt);
			});
			this.map.on('zoom-start', function (evt) {
				 console.log('zoom-start',evt);
			});
			this.map.on('zoom-end', function (evt) {
				 console.log('zoom-end',evt);
			});

			this.map.on('pan', function (evt) {
				 console.log('pan',evt);
			});

			*/



            ///////////////////////////////////////////////////////////////////


			this.layers = [];
			var layerTypes = {
				csv: 'CSV',
				dynamic: 'ArcGISDynamicMapService',
				feature: 'Feature',
				georss: 'GeoRSS',
				image: 'ArcGISImageService',
				kml: 'KML',
				label: 'Label', //untested
				mapimage: 'MapImage', //untested
				osm: 'OpenStreetMap',
				tiled: 'ArcGISTiledMapService',
				wms: 'WMS',
				wmts: 'WMTS' //untested
				,mapserv: 'mapservLayer' //untested
			};
			// loading all the required modules first ensures the layer order is maintained
			var modules = [];
			array.forEach(this.config.operationalLayers, function (layer) {
				var type = layerTypes[layer.type];
				//console.log("type: " + type);
				if (type) {
					if (type != 'mapservLayer') {
					   modules.push('esri/layers/' + type + 'Layer');
				    } else {
					   modules.push('./js/gis/dijit/' + type + ".js" );

					}



				} else {
					this.handleError({
						source: 'Controller',
						error: 'Layer type "' + layer.type + '"" aint supported: '
					});
				}
			}, this);
			require(modules, lang.hitch(this, function () {
				array.forEach(this.config.operationalLayers, function (layer) {
					var type = layerTypes[layer.type];
					if (type) {
						//
					if (type != 'mapservLayer') {
					   require(['esri/layers/' + type + 'Layer'], lang.hitch(this, 'initLayer', layer));
				    } else {
						 require(['./js/gis/dijit/' + type + '.js'], lang.hitch(this, 'initLayer', layer));

					}
					}
				}, this);
				this.map.addLayers(this.layers);
			}));
		},
		initLayer: function (layer, Layer) {
			var l = new Layer(layer.url, layer.options);
			this.layers.unshift(l); //unshift instead of push to keep layer ordering on map intact

			//Legend LayerInfos array
			 this.legendLayerInfos.unshift({ //unshift instead of push to keep layer ordering in legend intact
				layer: l,
				title: layer.title || null
			});


			if (layer.type === 'mapservLayer') {


			}
			//LayerControl LayerInfos array

			this.layerControlLayerInfos.unshift({ //unshift instead of push to keep layer ordering in LayerControl intact
				layer: l,
				type: layer.type,
				title: layer.title,
				controlOptions: layer.layerControlLayerInfos
			});

			if (layer.type === 'feature') {
				var options = {
					featureLayer: l
				};
				if (layer.editorLayerInfos) {
					lang.mixin(options, layer.editorLayerInfos);
				}
				this.editorLayerInfos.push(options);
			}

			if (layer.type === 'dynamic' || layer.type === 'feature') {
				var idOptions = {
					layer: l,
					title: layer.title
				};
				if (layer.identifyLayerInfos) {
					lang.mixin(idOptions, layer.identifyLayerInfos);
				}
				if (idOptions.exclude !== true) {
					this.identifyLayerInfos.push(idOptions);
				}
			}
		},
		initWidgets: function () {
			var widgets = [],
				paneWidgets;

			for (var key in this.config.widgets) {
				if (this.config.widgets.hasOwnProperty(key)) {
					var widget = lang.clone(this.config.widgets[key]);
					if (widget.include) {
						widget.position = ('undefined' !== typeof (widget.position)) ? widget.position : 10000;
						widgets.push(widget);
					}
				}
			}
			for (var pane in this.panes) {
				if (this.panes.hasOwnProperty(pane) && (pane !== 'outer' || pane !== 'center')) {
					paneWidgets = array.filter(widgets, function (widget) {
						return (widget.placeAt && widget.placeAt === pane);
					});
					paneWidgets.sort(function (a, b) {
						return a.position - b.position;
					});
					array.forEach(paneWidgets, function (widget, i) {
						this.widgetLoader(widget, i);
					}, this);
				}
			}
			paneWidgets = array.filter(widgets, function (widget) {
				return !widget.placeAt;
			});
			paneWidgets.sort(function (a, b) {
				return a.position - b.position;
			});

			array.forEach(paneWidgets, function (widget, i) {
				this.widgetLoader(widget, i);
			}, this);
		},
		togglePane: function (id, show) {
			if (!this.panes[id]) {
				return;
			}
			var domNode = this.panes[id].domNode;
			if (domNode) {
				var disp = (show && typeof (show) === 'string') ? show : (domStyle.get(domNode, 'display') === 'none') ? 'block' : 'none';
				domStyle.set(domNode, 'display', disp);
				if (this.panes[id]._splitterWidget) { // show/hide the splitter, if found
					domStyle.set(this.panes[id]._splitterWidget.domNode, 'display', disp);
				}
				this.positionSideBarToggle(id);
				if (this.panes.outer) {
					this.panes.outer.resize();
				}
			}
		},
		positionSideBarToggle: function (id) {
			var pane = this.panes[id];
			var btn = this.collapseButtons[id];
			if (!pane || !btn) {
				return;
			}
			var disp = domStyle.get(pane.domNode, 'display');
			var rCls = (disp === 'none') ? 'close' : 'open';
			var aCls = (disp === 'none') ? 'open' : 'close';
			domClass.remove(btn.children[0], rCls);
			domClass.add(btn.children[0], aCls);

			// extra management required when the buttons
			// are not in the center map pane
			if (this.collapseButtonsPane === 'outer') {
				var pos = (pane._splitterWidget) ? 0 : -1;
				var orie = (id === 'bottom' || id === 'top') ? 'h' : 'w';
				if (disp === 'block') { // pane is open
					pos += domGeom.getMarginBox(pane.domNode)[orie];
				}
				if (pane._splitterWidget) { // account for a splitter
					pos += domGeom.getMarginBox(pane._splitterWidget.domNode)[orie];
				}
				domStyle.set(btn, id, pos.toString() + 'px');
				domStyle.set(btn, 'display', 'block');
			}
		},

		repositionSideBarButtons: function () {
			var btns = ['left', 'right', 'top', 'bottom'];
			array.forEach(btns, lang.hitch(this, function (id) {
				this.positionSideBarToggle(id);
			}));
		},

		// extra management of splitters required when the buttons
		// are not in the center map pane
		splitterStartDrag: function (id) {
			var btn = this.collapseButtons[id];
			domStyle.set(btn, 'display', 'none');
		},
		splitterStopDrag: function (id) {
			this.positionSideBarToggle(id);
		},

		_createTitlePaneWidget: function (parentId, title, position, open, canFloat, placeAt) {
			var tp, options = {
					title: title || 'Widget',
					open: open || false,
					canFloat: canFloat || false
				};
			if (parentId) {
				options.id = parentId;
			}
			if (typeof (placeAt) === 'string') {
				placeAt = this.panes[placeAt];
			}
			if (!placeAt) {
				placeAt = this.panes.left;
			}
			if (placeAt) {
				options.sidebar = placeAt;
				tp = new FloatingTitlePane(options).placeAt(placeAt, position);
				tp.startup();
			}
			return tp;
		},
		_createFloatingWidget: function (parentId, title) {
			var options = {
				title: title
			};
			if (parentId) {
				options.id = parentId;
			}
			var fw = new FloatingWidgetDialog(options);
			fw.startup();
			return fw;
		},
		_createContentPaneWidget: function (parentId, title, className, region, placeAt) {
			var cp, options = {
					title: title,
					region: region || 'center'
				};
			if (className) {
				options.className = className;
			}
			if (parentId) {
				options.id = parentId;
			}
			if (!placeAt) {
				placeAt = this.panes.sidebar;
			} else if (typeof (placeAt) === 'string') {
				placeAt = this.panes[placeAt];
			}
			if (placeAt) {
				cp = new ContentPane(options).placeAt(placeAt);
				cp.startup();
			}
			return cp;
		},
		widgetLoader: function (widgetConfig, position) {
			var parentId, pnl;

			// only proceed for valid widget types
			var widgetTypes = ['titlePane', 'contentPane', 'floating', 'domNode', 'invisible', 'map'];
			if (array.indexOf(widgetTypes, widgetConfig.type) < 0) {
				this.handleError({
					source: 'Controller',
					error: 'Widget type "' + widgetConfig.type + '" (' + widgetConfig.title + ') at position ' + position + ' is not supported.'
				});
				return;
			}

			// build a titlePane or floating widget as the parent
			if ((widgetConfig.type === 'titlePane' || widgetConfig.type === 'contentPane' || widgetConfig.type === 'floating') && (widgetConfig.id && widgetConfig.id.length > 0)) {
				parentId = widgetConfig.id + '_parent';
				if (widgetConfig.type === 'titlePane') {
					pnl = this._createTitlePaneWidget(parentId, widgetConfig.title, position, widgetConfig.open, widgetConfig.canFloat, widgetConfig.placeAt);
				} else if (widgetConfig.type === 'contentPane') {
					pnl = this._createContentPaneWidget(parentId, widgetConfig.title, widgetConfig.className, widgetConfig.region, widgetConfig.placeAt);
				} else if (widgetConfig.type === 'floating') {
					pnl = this._createFloatingWidget(parentId, widgetConfig.title);
				}
				widgetConfig.parentWidget = pnl;
			}

			// 2 ways to use require to accommodate widgets that may have an optional separate configuration file
			if (typeof (widgetConfig.options) === 'string') {
				require([widgetConfig.options, widgetConfig.path], lang.hitch(this, 'createWidget', widgetConfig));
			} else {
				require([widgetConfig.path], lang.hitch(this, 'createWidget', widgetConfig, widgetConfig.options));
			}
		},
		createWidget: function (widgetConfig, options, WidgetClass) {
			// set any additional options
			options.id = widgetConfig.id + '_widget';
			options.parentWidget = widgetConfig.parentWidget;

			//replace config map, layerInfos arrays, etc
			if (options.map) {
				options.map = this.map;
			}
			if (options.mapRightClickMenu) {
				// create right-click menu
				if (!this.mapRightClickMenu) {
					this.mapRightClickMenu = new Menu({
						targetNodeIds: [this.map.root],
						selector: '.layersDiv' // restrict to map only
					});
					this.mapRightClickMenu.startup();
				}
				options.mapRightClickMenu = this.mapRightClickMenu;
			}
			if (options.mapClickMode) {
				options.mapClickMode = this.mapClickMode.current;
			}
			if (options.legendLayerInfos) {
				options.layerInfos = this.legendLayerInfos;
			}
			if (options.layerControlLayerInfos) {
				options.layerInfos = this.layerControlLayerInfos;
			}
			if (options.editorLayerInfos) {
				options.layerInfos = this.editorLayerInfos;
			}
			if (options.identifyLayerInfos) {
				options.layerInfos = this.identifyLayerInfos;
			}

			// create the widget
			var pnl = options.parentWidget;
			if ((widgetConfig.type === 'titlePane' || widgetConfig.type === 'contentPane' || widgetConfig.type === 'floating')) {
				this[widgetConfig.id] = new WidgetClass(options, put('div')).placeAt(pnl.containerNode);
			} else if (widgetConfig.type === 'domNode') {
				this[widgetConfig.id] = new WidgetClass(options, widgetConfig.srcNodeRef);
			} else {
				this[widgetConfig.id] = new WidgetClass(options);
			}

			// start up the widget
			if (this[widgetConfig.id] && this[widgetConfig.id].startup && !this[widgetConfig.id]._started) {
				this[widgetConfig.id].startup();
			}
		},
		//centralized error handler
		handleError: function (options) {
			if (this.config.isDebug) {
				if (typeof (console) === 'object') {

                     console.log("cmv-app error--------------------------");
					 console.log(arguments);
					 console.log(arguments.callee.caller);
					 console.log(arguments.callee.caller.toString());



					for (var option in options) {
						if (options.hasOwnProperty(option)) {
							console.log(option, options[option]);
						}
					}
					console.log("-------------------------------------");
				}
			} else {
				// add growler here?
				return;
			}
		}
	};
});