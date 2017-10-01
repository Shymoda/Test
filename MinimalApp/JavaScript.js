import { Dispatcher } from "flux";
import KeyMirror from 'fbjs/lib/KeyMirror';
import { EventEmitter } from 'events';

const actions = KeyMirror({ PLUS_ACTION: null });

const appDispatcher = new Dispatcher();

const handleClick = (action) => {
    appDispatcher.dispatch(action);
}

let initialState = { count: 0 };

const store = Object.assign({}, EventEmitter.prototype, {

    setState: (newState) => {
        initialState = newState;
        store.emit('change');
    },

    getState: () => {
        return initialState;
    },

    addChangeListener: (callback) => {
        store.on('change', callback);
    },

    removeChangeListener: (callback) => {
        store.off('change', callback);
    }
})

appDispatcher.register(action => {
    switch (action.type) {
        case actions.PLUS_ACTION: {
            const {value} = action;
            const state = store.getState();
            store.setState({ count: state.count + value });
            break;
        }
        default: return null;
    }
})

class DashBoard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = store.getState();

    }

    componentDidMount() {
        store.addChangeListener(this.updateState.bind(this));
    }

    componentWillUnMount() {
        store.removeChangeListener(this.updateState.bind(this));
    }

    updateState() {
        this.setState(store.getState());
    }

    render() {
        const {count} = this.state;
        return <div> <h2>Counter:{count}</h2> </div>;


    }
}

class PlusButton extends React.Component {
    render() {
        return <div> <button onClick={this.onButtonClick.bind(this, 123)} >Plus one</button> </div>;


    }

    onButtonClick(e, pm) {
        pm.preventDefault();
        //  console.log(pm);
        handleClick({
            type: actions.PLUS_ACTION,
            value: e
        });
    }
}

class Hello extends React.Component {
    render() {
        return <div><h1>Привет, React.JS</h1> <DashBoard /> <PlusButton /></div>;
    }
}


ReactDOM.render(
    <Hello />,
    document.getElementById("content")
);