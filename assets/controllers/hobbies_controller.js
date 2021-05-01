import {Controller} from 'stimulus';

/*
 * This is an example Stimulus controller!
 *
 * Any element with a data-controller="hello" attribute will cause
 * this controller to be executed. The name "hello" comes from the filename:
 * hello_controller.js -> "hello"
 *
 * Delete this file or adapt it for your use!
 */
export default class extends Controller {
    static targets = ["subcategories","indicator"]
    connect(){
        this.subcategoriesTarget.style.display="none";
        this.collapsed=true;
    }
    toggle() {
        if (this.collapsed) {
            this.indicatorTarget.classList.remove("fa-caret-right");
            this.indicatorTarget.classList.add("fa-caret-down");
            this.subcategoriesTarget.style.display = "block";
        } else {

            this.indicatorTarget.classList.add("fa-caret-right");
            this.indicatorTarget.classList.remove("fa-caret-down");
            this.subcategoriesTarget.style.display = "none";
        }

        this.collapsed = !this.collapsed
    }
}
