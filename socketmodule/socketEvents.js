module.exports = (io)=>{

    io.sockets.on('connection',(socket)=>{

        socket.on('room', function(room) {
            console.log("got the code");
            socket.join(room);
        });
    });


    
}