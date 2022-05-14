# Online Real-Time Gaming Excercise
A basic proof-of-concept for online browser-based games. Created as an excuse to learn more about real-time networking :)<br/>
Just hop online and have someone else do the same, and you should be able to run around together in a currently uninteresting room.<br/>
Available at https://micky-game.herokuapp.com/<br/>
## How It Works
Each client connects to an external server via socket.io, and the server records information about each player like their current 'action'. This information is sent to all other clients and is used to populate the screen with everyone who is online.<br/>
<br/>
Framerate is currently controlled manually using an async setTimeout, which can cause issues since not all machines have the exact same opinion of what a millisecond is, but it works for now.