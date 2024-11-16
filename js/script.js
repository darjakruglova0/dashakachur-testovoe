// реализовала спомощью и jquery и спомощью чистого javascript а можно еще валидацию частично настроить через сам bootstrap 5


document.addEventListener("DOMContentLoaded", function () {

  const submitButton = document.getElementById("submitButton"); // Найдите кнопку отправки

  // Функция для проверки валидности формы и обновления состояния кнопки отправки
  function toggleSubmitButton() {
    // Проверка: если форма валидна, разблокируйте кнопку, иначе блокируйте
    if ($("#form").valid()) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }
  // Плавная прокрутка к блокам
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach((smoothLink) => {
    smoothLink.addEventListener("click", function (e) {
      e.preventDefault();
      const id = smoothLink.getAttribute("href");

      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // Поля для телефона
  let phoneFieldCount = 1;
  const maxPhones = 5;

  const addPhoneButton = document.getElementById("addPhoneButton");
  const phoneFieldsContainer = document.getElementById("phoneFieldsContainer");

  addPhoneButton.addEventListener("click", function () {
    if (phoneFieldCount < maxPhones) {
      const phoneFieldHTML = `
        <div class="phone-field">
          <select name="countryCode[]" class="form-select">
            <option value="+375" selected>+375</option>
            <option value="+7">+7</option>
          </select>
          <input type="text" class="form-control phone" name="phone[]" placeholder="Telefon" required>
          <button type="button" class="removePhoneButton btn btn-danger btn-sm">-</button>
        </div>`;
      phoneFieldsContainer.insertAdjacentHTML("beforeend", phoneFieldHTML);

      phoneFieldCount++;

      const removePhoneButton = phoneFieldsContainer.lastElementChild.querySelector(".removePhoneButton");
      removePhoneButton.addEventListener("click", function () {
        phoneFieldsContainer.removeChild(removePhoneButton.parentElement);
        phoneFieldCount--;
      });
    }
  });
// Находим модальное окно по ID
const modal = new bootstrap.Modal(document.getElementById("successModal"));
const modalBody=document.querySelector('.modal-body');
  // Валидация формы с jQuery Validate
  $("#form").validate({
    rules: {
      name: { required: true, minlength: 3, maxlength: 50 },
      surname: { required: true },
      date: { required: true },
      "phone[]": { minlength: 7, maxlength: 12, digits: true },
      email: { email: true },
      status: { required: true },
      check: { required: true },
    },
    messages: {
      name: "Введите имя",
      surname: "Введите фамилию",
      date: "Введите дату рождения",
      email: "Введите корректный email",
      "phone[]": "Введите корректный номер телефона от 7 до 12 цифр",
      status: "Выберите статус",
      check: "Подтвердите ознакомление",
    },
    errorPlacement: function (error, element) {
      error.addClass("text-danger");
      element.closest("div").append(error);
    },
   // Обновляем состояние кнопки при изменении данных в форме
   onkeyup: toggleSubmitButton,
   onfocusout: toggleSubmitButton,


   
    submitHandler: async function (form) {

      // Предотвращаем стандартную отправку
      event.preventDefault();


       // Предотвращаем отправку, если форма невалидна
 $("#form").on("submit", function (event) {
  if (!$("#form").valid()) {
    event.preventDefault(); // Блокируем отправку
    toggleSubmitButton();   // Обновляем состояние кнопки
  }
});
      const formData = new FormData(form);

      // Проверяем, чтобы было заполнено хотя бы одно поле: Email или Телефон
      const email = formData.get("email")?.trim();
      const phones = Array.from(formData.getAll("phone[]")).filter((p) => p.trim());

      if (!email && phones.length === 0) {
        alert("Пожалуйста, заполните хотя бы одно поле: Email или Телефон.");
        return;
      }

      try {
        const response = await fetch("server.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          //alert("Успешно!");
          modalBody.innerHTML+="Форма успешно отправлена";
          modal.show();
        
          document.querySelector('.success-result').innerHTML+="Форма успешно отправлена";
          form.reset(); // Очистить форму после отправки
        } else {
          alert("Ошибка при отправке формы.");
        }
      } catch (error) {
        alert("Произошла ошибка при отправке данных.");
      }
    },
  });
});




  //     $("#form").validate({
  //         errorClass: "is-invalid",
  //         validClass: "is-valid",
  //         errorPlacement: function(error, element) {
  //             error.addClass("text-danger");
  //             element.closest('div').find('.error-message').append(error);
  //         },
  //         rules: {
  //             name: { required: true },
  //             surname: { required: true },
  //             date: { required: true },
  //             "contact-info": { 
  //                 require_from_group: [1, ".contact-info"]
  //             },
  //             phone: {
  //                 require_from_group: [1, ".contact-info"],
  //                 digits: true,
  //                 minlength: 7,
  //                 maxlength: 12
  //             },
  //             email: {
  //                 require_from_group: [1, ".contact-info"],
  //                 email: true
  //             },
  //             status: { required: true },
  //             check: { required: true }
  //         },
  //         messages: {
  //             name: "Введите имя",
  //             surname: "Введите фамилию",
  //             date: "Введите дату рождения",
  //             email: "Введите корректный email",
  //             phone: "Введите корректный номер телефона от 7 до 12 цифр",
  //             status: "Выберите статус",
  //             check: "Подтвердите ознакомление"
  //         },
  //         // Функция, активирующая кнопку отправки
  //         highlight: function(element) {
  //             $(element).addClass("is-invalid").removeClass("is-valid");
  //         },
  //         unhighlight: function(element) {
  //             $(element).addClass("is-valid").removeClass("is-invalid");
  //             checkFormValidity();
  //         },
  //         submitHandler: function(form) {
  //             form.submit();
  //         }
  //     });
  
  //     function checkFormValidity() {
  //         if ($("#form").valid()) {
  //             $("button[type=submit]").prop("disabled", false);
  //         } else {
  //             $("button[type=submit]").prop("disabled", true);
  //         }
  //     }
  // });
  


