angular.module('dogApp')
  .controller('DogsController', DogsController);

  DogsController.$inject = ['$http', '$routeParams', '$window'];

  function DogsController($http, $routeParams, $window){

    var self = this;
    var accessToken = window.sessionStorage.access_token;
    self.params = $routeParams;
    // self.dogs = "It's working!!!";

    self.getDogIndex = function(){
      return $http({
        method: 'GET',
        url: '/api/dogs'
      })
      .success(function(data){
        console.log("get index worked");
        self.jsonDogs = data;
      })
      .error(function(data){
        console.log('error!');
        console.log(data);
      });
    };

    ///////////////////
    ///////////////////
    ///////////////////
    self.createDog = function(){
      var newDog = {
        name: self.name,
        breed: self.breed,
        age: self.age
      };
      console.log(newDog);
      $http.post("/api/dogs", newDog)
        .success(function(data){
          console.log('successfuly created dog');
          console.log(data);
          $window.location.href = ('#/dogs/' + data.id);
        })
        .error(function(data){
          console.log('something went wrong!');
        });
    };
  ///////////////
  ///////////////
  ///////////////
    self.showDog = function(){
      var url = "/api/dogs/" + self.params.id;
      console.log(self.params);
      console.log(url);
      $http.get(url)
        .success(function(data){
          console.log('successful show request');
          self.currentDog = data;
        })
        .error(function(data){
          console.log('something went wrong!');
        });
    }
  }

// {name:'Fido', breed:'poodle', age:9}



