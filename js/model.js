function Model() {
    this.data = [
        {
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

    this.locations = this.data.map(function(item) {
        return new Location(item);
    });

    this.getContent = function(location, callback) {
        if (location.type()) {
            this['get' + location.type() + 'Content'](location, callback);
        }
        else {
            callback(null);
        }
    };

    this.getWikiContent = function(location, callback) {
        utils.getp('//en.wikipedia.org/w/api.php?action=opensearch&search=' +
            encodeURIComponent(location.title()), function(response)
        {
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

    this.getDescriptionContent = function(location, callback) {
        callback('<p>' + location.description() + '</p>');
    };

    this.getPlaceContent = function(location, callback) {
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({'placeId': location.placeid()}, function(results, status) {
            if (status === 'OK') {
                console.log(results);
                callback('<p>' +
                    results.formatted_address +
                    '</p>'
                );
            } else {
                callback(null);
            }
        });
    };
}

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
}

// adapted from stack overflow
var utils = {
    get: function (url, callback) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open('GET', url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open('GET', url);
        } else {
            // Otherwise, CORS is not supported by the browser.
            callback(null);
        }

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                callback(xhr.responseText);
            } else {
                callback(null);
            }
        };

        xhr.onerror = function() {
            callback(null);
        };

        xhr.send();
    },

    getp: function (url, callback) {
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
var model = new Model();
