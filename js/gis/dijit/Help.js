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
    'dojo/_base/fx',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/request',
    'dojo/request/script',
    'dojo/topic',
    'dojo/number',
    'dojo/aspect',
	'dojo/text!./Help/templates/HelpDialog.html',
    'dijit/form/Button',
	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'dijit/form/ToggleButton',
    'dijit/form/CheckBox',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dojo/_base/array',
    'dojo/io-query',
    'dojox/lang/functional',
    'dojo/json',
    'dojo/cookie',
    //'jquery',
	'xstyle/css!./Help/css/Help.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin, domConstruct, on, lang
,baseFx
,dom
,Style
,request
,script
,topic
,number
,aspect
,template
,Button
,TabContainer
,ContentPane
,ToggleButton
,CheckBox
,DropDownButton
,TooltipDialog
,array
,ioQuery
,functional
,JSON
,cookie
//,$
) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Okaloosa County Map Viewer',
		html: '<a href="#">Help</a>',
		domTarget: 'helpDijit',
		draggable: true,
		baseClass: 'helpDijit',
		hasCookie: false,
		userPreferenceDefaults:null,
		userPreferences:null,
        cookieObj:null,
        timelineWidth: 190,
        summaryColor: '#FF0000',
        timelineColors: ['#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'],
        showAtStartup: true,
        showStartupMetrics: true,
        getPermissions: false,
        permissionsFile: null,
        permissionsGroup: 'Public',
        progressDijitOpen: false,
        progressIds: ['total_startup_time'],
        progressLabels: ['Total Startup Time'],
        activePublishers: [],
        startTimes: {},
        endTimes: {},
        totalTimeNode: null,
        appStartTime: null,
        appEndTime: null,
        startTimeInitialized: false,
        removePublisherDelay: 1000,
        closeProgressDelay: 20000,
        fadeTime: 1000,
        devEmail: null,
		postCreate: function () {
			this.inherited(arguments);

		    //$("div").click(function(){
		    //    alert("clicked p jquery");
		    //});
			this.parentWidget.draggable = this.draggable;
			if (this.parentWidget.toggleable) {
				this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
					this.containerNode.resize();
				})));
			} else {
				var help = domConstruct.place(this.html, this.domTarget);
				on(help, 'click', lang.hitch(this.parentWidget, 'show'));
			}
			// show on startup as splashscreen
			//lang.hitch(this.parentWidget, 'show')
            this.userPreferenceDefaults= {
			            showWelcome: false
			            ,showStartupMetrics: true
			            ,showCoordinates: true
			            ,disclaimer:false
            };
            // Get the saved user preferences from the cookie
            this.cookieObj = cookie('userPreferences');
            if (this.cookieObj === undefined) {
                this.cookieObj = this.userPreferenceDefaults;
                this.userPreferences =this.userPreferenceDefaults;
            } else {
                this.cookieObj = JSON.parse(this.cookieObj);
                this.userPreferences =this.cookieObj;
                this.hasCookie=true;
            }

            if (!this.hasCookie)
                 this._writeCookie();

             //console.log("this.userPreferences",this.userPreferences);

            // uncomment to open at startup
            if (this.userPreferences.showWelcome || !this.checkDisclaimer() ) {
				this.parentWidget.show();
				// show disclaimer if not agreed to
				if (!this.checkDisclaimer()) dijit.byId("hHelpTabs").selectChild(dijit.byId("hDisclaimerTab"));
		    } else if (!this.userPreferences.showWelcome ||  this.checkDisclaimer() ) {
				this.parentWidget.hide();
		    } else {
				this.parentWidget.hide();
			}
			 on(this.parentWidget, 'hide', lang.hitch(this, 'close'));

			 this.vers_str.textContent="version " + this.webgis_version;

			 ////console.log("help parent widget",this.parentWidget);

			 //dijit.byId("discbtn").set('style', "color:red;background-color:blue");

			 //dijit.byId("discbtn").set('style', "color:red;background-color:blue");

            //var offst_top=document.body.clientHeight - this.parentWidget.domNode.offsetHeight -5;
            //var offst_top=document.body.clientHeight - this.parentWidget.domNode.offsetHeight -5;
            //this.parentWidget.set('style', 'left:' + offst_left + 'px !important;top:42px !important;position:absolute');
            var offst_top=85;
			this.parentWidget.set('style', 'top:' + offst_top + 'px');

		}, startup: function() {
		            this.inherited(arguments);
		            // uncomment to open at startup
		            // Set the startup checkboxes to agree with the parameters
		            /*
		            this.startupMetricsDijit.set('value', this.showStartupMetrics);
		            this.startupMetricsDijit.set('checked', this.showStartupMetrics);

		            this.startupDijit.set('value', this.showAtStartup);
		            this.startupDijit.set('checked', this.showAtStartup);

		           //this.progressDijit.on('click', lang.hitch(this, 'closeProgress'));

                    if (this.userPreferences.showStartupMetrics==true) {
						Style.set(this.progressDijit.domNode, 'opacity', 0);
						this.progressDropDownDijit.openDropDown();
						baseFx.anim(this.progressDijit.domNode, {
							opacity: 1
						}, 500);
				    }
				    */
		            return this.showAtStartup;
        }
		,onOpen: function () {
			//  Make sure the content is visible when the dialog
			//  is shown/opened. Something like this may be needed
			//  for all floating windows that don't open on startup?

		    dijit.byId("hHelpTabs").selectChild(dijit.byId("hHelpTab"));

			if (!this.openOnStartup) {
				this.containerNode.resize();
			}
		},
		close: function () {
			if (!this.checkDisclaimer()) {
				this.parentWidget.show();
				dijit.byId("hHelpTabs").selectChild(dijit.byId("hDisclaimerTab"));
				return;
			}
			if (this.parentWidget.hide) {
				this.parentWidget.hide();
			}
		}
		,acceptDisclaimer: function(){
			this.userPreferences.disclaimer=true;
			this.cookieObj.disclaimer=true;
			this._writeCookie();
		    dijit.byId("hHelpTabs").selectChild(dijit.byId("hWelcomeTab"));
		    this.parentWidget.hide();
 		}
 		,checkDisclaimer:function(){
			var isDiscl=false;
			isDiscl=this.userPreferences.disclaimer;
			return isDiscl;
 		}
		,onbtnclick: function(e) {
			//console.log("button clicked",e);
		}
		,stopTimer: function(e){
			//console.log("stopTimer button clicked",e );
		}
		,sendToDeveloper:function(e){

		}
		,_onStartupMetricsChange: function(e) {
            var showw=true;
            if (e==false) showw=false;
			this._updateUserPreferences({ showStartupMetrics: showw });
		}
		,_onStartupChange: function(e){
			//console.log("_onStartupChange",e);
            var showw=true;
            if (e==false) showw=false;

            if (showw) { showw=false; } // reverse the context .. now checked is "do not show"
            else { showw=true; }

			this._updateUserPreferences({ showWelcome: showw });
		}
		, _writeCookie: function() {
			//console.log("_writeCookie",this.cookieObj);
            cookie('userPreferences', JSON.stringify(this.cookieObj), { expires: 99999 });
        }
        , _updateUserPreferences: function(objPref) {
			//console.log("_updateUserPreferences",objPref);
			//var prefName = functional.keys(objPref)[0];
			//lang.mixin(window.userPreferences, objPref);
			lang.mixin(this.cookieObj, objPref);
			lang.mixin(this.userPreferences, objPref);
			this._writeCookie();
        }
        , openProgress: function(fadeInTime) {

            /*
            if (!this.startupMetricsDijit.get('checked')) { return; }

            if (!fadeInTime) {
                this.progressDropDownDijit.openDropDown();
            } else {
                Style.set(this.progressDijit.domNode, 'opacity', 0);
                this.progressDropDownDijit.openDropDown();
                baseFx.anim(this.progressDijit.domNode, {
                    opacity: 1
                }, fadeInTime);
            }
            */
        }
        , closeProgress: function(fadeOutTime, done) {
            if (done) {
                this.unsubscribe();
            }
            if (!fadeOutTime) {
                this.progressDropDownDijit.closeDropDown();
            } else {
                baseFx.anim(this.progressDijit.domNode, {
                    opacity: 0
                }, fadeOutTime, null, lang.hitch(this, function() {
                    this.progressDropDownDijit.closeDropDown();
                    Style.set(this.progressDijit.domNode, 'opacity', 1);
                }));
            }
        }

	});
});