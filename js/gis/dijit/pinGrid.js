define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	//"dijit/_TemplatedMixin",
	//"dojo/text!./templates/AuthorWidget.html",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/mouse",
	"require" // context-sensitive require to get URLs to resources from relative paths

    ,'dojox/grid/DataGrid' , 'dojo/data/ItemFileWriteStore' , 'dijit/form/Button',  'dojo/dom' , 'dojo/domReady!'


], function(declare, _WidgetBase,
    // _TemplatedMixin, template,
    domStyle, baseFx, lang, on, mouse, require, DataGrid, ItemFileWriteStore, Button, dom){
        return declare([_WidgetBase
        //, _TemplatedMixin
        ], {

            data_list:null,
            targ_container:"gridDiv",
            baseClass: "pinGrid",
			// Our template - important!
			//templateString: template,

			// A class to be applied to the root node in our template
			//baseClass: "pinGridWidget",
            store:null,
            layout : null

			,constructor: function () {
				// initializing these properties with values in the constructor
				// ensures that they ready for use by other methods
				// (and are not null or undefined)
				console.log("constructor");
				this.data_list = [];
				//targ_container ="gridDiv";

			},
			postCreate: function(){
				console.log("postCreate");
				// Get a DOM node reference for the root of our widget
				var domNode = this.domNode;

				// Run any parent postCreate processes - can be done at any point
				this.inherited(arguments);

				// Set our DOM node's background color to white -
				// smoothes out the mouseenter/leave event animations
				//domStyle.set(domNode, "backgroundColor", this.baseBackgroundColor);

			},
			setDataStore: function (datastore) {
				//this.data_list = datastore;

				this._set("data_list", datastore);
			},
			setTargContainer: function (targ) {
				//this.targ_container = targ;

				this._set("targ_container", targ);
			},
			renderGrid: function () {
				 console.log("rendering grid");


					    var grid;


						function formatter(val){
								var w = new Button({
									label: val,
									onClick: function() {
										console.log(val);

										// get pin value
										var index = grid.selection.selectedIndex;
										console.log("selected row: " + index);

										var item = grid.getItem(val);
										console.log("button pushed row: " );
										console.log(item);
										console.log("pin: " + item.pin[0]);

										// do something wit the pin  item.pin[0]

									}
								});
								w._destroyOnRemove=true;
								return w;
							}


						var data = {
						  identifier: "id",
						  items: []
						};

						console.log('------------datalist for grid');
						console.log(this.data_list);
						console.log('------------end datalist for grid');

						for(var i = 0; i < this.data_list.length;   i++){
							console.log('   ...datalist item: ' + i);

							try {
						       data.items.push(lang.mixin({ id: i+1 }, this.data_list[i]));

						   } catch (obj) {
							   console.log('   err...');
							   console.log(obj);



						   }





						}

                        console.log("filled data store ");

						 store = new ItemFileWriteStore({data: data});


						 console.log("writing data store ");


						 layout = [[
						  {'name': 'ID', 'field': 'id', 'width': '35px',formatter: formatter},
						  {'name': 'PIN', 'field': 'pin', 'width': '130px'},
						  {'name': 'owner', 'field': 'owner', 'width': '150px'},
						  {'name': 'addr', 'field': 'addr', 'width': '250px'},
						  {'name': 'hstead', 'field': 'hstead', 'width': '10px'},
						  {'name': 'legal', 'field': 'legal', 'width': '250px'},
						  {'name': 'lastSale', 'field': 'lastSale', 'width': '20px'}

						]];

console.log("grid layout");

						grid = new DataGrid({
							id: 'grid',
							store: store,
							structure: layout,
							autoWidth: true,
							autoHeight: true,
							rowSelector: '20px'});


						console.log('------------grid');
						console.log(grid);
						console.log('------------end grid');
						console.log('------------parent');
						console.log(parent);
						console.log('------------end parent');

						 console.log(this.targ_container);
						 grid.placeAt(this.targ_container);

						grid.startup();

			}
		});
    });