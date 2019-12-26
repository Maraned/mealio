import React, { createContext, useReducer, useContext, useEffect } from 'react';

import { DraftRecipesContext } from 'contexts/draftRecipes';
import { PublishedRecipesContext } from 'contexts/publishedRecipes';

const initialState = { };

const webSocketReducer = (state, action) => {
  return state;
};

export const WebSocketContext = createContext(initialState);

export const WebSocketProvider = props => {
  const [state, dispatch] = useReducer(webSocketReducer, initialState);
  const { dispatch: draftRecipesDispatch } = useContext(DraftRecipesContext);
  const { dispatch: publishedRecipesDispatch } = useContext(PublishedRecipesContext);

  const updateFunction = {
    draft: draftRecipesDispatch,
    published: publishedRecipesDispatch,
  };

  const updater = ({ type, data }) => {
    if (Array.isArray(data)) {
      return updateFunction[type]({ type: 'set', value: data });
    }

    const newData = !data.old_val && !!data.new_val;
    const modifiedData = !!data.old_val && !!data.new_val;
    const deletedData = !!data.old_val && !data.new_val;

    if (newData) {
      updateFunction[type]({ type: 'added', value: data.new_val });
    } else if (modifiedData) {
      updateFunction[type]({ type: 'updated', value: data.new_val });
    } else if (deletedData) {
      updateFunction[type]({ type: 'removed', value: data.old_val });
    }
  }

  useEffect(() => {
    const host = window.location.hostname;
    const wsUrl = `wss://${host}/ws`;
    const connection = new WebSocket(wsUrl);
    
    connection.onmessage = function (message) {
      try {
        const json = JSON.parse(message.data);
        updater(json);
      } catch (e) {
        return;
      }
    };
    // connection.onopen = function () {
    //   // connection is opened and ready to use
    //   console.log('websocket onopen')
    // };
  
    // connection.onerror = function (error) {
    //   // an error occurred when sending/receiving data
    //   console.log('websocket onerror', error)
    // };
  

    return () => connection.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ state, dispatch }}>
      {props.children}
    </WebSocketContext.Provider>
  )
}
