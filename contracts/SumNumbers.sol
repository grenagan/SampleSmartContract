pragma solidity ^0.5.0;

contract SumNumbers {

    uint public totalSum = 0;

    mapping(address => bool) public sumFactors;

    event numberSubmited(uint submited_number);

   function addNumbers(uint _number) public {

        require(!sumFactors[msg.sender],"Sender has already provided a number");


        sumFactors[msg.sender] = true;

         totalSum += _number;
         emit numberSubmited(totalSum);
    }

}