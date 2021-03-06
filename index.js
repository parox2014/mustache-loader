'use strict';
var loaderUtils = require('loader-utils');
var Hogan = require('hogan.js');
var minifier = require('html-minifier');
var extend = require('xtend');

// https://github.com/kangax/html-minifier#options-quick-reference
var minifierDefaults = {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    caseSensitive: true
};

module.exports = function(source) {
    var query = loaderUtils.getOptions(this) || {};
    var hoganOpts = extend(query, { asString: true });
    var partials=query.partials;

    delete hoganOpts.minify;
    delete hoganOpts.noShortcut;
    delete hoganOpts.clientSide;
    delete hoganOpts.tiny;
    delete hoganOpts.partials;

    var render;
    if (query.render) {
        if (query.clientSide) {
            this.callback(new Error('"render" and "clientSide" options are mutually exclusive'));
        }
        render = hoganOpts.render;
        delete hoganOpts.render;
    }

    if (this.cacheable) {
        this.cacheable();
    }

    // minify?
    if (query.minify) {
        // `?minify`
        var minifierOptions = minifierDefaults;

        // `?{minify:{...}}`
        if (Object.prototype.toString.call(query.minify) === '[object Object]') {
            minifierOptions = extend(minifierOptions, query.minify);
        }

        source = minifier.minify(source, minifierOptions);
    }

    if(partials){
        if(render){
            var T=Hogan.compile(source);
            var result=T.render(render,partials);
          
            return 'module.exports='+JSON.stringify(result);
        }
    
        return 'module.exports='+JSON.stringify(source);
    }

    var suffix;
    if (query.noShortcut) {
        suffix = 'return T; }();';
    } else if (query.render) {
        suffix = 'return T.render(' + JSON.stringify(render) + ');};';
    } else {
        suffix = 'return T.render.apply(T, arguments); };';
    }
    if (query.clientSide) {
        return 'var H = require("hogan.js");\n' +
            'module.exports = function() { ' +
            'var src = ' + JSON.stringify(source) + ' \n' +
            'var T = H.compile(src, ' + JSON.stringify(hoganOpts) + ');\n' + suffix;
    }
    if (query.tiny) {
        return 'var H = require("hogan.js");\n' +
            'module.exports = function() { ' +
             'var T = new H.Template(' +
            Hogan.compile(source, hoganOpts) +
            ');' + suffix;
    }

    return 'var H = require("hogan.js");\n' +
           'module.exports = function() { ' +
           'var T = new H.Template(' +
           Hogan.compile(source, hoganOpts) +
           ', ' +
           JSON.stringify(source) +
           ', H);' + suffix;
};
module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    if (remainingRequest.indexOf('!') >= 0) {
        var query = loaderUtils.getOptions(this) || {};
        var hoganOpts = extend(query);
        delete hoganOpts.minify;
        delete hoganOpts.noShortcut;
        if (this.cacheable) {
            this.cacheable();
        }
        var suffix;
        if (query.noShortcut) {
            suffix = 'return T; }();';
        } else {
            suffix = 'return T.render.apply(T, arguments); };';
        }
        return 'var result = require(' + loaderUtils.stringifyRequest(this, '!!' + remainingRequest) + ')\n' +
            'var H = require("hogan.js");\n' +
            'window.Hogan = H;\n' +
            'module.exports = function() {\n' +
            'var T = H.compile(result, ' + JSON.stringify(hoganOpts) + ');\n' +
            suffix;
    }
};
