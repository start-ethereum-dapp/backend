// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StarkToken is ERC20, ERC20Burnable, Ownable {
    error LimitReached(string messagge);
    error AmountExceded(string message);

    uint256 public maxSupply;
    uint8 public constant limitPeerAccount = 10;

    constructor(uint256 _maxSupply) ERC20("StarkToken", "STARK") {
        maxSupply = _maxSupply;
    }

    function mint(uint256 amount) public {
        if (totalSupply() >= maxSupply) {
            revert LimitReached("The max supply was reached");
        }

        if (amount > 1) {
            revert AmountExceded("You cannot mint more than 1 token at once");
        }

        if (balanceOf(msg.sender) < limitPeerAccount) {
            _mint(msg.sender, amount);
            return;
        }
        revert LimitReached("You have reached the max of tokens owned.");
    }
}
