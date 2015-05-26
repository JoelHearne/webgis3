define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'esri/toolbars/navigation',
    "dojo/parser",
    'dijit/form/Button',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    //"dijit/form/Select",
    'dijit/layout/ContentPane',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/dom',
    'dojo/dom-style',
    "dojo/query",
    'dojo/_base/array',
    'dojo/text!./NavTools/templates/NavTools.html',
    'dojo/topic',
    'xstyle/css!./NavTools/css/NavTools.css'
    , "dojo/domReady!"
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Navigation,parser, Button, Menu, MenuItem, PopupMenuItem
, MenuSeparator
//,Select
,ContentPane, domConstruct, on, lang
,dom,Style,query,array, NavToolsTemplate, topic, css) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: NavToolsTemplate,
        navTools: null,
        select_on:false,
        postCreate: function(){
		  this.inherited(arguments);
		  //console.log("navtools postcreate");
          this.navTools = new Navigation(this.map);
          this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode', 'navTools')));
          //this.navTools.on('extent-history-change', lang.hitch(this, 'extentHistoryChangeHandler'));

          if (this.mapRightClickMenu) {
            this.addRightClickMenu();
            }

        }
        ,startup: function() {
			this.inherited(arguments);

			var _this=this;
			//parser.parse();
			//this.selecttool();  // Dan wants the select tool to be on by default

/*
            var sel= new Select({
				name: "selWTool",
				id: "selWTool",
				class:"selTool",
				options: [
					{ label: "Print", value: "print" }
					//,{ label: "Bookmarks", value: "bookmarks", selected: true }
					,{ label: "Bookmarks", value: "bookmarks"  }
					,{ label: "Draw", value: "draw" }
					,{ label: "Measure", value: "measure" }
					,{ label: "Identify", value: "identify" }
					,{ label: "Goto", value: "goto" }

				]
           }).placeAt(dijit.byId("ntWidgSel")).startup();
*/

            //console.log("selWTool",selWTool);

 			/*
 			topic.subscribe('NavTools/resetSel', lang.hitch(this, function (arg) {
				console.log("FYDYSMF");

				//_this.selWTool.setValue("draw");



			}));
            */
 			topic.subscribe('NavTools/resetTools', lang.hitch(this, function (arg) {
				console.log("NavTools/resetTools");

				_this.mngActiveTool("none");



			}));





		}
        ,addRightClickMenu: function () {
            //future functionality - zoom here, pan here
            // capture map right click position
            /*this.map.on('MouseDown', lang.hitch(this, function (evt) {
            //this.mapRightClickPoint = evt.mapPoint;
            }));*/

            this.menu = new Menu();
            this.menu.addChild(new MenuItem({
                label: 'Zoom In',
                onClick: lang.hitch(this, 'zoomIn')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Zoom Out',
                onClick: lang.hitch(this, 'zoomOut')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Pan',
                onClick: lang.hitch(this, 'pan')
            }));
            this.menu.addChild(new MenuSeparator());
            this.menu.addChild(new MenuItem({
                label: 'Full Extent',
                onClick: lang.hitch(this, 'fullExtent')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Previous Extent',
                onClick: lang.hitch(this, 'prevExtent')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Next Extent',
                onClick: lang.hitch(this, 'nextExtent')
            }));
            this.menu.addChild(new MenuSeparator());
            this.menu.addChild(new MenuItem({
                label: 'Deactivate',
                onClick: lang.hitch(this, 'deactivate')
            }));

            // add this widgets menu as a sub menu to the map right click menu
            this.mapRightClickMenu.addChild(new PopupMenuItem({
                label: 'Map NavTools',
                popup: this.menu
            }));
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
            if (mode !== 'navTools') {
                this.navTools.deactivate();
            }
        },
        deactivate: function () {

            /*
            this.navTools.deactivate();
            this.map.setMapCursor('default');
            this.connectMapClick();

			if (this.select_on)  this.dieselecttool();
			*/

             // turn it off to clear selection
             /*
			 this.select_on=false;
			 topic.publish('property/toggleSpatial', {mode:"point",state:this.select_on });

             // turn it back on
			 this.select_on=true;
			 topic.publish('property/toggleSpatial', {mode:"point",state:this.select_on });
			 topic.publish('identify/proxySelect', 'select');
			 */
			  topic.publish('property/clearSpatial', {mode:"clear"  });


        },
        zoomIn: function() {
			this.dieselecttool();
            this.map.setMapCursor("url('js/gis/dijit/NavTools/images/zoomin.cur'),auto");
            this.disconnectMapClick();
            this.navTools.activate(Navigation.ZOOM_IN);
            this.mngActiveTool("btn_zoomin");
        },
        zoomOut: function() {
			this.dieselecttool();
            this.map.setMapCursor("url('js/gis/dijit/NavTools/images/zoomout.cur'),auto");
            this.navTools.activate(Navigation.ZOOM_OUT);
            this.mngActiveTool("btn_zoomout");

        },
        fullExtent: function () {
            this.navTools.zoomToFullExtent();
        },
        prevExtent: function () {
            this.navTools.zoomToPrevExtent();
        },
        nextExtent: function () {
            this.navTools.zoomToNextExtent();
        }
        ,pan: function () {
			this.dieselecttool();
            this.map.setMapCursor("url('js/gis/dijit/NavTools/images/hand.cur'),auto");
            this.navTools.activate(Navigation.PAN);
            this.mngActiveTool("btn_pan");
        }
        ,identify:function(){
			this.dieselecttool();
            //this.map.setMapCursor("url('js/gis/dijit/NavTools/images/hand.cur'),auto");
            //this.map.setMapCursor('default');
            topic.publish('identify/makeActive', "button");
            this.mngActiveTool("btn_identify");

		}
		,mngActiveTool:function(actv){

			var btnids=["btn_zoomin","btn_zoomout","btn_pan","btn_identify","btn_selbox","btn_selpoint"];

			var idx=btnids.indexOf(actv);
			//console.log("idx",idx);

			if (idx > -1) {
				btnids.splice( idx, 1);
			}

			//console.log("btnids",btnids);

			for(var i=0;i < btnids.length; i++) {
				dom.byId(btnids[i]).style.setProperty('background-color', 'rgb(230, 230, 230)', "important");
            }

            if (actv !="none")
                 dom.byId(actv).style.setProperty('background-color', 'rgba(187, 7, 7,0.2)', "important");




			//var b_id=document.getElementById("btn_identify");
			//console.log("identidy button active ", this.btn_identify );

			//psr.style.setProperty("height", calc_ht + 'px', "important");

			//b_id.class="identifyIcon_active";

            //background-image: url(../images/selected_on/identify.png);

            //Style.set(this.btn_identify , 'background-image', 'url(../images/selected_on/identify.png)');
            //dojo.query("button", dangerButton.domNode).attr("style", {width:"500px"}));

            //dijit dijitReset dijitInline dijitButton
            //dijitReset dijitInline dijitButtonNode
            //dijitReset dijitStretch dijitButtonContents
            //dijitReset dijitInline dijitIcon identifyIcon

			//var tcpc=  query(".dijit .dijitReset .dijitInline .dijitButton",this.btn_identify);
			//var tcpc=  dojo.query(".dijitButton",dom.byId("btn_identify") );

			//Style.set(dom.byId("btn_identify") , 'border-color', 'rgb(187, 7, 7) rgb(187, 7, 7) rgb(168, 8, 8)');
			//Style.set(dom.byId("btn_identify") , 'display', 'hidden !important');

			 //dom.byId("btn_identify").style.setProperty('border-color', 'rgb(187, 7, 7)', "important");
			 //dom.byId("btn_identify").style.setProperty('background-color', 'rgba(187, 7, 7,0.2)', "important");
             //dom.byId("btn_identify").style.setProperty('width', '100px', "important");

/*

			var tcpc=  dojo.query("*",dom.byId("btn_identify") );

		   console.log("button element ",tcpc);
		   tcpc.forEach(function(node){

				console.log("button node ",node);
			}).style("border-color",  "rgb(187, 7, 7) rgb(187, 7, 7) rgb(168, 8, 8)");
*/
			//border-color: rgb(187, 7, 7) rgb(187, 7, 7) rgb(168, 8, 8);



		}
        ,dieselecttool:function(){

			 this.connectMapClick();
			 this.select_on=false;
             topic.publish('property/toggleSpatial', {mode:"point",state:this.select_on });
			 //this.map.setMapCursor('default');




		}
        ,selecttool: function (e) {
			//if (!this.select_on) {
				this.select_on=true;
				this.navTools.deactivate();
				topic.publish('property/toggleSpatial', {mode:"point",state:this.select_on });
				this.mngActiveTool("btn_selpoint");



				//topic.publish('identify/proxySelect', 'select');
				//this.map.setMapCursor('pointer');
				//this.navTools.activate(Navigation.PAN);
		    /*} else {
				this.select_on=false;
                topic.publish('property/toggleSpatial', {mode:"point",state:this.select_on });
				this.map.setMapCursor('default');
			}*/

        },
        selectboxtool: function (e) {
			//if (!this.select_on) {
  				this.select_on=true;
				topic.publish('property/toggleSpatial', {mode:"box",state:this.select_on });
				topic.publish('identify/proxySelect', 'select');
				this.mngActiveTool("btn_selbox");
		    /*} else {
				this.select_on=false;
                topic.publish('property/toggleSpatial', {mode:"box",state:this.select_on });
				this.map.setMapCursor('default');
			}*/
        },
        selectbeta: function(){

			topic.publish('draw/showMe', "button");


		}
        ,selectbeta2: function(){

			//topic.publish('measure/showMe', "button");
			//topic.publish('bookmarks/showMe', "button");
			topic.publish('identify/showMe', "button");
			//topic.publish('goto/showMe', "button");
			//topic.publish('print/showMe', "button");

		}
		,selectToolWdgt:function(e){
			 //console.log("selectToolWdgt",e.target.value,e.target);

			 if (e.target.value=="print") topic.publish('print/showMe', "sel");
			 if (e.target.value=="bookmarks") topic.publish('bookmarks/showMe', "sel");
			 if (e.target.value=="draw") topic.publish('draw/showMe', "sel");
			 if (e.target.value=="measure") topic.publish('measure/showMe', "sel");
			 if (e.target.value=="identify") topic.publish('identify/showMe', "sel");
             if (e.target.value=="goto") topic.publish('goto/showMe', "sel");
             if (e.target.value=="editor") topic.publish('editor/showMe', "sel");

             e.target.value="";

             //document.getElementById("selWTool").value = "";
             //document.getElementById("selWTool").selectedIndex = 1;
             //document.getElementById("selWTool").options[0].selected = true;
             //this.selWTool.set("displayedValue", "");
            // topic.publish('NavTools/resetSel', "sel");


		}
        ,disconnectMapClick: function() {
            // cmv 1.3.0
            topic.publish('mapClickMode/setCurrent', 'navTools');
            // cmv v1.2.0
            // this.mapClickMode.current = 'nav';
            // ESRI sample
            // dojo.disconnect(this.mapClickEventHandle);
            // this.mapClickEventHandle = null;
        },

        connectMapClick: function() {
            // cmv 1.3.0
            topic.publish('mapClickMode/setDefault');
            // cmv v1.2.0
            // this.mapClickMode.current = this.mapClickMode.defaultMode;
            // ESRI sample
            // if (this.mapClickEventHandle === null) {
            //     this.mapClickEventHandle = dojo.connect(this.map, 'onClick', this.mapClickEventListener);
            // }
        },

        extentHistoryChangeHandler: function (evt) {
           //registry.byId('zoomprev').disabled = navTools.isFirstExtent();
           //registry.byId('zoomnext').disabled = navTools.isLastExtent();
           //this.deactivate();
            //this.connectMapClick();
        }
    });
});
