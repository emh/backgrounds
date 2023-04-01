import { images } from './images.mjs';

let image = null;
let upload = null;

const get = (id) => document.getElementById(id);
const query = (q) => document.querySelector(q);
const clear = (el) => el.innerHTML = '';
const clone = (template) => template.content.firstElementChild.cloneNode(true);
const valueOf = (name) => document.querySelector(`[name="${name}"]`).value;

const div = (...classes) => {
    const el = document.createElement('div');

    classes.forEach((c) => el.classList.add(c));

    return el;
};

const thumbnail = (src) => {
    const el = document.createElement('img');
    el.className = 'thumbnail';
    el.setAttribute('src', src);

    el.addEventListener('click', selectImage);

    return el;
};

const templateImage = (src) => {
    const el = document.createElement('img');
    el.className = 'template-image';
    el.setAttribute('src', src);

    return el;
}

const dropzone = () => {
    const el = div('upload');

    el.innerHTML = '+';

    el.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            console.log(file);
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                console.log('loaded', reader.result);

                uploadImage(reader.result);
            });

            reader.readAsDataURL(file);
        });

        fileInput.click();
    });

    return el;
}

const uploadImage = (data) => {
    upload = data;
    render();
};

const selectImage = (e) => {
    image = e.target.getAttribute('src');
    render();
};

const clearImage = () => {
    image = null;
    upload = null;
    render();
};

const generateImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const container = get('generated-image');

    clear(container);

    const tileSize = Number(valueOf('tile-size'));
    const width = Number(valueOf('width'));
    const height = Number(valueOf('height'));

    canvas.style.visibility = 'hidden';
    canvas.width = width;
    canvas.height = height;

    const tile = query('.template-image');

    const targetImg = document.createElement('img');
    container.append(targetImg);

    let x = 0;
    let y = 0;

    while (y < height) {
        console.log({ x, y, width, height });
        ctx.drawImage(tile, x, y, tileSize, tileSize);

        x += tileSize;

        if (x > width) {
            x = 0;
            y += tileSize;
        }
    }

    targetImg.src = canvas.toDataURL();
};

function renderGallery() {
    const app = get('app');

    app.style.backgroundImage = null;
    clear(app);

    const gallery = div('gallery');

    gallery.append(dropzone());
    gallery.append(...images.map(thumbnail));

    app.append(gallery);
};

function renderForm() {
    const app = get('app');

    clear(app);

    app.style.backgroundImage = `url('${image || upload}')`;

    app.append(templateImage(image || upload));

    const form = clone(get('form-template'));

    const cancel = form.querySelector('.cancel');
    cancel.addEventListener('click', clearImage);

    const ok = form.querySelector('.ok');
    ok.addEventListener('click', generateImage);

    app.append(form);
}

function render() {
    if (image || upload) {
        renderForm();
    } else {
        renderGallery();
    }
}

render();