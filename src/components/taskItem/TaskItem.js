import React, { useState } from 'react';
import {  useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';



const TaskItem = ({
    serialNumber,
    taskId,
    value,
    checked,
    onChange,
    onClick,
    handleChangeTaskName
}) => {


    const { role } = useSelector( state => state.authReducer );
    const { id } = useParams()

    const [changeActive, setChangeActive] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const showChangeTaskNameInput =(e) =>{
        e.preventDefault();
        setChangeActive(true)
    }

    const hideChangeTaskNameInput = (e) => {
        e.preventDefault();
        setChangeActive(false)
        setInputValue(value)
    }
    const handleChangeInputValue = (e) => {
        setInputValue(e.target.value)
    }

    const handleChangeTaskNameValue = (e) => {
        e.preventDefault();
        handleChangeTaskName(inputValue.trim(), taskId);
        setChangeActive(false);
    }
    return(

        <li id={taskId} key={serialNumber}>
            <span className='taskNumber'>{serialNumber}</span>
            {changeActive && (
                <form className='taskChangeForm'>
                    <input type='text' value={inputValue} onChange={handleChangeInputValue} autoFocus/>
                    <div>
                        <button className='cancelBtn' onClick={hideChangeTaskNameInput}>cancel</button>
                        <button className='saveBtn' onClick={handleChangeTaskNameValue}>save</button>
                    </div>
                </form>
            )}
            <span className='taskValue'>{value}</span> 
            <span className='taskChange'> 
                <button className='taskChange-button' onClick={showChangeTaskNameInput}>
                    <img src='/img/edit_icon.svg' alt='edit'/>
                </button> 
            </span>
            <span className='taskStatus'><input
            type='checkbox'
            checked={checked}
            onChange={() => onChange()}/>
            </span>
            { (checked && role === 'admin') && (
                <button 
                className='deleteTask'
                onClick={() => onClick()}
                >delete</button>
            )}
        </li>
    )

}

export default TaskItem;