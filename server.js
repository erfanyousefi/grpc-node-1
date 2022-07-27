const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const echoProto = protoLoader.loadSync("echo.proto", {});
const echoDefinition = grpc.loadPackageDefinition(echoProto)
const {
    echoPackage
} = echoDefinition;
const serverURL = "localhost:5000"
const server = new grpc.Server();

function EchoUnary(call, callback) {
    console.log("Call : ", call.request);
    callback(null, {
        message: "recived"
    })
}

function EchoClientStream(call, callback) {
    const list = []
    call.on("data", data => {
        list.push(data)
        console.log("Server: ", data);
    })
    call.on("end", err => {
        console.log(list);
        console.log(err);
    })

}

function EchoServerStream(call, callback) {
    for (let index = 0; index < 10; index++) {
        call.write({
            value: index
        })
    }
    call.on("end", err => {
        console.log(err);
    })
}

function dateTime(call, callback) {
    call.on("data", data => {
        console.log("server dateTime : ", data);
        call.write({value : new Date().toLocaleString()})
    })
    call.on("end", err => {
        console.log(err);
    })
}
server.addService(echoPackage.EchoService.service, {
    EchoUnary,
    EchoClientStream,
    EchoServerStream,
    dateTime
})
server.bind(serverURL, grpc.ServerCredentials.createInsecure());
console.log("runing over localhost:5000");
server.start();