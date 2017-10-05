
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

const actions = KeyMirror({ EVENT_CLICK_ACTION: null, TIME_CLICK_ACTION: null, EVENT_DELETE_ACTION: null, EVENT_LOAD_ACTION: null, EVENT_ADD_ACTION: null});

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
        case  actions.EVENT_LOAD_ACTION:
            {
                store.loadEvents();
                break;
            }
        case actions.EVENT_ADD_ACTION:
            {
                const { value } = action;
                store.addEvent(value);
                break;
            }
        default: return null;
    }
})

var events = [];

events.changes = { time: '', fact: 0 };
  
const store = Object.assign({}, EventEmitter.prototype, {

    addEvent: (event) =>
    {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "/Home/AddEvent/?evt="+event.event+"&time="+event.time);

        xhr.send();

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                var evs = JSON.parse(xhr.responseText);

                for (var i = 0; i < evs.length; i++) {
                    events.push(evs[i]);
                    events[i].time = parseInt(events[i].time.split(':')[0]).toString() +
                        ":" + (parseInt(events[i].time.split(':')[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
                    events[i].isSelect = 0;

                }

                store.emit('change');
            }
        }
    },

    loadEvents: () =>
    {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "/Home/Data");

        xhr.send();

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                var evs = JSON.parse(xhr.responseText);

                for (var i=0; i < evs.length; i++)
                {
                    events.push(evs[i]);
                    events[i].time = parseInt(events[i].time.split(':')[0]).toString() +
                        ":" + (parseInt(events[i].time.split(':')[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
                    events[i].isSelect = 0;

                }

                store.emit('change');
            }
        }

    },

    deleteEvent: (id) => {

        var xhr = new XMLHttpRequest();

        console.log(id);

       xhr.open("GET", "/Home/DeleteEvent/?id="+id.toString());

       xhr.send();

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                var evs = JSON.parse(xhr.responseText);

                events.length = 0;

                for (var i = 0; i < evs.length; i++) {
                    events.push(evs[i]);
                    events[i].time = parseInt(events[i].time.split(':')[0]).toString() +
                        ":" + (parseInt(events[i].time.split(':')[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
                    events[i].isSelect = 0;

                }

                store.emit('change');
            }
        }
        
       events.changes = { time: '', fact: -id };

        store.emit('change');
    },

    setEventsTime: (time) => {

        var ev = events.filter(function (element, index, array) { return element.isSelect });

        events.changes = { time: time, fact: 1 };

        var ids = "";

        if (ev.length > 0) {
            events.changes = { time: time, fact: 0 };

             ids = ev[0].id;
        }

            for (var i = 1; i < ev.length; i++) {
                ids += "_" + ev[i].id;
            }

            var xhr = new XMLHttpRequest();

            xhr.open("GET", "/Home/ChangeEvent/?ids=" + ids.toString()+"&time="+time);

            xhr.send();

            xhr.onreadystatechange = function () {

                if (xhr.readyState == 4 && xhr.status == 200) {
                    var evs = JSON.parse(xhr.responseText);

                    events.length = 0;

                    for (var i = 0; i < evs.length; i++) {
                        events.push(evs[i]);
                        events[i].time = parseInt(events[i].time.split(':')[0]).toString() +
                            ":" + (parseInt(events[i].time.split(':')[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));

                        if (ev.filter(function (element, index, array) { return element.id == events[i].id }).length>0)
                            events[i].isSelect = 1;
                        else
                            events[i].isSelect = 0;
                           
                    }

                    store.emit('change');
                }
            }
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

            console.log('state '+ev[0].time+ev.length);

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

            if (tmp == this.state.time ) 
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

class EventsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { time: '', fact: 0 };

    }

    render() {

        var data = this.props.data;

        var state = this.state;

        var eventTemp = data.map(function (item) { return (<Event data={item} change={state} />) });


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

class CommonPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.handleLoad = this.handleLoad.bind(this);
    }


    render() {
        var data = this.props.data;
        console.log('Component');
        return (
            <div>
                <button onClick={this.handleOpenModal} style={styles.addButton}>Добавить событие</button>

                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    style={customStyles}


                >
                    <div style={styles.modalDiv}><div style={styles.innerModalDiv}>Добавление нового пункта</div></div>
                    <form onSubmit={this.handleSubmit.bind(this) }>
                        <p>Название</p>
                        <input type='text' style={styles.modalTxt} value={this.state.event} onChange={this.handleEventChange.bind(this)} />   
                        <p>Время  </p>
                        <input id="time" type='text' style={styles.modalTxt} value={this.state.time} onChange={this.handleTimeChange.bind(this)}/>
                        <button type="submit" style={styles.modalButton}>OK</button>
                        <button type="button" style={styles.modalButton} onClick={this.handleCloseModal}>Cancel</button>
                    </form>

                </ReactModal>

                <table style={
                    styles.mainTable
                }  >
                    <tr><td>
                        <EventsList data={data} />
                    </td>
                        <td>
                            <TimeTable borderTime01={{ hours: 10, minutes: 0 }}
                                borderTime02={{ hours: 22, minutes: 0 }} TimeStep={30} />
                        </td></tr></table>
            </div>
        );
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        alert("ddddddddddddd");
        this.setState({ showModal: false });
    }


    componentDidMount() {
        this.handleLoad();
    }

    handleLoad() {
        handleClick(
            {
                type: actions.EVENT_LOAD_ACTION
            });

    }

    handleSubmit(e) {
        e.preventDefault();
      ///  var fd = this.refs.Time.value;
     //   var id = e.time.value;
      //  alert(this.state.event + " " + this.state.time);
       // this.setState({ showModal: false });
        handleClick(
            {
                type: actions.EVENT_ADD_ACTION,
                value: { event: this.state.event, time: this.state.time }
            });
    }

    handleEventChange(e) {
        this.setState({ event: e.target.value });
    }

    handleTimeChange(e) {
        this.setState({ time: e.target.value });
    }
}

class All extends React.Component {
    render() {
        return (
            <div>
                <CommonPanel data={events} />
            </div>
        );
    }
}

ReactDOM.render(
    <All />,
    document.getElementById("content")
);