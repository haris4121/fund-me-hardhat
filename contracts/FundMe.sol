// SPDX-License-Identifier: MIT
/* using nas stling guide*/
pragma solidity ^0.8.8;
import "./PriceConverter.sol";
error FundMe__NotOwner();

/**@title A contract for crowd funding
 * @author haris rashid
 * @notice this is demo for sample funding contract
 * @dev this implements PriceConverter as library
 */

contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    AggregatorV3Interface public s_PriceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address PriceFeedAdress) {
        i_owner = msg.sender;
        s_PriceFeed = AggregatorV3Interface(PriceFeedAdress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_PriceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmount(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_PriceFeed;
    }
}
