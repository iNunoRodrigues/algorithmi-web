/**
 * Created by Fábio Cruz on 11/04/2016.
 */
window.CoursesNewView = Backbone.View.extend({
    events: {},
    initialize: function () {
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});