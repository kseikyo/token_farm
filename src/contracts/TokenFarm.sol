pragma solidity >=0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "DApp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakeholders;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint256 _amount) public {
        /**
            public function stakeTokens
            it transfer the dai tokens from the sender the token farm
            adding it to the stakholders array

            params:
                uint _amount: The amount of dai token the sender wants to stake

         */
        // Raise an exception with the second param as message
        // if first param is falsey
        require(_amount > 0, "amount cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add users to stakeholders array if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakeholders.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        // Issuing tokens (earn interest)

        // Make sure the owner of the token farm is the only one who can issue
        // tokens to others
        require(msg.sender == owner, "caller must be the owner");

        uint256 length = stakeholders.length;
        for (uint256 i = 0; i < length; i++) {
            // Find how much they have staked and issue the same amount with DApp token
            address recipient = stakeholders[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];
        
        // Require a balance greater than 0
        require(balance > 0, "staking balance cannot be 0");

        //Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }
}
