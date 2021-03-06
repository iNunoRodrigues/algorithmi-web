/**
 * Created by Cris on 17/03/2016.
 */
//Aperfeiçoamente da funcao ":contains" do JQuery para case insensitive
//(http://stackoverflow.com/questions/187537/is-there-a-case-insensitive-jquery-contains-selector)
$.extend($.expr[':'], {
    'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});

//Valida o texto o input de entrada e de saída
//Ex: 3;6;9 OU casa; tres; sim
window.isIOvalide = function () {
    var email = new RegExp('^([a-zA-Z0-9 ]+\;?)+$');
    $("#txtEntrada").parent().parent().find('label').remove();
    if (!email.test($("#txtEntrada").val())) {
        $("#txtEntrada").parent().parent().append('<label>Entrada inválida. Ex: Casa;Rui;Sim</label>');
        return false;
    }
    $("#txtSaida").parent().parent().find('label').remove();
    if (!email.test($("#txtSaida").val())) {
        $("#txtSaida").parent().parent().append('<label>Saída inválida. Ex: 2;5;5</label>');
        return false;
    }
    return true;
};

//Verifica se o elemento passado por parametro está vazio
//Se estiver, apresenta uma mensagem
window.isEmpty = function (elem) {
    $(elem).removeClass("emptyField");
    $(elem).parent().removeClass("emptyField");
    if ($(elem).val() != null && $(elem).val().length != 0) {
        return false;
    } else {
        if ($(elem).prop('type') == "file") {
            $(elem).parent().addClass("emptyField");
        } else {
            $(elem).addClass("emptyField");
        }
        return true;
    }
};
window.convertImage = function (e) {
    var file = e.target.files[0];
    // Load the image
    var reader = new FileReader();
    reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = function () {
            //Image Resize
            var canvas = document.createElement('canvas');
            var MAX_WIDTH = 450;
            var MAX_HEIGHT = 350;
            var width = image.width;
            var height = image.height;
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);

            var dataUrl = canvas.toDataURL('image/jpeg');
            $("#base64textarea").val(dataUrl);
            $("#imagePrev").attr('src', dataUrl);

        }
        image.src = readerEvent.target.result;
    }
    reader.readAsDataURL(file);
};
$(".nav a").on("click", function () {
    $(".nav").find(".active").removeClass("active");
    if (!$(this).parent().hasClass("dropdown")) {
        $(this).parent().addClass("active");
    }

});


$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


//Mostra o formulário de login no form indicado
window.showLoginModal = function (form) {

    var $loginModal = $("<div>", {
            class: "modal fade",
            tabindex: "-1",
            id: "mLogin",
            role: "dialog",
            "aria-labelledby": "myModalLabel",
            "aria-hidden": "true"
        }).append(
        $("<div>", {class: "modal-dialog"}).append(
            $("<div>", {class: "modal-content"}
                // MODAl HEATHER
            ).append(
                $("<div>", {class: "modal-header"}).append(
                    $("<button>", {
                        type: "button", class: "close", "data-dismiss": "modal", "aria-label": "Close"
                    }),
                    $("<h3>", {
                        class: "modal-title", text: "Controlo de acesso"
                    })
                )
                // MODAl HEATHER
            ).append(
                $("<div>", {
                    class: "modal-body",
                }).append(
                    $("<div>", {
                        class: "row form-group",
                    }).append(
                        $("<div>", {
                            class: "col-sm-12",
                        }).append(
                            $("<input>", {
                                id: "userEmail", class: "form-control", placeholder: "E-mail", name: "email",
                                type: "email", autofocus: "autofocus", autocomplete: "on"
                            })
                        ).append($("<span>", {
                            id: "imgMail", class: "glyphicon glyphicon-envelope"
                        }))
                    )
                    )
                    .append(
                        $("<div>", {
                            class: "row form-group",
                        }).append(
                            $("<div>", {
                                class: " col-sm-12",
                            }).append(
                                $("<input>", {
                                    id: "psswrd", class: "form-control", placeholder: "Palavra-passe", name: "password",
                                    type: "password"
                                })
                            ).append($("<span>", {
                                id: "pwdIcon", class: "glyphicon glyphicon-lock"
                            }))
                        )
                    )
            ).append(
                $("<div>", {
                    class: "modal-footer",
                }).append(
                    $("<button>", {
                        type: "submit", id: "loginbtn", class: "btn btn-lg btn-login btn-block",
                        text: "Entrar",
                        onClick: "attemptLogin()"
                    })
                )
            )
        ))
        ;
    $(form).append($loginModal);

    $("#mLogin").modal("show");
};

