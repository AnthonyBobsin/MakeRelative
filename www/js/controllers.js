angular.module('starter.controllers', ['ionic'])
.constant('FORECASTIO_KEY', '94554c8a6559d0c2c5cd86c818780f32')
.constant('GEOCODE_KEY', 'AIzaSyD7n4UdliKbLCTfpZ6D-mwERJqs8Ro-2Gw')
.controller('HomeCtrl', function($scope, $state, Weather, DataStore, Geocode) {
    
    console.log('inside home');
    var lat;
    var lng;

    document.getElementById('message').textContent = '';
    $scope.formData = {};

    $scope.weatherRequest = function() {
      Geocode.getLocation($scope.formData.userLocation).then(function(resp) {
        console.log('in geocode request');
        lat = resp.data['results'][0]['geometry']['location']['lat'];
        lng = resp.data['results'][0]['geometry']['location']['lng'];
        Weather.getCurrentWeather(lat,lng).then(function(respo) {
          document.getElementById('message').textContent = Math.round(respo.data['currently']['temperature']);
        }, function(error) {
          alert('Unable to get current conditions');
          console.error(error);
        });
      }, function(error) {
        console.log(error);
      });
    }



    /*read default settings into scope
    console.log('inside home');
    $scope.city  = DataStore.city;
    var latitude  =  DataStore.latitude;
    var longitude = DataStore.longitude;

    //call getCurrentWeather method in factory ‘Weather’
    Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
      $scope.current = resp.data;
      console.log('GOT CURRENT', $scope.current);
      //debugger;
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });*/

})
.controller('LocationsCtrl', function($scope,$state, Cities,DataStore) {
  $scope.cities = Cities.all();

  $scope.changeCity = function(cityId) {
    //get lat and longitude for seleted location
    var lat  = $scope.cities[cityId].lat; //latitude
    var lgn  = $scope.cities[cityId].lgn; //longitude
    var city = $scope.cities[cityId].name; //city name

    DataStore.setCity(city);
    DataStore.setLatitude(lat);
    DataStore.setLongitude(lgn);

    $state.go('tab.home');
  }
})
.controller('SettingsCtrl', function($scope) {
    //manages app settings
});