export default function user(state = [], action) {
    switch (action.type){
        case 'LOG_IN': return[
            ...state,
            {name: action.name, password: action.password}
        ];
        default: return state;
    }
}