let booksTable = document.querySelector('.booksTable');
let authorsTable = document.querySelector('.authorsTable');

//GET functions
function LoadBooks() {
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', 'http://localhost:3000/books', true);
    xhrGet.send();

    xhrGet.onreadystatechange = function() {
        if (xhrGet.readyState === 4) {
            if (xhrGet.status === 200) {
                let items = JSON.parse(xhrGet.responseText);
                booksTable.innerHTML = ''; // Töröld a táblázat tartalmát, mielőtt új sorokat hozzáadsz

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
                        openUpdateModal(item.id);
                    });
                    updateCell.appendChild(updateBtn);
                    row.appendChild(updateCell);

                    // Törlés gomb
                    let deleteCell = document.createElement('td');
                    let deleteBtn = document.createElement('button');
                    deleteBtn.textContent = "Törlés";
                    deleteBtn.classList.add('btn', 'btn-danger');
                    deleteBtn.addEventListener('click', function(){
                        DeleteBook(item.id); 
                    });
                    deleteCell.appendChild(deleteBtn);
                    row.appendChild(deleteCell);

                    // Sor hozzáadása a táblához
                    booksTable.appendChild(row);
                });
            } else {
                console.error('Hiba történt a könyvek betöltésekor: ', xhrGet.responseText);
            }
        }
    }
}

function LoadAuthors() {
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', 'http://localhost:3000/authors', true);
    xhrGet.send();

    xhrGet.onreadystatechange = function () {
        if (xhrGet.readyState === 4 && xhrGet.status === 200) {
            let items = JSON.parse(xhrGet.responseText);
            
            authorsTable.innerHTML = ''; // Clear the table before adding new rows

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
                updateBtn.addEventListener('click', function () {
                    openAuthorUpdateModal(item.id);  // Open modal with author data
                });
                updateCell.appendChild(updateBtn);
                row.appendChild(updateCell);

                // Törlés gomb
                let deleteCell = document.createElement('td');
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = "Törlés";
                deleteBtn.classList.add('btn', 'btn-danger');
                deleteBtn.addEventListener('click', function () {
                    DeleteAuthors(item.id);  // Use the correct ID for deletion
                });
                deleteCell.appendChild(deleteBtn);
                row.appendChild(deleteCell);
                
                // Sor hozzáadása a táblához
                authorsTable.appendChild(row);
            });
        }
    }
}

//POST functions
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

function getAuthorID(selectedAuthorId = null) {
    let select = document.querySelector('select[name="authorID"]');
    select.innerHTML = ''; 

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

            
                if (item.id === selectedAuthorId) {
                    option.selected = true;
                }

                select.appendChild(option);
            });
        }
    };
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

// DELETE  functions
function DeleteBook(bookID) {
    if (!bookID) {
        alert("Érvénytelen könyv azonosító!");
        return;
    }

    if (confirm("Biztosan törölni szeretnéd ezt a könyvet?")) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:3000/books/${bookID}`, true);  
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    alert("Könyv sikeresen törölve!");
                    location.reload();  
                } else {
                    alert("Hiba történt a könyv törlésekor: " + xhr.responseText);
                }
            }
        };
    }
}

function DeleteAuthors(authorID) {
    if (!authorID) {
        alert("Érvénytelen szerző azonosító!");
        return;
    }

    if (confirm("Biztosan törölni szeretnéd ezt a szerzőt?")) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:3000/authors/${authorID}`, true);  
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    alert("Szerző sikeresen törölve!");
                    location.reload();  
                } else {
                    alert("Hiba történt a szerző törlésekor: " + xhr.responseText);
                }
            }
        };
    }
}

//PATCH functions
function openUpdateModal(bookID) {
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', `http://localhost:3000/books/${bookID}`, true);
    xhrGet.send();

    xhrGet.onreadystatechange = function() {
        if (xhrGet.readyState === 4 && xhrGet.status === 200) {
            let book = JSON.parse(xhrGet.responseText);
    
            document.querySelector('#title').value = book.title;
            document.querySelector('#release').value = book.release;
            document.querySelector('#ISBN').value = book.ISBN;

   
            getAuthorID(book.authorID);


            let modal = new bootstrap.Modal(document.querySelector('.modal'));
            modal.show();

            document.querySelector('.modal-footer .btn-primary').onclick = function() {
                updateBook(bookID);
            };
        } else if (xhrGet.readyState === 4) {
            console.error('Hiba történt a könyv betöltésekor: ', xhrGet.responseText);
        }
    };
}


function updateBook(bookID) {
    let title = document.querySelector('#title').value;
    let release = document.querySelector('#release').value;
    let ISBN = document.querySelector('#ISBN').value;
    let authorID = document.querySelector('select[name="authorID"]').value;

    if (!title || !release || !ISBN) {
        alert('Kérlek, töltsd ki a mezőket!');
        return;
    }

    var data = JSON.stringify({
        title: title,
        release: release,
        ISBN: ISBN,
        authorID: authorID
    });

    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', `http://localhost:3000/books/${bookID}`, true); 
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                alert("Könyv módosítva!");
                location.reload(); 
            } else {
                alert(xhr.responseText);
            }
        }
    };
}

function openAuthorUpdateModal(authorID) {
    let xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', `http://localhost:3000/authors/${authorID}`, true);
    xhrGet.send();

    xhrGet.onreadystatechange = function() {
        if (xhrGet.readyState === 4 && xhrGet.status === 200) {
            let author = JSON.parse(xhrGet.responseText);
            
           
            document.querySelector('#authorName').value = author.authorName;
            document.querySelector('#authorBirth').value = author.authorBirth;

          
            let modal = new bootstrap.Modal(document.querySelector('.modal'));
            modal.show();

            document.querySelector('.modal-footer .btn-primary').onclick = function() {
                updateAuthor(authorID);
            };
        } else if (xhrGet.readyState === 4) {
            console.error('Hiba történt a szerző betöltésekor: ', xhrGet.responseText);
        }
    };
}


function updateAuthor(authorID) {
    let authorName = document.querySelector('#authorName').value;
    let authorBirth = document.querySelector('#authorBirth').value;

    if (!authorName || !authorBirth) {
        alert('Kérlek, töltsd ki a mezőket!');
        return;
    }

    var data = JSON.stringify({
        name: authorName,
        birth: authorBirth
    });

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/authors/${authorID}`, true); 
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                alert("Szerző módosítva!");
                location.reload(); 
            } else {
                alert(xhr.responseText);
            }
        }
    };
}

let updateBtn = document.createElement('button');
updateBtn.textContent = "Módosítás";
updateBtn.classList.add('btn', 'btn-warning');
updateBtn.addEventListener('click', function(){
    openUpdateModal(item.id);  
});