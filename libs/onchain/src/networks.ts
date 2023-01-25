const infuraApiKey = process.env.INFURA_API_KEY;

const NETWORKS = {
  localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      semaphoreContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      zkGroupsContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  },
  goerli: {
      url: `https://goerli.infura.io/v3/${infuraApiKey}`,
      chainId: 5,
      semaphoreContract: '0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7',
      zkGroupsContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  },
  arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      semaphoreContract: '',
      zkGroupsContract: ''
  }
}

export function getNetworkConfig() {
    const activeNetworkName = process.env.NX_DEFAULT_NETWORK as 'localhost' | 'goerli' | 'arbitrum';
    const activeNetwork = NETWORKS[activeNetworkName];
    if (!activeNetwork) {
        throw new Error(
            "Invalid value provided for NETWORK env variable"
        )
    }

    return activeNetwork;
}

export default NETWORKS;
