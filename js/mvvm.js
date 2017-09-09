var ViewModel = function() {
    // Sidebar View
    var sidebar = '';
    if (window.matchMedia("(min-width: 1024px)").matches) {
      /* the viewport is at least 1024 pixels wide */
      sidebar = 'list';
    }

    this.sidebarView = ko.observable(sidebar);

    // this.isListVisible = ko.observable(false);
    this.toggleListView = function() {
        this.sidebarView() === 'list' ? this.sidebarView('') : this.sidebarView('list');
        // this.isListVisible(!this.isListVisible());
        window.dispatchEvent(new Event('resize'));
    };
    // this.isSearchVisible = ko.observable(false);
    this.toggleSearchView = function() {
        this.sidebarView() === 'search' ? this.sidebarView('') : this.sidebarView('search');
        // this.sidebarView('search');
        // this.isSearchtVisible(!this.isSearchVisible());
        window.dispatchEvent(new Event('resize'));
    };

    // Map elements
    this.locations = locations;
    this.filter = {
        duration: ko.observable('15'),
        durationLabel: ko.observable('15 min'),
        mode: ko.observable('DRIVING'),
        modeLabel: ko.observable('drive'),
        address: ko.observable('Savanoriu 178'),
        isApplied: ko.observable(false)
    };

    this.enableDetails = function() {
        populateInfoWindow(markers[locations.indexOf(this)], largeInfoWindow);
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

    // this.disableDetails = function() {
    //     largeInfoWindow.close();
    //     largeInfoWindow.marker = null;
    //
    // }

};

// ko.applyBindings(myViewModel, document.getElementById('someElementId'));
ko.applyBindings(new ViewModel());
