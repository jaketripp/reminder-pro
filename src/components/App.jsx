import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addReminder, deleteReminder, clearReminders } from '../actions';
import moment from 'moment';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dueDate: '',
            timeIn15Mins: moment().add(15, 'm').format('YYYY-MM-DDTHH:mm')
        }
        setTimeout(() => {
            this.checkDeadlines(this.props.reminders);
        }, 10000);
        setInterval(() => {
            this.checkDeadlines(this.props.reminders);
        }, 300000);
    }
    
    // find a better way to join them (using '&' for the last one)
    // use a modal?
    checkDeadlines(remindersArr) {
        let dueSoon = [];
        for (let i = 0; i < remindersArr.length; i++) {
            let diff = moment(new Date()).diff(remindersArr[0].dueDate);
            console.log(diff);
            if (diff > -900000 && diff < 0) {
                dueSoon.push(remindersArr[i].text)
            }
        }
        if (dueSoon.length > 0) {
            alert(`Get working! "${dueSoon.join('", "')}" should be done soon!`);
        }
    }

    addReminder() {
        const { timeIn15Mins, dueDate, text } = this.state;
        if (dueDate === '') {
            this.setState({
                dueDate: timeIn15Mins
            });
            this.props.addReminder(text, timeIn15Mins);
        } else {
            this.props.addReminder(text, dueDate);
        }
        this.setState({ text: '' });
    }

    deleteReminder(id) {
        this.props.deleteReminder(id);
    }

    renderReminders() {
        const { reminders } = this.props;
        return (
            <ul className="list-group col-sm-4">
                {
                    reminders.map(reminder => {
                        return (
                            <li
                                key={reminder.id} className="list-group-item">
                                <div className="list-item">
                                    <div>{reminder.text}</div>
                                    <div><em>{moment(new Date(reminder.dueDate)).fromNow()}</em></div>
                                </div>
                                <div
                                    className="list-item delete-button"
                                    onClick={() => this.deleteReminder(reminder.id)}
                                >&#x2715;</div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    render() {
        return (
            <div className="App">
                <div className="title">
                    Reminder Pro
                </div>
                <form className="form-inline reminder-form" onSubmit={e => {
                    e.preventDefault();
                    this.addReminder();
                }}>
                    <div className="form-group">
                        <input
                            autoFocus
                            className="form-control"
                            placeholder="I have to..."
                            onChange={e => this.setState({ text: e.target.value })}
                            value={this.state.text}
                        />
                        <input
                            className="form-control"
                            type="datetime-local"
                            onChange={e => {
                                this.setState({ dueDate: e.target.value })
                            }}
                            value={this.state.dueDate !== '' ? this.state.dueDate : this.state.timeIn15Mins}
                        />
                        <button
                            type="submit"
                            className="btn btn-success"
                            onClick={() => this.addReminder()}
                            disabled={!this.state.text}
                        >Add Reminder</button>
                    </div>
                </form>
                {this.renderReminders()}
                <div
                    className="btn btn-danger"
                    onClick={() => this.props.clearReminders()}
                >Clear Reminders
                </div>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        reminders: state
    }
}

// mapDispatchToProps replaced by object
export default connect(mapStateToProps, { addReminder, deleteReminder, clearReminders })(App);