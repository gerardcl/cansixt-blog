+++
title="How we do run this blog site"
description="The decision making and the making off"
authors = ["Gerard"]
date=2023-09-24
[taxonomies]
categories = ["Technology", "Sustainability"]
tags = ["prototype", "spin", "zola"]
[extra]
toc = true
comments = false
+++

We thought one of the first posts could be about how we run Can Sixt's blog, this blog site. With this in mind, we are going to explain what steps have been taken to make this blog happen, while showcasing some implementation details. This might turn into a series of posts indeed.

<!-- more -->

There are many ways of creating a blog site. The decision on what technology or service to select will depend on the needs and goals one has.

We won't enter into a full comparison of [CMS](https://en.wikipedia.org/wiki/Content_management_system) (Content Management Systems) nor [SSG](https://en.wikipedia.org/wiki/Static_site_generator) (Static Site Generators) technology types and solutions. There are a lot already out there! Some examples: [best CMS 2023](https://www.techradar.com/best/cms) or [best SSG 2023](https://www.techradar.com/best/static-site-generators).

Instead, we will focus on the key aspects that made us decide for a specific technology stack and describe some details on how we make use of them.

## The decision making

Before getting to decisions, we should always try to describe and understand what we need (or what we think we want 🤔).

🪁 *"We want to have a blog site that does not lock us in with a given SaaS (Software as a Service), so we can easily migrate and run it somewhere else and even work offline, if needed, by the use of Internet standards as core technology"*

🏭 *"We want to have a blog site that has a minimal footprint, so we can ensure minimal or optimal computational requirements, infrastructure complexity, management logistics and energy consumption"*

📏 *"We want to have a blog site that gives us customization power, while keeping the balance between implementation complexity and usage simplicity, so we can really feel we own it and anyone can use it"*

⌛ *"We want to spend time but not money, and we want to optimise this statement in favour of quality, while making the best use of the technology out there and maybe contribute back to it"*

