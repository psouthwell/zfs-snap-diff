angular.module('zsdSnapshots', []).
  directive('zsdSnapshots', ['$location', '$anchorScroll', 'Backend', '$rootScope', function ($location, $anchorScroll, Backend, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'template-snapshots.html',
      scope: {
        snapshots: '=',
        title: '@',
        onSnapshotSelected: '&'
      },
      link: function (scope, element, attrs) {

        scope.snapshotSelected = function (snap) {
          //scope.hideSnapshots = true;

          scope.curSnap = snap;
          scope.onSnapshotSelected({ snap: snap });

        };


        // restore the file from the selected snapshot
        scope.restoreSnapshot = function ($event, snap) {
          $event.preventDefault();


          var r = confirm("Are you sure you'd like to rollback? " + snap.Name + " Push OK to proceed.");
          if (r == true) {
            var splitNames = snap.Path.split("/");
            var poolName = splitNames[1];
            var snapShotFullName = poolName + "@" + snap.Name;
            Backend.restoreSnapshot(snapShotFullName).then(function (res) {
              $rootScope.$broadcast('zsd:success', res);
              scope.lastAction()
            });
  ;
          }

        }

        scope.toggleHideSnapshots = function () {
          scope.hideSnapshots = !scope.hideSnapshots;
        };

        scope.showNewerSnapDisabled = function () {
          return snapUninitialized() || scope.snapshots.indexOf(scope.curSnap) === 0
        };

        scope.showOlderSnapDisabled = function () {
          return snapUninitialized() || scope.snapshots.indexOf(scope.curSnap) === scope.snapshots.length - 1;
        };

        scope.showOlderSnap = function () {
          var idx = scope.snapshots.indexOf(scope.curSnap);
          scope.snapshotSelected(scope.snapshots[idx + 1]);
        };

        scope.showNewerSnap = function () {
          var idx = scope.snapshots.indexOf(scope.curSnap);
          scope.snapshotSelected(scope.snapshots[idx - 1]);
        };

        scope.$watch('snapshots', function () {
          // new file selected
          scope.hideSnapshots = false;
        });

        function snapUninitialized() {
          return typeof scope.curSnap === 'undefined' || typeof scope.snapshots === 'undefined';
        }
      }
    };
  }]);
