angular.module('searchApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
})
.filter('matchesQuery', function() {
    return function (items, query){
        var alternate = query.replace(/ /g,"_").toLowerCase();
        var lcQuery = query.toLowerCase();
        var matches = [];
        for (var i=0; i < items.length; i++) {
            var matchesStrictly = items[i].title.toLowerCase().indexOf(lcQuery) !== -1;
            var matchesLoosely = items[i].content.indexOf(alternate) !== -1;
            if (matchesStrictly || matchesLoosely) {
                matches.push(items[i]);
            }
        }
        return matches;
    };
})
.filter('matchesTag', function () {
    return function (items, tag) {
        if (tag === undefined) {
            return items;
        }

        var matches = [];
        for (var i=0; i < items.length; i++) {
            if (items[i].tags.indexOf(tag) > -1) {
                matches.push(items[i]);
            }
        }
        return matches;
    };
})
.controller('PostListCtrl', PostListCtrl)
.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

function PostListCtrl($scope, $http, $location) {
    $scope.query = "";
    $scope.posts = [];
    $http.get('/search/feeds.json').success(function(data) {
        $scope.posts = data;
    });

    $scope.addTag = function (tag) {
        $scope.tag = $scope.tag === tag ? undefined : tag;
        $location.path('search').search('tag', $scope.tag).replace();
    };

    $scope.addTag($location.search().tag);

}
