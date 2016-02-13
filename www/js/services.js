angular.module('starter.services', ['firebase'])

  .service('Ledgrs', Ledgrs)
  .service('Ledgr', Ledgr)
  .service('User', User)


  .service('Chats', Chats)


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


function User(usersRef, $firebaseObject, Firebase) {

  var users = $firebaseObject(usersRef);

  this.create = function (user) {
    if (!user.uid.length) throw new Error('Expecting uid on user');
    if (users[user.uid]) return null; // User already exists

    users[user.uid] = user;
    return users.$save();
  };
  this.get = function (userId) {
    if (!userId.length) throw new Error('Expecting userId');

    var userRef = new Firebase(usersRef.toString() + '/' + userId);
    return $firebaseObject(userRef);
  }
}
User.$inject = ['usersRef', '$firebaseObject', 'Firebase'];


function Chats() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  this.all = function () {
    return chats;
  };

  this.remove = function (chat) {
    chats.splice(chats.indexOf(chat), 1);
  };

  this.get = function (chatId) {
    for (var i = 0; i < chats.length; i++) {
      if (chats[i].id === parseInt(chatId)) {
        return chats[i];
      }
    }
    return null;
  };

}
