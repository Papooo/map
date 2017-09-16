var ViewModel = function() {
    // true is aside is opened
    this.asideOpened = ko.observable(true);

    this.toggleAside = function() {
        this.asideOpened(!this.asideOpened());
    };

    // data for list items
    this.locations = model.locations;

    // data for filter form
    this.filter = {
        duration: ko.observable('15'),
        durationLabel: ko.observable('15 min'),
        mode: ko.observable('DRIVING'),
        modeLabel: ko.observable('drive'),
        address: ko.observable('Savanoriu 178'),
        isApplied: ko.observable(false)
    };

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
        this.filter.durationLabel(document.querySelector('#max-duration option[value="' +
            this.filter.duration() + '"]').textContent);
        this.filter.modeLabel(document.querySelector('#mode option[value="' +
            this.filter.mode() + '"]').textContent);
        this.filter.isApplied(true);

        searchWithinTime(this.filter.duration(), this.filter.mode(), this.filter.address());
    };

    // shows all locations again
    this.clearFilter = function() {
        this.filter.isApplied(false);
        showListings();
    };
};

// bind knockout ViewModel object to whole page
ko.applyBindings(new ViewModel());
