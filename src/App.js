import React, { useState } from 'react';
import logo from './assets/stc-logo.svg';
import './App.css';
import data from './data.js'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.min.css';
import * as Icon from 'react-feather';
import Modal from 'react-modal';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

function App() {
  const [date, setDate] = useState()
  const [showModal, setModal] = useState(false)
  const header = () => (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p><code>Sunway Tech Club</code></p>
    </header>
  )

  const timeline = () => (
    <div style={{ alignItems: 'center', display: 'flex', marginTop: -31 }}>
      <VerticalTimeline layout="1-column">
        {
          data.map((item, index) => (
            <VerticalTimelineElement
              style={{ width: '95%' }}
              date={item.date}
              iconStyle={{ background: `${item.color}`, color: '#fff' }}
            >
              <h1 className="noselect" style={{ color: 'black' }}>{item.title}</h1>
              <p>{item.content}</p>
            </VerticalTimelineElement>
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
        placeholder="Title"
      />
      </p>
      <p><textarea rows="4" cols="50"
        className="contentInput"
        type="text"
        placeholder="content"
      />
      </p>
    </div>
  )

  const datepicker = () => (
    <DayPickerInput
      className="teamInput"
      style={{ marginLeft: 10 }}
      onChange={setDate}
    />
  )

  const buttons = () => (
    <div className="buttonsContainer">
      <div onClick={() => setModal(false)} className="submitButton">Submit</div>
      <div onClick={() => setModal(false)}>Back</div>
    </div>
  )

  return (
    <div className="App">
      {header()}
      {timeline()}
      {fab()}
      {modal()}
    </div>
  );
}

export default App;

