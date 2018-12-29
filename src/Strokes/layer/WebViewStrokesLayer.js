var WebViewStrokesLayer = cc.Layer.extend({
_webView:null,
    ctor:function(){
        this._super();
        var self = this;

        this.initMattes();
        this.initWebView();

    },

    onEnd:function(){
        this._super();
        this._webView.setVisible(false);
    },

    initWebView:function(){
        var self = this;
        // https://www.baidu.com
        var webView = new ccui.WebView("src/Strokes/layer/share-test.html");
        // var webView = new ccui.WebView("https://www.baidu.com");

        webView.setBounces(true);
        // webView.setTouchEnabled(false);
        // webView.touchEnabled(false);
        this.addChild(webView,1);
        this._webView = webView;
        this._webView.setVisible(false);
        webView.setEventListener(ccui.WebView.EventType.LOADED, function(sender, url){
            self._webView.setVisible(true);
            return true;
        })

    },

    onEnter:function(){
      this._super();
        var self = this;

        this._webView.setContentSize(this.getContentSize().width, this.getContentSize().height);

        var list = [
            { name: "loadURL", func: function(){
                    // playState.setString("loadURL!");
                    // webView.loadURL("src/GUITest/UIWebViewTest/webview2.html");
                }},
            { name: "Reload", func: function(){
                    // playState.setString("reload!");
                    webView.reload();
                }},
            { name: "goBack", func: function(){
                    if (webView.canGoBack())
                    {
                        // playState.setString("goBack!");
                        webView.goBack();
                    }
                    else
                    {
                        // playState.setString("can not goBack!");
                    }
                }},
            { name: "goForward", func: function(){
                    if (webView.canGoForward()) {
                        playState.setString("goForward!");
                        webView.goForward();
                    }
                    else {
                        playState.setString("can not goForward!");
                    }
                }},
            { name: "EvaluateJS", func: function(){
                    // playState.setString("evaluateJS!");
                    var code = "alert('evaluateJS!')";
                    webView.evaluateJS(code);
                }},
            { name: "Scale", func: function(){
                    var scale = ((Math.random() * 0.5 + 0.2) * 100 | 0) / 100;
                    // playState.setString("setScale(" + scale + ")");
                    webView.setScale(scale);
                }},
            { name: "setAnchorPoint", func: function(){
                    var anpX = webView.getAnchorPoint().x === 1 ? 0: webView.getAnchorPoint().x+ 0.5;
                    var anpY = webView.getAnchorPoint().y === 1 ? 0: webView.getAnchorPoint().y+ 0.5;
                    webView.setAnchorPoint(anpX, anpY);
                }}
        ];

    },

    showStrokes:function(){
        var code = "showStrokesJs()";
        this._webView.evaluateJS(code);
    },


    selectText:function(a){
        var code = "setCharacter"+'('+'\''+ a+'\''+')';
        // var code = "showStrokesJs()";

        cc.log('code>>>>',code);
        this._webView.evaluateJS(code);
        },

    initMattes:function(){

    },

    gotoBack:function(){

        this._webView.setVisible(false);
    },
});