if (!window._addTouch && window.location.search.indexOf("_addTouch=webkit") != -1) {
    window._addTouch = {};
    var a = window._addTouch;
    a.init = function () {
    };
    a.touches = {};
    a.nextTouchId = 1;
    a.currentTouch = null;
    a.wiggleInSync = false;
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
    a.contextMenuItemClick = function() {
        if (a.contextMenu) {
            document.documentElement.removeChild(a.contextMenu);
            delete a.contextMenu;
        }
        if (this.id == "_addTouch_wiggle") {
            a.wiggleInSync = !a.wiggleInSync;
            window.alert("Wiggle in sync is now " + (a.wiggleInSync ? "ON" : " OFF"));
        }
    };
    a.showContextMenu = function(event) {
        if (a.contextMenu) {
            document.documentElement.removeChild(a.contextMenu);
            delete a.contextMenu;
        }
        if (a.currentTouch) {
            a.currentTouch._addTouchDiv.className = "_addTouchSpot";
            a.currentTouch = null;
        }
        var ul = document.createElement("UL");
        ul.id = "_addTouchMenu";
        var li0 = document.createElement("LI");
        var a0 = document.createElement("A");
        a0.appendChild(document.createTextNode("Wiggle in sync"));
        ul.appendChild(li0);
        li0.appendChild(a0);
        a0.href = "#";
        a0.id = "_addTouch_wiggle";
        if (a.wiggleInSync) {
            a0.className = "_addTouchSelected";
        }
        a0.onclick = a.contextMenuItemClick;
        a.contextMenu = ul;
        ul.style.left = (event.pageX - 4) + "px";
        ul.style.top = (event.pageY - 4) + "px";
        document.documentElement.appendChild(ul);
        return false;
    };
    a.mousedown = function (event) {
        if (a.contextMenu && event.target.parentNode && event.target.parentNode.parentNode == a.contextMenu) {
            return true;
        }
        if (event.button == 2 || event.shiftKey) {
            a.showContextMenu(event);
            return;
        }
        if (a.contextMenu) {
            document.documentElement.removeChild(a.contextMenu);
            delete a.contextMenu;
        }
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
            var dx = t.screenX - event.pageX;
            var dy = t.screenY - event.pageY;
            var speed = Math.sqrt(dx * dx + dy * dy);
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
                if (a.touches[key]._target == t._target)
                    e.touches.push(a.touches[key]);
            }
            t._target.dispatchEvent.call(t._target, e);
            a.raiseByMethod("ontouchmove", t._target, e);
            
            if (a.wiggleInSync) {
                var index = 0;
                var tick = (new Date()).getTime();
                for (var key in a.touches) {
                    var touch = a.touches[key];
                    if (a.currentTouch != touch) {
                        var radians = ((tick + index * 150) % 1000) * 0.002 * Math.PI;
                        var offsetX = speed * 0.5 * Math.sin(radians);
                        var offsetY = speed * 0.5 * Math.cos(radians);
                        touch.clientX += offsetX;
                        touch.clientY += offsetY;
                        touch.pageX += offsetX;
                        touch.pageY += offsetY;
                        touch.screenX += offsetX;
                        touch.screenY += offsetY;
                        var div = touch._addTouchDiv;
                        div.style.left = (touch.pageX - 12) + "px";
                        div.style.top = (touch.pageY - 12) + "px";
                        var e = document.createEvent("HTMLEvents");
                        e.initEvent("touchmove", true, true);
                        e.altKey = event.altKey;
                        e.changedTouches = [touch];
                        e.targetTouches = [touch];
                        e.touches = [];
                        for (var key in a.touches) {
                            if (a.touches[key]._target == touch._target)
                                e.touches.push(a.touches[key]);
                        }
                        touch._target.dispatchEvent.call(touch._target, e);
                        a.raiseByMethod("ontouchmove", touch._target, e);
                        ++index;
                    }
                }
            }
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
    window.oncontextmenu = function() { return false; };
    document.addEventListener("DOMContentLoaded", a.init);
}