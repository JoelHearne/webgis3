//define.amd.jQuery = true;
define([
	'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'gis/dijit/_FloatingWidgetMixin',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/request',
    'dojo/request/script',
    'dojo/ready', 'dojo/parser', 'dijit/registry',
    'dojo/topic',
    'dojo/number',
    'dojo/aspect',
    'dojo/keys',
	'dojo/store/Memory',
	'dojo/text!./property/templates/PropertyDialog.html',
    'dijit/form/Button',
	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'dijit/form/ToggleButton',
    'dijit/form/CheckBox',
    'dijit/form/DropDownButton',
    "dijit/form/ComboBox",
    'dijit/TooltipDialog',
    'dojo/_base/array',
    'dojo/io-query',
    'dojox/lang/functional',
    'dojo/json',
    'dojo/cookie',
    "dojo/parser",
     'dijit/form/FilteringSelect',
	'dijit/form/ValidationTextBox',
	'dojo/store/Cache', 'dojo/store/JsonRest',
    //'jquery',
	'xstyle/css!./property/css/property.css'
	 ,'dojo/domReady!'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin, domConstruct, on, lang
,dom
,Style
,request
,script
,ready,parser,registry
,topic
,number
,aspect
, keys, Memory
,template
,Button
,TabContainer
,ContentPane
,ToggleButton
,CheckBox
,DropDownButton
,ComboBox
,TooltipDialog
,array
,ioQuery
,functional
,JSON
,cookie
,parser
,FilteringSelect,validationtextBox
,Cache,JsonRest
//,$
) {

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Okaloosa County Property Search',
		html: '<a href="#">Property</a>',
		domTarget: 'propertyDijit',
		draggable: true,
		baseClass: 'propertyDijit',
		filteringSelect:null,
		filteringSelect_list:[],
		afStore_list:[],

		autofill_urls:null,
		afStore:null,
		queryIdx:0,

		postCreate: function () {
			this.inherited(arguments);

		   //$("div").click(function(){
		   //    alert("clicked p jquery");
		   //});

            //parser.parse();
			this.parentWidget.draggable = this.draggable;
			if (this.parentWidget.toggleable) {
				this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
					this.containerNode.resize();
				})));
			} else {
				var help = domConstruct.place(this.html, this.domTarget);
				on(help, 'click', lang.hitch(this.parentWidget, 'show'));
			}


            // uncomment to open at startup
            this.parentWidget.show();

		   // set autofills
          // this.setautofill("tbAddr");
          // this.setautofill("tbOwner");
          // this.setautofill("tbPIN");

           /*
           var _this=this;
		   dojo.forEach(this.queries, function(q, i){
			   // check if element exists and set autofill
			   if (registry.byId(q.inputobj_key))   _this.setautofill(q.inputobj_key);
 		   });
 		   */

		}

		,startup: function() {
		      this.inherited(arguments);

		      //this.pstartupDijit.set('value', this.pshowAtStartup);

                     // How to select a tab programmatically
               /*
		             var mainTab = dijit.byId("pSearchTabs"); //Tr
					 var subTab = dijit.byId("pResultsTab"); //tab Id which you want to show
					 mainTab.selectChild(subTab); //Show the selected Tab
					 */

					 // How to load html into contetpanel
					 /*
					 var pane1 = registry.byId("pane1");
					 //pane1.set("href", "./js/viewer/templates/help/property_search.html");
					 pane1.set("href", "./js/viewer/gis/dijit/property/templates/property_search.html");
					 //pane1.domNode.innerHTML
                */

                //this.testautofill();
			    // set the initial search form
			    //var SearchPane  = registry.byId("psearchForm");
			    // SearchPane.set("href", "./js/gis/dijit/property/templates/parcel.html");
                //SearchPane.set("href", parcel);
                //console.log("SearchPane",SearchPane);
                //SearchPane.startup();



                //var tb=registry.byId("dijit_form_ValidationTextBox_0");

                //tb.set("autocomplete", "on");
                //tb.startup();
                //console.log("tb",tb);
                //parser.parse();

			    //this.testautofill();

			    //console.log("propertyFormDijit",this.propertyFormDijit);


                // add a generic onchange event listener to the search type selection dropdown
			    var el = document.getElementById("selSearchType");
			    if (el.addEventListener) {
					el.addEventListener("change",  this.changeSearchForm, false);
				} else {
					el.attachEvent('change',  this.changeSearchForm)  ;
				}


				 this.setautofill("tbAddr");
				 this.setautofill("tbOwner");
                 this.setautofill("tbPIN");

		        return this.pshowAtStartup;
        }

      ,setautofill: function(inputobj_key) {

		            var flidx=0;
                    flidx=this.filteringSelect_list.length;

		            //var inputobj_key="tbAddr";
		            var qryidx=-1;

				    dojo.forEach(this.queries, function(q, i){
					   if (q.inputobj_key==inputobj_key) {
						   qryidx=i;

					   }
				    });

				    if (qryidx==-1) {
						console.log("error: could not find query config record: ",qryidx, " fldix:",flidx, " q.inputobj_key:",inputobj_key);

					}

				    //console.log("qryidx",qryidx, " fldix:",flidx);


		            var testStore = new Memory({ idProperty: "id",data: []});
					//this.afStore = Cache(JsonRest({ target : this.queries[qryidx].autofill_url     , idProperty: "id" }), Memory());
					var afStore = Cache(JsonRest({ target : this.queries[qryidx].autofill_url     , idProperty: "id" }), Memory());

					this.afStore_list.push(afStore);

					 var tbID="el_id_" + flidx;

					 //tbID="tbPIN";
					 //ready(function(){
						 ///this.filteringSelect
					 var fs = new FilteringSelect({
										id: tbID,
										name: tbID,
										hasDownArrow: false,
										value: "",
										autoComplete: true,
										pageSize: 10,
										store: testStore,
										//store:afStore,
										searchAttr: "name",
										disabled:false,
										required:false,
										scrollOnFocus:false,
										queryExpr: "${0}",
										invalidMessage:"not finding this value but, you can search it anyway",
										//onKeyUp: function(value){}
										//,onChange: function(state){}
								}, "widget_" + inputobj_key);
					  //});

					  this.filteringSelect_list.push(fs);
					  this.filteringSelect_list[flidx].startup();

                      //console.log("flidx",flidx);
					  //console.log("this.filteringSelect_list[flidx]",this.filteringSelect_list[flidx]);

					  dijit.byId(tbID).set("store", this.afStore_list[flidx]);
					 // dijit.byId(inputobj_key).set("store", testStore);
                      //dijit.byId(inputobj_key).set("store", this.afStore_list[flidx]);

		              var _this=this;
					  this.afStore_list[flidx].query().then(function(response) {

							testStore.setData(response.slice(0));
							registry.byId(tbID).set("store", testStore);
							// _this.own(on(dijit.byId(tbID), 'keyup', lang.hitch(_this, function (evt) {
		                    //            dijit.byId(tbID).set("store", _this.afStore_list[flidx]);
							//})));

					 });


                      if (dijit.byId(tbID)) {

 								 //document.getElementById(tbID).focus();
 								 dijit.byId( tbID).set('style', 'width:100%');
 								 dijit.byId(  tbID).set('store', testStore);
 								 //dijit.byId(tbID).set('value', '');

 								 console.log("setting evt",dijit.byId( inputobj_key));

 								 this.own(on(dijit.byId( tbID), 'keyup', lang.hitch(this, function (evt) {
                                      console.log("keyupppppp");
 									 console.log("dijit keyup", dojo.byId( tbID).value,_this.queries[qryidx].minChars);
 									 //console.log("dijit keyup dojo.byId(tbID)",dojo.byId(tbID) );

 									 if(dojo.byId( tbID).value.length > _this.queries[qryidx].minChars )
 																dijit.byId(tbID).set("store", _this.afStore_list[flidx]);

 									 if(dojo.byId( tbID).value.length <= _this.queries[qryidx].minChars )
 											dijit.byId(tbID).set("store",testStore);

 								 })));
		            }



 		}
        ,changeSearchForm:function(evt){
           console.log("changeSearchForm" );
			console.log("changeSearchForm",evt);
			var SearchPane  = registry.byId("psearchForm");

			var selForm=evt.target.value;


			if (selForm=="property") {
			 	SearchPane.set("href", "./js/gis/dijit/property/templates/parcel.html");
			} else if (selForm=="saleslist") {

			} else if (selForm=="salesdata") {

			} else if (selForm=="sub") {
				 SearchPane.set("href", "./js/gis/dijit/property/templates/sub.html");
			} else if (selForm=="business") {
				 SearchPane.set("href", "./js/gis/dijit/property/templates/business.html");
			} else if (selForm=="map") {

			}



			// need a way to impliment autosuggest on the dynamic textboxes

		}

		,getQueryObj: function(frmfldid){
			var qo="";
			console.log("getAutoFillURL",frmfldid);

			if (frmfldid=="property"){
				qo=this.queries[0];


			}

            return qo;
		}

		,onOpen: function () {
			if (!this.openOnStartup) {
				this.containerNode.resize();
			}
		},
		close: function () {
			if (this.parentWidget.hide) {
				this.parentWidget.hide();
			}
		}
		,doSearch: function(){
			console.log("doSearch");

			var tbObj = registry.byId("tbPIN");
			console.log("tbpin",tbObj);

			//this.setautofill("tbAddr");
         // this.setautofill("tbAddr");
         //  this.setautofill("tbOwner");
          // this.setautofill("tbPIN");

			//var tb = dijit.byId("tbPIN");
			//console.log("tb ",tb );

			if (registry.byId("tbPIN") && registry.byId("tbPIN").value && (registry.byId("tbPIN").value !="")){
                 console.log("pin",registry.byId("tbPIN").value);
			}



		}
		,clearSearch: function(){
			 console.log("clearSearch");
			var selSearchType = dom.byId("selSearchType");
			//console.log("selSearchType",selSearchType);

			 //this.setautofill("tbOwner");

		}

	});
});