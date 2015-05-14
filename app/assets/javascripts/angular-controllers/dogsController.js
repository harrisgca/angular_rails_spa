angular.module('dogApp')
  .controller('DogsController', DogsController);

  DogsController.$inject = ['$http', '$routeParams', '$window'];

  function DogsController($http, $routeParams, $window){

    var self = this;
    self.params = $routeParams;

    //assigned inside showDog function
    self.currentDog;

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
    }//end of showDog function

//////////////////
//////////////////
//////////////////

    self.editDog = function(){
      var url = "/api/dogs/" + self.params.id;
      var editedDog = {
        name: self.currentDog.name,
        breed: self.currentDog.breed,
        age: self.currentDog.age
      };

      $http.patch(url, editedDog)
        .success(function(data){
          console.log(data);
          console.log("successfully edited!");
          $window.location.href = ('#/dogs/' + data.id);
        })
        .error(function(data){
          console.log("something went wrong");
        });
    };
    //////////////////////
    //////////////////////
    //////////////////////

    self.deleteDog = function(id, index){
      var confirmDelete = $window.confirm("Are you sure?");
      if(confirmDelete){
        var url = "/api/dogs/" + id;
        $http.delete(url)
          .success(function(){
            console.log("successfully deleted");
            self.jsonDogs.splice(index,1);
          })
          .error(function(){
            console.log("something went wrong!");
          });
      }//end if(confirmDelete) statement
    }//end deleteDog function
  }//end of constructor function

// {name:'Fido', breed:'poodle', age:9}



