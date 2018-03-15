import Styles from "./App.less";
import ReplyInput from "./ReplyInput.jsx";
import Reply from "./Reply.jsx";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentObject: {},
      commentHovered: false,
      showReplies: true,
      replying: false
    }
  }

  resetState() {
    this.setState({
      commentHovered: false,
      showReplies: true,
      replying: false
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.commentObject.id != this.props.commentObject.id) {
      this.resetState();
    }
  }

  mouseEnter = e => {
    this.setState({commentHovered: true});
  }

  mouseLeave = e => {
    this.setState({commentHovered: false});
  }

  triggerReply = e => {
    this.setState({replying: true, showReplies: true});
    // TODO: scroll to bottom of replies
  }

  hideReply = e => {
    this.setState({replying: false, showReplies: false});
  }

  addReply = reply => {
    let originalComment = Object.assign({}, this.props.commentObject);
    originalComment.replies.push(reply);

    this.setState({commentObject: originalComment})
    this.props.updateCommentList(originalComment, this.props.index);
  }

  deleteReply = index => {
    let originalCommentClone = Object.assign({}, this.props.commentObject);
    originalCommentClone.replies.splice(index, 1);

    this.props.updateComment(originalCommentClone, this.props.index);
  }

  triggerDelete = () => {
    this.props.deleteComment(this.props.index);
  }

  renderCommentOptions() {
    return (
      <span>
        <span onClick={this.triggerDelete} className={Styles.commentLink}>Delete</span>
        { !this.state.replying && <span><span style={{marginLeft: '10px'}}>&middot;</span><span onClick={this.triggerReply} className={Styles.commentLink}>Reply</span></span> }
        { (this.props.commentObject.replies.length > 0) && <span style={{marginLeft: '10px'}}>&middot;</span>}
        { !this.state.showReplies && (this.props.commentObject.replies.length > 0) && <span onClick={this.triggerReply} className={Styles.commentLink}>Show {this.props.commentObject.replies.length} Replies</span> }
        { this.state.showReplies && (this.props.commentObject.replies.length > 0) && <span onClick={this.hideReply} className={Styles.commentLink}>Hide Replies</span> }
      </span>
    );
  }

  render() {
    const author = quip.apps.getUserById(this.props.commentObject.authorId);

    // TODO: Is it possible to check whether a user is online or not?
    const userOnline = false;
    return (
      <div>
        <div className={Styles.commentWrapper} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
          <div>
            <span className={Styles.profilePictureWrapper}>
              <quip.apps.ui.ProfilePicture user={author} size={40} round={true}/>
              { userOnline && <div className={Styles.onlineUser}></div> }
            </span>
          </div>
          <div className={Styles.commentContent}>
            <div className={Styles.commentAuthorWrapper}>
              <span className={Styles.commentAuthor}>{author.getName()}</span>
              {this.state.commentHovered && this.renderCommentOptions()}
            </div>
            <div>
              <button className={Styles.timestampLink}
                onClick={() => { this.props.video.play(); this.props.video.seek(this.props.commentObject.position); }}>
                  [{this.props.commentObject.timeStamp}]
              </button>
              <span style={{marginLeft:'4px'}}>{this.props.commentObject.comment}</span>
            </div>
          </div>
        </div>
        <div className={Styles.repliesWrapper}>
          { this.state.showReplies && this.props.commentObject.replies.map((reply, index) => {
            return (
              <Reply index={index} replyObject={reply} deleteReply={this.deleteReply}/>
            );
          })}
        </div>
        { this.state.replying && <ReplyInput addReply={this.addReply} /> }
      </div>
    );
  }
};

Comment.propTypes = {
  commentObject: React.PropTypes.object,
  index: React.PropTypes.number,
  updateCommentList: React.PropTypes.function,
  deleteComment: React.PropTypes.function
};
