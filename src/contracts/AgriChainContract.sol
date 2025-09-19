// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FarmLegder Smart Contract
 * @dev Manages agricultural supply chain with escrow functionality
 * @author FarmLegder Team
 */
contract AgriChainContract {
    // Events
    event ProductRegistered(string indexed productId, address indexed farmer, uint256 timestamp);
    event OwnershipTransferred(string indexed productId, address indexed from, address indexed to, uint256 timestamp);
    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId, address indexed to, uint256 amount);
    event PaymentMade(string indexed orderId, address indexed from, address indexed to, uint256 amount);

    // Structs
    struct Product {
        string productId;
        string name;
        string batchId;
        address farmer;
        address currentOwner;
        uint256 harvestDate;
        uint256 registrationDate;
        bool exists;
    }

    struct Escrow {
        uint256 escrowId;
        address buyer;
        address seller;
        uint256 amount;
        string productId;
        bool released;
        bool exists;
        uint256 createdAt;
    }

    struct SmartContract {
        uint256 contractId;
        string productId;
        address buyer;
        address seller;
        uint256 amount;
        string terms;
        uint8 status; // 0: pending, 1: active, 2: completed, 3: cancelled
        uint256 escrowId;
        uint256 createdAt;
    }

    // State variables
    mapping(string => Product) public products;
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => SmartContract) public contracts;
    mapping(address => uint256) public balances;
    
    uint256 public nextEscrowId = 1;
    uint256 public nextContractId = 1;
    
    address public owner;
    uint256 public constant PLATFORM_FEE = 25; // 0.25% in basis points

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier productExists(string memory _productId) {
        require(products[_productId].exists, "Product does not exist");
        _;
    }

    modifier onlyProductOwner(string memory _productId) {
        require(products[_productId].currentOwner == msg.sender, "Not the product owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new agricultural product
     * @param _productId Unique product identifier
     * @param _name Product name
     * @param _batchId Batch identifier
     * @param _harvestDate Harvest timestamp
     */
    function registerProduct(
        string memory _productId,
        string memory _name,
        string memory _batchId,
        uint256 _harvestDate
    ) external {
        require(!products[_productId].exists, "Product already exists");
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        require(bytes(_name).length > 0, "Product name cannot be empty");

        products[_productId] = Product({
            productId: _productId,
            name: _name,
            batchId: _batchId,
            farmer: msg.sender,
            currentOwner: msg.sender,
            harvestDate: _harvestDate,
            registrationDate: block.timestamp,
            exists: true
        });

        emit ProductRegistered(_productId, msg.sender, block.timestamp);
    }

    /**
     * @dev Transfer ownership of a product
     * @param _productId Product to transfer
     * @param _newOwner New owner address
     */
    function transferOwnership(string memory _productId, address _newOwner) 
        external 
        productExists(_productId) 
        onlyProductOwner(_productId) 
    {
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");

        address previousOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;

        emit OwnershipTransferred(_productId, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Create an escrow for a product purchase
     * @param _seller Seller address
     * @param _productId Product being purchased
     */
    function createEscrow(address _seller, string memory _productId) 
        external 
        payable 
        productExists(_productId) 
    {
        require(msg.value > 0, "Escrow amount must be greater than 0");
        require(_seller != msg.sender, "Cannot create escrow with yourself");
        require(products[_productId].currentOwner == _seller, "Seller is not the product owner");

        uint256 escrowId = nextEscrowId++;
        
        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            productId: _productId,
            released: false,
            exists: true,
            createdAt: block.timestamp
        });

        emit EscrowCreated(escrowId, msg.sender, _seller, msg.value);
    }

    /**
     * @dev Release escrow funds to seller
     * @param _escrowId Escrow to release
     */
    function releaseEscrow(uint256 _escrowId) external {
        require(escrows[_escrowId].exists, "Escrow does not exist");
        require(!escrows[_escrowId].released, "Escrow already released");
        require(
            msg.sender == escrows[_escrowId].buyer || msg.sender == owner,
            "Only buyer or owner can release escrow"
        );

        Escrow storage escrow = escrows[_escrowId];
        escrow.released = true;

        // Calculate platform fee
        uint256 platformFee = (escrow.amount * PLATFORM_FEE) / 10000;
        uint256 sellerAmount = escrow.amount - platformFee;

        // Transfer funds
        payable(escrow.seller).transfer(sellerAmount);
        if (platformFee > 0) {
            payable(owner).transfer(platformFee);
        }

        // Transfer product ownership
        products[escrow.productId].currentOwner = escrow.buyer;

        emit EscrowReleased(_escrowId, escrow.seller, sellerAmount);
        emit OwnershipTransferred(escrow.productId, escrow.seller, escrow.buyer, block.timestamp);
    }

    /**
     * @dev Create a smart contract for product purchase
     * @param _productId Product being purchased
     * @param _seller Seller address
     * @param _terms Contract terms
     */
    function createSmartContract(
        string memory _productId,
        address _seller,
        string memory _terms
    ) external payable productExists(_productId) {
        require(msg.value > 0, "Contract amount must be greater than 0");
        require(_seller != msg.sender, "Cannot create contract with yourself");
        require(products[_productId].currentOwner == _seller, "Seller is not the product owner");

        uint256 contractId = nextContractId++;
        
        // Create escrow for this contract
        uint256 escrowId = nextEscrowId++;
        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            productId: _productId,
            released: false,
            exists: true,
            createdAt: block.timestamp
        });

        contracts[contractId] = SmartContract({
            contractId: contractId,
            productId: _productId,
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            terms: _terms,
            status: 1, // active
            escrowId: escrowId,
            createdAt: block.timestamp
        });

        emit EscrowCreated(escrowId, msg.sender, _seller, msg.value);
    }

    /**
     * @dev Complete a smart contract by releasing escrow
     * @param _contractId Contract to complete
     */
    function completeContract(uint256 _contractId) external {
        require(contracts[_contractId].buyer != address(0), "Contract does not exist");
        require(contracts[_contractId].status == 1, "Contract is not active");
        require(
            msg.sender == contracts[_contractId].buyer || msg.sender == owner,
            "Only buyer or owner can complete contract"
        );

        contracts[_contractId].status = 2; // completed
        releaseEscrow(contracts[_contractId].escrowId);
    }

    /**
     * @dev Make a direct payment
     * @param _to Recipient address
     * @param _orderId Order identifier
     */
    function makePayment(address _to, string memory _orderId) external payable {
        require(_to != address(0), "Invalid recipient address");
        require(msg.value > 0, "Payment amount must be greater than 0");

        uint256 platformFee = (msg.value * PLATFORM_FEE) / 10000;
        uint256 recipientAmount = msg.value - platformFee;

        payable(_to).transfer(recipientAmount);
        if (platformFee > 0) {
            payable(owner).transfer(platformFee);
        }

        emit PaymentMade(_orderId, msg.sender, _to, recipientAmount);
    }

    /**
     * @dev Get product details
     * @param _productId Product identifier
     */
    function getProduct(string memory _productId) external view returns (Product memory) {
        require(products[_productId].exists, "Product does not exist");
        return products[_productId];
    }

    /**
     * @dev Get escrow details
     * @param _escrowId Escrow identifier
     */
    function getEscrow(uint256 _escrowId) external view returns (Escrow memory) {
        require(escrows[_escrowId].exists, "Escrow does not exist");
        return escrows[_escrowId];
    }

    /**
     * @dev Get smart contract details
     * @param _contractId Contract identifier
     */
    function getSmartContract(uint256 _contractId) external view returns (SmartContract memory) {
        require(contracts[_contractId].buyer != address(0), "Contract does not exist");
        return contracts[_contractId];
    }

    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}