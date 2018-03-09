import Styles from "./App.less";
import classNames from "classnames/bind";
let cx = classNames.bind(Styles);

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commenting: false,
    };
  }

  postComment() {
    this.props.player.pause();
    this.setState({commenting: true});
  }

    handleInputSubmit(event) {
    if (event.keyCode === 13) {
      const comment = event.target.value;
      const timestamp = this.refs.timestamp.value;
      event.target.value = '';
      this.setState({commenting: false});
      const chapterId = this.props.player.status.chapterIndex;
      const videoName = this.props.player.metadata.chapters_attributes[chapterId].video_attributes.name;

      const message = `${videoName} _________________________ [${timestamp}] ${comment}`;
      quip.apps.sendMessage(message);
    }
  }

  timeFormat(seconds) {
    // TAKEN FROM STACKOVERFLOW.
    // 2- Extract hours:
    let hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = parseInt(seconds % 60);
    let formattedSeconds = '', formattedHours = '', formattedMinutes = '';
    if (seconds < 10) {
      formattedSeconds = "0" + seconds;
    } else {
      formattedSeconds = seconds;
    }
    if (minutes < 10) {
      formattedMinutes = "0" + minutes;
    } else {
      formattedMinutes = minutes;
    }
    if (hours < 10) {
      formattedHours = "0" + hours;
    } else {
      formattedHours = hours;
    }

    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
  }

  render() {
    return (
      <div id='comment-section' className={cx({commentSection: true})}>
        <quip.apps.ui.Button
          text='Timestamp Comment'
          className={ cx({ commentButton: true }) }
          onClick={ () => { this.postComment(); }}
        />
        <input ref='timestamp' className={ cx({ timeInput: true }) } value={ this.timeFormat(this.props.currentTime) } disabled></input>
        <input className={ cx({commentInput: true, commentInputOpen: this.state.commenting}) }
          placeholder='Write a comment...' onKeyDown={e => {this.handleInputSubmit(e)}}></input>
      </div>
    );
  }
}
