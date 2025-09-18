import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  "event ProductRegistered(string indexed productId, address indexed farmer, uint256 timestamp)",
  "event OwnershipTransferred(string indexed productId, address indexed from, address indexed to, uint256 timestamp)",
  "event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount)",
  "event EscrowReleased(uint256 indexed escrowId, address indexed to, uint256 amount)",
  "event PaymentMade(string indexed orderId, address indexed from, address indexed to, uint256 amount)",
  
  "function registerProduct(string memory _productId, string memory _name, string memory _batchId, uint256 _harvestDate) external",
  "function transferOwnership(string memory _productId, address _newOwner) external",
  "function createEscrow(address _seller, string memory _productId) external payable",
  "function releaseEscrow(uint256 _escrowId) external",
  "function createSmartContract(string memory _productId, address _seller, string memory _terms) external payable",
  "function completeContract(uint256 _contractId) external",
  "function makePayment(address _to, string memory _orderId) external payable",
  "function getProduct(string memory _productId) external view returns (tuple(string productId, string name, string batchId, address farmer, address currentOwner, uint256 harvestDate, uint256 registrationDate, bool exists))",
  "function getEscrow(uint256 _escrowId) external view returns (tuple(uint256 escrowId, address buyer, address seller, uint256 amount, string productId, bool released, bool exists, uint256 createdAt))",
  "function getSmartContract(uint256 _contractId) external view returns (tuple(uint256 contractId, string productId, address buyer, address seller, uint256 amount, string terms, uint8 status, uint256 escrowId, uint256 createdAt))",
  "function getContractBalance() external view returns (uint256)"
];

// Sepolia testnet contract address (deploy using Remix IDE)
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D0C9C0C0C0C0C0C0"; // Replace with actual deployed address

export interface EthereumTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  timestamp?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  connected: boolean;
}

class EthereumService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected = false;

  /**
   * Initialize connection to MetaMask and Ethereum network
   */
  async initialize(): Promise<boolean> {
    try {
      const ethereumProvider = await detectEthereumProvider();
      
      if (!ethereumProvider) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check if we're on Sepolia testnet
      const network = await this.provider.getNetwork();
      if (network.chainId !== 11155111n) { // Sepolia chain ID
        await this.switchToSepolia();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize Ethereum service:', error);
      throw error;
    }
  }

  /**
   * Switch to Sepolia testnet
   */
  async switchToSepolia(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'SepoliaETH',
              symbol: 'SEP',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/']
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<WalletInfo> {
    try {
      if (!this.provider) {
        await this.initialize();
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.signer = await this.provider!.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      
      const address = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      const network = await this.provider!.getNetwork();
      
      this.isConnected = true;

      return {
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        connected: true
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Get current wallet information
   */
  async getWalletInfo(): Promise<WalletInfo | null> {
    try {
      if (!this.isConnected || !this.signer) {
        return null;
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      const network = await this.provider!.getNetwork();

      return {
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        connected: true
      };
    } catch (error) {
      console.error('Failed to get wallet info:', error);
      return null;
    }
  }

  /**
   * Register a new product on the blockchain
   */
  async registerProduct(productId: string, name: string, batchId: string, harvestDate: number): Promise<EthereumTransaction> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.registerProduct(productId, name, batchId, harvestDate);
      
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value || 0),
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to register product:', error);
      throw error;
    }
  }

  /**
   * Create an escrow for product purchase
   */
  async createEscrow(seller: string, productId: string, amount: string): Promise<EthereumTransaction> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.createEscrow(seller, productId, {
        value: ethers.parseEther(amount)
      });

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: amount,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to create escrow:', error);
      throw error;
    }
  }

  /**
   * Release escrow funds
   */
  async releaseEscrow(escrowId: number): Promise<EthereumTransaction> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.releaseEscrow(escrowId);

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: '0',
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to release escrow:', error);
      throw error;
    }
  }

  /**
   * Create a smart contract
   */
  async createSmartContract(productId: string, seller: string, terms: string, amount: string): Promise<EthereumTransaction> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.createSmartContract(productId, seller, terms, {
        value: ethers.parseEther(amount)
      });

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: amount,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to create smart contract:', error);
      throw error;
    }
  }

  /**
   * Make a payment
   */
  async makePayment(to: string, orderId: string, amount: string): Promise<EthereumTransaction> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.makePayment(to, orderId, {
        value: ethers.parseEther(amount)
      });

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: amount,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to make payment:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      throw error;
    }
  }

  /**
   * Get product details from blockchain
   */
  async getProduct(productId: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      return await this.contract.getProduct(productId);
    } catch (error) {
      console.error('Failed to get product:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const ethereumService = new EthereumService();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}