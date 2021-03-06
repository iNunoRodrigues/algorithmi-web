window.QuestionsNewView = Backbone.View.extend({
    events: {
        "click #btnCriarPerg ": "send",
        "click #codesTab ": "codesTab",
        "change #filePickerImg": "convertPhoto",
        "click #btnAddIO": "addIO",
        "click .rmvIO": "rmvIO",

        "click #btnAddCode": "addCode",

        "blur .mandatory": "verify",
    },
    codesTab: function (e) {
        alert("calma")
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

        //Recolhe os IOS
        var ioList = [];

        $.each($(".subDivIO"), function (i, iIO) {
            ioList.push({input: $(iIO).find('.input').val(), output: $(iIO).find('.output').val()});
        })
        $("#txtIOlist").val(JSON.stringify(ioList));

        // POST ("/api/questions")
        var questionDetails = $("#newQuestionForm").serializeObject();
        questionDetails.ios = jQuery.parseJSON($("#txtIOlist").val())
        var question = new Question(questionDetails);
        console.log(question.attributes)
        question.save(null, {
            //Se inseriu correctamente os detalhes da pergunta
            success: function (question, response) {
                //insere os codigos da question
                sucssesMsg($(".form"), "Questão inserida");
                //Reencaminha para a pasta de edicao
                setTimeout(function () {
                    app.navigate('/questions/' + response.text + "/edit", {
                        trigger: true
                    });
                }, 3000);

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
        }).append($('<label>', {id: "lblIO", html: 'I/O'}),
            $('<span>', {class: "rmvIO"}).append($('<i>', {class: 'fa fa-close'})), '</br>',
            $('<label>', {class: "col-md-6", html: 'Input'}),
            $('<label>', {class: "col-md-6", html: 'Output'}),
            $('<textarea>', {class: "col-md-6 input", html: $("#txtEntrada").val()}),
            $('<textarea>', {class: "col-md-6 output", html: $("#txtSaida").val()})
        )));
    },
    rmvIO: function (e) {
        $(e.currentTarget).parent().parent().remove();
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
