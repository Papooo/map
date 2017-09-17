// Initial raw data. Properties:
//      location (required) excerpt from Google maps URL containing name
//          and coords
//      placeid (required) place ID, should be acquired on Google site
//      purpose (required) One of the following:
//          'culture' - cultural point of interest
//          'nature' - natural point of interest
//          'accomodation' - hotel/apartment
//      type (required) One of the following:
//          'Place' - info is shown from Google Plcaes service
//          'Wiki' - info is shown from Wikipedia searching by title
//              property
//          'Description' - info is shown from description property
//      title (optional) - manually assigned location title. If not assigned,
//          it is taken from location property
//      description (optional) - manually assigned description of the location.
//          Displayed if type == 'Description'
var locations = [
    {
        location: "Saint+Catherine's+Church/@54.6823779,25.2803127",
        placeid: "ChIJ78JB7BOU3UYRpNy8Yzf8oEw",
        purpose: 'culture',
        type: 'Place'
    },
    {
        location: "Igual+Habitat/@41.867424,-6.7576901",
        placeid: "ChIJt3aVdxtIOg0RpkvfnAwhZBU",
        purpose: 'accomodation',
        type: 'Place'
    },
    {
        location: "Hôtel+de+France/@43.9818989,-0.2305491",
        placeid: "ChIJ6ZET2CnpVQ0RCurhUBtU8lo",
        purpose: 'accomodation',
        type: 'Place'
    },
    {
        location: "Gites+Des+Sablons/@49.099697,3.7672443",
        placeid: "ChIJt1K9PoAQ6UcRftZ4kkG60U4",
        purpose: 'accomodation',
        type: 'Description',
        description: 'Champagne is all around :)'
    },
    {
        location: "Le+Passage+du+Gois/@46.9467526,-2.3584943",
        placeid: "ChIJccqJWcIaBUgRaG1HIH-5YFU",
        purpose: 'nature',
        title: "Passage du Gois",
        type: 'Wiki'
    }
];
