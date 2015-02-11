/**
 *  SVGPan library 1.2.2
 * ======================
 *
 * Given an unique existing element with id "viewport" (or when missing, the
 * first g-element), including the the library into any SVG adds the following
 * capabilities:
 *
 *  - Mouse panning
 *  - Mouse zooming (using the wheel)
 *  - Object dragging
 *
 * You can configure the behaviour of the pan/zoom/drag with the variables
 * listed in the CONFIGURATION section of this file.
 *
 * Known issues:
 *
 *  - Zooming (while panning) on Safari has still some issues
 *
 * Releases:
 *
 * 1.2.2, Tue Aug 30 17:21:56 CEST 2011, Andrea Leofreddi
 *	- Fixed viewBox on root tag (#7)
 *	- Improved zoom speed (#2)
 *
 * 1.2.1, Mon Jul  4 00:33:18 CEST 2011, Andrea Leofreddi
 *	- Fixed a regression with mouse wheel (now working on Firefox 5)
 *	- Working with viewBox attribute (#4)
 *	- Added "use strict;" and fixed resulting warnings (#5)
 *	- Added configuration variables, dragging is disabled by default (#3)
 *
 * 1.2, Sat Mar 20 08:42:50 GMT 2010, Zeng Xiaohui
 *	Fixed a bug with browser mouse handler interaction
 *
 * 1.1, Wed Feb  3 17:39:33 GMT 2010, Zeng Xiaohui
 *	Updated the zoom code to support the mouse wheel on Safari/Chrome
 *
 * 1.0, Andrea Leofreddi
 *	First release
 *
 * This code is licensed under the following BSD license:
 *
 * Copyright 2009-2010 Andrea Leofreddi <a.leofreddi@itcharm.com>. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY Andrea Leofreddi ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Andrea Leofreddi OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Andrea Leofreddi.
 */

"use strict";

/// CONFIGURATION
/// ====>

var enablePan = 1; // 1 or 0: enable or disable panning (default enabled)
var enableZoom = 1; // 1 or 0: enable or disable zooming (default enabled)
var enableDrag = 0; // 1 or 0: enable or disable dragging (default disabled)
var zoomScale = 0.4; // Zoom sensitivity
var viewBox;
var  minx ;
var  miny ;
var  maxx ;
var  maxy ;
/// <====
/// END OF CONFIGURATION

var root = document.documentElement;

var state = 'none', svgRoot = null, stateTarget, stateOrigin, stateTf;

setupHandlers(root);

/**
 * Register handlers
 */
