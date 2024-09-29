async function main() {
    const S3XY = await ethers.getContractFactory("S3XY");
    const s3xy = await S3XY.deploy();
    await s3xy.deployed();
    console.log("S3XY deployed to:", s3xy.address);
  
    const BITCH3S = await ethers.getContractFactory("BITCH3S");
    const btch = await BITCH3S.deploy();
    await btch.deployed();
    console.log("BITCH3S deployed to:", btch.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  