//Mostra o formulário de login no form indicado
//showCropper("nomeFormulario/div", maxWidth da tela, Width do resultado, height do resultado , ratio (1=quadrado) (16/9=rectangulo);
window.showCropper = function (form, base_image, resWidth, aspectRatio, result) {
    //Se a imagem for verticalmente maior
    if (base_image.width < base_image.height) {
        var maxHeight = 300;
        var maxWidth = base_image.width * maxHeight / base_image.height;
    } else {
        var maxWidth = 400;
        var maxHeight = base_image.height * maxWidth / base_image.width;
    }

    //Carrega
    var resHeight = resWidth / aspectRatio;

    base_image.onload = function () {

        var $cropperModal = $("<div>", {
            id: "cropperPanel",
            class: "panel panel-info",
            width: maxWidth + 40
        }).append(
            $("<div>", {class: "panel-heading"}
                // MODAl HEATHER
            ).append(
                $("<div>", {}).append(
                    $("<button>", {
                        type: "button", class: "close", "data-dismiss": "modal", "aria-label": "Close"
                    }),
                    $("<h3>", {
                        class: "modal-title", text: "Recorte de imagem"
                    })
                )
                // MODAl HEATHER
            )).append(
            $("<div>", {class: "panel-body"}).append(
                '<div><canvas id="viewport" width="' + maxWidth + '" height="' + maxHeight + '" ></canvas>' +
                '<canvas id="preview" width="' + resWidth + 'px" height="' + resHeight + 'px" style="display: none;"></canvas></div>'
            )
        ).append(
            $("<div>", {}).append(
                $("<button>", {
                    type: "submit", id: "btnCrop", class: "btn btn-lg btn-login btn-block",
                    text: "Recortar", value: result
                }).click(
                    function () {
                        var canvas = $("#preview")[0];
                        var dataUrl = canvas.toDataURL('image/jpeg');
                        $("#base64textarea").val(dataUrl);
                        $("#imagePrev").attr('src', dataUrl);
                        $(".cropBG").remove();
                        $(".profile-pic").removeClass("emptyField");
                    }
                )
            ));
        $(form).append($("<div>", {class: 'cropBG'}).append($cropperModal));

        var canvas = document.getElementById('viewport'),
            context = canvas.getContext('2d');


        context.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, maxWidth, maxHeight);


        //-------
        $('#viewport').Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            allowSelect: true,
            allowMove: true,
            allowResize: true,
            bgOpacity: 0.35,
            aspectRatio: aspectRatio
            //aspectRatio: 16 / 9
        });


    }


};
function getDataUri(url, callback) {
    var image = new Image();
    //splits url to get format type
    var type = url.split(".");
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);


        callback(canvas.toDataURL('image/' + type[type.length - 1]));

    };

    image.src = url;
}

window.fileToB64 = function (evt) {

    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
        var reader = new FileReader();

        reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result;
            console.log(btoa(binaryString));
            $("#txtB64File").val(btoa(binaryString));
        };

        reader.readAsBinaryString(file);
    }
};

window.populateInstitutionsDD = function (selectedInstitution, selectedSchool, selectedCourse) {
    var inst = new Institutions();
    $("#ddInstitutionsList").attr("ready", false);
    inst.fetch(
        //Populates dd institutions with registed institutions
        function () {
            console.log("getting institutions")
            $("#ddInstitutionsList").append('<option value="" disabled selected>Instituição</option>').change(
                //Se existir a dd de escolas
                function () {
                    if ($("#ddSchoolsList").length) {
                        //Preenche a dd com as escolas da instituicao seleccionada
                        populateSchoolsDD(inst.getByID($("#ddInstitutionsList").val()).schools, selectedSchool, selectedCourse);
                    }
                }
            )
            ;
            $.each(inst.models, function (iInst, inst) {
                var institutionData = inst.attributes;
                $("#ddInstitutionsList").append(
                    $("<option>", {
                        html: institutionData.name,
                        id: institutionData.id,
                        value: institutionData.id
                    })
                );
            });
            //Selecciona a Instituição passada por parametro
            if (selectedInstitution) {
                $("#ddInstitutionsList").val(selectedInstitution)
                $("#ddInstitutionsList").change();
            }
            $("#ddInstitutionsList").attr("ready", true);
        }
    )
};
window.populateSchoolsDD = function (schoolsList, selectedSchool, selectedCourse) {

    if (schoolsList.length == 0) {
        $("#ddSchoolsList").html('<option value="" disabled selected>Sem escolas associadas</option>');
        $("#ddCoursesList").html('<option value="" disabled selected>Sem cursos associados</option>');
    } else {
        $("#ddSchoolsList").html('<option value="" disabled selected>Escola</option>').change(
            function () {
                console.log("getting schools")

                //Se existir a dd de cursos
                if ($("#ddCoursesList").length) {
                    $("#ddCoursesList").html('<option value="" disabled selected>Curso</option>');
                    //Obtem os cursos da escola seleccionada

                    $.each(schoolsList, function (ischool, school) {
                        if (school.id == $("#ddSchoolsList").val()) {
                            //Preenche a dd dos cursos
                            populateCoursesDD(school.courses, selectedCourse);
                        }
                    })
                }
            }
        );
        $.each(schoolsList, function (ischool, school) {

            $("#ddSchoolsList").append(
                $("<option>", {
                    html: school.name,
                    id: school.id, value: school.id
                })
            );
        })
        //Selecciona a escola passada por parametro
        if (selectedSchool) {
            $("#ddSchoolsList").val(selectedSchool)
            $("#ddSchoolsList").change();
        }
    }

};

