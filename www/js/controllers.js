angular.module('starter.controllers', ['firebase'])

  .controller('LoginCtrl', LoginCtrl)

  .controller('AppCtrl', AppCtrl)
  .controller('TabCtrl', TabCtrl)
  .controller('LedgrsCtrl', LedgrsCtrl)
  .controller('FriendsCtrl', FriendsCtrl)
  .controller('AccountCtrl', AccountCtrl)

  .controller('LedgrCtrl', LedgrCtrl)
  .controller('TimelineCtrl', TimelineCtrl)
  .controller('UsersCtrl', UsersCtrl)
  .controller('LedgrDetailsCtrl', LedgrDetailsCtrl);


function LoginCtrl(Auth, User, $state) {

  this.loginWithGoogle = function loginWithGoogle() {
    Auth.$authWithOAuthPopup('google')
      .then(function (authData) {
        User.create(authData);
        $state.go('app.tab.ledgrs');
      });
  };

}
LoginCtrl.$inject = ['Auth', 'User', '$state'];

function AppCtrl($scope, authData, User) {
  this.user = User.get(authData.uid);
}
AppCtrl.$inject = ['$scope', 'authData', 'User'];

function TabCtrl() {
}
TabCtrl.$inject = [];

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

function FriendsCtrl($scope, User) {
  $scope.user = $scope.appCtrl.user;
  $scope.user.friends = $scope.user.friends || {};

  $scope.searchResults = [];
  $scope.searched = false;

  $scope.searching = function () {
    $scope.searched = false;
  };
  $scope.searchUsers = function (name) {
    $scope.searched = true;
    var results = User.search(name);
    delete results[$scope.user.$id];
    if ($scope.user && $scope.user.friends) {
      Object.keys($scope.user.friends).forEach(function (friendId) {
        delete results[friendId];
      });
    }
    $scope.searchResults = results;
  };
  $scope.removeFriend = function (friendId) {
    delete $scope.user.friends[friendId];
    return $scope.user.$save();
  };
  $scope.addFriend = function (friendId, friendInfo) {
    $scope.user.friends = $scope.user.friends || {};
    $scope.user.friends[friendId] = friendInfo;

    //TODO: add self to friend's friendRequest list
    //var friend = User.get(friendId);

    return $scope.user.$save();
  }
}
FriendsCtrl.$inject = ['$scope', 'User'];

function LedgrCtrl($scope, $stateParams, authData, Ledgr, User) {
  var ldgrCtrl = this;
  ldgrCtrl.user = User.get(authData.uid);
  ldgrCtrl.ledgrId = $stateParams.ledgrId;
  ldgrCtrl.ledgr = Ledgr.construct(ldgrCtrl.ledgrId);
}
LedgrCtrl.$inject = ['$scope', '$stateParams', 'authData', 'Ledgr', 'User'];

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

