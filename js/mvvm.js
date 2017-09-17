var ViewModel = function() {
    // true is aside is opened
    this.asideOpened = ko.observable(true);

    this.toggleAside = function() {
        this.asideOpened(!this.asideOpened());
    };

    // data for list items
    this.locations = model.locations;

    this.locationTypes = locationTypes;
    this.locationType = 'none';

    // opens infowindow on map after list item is clicked
    this.enableDetails = function(data, event) {
        if (event.target.tagName.toLowerCase() == 'a') {
            // allow clicking on <a> links
            return true;
        }

        populateInfoWindow(markers[model.locations.indexOf(this)], largeInfoWindow);
    };

    // handles apply filter click and shows only matching locations
    this.applyFilter = function() {
        this.locations.forEach(function(location) {
            location.visible(this.locationType == 'none' || location.purpose() == this.locationType);
        }.bind(this));

        updateMarkers();
    };
};

// bind knockout ViewModel object to whole page
ko.applyBindings(new ViewModel());
