var map;
var markers = [];
var placeMarkers = [];
var largeInfoWindow;

function initMap() {
    var styles = [
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [ { "saturation": -100 } ]
        },
        {
            "featureType": "water",
            // "elementType": "labels",
            "stylers": [ { "color": "#FFFFFF" } ]
        },

    ];
    var myMarker = makeMarkerIcon('c0c0c0');
    var voMarker = makeMarkerIcon('587469');

    largeInfoWindow = new google.maps.InfoWindow();
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.678296, lng: 25.314064},
        zoom: 15,
        styles: styles,
        mapTypeControl: true
    });

    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));
    // This autocomplete is for use in the geocoder entry box.

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

        marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
        });

        marker.addListener('mouseover', function() {
            this.setIcon(voMarker);
        });

        marker.addListener('mouseout', function() {
            this.setIcon(myMarker);
        });
    }

    showListings();

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));

        return markerImage;
    }

}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.

  if (infowindow.marker != marker) {
      if (infowindow.marker != null) {
          infowindow.marker.setAnimation(null);
      }
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('<p>Loading additional information ...</p>');
    infowindow.marker = marker;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
        if (!infowindow.marker) {
            return;
        }

        infowindow.marker.setAnimation(null);
        infowindow.marker = null;
    });

    infowindow.open(map, marker);

    model.getContent(model.locations[markers.indexOf(marker)], function(content) {
        if (!content) {
            infowindow.setContent('<p>No content is currently available</p>');
        }
        else {
            infowindow.setContent(content);
        }
    });
  }
}

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        model.locations[i].visible(true);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        model.locations[i].visible(false);
    }
}

function searchWithinTime(maxDuration, mode, address) {
  // Initialize the distance matrix service.
  var distanceMatrixService = new google.maps.DistanceMatrixService;

  // Check to make sure the place entered isn't blank.
  if (address == '') {
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
  var destinations = response.destinationAddresses;
  // Parse through the results, and get the distance and duration of each.
  // Because there might be  multiple origins and destinations we have a nested loop
  // Then, make sure at least 1 result was found.
  var atLeastOne = false;
  for (var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for (var j = 0; j < results.length; j++) {
      var element = results[j];
      if (element.status === "OK") {
        // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
        // the function to show markers within a user-entered DISTANCE, we would need the
        // value for distance, but for now we only need the text.
        var distanceText = element.distance.text;
        // Duration value is given in seconds so we make it MINUTES. We need both the value
        // and the text.
        var duration = element.duration.value / 60;
        var durationText = element.duration.text;
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

// This function is in response to the user selecting "show route" on one
// of the markers within the calculated distance. This will display the route
// on the map.
function displayDirections(origin) {
  hideMarkers(markers);
  var directionsService = new google.maps.DirectionsService;
  // Get the destination address from the user entered value.
  var destinationAddress =
      document.getElementById('search-within-time-text').value;
  // Get mode again from the user entered value.
  var mode = document.getElementById('mode').value;
  directionsService.route({
    // The origin is the passed in marker's position.
    origin: origin,
    // The destination is user entered address.
    destination: destinationAddress,
    travelMode: google.maps.TravelMode[mode]
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        directions: response,
        draggable: true,
        polylineOptions: {
          strokeColor: 'green'
        }
      });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
