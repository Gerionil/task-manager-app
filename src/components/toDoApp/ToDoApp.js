import React, { useState,useEffect,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './toDoApp.scss';

import { addNewEl, deleteEl, downloadNewEl, checkEl,changeTextValue, changeSearchTextValue, switchSearchActive, changeFoundItems } from '../../redux/actions/toDoAppActions';
import TodoList from '../toDoList/ToDoList';

function TodoApp() {

  const dispatch  = useDispatch();
  const { items,text, searchText, searchActive, foundItems } = useSelector( (state) => state.toDoAppReducer);

  const inputEl = useRef(null);

  const handleChange = (e) => {
    dispatch(changeTextValue(e.target.value));
  };

  const findDuplicate = () => {
    let result = false;
    let copyItems = [...items];
    let copyText = text.replace(/\s/g, '');
    copyItems.forEach((item) => {
      if (item.title.replace(/\s/g, '') === copyText) {
        result = true;
        return;
      }
    });
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.length === 0 || findDuplicate()) {
      return;
    }
    const newItem = {
      title: text,
      id: Date.now(),
      checked: false,
    };

    dispatch(addNewEl(newItem));
    dispatch(changeTextValue(''))
  };

  const deleteItem = (id) => {
    const newItems = [...items];
    const currentId = newItems.findIndex((item) => item.id === id);
    newItems.splice(currentId, 1);
    dispatch(deleteEl(newItems));

    if(searchActive){
        dispatch(changeSearchTextValue(''))
        dispatch(switchSearchActive(false));
    }
  };

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((json) => dispatch(downloadNewEl(json.slice(1, 10))))
    },[])

    useEffect(() =>{
        inputEl.current.blur();
    },[items])

  const handleCheckBox = (id) => {
    const newItems = [...items];
    const currentId = newItems.findIndex((item) => item.id === id);
    newItems[currentId].checked = !newItems[currentId].checked;

    dispatch(checkEl(newItems))
  };


  const handleSearchChange = (e) => {
    dispatch(changeSearchTextValue(e.target.value))
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let copyItems = [...items];
    let searchTextLocal = searchText.replace(/\s/g, '');
    let foundItemsLocal = copyItems.filter((item) => {
      return item.title.replace(/\s/g, '').includes(searchTextLocal);
    });
    dispatch(changeFoundItems(foundItemsLocal));
    if (!foundItems || searchTextLocal === '') {
        dispatch(switchSearchActive(false))
    }else{
        dispatch(switchSearchActive(true));
    }
  };

  const renderToDoList = (arr) => {
    return arr.map((item) => (
      <TodoList
        key={item.id}
        item={item}
        onClick={() => deleteItem(item.id)}
        onChange={() => handleCheckBox(item.id)}
      />
    ));
  };


  return (
    

    <div>
      <form onSubmit={handleSearchSubmit}>
        <label htmlFor='search-input'>Search element</label>
        <br />
        <input
          id='search-input'
          onChange={handleSearchChange}
          value={searchText}
        />
        <button className='add-btn'> Search </button>
      </form>

      <h3>TO DO</h3>
      {!searchActive ? renderToDoList(items) : renderToDoList(foundItems)}
      <form onSubmit={handleSubmit}>
        <label htmlFor='new-todo'>What needs to be done?</label>
        <br />
        <input id='new-todo' ref = {inputEl} onChange={handleChange} value={text} />
        <br />
        <button className='add-btn'>Add #{items.length + 1}</button>
      </form>
    </div>
  );
}

export default TodoApp;