function setupHandlers(root){
	/*
	setAttributes(root, {
		"onmouseup" : "handleMouseUp(evt)",
		"onmousedown" : "handleMouseDown(evt)",
		"onmousemove" : "handleMouseMove(evt)",
		"onload" : "handleLoad(evt)",
		"onerror" : "handleErr(evt)"
		//"onmouseout" : "handleMouseUp(evt)", // Decomment this to stop the pan functionality when dragging out of the SVG element
	});
*/

	setAttributes(root, {
		"onload" : "handleLoad(evt)",
		"onerror" : "handleErr(evt)"
		//"onmouseout" : "handleMouseUp(evt)", // Decomment this to stop the pan functionality when dragging out of the SVG element
	});
	try {
	    if (navigator.userAgent.toLowerCase().indexOf('webkit') >= 0)
	        window.addEventListener('mousewheel', handleMouseWheel, false); // Chrome/Safari
	    else
	        window.addEventListener('DOMMouseScroll', handleMouseWheel, false); // Others
	}  catch (e) {

	}

}
function handleErr(evt){

	//console.log("---err---");
   //console.log(evt);
}
function handleLoad(evt){

	 //console.log("---loaded---");
     forceLoadToBounds(root);

}
function forceLoadToBounds(root) {

	   var svg   = document.documentElement;


	   	var g = getRoot(svg);


	    	var pg = g.parentElement;
	    	 //console.log("id: " + g.id);

            //console.log( g.viewportElement);  // this is the parent document
          //console.log( g.viewportElement.viewBox);
	   	 var transBB=transformedBoundingBox(g);
	      //console.log(transBB);

 		  var ctm=g.getCTM();

 		   //console.log(ctm);
          ctm.a=ctm.a/1.5;
          ctm.d=ctm.d/1.5;
           setCTM(g, ctm);


	   if(svg.getAttribute("viewBox")) {
		   					//console.log("----- r ------");
		   					//console.log(svg );

		//svg.removeAttribute("viewBox");

//setTimeout('//console.log("during");document.documentElement.removeAttribute(\"viewBox\")', 3300);



		//setCTM(g, stateTf.inverse().translate(p.x - stateOrigin.x, p.y - stateOrigin.y));

	   }
	setAttributes(root, {
		"onmouseup" : "handleMouseUp(evt)",
		"onmousedown" : "handleMouseDown(evt)",
		"onmousemove" : "handleMouseMove(evt)",
		"onerror" : "handleErr(evt)"
		//"onmouseout" : "handleMouseUp(evt)", // Decomment this to stop the pan functionality when dragging out of the SVG element
	});


		   //var r = root.getElementById("viewport") ? root.getElementById("viewport") : root.documentElement, t = r;

		  //var ctm=r.getCTM();



					//setCTM(r, t.getCTM());




/*
		if(svgRoot == null) {
			var r = root.getElementById("viewport") ? root.getElementById("viewport") : root.documentElement, t = r;



			while(t == root) {
				if(t.getAttribute("viewBox")) {

					//console.log("----- r ------");
					//console.log(r);
					//console.log("----- t.getCTM() ------");


					var ctm=t.getCTM();

					//console.log(ctm);

					//setCTM(r, t.getCTM());

	                var transBB=transformedBoundingBox(r);
	                //console.log(transBB);
	                viewBox=viewBoxObj(t.getAttribute("viewBox"))

	                var sx = (maxx-minx) / transBB.width;
	                var sy = (maxy-miny) / transBB.height;

	                //console.log("sx: " + sx);
	                //console.log("sy: " + sy);

	                 ctm.a=sx;
	                 ctm.d=sy;
	                 //setCTM(r, ctm);
					 t.removeAttribute("viewBox");
				}

				t = t.parentNode;
			}

			//svgRoot = r;
		}

*/


}

/**
 * Retrieves the root element for SVG manipulation. The element is then cached into the svgRoot global variable.
 */
function getRoot(root) {
	if(svgRoot == null) {
		var r = root.getElementById("viewport") ? root.getElementById("viewport") : root.documentElement, t = r;

		while(t != root) {
			if(t.getAttribute("viewBox")) {


				var ctm=t.getCTM();

                setCTM(r, ctm);
				 t.removeAttribute("viewBox");
			}

			t = t.parentNode;
		}

		svgRoot = r;
	}

	return svgRoot;
}

/**
 * Instance an SVGPoint object with given event coordinates.
 */
function getEventPoint(evt) {
	var p = root.createSVGPoint();

	p.x = evt.clientX;
	p.y = evt.clientY;

	return p;
}

/**
 * Sets the current transform matrix of an element.
 */
function setCTM(element, matrix) {
	var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";

	element.setAttribute("transform", s);
}

/**
 * Dumps a matrix to a string (useful for debug).
 */
function dumpMatrix(matrix) {
	var s = "[ " + matrix.a + ", " + matrix.c + ", " + matrix.e + "\n  " + matrix.b + ", " + matrix.d + ", " + matrix.f + "\n  0, 0, 1 ]";

	return s;
}

/**
 * Sets attributes of an element.
 */
function setAttributes(element, attributes){
	for (var i in attributes)
		element.setAttributeNS(null, i, attributes[i]);
}

/**
 * Handle mouse wheel event.
 */
