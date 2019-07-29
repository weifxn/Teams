import React, { useState, useEffect } from 'react';
import logo from './assets/stc-logo.svg';
import './App.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.min.css';
import * as Icon from 'react-feather';
import Modal from 'react-modal';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import firebase from './firebase'
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';

const App = () => {
  const [date, setDate] = useState()
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [showIndex, setShowIndex] = useState([])
  const [items, setItems] = useState([])
  const [isLoading, setLoading] = useState(true)

  const [showModal, setModal] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  

  const getData = () => {
    firebase
      .database()
      .ref()
      .child("stc-teams")
      .on('value', snap => {
        
        if (snap !== null) {
          const data = snap.val()
            const list = Object.keys(data).map(key => ({
              ...data[key],
              show: true,
              id: key
            }))
            setItems(list)
        }
        setLoading(false)
      })
  }

  const onSubmit = () => {
    setModal(false);
    const payload = {
      date: formatDate(date, 'LL', 'it'),
      title,
      content
    }
    setItems([payload, ...items])
    firebase
      .database()
      .ref()
      .child("stc-teams")
      .push(payload)
      .then(ref => {
      })
  }

  const toggleShow = index => {
    var temp = items
    temp[index].show = !temp[index].show
    console.log(JSON.stringify(temp))
    setItems(items)
  }

  const onDelete = index => {
    var temp = items
    temp.splice(index, 1)
    setItems(temp)
    firebase
      .database()
      .ref()
      .child("stc-teams")
      .set(items)
      .then(()=>console.log(items))

  }

  const header = () => (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p><code>Sunway Tech Club</code></p>
    </header>
  )

  const timeline = () => (
    <div style={{ alignItems: 'center', display: 'flex'}}>
      <VerticalTimeline layout="1-column">
        {
          items.sort(sortFunction).map((item, index) => (
            <div style={{marginBottom: 30}} >
              { item.show === true ? 
                <VerticalTimelineElement
                style={{ width: '95%' }}
                date={item.date}
                iconStyle={{ background: `${item.color}`, color: '#fff' }}
              >
                <h1 className="noselect" style={{ color: 'black' }}>{item.title}</h1>
                <p className="display-linebreak">{item.content}</p>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{margin: 10}} onClick={() => onDelete(index)}><Icon.Trash /></div>
                <div style={{margin: 10}} onClick={() => onDelete(index)}><Icon.Edit /></div>
                </div>
              </VerticalTimelineElement>
              :
              <VerticalTimelineElement
              style={{ width: '95%' }}
              date={item.date}
              iconStyle={{ background: `${item.color}`, color: '#fff' }}
            >
              <h1 className="noselect" style={{ color: 'black' }}>{item.title}</h1>
              <div style={{marginBottom: 30}} onClick={() => toggleShow(index)} > show more </div>
            </VerticalTimelineElement>
              }
            
            </div>
          ))
        }
      </VerticalTimeline>
    </div>
  )

  const fab = () => (
    <div onClick={() => setModal(!showModal)}
    >
      <Fab
        event="click"
        mainButtonStyles={{ backgroundColor: 'white', height: 70, width: 70 }}
        icon={<Icon.Plus color="black" />}>
      </Fab>
    </div>
  )

  const modal = () => (
    <Modal
      className="Modal"
      overlayClassName="Overlay"
      isOpen={showModal}
    >
      {modalInput()}
      {buttons()}
    </Modal>
  )

  const modalInput = () => (
    <div>
      <h2 style={{ marginLeft: 10 }}>Add Team</h2>
      {datepicker()}
      <p><input
        className="titleInput"
        type="text"
        value={title}
        placeholder="Title"
        onChange={e => setTitle(e.target.value)} />
      </p>
      <p><textarea rows="4" cols="50"
        className="contentInput"
        type="text"
        value={content}
        placeholder="content"
        onChange={e => setContent(e.target.value)} />
      </p>
    </div>
  )

  const datepicker = () => (
    <DayPickerInput
      className="teamInput"
      formatDate={formatDate}
        parseDate={parseDate}
        format="LL"
        placeholder={`${formatDate(new Date(), 'LL', 'it')}`}
        dayPickerProps={{
          locale: 'it',
          localeUtils: MomentLocaleUtils,
        }}
      style={{ marginLeft: 10 }}
      onDayChange={day => setDate(day)} />
  )

  const buttons = () => (
    <div className="buttonsContainer">
      <div onClick={() => onSubmit()} className="submitButton">Submit</div>
      <div onClick={() => setModal(false)}>Back</div>
    </div>
  )

  return (
    <div className="App">
      {!isLoading ?
        <> 
        {header()}
        {timeline()}
        {fab()}
        {modal()}
        </>
      :
        <div />
    }
      
    </div>
  );
}

export default App;

function sortFunction(a,b){  
  var dateA = new Date(a.date).getTime();
  var dateB = new Date(b.date).getTime();
  return dateA > dateB ? 1 : -1;  
}; 