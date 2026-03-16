import { useReducer } from "react"

const httpReducer = (state, action) => {
    switch (action.type) {
        case 'PENDING':
            return {
                data: null,
                isLoading: true,
                error: null
            }
        case 'SUCCESS':
            return {
                data: action.payload,
                error: null,
                isLoading: false
            }
        case 'ERROR':
            return {
                data: null,
                error: action.error,
                isLoading: false
            }
    }
}

const useHttp = (requestFunction, startWithLoading = false) => {
    const [httpState, dispatch] = useReducer(httpReducer, {
        data: null,
        isLoading: startWithLoading,
        error: null
    });

    const sendRequest = async (requestData) => {
        try {
            dispatch({ type: 'PENDING' });
            const resData = await requestFunction(requestData);
            dispatch({ type: 'SUCCESS', payload: resData })
        }
        catch (err) {
            console.log(err);
            // console.dir(err.response?.data?.message);
            dispatch({type:'ERROR', error: err.response?.data?.message || 'Something went wrong'})
        }
    }

    return { ...httpState, sendRequest };
}

export default useHttp;