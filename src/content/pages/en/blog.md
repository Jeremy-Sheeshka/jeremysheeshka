---
title: Blog
permalink: '/{{ lang }}/blog/{% if pagination.pageNumber >=1 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html'
key: 'blog'
description: "I write things related to music, technology and my understanding of things I have learned and want to share. I write to inform, to persuade, and to entertain"
layout: blog
pagination:
  data: collections.blog_en
  size: 6
---
