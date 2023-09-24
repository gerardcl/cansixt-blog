# Blog repository

This is the repository where we manage, build and deploy our blog.

Tech stack is:

- [Spin](https://www.fermyon.com/spin/): to serve the blog's static files
- [Zola](https://www.getzola.org/): for building the blog's static files
- Template: blog site template is based on [DeepThought](https://github.com/RatanShreshtha/DeepThought) zola template, which also uses [Bulma](https://bulma.io/).

## Blog

We create blog posts on Markdown files, with some metadata (frontmatter) and making use of the extended Markdown specification ([CommonMark](https://commonmark.org/)) being used in Zola.

The `zola` CLI let's us see changes in real-time by using:

```bash
zola serve --drafts
```

## Build

Zola takes care of compiling all Markdown files and all other resources to build the static site, generated into `public` directory.

```bash
zola build
```

## Deploy

We deploy to Spin (Fermyon's cloud), using the `spin` CLI.

```bash
spin deploy
```