function handleMouseWheel(evt) {
	if(!enableZoom)
		return;

	if(evt.preventDefault)
		evt.preventDefault();

	evt.returnValue = false;

	var svgDoc = evt.target.ownerDocument;

	var delta;

	if(evt.wheelDelta)
		delta = evt.wheelDelta / 360; // Chrome/Safari
	else
		delta = evt.detail / -9; // Mozilla

	var z = Math.pow(1 + zoomScale, delta);

	var g = getRoot(svgDoc);

	var p = getEventPoint(evt);

	p = p.matrixTransform(g.getCTM().inverse());

	// Compute new scale matrix in current mouse position
	var k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

        setCTM(g, g.getCTM().multiply(k));

	if(typeof(stateTf) == "undefined")
		stateTf = g.getCTM().inverse();

	stateTf = stateTf.multiply(k.inverse());
}

/**
 * Handle mouse move event.
 */
function handleMouseMove(evt) {
	if(evt.preventDefault)
		evt.preventDefault();

	evt.returnValue = false;

	var svgDoc = evt.target.ownerDocument;

	var g = getRoot(svgDoc);

	if(state == 'pan' && enablePan) {
		// Pan mode
		var p = getEventPoint(evt).matrixTransform(stateTf);

		setCTM(g, stateTf.inverse().translate(p.x - stateOrigin.x, p.y - stateOrigin.y));
	} else if(state == 'drag' && enableDrag) {
		// Drag mode
		var p = getEventPoint(evt).matrixTransform(g.getCTM().inverse());

		setCTM(stateTarget, root.createSVGMatrix().translate(p.x - stateOrigin.x, p.y - stateOrigin.y).multiply(g.getCTM().inverse()).multiply(stateTarget.getCTM()));

		stateOrigin = p;
	}
}

/**
 * Handle click event.
 */
function handleMouseDown(evt) {
	if(evt.preventDefault)
		evt.preventDefault();

	evt.returnValue = false;

	var svgDoc = evt.target.ownerDocument;

	var g = getRoot(svgDoc);

	if(
		evt.target.tagName == "svg"
		|| !enableDrag // Pan anyway when drag is disabled and the user clicked on an element
	) {
		// Pan mode
		state = 'pan';

		stateTf = g.getCTM().inverse();

		stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
	} else {
		// Drag mode
		state = 'drag';

		stateTarget = evt.target;

		stateTf = g.getCTM().inverse();

		stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
	}
}

/**
 * Handle mouse button release event.
 */
function handleMouseUp(evt) {
	if(evt.preventDefault)
		evt.preventDefault();

	evt.returnValue = false;

	var svgDoc = evt.target.ownerDocument;

	if(state == 'pan' || state == 'drag') {
		// Quit pan mode
		state = '';
	}

	//console.log(transformedBoundingBox(getRoot(document.documentElement)));
}


function viewBoxObj(viewBoxVal){

     var vars = viewBoxVal.split(" ");
     minx=vars[0];
     miny=vars[1];
     maxx=vars[2];
     maxy=vars[3];

}
function transformedBoundingBox(el){
  var bb  = el.getBBox(),
      svg = el.ownerSVGElement,
      m   = el.getTransformToElement(el.parentNode);

  // Create an array of all four points for the original bounding box
  var pts = [
    svg.createSVGPoint(), svg.createSVGPoint(),
    svg.createSVGPoint(), svg.createSVGPoint()
  ];
  pts[0].x=bb.x;          pts[0].y=bb.y;
  pts[1].x=bb.x+bb.width; pts[1].y=bb.y;
  pts[2].x=bb.x+bb.width; pts[2].y=bb.y+bb.height;
  pts[3].x=bb.x;          pts[3].y=bb.y+bb.height;

  // Transform each into the space of the parent,
  // and calculate the min/max points from that.
  var xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
  pts.forEach(function(pt){
    pt = pt.matrixTransform(m);
    xMin = Math.min(xMin,pt.x);
    xMax = Math.max(xMax,pt.x);
    yMin = Math.min(yMin,pt.y);
    yMax = Math.max(yMax,pt.y);
  });

  // Update the bounding box with the new values
  bb.x = xMin; bb.width  = xMax-xMin;
  bb.y = yMin; bb.height = yMax-yMin;
  return bb;
}