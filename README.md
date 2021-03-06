## Mustache loader for [webpack](https://webpack.github.io/)

[![npm](http://img.shields.io/npm/v/mustache-loader.svg?style=flat-square)](https://www.npmjs.org/package/mustache-loader)
[![travis](http://img.shields.io/travis/deepsweet/mustache-loader.svg?style=flat-square)](https://travis-ci.org/deepsweet/mustache-loader)
[![climate](http://img.shields.io/codeclimate/github/deepsweet/mustache-loader.svg?style=flat-square)](https://codeclimate.com/github/deepsweet/mustache-loader/code)
[![peer deps](http://img.shields.io/david/peer/deepsweet/mustache-loader.svg?style=flat-square)](https://david-dm.org/deepsweet/mustache-loader#info=peerDependencies)
[![dependencies](http://img.shields.io/david/deepsweet/mustache-loader.svg?style=flat-square)](https://david-dm.org/deepsweet/mustache-loader#info=dependencies)

Compiles [Mustache](https://mustache.github.io/) templates with [Hogan](https://twitter.github.io/hogan.js/) and optionally [html-minifier](https://github.com/kangax/html-minifier).

### Install

```sh
$ npm i -S dwy-mustache-loader
```

### Usage

webpack@1.x
```javascript
module: {
    loaders: [ {
        test: /\.html$/,
        loader: 'dwy-mustache'
        // loader: 'mustache?minify'
        // loader: 'mustache?{ minify: { removeComments: false } }'
        // loader: 'mustache?noShortcut'
    } ]
}
```
webpack@2.x
```javascript
module: {
    rules: [ {
        test: /\.html$/,
        loader: 'dwy-mustache-loader'
        // loader: 'mustache-loader?minify'
        // loader: 'mustache-loader?{ minify: { removeComments: false } }'
        // loader: 'mustache-loader?noShortcut'
    } ]
}
```

```javascript
var template = require('./template.html');
var html = template({ foo: 'bar' });
```

If `noShortcut` is passed, then Hogan compiled template is returned instead, so
you can pass it as partial.

```javascript
var template = require('./template.html');
var template2 = require('./template2.html');
var html = template.render({ foo: 'bar' }, {partial: template2});
```

If `clientSide` is passed in, then Hogan will not pre-compile the template.

If `tiny` is passed in, the source of the template will not be emitted, creating a smaller output.

if `render` is passed in, the data is sent is used to immediately render the template.

For example, the following will render `index.mustache` with the provided data (`title`), which can immediately be used by HtmlWebpackPlugin.

```javascript
module: {
    rules: [ {
        test: /index\.mustache$/,
        loader: 'dwy-mustache-loader',
        options: {
            tiny: true,
            render: {
                title: 'hello world',
            },
            partials:{
                header:``,
                footer:``
            }
        },
    } ]
}
plugins: [
    new HtmlWebpackPlugin({
        template: 'index.mustache',
        inject: 'body',
    }),
]
```

If another loader is chained after Mustache-Loader then the `minify`, `clientSide`, and `tiny` options will be ignored.

Any additional Hogan parameters passed into this loader will be passed through to Hogan.

[Documentation: Using loaders](https://webpack.github.io/docs/using-loaders.html).

### License
[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-strip.jpg)
