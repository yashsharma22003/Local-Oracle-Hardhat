//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

interface IOracle {
    function requestData(string memory propertyId) external returns (uint256);
    function getData(uint256 requestId) external view returns (string memory);
}

contract Consumer {
    IOracle public oracle;

    constructor(address _oracle) {
        oracle = IOracle(_oracle);
    }

    function requestExternalData(string memory propertyId) public returns (uint256) {
        return oracle.requestData(propertyId);
    }

    function fetchFulfilledData(uint256 requestId) public view returns (string memory) {
        return oracle.getData(requestId);
    }
}