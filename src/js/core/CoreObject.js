

var CoreObject = (function(){

    function CoreObject() {
        
    }

    Object.assign(CoreObject.prototype, {

        toString : function () {
            var functionName = this.constructor.toString();
            functionName = functionName.substr("function".length);
            functionName = functionName.substr(0, functionName.indexOf("("));
            return "[" + functionName.trim() + " Object]";
        }

    });

    return CoreObject;
})();



export {CoreObject};
