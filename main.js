var regexp = new RegExp(/\bliterall\w*/, "ig");

(function(XHR) {
    "use strict";

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;

    XHR.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = function(data) {
        var self = this;
        var oldOnReadyStateChange;
        var url = this._url;

        function onReadyStateChange() {
            if(self.readyState == 4 /* complete */) {
                /* This is where you can put code that you want to execute post-complete*/
                /* URL is kept in this._url */
                 replaceRecursively(document.body, regexp, "");
            }

            if(oldOnReadyStateChange) {
                oldOnReadyStateChange();
            }
        }

        /* Set xhr.noIntercept to true to disable the interceptor for a particular call */
       // if(!this.noIntercept) {
            if(this.addEventListener) {
                this.addEventListener("readystatechange", onReadyStateChange, false);
            } else {
                oldOnReadyStateChange = this.onreadystatechange;
                this.onreadystatechange = onReadyStateChange;
            }
        //}

        send.call(this, data);
    }
})(XMLHttpRequest);

function replaceRecursively(node, from, to) {
        var child, next;

        switch ( node.nodeType )
        {
                case 1:  // Element
                case 9:  // Document
                case 11: // Document fragment
                        child = node.firstChild;
                        while ( child )
                        {
                                next = child.nextSibling;
                                replaceRecursively(child, from, to);
                                child = next;
                        }
                        break;

                case 3: // Text node
                        const cont = node.nodeValue;
                        if (cont) node.nodeValue = cont.replace(from, to);
                        break;
        }

};

document.addEventListener("DOMContentLoaded", function(e) {
  replaceRecursively(document.body, regexp, "");
});
