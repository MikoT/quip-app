import Styles from "./App.less";
import Video from "./Video.jsx";

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      videoUuid: this.props.rootRecord.get('uuid'),
      library: {}
    }
  }

  componentDidMount() {
    quip.apps.addDetachedNode(this.refs['goVideo']);
  }

  componentWillUnmount() {
    quip.apps.removeDetachedNode(this.refs['goVideo']);
    quip.apps.dismissBackdrop();
  }

  closeGoVideo(e) {
    e.stopPropagation();
    quip.apps.dismissBackdrop(true);
    this.removeGoVideoStyling();
  }

  removeGoVideoStyling() {
    this.refs['goVideoWrapper'].style.display = 'none';
    this.refs['goVideo'].innerHTML = '';
  }

  setLibraryListener() {
    this.state.library.on("player:created", data => {
      quip.apps.dismissBackdrop();
      this.setState({videoUuid: data.player.uuid});
      this.props.rootRecord.set("uuid", data.player.uuid)
    });
  }

  setup() {
    if (this.props.rootRecord.get('isLoggedIn')) {
      const library = Vidyard.goVideo.createLibrary(this.refs['goVideo'], {
        clientId: 'quip.com',
      });

      this.setState({library: library}, function() {
        this.setLibraryListener();
        this.refs['goVideoWrapper'].style.display = 'flex';
      });
    } else {
      quip.apps.auth("Vidyard").login({
          "prompt": "none",
          "type": "multipass"
        }).then(
          () => {
            const library = Vidyard.goVideo.createLibrary(this.refs['goVideo'], {
              clientId: 'quip.com',
            });

            this.setState({library: library}, function() {
              this.setLibraryListener();
            });

            this.props.rootRecord.set("isLoggedIn", true);
            this.refs['goVideoWrapper'].style.display = 'flex';
          },
          error => {
            console.error('There was an error logging in. Please reload the GoVideo live app in your document.');
          }
        );
    }
  }

  renderGoVideo() {
    this.setup();

    quip.apps.showBackdrop(() => { this.removeGoVideoStyling(); });
  }

  modalPosition() {
    const viewportDimensions = quip.apps.getViewportDimensions();
    const boundingRect = quip.apps.getBoundingClientRect();

    let left = viewportDimensions.width / 2 - boundingRect.left;
    let top = viewportDimensions.height / 2 - boundingRect.top;

    return ({
      left: left,
      top: top,
    });
  }

  renderVideoOrPlaceholder() {
    const hasVideo = !(this.state.videoUuid === '');

    if (this.state.videoUuid === "") {
      return (
        <div onClick={() => { !hasVideo && this.renderGoVideo() }} style={{border: hasVideo ? 'none' : '1px dashed #000'}} className={Styles.placeholder}>
          <div style={{textAlign: 'center', fontSize: '50px'}}>+</div>
          <div>Click to add a Video</div>
        </div>
      );
    } else {
      return (
        <Video videoUuid={this.state.videoUuid} rootRecord={this.props.rootRecord}/>
      );
    }
  }

  render() {
    return (
      <div>
        <div ref='goVideoWrapper' className={Styles.goVideoWrapper} style={this.modalPosition()}>
          <div ref='goVideoHeader' className={Styles.goVideoHeader}>
            <span>Insert a Video</span>
            <quip.apps.ui.Button
              text='x'
              className={Styles.goVideoClose}
              onClick={e => {this.closeGoVideo(e)}}
            />
          </div>
          <div ref='goVideo' id='govideo-container' className={Styles.goVideoContainer}>
          </div>
        </div>
        {this.renderVideoOrPlaceholder()}
      </div>
    );
  }
};

App.propTypes = {
  rootRecord: React.PropTypes.object.isRequired
};
