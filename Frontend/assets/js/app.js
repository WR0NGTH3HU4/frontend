let booksTable = document.querySelector('.booksTable');
let authorsTable = document.querySelector('.authorsTable');

function LoadBooks() {
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', 'http://localhost:3000/books', true);
    xhrGet.send();

    xhrGet.onreadystatechange = function() {
        if (xhrGet.readyState === 4 && xhrGet.status === 200) {
            let items = JSON.parse(xhrGet.responseText);
            
            items.forEach(item => {
                let row = document.createElement('tr');
                
                // Cím cella
                let titleCell = document.createElement('td');
                titleCell.textContent = item.title;
                row.appendChild(titleCell);
                
                // Kiadás dátuma cella
                let dateCell = document.createElement('td');
                dateCell.textContent = item.release;
                row.appendChild(dateCell);
                
                // ISBN cella
                let isbnCell = document.createElement('td');
                isbnCell.textContent = item.ISBN;
                row.appendChild(isbnCell);
                
                // Szerző neve cella
                let authorCell = document.createElement('td');
                authorCell.textContent = item.authorName;
                row.appendChild(authorCell);
                
                // Szerző születési dátuma cella
                let birthDateCell = document.createElement('td');
                birthDateCell.textContent = item.authorBirth;
                row.appendChild(birthDateCell);
                
                // Módosítás gomb
                let updateCell = document.createElement('td');
                let updateBtn = document.createElement('button');
                updateBtn.textContent = "Módosítás";
                updateBtn.classList.add('btn', 'btn-warning');
                updateBtn.addEventListener('click', function(){
                    // Módosítás funkció
                });
                updateCell.appendChild(updateBtn);
                row.appendChild(updateCell);

                // Törlés gomb
                let deleteCell = document.createElement('td');
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = "Törlés";
                deleteBtn.classList.add('btn', 'btn-danger');
                deleteBtn.addEventListener('click', function(){
                    // Törlés funkció
                });
                deleteCell.appendChild(deleteBtn);
                row.appendChild(deleteCell);
                
                // Sor hozzáadása a táblához
                booksTable.appendChild(row);
            });
        }
    }
}
function LoadAuthors(){
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', 'http://localhost:3000/authors', true);
    xhrGet.send();

    xhrGet.onreadystatechange = function() {
        if (xhrGet.readyState === 4 && xhrGet.status === 200) {
            let items = JSON.parse(xhrGet.responseText);
            
            items.forEach(item => {
                let row = document.createElement('tr');
                
                let nameCell = document.createElement('td');
                nameCell.textContent = item.authorName;
                row.appendChild(nameCell);
                
                let birthCell = document.createElement('td');
                birthCell.textContent = item.authorBirth;
                row.appendChild(birthCell);
                
                
                // Módosítás gomb
                let updateCell = document.createElement('td');
                let updateBtn = document.createElement('button');
                updateBtn.textContent = "Módosítás";
                updateBtn.classList.add('btn', 'btn-warning');
                updateBtn.addEventListener('click', function(){
                    // Módosítás funkció
                });
                updateCell.appendChild(updateBtn);
                row.appendChild(updateCell);

                // Törlés gomb
                let deleteCell = document.createElement('td');
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = "Törlés";
                deleteBtn.classList.add('btn', 'btn-danger');
                deleteBtn.addEventListener('click', function(){
                    // Törlés funkció
                });
                deleteCell.appendChild(deleteBtn);
                row.appendChild(deleteCell);
                
                // Sor hozzáadása a táblához
                authorsTable.appendChild(row);
            });
        }
    }
}
function pushBook(){

}
function pushAuthor() {
    let authorName = document.querySelector('#authorName').value;
    let authorBirth = document.querySelector('#authorBirth').value;
    
    if (!authorName || !authorBirth) {
        alert('Kérlek, töltsd ki a szerző nevét és születési dátumát!');
        return;
    }

    var data = JSON.stringify({
        name: authorName,
        birth: authorBirth
    });

    let xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'http://localhost:3000/authors', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if (xhr.status == 202){
                alert("Szerző felvéve!")
            }else{
                alert(xhr.responseText);
            }
        }
    }
}

function getAuthorID(){
    
    let select = document.querySelector('select');
    
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', 'http://localhost:3000/authors', true);
    xhrGet.send();
    
    xhrGet.onreadystatechange = function() {
        if (xhrGet.readyState === 4 && xhrGet.status === 200) {
            let items = JSON.parse(xhrGet.responseText);

            items.forEach(item => {

                let option = document.createElement("option");
                option.value = item.id;
                option.textContent = item.authorName;

                select.appendChild(option);
            });
        }
    }
}

function pushBook(){
    let title = document.querySelector('#title').value;
    let release = document.querySelector('#release').value;
    let ISBN = document.querySelector('#ISBN').value;
    let select = document.querySelector('select').value;
    
    if (!title || !release || !ISBN) {
        alert('Kérlek, töltsd ki a mezőket!');
        return;
    }

    var data = JSON.stringify({
        title: title,
        release: release,
        ISBN: ISBN,
        authorID: select
    });

    let xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'http://localhost:3000/books', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if (xhr.status == 202){
                alert("Könyv felvéve!")
            }else{
                alert(xhr.responseText);
            }
        }
    }
}