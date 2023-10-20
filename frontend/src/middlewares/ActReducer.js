export const actReducer = (acts, action) => {
    switch (action.type) {
        case 'updated': {
            return {
                type: 'updated',
                idAct: action.id,
                act: action.newAct
            }
        }
        case 'deleted': {
            return {
                type: 'deleted',
                idAct: action.id
            }
        }
    
        default:
            break;
    }
}