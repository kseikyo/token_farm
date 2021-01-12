import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";

export const fetchBlockchainData = async (
  setAccount,
  setDaiToken,
  setDappToken,
  setTokenFarm,
  setDaiTokenBalance,
  setDappTokenBalance,
  setStakingBalance
) => {
  /**
   * Get blockchain data
   *
   * Params:
   *  setAccount: setAccount state hook
   *  setDaiToken: setDaiToken state hook
   *  setDappToken: setDappToken state hook
   *  setTokenFarm: setTokenFarm state hook
   *  setDaiTokenBalance: setDaiTokenBalance state hook
   *  setDappTokenBalance: setDappTokenBalance state hook
   *  setStakingBalance: setStakingBalance state hook
   *
   * Variables:
   *  account: Current logged account
   *  daiToken: DaiToken web3 object
   *  daiTokenBalance: Amount of dai Token the account has
   *  dappToken: DappToken web3 object
   *  dappTokenBalance: Amount of dapp Token the account has
   *
   */
  const web3 = window.web3;

  const accounts = await web3.eth.getAccounts();

  let account = accounts[0];
  setAccount(account);
  const networkId = await web3.eth.net.getId();

  // Load DaiToken
  const daiTokenData = DaiToken.networks[networkId];
  if (daiTokenData) {
    const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
    setDaiToken(daiToken);
    const daiTokenBalance = await daiToken.methods.balanceOf(account).call();
    setDaiTokenBalance(daiTokenBalance.toString());
  } else {
    window.alert("DaiToken contract not deployed to detected network.");
  }

  //Load DappToken
  const dappTokenData = DappToken.networks[networkId];
  if (dappTokenData) {
    const dappToken = new web3.eth.Contract(
      DappToken.abi,
      dappTokenData.address
    );
    setDappToken(dappToken);
    const dappTokenBalance = await dappToken.methods.balanceOf(account).call();
    setDappTokenBalance(dappTokenBalance.toString());
  } else {
    window.alert("DappToken contract not deployed to detected network.");
  }

  //Load DappToken
  const tokenFarmData = TokenFarm.networks[networkId];
  if (tokenFarmData) {
    const tokenFarm = new web3.eth.Contract(
      TokenFarm.abi,
      tokenFarmData.address
    );
    setTokenFarm(tokenFarm);
    const stakingBalance = await tokenFarm.methods.stakingBalance(account).call();
    setStakingBalance(stakingBalance.toString());
  } else {
    window.alert("DappToken contract not deployed to detected network.");
  }
};
