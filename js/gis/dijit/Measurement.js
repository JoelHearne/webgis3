define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',
    'gis/dijit/_FloatingWidgetMixin',
    'esri/dijit/Measurement',
    'dojo/aspect',
    'dojo/_base/lang',
    'dojo/dom-construct',
	'dojo/dom',
    'dojo/dom-style',
    'dojo/topic'
    ,"dijit/form/Button"
    , "dojo/domReady!"
], function (declare, _WidgetBase, _WidgetsInTemplateMixin, _FloatingWidgetMixin, Measurement, aspect, lang, domConstruct,dom,Style, topic,Button) {
    return declare([_WidgetBase, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
        widgetsInTemplate: true,
		title: 'Measure Tool',
		//html: '<a href="#">Draw</a>',
		html: '',
		domTarget: 'measureDijit',
		draggable: true,
		//baseClass: 'gis_DrawDijit',

        declaredClass: 'gis.dijit.Measurement',
        mapClickMode: null,
        clearbtn:null,
        postCreate: function () {
            this.inherited(arguments);
            this.measure = new Measurement({
                map: this.map,
                defaultAreaUnit: this.defaultAreaUnit,
                defaultLengthUnit: this.defaultLengthUnit
            }, domConstruct.create('div')).placeAt(this.domNode);


		    var _this=this;
		    this.measure.on("measure-start", function(evt){
			   _this.measure_start();
		    });
            this.measure.startup();
            aspect.after(this.measure, 'setTool', lang.hitch(this, 'checkMeasureTool'));
            aspect.after(this.measure, 'closeTool', lang.hitch(this, 'checkMeasureTool'));
            //aspect.after(this.measure, 'measure-start', lang.hitch(this, 'measure_start'));

            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));
            if (this.parentWidget && this.parentWidget.toggleable) {
                this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                    this.onLayoutChange(this.parentWidget.open);
                    topic.publish('property/toggleSpatial', {mode:"box",state:false });
                })));
            }
        },
		startup: function() {
			this.inherited(arguments);
            /*
            try {
               document.getElementById('dijit_layout_ContentPane_2').style="font-size:20px;font-weight:bold;text-shadow: 0 0 0.2em blue, 0 0 0.2em yellow,0 0 0.2em green;";
		       //console.log("changed style ",document.getElementById('dijit_layout_ContentPane_2'));
		    } catch (ex){
			   //console.log("error setting measurement style",ex);
		    }
		    */
			var _this=this;
			topic.subscribe('measure/showMe', lang.hitch(this, function (arg) {
				_this.showThis();
			}));
 	    }
        ,showThis: function(){
           this.parentWidget.show();
           this.parentWidget.set('style', 'margin:15px;width:' + (this.parentWidget.domNode.offsetWidth + 150) + 'px;height:' + (this.parentWidget.domNode.offsetHeight + 50) + 'px');
           //this.parentWidget.set('style', 'left:0px');

           // turn off any selection tools or any other tools
           topic.publish('property/toggleSpatial', {mode:"point",state:false });

           // TODO: prevent selection from getting cleared so user can measure the selection
           // TODO: remember what tool was active before measure started and toggle it back on after measure finishes

		}
	   , measure_start:function(){
			////console.log("...measure_start ",this.measure);
			//topic.publish('property/toggleSpatial', {mode:"box",state:false });
			//this.map.setMapCursor('default');
			this.measure.resultValue.style="font-size:20px;font-weight:bold;text-shadow: 0 0 0.2em blue, 0 0 0.2em yellow,0 0 0.2em green;";
            /*
            try {
               document.getElementById('dijit_layout_ContentPane_2').style="font-size:20px;font-weight:bold;text-shadow: 0 0 0.2em blue, 0 0 0.2em yellow,0 0 0.2em green;";
		       //console.log("changed style ",document.getElementById('dijit_layout_ContentPane_2'));
		    } catch (ex){
			   //console.log("error setting measurement style",ex);
		    }
		    */
		    var _this=this;
            if (this.clearbtn==null) {
				 this.clearbtn = new Button({
					label: "Clear",
					style:"float:right;font-size:smaller !important;",
					onClick: function(){
						 _this.clearMeasurement();
						 //lang.hitch(this, "clearMeasurement");
					}
			});
			this.clearbtn.placeAt(this.parentWidget);
			this.clearbtn.startup()
		    }
		}
       , checkMeasureTool: function () {
            // no measurement tool is active
            if (!this.measure.activeTool || this.measure.activeTool === '') {
                if (this.mapClickMode === 'measure') {
                    this.connectMapClick();
                }
                // a measurement tool is active
            } else {
                if (this.mapClickMode !== 'measure') {
                    this.disconnectMapClick();
                }
            }
            /*
            try {
               document.getElementById('dijit_layout_ContentPane_2').style="font-size:20px;font-weight:bold;text-shadow: 0 0 0.2em blue, 0 0 0.2em yellow,0 0 0.2em green;";
		       ////console.log("changed style ",document.getElementById('dijit_layout_ContentPane_2'));
		    } catch (ex){
			   //console.log("error setting measurement style",ex);
		    }
		    */
		  //   this.resultValue.set("style","font-size:20px;font-weight:bold;text-shadow: 0 0 0.2em blue, 0 0 0.2em yellow,0 0 0.2em green;");
        },
        disconnectMapClick: function () {
            topic.publish('mapClickMode/setCurrent', 'measure');
        },
        connectMapClick: function () {
            topic.publish('mapClickMode/setDefault');
        },
        onLayoutChange: function (open) {
            // end measurement on close of title pane
            if (!open && this.mapClickMode === 'measure') {
                this.connectMapClick();
            }
        },
        clearMeasurement: function (mode) {
           this.measure.clearResult();
        }
        ,setMapClickMode: function (mode) {
            this.mapClickMode = mode;
            if (mode !== 'measure') {
                this.measure.setTool('area', false);
                this.measure.setTool('distance', false);
                this.measure.setTool('location', false);
                this.measure.clearResult();
            }
        }
    });
});