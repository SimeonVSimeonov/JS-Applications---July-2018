$(function () {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);
    let dbServiseUrl = 'https://phonebook-84f98.firebaseio.com/phonebook';

    function loadContacts() {
        $('#phonebook').empty();
        $.get(dbServiseUrl + '.json')
            .then(displayContacts)
            .catch(displayError);

    }

    function displayContacts(contacts) {
        for (let key in contacts) {
            let person = contacts[key]['person'];
            let phone = contacts[key]['phone'];
            let li = $('<li>');
            li.text(person + ': ' + phone + ' ');
            $('#phonebook').append(li);
            li.append($("<button>delete</button>")
                .click(deleteContact.bind(this, key)));
        }
    }

    function displayError(err) {
        $('#phonebook').append($('<li>Error</li>'));
    }

    function createContact() {
        let newContactJSON = JSON.stringify({
            person: $('#person').val(),
            phone: $('#phone').val()
        });
        $.post(dbServiseUrl + '.json', newContactJSON)
            .then(loadContacts)
            .catch(displayError);
        $('#person').val('');
        $('#phone').val('');

    }

    function deleteContact(key) {
        let request = {
            method: 'DELETE',
            url: dbServiseUrl + '/' + key + '.json'
        };
        $.ajax(request)
            .then(loadContacts)
            .catch(displayError);

    }
});