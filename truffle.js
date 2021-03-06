module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 500000, // We know this is enough for this project, not necessarily your future projects
      network_id: "*" // Match any network id
    }
  }
};
