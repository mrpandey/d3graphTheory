This document outlines the goals set for this project. There might be slight modifications in the roadmap from time to time.

### Convert Visualizations to d3 v5

Most of the code driving the visualizations is written in [v3 of d3.js](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md). However, newer and more optimized [v5 of d3.js](https://github.com/d3/d3/blob/master/API.md) is available. So we need to rewrite the code in d3 v5.

**Note:** This task has **highest priority** right now.

### UI
- Improve the user interface of `unit.html`. We're open to suggestions.
- Add a dark theme (night mode) which can be toggled from the navbar.

### Faster math rendering

D3 Graph Theory currently uses [MathJax](https://www.mathjax.org/) for rendering LaTeX (mathematical symbols) on a webpage. However, [KaTeX](https://katex.org/) is much faster than MathJax for this purpose. We need to convert the LaTeX code of each unit to KaTeX and complete the replacement.

### Add more topics

Here, the aim is to expand the list of chapters (aka units) in order to cover more topics. You are not advised to work on this until all the code is ported to d3 v5. Any new code is supposed to be utilizing d3 v5. A list of topics will be updated soon.