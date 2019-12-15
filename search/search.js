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
    const urlParams = new URLSearchParams(window.location);
    const tags = urlParams.get('tags') || [];
    const uniqueTags = new Set([...tags, tag]);
    urlParams.set('tags', [...uniqueTags]);
    debugger;
    location.search = urlParams.getAll('tags').toString();
}

window.posts = {};
fetch('/search/feeds.json').then(response => {
    response.json().then(posts => {
        window.posts = posts;
    });
});
