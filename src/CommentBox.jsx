import Comment from "./Comment.jsx";
import Styles from "./App.less";
import classNames from "classnames/bind";
let cx = classNames.bind(Styles);

export default class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentList: this.props.rootRecord.get('comments'),
      showing: false,
      newestCommentIndex: this.props.rootRecord.get('comments').length,
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

  handleInputSubmit(event) {
    if (event.keyCode === 13) {
      const comment = event.target.value;
      event.target.value = null;

      const commentObject = {
        id: this.state.commentList.length,
        chapter: this.props.currentChapter,
        position: this.props.currentTime,
        timeStamp: this.timeFormat(this.props.currentTime),
        comment: comment,
        authorId: quip.apps.getViewingUser().getId(),
        replies: []
      }

      let commentList = this.state.commentList.slice(0);

      commentList.push(commentObject);
      commentList.sort((a, b) => {
        if (a.position < b.position) {
          return -1;
        }
        if (a.position > b.position){
          return 1;
        }
        return 0;
      });

      const newCommentIndex = commentList.findIndex(comment => {
        return comment.id === commentObject.id;
      });

      this.props.rootRecord.set('comments', commentList);
      this.setState({commentList: commentList, newestCommentIndex: newCommentIndex, showing: true});
    }
  }

  componentDidMount() {
    this.refs.commentsList.scrollTop = this.refs.commentsList.scrollHeight;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.commentList.length != prevState.commentList.length) {
      const commentHeight = 50;

      this.refs.commentsList.scrollTop = this.refs.commentsList.childNodes[this.state.newestCommentIndex].offsetTop;
    }
  }

  toggleCommentList = () => {
    const currentShowState = this.state.showing;
    this.setState({showing: !currentShowState});
  }

  updateCommentList = (commentObject, index) => {
    let updatedCommentList = this.state.commentList.slice(0);
    updatedCommentList[index] = commentObject;

    this.setState({commentList: updatedCommentList});
    this.props.rootRecord.set('comments', updatedCommentList);
  }

  deleteComment = (index) => {
    let updatedCommentList = this.state.commentList.slice(0);

    updatedCommentList.splice(index, 1);
    this.setState({commentList: updatedCommentList});
    this.props.rootRecord.set('comments', updatedCommentList);
  }

  updateComment = (commentObject, index) => {
    let updatedCommentList = this.state.commentList.slice(0);

    updatedCommentList[index] = commentObject;
    this.setState({commentList: updatedCommentList});
    this.props.rootRecord.set('comments', updatedCommentList);
  }

  render() {
    const currentChapterComments = this.state.commentList.filter(commentObject => {
      return commentObject.chapter === this.props.currentChapter;
    });

    return (
      <div>
        <div ref='commentsList' id='commentsList' className={ cx({commentBoxShown: this.state.showing, commentBoxHidden: !this.state.showing, commentBox: true}) }>
          {
            this.state.commentList.map((commentObject, index) => {
              if ( commentObject.chapter === this.props.currentChapter ) {
                return <Comment index={index} video={this.props.video} commentObject={commentObject} updateCommentList={this.updateCommentList} deleteComment={this.deleteComment} updateComment={this.updateComment}/>;
              }
            })
          }
        </div>
        <input onFocus={() => {this.props.video.pause()} } className={Styles.commentInput}
          style={{borderLeft: '1px solid rgba(0, 0, 0, 0.12)', borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '0 0 5px 5px', width: '100%'}}
            placeholder='Type a message...' onKeyDown={e => {this.handleInputSubmit(e)}}>
        </input>
        <div className={Styles.toggleCommentWrapper}>
          <span className={Styles.toggleComment} onClick={this.toggleCommentList}>{this.state.showing ? 'Hide' : 'Show'} { currentChapterComments.length } comments</span>
        </div>
      </div>
    );
  }
};

CommentBox.propTypes = {
  rootRecord: React.PropTypes.object,
  currentChapter: React.PropTypes.number,
  currentTime: React.PropTypes.number,
  video: React.PropTypes.object
};
