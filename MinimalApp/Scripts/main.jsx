
import { Dispatcher } from "flux";
import KeyMirror from 'fbjs/lib/KeyMirror';
import { EventEmitter } from 'events';
import  ReactModal  from 'react-modal';
import ReactDOM from 'react-dom';

var Radium = require('radium'); // Компонент работы со стилями

var styles = { 

    mainTable: // Стили оформления таблицы с событиями
    {
        left:'30%',
    },

    tableEvent: // Стиль невыделенного события 
    {
        borderSpacing: 0,
        borderCollapse: 'collapse',
    },

    tableEventCommon: {  // Общее для событий в любом состоянии
        color: 'black',
        border: 2,
        borderColor: 'black',
        borderStyle: 'solid',
    },

    tableEventRow: { // Стиль выделенного события
        background: 'LightSalmon',
    },

    tableEventRowSplash: { // Стиль отдельной строки таблицы с событиями
        background: 'Yellow',
    },

    tableEventCell: // Стиль отдельной ячейки таблицы с событиями
    {
        cursor: 'pointer',
        padding: '0.5em',
    },

    tableTime:  // Стиль таблицы со временем
    {
        borderSpacing:2 ,
    },

    tableTimeRow: {  // Стиль отдельной строки таблицы со времем
        color: 'black',
    },

    tableTimeCell:  // Стиль отдельной ячейки таблицы со временем
    {
        cursor: 'pointer',
        padding: '0.1em',
    },

    divTimeCommon:  // Стиль div'а внутри ячейки таблицы со временем (общий)
    {
        borderRadius: 5,
        padding: '0.5em',
    },

    divTime: // Стиль div'а внутри ячейки таблицы со временем (невыделенный)
{
        background: 'GreenYellow',
    },


    divTimeSplash: // Стиль div'а внутри ячейки таблицы со временем (выделенный)
    {
        background: 'Yellow',
    },

    addButton: { // Стиль кнопки добавления события
            color: 'black',
            textDecoration: 'none',
            userSelect: 'none',
            background: 'Lightpink',
            padding: 10,
            margin: 15,
            outline: 'none',

        },

    modalTxt: // Стиль всплывающего окна
        {
            width: '95%',
        },

    modalButton: // Стиль кнопок всплывающего окна
        {
            marginTop: 20,
            marginLeft: 25,
            width: '35%',
            height: 30,
        },

    modalDiv: // Стиль заголовка всплывающего окна
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

    innerModalDiv: // Стиль заголовка всплывающего окна
        {
            marginLeft: '10%',
            fontFamily: 'Cambria',
        }

};

const customStyles = { // Стили модального окна
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: 250,
        height: 250,
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'LemonChiffon',
        fontFamily: 'Cambria',

    }
};

const actions = KeyMirror({
    EVENT_CHANGE_ACTION: null, TIME_CLICK_ACTION: null, EVENT_DELETE_ACTION: null,
    EVENT_LOAD_ACTION: null, EVENT_ADD_ACTION: null
}); // Чтобы значения соответствовали ключам

const appDispatcher = new Dispatcher(); // Диспетчер


const handleClick = (action) => { // Для отсылки данных обработчикам
    appDispatcher.dispatch(action);
}

appDispatcher.register(action => { // Регистрация обработчиков действий диспетчером
    switch (action.type)
    {
        case actions.EVENT_CHANGE_ACTION: // Изменение времени события
        {
            const {value} = action;  
            store.setTimeSpark(value);
            break;
            }
        case actions.TIME_CLICK_ACTION: // Выбор блока времени мышкой
            {
                const {value} = action;
                store.setEventsTime(value);
                break;
            }
        case actions.EVENT_DELETE_ACTION: // Удаление событи\
            {
                const {value} = action;
                store.deleteEvent(value);
                break;
            }
        case actions.EVENT_LOAD_ACTION: // Загрузка массива событий
            {
                store.loadEvents();
                break;
            }
        case actions.EVENT_ADD_ACTION: // Добавление события
            {
                const { value } = action;
                store.addEvent(value);
                break;
            }
        default: return null;
    }
})

