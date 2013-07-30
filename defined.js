var requirejs, require, define;
(function () {
    var modules = {};

    require = requirejs = function (deps, callback) {
        if (typeof callback !== 'function') {
            return modules[deps].exports;
        }

        var resolvedDeps = [];
        for (var i = 0; i < deps.length; i++) {
            resolvedDeps.push(modules[deps[i]].exports);
        }
        callback.apply(null, resolvedDeps);
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

        var m = modules[name] = {
            deps: deps,
            factory: factory,
            exports: {}
        };

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
                resolvedDeps.push(modules[dep].exports);
            }
        }

        var exports = typeof m.factory === 'function' ? m.factory.apply(null, resolvedDeps) : m.factory;
        if (typeof exports !== 'undefined') {
            m.exports = exports;
        }
    };

    define.amd = {
        jQuery: true
    };
})();