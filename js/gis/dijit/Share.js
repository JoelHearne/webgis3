define([
    'dojo/_base/declare',
    'dojo/topic',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dijit/Dialog',
    'dijit/Editor',
    'dijit/_editor/plugins/AlwaysShowToolbar',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/io-query',
    'dojo/dom',
    "dojo/dom-attr",
    "dojo/query",
    'dojo/parser',
    'esri/geometry/Extent',
	'esri/SpatialReference',
    'dojo/text!./Share/templates/Share.html'
], function(
    declare,topic,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Button,
    Dialog,
    Editor,
    AlwaysShowToolbar,
    lang,
    array,
    ioQuery,
    dom,
    domAttr,
    query,
    parser,
    Extent,SpatialReference,
    shareTemplate
  ) {

    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("gis/dijit/Share/css/Share.css")];
        var head = document.getElementsByTagName("head").item(0),
            link;
        for (var i = 0, il = css.length; i < il; i++) {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = css[i].toString();
            head.appendChild(link);
        }
    }());

    // main draw dijit
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: shareTemplate,
        emailSubject: 'Link to Map',
        feedbackTo: null,
        feedbackSubject: 'Feedback on Map Viewer',
        emailLink: function() {
            var link = encodeURIComponent(this.getLink() + '\r\n\r\n');
            window.open('mailto:?subject=' + this.emailSubject + '&body=' + link, '_self');
        },
        copyToClipboard: function() {
            window.prompt("Use Ctrl+C to copy this link to your Clipboard.  (Security in most browsers prevents us from putting text on your Clipboard directly.)", this.getLink());
            // var myDialog = new Dialog({
                // id: 'copyToClipboard',
                // title: 'Copy to clipboard: Ctrl+C',
                // style: 'width: 300px',
                // innerHTML: '<div id="xxx">' + this.getLink() + '</div>'
            // });
            // myDialog.startup();
            // var editor = new Editor({
                // height: '',
                // plugins: ['selectAll'],
                // extraPlugins: [AlwaysShowToolbar]
            // }, dom.byId('xxx'));
            // myDialog.show();
        },
        sendFeedback: function() {
            var link = encodeURIComponent(this.getLink() + '\r\n\r\n');
            window.open('mailto:' + this.feedbackTo + '?subject=' + this.feedbackSubject + '&body=' + link, '_self');
        },
        getLink: function() {
            // Get the URL of the viewer
            var link = window.location;

            // Format the layers as a query string
            var layerArray = [];
            //if (window.userPreferences.restoreMapLayers && window.userPreferences.restoreMapLayers.hasOwnProperty('basemap')) {
                //layerArray.push(ioQuery.objectToQuery(window.userPreferences.restoreMapLayers.basemap));

               // console.log("layerInfos");
                //console.log(this.layerInfos);


               /* console.log("--- Get Basemap-----");
                var basemp=this.map.getBasemap();
                console.log(basemp);
                layerArray.push(ioQuery.objectToQuery(this.map.getBasemap()));
                console.log("---END Get Basemap-----");
                */
            //}

                 //console.log("setting visible layers");

			  /*



           topic.subscribe('layerControl/layerToggle', lang.hitch(this, function (d) {
                //if (d.id === layer.id && !d.visible) {
					console.log("layer toggle");


            }));
*/
 					//console.log("this---------");
                    //console.log(this);
                    //console.log("------------------------------");


                    vislayers= new Array();  // this will define layer visibility for each mapservice

                    for (var li=0;li<this.layerInfos.length;li++){
	                   var lyin=this.layerInfos[li];
	                   //console.log("layerinfo---------");
	                   //console.log(lyin);

	                   vislayers[li]= new Array();

	                   //console.log("building visible layers---------");
	                   //console.log(lyin.layer.visibleLayers);

	                   for (var i=0;i<lyin.layer.visibleLayers.length;i++){
						   var vl=lyin.layer.visibleLayers[i];
						   //console.log("adding visible layer---------");
						   //console.log(vl);
						   var lyrinfo=lyin.layer.layerInfos[vl];
						   //console.log(lyrinfo);

						   //vislayers[li].push(lyrinfo.parentLayerId);
						   vislayers[li].push(vl);

                           /*
                           // This no longer works as layer groups are no longer included in visible layers list
                           var isvis=false;
						   if (!lyrinfo.subLayerIds){  // not interested in group layers
							   	   //console.log(" layer: " + vl + "   " + lyrinfo.name);

						           // is parent group layer visible?
						           if (lyrinfo.parentLayerId != -1) {
						               if (lyin.layer.visibleLayers.indexOf(lyrinfo.parentLayerId) != -1) isvis=true;  // layer is visible

						           } else { // layer is visible and there is no group/parent layer
									   isvis=true;
								   }
						   }
						   if (isvis) vislayers[li].push(vl);
						   */



 					   }
					}
			 //console.log("visible layers...");
			 //console.log(vislayers);
             //console.log(JSON.stringify(vislayers));

			 var layerqs=encodeURIComponent(JSON.stringify(vislayers));

			 link += '?' + "layers=" + layerqs


          //console.log("--- Get Extent-----");
            // Format the extent as a query string
            var extentObj, extentString = '', sRefString;
            //if (window.userPreferences.restoreMapExtent && typeof window.userPreferences.restoreMapExtent === 'object') {
                //extentObj = lang.clone(window.userPreferences.restoreMapExtent);
                extentObj = this.map.extent;
                //console.log(extentObj);
                extentString = 'extent=' + extentObj.xmin + "," + extentObj.ymin + "," + extentObj.xmax + "," + extentObj.ymax;

                //if (extentObj.spatialReference && typeof extentObj.spatialReference === 'object') {
                    //sRefString = ioQuery.objectToQuery(window.userPreferences.restoreMapExtent.spatialReference);
                    //delete extentObj.spatialReference;
                //}

                //extentString = ioQuery.objectToQuery(extentObj);
                //extentString += sRefString ? '&' + sRefString : '';
                //console.log("---END Get Extent-----");
            //}

                link += "&extent=" + extentString.length === 0 ? '' : '&' + extentString;

             //console.log(link);



      //var extnt = new Extent( -9647683.14422163,3559596.6065513063,-9644515.784861978,3561113.4038313804, new SpatialReference({ wkid:102113}));
      //this.map.setExtent(extnt);


            // TODO: Add user annotation
            return link;
        },
        createEditor: function() {
            new Editor({
                height: '',
                extraPlugins: [AlwaysShowToolbar]
            }, dom.byId('programmatic2'));
            query('#create2').orphan();
        }
    });
});