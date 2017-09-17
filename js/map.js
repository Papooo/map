// HTML element containing Google Maps. Initialized once Google scripts are loaded
var map;

// Array of markers on the map. Initialized after map is shown
var markers = [];

// Popup whowing additional information about location. Shown on marker click
var largeInfoWindow;

// Called by Google script after it is loaded
function initMap() {
    var myMarker = makeMarkerIcon('08C4F2');
    var voMarker = makeMarkerIcon('9BF5ED');

    largeInfoWindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 54.678296,
            lng: 25.314064
        },
        zoom: 15,
        styles: mapStyles,
        mapTypeControl: false
    });

    for (var i = 0; i < model.locations.length; i++) {
        var position = model.locations[i].location();
        var title = model.locations[i].title();
        var marker = new google.maps.Marker({
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
    updateMarkers();
    fitMarkersIntoMap();

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
    // do nothing if there was an error loading map
    if (!map) {
        return;
    }

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker == marker) {
        return;
    }

    if (infowindow.marker) {
        // stop bouncing marker which previously displayed its info
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
        infowindow.setContent(content ? content: '<p>No content is currently available</p>');
    });
}

// update markers according to visibility of list items
function updateMarkers() {
    // do nothing if there was an error loading map
    if (!map) {
        return;
    }

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(model.locations[i].visible() ? map: null);
    }
}

function fitMarkersIntoMap() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function mapError() {
    var el = document.getElementById('map');

    el.innerHTML = '<p class="error-msg">Map is not currently available</p>';
}
