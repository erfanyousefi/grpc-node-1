const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const echoProto = protoLoader.loadSync("echo.proto", {});
const echoDefinition = grpc.loadPackageDefinition(echoProto);
const {echoPackage} = echoDefinition;
const serverURL = "localhost:5000";
const client = new echoPackage.EchoService(serverURL, grpc.credentials.createInsecure());
const echoData = {
    value : "my echo value for test"
}
client.EchoUnary(echoData, (err, response) => {
    if(err) return console.log("Error : ", err.message);
    console.log("response : ", response);
})

const serverStream = client.EchoServerStream();

setTimeout(() => {
    serverStream.on("data", (data) => {
        console.log(data);
    })
}, 300)

serverStream.on("end", (error) => {
    console.log("Error: ", error);
})
const echos = [
    {value : "value1"},
    {value : "value2"},
    {value : "value3"},
    {value : "value4"},
]
const clientStream = client.EchoClientStream(null, (err, res) => {
    console.log(res);
});
let index = 0
setInterval(function () {
    clientStream.write(echos[index])
    index++
    if(index == echos.length) {
        clientStream.end()
        clearInterval(this)
    }
    
}, 300)


const dateTime = client.dateTime();
setInterval(() => {
    dateTime.write({value : new Date().toLocaleString()})
}, 1000);
dateTime.on("data", data => {
    console.log("Client DateTime: ", data);
})