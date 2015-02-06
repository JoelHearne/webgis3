define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_AttachMixin',
    'dijit/_WidgetsInTemplateMixin',
    'esri/toolbars/navigation',
    'dijit/form/Button',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/text!./prc/templates/prc.html',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/request',
    'dojo/request/script',
    'dojo/ready',
    'dijit/registry',
    'xstyle/css!./prc/css/prc.css'
], function (declare, _WidgetBase, _TemplatedMixin,_AttachMixin, _WidgetsInTemplateMixin, Navigation, Button, Menu, MenuItem, PopupMenuItem, MenuSeparator, lang, on, PRCTemplate
, topic
,domConstruct
,dom
,Style
,request
,script
,ready
,registry
,topic

, css
) {
    return declare([_WidgetBase, _TemplatedMixin,  _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: PRCTemplate,
        pin:"",
        owner:"",
        address:"",
        homestead:"",
        saved:"n",
        query_type:"",
        query_str:"",
        postCreate: function(){
          //this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode', 'PanPuck')));
          //this.PanPuck.on('extent-history-change', lang.hitch(this, 'extentHistoryChangeHandler'));
        }
        ,startup: function() {
			this.inherited(arguments);

			this.pcPIN.innerHTML=this.pin;
			this.pcOwner.innerHTML=this.owner;
			this.pcAddr.innerHTML=this.address;
			this.pcHMSTD.innerHTML=this.homestead;


	    }
	    ,expand_detail:function(){
			console.log('------expand_detail' );


            // How to add a row to the card
            /*
            var tr = domConstruct.create("tr", {}, this.pcTable),
                td = domConstruct.create("td", {"colspan":"5"}, tr),
                l = domConstruct.create("label", {
                   innerHTML: 'yooooooo' + ': ',
                   'class': 'jumplistheader',
                   'for': 'yooooooo'
                }, td, 'first'),
                r = new TextBox({

                   name: 'gooooooo' ,
                   title: 'gooooooo'
                }).placeAt(td, 'last');
             */

             ///// Expand to minimal detail
             // 1- Make AJAX request to get minimal detail JSON

			var iurl = 'WebGIS.asmx/PropertyQueryMinDet?pin=' + this.pin;

            var _this=this;
            request.get(iurl,{ handleAs: "json" }).then(

                function (data){
                     console.log("got min detail results",  data);
                     _this.expand_detail_procres(data);


 	            } ,
 	            function (error){
 	                console.log("Error Occurred: " + error);
 	            }
 	        );

             // 2- Parse JSON and add additional rows

		}
		 ,expand_detail_procres:function(results){
             var _this=this;

             console.log("proc results",results);

			 var dobj=results;
			 var pobj = results ;

			 if (!pobj) {
				 console.log("error getting results",results);
			 }

			 // loop each field and add to the form



		 }
        ,tbClick: function (e) {
			//console.log('clicked tb',e);

			//if (e.target.id=='navt_n') {

        }
    });
});
