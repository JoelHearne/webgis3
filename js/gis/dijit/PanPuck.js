define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'esri/toolbars/navigation',
    'dijit/form/Button',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/text!./PanPuck/templates/PanPuck.html',
    'dojo/topic',
    'xstyle/css!./PanPuck/css/PanPuck.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Navigation, Button, Menu, MenuItem, PopupMenuItem, MenuSeparator, lang, on, PanPuckTemplate, topic, css) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: PanPuckTemplate,
        postCreate: function(){
          //this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode', 'PanPuck')));
          //this.PanPuck.on('extent-history-change', lang.hitch(this, 'extentHistoryChangeHandler'));
        }  ,
        pan: function (e) {
			if (e.target.id=='navt_n') {
				this.map.panUp();
			} else if (e.target.id=='navt_s') {
				this.map.panDown();
			} else if (e.target.id=='navt_e') {
				this.map.panRight();
			} else if (e.target.id=='navt_w') {
				this.map.panLeft();
			} else if (e.target.id=='navt_nw') {
				this.map.panUpperLeft();
			} else if (e.target.id=='navt_ne') {
				this.map.panUpperRight();
			} else if (e.target.id=='navt_sw') {
				this.map.panLowerLeft();
			} else if (e.target.id=='navt_se') {
				this.map.panLowerRight();
			}
        }
    });
});
