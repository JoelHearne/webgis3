define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
     'dijit/TooltipDialog',
     "dojo/dom-attr",
	 'dijit/layout/TabContainer',

    'dojo/text!./introSplash/templates/introSplash.html',
    'dojo/text!./introSplash/templates/welcome.html',
    'dojo/text!./introSplash/templates/disclaimer.html',
    'dojo/_base/json',
    'dojo/topic',
     'dojo/_base/lang',
    'dojo/_base/fx',
    //'dojo/parser',
    'dojo/dom',
    'dojo/dom-attr',
    'dojo/dom-construct',
    //'dijit/_WidgetBase',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/Color',
    'dojox/lang/functional',
    "dojo/query",
    //'dijit/registry',
    "dijit/Dialog",
    'dijit/form/CheckBox',
	 "dijit/form/Form",
	 "dijit/form/TextBox",
    "dijit/form/Button",
     'dijit/TitlePane',
     'dijit/form/DropDownButton',
     'dijit/layout/ContentPane',
    "dojo/ready"
    ,'xstyle/css!./introSplash/css/introSplash.css'


	//,"dojo/domReady!"
], function ( declare,  _WidgetsInTemplateMixin, TooltipDialog,attr, TabContainer, template, welcome,disclaimer,dojo,topic, lang, baseFx
//,parser
,dom,domAttr, domConstruct, lang,array,Color, functional,query
,Dialog, CheckBox, Form, TextBox, Button, TitlePane,DropDownButton,ContentPane
//,registry
,ready) {
		//return declare([Dialog,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        return declare([Dialog, _WidgetsInTemplateMixin], {
        templateString: template,
        //widgetsInTemplate: true,
        title: 'Hamilton County Map Viewer',
        draggable: true,
        baseClass: 'introSplash',
        timelineWidth: 190,
        summaryColor: '#FF0000',
        timelineColors: ['#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'],
        showAtStartup: true,
        showStartupMetrics: false,
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

            console.log("introsplash postCreate");

        } ,
        startup: function () {
	         this.inherited(arguments);

	         console.log("introsplash startup");


             // do not show if url has a querystring

             if (document.location.search.indexOf("?") == -1) {

			    var form = new Form();

				/*
				new TextBox({
					placeHolder: "Name"
				}).placeAt(form.containerNode);

				new Button({
				  label: "OK"
				}).placeAt(form.containerNode);
				*/


				var tabs = [{
					title: 'Welcome'
					,sub: []
					/*,sub: [{
						title: 'My 1st inner',
						content: 'Lorem ipsum dolor sit amet'
					}, {
						title: 'My 2nd inner',
						content: 'Consectetur adipiscing elit'
					}]
					*/
				}, {
				    title: 'Disclaimer'
					,sub: []
					/*,sub: [{
						title: 'My 3rd inner',
						content: 'Vivamus orci massa rhoncus a lacinia'
					}, {
						title: 'My 4th inner',
						content: 'Fusce sed orci magna, vitae aliquet quam'
					}]*/
				}, {
					title: 'Help'
					,sub: []
				}, {
					title: 'About'
					,sub: []
				}

				];

				var tabContainer = new TabContainer({
					doLayout: true,
					style: "height: 700px; width: 500%;"
				} ).placeAt(form.containerNode);


				 var cp1 = new ContentPane({
							title: "Welcome",
							content: welcome
						});
				 tabContainer.addChild(cp1);

				 var cp2 = new ContentPane({
							title: "Disclaimer",
							content: disclaimer
						});
				 tabContainer.addChild(cp2);

				 var cp3 = new ContentPane({
							title: "Help",
							content: "help"
						});
				 tabContainer.addChild(cp3);




				array.forEach(tabs, function(tab){
					if(!tab.sub.length){

						var cp = new ContentPane({
							title: tab.title,
							content: 'No sub tabs'
						});
						//tabContainer.addChild(cp);

						return;
					}

					/*
					var subTab = new TabContainer({
						title: tab.title,
						doLayout: false,
						nested: true
					});
					array.forEach(tab.sub, function(sub){
						var cp = new ContentPane({
							title: sub.title,
							content: sub.content
						});
						subTab.addChild(cp);
					});
					tabContainer.addChild(subTab);
					*/

				});


				// _Container widgets will call startup on their children already
				tabContainer.startup();


/*
http://gis.hamiltoncounty.in.gov/jsViewer3/
http://stackoverflow.com/questions/18567540/attach-points-in-dijit-dialog-when-using-template-as-content


Instead of setting the html template as the content, create a custom widget that uses the template and set an instance of the widget as the dialog content. Attach points in the template will become variables on the widget.

http://dojotoolkit.org/reference-guide/1.9/dijit/_TemplatedMixin.html

http://dojotoolkit.org/reference-guide/1.9/dijit/_AttachMixin.html#dijit-attachmixin


*/

				var dia = new Dialog({
					content: form,
					//content: template,
					title: "Okaloosa County Map Viewer",
					style: "width: 500px; height: 540px;"
				});
				//form.startup();

				//dia.startup();
				dia.show();

             }

            //this.startupMetricsDijit.set('value', this.showStartupMetrics);
           // this.startupMetricsDijit.set('checked', this.showStartupMetrics);
/*
            this.startupDijit.set('value', this.showAtStartup);
            this.startupDijit.set('checked', this.showAtStartup);

            this.startupDijitDiv.style.visibility = 'visible';

            this.progressDijit.on('click', lang.hitch(this, 'closeProgress'));

             return this.showAtStartup;
*/

        }
        ,close: function(){
			console.log("close");

		}
        ,_hideShowAtStartup: function() {
             this.startupDijitDiv.style.visibility = 'hidden';
        }
        ,_showShowAtStartup: function() {
            this.startupDijitDiv.style.visibility = 'visible';
        }
        ,stopTimer: function() {
            //if (this.timer2) {
            //    clearInterval(this.timer2);
            //    this.timer2 = null;
            //}
        }
        ,_onStartupMetricsChange: function(evt) {
            //window.userPreferences.showStartupMetrics = evt;
            //topic.publish('USER_PREFERENCES', { showStartupMetrics: evt });
        }
        ,_onStartupChange: function(evt) {
            //window.userPreferences.showWelcome = evt;
            //topic.publish('USER_PREFERENCES', { showWelcome: evt });
        }
        ,_updateUserPreferences: function(prefObj) {
           // var prefName = functional.keys(prefObj)[0];
           // if (prefName === 'showWelcome') {
            //    startupDijit.value = prefObj[prefName];
           // } else if (prefName === 'showStartupMetrics') {
           //     startupMetricsDijit.value = prefObj[prefName];
           // }
        }
        ,  closeProgress: function(fadeOutTime, done) {
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
        ,sendToDeveloper: function() {

            /*
            var body = "Date," + this.progressTitle.innerHTML.slice(3, -4) + "%0D%0A";
            var lastLine;
            body += "Description%0D%0A%0D%0A";
            body += "Module,Start,Duration%0D%0A";
            array.forEach(this.progressIds, lang.hitch(this, function(key, idx) {
                if (key === 'total_startup_time') {
                    lastLine = this.progressLabels[idx] + "," + (this.endTimes[key] - this.startTimes[key]) / 1000 + "%0D%0A";
                } else {
                    body += this.progressLabels[idx] + "," +
                            (this.startTimes[key] - this.startTimes['total_startup_time']) / 1000 + "," +
                            (this.endTimes[key] - this.startTimes[key]) / 1000 + "%0D%0A";
                }
            }));
            body += lastLine;
            window.location = "mailto:" + this.devEmail + "?subject=JavaScript Viewer Startup Metrics&body=" + body;
            */
        }
        ,remove: function() {
            this.hide();
        }
        ,unsubscribe: function() {
            if (this.handle) {
                this.handle.remove();
                this.handle = null;
            }
        }
   });  // end return
});  // end declare function