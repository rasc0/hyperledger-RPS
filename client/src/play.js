import "./App.css";
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Axios from "axios";

// TODO: Change radio button values to be 1,2,3

export function Player(props) {
    let player = props.name;
    let org = props.org;

    const [moveSubmitted, setMoveSumbitted] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [selectedMove, setMove] = useState(null);
    const [gameID, setGameID] = useState(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const interval = setInterval(getStatus,500);
        console.log("Move submitted: " + moveSubmitted + " Game in progress: " + gameInProgress);


        return() => clearInterval(interval);
    }, []);

    const getStatus = async () => {
        Axios.get('http://localhost:3001/api/gameInProgress/' + org).then((response) => {
            setGameInProgress(response.data.inProgress);
            setGameID(response.data.id);
            setWinner(response.data.winner);
            setMoveSumbitted(response.data.moveSubmitted);
            console.log(response.data);
        }).catch(err => console.log("Error "));
    };

    function submitMove() {
        if(!selectedMove) { 
            return;
        }
        
        // Get the selected image then make a post request to submit move
        Axios.post("http://localhost:3001/api/submitMove", {
            user: player, 
            org: org,
            move: selectedMove
        });
    }

    function createGame() {
        Axios.post("http://localhost:3001/api/createGame", {
            user: player, 
            org: org
        }).then((response) => {
            setGameID(response.data.id)
        });
    }

    function ShowGameId() {
        if(gameInProgress || winner) {
            return(
                <div>
                <h1> Game ID: {gameID} </h1>
                <h1> Winner: {winner}</h1>
                </div>
               )
        } else {
            return(
                <div>
                    <h1> No game in progress </h1>
                    <br></br>
                </div>
            )
        }
    }

    return (
        <div id="playerDiv">
            <h1>Hello, {player} - {org}</h1>
            <Button variant="contained"
            onClick={createGame} 
            disabled={gameInProgress}>Create Game</Button>
            <ShowGameId />
            <br></br>
            <FormControl>
                <FormLabel>Select Move</FormLabel>
                <RadioGroup
                    row
                    name="move-radio"
                    onChange={(event, value) => {
                        setMove(value);
                    }} 
                    >
                    <FormControlLabel value="rock" control={<Radio disabled={!gameInProgress || moveSubmitted}/>} label="Rock" />
                    <FormControlLabel value="paper" control={<Radio disabled={!gameInProgress || moveSubmitted}/>} label="Paper" />
                    <FormControlLabel value="scissors" control={<Radio disabled={!gameInProgress || moveSubmitted}/>} label="Scissors" />
                </RadioGroup>
             </FormControl>
             <br></br><br></br>
            <Button variant="contained"
            onClick={submitMove} 
            // if no game in progress AND 
            disabled={!gameInProgress || moveSubmitted}>Submit Move</Button>
        </div>
    );
}