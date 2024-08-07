const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("modal")
const cartItens = document.getElementById("cart-itens")
const cartTotal = document.getElementById("total")
const cartFinalizarBtn = document.getElementById("finalizar")
const cartFecharBtn = document.getElementById("fechar")
const cartCount = document.getElementById("cart-count")
const adressInput = document.getElementById("address")
const adressWarn = document.getElementById("address-warn")

let cart = []

// Abrir modal
cartBtn.addEventListener("click", function () {
    updateCart();
    cartModal.style.display = "flex"
})
// Fechar modal clicando fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
//Btn Fechar Modal
cartFecharBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

//Adicionar carrinho
menu.addEventListener("click", function (event) {
    //Pegar os itens
    let btnAdd = event.target.closest(".add-to-cart-btn")
    if (btnAdd) {
        let name = btnAdd.getAttribute("data-name")
        let price = parseFloat(btnAdd.getAttribute("data-price"))
        addCart(name, price)
    }
})
//Função adicionar carrinho
function addCart(name, price) {
    //Verificar se á itens iguais 
    const itemIgual = cart.find(item => item.name === name)
    if (itemIgual) {
        itemIgual.quantity += 1
    }
    else {
        cart.push({
            name,
            price,
            quantity: 1
        }
        )
    };
    updateCart();
}

//Atualizar o carrinho
function updateCart() {
    cartItens.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartCreateItens = document.createElement("div");
        cartCreateItens.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartCreateItens.innerHTML = `
        <div class="flex justify-between items-center mt-4">
            <div>
                <h1 class="font-bold text-[20px]">${item.name}</h1>
                <p class="font-medium text-[17px]">R$:${item.price.toFixed(2)}</p>
                <p class="mt-1">(Quantidade:${item.quantity})</p>
            </div>
            <button class="font-medium remove-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity
        cartItens.appendChild(cartCreateItens)
    });
    //Formatando e mostrando o Total

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    //Mudando Contador do carrinho
    cartCount.innerHTML = cart.length
}

//Removendo item carrinho
cartItens.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const removeNameItem = event.target.getAttribute("data-name")
        removeItemCart(removeNameItem)
    }
})
//Função que Remove
function removeItemCart(name) {
    //percorre os index dos itens
    const index = cart.findIndex(item => item.name === name)
    //se encontrar um nome igual ao do botão de remover
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
            return;
        }
        cart.splice(index, 1);
        updateCart();
    }
}
//Verifica se há texto no input Adress
adressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        adressWarn.classList.add("hidden");
        adressInput.classList.remove("border-red-600");
    }
})

cartFinalizarBtn.addEventListener("click", function () {
    //Dá o Aviso loja fechada
    const isOpen = storeOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops a loja está fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }

    //Dá o Aviso de Adress vazio
    if (cart.length === 0) return;
    if (adressInput.value === "") {
        adressWarn.classList.remove("hidden");
        adressInput.classList.add("border-red-600");
        return;
    }


    //Enviar via WhatsApp
    const cartItems = cart.map((item) => {
        return (
         `${item.name} (Quantidade:${item.quantity}) Preço: ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "43999164473"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank")

    cart = [];
    updateCart();
})
//Verifica se está em horario de funcionamento
function storeOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 7 && hora < 19;
}

const dateSpan = document.getElementById("date-span")
const horaNow = storeOpen()

if (horaNow) {
    dateSpan.classList.remove("bg-red-500")
    dateSpan.classList.add("bg-green-500")
}
else {
    dateSpan.classList.remove("bg-green-500")
    dateSpan.classList.add("bg-red-500")
}
