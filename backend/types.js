const zod = require("zod");

const inputSearch = zod.object({
    input : zod.string()
})

module.exports ={
    inputSearch : inputSearch
}