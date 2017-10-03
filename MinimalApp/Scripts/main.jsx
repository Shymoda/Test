
import { Dispatcher } from "flux";
import KeyMirror from 'fbjs/lib/KeyMirror';
import { EventEmitter } from 'events';
import  ReactModal  from 'react-modal';
import ReactDOM from 'react-dom';

var Radium = require('radium');

var styles = {

    mainTable:
    {
        left:'30%',
    },

    tableEvent:
    {
        borderSpacing: 0,
        borderCollapse: 'collapse',
    },

    tableEventRow: {
        background: 'LightSalmon',
        color: 'black',
        border: 2,
        borderColor: 'black',
        borderStyle: 'solid',
    },

    tableEventRowSplash: {
        background: 'Yellow',
        color: 'black',
        border: 2,
        borderColor: 'black',
        borderStyle: 'solid',
    },

    tableEventCell:
    {
        cursor: 'pointer',
        padding: '0.5em',
    },

        tableTime:
    {
        borderSpacing:2 ,
    },

    tableTimeRow: {
        color: 'black',
    },

    tableTimeCell:
    {
        cursor: 'pointer',
        padding: '0.1em',
    },

    divTime:
{
        borderRadius: 5,
        background: 'GreenYellow',
        padding: '0.5em',
    },


        divTimeSplash:
    {
        borderRadius: 5,
        background: 'Yellow',
        padding: '0.5em',
    },

        addButton: {
            color: 'black',
            textDecoration: 'none',
            userSelect: 'none',
            background: 'rgb(212, 75, 56)',
            padding: 7,
            outline: 'none',

            hover:
            {
                background:'rgb(232, 95, 76)',
            },

            active:
            {
                background: 'rgb(152, 15, 0)',
            }

        },

        modalTxt:
        {
            width: '95%',
        },

        modalButton:
        {
            marginTop: 20,
            marginLeft: 25,
            width: '35%',
            height: 30,
        },

        modalDiv:
        {
            marginTop: -20,
            marginLeft: -20,
            padding: 20,
            width: '100%',
            backgroundColor: 'Snow',
            borderBottom: 1,
            borderBottomStyle: 'solid',
            borderColor: 'black',
        },

        innerModalDiv:
        {
            marginLeft: '10%',
            fontFamily: 'Cambria',
        }

};

const actions = KeyMirror({ EVENT_CLICK_ACTION: null, TIME_CLICK_ACTION: null, EVENT_DELETE_ACTION: null });

const appDispatcher = new Dispatcher();

const handleClick = (action) => {
    appDispatcher.dispatch(action);
}

appDispatcher.register(action => {
    switch (action.type)
    {
        case actions.EVENT_CLICK_ACTION:
        {
            const {value} = action;  
            store.setTimeSpark(value);
            break;
            }
        case actions.TIME_CLICK_ACTION:
            {
                const {value} = action;
                store.setEventsTime(value);
                break;
            }
        case actions.EVENT_DELETE_ACTION:
            {
                const {value} = action;
                store.deleteEvent(value);
                break;
            }
        default: return null;
    }
})
  
const store = Object.assign({}, EventEmitter.prototype, {

    deleteEvent: (id) => {

        var ev = events.find(function (element, index, array) { return element.id == id; });

        var idx = events.indexOf(ev);

        events.splice(idx, 1);

       events.changes = { time: '', fact: -id };

        store.emit('change');
    },

    setEventsTime: (time) => {

        var ev = events.filter(function (element, index, array) { return element.isSelect });

        events.changes = { time: time, fact: 1 };

            if (ev.length > 0)
                events.changes = { time: time, fact: 0 };

            for (var i = 0; i < ev.length; i++) {
                ev[i].time = time;
            }

        store.emit('change');
    },

    getEventsState: () => {
        return events.changes;
    },

    setTimeSpark: (value) => {
        var ev = events.find(function (element, index, array) { return element.id == value.id; });

        ev.isSelect = value.state;

        events.changes = { time: '', fact: 0 };

        store.emit('change');

    },

    getTimeState: () => {

        try
        {
            var ev = events.filter(function (element, index, array) { return element.isSelect});

            if(ev.length<2)
                return { time: ev[0].time };
            else
            {
                for (var i=0; i < ev.length-1; i++)
                {
                    if (ev[i].time != ev[i + 1].time) 
                        return { time: '-----' };
                    
                }

                return { time: ev[0].time };
            }
        }
        catch (e)
        {
            return { time: '-----' };
        }

    },

    addChangeListener: (callback) => {
        store.on('change', callback);
    },

    removeChangeListener: (callback) => {
        store.off('change', callback);
    }
}) 

var events = [
    {
        id:0,
        event: 'Прыжки в длину',
        time: '10:30',
        isSelect: 0,
        isTimeSelect:0
    },
    {
        id:1,
        event: 'Прыжки в ширину',
        time: '10:30',
        isSelect: 0,
        isTimeSelect:0
    },
    {
        id:2,
        event: 'Прыжки в глубину',
        time: '12:30',
        isSelect: 0,
        isTimeSelect: 0
    },
    {
        id: 3,
        event: 'Прыжки в высоту',
        time: '13:30',
        isSelect: 0,
        isTimeSelect: 0
    },
    {
        id: 4,
        event: 'И тому подобное',
        time: '14:30',
        isSelect: 0,
        isTimeSelect: 0
    }
];

events.changes = { time:'', fact: 0};

