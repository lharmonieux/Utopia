export const actReducer = (acts, action) => {
    switch (action.type) {
        case 'updated': {
            return {
                idAct: action.id,
                act: action.newAct
            }
        }
    
        default:
            break;
    }
}