import Styles from "./App.less";
import CommentBox from "./CommentBox.jsx";

export default class Video extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      player: {},
      playing: false,
      currentTime: 0,
      currentChapter: 0,
      height: 40,
    };
  }

  resize = () => {
    const dimensions = quip.apps.getCurrentDimensions();
    const height = dimensions.width / 1.7778;
    quip.apps.removeEventListener(quip.apps.EventType.CONTAINER_SIZE_UPDATE, this.resize);

    this.setState({height: height});

    let aspectRatio = 1;
    switch(true) {
      case (height < 100):
        aspectRatio = 2.8;
        break;
      case (height < 220):
        aspectRatio = 2;
        break;
      case (height < 300):
        aspectRatio = 0.95;
        break;
      default:
        aspectRatio = 0.9;
        break;
    }
    console.log(height);
    console.log(aspectRatio);
    quip.apps.setWidthAndAspectRatio(dimensions.width, aspectRatio);

    quip.apps.addEventListener(quip.apps.EventType.CONTAINER_SIZE_UPDATE, this.resize);
  }

  setupVideoListeners() {
    const player = VidyardV4.players[0];
    this.resize();

    player.on('play', () => {
      this.setState({playing: true, currentChapter: player.getCurrentChapter()});
    });

    player.on('playerComplete', () => {
      this.setState({playing: false, currentChapter: 0});
    });

    player.on('pause', () => {
      this.setState({playing: false});
    });

    player.on('timeupdate', e => {
      this.setState({currentTime: e});
    });

    this.setState({player: player});
    quip.apps.enableResizing();
  }

  componentDidMount() {
    this.loadVideoScript().then(() => {
      this.setupVideoListeners();
      // Create Menu Options
      quip.apps.updateToolbar({
        menuCommands: [
          {
            id: quip.apps.DocumentMenuCommands.MENU_MAIN,
            subCommands: ["viewInVidyard"],
          },
          {
            id: "viewInVidyard",
            label: "View in Vidyard",
            handler: () => { window.open(`https://secure.vidyard.com/organizations/${this.state.player.org.id}/players/${this.props.videoUuid}/settings`) }
          }
        ],
      });
    });
  }

  loadVideoScript() {
    // This will work fine if users are using embeds v4. If not we need to come up with a way to check that flag
    return new Promise((resolve, reject) => {
      const [ head ] = document.getElementsByTagName('head');
      const script = document.createElement('script');

      // Remove any existing embed scripts
      if (document.getElementById('embed-script')) {
        document.getElementById('embed-script').remove();
      }

      script.id = 'embed-script';
      script.type = 'text/javascript';
      script.src = 'https://play.vidyard.com/embed/v4.js';
      head.appendChild(script);
      setTimeout(() => {resolve()}, 500);
    });
  }

  render() {
    return (
      <div>
        <div id='player-embed' style={{width: '100%', height: `${this.state.height}px`}}>
          <img className="vidyard-player-embed" data-uuid={this.props.videoUuid} data-v="4" data-type="inline"/>
        </div>
        <CommentBox video={this.state.player} currentChapter={this.state.currentChapter} currentTime={this.state.currentTime} rootRecord={this.props.rootRecord}/>
      </div>
    );
  }
};

Video.propTypes = {
  rootRecord: React.PropTypes.object.isRequired,
  videoUuid: React.PropTypes.string.isRequired
};
