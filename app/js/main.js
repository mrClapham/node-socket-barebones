/**
 * Created by grahamclapham on 17/09/15.
 */

console.log("Hello world-- ");
JET.init( { ID:"WebPageID", Title:"My Web Page", Summary:"A sample page for the JET API" } );

var jetReadyCallback = function() {
    console.log("JET is loaded and ready to be used");

    var data = {
        target: "popup", // open a popup window
        location: { x: 100, y: 100, width: 300, height: 300 },
        name: "Quote Object", // open a Quote Object
        entities: [{
            type: "COMP",
            "RIC": "TRI.N" // Symbol to use is TRI.N
        }]
    };
    JET.navigate(data);
}

JET.onLoad(jetReadyCallback);






