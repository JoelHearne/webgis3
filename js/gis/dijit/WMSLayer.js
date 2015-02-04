define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/array',
'dojo/on',
'dojo/keys',
'dijit/TooltipDialog',
'dijit/popup',
'put-selector',
'dijit/_WidgetBase',
'dijit/_TemplatedMixin',
'dijit/_WidgetsInTemplateMixin',
'dojo/text!./WMSLayer/templates/WMSLayer.html',
'xstyle/css!./WMSLayer/css/WMSLayer.css',
'esri/layers/WMSLayer',
'esri/config',
'dijit/form/Button',
'dijit/form/TextBox',
'dijit/form/Select'
], function(declare, lang, array, on, keys, TooltipDialog, popup, put, proj4, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, css, WMSLayer, esriConfig) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    widgetsInTemplate: true,
    templateString: template,
    baseClass: 'gis_WMSLayerDijit',
    postCreate: function() {
      this.inherited(arguments);
      this.setupConnections();
    },
    setupConnections: function() {
        this.addButton.on('click', lang.hitch(this, 'addWMSLayer'));
    },
    handleCoordInput: function(evt) {
      if (evt.charOrCode === keys.ENTER) {
        this.addWMSLayer();
        return;
      }
    },
    addWMSLayer: function() {
      esriConfig.defaults.io.proxyUrl = "http://gisvm109/viewer_dev/proxy/proxy.ashx";
      var wmsLayerUrl = this.wmsLayerTextBox.get('value');
      var numberOfLayer = this.numberOfLayerTextBox.get('value');
      var wmsLayer = new WMSLayer(wmsLayerUrl, {
        id:"addedWMSLayer",
        format: "png",
        visibleLayers: [numberOfLayer]
      });
      this.map.addLayer(wmsLayer);
    }
  });
});