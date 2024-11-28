var TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", function(accounts) {
  var todoInstance;

  it("initializes with two candidates", function() {
    return TodoList.deployed().then(function(instance) {
      return instance.taskCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("initializes candidates with corrent values", function() {
    return TodoList.deployed().then(function(instance) {
        todoInstance = instance;
        return instance.tasks(1)
        }).then(function(task) {
            assert.equal(task[0], 1);
            assert.equal(task[1], "This is the first task");
            assert.equal(task[2], false);
            assert.equal(task[3], false);
        })
    });
  
  it("creates a new todo task", function(){
    return TodoList.deployed().then(function(instance) {
      todoInstance = instance;
      return todoInstance.createTodo("brand new task", {from: accounts[0]});;
    }).then(function(receipt) {
      return todoInstance.taskCount()
    }).then(function(count) { 
      assert.equal(count, 3);
      return todoInstance.tasks(3)
    }).then(function(task){
      assert.equal(task[0], 3);
      assert.equal(task[1], "brand new task");
    })
  });

  it("a task is completed", function(){
    return TodoList.deployed().then(function(instance){
      todoInstance = instance;
      return instance.todoComplete(1)
    }).then(function(receipt){
      return todoInstance.tasks(1)
    }).then(function(task){
      assert.equal(task[2], true);
    })
  });
    
  });