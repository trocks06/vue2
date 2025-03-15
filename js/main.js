Vue.component('to-do-list', {
    props: {
        cards: {
            type: Array,
            required: true,
        },
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
            cards: localStorage.getItem('cards'),
        };
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
        <input type="text" placeholder="Задание">
        <div>
            <input type="submit" value="Добавить задание">
            <input type="submit" value="Создать">
        </div>

    </form>
    
    `,
    data() {
        return {
            name: null,
            tasks: [],
            errors: [],
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
                localStorage.setItem('card' + '2', JSON.stringify(card))
                this.name = null
                this.tasks = null
            }
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