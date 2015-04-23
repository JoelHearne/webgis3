define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/_base/lang'
	,,"dojox/layout/ResizeHandle"
], function (
	 declare, on, lang
     //,ResizeHandle
  ) {
	return declare(null, {

		postCreate: function () {
			this.inherited(arguments);

			//var rz = new ResizeHandle();
			// console.log("_FloatingWidgetMixin ",arguments,this);

			//on(rz.resizeHandle, "touchstart", "_init);

		}
		,startup: function () {
			//console.log("_FloatingWidgetMixin",this);
			// var parentWidget = this.getParent();
			if (this.parentWidget && this.parentWidget.declaredClass === 'gis.dijit.FloatingWidget' && this.onOpen) {
				on(this.parentWidget, 'show', lang.hitch(this, 'onOpen'));
			}
			if (this.parentWidget && this.parentWidget.declaredClass === 'gis.dijit.FloatingWidget' && this.onClose) {
				on(this.parentWidget, 'hide', lang.hitch(this, 'onClose'));
			}
			if (this.parentWidget && this.parentWidget.declaredClass === 'gis.dijit.FloatingWidget' && this.openOnStartup) {
				this.parentWidget.show();
			}
			this.inherited(arguments);
		}
	});
});