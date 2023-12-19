@MomsFriendlyDevCo/path-match
=============================
Express-like path matching module.


* Supports various types - Path expressions, Regular Expression matching and functions
* ... and array combinations of any of the above
* ES6 compatible
* Simple class/instance interface
* Human readable `.toString()` method for debugging against each route
* Optional route parameters - e.g. `/api/widgets/:id?`


```javascript
import RoutePath, {compare, compile} from '@MomsFriendlyDevCo/path-match';

let rp1 = new RoutePath('/'); // or compile('/')
rp1.isMatch('/') //= {}
rp1.isMatch('/foo') //= false

let rp2 = new RoutePath('/api/widgets/:id');
rp2.isMatch('/api/widgets') //= false
rp2.isMatch('/api/widgets/123') //= {id: '123'}

let rp3 = new RoutePath('/api/doodads/:id?');
rp3.isMatch('/api/doodads') //= {id: null}
rp3.isMatch('/api/doodads/') //= {id: null}
rp3.isMatch('/api/doodads/123') //= {id: '123'}

// Or via shorthand methods:
compare('/api/widgets/:id', '/api/widgets'); //= false
compare('/api/widgets/:id', '/api/widgets/123'); //= {id: '123'}

// Arrays of items
let rp4 = new RoutePath(['/foo', '/bar', '/baz']);
rp4.isMatch('/bar') //= {}
rp4.isMatch('/quz') //= false

// Function matchers
let rp5 = new RoutePath([
    '/foo',
    (path) => path.startsWith('/bar'),
    /^\/baz\/?$/i,
]);
rp5.isMatch('/FOO') //= {}
rp5.isMatch('/bar') //= {}
rp5.isMatch('/BAZ') //= {}
```


Why?
----
Because surprisingly, nearly all of the modules out there are either old (in some cases 7 years+), don't have adequate testkits, arn't ES6 compatible or just have an awful syntax.

* [path-to-regexp](https://github.com/pillarjs/path-to-regexp) - The seminal NPM package, pretty old, no decent testkits to show proof-of-work and its syntax for extracting path segments is truly awful
* [path-match](https://github.com/pillarjs/path-match) - Seems to work but will _always match_ even if the route doesn't resemble the input at all
* ...about 100 different clones of path-to-regexp
