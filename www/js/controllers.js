angular.module('starter.controllers', ['ionic'])
.constant('FORECASTIO_KEY', '94554c8a6559d0c2c5cd86c818780f32')
.constant('GEOCODE_KEY', 'AIzaSyD7n4UdliKbLCTfpZ6D-mwERJqs8Ro-2Gw')
.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicSideMenuDelegate, Weather, DataStore, Geocode) {
    
    console.log('inside home');
    var lat;
    var lng;

    $scope.formData = {};

    //$scope.myWidth = getWindowWidth();

    $scope.myWidth = 375;

    Geocode.getLocation(/*$scope.formData.userLocation*/'Toronto').then(function(resp) {
      console.log('in geocode request');
      lat = resp.data['results'][0]['geometry']['location']['lat'];
      lng = resp.data['results'][0]['geometry']['location']['lng'];
      setLocationValues(resp.data);
      Weather.getYesterdayWeather(lat,lng).then(function(respo) {
        setYesterdayValues(respo.data);
        },
        function(error) {
          alert('Unable to get yesterdays conditions');
          console.error(error);
      });
      Weather.getCurrentWeather(lat,lng).then(function(respo) {
        setValues(respo.data);
        },
        function(error) {
          alert('Unable to get current conditions');
          console.error(error);
      });
    }, 
    function(error) {
      console.log(error);
    });

    $scope.weatherRequest = function() {
      Geocode.getLocation(/*$scope.formData.userLocation*/'Toronto').then(function(resp) {
        console.log('in geocode request');
        lat = resp.data['results'][0]['geometry']['location']['lat'];
        lng = resp.data['results'][0]['geometry']['location']['lng'];
        setLocationValues(resp.data);
        Weather.getYesterdayWeather(lat,lng).then(function(respo) {
          setYesterdayValues(respo.data);
        }, function(error) {
          alert('Unable to get yesterdays conditions');
          console.error(error);
        });
        Weather.getCurrentWeather(lat,lng).then(function(respo) {
          setValues(respo.data);
        }, function(error) {
          alert('Unable to get current conditions');
          console.error(error);
        });
      }, function(error) {
        console.log(error);
      });
      $state.go('results');
    };

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

   var setLocationValues = function(data) {
    $rootScope.userLocation = data['results'][0]['formatted_address'];
   };

    var setValues = function(data) {
      $rootScope.weekSummary = data['daily']['summary'];
      $rootScope.sum = data['daily']['data'][0]['summary'];
      $rootScope.temperature = Math.round(data['currently']['temperature']);
      $rootScope.feelsLike = Math.round(data['currently']['apparentTemperature']) + '˚';
      $rootScope.high = Math.round(data['daily']['data'][0]['temperatureMax']) + '˚';
      $rootScope.low = Math.round(data['daily']['data'][0]['temperatureMin']) + '˚';
      $rootScope.windSpeed = Math.round(data['currently']['windSpeed']) + 'mph';
      $rootScope.pChance = Math.round((data['currently']['precipProbability'] * 100)) + '%';
      $rootScope.humidity = (data['currently']['humidity'] * 100) + '%';
      var skyVar = data['currently']['icon'];
      initSkycon("icon", skyVar);
    };

    var setYesterdayValues = function(data) {
      $rootScope.temperatureY = Math.round(data['currently']['temperature']);
      $rootScope.sumY = data['daily']['data'][0]['summary'];
      $rootScope.feelsLikeY = Math.round(data['currently']['apparentTemperature']) + '˚';
      $rootScope.highY = Math.round(data['daily']['data'][0]['temperatureMax']) + '˚';
      $rootScope.lowY = Math.round(data['daily']['data'][0]['temperatureMin']) + '˚';
      $rootScope.windSpeedY = Math.round(data['currently']['windSpeed']) + 'mph';
      $rootScope.pChanceY = Math.round((data['currently']['precipProbability'] * 100)) + '%';
      $rootScope.humidityY = Math.round((data['currently']['humidity'] * 100)) + '%';
      var skyVarY = data['currently']['icon'];
      initSkycon("iconY", skyVarY);
    };

    var initSkycon = function(icon, skyVar) {
      var skycons = new Skycons({"color": "#387ef5"}, {"resizeClear": true});
      skycons.add(icon, skyVar);
      skycons.play();
    };

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