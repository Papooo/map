function Model() {
    // list item data prepared for display
    this.locations = locations.map(function(item) {
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
        $.ajax({
            url: '//en.wikipedia.org/w/api.php?action=opensearch&search=' +
                encodeURIComponent(location.title()),
            jsonp: "callback",
            dataType: "jsonp",
        }).done(function( response ) {
            callback('<p>' +
                response[2].join('<br><br>') +
                '<br><br>' +
                response[3].map(function(link) {
                    return '<a href="' + link + '" target="_blank">' + link + '</a>';
                }).join('<br>') +
                '</p>'
            );
        }).fail(function() {
            callback(null);
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
    this.purpose = ko.observable(item.purpose);
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
    this.placeContent = ko.observable(null);
    this.callbacks = [];

    // once location is created, its additional information is loaded from
    // Google Places
    this.getPlaceContent();
}

// actual async request to Google Places. Once response is received, all
// waiting this.callbacks are called with content as parameter
Location.prototype.loadContent = function() {
    if (this.loaded()) {
        return;
    }

    model.getContent(this, function(content) {
        this.placeContent(content);
        this.loaded(content ? 'OK' : 'Error');
        this.notify();
    }.bind(this));
};

Location.prototype.notify = function() {
    if (!this.callbacks) {
        return;
    }

    this.callbacks.forEach(function(callback) {
        callback(this.placeContent);
    }.bind(this));

    delete this.callbacks;
};

// requests location content from Google Places. If already loaded just gives
// what is already loaded otherwise adds callback to list of this.callbacks
Location.prototype.getPlaceContent = function(callback) {
    if (this.loaded()) {
        if (callback) {
            callback(this.placeContent);
        }
    } else {
        if (callback) {
            this.callbacks.push(callback);
        }

        setTimeout(function() {
            if (this.loaded()) {
                return;
            }

            this.placeContent = null;
            this.loaded('Error');
            this.notify();
            return;
        }.bind(this), 5000);
    }
};

// global model object
var model = new Model();
