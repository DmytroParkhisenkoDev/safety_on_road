(function() {
    'use strict';

    angular
        .module('saferoad')
        .factory('FirebaseMarkersFactory', FirebaseMarkersFactory);

    /** @ngInject */
    function FirebaseMarkersFactory($firebaseArray, $log) {
        // firebase initialization
        var ref = firebase.database().ref(),
            markersRef = ref.child("markers"),
            markers = $firebaseArray(markersRef),
            service = {
                getAllMarkersAsArray: getAllMarkersAsArray,
                addMarker: addMarker,
                deleteMarker: deleteMarker,
                updateMarker: updateMarker,
                saveImage: saveImage,
                deleteImage: deleteImage
            };

        return service;

        function getAllMarkersAsArray() {
            return markers;
        }

        function addMarker(createdMarker) {
            return markers.$add(createdMarker);
        }

        function deleteMarker(deletedMarker) {
            markers = $firebaseArray(markersRef);
            markers.$loaded().then(function(markers) {
                var index = markers.$indexFor(deletedMarker.$id);
                var itemToDelete = markers[index];
                markers.$remove(itemToDelete).then(function(ref) {
                    ref.key === deletedMarker.$id;
                    angular.element('.popup-label').css('display', 'none');
                });
            }).catch(function(error) {
                $log.info(error);
            });
            angular.element('.popup-label').css('display', 'none');
        }

        function updateMarker(updatedMarker) {
            markers = $firebaseArray(markersRef);
            markers.$loaded().then(function(markers) {
                var index = markers.$indexFor(updatedMarker.$id);
                markers[index].description = updatedMarker.description;
                markers[index].label.message = updatedMarker.description;
                markers[index].update_time = Date.now();
                if (updatedMarker.img_name) {
                    if (updatedMarker.img_name == 'false') {
                        markers[index].img_name = false;
                        markers[index].img_src = false;
                        markers[index].label.message = updatedMarker.label.message;
                    } else {
                        markers[index].img_name = updatedMarker.img_name;
                        markers[index].img_src = updatedMarker.img_src;
                        markers[index].label.message = updatedMarker.label.message;
                    }
                }
                markers.$save(index).then(function(ref) {
                    ref.key === markers[index].$id; // true
                });
                markers = $firebaseArray(markersRef);
            }).catch(function(error) {
                $log.info(error);
            });
            angular.element('.popup-label').css('display', 'none');
        }

        function saveImage(file) {
            var fileName = Date.now() + '-' + file.name,
                storageRef = firebase.storage().ref('images/markers/' + fileName);
            return storageRef.put(file);
        }

        function deleteImage(fileName) {
            var desertRef = firebase.storage().ref('images/markers/' + fileName);
            return desertRef.delete();
        }
    }
    
})();

