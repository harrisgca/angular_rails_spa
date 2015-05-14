Index Template
---
* Add a clickable link to edit page

Views
---
* Create an edit.html template in the templates folder
* Create a route to the edit page in routing.js

Inside edit.html
---
* Create a form with the desired fields

* initialize some data to fill the form fields (ng-init)

* When the submit button is clicked it should fire a function that makes a HTTP PATCH request to the API. Create an object that will be sent with the PATCH request.

* On PATCH success redirect to the edited dog's show page.