angular.module('dogApp')
  .config(['$routeProvider', config]);

  function config($routeProvider){
    $routeProvider
    .when('/',{
      templateUrl: "index.html",
      controller:  "DogsController",
      controllerAs: "dogsCtrl"
    })
    .when('/new',{
      templateUrl: "new.html",
      controller: "DogsController",
      controllerAs: "dogsCtrl"
    })
    .when('/dogs/:id',{
      templateUrl: "show.html",
      controller: "DogsController",
      controllerAs: "dogsCtrl"
    })
    .when('/dogs/:id/edit',{
      templateUrl: "edit.html",
      controller: "DogsController",
      controllerAs: "dogsCtrl"
    })
    .otherwise({
      redirectTo: '/'
    });
  }