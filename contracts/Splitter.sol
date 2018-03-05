pragma solidity ^0.4.18;


contract Splitter {

	address owner;

	function Splitter() public {
		owner = msg.sender;
	}	

	function sendEther(address bob, address carol) public payable {

		if (!carol.send(msg.value / 2))
		 revert();
		//Bob receives more ether if value is odd
		if (!bob.send(msg.value - msg.value / 2)) 
		 revert();
	}

	function kill() public {
		assert(msg.sender == owner);
		selfdestruct(owner);
	}

}
