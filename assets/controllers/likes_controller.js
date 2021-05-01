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
    static targets = ["outputlikes", "outputdislikes"]

    connect() {
        this.likeList = {};
        this.dislikeList = {};
        this.likeList = JSON.parse(this.outputlikesTarget.value);
        this.dislikeList = JSON.parse(this.outputdislikesTarget.value);
        for (let i = 0; i < Object.keys(this.likeList).length; i++) {
            const k = Object.keys(this.likeList)[i];
            const e = this.element.querySelector("[data-ref='" + this.likeList[k] + "'] .like")
            e.classList.remove("fal")
            e.classList.add("fas")
        }
        for (let i = 0; i < Object.keys(this.dislikeList).length; i++) {
            const k = Object.keys(this.dislikeList)[i];
            const e = this.element.querySelector("[data-ref='" + this.dislikeList[k] + "'] .dislike")
            e.classList.remove("fal")
            e.classList.add("fas")
        }
    }

    like(event) {

        const id = event.srcElement.dataset.id
        const name = event.srcElement.dataset.name
        if (this.dislikeList[id]) {
            delete this.dislikeList[id];
            event.srcElement.parentElement.querySelector(".dislike").classList.remove("fas")
            event.srcElement.parentElement.querySelector(".dislike").classList.add("fal")
        }
        if (this.likeList[id]) {
            delete this.likeList[id];


            event.srcElement.parentElement.querySelector(".like").classList.remove("fas")
            event.srcElement.parentElement.querySelector(".like").classList.add("fal")
        } else {
            this.likeList[id] = name;

            event.srcElement.parentElement.querySelector(".like").classList.remove("fal")
            event.srcElement.parentElement.querySelector(".like").classList.add("fas")
        }
        this.updateShow()


    }

    dislike(event) {
        const id = event.srcElement.dataset.id
        const name = event.srcElement.dataset.name
        if (this.dislikeList[id]) {
            delete this.dislikeList[id];

            event.srcElement.parentElement.querySelector(".dislike").classList.remove("fas")
            event.srcElement.parentElement.querySelector(".dislike").classList.add("fal")
        } else {
            this.dislikeList[id] = name;

            event.srcElement.parentElement.querySelector(".dislike").classList.remove("fal")
            event.srcElement.parentElement.querySelector(".dislike").classList.add("fas")

        }
        if (this.likeList[id]) {

            event.srcElement.parentElement.querySelector(".like").classList.remove("fas")
            event.srcElement.parentElement.querySelector(".like").classList.add("fal")
            delete this.likeList[id];
        }
        this.updateShow()


    }

    updateShow() {
        this.outputlikesTarget.value = JSON.stringify(this.likeList)
        this.outputdislikesTarget.value = JSON.stringify(this.dislikeList)
    }
}
