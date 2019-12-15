function matchingTags(items, tag) {
    if (tag === undefined) {
        return items;
    }

    var matching = [];
    for (var i=0; i < items.length; i++) {
        if (items[i].tags.indexOf(tag) > -1) {
            matching.push(items[i]);
        }
    }
    return matching;
}

function matchingQueries(items, query) {
    var alternate = query.replace(/ /g,"_").toLowerCase();
    var lcQuery = query.toLowerCase();
    var matching = [];
    for (var i=0; i < items.length; i++) {
        var matchingStrictly = items[i].title.toLowerCase().indexOf(lcQuery) !== -1;
        var matchingLoosely = items[i].content.indexOf(alternate) !== -1;
        if (matchingStrictly || matchingLoosely) {
            matching.push(items[i]);
        }
    }
    return matching;
}

function redrawPostsList(e) {
    // TODO, just use vanilla js and don't worry about heavy repaints with tags/search text overlapping
}

function addTagToSearchPath(tag) {
    location.path('search').search('tag', tag.value).replace();
}

window.posts = {};
fetch('/search/feeds.json').then(posts => {
    window.posts = posts;
});
