function filterPostsByTag(event, tag) {
    // active tag
    const classList = event.target.classList;
    if (classList.contains("filtered-tag")) {
        classList.remove("filtered-tag");
    } else {
        classList.add("filtered-tag");
    }

    const tagList = window.document.getElementById("tagList");
    const activeTags = tagList.getElementsByClassName("filtered-tag");
    const tags = [];
    for (activeTag of activeTags) {
        tags.push(activeTag.innerText);
    }

    for (post of matchingPosts.getElementsByTagName("li")) {
        if (tags.length === 0) {
            post.classList.remove("hidden-by-tag");
            continue;
        }

        let allMatches = true;
        for (tag of tags) {
            const postTags = post.getAttribute("data-tags").split(" ");
            if (postTags.indexOf(tag) === -1) {
                post.classList.add("hidden-by-tag");
                allMatches = false;
                break;
            }
        }
        allMatches && post.classList.remove("hidden-by-tag");
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
