import "./App.css";
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Axios from "axios";

export function Player(props) {
    let player = props.name;
    let org = props.org;

    const [moveSubmitted, setMoveSumbitted] = useState(true);
    const [gameInProgress, setGameInProgress] = useState(true);
    const [selectedMove, setMove] = useState(null);
    const [gameID, setGameID] = useState(null);

    useEffect(() => {
        const interval = setInterval(getStatus,1000)

        return()=>clearInterval(interval)
    }, []);

    const getStatus = async () => {
        Axios.get('http://localhost:3001/api/gameInProgress/' + org).then((response) => {
            setGameInProgress(response.data.inProgress);
            setGameID(response.data.id);
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
        setMoveSumbitted(false);
    }

    function createGame() {
        Axios.post("http://localhost:3001/api/createGame", {
            user: player, 
            org: org
        }).then((response) => {
            setGameInProgress(true);
            setGameID(response.data.id)
        });
    }

    function ShowGameId() {
        if(gameInProgress) {
           return(
            <h1> Game ID: {gameID} </h1>
           )
        } else {
            return(
                <h1> No game in progress </h1>
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
            disabled={!gameInProgress || moveSubmitted}>Submit Move</Button>
        </div>
    );
}