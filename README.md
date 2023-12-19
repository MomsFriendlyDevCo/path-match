@MomsFriendlyDevCo/path-match
=============================
Express-like path matching module.


* Supports various types - Path expressions, Regular Expression matching and functions
* ... and array combinations of any of the above
* ES6 compatible
* Simple class/instance interface
* Human readable `.toString()` method for debugging against each route


```javascript
import RoutePath, {compare, compile} from '@MomsFriendlyDevCo/path-match';

let rp1 = new RoutePath('/'); // or compile('/')
rp.isMatch('/') //= {}
rp.isMatch('/foo') //= false

let rp2 = new RoutePath('/api/widgets/:id');
rp.isMatch('/api/widgets') //= false
rp.isMatch('/api/widgets/123') //= {id: '123'}

// Or via shorthand methods:
compare('/api/widgets/:id', '/api/widgets'); //= false
compare('/api/widgets/:id', '/api/widgets/123'); //= {id: '123'}

// Arrays of items
let rp3 = new RoutePath(['/foo', '/bar', '/baz']);
rp.isMatch('/bar') //= {}
rp.isMatch('/quz') //= false

// Function matchers
let rp2 = new RoutePath([
    '/foo',
    (path) => path.startsWith('/bar'),
    /^\/baz\/?$/i,
]);
rp.isMatch('/FOO') //= {}
rp.isMatch('/bar') //= {}
rp.isMatch('/BAZ') //= {}
```


Why?
----
Because suprisingly, nearly all of the modules out there are either old (in some cases 7 years+), don't have adiquate testkits, arn't ES6 compatible or just have an aweful syntax.

* [path-to-regexp](https://github.com/pillarjs/path-to-regexp) - The seminal NPM package, pretty old, no decent testkits to show proof-of-work and its syntax for extracting path segments is truely awful
* [path-match](https://github.com/pillarjs/path-match) - Seems to work but will _always match_ even if the route doesnt resemble the input at all
* ...about 100 different clones of path-to-regexp