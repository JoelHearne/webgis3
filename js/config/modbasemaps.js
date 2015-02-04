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
           mapStartBasemap: 'ortho_2013', // must match one of the basemap keys below
         // mapStartBasemap: 'esri_streets', // must match one of the basemap keys below
          //mapStartBasemap: 'esri_imagery', // must match one of the basemap keys below
        //basemaps to show in menu. define in basemaps object below and reference by name here
        // TODO Is this array necessary when the same keys are explicitly included/excluded below?
        //basemapsToShow: ['ortho_mapserv','ortho_2013','streets', 'satellite', 'hybrid', 'topo', 'lightGray', 'gray', 'national-geographic', 'osm', 'oceans'],

 basemapsToShow: [ 'ortho_2013'
 //,'ortho_ms'
 ,'o_okaloosa_north_mosaic_01_1993_4800_10p','o_okaloosa_destin_mosiac_1994','o_okaloosa_north_rgb_03_2002_47p','o_okaloosa_fwb_mosiac_02_1999_5p','o_okaloosa_niceville_mosiac_02_1999_5p' ,'o_FWB_Mosaic1955_SP'
,'o_okaloosa_destin_mosiac_09_2001','o_NorthOkaloosa10_06_03','o_okaloosa_rgb_fwb_nv_05_2004_20p','o_okaloosa_rgb_04_2005_20p','o_02072007_OkaloosaBeach','o_OKaloosa_25p'
//,'flood_2009'
/*,'o_001_69765_a_RGBMosaic','o_002_69759_a_RGBMosaic','o_003_69764_b_RGBMosaic','o_004_69760_a_RGBMosaic','o_005_69761_A_RGBMosaic','o_006_69762_b_RGBMosaic','o_007_69763_A_RGBMosaic','o_008_69766_b_RGBMosaic','o_009_69767_a_RGBMosaic','o_010_69768_a_RGBMosaic','o_011_69770_b_RGBMosaic','o_012_69769_a_RGBMosaic','o_013_69771_a_RGBMosaic','o_014_69772_a_RGBMosaic','o_015_69773_a_RGBMosaic','o_016_69774_a_RGBMosaic'
*/
,'o_destin_rgb_02_2010_20p','o_fwb_rgb_02_2010_20p','o_niceville_rgb_02_2010_20p','o_mbb_10_14_2011_20p'
 //, 'esri_terrain','esri_streets','esri_topo','esri_imagery','nav_charts'
 ],

        // define all valid custom basemaps here. Object of Basemap objects. For custom basemaps, the key name and basemap id must match.
        basemaps: { // agol basemaps
           ortho_2013: {
 				title: 'Okaloosa 2013',
 				image_slider:true,
 				basemap: new esri.dijit.Basemap({
 					id: 'ortho_2013',
 					title:'ortho_2013',
 					//basemapGallery:,
                     //thumbnailUrl: '../../igis_thumb.png',
 					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://gisvm101:6080/arcgis/rest/services/imagery/Pictometry_2013_OrthoMosaic/MapServer'
 					})]
 				}),
 				//ms_url: "",
 				//ms_layers:"",
 				//ms_map:"",
 				ms_bounds:"-9666387.06023,3546184.59962,-9612343.06531,3638024.20775",
 				ms_date:"09/01/2013",
 				ms_year:"2013"
            }
       ,o_okaloosa_north_mosaic_01_1993_4800_10p: {
				title: '1993 North Okaloosa',
				basemap: new esri.dijit.Basemap({
					id: 'o_okaloosa_north_mosaic_01_1993_4800_10p',
					title:'o_okaloosa_north_mosaic_01_1993_4800_10p',
					layers: []
				}),
				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
				ms_layers:"okaloosa_north_mosaic_01_1993_4800_10p",
				ms_map:"f:\\ms\\data\\orthos\\img.map",
				ms_bounds:"-9662830.62818,3584120.23872,-9615930.34188,3633205.07314",
				ms_date:"1/1/1993",
				ms_year:"1993"
	    }

       ,o_okaloosa_destin_mosiac_1994: {
				title: '1994 Destin',
				basemap: new esri.dijit.Basemap({
					id: 'o_okaloosa_destin_mosiac_1994',
					title:'o_okaloosa_destin_mosiac_1994',
					layers: []
				}),
				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
				ms_layers:"okaloosa_destin_mosiac_1994",
				ms_map:"f:\\ms\\data\\orthos\\img.map",
				ms_bounds:"-9632432.23178,3551354.27503,-9617234.12524,3557864.36342",
				ms_date:"2/1/1994",
				ms_year:"1994"
	    }

       ,o_okaloosa_north_rgb_03_2002_47p: {
				title: '2002 North Okaloosa',
				basemap: new esri.dijit.Basemap({
					id: 'o_okaloosa_north_rgb_03_2002_47p',
					title:'o_okaloosa_north_rgb_03_2002_47p',
					layers: []
				}),
				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
				ms_layers:"okaloosa_north_rgb_03_2002_47p",
				ms_map:"f:\\ms\\data\\orthos\\img.map",
				ms_bounds:"-9664214.66895,3583934.08258,-9614456.32451,3633380.55872",
				ms_date:"3/1/2002",
				ms_year:"2002"
	    }

       ,o_okaloosa_fwb_mosiac_02_1999_5p: {
				title: '1999 Fort Walton beach',
				basemap: new esri.dijit.Basemap({
					id: 'o_okaloosa_fwb_mosiac_02_1999_5p',
					title:'o_okaloosa_fwb_mosiac_02_1999_5p',
					layers: []
				}),
				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
				ms_layers:"okaloosa_fwb_mosiac_02_1999_5p",
				ms_map:"f:\\ms\\data\\orthos\\img.map",
				ms_bounds:"-9662798.40409,3553230.4868,-9633839.65131,3568879.95308",
				ms_date:" 2/1/1999",
				ms_year:"1999"
	    }

       ,o_okaloosa_niceville_mosiac_02_1999_5p: {
				title: '1999 Niceville',
				basemap: new esri.dijit.Basemap({
					id: 'o_okaloosa_niceville_mosiac_02_1999_5p',
					title:'o_okaloosa_niceville_mosiac_02_1999_5p',
					layers: []
				}),
				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
				ms_layers:"okaloosa_niceville_mosiac_02_1999_5p",
				ms_map:"f:\\ms\\data\\orthos\\img.map",
				ms_bounds:"-9632349.3397,3560646.18257,-9617080.82608,3576523.7754",
				ms_date:"2/1/1999",
				ms_year:"1999"
	    }

      ,o_FWB_Mosaic1955_SP: {
				title: '1955 Fort Walton beach',
				basemap: new esri.dijit.Basemap({
					id: 'o_FWB_Mosaic1955_SP',
					title:'o_FWB_Mosaic1955_SP',
					layers: []
				}),
				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
				ms_layers:"FWB_Mosaic1955_SP",
				ms_map:"f:\\ms\\data\\orthos\\img.map",
				ms_bounds:"-9646889.32115,3554128.39055,-9636557.41255,3565796.82375",
				ms_date:" 4/1/1955",
				ms_year:"1955"
	    }

            /*ortho_ms: {
 				title: 'ortho_ms',
  				basemap: new esri.dijit.Basemap({
  					id: 'ortho_ms',
  					title:'ortho_ms',
  					//basemapGallery:,
                      //thumbnailUrl: '../../igis_thumb.png',
  					layers: []
 				}),
 				ms_url: "http://204.49.20.75/ms/cgi/mapserv.exe?",
 				ms_layers:"aerials",
 				ms_map:"d:\\inetpub\\wwwroot\\ms6\\data\\pa\\map.map"
            },*/

     ,  o_okaloosa_destin_mosiac_09_2001: {
 				title: '2001 Destin',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_okaloosa_destin_mosiac_09_2001',
 					title:'o_okaloosa_destin_mosiac_09_2001',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"okaloosa_destin_mosiac_09-2001.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9631868.52684,3551968.35663,-9617365.12205,3557854.7173",
 				ms_date:"09/01/2001",
 				ms_year:"2001"
 	    }

        ,o_NorthOkaloosa10_06_03: {
 				title: '2003 North Okaloosa',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_NorthOkaloosa10_06_03',
 					title:'o_NorthOkaloosa10_06_03',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"NorthOkaloosa10-06-03.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9663962.90382,3583938.2911,-9614456.99785,3633384.20548",
 				ms_date:"10/06/2003",
 				ms_year:"2003"
 	    }

        ,o_okaloosa_rgb_fwb_nv_05_2004_20p: {
 				title: '2004 Fort Walton Beach',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_okaloosa_rgb_fwb_nv_05_2004_20p',
 					title:'o_okaloosa_rgb_fwb_nv_05_2004_20p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"okaloosa_rgb_fwb_nv_05_2004_20p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9662999.45263,3552601.63185,-9615920.49488,3577607.72325",
 				ms_date:"04/01/2004",
 				ms_year:"2004"
 	    }

        ,o_okaloosa_rgb_04_2005_20p: {
 				title: '2005 Okaloosa',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_okaloosa_rgb_04_2005_20p',
 					title:'o_okaloosa_rgb_04_2005_20p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"okaloosa_rgb_04-2005_20p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9666387.06023,3546184.59962,-9612343.06531,3638024.20775",
 				ms_date:"04/16/2005",
 				ms_year:"2005"
 	    }

        ,o_02072007_OkaloosaBeach: {
 				title: '2007 Feb Coastline',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_02072007_OkaloosaBeach',
 					title:'o_02072007_OkaloosaBeach',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"02072007_OkaloosaBeach.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9678351.66187,3550046.51258,-9617514.45387,3558668.33238",
 				ms_date:"02/07/2007",
 				ms_year:"2007"
 	    }

        ,o_OKaloosa_25p: {
 				title: '2009 Okaloosa',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_OKaloosa_25p',
 					title:'o_OKaloosa_25p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"OKaloosa_25p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9665319.99484,3550981.39848,-9614253.04401,3633739.16166",
 				ms_date:"11/01/2009",
 				ms_year:"2009"
 	    }
 /*    ,flood_2009: {
 				title: '2009 Flood Response',
 				image_slider:true,
 				basemap: new esri.dijit.Basemap({
 					id: 'flood_2009',
 					title:'flood_2009',
 					//basemapGallery:,
                     //thumbnailUrl: '../../igis_thumb.png',
 					layers: [new esri.dijit.BasemapLayer({
 						url: 'http://gisvm101:6080/arcgis/rest/services/imagery/Flood_Imagery_2009/MapServer'
 					})]
 				}),
 				//ms_url: "",
 				//ms_layers:"",
 				//ms_map:"",
 				ms_bounds:"-9666387.06023,3546184.59962,-9612343.06531,3638024.20775",
 				ms_date:"04/01/2009",
 				ms_year:"2009"
 	    }
 	    */

        ,o_destin_rgb_02_2010_20p: {
 				title: '2010 Destin',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_destin_rgb_02_2010_20p',
 					title:'o_destin_rgb_02_2010_20p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"destin_rgb_02-2010_20p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9633668.99948,3551440.28757,-9615484.08471,3558161.09813",
 				ms_date:"02/23/2010",
 				ms_year:"2010"
 	    }

        ,o_fwb_rgb_02_2010_20p: {
 				title: '2010 Fort Walton Beach',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_fwb_rgb_02_2010_20p',
 					title:'o_fwb_rgb_02_2010_20p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"fwb_rgb_02-2010_20p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9664964.8344,3552736.34409,-9631991.79824,3568833.47727",
 				ms_date:"02/23/2010",
 				ms_year:"2010"
 	    }

        ,o_niceville_rgb_02_2010_20p: {
 				title: '2010 Niceville',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_niceville_rgb_02_2010_20p',
 					title:'o_niceville_rgb_02_2010_20p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"niceville_rgb_02-2010_20p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9632045.90973,3561020.34243,-9616757.85881,3574536.04093",
 				ms_date:"02/23/2010",
 				ms_year:"2010"
 	    }

        ,o_mbb_10_14_2011_20p: {
 				title: '2011 Mid-Bay Bridge',
 				basemap: new esri.dijit.Basemap({
 					id: 'o_mbb_10_14_2011_20p',
 					title:'o_mbb_10_14_2011_20p',
 					layers: []
 				}),
 				ms_url: "http://gisvm101/ms/cgi/mapserv.exe?",
 				ms_layers:"mbb_10-14-2011_20p.ecw",
 				ms_map:"f:\\ms\\data\\orthos\\img.map",
 				ms_bounds:"-9620496.12361,3561430.43502,-9617479.57528,3567386.05959",
 				ms_date:"10/14/2011",
 				ms_year:"2011"
 	    }



        }
    };
});