var data = [
    {
        location: "Saint+Catherine's+Church/@54.6823779,25.2803127",
        placeid: "ChIJ78JB7BOU3UYRpNy8Yzf8oEw"
    },
    {
        location: "Igual+Habitat/@41.867424,-6.7576901",
        placeid: "ChIJt3aVdxtIOg0RpkvfnAwhZBU"
    },
    {
        location: "Hôtel+de+France/@43.9818989,-0.2305491",
        placeid: "ChIJ6ZET2CnpVQ0RCurhUBtU8lo"
    },
    {
        location: "Gites+Des+Sablons/@49.099697,3.7672443",
        placeid: "ChIJt1K9PoAQ6UcRftZ4kkG60U4"
    },
    {
        location: "Le+Passage+du+Gois/@46.3168822,2.7966306",
        placeid: "ChIJccqJWcIaBUgRaG1HIH-5YFU"
    }
];

function Location(item) {
    var match = item.location.match(/(.*)\/\@(.*),(.*)/);
    this.title = ko.observable(match[1].replace(/\+/g, ' '));
    this.location = ko.observable({
        lat: parseFloat(match[2]),
        lng: parseFloat(match[3])
    });
    this.placeid = ko.observable(item.placeid);
    this.visible = ko.observable(true);
}

var locations = data.map(function(item) {
    return new Location(item);
});
