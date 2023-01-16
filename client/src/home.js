import Button from '@mui/material/Button';
import React from "react";

export function Home(props) {
    return(
        <div>
            <Button href="/player1"
                id="prime-button"
                size={"large"}
                name={"player1"}>Player1</Button>
            <Button href="/player2"
                id="prime-button"
                size={"large"}
                name={"player2"}>Player2</Button>
        </div>
    );
}