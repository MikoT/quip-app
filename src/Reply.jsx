import Styles from './App.less';

export default class Reply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false
    }
  }

  mouseEnter = e => {
    this.setState({hovered: true});
  }

  mouseLeave = e => {
    this.setState({hovered: false});
  }

  triggerDelete = () => {
    this.props.deleteReply(this.props.index);
  }

  render() {
    const author = quip.apps.getUserById(this.props.replyObject.authorId);

    return (
      <div className={Styles.replyWrapper} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
        <div>
          <span className={Styles.profilePictureWrapper}>
            <quip.apps.ui.ProfilePicture user={author} size={20} round={true}/>
          </span>
        </div>
        <div className={Styles.commentContent}>
          <div className={Styles.commentAuthorWrapper}>
            <span className={Styles.commentAuthor}>{author.getName()}</span>
            { this.state.hovered &&
              <span>
                <span onClick={this.triggerDelete} className={Styles.commentLink}>Delete</span>
              </span>
            }
          </div>
          <div>
            <span style={{marginLeft:'4px'}}>{this.props.replyObject.comment}</span>
          </div>
        </div>
      </div>
    );
  }
};

Reply.propTypes = {
  deleteReply: React.PropTypes.function,
  replyObject: React.PropTypes.object,
  index: React.PropTypes.number
}
