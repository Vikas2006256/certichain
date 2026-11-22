const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  console.log("=================================================");
  console.log("Deploying CertificateRegistry Contract...");
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("=================================================");

  const CertificateRegistryFactory = await ethers.getContractFactory("CertificateRegistry");
  const registry = await CertificateRegistryFactory.deploy(deployer.address);
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("✔ CertificateRegistry successfully deployed to:", contractAddress);

  // Read generated artifact
  const artifactsPath = path.join(__dirname, "../artifacts/blockchain/contracts/CertificateRegistry.sol/CertificateRegistry.json");
  let artifact = { abi: [] };
  if (fs.existsSync(artifactsPath)) {
    artifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  }

  const exportData = {
    address: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    abi: artifact.abi,
  };

  const outputDir = path.join(process.cwd(), "lib/contracts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "CertificateRegistry.json"),
    JSON.stringify(exportData, null, 2)
  );

  console.log("✔ Contract ABI & deployment metadata exported to lib/contracts/CertificateRegistry.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
