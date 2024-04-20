const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

function start() {
  addEvents();
}

function update() {
  addEvents();
  updateTotal();
  updateCartNumber();
}
function addEvents() {
  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  console.log(cartRemove_btns);
  cartRemove_btns.forEach((btn) => {
    btn.addEventListener("click", handle_removeCartItem);
  });

  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
    input.addEventListener("change", handle_changeItemQuantity);
  });

  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
    btn.addEventListener("click", handle_addCartItem);
  });

  const buy_btn = document.querySelector(".btn-buy");
  buy_btn.addEventListener("click", handle_buyOrder);
}

let itemsAdded = [1];

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerHTML;
  let price = product.querySelector(".product-price").innerHTML;
  let imgSrc = product.querySelector(".product-img").src;
  console.log(title, price, imgSrc);

  let newToAdd = {
    title,
    price,
  };

  if (itemsAdded.find((el) => el.title == newToAdd.title)) {
    alert("This Item Is Already Exist!");
    return;
  } else {
    itemsAdded.push(newToAdd);
  }

  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  update();
}
function handle_removeCartItem() {
  this.parentElement.remove();
  itemsAdded = itemsAdded.filter(
    (el) =>
      el.title !=
      this.parentElement.querySelector(".cart-product-title").innerHTML
  );

  update();
}

function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value);

  update();
}
function handle_buyOrder() {
  if (itemsAdded.length <= 0) {
    alert("There is No Order to Place Yet! \nPlease Make an Order first.");
    return;
  }
  const cartContent = cart.querySelector(".cart-content");
  cartContent.innerHTML = "";
  alert("Your Order is Placed Successfully :)");
  itemsAdded = [];

  update();
}
function updateTotal() {
  let cartBoxes = document.querySelectorAll(".cart-box");
  const totalElement = cart.querySelector(".total-price");
  let total = 0;
  cartBoxes.forEach((cartBox) => {
    let priceElement = cartBox.querySelector(".cart-price");
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantity = cartBox.querySelector(".cart-quantity").value;
    total += price * quantity;
  });

    total = total.toFixed(2);

  totalElement.innerHTML = "$" + total;
}

function updateCartNumber() {
  const cartIcon = document.querySelector("#cart-icon");
  const cartNumber = document.querySelector(".cart-number");
  cartNumber.textContent = itemsAdded.length;
}

function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <img src=${imgSrc} alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}

function search() {
    let filter = document.getElementById('find').value.toUpperCase();
    let item = document.querySelectorAll('.product');
    let l = document.getElementsByTagName('h3');
    for (var i = 0; i <= l.length; i++) {
        let a = item[i].getElementsByTagName('h3')[0];
        let value = a.innerHTML || a.innerText || a.textContent;
        if (value.toUpperCase().indexOf(filter) > -1) {
            item[i].style.display = "";
        }
        else {
            item[i].style.display = "none";
        }
    }
}


const firebaseConfig = {         
    storageBucket: "uploadimagetask.appspot.com",   
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const inp = document.querySelector(".inp");
const progressbar = document.querySelector(".progress");
const img = document.querySelector(".img");
const body = document.querySelector("body");
const metaData = document.querySelector(".metaData");
const images = document.querySelector(".images");
const loading = document.querySelector(".loading");
const imageUpload = document.querySelector(".imageUpload");
const completeMsg = document.querySelector(".completeMsg");
let file;
let files;
let fileName;
let progress;
let uploadedFileName;
const selectImage = () => {
    inp.click();
};
const getImageData = (e) => {
    files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        let imageData = document.createElement("span");
        imageData.className = 'filedata';
        imageData.style.display = 'block';
        imageData.innerHTML = files[i].name;
        metaData.appendChild(imageData);
    }
};

const uploadImage = async () => {
    for (let i = 0; i < files.length; i++) {
        let url = await uploadProcess(files[i], Math.round(Math.random() * 9999) + files[i].name);
        if (url) {
            loading.style.display = 'none';
            let image = document.createElement("img");
            image.style.display = 'block';
            image.setAttribute('src', url);
            image.className = 'img';
            images.appendChild(image);
        }
        if (i === files.length - 1) {
            completeMsg.innerHTML = `${files.length} files uploaded successfully`;
        }
    }
};

const uploadProcess = (file, fileName) => {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref().child("myimages");
        const folderRef = storageRef.child(fileName);
        const uploadtask = folderRef.put(file);
        uploadtask.on(
            "state_changed",
            (snapshot) => {
                loading.style.display = 'block';
                progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progress = Math.round(progress);
                progressbar.style.width = progress + "%";
                progressbar.innerHTML = progress + "%";
                uploadedFileName = snapshot.ref.name;
            },
            (error) => {
                reject(error);
            },
            () => {
                storage
                    .ref("myimages")
                    .child(uploadedFileName)
                    .getDownloadURL()
                    .then((url) => {
                        console.log("URL", url);
                        resolve(url);
                    });
            }
        );
    });
};
