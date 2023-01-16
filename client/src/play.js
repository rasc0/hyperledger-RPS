// Props: player, org

import "./App.css";
import React, { useState } from 'react';
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

    const [buttonEnabled, setButtonEnabled] = useState(true);
    const [buttonEnabled2, setButtonEnabled2] = useState(true);
    const [selectedMove, setMove] = useState(null);


    function submitMove() {
        if(!selectedMove) { 
            return;
        }
        
        alert(selectedMove);
        // Get the selected image then make a post request to submit move
        Axios.post("http://localhost:3001/api/submitMove", {
            user: player, 
            org: org,
            move: selectedMove
        });
       setButtonEnabled(false);
    }

    function createGame() {
        Axios.post("http://localhost:3001/api/createGame", {
            user: player, 
            org: org
        });
        
        setButtonEnabled2(false);
    }
    //onChange={setMove("rock")} 
    return (
        <div id="playerDiv">
            <h1>Hello, {player} - {org}</h1>
            <Button variant="contained"
            onClick={createGame} 
            disabled={!buttonEnabled2}>Create Game</Button>
            <br></br><br></br>
            <FormControl>
                <FormLabel>Select Move</FormLabel>
                <RadioGroup
                    row
                    name="move-radio">
                    <FormControlLabel value="rock" control={<Radio />} label="Rock" />
                    <FormControlLabel value="paper" control={<Radio />} label="Paper" />
                    <FormControlLabel value="scissors" control={<Radio />} label="Scissors" />
                </RadioGroup>
             </FormControl>
             <br></br><br></br>
            <Button variant="contained"
            onClick={submitMove} 
            disabled={!buttonEnabled}>Submit Move</Button>
        </div>
    );
}