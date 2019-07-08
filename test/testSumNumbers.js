const SumNumbers = artifacts.require("./SumNumbers.sol");

contract("SumNumbers",(accounts) => {
    before(async() => {
        this.SumNumbers = await SumNumbers.deployed()
    })

    it("deploys successfully", async() => {
        const address = await this.SumNumbers.address
        //assert.notEqual(address,"0x0")
        assert.notEqual(address,"")
        assert.notEqual(address,null)
        assert.notEqual(address,undefined)
    })

    it("adds nummber", async() => {
        const sum = await this.SumNumbers.addNumbers(50)
        const totalSum = await this.SumNumbers.totalSum()
        const event = sum.logs[0].args
        assert.equal(event.submited_number.toNumber(),totalSum.toNumber())
    })
})