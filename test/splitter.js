var Splitter = artifacts.require("./Splitter.sol");
var BigNumber = require('bignumber');

contract('Splitter', function(accounts) {
  it("should split Ether between Bob and Carol", function() {
  
    var add = 10000000;

    assert(web3.eth.accounts.length>=3, "not enought acccounts to test");
    assert(web3.eth.getBalance(web3.eth.accounts[0])> add, "first account does not have enought money to send 0.001 Ether");
     
    var initBalance = []
    for(i=0;i<3;i++)    
      initBalance.push(web3.eth.getBalance(web3.eth.accounts[i]));
    
    return Splitter.deployed().then(function(instance) {
       return instance.sendEther.sendTransaction(web3.eth.accounts[1], web3.eth.accounts[2], { from: web3.eth.accounts[0], value: add});
    }).then(function() {
      assert.equal(web3.eth.getBalance(web3.eth.accounts[1]).toString(), initBalance[1].plus(add/2).toString(), "Bob failed");
      assert.equal(web3.eth.getBalance(web3.eth.accounts[2]).toString(), initBalance[2].plus(add/2).toString(), "Carol failed");
    });
  });


});