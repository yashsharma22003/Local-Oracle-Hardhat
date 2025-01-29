//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

contract IOracle {

    event DataRequested(uint256 requestId, string propertyId);
    event DataFulfilled(uint256 requestId, string data);

    struct Request {
        address from;
        string propertyId;
        string data;
    }

    uint256 requestId = 0;
    mapping (uint256 => Request) public requests;

    function requestData(string memory propertyId) public returns (uint256) {
        requestId++;
        requests[requestId] = Request(msg.sender, propertyId, "");
        emit DataRequested(requestId, propertyId);
        return requestId;
    }

    function fulfillData(uint256 _id, string memory _response) public {
        require(_id > 0 && _id <= requestId, "Invalid reqest ID");
        Request storage request = requests[_id];
        require(bytes(request.data).length == 0, "Data already fulfilled");

        request.data = _response;
        emit DataFulfilled(_id, _response);

    }

    function getData(uint256 _id) public view returns (string memory) {
        require(_id > 0 && _id <= requestId, "Invalid request ID");
        return requests[_id].data;
    }

}