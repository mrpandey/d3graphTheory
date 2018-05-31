var contentData =
{
	"vertices-and-edges": {

		"content-title": "Vertices and Edges",

		"theory-content":		"<div><span style: 'whitespace: nowrap'>A graph is a collection of vertices<\/span><span style: 'whitespace: nowrap'><svg width=30 height=30 xml:space='preserve' style='margin-left: 4; margin-right: 0 position:relative'><g><circle cx='15' cy='15' r='10' fill='#1f77b4'/></g></svg><\/span><span style: 'whitespace: nowrap'><svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 0; position:relative'><g><circle cx='15' cy='15' r='10' fill='#ff7f0e'/></g></svg><\/span><span style: 'whitespace: nowrap'><svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 4; position:relative'><g><circle cx='15' cy='15' r='10' fill='#2ca02c'/></g></svg><\/span><span style: 'whitespace: nowrap'>interconnected by edges<\/span><span style: 'whitespace: nowrap'><svg width=30 height=30 xml:space='preserve' style='margin-left: 4; margin-right: 0 position:relative'><g><line x1='5' y1='25' x2='25' y2='5' stroke='#888' stroke-width='2px' stroke-linecap='round' stroke-linejoin='round'/></g></svg><\/span><span style: 'whitespace: nowrap'><svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 0; position:relative'><g><line x1='5' y1='25' x2='25' y2='5' stroke='#888' stroke-width='2px' stroke-linecap='round' stroke-linejoin='round'/></g></svg><\/span><span style: 'whitespace: nowrap'><svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 0; position:relative'><g><line x1='5' y1='25' x2='25' y2='5' stroke='#888' stroke-width='2px' stroke-linecap='round' stroke-linejoin='round'/></g></svg><\/span><span style: 'whitespace: nowrap'>.  We denote the set of all vertices by \\(V\\) and set of all edges by \\(E\\).<\/p><p>Got it? Now in easy words: A graph has two components - a <b>set of vertices<\/b> \\(V\\) AND a <b>set of edges<\/b> \\(E\\). Where an edge is something acting as a link between two vertices. Period.<\/p><p>If an edge connects two vertices \\(v_1\\) and \\(v_2\\), then we denote the edge by \\(v_1v_2\\), which is same as \\(v_2v_1\\).<\/p><p>Two vertices are said to be <b>adjacent<\/b> if they are connected by an edge.<\/p><p>Now read the instructions below and create your own graph. You will see the corresponding sets \\(V\\) and \\(E\\) below the graph area. Start playing around and get yourself comfortable with the set notations.<\/span><\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output":		"",

		"prev":		"index.html",
		"next":		"?order-and-size",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"order-and-size": {

		"content-title": "Order and Size of a Graph",

		"theory-content":		"<p><b>Order <\/b> of a graph is the number of vertices in the graph.<\/p><p><b>Size <\/b> of a graph is the number of edges in the graph.<\/p><p> Create some graphs of your own and observe its order and size. Do it a few times to get used to the terms. <\/p><p> Now clear the graph and draw some number of vertices (say \\(n\\)). Try to achieve the maximum size with these vertices. Try this for different values of \\(n\\). <\/p><p> Notice something? What's the maximum size possible for a graph of order \\(n\\)? <\/p><div class=\"hint\"> <span class=\"hint-word\">Hint: <\/span>Maximum size is achieved when all the vertices are connected to each other. <\/div><p> The answer is below. No, don't look just yet. Clear the graph and try again a few times. <\/p><div class=\"toggle-container\"> <span class=\"toggle-link target-hidden\">Click to see answer<\/span> <div class=\"toggle-content\"> <p> The answer is \\(\\frac{n(n-1)}{2}\\). <\/p><p> But why? Because the maximum number of edges you can draw is same as the number of ways you can select two vertices. <\/p><p> So let's select the first vertex and call it \\(a\\). We can select \\(a\\) in \\(n\\) ways. To select the other vertex, we're left with \\(n-1\\) vertices. So we can select two vertices in \\(n(n-1)\\) ways, right? <\/p><p> No. That's because we counted twice. What if \\(b\\) was the first selection and \\(a\\) the other one? Got it? Remember that \\(ab\\) and \\(ba\\) represent the same edge. <\/p><p> Hence we divide by \\(2\\) and get \\(\\frac{n(n-1)}{2}\\) as the answer. <\/p><\/div><\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output":		"",

		"prev":		"?vertices-and-edges",
		"next":		"?degree-of-vertex",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"degree-of-vertex": {

		"content-title": "Degree of a Vertex",

		"theory-content":		"<p><b>Degree<\/b> of a vertex is the number of edges falling on it. It tells us how many other vertices are adjacent to that vertex.<\/p><p> In the diagram, each vertex is labelled by its degree. Make some changes and see how degree of vertices change. <\/p><p> Degree of a vertex \\(v\\) is denoted by \\(deg(v)\\). The vertices with \\(deg(v)=0\\) are lone wolves &mdash; unattached to anyone. We have a special name for them. <\/p><p> The vertices having <b>zero degree<\/b> are called <b>isolated vertices.<\/b> They don't have any other vertex connected to them. <\/p><p> The minimum degree in a graph \\(G\\) is symbolized by \\(\\delta(G)\\). And the maximum one by \\(\\Delta(G)\\). To avoid confusion between them, remember that \\(\\delta\\) is the \"small delta\" and \\(\\Delta\\) is the \"big delta\". <\/p><div class=\"note\"> <span class=\"note-word\">Note:<\/span> Remember that \\(\\delta\\) and \\(\\Delta\\) are properties of a graph, whereas \\(deg\\) is property of a vertex. <\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output":		"",

		"prev":		"?order-and-size",
		"next":		"?degree-sequence",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"degree-sequence": {

		"content-title": "Degree Sequence of a Graph",

		"theory-content":		"<p><b>Degree sequence<\/b> of a graph is the list of degree of all the vertices of the graph. Usually we list the degrees in <b>decreasing order<\/b>, that is from largest degree to smallest degree. <\/p><div class=\"note\"> <span class=\"note-word\">Note:<\/span> The degree sequence is always decreasing. Therefore, every graph has a <b>unique degree sequence.<\/b> <\/div><p> In the diagram, the text inside each vertex tells its degree. Draw some graphs of your own and see their degree sequence. <\/p><p> You will observe that the sum of degree sequence is always twice the size of graph. This is, in fact, a mathematically proven result (theorem). <\/p><div class=\"result\"> <span class=\"result-word\">Theorem:<\/span> The sum of degree of all vertices of a graph is twice the size of graph. <p> Mathematically, \\[\\sum deg(v_i)=2|E|\\] where, \\(|E|\\) stands for the number of edges in the graph (size of graph). <\/p><\/div><p> The reasoning behind this result is quite simple. An edge is a link between two vertices. So each edge contributes exactly \\(2\\) to the degree sum. And hence, the degree sum must be twice the number of edges. <\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output":		"",

		"prev":		"?degree-of-vertex",
		"next":		"?graphic-sequence",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"graphic-sequence": {

		"content-title": "Graphic Sequence",

		"theory-content":		"<p>A sequence of numbers is said to be a <b>graphic sequence<\/b> if we can construct a graph having the sequence as its degree sequence. <\/p><p> Okay, that was a bit confusing. So what's a graphic sequence again? <\/p><p> Let's say you have a list of numbers. Assign each number to an isolated vertex. Now, can you connect these vertices in a way that each vertex is adjacent to as many vertices as the number assigned to it? If yes, then the list of numbers is graphic. Otherwise not. Things will be clear in a while. <\/p><p> <b>Example 1:<\/b> The sequence \\((3,3,2,1,1,0)\\) is graphic. In the diagram, you can see the vertices have these numbers as their degrees. Notice that the sequence remains graphic even when you remove the \\(0\\). <\/p><div class=\"note\"> <span class=\"note-word\">Note:<\/span> A sequence containing only zeroes is always graphic. <\/div><p> <b>Example 2:<\/b> The sequence \\((4,3,2,1)\\) is not graphic. We need at least four other vertices to satisfy the degree of the vertex having \\(4\\) as its degree. But we have only three. <\/p><p> <b>Example 3:<\/b> The sequence \\((4,3,3,2,2,1)\\) is not graphic. Recall that sum of degrees is <b>twice<\/b> the number of edges. So sum of a graphic sequence must be even. This isn't the case here. <\/p><p> The following sequences are graphic. Try to draw a graph for each one of them. You can see the answer by clicking the link next to them. <\/p><p> \\((5,1,1,1,1,1)\\) <span class=\"graph-event-link\" id=\"prob0\"> Show solution<\/span> <\/p><p> \\((2,2,2,2,2)\\) <span class=\"graph-event-link\" id=\"prob1\"> Show solution<\/span> <\/p><p> \\((4,4,4,4,4,0)\\) <span class=\"graph-event-link\" id=\"prob2\"> Show solution<\/span> <\/p><p> \\((3,3,2,2,2)\\) <span class=\"graph-event-link\" id=\"prob3\"> Show solution<\/span> <\/p><p> \\((5,3,3,3,2,2)\\) <span class=\"graph-event-link\" id=\"prob4\"> Show solution<\/span> <\/p><div class=\"note\"> <span class=\"note-word\">Note:<\/span> A graph has a unique degree sequence. But more than one different graphs might be possible for the same graphic sequence. <\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output":		"",

		"prev":		"?degree-sequence",
		"next":		"?havel-hakimi",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"havel-hakimi": {

		"content-title": "Havel-Hakimi Algorithm",

		"theory-content":		"<p>It is a difficult task to determine whether a sequence is graphic or not. The Havel-Hakimi Theorem makes the task a lot easier. <\/p><p>Go through the theorem or you can skip it and jump on to the algorithm at the bottom.<\/p><div class=\"result\"> <span class=\"result-word\">Havel-Hakimi Th: <\/span> The decreasing sequence \\[(d_1, d_2, ..., d_n)\\] is graphic if and only if the sequence \\[ (d_2-1, d_3-1, ..., d_{d_1+1}-1, \\\\d_{d_1+2}, d_{d_1+3}, ..., d_n) \\] is also graphic. <\/div><p> See how the second sequence was built? The first sequence was decreasing, which means the highest degree in it is \\(d_1\\). We took the vertex having highest degree (\\(d_1\\)) and connected it to next \\(d_1\\) vertices with highest degrees. In the new degree sequence, we have exhausted first term of the previous sequence and decreased next \\(d_1\\) terms by one.<\/p><p> Now, the theorem says that either both the sequences are graphic or both are non-graphic. We can again apply the theorem on the new sequence to obtain yet another sequence. We can repeat this process till the problem reduces to an easy one. Thus all of the sequences obtained in this process will be graphic or none them would be.<\/p><div class=\"note\"> <span class=\"note-word\">Note: <\/span> The sequence obtained after applying theorem might not be decreasing. In such a case, you will have to rearrange it in decreasing order before re-applying the theorem. <\/div><p> You can check this <a href=\"https:\/\/en.wikipedia.org\/wiki\/Havel%E2%80%93Hakimi_algorithm\" target=\"_blank\">Wikipedia link<\/a> for more information. You can search the internet for proof of the theorem. <\/p><div class=\"note\"><span class=\"note-word\">Note: <\/span> A sequence with all zeroes is graphic since we can always draw that many isolated vertices.<\/div><p>Your task now is to draw a graph for the each of the given graphic sequences. For this task, you can <b>use the following algorithm<\/b> which is based on the above theorem.<\/p><div class=\"result\"> <span class=\"result-word\">Algorithm: <\/span> <p><\/p><ol> <li>Pick the vertex with highest target degree. Lets call this value \\(k\\).<\/li><li>Connect this vertex to next \\(k\\) vertices having highest degree. Now this vertex has been exhausted.<\/li><li>Repeat steps 1 and 2 till you exhaust all the vertices.<\/li><li>If all the vertices get exhausted, then the sequence has reduced to all zeroes and hence the sequence is graphic.<\/li><li>If you end up with non-zero vertices that can't be exhausted further, then the sequence isn't graphic.<\/li><\/ol> <\/div><p>It is guaranteed that all the sequences in this exercise are graphic.<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete an edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"prev-prob\" class=\"btn btn-default\">Prev<\/button> <button type=\"button\" id=\"clear-edges\" class=\"btn btn-default\">Reset Edges<\/button> <button type=\"button\" id=\"next-prob\" class=\"btn btn-default\">Next<\/button>",

		"svg-output": "<div class=\"text-center\"> <ul class=\"pagination\" id=\"prob-list\"> <li><a>1<\/a><\/li><li><a>2<\/a><\/li><li><a>3<\/a><\/li><li><a>4<\/a><\/li><li><a>5<\/a><\/li><li><a>6<\/a><\/li><li><a>7<\/a><\/li><li><a>8<\/a><\/li><li><a>9<\/a><\/li><li><a>10<\/a><\/li><li><a>11<\/a><\/li><li><a>12<\/a><\/li><\/ul> <\/div>",

		"prev":		"?graphic-sequence",
		"next":		"?pigeonhole",
		"script":	"app.js",
		"star":		"y",
		"style":	"app.css"
	},

	"pigeonhole": {

		"content-title": "Pigeonhole Principle",

		"theory-content":		"<p> Pigeonhole principle is very simple and intuitive, but its applications in discrete mathematics are surprisingly frequent. <\/p><div class=\"result\"> <span class=\"result-word\">Pigeonhole Principle: <\/span> If we put \\(n\\) pigeons in less than \\(n\\) pigeonholes, then at least one pigeonhole contains more than one pigeons. <\/div><p> You can replace <i>pigeons<\/i> by <i>items<\/i> and <i>pigeonholes<\/i> by <i>boxes<\/i>. So the principle says that if we have more items and less boxes, and we distribute all the items in these boxes, then at least one box will have more than one items. <\/p><p> The hard part is to apply this theorem. You will have to decide what objects represent your pigeons and pigeonholes. <\/p><p> <b>Example 1: <\/b> Did you notice that there are only ten different colors of vertices in these lessons? So if there are more than ten vertices in the graph, then there is at least one pair of vertices having same color!! See it for yourself. The ten colors can be thought of as ten pigeonholes. And each vertex as a pigeon. <\/p><div class=\"result\"> <span class=\"result-word\">Example 2: <\/span> In any graph having more than one vertex, there is at least one pair of vertices having same degree. <\/div><p> This means you can't have a graph of \\(order \\geq 2\\) with all distinct degrees. Some degree will repeat for sure. See it for yourself by drawing a graph of \\(order \\geq 2\\).<\/p><p>But why does this happens? Try to come up with an explanation. You can help yourself by trying to draw a graph with all vertices having distinct degrees. <\/p><div class=\"hint\"> <span class=\"hint-word\">Hint: <\/span> Assume \\(order=n\\) and think about the range of a degree value in terms of \\(n\\). <\/div><div class=\"toggle-container\"> <span class=\"toggle-link target-hidden\">Click to see explanation<\/span> <div class=\"toggle-content\"> <p> Assume our graph has \\(order=n\\). A vertex can be connected to a maximum of \\(n-1\\) other vertices. So \\(0 \\leq deg(v_i) \\leq n-1\\). <\/p><p> It appears that for our \\(n\\) vertices, there are \\(n\\) choices for degree (from \\(0\\) to \\(n-1\\)). So, if we treat distinct degrees as pigeonholes and the vertices as pigeons, shouldn't \\(n\\) disctinct degrees should be possible then? <\/p><p> No. Our further observations reveal why. <\/p><p> Notice that in a graph of order \\(n\\), vertices with degrees \\(0\\) and \\(n-1\\) cannot exist simultaneously. <\/p><p> If there exists a vertex with degree \\(0\\), it means that this vertex is not connected to any other vertex. Hence, a vertex cannot be connected to all the \\(n-1\\) other vertices. So we get \\(0 \\leq deg(v_i) \\leq n-2\\) in this case. <\/p><p> If there exists a vertex with degree \\(n-1\\), then this vertex is connected to all \\(n-1\\) other vertices. Therefore, there cannot be an isolated vertex. So we get \\(1 \\leq deg(v_i) \\leq n-1\\) in this case. <\/p><p> In both the above cases, we have \\(n\\) vertices (pigeons) but only \\(n-1\\) possible degrees (pigeonholes). So we're assured to have a pigeonhole (degree) with more than one pigeon (vertex). <\/p><\/div><\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output": "",

		"prev":		"?havel-hakimi",
		"next":		"?regular-graph",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"regular-graph": {

		"content-title": "Regular Graph",

		"theory-content":		"<p> A graph in which all the vertices have same degree is called a <b>regular graph<\/b>. <\/p><p> A regular graph where degree of each vertex is \\(k\\) is called as \\(k\\mbox{-}regular\\). <\/p><p> The figure shows a \\(3\\mbox{-}regular\\) graph of order \\(6\\). <\/p><p>Try to construct the following regular graphs.<\/p><p>\\(1\\mbox{-}regular\\) of order \\(2\\)<\/p><p>\\(1\\mbox{-}regular\\) of order \\(6\\)<\/p><p>\\(2\\mbox{-}regular\\) of order \\(3\\)<\/p><p>\\(2\\mbox{-}regular\\) of order \\(5\\)<\/p><p>\\(4\\mbox{-}regular\\) of order \\(5\\)<\/p><p>\\(4\\mbox{-}regular\\) of order \\(6\\)<\/p><p>\\(4\\mbox{-}regular\\) of order \\(7\\)<\/p><p>\\(5\\mbox{-}regular\\) of order \\(6\\)<\/p><p> Solutions to above problems aren't provided. You should be able to solve them all by yourself. If you face difficulty in drawing the graphs, you can see the hint given below. But you must try first. <\/p><div class=\"hint toggle-container\"> <span class=\"toggle-link target-hidden\">Click to see hint<\/span> <div class=\"toggle-content\"> <span class=\"hint-word\">Hint: <\/span> Figure out the degree sequence of regular graph. Then use Havel-Hakimi to construct graph. Note that the text in vertex represents its degree and not target degree. <\/div><\/div><p> A little task for you now. Find the number of edges in a \\(k\\mbox{-}regular\\) graph of order \\(n\\). Start by constructing and observing regular graphs of small order. In case you don't get it, below is the answer. <\/p><div class=\"result toggle-container\"> <span class=\"toggle-link target-hidden\">Click to see answer<\/span> <div class=\"toggle-content\"> \\[|E|=\\frac{nk}{2}\\] This is derived from the fact that sum of degrees is twice the number of edges. \\[\\sum deg(v_i)=2|E|\\] Here the sum of degrees is \\(nk\\). <br>We also see that the sum of degrees (\\(nk\\)) will be an odd number when both \\(n\\) and \\(k\\) are odd. We cannot have number of edges as a fractional number, and therefore a regular graph with both \\(n\\) and \\(k\\) odd cannot exist. <\/div><\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output": "",

		"prev":		"?pigeonhole",
		"next":		"?complete-graph",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"complete-graph": {

		"content-title": "Complete Graph",

		"theory-content":		"<p> A graph in which each vertex is connected to every other vertex is called a <b>complete graph<\/b>. <\/p><p> Note that degree of each vertex will be \\(n-1\\), where \\(n\\) is the order of graph. <\/p><p> So we can say that a complete graph of order \\(n\\) is nothing but a \\((n-1)\\mbox{-}regular\\) graph of order \\(n\\). <\/p><p>A complete graph of order \\(n\\) is denoted by \\(K_n\\).<\/p><p> The figure shows a complete graph of order \\(5\\). <\/p><p> Draw some complete graphs of your own and observe the number of edges. <\/p><p> You might have observed that number of edges in a complete graph is \\(\\frac{n(n-1)}{2}\\). This is the maximum achievable size for a graph of order \\(n\\) as you learnt in <a href=\"?order-and-size\">Order and Size<\/a>. <\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output": "",

		"prev":		"?regular-graph",
		"next":		"?bipartite",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"bipartite": {

		"content-title": "Bipartite Graph",

		"theory-content":		"<p> A graph is said to be <b>bipartite<\/b> if we can divide the set of vertices in two disjoint sets such that there is no edge between vertices belonging to same set. <\/p><p>Let's break it down.<\/p><p> Here we are dividing set of vertices in two groups (or sets). Each vertex goes into one of these groups. This is like labelling each vertex either A or B. <\/p><p> Each vertex has only one label. So the two sets are <b>disjoint<\/b> i.e. the two sets don't have any vertex in common. <\/p><p> And there should not be any edge running within the same set. This means that every edge runs between two vertices belonging to different sets &mdash; one labelled as A and other as B. <\/p><p> So if we can label our vertices in such a way, then the graph is bipartite. Otherwise not. <\/p><p> Draw some graphs of your own to understand it better. <\/p><p> For a bipartite graph, the vertices of set \\(A\\) and \\(B\\) are shown in orange and green colors, respectively. If it isn't bipartite, the vertices will have usual colors. <\/p><div class=\"note\"> <span class=\"note-word\">Note: <\/span> Isolated vertices do not influence whether the graph is bipartite or not. They can be ignored. <\/div><p> Isolated vertices are colored silver to show that these vertices are ignored. We can put them randomly in any set, and our graph would still be bipartite (or non-bipartite). <\/p><p>Were you paying attention to the sum of degrees of the two sets?<\/p><div class=\"result\"> <span class=\"result-word\">Theorem: <\/span>In a bipartite graph, the sum of degrees of vertices of each set is equal to the number of edges. \\[\\sum_{v \\in A}deg(v)=\\sum_{v \\in B}deg(v)=|E|\\] <\/div><p>Why does it holds true? Try to reason out yourself.<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output": "",

		"prev":		"?complete-graph",
		"next":		"?complete-bipartite",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"complete-bipartite": {

		"content-title": "Complete Bipartite Graph",

		"theory-content":		"<p> <b>Complete bipartite<\/b> graph is a special type of <a href=\"?bipartite\">bipartite graph<\/a> where every vertex of one set is connected to every vertex of other set. <\/p><p> The figure shows a bipartite graph where set \\(A\\) (orange-colored) consists of \\(2\\) vertices and set \\(B\\) (green-colored) consists of \\(3\\) vertices. <\/p><p> If the two sets have \\(p\\) and \\(q\\) number of vertices, then we denote the complete bipartite graph by \\(K_{p,q}\\). <\/p><div class=\"note\"> <span class=\"note-word\">Note: <\/span> Don't confuse the notation \\(K_{p,q}\\) by \\(K_n\\). Former is used for complete bipartite graph, and later denotes a <a href=\"?complete-graph\">complete graph<\/a>. Both are different. <\/div><div class=\"result\"> <span class=\"result-word\">Properties: <\/span> The following results hold true for a complete bipartite graph \\(K_{p,q}\\). <p><\/p><ul> <li>The order of graph is \\(|V|=p+q\\).<\/li><li>The size of graph is \\(|E|=pq\\).<br>This can be used to check if a bipartite graph is complete bipartite or not.<\/li><li>The <a href=\"?degree-seqeunce\">degree sequence<\/a> is \\((p,p,...,p,q,...,q)\\) where \\(p\\) is repeated \\(q\\) times and \\(q\\) is repeated \\(p\\) times. It is assumed here that \\(p>q\\).<\/li><\/ul> <\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All</button>",

		"svg-output": "",

		"prev":		"?bipartite",
		"next":		"?walk",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"walk": {

		"content-title": "Walk",

		"theory-content":		"<p><b>Walk<\/b> is sequence of adjacent vertices (or edges) in a graph.<\/p><p> You can think of the vertices as cities and the edges as highways connecting them. You start at a city and start travelling to other cities. Then the route you travelled through can be called as a \"walk\". <\/p><p> To describe the route uniquely, you have to list down the cities and highways you travelled in that order. That's the idea of a walk. <\/p><div class=\"note\"> <span class=\"note-word\">Note:<\/span> You can't just list vertices (or edges) randomly and call it a walk. A subsequent vertex must be adjacent to the previous one. <\/div><p> While travelling the cities, you might have revisited some cities and might have travelled through the same highway multiple times. <\/p><p> Similarly, in a walk you can repeat the vertices and edges. <\/p><div class=\"note\"> <span class=\"note-word\">Note:<\/span> A walk can contain vertices and edges multiple times. However, in this app you won't be able to add the same edge again to the walk. <\/div><p>The number of edges in the walk is called as the <b>length<\/b> of the walk. It is one less than the number of vertices in the walk. Repeated edges (or vertices) are counted each time they appear in the walk.<\/p><p> Read the instructions below and create some walks of your own. Do this till you get what a walk is. <\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><li>To start a walk, click on any edge.<\/li><li>The <span style=\"background-color: #ff0; padding: 2px;\">first<\/span> and <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertices of walk have colored boundaries.<\/li><li>To add next edge to the walk, click on an edge falling on the <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertex of the walk.<\/li><li>The <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> edge in the walk can be removed by again clicking on it.<\/li><li>You won't be able to delete vertices\/edges which are a part of walk.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All<\/button> <button type=\"button\" id=\"clear-walk\" class=\"btn btn-default\">Clear Walk<\/button> <button type=\"button\" id=\"reverse-walk\" class=\"btn btn-default\">Reverse Walk<\/button>",

		"svg-output": "",

		"prev":		"?complete-bipartite",
		"next":		"?open-vs-closed",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"open-vs-closed": {

		"content-title": "Open vs Closed Walks",

		"theory-content":		"<p>This lesson describes some special types of walks. Get acquainted with them and play around. But note that the following terminology may differ from your textbook.<\/p><p>A walk is said to be <b>open<\/b> if the first and the last vertices are different i.e. the terminal vertices are different.<\/p><p>A walk is said to be <b>closed<\/b> if the first and last vertices are the same. That means you start walking at a vertex and end up at the same.<\/p><p>Before proceeding further, try drawing open and closed walks to understand them better. Below are some more terms you need to know.<\/p><p><b>Trail<\/b> is an open walk where vertices can repeat, but not edges.<\/p><p><b>Path<\/b> is an open walk with no repetition of vertices and edges.<\/p><p>If you make a trail (or path) closed by coinciding the terminal vertices, then what you end up with is called a circuit (or cycle).<\/p><p><b>Circuit<\/b> is a closed walk where vertices can repeat, but not edges.<\/p><p><b>Cycle<\/b> is a closed walk where neither vertices nor edges can repeat. But since it is closed, the first and the last vertices are the same (one repetition).<\/p><p>It is easy to confuse these terms with each other. So play around till you get comfortable. Remember that you won't be able to repeat edges in the app.<\/p><div class=\"note\"> <span class=\"note-word\">Note: <\/span> A path is a special type of trail where vertices don't repeat. Similarly, a cycle is a special type of circuit. <\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><li>To start a walk, click on any edge.<\/li><li>The <span style=\"background-color: #ff0; padding: 2px;\">first<\/span> and <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertices of walk have colored boundaries.<\/li><li>To add next edge to the walk, click on an edge falling on the <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertex of the walk.<\/li><li>The <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> edge in the walk can be removed by again clicking on it.<\/li><li>You won't be able to delete vertices\/edges which are a part of walk.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All<\/button> <button type=\"button\" id=\"clear-walk\" class=\"btn btn-default\">Clear Walk<\/button> <button type=\"button\" id=\"reverse-walk\" class=\"btn btn-default\">Reverse Walk<\/button>",

		"svg-output": "",

		"prev":		"?walk",
		"next":		"?connectivity",
		"script":	"app.js",
		"star":		"y",
		"style":	"app.css"
	},

	"connectivity": {

		"content-title": "Connectivity",

		"theory-content":		"<p>A graph is said to be <b>connected<\/b> if a path can be drawn between any two of its vertices. Otherwise, it is called <b>disconnected<\/b>.<\/p><p>Each maximal connected subgraph is called a <b>connected component<\/b> or just <b>component<\/b> of the graph.<\/p><p>Since a component is maximal connected:<\/p><ul> <li>No path can be draw between an \"outside\" vertex and any of the component's vertices.<\/li><li>There is a path from any vertex of the component to any other vertex of the component.<\/li><\/ul> <div class=\"note\"> <span class=\"note-word\">Note: <\/span> An <b>isolated vertex is a component<\/b> in the sense that there is no vertex in the component which isn't connected to it; and their is no \"outside\" vertex connected to it. <\/div><p>The diagram shows a disconnected graph having two components - blue and orange.<\/p><p>Draw some graphs of your own and get comfortable with the terms. Each component will have a color of its own.<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex or edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><li>To start a walk, click on any edge.<\/li><li>The <span style=\"background-color: #ff0; padding: 2px;\">first<\/span> and <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertices of walk have colored boundaries.<\/li><li>To add next edge to the walk, click on an edge falling on the <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertex of the walk.<\/li><li>The <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> edge in the walk can be removed by again clicking on it.<\/li><li>You won't be able to delete vertices\/edges which are a part of walk.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All<\/button> <button type=\"button\" id=\"clear-walk\" class=\"btn btn-default\">Clear Walk<\/button> <button type=\"button\" id=\"reverse-walk\" class=\"btn btn-default\">Reverse Walk<\/button>",

		"svg-output": "",

		"prev":		"?open-vs-closed",
		"next":		"?eulerian-circuit",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"eulerian-circuit": {

		"content-title": "Eulerian Circuit",

		"theory-content":		"<p>A circuit which visits each edge of the graph exactly once is called as <b>Eulerian circuit<\/b>. In other words, an <b>Eulerian circuit<\/b> is a closed walk which visits each edge of the graph exactly once.<\/p><p>A graph possessing an Eulerian circuit is known as <b>Eulerian graph<\/b>.<\/p><div class=\"result\"> <span class=\"result-word\">Theorem: <\/span> A connected graph is Eulerian if and only if the degree of every vertex is an even number. <\/div><p>Take note of the equivalency (<i>if and only if<\/i>) in above theorem. This means that:<\/p><ol> <li>If a connected graph has all its vertices of even degree, then it has an Eulerian circuit.<\/li><li>If a connected graph has an Eulerian circuit, then all its vertices have even degree.<\/li><\/ol> <div class=\"note\"> <span class=\"note-word\">Note: <\/span> Since a circuit is cyclic in nature, any vertex can be taken as the starting point for construction of an Eulerian circuit in an Eulerian graph. <\/div><p>Your task is to draw an Eulerian circuit for each of the given graphs.<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><li>To start a walk, click on any edge.<\/li><li>The <span style=\"background-color: #ff0; padding: 2px;\">first<\/span> and <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertices of walk have colored boundaries.<\/li><li>To add next edge to the walk, click on an edge falling on the <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertex of the walk.<\/li><li>The <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> edge in the walk can be removed by again clicking on it.<\/li><li>You won't be able to delete vertices\/edges which are a part of walk.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"prev-prob\" class=\"btn btn-default\">Prev<\/button> <button type=\"button\" id=\"clear-walk\" class=\"btn btn-default\">Clear Walk<\/button> <button type=\"button\" id=\"reverse-walk\" class=\"btn btn-default\">Reverse Walk<\/button> <button type=\"button\" id=\"next-prob\" class=\"btn btn-default\">Next<\/button>",

		"svg-output": "<div class=\"text-center\"> <ul class=\"pagination\" id=\"prob-list\"> <li><a class=\"prob-current\">1<\/a><\/li><li><a>2<\/a><\/li><li><a>3<\/a><\/li><li><a>4<\/a><\/li><li><a>5<\/a><\/li><\/ul> <\/div>",

		"prev":		"?connectivity",
		"next":		"?eulerian-trail",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"eulerian-trail": {

		"content-title": "Eulerian Trail",

		"theory-content":		"<p>An open walk which visits each edge of the graph exactly once is called an <b>Eulerian Walk<\/b>. Since it is open and there is no repetition of edges, it is also called <b>Eulerian Trail<\/b>.<\/p><p>There is a connection between Eulerian Trails and Eulerian Circuits.<\/p><p>We know that in an Eulerian graph, it is possible to draw an Eulerian circuit starting from any vertex. What if we remove the last edge in this circuit? Can we still walk all the edges exactly once?<\/p><p>On removing the last edge, the two vertices on that edge will now have odd degrees. Rest of the vertices will still have even degree. Our circuit is no longer a circuit because the terminal vertices are different. What we have now is a trail that covers all the vertices exactly once.<\/p><div class=\"result\"> <p><span class=\"result-word\">Theorem: <\/span> A connected graph contains an Eulerian trail if and only if exactly two vertices have odd degree and rest have even degree.<\/p><p>The two vertices with odd degree must be the terminal vertices in the trail.<\/p><\/div><p>Note the equivalency (<i>if and only if<\/i>) in the above result.<\/p><p>Draw Eulerian trails for the given connected graphs.<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul> <li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><li>To start a walk, click on any edge.<\/li><li>The <span style=\"background-color: #ff0; padding: 2px;\">first<\/span> and <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertices of walk have colored boundaries.<\/li><li>To add next edge to the walk, click on an edge falling on the <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> vertex of the walk.<\/li><li>The <span style=\"background-color: #8f3; padding: 2px;\">last<\/span> edge in the walk can be removed by again clicking on it.<\/li><li>You won't be able to delete vertices\/edges which are a part of walk.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"prev-prob\" class=\"btn btn-default\">Prev<\/button> <button type=\"button\" id=\"clear-walk\" class=\"btn btn-default\">Clear Walk<\/button> <button type=\"button\" id=\"reverse-walk\" class=\"btn btn-default\">Reverse Walk<\/button> <button type=\"button\" id=\"next-prob\" class=\"btn btn-default\">Next<\/button>",

		"svg-output": "<div class=\"text-center\"> <ul class=\"pagination\" id=\"prob-list\"> <li><a class=\"prob-current\">1<\/a><\/li><li><a>2<\/a><\/li><li><a>3<\/a><\/li><li><a>4<\/a><\/li><li><a>5<\/a><\/li><\/ul> <\/div>",

		"prev":		"?eulerian-circuit",
		"next":		"?graph-coloring",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"graph-coloring": {

		"content-title": "Graph Coloring",

		"theory-content":		"<p><b>Graph coloring<\/b> is the assignment of colors to each vertex in a graph such that no two adjacent vertices get the same color.<\/p><p>Sometimes, this is also referred to as <b>proper coloring<\/b> of graph.<\/p><p>You can change color of a vertex by left-clicking on it. In this unit you have 10 colors available for each vertex.<\/p><p>Try your hands on the graph and see it for yourself!<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To change <span style=\"color:#fff; background-color:#d62728; padding:0 2px;\">color<\/span> of a vertex <b>left click<\/b> on it.<\/li><li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All<\/button>",

		"svg-output": "",

		"prev":		"?eulerian-trail",
		"next":		"?k-colorable",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"k-colorable": {

		"content-title": "k-Colorable Graph",

		"theory-content":		"<p>A graph is said to be \\(k\\mbox{-}\\)<b>colorable<\/b> if it can be properly colored using \\(k\\) colors.<\/p><p>For example, a <a href=\"?bipartite\">bipartite graph<\/a> is \\(2\\mbox{-}\\)colorable. To see this, just assign two different colors to the two disjoint sets in a bipartite graph.<\/p><p>Conversely, if a graph is \\(2\\mbox{-}\\)colorable, then the vertices having same color can be taken as disjoint sets. Hence, we arrive at the following result:<\/p><div class=\"result\"><span class=\"result-word\">Theorem: <\/span>A graph is bipartite if and only if it is \\(2\\mbox{-}\\)colorable.<\/div><p>Now, consider a graph that is \\(k\\mbox{-}\\)colored. Choose any one vertex of the graph and replace it's color by a new \\(\\left(k+1\\right)\\)<sup>th<\/sup> color. Clearly, the graph is still properly colored.<\/p><div class=\"note\"><span class=\"note-word\">Note: <\/span>If a graph is \\(k\\mbox{-}\\)colorable, then it is also \\(\\left(k+n\\right)\\mbox{-}\\)colorable, \\(n \\geq 1\\).<\/div><p>Another thing worth noticing is that a graph is \\(1\\mbox{-}\\)colorable if and only if it is totally disconnected, that is all its vertices are isolated.<\/p><p>In each of the following excercises, you're given a graph and a limited number of colors. Your task is to color the graphs (properly). Try to <b>minimize<\/b> the number of colors you use.<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To change <span style=\"color:#fff; background-color:#d62728; padding:0 2px;\">color<\/span> of a vertex <b>left click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"prev-prob\" class=\"btn btn-default\">Prev<\/button> <button type=\"button\" id=\"next-prob\" class=\"btn btn-default\">Next<\/button>",

		"svg-output": "<div id=\"output-text\"><\/div><div class=\"text-center\"> <ul class=\"pagination\" id=\"prob-list\"> <li><a class=\"prob-current\">1<\/a><\/li><li><a>2<\/a><\/li><li><a>3<\/a><\/li><li><a>4<\/a><\/li><li><a>5<\/a><\/li><li><a>6<\/a><\/li><li><a>7<\/a><\/li><li><a>8<\/a><\/li><li><a>9<\/a><\/li><li><a>10<\/a><\/li><\/ul> <\/div>",

		"prev":		"?graph-coloring",
		"next":		"?chromatic-number",
		"script":	"app.js",
		"star":		"y",
		"style":	"app.css"
	},

	"chromatic-number": {

		"content-title": "Chromatic Number",

		"theory-content":		"<p><b>Chromatic number<\/b> of a graph is the minimum value of \\(k\\) for which the graph is \\(k\\mbox{-}colorable\\).<\/p><p>In other words, it is the minimum number of colors needed for a proper-coloring of the graph.<\/p><p>Chromatic number of a graph \\(G\\) is denoted by \\(\\chi(G)\\). And a graph with \\(\\chi(G)=k\\) is called a <b>\\(k\\mbox{-}\\)chromatic<\/b> graph.<\/p><p>You might have noticed in the previous chapter (on <a href=\"?k-colorable\">k-Colorable Graphs<\/a>) that some of the problems involved chromatic coloring.<\/p><p>Now we take a look at some common types of graph and their chromatic numbers.<\/p><p><b><a href=\"javascript:setGraph(0);\">Empty Graph<\/a>:<\/b> It's a graph without any edges (\\(|E|=0\\)). All the vertices are isolated. \\(\\chi(G)=1\\). Note that an empty graph is also <a href=\"?bipartite\">bipartite<\/a>.<\/p><p><b><a href=\"javascript:setGraph(1);\">Bipartite Graph<\/a>:<\/b> An empty bipartite graph has \\(\\chi(G)=1\\). A non-empty bipartite graph has \\(\\chi(G)=2\\). Using this, we arrive at the following result.<\/p><div class=\"result\"><span class=\"result-word\">Theorem:<\/span> A graph \\(G\\) is bipartite if and only if \\(\\chi(G)\\leq2\\).<br><br><p>This can be easily established by observing that any graph with \\(\\chi(G)\\leq2\\) is \\(2\\mbox{-}\\)colorable, and hence bipartite. The converse, has already been established earlier.<\/p><\/div><p><b><a href=\"javascript:setGraph(2);\">Star Graph<\/a>:<\/b> A star graph of order \\(n+1\\), denoted by \\(S_{n+1}\\), is the complete bipartite graph \\(K_{1,n}\\), where \\(n\\geq0\\). So, it has same chromatic number as a bipartite graph.<\/p><p><b><a href=\"javascript:setGraph(3);\">Cycle graph<\/a>:<\/b> A cycle graph of order \\(n\\) is denoted by \\(C_n\\). A cycle of odd order has \\(\\chi(C_{2n+1})=3\\), and that of even order has \\(\\chi(C_{2n})=2\\). So, a cycle of even order is also bipartite.<\/p><p><b><a href=\"javascript:setGraph(5);\">Wheel graph<\/a>:<\/b> A wheel graph of order \\(n+1\\) is obtained from \\(C_n\\) by connecting all its vertices to a new vertex (called <em>hub<\/em>). Wheel graph of order \\(n\\) is denoted by \\(W_n\\). A wheel of odd order has \\(\\chi(W_{2n+1})=4\\), and that of even order has \\(\\chi(W_{2n})=3\\).<\/p><p><b><a href=\"javascript:setGraph(7);\">Complete Graph<\/a>:<\/b> Since each vertex is connected to every other vertex, we have \\(\\chi(K_n)=n\\).<\/p>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"prev-prob\" class=\"btn btn-default\">Prev<\/button> <button type=\"button\" id=\"next-prob\" class=\"btn btn-default\">Next<\/button>",

		"svg-output": "<div id=\"output-text\"><\/div><div class=\"text-center\"> <ul class=\"pagination\" id=\"prob-list\"> <li><a class=\"prob-current\">1<\/a><\/li><li><a>2<\/a><\/li><li><a>3<\/a><\/li><li><a>4<\/a><\/li><li><a>5<\/a><\/li><li><a>6<\/a><\/li><li><a>7<\/a><\/li><li><a>8<\/a><\/li><\/ul> <\/div>",

		"prev":		"?k-colorable",
		"next":		"?trees",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"trees": {

		"content-title": "Trees",

		"theory-content":		"<p>It's time to learn about trees. Trees are special type of graphs which have immense application as a data structure in computational sciences.<\/p><p>But first, we talk about forests.<\/p><p>A <b>forest<\/b> is an acyclic graph, that is a graph without any cycles. It can be a single connected graph or have multiple disconnected components. When its a single connected graph, we call it a tree.<\/p><p>So, a <b>tree<\/b> is a connected acyclic graph. And a forest is just a collection of one or more trees.<\/p><p>Play around to see what is a tree and what is not. And try to observe the following properties as you draw things.<\/p><div class=\"result\"><span class=\"result-word\">Theorem:<\/span> A connected graph is a tree iff its order is one more than its size. In mathematical notation, we can write this as \\[|V|=|E|+1\\]<p>Note that statement is biconditional. So it also says that a connected graph satisfying the above equation is a tree.<\/p><\/div><div class=\"result\"><span class=\"result-word\">Property:<\/span> For a tree with more than one vertices, there is a <b>unique path<\/b> between any two of its vertices.<\/div><div class=\"result\"><span class=\"result-word\">Property:<\/span> A tree is <b>minimally connected<\/b>, which means that removal of any arbitrary edge from it will convert it into a disconnected graph.<\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To add a vertex <b>left click<\/b> on whitespace.<\/li><li>To add an edge <b>drag<\/b> from one vertex to another.<\/li><li>To delete a vertex\/edge <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see name of a vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear All<\/button>",

		"svg-output": "",

		"prev":		"?chromatic-number",
		"next":		"?rooted-trees",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	},

	"rooted-trees": {

		"content-title": "Rooted Trees",

		"theory-content":		"<p>A <b>rooted tree<\/b> is a tree with a special vertex labelled as the \"root\" the of tree.<\/p><p>The root serves as a point of reference for other vertices in the tree. In diagrams, we usually keep the root at the top and list other vertices below it.<\/p><p>This notion is particularly useful in computer science for working with tree-based data structures.<\/p><p>In the figure, the root vertex is shown with a black border.<\/p><p>Below are some useful terms associated with rooted trees.<\/p><p><b>Branch<\/b> is just another name given to edges of the tree.<\/p><p><b>Depth of a vertex<\/b> is the number of branches in the path from root to the vertex. So depth of the root itself is zero.<\/p><p><b>Level of a vertex<\/b> is number of vertex in the path from root to the vertex. This is just one more than the depth of the vertex. Level of root is 1.<\/p><p><b>Child of a vertex \\(v_1\\)<\/b> is any vertex \\(v_2\\) connected to it such that \\(d(v_2)=d(v_1)+1\\), where \\(d(v)\\) denotes depth of vertex \\(v\\). \\(v_1\\) is called <b>parent<\/b> of \\(v_2\\). Usually, in diagrams, we keep the parent vertex above its child vertices.<\/p><div class=\"note\"><span class=\"note-word\">Note:<\/span> There can be multiple childs of a vertex, but parent of a vertex is unique. Root is the only vertex in a tree without any parent.<\/div><p>A <b>leaf<\/b> is a vertex without any child.<\/p><p><b>Height of tree<\/b> is the maximum value of depth for any vertex in the tree.<\/p><p>Play around to get yourself familiar with these terms. By the way, did you notice something about the colors?<\/p><div class=\"result\"><p><span class=\"result-word\">Theorem:<\/span> All tree graphs are bipartite.<\/p><p>This can be easily seen by coloring all the vertices at even depth in a color, say pink, and coloring the vertices at odd depth in another color, say cyan. So, any tree is 2-colorable.<\/p><\/div>",

		"interface-title":		"App interface:",

		"interface-content":		"<ul><li>To add a child to a vertex <b>left click<\/b> on it.<\/li><li>To delete a non-root vertex and all its descendents <b>right click<\/b> on it.<\/li><li>To move a vertex <b>hold Ctrl and drag<\/b> it.<\/li><li>To see details of vertex\/edge just <b>hover your cursor<\/b> on it.<\/li><\/ul>",

		"svg-buttons":		"<button type=\"button\" id=\"clear-graph\" class=\"btn btn-default\">Clear Graph<\/button>",

		"svg-output": "",

		"prev":		"?trees",
		"next":		"",
		"script":	"app.js",
		"star":		"n",
		"style":	"app.css"
	}

};
