import { baseURL, photos, allUsers, withLimit } from './variables.mjs';
import { urlConversion } from './utils.mjs';


export function getAllUsers(callback, catchError) {
    let url = baseURL + allUsers;
    axios.get(url).then(response => {
        if (response.status !== 200) {
            console.log(`Houston, we have a problem: ${error}`);
            catchError(error);
            return;
        }
        callback(response.data);
    }).catch( (error) => {
        console.log(`Houston, we have a problem: ${error}`);
        catchError(error);
    });
}

export function getPhotos(limits, callback, catchError) {
    let url = baseURL + urlConversion(photos, {[withLimit]: limits});
    axios.get(url).then(response => {
        if (response.status !== 200) {
            catchError(error);
            return;
        }
        callback(response.data);
    }).catch( error => {
        catchError(error);
    });
}