
// Returns a Promise for Google geocode data.
const geocode = function (address) {
  return $.ajax('http://maps.googleapis.com/maps/api/geocode/json', {
    data: {
      address: address,
      sensor: true
    }
  })
}

// Returns a Promise for Zomata location data.
const fetchRestaurants = function (lat, lon) {
  return $.ajax({
     type: "GET", //it's a GET request API
     headers: {
       'X-Zomato-API-Key': '35779fb1c9e687376772f6f369773dd7' //only allowed non-standard header
     },
     url: 'https://developers.zomato.com/api/v2.1/search', //what do you want
     dataType: 'json', //wanted response data type - let jQuery handle the rest...
     data: {
        lat: lat,
        lon: lon,
        cuisines: '60', // Japanese
     },
     processData: true, //data is an object => tells jQuery to construct URL params from it
   })
}



let query = '';
// $('#city').val();
$('#search').on('submit', function (e) {
  e.preventDefault();
  $('#city').empty();
  query = $('#query').val();
  geocode(query).done(function (locationData) {
    const lat = locationData.results[0].geometry.location.lat;
    const lon = locationData.results[0].geometry.location.lng;
    fetchRestaurants(lat, lon).done(function (restaurantData) {
      // console.log(restaurantData);
      restaurantData.restaurants.forEach(function (r) {
        const {id, url, name, location} = r.restaurant;
        const {longitude, latitude} = r.restaurant.location;
        console.log(r.restaurant, url, id);


        $('#mapCanvas').addMarker({
          coords: [+latitude, +longitude],
          url: 'http://google.com',
          id: id,
          url: '#restaurant' + id
        });

        const $info = $('<div></div>').attr('id', 'restaurant' + id);
        // TODO: Customise what we display below
        console.log('things you can use', r.restaurant);
        $info.html('<h2>' + name + '</h2>' + location.address);

        $info.hide();
        $('.restaurant_info').append($info);
      })
    })
  });
});


//============================
// Autocomplete box
//============================


$(document).ready(function() {
  var $input = $("#query");

  var autocomplete = new google.maps.places.Autocomplete($input[0]);
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-35, 150),
      new google.maps.LatLng(-33, 152)
    );

  var options = {
    bounds: defaultBounds,
    types: ['city']
  };

  autocomplete = new google.maps.places.Autocomplete($input[0], options);

    $("#mapCanvas").googleMap({
      zoom: 10, // Initial zoom level (optional)
      coords: [-33.865143, 151.209900], // Map center (optional)
      type: "ROADMAP" // Map type (optional)
    }).on('click', function () {
      $('.restaurant_info > div').hide();
      const restaurantID = window.location.hash;
      $(restaurantID).fadeIn();
    });

// Parrallax effects
    const $sakeInner = $('.sakeInner');
    const $remenInner = $('.remenInner');
    const $fishInner = $('.fishInner');
    const $sushiShall = $('.sushiShall');
    const $sushiInner = $('.sushiInner');

    $(window).on('scroll', function () {
        const scrollTop = $(window).scrollTop();
        $sakeInner.css('background-position-x', -scrollTop * 0.2);

        $remenInner.css('background-position-x', scrollTop * 0.33);

        $fishInner.css('background-position-x', scrollTop * 0.7);

        $sushiShall.css('background-position-x', -scrollTop * 0.03);

        $sushiInner.css('background-position-x', scrollTop * 0.25);

      });
  });
