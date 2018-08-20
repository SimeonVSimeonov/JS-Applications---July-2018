function attachEvents() {
    let serviceUrl = 'https://messenger-3fb53.firebaseio.com/messenger';
    let contentArea = $('#messages');
    let author = $('#author');
    let content = $('#content');

    loadPosts();

    $('#submit').click(createPost);
    $('#refresh').click(loadPosts);

    function createPost() {
        if (author.val().length === 0 || content.val().length === 0) {
            return;
        }

        let post = {author: author.val(), content: content.val(), timestamp: Date.now()};
        let request = {
            method: "POST",
            url: serviceUrl + ".json",
            data: JSON.stringify(post),
            success: () => {
                author.val("");
                content.val("");
            },
            error: handleError
        };

        $.ajax(request);
    }


    function loadPosts() {
        let request = {
            method: "GET",
            url: serviceUrl + ".json",
            success: showMsgs,
            error: handleError

        };

        $.ajax(request)
    }

    function showMsgs(data) {
        let text = "";
        let sortedMsg = Object.keys(data).sort((a, b) => byDate(a, b, data));
        for (let mess of sortedMsg) {
            text += data[mess]['author'] + ": " + data[mess]['content'] + "\n"
        }

        contentArea.text(text);
    }

    function handleError(err) {
        console.log(err);
    }

    function byDate(ob1, ob2, data) {
        let timeOne = data[ob1]['timestamp'];
        let timeSecond = data[ob2]['timestamp'];

        return timeOne - timeSecond;
    }

}