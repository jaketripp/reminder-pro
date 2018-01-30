import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addReminder, deleteReminder, clearReminders } from '../actions';
import moment from 'moment';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dueDate: moment(new Date()).utc().add(1, 'd').format()
        }
    }

    addReminder() {
        // console.log('this.state.dueDate', this.state.dueDate);
        this.props.addReminder(this.state.text, this.state.dueDate);
        this.setState({text: ''});
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
                <div className="form-inline reminder-form">
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
                                this.setState({ dueDate: e.target.value });
                                console.log(e.target.value);
                            }}
                        />
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => this.addReminder()}
                            disabled={!this.state.text}
                        >Add Reminder</button>
                    </div>
                </div>
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