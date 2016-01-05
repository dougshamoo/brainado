(function() {
  angular
    .module('app')
    .config(configureRoutes);

  function configureRoutes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html'
      });
  }
})();
