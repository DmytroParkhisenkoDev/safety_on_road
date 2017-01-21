(function() {
  'use strict';

  angular
    .module('saferoad')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment) {
      var vm = this;

      vm.relativeDate = moment(vm.creationDate).fromNow();
      vm.isNavCollapsed = true;
      vm.isCollapsed = false;
      vm.isCollapsedHorizontal = false;
    }
  }

})();
