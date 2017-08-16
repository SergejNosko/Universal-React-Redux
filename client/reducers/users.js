const initialState = {
  username: null
};

export default function username(state = [], action) {
    switch (action.type){
        case "LOG_IN":
            return {
                ...state,
                username: action.username
            };
        default: return state;
    }
}