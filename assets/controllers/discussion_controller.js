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
    static targets = ["pullurl","pushurl", "timeleft", "output", "userid", "input"]

    connect() {
        this.userId = this.useridTarget.value
        const timeLimit = new Date(this.timeleftTarget.dataset.timeleft);
        this.timeleftTarget.textContent = Math.round(timeLimit.getTime() / 1000 - (new Date().getTime() / 1000)) + " seconds";
        this.pullMessages();

        setInterval(() => {
            this.timeleftTarget.textContent = Math.round(timeLimit.getTime() / 1000 - (new Date().getTime() / 1000)) + " seconds";
        }, 1000)
        setInterval(() => {
            this.pullMessages();
        }, 1000)
    }


    pullMessages() {
        fetch(this.pullurlTarget.value).then(response => {
            if (response.status == 403) {
                window.location.href = "/";
            }
            return response.json()
        })
            .then(data => {
                this.outputTarget.innerHTML = "";
                for (const msg of data) {
                    const el = document.createElement("div")
                    if (this.userId == msg.author) {
                        el.style.color = "blue";
                    } else {
                        el.style.color = "green";

                    }

                    el.innerHTML = msg.content + "<span style='float:right;'>" + msg.createdAt + "</span>";
                    this.outputTarget.appendChild(el)
                }

            });

        console.log("pulling");
    }

    send() {
        fetch(this.pushurlTarget.value, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.inputTarget.value) // body data type must match "Content-Type" header
        });
        this.inputTarget.value = "";
    }


}
