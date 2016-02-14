// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

  .constant('FirebaseUrl', 'https://ledgr.firebaseio.com/')
  .constant('UsersUrl', 'https://ledgr.firebaseio.com/users')
  .constant('UsersByNameUrl', 'https://ledgr.firebaseio.com/userByName')
  .constant('LedgrsUrl', 'https://ledgr.firebaseio.com/ledgrs')

  .service('rootRef', ['FirebaseUrl', Firebase])
  .service('usersRef', ['UsersUrl', Firebase])
  .service('userSearchRef', ['UsersByNameUrl', Firebase])
  .service('ledgrsRef', ['LedgrsUrl', Firebase])

  .run(ApplicationRun)

  .config(ApplicationConfig);

function ApplicationRun($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === 'AUTH_REQUIRED') {
      $state.go('login');
    }
  });

}
ApplicationRun.$inject = ['$ionicPlatform', '$rootScope', '$state'];

function AuthDataResolver(Auth) {
  return Auth.$requireAuth();
}
AuthDataResolver.$inject = ['Auth'];

function ApplicationConfig($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl as ctrl'
    })

    // setup an abstract state for the tabs directive
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/app.html',
      controller: 'AppCtrl as appCtrl',
      resolve: {
        authData: AuthDataResolver
      }
    })

    .state('app.tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      views: {
        'app': {
          templateUrl: 'templates/tabs.html',
          controller: 'TabCtrl'
        }
      }
    })
    // Each tab has its own nav history stack:
    .state('app.tab.ledgrs', {
      url: '/ledgrs',
      views: {
        'tab-ledgrs': {
          templateUrl: 'templates/tab-ledgrs.html',
          controller: 'LedgrsCtrl'
        }
      }
    })
    .state('app.tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('app.tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('app.ledgr', {
      url: '/ledgrs/:ledgrId',
      abstract: true,
      views: {
        app: {
          templateUrl: 'templates/ledgr/tabs.html',
          controller: 'LedgrCtrl as ldgrCtrl',
        }
      },
      resolve: {
        authData: AuthDataResolver
      }
    })
    .state('app.ledgr.main', {
      url: '',
      views: {
        'tab-main': {
          templateUrl: 'templates/ledgr/tab-main.html',
          controller: 'TimelineCtrl'
        }
      }
    })
    .state('app.ledgr.users', {
      url: '/users',
      views: {
        'tab-users': {
          templateUrl: 'templates/ledgr/tab-users.html',
          controller: 'UsersCtrl'
        }
      }
    })
    .state('app.ledgr.details', {
      url: '/details',
      views: {
        'tab-details': {
          templateUrl: 'templates/ledgr/tab-details.html',
          controller: 'LedgrDetailsCtrl'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

}
ApplicationConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
