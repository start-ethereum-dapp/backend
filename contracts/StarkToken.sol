// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StarkToken is ERC20, ERC20Burnable, Ownable {
    error LimitReached(string messagge);

    constructor(uint256 initialSupply) ERC20("StarkToken", "STARK") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public payable {
        uint256 balanceBefore = balanceOf(to);
        require(
            msg.value == 500000000000000 * amount,
            "You need to send 0.0005 ETH (500000000000000 Wei) to mint each Stark Token."
        );
        if (balanceBefore >= 10) {
            revert LimitReached("You have reached the max of tokens owned.");
        }
        _mint(to, amount);
    }
}
