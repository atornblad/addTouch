if (!window._addTouch && window.location.search.indexOf("_addTouch=webkit") != -1) {
    window._addTouch = {};
    var a = window._addTouch;
    a.init = function () {
        //        window.alert("Hej!");
    };
    a.touches = {};
    a.nextTouchId = 1;
    a.currentTouch = null;
    a.raiseByMethod = function (methodname, node, e) {
        while (node) {
            if (typeof node[methodname] == "function") {
                node[methodname].call(node, e);
                return;
            }
            var parent = node.parentNode;
            if (parent != null && parent == node.offsetNode) {
                // TODO: Fixa clientX och clientY
            }
            node = parent;
        }
    };
    a.mousedown = function (event) {
        var target = event.target;
        for (var key in a.touches) {
            var t = a.touches[key];
            var dx = t.pageX - event.pageX;
            var dy = t.pageY - event.pageY;
            if (dx * dx + dy * dy < 100) {
                target = t._target;
                var div = t._addTouchDiv;
                if (event.ctrlKey) {
                    div.parentNode.removeChild(div);
                    delete div;
                    var e = document.createEvent("HTMLEvents");
                    e.initEvent("touchend", true, true);
                    e.altKey = event.altKey;
                    e.changedTouches = [t];
                    e.targetTouches = [t];
                    e.touches = [];
                    for (var key2 in a.touches) {
                        if (key2 != key) {
                            e.touches.push(a.touches[key2]);
                        }
                    }
                    target.dispatchEvent(e);
                    a.raiseByMethod("ontouchend", target, e);
                    delete a.touches[key];
                    return false;
                }
                t.clientX = event.clientX;
                t.clientY = event.clientY;
                t.pageX = event.pageX;
                t.pageY = event.pageY;
                t.screenX = event.pageX;
                t.screenY = event.pageY;
                div.className = "_addTouchSpot _addTouchCurrent";
                div.style.left = (event.pageX - 12) + "px";
                div.style.top = (event.pageY - 12) + "px";
                a.currentTouch = t;
                var e = document.createEvent("HTMLEvents");
                e.initEvent("touchmove", true, true);
                e.altKey = event.altKey;
                e.changedTouches = [t];
                e.targetTouches = [t];
                e.touches = [];
                for (var key2 in a.touches) {
                    e.touches.push(a.touches[key2]);
                }
                target.dispatchEvent(e);
                a.raiseByMethod("ontouchmove", target, e);
                return false;
            }
        }
        target = event.target;
        var touch = {
            identifier: a.nextTouchId++,
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            screenX: event.pageX,
            screenY: event.pageY,
            _target: target
        };
        a.touches["id_" + touch.identifier] = touch;
        var div = document.createElement("DIV");
        touch._addTouchDiv = div;
        div._addTouchTouch = touch;
        div.className = "_addTouchSpot _addTouchCurrent";
        div.style.left = (event.pageX - 12) + "px";
        div.style.top = (event.pageY - 12) + "px";
        document.body.appendChild(div);
        a.currentTouch = touch;
        var e = document.createEvent("HTMLEvents");
        e.initEvent("touchstart", true, true);
        e.altKey = event.altKey;
        e.changedTouches = [touch];
        e.targetTouches = [touch];
        e.touches = [];
        for (var key in a.touches) {
            e.touches.push(a.touches[key]);
        }
        target.dispatchEvent(e);
        a.raiseByMethod("ontouchstart", target, e);
        return false;
    };
    a.mousemove = function (event) {
        if (a.currentTouch) {
            var t = a.currentTouch;
            t.clientX = event.clientX;
            t.clientY = event.clientY;
            t.pageX = event.pageX;
            t.pageY = event.pageY;
            t.screenX = event.pageX;
            t.screenY = event.pageY;
            var div = t._addTouchDiv;
            div.style.left = (event.pageX - 12) + "px";
            div.style.top = (event.pageY - 12) + "px";
            var e = document.createEvent("HTMLEvents");
            e.initEvent("touchmove", true, true);
            e.altKey = event.altKey;
            e.changedTouches = [t];
            e.targetTouches = [t];
            e.touches = [];
            for (var key in a.touches) {
                e.touches.push(a.touches[key]);
            }
            t._target.dispatchEvent(e);
            a.raiseByMethod("ontouchmove", t._target, e);
        }
        return false;
    };
    a.mouseup = function (event) {
        if (a.currentTouch) {
            a.currentTouch._addTouchDiv.className = "_addTouchSpot";
            a.currentTouch = null;
        }
        return false;
    };
    var targets = [window, document, document.documentElement];
    var properties = "ontouchstart,ontouchmove,ontouchend,ongesturestart,ongesturechange,ongestureend".split(/,/g);
    for (var i = 0, l = targets.length; i < l; ++i) {
        for (var j = 0, k = properties.length; j < k; ++j) {
            targets[i][properties[j]] = null;
        }
    }
    window.Touch = true;
    window.onmousedown = a.mousedown;
    window.onmousemove = a.mousemove;
    window.onmouseup = a.mouseup;
    document.addEventListener("DOMContentLoaded", a.init);
}