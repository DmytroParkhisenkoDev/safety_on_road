(function() {
    'use strict';

    angular
        .module('saferoad')
        .service('OpenStreetMapService', OpenStreetMapService);

    /** @ngInject */
    function OpenStreetMapService() {
        // openstreetmap configuration
        var vm = this,
            openStreetMapConfig = {
            center: {
                lat: 0,
                lon: 0,
                zoom: 12,
                autodiscover: true
            },
            layers: {
                main: {
                    source: {
                        type: 'BingMaps',
                        key: '', //add your Bing key here
                        imagerySet: 'Aerial'
                    }
                }
            },
            bing: {
                source: {
                    name: 'Bing Maps',
                    type: 'BingMaps',
                    key: '', //add your Bing key here
                    imagerySet: 'Road'
                }
            },
            defaults: {
                events: {
                    map: ['singleclick', 'pointermove']
                },
                interactions: {
                    mouseWheelZoom: true
                },
                controls: {
                    zoom: true,
                    rotate: true,
                    attribution: true
                },
                loadTilesWhileAnimating: true,
                loadTilesWhileInteracting: true,
                view: {
                    minZoom: 3
                }
            },
            controls: [
                {name: 'zoom', active: true},
                {name: 'fullscreen', active: true},
                {name: 'overviewmap', active: true, collapsed: false}
            ],
            mouseposition: {},
            mouseclickposition: {},
            projection: 'EPSG:4326'
        };

        vm.getOpenStreetMapConfig = function() {
            return openStreetMapConfig;
        };
    }
    
})();

