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
            <div v-for="(card, index) in column1" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, index) in card.tasks" :key="index">
                        <input type="checkbox" :checked="task.taskCompleted"
                        @change="toggleTaskCompletion(task, index)">
                        {{ task.taskName }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column second-column">
            <div v-for="(card, index) in column2" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, index) in card.tasks" :key="index">
                        <input type="checkbox" :checked="task.taskCompleted"
                        @change="toggleTaskCompletion(task, index)">
                        {{ task.taskName }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column third-column">
            <div v-for="(card, index) in column3" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, index) in card.tasks" :key="index">
                        <input type="checkbox" :checked="task.taskCompleted"
                        @change="toggleTaskCompletion(task)">
                        {{ task.taskName }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `,
    data() {
        return {};
    },
    methods: {
        toggleTaskCompletion(task) {
            task.taskCompleted = !task.taskCompleted;
            this.updateLocalStorage()
        },
        checkTaskComplete(card, index, column) {
            let tasks = card.tasks.length
            let completedTasks = card.tasks.filter(task => task.taskCompleted).length;
            if (column === 'column1') {
                if (completedTasks >= tasks * 0.5) {
                    this.$emit('move-to-column2', card, index);
                }
            } else if (column === 'column2') {
                if (completedTasks < tasks * 0.5) {
                    this.$emit('move-to-column1', card, index);
                } else if (completedTasks === tasks) {
                    this.$emit('move-to-column3', card, index);
                }
            } else if (column === 'column3') {
                if (completedTasks >= tasks * 0.5) {
                    this.$emit('move-to-column2', card, index);
                }
            }

            this.updateLocalStorage()
        },
        updateLocalStorage() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
        }
    },
})

Vue.component('card-create', {
    props: {
        isModalOpen: {
            type: Boolean,
            required: true
        },
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
    <div v-show="isModalOpen" class="modal">
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
                <button type="button" @click="closeModal"">Закрыть</button>
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
                this.$emit('add-card', card);
                this.closeModal();
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
        closeModal() {
            this.$emit('modal-close');
        },
    },
})

Vue.component('column-block', {
    template: `
    <div class="block">
        
    </div>
    `
})

let app = new Vue({
    el: '#app',
    data: {
        isModalOpen: false,
        column1: JSON.parse(localStorage.getItem('column1')) || [],
        column2: JSON.parse(localStorage.getItem('column2')) || [],
        column3: JSON.parse(localStorage.getItem('column3')) || [],
    },
    methods: {
        modalOpen() {
            this.isModalOpen = true;
        },
        modalClose() {
            this.isModalOpen = false;
        },
        addCard(card) {
            this.column1.push(card);
            this.saveColumnData();
        },
        moveToColumn1(card, index) {
            this.column2.splice(index, 1)
            this.column1.push(card);
            this.saveColumnData()
        },
        moveToColumn2(card, index) {
            this.column1.splice(index, 1)
            this.column2.push(card);
            this.saveColumnData()
        },
        moveToColumn3(card, index) {
            this.column2.splice(index, 1)
            this.column3.push(card);
            this.saveColumnData()
        },
        saveColumnData() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
        }
    },
    watch: {
        column1(newVal) {
            newVal.forEach((card, index) => {
                this.checkTaskComplete(card, index, 'column1');
            });
        },
        column2(newVal) {
            newVal.forEach((card, index) => {
                this.checkTaskComplete(card, index, 'column2');
            });
        },
        column3(newVal) {
            newVal.forEach((card, index) => {
                this.checkTaskComplete(card, index, 'column3');
            });
        },
    }
})