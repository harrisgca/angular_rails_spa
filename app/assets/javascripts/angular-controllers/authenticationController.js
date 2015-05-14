angular
    .module("dogApp")
    .controller("AuthenticationController", AuthenticationController);

    AuthenticationController.$inject = ["$http"];

    function AuthenticationController($http){
        var self = this;

        self.email; //bound to form in view
        self.password; //bound to form in view
        self.login = login;
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
                self.email = null;
                self.password = null;
            })
            .error(function(data){
                console.log(data);
            });
        }//end login function

        function setAccessToken(token){
            window.sessionStorage.setItem("access_token", token);
        }

        function isAuthenticated(){
            return window.sessionStorage.access_token ? true : false;
        }
    }