It looks to me I have some influence from [Agile development](https://www.agilealliance.org/agile101/) here... fine, focus!

Now, based on the items described, looks like we can already start listing some basic or core decisions.

### Static Site Generator

Since a CMS-like solution requires many components aside of the [HTML](https://en.wikipedia.org/wiki/HTML) stuff perse, such as a server renderer or a database, we have discarded this in favour of the SSG option. Ensuring we meet our needs 🚀.

Let's go over the rationale behind:

✅ The SSG option offers:

- Some sort of tool/engine to compile the content (templates, posts, pictures, styles, ...) into static files (our blog!). Without requiring a database or an [API](https://en.wikipedia.org/wiki/API) to retrieve the content from.
  - Since most of the SSG engines are provided as [CLI](https://en.wikipedia.org/wiki/Command-line_interface), we can reproduce and automate anywhere the content generation.
- Flexibility on running our site anywhere we see fit. Only requiring some kind of [HTTP](https://en.wikipedia.org/wiki/HTTP) server somewhere to serve such compiled files over Internet.
- Greater customization and editing options. Since we have direct control of styles, themes (I would even say easier to handle compared to some nice CMS out there), etc. and a bunch of ways to create our posts (offline, any editor we like, ...).

⚠️ But we need to note that:

- This requires at least one person to know what is doing and going over the initial setup. As well as able to maintain it (but little maintenance if done well from the beginning 😉).
- The editing part will be done with some sort of [Markdown](https://en.wikipedia.org/wiki/Markdown) text editing technology. Almost like writing as we all know, but with some "comfortable" conventions over how to create titles, references, images, tables, ...
- Publishing new posts will require some sort of (automagic) process to get them online. We will describe how we do it some lines below.

We really feel comfortable heading to this decision. All those years building sites with different CMS, Headless-CMS and/or SSG solutions out there finally pays off.

## The making off

Ok, so which SSG are we going to select and how/where are we going to run it? Well, if we refer to our "wish list", let's describe it:

### The engine

We focus on using an engine that is really just that (an egine); that is powerful, lightweight and fast. Being the main and only piece that validates/compiles/generates/build our content, in milliseconds. With batteries included.

And, here comes 🦀 [Rust](https://en.wikipedia.org/wiki/Rust_(programming_language)) to rescue us, to make possible to have only one executable engine, small, reliable and fast. Also, since building engines, CLIs and working with web standards is one of its strengths, we definitely have selected a SSG CLI written in Rust.

Such decision will also help us reduce the [list of SSG options](https://jamstack.org/generators/).

By the time of writting this post we know and tested the following SSG engines written in Rust:

- [mdBook](https://rust-lang.github.io/mdBook/): it looks great for tech documentation or book-like sites generation. Hence we discard it right away, but I keep it under my radar 🧭.

- [Cobalt](https://cobalt-org.github.io/): really simple yet powerful SSG ✅, but documentation is not that helpful and community is not that big. And, in order to enable functionalities we really want (like search or multi-lang) we would need to add more effort we don't need to put since we have the next option.

- [Zola](https://www.getzola.org/): its list of [features](https://github.com/getzola/zola) is just telling us this is our go to option ❤️. Fun fact: looks like the main creator was using Cobalt in the past for his personal site (check the help pages in Cobalt's docs and follow the links...).

### The server

We shall make us of a resource optmized HTTP server technology.

Here we have plenty of options from cloud service providers, but most of them are not offering solutions that are really sustainable in terms of resources utilisation not usage simplicity.

While doing a bit of time travel up to today (in terms of server technology type evolution), we can list four major options (yep, you will see a special fifth one 📢) of server types where we could run our site:

- [Bare-metal machine](https://en.wikipedia.org/wiki/Bare-metal_server): that would be an option if I would have my own home made data center (for sure I would not have it on the cloud although there are really good service providers offering this option), but that is not (yet?) the case. This would really provide full ownership and control of the resources being used and give the chance to optimise it as much as possible, but for now it is discarded; focus!

- [Virtual machines (VMs)](https://en.wikipedia.org/wiki/Virtual_machine): inside of a bare-metal server, we can manage multiple virtualized machines (so we can even reproduce and replicate them easily), but that comes with a lot of over-head since it requires virtualising hardware layers. And we do not need that, at least nowadays.

- [Contaners (virtual-OS)](https://en.wikipedia.org/wiki/OS-level_virtualization): with this we can have multiple isolated and virutalised Operating Systems ([OS](https://en.wikipedia.org/wiki/Operating_system)), running on just one real OS, in a VM and/or a bare-metal machine. This could be a great candidate in terms of portability, but it still requires (most of the times) too much resources. We can aim for something way leaner.

- [Serverless Functions](https://en.wikipedia.org/wiki/Serverless_computing): this is really cool if you think on resource optimisation, but it is harder to own it or maintain it and usually it implies a hard lock in with a cloud provider, with custom vendor-made implementations. Moreover, you don't really know what is really happening in terms of real resources utilisation.

- 🎯 [WebAssembly (WASM)](https://en.wikipedia.org/wiki/WebAssembly): this is getting really cool now. You may say: *what? why WASM? ins't it oriented towards client side runtimes?* well, with the implementation of the [WASI](https://wasi.dev/) standard (which enables WASM to reach OS operations), one can say this is the ultimate leaner approach to have portable software (with the most *cyber*secure approach!). And, this would mean we might be able to have a better Serverless Functions approach (with the whole concept based on Internet standards).

**But!** 🤔 there is a missing piece here: *we need to be able to handle HTTP requests in order to be able to create HTTP-based software with WASM with WASI, right?* well... that is why something is ongoing to fix it, called [WAGI](https://github.com/deislabs/wagi) (the [CGI](https://en.wikipedia.org/wiki/Common_Gateway_Interface) for WASM; hell yeah! back to the 90's! 😉)!

It really feels we have come to an end to closing some kind of temporal space and time loop here 🤖! And, yes, that is thanks to Rust, again 🤩 (check closer to all new concepts to understand why, I might write a full post just about it indeed...now, focus!).

Now, please, take a seat, what if I tell you there are people in companies implementing cloud technologies, OpenSource and oriented towards providing WASM with WAGI as the new way of containerisation for production ready use cases? yes, it is 🎉!

And that, being the selected server technology 🚀, is the technology of a pacesetter company in this case: [Fermyon](https://www.fermyon.com/about), with their [Fermyon Spin Framework](https://www.fermyon.com/blog/introducing-spin) ⚛.

### The publishing

Having the engine and the server, let's now put it all together!

#### Using Zola

First thing when one gets to start trying Zola is that feeling that the documentation is really going to help you. Thanks to that I don't need to explain too much on how to use it, but invite you to check its [getting started](https://www.getzola.org/documentation/getting-started/overview/) guide.

When executing the init command we said 𝒀𝒆𝒔 to everything, and started researching what theme we could already benefit from (if any), and for that the [themes](https://www.getzola.org/themes/) list helped too! 👈 definitive feeling that this project is in a good shape!

I love the [templating](https://www.getzola.org/documentation/templates/overview/) and [styling](https://www.getzola.org/documentation/content/sass/) possibilities of Zola, which are limitless thanks to [Tera](https://keats.github.io/tera/) (template engine) and [SASS](https://sass-lang.com/) (using [grass](https://github.com/connorskees/grass) compiler to compile [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)).

We found a great theme to start with, called [DeepThought](https://github.com/RatanShreshtha/DeepThought), in such a way that we even have contributed to make it better 🤗 (see [issue #85](https://github.com/RatanShreshtha/DeepThought/issues/85) and the [PR](https://github.com/RatanShreshtha/DeepThought/pull/86) proposal). One feature I like from this theme is the use of [Bulma](https://bulma.io/) CSS framework 💯 (which helps non web design experts like me 🥹).

Now, let me show you what is Bulma in the next official video, while explaining a great feature in Zola, the [`shortcodes`](https://www.getzola.org/documentation/content/shortcodes/). And we do it by showing a shortcode we have created for us to embed videos (for now from vimeo or youtube), and looks like this (under *templates/shortcodes/video.html*):

```bash
<div class="{{class | default(value="is-flex is-justify-content-center is-align-items-center")}}">
    <iframe
        {% if type is matching("youtube") %}
        src="https://www.youtube.com/embed/{{id}}"
        {% elif type is matching("vimeo") %}
        src="https://player.vimeo.com/video/{{id}}"
        {% endif %}
        width="640" height="338"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen>
    </iframe>
</div>
```

Which then by just adding in our posts or pages (written in Markdown) the following snipped:

```bash
{{/* video(type="vimeo", id="237608586") */}}
```

Will result in the next video, embedded like in this post, showing why we like using Bulma indeed:

{{ video(type="vimeo", id="237608586") }}

*NOTE*: one can also use another CSS class (by adding the `class` attribute in the shortcode) but there is a default provided, hence we shall only require setting the `type` and the `id` attributes, nice!

The final cool thing I want to explain (for now*) is the live reload feature of Zola, which indeed I am using constantly while writting this (any) post, and this is by just having in a terminal in the root folder of this repository the following command:

```bash
zola serve --drafts
```

And I like adding the `---drafts` flag to the CLI, to make sure I load the posts I am working on but still don't want to publish/build 🧑‍💻.

*For now, I will stop talking more about Zola, since it deserves its own post.

**But!** let me share to you the whole public repository where we manage, build and deploy all this blog site ([cansixt-blog](https://github.com/gerardcl/cansixt-blog)). There you can see the project structre, how we make use of [template extend](https://www.getzola.org/documentation/themes/extending-a-theme/) feature on themes, and many other cool stuff I will explain in future 🌟.

#### Using Spin

We don't (yet) make use of the full potential of Fermyon's Spin Framework. But, just using its WASM build capabilities into a static file server service.

While inviting you to go and check yourself its [getting started](https://developer.fermyon.com/spin/quickstart) guide and good documentation (with guides, tutorials, examples,...), I want to highlight the three main selling points they claim and which we love:

- Automatically scales-to-zero: Requests are so fast, services can shut back down seamlessly between requests — minimizing compute consumption.
- Secure by default: Every WASM application runs in a secure sandbox — eliminating cross contamination.
- Compute less, save more: A lighter, faster, and more efficient model means lower cost and more sustainable for your business and our planet.

In this [repo](https://github.com/gerardcl/cansixt-blog), you will see we have a `src` folder, and this is because we aim at some point to run some HTTP service to enhance and add some more functionalities we might need for this blog (and because we like testing and playing!).

**But!**, right now we only specify which folder shall be used as the asset folder for the static file service server we will `spin up`. This folder is the `public` folder that our `zola build` command outputs to.

And, here comes the magic power of Spin, that by just defining a component in its `spin.toml` config file, like it's shown next, we are ready to go:

```toml
[[component]]
source = { url = "https://github.com/fermyon/spin-fileserver/releases/download/v0.0.3/spin_static_fs.wasm", digest = "sha256:38bf971900228222f7f6b2ccee5051f399adca58d71692cdfdea98997965fd0d" }
id = "cansixt-blog"
files = [ { source = "public", destination = "/" } ]
environment = { CUSTOM_404_PATH = "404.html", FALLBACK_PATH = "404.html" }
[component.trigger]
route = "/..."
```

To understand it, you can visit the [writting apps](https://developer.fermyon.com/spin/writing-apps) page, but in short:

1. In the `component` section we describe we want to use the `spin-fileserver` WASM implementatin they already created for us, on the `source` attribute (with a nice checksum check!).

2. Then, we make use of the `files` attribute to map which source folder is to be used and where to mount it.

3. We also define nice `environment` variables to make sure we offer a nice user experience when something is not found.

4. And, we define what will be the endpoint `route` that will trigger the scale up of the service for any HTTP request incoming.

That's it! The main commands we would be regularly use to deploy our blog are:

```bash
zola build
spin deploy  # with a `spin login` first!
```

A cool thing I want to share is that one can also `spin up` locally the deployment of it, with some slight changes on the previous commands:

```bash
zola build --base-url http://127.0.0.1:3000  # here you could also use the `--drafts` command 😍
spin up
```

This is really great since one can fully test if all is working as expected, before publishing online 🧙🏻‍♂️!

#### Automating it with some GitOps

I love automation 🧑‍🔧, it's one of the greatest things technology can provide to humankind, hence we won't be missing it here!

Since we manage this blog site in `GitHub`, we can make use of [GitHub Actions](https://docs.github.com/en/actions). And, we do so by having, under the `.github/workflows` folder, a file that describes what we want to do/automate, called `build-deploy.yml` (pretty declarative ☝️🤓):

```yaml
name: Zola build and Spin deploy

on:
  push:
    branches:
      - main

jobs:
  zola_build_and_spin_deploy:
    runs-on: ubuntu-latest
    name: Zola build and Spin deploy
    steps:
      - name: Checkout main
        uses: actions/checkout@v3.0.0

      - name: Zola build
        uses: shalzz/zola-deploy-action@v0.17.2
        env:
          BUILD_ONLY: true
          CHECK_LINKS: true

      - name: Install Rust with WASM toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          toolchain: 1.71
          targets: wasm32-wasi

      - name: Install Spin
        uses: fermyon/actions/spin/setup@v1

      - name: Spin build and deploy
        uses: fermyon/actions/spin/deploy@v1
        with:
          fermyon_token: ${{ secrets.FERMYON_CLOUD_TOKEN }}
```

That's it! We basically make use of three actions

1. The [zola-deploy-action](https://github.com/shalzz/zola-deploy-action) action: to check links are working and to (only) build the site.
2. The [rust-toolchain](https://github.com/dtolnay/rust-toolchain): to install Rust and WASM toolchain, required for Spin.
3. The [fermyon actions](https://github.com/fermyon/actions): to [spin-setup](https://github.com/fermyon/actions/blob/main/src/actions.ts) and [spin-deploy](https://github.com/fermyon/actions/blob/main/src/actions.ts) to [Fermyon's cloud](https://www.fermyon.com/cloud).

We have our blog site up and running with every new change with less than a minute! ⏱️

Finally, the final piece 🧩, it's worth mentioning the feature (also in the free plan!) that enables users to use their [custom domain](https://developer.fermyon.com/cloud/custom-domains-tutorial) on Fermyon's cloud.

## User expectations

As we say here, we live in a prototype, and with most of prototypes, this is a work in progress set of implementations that comes with user testing, mockups, more testing, validations, more testing, measurements, feedback loops, more implementations and fixes, ...

Long story short; we will talk about it in another post! We are writting as we go!

And, being it the real challenge to me, I hope with the current setup non-tech savvy people will be able to contribute to this blog!

---

I feel I just did write and extended ADR ([Architecture Decision Record](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)), nice!

We are learning a lot on this journey. And we hope we have been able to transmit it.

Maybe, now you got inspired on how to run your own blog or just motivated on how not to do it. Either way, if you reached this last words we believe you at least had a good time.

Write you in the next post!

*From the Can Sixt inhabitants*.
