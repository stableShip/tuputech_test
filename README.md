# tuputech_test
图普科技测试

## You are required to write codes using Node.js to go through the TO-DO List!

**First**: 
Get a dynamic spanning tree with 8 seconds lifetime from the
    following interface:
`http://hr.tuputech.com/recruit/v2/tree?seed=yourSeed (method:'GET')`
For example (every single request will result in a unique tree):
```
{ 
	success: true,
	treeId: '1473305870555yuGMSvIE4Peav',
	tree: {
	           type: 'k',
	           child: [
	                    { type: 'a', child: [], level: 1 },
	                    { type: 'b', child: [], level: 1 }
	           ],
	           level: 0 
	         }
}
```

----

**Second**: 
Each node of the tree represents one type of tasks. You should
    traverse the tree, and for each node respectively, send a POST
    request to the following interface, get the response and
    sequentially, put into the corresponding position of your answer
    tree. `http://hr.tuputech.com/recruit/tree/:type (method: 'POST')`
    Take the tree above as an example: First for the node with 'type:
    k', send a POST request to 'http://hr.tuputech.com/recruit/tree/k',
    and the server will return '1'. Likewise, for node with 'type: a',
    the server will return '7', and for node with 'type: b', it will
    return 'y'. Then, your answer tree should be like:

```
{ result: '1'
  ,child: [
           { result: '7', child: [] }
           ,{ result: 'y', child: [] }
          ]
}
```


----

**Third**: 
Send a POST request with this answer tree and the treeId to the following interface:
`http://hr.tuputech.com/recruit/v2/tree (method: 'POST', content-type: 'application/json')`
the data in your request should contain the following fields:

```
{ treeId: treeId (string)
  ,result: answer tree (object)
  ,seed: 'your seed' (string)
}
```

----

**Forth**:
You will finally get a score. If you get a 100 and a fruit, congraduations! Please paste the fruit below and submit it! Fill in your contact details and we will contact you in a few days!
