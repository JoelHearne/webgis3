define([
	'dojo/_base/declare',
	'dijit/Dialog'
], function (declare, Dialog) {
	return declare([Dialog], {
		declaredClass: 'gis.dijit.FloatingWidget',
		title: 'Floating Widget',
		draggable: true,
		'class': 'floatingWidget',
        postCreate: function () {
            this.inherited(arguments);
           // console.log("FloatingWidgetDialog",arguments,this);
	    }
		,close: function () {
			this.hide();
		},
		focus: function () {}
	});
});