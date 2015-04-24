define(
	 //"dojox/layout/ResizeHandle"
	 //,"dojo/text!./ResizeHandle/templates/ResizeHandle.html"
	 [
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/_base/fx",
	"dojo/_base/window",
	"dojo/fx",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/_base/manager",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/_base/declare"
	,"dojo/text!./ResizeHandle/templates/ResizeHandle.html"
	 ]
	 , function (
		 kernel, lang, connect, array, event, fx, window, dfx, dom, dom_class, dom_geometry, domStyle, manager, _Widget, _TemplatedMixin, declare
	  ,rztemplate
	 ) {


    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("gis/dijit/ResizeHandle/css/ResizeHandle.css")];
        var head = document.getElementsByTagName("head").item(0),
            link;
        for (var i = 0, il = css.length; i < il; i++) {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = css[i].toString();
            head.appendChild(link);
        }
    }());



   // kernel.experimental("dojox.layout.ResizeHandle");
    var y = declare("dojox.layout._ResizeHelper", _Widget, {
        show: function () {
            domStyle.set(this.domNode, "display", "")

        },
        hide: function () {
            domStyle.set(this.domNode,
                "display", "none")
        },
        resize: function (a) {
			//console.log("do the resize");
			//console.log("resize",this.domNode);
            dom_geometry.setMarginBox(this.domNode, a)
        }
    });



    //return declare("dojox.layout.ResizeHandle", [_Widget, _TemplatedMixin], {
    return declare("gis.dijit.ResizeHandle", [_Widget, _TemplatedMixin], {
        targetId: "",
        targetContainer: null,
        resizeAxis: "xy",
        activeResize: !1,

        activeResizeClass: "dojoxResizeHandleCloneC",
        baseClass: 'dojoxResizeHandle',
        animateSizing: !0,
        animateMethod: "chain",
        animateDuration: 225,
        minHeight: 100,
        minWidth: 100,
        constrainMax: !1,
        maxHeight: 0,
        maxWidth: 0,
        fixedAspect: !1,
        intermediateChanges: !1,
        startTopic: "/dojo/resize/start",
        endTopic: "/dojo/resize/stop",
        //templateString: '\x3cdiv dojoAttachPoint\x3d"resizeHandle" class\x3d"dojoxResizeHandle"\x3e\x3cdiv\x3e\x3c/div\x3e\x3c/div\x3e',
        // templateString: '<div dojoAttachPoint="resizeHandle" class="dojoxResizeHandle"><div></div></div>',
        templateString: rztemplate,

        postCreate: function () {
			 this.inherited(arguments);

            //console.log("ResizeHandle",this,this.activeResizeClass,this.activeResize);

            this.connect(this.resizeHandle, "onmousedown", "_beginSizing");
            this.activeResize ? this.animateSizing = !1 : (this._resizeHelper = manager.byId("dojoxGlobalResizeHelper"), this._resizeHelper || (this._resizeHelper = (new y({
                id: "dojoxGlobalResizeHelper"
            })).placeAt(window.body()), dom_class.add(this._resizeHelper.domNode, this.activeResizeClass)));



            //console.log("this._resizeHelper",this._resizeHelper);

            this.minSize || (this.minSize = {
                w: this.minWidth,
                h: this.minHeight
            });
            this.constrainMax && (this.maxSize = {
                w: this.maxWidth,
                h: this.maxHeight
            });

            //console.log("this.resizeHandle",this.resizeHandle);

            this._resizeX = this._resizeY = !1;
            var a = lang.partial(dom_class.add, this.resizeHandle);
            var ar = lang.partial(dom_class.replace, this.resizeHandle);
            var ad = lang.partial(dom_class.remove, this.resizeHandle);

           if (this.dir=="rtl") {
                 //ar("dojoxResizeHandle","dojoxResizeHandleRTL");
                 // ad("dojoxResizeHandle");
				 // ad("dijitRtl");
                  //a("cojoxResizeHandle");
				 // a("cijitRtl");

				 //a("dojoxResizeHandleRTL");
				// a("dojoxResizeHandle");

			}

            switch (this.resizeAxis.toLowerCase()) {
                case "xy":
                    this._resizeX = this._resizeY = !0;
                    if (this.dir=="rtl") {
						//console.log(" ---this.resizeHandle a",a);

						//a("dojoxResizeHandleRTL");
						//a("dijitRtl");
						 //a("dojoxResizeNWRTL");
						  //a("dijitRtl");
						  a("dojoxResizeNW");

				    } else {
                       a("dojoxResizeNW");
				    }
                    break;
                case "x":
                    this._resizeX = !0;
                    a("dojoxResizeW");
                    break;
                case "y":
                    this._resizeY = !0, a("dojoxResizeN")
            }

            if (this.dir=="rtl") {
				  //console.log(" ---1 ",this.resizeHandle  );
				 //domStyle.set(this.resizeHandle.domNode, "background-image", "icons/resizeRtl.png");
				 //dom_class.toggle(this.resizeHandle.domNode, "dojoxResizeHandleRTL"); //dijitRtl
				 //dom_class.replace(this.resizeHandle  , "dojoxResizeHandle","dojoxResizeHandleRTL"); //dijitRtl
				 //console.log(" ---2" );
				 //dom_class.replace(this.resizeHandle  , "dojoxResizeNW","dojoxResizeNWRTL");
				 //console.log(" ---3" );

			}

        },
        _beginSizing: function (a) {
            if (!this._isSizing && (connect.publish(this.startTopic, [this]), this.targetDomNode = (this.targetWidget = manager.byId(this.targetId)) ? this.targetWidget.domNode : dom.byId(this.targetId), this.targetContainer && (this.targetDomNode = this.targetContainer), this.targetDomNode)) {
                if (!this.activeResize) {
                    var b = dom_geometry.position(this.targetDomNode, !0);
                    this._resizeHelper.resize({
                        l: b.x,
                        t: b.y,
                        w: b.w,
                        h: b.h
                    });
                    this._resizeHelper.show();
                    this.isLeftToRight() || (this._resizeHelper.startPosition = {
                        l: b.x,
                        t: b.y
                    })
                }
                this._isSizing = !0;
                this.startPoint = {
                    x: a.clientX,
                    y: a.clientY
                };
                var b = domStyle.getComputedStyle(this.targetDomNode),
                    c = "border-model" === dom_geometry.boxModel ? {
                        w: 0,
                        h: 0
                    } : dom_geometry.getPadBorderExtents(this.targetDomNode, b),
                    r = dom_geometry.getMarginExtents(this.targetDomNode, b);
                this.startSize = {
                    w: domStyle.get(this.targetDomNode, "width", b),
                    h: domStyle.get(this.targetDomNode, "height", b),
                    l: domStyle.get(this.targetDomNode, 'left', b),
                    r: domStyle.get(this.targetDomNode, 'right', b),
                    pbw: c.w,
                    pbh: c.h,
                    mw: r.w,
                    mh: r.h
                };

                //console.log("_beginSizing",this.isLeftToRight());


                !this.isLeftToRight() && "absolute" == domStyle.get(this.targetDomNode, "position") && (b = dom_geometry.position(this.targetDomNode, !0), this.startPosition = {
                    l: b.x,
                    t: b.y
                });
                this._pconnects = [connect.connect(window.doc, "onmousemove", this, "_updateSizing"), connect.connect(window.doc, "onmouseup", this, "_endSizing")];
                event.stop(a)
            }
        },
        _updateSizing: function (a) {
            if (this.activeResize) this._changeSizing(a);
            else {
                var b = this._getNewCoords(a, "border", this._resizeHelper.startPosition);
                if (!1 === b) return;
                this._resizeHelper.resize(b)
            }
            a.preventDefault()
        },
        _getNewCoords: function (a, b, c) {
            try {
                if (!a.clientX || !a.clientY) return !1
            } catch (f) {
                return !1
            }
            this._activeResizeLastEvent = a;
            var e = (this.isLeftToRight() ? 1 : -1) * (this.startPoint.x - a.clientX),
                d = this.startPoint.y - a.clientY;
            a = this.startSize.w - (this._resizeX ? e : 0);
            d = this._checkConstraints(a, this.startSize.h - (this._resizeY ? d : 0));
            if ((c = c || this.startPosition) && this._resizeX) d.l = c.l + e, d.w != a && (d.l += a - d.w), d.t = c.t;
            switch (b) {
                case "margin":
                    d.w += this.startSize.mw, d.h += this.startSize.mh;
                case "border":
                    d.w += this.startSize.pbw,
                    d.h += this.startSize.pbh
            }
            return d
        },
        _checkConstraints: function (a, b) {
            if (this.minSize) {
                var c = this.minSize;
                a < c.w && (a = c.w);
                b < c.h && (b = c.h)
            }
            this.constrainMax && this.maxSize && (c = this.maxSize, a > c.w && (a = c.w), b > c.h && (b = c.h));
            if (this.fixedAspect) {
                var c = this.startSize.w,
                    e = this.startSize.h,
                    f = c * b - e * a;
                0 > f ? a = b * c / e : 0 < f && (b = a * e / c)
            }
            return {
                w: a,
                h: b
            }
        },
        _changeSizing: function (a) {
            var b = this.targetWidget && lang.isFunction(this.targetWidget.resize),
                c = this._getNewCoords(a, b && "margin");
            if (!1 !== c && (b ? this.targetWidget.resize(c) : this.animateSizing ? v[this.animateMethod]([

            fx.animateProperty({
                node: this.targetDomNode,
                properties: {
                    width: {
                        start: this.startSize.w,
                        end: c.w
                    }
                },
                duration: this.animateDuration
            }), fx.animateProperty({
                node: this.targetDomNode,
                properties: {
                    height: {
                        start: this.startSize.h,
                        end: c.h
                    }
                },
                duration: this.animateDuration
            })]).play() : domStyle.set(this.targetDomNode, {
                width: c.w + "px",
                height: c.h + "px"
            }), this.intermediateChanges)) this.onResize(a)
        },
        _endSizing: function (a) {
            array.forEach(this._pconnects, connect.disconnect);
            var b = lang.partial(connect.publish, this.endTopic, [this]);
            this.activeResize ? b() : (this._resizeHelper.hide(), this._changeSizing(a), setTimeout(b, this.animateDuration + 15));
            this._isSizing = !1;
            this.onResize(a)
        },
        onResize: function (a) {}
    })
});