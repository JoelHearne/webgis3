define([
    'esri/map'
	,'esri/units'
	,'esri/geometry/Extent'
	,'esri/config'
	,'esri/tasks/GeometryService'
	,'esri/layers/ImageParameters'
	,'esri/layers/WMSLayer'
	,'esri/layers/WMSLayerInfo'
	,"esri/SpatialReference"
	,'esri/dijit/Basemap'
	,'esri/dijit/BasemapLayer'
	,'../gis/dijit/mapservLayer'
    //,'esri/layers/ArcGISTiledMapServiceLayer'
    //,'esri/map'
    //,'esri/geometry/Point'
], function (Map,units, Extent, esriConfig, GeometryService, ImageParameters, WMSLayer,WMSLayerInfo, SpatialReference,Basemap, BasemapLayer,MapservLayer ) {

	// url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
	esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
	esriConfig.defaults.io.alwaysUseProxy = true;
	// url to your geometry server.
	esriConfig.defaults.geometryService = new GeometryService('http://gisvm101:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer');

   // esri.config.defaults.map.zoomDuration = 100; //time in milliseconds; default is 500
	//esri.config.defaults.map.zoomRate = 10; //refresh rate of zoom animation; default is 25

    //esri.config.defaults.map.panDuration = 100; //time in milliseconds; default is 500
	//esri.config.defaults.map.panRate = 10; //refresh rate of zoom animation; default is 25


	//image parameters for dynamic services, set to png32 for higher quality exports.
	var imageParameters = new ImageParameters();
	imageParameters.format = 'png32';


/*
    var webLods = [
            //{ "level" : 0, "resolution" : 156543.033928, "scale" : 591657527.591555 },
            //{ "level" : 1, "resolution" : 78271.5169639999, "scale" : 295828763.795777 },
            //{ "level" : 2, "resolution" : 39135.7584820001, "scale" : 147914381.897889 },
            //{ "level" : 3, "resolution" : 19567.8792409999, "scale" : 73957190.948944 },
            //{ "level" : 4, "resolution" : 9783.93962049996, "scale" : 36978595.474472 },
            //{ "level" : 5, "resolution" : 4891.96981024998, "scale" : 18489297.737236 },
            { "level" : 6, "resolution" : 2445.98490512499, "scale" : 9244648.868618 },
            { "level" : 7, "resolution" : 1222.99245256249, "scale" : 4622324.434309 },
            { "level" : 8, "resolution" : 611.49622628138, "scale" : 2311162.217155 },
            { "level" : 9, "resolution" : 305.748113140558, "scale" : 1155581.108577 },
            { "level" : 10, "resolution" : 152.874056570411, "scale" : 577790.554289 },
            { "level" : 11, "resolution" : 76.4370282850732, "scale" : 288895.277144 },
            { "level" : 12, "resolution" : 38.2185141425366, "scale" : 144447.638572 },
            { "level" : 13, "resolution" : 19.1092570712683, "scale" : 72223.819286 },
            { "level" : 14, "resolution" : 9.55462853563415, "scale" : 36111.909643 },
            { "level" : 15, "resolution" : 4.77731426794937, "scale" : 18055.954822 },
            { "level" : 16, "resolution" : 2.38865713397468, "scale" : 9027.977411 },
            { "level" : 17, "resolution" : 1.19432856685505, "scale" : 4513.988705 },
            { "level" : 18, "resolution" : 0.597164283559817, "scale" : 2256.994353 },
            { "level" : 19, "resolution" : 0.298582141647617, "scale" : 1128.497176 }
        ];
*/
	return {
		// used for debugging your app
		isDebug: true,

		//default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
		defaultMapClickMode: 'identify',
		// map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
		mapOptions: {
		     //basemap: 'streets',
		     // basemap: 'ortho_2013',
		    // basemap:  new esri.dijit.Basemap({
			   basemap:  new  Basemap({
				id: 'ortho_2013',
				title: 'ortho_2013',
				//thumbnailUrl: '../../igis_thumb.png',
				layers: [ new  BasemapLayer({ url: "http://gisvm101:6080/arcgis/rest/services/imagery/Pictometry_2013_OrthoMosaic/MapServer" })]
			}),

			center: [-86.59987, 30.68192],
			zoom: 10
			//,spatialReference: new esri.SpatialReference({ wkid: 102100 })
			//minZoom:10,
			//maxZoom:19,
			//sliderStyle: 'small',
			//sliderPosition: "top-right",
			//lods:webLods,
            //slider: true,
			//sliderStyle: 'large'
            //,sliderLabels: webLods
		},
		// panes: {
		// 	left: {
		// 		splitter: true
		// 	},
		// 	right: {
		// 		id: 'sidebarRight',
		// 		placeAt: 'outer',
		// 		region: 'right',
		// 		splitter: true,
		// 		collapsible: true
		// 	},
		// 	bottom: {
		// 		id: 'sidebarBottom',
		// 		placeAt: 'outer',
		// 		splitter: true,
		// 		collapsible: true,
		// 		region: 'bottom'
		// 	},
		// 	top: {
		// 		id: 'sidebarTop',
		// 		placeAt: 'outer',
		// 		collapsible: true,
		// 		splitter: true,
		// 		region: 'top'
		// 	}
		// },
		// collapseButtonsPane: 'center', //center or outer

		// operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
		// The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
		// 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
		operationalLayers: [



           {
			type: 'dynamic',
			url: 'http://gisvm101:6080/arcgis/rest/services/GM/GM_Permits/MapServer',
			title: 'Eden_Permits',
			slider: true,
			noLegend: false,
			collapsed: false,
			options: {
				id: 'Eden_Permits',
				opacity: 1,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				swipe: true,
				metadataUrl: true,
				expanded: true
			}
		},
       {
			type: 'dynamic',
			url: 'http://gisvm101:6080/arcgis/rest/services/IGIS/MapServer',
			title: 'IGIS',
			slider: true,
			noLegend: false,
			collapsed: true,
			options: {
				id: 'IGIS',
				opacity: 0.75,
				visible: true,
				imageParameters: imageParameters
				//spatialReference: new esri.SpatialReference({ wkid: 102100 })
			},
			layerControlLayerInfos: {
				swipe: true,
				metadataUrl: true,
				expanded: false
			}
			//,identifyLayerInfos: { layerIds: [2, 4, 5, 8, 12, 21] }
		}



		],
		// set include:true to load. For titlePane type set position the the desired order in the sidebar
		widgets: {
			growler: {
				include: true,
				id: 'growler',
				type: 'domNode',
				path: 'gis/dijit/Growler',
				srcNodeRef: 'growlerDijit',
				options: {}
			}			 ,
			InitZoomer : {
				include: true,
				id: 'InitZoomer',
				type: 'invisible',
				path: 'gis/dijit/InitZoomer',
				//srcNodeRef: 'initParams',
				options: {
					map: true
					,layerControlLayerInfos: true
				    ,tocLayerInfos:true
				}
			}
			/*,geocoder: {
				include: true,
				id: 'geocoder',
				type: 'domNode',
				path: 'gis/dijit/Geocoder',
				srcNodeRef: 'geocodeDijit',
				options: {
					map: true,
					mapRightClickMenu: true,
					geocoderOptions: {
						autoComplete: true,
						arcgisGeocoder: {
							placeholder: 'Enter an address or place'
						}
					}
				}
			}
            navtools: {
				include: true,
				id: 'navtools',
				//type: 'titlePane',
				//canFloat: false,
			    type: 'domNode',
				srcNodeRef: 'navtoolsDijit',
				path: 'gis/dijit/NavTools',
				title: 'Navigation Tools',
				//open: false,
				//position: 0,
				//placeAt: 'right',
				options: {
					map: true,
					mapRightClickMenu: true,
					mapClickMode: true
				}
			},*/
           ,panpuck: {
				include: true,
				id: 'panpuck',
				//type: 'titlePane',
				//canFloat: false,
			    type: 'domNode',
				srcNodeRef: 'panpuckDijit',
				path: 'gis/dijit/PanPuck',
				title: 'Pan Tool',
				//open: false,
				//position: 0,
				//placeAt: 'right',
				options: {
					map: true
				}
			}

             ,share: {
                include: true,
                title: "Share the Map",
                open: true,
                id: 'share',
				type: 'titlePane',
				path: 'gis/dijit/Share',
				position: 12,
				options: {
				  map: true,
				  layerControlLayerInfos: true,
				  tocLayerInfos:true,
                  emailSubject: 'Link to Okaloosa County Map',
                  feedbackTo: 'jhearne@co.okaloosa.fl.us',
                  feedbackSubject: 'Feedback on Okaloosa County Map Viewer'
                 //help: './js/viewer/templates/help/editor.html'
			   }
            }

         /*   ,userpreferences: {
                include: true,
                id: 'userPreferences',
                title: "User Preferences",
                open: false,
                type: 'titlePane',
				 path: 'gis/dijit/UserPreferences',
				 position: 13,
				 options: {}

            }
          */


			,identify: {
				include: true,
				id: 'identify',
				type: 'titlePane',
				path: 'gis/dijit/Identify',
				title: 'Identify',
				open: false,
				position: 3,
				options: 'config/identify'
			},

			/*basemaps: {
				include: true,
				id: 'basemaps',
				title: 'Basemaps',
				type: 'domNode',
				//position: 13,
				path: 'gis/dijit/Basemaps',
				srcNodeRef: 'basemapsDijit',
				options: 'config/basemaps'
			},
			*/
			ModBasemaps: {
				include: true,
				id: 'modbasemaps',
				title: 'ModBasemaps',
				type: 'domNode',
				//position: 13,
				path: 'gis/dijit/ModBasemaps',
				srcNodeRef: 'basemapsDijit',
				options: 'config/modbasemaps'
			},
			ImageSlider: {
				include: true,
				id: 'imageslider',
				title: 'Image Slider',
				type: 'domNode',
				path: 'gis/dijit/ImageSlider',
				srcNodeRef: 'imagesliderDijit',
				options: 'config/modbasemaps'
			},



			mapInfo: {
				include: false,
				id: 'mapInfo',
				type: 'domNode',
				path: 'gis/dijit/MapInfo',
				srcNodeRef: 'mapInfoDijit',
				options: {
					map: true,
					mode: 'dms',
					firstCoord: 'y',
					unitScale: 3,
					showScale: true,
					xLabel: '',
					yLabel: '',
					minWidth: 286
				}
			},
			scalebar: {
				include: true,
				id: 'scalebar',
				type: 'map',
				path: 'esri/dijit/Scalebar',
				options: {
					map: true,
					attachTo: 'bottom-left',
					scalebarStyle: 'line',
					scalebarUnit: 'dual'
				}
			},
		    locateButton: {
				include: true,
				id: 'locateButton',
				type: 'domNode',
				path: 'gis/dijit/LocateButton',
				srcNodeRef: 'locateButton',
				options: {
					map: true,
					publishGPSPosition: true,
					highlightLocation: true,
					useTracking: true,
					geolocationOptions: {
						maximumAge: 0,
						timeout: 15000,
						enableHighAccuracy: true
					}
				}
			},
			overviewMap: {
				include: true,
				id: 'overviewMap',
				type: 'map',
				path: 'esri/dijit/OverviewMap',
				options: {
					map: true,
					attachTo: 'bottom-right',
					color: '#0000CC',
					height: 100,
					width: 125,
					opacity: 0.30,
					visible: false
					// ,baseLayer:"ortho_2013"
				}
			},
			 homeButton: {
				include: true,
				id: 'homeButton',
				type: 'domNode',
				path: 'esri/dijit/HomeButton',
				srcNodeRef: 'homeButton',
				options: {
					map: true,
					extent: new Extent({
						xmin: -180,
						ymin: -85,
						xmax: 180,
						ymax: 85,
						spatialReference: {
							wkid: 4326
						}
					})
				}
			},
			legend: {
				include: true,
				id: 'legend',
				type: 'titlePane',
				path: 'esri/dijit/Legend',
				title: 'Legend',
				open: false,
				position: 0,
				options: {
					map: true,
					legendLayerInfos: true
				}
			},
			layerControl: {
				include: true,
				id: 'layerControl',
				type: 'titlePane',
				path: 'gis/dijit/LayerControl',
				title: 'Layers',
				open: true,
				position: 0,
				options: {
					map: true,
					layerControlLayerInfos: true,
					separated: true,
					vectorReorder: true,
					overlayReorder: true
				}
			},
			bookmarks: {
				include: true,
				id: 'bookmarks',
				type: 'titlePane',
				path: 'gis/dijit/Bookmarks',
				title: 'Bookmarks',
				open: false,
				position: 2,
				options: 'config/bookmarks'
			},
			find: {
				include: true,
				id: 'find',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Find',
				title: 'Find',
				open: false,
				position: 3,
				options: 'config/find'
			},
			draw: {
				include: true,
				id: 'draw',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Draw',
				title: 'Draw',
				open: false,
				position: 4,
				options: {
					map: true,
					mapClickMode: true
				}
			},
			measure: {
				include: true,
				id: 'measurement',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Measurement',
				title: 'Measurement',
				open: false,
				position: 5,
				options: {
					map: true,
					mapClickMode: true,
					defaultAreaUnit: units.SQUARE_MILES,
					defaultLengthUnit: units.MILES
				}
			},
			print: {
				include: true,
				id: 'print',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Print',
				title: 'Print',
				open: false,
				position: 6,
				options: {
					map: true,
					//printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					printTaskURL: 'http://gisvm101:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					copyrightText: 'Copyright 2014',
					authorText: 'OCGIS',
					defaultTitle: 'Okaloosa Map',
					defaultFormat: 'PDF',
					defaultLayout: 'Letter ANSI A Landscape'
				}
			}
			/*,PINSearch: {
				include: true,
				id: 'PINSearch',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/PINSearch',
				title: 'PINSearch',
				open: false,
				position: 7,
				options: 'config/PINSearch'
			}*/
			/*
			, RelatedRecordTable: {
				include: true,
				id: 'RelatedRecordsTable',
				position: 8,
				canFloat: true,
				open: true,
				type: 'titlePane',
				path: 'gis/dijit/RelatedRecordTable',
				title: 'Related Records',
				options: 'config/relatedRecords'
			}
			*/


			/*,directions: {
				include: false,
				id: 'directions',
				type: 'titlePane',
				path: 'gis/dijit/Directions',
				title: 'Directions',
				open: false,
				position: 7,
				options: {
					map: true,
					mapRightClickMenu: true,
					options: {
						routeTaskUrl: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
						routeParams: {
							directionsLanguage: 'en-US',
							directionsLengthUnits: units.MILES
						}
					}
				}
			}*/
			/*  ,editor: {
				include: true,
				id: 'editor',
				type: 'titlePane',
				path: 'gis/dijit/Editor',
				title: 'Editor',
				open: false,
				position: 8,
				options: {
					map: true,
					mapClickMode: true,
					editorLayerInfos: true,
					settings: {
						toolbarVisible: true,
						showAttributesOnClick: true,
						enableUndoRedo: true,
						createOptions: {
							polygonDrawTools: ['freehandpolygon', 'autocomplete']
						},
						toolbarOptions: {
							reshapeVisible: true,
							cutVisible: true,
							mergeVisible: true
						}
					}
				}
			}
*/
			,streetview: {
				include: true,
				id: 'streetview',
				type: 'titlePane',
				canFloat: true,
				position: 9,
				path: 'gis/dijit/StreetView',
				title: 'Google Street View',
				options: {
					map: true,
					mapClickMode: true,
					openOnStartup: true,
					mapRightClickMenu: true
				}
			},
			help: {
				include: true,
				id: 'help',
				type: 'floating',
				path: 'gis/dijit/Help',
				title: 'Help',
				options: {}
			}

			, load_indicator : {
							include: true,
							id: 'load_indicator',
							type: 'invisible',
							path: 'gis/dijit/load_indicator',
							//srcNodeRef: 'initParams',
							options: {
								map: true
							}
			}


			/*, dnd: {
				include: true,
				id: 'dnd',
				type: 'titlePane',
				canFloat: true,
				position: 9,
				path: 'viewer/dijit/DnD/DnD',
				title: 'Drag and Drop',
				options: {
				  map: true
				}
            }
            ,nearby: {
				include: false,
				id: 'nearby',
				type: 'titlePane',
				canFloat: true,
				path: 'viewer/dijit/Nearby/Nearby',
				title: 'Nearby',
				open: false,
				position: 10,
				options: {
				  map: true,
				  mapClickMode: true
				}
			  }
			 , navhash: {
				include: true,
				id: 'navhash',
				type: 'invisible',
				path: 'viewer/dijit/MapNavigationHash/MapNavigationHash',
				title: 'Map Navigation Hash',
				options: {
				  map: true
				}
			  }
			  , gotocoord: {
			    include: true,
			    id: 'goto',
			    type: 'titlePane',
			    position: 11,
			    canFloat: true,
			    path: 'gis/dijit/Goto',
			    title: 'Go To Coordinate',
			    options: {
			      map: true
			    }
              }*/
		}
	};
});