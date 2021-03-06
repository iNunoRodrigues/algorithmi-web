/**
 * Created by Fábio Cruz on 10/04/2016.
 */
window.InstitutionsEditView = Backbone.View.extend({
    events: {
        "change #filePicker": "convertPhoto",
        "submit": "editInstitution"
    },
    //Convert Photo To Base64 String
    convertPhoto: function (e) {
        var file = e.target.files[0];

        // Load the image
        var reader = new FileReader();

        reader.onload = function (readerEvent) {
            var image = new Image();
            image.src = readerEvent.target.result;
            showCropper(".form", image, 300, 16 / 9);
        }
        reader.readAsDataURL(file);
    },


    editInstitution: function (e) {
        e.preventDefault();
        var id = parseInt($(e.currentTarget).attr("value"));


        var institutionDetails = $('#editInstitution').serializeObject();
        console.log(institutionDetails)
        var institution = new Institution({id: this.data.id});
        institution.save(institutionDetails, {
            success: function (inst, response) {
                sucssesMsg($(".form"), response.text);
                setTimeout(function () {
                    app.navigate('/institutions', {
                        trigger: true
                    });
                }, response.text.length * 50);

            },
            //se não conseguir
            error: function (institution, xhr) {
                var json = JSON.parse(xhr.responseText);
                failMsg($("body"), json.text);
                setTimeout(function () {
                    app.navigate('/institutions', {
                        trigger: true
                    });
                }, json.text.length * 45);
            }
        })

    },


    checkAuth: function () {
        if (!sessionStorage.getItem('keyo')) {
            showLoginModal($("#someParent"));
        }
    },


    initialize: function () {
        this.data = this.model.toJSON();
        console.log(this.data)
    },

    render: function () {
        var self = this;
        $(this.el).html(this.template({model: self.data}));
        return this;
    }
});
