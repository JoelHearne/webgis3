define([ "dojo/_base/declare", "esri/layers/agsdynamic", "esri/tasks/geometry" ],
  function(declare) {
    return declare([esri.layers.DynamicMapServiceLayer], {
// dojo.declare("extras.EmptyLayer", [esri.layers.DynamicMapServiceLayer], {
      constructor: function(params) {
        this.params = params || {};
        this.wkid = this.params.wkid || 102100;
        this.spatialReference = new esri.SpatialReference({ wkid: this.wkid });
        // extent for contiguous US
        var ext = new esri.geometry.Extent({
          "xmin":-14325844,
          "ymin":2207331,
          "xmax":-7121642,
          "ymax":6867214,
          "spatialReference":{ "wkid": 102100 }
        });


        if ( this.wkid != ext.spatialReference.wkid ) {
			console.log("special wkid");
			console.log(this.wkid);
			console.log( ext.spatialReference.wkid);
          // project extent for contiguous US to the supplied wkid
          var gs = new esri.tasks.GeometryService("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"),
              that = this;

          gs.project([ext], this.spatialReference, function(result) {
            that.initialExtent = that.fullExtent = result[0];
            that.loaded = true;
            that.onLoad(that);
          });
        } else {
          this.initialExtent = this.fullExtent = ext;
          this.loaded = true;
          this.onLoad(this);
        }


      },
          getImageUrl: function(extent, width, height, callback) {
            var params = {
              MAP:"d:\\inetpub\\wwwroot\\ms6\\data\\pa\\map.map",
              request:"GetMap",
              SERVICE:"WMS",
              transparent:true,
              format:"image/png",
              bgcolor:"ffffff",
              version:"1.3.0",
              layers:"aerials",
              styles: "",
              //exceptions: "application/vnd.ogc.se_xml",

              //changing values
              bbox:extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
              //srs: "EPSG:" + extent.spatialReference.wkid,
              CRS:"EPSG:3857",
              width: width,
              height: height
            };

            //callback("http://sampleserver1.arcgisonline.com/arcgis/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer?" + dojo.objectToQuery(params));
            callback("http://204.49.20.75/ms/cgi/mapserv.exe?" + dojo.objectToQuery(params));
          }
    });
  }
);