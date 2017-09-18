Wheelchair life - map
=====================

This project shows proven wheelchair-friendly locations. It is created as part of Udacity learning course to practice with Google Maps and Knockout.js.

## Installing and Running Application ##

1. Install Python.
2. Pick a directory which would be web server document root directory and navigate to it in command line shell:

        cd [web server document root directory]

3. Start local Web server:

        # On Mac and Linux
        python -m SimpleHTTPServer
        # On Windows
        python -m http.server

    Now local web server should be accessible via [http://localhost:8080/](http://localhost:8080/).

4. Clone this project into subdirectory of your local web server document root directory:

        git clone git@github.com:Papooo/map.git

5. Open app page in Web browser by typing in [http://localhost:8080/map/index.html](http://localhost:8080/map/index.html).

## 3rd Party API Usage ##

This project uses public Wikipedia API. In array of locations (see js/model.js for detailed documentation on data structure) there is one location configured to use data from Wikipedia:

    this.data = [
        // ...
        {
            location: "Le+Passage+du+Gois/@46.9467526,-2.3584943",
            placeid: "ChIJccqJWcIaBUgRaG1HIH-5YFU",
            title: "Passage du Gois",
            type: 'Wiki'
        }
    ];

When map infowindow is shown, marker's model as asked for infowindow content by calling `model.getContent()` method.

As type of this location is 'Wiki', `model.getContent()` actually calls `model.getWikiContent()`:

    this.getContent = function(location, callback) {
        if (location.type()) {
            this['get' + location.type() + 'Content'](location, callback);
        } else {
            callback(null);
        }
    };

And `model.getWikiContent()` performs AJAX call to Wikipedia API.

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
