define([
	'esri/units',
	'esri/geometry/Extent',
	'esri/config',
	'esri/tasks/GeometryService',
	'esri/layers/ImageParameters'
], function (units, Extent, esriConfig, GeometryService, ImageParameters) {

	// url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
	esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
	esriConfig.defaults.io.alwaysUseProxy = false;
	// url to your geometry server.
	esriConfig.defaults.geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');

	//image parameters for dynamic services, set to png32 for higher quality exports.
	var imageParameters = new ImageParameters();
	imageParameters.format = 'png32';

	return {
		// used for debugging your app
		isDebug: false,

		//default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
		defaultMapClickMode: 'identify',
		// map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
		mapOptions: {
			basemap: 'satellite',
			center: [-86.59987, 30.68192],
			zoom: 10,
			sliderStyle: 'small'
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
			//url: 'http://gisvm101:6080/arcgis/rest/services/ocws/ocws/MapServer',
			url: 'http://204.49.20.75:6080/arcgis/rest/services/OCWS/ocws/MapServer',
			title: 'OCWS',
			slider: true,
			noLegend: false,
			collapsed: false,
			options: {
				id: 'IGIS',
				opacity: 0.75,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				swipe: true
			}
		}
		/*{
			type: 'feature',
			url: 'http://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/MeetUpHomeTowns/FeatureServer/0',
			title: 'STLJS Meetup Home Towns',
			options: {
				id: 'meetupHometowns',
				opacity: 1.0,
				visible: true,
				outFields: ['*'],
				mode: 0
			},
			editorLayerInfos: {
				disableGeometryUpdate: false
			}
		}, {
			type: 'feature',
			url: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0',
			title: 'San Francisco 311 Incidents',
			options: {
				id: 'sf311Incidents',
				opacity: 1.0,
				visible: true,
				outFields: ['req_type', 'req_date', 'req_time', 'address', 'district'],
				mode: 0
			}
		},*/
		/*{
			type: 'dynamic',
			url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
			title: 'Louisville Public Safety',
			slider: true,
			noLegend: false,
			collapsed: false,
			sublayerToggle: false, //true to automatically turn on sublayers
			options: {
				id: 'louisvillePubSafety',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			identifyLayerInfos: {
				layerIds: [2, 4, 5, 8, 12, 21]
			}
		},*/
      /*{
			type: 'dynamic',
			url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
			title: 'Louisville Public Safety',
			slider: true,
			noLegend: false,
			collapsed: false,
			sublayerToggle: false, //true to automatically turn on sublayers
			options: {
				id: 'louisvillePubSafety',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			identifyLayerInfos: {
				layerIds: [2, 4, 5, 8, 12, 21]
			}
		} ,*/
		/* {
			type: 'dynamic',
			url: 'http://204.49.20.75:6080/arcgis/rest/services/internet_webgis/MapServer',
			title: 'WebGIS',
			slider: true,
			noLegend: false,
			collapsed: false,
			options: {
				id: 'webgis',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				swipe: true
			}
		},
		{
					type: 'dynamic',
					url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
					title: 'parcels',
					slider: true,
					noLegend: false,
					collapsed: false,
					options: {
						id: 'parcels',
						opacity: 1.0,
						visible: true,
						imageParameters: imageParameters
					},
					layerControlLayerInfos: {
						swipe: true
					}
		} , {
					type: 'dynamic',
					url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/2013Images/MapServer',
					title: '2013Imagery',
					slider: true,
					noLegend: false,
					collapsed: false,
					options: {
						id: '2013Imagery',
						opacity: 1.0,
						visible: true,
						imageParameters: imageParameters
					},
					layerControlLayerInfos: {
						swipe: true
					}
		}*/



		],
		// set include:true to load. For titlePane type set position the the desired order in the sidebar
		widgets: {
			 help: {
				include: true,
				id: 'help',
				type: 'floating',
				path: 'gis/dijit/Help',
				title: 'Okaloosa County Map Viewer',
				options: { webgis_version:"0.92"}
			}
		 	,property: {
				include: true,
				id: 'property',
				type: 'floating',
				path: 'gis/dijit/property',
				title: 'Menu',
				options:'config/property'
				//options: { map: true }
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
			,InitZoomer : {
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

			/*
			,legend: {
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
			}
			*/

/*
			,layerControl: {
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
			}
*/
		/*	,layerControl: {
				include: true,
				id: 'layerControl',
				type: 'domNode',
				path: 'gis/dijit/LayerControl',
				srcNodeRef: 'pLayersTab',
				title: 'Layers',

				options: {
					map: true,
					layerControlLayerInfos: true,
					separated: true,
					vectorReorder: true,
					overlayReorder: true
				}
			}*/

            ,navtools: {
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
			}
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
/*
			,identify: {
				include: true,
				id: 'identify',
				type: 'titlePane',
				path: 'gis/dijit/Identify',
				title: 'Identify',
				open: false,
				position: 2,
				options: 'config/identify'
			}
			,goto: {
				include: true,
				id: 'goto',
				type: 'titlePane',
				path: 'gis/dijit/Goto',
				title: 'Go to Coordinate',
				open: false,
				position: 12,
				options: { map: true }
			}
*/
			,identify: {
				include: true,
				id: 'identify',
				type: 'floating',
				path: 'gis/dijit/Identify',
				title: 'Identify',
				options: 'config/identify'
			}
			,goto: {
				include: true,
				id: 'goto',
				type: 'floating',
				path: 'gis/dijit/Goto',
				title: 'Go to Coordinate',
				options: { map: true }
			}


            /*
			,IntroSplash : {
				include: true,
				id: 'introSplash',
				type: 'invisible',
				path: 'gis/dijit/introSplash',
				options: {}
			}
			*/




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
*/



/*





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
*/
/*
            ,userpreferences: {
                include: true,
                id: 'userPreferences',
                title: "User Preferences",
                open: false,
                type: 'titlePane',
				 path: 'gis/dijit/UserPreferences',
				 position: 13,
				 options: {
					 map: true
					 ,layerControlLayerInfos: true
				 }
		  }
*/




/*
		   ,ModBasemaps: {
				include: true,
				id: 'modbasemaps',
				title: 'ModBasemaps',
				type: 'domNode',
				//position: 13,
				path: 'gis/dijit/ModBasemaps',
				srcNodeRef: 'basemapsDijit',
				options: 'config/modbasemaps'
			}
			,ImageSlider: {
				include: true,
				id: 'imageslider',
				title: 'Image Slider',
				type: 'domNode',
				path: 'gis/dijit/ImageSlider',
				srcNodeRef: 'imagesliderDijit',
				options: 'config/modbasemaps'
			}
*/

			,mapInfo: {
				include: true,
				id: 'mapInfo',
				type: 'domNode',
				path: 'gis/dijit/MapInfo',
				srcNodeRef: 'mapInfoDijit',
				options: {
					map: true,
					//mode: 'map',
					 //mode: 'dms',
					mode: 'dec',
					firstCoord: 'y',
					unitScale: 4,
					showScale: false,
					xLabel: 'X:',
					yLabel: 'Y:',
					minWidth: 186,
                    proj4Catalog: 'EPSG', //'ESRI', 'EPSG' or 'SR-ORG' **
                    proj4Wkid: 3435 //wkid of the map ** // 4326
				}
			}

			,scalebar: {
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
			}
	/*
		   , locateButton: {
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
			}*/
		 	,overviewMap: {
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
			}
			, homeButton: {
				include: true,
				id: 'homeButton',
				type: 'domNode',
				path: 'esri/dijit/HomeButton',
				srcNodeRef: 'homeButton',
				options: {
					map: true,
					extent: new Extent({
						xmin: -86.8043,
						ymin: 30.3832,
						xmax: -86.3817,
						ymax: 31.0047 ,
						spatialReference: {
							wkid: 4326
						}
					})
				}
			}


/*
			,bookmarks: {
				include: true,
				id: 'bookmarks',
				type: 'titlePane',
				path: 'gis/dijit/Bookmarks',
				title: 'Bookmarks',
				open: false,
				position: 3,
				options: 'config/bookmarks'
			}
			*/
/*
			,find: {
				include: true,
				id: 'find',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Find',
				title: 'Find',
				open: false,
				position: 3,
				options: 'config/find'
			}
*/

/*		   ,draw: {
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
			}
*/

			,bookmarks: {
				include: true,
				id: 'bookmarks',
				type: 'floating',
				path: 'gis/dijit/Bookmarks',
				title: 'Bookmarks',

				options: 'config/bookmarks'
			}
		   ,draw: {
				include: true,
				id: 'draw',
				type: 'floating',
				path: 'gis/dijit/Draw',
				title: 'Draw',

				options: {
					map: true,
					mapClickMode: true
				}
			}
			,measure: {
				include: true,
				id: 'measurement',
				type: 'floating',
				path: 'gis/dijit/Measurement',
				title: 'Measurement',
				options: {
					map: true,
					mapClickMode: true,
					defaultAreaUnit: units.SQUARE_MILES,
					defaultLengthUnit: units.MILES
				}
			}
		/*	  ,editor: {
				include: true,
				id: 'editor',
				type: 'floating',
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


/*
			,measure: {
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
			}
*/
/*			,print: {
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
*/
			,print: {
				include: true,
				id: 'print',
				type: 'floating',
				path: 'gis/dijit/Print',
				title: 'Generate Print',
				options: {
					map: true,
					//printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					// printTaskURL: 'http://gisvm101:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					printTaskURL: 'http://204.49.20.75/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',

					copyrightText: 'Copyright 2014',
					authorText: 'OCGIS',
					defaultTitle: 'Okaloosa Map',
					defaultFormat: 'PDF',
					defaultLayout: 'Letter ANSI A Landscape'
				}
			}


			 ,basemaps: {
				include: true,
				id: 'basemaps',
				title: 'Basemaps',
				type: 'domNode',
				//position: 13,
				path: 'gis/dijit/Basemaps',
				srcNodeRef: 'basemapsDijit',
				options: 'config/basemaps'
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



			,directions: {
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
			}
*/
/*
			  ,editor: {
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
/*
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
			}
*/

			,growler: {
				include: true,
				id: 'growler',
				type: 'domNode',
				path: 'gis/dijit/Growler',
				srcNodeRef: 'growlerDijit',
				options: {}
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