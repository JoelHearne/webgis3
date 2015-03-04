define({
	map: true,
	mapClickMode: true,
	openOnStartup: true,
	mapRightClickMenu: true,
	property_mapsrvc:'http://gisvm101:6080/arcgis/rest/services/internet_webgis/MapServer',
	parcel_lyrid:1,
	pin_field:"PATPCL_PIN",
	queries: [
		{
			description: 'Find Address',
			inputobj_key:'tbAddr',
			//url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Streets_Address/MapServer',
			url:'http://gisvm101:6080/arcgis/rest/services/IGIS/MapServer',
			autofill_url:'http://gisvm109/webgis3/street_name_lookup.php?',
			//layerIds: [2],
			layerIds: [16],
			searchFields: ['SITE_ADDR'],
			minChars: 1
		} ,

       {
			description: 'Find Property by Owner',
			inputobj_key:'tbOwner',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			autofill_url:'http://gisvm109/webgis3/owner_lookup.php?',
			layerIds: [1],
			searchFields: ['OWNER_NAME'],
			minChars: 1
		},
       {
			description: 'Find Property by PIN',
			inputobj_key:'tbPIN',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			autofill_url:'http://gisvm109/webgis3/pin_lookup.php?',
			layerIds: [1],
			searchFields: ['PIN_DSP'],
			minChars: 1
		},
        {
			description: 'Find Property by Subdivision',
			inputobj_key:'tbSub',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Subdivisions/MapServer',
			autofill_url:'http://gisvm109/webgis3/sub_lookup.php?',
			layerIds: [3],
			searchFields: ['PATSUB_SUB_NAME'],
			minChars: 1
		} ,
        {
			description: 'Find Property by Business',
			inputobj_key:'tbBus',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Subdivisions/MapServer',
			autofill_url:'http://gisvm109/webgis3/bus_lookup.php?',
			layerIds: [3],
			searchFields: ['PATSUB_SUB_NAME'],
			minChars: 1
		}
	]
});