import { getPhotos } from './axiosFetcher.mjs';

let photos = [];
$("#load-more").click(loadMore);

// initial load
getPhotos(200, data => {
    let photoCollection = [];
    data.forEach((photo, index) => {
        photoCollection.push(photo);
        if (index % 40 == 39) {
            photos.push(photoCollection)
            photoCollection = [];
        }
    });

    photos[0].forEach(loadImage);
}, error => {
    console.log(`Houston, we have a problem: ${error}`);
});

// append photos to index
function loadImage(photo) {
    var $item = $("<div>").addClass("item");
    var $aTag = $("<a>");
    var $imgTag = $("<img>").attr('src', photo.thumbnailUrl);
    var $h3Tag = $("<h3>").text(photo.title);
    $aTag.append($imgTag);
    $item.append($aTag, $h3Tag);
    $item.click(openImg);
    
    $("#gallary").append($item);
}

function loadMore() {
    // current amount and devide 40 to get current index
    const i = Math.floor($("#gallary").children().length/40);

    // this check is to avoid index out of bound
    if (i < photos.length) {
        photos[i].forEach(loadImage);
    } else {
        alert(`Gallary Ends`);
    }
}

function openImg() {
    let i = $("#gallary").children().index(this);
    let firstIndex = Math.floor(i/40);
    let secondIndex = i%40;
    let url = photos[firstIndex][secondIndex].url;

    // let background unmoveable
    document.querySelector("body").classList.toggle("viewImg");

    // add view
    let $loadImg = $("<div>").addClass("load-img");
    let $imgContent = $("<div>").addClass("image-content");
    let $btn = $("<button>").addClass("close").text("close X").click(close);
    let $img = $("<img>").attr('src', url);

    $imgContent.append($btn, $img);
    $loadImg.append($imgContent);

    $("#openImg").append($loadImg);
}

function close() {
    document.querySelector("#openImg").textContent = '';
    document.querySelector("body").classList.toggle("viewImg");
}