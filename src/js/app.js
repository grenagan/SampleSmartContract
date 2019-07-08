App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
 
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
           ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    
    return App.initContract();
  },

   initContract: function() {
    $.getJSON("SumNumbers.json", function(SumNumbers) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SumNumbers = TruffleContract(SumNumbers);
      // Connect provider to interact with contract
      App.contracts.SumNumbers.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SumNumbers.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.numberSubmited({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var sumNumbersInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
   
     web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.SumNumbers.deployed().then(function(instance) {
      sumNumbersInstance = instance;
      return sumNumbersInstance.totalSum();
    }).then(function(_totalSum) {
      //var totalSum = $("#TotalSum");
      $("#TotalSum").html(_totalSum.toString());
      //totalSum.empty();

      //Render total sum
      //totalSum.innerHTML("0");
      return sumNumbersInstance.sumFactors(App.account); // read account, if already has contributed a number to the sum
    }).then(function(hasContributed) {
      // Do not allow a user to vote
      if(hasContributed) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castNumber: function() {
    var number = parseInt($('#addNumberToSum').val()); // get value from input form
    App.contracts.SumNumbers.deployed().then(function(instance) {
      return instance.addNumbers(number, { from: App.account });// call function
    }).then(function(result) { // 
      // Wait for total sum to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});