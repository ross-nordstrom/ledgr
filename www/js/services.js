angular.module('starter.services', ['firebase'])

  .service('Ledgrs', Ledgrs)
  .service('Ledgr', Ledgr)
  .service('User', User)

  .factory('Auth', Auth);

function Auth(rootRef, $firebaseAuth) {
  return $firebaseAuth(rootRef);
}
Auth.$inject = ['rootRef', '$firebaseAuth'];

function Ledgrs(ledgrsRef, $firebaseArray) {

  var ledgrs = $firebaseArray(ledgrsRef);

  this.create = function (ledgr) {
    return ledgrs.$add(ledgr);
  };
  this.all = function () {
    return ledgrs;
  };
  this.get = function (ledgrId) {
    return ledgrs.$getRecord(ledgrId);
  };
  this.save = function (ledgr) {
    return ledgrs.$save(ledgr);
  };
  this.remove = function (ledgr) {
    return ledgrs.$remove(ledgr);
  };
}
Ledgrs.$inject = ['ledgrsRef', '$firebaseArray'];


function Ledgr(ledgrsRef, $firebaseObject, Firebase) {

  this.construct = function (ledgrId) {
    var ledgrRef = new Firebase(ledgrsRef.toString() + '/' + ledgrId);
    var ledgr = $firebaseObject(ledgrRef);

    return ledgr;
  };
}
Ledgr.$inject = ['ledgrsRef', '$firebaseObject', 'Firebase'];


function User(usersRef, userSearchRef, $firebaseObject, Firebase) {

  var users = $firebaseObject(usersRef);
  var usersByName = $firebaseObject(userSearchRef);

  this.create = function (user) {
    if (!user.uid.length) throw new Error('Expecting uid on user');

    users[user.uid] = users[user.uid] || user;
    return users.$save()
      .then(function (savedUserRef) {
        // Add user to search list by each part of their name
        var savedUser = users[user.uid];

        var userInfo = {
          id: user.uid,
          name: savedUser.google.displayName,
          pic: savedUser.google.profileImageURL
        };

        var nameParts = savedUser.google.displayName.split(' ');
        nameParts.forEach(function (namePart) {
          usersByName[namePart] = !usersByName[namePart] ? {} : usersByName[namePart];
          usersByName[namePart][user.uid] = userInfo;
        });

        return usersByName.$save();
      });
  };
  this.get = function (userId) {
    if (!userId.length) throw new Error('Expecting userId');

    var userRef = new Firebase(usersRef.toString() + '/' + userId);
    return $firebaseObject(userRef);
  }
}
User.$inject = ['usersRef', 'userSearchRef', '$firebaseObject', 'Firebase'];
