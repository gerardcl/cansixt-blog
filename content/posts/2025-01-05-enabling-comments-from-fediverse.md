+++
title="Fediverse interactions"
description="How to enable blog post comments from the Fediverse"
authors = ["Gerard"]
date=2025-01-05
[taxonomies]
categories = ["Technology", "Sustainability"]
tags = ["fediverse", "prototype", "spin", "zola"]
[extra]
toc = true
+++

We believe it's a good option to enable our blog posts with, at least one, interaction options from and with you 💌. So, let's enable some interaction with a bit of integration to the Mastodon's social network. 🐬 Some scripting is always fun!

<!-- more -->

This post is a follow-up of the [How we do run this blog site](/posts/the-tech-stack/) post, and we encourage you to go over it before continuing here and avoid getting lost 🧐.

## The inspiration

Having a statically generated blog site means this: "it's static" 😧. Then, how can we enable some interactivity with comments? 🤔 As usual, we are not the first ones having such question and, guess what, there are even companies offering such service. One example, which I learned by starting this blog, is [Disqus](https://disqus.com/), but for us it was not an option since we would be locked to it and we do prefer trying to use an Open Source and Open Standard option, with a core foundation that fits ours.

### Activity Pub

This is when we though if it would be possible to integrate with [Activity Pub](https://en.wikipedia.org/wiki/ActivityPub) 🤓, an open, decentralized protocol for social networking, standardized by the World Wide Web Consortium ([W3C](https://en.wikipedia.org/wiki/World_Wide_Web_Consortium)). It enables different servers or platforms to interact seamlessly, allowing users to share, follow, and engage with content across various instances, even if those instances are hosted by different providers.

### Fediverse

Activity Pub protocol powers the [Fediverse](https://en.wikipedia.org/wiki/Fediverse), a network of interconnected social media platforms like [Mastodon](https://joinmastodon.org/), [PeerTube](https://joinpeertube.org/), and [Pixelfed](https://pixelfed.org/), where users can interact regardless of the platform they're on.

We love 🥰 the [Fediverse](https://en.wikipedia.org/wiki/Fediverse) as it operates on key principles such as:

  - **Decentralization**: Unlike traditional social media platforms controlled by a single company, the Fediverse consists of independently operated servers that communicate with each other.
  - **Interoperability**: Thanks to ActivityPub, users on different platforms can interact as if they are part of the same network.
  - **User Autonomy**: Users have greater control over their data, content, and connections, and they can move their account between servers or set up their own instance.
  - **Privacy & Consent**: Many Fediverse platforms emphasize privacy and transparency, often giving users control over how their content is shared or who can access it.

🛰️ And that's what we want, to make this blog participate in this decentralized, open ecosystem, somehow.

### Mastodon

Since we are users of Mastodon, we thought checking if there was any API documentation that would fit our needs,... and it's great! Just by checking the [introduction](https://docs.joinmastodon.org/) I felt, way more, in love with it! And, let's not forget, at the end Mastodon is a [microblogging](https://en.wikipedia.org/wiki/Microblogging) technology, which totally fits here.

I also did some check if there was any person out there already making use of it, ... and yes! We totally got inspired by [Carl Schwan's post](https://carlschwan.eu/2020/12/29/adding-comments-to-your-static-blog-with-mastodon/), on how to add comments on your static blog with Mastodon. In this case, using [Hugo](https://gohugo.io/) instead of [Zola](https://www.getzola.org/).

## The implementation

To be pragmatic, we want something reusable that enables to comment on each blog post, at the end of each post, and if we want.

### The workflow

Once we finish a blog post we would create a post (called `toot` when publishing in Mastodon; expect from now on the use/mention of it) in Mastodon too, sharing the link to the blog post. But, what do we do first? 🚨 This is like [the chicken or the egg](https://en.wikipedia.org/wiki/Chicken_or_the_egg) problem.

But! We already know how the URL of the post will look like as we can run locally, with live-reload, our blog. So:

  1. Run `zola serve` and go to the almost-ready-to-publish post.
  2. Get the text path of the URL in the navigation bar in your browser, it should be something like: `/posts/your-article-title`.
  3. Publish your toot with the to-be-working link, and copy the link to the toot.
  3. At the end of the blog post content add the toot information (see `The beauty` section [below](#the-beauty)).
  5. Publish your post! There will be people waiting for the link to work!

### The tooling

As we had a good experience with the Zola's [shortcodes](https://www.getzola.org/documentation/content/shortcodes/) concept with the video embedding [here](/posts/the-tech-stack/#using-zola), we did jump into creating another one but for comments, from Mastodon.

Getting to know Mastodon's API is a great experience as you can see in their documentation's section about [Playing with public data](https://docs.joinmastodon.org/client/public/), which is what we want and can do.

Basically, we need to get our toot context data object, which is a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) to the URL that would look like: `https://{{host}}/api/v1/statuses/{{id}}/context`; where the `host` is the Mastodon's server instance public hostname (like`mastodon.social`) and `id` is the post's unique identifier.

With that data at hand we can then go over all the replies data thread, like who replied and to whom, when, from where and what. All being public data, who's publishers decided to.

Here the `comments.html` shortcode (that you can also see [here](https://github.com/gerardcl/cansixt-blog/blob/main/templates/shortcodes/comments.html)) code:

```html
<div class="container">
    <div class="notification">
        <h2 id="comments-title">Comments</h2>

        <div id="comments-container">
            <noscript><p>Loading comments relies on JavaScript. Try enabling JavaScript and reloading, or visit <a target="_blank" href="https://{{host}}/@{{username}}/{{id}}">the original post</a> on Mastodon.</p></noscript>
        </div>
        <noscript>You need JavaScript to view the comments.</noscript>

        <p class="notification is-warning soft">We love the <a href="https://fediverse.info/" target="_blank">Fediverse</a>. You can interact with this <strong><a target="_blank" href="https://{{host}}/@{{username}}/{{id}}">post</a></strong> thanks to <a href="https://joinmastodon.org/" target="_blank">Mastodon</a>. You can use your existing account hosted by another Mastodon server or compatible platform, if you don't have an account on this one. Only known non-private replies (comments) to this post are displayed.</p>
        <button class="button" id="load-comment">Load comments</button>

        <script type="text/javascript">
            function escapeHtml(unsafe) {
                return unsafe
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
            function emojify(input, emojis) {
                let output = input;

                emojis.forEach(emoji => {
                    let picture = document.createElement("figure");
                    picture.className = 'image is-32x32'; // Bulma-ready CSS class

                    let source = document.createElement("source");
                    source.setAttribute("srcset", escapeHtml(emoji.url));
                    source.setAttribute("media", "(prefers-reduced-motion: no-preference)");

                    let img = document.createElement("img");
                    img.className = "icon is-small";
                    img.setAttribute("src", escapeHtml(emoji.static_url));
                    img.setAttribute("alt", `:${ emoji.shortcode }:`);
                    img.setAttribute("title", `:${ emoji.shortcode }:`);
                    img.setAttribute("width", "20");
                    img.setAttribute("height", "20");

                    picture.appendChild(source);
                    picture.appendChild(img);

                    output = output.replace(`:${ emoji.shortcode }:`, picture.outerHTML);
                });

                return output;
            }

            async function loadComments() {
                try {
                    // Fetch comments from the Mastodon API (replace with actual API URL)
                    const response = await fetch('https://{{host}}/api/v1/statuses/{{id}}/context');
                    const data = await response.json();
                    const postId = "{{id}}";

                    // Container for comments
                    const commentsContainer = document.getElementById('comments-container');
                    commentsContainer.innerHTML = '';

                    // Helper function to create media object
                    function createMediaObject(comment, level = 0) {
                        const mediaDiv = document.createElement('article');
                        mediaDiv.className = 'media';
                        mediaDiv.style.marginLeft = `${level * 20}px`; // Indent replies for stairs effect

                        let name = "";
                        if( comment.account.emojis.length > 0 ) {
                            name = escapeHtml(comment.account.display_name);
                            name = emojify(name, comment.account.emojis);
                        } else {
                            name = comment.account.username;
                        };

                        // Media left (avatar and reply icon)
                        const mediaLeft = document.createElement('figure');
                        mediaLeft.className = 'media-left';

                        const mediaIconWrapper = document.createElement('div');
                        mediaIconWrapper.style.display = 'flex';
                        mediaIconWrapper.style.alignItems = 'center';

                        if (level > 0) {
                            const replyIcon = document.createElement('span');
                            replyIcon.className = 'icon is-small';
                            replyIcon.innerHTML = '<i class="fas fa-reply"></i>';
                            replyIcon.style.marginRight = '8px';
                            replyIcon.style.transform = 'rotate(180deg)'; // Rotate the reply icon
                            mediaIconWrapper.appendChild(replyIcon);
                        }

                        const avatar = document.createElement('p');
                        avatar.className = level > 0 ? 'image is-32x32' : 'image is-48x48'; // Smaller avatar for replies

                        const avatarLink = document.createElement('a');
                        avatarLink.href = comment.account.url; // Link to the user's profile
                        avatarLink.target = '_blank';
                        avatarLink.rel = 'noopener noreferrer';

                        const img = document.createElement('img');
                        img.src = escapeHtml(comment.account.avatar); // User avatar URL
                        img.alt = `${comment.account.display_name}'s avatar`;
                        img.style.borderRadius = '50%'; // Make the avatar round

                        avatarLink.appendChild(img);
                        avatar.appendChild(avatarLink);
                        mediaIconWrapper.appendChild(avatar);
                        mediaLeft.appendChild(mediaIconWrapper);

                        // Media content (body)
                        const mediaContent = document.createElement('div');
                        mediaContent.className = 'media-content';

                        const content = document.createElement('div');
                        content.className = 'content';

                        let instance = "";
                        if( comment.account.acct.includes("@") ) {
                            instance = comment.account.acct.split("@")[1];
                        } else {
                            instance = "{{host}}";
                        }

                        const paragraph = document.createElement('p');
                        paragraph.innerHTML = `
                            <strong>${name}</strong> <small>@${instance}</small> <small>${new Date(comment.created_at).toLocaleString()}</small><br>
                            ${comment.content}
                        `;

                        const actions = document.createElement('nav');
                        actions.className = 'level-left is-mobile';

                        const likes = document.createElement('div');
                        likes.className = 'level-item has-text-centered';
                        likes.innerHTML = `<span class="icon"><i class="fas fa-heart"></i></span> ${comment.favourites_count}`;

                        const replies = document.createElement('div');
                        replies.className = 'level-item has-text-centered';
                        replies.innerHTML = `<span class="icon"><i class="fas fa-reply"></i></span> ${comment.replies_count || 0}`;

                        const shares = document.createElement('div');
                        shares.className = 'level-item has-text-centered';
                        shares.innerHTML = `<span class="icon"><i class="fas fa-retweet"></i></span> ${comment.reblogs_count}`;

                        actions.appendChild(likes);
                        actions.appendChild(replies);
                        actions.appendChild(shares);

                        content.appendChild(paragraph);
                        content.appendChild(actions);

                        mediaContent.appendChild(content);

                        mediaDiv.appendChild(mediaLeft);
                        mediaDiv.appendChild(mediaContent);

                        return mediaDiv;
                    }

                    // Process and render comments
                    function renderComments(comments, parentId, level = 0) {
                        comments.forEach(comment => {
                            if (comment.in_reply_to_id === parentId) {
                                const commentElement = createMediaObject(comment, level);
                                commentsContainer.appendChild(commentElement);
                                renderComments(comments, comment.id, level + 1); // Recursively render replies
                            }
                        });
                    }

                    // Render top-level comments and their replies
                    renderComments(data.descendants, postId);
                    const commentsTitle = document.getElementById('comments-title');
                    commentsContainer.innerHTML += "<br><br>";
                    commentsTitle.innerHTML += "<br><br>";

                } catch (error) {
                    console.error('Error loading Mastodon comments:', error);
                }

                document.getElementById("load-comment").remove();
            }
            document.getElementById("load-comment").addEventListener("click", loadComments);
        </script>
    </div>
</div>
```

Note that we keep making use of the Bulma's CSS framework, using Bulma's provided classes, mainly the ones for [media](https://bulma.io/documentation/layout/media-object/#nesting) publishing.

### The beauty

At the end, we can have comments in our posts by just adding at the end a snippet like:

```html
  {{/* comments(host="your.mastodon.host", username="your.username", id="your.post.id") */}}
```

And, to see a real demo of it, just continue until the end of this blog post!

---

It has been more than a year since we started this blog and since then we had no new posts. This is it! We do it for fun and whenever we have time and focus then we publish something. Long story short: `better late than never`.

A cool thing now is that we can interact via Mastodon, here!

Write you in the next post!

*From the Can Sixt inhabitants*.

{{ comments(host="fosstodon.org", username="gerardcl", id="113777747405997438") }}
