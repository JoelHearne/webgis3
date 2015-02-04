define([
     'esri/dijit/Basemap'
     ,'esri/dijit/BasemapLayer'
     ,'esri/layers/osm'
     ,'esri/geometry/Point'
	 ,'esri/geometry/Extent'
	 ,'esri/layers/ImageParameters'
	 ,'esri/layers/WMSLayer'
	 ,'esri/layers/WMSLayerInfo'
	 ,"esri/SpatialReference"
	 ,'../gis/dijit/mapservLayer'
], function (   Basemap, BasemapLayer, osm , Extent ,ImageParameters, WMSLayer,WMSLayerInfo, SpatialReference,MapservLayer ) {
    return {
        map: true, // needs a refrence to the map
        //mode: 'agol', //must be either 'agol' or 'custom'
         mode: 'custom', //must be either 'agol' or 'custom'
         title: 'Basemaps', // tilte for widget
         // mapStartBasemap: 'ortho_2013', // must match one of the basemap keys below
          mapStartBasemap: 'esri_streets', // must match one of the basemap keys below
          //mapStartBasemap: 'esri_imagery', // must match one of the basemap keys below
        //basemaps to show in menu. define in basemaps object below and reference by name here
        // TODO Is this array necessary when the same keys are explicitly included/excluded below?
        //basemapsToShow: ['ortho_mapserv','ortho_2013','streets', 'satellite', 'hybrid', 'topo', 'lightGray', 'gray', 'national-geographic', 'osm', 'oceans'],

 basemapsToShow: [ 'ortho_2013', 'esri_terrain','esri_streets','esri_topo','esri_imagery','nav_charts' ],

        // define all valid custom basemaps here. Object of Basemap objects. For custom basemaps, the key name and basemap id must match.
        basemaps: { // agol basemaps



           ortho_2013: {
 				title: 'ortho_2013',
 				basemap: new esri.dijit.Basemap({
 					id: 'ortho_2013',
 					title:'ortho_2013',
 					//basemapGallery:,
                     //thumbnailUrl: '../../igis_thumb.png',
 					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://gisvm101:6080/arcgis/rest/services/imagery/Pictometry_2013_OrthoMosaic/MapServer'
 					})]
 				})
            },

 /*           ortho_mapserv: {
 				title: 'ortho_mapserv',
 				basemap: new esri.dijit.Basemap({
 					id: 'ortho_mapserv',
 					title:'ortho_mapserv',
 					//basemapGallery:,
                     //thumbnailUrl: '../../igis_thumb.png',
 					layers: [new MapservLayer({ wkid: 102100 })]
 				})
            },

            ortho_mapserv: {
 				title: 'ortho_mapserv',
 				basemap: new esri.dijit.Basemap({
 					id: 'ortho_mapserv',
 					title:'ortho_mapserv',
 					//basemapGallery:,
                     //thumbnailUrl: '../../igis_thumb.png',
 					 layers: [new BasemapLayer({
					        url: "http://204.49.20.75/ms/cgi/mapserv.exe?map=d:\\inetpub\\wwwroot\\ms6\\data\\pa\\map.map",
					        options: {
					             //format: "png",
					             visibleLayers: ['aerials']
					              ,request:"GetMap",
					              SERVICE:"WMS",
					              transparent:true,
					              format:"image/png",
					              bgcolor:"ffffff",
					              version:"1.3.0",
					              layers:"aerials",
					              styles: "",
					               CRS:"EPSG:3857"

					        }
                 })]
 				})
            },
*/

          esri_terrain: {
 				title: 'esri_terrain',
 				basemap: new esri.dijit.Basemap({
 					id: 'esri_terrain',
 					title:'esri_terrain',
                      thumbnailUrl: 'igis_thumb.png',
 					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer'
 					})]
 				})
            },
          esri_streets: {
 				title: 'esri_streets',
 				basemap: new esri.dijit.Basemap({
 					id: 'esri_streets',
  					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
 					})]
 				})
            },
          esri_topo: {
 				title: 'esri_topo',
 				basemap: new esri.dijit.Basemap({
 					id: 'esri_topo',
  					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://services.arcgisonline.com/arcgis/rest/services/USA_Topo_Maps/MapServer'
 					})]
 				})
            },
          esri_imagery: {
 				title: 'esri_imagery',
 				basemap: new esri.dijit.Basemap({
 					id: 'esri_imagery',
  					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
 					})]
 				})
            },
          nav_charts: {
 				title: 'nav_charts',
 				basemap: new esri.dijit.Basemap({
 					id: 'nav_charts',
  					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://services.arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts/MapServer'
 					})]
 				})
            }
            /*,
            streets: {
                title: 'Streets'
            },
            satellite: {
                title: 'Satellite'
            },
            hybrid: {
                title: 'Hybrid'
            },
            topo: {
                title: 'Topo'
            },
            gray: {
                title: 'Gray'
            },
            oceans: {
                title: 'Oceans'
            },
            'national-geographic': {
                title: 'Nat Geo'
            },
            osm: {
                title: 'Open Street Map'
            }
          */


            // examples of custom basemaps
            /*streets: {
                title: 'Streets',
                basemap: new Basemap({
                    id: 'streets',
                    layers: [new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
                    })]
                })
            },
            satellite: {
                title: 'Satellite',
                basemap: new Basemap({
                    id: 'satellite',
                    layers: [new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                    })]
                })
            },
            hybrid: {
                title: 'Hybrid',
                basemap: new Basemap({
                    id: 'hybrid',
                    layers: [new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                    }), new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer',
                        isReference: true,
                        displayLevels: [0, 1, 2, 3, 4, 5, 6, 7]
                    }), new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
                        isReference: true,
                        displayLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                    })]
                })
            },
            lightGray: {
                title: 'Light Gray Canvas',
                basemap: new Basemap({
                    id: 'lightGray',
                    layers: [new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer'
                    }), new BasemapLayer({
                        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer',
                        isReference: true
                    })]
                })
            }*/
        }
    };
});