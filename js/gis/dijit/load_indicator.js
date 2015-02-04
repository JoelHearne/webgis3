define([
	'dojo/_base/declare',
	'dojo/topic',
	'dijit/_WidgetBase',
	'dojo/dom',
	'dojo/dom-attr',
	"dojo/dom-construct",
	"dojo/_base/window",
	'dojo/on',
	'dojo/_base/lang',
	'dojox/lang/functional',
    'dojo/_base/array',
    "dojo/query",
    "dojo/ready",
	'esri/geometry/Extent',
	"dojo/domReady!"
], function ( declare,topic, _WidgetBase,dom,domAttr,domConstruct, win,  on, lang,array,Color, functional,
  array,query,ready,Extent) {
		return declare([_WidgetBase], {
        postCreate: function () {
            this.inherited(arguments);

            var img_html='<img id="wimg" src="images/ajax-loader1.gif" style="z-index:1000" width="32" height="16" alt="">';
            var n = domConstruct.create("div",{ id: "waitdiv",style: "position:absolute;left:60%;top:50%;visibility:hidden;z-index:999" }, win.body());
            dojo.place(img_html,"waitdiv");

			this.map.on('update-start', function (layer) {
				//console.log("load_indicator update-start");
				dojo.byId("waitdiv").style.visibility="visible";
				setTimeout( function(){   dojo.byId("waitdiv").style.visibility="hidden"; } , 7000);
			});
			this.map.on('update-end', function (layer) {
				//console.log("update-end");
 				dojo.byId("waitdiv").style.visibility="hidden";
			});



/*
			topic.subscribe('layerControl/setVisibleLayers', function (r) {
				console.log('-----layerControl/setVisibleLayers------'); //layer id
				console.log(r.id); //layer id
				console.log(r.visibleLayers); //array of set visible layer ids
			});
*/

        } ,
        startup: function () {
			 this.inherited(arguments);

             // this approach could be taken to display a basic init message to the user
             /*
			 var mapPoint = this.map.geographicExtent.getCenter();
			 this.map.infoWindow.setContent('<div class="loading"></div>');
             this.map.infoWindow.show(mapPoint);
             */
        }

   });  // end return
});  // end declare function