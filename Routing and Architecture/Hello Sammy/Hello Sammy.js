const app = Sammy('#main', function () {
    this.use('Handlebars', 'hbs');
    this.get('#/hello/:name', function() {
        this.title = 'Hello!';
        this.name = this.params.name;
        this.partial('greeting.hbs');
    });
});
$(() => app.run());
