define({
	map: true,
	mapClickMode: true,
	openOnStartup: false,
	mapRightClickMenu: true,
	legendLayerInfos: true,
	layerControlLayerInfos:true,
	property_mapsrvc:'http://204.49.20.75/arcgis/rest/services/internet_webgis/MapServer',
	parcel_lyrid:14,
	pin_field:"PATPCL_PIN",
	queries: [
		{
			description: 'Find Address',
			inputobj_key:'tbAddr',
			//url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Streets_Address/MapServer',
			url:'http://204.49.20.75/arcgis/rest/services/IGIS/MapServer',
			autofill_url:'http://webgis.okaloosafl.com/webgis/street_name_lookup.php?',
			//layerIds: [2],
			layerIds: [27],
			searchFields: ['SITE_ADDR'],
			minChars: 1
		} ,

       {
			description: 'Find Property by Owner',
			inputobj_key:'tbOwner',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			autofill_url:'http://webgis.okaloosafl.com/webgis/owner_lookup.php?',
			layerIds: [14],
			searchFields: ['OWNER_NAME'],
			minChars: 1
		},
       {
			description: 'Find Property by PIN',
			inputobj_key:'tbPIN',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			autofill_url:'http://webgis.okaloosafl.com/webgis/pin_lookup.php?',
			layerIds: [14],
			searchFields: ['PIN_DSP'],
			minChars: 1
		},
        {
			description: 'Find Property by Subdivision',
			inputobj_key:'tbSub',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Subdivisions/MapServer',
			autofill_url:'http://webgis.okaloosafl.com/webgis/sub_lookup.php?',
			layerIds: [16],
			searchFields: ['PATSUB_SUB_NAME'],
			minChars: 1
		} ,
        {
			description: 'Find Property by Business',
			inputobj_key:'tbBus',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Subdivisions/MapServer',
			autofill_url:'http://webgis.okaloosafl.com/webgis/bus_lookup.php?',
			layerIds: [3],
			searchFields: ['PATSUB_SUB_NAME'],
			minChars: 1
		}
	]
});