exports = module.exports = function(io) {  
    // Set socket.io listeners.
    io.on('connection', (socket) => {
      
        console.log('now listening');

        socket.on('goto other', (checkmarkcode) => {
            
           console.log(checkmarkcode);
            });
    
        socket.on('disconnect', () => {
        //console.log('user disconnected');
        });

    });
  }