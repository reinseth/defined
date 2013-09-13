var requirejs, require, define;

(function () {
    "use strict";

    var modules = {};

    function initAndGet(name) {
        var m = modules[name];
        if (!m) {
            throw 'Module "' + name + '" is not defined';
        }
        if (m.initialized) {
            return m;
        }
        m.initialized = true;

        var resolvedDeps = [], i, dep;
        for (i = 0; i < m.deps.length; i++) {
            dep = m.deps[i];
            if (dep === 'require') {
                resolvedDeps.push(require);
            } else if (dep === 'exports') {
                resolvedDeps.push(m.exports);
            } else if (dep === 'module') {
                resolvedDeps.push({exports: m.exports});
            } else {
                resolvedDeps.push(initAndGet(dep).exports);
            }
        }

        var exports = typeof m.factory === 'function' ? m.factory.apply(null, resolvedDeps) : m.factory;
        if (typeof exports !== 'undefined') {
            m.exports = exports;
        }

        return m;
    }

    require = requirejs = function (deps, callback) {
        if (typeof deps === 'string') {
            return initAndGet(deps).exports;
        }

        var resolvedDeps = [];
        for (var i = 0; i < deps.length; i++) {
            resolvedDeps.push(initAndGet(deps[i]).exports);
        }

        if (typeof callback === 'function') {
            callback.apply(null, resolvedDeps);
        }

        return null;
    };

    require.config = function () {};

    define = function (name, deps, factory) {
        if (modules[name]) {
            return;
        }
        if (typeof factory === 'undefined') {
            factory = deps;
            deps = [];
        }

        modules[name] = {
            deps: deps,
            factory: factory,
            exports: {},
            initialized: false
        };
    };

    define.amd = {
        jQuery: true
    };

})();