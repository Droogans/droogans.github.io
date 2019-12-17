function filterPostsByTag(tag) {
    // TODO:
    // active tag
    // add multi
    // toggle
    for (post of matchingPosts.getElementsByTagName("li")) {
        if (post.getAttribute("data-tags").indexOf(tag) == -1) {
            post.classList.add("hidden-by-tag");
        } else {
            post.classList.remove("hidden-by-tag");
        }
    }
}

function filterPostsByQuery(event) {
    const q = query.value.toLowerCase();
    const alt = q.replace(/ /g,"_");
    const matchingPosts = window.document.getElementById("matchingPosts");
    for (post of matchingPosts.getElementsByTagName("li")) {
        const link = post.firstElementChild.pathname;
        const item = window.posts[link];
        const title = item.title.toLowerCase();
        if (q && (title.indexOf(q) === -1 || (item.excerpt && item.excerpt.indexOf(alt) === -1))) {
            post.classList.add("hidden-by-query");
        } else {
            post.classList.remove("hidden-by-query");
        }
    }
}

window.posts = {};
fetch("/search/feeds.json").then(response => {
    response.json().then(posts => {
        for (post of posts) {
            const link = new URL(post.link).pathname;
            window.posts[link] = post;
        }
    });
});
