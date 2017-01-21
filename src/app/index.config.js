(function() {
    'use strict';

    angular
        .module('saferoad')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, $provide) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;

        // Set firebase configuration
        var config = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            storageBucket: "",
            messagingSenderId: ""
        };
        firebase.initializeApp(config);

        // decorate angular-openlayers-directive (add search functionality to the map)
        $provide.decorator('olControlDirective', function($delegate) {
            // store the original link function
            var originalLinkFunction = $delegate[0].link;
            // replace the compile function
            $delegate[0].compile = function() {

                return function newLinkFn(scope, elem, attr, controller) {
                    // fire the originalLinkFunction
                    originalLinkFunction.apply($delegate[0], arguments);

                    // add search functionality to the map
                    controller.getOpenlayersScope().getMap().then(function(map) {
                        var geocoder = new Geocoder('nominatim', {
                            provider: 'photon',
                            lang: 'en',
                            placeholder: 'Search for ...',
                            limit: 5,
                            keepOpen: true
                        });
                        map.addControl(geocoder);
                    });
                };

            };

            // get rid of the old link function since return a link function in compile
            delete $delegate[0].link;

            // return the $delegate
            return $delegate;

        });
    }

})();
