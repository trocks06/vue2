Vue.component('to-do-list', {
    props: {
        column1: { type: Array, required: true },
        column2: { type: Array, required: true },
        column3: { type: Array, required: true }
    },
    template: `
    <div class="main-div">
        <div class="column first-column">
            <div v-for="(card, index) in column1" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex">
                        <input type="checkbox" 
                               :checked="task.taskCompleted" :disabled="column2.length >= 5"
                               @change="toggleTaskCompletion(card, task, 'column1', index)">
                        {{ task.taskName }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column second-column">
            <div v-for="(card, index) in column2" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex">
                        <input type="checkbox" 
                               :checked="task.taskCompleted"
                               @change="toggleTaskCompletion(card, task, 'column2', index)">
                        {{ task.taskName }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column third-column">
            <div v-for="(card, index) in column3" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex">
                        <input type="checkbox" 
                               :checked="task.taskCompleted"
                               @change="toggleTaskCompletion(card, task, 'column3', index)">
                        {{ task.taskName }}
                    </li>
                </ul>
                <p>Дата выполнения: {{ card.completedDate }}</p>
            </div>
        </div>
    </div>
    `,
    methods: {
        toggleTaskCompletion(card, task, column, index) {
            task.taskCompleted = !task.taskCompleted;
            this.checkTaskComplete(card, index, column);
            this.updateLocalStorage();
        },
        checkTaskComplete(card, index, column) {
            const tasks = card.tasks.length;
            const completedTasks = card.tasks.filter(task => task.taskCompleted).length;

            if (column === 'column1' && completedTasks >= tasks * 0.5) {
                this.$emit('move-to-column2', card, index, column);
            } else if (column === 'column2') {
                if (completedTasks < tasks * 0.5) {
                    this.$emit('move-to-column1', card, index);
                } else if (completedTasks === tasks) {
                    this.$emit('move-to-column3', card, index);
                    card.completedDate = new Date();
                    card.completedDate = card.completedDate.toLocaleString()
                }
            } else if (column === 'column3' && completedTasks != tasks) {
                this.$emit('move-to-column2', card, index, column);
            }
        },
        updateLocalStorage() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
        }
    }
});

Vue.component('card-create', {
    props: {
        isModalOpen: { type: Boolean, required: true },
        column1: { type: Array, required: true },
        column2: { type: Array, required: true },
        column3: { type: Array, required: true }
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
            <div v-for="(input, index) in inputs" :key="index" id="tasker">
                <input type="text" 
                       placeholder="Задание" 
                       v-model="newTasks[index]"
                       v-if="index < inputs">
            </div>
            <div>
                <input type="submit" value="Создать">
                <button type="button" @click="closeModal">Закрыть</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            name: '',
            newTasks: [],
            errors: [],
            inputs: 3
        }
    },
    methods: {
        saveCard() {
            this.errors = [];
            this.name = this.name.trim();
            this.newTasks = this.newTasks.filter(task => task && task.trim() !== '');

            if (!this.name) {
                this.errors.push("Введите название карточки");
            }
            if (this.newTasks.length < 3 || this.newTasks.length > 5) {
                this.errors.push("Добавьте от трех до пяти заданий");
            }
            if (this.name && this.newTasks.length >= 3 && this.newTasks.length <= 5) {
                let card = {
                    name: this.name,
                    tasks: this.newTasks.map(task => ({
                        taskName: task,
                        taskCompleted: false
                    })),
                    completedDate: null
                };
                this.$emit('add-card', card);
                this.closeModal();
                this.name = '';
                this.newTasks = [];
                this.inputs = 3;
            }
        },
        addTask() {
            this.errors = [];
            if (this.inputs >= 5) {
                this.errors.push("Больше пяти заданий сделать нельзя");
            } else {
                this.inputs++;
                this.newTasks.push('');
            }
        },
        closeModal() {
            this.$emit('modal-close');
            this.name = '';
            this.newTasks = [];
            this.inputs = 3;
            this.errors = [];
        },
    }
});

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
        moveToColumn2(card, index, column) {
            if (column === 'column1') {
                this.column1.splice(index, 1)
                this.column2.push(card);
            } else if (column === 'column3') {
                this.column3.splice(index, 1)
                this.column2.push(card);
            }
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
        },
    },
})