function TimelineCtrl($scope, $state, $ionicModal, $filter, Ledgr) {
  $scope.ledgrId = $state.params.ledgrId;
  $scope.ledgr = Ledgr.construct($scope.ledgrId);
  angular.extend($scope, $scope.ledgr); // Copy the Ledgr service's API onto scope


  $scope.ledgr.$loaded().then(function () {
    resetEntry();
  });

  function resetEntry() {
    $scope.entry = {};
    var now = new Date();
    var rounded = now - now % 60000;
    $scope.entry.time = new Date(rounded);

    if (!$scope.ledgr.users) return;

    $scope.entry.paidBy = $scope.appCtrl.user.$id;
    $scope.entry.beneficiaries = {};
    Object.keys($scope.ledgr.users).forEach(function (userId) {
      $scope.entry.beneficiaries[userId] = true;
    })
  }

  $scope.removeEntry = function (entryIdx) {
    $scope.ledgr.entries.splice(entryIdx, 1);
    updateTotals($scope.ledgr);
    return $scope.ledgr.$save();
  };
  $scope.addEntry = function (entry) {
    entry = angular.copy(entry);
    decodeEntry(entry);

    $scope.ledgr.entries = $scope.ledgr.entries || [];
    $scope.ledgr.entries.push(entry);
    $scope.ledgr.entries = $filter('orderBy')($scope.ledgr.entries, '-time');

    updateTotals($scope.ledgr);
    resetEntry();
    return $scope.ledgr.$save();
  };
  $scope.editEntry = function (entry) {
    $scope.entry = entry;
    encodeEntry(entry);
    return $scope.openEditModal();
  };
  $scope.updateEntry = function (entry) {
    decodeEntry(entry);

    $scope.ledgr.entries = $filter('orderBy')($scope.ledgr.entries, '-time');
    updateTotals($scope.ledgr);
    resetEntry();
    return $scope.ledgr.$save();
  };

  $ionicModal.fromTemplateUrl('templates/ledgr/entry-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function () {
    return $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  $ionicModal.fromTemplateUrl('templates/ledgr/entry-edit-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.editModal = modal;
  });

  $scope.openEditModal = function () {
    return $scope.editModal.show();
  };
  $scope.closeEditModal = function () {
    $scope.editModal.hide();
  };

  resetEntry();


  function encodeEntry(entry) {
    entry.time = new Date(entry.time);
    entry.paidBy = entry.paidBy.id || $scope.appCtrl.user.$id;
    Object.keys(entry.beneficiaries).forEach(function (userId) {
      entry.beneficiaries[userId] = true;
    });
  }

  function decodeEntry(entry) {
    entry.paidBy = $scope.ledgr.users[entry.paidBy];
    entry.beneficiaries[entry.paidBy.id] = entry.paidBy.id;
    entry.time = entry.time.valueOf();

    Object.keys(entry.beneficiaries).forEach(function (userId) {
      entry.beneficiaries[userId] = $scope.ledgr.users[userId];
    });
  }

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
}
TimelineCtrl.$inject = ['$scope', '$state', '$ionicModal', '$filter', 'Ledgr'];

function UsersCtrl($scope, User) {
  $scope.candidates = angular.copy($scope.appCtrl.user.friends);

  if (!$scope.ldgrCtrl.ledgr.users) $scope.ldgrCtrl.ledgr.users = {};

  Object.keys($scope.ldgrCtrl.ledgr.users).forEach(function (userId) {
    delete $scope.candidates[userId];
  });

  $scope.ldgrCtrl.ledgr.users[$scope.appCtrl.user.$id] = {
    id: $scope.appCtrl.user.$id,
    name: $scope.appCtrl.user.google.displayName,
    pic: $scope.appCtrl.user.google.profileImageURL
  };


  $scope.removeParticipant = function (friendId) {
    delete $scope.ldgrCtrl.ledgr.users[friendId];

    $scope.candidates[friendId] = $scope.appCtrl.user.friends[friendId];

    return $scope.ldgrCtrl.ledgr.$save();
  };
  $scope.addParticipant = function (userId, user) {
    $scope.ldgrCtrl.ledgr.users = $scope.ldgrCtrl.ledgr.users || {};
    $scope.ldgrCtrl.ledgr.users[userId] = user;

    delete $scope.candidates[userId];

    return $scope.ldgrCtrl.ledgr.$save();
  }
}
UsersCtrl.$inject = ['$scope', 'User'];

function AccountCtrl($scope, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.user = $scope.appCtrl.user;
}
AccountCtrl.$inject = ['$scope', 'User'];

function updateTotals(ledgr) {
  var debts = {};
  Object.keys(ledgr.users).forEach(function (userId) {
    debts[userId] = 0;
  });

  var info = ledgr.entries.reduce(function (acc, entry) {
    acc.total += entry.price;

    var perPerson = entry.price / (Object.keys(entry.beneficiaries).length);
    acc.debts[entry.paidBy.id] = acc.debts[entry.paidBy.id] - entry.price;

    Object.keys(entry.beneficiaries).forEach(function (personId) {
      acc.debts[personId] = acc.debts[personId] + perPerson;
    });

    return acc;
  }, {total: 0, debts: debts});

  return angular.extend(ledgr, info);
}
