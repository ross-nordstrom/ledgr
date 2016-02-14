angular.module('starter.controllers', ['firebase'])

  .controller('LoginCtrl', LoginCtrl)

  .controller('AppCtrl', AppCtrl)
  .controller('LedgrsCtrl', LedgrsCtrl)
  .controller('AccountCtrl', AccountCtrl)

  .controller('LedgrCtrl', LedgrCtrl)
  .controller('TimelineCtrl', TimelineCtrl)
  .controller('UsersCtrl', UsersCtrl)
  .controller('LedgrDetailsCtrl', LedgrDetailsCtrl)


function LoginCtrl(Auth, User, $state) {

  this.loginWithGoogle = function loginWithGoogle() {
    Auth.$authWithOAuthPopup('google')
      .then(function (authData) {
        User.create(authData);
        $state.go('tab.ledgrs');
      });
  };

}
LoginCtrl.$inject = ['Auth', 'User', '$state'];

function AppCtrl($scope, FirebaseUrl, $firebaseArray) {
}
AppCtrl.$inject = ['$scope', 'FirebaseUrl', '$firebaseArray'];

function LedgrsCtrl($scope, Ledgrs) {
  $scope.ledgrs = Ledgrs.all();
  angular.extend($scope, Ledgrs); // Copy the Ledgrs service's API onto scope

  $scope.create = function (ledgr) {
    return Ledgrs.create(ledgr)
      .then(function () {
        $scope.ledgr = {};
      });
  }
}
LedgrsCtrl.$inject = ['$scope', 'Ledgrs'];

function LedgrCtrl($scope, $stateParams, Ledgr) {
  var ldgrCtrl = this;
  this.ledgrId = $stateParams.ledgrId;
  this.ledgr = Ledgr.construct(this.ledgrId);
}
LedgrCtrl.$inject = ['$scope', '$stateParams', 'Ledgr'];

function LedgrDetailsCtrl($scope, Ledgr) {
  $scope.ledgr = $scope.ldgrCtrl.ledgr;
  $scope.edit = false;

  $scope.toggleEdit = function () {
    $scope.edit = !$scope.edit;
  };
  $scope.save = function () {
    return $scope.ledgr.$save();
  }
}
LedgrDetailsCtrl.$inject = ['$scope', 'Ledgr'];

function TimelineCtrl($scope, $state, Ledgr) {
  $scope.ledgrId = $state.params.ledgrId;
  $scope.ledgr = Ledgr.construct($scope.ledgrId);
  angular.extend($scope, $scope.ledgr); // Copy the Ledgr service's API onto scope

}
TimelineCtrl.$inject = ['$scope', '$state', 'Ledgr'];

function UsersCtrl($scope, User) {
  $scope.users = User.all();
  angular.extend($scope, User); // Copy the User service's API onto scope
}
UsersCtrl.$inject = ['$scope', 'User'];

function AccountCtrl($scope, authData, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.user = User.get(authData.uid);
}
AccountCtrl.$inject = ['$scope', 'authData', 'User'];
