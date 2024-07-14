import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  BEGIN_DATA_FETCH,
  CLOSE_MODAL,
  COLLAPSE_MENU,
  DATA_FETCH_FAILURE,
  DATA_FETCH_SUCCESS,
  FETCH_GAME_BEGIN,
  FETCH_GAME_FAILURE,
  FETCH_GAME_SUCCESS,
  INCREASE_PAGE_SIZE,
  OPEN_MODAL,
  POPULAR_GAMES,
  SEARCH_DATA_FETCHED,
  UPCOMING_GAMES,
} from "../utilts/action";
import reducer from "../reducers/statsReducer";
import { API_KEY } from "../config";
import axios from "axios";

const StatsContext = React.createContext();

const baseUrl = `https://api.rawg.io/api/games?key=${API_KEY}`;

export const ContextProvider = ({ children }) => {
  const initialState = {
    collapsed: false,
    page_size: 12,
    loading: false,
    modal_open: false,
    modal_id: null,
    game_data: {
      platform: [],
      genre: [],
    },
    homepage_games: [],
    popular_games: [],
    upcoming_games: [],
    games: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [searching, setSearching] = useState('');

  // Fetch Games
  const fetchGames = async (url) => {
    dispatch({ type: BEGIN_DATA_FETCH });
    try {
      const res = await axios.get(url);
      dispatch({ type: DATA_FETCH_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({ type: DATA_FETCH_FAILURE, payload: error });
    }
  };

  console.log(state);

  const fetchGame = async (id) => {
    dispatch({ type: FETCH_GAME_BEGIN });

    try {
      const game = await axios.get(
        `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
      );
      console.log(game.data);
      dispatch({ type: FETCH_GAME_SUCCESS, payload: game.data });
    } catch (error) {
      dispatch({ type: FETCH_GAME_FAILURE, payload: error });
    }
  };

  // popular Game
  const PopularGames = async (url) => {
    dispatch({ type: BEGIN_DATA_FETCH });
    try {
      const res = await axios.get(url);
      console.log('Popular Games Data:', res.data); // Tambahkan log ini
      dispatch({ type: POPULAR_GAMES, payload: res.data });
    } catch (error) {
      dispatch({ type: DATA_FETCH_FAILURE, payload: error });
    }
  };

  const collapseMenu = () => {
    dispatch({
      type: COLLAPSE_MENU,
    });
  };

  const increasePageSize = () => {
    dispatch({
      type: INCREASE_PAGE_SIZE,
      payload: state.page_size + 4,
    });
  };

  const openModal = (id) => {
    dispatch({
      type: OPEN_MODAL,
      payload: id,
    });
  };
  const closeModal = () => {
    dispatch({
      type: CLOSE_MODAL,
    });
  };

  const fetchClickedGame = async (id) => {
    fetchGame(id);
  };

  const UpcomingGames = async (url) => {
    dispatch({ type: BEGIN_DATA_FETCH });
    try {
      const res = await axios.get(url);
      console.log('Upcoming Games Data:', res.data); // Tambahkan log ini
      dispatch({ type: UPCOMING_GAMES, payload: res.data });
    } catch (error) {
      dispatch({ type: DATA_FETCH_FAILURE, payload: error });
    }
  };
  const searchGames = async (search) => {
    dispatch({ type: BEGIN_DATA_FETCH });
    try {
      const res = await axios.get( `${baseUrl}&search=${search}`);
      console.log('Upcoming Games Data:', res.data); // Tambahkan log ini
      dispatch({ type: SEARCH_DATA_FETCHED, payload: res.data });
      setSearching(true);
    } catch (error) {
      dispatch({ type: DATA_FETCH_FAILURE, payload: error });
    }

   
  };

  useEffect(() => {
    fetchGames(`${baseUrl}&page_size=${state.page_size}`);
    PopularGames(`${baseUrl}&page_size=${state.page_size}`);
    UpcomingGames(`${baseUrl}&dates=2024-09-01,2025-03-15&ordering=-added&page_size=${state.page_size}`);
  }, [state.page_size]);
  return (
    <StatsContext.Provider
      value={{
        ...state,
        collapseMenu,
        increasePageSize,
        fetchClickedGame,
        openModal,
        closeModal,
        searching,
        setSearching,
        searchGames,
        fetchGames,
        PopularGames,
        UpcomingGames,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsContext = () => {
  return useContext(StatsContext);
};