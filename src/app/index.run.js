(function() {
    'use strict';

    angular
        .module('saferoad')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log) {
        $log.debug('runBlock end');
    }

})();
