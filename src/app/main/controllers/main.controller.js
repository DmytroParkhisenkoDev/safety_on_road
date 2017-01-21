(function() {
    'use strict';

    angular
        .module('saferoad')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(
        $scope,
        $log,
        OpenStreetMapService,
        FirebaseMarkersFactory,
        $uibModal,
        $document
    ) {

        var vm = this;
        vm.editMode = false;
        vm.mapMarker = false;
        vm.animationsEnabled = true;
        vm.markers = FirebaseMarkersFactory.getAllMarkersAsArray();
        vm.marker = {};
        vm.updatedMarker = {};
        vm.toggleMarker = toggleMarker;
        vm.addMarker = addMarker;
        vm.updateDeleteMarker = updateDeleteMarker;

        // include openStreetMap configuration into $scope
        angular.extend($scope, OpenStreetMapService.getOpenStreetMapConfig());
        
        // Show / hide markers on the map by click
        function toggleMarker() {
            if (vm.markers.length > 0) {
                vm.markers = [];
            } else {
                vm.markers = FirebaseMarkersFactory.getAllMarkersAsArray();
            }
        }

        // Open modal for adding a new marker
        function addMarker(size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.add-modal ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open( {
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/main/partials/modal/add.modal.html',
                controller: 'AddModalInstanceController',
                controllerAs: 'vm',
                size: size,
                appendTo: parentElem,
                resolve: {
                    marker: function () {
                        return vm.marker;
                    }
                }
            });

            modalInstance.result.then(function (createdMarker) {
                vm.createdMarker = createdMarker;
                FirebaseMarkersFactory.addMarker(vm.createdMarker).then(function() {
                    angular.element('.popup-label').css('display', 'none');
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


        // Open modal for updating an existing marker
        function updateDeleteMarker(marker, size, parentSelector) {
            vm.updatedMarker = marker;
            vm.defaultDescription = vm.updatedMarker.description;
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.update-delete-modal ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open( {
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/main/partials/modal/update.delete.modal.html',
                controller: 'UpdateDeleteModalInstanceController',
                controllerAs: 'vm',
                size: size,
                appendTo: parentElem,
                resolve: {
                    updatedMarker: function () {
                        return vm.updatedMarker;
                    }
                }
            });

            modalInstance.result.then(function (updatedMarker) {
                vm.updatedMarker = updatedMarker;
                if (vm.updatedMarker.action == 'delete') {
                    FirebaseMarkersFactory.deleteMarker(vm.updatedMarker.marker);
                } else {
                    FirebaseMarkersFactory.updateMarker(vm.updatedMarker.marker);
                }
            }, function () {
                vm.updatedMarker.description = vm.defaultDescription;
            });
        }

        // Get coordinates by click on the map and call appropriate method
        $scope.$on('openlayers.map.singleclick', function(event, data) {
            var projection = ol.proj.transform([ data.coord[0], data.coord[1] ], data.projection, 'EPSG:4326');
            vm.marker = {
                lat: Number(projection[1]),
                lon: Number(projection[0])
            };

            if (vm.mapMarker) {
                var tmpMarker = vm.mapMarker;
                vm.mapMarker = false;
                vm.updateDeleteMarker(tmpMarker);
            } else {
                vm.addMarker();
            }
        });
    }
})();
