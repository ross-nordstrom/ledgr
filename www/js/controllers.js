angular.module('starter.controllers', ['firebase'])

  .controller('LoginCtrl', LoginCtrl)

  .controller('AppCtrl', AppCtrl)

  .controller('LedgrsCtrl', LedgrsCtrl)

  .controller('ChatsCtrl', ChatsCtrl)

  .controller('ChatDetailCtrl', ChatDetailCtrl)

  .controller('AccountCtrl', AccountCtrl);

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

function LedgrsCtrl($scope, Ledgr) {
  $scope.ledgrs = Ledgr.all();
  angular.extend($scope, Ledgr); // Copy the Ledgr service's API onto scope

  $scope.create = function (ledgr) {
    return Ledgr.create(ledgr)
      .then(function () {
        $scope.ledgr = {};
      });
  }
}
LedgrsCtrl.$inject = ['$scope', 'Ledgr'];

function UsersCtrl($scope, User) {
  $scope.users = User.all();
  angular.extend($scope, User); // Copy the User service's API onto scope
}
LedgrsCtrl.$inject = ['$scope', 'Ledgr'];

function ChatsCtrl($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };
}
ChatsCtrl.$inject = ['$scope', 'Chats'];

function ChatDetailCtrl($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}
ChatDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats'];

function AccountCtrl($scope) {
  $scope.settings = {
    enableFriends: true
  };
}
AccountCtrl.$inject = ['$scope'];
