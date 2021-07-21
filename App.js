import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 100, newValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleClick = this.handleClick.bind(this);

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && "0xa4a06A026fF59E0d589A34b3da0E3B42DD0bEaD2",
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };


  handleClick = async () => {
    const { contract } = this.state;
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response });
    console.log("Successfull-get-request");
  }

  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const { accounts, contract } = this.state;
      await contract.methods.set(this.state.newValue).send({ from: accounts[0] });
      console.log("Successfull-set-request")
    } catch {
      console.log("Something undesired happened with connection")
    }
  }

  handleChange = async (event) => {
    this.setState({ newValue: event.target.value })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">

        <h1>Dash Sina chakerim soli</h1>
        <button onClick={this.handleClick} >Get number </button>
        
        <form onSubmit={this.handleSubmit} >
          <input onChange={this.handleChange} type="int"></input>
          <input type="submit"/>
        </form>
         
        <div>Your last accepted number is => {this.state.storageValue}</div>

      </div>
    );
  }
}

export default App;
