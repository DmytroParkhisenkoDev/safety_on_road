(function() {
    'use strict';

    angular
        .module('saferoad')
        .controller('AddModalInstanceController', AddModalInstanceController);

    /** @ngInject */
    function AddModalInstanceController($uibModalInstance, marker, FirebaseMarkersFactory) {
        var vm = this;
        vm.marker = marker;
        vm.addAction = addAction;
        vm.cancelAction = cancelAction;
        vm.stripHtmlTags = stripHtmlTags;

        function addAction(file) {
            vm.validDescription = vm.stripHtmlTags(vm.marker.description);
            vm.createdMarker = {
                lat: vm.marker.lat,
                lon: vm.marker.lon,
                label: {
                    message: vm.validDescription,
                    show: false,
                    showOnMouseOver: true
                },
                img_name: false,
                img_src: false,
                description: vm.validDescription,
                create_time: Date.now(),
                update_time: Date.now()
            };

            // if image uploaded
            if (file) {
                // download image to firebase storage and save data to firebase datatable
                FirebaseMarkersFactory.saveImage(file).then(function(snapshot) {
                    vm.createdMarker.img_src = snapshot.downloadURL;
                    vm.createdMarker.img_name = snapshot.a.name;
                    vm.createdMarker.label.message = vm.validDescription + '<br><img src="' + snapshot.downloadURL + '">';
                    $uibModalInstance.close(vm.createdMarker);
                });
            } else {
                $uibModalInstance.close(vm.createdMarker);
            }
        }

        function cancelAction() {
            $uibModalInstance.dismiss('cancel');
            angular.element('.popup-label').css('display', 'none');
        }

        function stripHtmlTags(str) {
            if ((str == null) || (str =='')) {
                return '';
            } else {
                str = str.toString();
                return str.replace(/<[^>]*>/g, '');
            }
        }
    }

})();