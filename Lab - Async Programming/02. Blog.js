function attachEvents() {
        const URL = 'https://baas.kinvey.com/appdata/kid_BJCpRgBEX/';
    const USERNAME = 'Peter';
    const PASSWORD = 'p';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
    const AUTH = {"Authorization": 'Basic ' + BASE_64};
    const SELECT = $('#posts');
    const TITLE = $('#post-title');
    const BODY = $('#post-body');
    const COMMENTS = $('#post-comments');

    $('#btnLoadPosts').on('click', loadPosts);
    $('#btnViewPost').on('click', viewPosts);

    function loadPosts() {
        $.ajax({
            method: 'GET',
            url: URL + 'posts',
            headers: AUTH
        }).then(function (resp) {
            SELECT.empty();
            for (let post of resp) {
                SELECT.append($(`<option id="${post._id}" body="${post.body}">${post.title}</option>`))
            }
        }).catch(function (err) {
            console.log(err);
        })
    }

    function viewPosts() {
        BODY.empty();
        let selectedElement = SELECT.find(":selected");
        let value = selectedElement.text();
        let body = selectedElement.attr('body');
        TITLE.text(value);
        BODY.append($(`<li>${body}</li>`));
        let id = selectedElement.attr("id");

        $.ajax({
            method: "GET",
            url: URL + `coments/?query={"post_id":"${id}"}`,
            headers: AUTH
        }).then(function (result) {
            COMMENTS.empty();
            for (let com of result) {
                COMMENTS.append($(`<li>${com.text}</li>`))
            }
        }).catch(function (err) {
            console.log(err);
        })
    }
}