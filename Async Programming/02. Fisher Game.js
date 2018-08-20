function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_r1MR2DwV7/biggestCatches';
    const USERNAME = 'peter';
    const PASSWORD = 'p';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
    const AUTH = {"Authorization": 'Basic ' + BASE_64};
    const divCatches = $('#catches');
    let angler = $('#addForm .angler');
    let weight = $('#addForm .weight');
    let species = $('#addForm .species');
    let location = $('#addForm .location');
    let bait = $('#addForm .bait');
    let captureTime = $('#addForm .captureTime');

    $('.load').on('click', loadAllCatches);
    $('.add').on('click', addCatch);

    function loadAllCatches() {
        let request = {
            method: "GET",
            url: URL,
            headers: AUTH,
            contentType: 'application/json'
        };
        $.ajax(request).then(function (result) {
            divCatches.empty();
            for (let post of result) {
                let div = $('<div>').addClass('catch').attr("data-id", `${post._id}`);
                div.append($('<label>Angler</label>')).append($('<input>').attr("type", "text").addClass("angler").val(`${post.angler}`))
                    .append($('<label>Weight</label>')).append($('<input>').attr("type", "number").addClass("weight").val(`${post.weight}`))
                    .append($('<label>Species</label>')).append($('<input>').attr("type", "text").addClass("species").val(`${post.species}`))
                    .append($('<label>Location</label>')).append($('<input>').attr("type", "text").addClass("location").val(`${post.location}`))
                    .append($('<label>Bait</label>')).append($('<input>').attr("type", "text").addClass("bait").val(`${post.bait}`))
                    .append($('<label>Capture Time</label>')).append($('<input>').attr("type", "number").addClass("captureTime").val(`${post.captureTime}`));
                div.append($('<button>Update</button>').addClass("update").on("click", updateCatch))
                    .append("   ")
                    .append($('<button>Delete</button>').addClass("delete").on("click", deleteCatch));

                function deleteCatch() {
                    let request = {
                        method: "DELETE",
                        url: URL + '/' + post._id,
                        headers: AUTH,
                        contentType: 'application/json'
                    };

                    $.ajax(request).then(loadAllCatches).catch(handleError)
                }

                divCatches.append(div).append(" ");

            }
        }).catch(handleError)

    }


    function addCatch() {
        if (angler.val() === "" || weight.val() === "" || species.val() === ""
            || location.val() === "" || bait.val() === "" || captureTime === "") {
            return;
        }

        let post = {
            angler: angler.val(), weight: Number(weight.val()), species: species.val(), location: location.val()
            , bait: bait.val(), captureTime: Number(captureTime.val())
        };
        let request = {
            method: "POST",
            url: URL,
            headers: AUTH,
            contentType: 'application/json',
            data: JSON.stringify(post),
            success: () => {
                angler.val('');
                weight.val('');
                species.val('');
                location.val('');
                bait.val('');
                captureTime.val('');
                loadAllCatches();
            },
            error: handleError
        };
        $.ajax(request)
    }

    function updateCatch() {

        let element = $(this).parent();
        let upangler = element.find(".angler");
        let upweight = element.find(".weight");
        let upspecies = element.find(".species");
        let uplocation = element.find(".location");
        let upbait = element.find(".bait");
        let upcaptureTime = element.find(".captureTime");

        if (upangler.val() === "" || upweight.val() === "" || upspecies.val() === ""
            || uplocation.val() === "" || upbait.val() === "" || upcaptureTime === "") {
            return;
        }

        let post = {
            angler: upangler.val(), weight: Number(upweight.val()), species: upspecies.val(), location: uplocation.val()
            , bait: upbait.val(), captureTime: Number(upcaptureTime.val())
        };

        let request = {
            method: "PUT",
            url: URL + "/" + post._id,
            headers: AUTH,
            contentType: 'application/json',
            data: JSON.stringify(post)
        };
        $.ajax(request).then(loadAllCatches()).catch(handleError);

    }

    function handleError(err) {
        console.log(err);
    }

}