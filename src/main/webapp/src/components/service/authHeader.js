export default function authHeader() {
    const userToken = localStorage.getItem('jwt');
    if (userToken) {
        return { 'authorization': 'Bearer ' + userToken };
    } else {return {};}
}