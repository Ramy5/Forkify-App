import View from "./ParentViews/view";

class UploadRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _form = document.querySelector(".upload__recipe form");
  _overlay = document.querySelector(".upload__recipe .overlay");
  _closeBtn = document.querySelector(".upload__recipe .upload__close");
  _openRecipeBtn = document.querySelector(".recipe__btn");
  _succesMessage = "Congratulation, Recipe was successfully uploaded ;) ";

  constructor() {
    super(); // WE NEED THIS SO WE CAN USE THE THIS KEY WORD
    this._addHandlerToggleModel();
    this._addHandlerCloseModel();
  }

  addHandlerToggler() {
    this._parentElement.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerToggleModel() {
    this._openRecipeBtn.addEventListener(
      "click",
      this.addHandlerToggler.bind(this)
    );
  }

  _addHandlerCloseModel() {
    this._closeBtn.addEventListener("click", this.addHandlerToggler.bind(this));
    this._overlay.addEventListener("click", this.addHandlerToggler.bind(this));
  }

  _addHandlerUpload(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      const dataArr = []; // ALL DATA
      const ingredients = []; // JUST INGREDIENTS DATA IN ONE ARRAY

      this._form.querySelectorAll("li").forEach((el) => {
        let name; // NAME OF PROPERTY
        let ingValue = ""; // INGREDIENT VALUE (QUANTITY, UNIT, DESCRIPTION)
        let value; // VALUE OF PROPERTY

        // LAST CHILD IS INPUT DIRECTLY
        if (el.lastElementChild.value) {
          name = el.firstElementChild.dataset.name;
          value = el.lastElementChild.value;

          // LAST CHILD IS A DIV CONTAINS INPUTS (INGREDIENTS)
        } else {
          // SELECT ALL INPUTS IN THAT DIV AND GET ALL VALU IN ONE PLACE => (ingValue)
          el.lastElementChild
            .querySelectorAll("input")
            .forEach((inp) => (ingValue += `${inp.value},`));

          // CHECK FOR IF THERE IS ANY OF INGREDIENTS THAT ALL VALUES IN IT IS EMPTY
          if (
            ingValue
              .trim()
              .split(",")
              .every((el) => el === "")
          ) {
            return;

            // NOT EMPTY
          } else {
            const [quantity, unit, description] = ingValue.trim().split(",");
            name = "ingredients";

            // ALL INGREDIENTS IN ONE PLACE => (ingredients)
            ingredients.push({
              quantity: quantity ? +quantity : null,
              unit: unit.trim(),
              description: description.trim(),
            });

            value = ingredients;
          }
        }

        dataArr.push([name, value]);
      });

      // CONVERT ARRAY TO OBJECT
      const dataObj = Object.fromEntries(dataArr);
      handler(dataObj);
    });
  }
}

export default new UploadRecipeView();
