import React from "react";

function UserList({users}) {
  return (
    <>
      <div className="bg-darkChat p-5 rounded-lg h-50">
        <span className="text-xs font-thin text-primaryGrey">Users</span>
        {users.map((user, index) => (
          <li key={index} className="ml-2 text-white">
            {user.username.toUpperCase()}
            <span className="hello"></span>
          </li>
        ))}
      </div>
    </>
  );
}

export default UserList;
