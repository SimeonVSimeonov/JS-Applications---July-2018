const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_BkwbK4LHQ';
const APP_SECRET = 'da2fdf26cacb4a0483d0a350faae761c';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

const kinveyControler = (function () {
    function registerUser(username, password, firstName, lastName, phone, email) {
        $.ajax({
            method: "POST",
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username, password, firstName, lastName, phone, email}
        }).then(function (res) {
            saveAuthInSession(res);
        }).catch(handleError)
    }

    function loginUser(username, password) {
        $.ajax({
            method: "POST",
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            saveAuthInSession(res);
        }).catch(handleError)
    }

    function editUser(firstName, lastName, phone, email) {
        $.ajax({
            method: "PUT",
            url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('id'),
            headers: {"Authorization": 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {firstName, lastName, phone, email}
        }).then(function (res) {
            saveAuthInSession(res)
        }).catch(handleError)
    }

    function saveAuthInSession(userData) {
        sessionStorage.setItem('authToken', userData._kmd.authtoken);
        sessionStorage.setItem('firstName', userData.firstName);
        sessionStorage.setItem('lastName', userData.lastName);
        sessionStorage.setItem('phone', userData.phone);
        sessionStorage.setItem('email', userData.email);
        sessionStorage.setItem('id', userData._id);
    }

    function handleError(err) {
        console.log(err);
    }

    return {registerUser, loginUser, editUser}
}());