class TimeTable extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = { time: '---' };

    }

    render()
    {
        
        var interTime = [];

        interTime.push(this.props.borderTime01);

        while (true)
        {
            var tmp = (interTime[interTime.length - 1].hours.toString() + ':' + interTime[interTime.length - 1].minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));

            if (tmp == this.state.time)
            {
                interTime[interTime.length - 1].view = 1;
            }
            else
                interTime[interTime.length - 1] .view = 0;

            var tmpMin = (interTime[interTime.length - 1].minutes + this.props.TimeStep) % 60;
            var tmpHour = Math.floor(interTime[interTime.length - 1].hours + (interTime[interTime.length - 1].minutes + this.props.TimeStep) / 60);

            var tmpTime = { hours: tmpHour, minutes: tmpMin };

            if ((tmpTime.hours > this.props.borderTime02.hours) || ((tmpTime.hours == this.props.borderTime02.hours)
                && (tmpTime.minutes > 0)))
                break;

            interTime.push(tmpTime);
        }

        interTime.push(this.props.TimeStep);

        var tabs = [];

        var j = 0;

        for (var i = 0; i < interTime.length; i += 3)
        {
            tabs[j] = Array(interTime[i], interTime[i + 1], interTime[i + 2]);

            j++
        }

        var diffs = tabs.length*3 - interTime.length;

        tabs[tabs.length - 1]=tabs[tabs.length - 1].slice(0, 3 - diffs-1);

        return (
            <table style={
                styles.tableTime
            }><TimeRow data={tabs}/></table>

        )
    }

    componentDidMount() {
        store.addChangeListener(this.updateState.bind(this));
    }

    componentWillUnMount() {
        store.removeChangeListener(this.updateState.bind(this));
    }

    updateState() {
        this.setState(store.getTimeState());
    }
}

class TimeRow extends React.Component {

    render() {

        var data = this.props.data;

        var rows = data.map(function (item) {
            return (<tr style={
                styles.tableTimeRow
            }> {item.map(function (item2) { return (<TimeBlock data={item2} />) })} </tr>)
        });

        return (
            <tr>
                {rows}
            </tr>
        )
    }
}


class TimeBlock extends React.Component {


    render() {

        var data = this.props.data;

        var time = data.hours + ':' + data.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        return (
            <td style={
                styles.tableTimeCell
            }>
                <div onClick={this.onTimeClick.bind(this, time)}
                    style={
                    data.view == 0 ?
                        styles.divTime : styles.divTimeSplash
                    }> {time} 
                </div></td>
            )

    }

    onTimeClick(pm, e) {

        handleClick(
            {
                type: actions.TIME_CLICK_ACTION,
                value: pm
            });

    }
}

class Event extends React.Component {

    render() {
        var data = this.props.data;

        var change = this.props.change;

        return (
            <tr key={data.id} style={
                ((change.time == data.time && change.fact == 1) || (change.time == data.time && change.fact == 0 && data.isSelect))
                    ? styles.tableEventRowSplash : styles.tableEventRow
            }   >
                <td style={
                    styles.tableEventCell
                }> <input type='checkbox' onChange={this.onEventClick.bind(this, data.id)} /> </td>
                <td style={
                    styles.tableEventCell
                } >{data.time}</td>
                <td style={
                    styles.tableEventCell
                }> {data.event}</td>
                <td onClick={this.onEventDeleteClick.bind(this, data.id)} style={
                    styles.tableEventCell
                }> X</td>
            </tr>
        )

    }

    onEventClick(pm, e) {
        
            handleClick(
                {
                    type: actions.EVENT_CLICK_ACTION,
                    value: { id: pm, state: e.target.checked }
                });
        
    }

    onEventDeleteClick(pm, e) {

        handleClick(
            {
                type: actions.EVENT_DELETE_ACTION,
                value:  pm
            });

    }

}

class EventsList extends React.Component
{
    constructor(props, context) {
        super(props, context);

        this.state = { time: '', fact: 0 };

    }

    render() {
        var data = this.props.data;

        var state = this.state;

        var eventTemp = data.map(function (item) { return (<Event data={item} change={state}/>) });

        return (
            <table style={
                styles.tableEvent
            }  >               
               {eventTemp}
            </ table>
        );
    }

    componentDidMount() {
        store.addChangeListener(this.updateState.bind(this));
    }

    componentWillUnMount() {
        store.removeChangeListener(this.updateState.bind(this));
    }

    updateState() {
        this.setState(store.getEventsState());
    }
}


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: 250,
        height:250,
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'LemonChiffon',
        fontFamily: 'Cambria',
        
    }
};

class CommonPanel extends React.Component
{
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }


    render()
    {
        return (
            <div>
                <button onClick={this.handleOpenModal} style={styles.addButton}>Добавить событие</button>

                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    style={customStyles}
                    

                >
                    <div style={styles.modalDiv}><div style={styles.innerModalDiv}>Добавление нового пункта</div></div>
                    <form>
                        <p>Название</p>
                        <input type='text' style={styles.modalTxt} />
                        <p>Время  </p>
                        <input type='text' style={styles.modalTxt} />
                        <button style={styles.modalButton} onClick={this.closeModal}>OK</button>
                        <button style={styles.modalButton} onClick={this.closeModal}>Cancel</button>
                    </form>

                </ReactModal>

            <table style={
                styles.mainTable
            }  >
                <tr><td>
                    <EventsList data={events} />
                </td>
                    <td>
                    <TimeTable borderTime01={{ hours: 10, minutes: 0 }}
                        borderTime02={{ hours: 22, minutes: 0 }} TimeStep={30} /> 
                    </td></tr></table>
                </div>
            );
    }
}


ReactDOM.render(
     <CommonPanel />,
    document.getElementById("content")
);