window.QuestionsNewView = Backbone.View.extend({
    events: {
        "click #btnCriarPerg ": "send",
        "change #filePickerImg": "convertPhoto",
        "change #inputFicheiro": "convertFile",
        "click #btnAddIO": "addIO",
        "click #btnAddCode": "addCode",
        "blur .mandatory": "verify",
    },

    convertFile: function (e) {
        fileToB64(e);
    },

    beforeSend: function (e) {
        var self = this;
        var isAllOk = true;
        //Evita que o browser efectue a accao por defeito
        e.preventDefault();
        //Mostra os dados na console do browser
        console.log($("form").serializeObject());
        //Se algum dos campos estiver vazio
        var allElements = $(".mandatory");
        $.each(allElements, function (key, elem) {
            if (isEmpty($(elem))) {
                isAllOk = false;
            }
        });

        if (isAllOk) {
            self.send();
        }
    },
    //Verifica se o elemento esta preenchido quando perde o foco
    verify: function (e) {
        isEmpty($(e.currentTarget));
    },
    send: function (e) {
        e.preventDefault();
        console.log(jQuery.parseJSON($("#txtIOlist").val()))
        console.log($("#newQuestionForm").serializeObject())
        // POST ("/api/questions")
        var questionDetails = $("#newQuestionForm").serializeObject();
        questionDetails.ios = jQuery.parseJSON($("#txtIOlist").val())
        var question = new Question(questionDetails);

        question.save(null, {
            success: function (question, response) {
                sucssesMsg($(".form"), response.text);
                setTimeout(function () {
                    //  app.navigate('/questions', {
                    //       trigger: true
                    //   });
                }, response.text.length * 50);

            },
            error: function (inst, response) {
                // failMsg($(".form"), response.text);
            },
        })
    },

    //Convert Photo To Base64 String
    convertPhoto: function (e) {

        var file = e.target.files[0];

        // Load the image
        var reader = new FileReader();

        reader.onload = function (readerEvent) {
            var image = new Image();
            image.src = readerEvent.target.result;
            showCropper("#content > div", image, 300, 16 / 9);
        }
        reader.readAsDataURL(file);

    },

    addIO: function (e) {
        e.preventDefault();

        $("#divIOList").append($("<div>", {
            class: "divIO",
        }).append($("<div>", {
            class: "subDivIO",
        }).append('<label id="lblIO">I/O</label></br>'
            , '<span class="col-md-6">I: </s>' + $("#txtEntrada").val() + '</br>'
            , '<span class="col-md-6">O: </span>' + $("#txtSaida").val()
        )));
        var ioList = jQuery.parseJSON($("#txtIOlist").val());

        ioList.push({input: $("#txtEntrada").val(), output: $("#txtSaida").val()});
        $("#txtIOlist").val(JSON.stringify(ioList));

    },

    addCode: function (e) {
        e.preventDefault();
        var ioList = jQuery.parseJSON($("#txtCodelist").val());

        ioList.push({code: $("#txtB64File").val(), language: $("#ddLanguagesList").val()});
        $("#txtCodelist").val(JSON.stringify(ioList));

    },
    initialize: function () {
        populateCategoriesDD();
        populateLanguagessDD();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
