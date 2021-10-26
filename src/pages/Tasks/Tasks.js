import React, { useState, useEffect } from 'react';
import {  useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';


import "./Tasks.scss";

import { Routes, linkToRoute } from '../../utils/routes';
import { tasksApi } from '../../api/tasksApi';
import { TaskItem } from '../../components';
import { deleteCookie } from "../../utils/cookie";


const Tasks = () => {

	const { token, role } = useSelector( state => state.authReducer );


	const [tasks, setTasks] = useState([])
	const [inputValue, setInputValue] = useState('');
	const [showAddBlock, setShowAddBlock] = useState(false)
	const [taskError, setTaskError] = useState({
		createTaskError: ''
	})

	// const [tasksCount, setTasksCount] = useState()
	// const [tasksCountForAdmin, setTasksCountForAdmin] = useState()
	// const [pageNumber, setPageNumber] = useState(0)

	const { createTaskError } = taskError;
	const { id } = useParams()
	const history = useHistory()

	


	useEffect(() => {
		const { exp } = jwt.decode(token)
		const expirationTime = (exp * 1000) - 60000
		if (Date.now() >= expirationTime) {
			linkToRoute(history, Routes.SignInRoute);
			deleteCookie('authorization');
		}else{
			if(role==='admin'){
				getTasksForAdmin()
			}else{
				getTasks() 
			}
		}
		
		
	}, [])

	const handleChangeInputValue = (event) =>{
		setInputValue(event.target.value);
		const taskErrorCopy = {...taskError};
		taskErrorCopy.createTaskError = '';
		setTaskError(taskErrorCopy);
	}

	const handleCreate = (event) =>{
		event.preventDefault();
		setShowAddBlock(true);
	}

	const handleHideAddBlock = () => {
		setShowAddBlock(false);
		const taskErrorCopy = {...taskError};
		taskErrorCopy.createTaskError = '';
		setTaskError(taskErrorCopy);
		setInputValue('')
	}

	const handleAddNewTask = async (event) => {
		const taskErrorCopy = {...taskError};
		try {
			event.preventDefault();
			const tasksCopy = [...tasks]
			if (inputValue.length === 0 ) {
				return;
			}
			// setInputValue(inputValue.trim());

			const newTask = {
				name: inputValue.trim(),
				userId: id,
			};

			const res = await tasksApi.createTask(newTask,token)

			if(res.status === 201 ){
				console.log('res', res);
				tasksCopy.push(res.data);
				setTasks(tasksCopy);
				setInputValue('');
				setShowAddBlock(false);
				taskErrorCopy.createTaskError = '';
				setTaskError(taskErrorCopy);
			}
	}catch (error) {
		const errorMessage = error.response.data.message
		if( errorMessage === 'Task with such name already exists for user'){
			taskErrorCopy.createTaskError = 'alreadyExists';
			console.log('taskErrorCopy', taskErrorCopy)
			setTaskError(taskErrorCopy);
		}else if(errorMessage === '\"name\" length must be at least 4 characters long'){ 
			taskErrorCopy.createTaskError = 'notValid';
			setTaskError(taskErrorCopy);
		}else {
			linkToRoute(history, Routes.SignInRoute)
		}
	}
}

	const getTasks = () => {
		tasksApi.getTasks(token)
			.then((res) => {
				console.log(res)
				setTasks(res.data)
			})

			.catch (error => {
				console.log('error.message', error.message);
			}) 
	}


	
	const getTasksForAdmin = () => {
		console.log('userId', id)
		tasksApi.getTasksForAdmin(token, id)
			.then((res) => {
				console.log(res)
				setTasks(res.data)
			})

			.catch (error => {
				console.log('error.message', error.message);
			}) 
	}

	const deleteItem = async (id) => {
		
		try{
			const tasksCopy = [...tasks];
			const currentId = tasksCopy.findIndex((item) => item._id === id);
			const res = await tasksApi.deleteTask( tasksCopy[currentId]._id, tasksCopy[currentId].userId, token );
			console.log('deleteRes', res.status)
			if(res.status === 204){
				tasksCopy.splice(currentId,1);
				setTasks(tasksCopy);
			}else{ 
				linkToRoute(history, Routes.SignInRoute)
			}
			

		} catch (error) {
			console.log('delete task error', error.response.data.message);
			const errorMessage = error.response.data.message;
			if (errorMessage === 'No task found'){
				console.log('Task not found')
			}else {
				linkToRoute(history, Routes.SignInRoute)
			}
			
		}
	}

	const handleChangeTaskName = async (newName, id) => {
		try{
			const tasksCopy = [...tasks]
			const currentId = tasksCopy.findIndex((item) => item._id === id);
			console.log(tasksCopy[currentId])
			tasksCopy[currentId].name = newName;
			const res = await tasksApi.changeTask( {'id':tasks[currentId]._id, 'userId': tasks[currentId].userId, 'name': tasksCopy[currentId].name}, token)
			if(res.status === 200){
				setTasks(tasksCopy);
			}
			else{
				return
			}
		}catch (error){
			const errorMessage = error.response.data.message
			if( errorMessage === 'Task with such name already exists for user'){
				// taskErrorCopy.createTaskError = 'alreadyExists';
				console.log('taskErrorCopy')
				return
			}else{
				console.log('change task name error', error.response.data.message)

				return
			}
			// console.log('change task name error', error.response.data.message)
			// linkToRoute(history, Routes.SignInRoute)
		}
		

	}

	const handleCheckBox = async (id) => {
		try{
			const tasksCopy = [...tasks];
			const currentId = tasksCopy.findIndex((item) => item._id === id);
			tasksCopy[currentId].checked = !tasksCopy[currentId].checked;
			
			const res = await tasksApi.changeTask( {'id':tasksCopy[currentId]._id, 'userId': tasksCopy[currentId].userId, 'checked': tasksCopy[currentId].checked}, token)
			
			if(res.status === 200){
				setTasks(tasksCopy);
			}
			
			
		} catch (error){
			console.log('change task check error', error.response.data.message)
			linkToRoute(history, Routes.SignInRoute)

		}
		
	}

	const renderTasks = (arr) => {
		let result;
		result = arr.map((item, index) => (
			<TaskItem
				serialNumber={index + 1}
				value={item.name}
				taskId={item._id}
				onChange={() => handleCheckBox(item._id)}
				checked={item.checked}
				onClick={() => deleteItem(item._id)}
				handleChangeTaskName={handleChangeTaskName}
			/>
		));

		return result;
	}

	return (
		<>
		<section className='taskBoard'>
			<div className='container'>
				<div className='taskBoard-wrapper'>

					<div className='taskBoard-wrapper-sorting'>

						<div className='taskBoard-wrapper-sorting-icon'>
							<img src='/img/tasks_icon.svg' alt='tasks'/>
						</div>

						<div className='taskBoard-wrapper-sorting-block'>

							<form className='taskBoard-wrapper-sorting-block-item search' onSubmit>
								<input
								className='taskBoard-wrapper-sorting-block-item search-input'
								id='search-input'
								onChange=''
								value=''
								placeholder='Search'
								/>
								<button className='taskBoard-wrapper-sorting-block-item search-button'>Search</button>
							</form>

							<button className='taskBoard-wrapper-sorting-block-item button byName' type='button'>by name </button>
							<button className='taskBoard-wrapper-sorting-block-item button byStatus' type='button'>by status </button>
						</div>

					</div>
					{role ==='admin'
					&&
					<div className='taskBoard-wrapper-addNew'>
						{!showAddBlock 
						&&
						<button className='taskBoard-wrapper-addNew-button addNew' 
						type='button'
						onClick={handleCreate}
						>+ Add new task</button>
						}
						{showAddBlock 
						&&
						<div className='taskBoard-wrapper-addNew-block'>

							<input className='taskBoard-wrapper-addNew-block-item input' type='text' placeholder='Task value'
							onChange={handleChangeInputValue}
							value={inputValue}
							/>

							<div>
							<button className='taskBoard-wrapper-addNew-block-item button cancel' type='button' onClick={handleHideAddBlock}>cancel</button>
							<button className='taskBoard-wrapper-addNew-block-item  button add' type='button' onClick={handleAddNewTask}>add</button>
							</div>

						</div>
							
						
						}
						{createTaskError === 'alreadyExists' && (<span className='taskBoard-error'> Task already exists</span>)}
						{createTaskError === 'notValid' && (<span className='taskBoard-error'> At least 4 characters are required</span>)}
					</div>
					}

					<div className='taskBoard-wrapper-tasks'>
						<ul className='taskBoard-wrapper-tasks-list'>{tasks && tasks.length > 0 && renderTasks(tasks) }</ul>
					</div>
					{/* <div>
						<button onClick={() => showMoreTasks()}>Show more</button>
					</div> */}
				</div>
			</div>
		</section>
		</>
	)
};

export default Tasks;
