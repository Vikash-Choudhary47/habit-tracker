let habits = JSON.parse(localStorage.getItem('hList')) || ["testing study","python coding"];
let data = JSON.parse(localStorage.getItem('hStore'))||{};
let date = new Date ();   /*this store cureent date */

function render (){
    const m = date.getMonth();       /*getMonth() to get return 0-11*/
    const y =date.getFullYear();     /*getFullYear to get full year */
    const days = new Date(y,m+1,0).getDate();

    document.getElementById('month-display').innerText= date.toLocaleString('default',{month : 'long',year: 'numeric'});

    let h = `<tr><th class ="habit-cell">Habit</th><th>Del</th>`;
    for (let i=1 ;i<= days;i++)h += `<th>${i}</th>`;
    h += `</tr>`;
    document.getElementById('table-head').innerHTML = h; 

    let b ="";
    habits.forEach((habit, i)=> {
        b += `<tr class = "habit-row">
            <td class="habit-cell">${habit}</td>
            <td><button class = "delete-btn" onclick ="del(${i})">❌</button></td>`;

         for(let d=1 ; d<= days; d++){
            let k = `${y}-${m}-${habit}-${d}`;
            b+= `<td><input type ="checkbox" onchange ="chk('${k}',this)" ${data[k] ? 'checked': '' }></td>`;
        }
        b+= `</tr>`;
    });

    document.getElementById('table-body').innerHTML = b ;
    
    updateDailyProgress();

}

function chk (k,e) {
    data[k]= e.checked;
    localStorage.setItem('hStore', JSON.stringify(data));
    updateDailyProgress();
}

function addHabit(){
    let v = document.getElementById('habit-name').value ;
    if(v) {
        habits.push(v);
        localStorage.setItem('hList', JSON.stringify(habits));
        document.getElementById('habit-name').value ="";
        render();
    }
}

function del(i) {
    if(confirm("are you sure you want to delete this ?")) {

        const removedHabit = habits[i];

        Object.keys(data).forEach(key => {
            if (key.includes(removedHabit)) {
                delete data [key];
            }
        })

        habits.splice(i,1);

        localStorage.setItem('hList',JSON.stringify(habits));
        localStorage.setItem('hStore',JSON.stringify(data));
        render();
    }
}
function moveMonth(d) {
    date.setMonth(date.getMonth() + d );
    render();
}

function updateDailyProgress() {
    const todayDate = new Date();
    const currentMonth = todayDate.getMonth();
    const currentYear = todayDate.getFullYear();
    const today = todayDate.getDate();

    if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
        document.getElementById('daily-bar').style.width = "0%";
        document.getElementById('daily-percent').innerText = "0%";
        return;
    }
    if (habits.length === 0 ) {
        document.getElementById('daily-bar').style.width = "0%";
        document.getElementById('daily-percent').innerText = "0%";
        return ;
    }
    let completedToday = 0 ;

    habits.forEach((habit,i) => {
        const key = `${currentYear}-${currentMonth}-${habit}-${today}`;
        if (data[key]) completedToday++;

    });

    const percent = Math.round((completedToday / habits.length)*100);

    document.getElementById('daily-bar').style.width = percent + "%";
    document.getElementById('daily-percent').innerText = percent + "%";
}
document.getElementById("habit-name")
    .addEventListener("keypress", function(e){
        if (e.key === "Enter") addHabit();
    });
    window.onload = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme',savedTheme);
        }
        render();
    }

    