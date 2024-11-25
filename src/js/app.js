App = {
  web3Provider: null,
  contracts: {},
  accounts: "0x0",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: () => {
    $.getJSON("TodoList.json", (todolist) => {
      App.contracts.TodoList = TruffleContract(todolist);
      App.contracts.TodoList.setProvider(App.web3Provider);

      return App.render();
    });
  },

  createTask: function(){
    var task = $("#task").val();
    console.log(task)
    App.contracts.TodoList.deployed().then(function(instance){
      return instance.createTodo(task, {from: App.account});
    }).then(function(result){
      loading.show();
      loaded.hide();
    })
  },
  completed: function(id){
    console.log("Completed", id);
    var taskComplete = $("#task_"+id);
    taskComplete.css("text-decoration", "line-through");
    App.contracts.TodoList.deployed().then(function(instance){
      console.log("inside");
      console.log(typeof(id));
      return instance.todoComplete(id, {from: App.account});
    }).then(function(result){
      console.log("Completed");
    }).catch(function(error){
      console.log("something went wrong")
      console.log(error)
    })
  },

  connectWallet: async function(){
    window.ethereum.request({ method: 'eth_requestAccounts' });
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  render: function(){
    var todoInstance;
    var loading = $("#loading");
    var loaded = $("#loaded")

    loading.show();
    loaded.hide();

    // loading contract data
    App.contracts.TodoList.deployed().then((instance)=>{
      todoInstance=instance;
      return todoInstance.taskCount();
    }).then((taskCount)=>{
      var taskList= $("#listItems");
      taskList.empty();
      
      for (var i=1; i<=taskCount; i++){
        todoInstance.tasks(i).then((task)=>{
          if(task[2]){
            taskList.append(`<li class="list-group-item border-0" id="task_${task[0]}" onclick="App.completed(${task[0]})" style="text-decoration:line-through">${task[1]}</li>`)
          }
          else{
            taskList.append(`<li class="list-group-item border-0" id="task_${task[0]}" onclick="App.completed(${task[0]})">${task[1]}</li>`)
          }
        })
      }

      })
    
    loading.hide();
    loaded.show();
  }
  

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
