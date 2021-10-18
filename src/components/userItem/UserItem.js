import React from 'react';
import { Link } from 'react-router-dom';

import { Routes, linkToRoute } from '../../utils/routes';


const UserItem = ({
    serialNumber,
    id,
    nickname,
    login,
}) => {

    
    return(
        <Link to={`${Routes.TasksRoute}/${id}`}>
            <li id={id} key={serialNumber} >
                <span className='userNumber'>{serialNumber}</span>
                <span className='userNickname'>{nickname}</span>
                <span className='userLogin'>{login}</span> 
            </li>
        </Link>
    )

}

export default UserItem;