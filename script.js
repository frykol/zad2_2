(function () {
  const example = document.getElementById('example')
  const cw1 = document.getElementById('cw1')
  const cw2 = document.getElementById('cw2')
  const cw3 = document.getElementById('cw3')
  const answer = document.getElementById('answer')
  const status = document.getElementById('status')
  const table = document.getElementById('table')
  const tableBody = table.querySelector('tbody')
  const popup = document.getElementById('popup');
  popup.style.display = 'none';

  const select = document.getElementById('select');

  const form = document.getElementById('form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    tableBody.replaceChildren();
    
    const formData = new FormData(form);
    const post = {
      title: formData.get('title'),
      body: formData.get('body'),
      userId: 1
    };

    const createdPost = await CreatePost(post);
      answer.innerHTML = 'Dodano nowy post o id: ' + createdPost.id + '<br>' + JSON.stringify(createdPost, null, 2);
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
    popup.style.display = isLoading ? 'block' : 'none';
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

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const array = await response.json();
      console.log(array);
      await wait(1000);
      return array;
    } finally {
      setLoading(false);
    }
  }

  const fetchPostById = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const post = await response.json();
      console.log(post);
      await wait(1000);
      return post;
    } finally {
      setLoading(false);
    }
  }

  const CreatePost = async (post) => {
    setProcessing(true);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const createdPost = await response.json();
      console.log(createdPost);
      await wait(1000);
      return createdPost;
    } finally {
      setProcessing(false);
    }
  }

  const writePostsToTable = (posts) => {
    tableBody.replaceChildren();
    posts.forEach(post => {
      let newRow = document.createElement('tr');
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
      tableBody.appendChild(newRow);
    });
    table.style.display = '';
  }

  example.addEventListener("click", async function () {
    tableBody.replaceChildren();
    const array = await fetchPosts();
    answer.textContent = JSON.stringify(array, null, 2);
  })

  cw1.addEventListener("click", async function () {
    tableBody.replaceChildren();
    const array = await fetchPosts();
    answer.innerHTML = '';
    writePostsToTable(array);
  })

  cw2.addEventListener("click", async function () {
    tableBody.replaceChildren();
    let id = select.value;
    const post = await fetchPostById(id);
    answer.innerHTML = '';
    console.table(post);
    writePostsToTable([post]);
  })

  cw3.addEventListener("click", function () {
    tableBody.replaceChildren();
    //TODO
  })

})();
