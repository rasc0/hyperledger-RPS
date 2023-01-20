import React from "react";
import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { Player } from "./play";
import { Home } from "./home";

/**
 * Initially makes requests to initialise admins, wallets etc.
 * 
 * Displays two buttons. One for player 1, one for player 2
 * Each leads to an identical page that displays rock paper or scissors button
 * 
 * Buttons make calls to server to add moves etc.
 */

function App() {
  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/player1" element={<Player name="player1" org="org1"/>}/>
                <Route path="/player2" element={<Player name="player2" org="org2"/>}/>
            </Routes>
        </BrowserRouter>
  );
}

export default App;