var events = []; // Массив событий

events.changes = { time: '', fact: 0 };  // Объект для регистрации изменений в массиве событий

events.errorLoad = { message: '' };  // Сообщение об ошибке с сервера

events.ajaxRequest = function (request, isChange, arr) {  // Асинхронный запрос к контроллеру с сервера

    events.errorLoad = { message: '' };

    var xhr = new XMLHttpRequest(); // Создание объекта XMLHttpReques и отправка запроса на сервер

    xhr.open("GET", request);

    xhr.send();

    xhr.onreadystatechange = function () { // Когда запрос был выполнен и пришел ответ

        if (xhr.readyState == 4 && xhr.status == 200) { // Если не было ошибок
            var eventsTmp = JSON.parse(xhr.responseText); // Сохранение результата во временный объект

            if (eventsTmp instanceof Array) { // Если временный объект - массив

                events.length = 0; // Перезапись данных в исходном массиве событий

                for (var i = 0; i < eventsTmp.length; i++) {
                    events.push(eventsTmp[i]);
                    events[i].time = parseInt(events[i].time.split(':')[0]).toString() +
                        ":" + (parseInt(events[i].time.split(':')[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));

                    if (!isChange) // Если это был не запрос на редактирование
                        events[i].isSelect = 0;
                    else // Иначе нужно восстановить состояние выделенных элементов
                    {
                        if (arr.filter(function (element, index, array) { return element.id == events[i].id }).length > 0)
                            events[i].isSelect = 1;
                        else
                            events[i].isSelect = 0;

                    }

                }

                events.sort(function (event01, event02) { return event01.time > event02.time; }); // Сортировка по дате
            }
            else
                events.errorLoad = { message: eventsTmp.message }; // С сервера пришла ошибка

            store.emit('change');
        }
    }
}
  
const store = Object.assign({}, EventEmitter.prototype, { // Хранилище

    getLoadError: ()=> // Получение информации об ошибке
    {
        return events.errorLoad;
    },

    addEvent: (event) => // Добавление события 
    {
        events.ajaxRequest("/Home/AddEvent/?evt=" + event.event + "&time=" + event.time, false,null );
    },

    loadEvents: () => // Загрузка событий
    {
        events.ajaxRequest("/Home/Data", false,null);
    },

    deleteEvent: (id) => { // Удаление события
        events.changes = { time: '', fact: -id };

        events.ajaxRequest("/Home/DeleteEvent/?id=" + id.toString(), false,null);
    },

    setEventsTime: (time) => { // Изменение времени у событий

        var evsPicked = events.filter(function (element, index, array) { return element.isSelect }); // Массив выделенных событий

        events.changes = { time: time, fact: 1 };

        if (evsPicked.length > 0) {
            var idString = "";

            if (evsPicked.length > 0) { // Формирование строки из id изменяемых событий для отправки на сервер
                events.changes = { time: time, fact: 0 };

                idString = evsPicked[0].id;
            }

            for (var i = 1; i < evsPicked.length; i++) {
                idString += "_" + evsPicked[i].id;
            }

            events.ajaxRequest("/Home/ChangeEvent/?ids=" + idString.toString() + "&time=" + time, true, evsPicked);
        }
        else
        {
            events.errorLoad = { message: '' };

            store.emit('change');
        }

         
    },

    getEventsState: () => { // Получение состояния списка событий
        return events.changes;
    },

    setTimeSpark: (value) => { // Выделение (снятие выделения) времени события

        events.errorLoad = { message: '' };

        var evPicked = events.find(function (element, index, array) { return element.id == value.id; });// Поиск выбранного события

        evPicked.isSelect = value.state; // Установка (снятие) выделения с события

        events.changes = { time: '', fact: 0 };

        store.emit('change');

    },

    getTimeState: () => { // Получение текущего времени для установки

        try
        {
            var evsPicked = events.filter(function (element, index, array) { return element.isSelect }); // Массив выделенных событий

            if (evsPicked.length < 2) // Если выбрано только одно событие, вернуть его время
                return { time: evsPicked[0].time };
            else
            {
                for (var i = 0; i < evsPicked.length - 1; i++) // Если выбрано несколько, проверить их время на совпадение
                {
                    if (evsPicked[i].time != evsPicked[i + 1].time) 
                        return { time: '-----' };
                    
                }

                return { time: evsPicked[0].time };
            }
        }
        catch (e)
        {
            return { time: '-----' };
        }

    },


    addChangeListener: (callback) => { // Методы для назначения(снятия) обработчиков событий у контролов
        store.on('change', callback);
    },

    removeChangeListener: (callback) => {
        store.off('change', callback);
    }
}) 



class TimeTable extends React.Component { // Компонент отрисовки таблицы, содержащей временные блоки

    constructor(props, context) {
        super(props, context);

        this.state = { time: '---' };

    }

    render()
    {
        
        var interTime = []; // Массив для записи значений времени

        interTime.push(this.props.borderTime01); // Помещение в массив первого значение (задано разработчиком)

        while (true) // Цикл генерации промежуточных значений
        {
            var tmp = (interTime[interTime.length - 1].hours.toString() + ':' // Приведение времени к нужному формату
                + interTime[interTime.length - 1].minutes.toLocaleString('en-US',
                    { minimumIntegerDigits: 2, useGrouping: false }));

            if (tmp == this.state.time ) 
                interTime[interTime.length - 1].view = 1;
            else
                interTime[interTime.length - 1].view = 0;

            var tmpMin = (interTime[interTime.length - 1].minutes + this.props.TimeStep) % 60; // Расчет следующего значения времени
            var tmpHour = Math.floor(interTime[interTime.length - 1].hours +
                (interTime[interTime.length - 1].minutes + this.props.TimeStep) / 60);

            var tmpTime = { hours: tmpHour, minutes: tmpMin };

            if ((tmpTime.hours > this.props.borderTime02.hours) || // Если было сгенерировано максимальное значение в заданном диапазоне
                ((tmpTime.hours == this.props.borderTime02.hours)
                && (tmpTime.minutes > 0)))
                break;

            interTime.push(tmpTime);
        }

        interTime.push(this.props.TimeStep);

        // Приведение данных к виду, удобному для отображения в таблице

        var tabs = [];

        var j = 0;

        for (var i = 0; i < interTime.length; i += 3) // Каждая строка таблицы содержит максимум 3 блока
        {
            tabs[j] = Array(interTime[i], interTime[i + 1], interTime[i + 2]);

            j++
        }

        var diffs = tabs.length*3 - interTime.length; // Отсечение лишнего

        tabs[tabs.length - 1]=tabs[tabs.length - 1].slice(0, 3 - diffs-1);

        return (
            <table style={styles.tableTime}><TimeRow data={tabs}/></table>
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

class TimeRow extends React.Component { // Компонент отрисовки отдельной строки таблицы

    render() {

        var data = this.props.data;

        var rows = data.map(function (item, _id) {
            return (<tr key={_id} style={styles.tableTimeRow}>{item.map(function (item2, id) { return (<TimeBlock key={id} data={item2} />) })}</tr>)
        });

        return (
            <tbody>{rows}</tbody>
        )
    }
}


class TimeBlock extends React.Component { // Компонент отрисовки отдельного блока времени


    render() {

        var data = this.props.data;

        var time = data.hours + ':' + data.minutes.toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        return (
            <td style={
                styles.tableTimeCell
            }>
                <div onClick={this.onTimeClick.bind(this, time)}
                    style={
                    data.view == 0 ?
                            Object.assign({}, styles.divTime, styles.divTimeCommon) :
                            Object.assign({}, styles.divTimeSplash, styles.divTimeCommon)
                    }> {time} 
                </div></td>
            )

    }

    onTimeClick(time, e) { // Выполняется при щелчке мышкой по блоку времени

        handleClick(
            {
                type: actions.TIME_CLICK_ACTION,
                value: time
            });

    }
}

class Event extends React.Component {

    render() {
        var data = this.props.data;

        var change = this.props.change;

        return (
            <tbody>
            <tr  style={
                ((change.time == data.time && change.fact == 1) || (change.time == data.time && change.fact == 0 && data.isSelect))
                    ? Object.assign({}, styles.tableEventRowSplash, styles.tableEventCommon) : Object.assign({},styles.tableEventRow, styles.tableEventCommon)
            }>
                <td style={
                    styles.tableEventCel
                }> <input type='checkbox' onChange={this.onEventChange.bind(this, data.id)} checked={data.isSelect} /> </td>
                <td style={
                    styles.tableEventCell
                } >{data.time}</td>
                <td style={
                    styles.tableEventCell
                }>{data.event}</td>
                <td onClick={this.onEventDeleteClick.bind(this, data.id)} style={
                    styles.tableEventCell
                }>x</td>
            </tr>
            </tbody>
        )

    }

    onEventChange(_id, e) { // Выполняется при изменении состояния checkbox'а'
        
            handleClick(
                {
                    type: actions.EVENT_CHANGE_ACTION,
                    value: { id: _id, state: e.target.checked }
                });
        
    }

    onEventDeleteClick(id, e) {  // Выполняется при щелчке мышью по блоку удаления события

        handleClick(
            {
                type: actions.EVENT_DELETE_ACTION,
                value:  id
            });

    }

}

class EventsList extends React.Component {  // Компонент отрисовки списка событий
    constructor(props, context) {
        super(props, context);

        this.state = { time: '', fact: 0 };

    }

    render() {

        var data = this.props.data;

        var state = this.state;

        var eventTemp = data.map(function (item, id) { return (<Event key={id} data={item} change={state} />) });

        return (
            <table style={styles.tableEvent}>{eventTemp}</table>
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


class CommonPanel extends React.Component { // Компонент отрисовки общего интерфейса
    constructor() {
        super();

        this.state = {
            showModal: false
        };

    }


    render() {
        var data = this.props.data;
        return (
            <div>
                <button onClick={this.handleOpenModal.bind(this)} style={styles.addButton}>Добавить событие</button>

                <ReactModal // Модальное окно
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
                        <button type="button" style={styles.modalButton} onClick={this.handleCloseModal.bind(this)}>Cancel</button>
                    </form>

                </ReactModal>

                <table style={
                    styles.mainTable
                }  >
                    <tbody>
                        <tr>
                            <td>
                        <EventsList data={data} />
                    </td>
                        <td>
                            <TimeTable borderTime01={{ hours: 10, minutes: 0 }}
                                borderTime02={{ hours: 22, minutes: 0 }} TimeStep={30} />
                        </td></tr></tbody></table>
            </div>
        );
    }

    handleOpenModal() { // Открытие модального окна
        this.setState({ showModal: true });
    }

    handleCloseModal() { // Закрытие модального окна
        this.setState({ showModal: false });
    }


    componentDidMount() {
        store.addChangeListener(this.updateComponentState.bind(this));
        this.handleLoad();
    }


    componentWillUnMount() {
        store.removeChangeListener(this.updateComponentState.bind(this));
    }

    updateComponentState()
    {
        var tmpState = store.getLoadError(); // Проверка ответа от сервера - пришел массив событий или сведения об ошибке

        if (tmpState.message != "")
            alert(tmpState.message);
        else
            this.setState({ showModal: false });
    }

    handleLoad() { // Сообщаем диспетчеру о необходимости загрузить информацию о событиях с сервера
        handleClick(
            {
                type: actions.EVENT_LOAD_ACTION
            });

    }

    handleSubmit(e) { // Отправка формы на сервер
        e.preventDefault();
        handleClick(
            {
                type: actions.EVENT_ADD_ACTION,
                value: { event: this.state.event, time: this.state.time }
            });
    }

    // Изменение значений полей ввода

    handleEventChange(e) { 
        this.setState({ event: e.target.value });
    }

    handleTimeChange(e) {
        this.setState({ time: e.target.value });
    }
}

class All extends React.Component { // Самый общий компонент
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