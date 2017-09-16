function Model() {
    // Initial raw data. Properties:
    //      location (required) excerpt from Google maps URL containing name
    //          and coords
    //      placeid (required) place ID, should be acquired on Google site
    //      type (required) One of the following:
    //          'Place' - info is shown from Google Plcaes service
    //          'Wiki' - info is shown from Wikipedia searching by title
    //              property
    //          'Description' - info is shown from description property
    //      title (optional) - manually assigned location title. If not assigned,
    //          it is taken from location property
    //      description (optional) - manually assigned description of the location.
    //          Displayed if type == 'Description'
    this.data = [{
            location: "Saint+Catherine's+Church/@54.6823779,25.2803127",
            placeid: "ChIJ78JB7BOU3UYRpNy8Yzf8oEw",
            type: 'Place'
        },
        {
            location: "Igual+Habitat/@41.867424,-6.7576901",
            placeid: "ChIJt3aVdxtIOg0RpkvfnAwhZBU",
            type: 'Place'
        },
        {
            location: "Hôtel+de+France/@43.9818989,-0.2305491",
            placeid: "ChIJ6ZET2CnpVQ0RCurhUBtU8lo",
            type: 'Place'
        },
        {
            location: "Gites+Des+Sablons/@49.099697,3.7672443",
            placeid: "ChIJt1K9PoAQ6UcRftZ4kkG60U4",
            type: 'Description',
            description: 'Champagne is all around :)'
        },
        {
            location: "Le+Passage+du+Gois/@46.9467526,-2.3584943",
            placeid: "ChIJccqJWcIaBUgRaG1HIH-5YFU",
            title: "Passage du Gois",
            type: 'Wiki'
        }
    ];

    // list item data prepared for display
    this.locations = this.data.map(function(item) {
        return new Location(item);
    });

    // loads location content as specified in its type property. Once content is
    // loaded, callback is called with loaded content as parameter. If content
    // can't be loaded, callback is called with null as parameter.
    this.getContent = function(location, callback) {
        if (location.type()) {
            this['get' + location.type() + 'Content'](location, callback);
        } else {
            callback(null);
        }
    };

    // loads location content from wikipedia, calls callback with loaded
    // content in first parameter.
    this.getWikiContent = function(location, callback) {
        utils.getp('//en.wikipedia.org/w/api.php?action=opensearch&search=' +
            encodeURIComponent(location.title()),
            function(response) {
                if (!response) {
                    callback(null);
                }
                callback('<p>' +
                    response[2].join('<br><br>') +
                    '<br><br>' +
                    response[3].map(function(link) {
                        return '<a href="' + link + '" target="_blank">' + link + '</a>';
                    }).join('<br>') +
                    '</p>'
                );
            });
    };

    // loads content from location's description property
    this.getDescriptionContent = function(location, callback) {
        callback('<p>' + location.description() + '</p>');
    };

    // loads content from Google Plcaes
    this.getPlaceContent = function(location, callback) {
        location.getPlaceContent(function(content) {
            if (content) {
                callback('<p>' +
                    content.formatted_address +
                    '</p>'
                );
            } else {
                callback(null);
            }
        });
    };
}

// class for location objects. Constructor takes rad data item and prepares it
// for display
function Location(item) {
    var match = item.location.match(/(.*)\/\@(.*),(.*)/);
    this.title = ko.observable(item.title || match[1].replace(/\+/g, ' '));
    this.type = ko.observable(item.type);
    this.description = ko.observable(item.description);
    this.location = ko.observable({
        lat: parseFloat(match[2]),
        lng: parseFloat(match[3])
    });
    this.placeid = ko.observable(item.placeid);
    this.visible = ko.observable(true);
    this.url = ko.observable(null);
    this.address = ko.observable(null);
    this.loaded = ko.observable(false);
    this.callbacks = [];

    // once location is created, its additional information is loaded from
    // Google Places
    this.getPlaceContent(function(content) {
        this.url(content.website);
        this.address(content.formatted_address);
    }.bind(this));
}

// actual async request to Google Places. Once response is received, all
// waiting this.callbacks are called with content as parameter
Location.prototype.loadContent = function() {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        'placeId': this.placeid()
    }, function(results, status) {
        if (status === 'OK') {
            this.placeContent = results;
        }
        this.loaded(status);
        this.callbacks.forEach(function(callback) {
            callback(this.placeContent);
        }.bind(this));

        delete this.callbacks;

    }.bind(this));
};

// requests location content from Google Places. If already loaded just gives
// what is already loaded otherwise adds callback to list of this.callbacks
Location.prototype.getPlaceContent = function(callback) {
    if (this.loaded()) {
        callback(this.placeContent);
    } else {
        this.callbacks.push(callback);
    }
};

// adapted from stack overflow
var utils = {
    // analog of jQuery.get('jsonp')
    getp: function(url, callback) {
        var timer = setTimeout(function() {
            callback(null);
            delete window.jsonp_callback;
        }, 10000);
        window.jsonp_callback = function(response) {
            clearTimeout(timer);
            callback(response);
        };

        var script = document.createElement('script');
        script.src = url + '&callback=jsonp_callback';
        document.head.appendChild(script);
    }
};

// global model object
var model = new Model();