window.populateCoursesDD = function (coursesList, selectedCourse) {

    $("#ddCoursesList").empty();

    //Se a escola nao possuir cursos associados
    if (coursesList.length == 0) {
        $("#ddCoursesList").append('<option value="" disabled selected>Sem cursos associados</option>');
    } else {
        console.log("getting courses")

        $("#ddCoursesList").append('<option value="" disabled selected>Curso</option>');
        $.each(coursesList, function (icourses, course) {
            console.log(course)
            $("#ddCoursesList").append(
                $("<option>", {
                    html: course.name,
                    id: course.id, value: course.id
                })
            );
        });
        //Selecciona a escola passada por parametro
        if (selectedCourse) {
            $("#ddCoursesList").val(selectedCourse)
        }
    }


};

window.populateCategoriesDD = function (selectedCategory) {
    var categories = new Categories();
    categories.fetch(function () {
        $.each(categories.models, function (icategory, category) {
            $("#ddCategoriesList").append(
                $("<option>", {
                    html: category.attributes.description,
                    id: category.attributes.id, value: category.attributes.id
                })
            );

        })
        //Selecciona a escola passada por parametro
        if (selectedCategory) {
            $("#ddCategoriesList").val(selectedCategory)
        }
    })
};

window.populateDificultyDD = function (selectedDif) {
    var $dd = $('<select>', {});
    $dd.append(
        $("<option>", {
            html: 'Fácil',
            value: 1
        })
    );
    $dd.append(
        $("<option>", {
            html: 'Médio',
            value: 2
        })
    );
    $dd.append(
        $("<option>", {
            html: 'Díficil',
            value: 3
        })
    );
    //Selecciona a escola passada por parametro
    if (selectedDif) {
        $dd.val(selectedDif)
    }
    console.log(selectedDif)
    console.log($("#ddDificuldade"))
    return $dd.html();
};


//Checks if all form inputs are OK
window.isFormValid = function (elementsList) {
    var isValid = true;
    $.each(elementsList, function (key, elem) {

        if (!$(elem).val()) {
            //Se for o b64, muda a border do pai
            if ($(elem).is("[type=hidden]")) {
                $(elem).parent().addClass("emptyField");
            }
            //Se o elemento for um select
            if ($(elem).is("select")) {
                // $(elem).parent().addClass("emptyField");
                $(elem).addClass("emptyField");

            }
            $(elem).addClass("emptyField");
            isValid = false;
            $("#infoPop").css("color", "#c9302c");
            $('#infoPop').popover("show");
            setTimeout(function () {
                $('#infoPop').popover("hide");
            }, 1500);
            isValid = false;
        } else {
            $(elem).removeClass("emptyField");
        }
    });
    return isValid;
}

window.getDifficulty = function (dif) {
    switch (dif) {
        case 1 :
            return 'Fácil';
        case 2:
            return 'Médio';
        case 3:
            return 'Díficil';
    }
}
window.populateLanguagessDD = function () {
    var languages = new Languages();
    languages.fetch(function () {
        $.each(languages.models, function (ilanguage, language) {
            $("#ddLanguagesList").append(
                $("<option>", {
                    html: language.attributes.description,
                    id: language.attributes.id, value: language.attributes.id
                })
            );

        })
    })


};

//http://cssload.net/en/spinners
window.loadingSpinner = function () {
    return $('<div>', {class: "cssload-container"}).append(
        $('<div>', {class: "cssload-whirlpool"}),
        $('<p>', {text: "A carregar..."})
    )
}
function updatePreview(c) {

    if (parseInt(c.w) > 0) {
        // Show image preview
        var imageObj = $("#viewport")[0];
        var canvas = $("#preview")[0];
        var context = canvas.getContext("2d");

        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0) {
            context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
        }

    }
}

