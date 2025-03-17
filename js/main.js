let eventBus = new Vue()
Vue.component('to-do-list', {
    props: {
        column1: {
            type: Array,
            required: true,
        },
        column2: {
            type: Array,
            required: true,
        },
        column3: {
            type: Array,
            required: true,
        }
    },
    template: `
    <div class="main-div">
        <div class="column first-column">
            <div v-for="card in column1" class="content">
                <h3>{{ card.name }}</h3>
                <ul v-for="task in card.tasks">
                    <li v-for="task in card.tasks">
                        <input type="checkbox" value="task">
                        {{ task }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column second-column">
            <div v-for="card in column2" class="content">
                <h3>{{ card.name }}</h3>
                <ul>
                    <li v-for="task in card.tasks">
                        <input type="checkbox" value="task">
                        {{ task }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column third-column">
            <div v-for="card in column3" class="content">
                <h3>{{ card.name }}</h3>
                <ul v-for="task in card.tasks">
                    <li v-for="task in card.tasks">
                        <input type="checkbox" value="task">
                        {{ task }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
        };
    },
    computed: {
    },
})

Vue.component('card-create', {
    props: {
        modalOpen: {
            type: Boolean,
            required: true
        },
        closeModal: {
            type: Function,
            required: true
        }
    },
    template: `
    <div class="modal" :class="{ closedModal: !modalOpen }>
        <form @submit.prevent="saveCard">
            <legend>Создание карточки</legend>
            <ul>
                <li v-for="error in errors">{{ error }}!</li>
            </ul>
            <input type="text" placeholder="Название карточки" v-model="name">
            <h5>Задания</h5>
            <button type="button" @click="addTask">Добавить задание</button>
            <div v-for="(input, index) in inputs" :key='index' id="tasker">
                <input type="text" placeholder="Задание" v-model="newTasks[index]">
            </div>
            <div>
                <input type="submit" value="Создать">
                <button type="button" @click=">Закрыть</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            name: '',
            newTasks: [],
            errors: [],
            inputs: 3,
        }
    },
    methods: {
        saveCard() {
            this.errors = []
            this.name = this.name.trim()
            for (let i = 0; i < this.newTasks.length; i++) {
                this.newTasks[i] = this.newTasks[i].trim()
                if (this.newTasks[i] === '') {
                    this.newTasks.splice(i, 1)
                    i--;
                }
            }
            if (!this.name || this.name === '') {
                this.errors.push("Введите название карточки")
            }
            if (this.newTasks.length < 3 || this.newTasks.length > 5) {
                this.errors.push("Добавьте от трех до пяти заданий")
            }
            if (this.name && this.newTasks.length <= 5 && this.newTasks.length >= 3) {
                let card = {
                    name: this.name,
                    tasks: [],
                }
                for (let i = 0; i < this.newTasks.length; i++) {
                    let task = {
                        taskName: this.newTasks[i],
                        taskCompleted: false,
                    };
                    card.tasks.push(task)
                }
                if(!this.cards) {
                    this.cards = []
                }
                this.cards.push(card);
                localStorage.setItem('cards', JSON.stringify(this.cards))
                eventBus.$emit('card-created', this.cards)
                this.name = null
                this.newTasks = []
            }
        },
        addTask() {
            this.errors = []
            if(this.inputs === 5) {
                this.errors.push("Больше пяти заданий сделать нельзя")
            } else {
                this.inputs++
            }
        },
        clickOnModal() {
            this.$emit('click-on-modal', this.modalOpen);
        },
    },
    computed: {
        cards() {
            let cards = JSON.parse(localStorage.getItem('cards'))
            if(!cards) {
                cards = []
            }
            return cards
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {
        column1: [],
        column2: [],
        column3: [],
        isModalOpen: false,
    },
    methods: {
        modalOpen() {
            return this.isModalOpen = true
        },
        modalClose() {
            return this.isModalOpen = false
        }
    }
})