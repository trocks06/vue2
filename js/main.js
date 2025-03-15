let eventBus = new Vue()
Vue.component('to-do-list', {
    props: {
        columns: {
            type: Array,
            required: true,
        }
    },
    template: `
    <div class="main-div">
        <div class="column first-column">
            <div v-for="card in cards" class="content">
                <h3>{{ card.name }}</h3>
                <ul v-for="task in card.tasks">
                <input type="checkbox" value="task">
                    {{ task }}
                </ul>
            </div>
        </div>
        <div class="column second-column">
        </div>
        <div class="column third-column">
        </div>
    </div>
    `,
    data() {
        return {
        };
    },
    computed: {
        cards() {
            return JSON.parse(localStorage.getItem('cards'));
        }
    },
    mounted() {
        eventBus.$on('card-added', cards => {
            cards.push(productReview)
        })
    }
})

Vue.component('card', {
    props: {
        cards: {
            type: Array,
            required: true,
        }
    },
    template: `
    <div class="card">
        <h3>{{ card.name }}</h3>
        <ul v-for="task in card.tasks">
            <input type="checkbox" value="task">
        </ul>
    </div>
    `,

})

Vue.component('card-create', {
    template: `
    <form @submit.prevent="cardCreate">
        <legend>Создание карточки</legend>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
        <input type="text" placeholder="Название карточки" v-model="name">
        <h5>Задания</h5>
        <button type="button" @click="addTasks">Добавить задание</button>
        <button type="button" @click="deleteTasks">Убрать задание</button>
        <div v-for="(input, index) in inputs" :key='index' id="tasker">
            <input type="text" placeholder="Задание" v-model="tasks[index]">
        </div>

        <div>
            <input type="submit" value="Создать">
        </div>

    </form>
    
    `,
    data() {
        return {
            name: null,
            tasks: [],
            cardNumber: 1,
            errors: [],
            inputs: 3,
        }
    },
    methods: {
        cardCreate() {
            this.errors = []
            if(!this.name) {this.errors.push("Введите название карточки")}
            if (this.tasks.length < 3 || this.tasks.length > 5) {
                this.errors.push("Добавьте от трех до пяти заданий")
            } else {
                let card = {
                    name: this.name,
                    tasks: this.tasks,
                }
                if(!this.cards) {
                    this.cards = []
                }
                this.cards.push(card);
                localStorage.setItem('cards', JSON.stringify(this.cards))
                eventBus.$emit('card-created', this.cards)
                this.name = null
                this.tasks = []
            }
        },
        addTasks() {
            this.errors = []
            if(this.inputs == 5) {
                this.errors.push("Больше пяти заданий добавить нельзя")
            } else {
                this.inputs++
            }
        },
        deleteTasks() {
            this.errors = []
            if(this.inputs == 3) {
                this.errors.push("Меньше трех заданий создать нельзя")
            } else {
                this.inputs--
            }
        }
    },
    computed: {
        cards() {
            let cards = JSON.parse(localStorage.getItem('cards'))
            if(!cards) {
                cards = []
            }
            return cards
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [],
        columns: ['first-column', 'second-column', 'third-column'],
    },
    methods: {
    }
})