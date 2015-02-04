define({
	map: true,
	queries: [
		{
			description: 'Find Address',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Streets_Address/MapServer',
			layerIds: [2],
			searchFields: ['SITE_ADDR'],
			minChars: 2
		},
       {
			description: 'Find Property by Owner',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			layerIds: [13],
			searchFields: ['OWNER_NAME'],
			minChars: 3
		},
       {
			description: 'Find Property by PIN',
			url: 'http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer',
			layerIds: [13],
			searchFields: ['PIN_DSP'],
			minChars: 3
		}

	]
});