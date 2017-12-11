import React from 'react'
import PropTypes from 'prop-types'
import QuizBody from '../quiz/quiz-body'
import PagingButton from '../quiz/paging-button'

class QuizPage extends React.Component {
  constructor(props) {
    super(props)
    props.startGetQuestions()
    this.state = {
      page: 1,
    }
  }

  nextIsDisabled() {
    return this.state.page === this.props.questions.length
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 })
  }

  prevIsDisabled() {
    return this.state.page === 1
  }

  prevPage() {
    this.setState({ page: this.state.page - 1 })
  }

  render() {
    if (!this.props.questions) { return <div /> }
    if (this.props.questions.length === 0) {
      return (
        <div className="quiz-page-error">There are no questions!</div>
      )
    }
    return (
      <div className="quiz-page center-block">
        <QuizBody
          question={this.props.questions[this.state.page - 1]}
          page={this.state.page}
          moveNextPage={
            this.nextIsDisabled() ? undefined : () => { this.nextPage() }
          }
        />
        <PagingButton
          className="quiz-prev"
          disabled={this.prevIsDisabled()}
          onClick={() => { this.prevPage() }}
        >
          <span className="glyphicon glyphicon-chevron-left" />
        </PagingButton>
        <PagingButton
          className="quiz-next"
          disabled={this.nextIsDisabled()}
          onClick={() => { this.nextPage() }}
        >
          <span className="glyphicon glyphicon-chevron-right" />
        </PagingButton>
      </div>
    )
  }
}

QuizPage.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object),
  startGetQuestions: PropTypes.func.isRequired,
}
QuizPage.defaultProps = {
  questions: undefined,
}

export default QuizPage
