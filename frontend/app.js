const API_URL = "http://localhost:3000/products";

const form = document.getElementById("productForm");
const list = document.getElementById("productList");
const message = document.getElementById("message");
const title = document.getElementById("formTitle");
const save = document.getElementById("saveButton");
const cancel = document.getElementById("cancelEdit");

let editingId = null;

// GET: Display all products
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Could not load products");

        const products = await res.json();
        list.replaceChildren();

        products.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";

            const details = document.createElement("p");
            details.textContent =
                `${p.product_name} | ${p.brand} | ${p.category} | Price: ${p.price} | Stock: ${p.stock_quantity} | ${p.description || ""}`;

            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.className = "edit-button";
            edit.onclick = () => {
                editingId = p.id;
                ["product_name", "brand", "category", "price",
                 "stock_quantity", "description"].forEach(key => {
                    document.getElementById(key).value = p[key] ?? "";
                });
                title.textContent = "Edit Product";
                save.textContent = "Update Product";
                cancel.hidden = false;
            };

            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "delete-button";
            del.onclick = async () => {
                if (confirm("Delete this product?")) {
                    const r = await fetch(`${API_URL}/${p.id}`, {
                        method: "DELETE"
                    });
                    if (r.ok) {
                        message.textContent = "Product deleted.";
                        loadProducts();
                    } else {
                        message.textContent = "Delete failed.";
                    }
                }
            };

            card.append(details, edit, del);
            list.appendChild(card);
        });

        if (!products.length) list.textContent = "No products found.";
    } catch (err) {
        message.textContent = "Cannot connect to the backend.";
    }
}

// POST: Add product | PUT: Update product
form.addEventListener("submit", async e => {
    e.preventDefault();

    const product = {};
    ["product_name", "brand", "category", "price",
     "stock_quantity", "description"].forEach(key => {
        product[key] = document.getElementById(key).value.trim();
    });

    product.price = Number(product.price);
    product.stock_quantity = Number(product.stock_quantity);

    try {
        const res = await fetch(
            editingId ? `${API_URL}/${editingId}` : API_URL,
            {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            }
        );

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Save failed");

        message.textContent = editingId
            ? "Product updated successfully."
            : "Product added successfully.";

        form.reset();
        editingId = null;
        title.textContent = "Add a New Product";
        save.textContent = "Save Product";
        cancel.hidden = true;
        loadProducts();
    } catch (err) {
        message.textContent = err.message;
    }
});

// Cancel editing
cancel.onclick = () => {
    form.reset();
    editingId = null;
    title.textContent = "Add a New Product";
    save.textContent = "Save Product";
    cancel.hidden = true;
};

// Refresh list
document.getElementById("refreshBtn").onclick = loadProducts;

// Load products when the page opens
loadProducts();