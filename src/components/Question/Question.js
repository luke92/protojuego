import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'rc-slider/assets/index.css';
import './style.css'
import { QUESTIONS } from 'constants/questions';
import { Button, Row, Col } from 'reactstrap';

const TIMER_DEFAULT = 10;
export default class QuestionComponent extends Component {

  state = {
    rightAnswers: 0,
    wrongAnswers: 0,
    showQuestion: false,
    step: 0,
    time: 10,
    showError: false,
    showResults: false,
  };

 interval() {
    if(this.state.time > 0){
      this.setState({
        time: this.state.time - 1
      })
    } else{
      this.clearTimer();
      this.showBadNews();
    }
  }

  startTimer() {
    this.countdown = setInterval(() => this.interval(), 1000);
  }

  clearTimer() {
    this.setState({
      time: TIMER_DEFAULT
    });
    clearInterval(this.countdown);
  }

  showBadNews() {
    this.setState({
      showError: true,
      step: 0,
      showQuestion: false,
      rightAnswers: 0,
      wrongAnswers: 0
    });
  }

  startQuestionnaire() {
    this.setState({
      showQuestion: true,
      rightAnswers: 0,
      wrongAnswers: 0,
      step: 0,
      showError: false,
      showResults: false,
    });
    this.startTimer();
  }

  showResults() {
   this.setState({
     showResults: true,
     showQuestion: false
   })
  }

  validateAnswer(option) {

    if(option.isRight) {
      this.setState({
        rightAnswers: this.state.rightAnswers + 1
      })
    } else{
      this.setState({
        wrongAnswers: this.state.wrongAnswers + 1
      })
    }

    if(QUESTIONS.length - 1 == this.state.step){
      this.showResults();
      this.clearTimer();
    } else{
      this.setState({
        step: this.state.step + 1
      });
      this.clearTimer();
      this.startTimer();
    }

  }

  renderQuestion() {
    const question = QUESTIONS[this.state.step];
    return (
      <div className="options-container">
        <Row>
          <Col>
            <h3>{question.question}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.renderOptions()}
            </Col>
        </Row>
      </div>
    )
  }

  renderOptions() {
    const question = QUESTIONS[this.state.step];

    return question.options.map((q, key) => (
        <Button color="primary" className="margin-button" key={key} onClick={() => this.validateAnswer(q)}>{q.answer}</Button>
      )
    )
  }

  renderError() {
    const { showError } = this.state;

    return (showError && <div className="error-container">
      <Row>
        <Col>
      <h3 className="error-message">Perdiste!</h3>
    </Col>
    </Row>
    </div>)
  }

  renderResults() {
   const {rightAnswers, wrongAnswers} = this.state;
   return (
     <div className="results-container">
       <Row>
         <Col><h4>Respuestas correctas: {rightAnswers} </h4></Col>
         <Col><h4>Respuestas incorrectas: {wrongAnswers}</h4></Col>
       </Row>
     </div>
   )
  }

  render() {
    const { showQuestion, time, showResults } = this.state;
    return (
      <div className="question-container">
        <h1>Aprendiendo sobre Gestion de Proyectos</h1>
        <div className="questions-container">
          { showQuestion && <Row>
            <Col md={{offset: 4, size: 8}}>
              <div className="timer">
                Tiempo restante: <span className="timer-count">{time}</span> segundos
              </div>
            </Col>
          </Row>}
          {this.renderError()}
          {showResults && this.renderResults()}
          <Row>
            <Col md={{offset: 4, size: 4}}>
              { !showQuestion && <Button className="btn-lg" onClick={() => this.startQuestionnaire(0)}>Comenzar!</Button> }
            </Col>
          </Row>

          { showQuestion && this.renderQuestion()}
        </div>
      </div>
    );
  }
}