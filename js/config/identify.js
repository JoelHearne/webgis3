define({
	map: true,
	mapClickMode: true,
	mapRightClickMenu: true,
	identifyLayerInfos: true,
	identifyTolerance: 5,

	// config object definition:
	//	{<layer id>:{
	//		<sub layer number>:{
	//			<pop-up definition, see link below>
	//			}
	//		},
	//	<layer id>:{
	//		<sub layer number>:{
	//			<pop-up definition, see link below>
	//			}
	//		}
	//	}

	// for details on pop-up definition see: https://developers.arcgis.com/javascript/jshelp/intro_popuptemplate.html

	identifies: {
		WebGIS: {
			1: {
				title: 'Property Info',
				  mediaInfos: [

				   {
						"title": "Goto Full Parcel Detail",
						"caption": "Full Parcel Detail",
						"type": "image",
						"value": {
						  //"sourceURL": "http://gisvm109/webgis3_dev/images/happy.png",
						  "sourceURL": "http://webgis.okaloosafl.com/webgis/img/attributes_1.gif",
						  "linkURL": "http://webgis.okaloosafl.com/webgis/prc_full/prc.php?cl=paqry&pin={PIN}"
						}
				   }
				  /* ,{
					type: "piechart",
					value: {
					  fields: ["PATPCL_TAXVAL","PATPCL_ASSEDVAL","PATPCL_BLDGVAL","PATPCL_MKTLAND","PATPCL_JUSTVAL"],
					  theme: "Julie"
					}
				  }*/

 				  ],


				fieldInfos: [{
					fieldName: 'PIN',
					visible: true
				}
				,{
					fieldName: 'OWNER',
					visible: true
				}

				,{
					fieldName: 'PATPCL_ADDR1',
					label:'Address 1',
					visible: true
				}
				,{
					fieldName: 'PATPCL_ADDR2',
					label:'Address 2',
					visible: true
				}
				,{
					fieldName: 'PATPCL_ADDR3',
					label:'Address 3',
					visible: true
				}
 				,{
 					fieldName: 'PATPCL_CITY',
 					label:'City',
 					visible: true
 				}
 				,{
 					fieldName: 'PATPCL_STATE',
 					label:'State',
 					visible: true
 				}
  				,{
  					fieldName: 'PATPCL_USEDESC',
  					label:'Landuse',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_GIS_ACRE',
  					visible: true,
  					label:'GIS Acres'
  					,format: {  places: 2 }

 				}
   				,{
  					fieldName: 'PATPCL_TAXDIST',
  					label:'Tax District',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_JUSTVAL',
  					label: 'Just Value',
  					visible: true
  					, format: { places: 0, digitSeparator: true }

 				}
   				,{
  					fieldName: 'PATPCL_MKTLAND',
  					label: 'Land Value',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_BLDGVAL',
  					label: 'Building Value',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_ASSEDVAL',
  					label: 'Assessed Value',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_TAXVAL',
  					label: 'Taxable Value',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_SALEDT1',
  					label: 'Last Sale Date',
  					visible: true
 				}
   				,{
  					fieldName: 'PATPCL_SALE1',
  					label: 'Last Sale Price',
  					visible: true
  					, format: { places: 0, digitSeparator: true }
 				}


				]
			}


		}
	}
});