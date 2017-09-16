Wheelchair life - map
=====================

This project shows proven wheelchair-friendly locations. It is created as part of Udacity learning course to practice with Google Maps and Knockout.js.

## Model, View and Octopus ##

Application model is in `js/model.js`. It is accessible via global variable `model`.

View is in `index.html`. Data display logic and event binding is done with the help of knockout.js.

Octopus part is in:

* `js/mvvm.js`, follows knockout's ViewModel pattern.
* `js/map.js`, utilizes Google Maps API.

## Async ##

Model is partly prepopulated with data and part of the data is loaded asyncronously, from Wikipedia and from Google Places. There are several functions which do async API calls, all of them follow the same pattern:

    function some_async_call(location, callback) {
        // do call API and get result

        // if API call is successful
            callback(result);

        // else, in case of any network or API error
            callback(null);
    }

So every callback checks for possible null value.

## Performance ##

Aside show-hide uses CSS transition. `will-change` optimization is used:

    aside {
        /* ... */
        will-change: left;
    }
