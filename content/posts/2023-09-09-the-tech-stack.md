+++
title="How we do run this blog site"
description="The decision making and the making off"
authors = ["Gerard"]
date=2023-09-24
draft=true
[taxonomies]
categories = ["Technology", "Sustainability"]
tags = ["geek", "spin", "zola"]
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

- [Zola](https://www.getzola.org/): its list of [features](https://github.com/getzola/zola#list-of-features) is just telling us this is our go to option ❤️. Fun fact: looks like the main creator was using Cobalt in the past for his personal site (check the help pages in Cobalt's docs and follow the links...).

### The server

We shall make us of a resource optmized HTTP server technology.

WebAssembly,...servers, vms, containers,...

Here we have plenty of options from cloud service providers, but most of them are not offering solutions that are really sustainable in terms of resources utilisation not usage simplicity.

While doing a bit of time travel up to today (in terms of server technology type evolution), we can list four major options of server types where we could run our site:

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

Let's now put it all together!

how we bundle the build (git, github actions, zola, spin)
zola augmented markdown (shortcodes)
how we publish example!

## User expectations

As we say here, we live in a prototype, and with most of prototypes, this is a work in progress set of implementations that comes with user testing, mockups, more testing, validations, more testing, measurements, feedback loops, more implementations and fixes, ...

Long story short; we will talk about it in another post! We are writting as we go!

---

I feel I just did write and extended ADR ([Architecture Decision Record](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)), nice!

We are learning a lot on this journey. And we hope we have been able to transmit it.

Maybe, now you got inspired on how to run your own blog or just motivated on how not to do it. Either way, if you reached this last words we believe you at least had a good time.

Write you in the next post!

*From the Can Sixt inhabitants*.
