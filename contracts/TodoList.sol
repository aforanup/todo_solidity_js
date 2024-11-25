// SPDX-License-Identifier: MIT
pragma solidity <0.8.28;

contract TodoList {
    uint public taskCount = 0;

    struct Todo {
        uint id;
        string task;
        bool isCompleted;
        bool isDeleted;
        // address currentUser;
    }

    // mapping(address => mapping(uint => Todo)) public tasks;
    mapping(uint => Todo) public tasks;

    constructor() public {
        createTodo("This is the first task");
        createTodo("This is the Second task");
        createTodo("This is the Third task");
    }

    function createTodo(string memory _task) public {
        taskCount++;
        tasks[taskCount] = Todo(taskCount, _task, false, false);
    }

    function todoComplete(uint _id) public {
        // require(tasks[_id].currentUser == msg.sender);
        tasks[_id].isCompleted = true;
    }
}
