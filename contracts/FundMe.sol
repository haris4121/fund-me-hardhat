// SPDX-License-Identifier: MIT

// pragma solidity ^0.8.8;
// pragma solidity ^0.8.0;
pragma solidity >=0.8.0 <0.9.0;
import "./PriceConverter.sol";

contract FundMe {
    using priceConverter for uint256;

    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToFundAmount;
    AggregatorV3Interface priceFeed;

    constructor(address priceFeedAdress) {
        // we are passing network adress for accessing the data,means either robston,rinkby etc
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAdress);
    }

    function fund() public payable {
        //we want to set minimum limit of etherium send,gwei send or gwe send
        require(
            msg.value.getConvertionRate(priceFeed) >= MINIMUM_USD,
            "Didn't send enough ether"
        ); // means fund send must be greater 1e18 gwei = 1ether
        funders.push(msg.sender);
        addressToFundAmount[msg.sender] = msg.value;
    }

    function withDraw() public onlyOwner {
        // only for owner of contract
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToFundAmount[funder] = 0; //reset the amunt to 0
        }
        //reset array
        funders = new address[](0); // means assigning new array to funders and all address to 0

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "transfer failed");
    }

    modifier onlyOwner() {
        // just like macro
        require(msg.sender == i_owner, "you are not owner!");
        _;
    }

    receive() external payable {
        // if someone sends eth without call fund it will still get
        fund();
    }

    fallback() external payable {
        fund();
    }
}
