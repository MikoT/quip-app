import Styles from './App.less';

export default class ReplyInput extends React.Component {
  componentDidMount() {
    this.refs['input'].focus();
  }

  handleInputSubmit(event) {
    if (event.keyCode === 13) {
      const comment = event.target.value;
      event.target.value = null;

      // make reply
      const replyObject = {
        authorId: quip.apps.getViewingUser().getId(),
        comment: comment
      }

      this.props.addReply(replyObject);
    }
  }

  render() {
    return (
      <div className={Styles.replyInput}>
        <input ref='input'
          style={{borderLeft: '1px solid rgba(0, 0, 0, 0.12)', borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '5px', width: '90%'}}
            placeholder='Write your reply...' onKeyDown={e => {this.handleInputSubmit(e)}}></input>
      </div>
    );
  }
};

ReplyInput.propTypes = {
  addReply: React.PropTypes.function,

}
