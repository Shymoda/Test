
import { Dispatcher } from "flux";
import KeyMirror from 'fbjs/lib/KeyMirror';
import { EventEmitter } from 'events';


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
    }


};

const actions = KeyMirror({ EVENT_CLICK_ACTION: null });

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
        default: return null;
    }
})

const store = Object.assign({}, EventEmitter.prototype, {

    setTimeSpark: (value) => {
        var ev = events.find(function (element, index, array) { return element.id == value.id; });
        ev.isSelect = value.state;
        store.emit('change');
    },

    getTimeState: (data) => {

        var tmp = data.hours + ":" + data.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

        try
        {
            var ev = events.find(function (element, index, array) { return element.time == tmp });

            return { view: ev.isSelect };
        }
        catch (e)
        {

                return { view: 0 }
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
        time: '11:30',
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

class TimeTable extends React.Component {
    render()
    {
        var interTime = [];

        interTime.push(this.props.borderTime01);

        while (true)
        {
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

    constructor(props, context) {
        super(props, context);

        this.state = { view: 0 };

    }

    render() {

        var data = this.props.data;

        return (
            <td style={
                styles.tableTimeCell
            }>
                <div style={
                    this.state.view == 0 ?
                        styles.divTime : styles.divTimeSplash
            }>{data.hours}:{data.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div></td>
            )

    }

    componentDidMount() {
        store.addChangeListener(this.updateState.bind(this));
    }

    componentWillUnMount() {
        store.removeChangeListener(this.updateState.bind(this));
    }

    updateState() {
        this.setState(store.getTimeState(this.props.data));
    }
}

class Event extends React.Component {

    render() {
        var data = this.props.data;

        return (
            <tr key={data.id} style={
                styles.tableEventRow
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
                <td style={
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

}

class EventsList extends React.Component
{
    render() {
        var data = this.props.data;

        var eventTemp = data.map(function (item) { return (<Event data={item} />) });

        return (
            <table style={
                styles.tableEvent
            }  >               
               {eventTemp}
            </ table>
        );
    }
}

class CommonPanel extends React.Component
{
    render()
    {
        return (
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
            );
    }
}


ReactDOM.render(
     <CommonPanel />,
    document.getElementById("content")
);