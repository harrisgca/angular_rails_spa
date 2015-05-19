# SINGLE PAGE APP WITH RAILS AND ANGULAR

------

### OBJECTIVES

- Be able to explain what a Single Page App is
- Be able to write a full CRUD application using Angular and Rails


------

## Starting Out

***Initialize the app***

`rails new spa-app --database=postgresql --skip bundle`

***Add the following gems***

``` ruby
gem 'angularjs-rails'
gem 'angular-rails-templates'
gem 'bootstrap-sass', '~> 3.3.4'
```

***Remove the following gems (don’t forget to run bundle install)***

``` ruby
gem 'turbolinks'
```

***Remove references to turbolinks in application.html.erb. Add bootstrap class to body element***

``` html
  <%= stylesheet_link_tag    'application', media: 'all' %>
  <%= javascript_include_tag 'application'%>
    ...

  <body class="container-fluid">
```

***Rename application.css to application.css.css and import bootstrap***

``` css
@import "bootstrap-sprockets";
@import "bootstrap";
```

***Update application.js (remove reference to turbolinks***

``` javascript
//= require jquery
//= require jquery_ujs
//= require angular
//= require angular-route
//= require angular-rails-templates
//= require_tree .
```

***Create a controller named home with one controller named index. ***

``` 
rails g controller home index
```

***Change your routes file to root to home#index***

``` ruby
root 'home#index
```

***Update app/views/home/index.html.erb***

``` html
<div ng-app="myApp">
  <div class="view-container">
    <div ng-view></div>
  </div>
</div>
```

- Inside of app/assets/javascripts create a folder named ```templates```, ```angular-controllers``` and ```angular-config```



- Inside of app/assets/javascripts/angular-config create two files ```app.js``` and ```routing.js```
- Inside of app/assets/javascripts/angular-controllers create ```dogsController.js```
- Inside of app/assets/javascripts/templates create ```index.html```


***app.js***

``` javascript
angular.module('dogApp',['templates','ngRoute']);
```

***routing.js***

``` javascript
function config($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl: "index.html",
    controller: "DogsController",
    controllerAs: "dogsCtrl"
    })
  .otherwise({
    redirectTo: '/'
  });
}
```

***index.html***

``` html
<section>
  {{dogsCtrl.dogs}}
</section>
```

***dogsController.js***

``` javascript
angular.module('dogApp')
  .controller('DogsController', DogsController);

  DogsController.$inject = ['$http','$routeParams', '$window'];

  function DogsController($http, $routeParams, $window){
    var self = this;
    self.dogs = "It's working!!!";
  }
```

### At this point if you navigate to localhost:3000 you should see the “It’s working!” message

------

## Creating the API

***Create the Dog model***

``` 
rails g model Dog name:string breed:string age:integer
```

***Seed the database***

``` ruby
Dog.create(name:'Fido', breed:'Labrador', age:3)
Dog.create(name:'Max', breed:'Pit Bull', age:4)
Dog.create(name:'Benji', breed:'Bulldog', age:5)
Dog.create(name:'Dolly', breed:'Beagle', age:6)
Dog.create(name:'Princess', breed:'Greyhound', age:7)
```

***config/initializers/inflections.rb***

``` ruby
ActiveSupport::Inflector.inflections(:en) do |inflect|
    inflect.acronym 'API'
end
```

***app/controllers/application_controller.rb***

``` ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
end
```

***app/controllers/api/dogs_controller.rb***

``` ruby
module API
  class DogsController < ApplicationController

    def index
      render json: Dog.all
    end

    def show
      render json: Dog.find(params[:id])
    end

    def update
      @dog = Dog.find(params[:id])

      if @dog.update(dog_params)
        render json: @dog, status: 200
      else
        render json: {errors: @dog.errors}, status: 422
      end
    end

    def create
      @dog = Dog.new(dog_params)

      if @dog.save
        render json: @dog, status: 201
      else
        render json: {errors: @dog.errors}, status: 422
      end
    end

    def destroy
      @dog = Dog.find(params[:id])
      @dog.destroy
      render json: :no_content
    end

    private
      def dog_params
        params.require(:dog).permit(:name,:breed,:age)
      end
  end
end
```

***routes.rb***

``` ruby
  namespace :api do
    resources :dogs, only:[:index,:show,:update,:create, :destroy]
  end

  get '*path' => 'home#index'
```

------

## BUILDING THE ANGULAR APP

### Getting all of the Dogs

***dogsController.js***

``` javascript
function DogsController($http, $routeParams, $window){

    var self = this;
    self.getDogIndex = function(){
        return $http({
        method:'GET',
        url: "/api/dogs"
      })
      .success(function(data){
        console.log('success');
        self.jsonDogs = data;
      })
      .error(function(data){
        console.log('error!');
      });
    };

  ...
```

***index.html (inside of javascripts/templates)***

``` html
<div class="jumbotron" ng-init="dogsCtrl.getDogIndex()">
  <h1 class="text-center">A Dog App</h1>
</div>

<section>
  <ul>
    <li ng-repeat="dog in dogsCtrl.jsonDogs">{{dog.name}} - {{dog.age}}
    <div>
      <button class="btn">Show</button>
      <button class="btn">Edit</button>
      <button class="btn">Delete</button>
    </div>
    </li>
  </ul>
</section>
```

### Creating a new Dog

- First create a ```new.html``` template


***new.html***

``` html
<section>
  <form>
    Name: <input type="text" ng-model="dogsCtrl.name"><br>
    Breed: <input type="text" ng-model="dogsCtrl.breed"><br>
    Age: <input type="text" ng-model="dogsCtrl.age"><br>
    <button ng-click="dogsCtrl.createDog()">Create New Dog</button>
  </form>
</section>

<section>
  <a href="#/">Home</a>
</section>
```

***routing.js***

``` javascript
...

  .when('/new',{
    templateUrl: "new.html",
    controller: "DogsController",
    controllerAs: "dogsCtrl"
  })

  ...
```



***dogsController.js***

``` javascript
    self.deleteDog = function(id, index){
      var deleteDog = $window.confirm('Are you sure you want to delete?');
        if (deleteDog){
          var url = "/api/dogs/" + id;
          $http.delete(url)
            .success(function(){
              console.log('succesfully deleted');
              self.jsonDogs.splice(index,1);
            })
            .error(function(data){
              console.log("Something went wrong!");
            });
        }
    };
```



### Showing an individual dog

***index.html***

``` html
<button class="btn"><a href="#/dogs/{{dog.id}}">Show</a></button>
```

***show.html***

``` html
<div ng-init="dogsCtrl.showDog()">

  <form>
    Name: <input type="text" ng-model="dogsCtrl.currentDog.name"><br>
    Breed: <input type="text" ng-model="dogsCtrl.currentDog.breed"><br>
    Age: <input type="text" ng-model="dogsCtrl.currentDog.age"><br>
    <button ng-click="dogsCtrl.editDog()">Edit Dog</button>
  </form>

<a href="#/">Home</a>
</div>
```

**routing.js***

``` javascript
  .when('/dogs/:id',{
    templateUrl: "show.html",
    controller: "DogsController",
    controllerAs: "dogsCtrl"
  })
```

***dogController.js***

``` javascript
...
self.params = $routeParams;
...

self.showDog = function(){
      var url = "/api/dogs/" + self.params.id;

      $http.get(url)
        .success(function(data){
          console.log('successful show request');
          self.currentDog = data;
        })
        .error(function(data){
          console.log('something went wrong!');
        });
    };
```

### Deleting a dog

***index.html***

``` html
<button class="btn" ng-click="dogsCtrl.deleteDog(dog.id, $index)">Delete</button>
```

***dogsController.js***

``` javascript
    self.deleteDog = function(id, index){
      var url = "/api/dogs/" + id;
      $http.delete(url)
        .success(function(){
          console.log('succesfully deleted');
          self.jsonDogs.splice(index,1);
        })
        .error(function(data){
          console.log("Something went wrong!");
        });
    };
```

### Editing a dog

***routing.js***

``` javascript
  .when('/dogs/:id/edit',{
    templateUrl: "edit.html",
    controller: "DogsController",
    controllerAs: "dogsCtrl"
  })
```

***index.html***

``` html
<button class="btn"><a href="#/dogs/{{dog.id}}/edit">Edit</a></button>
```

***edit.html***

``` html
<div ng-init="dogsCtrl.showDog()">

  <form>
    Name: <input type="text" ng-model="dogsCtrl.currentDog.name"><br>
    Breed: <input type="text" ng-model="dogsCtrl.currentDog.breed"><br>
    Age: <input type="text" ng-model="dogsCtrl.currentDog.age"><br>
    <button ng-click="dogsCtrl.editDog()">Edit Dog</button>
  </form>

<a href="#/">Home</a>
</div>
```

***dogsController.js***

``` javascript
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
          console.log("successfully edited");
          $window.location.href = ('#/dogs/' + data.id);
        })
        .error(function(){
          console.log("something went wrong");
        });
    };
```

------

## AUTHENTICATION

------

### The Strategy

- Have our Rails application generate an access token that contains a random hexadecimal string.



- If a user successfully authenticates with their email address and password, then we will send the client their access token.



- Then the client must send this access token back to our Rails API with every request or they will receive a 401 unauthorized response from the server. 


***Before we get started, let's get on the same page about the things we will need to add:***

**Rails:**

- a user model
- an authentication controller and a route to handle login requests
- some way of preventing access to our API unless the clients provides a valid access token


**Angular:**

- some way of retrieving our access token via a login form
- an authentication controller to handle the logic around signing in and signing out
- some way of storing our access token and sending it back to the server with every request


------

***Uncomment the bcrypt gem in your Gemfile add the has_secure_token gem and responders gem***

``` ruby
#Gemfile

gem 'bcrypt', '~> 3.1.7'
gem 'has_secure_token'
gem 'responders', '~> 2.0'
```

***Generate the User model***

``` 
rails g model User email name password_digest token
```

***user.rb***

``` ruby
#app/models/user.rb

class User < ActiveRecord::Base
  has_secure_password
  has_secure_token
end
```

***Create a user in the console***

- After creating a user the password_digest and token fields should be populated.


``` ruby
User.create(email:"glenn@glenn.com", name:"Glenn",password:"banana")
```

***Create an AuthenticationController in Rails***

- The authentication controller in Rails will handle authentication (duh).


``` ruby
#app/controllers/api/authentication_controller.rb

module API
  class AuthenticationController < ApplicationController
    respond_to :json
    def sign_in
      #finds a user by email
      user = User.find_by(email: params[:email])
      #if it finds a user and the user's password is correct it'll return the user
      if user && user.authenticate(params[:password])
        render json: user
      else
        render json: { message: "email or password incorrect" }, status: 422
      end
    end
  end #end class
end #end module
```

***Update routes.rb***

- We’ll use this route to send our HTTP POST request in Angular


``` ruby
  #app/config/routes.rb
  namespace :api do
    resources :dogs, only:[:index,:show,:update,:create, :destroy]
    post '/authenticate' => 'authentication#sign_in'
  end
```

***Update dogs_controller.rb***

- We need to write a method named `restrict_access` that will run before the actions we want to protect.
- The `restrict_access` is a private method
- The `before_action` executes the `restrict_access` method before our protected actions


``` ruby
#app/controllers/api/dogs_controller.rb

module API
  class DogsController < ApplicationController
    before_action :restrict_access, only:[:update,:create,:destroy]
    
 ...
 ...
 

private
	def restrict_access
        token = User.find_by(token: params[:token])
      render json: {error:"You need to be logged in to access this"}, status: 401 unless token
      end
  end
end
```

- Because we’re going to be sending an authorization token on actions we want to protect we need to whitelist the `token` property in our `dog_params` method


``` ruby
#app/controllers/api/dogs_controller.rb

def dog_params
  params.require(:dog).permit(:name,:breed,:age, :token)
end
```

- Create an AuthenticationController in Angular


``` javascript
//app/assets/javascripts/templates/authenticationController.js

angular
    .module("dogApp")
    .controller("AuthenticationController", AuthenticationController);

    AuthenticationController.$inject = ["$http"];

    function AuthenticationController($http){
        var self = this;
    }
```

***Add a login form to the index.html Angular template***

``` html
<!--app/assets/javascripts/templates/index.html -->

	<div>
      <!-- begin login form -->
      <form class="login-form" ng-submit="auth.login()">
          <input class="login-input" type="text" placeholder="email" ng-model="auth.email">
          <input class="login-input" type="password" placeholder="password" ng-model="auth.password">
          <input type="submit" value="Log in" class="btn btn-submit">
      </form>
      <!-- end login form -->

  </div>
```

***Update authenticationController.js with the login function***

``` javascript
//app/assets/javascripts/angular-controllers/authenticationController.js

  self.email; //bound to form in view
  self.password; //bound to form in view
  self.login = login;

  function login(){
            var credentials = { 
              email: self.email, 
              password: self.password 
            };
            $http.post("/api/authenticate", credentials)
            .success(function(data){
                console.log(data);
                setAccessToken(data.token);
                self.email = null;
                self.password = null;
            })
            .error(function(data){
                console.log(data);
            });

            function setAccessToken(token){
                window.sessionStorage.setItem("access_token", token);
            }
        }
```

***Update the dogsController.js***

``` javascript
//app/assets/javascripts/angular-controllers/dogsController.js

...
var self = this;
var accessToken = window.sessionStorage.access_token;
...
```

- The access token should be set in Local Storage (check your browser under the Resources tab)
- Next we want the form to go away if the user is authenticated


``` html
<!--app/assets/javascripts/templates/index.html -->

<form class="login-form" ng-submit="auth.login()" ng-if="auth.isAuthenticated == false">
```

``` javascript
//app/assets/javascripts/angular-controllers/authenticationController.js

//add this inside the AuthenticationController constructor function

		self.isAuthenticated = isAuthenticated();

		function isAuthenticated(){
            return window.sessionStorage.access_token ? true : false;
        }
```

- Don’t forget to update your createDog method to send the access token


``` javascript
//app/assets/javascripts/angular-controllers/dogsController.js

    self.createDog = function(){
      // firstName,etc are being passed on the form
      var newDog = {
        name:self.name,
        breed: self.breed,
        age: self.age,
        token: accessToken

      };
```



***FINISHED `authenticationController.js`***

``` javascript
angular
    .module("dogApp")
    .controller("AuthenticationController", AuthenticationController);

    AuthenticationController.$inject = ["$http"];

    function AuthenticationController($http){
        var self = this;

        self.email; //bound to form in view
        self.password; //bound to form in view
        self.login = login;
        self.logout = logout;
        self.isAuthenticated = isAuthenticated();

        function login(){
            var credentials = { 
              email: self.email, 
              password: self.password 
            };
            console.log(credentials);
            $http.post("/api/authenticate", credentials)
            .success(function(data){
                console.log(data);
                setAccessToken(data.token);
                self.isAuthenticated = isAuthenticated();
                self.email = null;
                self.password = null;
            })
            .error(function(data){
                console.log(data);
            });
        }//end login function

        function logout(){
          window.sessionStorage.clear();
          self.isAuthenticated = isAuthenticated();
        }//end logout function

        function setAccessToken(token){
            window.sessionStorage.setItem("access_token", token);
        }

        function isAuthenticated(){
            return window.sessionStorage.access_token ? true : false;
        }
    }
```



***FINISHED `dogsController.js`***

``` javascript
angular.module('dogApp')
  .controller('DogsController', DogsController);

  DogsController.$inject = ['$http', '$routeParams', '$window'];

  function DogsController($http, $routeParams, $window){

    var self = this;
    var accessToken = window.sessionStorage.access_token;
    self.params = $routeParams;
    //get error response from server
    self.error;

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
    self.createDog = function(){
      var newDog = {
        name: self.name,
        breed: self.breed,
        age: self.age,
        token: accessToken
      };
      console.log(newDog);
      $http.post("/api/dogs", newDog)
        .success(function(data){
          console.log('successfuly created dog');
          console.log(data);
          $window.location.href = ('#/dogs/' + data.id);
        })
        .error(function(data){
          console.log(data);
          console.log('something went wrong!');
          self.error = data.error;
        });
    };

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

```



------

## EXTRAS

------

### HANDLING AN ERROR RESPONSE

***dogsController.js***

- Add this line to to the .error portion of the method you want to protect (e.g., createDog, editDog)


``` javascript
//app/assets/javascripts/angular-controllers/dogsController.js


		.error(function(data){
          console.log(data);
          console.log('something went wrong!');
          self.error = data.error;
        });
```



***Updating the Views***

- Add this HTML to your desired template (e.g., new.html, edit.html)


``` html
<!--app/assets/javascripts/templates/index.html -->

  <div ng-if="dogsCtrl.error">
    {{dogsCtrl.error}}
  </div>
```

### ADDING LOGOUT

***authenticationController.js***

``` javascript

//app/assets/javascripts/angular-controllers/authenticationController.js

		function logout(){
          window.sessionStorage.clear();
          self.isAuthenticated = isAuthenticated();
        }//end logout function
```

***Updating the views***

- Add this HTML to your desired template (e.g., new.html, edit.html)


``` html
<!--app/assets/javascripts/templates/index.html -->

	  <div ng-if="auth.isAuthenticated">
        <button ng-click="auth.logout()">Logout</button>
      </div>
```

