
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
}


};

const actions = KeyMirror({ PLUS_ACTION: null });

const appDispatcher = new Dispatcher();


var events = [
    {
        id:0,
        event: 'Прыжки в длину',
        time: '10:30'
    },
    {
        id:1,
        event: 'Прыжки в ширину',
        time: '11:30'
    },
    {
        id:2,
        event: 'Прыжки в глубину',
        time: '12:30'
    },
    {
        id: 3,
        event: 'Прыжки в высоту',
        time: '13:30'
    },
    {
        id: 4,
        event: 'И тому подобное',
        time: '14:30'
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

    render() {

        var data = this.props.data;

        return (
            <td style={
                styles.tableTimeCell
            }><div style={
                styles.divTime
            }>{data.hours}:{data.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div></td>
            )

    }
}

class Event extends React.Component
{
    render()
    {
        var data = this.props.data;

        return (
            <tr key={data.id} style={
                styles.tableEventRow
            }>
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