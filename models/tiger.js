(function () {
    "use strict";
    var Foxx = require("org/arangodb/foxx"),
        Tiger;

    Tiger = Foxx.Model.extend({
        name: "",
        size: null,
        typeOfCat: "A tiger",
        sound: "Rrrrrrrr",
        growl: function(){
            return this.sound;
        }
    });

    exports.Model = Tiger;
}());