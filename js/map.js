// HTML element containing Google Maps. Initialized once Google scripts are loaded
var map;

// Array of markers on the map. Initialized after map is shown
var markers = [];

// Popup whowing additional information about location. Shown on marker click
var largeInfoWindow;

// Called by Google script after it is loaded
function initMap() {
    var styles = [{
            "elementType": "geometry",
            "stylers": [{
                "color": "#ebe3cd"
            }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#523735"
            }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#f5f1e6"
            }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#c9b2a6"
            }]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#dcd2be"
            }]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#ae9e90"
            }]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dfd2ae"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dfd2ae"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#93817c"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#a5b076"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#447530"
            }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f1e6"
            }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#fdfcf8"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f8c967"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#e9bc62"
            }]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [{
                "color": "#e98d58"
            }]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#db8555"
            }]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#806b63"
            }]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dfd2ae"
            }]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#8f7d77"
            }]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ebe3cd"
            }]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dfd2ae"
            }]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#b9d3c2"
            }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#92998d"
            }]
        }
    ];
    var myMarker = makeMarkerIcon('08C4F2');
    var voMarker = makeMarkerIcon('9BF5ED');

    largeInfoWindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 54.678296,
            lng: 25.314064
        },
        zoom: 15,
        styles: styles,
        mapTypeControl: false
    });

    // This autocomplete is for use in the search within time entry box.
    var autoComplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));

    for (var i = 0; i < model.locations.length; i++) {
        var position = model.locations[i].location();
        var title = model.locations[i].title();
        var marker = new google.maps.Marker({
            // map: map,
            position: position,
            title: title,
            id: i,
            icon: myMarker,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        marker.addListener('click', markerClick);
        marker.addListener('mouseover', markerMouseOver);
        marker.addListener('mouseout', markerMouseOut);
    }

    // initially all markers are shown
    showListings();

    function markerClick() {
        populateInfoWindow(this, largeInfoWindow);
    }

    function markerMouseOver() {
        this.setIcon(voMarker);
    }

    function markerMouseOut() {
        this.setIcon(myMarker);
    }

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));

        return markerImage;
    }

    // after map is shown, locations in aside list request their data from
    // Google places service.
    model.locations.forEach(function(location) {
        location.loadContent();
    });
}

// show infowindow for given marker
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        if (infowindow.marker) {
            // stop bouncing marker which perviously displayed its info
            infowindow.marker.setAnimation(null);
        }
        // Clear the infowindow content
        infowindow.setContent('<p>Loading additional information ...</p>');

        // show infowindow near given marker and make marker bounce
        infowindow.marker = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);

        // on infowindow close button click, stop bouncing and close infowindow
        infowindow.addListener('closeclick', function() {
            if (!infowindow.marker) {
                return;
            }

            infowindow.marker.setAnimation(null);
            infowindow.marker = null;
        });

        infowindow.open(map, marker);

        // load model content async. Once it is loaded, show it inside infowindow
        model.getContent(model.locations[markers.indexOf(marker)], function(content) {
            if (!content) {
                infowindow.setContent('<p>No content is currently available</p>');
            } else {
                infowindow.setContent(content);
            }
        });
    }
}

// show all markers and related list items in aside
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        model.locations[i].visible(true);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// hide all markers and related list items in aside
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        model.locations[i].visible(false);
    }
}

// apply filter
function searchWithinTime(maxDuration, mode, address) {
    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService();

    // Check to make sure the place entered isn't blank.
    if (address === '') {
        window.alert('You must enter an address.');
    } else {
        hideMarkers(markers);
        // Use the distance matrix service to calculate the duration of the
        // routes between all our markers, and the destination address entered
        // by the user. Then put all the origins into an origin matrix.
        var origins = [];
        for (var i = 0; i < markers.length; i++) {
            origins[i] = markers[i].position;
        }

        // Now that both the origins and destination are defined, get all the
        // info for the distances between them.
        distanceMatrixService.getDistanceMatrix({
            origins: origins,
            destinations: [address],
            travelMode: google.maps.TravelMode[mode]
            //   unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, function(response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was: ' + status);
            } else {
                displayMarkersWithinTime(response, maxDuration);
            }
        });
    }
}

// This function will go through each of the results, and,
// if the distance is LESS than the value in the picker, show it on the map.
function displayMarkersWithinTime(response, maxDuration) {
    var origins = response.originAddresses;
    // Parse through the results, and get the distance and duration of each.
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found.
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
                // Duration value is given in seconds so we make it MINUTES. We need both the value
                // and the text.
                var duration = element.duration.value / 60;
                if (duration <= maxDuration) {
                    //the origin [i] should = the markers[i]
                    markers[i].setMap(map);
                    model.locations[i].visible(true);
                    if (markers[i] != largeInfoWindow.marker) {
                        markers[i].setAnimation(google.maps.Animation.DROP);
                    } else {
                        markers[i].setAnimation(google.maps.Animation.BOUNCE);
                    }
                    atLeastOne = true;
                    // Create a mini infowindow to open immediately and contain the
                    // distance and duration
                }
            }
        }
    }
    if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
    }
}
