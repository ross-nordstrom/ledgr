angular.module('starter.controllers', ['firebase'])

  .controller('LoginCtrl', LoginCtrl)

  .controller('AppCtrl', AppCtrl)
  .controller('LedgrsCtrl', LedgrsCtrl)
  .controller('AccountCtrl', AccountCtrl)

  .controller('LedgrCtrl', LedgrCtrl)
  .controller('TimelineCtrl', TimelineCtrl)
  .controller('UsersCtrl', UsersCtrl)


  .controller('ChatsCtrl', ChatsCtrl)
  .controller('ChatDetailCtrl', ChatDetailCtrl);

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
  $scope.ledgrId = $stateParams.ledgrId;
  $scope.ledgr = Ledgr.construct($scope.ledgrId);

  $scope.toggleEdit = function () {
    $scope.edit = !$scope.edit;
  };
  $scope.save = function () {
    return $scope.ledgr.$save();
  }
}
LedgrCtrl.$inject = ['$scope', '$stateParams', 'Ledgr'];

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
