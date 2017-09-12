var ViewModel = function() {
    this.asideOpened = ko.observable(false);
    this.toggleAside = function() {
        this.asideOpened(!this.asideOpened());
    };

    // Map elements
    this.locations = model.locations;
    this.filter = {
        duration: ko.observable('15'),
        durationLabel: ko.observable('15 min'),
        mode: ko.observable('DRIVING'),
        modeLabel: ko.observable('drive'),
        address: ko.observable('Savanoriu 178'),
        isApplied: ko.observable(false)
    };

    this.enableDetails = function(data, event) {
        if (event.target.tagName.toLowerCase() == 'a') {
            // allow clicking on links
            return true;
        }

        populateInfoWindow(markers[model.locations.indexOf(this)], largeInfoWindow);
    }

    this.applyFilter = function() {
        this.filter.durationLabel(document.querySelector('#max-duration option[value="'
            + this.filter.duration() + '"]').textContent);
        this.filter.modeLabel(document.querySelector('#mode option[value="'
            + this.filter.mode() + '"]').textContent);
        this.filter.isApplied(true);

        searchWithinTime(this.filter.duration(), this.filter.mode(), this.filter.address());
    };

    this.clearFilter = function() {
        this.filter.isApplied(false);
        showListings();
    };
};

ko.applyBindings(new ViewModel());
