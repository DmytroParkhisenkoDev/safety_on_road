(function() {
    'use strict';

    angular
        .module('saferoad')
        .controller('UpdateDeleteModalInstanceController', UpdateDeleteModalInstanceController);

    /** @ngInject */
    function UpdateDeleteModalInstanceController($uibModalInstance, $log, updatedMarker, FirebaseMarkersFactory) {
        var vm = this;
        vm.marker = updatedMarker;
        vm.storedImg = false;
        vm.deleteAction = deleteAction;
        vm.updateAction = updateAction;
        vm.cancelAction = cancelAction;
        vm.hideStoredImg = hideStoredImg;
        vm.removeImg = removeImg;
        vm.stripHtmlTags = stripHtmlTags;

        function deleteAction() {
            vm.deletedMarker = {
                action: 'delete',
                marker: vm.marker
            };

            if (vm.deletedMarker.marker.img_name) {
                // delete image from firebase storage and then delete data from firebase database
                FirebaseMarkersFactory.deleteImage(vm.deletedMarker.marker.img_name).then(function() {
                    $uibModalInstance.close(vm.deletedMarker);
                }).catch(function(error) {
                    $log.info('An error in deleting: ' + error);
                });
            } else {
                $uibModalInstance.close(vm.deletedMarker);
            }
            vm.storedImg = false;
        }

        function updateAction(file) {
            vm.updatedMarker = {
                action: 'update',
                marker: vm.marker
            };
            vm.validDescription = vm.stripHtmlTags(vm.marker.description);
            vm.updatedMarker.marker.description = vm.validDescription;

            // if new image uploaded
            if (file) {
                // delete old image if it`s exist
                if (vm.updatedMarker.marker.img_name) {
                    // delete image from firebase storage and then delete marker from firebase database
                    FirebaseMarkersFactory.deleteImage(vm.updatedMarker.marker.img_name).then(function() {
                        $log.info('An old image deleted');
                    }).catch(function(error) {
                        $log.info('An error in deleting: ' + error);
                    });
                }
                // save new image
                FirebaseMarkersFactory.saveImage(file).then(function(snapshot) {
                    vm.updatedMarker.marker.img_src = snapshot.downloadURL;
                    vm.updatedMarker.marker.img_name = snapshot.a.name;
                    vm.updatedMarker.marker.label.message = vm.validDescription +
                        '<br><img src="' + snapshot.downloadURL + '">';
                    $uibModalInstance.close(vm.updatedMarker);
                });
            // if old image removed without uploading new image
            } else if (vm.storedImg) {
                FirebaseMarkersFactory.deleteImage(vm.updatedMarker.marker.img_name).then(function() {
                    vm.updatedMarker.marker.label.message = vm.validDescription;
                    vm.updatedMarker.marker.img_name = 'false';
                    vm.updatedMarker.marker.img_src = 'false';
                    $uibModalInstance.close(vm.updatedMarker);
                });
            // if only description updated
            } else if (vm.updatedMarker.marker.img_name) {
                vm.updatedMarker.marker.label.message = vm.validDescription +
                    '<br><img src="' + vm.updatedMarker.marker.img_src + '">';
                $uibModalInstance.close(vm.updatedMarker);
            } else {
                $uibModalInstance.close(vm.updatedMarker);
            }
            vm.storedImg = false;
        }

        function cancelAction() {
            $uibModalInstance.dismiss('cancel');
            vm.storedImg = false;
        }

        function hideStoredImg() {
            angular.element('.stored-img').addClass('hidden');
            angular.element('.remove-stored-img').addClass('hidden');
        }

        function removeImg() {
            vm.storedImg = true;
            vm.hideStoredImg();
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