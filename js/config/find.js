define({
	map: true,
	queries: [
		{
			description: 'Find Address',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Streets_Address/MapServer',
			autofill_url:'http://gisvm109/viewer_dev/street_name_lookup.php?',
			layerIds: [2],
			searchFields: ['SITE_ADDR'],
			minChars: 2
		},
       {
			description: 'Find Property by Owner',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			autofill_url:'http://gisvm109/viewer_dev/owner_lookup.php?',
			layerIds: [13],
			searchFields: ['OWNER_NAME'],
			minChars: 1
		},
       {
			description: 'Find Property by PIN',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			autofill_url:'http://gisvm109/viewer_dev/pin_lookup.php?',
			layerIds: [13],
			searchFields: ['PIN_DSP'],
			minChars: 1
		},
        {
			description: 'Find Property by Subdivision',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Subdivisions/MapServer',
			autofill_url:'http://gisvm109/viewer_dev/sub_lookup.php?',
			layerIds: [3],
			searchFields: ['PATSUB_SUB_NAME'],
			minChars: 1
		}
	]
});