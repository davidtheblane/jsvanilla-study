const { PassThrough, pipeline } = require("stream");

const fs = require('fs');

const input = fs.createReadStream('input.txt');
const output = fs.createWriteStream('output.txt')

const passThrough = new PassThrough();

console.log('Starting pipeline');

pipeline(input, passThrough, output, err => {
    if(err){
        console.log('pipeline failed with error', err)
    } else {
        console.log('pipeline end successufully')
    }
})
