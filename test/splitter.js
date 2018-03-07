var Splitter = artifacts.require("./Splitter.sol");
var BigNumber = require('bignumber.js')
Promise = require("bluebird");
Promise.promisifyAll(web3.eth, { suffix: "Promise" });

contract('Splitter', function(accounts) {

  var instance;

  beforeEach("Create new Splitter", ()=>   
      Splitter.new({from:accounts[0]}).then(_instance => instance = _instance)
  );

  var sendEtherFunction = function() {
  
    var value_to_add = 10000000;
    var initBalances;

    assert(accounts.length>=3, "not enought acccounts to test");
    return web3.eth.getBalancePromise(accounts[0]).then
    (
      balance =>
      {
        assert(balance> value_to_add, "Alice does not have enought money to send 10000000 Wei");   
        var balancePromises = []
        for(i=0;i<3;i++) 
          balancePromises.push(web3.eth.getBalancePromise(accounts[i]));
        return Promise.all(balancePromises);       
      }
    ).then(balances =>
       {
          initBalances = balances;
          return instance.sendEther.sendTransaction(accounts[1], accounts[2], { from: accounts[0], value: value_to_add});
       }).then(() =>
       {
          return Promise.all([instance.balances.call(accounts[0]),instance.balances.call(accounts[1]),instance.balances.call(accounts[2])]);
       }).then((balances) =>
       {
          assert.equal(balances[0], 0, "Alice balance failed");
          assert.equal(balances[1], value_to_add / 2, "Bob balance failed");
          assert.equal(balances[2], value_to_add - value_to_add / 2, "Carol balance failed");
       });
      }
  it("Alice(accounts[0]) should send Ether to contract for Bob(accounts[1]) and Carol(accounts[2])", sendEtherFunction);

  it("Bob(accounts[1]) should withdraw part of the funds", withdrawEtherFunction = function() {
  
    var value_to_withdraw = 1000000;
    var gasPrice = 1000;
    var initBalance;
    var bob = accounts[1];
    var transcation;
    var gasUsed;
    var expectedBalance;

    return web3.eth.getBalancePromise(bob).then( balance => 
    {      
      initBalance = balance;
      return sendEtherFunction();
    })
    .then(()=> instance.balances.call(bob))
    .then((balance)=> assert.equal(balance.toString(), 5000000, "initial balance of Bob in contract is wrong"))
    .then(()=> instance.withdraw.sendTransaction(value_to_withdraw, {from : bob, gasPrice : gasPrice}))
    .then((result)=> { transcation=result; return instance.balances.call(bob);})
    .then((balance)=> assert.equal(balance.toString(), 4000000, "Bobs balance in contract after withdraw"))
    .then(()=>web3.eth.getTransactionReceipt(transcation))
    .then((result)=> {return result["gasUsed"];})
    .then((result) => expectedBalance = initBalance - result * gasPrice + value_to_withdraw)
    .then(()=>web3.eth.getBalancePromise(bob))
    .then((balance)=> {      
      assert.equal(balance.toString(), expectedBalance, "actual Bobs balance is wrong after withdraw");
    });
    
  });



});


