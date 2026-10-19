(function () {
  const example = document.getElementById('example')
  const cw1 = document.getElementById('cw1')
  const cw2 = document.getElementById('cw2')
  const cw3 = document.getElementById('cw3')
  const answer = document.getElementById('answer')
  const status = document.getElementById('status')
  const table = document.getElementById('table')
  const tableBody = table.querySelector('tbody')

  const select = document.getElementById('select');

  const form = document.getElementById('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const post = {
      title: formData.get('title'),
      body: formData.get('body'),
      userId: 1
    };

    CreatePost(post).then(createdPost => {
      answer.innerHTML = 'Dodano nowy post o id: ' + createdPost.id + '<br>' + JSON.stringify(createdPost, null, 2);
    });
  });

  for (let i = 0; i< 10; i++) {
    let option = document.createElement("option");
    option.value = i + 1;
    option.textContent = i + 1;
    select.appendChild(option);
  }

  let isLoading = false;
  let isProcessing = false;

  const updateStatus = () => {
    const messages = [];
    if (isLoading) messages.push('Loading...');
    if (isProcessing) messages.push('Processing...');
    status.textContent = messages.join(' ');
  }

  const setProcessing = (processing) => {
    isProcessing = processing;
    updateStatus();
  }

  const setLoading = (loading) => {
    isLoading = loading;
    updateStatus();
  }

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchPosts = () => {
    setLoading(true);

    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(async (array) => {
        console.log(array)
        await wait(1000);
        return array;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const fetchPostById = (id) => {
    setLoading(true);

    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => response.json())
      .then(async (post) => {
        console.log(post)
        await wait(1000);
        return post;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const CreatePost = (post) => {
    setProcessing(true);

    return fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async (post) => {
        console.log(post)
        await wait(1000);
        return post;
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  const writePostsToTable = (posts) => {
    tableBody.replaceChildren();
    posts.forEach(post => {
      let newRow = document.createElement('tr');
      tableBody.appendChild(newRow);
      const row = tableBody.insertRow();
      [post.title, post.body, post.id, post.userId].forEach(value => {
        let newCell = document.createElement('td');
        if (value === post.title) {
          newCell.id = 'title';
        }
        if (value === post.body) {
          newCell.id = 'body';
        }
        newRow.appendChild(newCell);
        newCell.textContent = value;
      });
    });
    table.style.display = '';
  }

  example.addEventListener("click", function () {
    fetchPosts().then(array => {
      answer.textContent = JSON.stringify(array, null, 2);
    })
  })

  cw1.addEventListener("click", function () {
    fetchPosts().then(array => {
      answer.innerHTML = '';
      writePostsToTable(array);
    });
  })

  cw2.addEventListener("click", function () {
    let id = select.value;
    fetchPostById(id).then(post => {
      answer.innerHTML = '';
      console.table(post);
      writePostsToTable([post]);
    });
  })

  cw3.addEventListener("click", function () {
    //TODO
  })

})();
