define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'esri/dijit/Bookmarks',
	'dojo/json',
	'dojo/cookie',
	'dojo/_base/lang',
	'dojo/topic',
	'xstyle/css!./Bookmarks/css/Bookmarks.css'
], function (declare, _WidgetBase, Bookmarks, json, cookie, lang,topic) {

	return declare([_WidgetBase], {
		declaredClass: 'gis.digit.Bookmarks',
		postCreate: function () {
			this.inherited(arguments);
			var bookmarks = this.bookmarks; // from the options passed in
			this.bookmarkItems = cookie('bookmarkItems');
			if (this.bookmarkItems === undefined) {
				this.bookmarkItems = [];
			} else {
				this.bookmarkItems = json.parse(this.bookmarkItems);
			}

			this.bookmarks = new Bookmarks({
				map: this.map,
				editable: this.editable,
				bookmarks: lang.mixin(this.bookmarkItems, bookmarks)
			}, this.domNode);

			this.connect(this.bookmarks, 'onEdit', 'setBookmarks');
			this.connect(this.bookmarks, 'onRemove', 'setBookmarks');

			var _this=this;
			topic.subscribe('bookmarks/showMe', lang.hitch(this, function (arg) {
				_this.showThis();
			}));
		},
		setBookmarks: function () {
			cookie('bookmarkItems', json.stringify(this.bookmarks.toJson()), {
				expires: 365
			});
		}
        ,showThis: function(){
           this.parentWidget.show();

		}
		,_export: function () {
			return json.stringify(this.bookmarks.toJson());
		}
	});
});