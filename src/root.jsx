import quip from "quip";
import App from "./App.jsx";
import $script from "scriptjs";

class GoVideoRoot extends quip.apps.RootRecord {
  static getProperties() {
    return {
      uuid: "string",
      isVideo: "boolean",
      newInstance: "boolean",
      isLoggedIn: "boolean",
      comments: "array",
      canvas: quip.apps.CanvasRecord
    }
  }

  static getDefaultProperties() {
    return {
      uuid: "",
      isVideo: false,
      newInstance: true,
      isLoggedIn: false,
      comments: [],
      canvas: {}
    }
  }
}

quip.apps.registerClass(GoVideoRoot, "root");

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    var rootRecord = quip.apps.getRootRecord();

    quip.apps.registerEmbeddedIframe(rootNode);

    $script(["https://app.vidyard.com/v1/embed.js"], () => {
      ReactDOM.render(<App rootRecord={rootRecord} />, rootNode);
    });
  }
});
