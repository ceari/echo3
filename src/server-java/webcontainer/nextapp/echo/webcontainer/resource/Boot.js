/**
 * @fileoverview
 * 
 * Requires Core, Core.Web, Application, Render, Serial, Client, RemoteClient.
 */

/**
 * Boot namespace.  Do not instantiate.
 * @namespace
 */
Echo.Boot = { 

    /**
     * Array of methods which should be invoked at boot.
     * @type Array
     */
    _initMethods: [],
    
    /**
     * Adds a method to be invoked at boot.
     * 
     * @param {Function} initMethod the method to invoke
     */
    addInitMethod: function(initMethod) {
        Echo.Boot._initMethods.push(initMethod);
    },
    
    /**
     * Boots a remote client.
     * 
     * @param {String} serverBaseUrl the servlet URL
     * @param {Boolean} debug flag indicating whether debug capabilities should be enabled
     * @param {String} pathInfo URL suffix after the serverBaseUrl
     */
    boot: function(serverBaseUrl, initId, debug, pathInfo) {
        Core.Web.init();
        
        if (debug && window.Echo.DebugConsole) {
            Echo.DebugConsole.install();
        }
    
        var client = new Echo.RemoteClient(serverBaseUrl, initId);
        for (var i = 0; i < Echo.Boot._initMethods.length; ++i) {
            Echo.Boot._initMethods[i](client);
        }

        if (pathInfo) {
            /* Boot with additional URL information. This happens when a user loads a bookmarked echo app.
             * -> include history change notification in sync message to server
             * so the application's history handlers can initialize the UI accordingly.
             */
            Core.Debug.consoleWrite("Boot.js:boot() pathInfo: " + pathInfo);
            client._syncRequested = true;
            client._clientMessage._historyChange = true;
            client._clientMessage.setEvent("CVirtualHistoryComponent", "historyChange");
        }
        client.sync();
    }
};
