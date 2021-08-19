const client = ZAFClient.init();

const settings = {
    url: 'https://api.thecatapi.com/v1/images/search?format=json',
    headers: {"x-api-key": "{{setting.api_token}}"},
    secure: true,
    type: 'GET',
    contentType: 'application/json'
};

const newCatButton = document.getElementById('new-cat-button')

const sendCatButton = document.getElementById('send-cat-button')

const renderImage = (catPictureLink) => {
    const catPictureElement = document.querySelector("img[id='cat-picture']");
    catPictureElement.src = catPictureLink;
}

const fetchNewCat = () => {
    client.request(settings).then(function (data) {
        const catImageLink = data['0']['url'];
        renderImage(catImageLink);
    });
}

const attachCatToTicketComment = () => {
    const catImageSource = document.querySelector("img[id='cat-picture']").src;
    client.invoke('comment.appendHtml', `<img src="${catImageSource}" height="200" width="250">`)
}

client.on('app.registered', function () {
    fetchNewCat();
});

newCatButton.addEventListener('click', fetchNewCat);

sendCatButton.addEventListener('click', attachCatToTicketComment);
