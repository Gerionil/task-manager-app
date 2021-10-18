import React from 'react';

import './toDoList.scss';

const TodoList = ({key,item,onClick,onChange}) => {

    return (
      <ul>
        <li key={key}>
          <input
            type='checkbox'
            onChange={() => onChange()}
            checked={item.checked}
          />
          {item.title}
          {item.checked && (
            <button
              className='deleteButton'
              onClick={() => onClick(item.id)}
            >
              delete
            </button>
          )}
        </li>
      </ul>
    );
  }

export default TodoList;