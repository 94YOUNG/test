'use strict';

/**
 * Config for the router
 */
angular.module('testApp')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', '$locationProvider',
      function ($stateProvider,   $urlRouterProvider,$locationProvider) {

          $urlRouterProvider
              .otherwise('lllogin');
		//	    $locationProvider.html5Mode(true);
          $stateProvider

              .state('lllogin', {
                  url: '/lllogin',
                  templateUrl: 'lllogin.html'
              })



      }
    ]
  );
